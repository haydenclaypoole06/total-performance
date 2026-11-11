import { z } from "zod";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, { message: `${label} must be ${max} characters or fewer` })
    .optional()
    .transform((v) => (v ? v : undefined));

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter your name" })
    .max(100, { message: "Name must be 100 characters or fewer" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be 255 characters or fewer" }),
  phone: optionalText(40, "Phone").refine((v) => !v || /^[0-9+().\-\s]{7,40}$/.test(v), {
    message: "Please enter a valid phone number",
  }),
  vehicle: z
    .string()
    .trim()
    .min(1, { message: "Please enter the year, make and model" })
    .max(150, { message: "Vehicle must be 150 characters or fewer" }),
  currentModifications: optionalText(2000, "Current modifications"),
  request: z
    .string()
    .trim()
    .min(1, { message: "Tell us what you’d like done" })
    .max(3000, { message: "Please keep this under 3000 characters" }),
  budget: optionalText(100, "Budget"),
  timeframe: optionalText(100, "Timeframe"),
  /** Honeypot: real visitors never see or fill this. */
  company: z.string().max(0).optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryData = z.output<typeof inquirySchema>;
