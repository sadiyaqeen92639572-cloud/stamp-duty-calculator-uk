// Generates all satellite folders + refund-calculator/ + sitemap.xml for the
// stamp duty calculator site. Mirrors the calculator logic in index.html —
// keep BANDS here in sync with the <script> block in index.html.
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://checkstampduty.co.uk';
const ROOT = __dirname;

// ─── Shared CSS (mirrors index.html) ───────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --brand: #0f6e4f; --brand-dark: #0a4d38; --brand-light: #e6f5ee;
    --accent: #e63946; --gold: #b8860b; --text: #1a1a2e; --muted: #64748b;
    --border: #e2e8f0; --bg: #f8fafc; --radius: 12px;
  }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: var(--text); background: var(--bg); font-size: 16px; line-height: 1.65; }
  header { background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%); color: white; padding: 52px 20px 88px; text-align: center; }
  header .badge { display: inline-block; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); border-radius: 20px; padding: 4px 14px; font-size: 0.78rem; font-weight: 600; letter-spacing: .4px; margin-bottom: 16px; }
  header h1 { font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 800; margin-bottom: 12px; }
  header p { color: rgba(255,255,255,.9); font-size: 1rem; max-width: 620px; margin: 0 auto; }
  .container { max-width: 840px; margin: 0 auto; padding: 0 20px; }
  .tool-wrapper { margin: -56px auto 56px; }
  .tool-card { background: white; border-radius: var(--radius); box-shadow: 0 8px 40px rgba(0,0,0,0.12); border: 1px solid var(--border); padding: 36px 32px; }
  @media (max-width: 580px) { .tool-card { padding: 22px 16px; } }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 580px) { .form-grid { grid-template-columns: 1fr; } }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  label { font-size: 0.79rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }
  label .hint { font-weight: 400; text-transform: none; font-size: 0.75rem; color: #94a3b8; }
  select, input[type=number] { border: 2px solid var(--border); border-radius: 8px; padding: 12px 14px; font-size: 1rem; color: var(--text); background: white; width: 100%; transition: border-color .2s; }
  select:focus, input[type=number]:focus { outline: none; border-color: var(--brand); }
  input[type=number] { -moz-appearance: textfield; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  .seg-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .seg-row button { flex: 1; min-width: 90px; padding: 10px 12px; border: 2px solid var(--border); background: white; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .15s; }
  .seg-row button.active { border-color: var(--brand); background: var(--brand-light); color: var(--brand-dark); }
  .calc-btn { width: 100%; margin-top: 24px; padding: 17px; background: var(--brand); color: white; border: none; border-radius: 10px; font-size: 1.08rem; font-weight: 700; cursor: pointer; transition: background .2s; letter-spacing: .2px; }
  .calc-btn:hover { background: var(--brand-dark); }
  .result { display: none; margin-top: 28px; }
  .result-hero { background: linear-gradient(135deg, var(--brand-dark), var(--brand)); border-radius: 10px; padding: 28px; color: white; text-align: center; margin-bottom: 16px; }
  .result-hero .rl { font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; opacity: .8; margin-bottom: 4px; }
  .result-hero .ra { font-size: 2.6rem; font-weight: 900; line-height: 1.1; }
  .result-hero .rs { font-size: 0.9rem; opacity: .85; margin-top: 6px; }
  .result-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
  @media (max-width: 480px) { .result-grid { grid-template-columns: 1fr 1fr; } }
  .r-stat { background: var(--brand-light); border-radius: 8px; padding: 14px; text-align: center; }
  .r-stat .sv { font-size: 1.25rem; font-weight: 800; color: var(--brand); }
  .r-stat .sl { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .band-breakdown { background: #f1f5f9; border-radius: 8px; padding: 14px 16px; margin-bottom: 14px; font-size: 0.83rem; }
  .band-breakdown .bb-row { display: flex; justify-content: space-between; padding: 4px 0; color: #475569; }
  .band-breakdown .bb-row.total { border-top: 1px solid var(--border); margin-top: 6px; padding-top: 8px; font-weight: 700; color: var(--text); }
  .fca-notice { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; font-size: 0.78rem; color: #78350f; }
  .refund-nudge { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px 16px; margin-top: 14px; font-size: 0.85rem; color: #7c2d12; display: none; }
  .refund-nudge a { color: var(--accent); font-weight: 700; }
  .content { padding-bottom: 64px; }
  h2.st { font-size: 1.3rem; font-weight: 800; margin: 52px 0 18px; }
  p { color: #374151; margin-bottom: 14px; line-height: 1.75; }
  .table-wrap { overflow-x: auto; margin: 20px 0; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .data-table th { background: var(--brand); color: white; padding: 10px 14px; text-align: left; font-weight: 600; white-space: nowrap; }
  .data-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .data-table tr:nth-child(even) td { background: #f8faff; }
  .highlight { font-weight: 700; color: var(--brand); }
  .satellite-cta { background: #fff7ed; border: 1px solid #fed7aa; border-radius: var(--radius); padding: 24px; margin: 40px 0; text-align: center; }
  .satellite-cta a { display: inline-block; margin-top: 10px; background: var(--accent); color: white; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; }
  .back-links { display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0 40px; }
  .back-links a { background: white; border: 1px solid var(--border); border-radius: 8px; padding: 10px 16px; text-decoration: none; color: var(--text); font-size: 0.85rem; font-weight: 600; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-q { width: 100%; background: none; border: none; text-align: left; padding: 18px 0; font-size: 0.92rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: var(--text); }
  .faq-q::after { content: '+'; font-size: 1.3rem; color: var(--brand); flex-shrink: 0; margin-left: 12px; }
  .faq-q.open::after { content: '−'; }
  .faq-a { display: none; padding: 0 0 16px; font-size: 0.88rem; color: #4b5563; line-height: 1.75; }
  .faq-a.open { display: block; }
  footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 32px 20px; font-size: 0.8rem; }
  footer p { color: #94a3b8; }
  footer a { color: #cbd5e1; }
  .fca-footer { background: #1e293b; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px; font-size: 0.78rem; color: #94a3b8; line-height: 1.6; }
`;

// ─── Shared calculator JS (mirrors index.html) ─────────────────────────────
const CALC_JS = `
const BANDS = {
  england_standard: [ {upper:125000,rate:0}, {upper:250000,rate:0.02}, {upper:925000,rate:0.05}, {upper:1500000,rate:0.10}, {upper:Infinity,rate:0.12} ],
  england_ftb:      [ {upper:300000,rate:0}, {upper:500000,rate:0.05} ],
  england_surcharge:[ {upper:125000,rate:0.05}, {upper:250000,rate:0.07}, {upper:925000,rate:0.10}, {upper:1500000,rate:0.15}, {upper:Infinity,rate:0.17} ],
  scotland_standard:[ {upper:145000,rate:0}, {upper:250000,rate:0.02}, {upper:325000,rate:0.05}, {upper:750000,rate:0.10}, {upper:Infinity,rate:0.12} ],
  scotland_ftb:     [ {upper:175000,rate:0}, {upper:250000,rate:0.02}, {upper:325000,rate:0.05}, {upper:750000,rate:0.10}, {upper:Infinity,rate:0.12} ],
  wales_standard:   [ {upper:225000,rate:0}, {upper:400000,rate:0.06}, {upper:750000,rate:0.075}, {upper:1500000,rate:0.10}, {upper:Infinity,rate:0.12} ],
  wales_higher:     [ {upper:180000,rate:0.05}, {upper:250000,rate:0.085}, {upper:400000,rate:0.10}, {upper:750000,rate:0.125}, {upper:1500000,rate:0.15}, {upper:Infinity,rate:0.17} ]
};
const NON_RES_SURCHARGE_PP = 0.02;
const SCOTLAND_ADS_RATE = 0.08;
const SURCHARGE_MIN_PRICE = 40000;

function bandedTax(price, bands) {
  let tax = 0, lower = 0, rows = [];
  for (const b of bands) {
    if (price <= lower) break;
    const taxable = Math.min(price, b.upper) - lower;
    if (taxable > 0) {
      const t = taxable * b.rate;
      tax += t;
      rows.push({ from: lower, to: Math.min(price, b.upper), rate: b.rate, tax: t });
    }
    lower = b.upper;
  }
  return { tax, rows };
}

let region = 'england', buyer = 'main', nonRes = !!window.__pageNonResDefault;

const regionSegEl = document.getElementById('regionSeg');
if (regionSegEl) regionSegEl.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  [...e.currentTarget.children].forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  region = e.target.dataset.region;
  const nonResWrapEl = document.getElementById('nonResWrap');
  if (nonResWrapEl) nonResWrapEl.style.display = region === 'england' ? '' : 'none';
});
const buyerSegEl = document.getElementById('buyerSeg');
if (buyerSegEl) buyerSegEl.addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  [...e.currentTarget.children].forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  buyer = e.target.dataset.buyer;
});
function setNonRes(val) {
  nonRes = val;
  document.getElementById('nonResNo').classList.toggle('active', !val);
  document.getElementById('nonResYes').classList.toggle('active', val);
}
function fmtGBP(n) { return '£' + Math.round(n).toLocaleString(); }

function calcEngland(price, buyer, nonRes) {
  let bands, usedRelief = false;
  if (buyer === 'additional' && price >= SURCHARGE_MIN_PRICE) bands = BANDS.england_surcharge;
  else if (buyer === 'ftb' && price <= 500000) { bands = BANDS.england_ftb; usedRelief = true; }
  else bands = BANDS.england_standard;
  let { tax, rows } = bandedTax(price, bands);
  if (nonRes) { tax += price * NON_RES_SURCHARGE_PP; rows.push({ from: 0, to: price, rate: NON_RES_SURCHARGE_PP, tax: price * NON_RES_SURCHARGE_PP, label: 'Non-resident surcharge (flat 2%)' }); }
  return { tax, rows, note: buyer === 'ftb' && price > 500000 ? 'Price exceeds £500,000 — first-time buyer relief does not apply; standard rates used.' : (usedRelief ? 'First-time buyer relief applied.' : null) };
}
function calcScotland(price, buyer) {
  const bands = buyer === 'ftb' ? BANDS.scotland_ftb : BANDS.scotland_standard;
  let { tax, rows } = bandedTax(price, bands);
  if (buyer === 'additional' && price >= SURCHARGE_MIN_PRICE) { const ads = price * SCOTLAND_ADS_RATE; tax += ads; rows.push({ from: 0, to: price, rate: SCOTLAND_ADS_RATE, tax: ads, label: 'Additional Dwelling Supplement (flat 8%)' }); }
  return { tax, rows, note: null };
}
function calcWales(price, buyer) {
  const bands = buyer === 'additional' && price >= SURCHARGE_MIN_PRICE ? BANDS.wales_higher : BANDS.wales_standard;
  const { tax, rows } = bandedTax(price, bands);
  return { tax, rows, note: buyer === 'ftb' ? 'Wales has no first-time buyer relief — standard rates applied.' : null };
}
function calculate() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  let result;
  if (region === 'england') result = calcEngland(price, buyer, nonRes);
  else if (region === 'scotland') result = calcScotland(price, buyer);
  else result = calcWales(price, buyer);
  const effRate = price > 0 ? (result.tax / price * 100) : 0;
  document.getElementById('r-total').textContent = fmtGBP(result.tax);
  document.getElementById('r-sub').textContent = regionLabel(region) + ' · ' + buyerLabel(buyer);
  document.getElementById('r-effective').textContent = effRate.toFixed(2) + '%';
  document.getElementById('r-netprice').textContent = fmtGBP(price);
  document.getElementById('r-net').textContent = fmtGBP(price + result.tax);
  const bb = document.getElementById('bandBreakdown');
  bb.innerHTML = result.rows.map(r => '<div class="bb-row"><span>' + (r.label || fmtGBP(r.from) + ' – ' + (r.to === Infinity ? '∞' : fmtGBP(r.to)) + ' @ ' + (r.rate*100).toFixed(1) + '%') + '</span><span>' + fmtGBP(r.tax) + '</span></div>').join('') +
    '<div class="bb-row total"><span>Total</span><span>' + fmtGBP(result.tax) + '</span></div>' +
    (result.note ? '<div class="bb-row" style="color:#94a3b8;font-style:italic;">' + result.note + '</div>' : '');
  const nudge = document.getElementById('refundNudge');
  if (buyer === 'additional') {
    document.getElementById('refundReason').textContent = 'second-home surcharges are a common overpayment trigger (wrong classification, missed Multiple Dwellings Relief, or you sell your previous home within 36 months).';
    nudge.style.display = 'block';
  } else { nudge.style.display = 'none'; }
  document.getElementById('result').style.display = 'block';
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function regionLabel(r) { return { england: 'England/NI (SDLT)', scotland: 'Scotland (LBTT)', wales: 'Wales (LTT)' }[r]; }
function buyerLabel(b) { return { main: 'Main home', ftb: 'First-time buyer', additional: 'Second home / BTL' }[b]; }
function toggleFaq(btn) { btn.classList.toggle('open'); btn.nextElementSibling.classList.toggle('open'); }
`;

// Shared CTA snippet injected into every satellite page's result block —
// per plan's funnel-wiring section, every satellite must link to refund-calculator/.
const REFUND_CTA_SNIPPET = `
      <div class="refund-nudge" id="refundNudge">
        ⚠️ <strong>Overpayment risk:</strong> <span id="refundReason"></span> — <a href="/refund-calculator/">check refund eligibility →</a>
      </div>`;

function toolMarkup(regionDefault, nonResDefault) {
  const regionButtons = {
    england: `<button class="active" data-region="england">England / NI (SDLT)</button><button data-region="scotland">Scotland (LBTT)</button><button data-region="wales">Wales (LTT)</button>`,
    scotland: `<button data-region="england">England / NI (SDLT)</button><button class="active" data-region="scotland">Scotland (LBTT)</button><button data-region="wales">Wales (LTT)</button>`,
    wales: `<button data-region="england">England / NI (SDLT)</button><button data-region="scotland">Scotland (LBTT)</button><button class="active" data-region="wales">Wales (LTT)</button>`
  };
  return `
    <div class="form-grid">
      <div class="form-group full">
        <label>Region</label>
        <div class="seg-row" id="regionSeg">${regionButtons[regionDefault]}</div>
      </div>
      <div class="form-group full">
        <label>Property Price (£)</label>
        <input type="number" id="price" min="0" step="1000" value="350000" placeholder="e.g. 350000">
      </div>
      <div class="form-group full">
        <label>Buyer Type</label>
        <div class="seg-row" id="buyerSeg">
          <button class="active" data-buyer="main">Only / main home</button>
          <button data-buyer="ftb">First-time buyer</button>
          <button data-buyer="additional">Second home / buy-to-let</button>
        </div>
      </div>
      <div class="form-group full" id="nonResWrap" style="display:${regionDefault === 'england' ? '' : 'none'}">
        <label>Non-UK resident? <span class="hint">— adds England/NI surcharge only</span></label>
        <div class="seg-row">
          <button ${nonResDefault ? '' : 'class="active"'} id="nonResNo" onclick="setNonRes(false)">No</button>
          <button ${nonResDefault ? 'class="active"' : ''} id="nonResYes" onclick="setNonRes(true)">Yes</button>
        </div>
      </div>
    </div>
    <button class="calc-btn" onclick="calculate()">Calculate Stamp Duty →</button>
    <div class="result" id="result">
      <div class="result-hero">
        <div class="rl">Stamp Duty Owed</div>
        <div class="ra" id="r-total"></div>
        <div class="rs" id="r-sub"></div>
      </div>
      <div class="result-grid">
        <div class="r-stat"><div class="sv" id="r-effective"></div><div class="sl">Effective rate</div></div>
        <div class="r-stat"><div class="sv" id="r-netprice"></div><div class="sl">Property price</div></div>
        <div class="r-stat"><div class="sv" id="r-net"></div><div class="sl">Price + tax</div></div>
      </div>
      <div class="band-breakdown" id="bandBreakdown"></div>
      ${REFUND_CTA_SNIPPET}
      <div class="fca-notice">ℹ️ <strong>Disclaimer:</strong> This tool provides information only and does not constitute tax or legal advice. For a binding figure, consult a solicitor/conveyancer or use the official <a href="https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro" target="_blank" rel="noopener">HMRC SDLT calculator</a>.</div>
    </div>`;
}

function pageShell({ slug, title, metaTitle, metaDesc, h1, intro, regionDefault, nonResDefault, extraContent, faqs, canonicalPath, guideLinks }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const faqJsonLd = faqs.map(f => `{ "@type": "Question", "name": ${JSON.stringify(f.q)}, "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a)} } }`).join(',\n        ');
  const faqHtml = faqs.map(f => `
  <div class="faq-item">
    <button class="faq-q" onclick="toggleFaq(this)">${f.q}</button>
    <div class="faq-a">${f.a}</div>
  </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${metaTitle}</title>
<meta name="description" content="${metaDesc}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${metaTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${SITE_URL}/og-image.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="${SITE_URL}/og-image.svg">
<meta name="google-site-verification" content="m4ovmDFcrhAbFLC1Ix28d793SYzD--JWQ2n8UtetMSg" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "${title}", "url": "${canonical}", "description": "${metaDesc}", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "inLanguage": "en-GB", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }, "areaServed": { "@type": "Country", "name": "United Kingdom" } },
    { "@type": "FAQPage", "mainEntity": [
        ${faqJsonLd}
      ] },
    { "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" }, { "@type": "ListItem", "position": 2, "name": "${title}", "item": "${canonical}" } ] }
  ]
}
</script>
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">🇬🇧 2026 Rates</div>
    <h1>${h1}</h1>
    <p>${intro}</p>
  </div>
</header>
<div class="container">
<div class="tool-wrapper">
  <div class="tool-card">
    ${toolMarkup(regionDefault, nonResDefault)}
  </div>
</div>
<div class="content">
  ${extraContent}
  <h2 class="st">Frequently Asked Questions</h2>
  ${faqHtml}
  <div class="back-links">
    <a href="/">← Main stamp duty calculator</a>
    <a href="/refund-calculator/">Check refund eligibility →</a>
    ${(guideLinks || []).map(l => `<a href="${l.href}">${l.label}</a>`).join('\n    ')}
  </div>
</div>
</div>
<footer>
  <div class="container">
    <div class="fca-footer"><strong>Disclaimer:</strong> Information only, not tax or legal advice. Figures based on 2026 HMRC/Revenue Scotland/Welsh Revenue Authority rates. Confirm with a solicitor/conveyancer or the official <a href="https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro">HMRC SDLT calculator</a>.</div>
    <p>Data based on 2026 rates · Updated July 2026</p>
  </div>
</footer>
<script>window.__pageNonResDefault = ${!!nonResDefault};</script>
<script>${CALC_JS}</script>
</body>
</html>
`;
}

// ─── Satellite definitions ─────────────────────────────────────────────────
// "stamp duty on second home" (14,800 vol) merged with "second home stamp
// duty calculator" (4,400 vol) — one page, higher-volume phrase as H1/URL.
const SATELLITES = [
  {
    slug: 'second-home',
    title: 'Stamp Duty on a Second Home',
    metaTitle: 'Stamp Duty on Second Home Calculator 2026 — Surcharge Explained',
    metaDesc: 'Calculate stamp duty on a second home or buy-to-let. 5% surcharge (England/NI), 8% ADS (Scotland) or Wales higher rates — instant figure.',
    h1: 'Stamp Duty on a Second Home',
    intro: 'Buying a second home, holiday let or buy-to-let? Use the calculator below — it automatically applies the surcharge for your region.',
    regionDefault: 'england',
    extraContent: `
      <h2 class="st">Second Home Stamp Duty Surcharge — By Region</h2>
      <p>All three UK nations charge more stamp duty on a second residential property (a "second home stamp duty calculator" search usually means this exact scenario):</p>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Region</th><th>Surcharge</th><th>Applies from</th></tr></thead>
        <tbody>
          <tr><td>England / NI</td><td class="highlight">+5 percentage points on every SDLT band</td><td>£40,000+</td></tr>
          <tr><td>Scotland</td><td class="highlight">+8% flat (Additional Dwelling Supplement)</td><td>£40,000+</td></tr>
          <tr><td>Wales</td><td class="highlight">Separate higher-rate bands from 5%</td><td>£40,000+</td></tr>
        </tbody>
      </table></div>
      <p>If you sell your previous main home within 36 months of completing on the new one, the surcharge (England/NI SDLT and Scotland ADS) can be reclaimed — see our <a href="/refund-calculator/">stamp duty refund calculator</a>.</p>`,
    faqs: [
      { q: 'How much extra stamp duty do I pay on a second home?', a: 'England/NI adds 5 percentage points to every SDLT band. Scotland charges a flat 8% Additional Dwelling Supplement. Wales uses separate higher-rate bands starting at 5% with no nil-rate threshold. The surcharge applies to any additional residential property costing £40,000 or more.' },
      { q: 'Can I reclaim the second home stamp duty surcharge?', a: 'Yes — if you sell your previous main residence within 36 months of buying the new one, you can reclaim the England/NI surcharge or Scottish ADS. Use our stamp duty refund calculator to check your eligibility and estimate the amount.' },
      { q: 'Does the second home surcharge apply to buy-to-let purchases?', a: 'Yes, buy-to-let purchases are treated the same as second homes for stamp duty purposes in all three nations — the surcharge applies whenever you already own another residential property.' }
    ],
    guideLinks: [ { href: '/guides/what-is-stamp-duty/', label: 'What is stamp duty? →' }, { href: '/guides/stamp-duty-payment-deadlines/', label: 'Payment deadlines →' } ]
  },
  {
    slug: 'scotland',
    title: 'Scotland LBTT Calculator',
    metaTitle: 'Stamp Duty Calculator Scotland 2026 — LBTT Rates &amp; ADS',
    metaDesc: 'Land and Buildings Transaction Tax (LBTT) calculator for Scotland. Standard rates, first-time buyer relief, and 8% Additional Dwelling Supplement.',
    h1: 'Stamp Duty Calculator Scotland (LBTT)',
    intro: 'Scotland uses Land and Buildings Transaction Tax (LBTT), not SDLT. Enter your details below (region auto-selected to Scotland).',
    regionDefault: 'scotland',
    extraContent: `
      <h2 class="st">Scotland LBTT Bands 2026</h2>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Band</th><th>Standard rate</th><th>First-time buyer</th></tr></thead>
        <tbody>
          <tr><td>Up to £145,000</td><td>0%</td><td>0% (up to £175k)</td></tr>
          <tr><td>£145,001 – £175,000</td><td>2%</td><td>0%</td></tr>
          <tr><td>£175,001 – £250,000</td><td>2%</td><td>2%</td></tr>
          <tr><td>£250,001 – £325,000</td><td>5%</td><td>5%</td></tr>
          <tr><td>£325,001 – £750,000</td><td>10%</td><td>10%</td></tr>
          <tr><td>Above £750,000</td><td>12%</td><td>12%</td></tr>
        </tbody>
      </table></div>
      <p>Additional Dwelling Supplement (ADS) adds a flat <strong>8%</strong> of the whole price for second homes/buy-to-lets, refundable if the previous main residence is sold within 36 months.</p>`,
    faqs: [
      { q: 'What is LBTT?', a: 'Land and Buildings Transaction Tax (LBTT) is Scotland\'s equivalent of stamp duty, replacing SDLT in Scotland since 2015. It uses its own bands, set by Revenue Scotland.' },
      { q: 'How much is LBTT on a second home in Scotland?', a: 'The Additional Dwelling Supplement (ADS) adds a flat 8% of the whole purchase price on top of standard LBTT, for any additional residential property costing £40,000 or more.' },
      { q: 'Is there first-time buyer relief for LBTT?', a: 'Yes — first-time buyers get a nil-rate band raised to £175,000 (versus £145,000 standard), saving up to £600.' }
    ],
    guideLinks: [ { href: '/guides/stamp-duty-payment-deadlines/', label: 'Payment deadlines (30 days) →' } ]
  },
  {
    slug: 'wales',
    title: 'Wales LTT Calculator',
    metaTitle: 'Stamp Duty Calculator Wales 2026 — LTT Rates Explained',
    metaDesc: 'Land Transaction Tax (LTT) calculator for Wales. Standard and higher rates for second homes — instant figure, no first-time buyer relief.',
    h1: 'Stamp Duty Calculator Wales (LTT)',
    intro: 'Wales uses Land Transaction Tax (LTT), with no first-time buyer relief. Enter your details below (region auto-selected to Wales).',
    regionDefault: 'wales',
    extraContent: `
      <h2 class="st">Wales LTT Bands 2026</h2>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Band</th><th>Standard rate</th><th>Higher rate (2nd home)</th></tr></thead>
        <tbody>
          <tr><td>Up to £180,000</td><td>0%</td><td class="highlight">5%</td></tr>
          <tr><td>£180,001 – £225,000</td><td>0%</td><td class="highlight">8.5%</td></tr>
          <tr><td>£225,001 – £250,000</td><td>6%</td><td class="highlight">8.5%</td></tr>
          <tr><td>£250,001 – £400,000</td><td>6%</td><td class="highlight">10%</td></tr>
          <tr><td>£400,001 – £750,000</td><td>7.5%</td><td class="highlight">12.5%</td></tr>
          <tr><td>£750,001 – £1.5m</td><td>10%</td><td class="highlight">15%</td></tr>
          <tr><td>Above £1.5m</td><td>12%</td><td class="highlight">17%</td></tr>
        </tbody>
      </table></div>
      <p>Wales abolished first-time buyer relief in 2018 — first-time buyers pay standard rates. The higher rate for second homes/buy-to-lets has no nil-rate band; it's taxed from £0.</p>`,
    faqs: [
      { q: 'What is LTT?', a: 'Land Transaction Tax (LTT) is Wales\' equivalent of stamp duty, administered by the Welsh Revenue Authority since 2018, replacing SDLT in Wales.' },
      { q: 'Is there first-time buyer relief in Wales?', a: 'No — Wales abolished first-time buyer relief. First-time buyers pay the same standard LTT rates as any other main-home buyer.' },
      { q: 'How much is LTT on a second home in Wales?', a: 'Higher rates apply from 5% with no nil-rate band — every pound is taxed, unlike the standard rate which has a 0% band up to £225,000.' }
    ],
    guideLinks: [ { href: '/guides/stamp-duty-payment-deadlines/', label: 'Payment deadlines (30 days) →' } ]
  },
  {
    slug: 'first-time-buyer',
    title: 'First-Time Buyer Stamp Duty Calculator',
    metaTitle: 'Stamp Duty Calculator First-Time Buyer 2026 — Relief Explained',
    metaDesc: 'First-time buyer stamp duty calculator. 0% up to £300,000 in England/NI, £175,000 nil-rate in Scotland, standard rates in Wales.',
    h1: 'First-Time Buyer Stamp Duty Calculator',
    intro: 'First-time buyer relief varies significantly by nation — use the calculator below (first-time buyer pre-selected).',
    regionDefault: 'england',
    extraContent: `
      <h2 class="st">First-Time Buyer Relief — By Region</h2>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Region</th><th>Relief</th></tr></thead>
        <tbody>
          <tr><td>England / NI</td><td class="highlight">0% up to £300,000, 5% to £500,000, no relief above</td></tr>
          <tr><td>Scotland</td><td class="highlight">Nil-rate band raised to £175,000 (max saving £600)</td></tr>
          <tr><td>Wales</td><td class="highlight">No relief — standard rates apply</td></tr>
        </tbody>
      </table></div>`,
    faqs: [
      { q: 'How much stamp duty do first-time buyers pay?', a: 'In England/NI: 0% up to £300,000, then 5% up to £500,000, with no relief above £500,000. Scotland raises the LBTT nil-rate band to £175,000. Wales has no first-time buyer relief at all.' },
      { q: 'What counts as a first-time buyer for stamp duty?', a: 'Generally, someone who has never owned a residential property anywhere in the world, and who is buying their only or main residence. Joint buyers must both qualify as first-time buyers.' }
    ],
    guideLinks: [ { href: '/guides/stamp-duty-changes-2025/', label: 'What changed in 2025 →' }, { href: '/guides/adding-stamp-duty-to-mortgage/', label: 'Adding it to your mortgage →' } ]
  },
  {
    slug: 'buy-to-let',
    title: 'Buy-to-Let Stamp Duty Calculator',
    metaTitle: 'Stamp Duty Calculator Buy-to-Let 2026 — Investor Surcharge',
    metaDesc: 'Buy-to-let stamp duty calculator for landlords and investors. Second-home surcharge applies in England, Scotland and Wales — instant figure.',
    h1: 'Buy-to-Let Stamp Duty Calculator',
    intro: 'Buying an investment property? The second-home surcharge applies — use the calculator below (additional-property pre-selected).',
    regionDefault: 'england',
    extraContent: `
      <h2 class="st">Buy-to-Let Stamp Duty — Same Rules as Second Homes</h2>
      <p>HMRC, Revenue Scotland and the Welsh Revenue Authority all treat buy-to-let purchases identically to second homes for stamp duty purposes — the surcharge applies whenever you already own another residential property, anywhere in the world.</p>
      <p>Multiple Dwellings Relief (MDR) can reduce the bill on qualifying multi-unit purchases (e.g. buying a property with an annexe, or several units in one transaction) — see the <a href="/refund-calculator/">refund calculator</a> if you think this was missed on a past purchase.</p>`,
    faqs: [
      { q: 'Do landlords pay more stamp duty?', a: 'Yes — buy-to-let purchases attract the same second-home surcharge as any additional residential property: +5pp per band in England/NI, +8% flat ADS in Scotland, or Wales\' higher-rate bands.' },
      { q: 'What is Multiple Dwellings Relief?', a: 'MDR can reduce stamp duty when a single transaction includes more than one dwelling (e.g. a house with a self-contained annexe, or several flats). It is frequently missed by conveyancers — check the refund calculator if this applied to a past purchase.' }
    ],
    guideLinks: [ { href: '/guides/adding-stamp-duty-to-mortgage/', label: 'Adding it to your mortgage →' } ]
  },
  {
    slug: 'non-resident',
    title: 'Stamp Duty Calculator Non-Resident Buyer',
    metaTitle: 'Stamp Duty Calculator Non-Resident Buyer 2026 — 2% Surcharge Explained',
    metaDesc: 'Non-resident stamp duty calculator for England/NI. Calculate the extra 2% SDLT surcharge for overseas buyers, plus the 183-day residence test.',
    h1: 'Stamp Duty Calculator — Non-Resident Buyer',
    intro: 'Buying in England or Northern Ireland from overseas? A flat 2% non-resident surcharge applies on top of standard SDLT — use the calculator below (non-resident pre-selected).',
    regionDefault: 'england',
    nonResDefault: true,
    extraContent: `
      <h2 class="st">Non-Resident Stamp Duty Surcharge — How It Works</h2>
      <p>England and Northern Ireland charge a flat <strong>2% SDLT surcharge</strong> on the whole purchase price for buyers who don't meet the UK residence test — on top of any other rate (standard, first-time buyer, or second-home surcharge). Scotland and Wales do not currently charge a separate non-resident surcharge.</p>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Test</th><th>Rule</th></tr></thead>
        <tbody>
          <tr><td>183-day test</td><td>Present in the UK for at least 183 days during the 12 months before completion = UK resident for this purchase</td></tr>
          <tr><td>Joint buyers</td><td>If either buyer fails the residence test, the whole surcharge applies to the full price, not just their share</td></tr>
          <tr><td>Refund window</td><td>If you become UK resident within 12 months of completion (183 days in the following 12 months), the surcharge can be reclaimed</td></tr>
        </tbody>
      </table></div>
      <h2 class="st">The Formula</h2>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px 24px 16px;margin:0 0 32px;font-size:0.9rem;line-height:1.8;">
        <div style="background:#12321f;color:#e2e8f0;border-radius:8px;padding:16px 18px;font-family:'Courier New',monospace;font-size:0.83rem;line-height:2;overflow-x:auto;">
          <span style="color:#7dd3fc;">base_tax</span> = Σ over bands: (min(price, band_upper) − band_lower) × band_rate <span style="color:#94a3b8;">(standard, FTB, or second-home bands, whichever applies)</span><br>
          <span style="color:#7dd3fc;">surcharge</span> = price × 0.02 <span style="color:#94a3b8;">(flat 2%, whole price, only if non-resident)</span><br>
          <span style="color:#86efac;">total_sdlt</span> = base_tax + surcharge
        </div>
        <p style="font-size:0.78rem;color:#94a3b8;margin:12px 0 0;">The 2% is added on top of whichever base calculation applies (standard, first-time buyer, or second-home surcharge) — it is never the only rate applied.</p>
      </div>
      <p>Missed a valid refund? Check our <a href="/refund-calculator/">stamp duty refund calculator</a>.</p>`,
    faqs: [
      { q: 'Who counts as a non-resident for stamp duty?', a: 'You are treated as non-resident for SDLT purposes if you were not present in the UK for at least 183 days during the 12 months before completion. Different tests can apply for companies and trusts.' },
      { q: 'Can I reclaim the non-resident stamp duty surcharge?', a: 'Yes — if you spend at least 183 days in the UK during the 12 months after completion, you can reclaim the 2% surcharge. Use the refund calculator to check the amount.' },
      { q: 'Does the non-resident surcharge apply in Scotland or Wales?', a: 'No — the 2% non-resident surcharge is specific to SDLT in England and Northern Ireland. Scotland (LBTT) and Wales (LTT) do not currently charge an equivalent surcharge.' }
    ],
    guideLinks: [ { href: '/guides/what-is-stamp-duty/', label: 'What is stamp duty? →' } ]
  },
  {
    slug: 'threshold',
    title: 'Stamp Duty Threshold',
    metaTitle: 'Stamp Duty Threshold 2026 — Full Band Tables (England, Scotland, Wales)',
    metaDesc: 'Current stamp duty thresholds and bands for England (SDLT), Scotland (LBTT) and Wales (LTT) in one place, plus a free calculator.',
    h1: 'Stamp Duty Threshold 2026',
    intro: 'Where do the stamp duty bands start and end this year? Full tables below, plus a calculator for your exact figure.',
    regionDefault: 'england',
    extraContent: `
      <h2 class="st">All Current Stamp Duty Thresholds</h2>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Region</th><th>Nil-rate threshold</th><th>Top rate</th></tr></thead>
        <tbody>
          <tr><td>England / NI (SDLT) — standard</td><td>£125,000</td><td>12% above £1.5m</td></tr>
          <tr><td>England / NI (SDLT) — first-time buyer</td><td>£300,000</td><td>n/a above £500k (relief lost)</td></tr>
          <tr><td>Scotland (LBTT) — standard</td><td>£145,000</td><td>12% above £750k</td></tr>
          <tr><td>Scotland (LBTT) — first-time buyer</td><td>£175,000</td><td>12% above £750k</td></tr>
          <tr><td>Wales (LTT) — standard</td><td>£225,000</td><td>12% above £1.5m</td></tr>
          <tr><td>Wales (LTT) — second home</td><td>£0 (no nil band)</td><td>17% above £1.5m</td></tr>
        </tbody>
      </table></div>`,
    faqs: [
      { q: 'What is the stamp duty threshold in 2026?', a: 'The nil-rate threshold is £125,000 in England/NI (standard), £300,000 for first-time buyers, £145,000 in Scotland (£175,000 for first-time buyers), and £225,000 in Wales. Second homes in Wales have no nil-rate band at all.' },
      { q: 'When did the current stamp duty thresholds start?', a: 'The England/NI thresholds shown here apply from 1 April 2025. Scotland and Wales bands are current for the 2025/26 and 2026/27 tax years per Revenue Scotland and the Welsh Revenue Authority.' }
    ],
    guideLinks: [ { href: '/guides/stamp-duty-changes-2025/', label: 'What changed in 2025 →' } ]
  }
];

// ─── Limited company / corporate buyer calculator ──────────────────────────
// England/NI only. Verified via gov.uk/HMRC (Sch 4A FA2003 + Sch 4ZA):
// residential purchases by a "non-natural person" (company, partnership with
// a corporate member, or collective investment scheme) over £500,000 pay a
// flat 15% SDLT rate on the whole price (17% if also non-resident), which
// REPLACES the normal banded calculation. At or below £500,000, standard
// company purchases are treated as additional-dwelling purchases (surcharge
// bands), since companies can't claim first-time-buyer relief. Reliefs exist
// (qualifying property rental businesses, development, employee housing,
// Homes for Ukraine) that can bring the rate back down to standard bands —
// always flagged on-page, never assumed.
const LIMITED_COMPANY_PAGE = {
  slug: 'limited-company',
  metaTitle: 'Stamp Duty Calculator Limited Company 2026 — 15% Flat Rate Explained',
  metaDesc: 'Stamp duty calculator for limited company and corporate buyers. 15% flat SDLT rate above £500,000, surcharge bands below — England/NI only.',
  h1: 'Stamp Duty Calculator — Limited Company Buyer',
  intro: 'Buying UK residential property through a limited company? A flat 15% SDLT rate applies above £500,000 — different rules from a personal purchase. England/NI only.',
};

function renderLimitedCompanyPage() {
  const canonical = `${SITE_URL}/limited-company/`;
  const faqs = [
    { q: 'How much SDLT does a limited company pay on a residential property?', a: 'Above £500,000, a flat 15% SDLT rate applies to the whole price (17% if the company is also non-UK resident) — this replaces the normal banded calculation entirely. At or below £500,000, standard additional-dwelling surcharge bands apply, since companies cannot claim first-time-buyer relief.' },
    { q: 'Are there reliefs from the 15% flat rate?', a: 'Yes — qualifying property rental businesses, property developers/traders, and property used for employee accommodation can generally claim relief back down to standard rates. This calculator does not apply any relief automatically; check eligibility with a solicitor or tax adviser before relying on the flat-rate figure.' },
    { q: 'Does the 15% rate apply in Scotland or Wales?', a: 'No — this flat-rate regime (Schedule 4A, Finance Act 2003) is specific to SDLT in England and Northern Ireland. Scotland (LBTT) and Wales (LTT) do not have an equivalent flat rate for corporate buyers.' }
  ];
  const faqJsonLd = faqs.map(f => `{ "@type": "Question", "name": ${JSON.stringify(f.q)}, "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a)} } }`).join(',\n        ');
  const faqHtml = faqs.map(f => `
  <div class="faq-item">
    <button class="faq-q" onclick="toggleFaq(this)">${f.q}</button>
    <div class="faq-a">${f.a}</div>
  </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${LIMITED_COMPANY_PAGE.metaTitle}</title>
<meta name="description" content="${LIMITED_COMPANY_PAGE.metaDesc}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${LIMITED_COMPANY_PAGE.metaTitle}">
<meta property="og:description" content="${LIMITED_COMPANY_PAGE.metaDesc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${SITE_URL}/og-image.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="${SITE_URL}/og-image.svg">
<meta name="google-site-verification" content="m4ovmDFcrhAbFLC1Ix28d793SYzD--JWQ2n8UtetMSg" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Stamp Duty Calculator Limited Company", "url": "${canonical}", "description": "${LIMITED_COMPANY_PAGE.metaDesc}", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "inLanguage": "en-GB", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }, "areaServed": { "@type": "Country", "name": "United Kingdom" } },
    { "@type": "FAQPage", "mainEntity": [
        ${faqJsonLd}
      ] },
    { "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" }, { "@type": "ListItem", "position": 2, "name": "Stamp Duty Calculator Limited Company", "item": "${canonical}" } ] }
  ]
}
</script>
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">🏢 Corporate Buyer · 2026</div>
    <h1>${LIMITED_COMPANY_PAGE.h1}</h1>
    <p>${LIMITED_COMPANY_PAGE.intro}</p>
  </div>
</header>
<div class="container">
<div class="tool-wrapper">
  <div class="tool-card">
    <div class="form-grid">
      <div class="form-group full">
        <label>Property Price (£)</label>
        <input type="number" id="price" min="0" step="1000" value="600000" placeholder="e.g. 600000">
      </div>
      <div class="form-group full">
        <label>Company non-UK resident? <span class="hint">— adds 2% on top of the flat rate above £500k</span></label>
        <div class="seg-row">
          <button class="active" id="nonResNo" onclick="setNonRes(false)">No</button>
          <button id="nonResYes" onclick="setNonRes(true)">Yes</button>
        </div>
      </div>
    </div>
    <button class="calc-btn" onclick="calculateCompany()">Calculate Stamp Duty →</button>

    <div class="result" id="result">
      <div class="result-hero">
        <div class="rl">Stamp Duty Owed</div>
        <div class="ra" id="r-total"></div>
        <div class="rs" id="r-sub"></div>
      </div>
      <div class="result-grid">
        <div class="r-stat"><div class="sv" id="r-effective"></div><div class="sl">Effective rate</div></div>
        <div class="r-stat"><div class="sv" id="r-netprice"></div><div class="sl">Property price</div></div>
        <div class="r-stat"><div class="sv" id="r-net"></div><div class="sl">Price + tax</div></div>
      </div>
      <div class="band-breakdown" id="bandBreakdown"></div>
      <div class="fca-notice">ℹ️ <strong>Disclaimer:</strong> Assumes no relief applies. Qualifying property rental businesses, developers/traders, and employee-accommodation purchases may bring this back down to standard bands — confirm eligibility with a solicitor or tax adviser before relying on this figure. Not tax or legal advice.</div>
    </div>
  </div>
</div>

<div class="content">
  <h2 class="st">Why Company Purchases Are Different</h2>
  <p>Residential property bought by a "non-natural person" — a company, a partnership with a corporate member, or a collective investment scheme — follows different SDLT rules from a personal purchase, in England and Northern Ireland only:</p>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Price</th><th>Rate</th><th>Basis</th></tr></thead>
    <tbody>
      <tr><td>£0 – £500,000</td><td class="highlight">Standard additional-dwelling surcharge bands</td><td>Companies never qualify for first-time-buyer relief</td></tr>
      <tr><td>Above £500,000</td><td class="highlight">Flat 15% (17% if non-resident) on the whole price</td><td>Schedule 4A, Finance Act 2003 — replaces banded calculation entirely</td></tr>
    </tbody>
  </table></div>
  <p>Reliefs can bring the rate back down to standard bands — most commonly for property rental businesses, property developers/traders, and employee accommodation. This calculator assumes no relief applies; always confirm with a solicitor or tax adviser.</p>

  <h2 class="st">The Formula</h2>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px 24px 16px;margin:0 0 32px;font-size:0.9rem;line-height:1.8;">
    <p style="margin-bottom:16px;color:#64748b;font-size:0.82rem;text-transform:uppercase;letter-spacing:.5px;font-weight:600;">Source: Schedule 4A, Finance Act 2003 (15% flat rate) + Schedule 4ZA (additional-dwelling bands) — assumes no relief applies.</p>
    <div style="background:#12321f;color:#e2e8f0;border-radius:8px;padding:18px 20px;font-family:'Courier New',monospace;font-size:0.83rem;line-height:2;overflow-x:auto;">
      <span style="color:#86efac;">if price ≤ £500,000:</span><br>
      &nbsp;&nbsp;<span style="color:#7dd3fc;">tax</span> = Σ over additional-dwelling bands: (min(price, band_upper) − band_lower) × band_rate<br>
      <span style="color:#86efac;">if price &gt; £500,000:</span><br>
      &nbsp;&nbsp;<span style="color:#7dd3fc;">rate</span> = 0.15 + (0.02 <span style="color:#94a3b8;">if non-resident</span>)<br>
      &nbsp;&nbsp;<span style="color:#7dd3fc;">tax</span> = price × rate <span style="color:#94a3b8;">(flat, whole price — not marginal, replaces the banded calculation entirely)</span>
    </div>
    <p style="font-size:0.78rem;color:#94a3b8;margin:12px 0 0;">Unlike every other calculator on this site, the &gt;£500,000 case is not a marginal band calculation — one flat rate applies to the entire price the moment it crosses the threshold.</p>
  </div>

  <h2 class="st">Frequently Asked Questions</h2>
  ${faqHtml}

  <div class="back-links">
    <a href="/">← Main stamp duty calculator</a>
    <a href="/buy-to-let/">Buy-to-let calculator</a>
    <a href="/refund-calculator/">Check refund eligibility →</a>
    <a href="/guides/what-is-stamp-duty/">What is stamp duty? →</a>
  </div>
</div>
</div>
<footer>
  <div class="container">
    <div class="fca-footer"><strong>Disclaimer:</strong> Information only, not tax or legal advice. Assumes no relief applies. Confirm with a solicitor or chartered tax adviser before relying on this figure.</div>
    <p>Data based on 2026 rates · Updated July 2026</p>
  </div>
</footer>
<script>
${CALC_JS}
function calculateCompany() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  const FLAT_RATE_THRESHOLD = 500000;
  const FLAT_RATE = 0.15;
  let tax, rows, note;
  if (price > FLAT_RATE_THRESHOLD) {
    const rate = FLAT_RATE + (nonRes ? NON_RES_SURCHARGE_PP : 0);
    tax = price * rate;
    rows = [{ from: 0, to: price, rate, tax, label: (nonRes ? 'Flat 15% + 2% non-resident' : 'Flat 15%') + ' (Sch 4A FA2003, whole price)' }];
    note = 'Assumes no relief applies — see disclaimer above.';
  } else {
    const result = bandedTax(price, BANDS.england_surcharge);
    tax = result.tax; rows = result.rows;
    if (nonRes) { tax += price * NON_RES_SURCHARGE_PP; rows.push({ from: 0, to: price, rate: NON_RES_SURCHARGE_PP, tax: price * NON_RES_SURCHARGE_PP, label: 'Non-resident surcharge (flat 2%)' }); }
    note = 'At or below £500,000: standard additional-dwelling surcharge bands apply (no flat rate).';
  }
  const effRate = price > 0 ? (tax / price * 100) : 0;
  document.getElementById('r-total').textContent = fmtGBP(tax);
  document.getElementById('r-sub').textContent = 'Limited company / corporate buyer';
  document.getElementById('r-effective').textContent = effRate.toFixed(2) + '%';
  document.getElementById('r-netprice').textContent = fmtGBP(price);
  document.getElementById('r-net').textContent = fmtGBP(price + tax);
  const bb = document.getElementById('bandBreakdown');
  bb.innerHTML = rows.map(r => '<div class="bb-row"><span>' + (r.label || fmtGBP(r.from) + ' – ' + (r.to === Infinity ? '∞' : fmtGBP(r.to)) + ' @ ' + (r.rate*100).toFixed(1) + '%') + '</span><span>' + fmtGBP(r.tax) + '</span></div>').join('') +
    '<div class="bb-row total"><span>Total</span><span>' + fmtGBP(tax) + '</span></div>' +
    '<div class="bb-row" style="color:#94a3b8;font-style:italic;">' + note + '</div>';
  document.getElementById('result').style.display = 'block';
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
</script>
</body>
</html>
`;
}

// ─── Refund calculator — the money page ────────────────────────────────────
const REFUND_PAGE = {
  slug: 'refund-calculator',
  metaTitle: 'Stamp Duty Refund Calculator 2026 — Check If You Overpaid',
  metaDesc: 'Stamp duty refund calculator. Check overpayment risk from second-home surcharge, missed Multiple Dwellings Relief, or incorrect non-resident surcharge.',
  h1: 'Stamp Duty Refund Calculator',
  intro: 'Think you overpaid stamp duty? Recalculate what you should have paid, spot common overpayment triggers, and see if you may be owed money back.',
};

function renderRefundPage() {
  const canonical = `${SITE_URL}/refund-calculator/`;
  const faqs = [
    { q: 'Am I eligible for a stamp duty refund?', a: 'Common triggers: you sold your previous main home within 36 months of paying the second-home surcharge (England/NI SDLT or Scotland ADS), Multiple Dwellings Relief was missed on a qualifying purchase, or a surcharge was applied when it should not have been (e.g. replacing your only home). Use the calculator above to recheck your figure.' },
    { q: 'What is Multiple Dwellings Relief (MDR)?', a: 'MDR can reduce stamp duty when a single transaction includes more than one dwelling — for example a house with a self-contained annexe, or several flats bought together. It is one of the most commonly missed reliefs; if your purchase included more than one dwelling and your solicitor did not mention MDR, it is worth checking.' },
    { q: 'How do I claim a stamp duty refund from HMRC?', a: 'For the England/NI second-home surcharge refund (after selling your previous home within 36 months), you can apply directly via gov.uk or through a specialist reclaim firm on a no-win-no-fee basis. Reclaim firms typically handle the HMRC paperwork for a percentage of the amount recovered.' },
    { q: 'Is there a time limit on stamp duty refund claims?', a: 'Yes. The surcharge refund (selling previous home) must generally be claimed within 12 months of the sale or the SDLT filing deadline, whichever is later. Overpayment claims (e.g. missed MDR) generally have a 4-year window from the effective transaction date. Act promptly if you think you have a claim.' }
  ];
  const faqJsonLd = faqs.map(f => `{ "@type": "Question", "name": ${JSON.stringify(f.q)}, "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a)} } }`).join(',\n        ');
  const faqHtml = faqs.map(f => `
  <div class="faq-item">
    <button class="faq-q" onclick="toggleFaq(this)">${f.q}</button>
    <div class="faq-a">${f.a}</div>
  </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${REFUND_PAGE.metaTitle}</title>
<meta name="description" content="${REFUND_PAGE.metaDesc}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${REFUND_PAGE.metaTitle}">
<meta property="og:description" content="${REFUND_PAGE.metaDesc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${SITE_URL}/og-image.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="${SITE_URL}/og-image.svg">
<meta name="google-site-verification" content="m4ovmDFcrhAbFLC1Ix28d793SYzD--JWQ2n8UtetMSg" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Stamp Duty Refund Calculator", "url": "${canonical}", "description": "${REFUND_PAGE.metaDesc}", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "inLanguage": "en-GB", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }, "areaServed": { "@type": "Country", "name": "United Kingdom" } },
    { "@type": "FAQPage", "mainEntity": [
        ${faqJsonLd}
      ] },
    { "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" }, { "@type": "ListItem", "position": 2, "name": "Stamp Duty Refund Calculator", "item": "${canonical}" } ] }
  ]
}
</script>
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">💷 Overpayment Check · 2026</div>
    <h1>${REFUND_PAGE.h1}</h1>
    <p>${REFUND_PAGE.intro}</p>
  </div>
</header>
<div class="container">
<div class="tool-wrapper">
  <div class="tool-card">
    <div class="form-grid">
      <div class="form-group full">
        <label>Region</label>
        <div class="seg-row" id="regionSeg">
          <button class="active" data-region="england">England / NI (SDLT)</button>
          <button data-region="scotland">Scotland (LBTT)</button>
          <button data-region="wales">Wales (LTT)</button>
        </div>
      </div>
      <div class="form-group full">
        <label>Property Price (£)</label>
        <input type="number" id="price" min="0" step="1000" value="350000" placeholder="e.g. 350000">
      </div>
      <div class="form-group full">
        <label>What you should have been classed as</label>
        <div class="seg-row" id="buyerSeg">
          <button class="active" data-buyer="main">Only / main home</button>
          <button data-buyer="ftb">First-time buyer</button>
          <button data-buyer="additional">Second home / buy-to-let</button>
        </div>
      </div>
      <div class="form-group full" id="nonResWrap">
        <label>Non-UK resident? <span class="hint">— adds England/NI surcharge only</span></label>
        <div class="seg-row">
          <button class="active" id="nonResNo" onclick="setNonRes(false)">No</button>
          <button id="nonResYes" onclick="setNonRes(true)">Yes</button>
        </div>
      </div>
      <div class="form-group full">
        <label>Amount you were actually charged (£)</label>
        <input type="number" id="chargedAmount" min="0" step="100" placeholder="e.g. 20000">
      </div>
    </div>
    <button class="calc-btn" onclick="calculateRefund()">Check Refund Eligibility →</button>

    <div class="result" id="result">
      <div class="result-hero" id="refundHero">
        <div class="rl">Correct Stamp Duty (recalculated)</div>
        <div class="ra" id="r-total"></div>
        <div class="rs" id="r-sub"></div>
      </div>
      <div class="result-grid">
        <div class="r-stat"><div class="sv" id="r-effective"></div><div class="sl">Effective rate</div></div>
        <div class="r-stat"><div class="sv" id="r-charged"></div><div class="sl">You were charged</div></div>
        <div class="r-stat"><div class="sv" id="r-diff"></div><div class="sl">Potential refund</div></div>
      </div>
      <div class="band-breakdown" id="bandBreakdown"></div>
      <div class="fca-notice">ℹ️ <strong>Disclaimer:</strong> This is an estimate only, not a guarantee of eligibility or amount. Overpayment claims depend on your exact circumstances, filing deadlines (typically 12 months for surcharge refunds, 4 years for other overpayment claims), and HMRC/Revenue Scotland/Welsh Revenue Authority review. Consult a solicitor or reclaim specialist before submitting a claim.</div>
    </div>
  </div>
</div>

<div class="content">
  <h2 class="st">Common Stamp Duty Overpayment Triggers</h2>
  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Trigger</th><th>What happened</th><th>Fix</th></tr></thead>
    <tbody>
      <tr><td>Second-home surcharge, then sold old home</td><td>Surcharge paid on completion because you temporarily owned two properties</td><td>Reclaim within 36 months of selling the previous main residence</td></tr>
      <tr><td>Multiple Dwellings Relief missed</td><td>Purchase included an annexe/granny flat or multiple units, but MDR was not applied</td><td>Reclaim within 4 years of the transaction</td></tr>
      <tr><td>Non-resident surcharge wrongly applied</td><td>Charged the 2% non-resident surcharge despite qualifying UK residence tests</td><td>Reclaim on review of residence status at the time of purchase</td></tr>
      <tr><td>Wrong band/rate used by conveyancer</td><td>Simple calculation error on the SDLT/LBTT/LTT return</td><td>Amend the return or reclaim the difference</td></tr>
    </tbody>
  </table></div>

  <div class="satellite-cta">
    <h3 style="margin-bottom:8px;">Think you're owed money back?</h3>
    <p style="margin-bottom:0;">You can apply directly to HMRC for a stamp duty repayment — no need to pay anyone a fee to do this for you.</p>
    <!-- TODO: swap for confirmed reclaim-firm affiliate link + verified commission terms once a partner is signed -->
    <a href="https://www.gov.uk/guidance/stamp-duty-land-tax-apply-for-a-repayment" rel="noopener" target="_blank">How to Apply for a Repayment on gov.uk →</a>
  </div>

  <h2 class="st">Frequently Asked Questions</h2>
  ${faqHtml}

  <div class="back-links">
    <a href="/">← Main stamp duty calculator</a>
    <a href="/second-home/">Second home calculator</a>
    <a href="/buy-to-let/">Buy-to-let calculator</a>
    <a href="/guides/stamp-duty-payment-deadlines/">Payment deadlines →</a>
  </div>
</div>
</div>
<footer>
  <div class="container">
    <div class="fca-footer"><strong>Disclaimer:</strong> Information only, not tax or legal advice. Refund estimates are not a guarantee of eligibility or amount. Confirm with a solicitor or reclaim specialist.</div>
    <p>Data based on 2026 rates · Updated July 2026</p>
  </div>
</footer>
<script>
${CALC_JS}
function calculateRefund() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  const charged = parseFloat(document.getElementById('chargedAmount').value) || 0;
  let result;
  if (region === 'england') result = calcEngland(price, buyer, nonRes);
  else if (region === 'scotland') result = calcScotland(price, buyer);
  else result = calcWales(price, buyer);
  const effRate = price > 0 ? (result.tax / price * 100) : 0;
  const diff = charged - result.tax;

  document.getElementById('r-total').textContent = fmtGBP(result.tax);
  document.getElementById('r-sub').textContent = regionLabel(region) + ' · ' + buyerLabel(buyer) + ' (correct classification)';
  document.getElementById('r-effective').textContent = effRate.toFixed(2) + '%';
  document.getElementById('r-charged').textContent = fmtGBP(charged);
  document.getElementById('r-diff').textContent = diff > 0 ? fmtGBP(diff) : '£0';

  const hero = document.getElementById('refundHero');
  if (diff > 0) {
    hero.querySelector('.rl').textContent = 'You May Be Owed Back';
    document.getElementById('r-total').textContent = fmtGBP(diff);
  } else {
    hero.querySelector('.rl').textContent = 'Correct Stamp Duty (recalculated)';
  }

  const bb = document.getElementById('bandBreakdown');
  bb.innerHTML = result.rows.map(r => '<div class="bb-row"><span>' + (r.label || fmtGBP(r.from) + ' – ' + (r.to === Infinity ? '∞' : fmtGBP(r.to)) + ' @ ' + (r.rate*100).toFixed(1) + '%') + '</span><span>' + fmtGBP(r.tax) + '</span></div>').join('') +
    '<div class="bb-row total"><span>Correct amount owed</span><span>' + fmtGBP(result.tax) + '</span></div>' +
    '<div class="bb-row"><span>Amount actually charged</span><span>' + fmtGBP(charged) + '</span></div>' +
    (diff > 0 ? '<div class="bb-row total" style="color:#e63946;"><span>Potential refund</span><span>' + fmtGBP(diff) + '</span></div>' : '<div class="bb-row" style="color:#94a3b8;font-style:italic;">No overpayment detected based on the figures entered.</div>');

  document.getElementById('result').style.display = 'block';
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
</script>
</body>
</html>
`;
}

// ─── Embeddable widget (iframe target — noindex, no chrome) ───────────────
function renderWidgetPage() {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stamp Duty Calculator Widget</title>
<meta name="robots" content="noindex, nofollow">
<style>
  ${CSS}
  body { background: transparent; }
  .tool-card { box-shadow: none; border: 1px solid var(--border); }
  .container { max-width: none; padding: 0; }
</style>
</head>
<body>
<div class="container">
  <div class="tool-card">
    ${toolMarkup('england', false)}
  </div>
</div>
<script>${CALC_JS}</script>
<script>
function reportHeight() {
  const h = document.body.scrollHeight;
  if (window.parent) window.parent.postMessage({ checkStampDutyWidgetHeight: h }, '*');
}
window.addEventListener('load', reportHeight);
new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
</script>
</body>
</html>
`;
}

// ─── Embed instructions page ────────────────────────────────────────────────
function renderEmbedPage() {
  const canonical = `${SITE_URL}/embed/`;
  const iframeSnippet = `<iframe src="${SITE_URL}/widget/" style="width:100%;border:none;" height="620" id="csd-widget" title="Stamp Duty Calculator"></iframe>
<script>
window.addEventListener('message', function (e) {
  if (e.data && e.data.checkStampDutyWidgetHeight) {
    document.getElementById('csd-widget').style.height = e.data.checkStampDutyWidgetHeight + 'px';
  }
});
</script>`;
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Embed the Stamp Duty Calculator on Your Site — Free Widget</title>
<meta name="description" content="Free embeddable stamp duty calculator widget for mortgage brokers, conveyancers and property blogs. Copy-paste iframe snippet, auto-resizing, no signup.">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<meta name="google-site-verification" content="m4ovmDFcrhAbFLC1Ix28d793SYzD--JWQ2n8UtetMSg" />
<style>${CSS}
  .snippet { background: #12321f; color: #e2e8f0; border-radius: 8px; padding: 18px 20px; font-family: 'Courier New', monospace; font-size: 0.82rem; line-height: 1.7; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">🔌 Free Embed · 2026</div>
    <h1>Embed This Stamp Duty Calculator On Your Site</h1>
    <p>Free for mortgage brokers, conveyancers and property blogs. Copy the snippet below — it auto-resizes to fit its content.</p>
  </div>
</header>
<div class="container">
<div class="content" style="padding-top:40px;">
  <h2 class="st">Copy-Paste Snippet</h2>
  <p>Paste this wherever you want the calculator to appear. It's a plain iframe with no tracking beyond what your own site already loads.</p>
  <div class="snippet">${iframeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <h2 class="st">Why Embed It</h2>
  <p>Give visitors an instant SDLT/LBTT/LTT figure without sending them to a third-party site. The widget covers England/NI, Scotland and Wales, first-time-buyer relief, and second-home/buy-to-let surcharges — same calculation engine as the full calculator.</p>
  <p style="font-size:.82rem;color:var(--muted);">Free to use, no attribution required. If you'd like a co-branded or white-label version, get in touch via the contact details in the site footer.</p>
  <div class="back-links">
    <a href="/">← Main stamp duty calculator</a>
  </div>
</div>
</div>
<footer>
  <div class="container">
    <p>Data based on 2026 rates · Updated July 2026</p>
  </div>
</footer>
</body>
</html>
`;
}

// ─── Write satellite pages ──────────────────────────────────────────────────
for (const sat of SATELLITES) {
  const dir = path.join(ROOT, sat.slug);
  fs.mkdirSync(dir, { recursive: true });
  const html = pageShell({
    slug: sat.slug,
    title: sat.title,
    metaTitle: sat.metaTitle,
    metaDesc: sat.metaDesc,
    h1: sat.h1,
    intro: sat.intro,
    regionDefault: sat.regionDefault,
    nonResDefault: sat.nonResDefault,
    extraContent: sat.extraContent,
    faqs: sat.faqs,
    canonicalPath: `/${sat.slug}/`,
    guideLinks: sat.guideLinks
  });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('Wrote', sat.slug + '/index.html');
}

// ─── Write refund-calculator page ──────────────────────────────────────────
const refundDir = path.join(ROOT, 'refund-calculator');
fs.mkdirSync(refundDir, { recursive: true });
fs.writeFileSync(path.join(refundDir, 'index.html'), renderRefundPage());
console.log('Wrote refund-calculator/index.html');

// ─── Write limited-company page ────────────────────────────────────────────
const limitedCompanyDir = path.join(ROOT, 'limited-company');
fs.mkdirSync(limitedCompanyDir, { recursive: true });
fs.writeFileSync(path.join(limitedCompanyDir, 'index.html'), renderLimitedCompanyPage());
console.log('Wrote limited-company/index.html');

// ─── Write widget + embed pages ─────────────────────────────────────────────
const widgetDir = path.join(ROOT, 'widget');
fs.mkdirSync(widgetDir, { recursive: true });
fs.writeFileSync(path.join(widgetDir, 'index.html'), renderWidgetPage());
console.log('Wrote widget/index.html');

const embedDir = path.join(ROOT, 'embed');
fs.mkdirSync(embedDir, { recursive: true });
fs.writeFileSync(path.join(embedDir, 'index.html'), renderEmbedPage());
console.log('Wrote embed/index.html');

// ─── sitemap.xml ────────────────────────────────────────────────────────────
// widget/ is excluded (noindex, meant for iframe embedding only, not a landing page).
const urls = ['/', ...SATELLITES.map(s => `/${s.slug}/`), '/refund-calculator/', '/limited-company/', '/embed/'];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('Wrote sitemap.xml with', urls.length, 'URLs');
