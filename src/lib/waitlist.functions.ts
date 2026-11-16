import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const input = z.object({
  email: z.string().trim().email().max(254),
  chapter: z.string().max(80).optional(),
  comments: z.string().trim().max(1000).optional(),
  contactName: z.string().trim().max(120).optional(),
  organization: z.string().trim().max(160).optional(),
  roleTitle: z.string().trim().max(120).optional(),
  teamSize: z.string().trim().max(40).optional(),
});

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }) => {
    const sb = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      {
        auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      },
    );
    const email = data.email.toLowerCase();
    const { error } = await sb.from("waitlist_signups").insert({
      email,
      chapter: data.chapter ?? null,
      comments: data.comments || null,
      contact_name: data.contactName || null,
      organization: data.organization || null,
      role_title: data.roleTitle || null,
      team_size: data.teamSize || null,
    });
    if (error && error.code !== "23505") throw new Error("Could not save signup");
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("new-inquiry", "liv@goodchaptercollective.com", {
        templateData: {
          email,
          inquiry: data.chapter,
          comments: data.comments,
          contactName: data.contactName,
          organization: data.organization,
          roleTitle: data.roleTitle,
          teamSize: data.teamSize,
        },
        idempotencyKey: `new-inquiry-${email}-${Date.now()}`,
        replyTo: email,
      });
    } catch (e) {
      console.error("Inquiry email failed", e);
    }
    return { ok: true };
  });
