/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // This is important for static exports with dynamic routes
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // We'll let the generateStaticParams handle the dynamic routes
    return {
      "/": { page: "/" },
      "/blog": { page: "/blog" },
      // Add other static routes here if needed
    };
  },
};

export default nextConfig;
