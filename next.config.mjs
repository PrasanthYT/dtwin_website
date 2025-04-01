/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Exclude specific paths from static generation if they're causing issues
  experimental: {
    // This helps with static generation by skipping certain dynamic routes
    // that might be causing issues during build
    skipTrailingSlashRedirect: true,
    // Skip middleware during static export
    skipMiddlewareUrlNormalize: true,
  },
};

export default nextConfig;
