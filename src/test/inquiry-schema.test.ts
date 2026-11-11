import { describe, expect, it } from "vitest";

import { inquirySchema } from "@/lib/inquiry-schema";

const valid = {
  name: "Alex Driver",
  email: "alex@example.com",
  vehicle: "2015 Chevrolet Corvette Z06",
  request: "Talk through a camshaft upgrade.",
};

describe("project inquiry form rules", () => {
  it("accepts the four required fields alone", () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it.each(["name", "email", "vehicle", "request"] as const)("requires %s", (field) => {
    const result = inquirySchema.safeParse({ ...valid, [field]: "   " });
    expect(result.success).toBe(false);
  });

  it("leaves phone, modifications, budget and timeframe optional", () => {
    const result = inquirySchema.safeParse({ ...valid, phone: "", budget: "", timeframe: "", currentModifications: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone).toBeUndefined();
  });

  it("rejects an invalid email", () => {
    expect(inquirySchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });
});
