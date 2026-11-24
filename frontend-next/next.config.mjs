/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    // Quita console.log y console.debug en producción; conserva info, warn y error
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["info", "warn", "error"] }
        : false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;