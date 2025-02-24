/** @type {import('next').NextConfig} */
const nextConfig = {  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uq8itzqjce.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
