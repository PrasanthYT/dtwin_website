/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Remove the exportPathMap configuration as it's not compatible with the App Router
};

export default nextConfig;
