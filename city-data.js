// Wave 1 of city pages (5 cities). Prices are real, sourced, and dated —
// never invented. Update avgPrice/avgPriceSource/avgPriceDate when re-running
// this data close to publication, and re-verify before adding further waves.
// nation must match a key in BANDS' region grouping: england | scotland | wales.
module.exports = [
  {
    slug: 'london',
    name: 'London',
    nation: 'england',
    avgPrice: 553000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'November 2025',
    localNote: 'London is the only UK city where the average property price sits well above the England/NI standard nil-rate threshold of £125,000 and even above the £500,000 first-time-buyer relief ceiling — most London first-time buyers pay some SDLT even with full relief applied. It is also the city with the highest concentration of non-resident and limited-company buyers, given international investment demand.',
    faqExtra: { q: 'Why is stamp duty such a big cost in London specifically?', a: 'London\'s average property price (£553,000, ONS, November 2025) is more than the first-time-buyer relief ceiling of £500,000, so most London first-time buyers get partial relief at best and pay standard rates on the portion above £300,000. On a typical London purchase, buyers should also check whether the non-resident or limited-company rules apply, given the city\'s high share of overseas and corporate buyers.' },
    relatedSatellite: { href: '/non-resident/', label: 'Non-resident buyer calculator →' }
  },
  {
    slug: 'manchester',
    name: 'Manchester',
    nation: 'england',
    avgPrice: 247000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'At £247,000, Manchester\'s average property price sits just above the England/NI standard nil-rate threshold of £125,000 but comfortably under the £300,000 first-time-buyer nil-rate band — most first-time buyers in Manchester pay no SDLT at all. Manchester is also one of the UK\'s most active buy-to-let markets, so the second-home surcharge is a common consideration here.',
    faqExtra: { q: 'Do most first-time buyers in Manchester pay stamp duty?', a: 'Often not. Manchester\'s average property price (£247,000, ONS, May 2026 provisional) is below the £300,000 first-time-buyer nil-rate threshold, so a first-time buyer purchasing at or near the city average typically pays no SDLT at all.' },
    relatedSatellite: { href: '/buy-to-let/', label: 'Buy-to-let calculator →' }
  },
  {
    slug: 'birmingham',
    name: 'Birmingham',
    nation: 'england',
    avgPrice: 233000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'Birmingham\'s average property price of £233,000 sits below the £300,000 first-time-buyer threshold, meaning most first-time buyers pay no SDLT. Birmingham has seen close to 50% price growth over the past decade, which matters for anyone reclaiming Multiple Dwellings Relief on a multi-unit purchase completed several years ago — the refund window is time-limited.',
    faqExtra: { q: 'Has stamp duty in Birmingham changed much given recent price growth?', a: 'The tax bands themselves haven\'t moved with local prices, but Birmingham\'s near-50% price growth over the last decade (Land Registry) means more purchases now cross into taxable bands than a decade ago, even though the average price (£233,000, ONS, May 2026 provisional) is still under the first-time-buyer threshold.' },
    relatedSatellite: { href: '/refund-calculator/', label: 'Check refund eligibility →' }
  },
  {
    slug: 'edinburgh',
    name: 'Edinburgh',
    nation: 'scotland',
    avgPrice: 314321,
    avgPriceSource: 'ESPC House Price Report (Aug–Oct 2025)',
    avgPriceDate: 'August–October 2025',
    localNote: 'Edinburgh uses LBTT, not SDLT — its own bands and its own Additional Dwelling Supplement (ADS) for second homes. At £314,321, Edinburgh\'s average price is well above Scotland\'s £145,000 standard nil-rate band and above the £175,000 first-time-buyer band, so most Edinburgh buyers pay LBTT even with first-time-buyer relief applied.',
    faqExtra: { q: 'Is LBTT in Edinburgh higher than the rest of Scotland?', a: 'The LBTT bands themselves are the same across all of Scotland — Edinburgh doesn\'t have its own rates. What differs is the average price: at £314,321 (ESPC, Aug–Oct 2025), Edinburgh sits well above Scotland\'s £145,000 nil-rate threshold, so Edinburgh buyers typically pay more LBTT in cash terms than buyers in lower-priced parts of Scotland, simply because property costs more.' },
    relatedSatellite: { href: '/scotland/', label: 'Scotland LBTT calculator →' }
  },
  {
    slug: 'cardiff',
    name: 'Cardiff',
    nation: 'wales',
    avgPrice: 273000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'Cardiff uses LTT, not SDLT — and Wales abolished first-time-buyer relief in 2018, so first-time buyers in Cardiff pay the same standard LTT rates as any other main-home buyer. At £273,000, Cardiff is the third highest average house price in Wales, above the £225,000 LTT nil-rate threshold.',
    faqExtra: { q: 'Do first-time buyers in Cardiff get any stamp duty relief?', a: 'No — Wales abolished first-time buyer relief in 2018, so a first-time buyer in Cardiff pays the same standard LTT rates as any other main-home buyer. At Cardiff\'s average price of £273,000 (ONS, May 2026 provisional), that means LTT is due on the portion above £225,000 regardless of first-time-buyer status.' },
    relatedSatellite: { href: '/wales/', label: 'Wales LTT calculator →' }
  },

  // ─── Wave 2 ────────────────────────────────────────────────────────────
  {
    slug: 'glasgow',
    name: 'Glasgow',
    nation: 'scotland',
    avgPrice: 237000,
    avgPriceSource: 'ONS UK House Price Index (home-mover average)',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'Glasgow has seen the largest residential price growth of any Scottish city over the past decade — up 62% between 2014-15 and 2024-25 (Registers of Scotland). At £237,000, Glasgow\'s average price sits above Scotland\'s £145,000 standard LBTT nil-rate band but below the £175,000 first-time-buyer band only by a small margin.',
    faqExtra: { q: 'Why has stamp duty become more relevant for Glasgow buyers?', a: 'Glasgow\'s average house price rose 62% between 2014-15 and 2024-25 (Registers of Scotland) — the largest increase of any Scottish city. As prices climbed while LBTT bands stayed fixed, more Glasgow purchases now fall into taxable bands than a decade ago.' },
    relatedSatellite: { href: '/scotland/', label: 'Scotland LBTT calculator →' }
  },
  {
    slug: 'bristol',
    name: 'Bristol',
    nation: 'england',
    avgPrice: 355000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'At £355,000, Bristol is one of the most expensive cities outside London and the South East, sitting well above the £300,000 first-time-buyer nil-rate threshold — most Bristol first-time buyers pay SDLT on the portion above £300,000, unlike buyers in lower-priced English cities.',
    faqExtra: { q: 'Do Bristol buyers pay more stamp duty than the England average?', a: 'In cash terms, often yes — Bristol\'s average price (£355,000, ONS, May 2026 provisional) is well above the England/NI standard nil-rate threshold of £125,000 and the £300,000 first-time-buyer band, so a typical Bristol purchase attracts more SDLT than one at the national average price.' },
    relatedSatellite: { href: '/buy-to-let/', label: 'Buy-to-let calculator →' }
  },
  {
    slug: 'leeds',
    name: 'Leeds',
    nation: 'england',
    avgPrice: 250000,
    avgPriceSource: 'ONS UK House Price Index (mortgage average)',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'At £250,000, Leeds sits below the £300,000 first-time-buyer nil-rate threshold — most first-time buyers purchasing at or near the city average pay no SDLT at all, though standard (non-FTB) buyers do pay tax above £125,000.',
    faqExtra: { q: 'Do first-time buyers in Leeds usually pay stamp duty?', a: 'Often not. Leeds\' average mortgaged property price (£250,000, ONS, May 2026 provisional) is below the £300,000 first-time-buyer nil-rate threshold, so a first-time buyer at or near the city average typically pays no SDLT.' },
    relatedSatellite: { href: '/first-time-buyer/', label: 'First-time buyer calculator →' }
  },
  {
    slug: 'liverpool',
    name: 'Liverpool',
    nation: 'england',
    avgPrice: 184000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'April 2026 (provisional)',
    localNote: 'At £184,000, Liverpool is one of the more affordable major English cities and a long-standing buy-to-let hotspot, including multi-unit and HMO-style purchases where Multiple Dwellings Relief is often relevant and frequently missed.',
    faqExtra: { q: 'Why does Multiple Dwellings Relief matter for Liverpool buyers specifically?', a: 'Liverpool\'s relatively affordable average price (£184,000, ONS, April 2026 provisional) makes multi-unit and HMO-style investment purchases common — and Multiple Dwellings Relief (MDR), which can reduce SDLT on transactions including more than one dwelling, is one of the most frequently missed reliefs on these deals. Check the refund calculator if this applied to a past Liverpool purchase.' },
    relatedSatellite: { href: '/refund-calculator/', label: 'Check refund eligibility →' }
  },
  {
    slug: 'newcastle',
    name: 'Newcastle upon Tyne',
    nation: 'england',
    avgPrice: 213000,
    avgPriceSource: 'ONS UK House Price Index (mortgage average)',
    avgPriceDate: 'April 2026 (provisional)',
    localNote: 'At £213,000, Newcastle sits well below the £300,000 first-time-buyer threshold — most first-time buyers purchasing at or near the city average pay no SDLT, similar to other affordable northern English cities.',
    faqExtra: { q: 'Is stamp duty a smaller factor in Newcastle than in southern English cities?', a: 'Generally yes, in cash terms — Newcastle\'s average mortgaged property price (£213,000, ONS, April 2026 provisional) is well under the £300,000 first-time-buyer threshold and closer to the £125,000 standard nil-rate band than cities like Bristol, Oxford or Cambridge, so a typical Newcastle purchase attracts less SDLT.' },
    relatedSatellite: { href: '/first-time-buyer/', label: 'First-time buyer calculator →' }
  },
  {
    slug: 'sheffield',
    name: 'Sheffield',
    nation: 'england',
    avgPrice: 226000,
    avgPriceSource: 'ONS UK House Price Index (mortgage average)',
    avgPriceDate: 'April 2026 (provisional)',
    localNote: 'At £226,000, Sheffield sits below the £300,000 first-time-buyer threshold. Its large student population also makes it an active buy-to-let market, where the second-home surcharge is a common consideration for landlords.',
    faqExtra: { q: 'Does buying a rental property in Sheffield cost more in stamp duty?', a: 'Yes — a buy-to-let purchase in Sheffield attracts the second-home surcharge (an extra 5 percentage points on every SDLT band) rather than standard or first-time-buyer rates, regardless of the £226,000 city average (ONS, April 2026 provisional) being relatively affordable.' },
    relatedSatellite: { href: '/buy-to-let/', label: 'Buy-to-let calculator →' }
  },
  {
    slug: 'nottingham',
    name: 'Nottingham',
    nation: 'england',
    avgPrice: 195000,
    avgPriceSource: 'ONS UK House Price Index (mortgage average)',
    avgPriceDate: 'March 2026 (provisional)',
    localNote: 'At £195,000, Nottingham is one of the more affordable English cities in this list, well below the £300,000 first-time-buyer threshold. With two large universities, it also has a substantial student rental market.',
    faqExtra: { q: 'Do most first-time buyers in Nottingham pay stamp duty?', a: 'Usually not. Nottingham\'s average mortgaged property price (£195,000, ONS, March 2026 provisional) is well below the £300,000 first-time-buyer nil-rate threshold, so a first-time buyer at or near the city average typically pays no SDLT.' },
    relatedSatellite: { href: '/first-time-buyer/', label: 'First-time buyer calculator →' }
  },
  {
    slug: 'southampton',
    name: 'Southampton',
    nation: 'england',
    avgPrice: 236000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'At £236,000, Southampton sits below the £300,000 first-time-buyer threshold. As a port city with a large student and rental population, buy-to-let purchases are common — and subject to the second-home surcharge.',
    faqExtra: { q: 'Is Southampton a common buy-to-let city, and does that change the stamp duty due?', a: 'Yes — Southampton\'s port-city economy and student population support an active rental market, but any buy-to-let purchase there is taxed at the second-home surcharge rate (an extra 5 percentage points per band), not standard rates, regardless of the relatively affordable £236,000 city average (ONS, May 2026 provisional).' },
    relatedSatellite: { href: '/buy-to-let/', label: 'Buy-to-let calculator →' }
  },
  {
    slug: 'brighton',
    name: 'Brighton',
    nation: 'england',
    avgPrice: 404000,
    avgPriceSource: 'ONS UK House Price Index (Brighton and Hove)',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'At £404,000, Brighton and Hove is well above the £300,000 first-time-buyer nil-rate threshold and firmly into standard SDLT territory for most buyers. Its popularity as a coastal second-home and holiday-let destination also makes the second-home surcharge and non-resident rules relevant considerations here.',
    faqExtra: { q: 'Why does the non-resident surcharge come up often for Brighton purchases?', a: 'Brighton and Hove\'s appeal as a coastal city — including to overseas buyers purchasing a UK base or investment property — means the 2% non-resident SDLT surcharge is a more frequent consideration here than in many inland cities. It applies on top of any other rate if the buyer doesn\'t meet the 183-day UK residence test.' },
    relatedSatellite: { href: '/non-resident/', label: 'Non-resident buyer calculator →' }
  },
  {
    slug: 'oxford',
    name: 'Oxford',
    nation: 'england',
    avgPrice: 473000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'At £473,000, Oxford is one of the most expensive cities in this list — just under the £500,000 first-time-buyer relief ceiling, and comfortably above it for anyone paying slightly more than the city average. High-value university-city property also sees a meaningful share of corporate and investment-vehicle purchases.',
    faqExtra: { q: 'Are first-time buyers in Oxford close to losing relief entirely?', a: 'Yes — Oxford\'s average price (£473,000, ONS, May 2026 provisional) is close to the £500,000 ceiling above which first-time-buyer relief stops applying altogether. A first-time buyer paying even slightly more than the city average in Oxford can lose relief completely and pay standard rates on the whole price.' },
    relatedSatellite: { href: '/limited-company/', label: 'Limited company buyer calculator →' }
  },
  {
    slug: 'cambridge',
    name: 'Cambridge',
    nation: 'england',
    avgPrice: 467000,
    avgPriceSource: 'ONS UK House Price Index',
    avgPriceDate: 'May 2026 (provisional)',
    localNote: 'At £467,000, Cambridge sits just below Oxford as one of the most expensive cities in this list, close to the £500,000 first-time-buyer relief ceiling. Its high-value property market, including research-sector and investment demand, means limited-company and non-resident purchase rules are more frequently relevant than in lower-priced cities.',
    faqExtra: { q: 'Does Cambridge\'s high average price change which stamp duty rules matter most?', a: 'Yes — at £467,000 (ONS, May 2026 provisional), a Cambridge purchase sits close to the £500,000 ceiling for first-time-buyer relief, and the city\'s research-sector and investment demand mean the limited-company purchase rules (flat 15% above £500,000) are a more realistic consideration here than in more affordable cities.' },
    relatedSatellite: { href: '/limited-company/', label: 'Limited company buyer calculator →' }
  }
];
