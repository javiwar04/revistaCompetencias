/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',              // 🔹 genera /out para Static Web Apps
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,           // 🔹 necesario cuando usas export estático
  },
}

export default nextConfig
