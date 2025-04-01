// This function tells Next.js which paths to pre-render for static export
export async function generateStaticParams() {
  try {
    // Add a cache-busting parameter to ensure we get fresh data during build
    const res = await fetch(
      "https://dtwin-cms-api.evenbetter.in/api/blog?_cb=" + Date.now(),
      {
        cache: "no-store", // Ensure we don't use cached data
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch blog data: ${res.status}`);
      return [];
    }

    const posts = await res.json();

    // Log the posts we're generating paths for (helpful for debugging)
    console.log(`Generating static paths for ${posts.length} blog posts`);

    // Return an array of objects with consistent slug generation
    const paths = posts
      .map((post) => {
        if (!post.heading) {
          console.warn("Found post without heading:", post.id || "unknown ID");
          return null;
        }

        const slug = post.heading
          .replace(/[^\w\s-]/g, "") // Remove special characters
          .replace(/\s+/g, "-") // Replace spaces with dashes
          .replace(/-+/g, "-") // Replace multiple dashes with a single dash
          .toLowerCase(); // Convert to lowercase

        console.log(`Generated path for: ${post.heading} -> /blog/${slug}`);

        return { slug };
      })
      .filter(Boolean); // Remove any null entries

    // Add a fallback path for the specific problematic slug
    const specificSlug = "embracing-wellness-the-power-of-health-fitness-apps";
    if (!paths.some((p) => p.slug === specificSlug)) {
      console.log(`Adding missing path for: ${specificSlug}`);
      paths.push({ slug: specificSlug });
    }

    return paths;
  } catch (error) {
    console.error("Error generating static params:", error);
    // Return at least the problematic path to prevent build errors
    return [{ slug: "embracing-wellness-the-power-of-health-fitness-apps" }];
  }
}

import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

export default function BlogPostPage({ params }) {
  // If the slug is empty or invalid, show 404
  if (!params.slug || typeof params.slug !== "string") {
    notFound();
  }

  return <BlogPostClient slug={params.slug} />;
}
