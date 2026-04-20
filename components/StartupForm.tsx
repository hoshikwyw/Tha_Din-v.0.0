"use client"

import React, { useActionState, useRef, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import MDEditor from "@uiw/react-md-editor"
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { formSchema } from '@/lib/validation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { createPitch } from '@/lib/actions'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

type CategoryOption = { _id: string; title: string | null }

const StartupForm = ({ categories }: { categories: CategoryOption[] }) => {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [pitch, setPitch] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [category, setCategory] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const {toast} = useToast()
    const router = useRouter()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            setImagePreview(null)
            return
        }
        const url = URL.createObjectURL(file)
        setImagePreview(url)
    }

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
          const formValues = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            image: formData.get("image") as File,
            pitch,
          }

          await formSchema.parseAsync(formValues)

        const result = await createPitch(prevState, formData, pitch)

        if(result.status == "SUCCESS") {
            toast({
                title: "Success",
                description: "Form submitted successfully",
                className: " bg-green-500",
            })
            router.push(`/news/${result._id}`)
        }
        return result

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErorrs = error.flatten().fieldErrors;

                setErrors(fieldErorrs as unknown as Record<string, string>);

                toast({
                  title: "Error",
                  description: "Please check your inputs and try again",
                  variant: "destructive",
                  className: "bg-red-500",
                });

                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }
            toast({
                title: "Error",
                description: "An expected error occurred",
                variant: "destructive",
                className: "bg-red-500",
              });
            return {
                ...prevState,
                error: "An expected error occurred",
                status: "ERROR",
            }
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
      })

  return (
    <form action={formAction} className='startup-form'>
        {/* NEWS TITLE INPUT AREA  */}
        <div>
            <label htmlFor="title" className='startup-form_label'>
                Title
            </label>
            <Input
                id='title'
                name='title'
                className='startup-form_input'
                required
                placeholder='Startup Title'
            />
            {errors.title && <p className='startup-form_error'>{errors.title}</p> }
        </div>

        {/* NEWS DESCRIPTION INPUT AREA */}
        <div>
            <label htmlFor="description" className='startup-form_label'>
            Description
            </label>
            <Textarea
                id='description'
                name='description'
                className='startup-form_textarea'
                required
                placeholder='Startup Description'
            />
            {errors.description && <p className='startup-form_error'>{errors.description}</p> }
        </div>

        {/* NEWS CATEGORY DROPDOWN */}
        <div>
            <label htmlFor="category" className='startup-form_label'>
            Category
            </label>
            <input type="hidden" name="category" value={category} />
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className='startup-form_select-trigger'>
                    <SelectValue
                        placeholder={categories.length === 0
                            ? "No categories yet — create one first"
                            : "Select a category"}
                    />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                            {c.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.category && <p className='startup-form_error'>{errors.category}</p> }
        </div>

        {/* NEWS IMAGE UPLOAD */}
        <div>
            <label htmlFor="image" className='startup-form_label'>
            Image
            </label>
            <input
                id='image'
                name='image'
                type='file'
                accept='image/*'
                className='startup-form_file'
                required
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={imagePreview}
                    alt='preview'
                    className='startup-form_image-preview'
                />
            )}
            {errors.image && <p className='startup-form_error'>{errors.image}</p> }
        </div>

        {/* NEWS PITCH INPUT AREA  */}
        <div data-color-mode="dark">
            <label htmlFor="pitch" className='startup-form_label'>
            Pitch
            </label>
            <MDEditor
                value={pitch}
                onChange={(value) => setPitch(value as string)}
                id='pitch'
                preview='edit'
                height={300}
                style={{borderRadius: 20, overflow: "hidden"}}
                textareaProps={{
                    placeholder: "Startup Pitch",
                }}
                previewOptions={{
                    disallowedElements: ["style"]
                }}
             />
            {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p> }
        </div>

        {/* FORM SUBMIT BUTTON  */}
        <Button type='submit' className='startup-form_btn !text-white-100' disabled={isPending}>
                {isPending ? "Submitting..." : "Submit your news  "}
                <Send className='size-6 ml-2' />
        </Button>
    </form>
  )
}

export default StartupForm
