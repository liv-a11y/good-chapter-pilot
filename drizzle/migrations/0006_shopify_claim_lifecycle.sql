ALTER TABLE public.chapter_claims
  ADD COLUMN state text NOT NULL DEFAULT 'reserved'
    CHECK (state IN ('reserved', 'creating', 'checkout', 'paid')),
  ADD COLUMN checkout_url text,
  ADD COLUMN shopify_variant text,
  ADD COLUMN order_id text;

ALTER TABLE public.chapter_guests
  ADD COLUMN is_revoked boolean NOT NULL DEFAULT false,
  ADD COLUMN invite_attempted_at timestamptz;

CREATE TABLE public.released_claims (
  id uuid PRIMARY KEY,
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.chapter_items(id) ON DELETE CASCADE,
  shopify_variant text,
  order_id text,
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 500),
  released_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.payment_conflicts (
  order_id text NOT NULL,
  claim_id text NOT NULL,
  quantity int NOT NULL,
  PRIMARY KEY (order_id, claim_id)
);

ALTER TABLE public.released_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_conflicts ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.released_claims, public.payment_conflicts TO service_role;

CREATE OR REPLACE FUNCTION public.reserve_good_chapter_invites(p_chapter_id uuid, p_guest_ids uuid[])
RETURNS TABLE (id uuid, guest_token text, invite_attempted_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  available_count integer;
BEGIN
  IF cardinality(p_guest_ids) IS NULL OR cardinality(p_guest_ids) = 0 THEN
    RETURN;
  END IF;

  PERFORM 1
  FROM public.chapter_guests
  WHERE chapter_guests.chapter_id = p_chapter_id
    AND chapter_guests.id = ANY(p_guest_ids)
  ORDER BY chapter_guests.id
  FOR UPDATE;

  SELECT count(*) INTO available_count
  FROM public.chapter_guests
  WHERE chapter_guests.chapter_id = p_chapter_id
    AND chapter_guests.id = ANY(p_guest_ids)
    AND chapter_guests.is_revoked = false
    AND chapter_guests.invite_attempted_at IS NULL;

  IF available_count <> cardinality(p_guest_ids) THEN
    RETURN;
  END IF;

  RETURN QUERY
  UPDATE public.chapter_guests
  SET invite_attempted_at = now()
  WHERE chapter_guests.chapter_id = p_chapter_id
    AND chapter_guests.id = ANY(p_guest_ids)
  RETURNING chapter_guests.id, chapter_guests.guest_token, chapter_guests.invite_attempted_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_good_chapter_item(
  p_guest_token text,
  p_item_id uuid,
  p_display_name text
)
RETURNS TABLE (claim_id uuid, claim_state text, display_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  guest_row public.chapter_guests%ROWTYPE;
  chapter_row public.chapters%ROWTYPE;
  item_row public.chapter_items%ROWTYPE;
  new_claim public.chapter_claims%ROWTYPE;
BEGIN
  IF char_length(p_display_name) > 60 THEN
    RETURN;
  END IF;

  SELECT * INTO guest_row
  FROM public.chapter_guests
  WHERE guest_token = p_guest_token AND is_revoked = false;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT * INTO chapter_row
  FROM public.chapters
  WHERE id = guest_row.chapter_id
  FOR UPDATE;
  IF NOT FOUND OR chapter_row.state <> 'sent_to_guests' OR chapter_row.person_decision <> 'accepted' THEN
    RETURN;
  END IF;

  SELECT * INTO item_row
  FROM public.chapter_items
  WHERE id = p_item_id AND chapter_id = chapter_row.id
  FOR UPDATE;
  IF NOT FOUND OR item_row.status NOT IN ('approved', 'given') THEN
    RETURN;
  END IF;

  INSERT INTO public.chapter_claims (chapter_id, item_id, guest_id, display_name)
  VALUES (chapter_row.id, item_row.id, guest_row.id, trim(p_display_name))
  ON CONFLICT (item_id) DO NOTHING
  RETURNING * INTO new_claim;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  RETURN QUERY SELECT new_claim.id, new_claim.state, new_claim.display_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_good_chapter_item(p_person_token text, p_item_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  chapter_row public.chapters%ROWTYPE;
  item_row public.chapter_items%ROWTYPE;
BEGIN
  SELECT * INTO chapter_row
  FROM public.chapters
  WHERE person_token = p_person_token
  FOR UPDATE;
  IF NOT FOUND OR chapter_row.person_decision <> 'accepted' OR chapter_row.state <> 'sent_to_guests' THEN
    RETURN false;
  END IF;

  SELECT * INTO item_row
  FROM public.chapter_items
  WHERE id = p_item_id AND chapter_id = chapter_row.id
  FOR UPDATE;
  IF NOT FOUND OR item_row.status <> 'approved' THEN
    RETURN false;
  END IF;

  IF EXISTS (SELECT 1 FROM public.chapter_claims WHERE item_id = item_row.id) THEN
    RETURN false;
  END IF;

  UPDATE public.chapter_items SET status = 'declined' WHERE id = item_row.id;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_good_chapter_claim(p_claim_id uuid, p_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  active_claim public.chapter_claims%ROWTYPE;
BEGIN
  IF p_reason IS NULL OR char_length(trim(p_reason)) NOT BETWEEN 1 AND 500 THEN
    RAISE EXCEPTION 'A reconciliation note between 1 and 500 characters is required.';
  END IF;

  SELECT * INTO active_claim
  FROM public.chapter_claims
  WHERE id = p_claim_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  INSERT INTO public.released_claims (id, chapter_id, item_id, shopify_variant, order_id, reason)
  VALUES (
    active_claim.id,
    active_claim.chapter_id,
    active_claim.item_id,
    active_claim.shopify_variant,
    active_claim.order_id,
    trim(p_reason)
  );
  DELETE FROM public.chapter_claims WHERE id = active_claim.id;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_good_chapter_paid_order(
  p_order_id text,
  p_lines jsonb,
  p_order_valid boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  paid_line record;
  active_claim public.chapter_claims%ROWTYPE;
  released_claim public.released_claims%ROWTYPE;
  expected_variant text;
BEGIN
  FOR paid_line IN
    SELECT * FROM jsonb_to_recordset(coalesce(p_lines, '[]'::jsonb))
      AS line(claim_id text, variant_id text, quantity int)
  LOOP
    IF paid_line.claim_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      OR paid_line.variant_id !~ '^[0-9]+$'
      OR paid_line.quantity < 1 THEN
      CONTINUE;
    END IF;

    expected_variant := 'gid://shopify/ProductVariant/' || paid_line.variant_id;
    SELECT * INTO active_claim
    FROM public.chapter_claims
    WHERE id = paid_line.claim_id::uuid
    FOR UPDATE;

    IF FOUND THEN
      IF active_claim.shopify_variant IS DISTINCT FROM expected_variant THEN
        CONTINUE;
      END IF;

      IF NOT p_order_valid OR paid_line.quantity <> 1 THEN
        INSERT INTO public.payment_conflicts (order_id, claim_id, quantity)
        VALUES (p_order_id, paid_line.claim_id, paid_line.quantity)
        ON CONFLICT (order_id, claim_id) DO NOTHING;
      ELSIF active_claim.state = 'paid' THEN
        IF active_claim.order_id IS DISTINCT FROM p_order_id THEN
          INSERT INTO public.payment_conflicts (order_id, claim_id, quantity)
          VALUES (p_order_id, paid_line.claim_id, paid_line.quantity)
          ON CONFLICT (order_id, claim_id) DO NOTHING;
        END IF;
      ELSIF active_claim.state IN ('creating', 'checkout') THEN
        UPDATE public.chapter_claims
        SET state = 'paid', order_id = p_order_id, checkout_url = NULL
        WHERE id = active_claim.id;
      ELSE
        INSERT INTO public.payment_conflicts (order_id, claim_id, quantity)
        VALUES (p_order_id, paid_line.claim_id, paid_line.quantity)
        ON CONFLICT (order_id, claim_id) DO NOTHING;
      END IF;
    ELSE
      SELECT * INTO released_claim
      FROM public.released_claims
      WHERE id = paid_line.claim_id::uuid;

      IF FOUND
        AND released_claim.shopify_variant = expected_variant
        AND released_claim.order_id IS DISTINCT FROM p_order_id THEN
        INSERT INTO public.payment_conflicts (order_id, claim_id, quantity)
        VALUES (p_order_id, paid_line.claim_id, paid_line.quantity)
        ON CONFLICT (order_id, claim_id) DO NOTHING;
      END IF;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.release_good_chapter_claim(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_good_chapter_paid_order(text, jsonb, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_good_chapter_item(text, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.remove_good_chapter_item(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reserve_good_chapter_invites(uuid, uuid[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_good_chapter_claim(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_good_chapter_paid_order(text, jsonb, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_good_chapter_item(text, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.remove_good_chapter_item(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reserve_good_chapter_invites(uuid, uuid[]) TO service_role;
