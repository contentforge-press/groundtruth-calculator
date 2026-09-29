const vscode = require('vscode');

const API_BASE = 'https://winter-river-47fc.contentforge-press.workers.dev';

async function calculateTariff() {
  const product = await vscode.window.showInputBox({
    prompt: 'Product Description',
    placeHolder: 'e.g., cotton t-shirt, smartphone, steel bolt'
  });

  if (!product) {
    return;
  }

  const origin = await vscode.window.showQuickPick(
    ['CN', 'VN', 'IN', 'MX', 'US'],
    { placeHolder: 'Origin Country' }
  );

  if (!origin) {
    return;
  }

  const valueStr = await vscode.window.showInputBox({
    prompt: 'Declared Value (USD)',
    placeHolder: '1000'
  });

  const value = parseFloat(valueStr) || 0;

  if (value <= 0) {
    vscode.window.showErrorMessage('Please enter a valid declared value.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/v1/tariff?product_description=${encodeURIComponent(product)}&origin_code=${origin}&declared_value=${value}`);
    const data = await response.json();

    if (!response.ok) {
      vscode.window.showErrorMessage(data.message || 'API error');
      return;
    }

    const result = `GroundTruth Tariff Estimate
═══════════════════════════════════

Product: ${product}
Origin: ${origin}
Category: ${data.matched_category?.label || 'N/A'}

Duty Rate Breakdown:
  MFN: ${(data.rate_layers?.mfn * 100).toFixed(2)}%
  Section 301: ${(data.rate_layers?.section_301 * 100).toFixed(2)}%
  Section 232: ${(data.rate_layers?.section_232 * 100).toFixed(2)}%
  Forced Labor: ${(data.rate_layers?.forced_labor * 100).toFixed(2)}%
  ────────────────────────
  Total Duty Rate: ${(data.total_duty_rate * 100).toFixed(2)}%

Cost Breakdown:
  Customs Duty: $${data.total_customs_duty?.toFixed(2) || '0.00'}
  MPF: $${data.mpf?.toFixed(2) || '0.00'}
  HMF: $${data.hmf?.toFixed(2) || '0.00'}
  ─────────────────────────
  Total Landed Cost: $${data.total_landed_cost?.toFixed(2) || '0.00'}

Sources: ${Object.keys(data.sources || {}).join(', ')}
As of: ${data.as_of}

Powered by GroundTruth Tariff API
https://dytsk9wrfv.page.coze.site/groundtruth.html
Free Calculator: https://contentforge-press.github.io/groundtruth-calculator/`;

    const panel = vscode.window.createWebviewPanel(
      'groundtruthTariff',
      'GroundTruth Tariff Result',
      vscode.ViewColumn.Beside,
      {}
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
    pre { white-space: pre-wrap; }
    a { color: #569cd6; }
  </style>
</head>
<body>
<pre>${result}</pre>
</body>
</html>`;

  } catch (error) {
    vscode.window.showErrorMessage(`Network error: ${error.message}`);
  }
}

function activate(context) {
  let disposable = vscode.commands.registerCommand('groundtruth.calculateTariff', calculateTariff);
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
