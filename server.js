const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/prices', async (_req, res) => {
  try {
    const symbols = ['TSLA', 'NVDA', 'USDKRW=X'];
    const results = {};

    const fetches = symbols.map(async (symbol) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await response.json();
      const meta = data.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || meta.previousClose;

      results[symbol.replace('=X', '')] = {
        price,
        previousClose: prevClose,
        change: price - prevClose,
        changePct: ((price - prevClose) / prevClose) * 100
      };
    });

    await Promise.all(fetches);
    res.json({ ok: true, data: results, ts: Date.now() });
  } catch (error) {
    console.error('Price fetch error:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const nets = require('os').networkInterfaces();
  let localIP = 'localhost';
  for (const iface of Object.values(nets)) {
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }
  console.log('');
  console.log('=================================');
  console.log('  영웅문S# 서버 실행중');
  console.log('=================================');
  console.log(`  PC:   http://localhost:${PORT}`);
  console.log(`  폰:   http://${localIP}:${PORT}`);
  console.log('=================================');
  console.log('');
  console.log('폰과 PC가 같은 Wi-Fi에 연결되어 있어야 합니다.');
  console.log('종료: Ctrl+C');
});
