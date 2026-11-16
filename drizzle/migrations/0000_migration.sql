CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  chapter text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT waitlist_chapter_len CHECK (chapter IS NULL OR char_length(chapter) <= 80)
);
CREATE UNIQUE INDEX waitlist_signups_email_key ON public.waitlist_signups (lower(email));
GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the waitlist" ON public.waitlist_signups
  FOR INSERT TO anon, authenticated WITH CHECK (true);