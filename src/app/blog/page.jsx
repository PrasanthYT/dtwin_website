import Footer from "~/components/Section/Common/Footer";
import PageHeader from "~/components/Section/Common/PageHeader";
import { HomeHeaderTwo } from "~/components/Section/Common/Header";
import { Suspense } from "react";

// Create a static version of the blog section for static export
const StaticBlogSection = () => {
  return (
    <div className="section zubuz-section-padding2">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="text-center py-10">
              <p>Loading blog posts...</p>
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
                    <img src="/images/icon/search.svg" alt="Search" />
                  </button>
                </div>
              </div>
              <div className="widget mb-6">
                <h3 className="wp-block-heading">Categories:</h3>
                <ul className="pb-2">
                  <li className="mb-2">
                    <a href="/blog?category=health">Health</a>
                  </li>
                  <li className="mb-2">
                    <a href="/blog?category=tech">Tech</a>
                  </li>
                </ul>
              </div>
              <div className="zubuz-blog-contact mb-6">
                <h3>How can we help you?</h3>
                <p>
                  We are here to help you! Tell us how we can help and we&apos;ll get
                  in touch within next 24hrs
                </p>
                <a href="/contact">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import the client-side blog section component dynamically
import dynamic from "next/dynamic";
const DynamicBlogSection = dynamic(
  () => import("~/components/Section/blogColumnOne/BlogSection"),
  {
    ssr: false,
    loading: () => <StaticBlogSection />,
  }
);

const BlogOnePage = () => {
  return (
    <>
      <HomeHeaderTwo />
      <PageHeader title="News" />
      <Suspense fallback={<StaticBlogSection />}>
        <DynamicBlogSection />
      </Suspense>
      <Footer />
    </>
  );
};

export default BlogOnePage;
