import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/login",
        destination: "http://localhost:3001/api/auth/login",
      },
      {
        source: "/api/auth/callback",
        destination: "http://localhost:3001/api/auth/callback",
      },
      {
        source: "/api/auth/logout",
        destination: "http://localhost:3001/api/auth/logout",
      },
      {
        source: "/api/auth/sync",
        destination: "http://localhost:3001/api/auth/sync",
      },
      {
        source: "/api/auth/me",
        destination: "http://localhost:3001/api/auth/me",
      },
      {
        source: "/api/polls/:path*",
        destination: "http://localhost:3001/api/polls/:path*",
      },
      {
        source: "/socket.io/:path*",
        destination: "http://localhost:3001/socket.io/:path*",
      },
    ];
  },
};

export default nextConfig;
