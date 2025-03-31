"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryCard from "~/components/Ui/Cards/CategoryCard";
import PostCard from "~/components/Ui/Cards/PostCard";
import TagCard from "~/components/Ui/Cards/TagCard";
import TwoBlogCard from "~/components/Ui/Cards/TwoBlogCard";

const BlogSection = () => {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topData, setTopData] = useState({
    recentPosts: [],
    topTags: [],
    topMainTags: [],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // Show 4 posts per page

  // Function to generate URL slugs from headings
  const getPostSlug = (heading) => {
    return heading.replace(/\s+/g, "-");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch blog posts
        const response = await fetch(
          "https://dtwin-cms-api.evenbetter.in/api/blog"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBlogData(data);

        // Fetch top data for sidebar
        const topResponse = await fetch(
          "https://dtwin-cms-api.evenbetter.in/api/blog/top"
        );
        if (topResponse.ok) {
          const topDataResult = await topResponse.json();
          setTopData(topDataResult);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get first paragraph as description
  const getDescription = (content) => {
    if (!content) return "";
    const firstParagraph = content.split("\n\n")[0];
    return firstParagraph.length > 150
      ? firstParagraph.substring(0, 150) + "..."
      : firstParagraph;
  };

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogData.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogData.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="section zubuz-section-padding2">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {isLoading ? (
              <div className="text-center py-5">
                <p>Loading blog posts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5 text-red-500">{error}</div>
            ) : currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <TwoBlogCard
                  key={post.id}
                  post={{
                    id: post.id,
                    image: post.image,
                    category: post.main_tag,
                    date: formatDate(post.date),
                    title: post.heading,
                    description: getDescription(post.content),
                    link: `/blog/${getPostSlug(post.heading)}`,
                  }}
                />
              ))
            ) : (
              <div className="text-center py-5">No blog posts available.</div>
            )}

            {/* Dynamic Pagination */}
            {!isLoading && !error && blogData.length > 0 && (
              <div className="zubuz-navigation">
                <nav className="navigation pagination" aria-label="Posts">
                  <div className="nav-links">
                    {/* Previous page link */}
                    {currentPage > 1 && (
                      <Link
                        className="prev page-numbers"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(currentPage - 1);
                        }}
                      >
                        prev
                      </Link>
                    )}

                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return pageNumber === currentPage ? (
                        <span
                          key={pageNumber}
                          aria-current="page"
                          className="page-numbers current"
                        >
                          {pageNumber}
                        </span>
                      ) : (
                        <Link
                          key={pageNumber}
                          className="page-numbers"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            paginate(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </Link>
                      );
                    })}

                    {/* Next page link */}
                    {currentPage < totalPages && (
                      <Link
                        className="next page-numbers"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(currentPage + 1);
                        }}
                      >
                        next
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            )}
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
              <CategoryCard categories={topData.topMainTags} />
              <PostCard
                recentPosts={topData.recentPosts}
                getPostSlug={getPostSlug}
              />
              <TagCard tags={topData.topTags} />
              <div className="zubuz-blog-contact">
                <h3>How can we help you?</h3>
                <p>
                  We are here to help you! Tell us how we can help and we&apos;ll get
                  in touch within next 24hrs
                </p>
                <Link href="/contact">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
