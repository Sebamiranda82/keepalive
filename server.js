const https = require('https');

// Lista de apps a mantener vivas
const APPS = [
  'https://cfb-servidor.onrender.com/health',
  'https://srifactu-servidor.onrender.com/health',
];

function ping(url) {
  https.get(url, (res) => {
    console.log(`✅ ${url} → ${res.statusCode}`);
  }).on('error', (e) => {
    console.log(`❌ ${url} → ${e.message}`);
  });
}

function pingAll() {
  console.log(`\n🔔 Ping ${new Date().toISOString()}`);
  APPS.forEach(ping);
}

// Ping inmediato al arrancar
pingAll();

// Ping cada 10 minutos
setInterval(pingAll, 10 * 60 * 1000);

// Servidor HTTP mínimo para que Render no lo mate
require('http').createServer((req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify({ ok: true, servicio: 'keepalive', apps: APPS.length }));
}).listen(process.env.PORT || 3000, () => {
  console.log('🟢 KeepAlive corriendo');
});
