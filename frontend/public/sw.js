if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let r={};const t=e=>i(e,c),o={module:{uri:c},exports:r,require:t};s[c]=Promise.all(n.map((e=>o[e]||t(e)))).then((e=>(a(...e),r)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"54ce4c8ef7237fa128066863ee79d56d"},{url:"/_next/static/En6YrNM5fNAct7WxD3rv6/_buildManifest.js",revision:"b22f403d7c47e039e856d71fdc1e97f3"},{url:"/_next/static/En6YrNM5fNAct7WxD3rv6/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/269-a9ffff1f68395bc1.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/427-aca87b5228b01113.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/479ba886-ce27b22fe8a2e222.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/4bd1b696-76027798d9ee4c71.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/517-58d15936f0581325.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/522-15e7c2c471fe3924.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/565-ddfdbcf985160944.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/902-ab3e0e50bfd50e2a.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(auth)/login/page-b71608ca19317dde.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(auth)/register/page-ccdf511dbbf93166.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(forgotpassword)/forgotpassword/page-939636f87fb28cb6.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(forgotpassword)/resetpassword/page-842e8039cfce7e64.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(post)/expertpost/page-0d239d4533c62bc7.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(post)/userpost/page-c9ce3beddca8727d.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(profile)/edit-profile/page-32a882597dce5858.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(profile)/profile-expert/page-4ddffa67aca3529e.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/(profile)/profile-user/page-bc04483327abf929.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/_not-found/page-d3f72f60d18422cf.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/article/page-0345b4d6de1cf86c.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/consultation/page-a9054e445e6e794f.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/diseasedetection/page-80d580cfa777b272.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/expertpage/page-14326e0bdc533868.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/fishdetection/page-787995cafac8237f.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/layout-170f99820f105dc5.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/page-b462e7be33122a72.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/payment/page-549d1a1038d29476.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/result-expert-system/page-3b924d0efcc003f2.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/result-fish-detection/page-eba9647bff003184.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/riwayat/page-80c7b3c4b1c38d90.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/riwayatexpert/page-88e6fd70535ee5a4.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/app/upload-bukti-pembayaran/page-767e3ef5b0eb224d.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/framework-d29117d969504448.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/main-71bd775f6aa7ac8e.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/main-app-fc13d0e98394e160.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/pages/_app-d23763e3e6c904ff.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-22c9c29453fa1943.js",revision:"En6YrNM5fNAct7WxD3rv6"},{url:"/_next/static/css/02fd1a81d99115af.css",revision:"02fd1a81d99115af"},{url:"/_next/static/css/4df78f2cd73d6b26.css",revision:"4df78f2cd73d6b26"},{url:"/_next/static/css/6479186bee7d9e7e.css",revision:"6479186bee7d9e7e"},{url:"/_next/static/media/4473ecc91f70f139-s.p.woff",revision:"78e6fc13ea317b55ab0bd6dc4849c110"},{url:"/_next/static/media/463dafcda517f24f-s.p.woff",revision:"cbeb6d2d96eaa268b4b5beb0b46d9632"},{url:"/_next/static/media/ajax-loader.0b80f665.gif",revision:"0b80f665"},{url:"/_next/static/media/slick.25572f22.eot",revision:"25572f22"},{url:"/_next/static/media/slick.653a4cbb.woff",revision:"653a4cbb"},{url:"/_next/static/media/slick.6aa1ee46.ttf",revision:"6aa1ee46"},{url:"/_next/static/media/slick.f895cfdf.svg",revision:"f895cfdf"},{url:"/bg_keramba.jpg",revision:"ccafdc5dfddfb2e593b331deb228a7ac"},{url:"/bg_login.jpg",revision:"dcafd5346788c39c4d3dd1e8ee24d9d9"},{url:"/bgpost.png",revision:"6350f1d26837c7fbcdca09fc12a44dd6"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/homebg.png",revision:"e1c5d4b98a0d52ed5342c75ecc91b372"},{url:"/images/icon/ic_brain.png",revision:"bdb69cc1eaeef188896c4feacfb7ddc9"},{url:"/images/icon/ic_crown.png",revision:"820b7ea1f69bc2ee1896bc8771d7f4a9"},{url:"/images/icon/ic_facebook.png",revision:"d9a897494c143093ae395855387e396d"},{url:"/images/icon/ic_file.png",revision:"801661764d01a34b118a0fc2a8ac6ad3"},{url:"/images/icon/ic_fish.png",revision:"3e6db7c9eb7f73d6dbf7f383160477ab"},{url:"/images/icon/ic_foto.png",revision:"da823c72428492118dbb45fbd4a7258c"},{url:"/images/icon/ic_instagram.png",revision:"106aedbd322f95aa700452f69f880c44"},{url:"/images/icon/ic_konsul.png",revision:"193fc20c972801d0e45e4683d3510841"},{url:"/images/icon/ic_menu.png",revision:"af4222f1bebfecda55344cc03eb27c63"},{url:"/images/icon/ic_obat.png",revision:"be5e0d80e5f6d1ac0fd6c6728825b742"},{url:"/images/icon/ic_profile.png",revision:"130330a0e115472798c1d703a26da0b4"},{url:"/images/icon/ic_send.png",revision:"5670c02dffe783df60317b5cd02cc2d0"},{url:"/images/icon/ic_twitter.png",revision:"adcb8faaec6adddad37f030df2a91273"},{url:"/images/icon/ic_video.png",revision:"ff9f788e3eccb7292cc7c87633fdd1e2"},{url:"/images/icon/ic_youtube.png",revision:"9f92e3e017c42d83283d0519d2a97591"},{url:"/images/logo/logo_BCA.png",revision:"94592091c08d9fd5a6917d74e67f41c7"},{url:"/images/logo/logo_BNI.png",revision:"bf09929c3e7db410eddff3a7e6eebaf0"},{url:"/images/logo/logo_BRI.png",revision:"a471355396e70bdf2b8fcd6994c27d27"},{url:"/images/logo/logo_RAI.png",revision:"b1b937a9092277bd7eda59d9281008db"},{url:"/images/logo/logo_cemebsa.png",revision:"180490ad14e600484167b6663dce5ea0"},{url:"/images/logo/logo_cemebsacut.png",revision:"845a9d64b76ab40fde0402b0456b75ce"},{url:"/images/logo/logo_dokterikan.png",revision:"beed0651fac08e39fb0758bf48a29eca"},{url:"/images/logo/logo_dokterikan192.png",revision:"257f4747b156ef485a338a2a56ac73a2"},{url:"/images/logo/logo_dokterikan512.png",revision:"7889ed3dabbb32f30bce3b5e4338ff0c"},{url:"/images/logo/logo_fdokterikan.png",revision:"25c59c8cf09836ca7613fd5ef3ff9423"},{url:"/images/logo/logo_mandiri.png",revision:"42f1e17bcaa84a33ea9b2700c63b4bfa"},{url:"/images/logo/logo_undip.png",revision:"853ab0efe8680b810ae70fa80a001b65"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/profile.png",revision:"af205ee70850763c8080fbc517e37ef1"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
