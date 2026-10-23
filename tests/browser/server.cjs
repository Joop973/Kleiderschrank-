// Testserver mit denselben Headern wie netlify.toml (Cross-Origin-Isolation, SPA-Fallback).
const http = require('http');
const fs = require('fs');
const path = require('path');
const wurzel = process.argv[2];
const typen = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
};
http
  .createServer((req, res) => {
    let datei = path.join(wurzel, decodeURIComponent(req.url.split('?')[0]));
    if (!fs.existsSync(datei) || fs.statSync(datei).isDirectory())
      datei = path.join(wurzel, 'index.html');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Content-Type', typen[path.extname(datei)] || 'application/octet-stream');
    fs.createReadStream(datei).pipe(res);
  })
  .listen(Number(process.argv[3] || 4174));
