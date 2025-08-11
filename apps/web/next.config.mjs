/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["assets.rumsan.net", "example.com"],
  },
};

export default nextConfig;
