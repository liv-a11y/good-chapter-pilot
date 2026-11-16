ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS person_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS accept_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS decline_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS person_decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS story_line text;
UPDATE public.chapters SET person_token = 'maya-private-review-accepted' WHERE id = '11111111-1111-4111-8111-111111111111';
INSERT INTO public.chapters (id, title, starter_name, chapter_type, state, person_decision, person_token, accept_token, decline_token, story_line)
VALUES ('22222222-2222-4222-8222-222222222222', 'Maya', 'Jess', 'First Place', 'with_person_items', 'pending', 'maya-private-review-sample', 'maya-sample-accept-letter', 'maya-sample-return-letter', 'A first place, and eight things to fill it.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.chapter_items (chapter_id, position, name, photo_url, price, source, source_url, why, status)
SELECT '22222222-2222-4222-8222-222222222222', position, name, photo_url, price, source, source_url, why, 'proposed'
FROM public.chapter_items WHERE chapter_id = '11111111-1111-4111-8111-111111111111';