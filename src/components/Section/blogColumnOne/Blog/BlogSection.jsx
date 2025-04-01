"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryCard from "~/components/Ui/Cards/CategoryCard";
import PostCard from "~/components/Ui/Cards/PostCard";
import TagCard from "~/components/Ui/Cards/TagCard";
import TwoBlogCard from "~/components/Ui/Cards/TwoBlogCard";

const BlogSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [blogData, setBlogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topData, setTopData] = useState({
    recentPosts: [],
    topTags: [],
    topMainTags: [],
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState({
    type: null, // 'tag' or 'category'
    value: null,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // Show 4 posts per page

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

  // Check URL parameters for tag or category filters
  useEffect(() => {
    const tag = searchParams.get("tag");
    const category = searchParams.get("category");

    if (tag) {
      setActiveFilter({ type: "tag", value: tag });
      setSearchTerm(`Tag: ${tag}`);
    } else if (category) {
      setActiveFilter({ type: "category", value: category });
      setSearchTerm(`Category: ${category}`);
    } else {
      setActiveFilter({ type: null, value: null });
      setSearchTerm("");
    }

    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [searchParams]);

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

  // Filter posts based on active filter
  useEffect(() => {
    if (!blogData.length) return;

    let filtered = [...blogData];

    if (activeFilter.type === "tag") {
      filtered = blogData.filter(
        (post) =>
          post.tags &&
          post.tags.some(
            (tag) => tag.toLowerCase() === activeFilter.value.toLowerCase()
          )
      );
    } else if (activeFilter.type === "category") {
      filtered = blogData.filter(
        (post) =>
          post.main_tag &&
          post.main_tag.toLowerCase() === activeFilter.value.toLowerCase()
      );
    }

    setFilteredData(filtered);
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [activeFilter, blogData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Clear any existing filters
    if (activeFilter.type) {
      setActiveFilter({ type: null, value: null });
      router.push("/blog");
    }

    // If search term is empty, show all posts
    if (!searchTerm.trim()) {
      setFilteredData(blogData);
      return;
    }

    // Filter posts by search term (check in heading and content)
    const filtered = blogData.filter(
      (post) =>
        post.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content &&
          post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter({ type: null, value: null });
    setSearchTerm("");
    setFilteredData(blogData);
    router.push("/blog");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Add a function to format and extract description from markdown content
  // Add this function after the formatDate function
  const getDescription = (content) => {
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

    // Get first paragraph or first 150 characters
    const firstParagraph = plainText.split("\n\n")[0];
    return firstParagraph.length > 150
      ? firstParagraph.substring(0, 150) + "..."
      : firstParagraph;
  };

  // Calculate pagination
  const postsToDisplay = filteredData.length > 0 ? filteredData : blogData;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = postsToDisplay.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(postsToDisplay.length / postsPerPage);

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
            {/* Active filter indicator */}
            {activeFilter.type && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-medium">
                    Filtering by {activeFilter.type}:{" "}
                  </span>
                  <span className="text-blue-600 capitalize">
                    {activeFilter.value}
                  </span>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Clear filter
                </button>
              </div>
            )}

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
              <div className="text-center py-5">
                <p>No blog posts found matching your criteria.</p>
                {(activeFilter.type || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Dynamic Pagination */}
            {!isLoading && !error && postsToDisplay.length > 0 && (
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
              <div className="widget mb-6">
                <form
                  onSubmit={handleSearchSubmit}
                  className="wp-block-search__inside-wrapper"
                >
                  <input
                    type="search"
                    placeholder="Search..."
                    className="wp-block-search__input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button id="wp-block-search__button" type="submit">
                    <img src="/images/icon/search.svg" alt="Search" />
                  </button>
                </form>
              </div>
              <CategoryCard categories={topData.topMainTags} />
              <PostCard
                recentPosts={topData.recentPosts}
                getPostSlug={getPostSlug}
              />
              <TagCard tags={topData.topTags} />
              <div className="zubuz-blog-contact mb-6">
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
