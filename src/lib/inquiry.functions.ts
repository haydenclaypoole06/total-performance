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
