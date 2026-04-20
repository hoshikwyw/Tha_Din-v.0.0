"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { categorySchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/actions";

const CategoryForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
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
          className: "bg-green-500",
        });
        setErrors({});
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create category",
          variant: "destructive",
          className: "bg-red-500",
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
          className: "bg-red-500",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        className: "bg-red-500",
      });
      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label htmlFor="category-title" className="startup-form_label">
          Title
        </label>
        <Input
          id="category-title"
          name="title"
          className="startup-form_input"
          required
          placeholder="e.g. Technology"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="category-description" className="startup-form_label">
          Description (optional)
        </label>
        <Textarea
          id="category-description"
          name="description"
          className="startup-form_textarea"
          placeholder="Short description of this category"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <Button
        type="submit"
        className="startup-form_btn !text-white-100"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Add category"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default CategoryForm;
