// This function tells Next.js which paths to pre-render for static export
export async function generateStaticParams() {
  try {
    const res = await fetch("https://dtwin-cms-api.evenbetter.in/api/blog")

    if (!res.ok) {
      console.error(`Failed to fetch blog data: ${res.status}`)
      return []
    }

    const posts = await res.json()

    // Return an array of objects with the exact slug as it appears in the URL
    return posts.map((post) => ({
      slug: post.heading.replace(/\s+/g, "-"),
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

import BlogPostClient from "./BlogPostClient"

export default function BlogPostPage({ params }) {
  return <BlogPostClient slug={params.slug} />
}

