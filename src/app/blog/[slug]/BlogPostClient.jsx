"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HomeHeaderTwo } from "~/components/Section/Common/Header";
import Footer from "~/components/Section/Common/Footer";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPostClient({ slug }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [topData, setTopData] = useState({
    recentPosts: [],
    topTags: [],
    topMainTags: [],
  });

  // Function to match the URL slug with the post heading
  const matchSlugToPost = (posts, urlSlug) => {
    // Normalize the URL slug
    const normalizedUrlSlug = urlSlug.toLowerCase();

    // Try to find a match by generating slugs the same way for both sides
    const foundPost = posts.find((post) => {
      if (!post.heading) return false;

      // Generate slug the same way we do in links
      const postSlug = post.heading
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-") // Replace multiple dashes with a single dash
        .toLowerCase(); // Convert to lowercase

      return postSlug === normalizedUrlSlug;
    });

    return foundPost;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all blog posts to find the current one
        const blogRes = await fetch(
          "https://dtwin-cms-api.evenbetter.in/api/blog"
        );

        if (!blogRes.ok) {
          throw new Error(`Failed to fetch blog data: ${blogRes.status}`);
        }

        const blogData = await blogRes.json();

        // Find the post by matching the URL slug with the post heading
        const foundPost = matchSlugToPost(blogData, slug);

        if (!foundPost) {
          setError("Blog post not found");
          return;
        }

        setPost(foundPost);

        // Set recent posts from the same data (for immediate display)
        const initialRecentPosts = blogData
          .filter((p) => p.id !== foundPost.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        setTopData((prev) => ({
          ...prev,
          recentPosts: initialRecentPosts,
        }));

        // Fetch top posts, tags, and categories in the background
        fetch("https://dtwin-cms-api.evenbetter.in/api/blog/top")
          .then((res) => {
            if (res.ok) return res.json();
            return null;
          })
          .then((data) => {
            if (data) {
              // Filter out the current post from recent posts if it's there
              if (data.recentPosts) {
                data.recentPosts = data.recentPosts.filter(
                  (p) => p.id !== foundPost.id
                );
              }
              setTopData(data);
            }
          })
          .catch((err) => {
            console.error("Error fetching top data:", err);
            // Don't fail the whole component if just the top data fails
          });
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Function to generate URL slugs from headings
  const getPostSlug = (heading) => {
    if (!heading) return "";
    // Replace special characters and multiple spaces with a single dash
    return heading
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and dashes
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/-+/g, "-") // Replace multiple dashes with a single dash
      .toLowerCase(); // Convert to lowercase for consistency
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // If there's an error and we're not loading, show the not found page
  useEffect(() => {
    if (error && !isLoading) {
      // We can use this approach for client-side navigation
      // For initial load, the server-side notFound() will handle it
      if (typeof window !== "undefined") {
        notFound();
      }
    }
  }, [error, isLoading]);

  if (isLoading) {
    return (
      <>
        <HomeHeaderTwo />
        <div className="section zubuz-section-padding2 post-details-page">
          <div className="container">
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-4">Loading blog post...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <HomeHeaderTwo />
        <div className="section zubuz-section-padding2 post-details-page">
          <div className="container">
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold text-red-500">
                {error || "Blog post not found"}
              </h1>
              <Link
                href="/blog"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Return to blog list
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HomeHeaderTwo />
      <div className="section zubuz-section-padding2 post-details-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="single-post-content-wrap">
                <div className="post-thumbnail">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.image_alt || ""}
                  />
                </div>
                <div className="post-meta">
                  <div className="post-category">
                    <Link
                      href={`/blog?category=${post.main_tag.toLowerCase()}`}
                    >
                      {post.main_tag}
                    </Link>
                  </div>
                  <div className="post-date">{formatDate(post.date)}</div>
                </div>
                <div className="entry-content">
                  <h3>{post.heading}</h3>

                  {/* Render markdown content */}
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Customize heading rendering
                        h1: ({ node, ...props }) => (
                          <h3
                            className="text-2xl font-bold mt-6 mb-4"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h4
                            className="text-xl font-bold mt-5 mb-3"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h5
                            className="text-lg font-bold mt-4 mb-2"
                            {...props}
                          />
                        ),

                        // Customize paragraph rendering
                        p: ({ node, ...props }) => (
                          <p className="mb-4" {...props} />
                        ),

                        // Customize list rendering
                        ul: ({ node, ...props }) => (
                          <ul className="single-list mb-4 pl-6" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="single-list mb-4 pl-6 list-decimal"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),

                        // Customize link rendering
                        a: ({ node, ...props }) => (
                          <a
                            className="text-blue-600 hover:underline"
                            {...props}
                          />
                        ),

                        // Customize code rendering
                        code: ({ node, inline, ...props }) =>
                          inline ? (
                            <code
                              className="bg-gray-100 px-1 py-0.5 rounded text-sm"
                              {...props}
                            />
                          ) : (
                            <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4">
                              <code {...props} />
                            </pre>
                          ),

                        // Customize blockquote rendering
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-4 border-gray-300 pl-4 italic my-4"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {post.content || ""}
                    </ReactMarkdown>
                  </div>

                  <div className="post-tag-wrap">
                    <div className="post-tag">
                      <h3>Tags:</h3>
                      <div className="wp-block-tag-cloud pb-4">
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <Link
                              key={index}
                              href={`/blog?tag=${tag.toLowerCase()}`}
                              className="mb-2"
                            >
                              {tag}
                            </Link>
                          ))}
                      </div>
                    </div>
                    <div className="post-tag">
                      <h3>Share:</h3>
                      <div className="zubuz-social-icon social-box">
                        <ul>
                          <li>
                            <a
                              href={post.share_links?.twitter || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaTwitter />
                            </a>
                          </li>
                          <li>
                            <a
                              href={post.share_links?.facebook || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFacebookF />
                            </a>
                          </li>
                          <li>
                            <a
                              href={post.share_links?.linkedin || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaLinkedin />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaGithub />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="right-sidebar">
                <div className="widget mb-6">
                  <div className="wp-block-search__inside-wrapper">
                    <input
                      type="search"
                      placeholder="Search..."
                      className="wp-block-search__input"
                    />
                    <button id="wp-block-search__button" type="submit">
                      <img src="/images/icon/search.svg" alt="" />
                    </button>
                  </div>
                </div>
                <div className="widget mb-6">
                  <h3 className="wp-block-heading">Categories:</h3>
                  <ul className="pb-2">
                    {topData.topMainTags && topData.topMainTags.length > 0 ? (
                      topData.topMainTags.map((tag, index) => (
                        <li key={index} className="mb-2">
                          <Link href={`/blog?category=${tag.toLowerCase()}`}>
                            {tag}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="mb-2">
                          <Link
                            href={`/blog?category=${post.main_tag.toLowerCase()}`}
                          >
                            {post.main_tag}
                          </Link>
                        </li>
                        {post.tags &&
                          post.tags.slice(0, 2).map((tag, index) => (
                            <li key={index} className="mb-2">
                              <Link
                                href={`/blog?category=${tag.toLowerCase()}`}
                              >
                                {tag}
                              </Link>
                            </li>
                          ))}
                      </>
                    )}
                  </ul>
                </div>
                <div className="widget zubuz_recent_posts_Widget mb-6">
                  <h3 className="wp-block-heading">Recent Posts:</h3>
                  {topData.recentPosts && topData.recentPosts.length > 0 ? (
                    topData.recentPosts.map((recentPost, index) => (
                      <div className="post-item" key={index}>
                        <div className="post-thumb">
                          <Link
                            href={`/blog/${getPostSlug(recentPost.heading)}`}
                          >
                            <img
                              src={recentPost.image || "/placeholder.svg"}
                              alt={recentPost.image_alt || ""}
                            />
                          </Link>
                        </div>
                        <div className="post-text">
                          <div className="post-date">
                            {formatDate(recentPost.date)}
                          </div>
                          <Link
                            className="post-title"
                            href={`/blog/${getPostSlug(recentPost.heading)}`}
                          >
                            {recentPost.heading}
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2">
                      No recent posts available
                    </div>
                  )}
                </div>
                <div className="widget mb-6">
                  <h3 className="wp-block-heading">Tags:</h3>
                  <div className="wp-block-tag-cloud pb-4">
                    {topData.topTags && topData.topTags.length > 0 ? (
                      topData.topTags.map((tag, index) => (
                        <Link
                          key={index}
                          href={`/blog?tag=${tag.toLowerCase()}`}
                          className="mb-2"
                        >
                          {tag}
                        </Link>
                      ))
                    ) : (
                      <>
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <Link
                              key={index}
                              href={`/blog?tag=${tag.toLowerCase()}`}
                              className="mb-2"
                            >
                              {tag}
                            </Link>
                          ))}
                        <Link
                          href={`/blog?tag=${post.main_tag.toLowerCase()}`}
                          className="mb-2"
                        >
                          {post.main_tag}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="zubuz-blog-contact mb-6">
                  <h3>How can we help you?</h3>
                  <p>
                    We are here to help you! Tell us how we can help and we&apos;ll
                    get in touch within next 24hrs
                  </p>
                  <Link href="/contact">Contact Us</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
