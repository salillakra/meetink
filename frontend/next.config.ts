import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      }
    ]
  },
};

export default nextConfig;
