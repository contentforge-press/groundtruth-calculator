const API_BASE = 'https://winter-river-47fc.contentforge-press.workers.dev';

function fmt(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function pct(n) {
  return (Number(n || 0) * 100).toFixed(2) + '%';
}

async function calculate() {
  const product = document.getElementById('product').value.trim();
  const origin = document.getElementById('origin').value;
  const value = parseFloat(document.getElementById('value').value) || 0;
  const error = document.getElementById('error');
  const result = document.getElementById('result');

  error.classList.remove('show');
  result.classList.remove('show');

  if (!product) {
    error.textContent = 'Please enter a product description.';
    error.classList.add('show');
    return;
  }

  if (value <= 0) {
    error.textContent = 'Please enter a valid declared value.';
    error.classList.add('show');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/v1/tariff?product_description=${encodeURIComponent(product)}&origin_code=${origin}&declared_value=${value}`);
    const data = await res.json();

    if (!res.ok) {
      error.textContent = data.message || 'API error. Try again.';
      error.classList.add('show');
      return;
    }

    document.getElementById('res-category').textContent = data.matched_category?.label || '—';
    document.getElementById('res-mfn').textContent = pct(data.rate_layers?.mfn);
    document.getElementById('res-301').textContent = pct(data.rate_layers?.section_301);
    document.getElementById('res-232').textContent = pct(data.rate_layers?.section_232);
    document.getElementById('res-rate').textContent = pct(data.total_duty_rate);
    document.getElementById('res-duty').textContent = fmt(data.total_customs_duty);
    document.getElementById('res-total').textContent = fmt(data.total_landed_cost);

    result.classList.add('show');
  } catch (e) {
    error.textContent = 'Network error. Try again.';
    error.classList.add('show');
  }
}

document.getElementById('calc').addEventListener('click', calculate);
document.getElementById('value').addEventListener('keydown', e => {
  if (e.key === 'Enter') calculate();
});
