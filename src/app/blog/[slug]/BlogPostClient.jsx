"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HomeHeaderTwo } from "~/components/Section/Common/Header";
import Footer from "~/components/Section/Common/Footer";

export default function BlogPostClient({ slug }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [topData, setTopData] = useState({
    recentPosts: [],
    topTags: [],
    topMainTags: [],
  });

  // Function to match the URL slug with the post heading
  const matchSlugToPost = (posts, urlSlug) => {
    // Try to find an exact match first
    let foundPost = posts.find(
      (post) => post.heading.replace(/\s+/g, "-") === urlSlug
    );

    if (!foundPost) {
      // If no exact match, try a case-insensitive match
      foundPost = posts.find(
        (post) =>
          post.heading.replace(/\s+/g, "-").toLowerCase() ===
          urlSlug.toLowerCase()
      );
    }

    return foundPost;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
              // Filter out the current post from recent posts if it&apos;s there
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
            // Don&apos;t fail the whole component if just the top data fails
          });
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to load blog post. Please try again later.");
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Function to generate URL slugs from headings
  const getPostSlug = (heading) => {
    return heading.replace(/\s+/g, "-");
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

  // Format content with proper line breaks and headings
  const formatContent = (content) => {
    if (!content) return [];

    const paragraphs = content.split("\n\n");
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph starts with a heading pattern
      if (paragraph.startsWith("# ")) {
        return <h3 key={index}>{paragraph.substring(2)}</h3>;
      }

      // Check if paragraph is a list
      if (paragraph.includes("\n- ")) {
        const listItems = paragraph.split("\n- ");
        const title = listItems.shift(); // First part is the title

        return (
          <div key={index}>
            {title && <p>{title}</p>}
            <ul className="single-list">
              {listItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );
      }

      // Regular paragraph
      return <p key={index}>{paragraph}</p>;
    });
  };

  if (error) {
    return (
      <>
        <HomeHeaderTwo />
        <div className="section zubuz-section-padding2 post-details-page">
          <div className="container">
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold text-red-500">{error}</h1>
              <Link
                href="/#news"
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

  if (!post) {
    return (
      <>
        <HomeHeaderTwo />
        <div className="section zubuz-section-padding2 post-details-page">
          <div className="container">
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold">Loading blog post...</h1>
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
                    <Link href={`/category/${post.main_tag.toLowerCase()}`}>
                      {post.main_tag}
                    </Link>
                  </div>
                  <div className="post-date">{formatDate(post.date)}</div>
                </div>
                <div className="entry-content">
                  <h3>{post.heading}</h3>
                  {formatContent(post.content)}

                  <div className="post-tag-wrap">
                    <div className="post-tag">
                      <h3>Tags:</h3>
                      <div className="wp-block-tag-cloud">
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <Link
                              key={index}
                              href={`/tag/${tag.toLowerCase()}`}
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
                <div className="widget">
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
                <div className="widget">
                  <h3 className="wp-block-heading">Categories:</h3>
                  <ul>
                    {topData.topMainTags && topData.topMainTags.length > 0 ? (
                      topData.topMainTags.map((tag, index) => (
                        <li key={index}>
                          <Link href={`/category/${tag.toLowerCase()}`}>
                            {tag}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>
                          <Link
                            href={`/category/${post.main_tag.toLowerCase()}`}
                          >
                            {post.main_tag}
                          </Link>
                        </li>
                        {post.tags &&
                          post.tags.slice(0, 2).map((tag, index) => (
                            <li key={index}>
                              <Link href={`/category/${tag.toLowerCase()}`}>
                                {tag}
                              </Link>
                            </li>
                          ))}
                      </>
                    )}
                  </ul>
                </div>
                <div className="widget zubuz_recent_posts_Widget">
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
                <div className="widget">
                  <h3 className="wp-block-heading">Tags:</h3>
                  <div className="wp-block-tag-cloud">
                    {topData.topTags && topData.topTags.length > 0 ? (
                      topData.topTags.map((tag, index) => (
                        <Link key={index} href={`/tag/${tag.toLowerCase()}`}>
                          {tag}
                        </Link>
                      ))
                    ) : (
                      <>
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <Link
                              key={index}
                              href={`/tag/${tag.toLowerCase()}`}
                            >
                              {tag}
                            </Link>
                          ))}
                        <Link href={`/tag/${post.main_tag.toLowerCase()}`}>
                          {post.main_tag}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="zubuz-blog-contact">
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
