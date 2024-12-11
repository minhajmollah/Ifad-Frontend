/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  // images: {
  //   domains: ['https://postimages.org/', 'https://postimg.cc/kBWDW3SY/c607f827', 'http://113.212.109.147'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "postimages.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "postimg.cc",
        port: "",
        pathname: "/kBWDW3SY/c607f827/**",
      },
      {
        protocol: "https",
        hostname: "ecomcms.ifadgroup.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "113.212.109.147",
        port: "49008",
        pathname: "/**",
      },
    ],
  },
  rules: {
    "no-mixed-spaces-and-tabs": 0,
  },
};
