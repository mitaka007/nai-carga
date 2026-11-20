// Nai Carga: guarda la app para abrirla sin internet.
const CACHE='nai-carga-v1.2';
const BASE=['./','./index.html','./manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>Promise.all(BASE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('nai-carga-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  if(r.mode==='navigate'||r.url.endsWith('index.html')){          // la app: primero la red (para recibir versiones nuevas)
    e.respondWith(fetch(r).then(res=>{ const c=res.clone(); caches.open(CACHE).then(x=>x.put(r,c)); return res; }).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok||res.type==='opaque'){ const c=res.clone(); caches.open(CACHE).then(x=>x.put(r,c)); } return res; })));
});
