import { z } from "zod";

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value ?? "");

export const rsvpSchema = z
  .object({
    inviteCode: z
      .string()
      .trim()
      .min(3, "Please enter your invitation code.")
      .max(40, "Invitation code is too long.")
      .transform((value) => value.toUpperCase()),
    fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
    attendance: z.enum(["yes", "no"], {
      error: "Please select whether you can attend.",
    }),
    guestCount: z.preprocess(
      (value) => (typeof value === "string" ? Number(value) : value),
      z
        .number({
          error: "Guest count must be a number.",
        })
        .int("Guest count must be a whole number.")
        .min(0, "Guest count cannot be negative.")
        .max(10, "Guest count seems too high for this form.")
    ),
    additionalGuestNames: z
      .array(z.string().trim().min(2, "Please enter each additional guest name.").max(120))
      .optional()
      .default([]),
    dietaryNotes: optionalTrimmedString(500),
    website: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.attendance === "yes" && data.guestCount < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["guestCount"],
        message: "If attending, guest count must be at least 1.",
      });
    }

    if (data.attendance === "no" && data.guestCount !== 0) {
      ctx.addIssue({
        code: "custom",
        path: ["guestCount"],
        message: "If not attending, guest count must be 0.",
      });
    }

    const expectedAdditionalGuests = data.attendance === "yes" ? Math.max(0, data.guestCount - 1) : 0;
    if (data.additionalGuestNames.length !== expectedAdditionalGuests) {
      ctx.addIssue({
        code: "custom",
        path: ["additionalGuestNames"],
        message: `Please provide ${expectedAdditionalGuests} additional guest name(s).`,
      });
    }
  });

export type RsvpInput = z.infer<typeof rsvpSchema>;
