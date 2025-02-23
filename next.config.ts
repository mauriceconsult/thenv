/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

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
