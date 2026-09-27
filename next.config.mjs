/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Phase 1: local placeholders + Unsplash (migrates to cdn.yourbrand.com on R2 in Phase 3)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.yourbrand.com" }
    ]
  }
};
export default nextConfig;
