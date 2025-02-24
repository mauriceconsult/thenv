/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {  
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
