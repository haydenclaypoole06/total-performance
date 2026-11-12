import { createServerFn } from "@tanstack/react-start";

import { inquirySchema } from "./inquiry-schema";

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: string };

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }): Promise<InquiryResult> => {
    // Silently ignore submissions that fill the hidden spam field.
    if (data.company) return { ok: true };

    try {
      // Load Cloudflare bindings only inside the server-side handler.
      const { env } = await import("cloudflare:workers");
      const result = await env.DB.prepare(
        `INSERT INTO project_inquiries (
          name,
          email,
          phone,
          vehicle,
          current_modifications,
          request,
          budget,
          timeframe
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          data.name,
          data.email,
          data.phone || null,
          data.vehicle,
          data.currentModifications || null,
          data.request,
          data.budget || null,
          data.timeframe || null,
        )
        .run();

            if (!result.success) {
        throw new Error("D1 insert was unsuccessful");
      }

      // The inquiry is already saved in D1.
      // Email failure must not make the customer resubmit it.
      try {
        const resendKey = (
          env as unknown as { RESEND_API_KEY?: string }
        ).RESEND_API_KEY;

        if (!resendKey) {
          throw new Error("RESEND_API_KEY is not configured");
        }

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Total Performance <onboarding@resend.dev>",
            to: ["txtotalperformance@gmail.com"],
            reply_to: data.email,
            subject: "New Total Performance inquiry",
            text: [
              "A new inquiry has been saved in Cloudflare D1.",
              "",
              `Name: ${data.name}`,
              `Email: ${data.email}`,
              `Phone: ${data.phone || "Not provided"}`,
              `Vehicle: ${data.vehicle}`,
              "",
              "Request:",
              data.request,
              "",
              `Current modifications: ${data.currentModifications || "Not provided"}`,
              `Budget: ${data.budget || "Not provided"}`,
              `Timeframe: ${data.timeframe || "Not provided"}`,
            ].join("\n"),
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          // Avoid logging credentials or customer details.
          throw new Error(`Resend returned HTTP ${response.status}`);
        }
      } catch (emailError) {
        console.error(
          "Inquiry saved, but email notification failed:",
          emailError instanceof Error
            ? emailError.message
            : "Unknown email error",
        );
      }

      return { ok: true };
    } catch (error) {
      console.error(
        "Inquiry save failed:",
        error instanceof Error ? error.message : "Unknown error",
      );

      return {
        ok: false,
        error:
          "We couldn’t send your inquiry. Your details are still here — please try again.",
      };
    }
  });
