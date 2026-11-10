import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-auth";
import BlogEditor from "@/components/user/BlogEditor";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const current = await getCurrentUser();

  if (!current) {
    redirect("/user/login");
  }
  if (current.kind === "admin") {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          WebEaz Blog Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">New blog draft</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Saving creates a private draft. Submitting sends it to an administrator
          for review — nothing publishes on its own.
        </p>
      </header>

      <BlogEditor
        initial={{
          id: null,
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          category: "Insights",
          coverImage: null,
          author: current.name ?? "WebEaz Technologies",
          seoTitle: null,
          seoDescription: null,
        }}
        slugLocked={false}
        locked={false}
      />
    </div>
  );
}
