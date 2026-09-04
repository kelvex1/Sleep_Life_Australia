/** @type {import('next').NextConfig} */
const nextConfig = {
  // netlify.toml publishes "out", which only exists with a static export.
  // Every page here is either static or a client component, and there are no
  // route handlers, so nothing needs a server at request time.
  output: 'export',
  images: {
    // The default image loader optimises on demand, which a static export has
    // no server to do. Serve the sources as they are instead.
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
}

module.exports = nextConfig
