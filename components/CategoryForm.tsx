"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Send } from "lucide-react";
import { categorySchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createCategory, type ActionResponse } from "@/lib/actions";

const INITIAL_STATE: ActionResponse = { error: "", status: "INITIAL" };

const CategoryForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (
    prevState: ActionResponse,
    formData: FormData,
  ): Promise<ActionResponse> => {
    try {
      const values = {
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || undefined,
      };

      await categorySchema.parseAsync(values);

      const result = await createCategory(prevState, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Category created",
          className: "bg-success text-success-foreground border-border",
        });
        setErrors({});
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create category",
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-border",
        });
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: "Error",
          description: "Please check your inputs",
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-border",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        className: "bg-destructive text-destructive-foreground border-border",
      });
      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  // `state` is unused: outcomes surface via toasts and the `errors` map.
  const [, formAction, isPending] = useActionState(
    handleFormSubmit,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label htmlFor="category-title" className="news-form_label">
          Title
        </label>
        <Input
          id="category-title"
          name="title"
          className="news-form_input"
          required
          placeholder="e.g. Technology"
        />
        {errors.title && <p className="news-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="category-description" className="news-form_label">
          Description (optional)
        </label>
        <Textarea
          id="category-description"
          name="description"
          className="news-form_textarea"
          placeholder="Short description of this category"
        />
        {errors.description && (
          <p className="news-form_error">{errors.description}</p>
        )}
      </div>
      <Button
        type="submit"
        className="news-form_btn"
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <Spinner />
            Saving…
          </>
        ) : (
          <>
            Add category
            <Send className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
};

export default CategoryForm;
