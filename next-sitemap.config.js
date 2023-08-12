/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://rksm.netlify.app',
    generateRobotsTxt: true,
}