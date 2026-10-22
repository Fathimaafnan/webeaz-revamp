import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The Founder & CEO portrait is served from the company's own media
     host. Scoped to this one host and path so no other external image
     can be pulled in by the optimiser. */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.files-vault.com",
        pathname: "/landing_pages/**",
      },
    ],
  },
};

export default nextConfig;
