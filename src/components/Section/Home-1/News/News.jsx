"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ArrowRightIcon from "~/components/Ui/Icon/ArrowRight";

// Function to generate URL slugs from headings
const getPostSlug = (heading) => {
  return heading.replace(/\s+/g, "-");
};

const NewsSection = () => {
  const [blogDatas, setBlogDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://dtwin-cms-api.evenbetter.in/api/blog");

      if (!res.ok) {
        throw new Error(`Failed to fetch blog data: ${res.status}`);
      }

      const data = await res.json();
      setBlogDatas(data);
    } catch (err) {
      console.error("Error fetching blog data:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div id="news" className="section zubuz-section-padding2 light-bg">
      <div className="container">
        <div
          className="zubuz-section-title center"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          <h2>
            Your Health, Your Future. Stay Ahead of Chronic Diseases Today!
          </h2>
        </div>

        {isLoading && (
          <div className="text-center py-10">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        )}

        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        {!isLoading && !error && (
          <div className="row">
            {blogDatas.map((blog, index) => (
              <div className="col-xl-4 col-lg-6" key={blog.id || index}>
                <div className="zubuz-blog-wrap">
                  <Link href={`/blog/${getPostSlug(blog.heading)}`}>
                    <div className="zubuz-blog-thumb">
                      <img
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.image_alt || "Blog image"}
                      />
                      <div className="zubuz-blog-categorie">
                        {blog.main_tag}
                      </div>
                    </div>
                  </Link>
                  <div className="zubuz-blog-data">
                    <p>{formatDate(blog.date)}</p>
                    <Link href={`/blog/${getPostSlug(blog.heading)}`}>
                      <h3>{blog.heading}</h3>
                    </Link>
                    <Link
                      href={`/blog/${getPostSlug(blog.heading)}`}
                      className="zubuz-blog-btn"
                    >
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && blogDatas.length === 0 && (
          <div className="text-center py-10">
            No blog posts available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
