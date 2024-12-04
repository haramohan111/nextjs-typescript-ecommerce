// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode
  webpack(config) {
    // Add custom webpack rules
    config.module.rules.push({
      test: /\.svg$/, // Match .svg files
      use: [
        '@svgr/webpack', // Transform SVG into React components
        'url-loader',    // Optional: Include the file as a URL
      ],
    });
    return config;
  },
};

export default nextConfig;
