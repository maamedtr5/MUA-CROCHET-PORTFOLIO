import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { name, email, message, extra_fields = {}, website } = payload as {
    name?: string;
    email?: string;
    message?: string;
    extra_fields?: Record<string, unknown>;
    website?: string; // honeypot field: real users leave it empty
  };

  // Bots fill hidden fields; pretend success and do nothing
  if (website) return json({ ok: true });

  if (!name || !email || !message) {
    return json({ error: "Name, email and message are required" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email" }, 400);
  }
  if (message.length > 5000) {
    return json({ error: "Message too long" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Basic rate limit: max 3 submissions per email per 10 minutes
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);
  if ((count ?? 0) >= 3) {
    return json({ error: "Too many messages, please try again later" }, 429);
  }

  const { data: row, error: insertError } = await supabase
    .from("contact_submissions")
    .insert({ name, email, message, extra_fields })
    .select("id")
    .single();
  if (insertError) {
    console.error(insertError);
    return json({ error: "Could not save your message" }, 500);
  }

  const extras = Object.entries(extra_fields)
    .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</p>`)
    .join("");

  // Brevo transactional email. Secrets (supabase secrets set ...):
  //   BREVO_API_KEY       - Brevo > SMTP & API > API Keys
  //   CONTACT_TO_EMAIL    - the inbox she reads (can be her Gmail)
  //   CONTACT_FROM_EMAIL  - a sender verified in Brevo (can be the same Gmail)
  const apiKey = Deno.env.get("BREVO_API_KEY");
  const toEmail = Deno.env.get("CONTACT_TO_EMAIL");
  const fromEmail = Deno.env.get("CONTACT_FROM_EMAIL") ?? toEmail;

  let emailedOk = false;
  let emailError: string | null = null;

  if (!apiKey) {
    emailError = "BREVO_API_KEY secret is not set";
  } else if (!toEmail) {
    emailError = "CONTACT_TO_EMAIL secret is not set";
  } else {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Adorn website", email: fromEmail },
          to: [{ email: toEmail }],
          replyTo: { email, name },
          subject: `New portfolio message from ${name}`,
          htmlContent: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             ${extras}
             <p><strong>Message:</strong></p>
             <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
        }),
      });
      emailedOk = res.ok;
      if (!res.ok) {
        emailError = `Brevo ${res.status}: ${(await res.text()).slice(0, 400)}`;
      }
    } catch (err) {
      emailError = `Could not reach Brevo: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  if (emailError) console.error("Email not sent:", emailError);

  await supabase
    .from("contact_submissions")
    .update({ emailed_ok: emailedOk, email_error: emailError })
    .eq("id", row.id);

  // The message is saved either way, so tell the visitor it went through
  return json({ ok: true, emailed: emailedOk });
});
