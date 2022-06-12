// const nextTranslate = require('next-translate')
// module.exports = {
//   reactStrictMode: true,
//   images: {
//     domains: ['localhost' , 'https://placehold.jp', "192.168.137.1","https://via.placeholder.com" , "via.placeholder.com"],
//     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
//   },
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
//   // webpack: (config, { isServer, webpack }) => {
//   //   return config;
//   // }
// }

// module.exports = nextTranslate({
//   eslint: {
//         // Warning: This allows production builds to successfully complete even if
//         // your project has ESLint errors.
//         ignoreDuringBuilds: true,
//       },
// })


const nextTranslate = require('next-translate')
module.exports = nextTranslate({
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'https://placehold.jp', "192.168.137.1", "https://via.placeholder.com", "via.placeholder.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects(){
    return [
      {
        source:"/en/admin/:path*",
        destination:"/ar/admin/:path*",
        permanent:true,
        locale: false,
      }
    ]
  }
})
