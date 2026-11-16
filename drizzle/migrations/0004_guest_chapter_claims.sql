CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  starter_name text NOT NULL DEFAULT 'A friend',
  chapter_type text NOT NULL DEFAULT 'A new chapter',
  state text NOT NULL DEFAULT 'draft',
  person_decision text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.chapter_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  name text NOT NULL,
  photo_url text,
  price int,
  source text,
  source_url text,
  why text,
  status text NOT NULL DEFAULT 'approved'
);
CREATE TABLE public.chapter_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  guest_token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.chapter_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  item_id uuid NOT NULL UNIQUE REFERENCES public.chapter_items(id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES public.chapter_guests(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '' CHECK (char_length(display_name) <= 60),
  claimed_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.chapters, public.chapter_items, public.chapter_guests, public.chapter_claims TO service_role;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_claims ENABLE ROW LEVEL SECURITY;

WITH c AS (
  INSERT INTO public.chapters (id, title, starter_name, chapter_type, state, person_decision)
  VALUES ('11111111-1111-4111-8111-111111111111', 'Maya', 'Jess', 'First Place', 'sent_to_guests', 'accepted') RETURNING id
)
INSERT INTO public.chapter_guests (chapter_id, guest_token)
SELECT id, t FROM c, unnest(ARRAY['maya-sample-guest-one','maya-sample-guest-two','maya-sample-guest-three']) t;

INSERT INTO public.chapter_items (chapter_id, position, name, photo_url, price, source, why) VALUES
('11111111-1111-4111-8111-111111111111',1,'Terracotta candle','/__l5e/assets-v1/752a5b61-7a79-4a4f-96bc-2b24294d8bf6/terracotta-candle-600.webp',34,'Good Chapter shop','For the first quiet night when the boxes are still everywhere.'),
('11111111-1111-4111-8111-111111111111',2,'Cobalt mug','/__l5e/assets-v1/4cb01318-9343-4da9-b463-45961d2d2b5b/cobalt-mug-600.webp',38,'Good Chapter shop','The heavy mug that quietly becomes the only one.'),
('11111111-1111-4111-8111-111111111111',3,'Potted houseplant','/__l5e/assets-v1/9d405c3e-539f-4ef6-8144-5642d55bf632/houseplant-600.webp',45,'Good Chapter shop','Something alive in the empty room.'),
('11111111-1111-4111-8111-111111111111',4,'Cast iron skillet','/__l5e/assets-v1/902b6d8b-7b59-4972-9241-d71681dd27f1/cast-iron-pan-600.webp',65,'Good Chapter shop','One pan that outlives every apartment after this one.'),
('11111111-1111-4111-8111-111111111111',5,'Citron kettle','/__l5e/assets-v1/49097262-3e0e-43fc-94ad-249c9490a26d/bright-citron-kettle-600.webp',75,'Good Chapter shop','Because boiling water should feel like a small win.'),
('11111111-1111-4111-8111-111111111111',6,'Bath towel set','/__l5e/assets-v1/fae5f293-3863-478a-8c85-7d458ea94ffa/cream-bath-towels-600.webp',96,'Good Chapter shop','To retire the frayed towels from the last place.'),
('11111111-1111-4111-8111-111111111111',7,'Cobalt toolbox','/__l5e/assets-v1/d5590db8-fbf1-4777-9f77-84712f3c2164/cobalt-toolbox-600.webp',140,'Good Chapter shop','For the shelf, the loose handle, and the next small fix.'),
('11111111-1111-4111-8111-111111111111',8,'Cobalt table lamp','/__l5e/assets-v1/0890e952-2b14-48c0-972a-5b879bb9e9de/cobalt-table-lamp-600.webp',240,'Good Chapter shop','Good light for the first night in.');