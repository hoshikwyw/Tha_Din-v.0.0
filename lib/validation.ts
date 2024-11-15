import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .url()
    .transform(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");

        if (!contentType?.startsWith("image/")) {
          throw new Error("URL does not point to an image");
        }
        return url;
      } catch {
        throw new Error("Invalid URL or not an image URL");
      }
    }),
  pitch: z.string().min(10),
});
