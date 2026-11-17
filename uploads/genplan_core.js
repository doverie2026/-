// Общее ядро логики генпланов ЖК «Самолёт» — единое для всех очередей.
// Каждый генплан объявляет: class Component extends window.GenplanCore(DCLogic) { …только свои данные и отличия… }
// Правило: правки расчётов делаются ЗДЕСЬ один раз; в файле очереди остаются лишь её данные
// (полигоны, поэтажные планы, названия, численность) и осознанные отличия поведения.
window.GenplanCore = function (DCLogic) {
  return class GenplanBase extends DCLogic {
  state = { hovered: null, selected: null, summaryHovered: false, summaryPinned: false, summaryFilter: null, problemsVisible: false, efficiencyVisible: false, hoveredUnitIdx: null, planZoom: false, zoomHoverIdx: null };

  units = {};

  rnv = {};

  floorPlans = {};

  planBoxes = {};

  planMop = {};

  // polys: у каждой очереди своё поле или геттер (С6) — в ядре не объявляется, чтобы не перекрыть геттер

  names = {};

  liqColors = { 'Ликвидное': '#dcdcf7', 'Неликвидное': '#f0e6e6' };

  // Фактические арендаторы из «Реестра договоров аренды» (обновление 27.08.2026)
  tenantsReg = {};

  bFloors = {};

  // сторона входа на генплане: ключ — подъезд ('3_1') или помещение ('3_1#5'); left/right/top/bottom
  entrySide = {};

  // точная подвижка метки [dx, dy] в % генплана
  entryNudge = {};

  // Порядок карточек зафиксирован: в аренде → в простое → не введено в эксплуатацию → продано
  unitRank(u) {
    const s = String(u.status || '');
    if (/Продано/i.test(s)) return (u.sale && u.sale.agent && u.sale.agent !== '—') ? 5 : 6;
    if (/в аренде/i.test(s)) return 0;
    if (/в простое/i.test(s)) return 1;
    if (/не введено/i.test(s)) return /с арендатором/i.test(s) ? 2 : 3;
    return 4;
  }

  // обнулённые (возмещаемые) затраты подсвечиваем тем же цветом, что и сноска
  // сворачиваемые разделы карточки: бывшие арендаторы, управление, CAPEX, OPEX
  secVals(id, idx) {
    const st = this.state.secOpen || {};
    const out = {};
    for (const key of ['Past', 'Mgmt', 'Capex', 'Opex']) {
      const k = id + '|' + idx + '|' + key;
      out['open' + key] = !!st[k];
      out['chev' + key] = st[k] ? 'rotate(180deg)' : 'rotate(0deg)';
      out['toggle' + key] = (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState((s) => ({ secOpen: { ...(s.secOpen || {}), [k]: !(s.secOpen || {})[k] } })); };
    }
    return out;
  }

  cxColor(v) { return /возмещ|обнул|^0(\s|$|,|\.)/i.test(String(v || '')) ? '#9a6b1a' : '#2f2b24'; }

  // Стартовые вложения — 200 000 ₽ на м² площади помещения
  startInvest(u) {
    const a = parseFloat(String((u && u.area) || '').replace(/[^\d,.]/g, '').replace(',', '.'));
    return (isFinite(a) && a > 0) ? Math.round(a * 200000).toLocaleString('ru-RU') + ' ₽' : '—';
  }

  utilJk = '';

  cxUtilOf(id, u) { return u.cxUtil || (window.OMUtil ? window.OMUtil.total(this.utilJk, this, id, u) : null); }

  utilStr(t, id, u) { return window.OMUtil ? window.OMUtil.str(t, this.utilJk, this, id, u) : '—'; }

  // Прирост цены актива = рыночная цена − OPEX (накопительно)
  assetGrowth(id, u) {
    const n = (s) => this.numOf(s);
    const price = n((this.actualPrice(id, u) || {}).value || u.marketPrice || u.price);
    if (price === null) return '—';
    const opex = n(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss'])) || 0;
    const d = price - opex;
    const sg = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toLocaleString('ru-RU', { maximumFractionDigits: 1 });
    const pct = opex > 0 ? ' · ' + sg(d / opex * 100) + '% к OPEX' : '';
    return (d >= 0 ? '' : '−') + Math.abs(Math.round(d)).toLocaleString('ru-RU') + ' ₽' + pct;
  }

  // Прирост цены актива в среднем за год: делим прирост на период с даты РНВ по отчётную дату (31.08.2026)
  assetGrowthYear(id, u) {
    const n = (s) => this.numOf(s);
    const price = n((this.actualPrice(id, u) || {}).value || u.marketPrice || u.price);
    const m = String((this.rnv && this.rnv[String(id).split('_')[0]]) || (this.rnv && this.rnv[id]) || '').trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (price === null || !m) return '—';
    const years = (new Date(2026, 7, 31) - new Date(+m[3], +m[2] - 1, +m[1])) / 31557600000;
    if (!(years > 0)) return '—';
    const opex = n(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss'])) || 0;
    const d = price - opex;
    // при сроке с РНВ меньше года прирост к году не приводим — иначе цифра кратно завышается
    const yrs = Math.max(1, years);
    const sg = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toLocaleString('ru-RU', { maximumFractionDigits: 1 });
    const pct = opex > 0 ? ' · ' + sg(d / opex * 100 / yrs) + '% к OPEX' : '';
    return (d >= 0 ? '' : '−') + Math.abs(Math.round(d / yrs)).toLocaleString('ru-RU') + ' ₽' + pct;
  }

  // Цвет прироста: положительный — зелёный, отрицательный — красный
  growthColor(v) {
    const s = String(v || '');
    if (!/\d/.test(s)) return '#2f2b24';
    return /^-|^−/.test(s.trim()) ? '#a3312b' : '#3a6b3f';
  }

  // Операционная прибыль (NOI) с начала года: (аренда + плата за управление) − CAPEX
  noiOf(id, u, cxTotal) {
    const n = (s) => this.numOf(s);
    const rent = n(u.rentPaid || this.rentAccrued(id, u));
    const mgmt = n(u.mgmtPaid || this.mgmtAccrued(id, u));
    if (rent === null && mgmt === null) return '—';
    const cx = n(cxTotal) || 0;
    return Math.round((rent || 0) + (mgmt || 0) - cx).toLocaleString('ru-RU') + ' ₽';
  }

  cxTotalOf(id, u) { return this.sumRub({ ...u, cxUtil: this.cxUtilOf(id, u) }, ['cxUtil', 'cxSecurity', 'cxCleaning', 'cxTO', 'cxAdmin', 'cxTaxes', 'cxInsurance']); }

  // Простая окупаемость: OPEX / NOI в годовом выражении (NOI за 01.01–31.08.2026 × 12/8)
  paybackOf(id, u) {
    const n = (s) => this.numOf(s);
    const opex = n(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
    const noi = n(this.noiOf(id, u, this.cxTotalOf(id, u)));
    if (opex === null || noi === null) return '—';
    if (!(opex > 0)) return '0 лет (нет вложений)';
    const annual = noi * 12 / 8;
    if (!(annual > 0)) return 'не окупается (NOI ≤ 0)';
    return (opex / annual).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' года';
  }

  // Доходность на вложения, годовых: NOI в годовом выражении / OPEX × 100%
  roiOf(id, u) {
    const n = (s) => this.numOf(s);
    const opex = n(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
    const noi = n(this.noiOf(id, u, this.cxTotalOf(id, u)));
    if (opex === null || noi === null || !(opex > 0)) return '—';
    return (noi * 12 / 8 / opex * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '% годовых';
  }

  // Годовая полная доходность: cap rate + ожидаемая динамика цены актива (экспертная оценка)
  fullYieldOf(id, u) {
    const cap = this.numOf(this.capRateOf(id, u));
    if (cap === null) return '—';
    const m = String(u.effPriceDyn || '').match(/([+−-])?\s*([\d\s]+(?:[.,]\d+)?)\s*%/);
    const dyn = m ? (/[−-]/.test(m[1] || '') ? -1 : 1) * parseFloat(m[2].replace(/\s/g, '').replace(',', '.')) : null;
    const f1 = (v) => v.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
    return f1(cap + (dyn || 0)) + '% годовых';
  }

  // пояснение к годовой полной доходности — в подсказке, чтобы не растягивать колонку
  fullYieldTitle(id, u) {
    const cap = this.numOf(this.capRateOf(id, u));
    if (cap === null) return '';
    const m = String(u.effPriceDyn || '').match(/([+−-])?\s*([\d\s]+(?:[.,]\d+)?)\s*%/);
    const dyn = m ? (/[−-]/.test(m[1] || '') ? -1 : 1) * parseFloat(m[2].replace(/\s/g, '').replace(',', '.')) : null;
    const f1 = (v) => v.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
    return dyn === null
      ? 'Cap rate ' + f1(cap) + '% · ожидаемая динамика цены не задана'
      : 'Cap rate ' + f1(cap) + '% + ожидаемая динамика ' + (dyn >= 0 ? '+' : '−') + f1(Math.abs(dyn)) + '%';
  }

  // Отклонение действующей ставки от рыночной: доля и разница ₽/мес
  rentGapInfo(id, u) {
    if (!u || /Продано/i.test(u.status || '') || (this.actualPrice && this.actualPrice(id, u))) return null;
    const cur = this.rateSqm(this.regRow(id, u).regRate), mkt = this.mktRate(u), area = this.numOf(u.area);
    if (!(cur > 0) || !(mkt > 0) || !(area > 0)) return null;
    return { gap: (cur - mkt) / mkt, cur: cur, mkt: mkt, diff: (cur - mkt) * area };
  }

  // Рыночная ставка ₽/м² для помещения: прайс бульвара для ОСК, иначе медиана по реестру ЖК
  mktRate(u) {
    const p = u && u.priceRateNum;
    if (p > 0) return p;
    const m = String(this.marketRentStr() || '').match(/:\s*([\d\s\u00a0]+)\s*₽/);
    return m ? (parseFloat(m[1].replace(/[\s\u00a0]/g, '')) || 0) : 0;
  }

// Индикатор рядом с чипом «рынок»: сдаётся ли помещение по рыночной ставке
  rentGapOf(id, u) {
    if (this.actualPrice(id, u) || /Продано/i.test(u.status || '')) return {};
    const cur = this.rateSqm(this.regRow(id, u).regRate), mkt = this.mktRate(u);
    if (!(cur > 0) || !(mkt > 0)) return {};
    const d = (cur - mkt) / mkt, pct = Math.round(Math.abs(d) * 100);
    const f = (v) => Math.round(v).toLocaleString('ru-RU');
    const at = Math.abs(d) <= 0.05;
    const up = d > 0;
    return {
      rentGap: at ? 'по рынку' : (up ? '+' : '−') + pct + '%',
      rentGapColor: at ? '#2b4a8c' : (up ? '#2f6b3f' : '#a3312b'),
      rentGapBg: at ? 'rgba(43,74,140,0.06)' : (up ? 'rgba(47,107,63,0.07)' : 'rgba(163,49,43,0.07)'),
      rentGapBorder: at ? 'rgba(43,74,140,0.18)' : (up ? 'rgba(47,107,63,0.22)' : 'rgba(163,49,43,0.22)'),
      rentGapTitle: 'Действующая ставка ' + f(cur) + ' ₽/м² против рыночной ' + f(mkt) + ' ₽/м² — '
        + (at ? 'сдаётся по рынку (отклонение до 2%)' : up ? 'выше рынка на ' + pct + '%' : 'ниже рынка на ' + pct + '%')
    };
  }

  // Ставка ₽/м² из строки вида «1 500 ₽/м² · 95 400 ₽/мес»
  rateSqm(s) {
    const m = String(s || '').match(/([\d\s\u00a0]+(?:[.,]\d+)?)\s*₽\s*\/\s*м²/);
    return m ? (parseFloat(m[1].replace(/[\s\u00a0]/g, '').replace(',', '.')) || null) : null;
  }

  // Справедливая стоимость не менее: годовой NOI по большей из ставок (действующей и рыночной) / 9,5%
  fairValueOf(id, u) {
    const n = (s) => this.numOf(s);
    const area = n(u.area);
    const cur = this.rateSqm(this.regRow(id, u).regRate);
    const mkt = this.mktRate(u);
    const rate = Math.max(cur || 0, mkt || 0);
    if (!(area > 0) || !(rate > 0)) return '—';
    return Math.round(area * rate * 12 / 0.095).toLocaleString('ru-RU') + ' ₽';
  }

  fairValueTitle(id, u) {
    const cur = this.rateSqm(this.regRow(id, u).regRate);
    const mkt = this.mktRate(u);
    const f = (v) => Math.round(v).toLocaleString('ru-RU');
    if (!cur && !mkt) return 'Нет ставки для расчёта';
    const use = Math.max(cur || 0, mkt || 0);
    return 'Годовая аренда по ставке ' + f(use) + ' ₽/м² ('
      + (cur && cur >= (mkt || 0) ? 'действующая' : 'рыночная') + ') / 9,5%'
      + (cur && mkt ? ' · действующая ' + f(cur) + ', рыночная ' + f(mkt) + ' ₽/м²' : '');
  }

  // Cap rate: NOI в годовом выражении / актуальная (рыночная) цена актива × 100%
  capRateOf(id, u) {
    const n = (s) => this.numOf(s);
    const price = n((this.actualPrice(id, u) || {}).value || u.marketPrice || u.price);
    const noi = n(this.noiOf(id, u, this.cxTotalOf(id, u)));
    if (price === null || noi === null || !(price > 0)) return '—';
    return (noi * 12 / 8 / price * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '% годовых';
  }

  // Возвращённый OPEX: фактический NOI за 01.01–31.08.2026, не больше OPEX (прошлые годы не учитываются)
  opexBackOf(id, u) {
    const n = (s) => this.numOf(s);
    const opex = n(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
    const noi = n(this.noiOf(id, u, this.cxTotalOf(id, u)));
    if (opex === null || noi === null) return '—';
    const back = Math.max(0, Math.min(opex, noi));
    const pct = opex > 0 ? ' · ' + (back / opex * 100).toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + '% OPEX' : '';
    return Math.round(back).toLocaleString('ru-RU') + ' ₽' + pct;
  }

  // Опережение норматива общей доходности: (NOI годовых + среднегодовой прирост цены) / OPEX − норматив
  spreadOf(id, u) {
    const n = (s) => this.numOf(s);
    const opex = n(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
    const noi = n(this.noiOf(id, u, this.cxTotalOf(id, u)));
    const growth = n(this.assetGrowthYear(id, u));
    const cap = n(u.effCap || '14%');
    if (opex === null || noi === null || cap === null || !(opex > 0)) return '—';
    const total = (noi * 12 / 8 + (growth || 0)) / opex * 100;
    const d = total - cap;
    return (d >= 0 ? '+' : '−') + Math.abs(d).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' п.п. · факт ' + total.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%';
  }

  // число из форматированной строки: берём только первую часть до « · » (без процентных суффиксов)
  numOf(s) {
    const x = String(s || '').split('·')[0].replace(/−/g, '-').replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    const v = parseFloat(x);
    return (isFinite(v) && /\d/.test(String(s || ''))) ? v : null;
  }

  // Кольцо cap rate: NOI годовых к цене актива, шкала — норматив
  capDonut(id, u, noi, cap) {
    const price = this.numOf((this.actualPrice(id, u) || {}).value || u.marketPrice || u.price);
    const v = (price > 0 && noi !== null) ? noi * 12 / 8 / price * 100 : null;
    if (v === null) return { d4Deg: '0deg', d4Color: '#9a938a', d4Val: '—', d4Title: 'Cap rate: цена актива не указана',
      d5Deg: '0deg', d5Color: '#9a938a', d5Val: '—', d5Title: 'Полная доходность актива: цена актива не указана' };
    const m = String(u.effPriceDyn || '').match(/([+−-])?\s*([\d\s]+(?:[.,]\d+)?)\s*%/);
    const dyn = m ? (/[−-]/.test(m[1] || '') ? -1 : 1) * parseFloat(m[2].replace(/\s/g, '').replace(',', '.')) : null;
    const full = v + (dyn || 0);
    const f1 = (x) => x.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
    return {
      d4Deg: Math.round(Math.max(0, Math.min(1, v / cap)) * 360) + 'deg',
      d4Color: v >= cap ? '#3a6b3f' : '#8a5c1a',
      d4Val: Math.round(v) + '%',
      d4Title: 'Cap rate: ' + f1(v) + '% годовых (NOI годовых к цене актива), шкала — норматив ' + cap + '%',
      d5Deg: Math.round(Math.max(0, Math.min(1, full / cap)) * 360) + 'deg',
      d5Color: full >= cap ? '#3a6b3f' : '#8a5c1a',
      d5Val: Math.round(full) + '%',
      d5Title: 'Полная доходность актива: ' + f1(full) + '% годовых — cap rate ' + f1(v) + '%'
        + (dyn === null ? ' · ожидаемая динамика цены не задана' : ' + ожидаемая динамика ' + (dyn >= 0 ? '+' : '−') + f1(Math.abs(dyn)) + '%'),
    };
  }

  // Круговые индикаторы у статуса: опережение нормативного cap rate и возвращённый OPEX
  donutsOf(id, u) {
    const n = (s) => this.numOf(s);
    const cap = n(u.effCap || '14%') || 14;
    const opex = n(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
    const noi = n(this.noiOf(id, u, this.cxTotalOf(id, u)));
    const growth = n(this.assetGrowthYear(id, u));
    if (!(opex > 0) || noi === null || /Продано/i.test(u.status || '')) return { donutsShow: false };
    const total = (noi * 12 / 8 + (growth || 0)) / opex * 100;
    const r1 = Math.max(0, Math.min(1, total / cap));
    const back = Math.max(0, Math.min(opex, noi));
    const r2 = opex > 0 ? back / opex : 0;
    const rub = (v) => Math.round(v).toLocaleString('ru-RU') + ' ₽';
    return {
      donutsShow: true,
      d1Deg: Math.round(r1 * 360) + 'deg',
      d1Color: total >= cap ? '#3a6b3f' : '#a3312b',
      d1Val: Math.round(total) + '%',
      d1Title: 'Опережение норматива общей доходности: факт ' + total.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '% при нормативе ' + cap + '%',
      d3Deg: Math.round(Math.max(0, Math.min(1, (noi * 12 / 8 / opex * 100) / cap)) * 360) + 'deg',
      d3Color: (noi * 12 / 8 / opex * 100) >= cap ? '#3a6b3f' : '#8a5c1a',
      d3Val: Math.round(noi * 12 / 8 / opex * 100) + '%',
      d3Title: 'Доходность на вложения (YoC): ' + (noi * 12 / 8 / opex * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '% годовых при нормативе ' + cap + '%',
      ...this.capDonut(id, u, noi, cap),
      d2Deg: Math.round(r2 * 360) + 'deg',
      d2Color: '#2b4a8c',
      d2Val: Math.round(r2 * 100) + '%',
      d2Title: 'Возвращённый OPEX: ' + rub(back) + ' из ' + rub(opex),
    };
  }

  sumRub(u, keys) {
    let sum = 0, any = false;
    for (const k of keys) {
      const n = parseFloat(String(u[k] || '').replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, ''));
      if (isFinite(n) && String(u[k] || '').match(/\d/)) { sum += n; any = true; }
    }
    return any ? sum.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽' : '—';
  }

  chip(s) {
    if (s === 'Продано') return { chipBg: '#efece6', chipFg: '#8a8478', chipBd: '#d8d3c8' };
    if (s === 'В аренде' || s === 'В аренде (ВГО)') return { chipBg: '#e8f0e6', chipFg: '#3a6b3f', chipBd: '#bcd4bb' };
    if (s === 'Доступно для аренды' || s === 'Свободно') return { chipBg: '#f7e9e7', chipFg: '#a3312b', chipBd: '#e0bcb8' };
    if (/эксплуатац|Простаивает/i.test(s || '')) return { chipBg: '#faf0dd', chipFg: '#9a6b1a', chipBd: '#e4cfa4' };
    return { chipBg: '#f1efe9', chipFg: '#6f6a60', chipBd: '#ddd8cd' };
  }

  ratePick(r) {
    const pr = (s) => { const p = String(s).split('.').map(Number); return new Date(p[2], p[1] - 1, p[0]); };
    if (!r) return { rate: null, period: null };
    if (Array.isArray(r.rates) && r.rates.length) {
      const now = new Date();
      const cur = r.rates.find(x => (!x.from || pr(x.from) <= now) && (!x.till || pr(x.till) >= now)) || r.rates[r.rates.length - 1];
      const i = r.rates.indexOf(cur);
      const prev = i > 0 ? r.rates[i - 1] : null;
      const next = i >= 0 && i < r.rates.length - 1 ? r.rates[i + 1] : null;
      return { rate: cur.rate, period: (cur.from || '—') + ' — ' + (cur.till || '31.12.2026'), nextChange: next ? (next.from || null) : null,
        prevRate: prev ? prev.rate : null, prevPeriod: prev ? ((prev.from || '—') + ' — ' + (prev.till || '—')) : null };
    }
    return { rate: r.rate, period: r.ratePeriod, prevRate: r.prevRate || null, prevPeriod: r.prevRatePeriod || null, nextChange: r.rateNextChange || null };
  }

  mgmtInactiveSince = {};

  regRow(id, u) {
    const r = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    return { reg: r,
      ttName: (r && r.brand && r.brand !== '—') ? r.brand : 'не указано',
      regRate: (() => { const p = this.ratePick(r); return (p.rate && p.rate !== '—') ? p.rate : 'не указана'; })(),
      regRatePeriod: r ? (this.ratePick(r).period || 'нет данных') : '—',
      regRateNextChange: r ? (this.ratePick(r).nextChange || 'нет данных') : '—',
      regRatePrev: r ? (this.ratePick(r).prevRate || 'нет данных') : '—',
      regRatePrevPeriod: r ? (this.ratePick(r).prevPeriod || 'нет данных') : '—',
      regIndexation: r ? (r.indexation || 'нет данных') : '—',
      regIndexDate: r ? (r.indexDate || 'нет данных') : '—',
      regTenant: r ? r.tenant : 'нет договора',
      regDog: r ? (r.dogDate || 'нет данных') : '—',
      regContract: (r && r.contract && r.contract !== '—') ? r.contract : (r ? 'не активен' : 'не указана'),
      mgmtActive: u.mgmtCo === 'без управления' ? '—' : ((r && r.contract && r.contract !== '—' && r.contract !== 'не активен') ? ('активен с ' + r.contract) : 'не активен'),
      regHoliday: (r && r.contract && r.contract !== '—' && r.contract !== 'не активен') ? (r.holiday || 'нет данных') : '—' };
  }

  // РНВ считается наступившей, только если дата уже прошла
  rnvDone(v) {
    const m = String(v || '').match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return false;
    return new Date(+m[3], +m[2] - 1, +m[1]) <= new Date();
  }

  // Статус помещения — единая формула window.OMStatus (та же, что в матрице):
  // продажа из выгрузки КП, аренда — из реестра договоров и даты РНВ
  unitStatus(id, u) {
    if (/Продано|процессе оформления/i.test(u.status || '')) return this.statusLabel(u);
    if (window.OMStatus) return window.OMStatus.of(this, id, u);
    const r = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    const rnv = this.rnvDone(this.rnv && this.rnv[id]);
    const ended = r && /законч|не предусмотр/i.test(r.holiday || '');
    if (r && ended) return 'В аренде';
    if (r) return rnv ? 'В простое с арендатором' : 'Не введено в эксплуатацию с арендатором';
    if (!rnv) return 'Не введено в эксплуатацию';
    return 'В простое';
  }

  // Фактические продажи — отчёт по проданным КП на 02.09.2026
  // Фактические продажи — общий модуль sales.js (отчёт по проданным КП на 02.09.2026)
  sales = {};

  saleOf(id, u) {
    const num = String(u.number).split(',')[0].trim();
    const s = (this.sales[id] || {})[num];
    if (!s) return null;
    const rub = (v) => v == null ? '—' : Math.round(v).toLocaleString('ru-RU') + ' ₽';
    return { fact: rub(s[0]), agent: rub(s[1]), buyer: s[2] || '—', date: s[3] || 'нет данных' };
  }

  priceRefs = {};

  actualPrice(id, u) {
    if (!/Продано/i.test(u.status || '')) return null;
    const A = (x) => parseFloat(String(x.area).replace(/\s/g, '').replace(',', '.'));
    const P = (x) => parseFloat(String(x.price).replace(/[^\d]/g, ''));
    const a = A(u);
    if (!isFinite(a) || a <= 0) return null;
    const lit = String(id).split('_')[0];
    if (!/^\d+$/.test(lit)) return null;
    let pool = [];
    for (const k in this.units) {
      if (String(k).split('_')[0] !== lit) continue;
      for (const x of this.units[k]) {
        if (/Продано/i.test(x.status || '')) continue;
        const xa = A(x), xp = P(x);
        if (!isFinite(xa) || xa <= 0 || !isFinite(xp) || xp <= 0) continue;
        pool.push({ x, key: k, area: xa, rate: xp / xa });
      }
    }
    if (!pool.length) return null;
    const ref = this.priceRefs[id + '|' + String(u.number).split(',')[0].trim()];
    if (ref) {
      const rk = ref.split(':')[0], rn = ref.split(':')[1];
      for (const x of (this.units[rk] || [])) {
        if (String(x.number).split(',')[0].trim() !== rn) continue;
        const xa = A(x), xp = P(x);
        if (isFinite(xa) && xa > 0 && isFinite(xp) && xp > 0) pool = [{ x, key: rk, area: xa, rate: xp / xa }];
      }
    }
    const same = pool.filter(p => (p.x.liq || '') === (u.liq || ''));
    if (same.length) pool = same;
    pool.sort((p, q) => Math.abs(p.area - a) - Math.abs(q.area - a));
    const b = pool[0];
    const num = String(b.x.number).split(',')[0].trim();
    return {
      value: Math.round(b.rate * a).toLocaleString('ru-RU') + ' ₽',
      num: Math.round(b.rate * a),
      basis: 'Аналог: ' + (this.names[b.key] ? this.names[b.key] + ', ' : '') + 'пом. ' + num + ' — ' + b.x.area + ', ' + Math.round(b.rate).toLocaleString('ru-RU') + ' ₽/м² (' + (b.x.status || '') + ')',
    };
  }

  // годовой прирост стоимости: от фактической цены сделки до актуальной цены
  saleGrowth(id, u) {
    const ap = this.actualPrice(id, u);
    const num = String(u.number).split(',')[0].trim();
    const s = (this.sales[id] || {})[num];
    if (!ap || !s || !s[0]) return null;
    const base = s[0] - (s[1] || 0);
    if (!(base > 0)) return null;
    const total = (ap.num / base - 1) * 100;
    const fmt = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1).replace('.', ',') + '%';
    if (!s[3]) return '—';
    const p = s[3].split('.').map(Number);
    const yrs = (new Date(2026, 8, 3) - new Date(p[2], p[1] - 1, p[0])) / (365.25 * 86400000);
    if (!(yrs > 0.25)) return fmt(total) + ' за всё время';
    const cagr = (Math.pow(ap.num / base, 1 / yrs) - 1) * 100;
    return fmt(cagr) + ' в год (' + fmt(total) + ' за ' + yrs.toFixed(1).replace('.', ',') + ' г.)';
  }

  noMgmt = {};

  duMgmt = {};

  duMgmtForce = {};

  duMgmtRate = {};

  mgmtOf(id, u) {
    const nk = id + '|' + String(u.number).split(',')[0].trim();
    if (this.noMgmt[nk]) return { co: 'без управления', rate: '—', du: null };
    if (u.mgmtCo) return { co: u.mgmtCo, rate: u.mgmtCo === 'без управления' ? '—' : (u.mgmtRate || '—'), du: null };
    const du = this.duMgmt[id + '|' + String(u.number).split(',')[0].trim()];
    if (!du || (!this.hasReg(id, u) && !this.duMgmtForce[nk])) return { co: 'нет данных', rate: '—', du: null };
    const rate = this.duMgmtRate[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных';
    return { co: 'ООО «НПК»', rate, du };
  }

  // Адреса литеров и кадастровые номера — отчёт КП+РСО (kp_addr.js)
  literAddr = {};

  // Наименование торговой точки в проданном помещении: ключ — 'литер_подъезд|номер'.
  // Данных пока нет — заполнить, когда придёт выгрузка.
  soldTt = {};

  cadastre = {};

  pastTenants = {};

  // Простой при смене арендатора: от окончания предыдущего договора до активации текущего
  idleOnChange(id, u) {
    const key = id + '|' + String(u.number).split(',')[0].trim();
    const past = this.pastTenants[key];
    if (!past || !past.length) return '—';
    const end = (past[past.length - 1].period || '').split('—').pop().trim();
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(end)) return '—';
    const p = (s) => { const a = s.split('.').map(Number); return new Date(a[2], a[1] - 1, a[0]); };
    const r = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    const wDays = (n) => { const a = n % 10, b = n % 100; if (b >= 11 && b <= 14) return 'дней'; if (a === 1) return 'день'; if (a >= 2 && a <= 4) return 'дня'; return 'дней'; };
    if (r && r.contract && /^\d{2}\.\d{2}\.\d{4}$/.test(r.contract)) {
      const d = Math.round((p(r.contract) - p(end)) / 86400000);
      if (d < 0) return 'без простоя (договоры пересекаются)';
      return d + ' ' + wDays(d) + ' (' + end + ' — ' + r.contract + ')';
    }
    const d = Math.round((new Date(2026, 8, 4) - p(end)) / 86400000);
    return d >= 0 ? d + ' ' + wDays(d) + ' — нового арендатора нет (с ' + end + ')' : '—';
  }

  // Начислено за управление с начала 2026 года по 31.08.2026, по дням
  mgmtAccrued(id, u) {
    const m = this.mgmtOf(id, u);
    if (!m || m.co === 'без управления' || m.co === 'нет данных') return '0 ₽';
    const mm = String(m.rate).match(/·\s*([\d\s]+)\s*₽\/мес/);
    if (!mm) return '—';
    const monthly = parseFloat(mm[1].replace(/\s/g, ''));
    if (!isFinite(monthly) || monthly <= 0) return '—';
    const nk = id + '|' + String(u.number).split(',')[0].trim();
    const p = (s) => { const a = String(s).split('.').map(Number); return new Date(a[2], a[1] - 1, a[0]); };
    const r = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    let start = new Date(2026, 0, 1);
    if (r && r.contract && /^\d{2}\.\d{2}\.\d{4}$/.test(r.contract)) {
      const c = p(r.contract);
      if (c > start) start = c;
    }
    let end = new Date(2026, 7, 31);
    const off = this.mgmtInactiveSince[nk];
    if (off && /^\d{2}\.\d{2}\.\d{4}$/.test(off)) { const o = p(off); if (o < end) end = o; }
    if (start > end) return '0 ₽';
    let sum = 0;
    for (let y = start.getFullYear(), mo = start.getMonth(); ; mo++) {
      const ms = new Date(y, mo, 1), me = new Date(y, mo + 1, 0);
      if (ms > end) break;
      const a = ms > start ? ms : start, b = me < end ? me : end;
      const days = Math.round((b - a) / 86400000) + 1;
      const dim = me.getDate();
      if (days > 0) sum += monthly / dim * days;
    }
    return Math.round(sum).toLocaleString('ru-RU') + ' ₽';
  }

  // Начислено за аренду с 01.01.2026 по 31.08.2026, по дням, включая бывших арендаторов
  rentAccrued(id, u) {
    const YS = new Date(2026, 0, 1), YE = new Date(2026, 7, 31);
    const p = (s) => { const a = String(s).split('.').map(Number); return new Date(a[2], a[1] - 1, a[0]); };
    const ok = (s) => /^\d{2}\.\d{2}\.\d{4}$/.test(String(s || '').trim());
    const monthlyOf = (rate) => { const m = String(rate).match(/·\s*([\d\s]+)\s*₽\/мес/); return m ? parseFloat(m[1].replace(/\s/g, '')) : null; };
    const segs = [];
    const nk = id + '|' + String(u.number).split(',')[0].trim();
    const r = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    if (r && r.contract && r.contract !== 'не активен') {
      if (r.rates && r.rates.length) {
        for (const x of r.rates) if (ok(x.from)) segs.push({ from: p(x.from), till: ok(x.till) ? p(x.till) : new Date(2026, 11, 31), monthly: monthlyOf(x.rate) });
      } else {
        const startStr = (r.ratePeriod || '').split('—')[0].trim();
        const from = ok(startStr) ? p(startStr) : (ok(r.contract) ? p(r.contract) : null);
        if (from) segs.push({ from, till: new Date(2026, 11, 31), monthly: monthlyOf(r.rate) });
      }
    }
    for (const x of (this.pastTenants[nk] || [])) {
      const [a, b] = String(x.period || '').split('—').map(s => s.trim());
      if (ok(a) && ok(b)) segs.push({ from: p(a), till: p(b), monthly: monthlyOf(x.rate) });
    }
    let sum = 0, any = false, unknown = false;
    for (const s of segs) {
      const a0 = s.from > YS ? s.from : YS, b0 = s.till < YE ? s.till : YE;
      if (a0 > b0) continue;
      if (!s.monthly || !isFinite(s.monthly)) { unknown = true; continue; }
      any = true;
      for (let y = a0.getFullYear(), mo = a0.getMonth(); ; mo++) {
        const ms = new Date(y, mo, 1), me = new Date(y, mo + 1, 0);
        if (ms > b0) break;
        const a = ms > a0 ? ms : a0, b = me < b0 ? me : b0;
        const days = Math.round((b - a) / 86400000) + 1;
        if (days > 0) sum += s.monthly / me.getDate() * days;
      }
    }
    if (!any) return unknown ? 'нет данных о ставке' : '0 ₽';
    return Math.round(sum).toLocaleString('ru-RU') + ' ₽' + (unknown ? ' (без части периодов — ставка неизвестна)' : '');
  }

  rentSegs(id, u) {
    const p = (s) => { const a = String(s).split('.').map(Number); return new Date(a[2], a[1] - 1, a[0]); };
    const ok = (s) => /^\d{2}\.\d{2}\.\d{4}$/.test(String(s || '').trim());
    const monthlyOf = (rate) => { const m = String(rate).match(/·\s*([\d\s]+)\s*₽\/мес/); return m ? parseFloat(m[1].replace(/\s/g, '')) : null; };
    const segs = [];
    const nk = id + '|' + String(u.number).split(',')[0].trim();
    const r = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    if (r && r.contract && r.contract !== 'не активен') {
      if (r.rates && r.rates.length) {
        for (const x of r.rates) if (ok(x.from)) segs.push({ from: p(x.from), till: ok(x.till) ? p(x.till) : new Date(2026, 11, 31), monthly: monthlyOf(x.rate) });
      } else {
        const startStr = (r.ratePeriod || '').split('—')[0].trim();
        const from = ok(startStr) ? p(startStr) : (ok(r.contract) ? p(r.contract) : null);
        if (from) segs.push({ from, till: new Date(2026, 11, 31), monthly: monthlyOf(r.rate) });
      }
    }
    for (const x of (this.pastTenants[nk] || [])) {
      const [a, b] = String(x.period || '').split('—').map(s => s.trim());
      if (ok(a) && ok(b)) segs.push({ from: p(a), till: p(b), monthly: monthlyOf(x.rate) });
    }
    return segs;
  }

  // арендатор занимал помещение весь текущий период 2026 года (01.01—31.08)
  occupiedFullYTD(id, u) {
    const YS = new Date(2026, 0, 1), YE = new Date(2026, 7, 31);
    const segs = this.rentSegs(id, u).map(s => ({ a: s.from, b: s.till })).filter(s => s.b >= YS && s.a <= YE).sort((x, y) => x.a - y.a);
    if (!segs.length) return false;
    let cur = YS;
    for (const s of segs) {
      if (s.a > new Date(cur.getTime() + 86400000)) return false;
      if (s.b > cur) cur = s.b;
    }
    return cur >= YE;
  }

  // Помещения для сводки: литеры/НТО из выгрузки КП + отдельно стоящая коммерция (b1, b2)
  sumUnits() {
    const out = {};
    for (const k in this.units) out[k] = this.units[k];
    for (const bk in (this.bFloors || {})) {
      const cfg = this.bFloors[bk];
      const list = (cfg.floors || []).filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((a, f) => a.concat(f.units || []), []);
      if (list.length) out[bk] = list;
    }
    return out;
  }

  // Сколько дней помещение в простое: от РНВ (если арендаторов не было) или от расторжения с последним арендатором
  idleInfo(key, u) {
    const AS = new Date(2026, 8, 1);
    const p = (s) => { const a = String(s).split('.').map(Number); return new Date(a[2], a[1] - 1, a[0]); };
    const ok = (s) => /^\d{2}\.\d{2}\.\d{4}$/.test(String(s || '').trim());
    const nk = key + '|' + String(u.number).split(',')[0].trim();
    const past = this.pastTenants[nk];
    let from = null, src = '';
    if (past && past.length) {
      const e = String(past[past.length - 1].period || '').split('—').pop().trim();
      if (ok(e)) { from = p(e); src = 'с расторжения ' + e; }
    }
    if (!from) {
      const r = this.rnv[key];
      if (ok(r)) { from = p(r); src = 'с даты РНВ ' + r; }
    }
    if (!from) return null;
    const d = Math.round((AS - from) / 86400000);
    if (d < 0) return null;
    const a = d % 10, b = d % 100;
    const w = (b >= 11 && b <= 14) ? 'дней' : a === 1 ? 'день' : (a >= 2 && a <= 4) ? 'дня' : 'дней';
    return 'В простое ' + d + ' ' + w + ' ' + src + ' (данные на 01.09.2026)';
  }

  hasReg(id, u) { return !!(this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit); }

  // Актуальная на текущий год рыночная ставка — медиана действующих ставок по реестру ЖК
  marketRentVals(vals) {
    vals.marketRent = this.marketRentStr();
  }

  marketRentStr() {
    // кешируем только непустой результат: реестр аренды подгружается асинхронно
    if (this._mrs) return this._mrs;
    const vals = {};
    this.marketRentCalc(vals);
    this._mrs = vals.marketRent;
    return this._mrs;
  }

  marketRentCalc(vals) {
    const rates = [];
    for (const key in (this.tenantsReg || {})) for (const t of this.tenantsReg[key]) {
      const p = this.ratePick(t);
      const m = String((p && p.rate) || '').match(/([\d\s ]+)\s*₽\/м²/);
      if (m) { const v = parseFloat(m[1].replace(/[\s ]/g, '')); if (isFinite(v) && v > 0) rates.push(v); }
    }
    if (!rates.length) { vals.marketRent = ''; return; }
    rates.sort((a, b) => a - b);
    const mid = Math.floor(rates.length / 2);
    const med = rates.length % 2 ? rates[mid] : Math.round((rates[mid - 1] + rates[mid]) / 2);
    vals.marketRent = 'рынок ' + new Date().getFullYear() + ': ' + Math.round(med).toLocaleString('ru-RU') + ' ₽/м²';
  }

  normWater = 4.04;

  normPower = 90;

  residentsCapacity = null;

  utilities = {
    'Январь': {}, 'Февраль': {}, 'Март': {}, 'Апрель': {}, 'Май': {}, 'Июнь': {},
    'Июль': {}, 'Август': {}, 'Сентябрь': {}, 'Октябрь': {}, 'Ноябрь': {}, 'Декабрь': {},
  };

  occupancyVals(vals) {
    const ru = (v, d) => v.toLocaleString('ru-RU', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
    const nf = (v) => (typeof v === 'number' ? ru(v) : 'нет данных');
    let lastW = null, lastP = null, lastMonth = null, wSum = 0, pSum = 0, wN = 0, pN = 0;
    vals.utilityRows = Object.keys(this.utilities).map((m) => {
      const d = this.utilities[m] || {};
      const byW = typeof d.water === 'number' ? d.water / this.normWater : null;
      const byP = typeof d.power === 'number' ? d.power / this.normPower : null;
      // жильцы считаются по последнему месяцу с данными, а не по среднему за период
      if (byW !== null) { wSum += d.water; wN++; }
      if (byP !== null) { pSum += d.power; pN++; }
      if (byW !== null || byP !== null) { lastMonth = m; if (byW !== null) lastW = d.water; if (byP !== null) lastP = d.power; }
      const est = byW !== null ? byW : byP;
      return { month: m, water: nf(d.water), power: nf(d.power), residents: est === null || est === undefined ? '—' : ru(est) };
    });
    // расчётный месяц можно закрепить полем volMonth (если последний месяц выгружен частично)
    if (this.volMonth && this.utilities[this.volMonth] && typeof this.utilities[this.volMonth].water === 'number') {
      lastMonth = this.volMonth;
      lastW = this.utilities[this.volMonth].water;
      lastP = this.utilities[this.volMonth].power;
    }
    const byWater = lastW === null ? null : lastW / this.normWater;
    const byPower = lastP === null ? null : lastP / this.normPower;
    vals.occMonth = lastMonth || '—';
    // численность считаем по ХВС: норматив на человека не зависит от сезона.
    // электроэнергия для этого не годится — в объёме дома сидят ОДН, электроплиты и кондиционирование.
    const residents = byWater !== null ? byWater : byPower;
    vals.occResidents = residents === null ? '—' : ru(residents);
    vals.occByWater = byWater === null ? 'нет данных' : ru(byWater) + ' чел.';
    vals.occByPower = byPower === null ? 'нет данных' : ru(byPower) + ' чел.';
    vals.occPowerPerRes = (byWater && lastP !== null) ? ru(lastP / byWater) + ' кВт·ч/чел.·мес' : 'нет данных';
    vals.normWaterLabel = ru(this.normWater, 2) + ' м³/чел.·мес';
    vals.normPowerLabel = ru(this.normPower) + ' кВт·ч/чел.·мес';
    const pct = (residents !== null && this.residentsCapacity) ? Math.min(100, Math.round((residents / this.residentsCapacity) * 100)) : null;
    vals.occPct = pct === null ? '—' : pct + '%';
    // кольцо заполняется от середины (12 часов) симметрично в обе стороны
    {
      const p = pct || 0, s = 50 - p / 2, e = 50 + p / 2;
      vals.occRing = 'conic-gradient(from 180deg, #e6e2d8 0 ' + s + '%, #c9584c ' + s + '%, #a3312b 50%, #c9584c ' + e + '%, #e6e2d8 ' + e + '% 100%)';
    }
    vals.occCapacity = this.residentsCapacity ? ru(this.residentsCapacity) + ' чел.' : 'не задана';
    vals.occNote = residents === null
      ? 'Нет данных о потреблении — загрузите месячные объёмы ХВС и электроэнергии жилой части ЖК'
      : 'Расчёт по потреблению за ' + (lastMonth || '—') + ' и нормативу на 1 жителя';
    vals.utilityWaterTotal = wN ? ru(wSum) : 'нет данных';
    vals.utilityPowerTotal = pN ? ru(pSum) : 'нет данных';
    {
      const vi = this._volInfo;
      vals.volumeHouses = (vi && vi.houseRows) || [];
      vals.volumeHousesCount = (vi && vi.houseRows) ? vi.houseRows.length : 0;
      vals.volumeMonth = (vi && vi.month) || '—';
    }
    // динамика заселенности: расчётные жильцы по месяцам с данными ХВС
    {
      const skip = this.volSkipMonths || [];
      const pts = [];
      for (const m of Object.keys(this.utilities)) {
        const d = this.utilities[m] || {};
        if (typeof d.water !== 'number' || skip.indexOf(m) >= 0) continue;
        pts.push({ month: m, n: d.water / this.normWater });
      }
      const max = pts.reduce((s, p) => Math.max(s, p.n), 0);
      const min = pts.reduce((s, p) => Math.min(s, p.n), max);
      // разница между месяцами — в пределах процента, поэтому шкала сжата от lo
      const lo = (max - min) ? min - (max - min) * 0.9 : max * 0.92;
      const sign = (v) => (v >= 0 ? '+' : '−');
      const X = (i) => pts.length > 1 ? 6 + (i / (pts.length - 1)) * 88 : 50;
      const Y = (n) => (max > lo) ? 88 - ((n - lo) / (max - lo)) * 74 : 50;
      vals.occTrend = pts.map((p, i) => {
        const dd = i ? p.n - pts[i - 1].n : null;
        const last = i === pts.length - 1;
        return {
          month: p.month.slice(0, 3),
          value: ru(p.n),
          left: X(i).toFixed(1) + '%',
          top: Y(p.n).toFixed(1) + '%',
          dotBg: last ? '#a3312b' : '#c98a2b',
          labelColor: last ? '#a3312b' : '#6b6a64',
          delta: dd === null ? '—' : sign(dd) + ru(Math.abs(dd)),
          deltaColor: dd === null ? '#a89f8f' : (dd >= 0 ? '#3a7a42' : '#a3312b'),
        };
      });
      vals.occTrendCount = pts.length;
      // сглаживание: Catmull-Rom через кубические Безье по точкам месяцев
      const P = pts.map((p, i) => [X(i), Y(p.n)]);
      const f = (v) => v.toFixed(2);
      const curve = (() => {
        if (!P.length) return '';
        if (P.length === 1) return 'M ' + f(P[0][0]) + ',' + f(P[0][1]);
        let d = 'M ' + f(P[0][0]) + ',' + f(P[0][1]);
        for (let i = 0; i < P.length - 1; i++) {
          const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
          const t = 1 / 6;
          d += ' C ' + f(p1[0] + (p2[0] - p0[0]) * t) + ',' + f(p1[1] + (p2[1] - p0[1]) * t)
            + ' ' + f(p2[0] - (p3[0] - p1[0]) * t) + ',' + f(p2[1] - (p3[1] - p1[1]) * t)
            + ' ' + f(p2[0]) + ',' + f(p2[1]);
        }
        return d;
      })();
      vals.occTrendCurve = curve;
      vals.occTrendArea = curve ? curve + ' L ' + f(P[P.length - 1][0]) + ',97 L ' + f(P[0][0]) + ',97 Z' : '';
      if (pts.length > 1) {
        const f = pts[0].n, l = pts[pts.length - 1].n;
        vals.occTrendTotal = sign(l - f) + ru(Math.abs(l - f)) + ' чел.' + (f ? ' · ' + sign(l - f) + Math.abs(Math.round((l / f - 1) * 100)) + '%' : '');
        vals.occTrendTotalColor = (l - f) >= 0 ? '#3a7a42' : '#a3312b';
        vals.occTrendNote = pts[0].month.toLowerCase() + ' — ' + pts[pts.length - 1].month.toLowerCase()
          + ' · по ХВС и норме ' + ru(this.normWater, 2) + ' м³/чел.·мес · шкала от ' + ru(lo) + ' чел.';
      } else {
        vals.occTrendTotal = '—';
        vals.occTrendTotalColor = '#a89f8f';
        vals.occTrendNote = 'данных по месяцам недостаточно для динамики';
      }
    }
    vals.occupancyVisible = this.state.occupancyVisible || false;
    vals.toggleOccupancy = () => this.setState((s) => ({ occupancyVisible: !s.occupancyVisible }));
  }

  isFund(u) { return !!u.company && /ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(u.company); }

  isLeasedStatus(s) { return s === 'В аренде' || s === 'В аренде (ВГО)'; }

  isVacantStatus(s) { return s === 'Доступно для аренды' || s === 'Свободно'; }

  // «В аренде» у фонда/ПИФ в выгрузке КП = помещение простаивает в составе ДВК, а не сдано арендатору
  statusLabel(u) { return (this.isFund(u) && (this.isLeasedStatus(u.status) || this.isVacantStatus(u.status))) ? 'Простаивает (в ДВК)' : u.status; }

  enter(id) { this.setState({ hovered: id }); }

  leaveAll() { this.setState({ hovered: null }); }

  select(id) { this.setState({ selected: id, summaryFilter: null, hoveredUnitIdx: null, planZoom: false, zoomHoverIdx: null, floorIdx: 0 }); }

  closePanel() { this.setState({ selected: null, planZoom: false, hoveredUnitIdx: null, zoomHoverIdx: null }); }

  toggleSummary() { this.setState({ summaryPinned: !this.state.summaryPinned }); }

  openSummaryFilter(key, label) { this.setState({ summaryFilter: { key, label }, selected: null, summaryPinned: false, summaryHovered: false }); }

  fmtArea(n) { return n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' м²'; }

  // Сводка по ЖК — структура как в ЖК «Рекорд»: статус в ДВК, использование,
  // стройка и контроль, финансы и нижние разрезы. Считается напрямую из this.units.
  summaryExtra(vals) {
    const NOW = new Date(2026, 7, 31);
    const fA = (n) => this.fmtArea(n);
    const rub = (n) => Math.round(n).toLocaleString('ru-RU') + ' \u20bd';
    const NUM = (v) => parseFloat(String(v || '0').replace(/[\s\u00a0]/g, '').replace(',', '.')) || 0;
    const A = (u) => NUM(u.area);
    const P = (u) => parseFloat(String(u.price || '').replace(/[^\d]/g, '')) || 0;
    const fund = (u) => !!u.company && /ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(u.company);
    // отдельно стоящая коммерция, НТО, ЗУ и остановки — все в ДВК
    const inDvk = (u, key) => fund(u) || /^(b\d|nto|zu|stop)/.test(String(key || ''));
    const sold = (u) => u.status === 'Продано';
    const leasedS = (u) => u.status === 'В аренде' || u.status === 'В аренде (ВГО)';
    const vacantS = (u) => u.status === 'Доступно для аренды' || u.status === 'Свободно';
    const parseRu = (s) => { const p = String(s).split('.').map(Number); return new Date(p[2], p[1] - 1, p[0]); };
    const wDays = (n) => { const a = n % 10, b = n % 100; if (b >= 11 && b <= 14) return 'дней'; if (a === 1) return 'день'; if (a >= 2 && a <= 4) return 'дня'; return 'дней'; };
    const wUnits = (n) => { const a = n % 10, b = n % 100; if (b >= 11 && b <= 14) return 'помещений'; if (a === 1) return 'помещение'; if (a >= 2 && a <= 4) return 'помещения'; return 'помещений'; };
    const isNto = (key) => /^(nto|zu|stop)/.test(String(key || ''));
    // каникулы: пусто или «закончены/не предусмотрены» — договор уже приносит плату
    const ntoActive = (r) => !r.holiday || /законч|не предусмотр/i.test(r.holiday);
    const ntoReg = (key, u) => ((this.tenantsReg && this.tenantsReg[key]) || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    // доходность помещения: (NOI годовых + прирост цены за год) / OPEX × 100%
    const yieldPct = (key, u) => {
      const opex = this.numOf(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
      const noi = this.numOf(this.noiOf(key, u, this.cxTotalOf(key, u)));
      if (!(opex > 0) || noi === null) return null;
      return (noi * 12 / 8 + (this.numOf(this.assetGrowthYear(key, u)) || 0)) / opex * 100;
    };
    const capNorm = (u) => this.numOf(u.effCap || '14%') || 14;
    // отдельно стоящая коммерция без стройготовности — приравнивается к «не введено»
    const noReady = (u, key) => /^b\d/.test(String(key || '')) && !sold(u) && !/в аренде/i.test(this.unitStatus(key, u));
    // квартальная динамика договоров: отчётный квартал — III кв. 2026 (01.07–30.09.2026)
    const qFrom = new Date(2026, 6, 1), qTill = new Date(2026, 8, 30);
    const inQ = (s) => { const m = String(s || '').match(/(\d{2})\.(\d{2})\.(\d{4})/); if (!m) return false; const d = new Date(+m[3], +m[2] - 1, +m[1]); return d >= qFrom && d <= qTill; };
    const regOf = (key, u) => ((this.tenantsReg && this.tenantsReg[key]) || []).find(r => r.unit && String(u.number).split(',')[0].trim() === r.unit) || null;
    const pastOf = (key, u) => (this.pastTenants && this.pastTenants[key + '|' + String(u.number).split(',')[0].trim()]) || [];
    const holidayEnd = (r) => { const m = String((r && r.holiday) || '').match(/(\d{2})\.(\d{2})\.(\d{4})/); return m ? m[0] : null; };
    const preds = {
      total: () => true,
      qSigned: (u, key) => { const r = regOf(key, u); return !!r && inQ(r.contract); },
      qActivated: (u, key) => { const r = regOf(key, u); return !!r && inQ(r.contract); },
      qWorking: (u, key) => { const r = regOf(key, u); return !!r && inQ(holidayEnd(r)); },
      qTermBefore: (u, key) => pastOf(key, u).some(p => { const e = String(p.period || '').split('—').pop().trim(); const s = String(p.period || '').split('—')[0].trim(); return inQ(e) && s === e; }),
      qTermAfter: (u, key) => pastOf(key, u).some(p => { const parts = String(p.period || '').split('—'); const e = (parts.pop() || '').trim(), s = (parts[0] || '').trim(); return inQ(e) && s !== e; }),
      sold: sold,
      rentBelowMkt: (u, key) => { const g = this.rentGapInfo(key, u); return !!g && g.gap < -0.02 && /в аренде/i.test(this.unitStatus(key, u)); },
      rentAboveMkt: (u, key) => { const g = this.rentGapInfo(key, u); return !!g && g.gap >= -0.02 && /в аренде/i.test(this.unitStatus(key, u)); },
      effBelow: (u, key) => !sold(u) && yieldPct(key, u) !== null && yieldPct(key, u) < capNorm(u),
      effAbove: (u, key) => !sold(u) && yieldPct(key, u) !== null && yieldPct(key, u) >= capNorm(u),
      dvkOwned: (u, key) => inDvk(u, key) && !sold(u),
      dvk: (u, key) => inDvk(u, key) && !sold(u) && !/в аренде/i.test(this.unitStatus(key, u)),
      notdvk: (u, key) => !sold(u) && !inDvk(u, key),
      leased: (u, key) => !sold(u) && /в аренде/i.test(this.unitStatus(key, u)),
      vacant: (u, key) => !inDvk(u, key) && !sold(u) && !/в аренде/i.test(this.unitStatus(key, u)) && (vacantS(u) || this.hasReg(key, u)),
      other: (u, key) => !sold(u) && !inDvk(u, key) && !/в аренде/i.test(this.unitStatus(key, u)) && !vacantS(u) && !this.hasReg(key, u),
      uLeased: (u, key) => !sold(u) && /в аренде/i.test(this.unitStatus(key, u)),
      uIdleT: (u, key) => !sold(u) && !noReady(u, key) && /в простое с арендатором/i.test(this.unitStatus(key, u)),
      uIdle: (u, key) => { const s = this.unitStatus(key, u); return !sold(u) && !noReady(u, key) && /в простое/i.test(s) && !/с арендатором/i.test(s); },
      // помещения без стройготовности считаем как «не введено»
      uNvT: (u, key) => { const s = this.unitStatus(key, u); return !sold(u) && (/не введено/i.test(s) || noReady(u, key)) && /с арендатором/i.test(s); },
      uNv: (u, key) => { const s = this.unitStatus(key, u); return !sold(u) && (/не введено/i.test(s) || noReady(u, key)) && !/с арендатором/i.test(s); },
      // НТО, аренда ЗУ и остановки считаются отдельно (плитка «Аренда НТО и ЗУ»)
      buildLoss: (u, key) => !sold(u) && !isNto(key) && /не введено/i.test(this.unitStatus(key, u)),
      nto: (u, key) => isNto(key),
      // у НТО и ЗУ нет даты РНВ: аренда — действующий договор в реестре,
      // «в простое с арендатором» — договор есть, но арендные каникулы не закончились
      ntoLeased: (u, key) => isNto(key) && (ntoReg(key, u) ? ntoActive(ntoReg(key, u)) : /в аренде/i.test(u.status || '')),
      ntoIdleT: (u, key) => isNto(key) && !!ntoReg(key, u) && !ntoActive(ntoReg(key, u)),
      ntoIdle: (u, key) => isNto(key) && !ntoReg(key, u) && !/в аренде/i.test(u.status || ''),
    };
    // НТО, аренда ЗУ и остановки в основные категории не входят — у них своя строка
    for (const pk in preds) {
      if (/^nto/.test(pk)) continue;
      const base = preds[pk];
      preds[pk] = (u, key) => !isNto(key) && base(u, key);
    }
    const agg = {};
    const SU = this.sumUnits();
    for (const k in preds) agg[k] = { c: 0, a: 0, p: 0 };
    for (const key in SU) for (const u of SU[key]) {
      for (const k in preds) if (preds[k](u, key)) { agg[k].c++; agg[k].a += A(u); agg[k].p += P(u); }
    }
    for (const k in agg) { vals[k + 'Count'] = agg[k].c; vals[k + 'Area'] = fA(agg[k].a); }
    // сырьё для матрицы ЖК (агрегаты без форматирования)
    vals.__agg = agg;
    vals.soldSharePct = agg.total.a ? Math.round((agg.sold.a / agg.total.a) * 100) + '%' : '—';
    vals.rentedSharePct = agg.total.a ? Math.round((agg.vacant.a / agg.total.a) * 100) + '%' : '—';
    vals.rentedCount = agg.vacant.c; vals.rentedArea = fA(agg.vacant.a);
    vals.openDvkOwned = () => this.openSummaryFilter('dvkOwned', 'Передано в ДВК');
    // сноска к плитке «Передано в ДВК» — распределение по владельцам
    const ownerName = (u) => {
      const c = String(u.company || '');
      if (/ПРОФИТ КАПИТАЛ/.test(c)) return 'ЗКПИФ «Д-Капитал»';
      const lf = c.match(/ЛИЧНЫЙ ФОНД\s*[«"]?([^»"]+)/i);
      if (lf) return 'Личный фонд «' + lf[1].trim() + '»';
      return c.replace(/^ИП\s+/, '').replace(/\s+/g, ' ').trim() || 'владелец не указан';
    };
    const ownAgg = {};
    for (const key in SU) for (const u of SU[key]) {
      if (!preds.dvkOwned(u, key)) continue;
      const n = ownerName(u);
      if (!ownAgg[n]) ownAgg[n] = { c: 0, a: 0 };
      ownAgg[n].c++; ownAgg[n].a += A(u);
    }
    vals.dvkOwners = Object.keys(ownAgg).sort((x, y) => ownAgg[y].a - ownAgg[x].a)
      .map(n => n + ' — ' + ownAgg[n].c + ' ' + wUnits(ownAgg[n].c) + ', ' + fA(ownAgg[n].a));
    // сумма продаж — только по сделкам с агентскими платежами, по фактическим ценам из карточек
    let soldFactP = 0, soldFactA = 0, soldFactN = 0, soldAllP = 0, soldAllN = 0, soldAllA = 0, soldAgentFee = 0;
    for (const key in SU) for (const u of SU[key]) {
      if (!sold(u)) continue;
      const s = this.saleOf(key, u);
      if (!s) continue;
      const v = parseFloat(String(s.fact).replace(/[^\d]/g, '')) || 0;
      soldAllP += v; soldAllN++; soldAllA += A(u);
      if (s.agent && s.agent !== '—') soldAgentFee += parseFloat(String(s.agent).replace(/[^\d]/g, '')) || 0;
      if (!s.agent || s.agent === '—') continue;
      soldFactP += v; soldFactA += A(u); soldFactN++;
    }
    vals.soldSum = soldAllN ? rub(soldAllP) : 'нет данных';
    vals.soldAvgSqm = soldFactA ? Math.round(soldFactP / soldFactA).toLocaleString('ru-RU') + ' \u20bd/м²' : '—';
    let soldNowP = 0;
    for (const key in SU) for (const u of SU[key]) {
      if (!sold(u)) continue;
      const s = this.saleOf(key, u);
      if (!s || !s.agent || s.agent === '—') continue;
      const ap = this.actualPrice(key, u);
      soldNowP += (ap && ap.num) ? ap.num : P(u);
    }
    // актуальная стоимость проданного и годовой рост — только по сделкам с агентскими.
    // ставка r решается численно из уравнения Σ база_i·(1+r)^срок_i = Σ актуальная_i:
    // каждая сделка растёт свой срок, поэтому средневзвешенный срок здесь не годится
    {
      const deals = [];
      let base = 0, now = 0;
      const NOW = new Date(2026, 8, 3);
      for (const key in SU) for (const u of SU[key]) {
        if (!sold(u)) continue;
        const s = this.saleOf(key, u);
        if (!s || !s.agent || s.agent === '—') continue;
        const num = String(u.number).split(',')[0].trim();
        const raw = (this.sales[key] || {})[num];
        if (!raw || !raw[0] || !raw[3]) continue;
        const b = raw[0] - (raw[1] || 0);
        const ap = this.actualPrice(key, u);
        const n = (ap && ap.num) ? ap.num : 0;
        if (!(b > 0) || !n) continue;
        const p = String(raw[3]).split('.').map(Number);
        const yrs = (NOW - new Date(p[2], p[1] - 1, p[0])) / (365.25 * 86400000);
        if (!(yrs > 0)) continue;
        deals.push({ b: b, n: n, y: yrs });
        base += b; now += n;
      }
      const pct = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1).replace('.', ',') + '%';
      vals.soldNowValue = now ? rub(now) : '—';
      if (deals.length && base && now) {
        // денежно-взвешенная ставка: бинарный поиск по r
        const fv = (r) => deals.reduce((s, d) => s + d.b * Math.pow(1 + r, d.y), 0);
        let lo = -0.9, hi = 2, r = 0;
        for (let i = 0; i < 80; i++) { r = (lo + hi) / 2; if (fv(r) > now) hi = r; else lo = r; }
        const total = (now / base - 1) * 100;
        const minY = Math.min.apply(null, deals.map((d) => d.y));
        const maxY = Math.max.apply(null, deals.map((d) => d.y));
        vals.soldGrowthPct = pct(r * 100) + ' в год';
        vals.soldGrowthNote = pct(total) + ' за всё время · ' + deals.length + ' сделок, с даты сделки прошло '
          + minY.toFixed(1).replace('.', ',') + '–' + maxY.toFixed(1).replace('.', ',') + ' г.';
      } else {
        vals.soldGrowthPct = '—';
        vals.soldGrowthNote = 'нет сделок с датой и актуальной ценой';
      }
    }
    vals.soldFactNote = soldAllN ? 'средняя цена и рынок — только по сделкам с агентскими (' + soldFactN + ' из ' + soldAllN + ')' : 'отчёта по фактическим продажам нет';
    vals.soldAllAvgSqm = soldAllA ? Math.round(soldAllP / soldAllA).toLocaleString('ru-RU') + ' ₽/м²' : 'нет данных';
    vals.soldAgentSum = soldFactN ? rub(soldFactP) : 'нет данных';
    vals.soldAgentFee = soldAgentFee ? rub(soldAgentFee) : 'нет данных';
    // начислено с начала года по карточкам: аренда и управление
    let rentYtdNum = 0, mgmtYtdNum = 0;
    {
      let rentSum = 0, mgmtSum = 0, rentSumLeased = 0, rentAreaLeased = 0;
      const num = (s) => parseFloat(String(s).replace(/[^\d]/g, '')) || 0;
      for (const key in SU) for (const u of SU[key]) {
        if (sold(u)) continue;
        const rv = num(this.rentAccrued(key, u));
        rentSum += rv;
        if (/в аренде/i.test(this.unitStatus(key, u))) { rentSumLeased += rv; rentAreaLeased += A(u); }
        mgmtSum += num(this.mgmtAccrued(key, u));
      }
      vals.rentLeasedAvg = (rentSumLeased && rentAreaLeased) ? Math.round(rentSumLeased / rentAreaLeased / 8).toLocaleString('ru-RU') + ' ₽/м²' : 'нет данных';
      vals.rentYtdSum = rentSum ? rub(rentSum) : 'нет данных';
      rentYtdNum = rentSum; mgmtYtdNum = mgmtSum;
      vals.mgmtYtdSum = rub(mgmtSum);
      vals.rentYtdNote = 'начислено 01.01–31.08.2026 · управление: ' + (mgmtSum ? rub(mgmtSum) : 'нет данных');
    }
    vals.soldNowSum = soldNowP ? rub(soldNowP) : 'нет данных';
    vals.soldNowAvgSqm = soldFactA ? Math.round(soldNowP / soldFactA).toLocaleString('ru-RU') + ' \u20bd/м²' : '—';
    // непроданный портфель — по рыночной (актуальной) цене из карточек
    {
      let up = 0, ua = 0;
      for (const key in SU) for (const u of SU[key]) {
        if (sold(u)) continue;
        const ap = this.actualPrice(key, u);
        const v = (ap && ap.num) ? ap.num : P(u);
        if (!v) continue;
        up += v; ua += A(u);
      }
      vals.unsoldSum = rub(up);
      vals.unsoldAvgSqm = ua ? Math.round(up / ua).toLocaleString('ru-RU') + ' \u20bd/м²' : '—';
      // прирост цены актива в среднем за год по непроданным: сумма (цена − OPEX) / срок с РНВ
      let gYear = 0, gOpex = 0;
      for (const key in SU) for (const u of SU[key]) {
        if (sold(u)) continue;
        const g = this.numOf(this.assetGrowthYear(key, u));
        if (g === null) continue; // без рыночной цены или без даты РНВ — не учитываем ни прирост, ни OPEX
        const ox = this.numOf(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
        gYear += g;
        if (ox !== null) gOpex += ox;
      }
      vals.unsoldGrowth = gYear ? rub(gYear) + '/год' : 'нет данных';
      vals.unsoldGrowthPct = (gYear && gOpex > 0) ? (gYear / gOpex * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '% годовых к OPEX' : '—';
      vals.unsoldGrowthColor = gYear >= 0 ? '#3a6b3f' : '#a3312b';
    }

    // раздел «Доходность»: NOI, cap rate и общая доходность по непроданным помещениям
    {
      let noiY = 0, opexS = 0, growS = 0, noiFact = 0, anyY = false, noiYg = 0, opexG = 0, priceS = 0, noiYp = 0, backS = 0, dynS = 0;
      for (const key in SU) for (const u of SU[key]) {
        if (sold(u)) continue;
        const opex = this.numOf(this.sumRub({ ...u, opStart: this.startInvest(u) }, ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
        const noi = this.numOf(this.noiOf(key, u, this.cxTotalOf(key, u)));
        if (!(opex > 0) || noi === null) continue;
        anyY = true; opexS += opex; noiFact += noi; noiY += noi * 12 / 8;
        // общая доходность — только помещения с рыночной ценой (иначе прироста нет)
        const g = this.numOf(this.assetGrowthYear(key, u));
        if (g !== null) { growS += g; noiYg += noi * 12 / 8; opexG += opex; }
        // cap rate — к стоимости актива: только помещения с известной ценой
        const p = this.numOf((this.actualPrice(key, u) || {}).value || u.marketPrice || u.price);
        if (p > 0) {
          priceS += p; noiYp += noi * 12 / 8;
          const dm = String(u.effPriceDyn || '').match(/([+−-])?\s*([\d\s]+(?:[.,]\d+)?)\s*%/);
          if (dm) dynS += p * (/[−-]/.test(dm[1] || '') ? -1 : 1) * parseFloat(dm[2].replace(/\s/g, '').replace(',', '.')) / 100;
        }
        backS += Math.max(0, Math.min(opex, noi));
      }
      const capPct = priceS > 0 ? noiYp / priceS * 100 : null;
      const totPct = opexG > 0 ? (noiYg + growS) / opexG * 100 : null;
      const norm = 14;
      const f1 = (v) => v.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%';
      vals.__y = { noiFact: noiFact, noiY: noiY, opexS: opexS, priceS: priceS, noiYp: noiYp, growS: growS, noiYg: noiYg, opexG: opexG, backS: backS, dynS: dynS };
      vals.yieldShow = anyY;
      vals.yNoi = rub(noiFact);
      vals.yNoiNote = 'в годовом выражении ' + rub(noiY);
      vals.yCap = capPct === null ? '—' : f1(capPct);
      vals.yCapNote = 'NOI годовых ' + rub(noiYp) + ' / стоимость активов ' + rub(priceS);
      vals.yCapColor = (capPct !== null && capPct >= norm) ? '#3a7a42' : '#c98a2b';
      const yocPct = opexS > 0 ? noiY / opexS * 100 : null;
      vals.yYoc = yocPct === null ? '—' : f1(yocPct);
      vals.yYocNote = 'NOI годовых ' + rub(noiY) + ' / OPEX ' + rub(opexS);
      vals.yYocColor = (yocPct !== null && yocPct >= norm) ? '#3a7a42' : '#c98a2b';
      const fullPct = priceS > 0 ? (noiYp + dynS) / priceS * 100 : null;
      vals.yFull = fullPct === null ? '—' : f1(fullPct);
      vals.yFullNote = dynS ? 'cap rate + ожидаемая динамика ' + rub(dynS) : 'cap rate; ожидаемая динамика цены не задана';
      vals.yFullColor = (fullPct !== null && fullPct >= norm) ? '#3a7a42' : '#c98a2b';
      vals.yBack = opexS > 0 ? f1(backS / opexS * 100) : '—';
      vals.yBackNote = rub(backS) + ' из OPEX ' + rub(opexS);
      vals.yTotal = totPct === null ? '—' : f1(totPct);
      vals.yTotalSum = rub(noiYg + growS) + '/год';
      vals.yTotalNote = 'NOI ' + rub(noiYg) + ' + прирост ' + rub(growS);
      vals.yTotalColor = (totPct !== null && totPct >= norm) ? '#3a7a42' : '#a3312b';
      // из помещений ниже норматива — сколько в аренде и сколько в простое
      {
        let bl = 0, bi = 0, al = 0, ai = 0;
        for (const key in SU) for (const u of SU[key]) {
          const leased = /в аренде/i.test(this.unitStatus(key, u));
          if (preds.effBelow(u, key)) { if (leased) bl++; else bi++; }
          else if (preds.effAbove(u, key)) { if (leased) al++; else ai++; }
        }
        vals.yBelowSplit = 'в аренде ' + bl + ' · в простое ' + bi;
        vals.yAboveSplit = 'в аренде ' + al + ' · в простое ' + ai;
      }
      vals.yNormBelow = 'общая доходность вложений < ' + norm + '%';
      vals.yNormAbove = 'общая доходность вложений ≥ ' + norm + '%';
      vals.qSignedNote = 'III кв. 2026';
      vals.qActivatedNote = 'III кв. 2026';
      vals.qWorkingNote = 'III кв. 2026';
      // расторжения: инициатор берём из поля by в реестре бывших арендаторов
      {
        const cnt = { before: { t: 0, l: 0, n: 0 }, after: { t: 0, l: 0, n: 0 } };
        for (const key in SU) for (const u of SU[key]) {
          for (const bucket of ['before', 'after']) {
            if (!preds[bucket === 'before' ? 'qTermBefore' : 'qTermAfter'](u, key)) continue;
            const past = (this.pastTenants && this.pastTenants[key + '|' + String(u.number).split(',')[0].trim()]) || [];
            for (const p of past) {
              const parts = String(p.period || '').split('—');
              const e = (parts.pop() || '').trim(), s = (parts[0] || '').trim();
              if (!inQ(e) || (bucket === 'before') !== (s === e)) continue;
              const by = String(p.by || '');
              if (/арендатор/i.test(by)) cnt[bucket].t++;
              else if (/арендодател|двк|собственник/i.test(by)) cnt[bucket].l++;
              else cnt[bucket].n++;
            }
          }
        }
        const fmt = (c) => (c.t + c.l) ? ('по инициативе арендатора ' + c.t + ' · арендодателя ' + c.l + (c.n ? ' · без данных ' + c.n : ''))
          : (c.n ? 'инициатор не указан: ' + c.n : 'инициатор: нет данных');
        vals.qTermBeforeBy = fmt(cnt.before);
        vals.qTermAfterBy = fmt(cnt.after);
      }
      vals.qTermBeforeNote = 'III кв. 2026';
      vals.qTermAfterNote = 'III кв. 2026';
      vals.openQSigned = () => this.openSummaryFilter('qSigned', 'Договоры, подписанные в III кв. 2026');
      vals.openQActivated = () => this.openSummaryFilter('qActivated', 'Договоры, активированные в III кв. 2026');
      vals.openQWorking = () => this.openSummaryFilter('qWorking', 'Вышли в работу в III кв. 2026');
      vals.openQTermBefore = () => this.openSummaryFilter('qTermBefore', 'Расторгнуто до начала работы, III кв. 2026');
      vals.openQTermAfter = () => this.openSummaryFilter('qTermAfter', 'Расторгнуто после начала работы, III кв. 2026');
      { let lack = 0, extra = 0; const SU2 = this.sumUnits();
        for (const key in SU2) for (const u of SU2[key]) { const g = this.rentGapInfo(key, u); if (!g || !/в аренде/i.test(this.unitStatus(key, u))) continue; if (g.gap < -0.02) lack -= g.diff; else extra += g.diff; }
        vals.rentBelowMktNote = lack > 0 ? 'недобор ' + rub(lack) + '/мес до рыночной ставки' : 'таких помещений нет';
        vals.rentAboveMktNote = extra > 0 ? 'сверх рыночной ставки ' + rub(extra) + '/мес' : 'таких помещений нет';
      }
      vals.openRentBelowMkt = () => this.openSummaryFilter('rentBelowMkt', 'Ставка аренды ниже рыночной');
      vals.openRentAboveMkt = () => this.openSummaryFilter('rentAboveMkt', 'Ставка аренды по рынку или выше');
      vals.openEffBelow = () => this.openSummaryFilter('effBelow', 'Общая доходность ниже норматива ' + norm + '%');
      vals.openEffAbove = () => this.openSummaryFilter('effAbove', 'Общая доходность не ниже норматива ' + norm + '%');
    }

    {
      const m = {};
      for (const key in SU) for (const u of SU[key]) {
        if (!preds.vacant(u, key)) continue;
        if (!m[u.liq]) m[u.liq] = { count: 0, area: 0 };
        m[u.liq].count++; m[u.liq].area += A(u);
      }
      vals.liqRented = Object.keys(m).map(l => `${l}: ${m[l].count} (${fA(m[l].area)})`);
    }

    // выдержка по дате РНВ
    const aging = (match) => {
      const g = {};
      for (const key in this.units) {
        const r = this.rnv[key];
        if (!r) continue;
        for (const u of this.units[key]) if (match(u, key)) g[r] = (g[r] || 0) + 1;
      }
      const keys = Object.keys(g).sort((a, b) => parseRu(a) - parseRu(b));
      const out = keys.slice(0, 3).map((r) => {
        const n = g[r], d = Math.floor((NOW - parseRu(r)) / 86400000);
        if (d < 0) return n + ' ' + wUnits(n) + ' — РНВ ' + r + ' ещё не наступил (через ' + (-d) + ' ' + wDays(-d) + ')';
        return n + ' ' + wUnits(n) + ' — ' + d + ' ' + wDays(d) + ' с даты РНВ ' + r;
      });
      if (keys.length > 3) {
        const rest = keys.slice(3).reduce((s, r) => s + g[r], 0);
        out.push('и ещё ' + rest + ' ' + wUnits(rest) + ' по другим датам РНВ');
      }
      return out;
    };
    vals.notDvkAging = aging(preds.notdvk);
    vals.dvkIdleAging = aging(preds.dvk);

    // помещения в простое дольше 6 месяцев (от РНВ или от расторжения с последним арендатором)
    const stuck = [];
    for (const key in SU) {
      for (const u of SU[key]) {
        if (sold(u)) continue;
        const st = this.unitStatus(key, u);
        if (!/в простое/i.test(st) || /с арендатором/i.test(st)) continue;
        const info = this.idleInfo(key, u);
        if (!info) continue;
        const dm = String(info).match(/(\d+)/);
        const days = dm ? parseInt(dm[1], 10) : 0;
        if (!(days >= 182)) continue;
        stuck.push({ number: u.number, area: u.area, location: this.names[key] || key, days, areaNum: A(u) });
      }
    }
    stuck.sort((a, b) => b.days - a.days || b.areaNum - a.areaNum);
    vals.stuck6Count = stuck.length;
    vals.stuck6Area = fA(stuck.reduce((s, u) => s + u.areaNum, 0));
    {
      const mm0 = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/);
      const mr0 = mm0 ? (parseFloat(mm0[1].replace(/[\s ]/g, '')) || 0) : 0;
      const loss = stuck.reduce((s, u) => s + u.areaNum * mr0 * (u.days / 30.44), 0);
      vals.stuck6Loss = mr0 ? rub(loss) : 'нет данных';
      vals.stuck6LossNote = mr0 ? 'площадь × ' + mr0.toLocaleString('ru-RU') + ' ₽/м² × срок простоя' : 'нет рыночной ставки';
      vals.buildLossSum = mr0 ? rub(agg.buildLoss.a * mr0 * 8) : 'нет данных';
      vals.buildLossNote = mr0 ? 'площадь × ' + mr0.toLocaleString('ru-RU') + ' ₽/м² × 8 мес' : 'нет рыночной ставки';
    }
    // НТО, аренда ЗУ и остановки: собственный расчёт по договорам реестра
    {
      let month = 0, withRate = 0;
      for (const key in (this.tenantsReg || {})) {
        if (!/^(nto|zu|stop)/.test(key)) continue;
        for (const tr of this.tenantsReg[key]) {
          const p = this.ratePick(tr);
          const m = String((p && p.rate) || '').match(/·\s*([\d\s ]+)\s*₽\/мес/);
          if (m) { const v = parseFloat(m[1].replace(/[\s ]/g, '')); if (isFinite(v)) { month += v; withRate++; } }
        }
      }
      vals.ntoRentSum = month ? rub(month) + '/мес' : 'нет данных';
      // максимум по НТО и ЗУ — вся их площадь по ставке 2 000 ₽/м² и экономическая эффективность
      const ntoMaxMonth = (agg.nto.a || 0) * 2000;
      vals.ntoMaxFlow = ntoMaxMonth ? rub(ntoMaxMonth * 12) + '/год' : 'нет данных';
      vals.ntoEff = (ntoMaxMonth && month) ? (month / ntoMaxMonth * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%' : '—';
      vals.ntoEffColor = (ntoMaxMonth && month) ? ((month / ntoMaxMonth) >= 0.9 ? '#3a7a42' : ((month / ntoMaxMonth) >= 0.7 ? '#9a6b1a' : '#a3312b')) : '#948f83';
      vals.ntoNote = withRate
        ? withRate + ' ' + (withRate === 1 ? 'договор' : (withRate < 5 ? 'договора' : 'договоров')) + ' по реестру · ставка 2 000 ₽/м²'
        : 'договоров в реестре нет';
    }
    // месячный арендный поток по действующим договорам помещений в аренде
    {
      let month = 0;
      for (const key in SU) for (const u of SU[key]) {
        if (!preds.uLeased(u, key)) continue;
        const rr = (this.tenantsReg[key] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
        const pr = rr ? this.ratePick(rr) : null;
        const mm = String((pr && pr.rate) || '').match(/·\s*([\d\s\u00a0]+)\s*₽\/мес/);
        if (mm) { const v = parseFloat(mm[1].replace(/[\s\u00a0]/g, '')); if (isFinite(v)) month += v; }
      }
      vals.uLeasedMonth = month ? rub(month) + '/мес' : 'нет данных';
      // максимальный арендный поток и экономическая эффективность по помещениям в аренде
      const mrM = String(this.marketRentStr() || '').match(/:\s*([\d\s\u00a0]+)\s*₽/);
      const mrRate = mrM ? (parseFloat(mrM[1].replace(/[\s\u00a0]/g, '')) || 0) : 0;
      // максимум — вся площадь ЖК без проданных (наши помещения) по рыночной ставке
      const ourArea = Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0));
      const maxMonth = ourArea * mrRate;
      vals.uLeasedMaxFlow = maxMonth ? rub(maxMonth * 12) + '/год' : 'нет данных';
      vals.uLeasedEff = (maxMonth && month) ? (month / maxMonth * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%' : '—';
      vals.uLeasedEffColor = (maxMonth && month) ? ((month / maxMonth) >= 0.9 ? '#3a7a42' : ((month / maxMonth) >= 0.7 ? '#9a6b1a' : '#a3312b')) : '#948f83';
    }
    vals.hasNto = agg.nto.c > 0;
    vals.openNto = () => this.openSummaryFilter('nto', 'НТО, аренда ЗУ и остановки');
    vals.openNtoLeased = () => this.openSummaryFilter('ntoLeased', 'НТО и ЗУ в аренде');
    vals.openNtoIdleT = () => this.openSummaryFilter('ntoIdleT', 'НТО и ЗУ в простое с арендатором');
    vals.openNtoIdle = () => this.openSummaryFilter('ntoIdle', 'НТО и ЗУ в простое');
    vals.topStuck = stuck.slice(0, 5);

    // реестр договоров аренды
    const reg = [];
    for (const key in (this.tenantsReg || {})) for (const t of this.tenantsReg[key]) reg.push({ ...t, location: this.names[key] || key });
    vals.tenantsRegCount = reg.length;
    vals.tenantsRegArea = fA(reg.reduce((s, t) => s + NUM(t.area), 0));
    vals.tenantsRegNote = reg.length ? 'реестр договоров аренды на 27.08.2026' : 'договоров в реестре нет';
    vals.tenantDebts = [];

    // проблемы
    const problem = (title, bad, okText, badText, key, label) => ({
      title, verdict: bad ? badText : okText, color: bad ? '#a3312b' : '#3a7a42',
      onClick: () => { if (key) this.openSummaryFilter(key, label); },
    });
    vals.problemRows = [
      problem('1. Не передано в ДВК при наличии РНВ', agg.notdvk.c > 0,
        'Нарушение отсутствует', 'Нарушение: ' + agg.notdvk.c + ' ' + wUnits(agg.notdvk.c) + ' (' + fA(agg.notdvk.a) + ') не переданы в ДВК', 'notdvk', 'Не передано в ДВК'),
      problem('2. Отсутствие арендатора по истечении 6 месяцев с даты РНВ', stuck.length > 0,
        'Нарушение отсутствует', 'Нарушение: ' + stuck.length + ' ' + wUnits(stuck.length) + ' без арендатора 6+ мес', 'stuck6', 'Без арендатора 6+ мес с РНВ'),
      problem('3. Простой помещений в составе ДВК', agg.dvk.c > 0,
        'Нарушение отсутствует', 'Нарушение: ' + agg.dvk.c + ' ' + wUnits(agg.dvk.c) + ' (' + fA(agg.dvk.a) + ') простаивают у ДВК', 'dvk', 'В простое у ДВК'),
      problem('4. Дебиторская задолженность свыше ежемесячной платы дольше 2 месяцев', false,
        'Нет данных о начислениях и оплатах — проверка не выполняется', '', null, null),
    ];

    // маркеры эффективности
    const workPool = agg.total.c - agg.sold.c - agg.buildLoss.c, workArea = agg.total.a - agg.sold.a - agg.buildLoss.a;
    const allPool = agg.total.c - agg.sold.c, allArea = agg.total.a - agg.sold.a;
    const pct = (a, b) => b ? Math.round((a / b) * 100) + '%' : '—';
    const H = (text) => ({ text, size: '10px', weight: '700', color: '#a89f8f', tt: 'uppercase', mt: '12px', hint: '' });
    const R = (text, hint) => ({ text, size: '12px', weight: '400', color: '#948f83', tt: 'none', mt: '0px', hint: hint || '' });
    vals.effRows = [
      H('Заполняемость и вакантность'),
      R('Заполняемость по помещениям: ' + pct(agg.uLeased.c, workPool), 'Помещений в аренде / введённые непроданные (без помещений без РНВ) × 100%'),
      R('Заполняемость по площади: ' + pct(agg.uLeased.a, workArea), 'Площадь в аренде / площадь введённых непроданных × 100%'),
      R('Доля площади продано: ' + pct(agg.sold.a, agg.total.a), 'Проданная площадь / вся коммерческая площадь × 100%'),
      R('Доля площади в простое: ' + pct(agg.uIdle.a + agg.uIdleT.a, workArea), 'Площадь в простое / площадь введённых непроданных × 100%'),
      R('Доля площади без РНВ: ' + pct(agg.buildLoss.a, allArea), 'Не введено в эксплуатацию / вся непроданная площадь × 100%'),
      H('Финансовая эффективность (01.01–31.08.2026)'),
      R('Начислено аренды: ' + (rentYtdNum ? rub(rentYtdNum) : 'нет данных'), 'Сумма начисленной аренды по всем карточкам помещений'),
      R('Начислено за управление: ' + (mgmtYtdNum ? rub(mgmtYtdNum) : 'нет данных'), 'Сумма платы за управление по карточкам'),
      R('Средняя фактическая ставка: ' + vals.rentLeasedAvg, 'Начисления по помещениям в аренде / их площадь / 8 мес'),
      R('Медианная рыночная ставка: ' + (String(this.marketRentStr() || '').split(':').pop().trim() || '—'), 'Медиана действующих ставок по реестру аренды'),
      R('Средняя цена продажи: ' + vals.soldAvgSqm, 'Сумма продаж с агентскими / их площадь'),
      H('Потери'),
      R('Потери по стройготовности: ' + vals.buildLossSum, 'Площадь без РНВ × медианная ставка × 8 мес'),
      R('Потери от простоя 6+ мес: ' + vals.stuck6Loss, 'Площадь × медианная ставка × срок простоя'),
      H('Правовая эффективность'),
      R('Полученные пени, штрафы и неустойки: — (нет данных)', 'Сумма взысканных пеней, штрафов и неустоек с начала года'),
      H('Прочие маркеры'),
      R('Экономическая заполняемость (economic occupancy): ' + (() => { const mmx = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/); const m2 = mmx ? (parseFloat(mmx[1].replace(/[\s ]/g, '')) || 0) : 0; const pot = workArea * m2 * 8; return (pot && rentYtdNum) ? pct(rentYtdNum, pot) : 'нет данных'; })(), 'Начисленная аренда / потенциальная при 100% занятости введённых помещений × 100%'),
      R('Чистый операционный доход (NOI / NOI margin): — (нет данных по расходам)', 'Доход от эксплуатации минус операционные расходы'),
      R('Доля операционных расходов (operating expense ratio): — (нет данных по расходам)', 'Операционные расходы / валовой доход × 100%'),
      R('Фактическая ставка vs рыночная: ' + (() => { const mmx = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/); const m2 = mmx ? (parseFloat(mmx[1].replace(/[\s ]/g, '')) || 0) : 0; const f = parseFloat(String(vals.rentLeasedAvg).replace(/[^\d]/g, '')) || 0; return (f && m2) ? ((f - m2 >= 0 ? '+' : '−') + Math.abs(f - m2).toLocaleString('ru-RU') + ' ₽/м² (' + Math.round((f / m2 - 1) * 100) + '%)') : '—'; })(), 'Средняя фактическая ставка минус медианная рыночная'),
      R('Срок сдачи вакансии (days to lease): — (нет истории вакансий)', 'Среднее число дней простоя до нового договора'),
      R('Удержание/текучесть арендаторов (retention / turnover): — (нет истории аренды)', 'Продлившие договор / арендаторы с истёкшим сроком × 100%'),
      R('Доля продлений договоров (lease renewal rate): — (нет данных)', 'Продлённые договоры / договоры с истёкшим сроком × 100%'),
      R('Индексации по договорам: — (нет данных о %)', 'Средний % плановой индексации ставки по договорам'),
      R('Скидки и арендные каникулы: — (нет данных о %)', 'Средний % скидки от базовой ставки'),
      R('Комиссии за поиск арендаторов: — (нет данных)', 'Сумма комиссий за поиск и заключение договоров'),
      R('Доля затрат на ремонт (capex/repairs ratio): — (нет данных)', 'Затраты на ремонт / балансовая стоимость × 100%'),
      R('Собираемость платежей (collection rate): — (нет данных об оплатах)', 'Собранная арендная плата / начисленная × 100%'),
      R('CAPEX и OPEX: — (нет данных о затратах)', 'Затраты на содержание и ремонт по помещениям'),
    ];

    // ликвидность внутри статусов
    const liq = (match) => {
      const g = {};
      for (const key in SU) for (const u of SU[key]) {
        if (!match(u, key)) continue;
        const l = u.liq || 'Без оценки';
        if (!g[l]) g[l] = { c: 0, a: 0 };
        g[l].c++; g[l].a += A(u);
      }
      const order = ['Ликвидное', 'Неликвидное', 'Без оценки'];
      const keys = Object.keys(g).sort((a, b) => order.indexOf(a) - order.indexOf(b));
      return keys.length ? keys.map((l) => l + ': ' + g[l].c + ' (' + fA(g[l].a) + ')') : ['нет помещений'];
    };
    vals.liqNotDvk = liq(preds.notdvk);
    vals.liqDvkIdle = liq(preds.uIdle);

    // владельцы и арендаторы по категориям
    const cats = {};
    for (const key in SU) for (const u of SU[key]) {
      if (!u.company || sold(u)) continue;
      const c = fund(u) ? 'Личные фонды, ПИФ, физлица' : (/^ИП /.test(u.company) ? 'ИП' : 'Компании');
      if (!cats[c]) cats[c] = { n: 0, a: 0 };
      cats[c].n++; cats[c].a += A(u);
    }
    const catLines = [];
    const acts = {};
    for (const t of reg) {
      const a = t.activity || 'Прочее';
      if (!acts[a]) acts[a] = { n: 0, a: 0 };
      acts[a].n++; acts[a].a += NUM(t.area);
    }
    for (const a of Object.keys(acts).sort((x, y) => acts[y].a - acts[x].a)) catLines.push(a + ': ' + acts[a].n + ' (' + fA(acts[a].a) + ')');
    vals.tenantCategories = catLines.length ? catLines : ['нет данных об арендаторах'];
    vals.rentNote = reg.length ? 'справочно: ' + reg.length + ' договоров в реестре аренды' : 'нет начислений в выгрузке КП';

    // клики по карточкам
    vals.openTotal = () => this.openSummaryFilter('total', 'Все коммерческие помещения');
    vals.openSold = () => this.openSummaryFilter('sold', 'Проданные помещения');
    vals.openDvk = () => this.openSummaryFilter('dvk', 'В простое у ДВК');
    vals.openNotDvk = () => this.openSummaryFilter('notdvk', 'Не передано в ДВК');
    // потери по стройготовности — недополученная аренда за 8 мес 2026 г. по помещениям без РНВ
    vals.openBuildLoss = () => this.openSummaryFilter('buildLoss', 'Потери по стройготовности (без РНВ)');
    vals.openLeased = () => this.openSummaryFilter('leased', 'В аренде (факт)');
    vals.openULeased = () => this.openSummaryFilter('uLeased', 'В аренде');
    vals.openUIdleT = () => this.openSummaryFilter('uIdleT', 'В простое с арендатором');
    vals.openUIdle = () => this.openSummaryFilter('uIdle', 'В простое');
    vals.openUNvT = () => this.openSummaryFilter('uNvT', 'Не введено в эксплуатацию, с арендатором');
    vals.openUNv = () => this.openSummaryFilter('uNv', 'Не введено в эксплуатацию');
    vals.openVacant = () => this.openSummaryFilter('vacant', 'Без действующей аренды (вне фондов)');
    vals.openOther = () => this.openSummaryFilter('other', 'Не продаётся / проверка (портфель ГК)');
    vals.openStuck6 = () => this.openSummaryFilter('stuck6', 'Без арендатора 6+ мес с РНВ');
    vals.problemsVisible = this.state.problemsVisible || false;
    vals.toggleProblems = () => this.setState((s) => ({ problemsVisible: !s.problemsVisible }));
    vals.efficiencyVisible = this.state.efficiencyVisible || false;
    vals.toggleEfficiency = () => this.setState((s) => ({ efficiencyVisible: !s.efficiencyVisible }));
    vals.closeSummaryFilter = () => this.setState({ summaryFilter: null, summaryPinned: true });

    if (this.state.summaryFilter) {
      const fk = this.state.summaryFilter.key;
      const stuckSet = {};
      for (const s of stuck) stuckSet[s.location + '|' + s.number] = true;
      const pred = preds[fk] || ((u, key) => !!stuckSet[(this.names[key] || key) + '|' + u.number]);
      const list = [];
      let maxFlowSum = 0, factFlowSum = 0;
      const mrM2 = String(this.marketRentStr() || '').match(/:\s*([\d\s\u00a0]+)\s*₽/);
      const mrRate2 = mrM2 ? (parseFloat(mrM2[1].replace(/[\s\u00a0]/g, '')) || 0) : 0;
      for (const key in SU) for (const u of SU[key]) {
        if (!pred(u, key)) continue;
        {
          {
          const rr0 = (this.tenantsReg[key] || []).find(t0 => t0.unit && String(u.number).split(',')[0].trim() === t0.unit) || null;
          const pr0 = rr0 ? this.ratePick(rr0) : null;
          const mm0 = String((pr0 && pr0.rate) || '').match(/·\s*([\d\s\u00a0]+)\s*₽\/мес/);
          if (mm0) { const v0 = parseFloat(mm0[1].replace(/[\s\u00a0]/g, '')); if (isFinite(v0)) factFlowSum += v0 * 12; }
        }
        }
        const leasedNow = /в аренде/i.test(this.unitStatus(key, u));
        const rr = (this.tenantsReg[key] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
        const nowRate = (rr ? (this.ratePick(rr).rate || '') : '') || '';
        list.push({ ...u, company: sold(u) ? '' : u.company,
          price: sold(u) ? ((this.saleOf(key, u) || {}).fact || u.price) : ((leasedNow && nowRate) ? nowRate : ''),
          priceLabel: sold(u) ? 'Факт. цена продажи' : u.priceLabel,
          priceRowLabel: sold(u) ? 'Факт. цена продажи' : ((leasedNow && nowRate) ? 'Ставка аренды' : ''),
          location: this.names[key] || key, status: this.unitStatus(key, u),
          liqColor: this.liqColors[u.liq] || 'transparent',
          strike: sold(u) ? 'line-through' : 'none',
          notSold: !sold(u),
          idleInfo: /в простое/i.test(this.unitStatus(key, u)) ? this.idleInfo(key, u) : null,
          role: fund(u) ? 'Владелец' : (leasedS(u) ? 'Арендатор' : 'Правообладатель') });
      }
      list.forEach((x, i) => { x._i = i; });
      list.sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
      {
        // первая проданная карточка начинает новую строку сетки
        const fs = list.findIndex((x) => x.sold);
        list.forEach((x, i) => { x.colStart = (fs >= 0 && i === fs) ? '1' : 'auto'; });
      }
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list,
        showFlow: /аренд/i.test(this.state.summaryFilter.label || '') && (maxFlowSum = Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0)) * mrRate2 * 12) > 0,
        maxFlow: Math.round(maxFlowSum).toLocaleString('ru-RU') + ' ₽/год',
        maxFlowNote: 'площадь без проданных × рыночная ставка ' + Math.round(mrRate2).toLocaleString('ru-RU') + ' ₽/м² × 12 мес',
        econEff: (factFlowSum / maxFlowSum * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%',
        econEffColor: (factFlowSum / maxFlowSum) >= 0.9 ? '#3a6b3f' : ((factFlowSum / maxFlowSum) >= 0.7 ? '#9a6b1a' : '#a3312b'),
        econEffNote: 'факт по действующим ставкам ' + Math.round(factFlowSum).toLocaleString('ru-RU') + ' ₽/год из максимума' };
    } else {
      vals.summaryFilterInfo = null;
    }
  }
  };
};
