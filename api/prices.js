export default async function handler(req, res) {
  const symbols = (req.query.symbols || 'NVDA,TSLA,USDKRW=X').split(',');

  const results = {};

  await Promise.all(
    symbols.map(async (sym) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const meta = data.chart.result[0].meta;
        const prev = meta.chartPreviousClose || meta.previousClose;
        const price = meta.regularMarketPrice;
        results[sym.replace('=X', '')] = {
          price,
          previousClose: prev,
          change: price - prev,
          changePct: ((price - prev) / prev) * 100,
        };
      } catch (e) {
        results[sym.replace('=X', '')] = null;
      }
    })
  );

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=5');
  res.json({ ok: true, data: results });
}
