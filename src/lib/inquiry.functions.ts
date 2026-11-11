import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { inquirySchema } from "./inquiry-schema";

export type InquiryResult = { ok: true } | { ok: false; error: string };

/**
 * Public endpoint: stores one project inquiry. Uses the publishable key with an
 * insert-only policy, so visitors can never read submissions back.
 */
export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }): Promise<InquiryResult> => {
    // Honeypot filled: accept silently without storing.
    if (data.company) return { ok: true };

    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) {
      console.error("Inquiry submission: backend not configured");
      return { ok: false, error: "Inquiries can’t be received right now. Please try again later." };
    }

    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await client.from("project_inquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      vehicle: data.vehicle,
      current_modifications: data.currentModifications ?? null,
      request: data.request,
      budget: data.budget ?? null,
      timeframe: data.timeframe ?? null,
    });

    if (error) {
      console.error("Inquiry insert failed", error.message);
      return {
        ok: false,
        error: "We couldn’t send your inquiry. Your details are still here — please try again.",
      };
    }
    return { ok: true };
  });
