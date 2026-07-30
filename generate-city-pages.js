// Generates cities/<slug>/index.html for each city in city-data.js.
// CSS and CALC_JS are duplicated from generate-pages.js (same convention as
// index.html/generate-pages.js already use) — keep BANDS/CSS in sync across
// all three files if either changes.
const fs = require('fs');
const path = require('path');
const CITIES = require('./city-data.js');

const SITE_URL = 'https://checkstampduty.co.uk';
const ROOT = __dirname;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --brand: #0f6e4f; --brand-dark: #0a4d38; --brand-light: #e6f5ee;
    --accent: #e63946; --text: #1a1a2e; --muted: #64748b;
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
  .local-note { background: white; border: 1px solid var(--border); border-left: 4px solid var(--brand); border-radius: 8px; padding: 18px 20px; margin: 20px 0; font-size: 0.92rem; }
  .source-tag { font-size: 0.72rem; color: var(--muted); margin-top: -8px; margin-bottom: 20px; }
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

let region = 'england', buyer = 'main', nonRes = false;

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

const NATION_LABEL = { england: 'England / NI (SDLT)', scotland: 'Scotland (LBTT)', wales: 'Wales (LTT)' };
const NATION_TAX_NAME = { england: 'SDLT', scotland: 'LBTT', wales: 'LTT' };

// Nation-specific band recap — real content variance, not a name find&replace.
const NATION_RECAP = {
  england: `<h2 class="st">England/NI SDLT Bands 2026</h2>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Band</th><th>Standard rate</th><th>First-time buyer</th></tr></thead>
      <tbody>
        <tr><td>Up to £125,000</td><td>0%</td><td>0% (up to £300k)</td></tr>
        <tr><td>£125,001 – £250,000</td><td>2%</td><td>0% (up to £300k)</td></tr>
        <tr><td>£250,001 – £925,000</td><td>5%</td><td>5% (from £300k to £500k, no relief above)</td></tr>
        <tr><td>£925,001 – £1.5m</td><td>10%</td><td>10%</td></tr>
        <tr><td>Above £1.5m</td><td>12%</td><td>12%</td></tr>
      </tbody>
    </table></div>`,
  scotland: `<h2 class="st">Scotland LBTT Bands 2026</h2>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Band</th><th>Standard rate</th><th>First-time buyer</th></tr></thead>
      <tbody>
        <tr><td>Up to £145,000</td><td>0%</td><td>0% (up to £175k)</td></tr>
        <tr><td>£145,001 – £250,000</td><td>2%</td><td>2%</td></tr>
        <tr><td>£250,001 – £325,000</td><td>5%</td><td>5%</td></tr>
        <tr><td>£325,001 – £750,000</td><td>10%</td><td>10%</td></tr>
        <tr><td>Above £750,000</td><td>12%</td><td>12%</td></tr>
      </tbody>
    </table></div>
    <p>Additional Dwelling Supplement (ADS) adds a flat <strong>8%</strong> for second homes/buy-to-lets.</p>`,
  wales: `<h2 class="st">Wales LTT Bands 2026</h2>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Band</th><th>Standard rate</th></tr></thead>
      <tbody>
        <tr><td>Up to £225,000</td><td>0%</td></tr>
        <tr><td>£225,001 – £400,000</td><td>6%</td></tr>
        <tr><td>£400,001 – £750,000</td><td>7.5%</td></tr>
        <tr><td>£750,001 – £1.5m</td><td>10%</td></tr>
        <tr><td>Above £1.5m</td><td>12%</td></tr>
      </tbody>
    </table></div>
    <p>Wales abolished first-time buyer relief in 2018 — first-time buyers pay standard rates.</p>`
};

function toolMarkup(regionDefault, defaultPrice) {
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
        <input type="number" id="price" min="0" step="1000" value="${defaultPrice}" placeholder="e.g. ${defaultPrice}">
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
          <button class="active" id="nonResNo" onclick="setNonRes(false)">No</button>
          <button id="nonResYes" onclick="setNonRes(true)">Yes</button>
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
      <div class="refund-nudge" id="refundNudge">
        ⚠️ <strong>Overpayment risk:</strong> <span id="refundReason"></span> — <a href="/refund-calculator/">check refund eligibility →</a>
      </div>
      <div class="fca-notice">ℹ️ <strong>Disclaimer:</strong> This tool provides information only and does not constitute tax or legal advice. For a binding figure, consult a solicitor/conveyancer or use the official <a href="https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro" target="_blank" rel="noopener">HMRC SDLT calculator</a>.</div>
    </div>`;
}

function renderCityPage(city) {
  const canonical = `${SITE_URL}/cities/${city.slug}/`;
  const taxName = NATION_TAX_NAME[city.nation];
  const metaTitle = `Stamp Duty Calculator ${city.name} 2026 — ${taxName} Instant Figure`;
  const metaDesc = `Free stamp duty calculator for ${city.name}. Get your exact ${taxName} figure instantly, plus ${city.name}'s real average property price (${city.avgPriceSource}, ${city.avgPriceDate}).`;
  const h1 = `Stamp Duty Calculator ${city.name}`;
  const intro = `Buying in ${city.name}? Enter your property price below for an instant ${taxName} figure — pre-filled with ${city.name}'s current average property price.`;

  const faqs = [
    { q: `How much is stamp duty in ${city.name}?`, a: `It depends on the price, buyer type and region. ${city.name}'s average property price is ${'£' + city.avgPrice.toLocaleString()} (${city.avgPriceSource}, ${city.avgPriceDate}) — enter your own price above for an exact ${taxName} figure.` },
    city.faqExtra,
    { q: `Does ${city.name} have any local stamp duty rates?`, a: `No — ${taxName} bands are set nationally (${NATION_LABEL[city.nation]}), not by city. ${city.name} doesn't have its own rates; what varies locally is the average property price, which changes how much tax a typical purchase attracts.` }
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
    { "@type": "WebApplication", "name": "${h1}", "url": "${canonical}", "description": "${metaDesc}", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "inLanguage": "en-GB", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }, "areaServed": { "@type": "City", "name": "${city.name}" } },
    { "@type": "FAQPage", "mainEntity": [
        ${faqJsonLd}
      ] },
    { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" },
        { "@type": "ListItem", "position": 2, "name": "Cities", "item": "${SITE_URL}/cities/" },
        { "@type": "ListItem", "position": 3, "name": "${city.name}", "item": "${canonical}" }
      ] }
  ]
}
</script>
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">📍 ${city.name} · 2026 Rates</div>
    <h1>${h1}</h1>
    <p>${intro}</p>
  </div>
