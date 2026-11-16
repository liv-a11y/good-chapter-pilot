DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist_signups;
CREATE POLICY "Anyone can join the waitlist with valid details"
ON public.waitlist_signups FOR INSERT TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 255
  AND (chapter IS NULL OR length(chapter) <= 120)
  AND (comments IS NULL OR length(comments) <= 2000)
  AND (contact_name IS NULL OR length(contact_name) <= 120)
  AND (organization IS NULL OR length(organization) <= 160)
  AND (role_title IS NULL OR length(role_title) <= 120)
  AND (team_size IS NULL OR length(team_size) <= 40)
);