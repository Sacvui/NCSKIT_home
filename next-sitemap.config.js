/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ncskit.org",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/admin/*', '/dashboard', '/login', '/profile'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login', '/profile'],
      },
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path.startsWith("/blog") ? "daily" : "weekly",
      priority: path === "/" ? 1.0 : path.startsWith("/blog") ? 0.8 : 0.6,
      lastmod: new Date().toISOString(),
    };
  },
};