</header>
<div class="container">
<div class="tool-wrapper">
  <div class="tool-card">
    ${toolMarkup(city.nation, city.avgPrice)}
  </div>
</div>
<div class="content">
  <div class="local-note">${city.localNote}</div>
  <div class="source-tag">Average price source: ${city.avgPriceSource}, ${city.avgPriceDate}.</div>
  ${NATION_RECAP[city.nation]}
  <h2 class="st">Frequently Asked Questions</h2>
  ${faqHtml}
  <div class="back-links">
    <a href="/">← Main stamp duty calculator</a>
    <a href="/cities/">All cities</a>
    <a href="${city.relatedSatellite.href}">${city.relatedSatellite.label}</a>
    <a href="/guides/what-is-stamp-duty/">What is stamp duty? →</a>
  </div>
</div>
</div>
<footer>
  <div class="container">
    <div class="fca-footer"><strong>Disclaimer:</strong> This tool provides information only and does not constitute tax or legal advice. Figures based on 2026 HMRC/Revenue Scotland/Welsh Revenue Authority published rates. For a binding calculation, consult a solicitor/conveyancer or the official <a href="https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro">HMRC SDLT calculator</a>.</div>
    <p>Data based on 2026 rates · Updated July 2026</p>
  </div>
</footer>
<script>${CALC_JS}</script>
</body>
</html>
`;
}

function renderCitiesIndex() {
  const canonical = `${SITE_URL}/cities/`;
  const cards = CITIES.map(c => `
    <a href="/cities/${c.slug}/" class="back-links" style="display:block;margin:0 0 12px;">
      <strong>Stamp Duty Calculator ${c.name}</strong><br><span style="font-size:.85rem;color:var(--muted);">Average price ${'£' + c.avgPrice.toLocaleString()} (${c.avgPriceSource}, ${c.avgPriceDate}) — ${NATION_LABEL[c.nation]}</span>
    </a>`).join('');
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stamp Duty Calculator By City — 2026</title>
<meta name="description" content="Stamp duty calculators for UK cities, pre-filled with each city's real average property price. London, Manchester, Birmingham, Edinburgh, Cardiff.">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<meta name="google-site-verification" content="m4ovmDFcrhAbFLC1Ix28d793SYzD--JWQ2n8UtetMSg" />
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">📍 By City</div>
    <h1>Stamp Duty Calculator By City</h1>
    <p>Pre-filled with each city's real average property price, sourced and dated.</p>
  </div>
</header>
<div class="container">
<div class="content">
  ${cards}
  <div class="back-links"><a href="/">← Main stamp duty calculator</a></div>
</div>
</div>
<footer><div class="container"><p>Updated July 2026</p></div></footer>
</body>
</html>
`;
}

for (const city of CITIES) {
  const dir = path.join(ROOT, 'cities', city.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderCityPage(city));
  console.log('Wrote cities/' + city.slug + '/index.html');
}

const citiesIndexDir = path.join(ROOT, 'cities');
fs.mkdirSync(citiesIndexDir, { recursive: true });
fs.writeFileSync(path.join(citiesIndexDir, 'index.html'), renderCitiesIndex());
console.log('Wrote cities/index.html');

// ─── Merge city URLs into sitemap.xml (generate-pages.js writes it first) ──
const sitemapPath = path.join(ROOT, 'sitemap.xml');
const existing = fs.readFileSync(sitemapPath, 'utf8');
const cityUrls = ['/cities/', ...CITIES.map(c => `/cities/${c.slug}/`)];
const newUrlLines = cityUrls
  .filter(u => !existing.includes(`<loc>${SITE_URL}${u}</loc>`))
  .map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`)
  .join('\n');
const merged = newUrlLines
  ? existing.replace('</urlset>', `${newUrlLines}\n</urlset>`)
  : existing;
fs.writeFileSync(sitemapPath, merged);
console.log('Merged', cityUrls.length, 'city URLs into sitemap.xml');
