export default async function handler(req, res) {
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
    res.status(200).json({ ok: true, data: results, ts: Date.now() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
