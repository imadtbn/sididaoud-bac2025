/* School portal: public static pages only, network-first updates. */
const CACHE="sididaoud-pwa-v8-home-intro-20261015";
const ROOT=new URL("./",self.location.href);
const SHELL=[
"index.html","404.html","offline.html","about.html","activities.html","announcements.html",
"results.html","results-2025.html","students.html","documents.html","contact.html","privacy.html",
"samples/activity-proposal.html","samples/weekly-study-plan.html",
"assets/css/main.css","assets/js/main.js","assets/js/site-actions.js","assets/js/ads.js",
"assets/icons/school-emblem-48.png","assets/icons/school-emblem-192.png","assets/icons/school-emblem-512.png",
"manifest.webmanifest","data/activities.json","data/announcements.json","data/documents.json","data/results.json"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(x=>new URL(x,ROOT).href))).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("sididaoud-pwa-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=="GET"||r.headers.has("range")||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
 e.respondWith((async()=>{
  const c=await caches.open(CACHE);
  try{
   const response=await fetch(r);
   if(response.ok&&response.type==="basic")c.put(r,response.clone()).catch(()=>{});
   return response;
  }catch(err){
   return await c.match(r,{ignoreSearch:true})||(r.mode==="navigate"?await c.match(new URL("offline.html",ROOT).href):null)||Response.error();
  }
 })());
});
