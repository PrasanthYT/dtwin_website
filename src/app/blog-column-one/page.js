import Footer from "~/components/Section/Common/Footer";
import PageHeader from "~/components/Section/Common/PageHeader";
import Blog from "~/components/Section/blogColumnOne/Blog";
import Header from "~/components/Section/Common/Header/Header";
import { HomeHeaderTwo } from "~/components/Section/Common/Header";

const BlogOnePage = () => {
  return (
    <>
      <HomeHeaderTwo />
      <PageHeader title="News" />
      <Blog />
      <Footer />
    </>
  );
};

export default BlogOnePage;
