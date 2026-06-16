const CACHE='controlo-custos-v93';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // NETWORK-FIRST: tenta sempre a versão nova; cache só serve se estiver offline
  e.respondWith(
    fetch(e.request).then(resp=>{
      try{const u=new URL(e.request.url);if(u.origin===location.origin){const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}}catch(_){}
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
