if(!self.define){let e,i={};const a=(a,s)=>(a=new URL(a+".js",s).href,i[a]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=i,document.head.appendChild(e)}else e=a,importScripts(a),i()})).then((()=>{let e=i[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(s,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let t={};const o=e=>a(e,c),r={module:{uri:c},exports:t,require:o};i[c]=Promise.all(s.map((e=>r[e]||o(e)))).then((e=>(n(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"99538cddc3771e56d3e82e1dc4fafa01"},{url:"/_next/static/a5SSY59i_SJY_Nb-lK2Ag/_buildManifest.js",revision:"4ebb49d8a96c016d6fc1728997f67766"},{url:"/_next/static/a5SSY59i_SJY_Nb-lK2Ag/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/427-aca87b5228b01113.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/479ba886-ce27b22fe8a2e222.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/4bd1b696-76027798d9ee4c71.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/517-58d15936f0581325.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/522-3e9b00da037b3ee7.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/565-3ef4cc1b16788275.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/902-46995499fc1780ef.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(auth)/login/page-9284e6eba8e440c1.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(auth)/register/page-965bc28abdc26dc6.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(forgotpassword)/forgotpassword/page-939636f87fb28cb6.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(forgotpassword)/resetpassword/page-b0f1c82323f07728.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(post)/expertpost/%5Bid%5D/page-e1e5f7fe320ce55f.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(post)/userpost/page-803ad74b7e1c3b45.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(profile)/edit-profile/page-064fac9a8e6ca39a.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(profile)/profile-expert/page-4ddffa67aca3529e.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/(profile)/profile-user/page-bc04483327abf929.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/_not-found/page-d3f72f60d18422cf.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/article/page-225f0153897568f9.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/consultation/%5Bid%5D/page-5e03b7cf3c88c800.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/diseasedetection/page-353c0d4f505bc1cf.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/expertpage/page-7b71d7a5efc08191.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/fishdetection/page-155fb2afb972ab35.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/layout-170f99820f105dc5.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/page-c58951ef735793cb.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/payment/page-c6f691579b2d6e0a.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/result-fish-detection/page-ca68ac368fc58db0.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/riwayat/page-7004da82efd0ea2e.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/riwayatexpert/page-d787e6bad40a2221.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/app/upload-bukti-pembayaran/page-767e3ef5b0eb224d.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/framework-d29117d969504448.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/main-8b2ddfaa35e6d5d2.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/main-app-fc13d0e98394e160.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/pages/_app-d23763e3e6c904ff.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-a6b994e6c83a15b2.js",revision:"a5SSY59i_SJY_Nb-lK2Ag"},{url:"/_next/static/css/6479186bee7d9e7e.css",revision:"6479186bee7d9e7e"},{url:"/_next/static/css/9b4db2dcb90ea0e4.css",revision:"9b4db2dcb90ea0e4"},{url:"/_next/static/media/4473ecc91f70f139-s.p.woff",revision:"78e6fc13ea317b55ab0bd6dc4849c110"},{url:"/_next/static/media/463dafcda517f24f-s.p.woff",revision:"cbeb6d2d96eaa268b4b5beb0b46d9632"},{url:"/bg_keramba.jpg",revision:"ccafdc5dfddfb2e593b331deb228a7ac"},{url:"/bg_login.jpg",revision:"dcafd5346788c39c4d3dd1e8ee24d9d9"},{url:"/bgpost.png",revision:"6350f1d26837c7fbcdca09fc12a44dd6"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/homebg.png",revision:"e1c5d4b98a0d52ed5342c75ecc91b372"},{url:"/images/icon/ic_brain.png",revision:"bdb69cc1eaeef188896c4feacfb7ddc9"},{url:"/images/icon/ic_crown.png",revision:"820b7ea1f69bc2ee1896bc8771d7f4a9"},{url:"/images/icon/ic_facebook.png",revision:"d9a897494c143093ae395855387e396d"},{url:"/images/icon/ic_file.png",revision:"801661764d01a34b118a0fc2a8ac6ad3"},{url:"/images/icon/ic_fish.png",revision:"3e6db7c9eb7f73d6dbf7f383160477ab"},{url:"/images/icon/ic_foto.png",revision:"da823c72428492118dbb45fbd4a7258c"},{url:"/images/icon/ic_instagram.png",revision:"106aedbd322f95aa700452f69f880c44"},{url:"/images/icon/ic_konsul.png",revision:"193fc20c972801d0e45e4683d3510841"},{url:"/images/icon/ic_menu.png",revision:"af4222f1bebfecda55344cc03eb27c63"},{url:"/images/icon/ic_obat.png",revision:"be5e0d80e5f6d1ac0fd6c6728825b742"},{url:"/images/icon/ic_profile.png",revision:"130330a0e115472798c1d703a26da0b4"},{url:"/images/icon/ic_send.png",revision:"5670c02dffe783df60317b5cd02cc2d0"},{url:"/images/icon/ic_twitter.png",revision:"adcb8faaec6adddad37f030df2a91273"},{url:"/images/icon/ic_video.png",revision:"ff9f788e3eccb7292cc7c87633fdd1e2"},{url:"/images/icon/ic_youtube.png",revision:"9f92e3e017c42d83283d0519d2a97591"},{url:"/images/logo/logo_BCA.png",revision:"94592091c08d9fd5a6917d74e67f41c7"},{url:"/images/logo/logo_BNI.png",revision:"bf09929c3e7db410eddff3a7e6eebaf0"},{url:"/images/logo/logo_BRI.png",revision:"a471355396e70bdf2b8fcd6994c27d27"},{url:"/images/logo/logo_RAI.png",revision:"b1b937a9092277bd7eda59d9281008db"},{url:"/images/logo/logo_cemebsa.png",revision:"180490ad14e600484167b6663dce5ea0"},{url:"/images/logo/logo_cemebsacut.png",revision:"845a9d64b76ab40fde0402b0456b75ce"},{url:"/images/logo/logo_dokterikan.png",revision:"beed0651fac08e39fb0758bf48a29eca"},{url:"/images/logo/logo_dokterikan192.png",revision:"257f4747b156ef485a338a2a56ac73a2"},{url:"/images/logo/logo_dokterikan512.png",revision:"7889ed3dabbb32f30bce3b5e4338ff0c"},{url:"/images/logo/logo_fdokterikan.png",revision:"25c59c8cf09836ca7613fd5ef3ff9423"},{url:"/images/logo/logo_mandiri.png",revision:"42f1e17bcaa84a33ea9b2700c63b4bfa"},{url:"/images/logo/logo_undip.png",revision:"853ab0efe8680b810ae70fa80a001b65"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/profile.png",revision:"af205ee70850763c8080fbc517e37ef1"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:a,state:s})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const i=e.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
