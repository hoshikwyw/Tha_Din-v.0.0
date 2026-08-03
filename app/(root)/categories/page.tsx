import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import React from "react";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import CategoryForm from "@/components/CategoryForm";

const CategoriesPage = async () => {
  // Managing categories is admin-only; `createCategory` enforces the same gate.
  const session = await requireAdmin();
  if (!session) redirect("/");

  // Admin screen: must reflect a category created moments ago, so it skips both
  // the Sanity CDN and the Next data cache.
  const categories = await client
    .withConfig({ useCdn: false })
    .fetch(CATEGORIES_QUERY, {}, { cache: "no-store" });

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Manage Categories</h1>
      </section>
      <section className="section_container">
        <div className="max-w-3xl mx-auto grid gap-10">
          <div>
            <h2 className="text-26-semibold mb-4">Add new category</h2>
            <CategoryForm />
          </div>
          <div>
            <h2 className="text-26-semibold mb-4">Existing categories</h2>
            {categories.length === 0 ? (
              <p>No categories yet.</p>
            ) : (
              <ul className="grid gap-3">
                {categories.map((c: { _id: string; title: string | null; description?: string | null }) => (
                  <li
                    key={c._id}
                    className="rounded-xl border border-black p-4 bg-white"
                  >
                    <p className="text-20-medium">{c.title}</p>
                    {c.description && (
                      <p className="text-16-medium !text-secondary mt-1">
                        {c.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoriesPage;
