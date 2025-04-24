/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for React-Leaflet and Next.js
  transpilePackages: ["react-leaflet"],
};

export default nextConfig;
