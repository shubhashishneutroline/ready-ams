import { z } from "zod";
import { Showon, TargetAudience, ExpirationDuration } from "../types/types";

// Zod schema for AnnouncementOrOffer
export const announcementOrOfferSchema = z.object({
    title: z.string().min(3, "Title is required and should be at least 3 characters long"),
    description: z.string().optional(),
    message: z.string().optional(),
    audience: z.nativeEnum(TargetAudience),
    isImmediate: z.boolean(),
    scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Scheduled date must be a valid ISO date string",
    }),
    showOn: z.nativeEnum(Showon),
    expiredAt: z.nativeEnum(ExpirationDuration),
  });
  