import Footer from "~/components/Section/Common/Footer";
import PageHeader from "~/components/Section/Common/PageHeader";
import BlogSection from "~/components/Section/blogColumnOne/Blog";
import { HomeHeaderTwo } from "~/components/Section/Common/Header";

const BlogOnePage = () => {
  return (
    <>
      <HomeHeaderTwo />
      <PageHeader title="News" />
      <BlogSection />
      <Footer />
    </>
  );
};

export default BlogOnePage;
