// Generates the guides/ directory — evergreen informational content, no
// calculator on these pages (link back to the relevant calculator instead).
// CSS is a trimmed duplicate of the one in generate-pages.js/index.html —
// keep visual tokens (colors, spacing) in sync if either changes.
const fs = require('fs');
const path = require('path');

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
  header { background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 100%); color: white; padding: 52px 20px 40px; text-align: center; }
  header .badge { display: inline-block; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); border-radius: 20px; padding: 4px 14px; font-size: 0.78rem; font-weight: 600; letter-spacing: .4px; margin-bottom: 16px; }
  header h1 { font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 800; margin-bottom: 12px; }
  header p { color: rgba(255,255,255,.9); font-size: 1rem; max-width: 620px; margin: 0 auto; }
  .container { max-width: 780px; margin: 0 auto; padding: 0 20px; }
  .content { padding: 44px 0 64px; }
  h2.st { font-size: 1.3rem; font-weight: 800; margin: 40px 0 16px; }
  h2.st:first-child { margin-top: 0; }
  h3.sub { font-size: 1rem; font-weight: 700; margin: 24px 0 10px; }
  p { color: #374151; margin-bottom: 14px; line-height: 1.75; }
  ul, ol { color: #374151; margin: 0 0 14px 22px; line-height: 1.75; }
  li { margin-bottom: 6px; }
  .table-wrap { overflow-x: auto; margin: 20px 0; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .data-table th { background: var(--brand); color: white; padding: 10px 14px; text-align: left; font-weight: 600; white-space: nowrap; }
  .data-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .data-table tr:nth-child(even) td { background: #f8faff; }
  .highlight { font-weight: 700; color: var(--brand); }
  .callout { background: white; border: 1px solid var(--border); border-left: 4px solid var(--brand); border-radius: 8px; padding: 18px 20px; margin: 20px 0; font-size: 0.92rem; }
  .cta-inline { background: #fff7ed; border: 1px solid #fed7aa; border-radius: var(--radius); padding: 20px 22px; margin: 32px 0; }
  .cta-inline a { color: var(--accent); font-weight: 700; text-decoration: none; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-q { width: 100%; background: none; border: none; text-align: left; padding: 18px 0; font-size: 0.92rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: var(--text); }
  .faq-q::after { content: '+'; font-size: 1.3rem; color: var(--brand); flex-shrink: 0; margin-left: 12px; }
  .faq-q.open::after { content: '−'; }
  .faq-a { display: none; padding: 0 0 16px; font-size: 0.88rem; color: #4b5563; line-height: 1.75; }
  .faq-a.open { display: block; }
  .back-links { display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0 40px; }
  .back-links a { background: white; border: 1px solid var(--border); border-radius: 8px; padding: 10px 16px; text-decoration: none; color: var(--text); font-size: 0.85rem; font-weight: 600; }
  footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 32px 20px; font-size: 0.8rem; }
  footer p { color: #94a3b8; }
  footer a { color: #cbd5e1; }
  .fca-footer { background: #1e293b; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px; font-size: 0.78rem; color: #94a3b8; line-height: 1.6; }
`;

const TOGGLE_FAQ_JS = `function toggleFaq(btn) { btn.classList.toggle('open'); btn.nextElementSibling.classList.toggle('open'); }`;

function guideShell({ slug, title, metaTitle, metaDesc, h1, badge, intro, body, faqs, relatedLinks }) {
  const canonical = `${SITE_URL}/guides/${slug}/`;
  const faqJsonLd = faqs.map(f => `{ "@type": "Question", "name": ${JSON.stringify(f.q)}, "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a)} } }`).join(',\n        ');
  const faqHtml = faqs.map(f => `
  <div class="faq-item">
    <button class="faq-q" onclick="toggleFaq(this)">${f.q}</button>
    <div class="faq-a">${f.a}</div>
  </div>`).join('');
  const relatedHtml = relatedLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n    ');

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
<meta property="og:type" content="article">
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
    { "@type": "FAQPage", "mainEntity": [
        ${faqJsonLd}
      ] },
    { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "${SITE_URL}/guides/" },
        { "@type": "ListItem", "position": 3, "name": "${title}", "item": "${canonical}" }
      ] }
  ]
}
</script>
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">${badge}</div>
    <h1>${h1}</h1>
    <p>${intro}</p>
  </div>
</header>
<div class="container">
<div class="content">
  ${body}
  <h2 class="st">Frequently Asked Questions</h2>
  ${faqHtml}
  <div class="back-links">
    <a href="/">← Main stamp duty calculator</a>
    <a href="/guides/">All guides</a>
    ${relatedHtml}
  </div>
</div>
</div>
<footer>
  <div class="container">
    <div class="fca-footer"><strong>Disclaimer:</strong> Information only, not tax or legal advice. Figures based on 2026 HMRC/Revenue Scotland/Welsh Revenue Authority published rates. Confirm with a solicitor/conveyancer or the official <a href="https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro">HMRC SDLT calculator</a>.</div>
    <p>Updated July 2026</p>
  </div>
</footer>
<script>${TOGGLE_FAQ_JS}</script>
</body>
</html>
`;
}

const GUIDES = [
  {
    slug: 'what-is-stamp-duty',
    title: 'What Is Stamp Duty?',
    metaTitle: 'What Is Stamp Duty? SDLT, LBTT &amp; LTT Explained (2026)',
    metaDesc: 'What is stamp duty and who pays it? Plain-English guide to SDLT (England/NI), LBTT (Scotland) and LTT (Wales), with a free calculator.',
    h1: 'What Is Stamp Duty?',
    badge: '📘 Guide · 2026',
    intro: 'A plain-English explanation of the tax you pay when buying property in the UK — and why it goes by three different names.',
    body: `
      <h2 class="st">The Short Answer</h2>
      <p>Stamp duty is a tax you pay to the government when you buy property or land above a certain price. Despite the single name, it's actually three separate taxes depending on where the property is:</p>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Nation</th><th>Tax name</th><th>Collected by</th></tr></thead>
        <tbody>
          <tr><td>England &amp; Northern Ireland</td><td class="highlight">Stamp Duty Land Tax (SDLT)</td><td>HMRC</td></tr>
          <tr><td>Scotland</td><td class="highlight">Land and Buildings Transaction Tax (LBTT)</td><td>Revenue Scotland</td></tr>
          <tr><td>Wales</td><td class="highlight">Land Transaction Tax (LTT)</td><td>Welsh Revenue Authority</td></tr>
        </tbody>
      </table></div>
      <p>All three work the same basic way: the tax is calculated in bands (like income tax), so you pay a different rate on each slice of the price, not one flat rate on the whole amount.</p>
      <h2 class="st">Who Pays It, and When?</h2>
      <p>The buyer pays stamp duty, not the seller. It's normally handled by your solicitor or conveyancer as part of the purchase, and must be paid within a set number of days of completion (see our <a href="/guides/stamp-duty-payment-deadlines/">payment deadlines guide</a>).</p>
      <h2 class="st">Does Everyone Pay the Same Rate?</h2>
      <p>No — the rate depends on the property price, whether it's your only/main home, whether you're a first-time buyer, and whether you already own another residential property. Buying a second home or via a limited company changes the calculation significantly — see our <a href="/second-home/">second home</a>, <a href="/non-resident/">non-resident</a> and <a href="/limited-company/">limited company</a> calculators for those specific scenarios.`,
    faqs: [
      { q: 'Is stamp duty the same across the whole UK?', a: 'No. England and Northern Ireland share SDLT. Scotland has its own LBTT, and Wales has its own LTT. Each has different bands, thresholds and reliefs.' },
      { q: 'Do I pay stamp duty on every property purchase?', a: 'Only above the nil-rate threshold for your nation and buyer type. Below that threshold, no stamp duty is due. Use the calculator to check your exact figure.' },
      { q: 'Does the seller pay any stamp duty?', a: 'No — stamp duty on a property purchase is always paid by the buyer, not the seller.' }
    ],
    relatedLinks: [ { href: '/threshold/', label: 'Threshold tables' }, { href: '/first-time-buyer/', label: 'First-time buyer calculator' } ]
  },
  {
    slug: 'stamp-duty-changes-2025',
    title: 'Stamp Duty Changes 2025 — What Changed on 1 April',
    metaTitle: 'Stamp Duty Changes 2025 — Timeline of SDLT Threshold Cuts',
    metaDesc: 'What changed in stamp duty on 1 April 2025: nil-rate threshold back to £125,000, first-time buyer relief cut to £300,000. Full timeline and figures.',
    h1: 'Stamp Duty Changes 2025',
    badge: '📰 Timeline · Updated 2026',
    intro: 'On 1 April 2025, temporary SDLT thresholds introduced in 2022 reverted to their earlier levels — here’s exactly what changed.',
    body: `
      <h2 class="st">What Changed on 1 April 2025</h2>
      <p>SDLT nil-rate thresholds that had been temporarily raised in September 2022 reverted to their previous, lower levels for any purchase completing on or after 1 April 2025:</p>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Threshold</th><th>Before 1 Apr 2025</th><th>From 1 Apr 2025</th></tr></thead>
        <tbody>
          <tr><td>Standard nil-rate band</td><td>£250,000</td><td class="highlight">£125,000</td></tr>
          <tr><td>First-time buyer nil-rate band</td><td>£425,000</td><td class="highlight">£300,000</td></tr>
          <tr><td>First-time buyer relief upper limit</td><td>£625,000</td><td class="highlight">£500,000</td></tr>
        </tbody>
      </table></div>
      <p>This only affects England and Northern Ireland (SDLT). Scotland's LBTT and Wales's LTT thresholds were not part of this change.</p>
      <h2 class="st">Real Impact Example</h2>
      <p>A first-time buyer completing on a £500,000 property on 30 March 2025 (before the change) paid £3,750 in SDLT. Completing on the same property from 1 April 2025 onward, the bill jumps to £10,000 — a direct result of the lower nil-rate band and reduced upper relief limit.</p>
      <p>These are the thresholds already used by the calculators on this site — see the <a href="/threshold/">full threshold tables</a> or the <a href="/first-time-buyer/">first-time buyer calculator</a> for your exact figure under current rules.</p>
      <div class="callout">This page will be updated whenever HMRC announces further threshold or rate changes (e.g. at a Budget) — bookmark it for the latest figures.</div>`,
    faqs: [
      { q: 'When did the 2025 stamp duty changes take effect?', a: 'For any transaction with an effective date (usually completion) on or after 1 April 2025. Transactions completing on or before 31 March 2025 used the higher, temporary thresholds.' },
      { q: 'Did the 2025 changes affect Scotland or Wales?', a: 'No — this reversion only applied to SDLT (England/NI). LBTT (Scotland) and LTT (Wales) thresholds were unaffected by this specific change.' },
      { q: 'Why did the thresholds go down instead of up?', a: 'The higher thresholds introduced in September 2022 were always legislated as temporary, due to expire on 31 March 2025. The 2025 change was this expiry taking effect, reverting to the prior permanent thresholds — not a new tax rise.' }
    ],
    relatedLinks: [ { href: '/threshold/', label: 'Threshold tables' }, { href: '/first-time-buyer/', label: 'First-time buyer calculator' } ]
  },
  {
    slug: 'stamp-duty-payment-deadlines',
    title: 'Stamp Duty Payment Deadlines',
    metaTitle: 'Stamp Duty Payment Deadlines 2026 — 14 or 30 Days?',
    metaDesc: 'How long do you have to pay stamp duty after completion? 14 days for SDLT (England/NI), 30 days for LBTT (Scotland) and LTT (Wales) — and what happens if you miss it.',
    h1: 'Stamp Duty Payment Deadlines',
    badge: '⏱️ Guide · 2026',
    intro: 'Miss the deadline and HMRC, Revenue Scotland or the Welsh Revenue Authority can charge interest and penalties — here’s exactly how long you have.',
    body: `
      <h2 class="st">Deadlines by Nation</h2>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Nation</th><th>Tax</th><th>Deadline from completion</th></tr></thead>
        <tbody>
          <tr><td>England / NI</td><td>SDLT</td><td class="highlight">14 days</td></tr>
          <tr><td>Scotland</td><td>LBTT</td><td class="highlight">30 days</td></tr>
          <tr><td>Wales</td><td>LTT</td><td class="highlight">30 days</td></tr>
        </tbody>
      </table></div>
      <p>In practice, your solicitor or conveyancer usually files the return and pays the tax on your behalf out of funds held for completion — but the legal responsibility to file and pay on time is yours as the buyer.</p>
      <h2 class="st">What Happens If You're Late</h2>
      <p>Missing the deadline can trigger both a fixed penalty and daily interest on the unpaid amount, even if the return itself was filed on time but payment lagged. If you're using a solicitor, confirm with them in writing that the return has been filed and payment made — don't assume.</p>
      <div class="cta-inline">Bought via a second home, non-resident, or limited-company route? Those calculations carry their own filing nuances — check the <a href="/second-home/">second home</a>, <a href="/non-resident/">non-resident</a> or <a href="/limited-company/">limited company</a> calculator for the specific figure due.</div>`,
    faqs: [
      { q: 'How many days do I have to pay stamp duty in England?', a: '14 days from the effective date of the transaction (usually completion) for SDLT in England and Northern Ireland.' },
      { q: 'Is the deadline different in Scotland and Wales?', a: 'Yes — both LBTT (Scotland) and LTT (Wales) give 30 days from completion, more than double the SDLT deadline in England/NI.' },
      { q: 'Who is responsible for paying stamp duty on time?', a: 'Legally, the buyer is responsible, even though a solicitor or conveyancer usually handles the filing and payment in practice. Always get written confirmation that it has been done.' }
    ],
    relatedLinks: [ { href: '/scotland/', label: 'Scotland LBTT calculator' }, { href: '/wales/', label: 'Wales LTT calculator' }, { href: '/refund-calculator/', label: 'Refund calculator' } ]
  },
  {
    slug: 'adding-stamp-duty-to-mortgage',
    title: 'Adding Stamp Duty to Your Mortgage',
    metaTitle: 'Can You Add Stamp Duty to Your Mortgage? 2026 Guide',
    metaDesc: 'Can you borrow to cover stamp duty instead of paying cash? How it affects your loan-to-value, monthly payments and total interest cost.',
    h1: 'Adding Stamp Duty to Your Mortgage',
    badge: '🏦 Guide · 2026',
    intro: 'Stamp duty must be paid upfront in cash — but some buyers borrow more to cover it. Here’s how that actually works and what it costs.',
    body: `
      <h2 class="st">Stamp Duty Isn't Paid "Through" the Mortgage</h2>
      <p>Stamp duty itself must be paid as a cash lump sum on completion — lenders don't pay it directly. What buyers actually mean by "adding it to the mortgage" is borrowing a larger amount overall (increasing the loan) so that the cash they need to bring to completion is reduced by roughly the stamp duty amount.</p>
      <h2 class="st">Why This Costs More Than It Looks</h2>
      <p>Borrowing an extra amount to cover stamp duty means paying mortgage interest on that amount for the life of the loan — often 20-30 years. A stamp duty bill of a few thousand pounds paid in cash becomes a few thousand pounds plus decades of compounding interest if rolled into the mortgage instead.</p>
      <p>It can also push your loan-to-value (LTV) into a higher bracket, which may mean a worse interest rate on the whole mortgage, not just the extra borrowed amount — so the true cost can be larger than the extra interest on the stamp duty portion alone.</p>
      <h2 class="st">When It Can Make Sense</h2>
      <ul>
        <li>You have the deposit and affordability for the higher loan amount but limited additional cash reserves</li>
        <li>The alternative is delaying the purchase or missing out on a property</li>
        <li>You've compared the total cost (extra interest over the mortgage term) against the cost of raising the cash another way</li>
      </ul>
      <p>Always run the numbers with a mortgage broker before deciding — see our <a href="https://www.habito.com/" target="_blank" rel="noopener sponsored">mortgage comparison</a> link, or start with your exact stamp duty figure on the <a href="/">main calculator</a>.</p>`,
    faqs: [
      { q: 'Can I pay stamp duty directly from my mortgage?', a: 'Not directly — stamp duty is paid as a cash lump sum on completion. What people mean by "adding it to the mortgage" is borrowing more overall so less cash is needed upfront, which increases the loan amount and the interest paid over time.' },
      { q: 'Does borrowing more for stamp duty affect my mortgage rate?', a: 'It can. Borrowing more relative to the property value raises your loan-to-value (LTV) ratio, which can push you into a higher LTV bracket with a worse interest rate on the entire mortgage, not just the stamp duty portion.' },
      { q: 'Is it cheaper to pay stamp duty in cash?', a: 'Usually yes, if you can afford to. Paying in cash avoids paying mortgage interest on that amount for the full term of the loan, which typically costs far more than the stamp duty bill itself over 20-30 years.' }
    ],
    relatedLinks: [ { href: '/first-time-buyer/', label: 'First-time buyer calculator' }, { href: '/buy-to-let/', label: 'Buy-to-let calculator' } ]
  }
];

function renderGuidesIndex() {
  const canonical = `${SITE_URL}/guides/`;
  const cards = GUIDES.map(g => `
    <a href="/guides/${g.slug}/" class="back-links" style="display:block;margin:0 0 12px;">
      <strong>${g.title}</strong><br><span style="font-size:.85rem;color:var(--muted);">${g.metaDesc}</span>
    </a>`).join('');
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stamp Duty Guides — Explainers, Deadlines &amp; Rate Changes</title>
<meta name="description" content="All stamp duty guides in one place: what SDLT/LBTT/LTT is, payment deadlines, the 2025 rate changes, and mortgage financing.">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<meta name="google-site-verification" content="m4ovmDFcrhAbFLC1Ix28d793SYzD--JWQ2n8UtetMSg" />
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="container">
    <div class="badge">📚 Guides</div>
    <h1>Stamp Duty Guides</h1>
    <p>Plain-English explainers on how stamp duty works, when it's due, and what changed in 2025.</p>
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

for (const g of GUIDES) {
  const dir = path.join(ROOT, 'guides', g.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), guideShell(g));
  console.log('Wrote guides/' + g.slug + '/index.html');
}

const guidesIndexDir = path.join(ROOT, 'guides');
fs.mkdirSync(guidesIndexDir, { recursive: true });
fs.writeFileSync(path.join(guidesIndexDir, 'index.html'), renderGuidesIndex());
console.log('Wrote guides/index.html');

// ─── Merge guide URLs into sitemap.xml (generate-pages.js writes it first) ──
const sitemapPath = path.join(ROOT, 'sitemap.xml');
const existing = fs.readFileSync(sitemapPath, 'utf8');
const guideUrls = ['/guides/', ...GUIDES.map(g => `/guides/${g.slug}/`)];
const newUrlLines = guideUrls
  .filter(u => !existing.includes(`<loc>${SITE_URL}${u}</loc>`))
  .map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`)
  .join('\n');
const merged = newUrlLines
  ? existing.replace('</urlset>', `${newUrlLines}\n</urlset>`)
  : existing;
fs.writeFileSync(sitemapPath, merged);
console.log('Merged', guideUrls.length, 'guide URLs into sitemap.xml');

module.exports = { GUIDES };
