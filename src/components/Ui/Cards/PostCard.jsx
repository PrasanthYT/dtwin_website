"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const PostCard = ({ recentPosts = [], getPostSlug }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // If recentPosts are provided as props, use them
  // Otherwise, fetch them directly from the API
  useEffect(() => {
    if (recentPosts && recentPosts.length > 0) {
      setPosts(recentPosts);
    } else {
      fetchRecentPosts();
    }
  }, [recentPosts]);

  // Function to fetch recent posts if not provided as props
  const fetchRecentPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://dtwin-cms-api.evenbetter.in/api/blog/top"
      );
      if (response.ok) {
        const data = await response.json();
        if (data.recentPosts && data.recentPosts.length > 0) {
          setPosts(data.recentPosts);
        }
      }
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate slug if not provided
  const createSlug = (heading) => {
    if (getPostSlug) {
      return getPostSlug(heading);
    }

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

  // Truncate long headings
  const truncateHeading = (heading, maxLength = 60) => {
    if (!heading) return "";
    return heading.length > maxLength
      ? heading.substring(0, maxLength) + "..."
      : heading;
  };

  // Add a function to truncate and format markdown content
  // Add this function after the existing functions but before the return statement
  const formatPreviewContent = (content, maxLength = 100) => {
    if (!content) return "";

    // Remove markdown syntax for preview
    const plainText = content
      .replace(/#{1,6}\s/g, "") // Remove headings
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links but keep text
      .replace(/!\[(.*?)\]$$.*?$$/g, "") // Remove images
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/>\s(.*?)(\n|$)/g, "$1$2") // Remove blockquotes
      .replace(/- (.*?)(\n|$)/g, "$1$2") // Remove list markers
      .replace(/\d+\. (.*?)(\n|$)/g, "$1$2"); // Remove numbered list markers

    // Truncate to maxLength
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  return (
    <div className="widget zubuz_recent_posts_Widget">
      <h3 className="wp-block-heading">Recent Posts:</h3>

      {isLoading ? (
        <div className="text-center py-2">Loading recent posts...</div>
      ) : posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <div className="post-item" key={post.id || index}>
            <div className="post-thumb">
              <Link href={`/blog/${createSlug(post.heading)}`}>
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.image_alt || "Blog post thumbnail"}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                    e.target.alt = "Placeholder image";
                  }}
                />
              </Link>
            </div>
            <div className="post-text">
              <div className="post-date">{formatDate(post.date)}</div>
              <Link
                className="post-title"
                href={`/blog/${createSlug(post.heading)}`}
                title={post.heading}
              >
                {truncateHeading(post.heading)}
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-2">No recent posts available</div>
      )}
    </div>
  );
};

export default PostCard;
