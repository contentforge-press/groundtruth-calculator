# GroundTruth Tariff Calculator

Free 2026 US import-duty & landed-cost calculator, embeddable widget, and open-source
client for the **GroundTruth US Tariff API** — built for AI agents and cross-border
ecommerce sellers.

- 🔢 Live calculator: https://contentforge-press.github.io/groundtruth-calculator/
- 🧩 Embed it on your site: https://contentforge-press.github.io/groundtruth-calculator/embed.html
- 🔌 API & pricing: https://dytsk9wrfv.page.coze.site/groundtruth.html

## Use the hosted MCP server

GroundTruth runs a hosted, remote MCP server (Streamable HTTP). Add it to any
MCP-compatible client (Claude Desktop, Cursor, Codex, Cline, etc.):

- Endpoint: `https://winter-river-47fc.contentforge-press.workers.dev/mcp`
- Header: `x-api-key: <YOUR_GROUNDTRUTH_API_KEY>`

It exposes a US tariff & landed-cost calculation tool that stacks MFN duty, the
Uyghur Forced Labor Prevention Act (UFLPA) security layer, Section 301 (China) and
Section 232 rates, plus MPF and HMF fees. Get an API key from the
[pricing page](https://dytsk9wrfv.page.coze.site/groundtruth.html).

## JavaScript / TypeScript client

Install the npm package:

```bash
npm install groundtruth-tariff
```

```js
import { GroundTruthTariff } from 'groundtruth-tariff';

const gt = new GroundTruthTariff({ apiKey: process.env.GROUNDTRUTH_API_KEY });
const res = await gt.calculate({
  product_description: 'cotton t-shirt',
  origin_code: 'CN',
  declared_value: 1000,
  shipping_mode: 'ocean',
});
console.log(res.total_landed_cost);
```

## Embeddable widget

```html
<div id="gt-tariff-widget"></div>
<script src="https://contentforge-press.github.io/groundtruth-calculator/widget.js" async></script>
```

## License

MIT — see [LICENSE](LICENSE). The hosted API itself is a commercial service; this
repository contains the calculator, widget loader, and open-source client.
