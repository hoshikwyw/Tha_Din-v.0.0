"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { parseServerActionResponse } from "./utils";
import { requireAdmin } from "./admin";
import { categorySchema, formSchema } from "./validation";
import { writeClient } from "@/sanity/lib/write-client";

export type ActionResponse = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  /** Present only on a successful create — the new document id. */
  _id?: string;
};

const UNAUTHORIZED = {
  // Deliberately identical for "not signed in" and "signed in but not an admin",
  // so the response can't be used to probe who holds admin.
  error: "You are not allowed to perform this action",
  status: "ERROR" as const,
};

/** Turn a ZodError into the single message most useful to the user. */
const firstZodMessage = (error: z.ZodError) =>
  error.errors[0]?.message ?? "Please check your inputs and try again";

export const createPitch = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  form: FormData,
  pitch: string,
): Promise<ActionResponse> => {
  const session = await requireAdmin();
  if (!session) return parseServerActionResponse(UNAUTHORIZED);

  // Re-validate on the server. The client-side check in the form is a UX
  // affordance only — a server action is a public HTTP endpoint and can be
  // called directly with any payload.
  let values;
  try {
    values = await formSchema.parseAsync({
      title: form.get("title"),
      description: form.get("description"),
      category: form.get("category"),
      image: form.get("image"),
      pitch,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return parseServerActionResponse({
        error: firstZodMessage(error),
        status: "ERROR",
      });
    }
    throw error;
  }

  const slug = slugify(values.title, { lower: true, strict: true });

  try {
    const imageAsset = await writeClient.assets.upload("image", values.image, {
      filename: values.image.name,
    });

    const result = await writeClient.create({
      _type: "news",
      title: values.title,
      description: values.description,
      views: 0,
      category: { _type: "reference", _ref: values.category },
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
      slug: { _type: "slug", current: slug },
      author: { _type: "reference", _ref: session.id },
      pitch: values.pitch,
    });

    // Publish immediately instead of waiting out the revalidate window.
    revalidatePath("/");
    revalidatePath(`/user/${session.id}`);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    // Log the real error server-side; never serialise it to the client, it can
    // carry the Sanity project id, dataset, and token-scope details.
    console.error("[createPitch] failed", error);

    return parseServerActionResponse({
      error: "Could not publish this news item. Please try again.",
      status: "ERROR",
    });
  }
};

export const createCategory = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  form: FormData,
): Promise<ActionResponse> => {
  const session = await requireAdmin();
  if (!session) return parseServerActionResponse(UNAUTHORIZED);

  let values;
  try {
    values = await categorySchema.parseAsync({
      title: (form.get("title") as string)?.trim(),
      description: (form.get("description") as string)?.trim() || undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return parseServerActionResponse({
        error: firstZodMessage(error),
        status: "ERROR",
      });
    }
    throw error;
  }

  const slug = slugify(values.title, { lower: true, strict: true });

  try {
    const result = await writeClient.create({
      _type: "category",
      title: values.title,
      description: values.description,
      slug: { _type: "slug", current: slug },
    });

    revalidatePath("/categories");
    revalidatePath("/news/create");

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("[createCategory] failed", error);

    return parseServerActionResponse({
      error: "Could not create this category. Please try again.",
      status: "ERROR",
    });
  }
};
