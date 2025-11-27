/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.pravatar.cc",
      "i.pinimg.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "images.ctfassets.net",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.me" },
      { protocol: "https", hostname: "sunshinepethospital.com" },
      { protocol: "https", hostname: "images.ctfassets.net" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: any) => {
    // Handle GLTF and other 3D model files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
