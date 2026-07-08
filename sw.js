/* Service worker — Controlo de Custos de Obras (PWA)
   Estratégia: rede primeiro (para receber versões novas), cache como recurso offline. */
const CACHE = 'cc-obras-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', function(e){
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch(_) { return; }
  if (url.origin !== location.origin) return; // dados da cloud (Supabase) nunca passam pela cache
  e.respondWith(
    fetch(req).then(function(r){
      if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return r;
    }).catch(function(){
      return caches.match(req).then(r => r || caches.match('./'));
    })
  );
});
