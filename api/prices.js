function getMarketState(tp) {
  const now = Date.now() / 1000;
  if (now >= tp.regular.start && now < tp.regular.end) return 'regular';
  if (now >= tp.pre.start && now < tp.pre.end) return 'pre';
  if (now >= tp.post.start && now < tp.post.end) return 'post';
  return 'closed';
}

export default async function handler(req, res) {
  const symbols = (req.query.symbols || 'NVDA,TSLA,USDKRW=X').split(',');

  const results = {};

  await Promise.all(
    symbols.map(async (sym) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1m&range=1d&includePrePost=true`;
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const result = data.chart.result[0];
        const meta = result.meta;
        const prev = meta.chartPreviousClose || meta.previousClose;
        const timestamps = result.timestamp || [];
        const closes = result.indicators.quote[0].close;
        const lastIdx = closes.reduce((acc, c, i) => c !== null ? i : acc, -1);
        const price = lastIdx >= 0 ? closes[lastIdx] : meta.regularMarketPrice;
        const lastTime = lastIdx >= 0 && timestamps[lastIdx] ? timestamps[lastIdx] * 1000 : null;
        const marketState = meta.currentTradingPeriod ? getMarketState(meta.currentTradingPeriod) : 'closed';
        results[sym.replace('=X', '')] = {
          price,
          regularMarketPrice: meta.regularMarketPrice,
          previousClose: prev,
          change: price - prev,
          changePct: ((price - prev) / prev) * 100,
          lastTime,
          marketState,
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
