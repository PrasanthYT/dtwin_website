import Link from "next/link";
import { HomeHeaderTwo } from "~/components/Section/Common/Header";
import Footer from "~/components/Section/Common/Footer";

export default function NotFound() {
  return (
    <>
      <HomeHeaderTwo />
      <div className="section zubuz-section-padding2 post-details-page">
        <div className="container">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-bold text-red-500 mb-6">
              Blog Post Not Found
            </h2>
            <p className="mb-8">
              The blog post you are looking for does not exist or has been
              removed.
            </p>
            <Link
              href="/#news"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
