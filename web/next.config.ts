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
      {
        protocol: "https",
        hostname: "www.webeaz.com",
        pathname: "/_assets/images/blogs/**",
      },
    ],
  },

  /* Baseline security headers. CSP is intentionally NOT set: a strict
     Content-Security-Policy would need nonce plumbing for Next.js
     inline scripts and would risk breaking authentication redirects
     and image loading. See the production-readiness report. */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
