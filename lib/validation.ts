import { z } from "zod";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// SVG is intentionally excluded: it is an executable document, and serving one
// from our own origin is a stored-XSS vector. News thumbnails are photos.
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(1, "Please select a category"),
  image: z
    .instanceof(File, { message: "Please upload an image" })
    .refine((file) => file.size > 0, "Please upload an image")
    .refine((file) => file.size <= MAX_IMAGE_BYTES, "Image must be 5MB or smaller")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Image must be a jpg, png, gif, or webp",
    ),
  pitch: z.string().min(10),
});

export const categorySchema = z.object({
  title: z.string().min(2).max(40),
  description: z.string().max(200).optional(),
});
