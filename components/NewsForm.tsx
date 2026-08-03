"use client"

import React, { useActionState, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import MDEditor from "@uiw/react-md-editor"
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { newsFormSchema } from '@/lib/validation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { createNews, type ActionResponse } from '@/lib/actions'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

type CategoryOption = { _id: string; title: string | null }

const INITIAL_STATE: ActionResponse = { error: "", status: "INITIAL" }

const NewsForm = ({ categories }: { categories: CategoryOption[] }) => {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [pitch, setPitch] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [category, setCategory] = useState("")
    const { toast } = useToast()
    const router = useRouter()

    // Object URLs stay allocated until explicitly revoked; without this the
    // previous preview leaks every time a different file is chosen.
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview)
        }
    }, [imagePreview])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setImagePreview((previous) => {
            if (previous) URL.revokeObjectURL(previous)
            return file ? URL.createObjectURL(file) : null
        })
    }

    const handleFormSubmit = async (
        prevState: ActionResponse,
        formData: FormData,
    ): Promise<ActionResponse> => {
        try {
            await newsFormSchema.parseAsync({
                title: formData.get("title"),
                description: formData.get("description"),
                category: formData.get("category"),
                image: formData.get("image"),
                pitch,
            })

            setErrors({})

            const result = await createNews(prevState, formData, pitch)

            if (result.status === "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your news has been published",
                    className: "bg-green-500",
                })
                router.push(`/news/${result._id}`)
            } else {
                // Previously only SUCCESS was handled, so a server-side
                // rejection (not authorised, upload failed) left the form
                // sitting there with no feedback at all.
                toast({
                    title: "Error",
                    description: result.error || "Could not publish this news item",
                    variant: "destructive",
                    className: "bg-red-500",
                })
            }

            return result
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors

                setErrors(fieldErrors as unknown as Record<string, string>)

                toast({
                    title: "Error",
                    description: "Please check your inputs and try again",
                    variant: "destructive",
                    className: "bg-red-500",
                })

                return { ...prevState, error: "Validation failed", status: "ERROR" }
            }

            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
                className: "bg-red-500",
            })

            return {
                ...prevState,
                error: "An unexpected error occurred",
                status: "ERROR",
            }
        }
    }

    // `state` is unused: every outcome is surfaced through a toast or the
    // per-field `errors` map, so it is not destructured.
    const [, formAction, isPending] = useActionState(handleFormSubmit, INITIAL_STATE)

    return (
        <form action={formAction} className='news-form'>
            {/* NEWS TITLE INPUT AREA  */}
            <div>
                <label htmlFor="title" className='news-form_label'>
                    Title
                </label>
                <Input
                    id='title'
                    name='title'
                    className='news-form_input'
                    required
                    placeholder='News title'
                />
                {errors.title && <p className='news-form_error'>{errors.title}</p>}
            </div>

            {/* NEWS DESCRIPTION INPUT AREA */}
            <div>
                <label htmlFor="description" className='news-form_label'>
                    Description
                </label>
                <Textarea
                    id='description'
                    name='description'
                    className='news-form_textarea'
                    required
                    placeholder='Short summary of this story'
                />
                {errors.description && <p className='news-form_error'>{errors.description}</p>}
            </div>

            {/* NEWS CATEGORY DROPDOWN */}
            <div>
                <label htmlFor="category" className='news-form_label'>
                    Category
                </label>
                <input type="hidden" name="category" value={category} />
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className='news-form_select-trigger' aria-label="Category">
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
                {errors.category && <p className='news-form_error'>{errors.category}</p>}
            </div>

            {/* NEWS IMAGE UPLOAD */}
            <div>
                <label htmlFor="image" className='news-form_label'>
                    Image
                </label>
                <input
                    id='image'
                    name='image'
                    type='file'
                    accept='image/jpeg,image/png,image/gif,image/webp'
                    className='news-form_file'
                    required
                    onChange={handleImageChange}
                />
                {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imagePreview}
                        alt='Selected image preview'
                        className='news-form_image-preview'
                    />
                )}
                {errors.image && <p className='news-form_error'>{errors.image}</p>}
            </div>

            {/* NEWS BODY INPUT AREA — the Sanity field is still named `pitch` */}
            <div data-color-mode="dark">
                <label htmlFor="pitch" className='news-form_label'>
                    Details
                </label>
                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id='pitch'
                    preview='edit'
                    height={300}
                    style={{ borderRadius: 20, overflow: "hidden" }}
                    textareaProps={{
                        placeholder: "Write the full story here",
                    }}
                    previewOptions={{
                        disallowedElements: ["style"],
                    }}
                />
                {errors.pitch && <p className='news-form_error'>{errors.pitch}</p>}
            </div>

            {/* FORM SUBMIT BUTTON  */}
            <Button type='submit' className='news-form_btn !text-white-100' disabled={isPending}>
                {isPending ? "Submitting..." : "Submit your news"}
                <Send className='size-6 ml-2' />
            </Button>
        </form>
    )
}

export default NewsForm
