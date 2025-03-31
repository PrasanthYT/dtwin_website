"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HomeHeaderTwo } from "~/components/Section/Common/Header";
import Footer from "~/components/Section/Common/Footer";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Blog page error:", error);
  }, [error]);

  return (
    <>
      <HomeHeaderTwo />
      <div className="section zubuz-section-padding2 post-details-page">
        <div className="container">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-red-500">
              Something went wrong!
            </h1>
            <div className="mt-4">
              <button
                onClick={reset}
                className="px-4 py-2 mr-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try again
              </button>
              <Link
                href="/#news"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Return to blog list
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
