"use server";

import { auth } from "@/auth";
import { parseServerActionRespnse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string,
) => {
  const session = await auth();

  if (!session)
    return parseServerActionRespnse({
      error: "Not signed in",
      status: "ERROR",
    });

  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const category = form.get("category") as string;
  const imageFile = form.get("image") as File | null;

  if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
    return parseServerActionRespnse({
      error: "Image is required",
      status: "ERROR",
    });
  }

  if (!category) {
    return parseServerActionRespnse({
      error: "Category is required",
      status: "ERROR",
    });
  }

  const slug = slugify(title, { lower: true, strict: true });

  try {
    const imageAsset = await writeClient.assets.upload("image", imageFile, {
      filename: imageFile.name,
    });

    const news = {
      title,
      description,
      category: {
        _type: "reference",
        _ref: category,
      },
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      },
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "news", ...news });

    return parseServerActionRespnse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionRespnse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const createCategory = async (state: any, form: FormData) => {
  const session = await auth();

  if (!session)
    return parseServerActionRespnse({
      error: "Not signed in",
      status: "ERROR",
    });

  const title = (form.get("title") as string)?.trim();
  const description = (form.get("description") as string)?.trim();

  if (!title) {
    return parseServerActionRespnse({
      error: "Title is required",
      status: "ERROR",
    });
  }

  const slug = slugify(title, { lower: true, strict: true });

  try {
    const result = await writeClient.create({
      _type: "category",
      title,
      description: description || undefined,
      slug: {
        _type: "slug",
        current: slug,
      },
    });

    return parseServerActionRespnse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionRespnse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
