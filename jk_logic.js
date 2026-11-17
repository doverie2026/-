// Логика очередей для матрицы ЖК — СГЕНЕРИРОВАНО из «Генплан Самолет N интерактивный.dc.html».
// Требует genplan_core.js. После правки генпланов пересобрать.
window.OMJKLogic = {};

window.OMJKLogic[1] = function (DCLogic) {
  return class JK extends window.GenplanCore(DCLogic) {
  state = { hovered: null, selected: null, summaryHovered: false, summaryPinned: false, summaryFilter: null, planZoom: false, hoveredUnitIdx: null, zoomHoverIdx: null };

  componentDidMount() {
    const apply = () => {
      const d = window.__SM_DATA_1;
      if (!d || !window.OMPriceNet) return false;
      this.units = d.units;
      // рыночная цена помещений — цена нетто из реестра рекомендуемых цен (август 2026)
      if (window.OMPriceNet) window.OMPriceNet.apply(1, this.units);
      this.rnv = d.rnv;
      if (window.OMSales && window.OMSales[1]) this.sales = window.OMSales[1];
      if (d.tenantsReg) this.tenantsReg = d.tenantsReg;
      this.forceUpdate();
      return true;
    };
    if (!apply()) {
      const t = setInterval(() => { if (apply()) clearInterval(t); }, 60);
      setTimeout(() => clearInterval(t), 20000);
    }
  }

  // контуры зданий, обведённые по пикселям генплана (% от изображения)
  polys = {"8_1":[[50.92,15.22],[58.06,9.55],[60.32,14.14],[53.18,19.81]],"8_2":[[58.06,9.55],[64.92,4.0],[67.17,8.59],[60.32,14.14]],"7_1":[[66.78,16.61],[74.34,10.77],[76.55,14.96],[68.99,20.8]],"6_1":[[51.07,29.52],[58.56,23.5],[60.86,27.69],[53.37,33.71]],"6_2":[[58.56,23.5],[65.3,18.12],[67.6,22.31],[60.86,27.69]],"5_2":[[67.28,32.99],[74.62,27.14],[76.94,31.67],[69.6,37.53]],"5_1":[[74.62,27.14],[81.32,21.79],[83.64,26.32],[76.94,31.67]],"4_1":[[58.87,40.0],[65.71,34.5],[68.01,38.89],[61.17,44.39]],"4_2":[[51.36,45.93],[58.87,40.0],[61.17,44.39],[53.66,50.32]],"3_1":[[71.94,42.43],[79.43,36.57],[81.79,41.27],[74.3,47.14]],"3_2":[[79.43,36.57],[86.35,31.15],[88.51,35.45],[81.59,40.87]],"2_1":[[56.66,55.66],[63.79,50.08],[66.07,54.22],[58.74,59.78]],"2_2":[[63.79,50.08],[70.47,44.5],[72.95,48.67],[66.07,54.22]],"1_1":[[84.58,50.03],[91.28,44.53],[93.44,48.64],[86.74,54.14]],"1_2":[[77.15,56.13],[84.58,50.03],[86.74,54.14],[79.31,60.24]],"2a":[[51.15,51.95],[52.35,51.95],[55.1,57.08],[57.35,57.01],[58.74,59.78],[57.35,60.6],[51.3,60.6]],"1a":[[88.7,55.6],[91.9,53],[92.8,53.2],[92.8,60.5],[84.1,60.5],[84.4,59],[85.9,57.8],[87.7,57.6]],"1b":[[74.98,59.72],[77.83,57.42],[79.07,59.78],[78.77,60.39],[75.3,60.5]],"1v":[[91.82,45.55],[92.89,47.59],[92.64,44.88]],"3a":[[86.9,32.27],[88.06,31.36],[88.6,32.42],[88.02,32.87],[88.55,33.93],[89.13,33.48],[89.67,34.54],[88.51,35.45]],"5a":[[81.7,22.7],[83.03,21.65],[84.47,24.77],[83.14,25.82]],"6a":[[51.2,31.0],[51.53,30.36],[53.26,33.5],[51.4,35.5]],"7a":[[74.34,10.77],[75.98,9.42],[78.19,13.61],[76.55,14.96]],"8a":[[50.84,17.1],[51.46,16.31],[53.18,19.81],[50.97,21.58]],"8b":[[66.16,6.53],[68.4,6.06],[68.9,7.3],[67.17,8.59]],"tc":[[57.05,65.6],[68.6,65.6],[68.6,78.0],[61.6,78.0],[61.55,75.4],[61.0,74.2],[60.1,73.0],[59.0,72.4],[58.2,72.5],[57.05,72.6]],"stop1":[[62.55,61.4],[64.05,61.4],[64.05,62.5],[62.55,62.5]],"wash":[[91.2,6.4],[92.5,6.5],[92.3,12.6],[91.0,12.5]]};

  names = {
    '1_1': 'Литер 1 · Подъезд 1', '1_2': 'Литер 1 · Подъезд 2',
    '2_1': 'Литер 2 · Подъезд 1', '2_2': 'Литер 2 · Подъезд 2',
    '3_1': 'Литер 3 · Подъезд 1', '3_2': 'Литер 3 · Подъезд 2',
    '4_1': 'Литер 4 · Подъезд 1', '4_2': 'Литер 4 · Подъезд 2',
    '5_1': 'Литер 5 · Подъезд 1', '5_2': 'Литер 5 · Подъезд 2',
    '6_1': 'Литер 6 · Подъезд 1', '6_2': 'Литер 6 · Подъезд 2',
    '7_1': 'Литер 7 · Подъезд 1', '8_1': 'Литер 8 · Подъезд 1', '8_2': 'Литер 8 · Подъезд 2',
    '1a': 'Литер 1А', '1b': 'Литер 1Б', '1v': 'Литер 1В', '2a': 'Литер 2А', '3a': 'Литер 3А',
    '5a': 'Литер 5А', '6a': 'Литер 6А', '7a': 'Литер 7А', '8a': 'Литер 8А', '8b': 'Литер 8Б', 'tc': 'ТЦ Самолет', 'stop1': 'Остановка №1', 'wash': 'Автомойка',
  };

  utilJk = 's1';

  regRow(id, u) {
    const r = ((this.tenantsReg || {})[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
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
      regTill: this.regTillOf(r),
      regContract: (r && r.contract && r.contract !== '—') ? r.contract : (r ? 'не активен' : 'не указана'),
      mgmtActive: (u.mgmtActive && u.mgmtCo !== 'без управления') ? u.mgmtActive : u.mgmtCo === 'без управления' ? '—' : ((r && r.contract && r.contract !== '—' && r.contract !== 'не активен') ? ('активен с ' + r.contract) : 'не активен'),
      regHoliday: (r && r.contract && r.contract !== '—' && r.contract !== 'не активен') ? (r.holiday || 'нет данных') : '—' };
  }

  residentsCapacity = 7980; // проектная численность жильцов ЖК

  statusLabel(u) { return (this.isFundU(u) && ['В аренде', 'Свободно', 'Доступно для аренды'].includes(u.status)) ? 'Простаивает (в ДВК)' : u.status; }

  select(id) { this.setState({ selected: id, planFloor: 0, planZoom: false, hoveredUnitIdx: null, zoomHoverIdx: null }); }

  closePanel() { this.setState({ selected: null }); }

  unitFields(key) {
    const list = this.units[key] || [];
    if (!list.length) return { noCommercial: true, commercial: null, unitsLabel: '', units: '', statuses: [] };
    const area = list.reduce((s, u) => s + parseFloat(u.area.replace(',', '.')), 0);
    const soldN = list.filter(u => u.status === 'Продано').length;
    const rentN = list.filter(u => u.status === 'В аренде' && !this.isFundU(u)).length;
    const dvkN = list.filter(u => u.status === 'В аренде' && this.isFundU(u)).length;
    const statuses = [];
    if (soldN) statuses.push(`Продано: ${soldN}`);
    if (rentN) statuses.push(`В аренде: ${rentN}`);
    if (dvkN) statuses.push(`Простаивает (в ДВК): ${dvkN}`);
    return { noCommercial: false, commercial: list.length, unitsLabel: 'Площадь коммерческих помещений', units: this.fmtArea(area), statuses };
  }

  renderVals() {
    if (window.OMKpAddr) window.OMKpAddr.apply(this, 's1');
    if (window.OMVolumes) this._volInfo = window.OMVolumes.fill(this);
    const vals = {};
    const fmtArea = (n) => this.fmtArea(n);

    const accent = this.props.accentColor || '#2b2a27';
    const hoverStyle = this.props.hoverStyle || 'outline';
    const theme = this.props.theme || 'light';
    const themes = {
      light: { pageBg: '#f4f2ee', cardBg: '#fffdf9', border: '#ddd8cd', text: '#2b2a27', muted: '#6b6a64', imgCardBg: '#fff', statusNeutralBg: '#f7f5f0', statusGreenBg: '#eef6ee', statusOrangeBg: '#fbf3e6' },
      dark: { pageBg: '#1c1b18', cardBg: '#28261f', border: '#463f31', text: '#f0ece2', muted: '#a89f8f', imgCardBg: '#211f1a', statusNeutralBg: '#332f26', statusGreenBg: '#1f3324', statusOrangeBg: '#3a2c17' },
    };
    const th = themes[theme] || themes.light;
    vals.pageBg = th.pageBg;
    vals.cardBg = th.cardBg;
    vals.borderColor = th.border;
    vals.textColor = th.text;
    vals.mutedColor = th.muted;
    vals.imgCardBg = th.imgCardBg;
    vals.statusNeutralBg = th.statusNeutralBg;
    vals.statusGreenBg = th.statusGreenBg;
    vals.statusOrangeBg = th.statusOrangeBg;
    vals.statusRedBg = theme === 'dark' ? '#3a2420' : '#faf0ee';
    vals.statusNeutralBorder = '#c3bdb0';
    vals.accent = accent;

    const sizes = { '7_1': { w: 10.4, h: 6.2 }, '5_1': { w: 9.4, h: 6.2 }, '3_2': { w: 9.4, h: 6.2 }, '1_1': { w: 9.4, h: 6.2 }, '1_2': { w: 9.4, h: 6.2 }, '8_1': { w: 9.4, h: 6.2 }, '8_2': { w: 9.4, h: 6.2 }, '6_1': { w: 9.4, h: 6.2 } };
    const ids = Object.keys(this.data);
    vals.buildings = ids.map((id) => {
      const isHovered = this.state.hovered === id || this.state.selected === id;
      const s = sizes[id] || { w: 10.2, h: 6.4 };
      const d = this.data[id];
      const hv = this.hoverVisual(isHovered, accent, hoverStyle);
      return { id, left: d.left, top: d.top, w: s.w + '%', h: s.h + '%', rot: d.rot, border: hv.border, background: hv.background, boxShadow: hv.boxShadow, onEnter: () => this.enter(id), onClick: () => this.select(id) };
    });
    vals.plainBuildings = Object.keys(this.plainData).map((id) => {
      const isHovered = this.state.hovered === 'plain_' + id || this.state.selected === id;
      const d = this.plainData[id];
      const isSplit = id.endsWith('_1') || id.endsWith('_2');
      const wideRight = { '4_2': 2.7, '4_1': 1.9, '5_2': 3.3, '5_1': 3.0, '2_1': 2.7, '2_2': 1.9, '3_2': 2.6, '3_1': 3.5 };
      const wideLeft = { '4_1': 1.0, '5_2': -0.5, '5_1': -0.1, '2_2': 1.0, '3_2': -0.1, '3_1': -0.5 };
      const w = isSplit ? (6 + (wideRight[id] || 0) + (wideLeft[id] || 0)) : 9;
      const leftAdj = ((wideRight[id] || 0) - (wideLeft[id] || 0)) / 2;
      const hMod = { '4_1': 1.5, '4_2': 1.5, '5_2': 1.2, '5_1': 1.2, '2_1': 1.5, '2_2': 1.5, '3_2': 1.2, '3_1': 1.2 };
      const hModTop = { '5_2': 0.3, '5_1': 0.3, '3_2': 0.3, '3_1': 0.3 };
      const h = isSplit ? (3.6 + (hMod[id] || 0) + (hModTop[id] || 0)) : 10;
      const hv = this.hoverVisual(isHovered, accent, hoverStyle);
      return { id, left: `calc(${d.left} + ${leftAdj}%)`, top: `calc(${d.top} + ${((hMod[id]||0) - (hModTop[id]||0))/2}%)`, w: w + '%', h: h + '%', rot: d.rot, border: hv.border, background: hv.background, boxShadow: hv.boxShadow, onEnter: () => this.enter('plain_' + id) };
    });
    vals.leave = () => this.leaveAll();
    vals.buildingPolys = Object.keys(this.polys).map((k) => {
      const hid = this.data[k] ? k : 'rect_' + k;
      const hov = this.state.hovered === hid || this.state.selected === k;
      return { id: k, points: this.polys[k].map(p => p.join(',')).join(' '),
        fill: k === 'wash' ? 'rgba(148,147,153,0.92)' : 'transparent',
        stroke: hov ? '#a3312b' : 'transparent',
        onEnter: () => this.enter(hid), onClick: () => this.select(k) };
    });

    vals.triangleBuildings = Object.keys(this.triData).map((id) => {
      const isHovered = this.state.hovered === 'tri_' + id || this.state.selected === id;
      const d = this.triData[id];
      const glow = hoverStyle === 'glow';
      const fill = (id === '1v' || id === '6v' || id === '8v' || id === '1b' || id === '8b') ? (isHovered ? 'rgba(163,49,43,0.15)' : 'transparent') : (isHovered && glow ? this.hexToRgba('#a3312b', 0.25) : 'transparent');
      const stroke = isHovered ? '#a3312b' : 'transparent';
      const strokeWidth = isHovered && glow ? 1 : 0.8;
      const filter = isHovered && glow ? `drop-shadow(0 0 10px ${this.hexToRgba(accent, 0.6)})` : 'none';
      const sz = this.triSizes[id] || { w: 8, h: 8 };
      const points = this.triPoints[id] || '50,50 2,98 50,98';
      const unitsKey = this.triUnitsKey[id] || id;
      return { id, left: d.left, top: d.top, w: sz.w + '%', h: sz.h + '%', rot: d.rot, fill, stroke, strokeWidth, filter, points, onEnter: () => this.enter('tri_' + id), onClick: () => this.select(unitsKey) };
    });

    vals.rectBuildings = Object.keys(this.rectData).map((id) => {
      const isHovered = this.state.hovered === 'rect_' + id || this.state.selected === id;
      const d = this.rectData[id];
      const border = isHovered ? '2px solid #a3312b' : '2px solid transparent';
      const background = 'transparent';
      return { id, left: d.left, top: d.top, w: d.w + '%', h: d.h + '%', rot: d.rot, border, background, onEnter: () => this.enter('rect_' + id), onClick: () => this.select(id) };
    });

    if (this.state.hovered) {
      const hid = this.state.hovered;
      const key = hid.startsWith('rect_') ? hid.replace('rect_', '') : hid;
      const poly = this.polys[key];
      if (poly) {
        // позиция от рамки здания: справа, при нехватке места — слева; не накрывает контур
        const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
        const bx0 = Math.min(...xs), bx1 = Math.max(...xs);
        const by0 = Math.min(...ys), by1 = Math.max(...ys);
        const TIP_W = 17, TIP_H = 22; // примерные габариты подсказки в % карты
        let left, transform;
        if (bx1 + 1.5 + TIP_W <= 99) { left = (bx1 + 1.5) + '%'; transform = 'none'; }
        else { left = (bx0 - 1.5) + '%'; transform = 'translateX(-100%)'; }
        const top = Math.max(1, Math.min(by0, 99 - TIP_H)) + '%';
        const fields = this.unitFields(key);
        vals.activeInfo = { name: this.names[key], left, top, transform, rnv: this.rnv[key], ...fields };
      } else {
        vals.activeInfo = null;
      }
    } else {
      vals.activeInfo = null;
    }

    vals.closePanel = () => this.closePanel();
    if (this.state.selected) {
      const id = this.state.selected;
      const boxes = this.planHighlightBoxes[id] || [];
      const bti = this.btiNumbers[id] || [];
      const hoveredIdx = this.state.hoveredUnitIdx;
      const list = (this.units[id] || []).map((u, idx) => ({ ...u, status: this.unitStatus(id, u), liqColor: this.liqColors[u.liq] || 'transparent', strike: u.status === 'Продано' ? 'line-through' : 'none', notSold: u.status !== 'Продано', role: u.role || 'Владелец', companyOrDash: u.company || 'не указано', insurance: u.insurance || 'нет', cxUtil: this.cxUtilOf(id, u) || '—', cxUtilC: this.cxColor(this.cxUtilOf(id, u)), utilOpen: !!(this.state.utilOpen || {})[id + '|' + idx], utilChevron: (this.state.utilOpen || {})[id + '|' + idx] ? 'rotate(180deg)' : 'rotate(0deg)', toggleUtil: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = id + '|' + idx; this.setState(s => ({ utilOpen: { ...(s.utilOpen || {}), [k]: !(s.utilOpen || {})[k] } })); }, ukLabel: (this.literUk && this.literUk[String(id).split('_')[0]]) || 'УК МКД', ...this.secVals(id, idx), cxUtilMkd: u.cxUtilMkd || this.costStr('uk', id, u), cxUtilElec: this.utilStr('e', id, u), cxUtilWater: this.utilStr('w', id, u), cxUtilHeat: this.utilStr('h', id, u), cxSecurity: u.cxSecurity || '—', cxSecurityC: this.cxColor(u.cxSecurity), cxCleaning: u.cxCleaning || '—', cxCleaningC: this.cxColor(u.cxCleaning), cxTO: u.cxTO || '—', cxTOC: this.cxColor(u.cxTO), cxAdmin: this.cxAdminOf(id, u), cxAdminC: this.cxColor(this.cxAdminOf(id, u)), cxTaxes: this.cxTaxesOf(id, u), cxTaxesC: this.cxColor(this.cxTaxesOf(id, u)), cxInsurance: u.cxInsurance || '—', cxInsuranceC: this.cxColor(u.cxInsurance), cxTotal: this.cxTotalOf(id, u), opStart: this.startInvest(u), opRepair: this.opRepairOf(u, id), opAnchor: u.opAnchor || '—', opLoss: u.opLoss || '—', opTotal: this.sumRub(this.opUnit(u, id), ['opStart', 'opRepair', 'opAnchor', 'opLoss']), effNoi: u.effNoi || this.noiOf(id, u, this.cxTotalOf(id, u)), effPayback: u.effPayback || this.paybackOf(id, u), effRoi: u.effRoi || this.roiOf(id, u), effCapRate: u.effCapRate || this.capRateOf(id, u), effPriceDyn: u.effPriceDyn || '—', effPriceDynC: this.growthColor(u.effPriceDyn), effFull: this.fullYieldOf(id, u), effFullC: this.growthColor(this.fullYieldOf(id, u)), effFullTitle: this.fullYieldTitle(id, u),
        effFair: this.fairValueOf(id, u), effFairTitle: this.fairValueTitle(id, u),
        fairColor: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        fairBorder: /Продано/i.test(u.status || '') ? 'rgba(224,147,141,0.35)' : 'rgba(163,49,43,0.22)', effCap: u.effCap || '14%', effSpread: u.effSpread || this.spreadOf(id, u), effSpreadC: this.growthColor(u.effSpread || this.spreadOf(id, u)), effOpexBack: u.effOpexBack || this.opexBackOf(id, u), effGrowth: u.effGrowth || this.assetGrowth(id, u), effGrowthYear: this.assetGrowthYear(id, u), effGrowthC: this.growthColor(this.assetGrowth(id, u)), ...this.chip(this.unitStatus(id, u)), ...this.donutsOf(id, u), ...this.regRow(id, u), fias: this.fiasOf(id, u), cadastre: this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных', fias: this.fiasOf(id, u),
        cardBg: /Продано/i.test(u.status || '') ? '#1b1916' : (this.liqColors[u.liq] || 'transparent'),
        fg: /Продано/i.test(u.status || '') ? '#f2ede4' : vals.textColor,
        fgMuted: /Продано/i.test(u.status || '') ? '#a9a196' : vals.mutedColor,
        cornerFg: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        cardPad: /Продано/i.test(u.status || '') ? '7px 10px' : '10px 12px',
        cardAlign: /Продано/i.test(u.status || '') ? 'start' : 'stretch',
        chipMargin: /Продано/i.test(u.status || '') ? '4px 0 5px' : '6px 0 8px',
        rowGap: /Продано/i.test(u.status || '') ? '1px' : '3px',
        rowFont: /Продано/i.test(u.status || '') ? '11px' : '11.5px',
        rowLine: /Продано/i.test(u.status || '') ? '14px' : '16px',
        sale: this.saleOf(id, u),
        // категория торговой точки арендатора — кружок в углу карточки (traffic.js)
        ttChipCat: (() => {
          if (/Продано/i.test(u.status || '')) return null;
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          if (!r) return null;
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.name) || 'Прочее';
        })(),
        ttChipBg: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '1f';
        })(),
        ttChipBd: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '59';
        })(),
        ttChipColor: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.c) || '#4b2e83';
        })(),
        // данные сделки показываем в каждой проданной карточке: нет записи — «нет данных»
        saleDate: (this.saleOf(id, u) || {}).date || 'нет данных',
        saleFact: (this.saleOf(id, u) || {}).fact || 'нет данных',
        saleAgent: (this.saleOf(id, u) || {}).agent || 'нет данных',
        saleBuyer: (this.saleOf(id, u) || {}).buyer || 'нет данных',
        corner: (this.actualPrice(id, u) || {}).value || (/Продано/i.test(u.status || '') ? 'нет данных' : ''),
        rentMarket: (this.actualPrice(id, u) || /Продано/i.test(u.status || '') || /^(nto|zu|stop)/.test(String(id))) ? '' : String(this.marketRentStr() || '').split(':').pop().trim(),
        cornerTitle: this.actualPrice(id, u) ? 'Актуальная цена помещения' : 'Актуальная на текущий год рыночная ставка аренды',
        cornerCaption: /Продано/i.test(u.status || '') ? 'Актуальная цена' : '',
        marketPrice: (this.actualPrice(id, u) || {}).value || u.marketPrice || u.price || 'не указана',
        marketLabel: this.actualPrice(id, u) ? 'Актуальная цена' : 'Рыночная цена',
        marketTitle: (this.actualPrice(id, u) || {}).basis || u.marketPrice || u.price || '',
        idleOnChange: this.idleOnChange(id, u),
        pastRows: this.pastTenants[id + '|' + String(u.number).split(',')[0].trim()] || [{ tenant: '—', rate: '—', period: '—' }],
        saleGrowth: this.saleGrowth(id, u),
        cadLabel: u.status === 'Продано' ? 'Наименование актуальной т.т.' : 'Кадастровый №',
        cadValue: u.status === 'Продано'
          ? (this.soldTt[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных')
          : (this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных'),
        sold: u.status === 'Продано',
        // категорию проданной точки берём из её названия единой функцией traffic.js
        ttCat: (() => {
          if (u.status !== 'Продано') return '—';
          const nm = this.soldTt[id + '|' + String(u.number).split(',')[0].trim()];
          if (!nm) return 'нет данных';
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf({ brand: nm }) : null;
          return (c && c.name) || 'нет данных';
        })(), marketPrice: u.marketPrice || u.price || 'не указана', price: u.priceLabel ? u.price : '', priceLabel: u.priceLabel || 'Цена по прайсу', mgmtCo: u.mgmtCo || 'нет данных', mgmtRate: u.mgmtCo === 'без управления' ? '—' : (u.mgmtRate || '—'), mgmtActive: u.mgmtActive || (u.mgmtCo ? 'активен' : 'не активен'), mgmtPaid: u.mgmtPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.mgmtAccrued(id, u)), mgmtDiscount: u.mgmtDiscount || '—', rentPaid: u.rentPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.rentAccrued(id, u)), rentDiscount: u.rentDiscount || '—', rentDebt: u.rentDebt || '—', mgmtDebt: u.mgmtDebt || '—', mgmtNote: u.mgmtNote === undefined ? 'в выгрузке КП нет данных об управлении и долгах' : u.mgmtNote, penalties: u.penalties || '—', turnoverMonths: Array.from({ length: 12 }, (_, i2) => { const m = i2 + 1; const active = (this.state.turnoverMonth || 1) === m; return { m, onClick: () => this.setState({ turnoverMonth: m }), bg: active ? accent : 'rgba(0,0,0,0.06)', fg: active ? '#fff' : vals.textColor, fw: active ? 700 : 400 }; }), turnoverValue: (u.turnover && u.turnover[this.state.turnoverMonth || 1]) || 'нет данных', bti: bti[idx] || null, btiOrDash: bti[idx] || 'не указаны',
        onHover: () => { const st = { hoveredUnitIdx: idx };
          if (id === '1a') st.planFloor = idx <= 1 ? 0 : idx <= 4 ? 1 : 2;
          if (id === '2a') st.planFloor = idx <= 1 ? 0 : idx <= 5 ? 1 : 2;
          if (id === '3a') st.planFloor = idx === 0 ? 0 : idx <= 2 ? 1 : 2;
          if (id === '8_1' || id === '8_2') st.planFloor = 0;
          if (id === '7a' || id === '8b') st.planFloor = idx;
          this.setState(st); }, onUnhover: () => this.setState({ hoveredUnitIdx: null }) }));
      const area = list.reduce((s, u) => s + parseFloat(u.area.replace(',', '.')), 0);
      const planImgs = { '1_1': 'assets/liter1_wing_right_v4.png', '1_2': 'assets/liter1_wing_left.png' };
      const planAspects = { '1_1': '2332 / 1194', '1_2': '1274 / 717' };
      const toPoints = (b) => b.poly ? b.poly.map(p => p.join(',')).join(' ')
        : `${b.l},${b.t} ${b.l + b.w},${b.t} ${b.l + b.w},${b.t + b.h} ${b.l},${b.t + b.h}`;
      const bbox = (b) => b.poly
        ? { l: Math.min(...b.poly.map(p => p[0])), t: Math.min(...b.poly.map(p => p[1])), w: Math.max(...b.poly.map(p => p[0])) - Math.min(...b.poly.map(p => p[0])), h: Math.max(...b.poly.map(p => p[1])) - Math.min(...b.poly.map(p => p[1])) }
        : b;
      const pct = (b0) => { const b = bbox(b0); return { left: b.l + '%', top: b.t + '%', w: b.w + '%', h: b.h + '%' }; };
      // этажи: у Литера 1А их три, у подъездов Литера 1 — один
      const floorsCfg = id === '1a' ? this.liter1aFloors
        : id === '2a' ? this.liter2aFloors
        : id === '3a' ? this.liter3aFloors
        : id === '6_1' ? this.liter6_1Floors
        : id === '6_2' ? this.liter6_2Floors
        : id === '7_1' ? this.liter7Floors
        : id === '8_1' ? this.liter8_2Floors
        : id === '8_2' ? this.liter8_1Floors
        : id === '6a' ? this.liter6aFloors
        : id === '7a' ? this.liter7aFloors
        : id === '8a' ? this.liter8aFloors
        : id === '8b' ? this.liter8bFloors
        : id === 'tc' ? this.tcFloors
        : (id === '1_1' || id === '1_2') ? [{ label: '1 этаж', img: planImgs[id], ratio: id === '1_1' ? 1274 / 625 : 1274 / 716, boxes: this.planHighlightBoxes[id] || [], mop: this.mopAreas[id] || [] }]
        : null;
      const fi = floorsCfg ? Math.min(this.state.planFloor || 0, floorsCfg.length - 1) : 0;
      const fl = floorsCfg ? floorsCfg[fi] : null;
      const flBoxes = fl ? fl.boxes : [];
      vals.planFloorTabs = (floorsCfg && floorsCfg.length > 1) ? floorsCfg.map((f, i) => ({
        label: f.label, active: i === fi,
        bg: i === fi ? '#2b2a27' : 'transparent', color: i === fi ? '#fffdf9' : '#6b6a64',
        onClick: () => this.setState({ planFloor: i, hoveredUnitIdx: null, zoomHoverIdx: null }) })) : null;
      const planAspect = fl ? `${Math.round(fl.ratio * 1000)} / 1000` : null;
      {
        // порядок карточек зафиксирован: в аренде → в простое → не введено → продано
        list.forEach((x, i) => { if (x._i === undefined) x._i = i; });
        list.sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
        const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
        // непроданные — одной строкой, проданные — по две в ряд с новой строки
        list.forEach((x, i) => {
          const sold = /Продано/i.test(String(x.status || ''));
          x.colStart = (fs >= 0 && i === fs) ? '1' : 'auto';
          x.rowBreak = fs >= 0 && i === fs;
          x.cardFlex = '0 0 300px';
        });
      }
      vals.selectedInfo = { name: this.names[id], rnv: this.rnv[id], addr: (this.literAddr && this.literAddr[String(id).split('_')[0]]) || null, uk: (this.literUk && this.literUk[String(id).split('_')[0]]) || null, commercial: list.length, units: fmtArea(area), unitsList: (() => {
          const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
          return list.map((u, i) => ({ ...u,
            rowBreak: fs >= 0 && i === fs,
            cardFlex: '0 0 300px' }));
        })(),
        statusChips: (() => {
          const m = {};
          for (const u of (this.units[id] || [])) { const s = this.unitStatus(id, u); if (!m[s]) m[s] = { n: 0, a: 0 }; m[s].n++; const n = parseFloat(String(u.area).replace(',', '.')); if (isFinite(n)) m[s].a += n; }
          return Object.keys(m).map(s => { const c = this.chip(s); return { label: s, count: m[s].n, area: m[s].a.toFixed(1).replace('.', ',') + ' м²', bg: c.chipBg, fg: c.chipFg, bd: c.chipBd }; });
        })(), tenants: this.tenantsReg[id] || null, planImg: fl ? fl.img : null, planAspect: planAspect,
        highlightPolys: flBoxes.flatMap((rects, idx) => (rects || []).map(b => ({ points: toPoints(b), opacity: hoveredIdx === idx ? 1 : 0 }))) };
      if (vals.selectedInfo) {
        const un = (vals.selectedInfo.unitsList || []);
        vals.selectedInfo.unitsUnsold = un.filter((u) => !/Продано/i.test(String(u.status || '')));
        const so = un.filter((u) => /Продано/i.test(String(u.status || '')));
        vals.selectedInfo.unitsSold = so.length ? so : null;
      }
      vals.openPlanZoom = () => this.setState({ planZoom: true });
      this.cardsScrollVals(vals);
      vals.planZoomImg = (this.state.planZoom && fl) ? fl.img : null;
      vals.planZoomAspect = planAspect;
      vals.planZoomW = fl ? `min(92vw, calc(88vh * ${fl.ratio.toFixed(4)}))` : '92vw';
      const zi = this.state.zoomHoverIdx;
      vals.zoomHoverZones = flBoxes.flatMap((rects, idx) => (rects || []).map(b => ({ ...pct(b),
        onHover: () => this.setState({ zoomHoverIdx: idx }), onUnhover: () => this.setState({ zoomHoverIdx: null }) })));
      vals.zoomPolys = flBoxes.flatMap((rects, idx) => (rects || []).map(b => ({ points: toPoints(b), opacity: zi === idx ? 1 : 0 })));
      const mop = fl ? (fl.mop || []) : [];
      vals.mopPolys = mop.map(m => ({ points: toPoints(m) }));
      const zUnits = this.units[id] || [];
      const zb = (zi !== null && flBoxes[zi] && flBoxes[zi].length) ? bbox(flBoxes[zi][0]) : null;
      vals.zoomTooltip = (zi !== null && zUnits[zi] && zb) ? { ...zUnits[zi], status: this.statusLabel(zUnits[zi]), bti: bti[zi] || '—', left: (zb.l + zb.w / 2) + '%', top: Math.min(...flBoxes[zi].map(b => bbox(b).t)) + '%' } : null;
      vals.stopProp = (e) => e.stopPropagation();
    } else {
      vals.selectedInfo = null;
      vals.planZoomImg = null;
    }
    vals.closePlanZoom = () => this.setState({ planZoom: false });

    // карта трафика
    vals.trafficVisible = !!this.state.trafficOverlay;
    vals.trafficPanelVisible = !!this.state.trafficData;
    vals.trafficHidePanel = () => this.setState({ trafficData: false });
    vals.trafficOverlayBg = this.state.trafficOverlay ? '#a3312b' : 'transparent';
    vals.trafficOverlayFg = this.state.trafficOverlay ? '#ffffff' : '#a3312b';
    vals.trafficDataBg = this.state.trafficData ? '#a3312b' : 'transparent';
    vals.trafficDataFg = this.state.trafficData ? '#ffffff' : '#a3312b';
    vals.toggleTrafficOverlay = () => this.setState((s) => ({ trafficOverlay: !s.trafficOverlay }));
    vals.toggleTrafficData = () => this.setState((s) => ({ trafficData: !s.trafficData }));
    {
      const tr = (window.OMTraffic && (this.state.trafficOverlay || this.state.trafficData)) ? window.OMTraffic.build(this, vals) : null;
      vals.trafficMarks = tr ? tr.marks : [];
      vals.trafficLines = tr ? tr.lines : [];
      vals.trafficMagnets = tr ? tr.magnets : [];
      vals.trafficVacancies = tr ? tr.vacancies : [];
      vals.trafficStats = tr ? tr.stats : [];
      vals.trafficNote = tr ? tr.note : '';
    }

    vals.toggleSummary = () => this.toggleSummary();
    vals.enterSummary = () => this.enterSummary();
    vals.leaveSummary = () => this.leaveSummary();
    vals.summaryVisible = this.state.summaryHovered || this.state.summaryPinned;

    {
      let totalCount = 0, totalArea = 0, soldCount = 0, soldArea = 0, soldSum = 0, rentedCount = 0, rentedArea = 0, notForSaleCount = 0, notForSaleArea = 0, dvkCount = 0, dvkArea = 0;
      const isFund = (u) => !!u.company && /ЛИЧНЫЙ ФОНД|Морозова|ПРОФИТ КАПИТАЛ/.test(u.company);
      for (const key in this.units) {
        for (const u of this.units[key]) {
          const area = parseFloat(u.area.replace(',', '.'));
          const price = parseFloat(u.price.replace(/[^\d]/g, ''));
          totalCount++; totalArea += area;
          if (u.status === 'Продано') { soldCount++; soldArea += area; soldSum += price; }
          if (u.status === 'В аренде' && isFund(u)) { dvkCount++; dvkArea += area; }
          else if (u.status === 'В аренде') { rentedCount++; rentedArea += area; }
          if (u.status === 'Не продается') { notForSaleCount++; notForSaleArea += area; }
        }
      }
      vals.totalCount = totalCount; vals.totalArea = fmtArea(totalArea);
      vals.soldCount = soldCount; vals.soldArea = fmtArea(soldArea);
      vals.soldSum = Math.round(soldSum).toLocaleString('ru-RU') + ' ₽';
      vals.soldAvgSqm = soldArea ? Math.round(soldSum / soldArea).toLocaleString('ru-RU') + ' ₽/м²' : '—';
      vals.rentedCount = rentedCount; vals.rentedArea = fmtArea(rentedArea);
      vals.dvkCount = dvkCount; vals.dvkArea = fmtArea(dvkArea);
      vals.notForSaleCount = notForSaleCount; vals.notForSaleArea = fmtArea(notForSaleArea);

      const liqLines = (status, extra) => {
        const m = {};
        for (const key in this.units) for (const u of this.units[key]) {
          if (u.status !== status) continue;
          if (extra && !extra(u)) continue;
          if (!m[u.liq]) m[u.liq] = { count: 0, area: 0 };
          m[u.liq].count++; m[u.liq].area += parseFloat(u.area.replace(',', '.'));
        }
        return Object.keys(m).map(l => `${l}: ${m[l].count} (${fmtArea(m[l].area)})`);
      };
      vals.liqNotForSale = liqLines('Не продается');
      vals.liqRented = liqLines('В аренде', (u) => !isFund(u));

      let rentedSum = 0;
      for (const key in this.units) {
        for (const u of this.units[key]) {
          if (u.status === 'В аренде' && !isFund(u)) rentedSum += parseFloat(u.price.replace(/[^\d]/g, ''));
        }
      }
      vals.rentedSum = Math.round(rentedSum).toLocaleString('ru-RU') + ' ₽';
      vals.rentedAvgSqm = rentedArea ? Math.round(rentedSum / rentedArea).toLocaleString('ru-RU') + ' ₽/м²' : '—';
      vals.soldSharePct = totalArea ? Math.round((soldArea / totalArea) * 100) + '%' : '—';
      vals.rentedSharePct = totalArea ? Math.round((rentedArea / totalArea) * 100) + '%' : '—';
    }

    vals.problemsVisible = this.state.problemsVisible || false;
    vals.toggleProblems = () => this.toggleProblems();
    vals.efficiencyVisible = this.state.efficiencyVisible || false;
    vals.toggleEfficiency = () => this.toggleEfficiency();
    this.occupancyVals(vals);

    {
      const vacant = [];
      for (const key in this.units) {
        for (const u of this.units[key]) {
          if (u.status !== 'Продано' && u.status !== 'В аренде' && u.status !== 'Не продается') vacant.push(`${this.names[key]} №${u.number} (${u.area})`);
        }
      }
      vals.vacantColor = vacant.length ? '#a3312b' : '#3a7a42';
      vals.vacantText = vacant.length ? `Нарушение: ${vacant.length} пустующих помещений` : 'Нарушение отсутствует — пустующих помещений нет';
      vals.vacantList = vacant;
    }

    {
      const rentedUnits = [];
      for (const key in this.units) {
        for (const u of this.units[key]) {
          if (u.status === 'В аренде' && !(u.company && /ЛИЧНЫЙ ФОНД|Морозова|ПРОФИТ КАПИТАЛ/.test(u.company))) rentedUnits.push({ number: u.number, area: u.area, location: this.names[key], areaNum: parseFloat(u.area.replace(',', '.')) });
        }
      }
      rentedUnits.sort((a, b) => b.areaNum - a.areaNum);
      vals.topRented = rentedUnits.slice(0, 5);

      const catOf = (company) => {
        if (/ЛИЧНЫЙ ФОНД|Морозова|ПРОФИТ КАПИТАЛ/.test(company)) return 'Владельцы (фонды, ПИФ, физлица)';
        if (/^ИП /.test(company)) return 'ИП';
        return 'Управляющие компании / фонды';
      };
      const cats = {};
      for (const key in this.units) {
        for (const u of this.units[key]) {
          if (!u.company) continue;
          const cat = catOf(u.company);
          if (!cats[cat]) cats[cat] = { count: 0, area: 0 };
          cats[cat].count++;
          cats[cat].area += parseFloat(u.area.replace(',', '.'));
        }
      }
      vals.tenantCategories = Object.keys(cats).map(c => `${c}: ${cats[c].count} (${this.fmtArea(cats[c].area)})`);
    }

    vals.openTotal = () => this.openSummaryFilter('total', 'Все коммерческие помещения');
    vals.openSold = () => this.openSummaryFilter('sold', 'Проданные помещения');
    vals.openRented = () => this.openSummaryFilter('rented', 'Доступные для аренды (в простое)');
    vals.openNotForSale = () => this.openSummaryFilter('notsale', 'Не продаваемые помещения (портфель ГК)');
    vals.openDvk = () => this.openSummaryFilter('dvk', 'Передано в ДВК (личные фонды)');
    vals.closeSummaryFilter = () => this.closeSummaryFilter();
    if (this.state.summaryFilter) {
      const key = this.state.summaryFilter.key;
      const isFundU = (u) => !!u.company && /ЛИЧНЫЙ ФОНД|Морозова|ПРОФИТ КАПИТАЛ/.test(u.company);
      const pred = key === 'total' ? (() => true) : key === 'sold' ? (u => u.status === 'Продано') : key === 'notsale' ? (u => u.status === 'Не продается') : key === 'dvk' ? (u => u.status === 'В аренде' && isFundU(u)) : (u => u.status === 'В аренде' && !isFundU(u));
      const list = [];
      for (const bkey in this.units) {
        for (const u of this.units[bkey]) {
          if (pred(u)) list.push({ ...u, status: this.unitStatus(bkey, u), location: this.names[bkey], liqColor: this.liqColors[u.liq] || 'transparent', strike: u.status === 'Продано' ? 'line-through' : 'none', notSold: u.status !== 'Продано', role: isFundU(u) ? 'Владелец' : 'Арендатор' });
        }
      }
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list };
    } else {
      vals.summaryFilterInfo = null;
    }

    this.summaryExtra(vals);
    return vals;
  }

  // Рамки помещений: {l,t,w,h} в % от изображения крыла. Порядок = порядок юнитов в units[].
  planHighlightBoxes = {
    // каждый юнит = массив прямоугольников, по одному на каждое помещение БТИ
    '1_1': [ // правое крыло, БТИ 195–218 (пересобрано из исходного скана, стены — пиксельный анализ)
      [{ l: 68.5, t: 8.3, w: 18.0, h: 26.6 }, { l: 80.2, t: 34.9, w: 5.1, h: 7.6 }],    // 1 → 195 + 196
      [{ l: 86.5, t: 8.3, w: 13.4, h: 26.6 }, { l: 85.3, t: 34.9, w: 4.1, h: 7.6 }],    // 2 → 198 + 197
      [{ poly: [[85.05,42.5],[99.9,42.5],[99.9,71],[93.5,86.3],[85.05,86.3]] }, { l: 85.3, t: 43.5, w: 4.7, h: 7 }], // 3 → 200 (скошенный угол) + 199
      [{ l: 72.8, t: 42.5, w: 12.2, h: 43.8 }, { l: 73.3, t: 34.9, w: 6.9, h: 7.6 }],    // 4 → 201 + 202
      [{ l: 60.5, t: 42.5, w: 12.3, h: 43.8 }, { l: 66.4, t: 34.9, w: 6.9, h: 7.6 }],    // 5 → 204 + 203
      [{ l: 48.3, t: 42.5, w: 12.2, h: 43.8 }, { l: 49.3, t: 34.9, w: 8.8, h: 7.6 }],    // 6 → 205 + 206
      [{ l: 35.0, t: 42.5, w: 13.3, h: 43.8 }, { l: 31.0, t: 34.9, w: 6.0, h: 7.6 }],    // 7 → 207 + 208
      [{ l: 18.3, t: 42.5, w: 16.7, h: 43.8 }, { l: 18.3, t: 34.9, w: 6.4, h: 7.6 }],    // 8 → 209 + 210
      [{ l: 6.2, t: 42.5, w: 12.1, h: 43.8 }, { l: 6.3, t: 34.9, w: 6.2, h: 7.6 }],      // 9 → 211 + 212
      [{ l: 6.3, t: 8.3, w: 18.5, h: 26.6 }, { l: 12.5, t: 34.9, w: 5.8, h: 7.6 }],      // 10 → 213 + 214
      [{ l: 24.8, t: 8.3, w: 12.4, h: 26.6 }, { l: 24.7, t: 34.9, w: 6.3, h: 7.6 }],     // 11 → 215 + 216
      [{ l: 37.2, t: 8.3, w: 12.3, h: 26.6 }, { l: 37.0, t: 34.9, w: 6.0, h: 7.6 }],     // 12 → 217 + 218
    ],
    '1_2': [ // левое крыло, БТИ 225–248 (стены найдены пиксельным анализом)
      [{ l: 57.9, t: 14.8, w: 12.4, h: 22 }, { l: 61.3, t: 36.8, w: 5.3, h: 6.9 }],   // 13 → 225 + 226
      [{ l: 70.3, t: 14.8, w: 24.5, h: 22 }, { l: 66.6, t: 36.8, w: 7.0, h: 6.9 }],   // 14 → 228 (13,2 м во всю ширину до торца) + 227
      [{ l: 82.9, t: 43.7, w: 12.5, h: 42.3 }, { l: 81.0, t: 36.8, w: 7.7, h: 6.9 }], // 15 → 229 + 230
      [{ l: 66.2, t: 43.7, w: 16.7, h: 42.3 }, { l: 73.6, t: 36.8, w: 7.4, h: 6.9 }], // 16 → 232 + 231
      [{ l: 52.7, t: 43.7, w: 13.5, h: 42.3 }, { l: 55.9, t: 36.8, w: 5.4, h: 6.9 }], // 17 → 233 + 234
      [{ l: 40.7, t: 43.7, w: 12.0, h: 42.3 }, { l: 39.8, t: 36.8, w: 7.6, h: 6.9 }], // 18 → 235 + 236
      [{ l: 28.5, t: 43.7, w: 12.2, h: 42.3 }, { l: 34.3, t: 36.8, w: 5.5, h: 6.9 }], // 19 → 238 + 237
      [{ l: 16.2, t: 43.7, w: 12.3, h: 42.3 }, { l: 23.4, t: 36.8, w: 5.4, h: 6.9 }], // 20 → 239 + 240
      [{ poly: [[0.2,43.7],[16.2,43.7],[16.2,86],[15.5,86],[0.2,72]] }, { l: 8.5, t: 36.8, w: 4.1, h: 6.9 }], // 21 → 242 (скошенный угол) + 241
      [{ l: 0.4, t: 14.8, w: 14.5, h: 22 }, { l: 12.6, t: 36.8, w: 5.4, h: 6.9 }],    // 22 → 243 + 244
      [{ l: 14.9, t: 14.8, w: 11.6, h: 22 }, { l: 18.0, t: 36.8, w: 5.4, h: 6.9 }],   // 23 → 245 + 246
      [{ l: 26.5, t: 14.8, w: 12.0, h: 22 }, { l: 28.8, t: 36.8, w: 5.5, h: 6.9 }],   // 24 → 247 + 248
    ],
  };

  // МОП (места общего пользования) — закрашиваются на поэтажном плане
  mopAreas = {
    '1_1': [ // 189 лестница, 190/191 лифты, 192, 193, 194
      { n: '189', poly: [[49.5,8.3],[54.3,8.3],[54.3,34.9],[49.5,34.9]] },
      { n: '191', poly: [[54.3,8.3],[62.3,8.3],[62.3,34.9],[54.3,34.9]] },
      { n: '192', poly: [[62.3,5.2],[68.5,5.2],[68.5,11.9],[62.3,11.9]] },
      { n: '193', poly: [[62.3,11.9],[68.5,11.9],[68.5,34.9],[62.3,34.9]] },
      { n: '194', poly: [[58.1,34.9],[66.4,34.9],[66.4,42.5],[58.1,42.5]] },
    ],
    '1_2': [
      { n: '219', poly: [[38.7,14.8],[43.7,14.8],[43.7,36.8],[38.7,36.8]] },
      { n: '221', poly: [[47.8,14.8],[52.1,14.8],[52.1,36.8],[47.8,36.8]] },
      { n: '222', poly: [[52.1,14.8],[58,14.8],[58,22],[52.1,22]] },
      { n: '223', poly: [[52.1,22],[58,22],[58,36.8],[52.1,36.8]] },
      { n: '224', poly: [[47.45,36.8],[55.9,36.8],[55.9,43.7],[47.45,43.7]] },
    ],
  };

  btiNumbers = {
    '1_1': ['195, 196', '197, 198', '199, 200', '201, 202', '203, 204', '205, 206', '207, 208', '209, 210', '211, 212', '213, 214', '215, 216', '217, 218'],
    '1_2': ['225, 226', '227, 228', '229, 230', '231, 232', '233, 234', '235, 236', '237, 238', '239, 240', '241, 242', '243, 244', '245, 246', '247, 248'],
    '1a': ['2', '3', '6', '8', '9, 16–24', '12', '13'],
    '2a': ['2', '3', '6', '7', '8', '10', '12', '13'],
    '3a': ['3', '6', '7', '9', '13'],
    '6_1': ['220, 221, 226, 227', '222, 223, 224, 225', '228, 229, 230', '231, 232, 233', '234, 235, 236', '237, 238, 239, 240', '241, 242, 243, 244, 245', '246, 247, 248, 249'],
    '6_2': ['255, 256, 261, 264', '257, 258, 259, 260', '262, 263', '265, 266, 267', '268, 269, 270', '271, 272, 273', '276, 277, 278', '279, 280', '281, 282, 283', '284, 285, 286', '287, 288, 289', '274, 275, 290'],
    '7_1': ['85, 86, 87', '88, 89, 90', '91, 92, 93', '94, 95, 96', '97, 98, 99', '100, 101, 102', '103, 104, 105', '106, 107', '108, 109', '110, 111, 112', '113, 114'],
    '8_2': ['220, 221, 226, 227', '222, 223, 224, 225', '228, 229, 230', '231, 232, 233', '234, 235, 236', '237, 238, 239, 240', '241, 242, 243, 244, 245', '246, 247, 248, 249'],
    '8_1': ['255, 256, 261, 264', '257, 258, 259, 260', '262, 263', '265, 266, 267', '268, 269, 270', '271, 272, 273', '276, 277, 278', '279, 280', '281, 282, 283', '284, 285, 286', '287, 288, 289', '274, 275, 290'],
  };

  // Литер 8 · Подъезд 1 — координаты пересчитаны по пиксельному анализу стен на новом точном кропе из исходного скана техпаспорта
  liter8_1Floors = [
    { label: '1 этаж', img: 'assets/liter8_2_floor1_r180.png', ratio: 2190 / 714,
      boxes: [
        [{ l: 61.5, t: 2, w: 6.0, h: 41.5 }, { l: 67.5, t: 2, w: 12.8, h: 41.5 }, { l: 72.0, t: 45.5, w: 6.0, h: 10 }], // 1: 220,221,226,227
        [{ l: 80.3, t: 2, w: 16.2, h: 41.5 }, { l: 79.5, t: 45.5, w: 17.0, h: 10 }, { l: 75.2, t: 56, w: 21.3, h: 42.5 }], // 2: 222,223,224,225
        [{ l: 63.5, t: 45.5, w: 7.5, h: 10 }, { l: 68.3, t: 56, w: 6.9, h: 42.5 }], // 3: 228,229,230
        [{ l: 52.5, t: 45.5, w: 10.5, h: 10 }, { l: 49.7, t: 56, w: 18.6, h: 42.5 }], // 4: 231,232,233
        [{ l: 38.5, t: 45.5, w: 10.0, h: 10 }, { l: 37.7, t: 56, w: 12.0, h: 42.5 }], // 5: 234,235,236
        [{ l: 30.5, t: 2, w: 12.5, h: 41.5 }, { l: 29.5, t: 45.5, w: 7.0, h: 10 }, { l: 31.0, t: 56, w: 6.7, h: 42.5 }], // 6: 237,238,239,240
        [{ l: 19.0, t: 2, w: 11.5, h: 41.5 }, { l: 15.5, t: 45.5, w: 13.5, h: 10 }, { l: 13.7, t: 56, w: 17.3, h: 42.5 }], // 7: 241,242,243,244,245
        [{ l: 3.0, t: 2, w: 16.0, h: 41.5 }, { l: 3.2, t: 45.5, w: 10.1, h: 10 }, { l: 3.0, t: 56, w: 10.7, h: 42.5 }], // 8: 246,247,248,249
      ],
      mop: [ { l: 43.0, t: 2, w: 18.5, h: 41.5 } ] },
  ];

  // Литер 8 · Подъезд 2 — координаты пересчитаны по пиксельному анализу стен на новом точном кропе из исходного скана техпаспорта
  liter8_2Floors = [
    { label: '1 этаж', img: 'assets/liter8_1_floor1_r180.png', ratio: 2245 / 714,
      boxes: [
        [{ l: 63.3, t: 2, w: 18.0, h: 41.5 }, { l: 75.6, t: 45.5, w: 10.1, h: 10 }], // 9: 255,256,261,264
        [{ l: 81.3, t: 2, w: 16.5, h: 41.5 }, { l: 87.6, t: 45.5, w: 9.6, h: 10 }, { l: 87.4, t: 56.5, w: 10.4, h: 42 }], // 10: 257,258,259,260
        [{ l: 75.8, t: 56.5, w: 11.6, h: 42 }], // 11: 262,263
        [{ l: 65.7, t: 45.5, w: 2.7, h: 10 }, { l: 70.6, t: 45.5, w: 5.0, h: 10 }, { l: 68.6, t: 56.5, w: 7.2, h: 42 }], // 12: 265,266,267
        [{ l: 50.6, t: 45.5, w: 15.1, h: 10 }, { l: 51.0, t: 56.5, w: 17.6, h: 42 }], // 13: 268,269,270
        [{ l: 42.8, t: 45.5, w: 7.8, h: 10 }, { l: 39.7, t: 56.5, w: 11.3, h: 42 }], // 14: 271,272,273
        [{ l: 26.5, t: 45.5, w: 6.8, h: 10 }, { l: 27.0, t: 56.5, w: 12.7, h: 42 }], // 15: 276,277,278
        [{ l: 15.2, t: 56.5, w: 11.8, h: 42 }], // 16: 279,280
        [{ l: 5.4, t: 45.5, w: 9.2, h: 10 }, { l: 5.0, t: 56.5, w: 10.2, h: 42 }], // 17: 281,282,283
        [{ l: 5.3, t: 2, w: 15.9, h: 41.5 }, { l: 14.6, t: 45.5, w: 3.0, h: 10 }], // 18: 284,285,286
        [{ l: 21.2, t: 2, w: 12.2, h: 41.5 }, { l: 17.6, t: 45.5, w: 8.9, h: 10 }], // 19: 287,288,289
        [{ l: 33.4, t: 2, w: 12.1, h: 41.5 }, { l: 33.4, t: 45.5, w: 9.4, h: 10 }], // 20: 274,275,290
      ],
      mop: [ { l: 45.5, t: 2, w: 17.8, h: 41.5 } ] },
  ];

  // Литер 6 · Подъезд 1 — контуры выверены по реальным площадям БТИ из экспликации техпаспорта
  liter6_1Floors = [
    { label: '1 этаж', img: 'assets/liter6_pod2.png', ratio: 2332 / 1009,
      boxes: [
        [{ l: 58.6, t: 19.7, w: 5.9, h: 30.6 }, { l: 64.5, t: 19.7, w: 14.0, h: 30.6 }, { l: 71.5, t: 50.5, w: 6.0, h: 8.5 }], // 1: 220,221,226,227
        [{ l: 78.5, t: 19.7, w: 17.2, h: 30.6 }, { l: 79.5, t: 50.5, w: 16.3, h: 8.5 }, { l: 74.3, t: 59.3, w: 21.4, h: 31.2 }], // 2: 222,223,224,225
        [{ l: 60.5, t: 50.5, w: 9.5, h: 8.5 }, { l: 67.5, t: 59.3, w: 6.8, h: 31.2 }], // 3: 228,229,230
        [{ l: 47.8, t: 50.5, w: 12.7, h: 8.5 }, { l: 49.5, t: 59.3, w: 18.0, h: 31.2 }], // 4: 231,232,233
        [{ l: 37.6, t: 50.5, w: 10.2, h: 8.5 }, { l: 37.6, t: 59.3, w: 11.9, h: 31.2 }], // 5: 234,235,236
        [{ l: 30.8, t: 19.7, w: 12.2, h: 30.6 }, { l: 30.5, t: 50.5, w: 6.7, h: 8.5 }, { l: 30.8, t: 59.3, w: 6.8, h: 31.2 }], // 6: 237,238,239,240
        [{ l: 17.5, t: 19.7, w: 13.3, h: 30.6 }, { l: 13.0, t: 50.5, w: 16.9, h: 8.5 }, { l: 13.5, t: 59.3, w: 17.3, h: 31.2 }], // 7: 241,242,243,244,245
        [{ l: 3.3, t: 19.7, w: 14.2, h: 30.6 }, { l: 3.3, t: 50.5, w: 9.7, h: 8.5 }, { l: 3.3, t: 59.3, w: 10.2, h: 31.2 }], // 8: 246,247,248,249
      ],
      mop: [ { l: 42.5, t: 19.7, w: 16.1, h: 30.6 } ] },
  ];

  // Литер 6 · Подъезд 2 — контуры получены сегментацией скана по связным областям (пиксельный анализ)
  liter6_2Floors = [
    { label: '1 этаж', img: 'assets/liter6_pod1.png', ratio: 2332 / 1009,
      boxes: [
        [{ l: 64.2, t: 19.5, w: 17.6, h: 30.7 }, { l: 76.8, t: 50.4, w: 4.5, h: 8.5 }, { l: 82.7, t: 50.4, w: 3.8, h: 8.5 }], // 9: 255,256,261,264
        [{ l: 81.8, t: 19.5, w: 15.6, h: 30.7 }, { l: 88.5, t: 50.4, w: 8.9, h: 8.5 }, { l: 87.5, t: 59.2, w: 9.9, h: 31.2 }], // 10: 257,258,259,260
        [{ l: 75.8, t: 59.2, w: 11.7, h: 31.2 }], // 11: 262,263
        [{ l: 67.5, t: 50.4, w: 2.7, h: 8.5 }, { l: 71.8, t: 50.4, w: 5.0, h: 8.5 }, { l: 68.5, t: 59.2, w: 7.3, h: 31.2 }], // 12: 265,266,267
        [{ l: 51.3, t: 50.4, w: 16.2, h: 8.5 }, { l: 51.3, t: 59.2, w: 17.2, h: 31.2 }], // 13: 268,269,270
        [{ l: 43.3, t: 50.4, w: 7.5, h: 8.5 }, { l: 39.8, t: 59.2, w: 11.5, h: 31.2 }], // 14: 271,272,273
        [{ l: 27.2, t: 50.4, w: 6.2, h: 8.5 }, { l: 27.0, t: 59.2, w: 12.8, h: 31.2 }], // 15: 276,277,278
        [{ l: 15.5, t: 59.2, w: 11.5, h: 31.2 }], // 16: 279,280
        [{ l: 4.4, t: 50.4, w: 9.7, h: 8.5 }, { l: 4.4, t: 59.2, w: 11.1, h: 31.2 }], // 17: 281,282,283
        [{ l: 4.4, t: 19.5, w: 15.9, h: 30.7 }, { l: 14.1, t: 50.4, w: 5.9, h: 8.5 }], // 18: 284,285,286
        [{ l: 20.3, t: 19.5, w: 12.3, h: 30.7 }, { l: 20.0, t: 50.4, w: 7.2, h: 8.5 }], // 19: 287,288,289
        [{ l: 32.6, t: 19.5, w: 12.2, h: 30.7 }, { l: 33.4, t: 50.4, w: 9.9, h: 8.5 }], // 20: 274,275,290
      ],
      mop: [ { l: 44.8, t: 19.5, w: 19.4, h: 30.7 } ] },
  ];

  // Литер 7 · Подъезд 1 — один этаж
  liter7Floors = [
    { label: '1 этаж', img: 'assets/liter7_pod1.png', ratio: 2893 / 1214,
      boxes: [
        [{ l: 56.3, t: 22.5, w: 25.8, h: 25 }, { l: 68.6, t: 48, w: 2.9, h: 7.8 }, { l: 72.6, t: 48, w: 2.4, h: 7.8 }], // 1 → 85 (включает открытую зону 81/82),86,87
        [{ l: 82.1, t: 22.5, w: 10.6, h: 25 }, { l: 83.5, t: 48, w: 2.4, h: 7.8 }, { l: 82.3, t: 56.3, w: 10.4, h: 27 }], // 2 → 88,89,90
        [{ l: 68.2, t: 56.3, w: 14.1, h: 27 }, { l: 75.4, t: 48, w: 4.2, h: 7.8 }, { l: 79.6, t: 48, w: 3.0, h: 7.8 }], // 3 → 91,92,93
        [{ l: 57.0, t: 56.3, w: 11.2, h: 27 }, { l: 58.4, t: 48, w: 6.2, h: 7.8 }, { l: 64.6, t: 48, w: 3.1, h: 7.8 }], // 4 → 94,95,96
        [{ l: 46.5, t: 56.3, w: 10.5, h: 27 }, { l: 53.4, t: 48, w: 5.0, h: 7.8 }], // 5 → 97,99,98
        [{ l: 36.1, t: 56.3, w: 10.4, h: 27 }, { l: 44.9, t: 48, w: 6.3, h: 7.8 }, { l: 51.2, t: 48, w: 2.2, h: 7.8 }], // 6 → 100,101,102
        [{ l: 25.6, t: 56.3, w: 10.5, h: 27 }, { l: 35.7, t: 48, w: 2.9, h: 7.8 }, { l: 40.6, t: 48, w: 3.1, h: 7.8 }], // 7 → 103,104,105
        [{ l: 12.7, t: 56.3, w: 12.9, h: 27 }, { l: 17.6, t: 48, w: 3.8, h: 7.8 }], // 8 → 106,107
        [{ l: 12.7, t: 22.5, w: 11.8, h: 25 }, { l: 21.4, t: 48, w: 3.6, h: 7.8 }], // 9 → 108,109
        [{ l: 24.5, t: 22.5, w: 10.2, h: 25 }, { l: 26.2, t: 48, w: 3.5, h: 7.8 }, { l: 30.4, t: 48, w: 2.0, h: 7.8 }], // 10 → 110,112,111
        [{ l: 34.7, t: 22.5, w: 10.3, h: 25 }, { l: 41.5, t: 41.5, w: 3.3, h: 6 }],  // 11 → 113,114
      ],
      mop: [
        { l: 49.1, t: 22.5, w: 3.1, h: 25 },  // лифты
        { l: 45.0, t: 22.5, w: 4.1, h: 25 },  // пом. 80 (МОП)
        { l: 52.2, t: 22.5, w: 4.1, h: 25 },  // пом. 83/84 (МОП)
        { l: 9.8, t: 22.5, w: 2.9, h: 25 },   // лестница слева

      ] },
  ];

  // Литер 6А: одно нежилое помещение без внутренних перегородок (по тех. паспорту)
  liter6aFloors = [
    { label: '1 этаж', img: 'assets/liter6a_floor1.png', ratio: 1420 / 1820,
      boxes: [
        [{ poly: [[94.6,85.4],[84.7,85.4],[84.7,95.6],[5.6,95.6],[75.6,11.0],[83.8,5.1],[94.6,5.1]] },
         { poly: [[94.6,95.6],[84.7,95.6],[84.7,85.4],[94.6,85.4]] }], // 1 = БТИ 1 + БТИ 2 (1,7 м²), план перевёрнут
      ],
      mop: [] },
  ];

  // Литер 7А: три этажа (подвал, 1 и 2 этаж), каждый — одно открытое помещение с лестницей у левого края
  liter7aFloors = [
    { label: 'Подвал', img: 'assets/liter7a_podval_v2.png', ratio: 2095 / 2557,
      boxes: [ [{ poly: [[3.5,2.5],[96,2.5],[96,99.5],[31.5,99.5],[31.5,74],[3.5,74]] }], null, null ],
      mop: [ { poly: [[3.5,74],[31.5,74],[31.5,99.5],[3.5,99.5]] } ] },
    { label: '1 этаж', img: 'assets/liter7a_floor1_v2.png', ratio: 2095 / 2557,
      boxes: [ null, [{ poly: [[3.5,2],[96,2],[96,99.5],[45.5,99.5],[45.5,87],[13,87],[13,78.5],[3.5,78.5]] }], null ],
      mop: [ { poly: [[3.5,78.5],[13,78.5],[13,87],[45.5,87],[45.5,99.5],[3.5,99.5]] } ] },
    { label: '2 этаж', img: 'assets/liter7a_floor2_v2.png', ratio: 2095 / 2557,
      boxes: [ null, null, [{ poly: [[3.5,2],[96,2],[96,99.5],[44,99.5],[44,87],[13,87],[13,78.5],[3.5,78.5]] }] ],
      mop: [ { poly: [[3.5,78.5],[13,78.5],[13,87],[44,87],[44,99.5],[3.5,99.5]] } ] },
  ];

  // Литер 8А (строение 9): один этаж, треугольник, пом. 1 = БТИ 1 (67,1) + БТИ 2 (1,7)
  liter8aFloors = [
    { label: '1 этаж', img: 'assets/liter8a_floor1.png', ratio: 1170 / 1710,
      boxes: [ [{ poly: [[95.5,96],[7,96],[8.5,93],[92,8],[95.5,6.5]] }] ], mop: [] }, // план перевёрнут
  ];

  // ТЦ Самолет — «Технический паспорт коммерция 819»: подвал + 2 этажа (ул. Западный Обход, 41)
  tcFloors = [
    { label: 'Подвал', img: 'assets/tc819_podval.png', ratio: 870 / 585, boxes: [], mop: [] },
    { label: '1 этаж', img: 'assets/tc819_floor1.png', ratio: 870 / 570, boxes: [], mop: [] },
    { label: '2 этаж', img: 'assets/tc819_floor2.png', ratio: 870 / 570, boxes: [], mop: [] },
  ];

  // Литер 8Б (строение 13): три этажа, помещение = зал + кладовая; лестничный блок — МОП
  liter8bFloors = [
    { label: 'Подвал', img: 'assets/liter8b_podval_v2.png', ratio: 2166 / 2371,
      boxes: [ [{ poly: [[56.5,10.5],[73.4,10.5],[73.4,97],[61.5,97],[61.5,75.5],[17.5,75.5]] }], null, null ],
      mop: [ { poly: [[17.5,75.5],[61.5,75.5],[61.5,97],[5,97]] } ] },
    { label: '1 этаж', img: 'assets/liter8b_floor1_v2.png', ratio: 2166 / 2371,
      boxes: [ null, [{ poly: [[61.7,10.5],[71.5,10.5],[71.5,97.5],[57,97.5],[57,93.2],[49.7,93.2],[49.7,84.6],[57,84.6],[57,78.7],[13,78.7]] }], null ],
      mop: [ { poly: [[13,78.7],[57,78.7],[57,84.6],[49.7,84.6],[49.7,93.2],[57,93.2],[57,97.5],[4.3,97.5]] } ] },
    { label: '2 этаж', img: 'assets/liter8b_floor2_v2.png', ratio: 2166 / 2371,
      boxes: [ null, null, [{ poly: [[63,11],[72.6,11],[72.6,98],[58,98],[58,94],[50.3,94],[50.3,85.7],[58,85.7],[58,80.7],[15.2,80.7]] }] ],
      mop: [ { poly: [[15.2,80.7],[58,80.7],[58,85.7],[50.3,85.7],[50.3,94],[58,94],[58,98],[6.6,98]] } ] },
  ];

  // Литер 3А (Лит И): три этажа
  liter3aFloors = [
    { label: 'Подвал', img: 'assets/liter3a_podval.png', ratio: 612 / 783,
      boxes: [
        [{ poly: [[13,10],[86.5,10],[86.5,84],[13,84],[13,54.5],[52.5,54.5],[52.5,38.5],[13,38.5]] }], // 1 → БТИ 3
        null, null, null, null],
      mop: [ { poly: [[13,38.5],[52.5,38.5],[52.5,54.5],[13,54.5]] } ] },
    { label: '1 этаж', img: 'assets/liter3a_floor1.png', ratio: 612 / 783,
      boxes: [null,
        [{ poly: [[13.5,1],[95.5,1],[95.5,51.5],[75.5,51.5],[75.5,36],[13.5,36]] }], // 2 → БТИ 6 (пом. 6, 77.6; Г-образное с выступом вниз справа)
        [{ poly: [[13.5,59],[57,59],[57,53],[95.5,53],[95.5,84],[13.5,84]] }], // 3 → БТИ 7 (пом. 7, 73.0)
        null, null],
      mop: [ { poly: [[13.5,36],[75.5,36],[75.5,53],[57,53],[57,59],[13.5,59]] } ] },
    { label: '2 этаж', img: 'assets/liter3a_floor2.png', ratio: 612 / 783,
      boxes: [null, null, null,
        [{ poly: [[7,4],[95,4],[95,40],[7,40]] }],       // 4 → БТИ 9
        [{ poly: [[7,61],[95,61],[95,93.5],[7,93.5]] }]],        // 5 → БТИ 13
      mop: [ { poly: [[7,41.5],[92,41.5],[92,59.5],[7,59.5]] } ] },
  ];

  // Литер 2А (Лит Л): три этажа
  liter2aFloors = [
    { label: 'Подвал', img: 'assets/liter2a_podval_v2.png', ratio: 1497 / 1339,
      boxes: [
        [{ poly: [[8.7,4],[20,4],[55.3,62.5],[8.7,62.5]] }], // 1 → БТИ 2 (пом. 2, 344.2)
        [{ poly: [[8.7,65],[55.3,65],[55.3,63],[78,63],[92,89],[90,92],[8.7,92]] }], // 2 → БТИ 3 (пом. 3, 438.2)
        null, null, null, null, null, null],
      mop: [
        { l: 10, t: 29, w: 12, h: 7.5 },
        { l: 57.5, t: 77, w: 7, h: 15 } ] },
    { label: '1 этаж', img: 'assets/liter2a_floor1_v2.png', ratio: 1497 / 1339,
      boxes: [null, null,
        [{ poly: [[13,2.5],[24.5,2.5],[42,30],[26.5,30],[26.5,26.5],[13,26.5]] }], // 3 → БТИ 6 (пом. 6, 113.9)
        [{ poly: [[13,34.5],[26.5,34.5],[26.5,30],[42,30],[59,60.3],[13,60.3]] }], // 4 → БТИ 7 (пом. 7, 233.4)
        [{ poly: [[13,63],[62,63],[62,88.5],[13,88.5]] }], // 5 → БТИ 8 (пом. 8, 290.4)
        [{ poly: [[62,61.5],[76,61.5],[80.5,57],[96.5,85.5],[95,89.5],[73,89.5],[73,74],[62,74]] }], // 6 → БТИ 10 (пом. 10, 151.5)
        null, null],
      mop: [
        { l: 13.5, t: 26.5, w: 13, h: 8 },
        { l: 62, t: 74, w: 11, h: 15.5 } ] },
    { label: '2 этаж', img: 'assets/liter2a_floor2_v2.png', ratio: 1497 / 1339,
      boxes: [null, null, null, null, null, null,
        [{ poly: [[12.7,4.5],[24.5,4.5],[58.7,62],[12.7,62]] }], // 7 → БТИ 12 (пом. 12, 348.6)
        [{ poly: [[12.7,65],[58.5,65],[58.5,63.2],[76,63],[79.5,59.5],[97,88],[95.5,91.5],[12.7,91.5]] }]], // 8 → БТИ 13 (пом. 13, 443.2)
      mop: [
        { l: 13, t: 29.5, w: 13, h: 8 },
        { l: 62, t: 77, w: 7.5, h: 14.5 } ] },
  ];

  // Литер 1А: три этажа. boxes — массив по индексам юнитов (null = юнит не на этом этаже)
  liter1aFloors = [
    { label: 'Подвал', img: 'assets/liter1a_podval_r180.png', ratio: 2893 / 1856,
      boxes: [
        [{ poly: [[17.5,71.5],[58.5,25.5],[58.5,74.5],[42,74.5],[42,62],[37.5,62],[37.5,74.5],[17.5,74.5]] }], // 1 → БТИ 2
        [{ poly: [[59.5,24.5],[79,2.5],[84,4],[84,21],[75,21],[75,35],[84,35],[84,74.5],[59.5,74.5]] }], // 2 → БТИ 3
        null, null, null, null, null],
      mop: [
        { poly: [[37.5,62],[42,62],[42,74.5],[37.5,74.5]] },
        { poly: [[75,21],[84,21],[84,35],[75,35]] } ] },
    { label: '1 этаж', img: 'assets/liter1a_floor1_r180.png', ratio: 2893 / 1856,
      boxes: [null, null,
        [{ poly: [[16,71.5],[40.5,44.8],[40.5,62],[36,62],[36,74],[16,74]] }], // 3 → БТИ 6
        [{ poly: [[40.5,44.8],[57.5,26.3],[57.5,74],[40.5,74]] }], // 4 → БТИ 8
        [{ poly: [[58.5,25.2],[77.5,4.5],[82,6],[82,74],[58.5,74]] }], // 5 → БТИ 9 + 16–24
        null, null],
      mop: [
        { poly: [[36,62],[40.5,62],[40.5,74],[36,74]] },
        { poly: [[72,33.5],[77.5,33.5],[77.5,40],[72,40]] } ] },
    { label: '2 этаж', img: 'assets/liter1a_floor2_r180.png', ratio: 2893 / 1856,
      boxes: [null, null, null, null, null,
        [{ poly: [[17.5,73],[57,27.5],[57,77],[41,77],[41,63],[37,63],[37,77],[17.5,77]] }], // 6 → БТИ 12
        [{ poly: [[58,27],[77,4.5],[81.5,6],[81.5,30.5],[72.5,30.5],[72.5,38],[81.5,38],[81.5,77],[58,77]] }]], // 7 → БТИ 13
      mop: [
        { poly: [[37,63],[41,63],[41,77],[37,77]] },
        { poly: [[72.5,30.5],[81.5,30.5],[81.5,38],[72.5,38]] } ] },
  ];

  data = {
    '8_1': { left: '56.7%', top: '13.4%', rot: -33 },
    '8_2': { left: '62.6%', top: '9.9%', rot: -33 },
    '7_1': { left: '71.7%', top: '16.1%', rot: -33 },
    '6_1': { left: '56.2%', top: '26.9%', rot: -33 },
    '6_2': { left: '61.9%', top: '23.0%', rot: -33 },
    '5_2': { left: '71.7%', top: '32.4%', rot: -33 },
    '5_1': { left: '79.2%', top: '27.5%', rot: -33 },
    '4_1': { left: '62.3%', top: '40.4%', rot: -33 },
    '4_2': { left: '56.4%', top: '44.7%', rot: -33 },
    '3_1': { left: '77.2%', top: '41.4%', rot: -33 },
    '3_2': { left: '83.3%', top: '36.2%', rot: -33 },
    '2_1': { left: '61.5%', top: '54.9%', rot: -33 },
    '2_2': { left: '68.0%', top: '49.9%', rot: -33 },
    '1_1': { left: '87.7%', top: '50.2%', rot: -33 },
    '1_2': { left: '82.4%', top: '54.6%', rot: -33 },
  };

  triData = {};

  triSizes = {};

  triPoints = {};

  triUnitsKey = {};

  rectData = {
    '2a': { left: '53.6%', top: '56.4%', rot: 0, w: 6.6, h: 8.6 },
    '1a': { left: '89.4%', top: '57.2%', rot: 0, w: 7.2, h: 5.4 },
    '1b': { left: '78.1%', top: '59.4%', rot: -33, w: 3.6, h: 2.8 },
    '1v': { left: '93.0%', top: '46.1%', rot: -33, w: 2.5, h: 3.0 },
    '3a': { left: '88.9%', top: '33.7%', rot: -33, w: 2.7, h: 3.6 },
    '5a': { left: '84.3%', top: '23.9%', rot: -33, w: 2.7, h: 3.6 },
    '6a': { left: '52.0%', top: '33.2%', rot: -33, w: 3.0, h: 4.0 },
    '7a': { left: '76.7%', top: '11.9%', rot: -33, w: 2.7, h: 3.6 },
    '8a': { left: '51.2%', top: '19.0%', rot: -33, w: 3.2, h: 4.4 },
    '8b': { left: '67.2%', top: '7.7%', rot: -33, w: 2.8, h: 3.4 },
    'tc': { left: '60.0%', top: '69.5%', rot: 0, w: 7.5, h: 9.5 },
    'stop1': { left: '63.3%', top: '61.95%', rot: 0, w: 2.2, h: 1.5 },
    'wash': { left: '91.7%', top: '9.5%', rot: 0, w: 2.4, h: 2.0 },
  };

  plainData = {};

  enterSummary() { this.setState({ summaryHovered: true }); }

  leaveSummary() { this.setState({ summaryHovered: false }); }

  closeSummaryFilter() { this.setState({ summaryFilter: null, summaryPinned: true }); }

  toggleProblems() { this.setState(s => ({ problemsVisible: !s.problemsVisible })); }

  toggleEfficiency() { this.setState(s => ({ efficiencyVisible: !s.efficiencyVisible })); }

  hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  hoverVisual(isHovered, accent, hoverStyle) {
    const gray = '#6b6b6b';
    if (!isHovered) return { border: '2px solid transparent', background: 'transparent', boxShadow: 'none' };
    if (hoverStyle === 'glow') return { border: `1px solid ${gray}`, background: this.hexToRgba(gray, 0.22), boxShadow: `0 0 18px ${this.hexToRgba(gray, 0.55)}` };
    return { border: `2px solid ${gray}`, background: 'transparent', boxShadow: 'none' };
  }

  isFundU(u) { return !!u.company && /ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(u.company); }
  };
};

window.OMJKLogic[2] = function (DCLogic) {
  return class JK extends window.GenplanCore(DCLogic) {
  state = { hovered: null, selected: null, summaryHovered: false, summaryPinned: false, summaryFilter: null, problemsVisible: false, efficiencyVisible: false };

  // Планы 1 этажа из техпаспортов (лист 8); кроп по подъезду (БТИ: л3 п.1 259–274, п.2 275–292, п.3 293–312; литер 4 зеркален: п.1 92–111, п.2 297–319, п.3 508–528)
  floorPlans = {
    'wash': { img: 'assets/wash_floor1.png', ratio: 1450 / 200 },
    // литер 9 (ген.) = внутр. ключ 1_x; БТИ: п.1 256–273, п.2 274–291, п.3 292–307
    '1_3': { img: 'assets/liter9_s2_p3.png', ratio: 442 / 1108 },
    '1_2': { img: 'assets/liter9_s2_p2.png', ratio: 930 / 758 },
    '1_1': { img: 'assets/liter9_s2_p1.png', ratio: 890 / 738 },
    // литер 10 (ген.) = внутр. ключ 2_x; БТИ: п.1 81–101, п.2 240–262, п.3 458–480
    '2_1': { img: 'assets/liter10_s2_p1.png', ratio: 424 / 1088 },
    '2_2': { img: 'assets/liter10_s2_p2.png', ratio: 916 / 684 },
    '2_3': { img: 'assets/liter10_s2_p3.png', ratio: 892 / 724 },
    '3_1': { img: 'assets/liter3_s2_p1.png', ratio: 601 / 1175 },
    '3_2': { img: 'assets/liter3_s2_p2.png', ratio: 975 / 760 },
    '3_3': { img: 'assets/liter3_s2_p3.png', ratio: 1037 / 780 },
    '4_1': { img: 'assets/liter4_s2_p1.png', ratio: 1016 / 809 },
    '4_2': { img: 'assets/liter4_s2_p2.png', ratio: 1010 / 789 },
    '4_3': { img: 'assets/liter4_s2_p3.png', ratio: 560 / 1092 },
  };

  // Рамки помещений на плане (в % от изображения), порядок = порядок юнитов в units[key]
  planBoxes = {
    '1_1': [
      [{ poly: [[56,6],[75.5,6],[75.5,22.5],[72.5,22.5],[72.5,47.5],[61,47.5],[61,40.5],[57.5,40.5],[57.5,28],[56,28]] }, { l: 72.5, t: 22.5, w: 3, h: 7.5 }],
      [{ poly: [[76,5.5],[94.5,5.5],[94.5,17.5],[79,17.5],[79,22.5],[76,22.5]] }, { l: 76, t: 22.5, w: 3.3, h: 7.5 }],
      [{ poly: [[79.5,17.5],[98,17.5],[98,31],[94.5,31],[94.5,51],[77,51],[77,41],[73,41],[73,31],[79.5,31]] }, { l: 73, t: 41, w: 3.8, h: 7.5 }],
      [{ poly: [[73,51],[98,51],[98,76.5],[92,76.5],[92,97.5],[69,97.5],[69,70],[73,70]] }, { l: 70.5, t: 48.5, w: 2.5, h: 7.5 }],
      [{ l: 51.5, t: 70, w: 17, h: 27.5 }],
      [{ l: 42.5, t: 70, w: 8.5, h: 27.5 }],
      [{ poly: [[25.5,47],[46.5,47],[46.5,70],[42,70],[42,97.5],[25.5,97.5],[25.5,75],[27.2,75],[27.2,68.5],[25.5,68.5]] }],
      [{ l: 17.5, t: 47, w: 8, h: 50.5 }, { l: 23.5, t: 68.5, w: 3.7, h: 6.5 }],
      [{ l: 0.3, t: 47, w: 16.7, h: 50.5 }, { l: 13, t: 68.5, w: 5.5, h: 7 }],
    ],
    '1_2': [
      [{ l: 81.3, t: 48.5, w: 15.8, h: 48.5 }],
      [{ l: 73, t: 48.5, w: 7.5, h: 48.5 }, { l: 69, t: 70.5, w: 4, h: 4.5 }],
      [{ poly: [[52.5,48.5],[73,48.5],[73,70.5],[69,70.5],[69,75],[73,75],[73,97],[56.5,97],[56.5,70],[52.5,70]] }],
      [{ l: 39.5, t: 70, w: 17, h: 27 }],
      [{ poly: [[23,74],[34,74],[34,70],[39,70],[39,97],[23,97]] }],
      [{ poly: [[6.5,63.5],[27.5,63.5],[27.5,70],[22.5,70],[22.5,97],[9.5,97],[9.5,83.5],[6.5,83.5]] }],
      [{ l: 6.5, t: 49.5, w: 23.5, h: 13.5 }],
      [{ poly: [[6.5,29],[43,29],[43,38.5],[38.5,38.5],[38.5,48.5],[6.5,48.5]] }],
      [{ l: 6.5, t: 10, w: 36.5, h: 18.5 }],
    ],
    '1_3': [
      [{ poly: [[13,88.3],[85,88.3],[85,93],[82,93],[82,99],[20,99],[20,93],[13,93]] }],
      [{ l: 5, t: 78, w: 85, h: 9.5 }],
      [{ poly: [[5,65],[44,65],[44,61.5],[90,61.5],[90,77.5],[5,77.5]] }],
      [{ poly: [[5,51],[44,51],[44,56],[54,56],[54,61.5],[44,61.5],[44,64.5],[5,64.5]] }],
      [{ poly: [[5,38],[44,38],[44,47.5],[54,47.5],[54,51],[5,51]] }],
      [{ poly: [[5,25],[90,25],[90,44],[54,44],[54,37.5],[5,37.5]] }],
      [{ l: 5, t: 17.2, w: 85, h: 7.6 }],
      [{ poly: [[13,4],[84,4],[84,9.5],[90,9.5],[90,17],[5,17],[5,16],[13,16]] }],
    ],
    '2_1': [ // литер 2 (ген. 10), БТИ 81–101
      [{ poly: [[13,4.5],[85,4.5],[85,16.5],[54,16.8],[54,18.3],[6.5,18.3],[6.5,10.3],[13,10.3]] }],
      [{ poly: [[6.5,19],[54,19],[54,17.2],[92,17.2],[92,24.8],[6.5,24.8]] }],
      [{ poly: [[6.5,25.3],[92,25.3],[92,37.6],[42.5,37.6],[42.5,43.6],[6.5,43.6]] }],
      [{ poly: [[43,38.3],[92,38.3],[92,51],[43,51]] }],
      [{ poly: [[43,51.6],[92,51.6],[92,64.6],[52.5,64.6],[52.5,60.2],[43,60.2]] }],
      [{ poly: [[6.5,62.8],[42,62.8],[42,60.6],[52.5,60.6],[52.5,65.2],[92,65.2],[92,78.3],[6.5,78.3]] }],
      [{ poly: [[6.5,79],[92,79],[92,85.6],[6.5,85.6]] }],
      [{ poly: [[6.5,86.3],[85,86.3],[85,92.3],[79.5,92.3],[79.5,99.3],[12.5,99.3],[12.5,92.3],[6.5,92.3]] }],
    ],
    '2_2': [ // литер 2 (ген. 10), БТИ 240–262
      [{ poly: [[55.5,2.3],[92.5,2.3],[92.5,22.5],[55.5,22.5]] }],
      [{ poly: [[55.5,23.5],[92.5,23.5],[92.5,44.5],[60.5,44.5],[60.5,32.5],[55.5,32.5]] }],
      [{ poly: [[69.5,45.5],[92.5,45.5],[92.5,60.5],[71.5,60.5],[71.5,54],[69.5,54]] }],
      [{ poly: [[71.5,61.3],[92.5,61.3],[92.5,81],[90,81],[90,84],[89.5,84],[89.5,97.8],[76.5,97.8],[76.5,73.8],[71.5,73.8]] }],
      [{ poly: [[59.5,68.3],[71.5,68.3],[71.5,73.8],[76,73.8],[76,97.8],[60.2,97.8],[60.2,73.8],[59.5,73.8]] }],
      [{ poly: [[43,68.3],[59.5,68.3],[59.5,97.8],[43,97.8]] }],
      [{ poly: [[26.3,45],[46.5,45],[46.5,67.8],[42.3,67.8],[42.3,97.8],[26.5,97.8],[26.5,74],[30,74],[30,68],[26.3,68]] }],
      [{ poly: [[17.8,45],[26,45],[26,68.5],[29.5,68.5],[29.5,74],[26,74],[26,97.8],[17.8,97.8]] }],
      [{ poly: [[1.5,45],[17.5,45],[17.5,97.8],[1.5,97.8]] }],
    ],
    '2_3': [ // литер 2 (ген. 10), БТИ 458–480
      [{ poly: [[82.5,48],[99,48],[99,98.3],[82.5,98.3],[82.5,76.5],[80.8,76.5],[80.8,70],[82.5,70]] }],
      [{ poly: [[74.7,48],[82.3,48],[82.3,70],[80.8,70],[80.8,76.5],[82.3,76.5],[82.3,98.3],[74.7,98.3],[74.7,76],[72.5,76],[72.5,70],[74.7,70]] }],
      [{ poly: [[52.8,48],[74.7,48],[74.7,70],[72.5,70],[72.5,76],[74.7,76],[74.7,98.3],[57.3,98.3],[57.3,69.8],[52.8,69.8]] }],
      [{ poly: [[48.5,70],[57.2,70],[57.2,98.3],[48.5,98.3]] }],
      [{ poly: [[30.8,70.5],[48,70.5],[48,98.3],[30.8,98.3]] }],
      [{ poly: [[1.5,52.2],[22.5,52.2],[22.5,48.3],[26.5,48.3],[26.5,70.8],[30.6,70.8],[30.6,98.3],[8.3,98.3],[8.3,77],[1.8,77]] }, { l: 26.5, t: 48.5, w: 3, h: 7.5 }],
      [{ poly: [[4.5,18.5],[20,18.5],[20,31.5],[26,31.5],[26,51.5],[4.8,51.5],[4.8,30.5],[1.5,30.5],[1.5,19.5],[4.5,19.5]] }],
      [{ l: 4.5, t: 5.8, w: 15.5, h: 11.3 }, { l: 20.2, t: 22.5, w: 2.7, h: 8 }],
      [{ poly: [[23.5,5.3],[43,5.3],[43,28],[41.5,28],[41.5,40.8],[38.8,40.8],[38.8,48],[26.5,48],[26.5,31],[23.5,31]] }],
    ],
    '3_1': [
      [{ poly: [[10.2,84],[70.5,84],[70.5,89.5],[64.5,89.5],[64.5,96],[10.2,96]] }, { l: 36.5, t: 91.5, w: 5, h: 4 }],   // пом 1: зал 260 (скошенный угол) + 259
      [{ l: 10.2, t: 76, w: 62.3, h: 7 }, { l: 33.5, t: 76, w: 6.5, h: 3.5 }],   // пом 2: зал 261 + 262
      [{ l: 10.2, t: 63.5, w: 62.3, h: 12 }, { l: 33.5, t: 70.5, w: 7.5, h: 5 }], // пом 3: зал 264 + 263
      [{ l: 10.2, t: 50.5, w: 26.8, h: 12.5 }, { l: 36.8, t: 50.5, w: 3.2, h: 3.5 }], // пом 4: зал 265 + 266
      [{ l: 10.2, t: 38.5, w: 27, h: 11.5 }, { l: 38.5, t: 41.5, w: 5.5, h: 3.5 }], // пом 5: зал 267 + 268
      [{ l: 10.2, t: 25.8, w: 62.3, h: 11.7 }, { l: 36.5, t: 26.3, w: 7.5, h: 5.2 }], // пом 6: зал 269 + 270
      [{ l: 10.2, t: 18.8, w: 62.3, h: 6.3 }, { l: 40, t: 19, w: 4.5, h: 3 }],      // пом 7: зал 271 + 272
      [{ poly: [[20.4,6],[67.4,6],[67.4,11.5],[72.5,11.5],[72.5,18.1],[15.4,18.1],[15.4,11.5],[20.4,11.5]] }, { l: 40, t: 6.2, w: 5, h: 4 }], // пом 8: зал 273 (ступенчатые углы) + 274
    ],
    '3_2': [
      [{ l: 9.5, t: 72, w: 36, h: 19.5 }],                                    // пом 9: 275 + 276
      [{ l: 9.5, t: 53, w: 36, h: 19 }],                                      // пом 10: 277 + 278
      [{ l: 9.5, t: 38.5, w: 19, h: 14 }, { l: 25.5, t: 38.5, w: 3.5, h: 5.5 }],  // пом 11: 279 + 280
      [{ poly: [[12.8,6],[25.3,6],[25.3,26.5],[29.5,26.5],[29.5,38.5],[9.5,38.5],[9.5,16],[12.8,16]] }, { l: 25.5, t: 33, w: 4, h: 5 }], // пом 12: 282 (ступень наружной стены, выступ к лифтам) + 281
      [{ poly: [[25.3,6],[40,6],[40,26.5],[36,26.5],[36,31.5],[30.3,31.5],[30.3,26.5],[25.3,26.5]] }, { l: 36, t: 26.5, w: 4, h: 5 }], // пом 13: зал 283 (с закутком x30–36) + тамбур 284 (x36–40)
      [{ poly: [[40.5,6],[57.2,6],[57.2,31.4],[44.6,31.4],[44.6,26.5],[40.5,26.5]] }, { l: 40.5, t: 26.5, w: 4.1, h: 5 }], // пом 14: зал 286 (с нижней полосой до x57,2) + тамбур 285
      [{ poly: [[57.5,6],[72.7,6],[72.7,52.5],[53.5,52.5],[53.5,32],[57.5,32]] }, { l: 63, t: 26.5, w: 5, h: 5.5 }], // пом 15: 287 (Г-обр., от стены x57,5) + 288
      [{ l: 72.7, t: 6, w: 7.5, h: 46.5 }, { l: 74, t: 26.5, w: 3, h: 5.5 }], // пом 16: 289 + 290
      [{ l: 80.2, t: 6, w: 16.3, h: 46.5 }, { l: 84.5, t: 26.5, w: 4, h: 5.5 }], // пом 17: 292 + 291
    ],
    '3_3': [
      [{ l: 11.6, t: 5.1, w: 8.4, h: 46.2 }, { l: 16.4, t: 26, w: 3.8, h: 5.8 }],          // пом 18: 293 + 294
      [{ l: 20.5, t: 5.1, w: 6.7, h: 46.2 }, { l: 22, t: 26, w: 5.2, h: 5.8 }],      // пом 19: 295 + 296
      [{ l: 27.6, t: 5.1, w: 14.6, h: 46.2 }, { l: 29, t: 26, w: 5, h: 6 }],       // пом 20: 298 + 297
      [{ l: 42.4, t: 5.1, w: 5.8, h: 24.7 }],                                     // пом 21: 300 + 299
      [{ l: 48.7, t: 5.1, w: 13.1, h: 25 }],                                    // пом 22: 302 + 301
      [{ l: 65.1, t: 5.4, w: 18.6, h: 19.9 }, { l: 65.1, t: 21.2, w: 4.3, h: 4.1 }], // пом 23: зал 304 (ступень наружной стены) + 303
      [{ poly: [[64.9,26.3],[89.3,26.3],[89.3,47.8],[66.5,47.8],[66.5,44],[68.1,44],[68.1,30.8],[64.9,30.8]] }, { l: 66.5, t: 44, w: 2.5, h: 3.8 }], // пом 24: зал 305 (вырез под лифты) + 306
      [{ poly: [[72.9,52.6],[86.4,52.6],[86.4,66.5],[70.2,66.5],[70.2,57.5],[72.9,57.5]] }, { l: 69.3, t: 52.6, w: 3.6, h: 4.9 }],   // пом 25: зал 308 + 307
      [{ poly: [[70.9,68],[89.1,68],[89.1,81],[86.5,81],[86.5,90.6],[70.9,90.6]] }, { l: 71, t: 68.2, w: 2.4, h: 7.4 }], // пом 26: зал 310 (ступень наружной стены) + 309
      [{ poly: [[58.1,51.8],[67.8,51.8],[67.8,75.8],[70.3,75.8],[70.3,90.6],[53.9,90.6],[53.9,70.6],[55.5,70.6],[55.5,59],[58.1,59]] }, { l: 68.1, t: 67.3, w: 2.2, h: 8.5 }],  // пом 27: 311 (Г-образный, вырез под лестницу) + 312
    ],
    '4_1': [
      [{ poly: [[27.5,60],[42,60],[42,91],[24,91],[24,75],[27.5,75]] }, { l: 24.5, t: 66, w: 3, h: 9 }],      // пом 1: 92 (Г-образный) + 93
      [{ l: 5.5, t: 70, w: 19, h: 21 }, { l: 21.5, t: 66, w: 3, h: 9 }],     // пом 2: 95 + 94
      [{ l: 8, t: 51, w: 15.5, h: 19 }, { l: 23.5, t: 54, w: 3.5, h: 6 }],   // пом 3: 96 + 97
      [{ poly: [[4,28],[31,28],[31,33.5],[26.5,33.5],[26.5,50],[4,50]] }, { l: 26.5, t: 44.5, w: 3.5, h: 4 }], // пом 4: зал 99 (Г-обр., вырез под лифты) + 98
      [{ l: 10.5, t: 8, w: 20.5, h: 20 }, { l: 26.5, t: 23.5, w: 4, h: 4.5 }], // пом 5: зал 100 + 101
      [{ l: 31.5, t: 8, w: 14.5, h: 20.5 }, { l: 40.5, t: 28.5, w: 3.5, h: 4.5 }], // пом 6: зал 102 + 103
      [{ l: 46, t: 8, w: 9.5, h: 20.5 }, { l: 50, t: 28.5, w: 5, h: 5 }],    // пом 7: зал 104 + 105
      [{ poly: [[56,8],[68.5,8],[68.5,53],[50.5,53],[50.5,33.5],[56,33.5]] }, { l: 60.5, t: 29.5, w: 3.5, h: 5 }],  // пом 8: зал 106 (Г-обр., расширение слева ниже тамбуров) + тамбур 107
      [{ l: 68.5, t: 8, w: 7.5, h: 45 }, { l: 64, t: 29.5, w: 4, h: 5 }],     // пом 9: зал 109 + тамбур 108
      [{ l: 76, t: 8, w: 14.5, h: 45 }, { l: 70.5, t: 28.5, w: 4.5, h: 5.5 }], // пом 10: зал 111 + тамбур 110
    ],
    '4_2': [
      [{ poly: [[12.9,8],[27.43,8],[27.43,54.5],[12.9,54.5]] }], // пом 11: 319 + 318 единым контуром (левая стена подъезда x12,9)
      [{ poly: [[27.44,8],[35.46,8],[35.46,29],[39,29],[39,34],[35.46,34],[35.46,54.5],[27.44,54.5]] }],         // пом 12: 317 + тамбур 316 (карман x35,5–39 / y29–34)
      [{ poly: [[35.46,8],[50.3,8],[50.3,33.5],[54,33.5],[54,54.5],[35.46,54.5],[35.46,34],[39,34],[39,29],[35.46,29]] }],    // пом 13: 314 + 315; правая стена x50,3 до y33,5, ниже уступ до x54 (до лестницы)
      [{ l: 50.1, t: 8, w: 15.59, h: 22.5 }, { l: 57.66, t: 28, w: 3.31, h: 5.5 }],    // пом 14: зал 313 + 312
      [{ l: 65.69, t: 8, w: 14.64, h: 21.5 }, { l: 65.69, t: 28, w: 3.31, h: 5.5 }], // пом 15: зал 305 + 306
      [{ poly: [[80.8,8],[91.2,8],[91.2,17.5],[94.97,17.5],[94.97,40],[80.8,40]] }, { l: 82.69, t: 35.5, w: 3.78, h: 4 }], // пом 16: зал 304 (ступень наружной стены) + 303
      [{ poly: [[74.5,40],[96.38,40],[96.38,55],[77.5,55],[77.5,47],[74.5,47]] }],         // пом 17: зал 301 + 302 (выемка снизу слева, под лестницу МОП)
      [{ poly: [[66.5,55],[96.38,55],[96.38,72.5],[62,72.5],[62,64],[66.5,64]] }], // пом 18: 300 + 299; левая стена x66,5 до y64, ниже уступ на x62
      [{ poly: [[61.91,72.5],[96.38,72.5],[96.38,90.5],[61.91,90.5]] }], // пом 19: зал 298 + тамбур 297 единым контуром
    ],
    '4_3': [
      [{ poly: [[24,1.5],[75.5,1.5],[75.5,8],[80.5,8],[80.5,15],[18.5,15],[18.5,8],[24,8]] }],   // пом 20: 509 + 508 (справа стена x75,5 до y8, затем уступ до x80,5)
      [{ poly: [[18.5,15],[86,15],[86,23],[18.5,23]] }],    // пом 21: 511 + 510
      [{ poly: [[18.5,23],[86,23],[86,36.5],[49,36.5],[49,39.5],[18.5,39.5]] }],     // пом 22: 513 + 512 (внизу до верха МОП y39,5 на x18,5–49)
      [{ poly: [[49,36.5],[86,36.5],[86,50],[49,50]] }],     // пом 23: 516 + 515
      [{ poly: [[49,50],[86,50],[86,64],[47,64],[47,57.5],[49,57.5]] }],   // пом 24: 522 + 521
      [{ poly: [[18.5,57.5],[47,57.5],[47,64],[86,64],[86,76.5],[18.5,76.5]] }], // пом 25: 523 (Г-обр.) + 524
      [{ poly: [[18.5,76.5],[86,76.5],[86,86],[78.5,86],[78.5,85.2],[54,85.2],[54,83.5],[18.5,83.5]] }],  // пом 26: 526 + 525, слева до наружной стены (в линию с 527)
      [{ poly: [[18.5,83.5],[54,83.5],[54,85.2],[78.5,85.2],[78.5,86],[80.5,86],[80.5,98],[22,98],[22,92],[18.5,92]] }],   // пом 27: 527 + 528 (верх: уступ на x54 к y85,2, у x78,5 ещё вниз до y86)
    ],
  };

  planMop = {
    '3_1': [{ l: 44.5, t: 38.5, w: 28.5, h: 19.5 }],
    '3_2': [{ poly: [[30.5,32.5],[53.5,32.5],[53.5,52.5],[31,52.5],[31,44.5],[29,44.5],[29,38.5],[30.5,38.5]] }],
    '3_3': [{ l: 48.5, t: 30.8, w: 13.4, h: 20.9 }, { l: 62, t: 31.4, w: 4.6, h: 12.8 }, { l: 40.5, t: 52.5, w: 12, h: 9.5 }, { l: 45.6, t: 30.8, w: 2.9, h: 20.5 }],
    '4_1': [{ l: 26.5, t: 33.5, w: 15.5, h: 11 }, { l: 30, t: 44.5, w: 12, h: 7.5 }, { l: 26.5, t: 48.5, w: 3.5, h: 3.5 }, { l: 42, t: 34, w: 8.5, h: 18.5 }],
    '4_2': [{ poly: [[54,34],[77.5,34],[77.5,47],[74.5,47],[74.5,54.5],[54,54.5]] }],
    '4_3': [{ l: 18.5, t: 39.5, w: 30.5, h: 18 }],
  };

  componentDidMount() {
    const apply = () => {
      const d = window.__SM_DATA_2;
      if (!d || !window.OMPriceNet) return false;
      this.units = d.units;
      // рыночная цена помещений — цена нетто из реестра рекомендуемых цен (август 2026)
      if (window.OMPriceNet) window.OMPriceNet.apply(2, this.units);
      this.rnv = d.rnv;
      if (window.OMSales && window.OMSales[2]) this.sales = window.OMSales[2];
      if (d.tenantsReg) this.tenantsReg = d.tenantsReg;
      this.forceUpdate();
      return true;
    };
    if (!apply()) {
      const t = setInterval(() => { if (apply()) clearInterval(t); }, 60);
      setTimeout(() => clearInterval(t), 20000);
    }
  }

  // контуры зданий на кропе генплана (% от изображения); генплан-литеры: 9=Л1, 10=Л2, 11=Л3, 12=Л4
  polys = {
    '3_2': [[20.9,12.43],[31.5,12.43],[31.5,19.72],[25.2,19.72],[25.2,20.15],[20.9,20.15]],
    '3_3': [[31.5,12.43],[41.7,12.43],[41.7,23.22],[37.6,23.22],[37.6,19.72],[31.5,19.72]],
    '3_1': [[20.9,20.15],[25.2,20.15],[25.2,35.44],[20.9,35.44]],
    '1_3': [[20.85,35.9],[25.3,35.9],[25.3,48.51],[20.85,48.51]],
    '1_2': [[20.85,48.51],[25.3,48.51],[25.3,51.66],[31.3,51.66],[31.3,58.8],[20.85,58.8]],
    '1_1': [[31.3,51.66],[37.8,51.66],[37.8,48.23],[42.1,48.23],[42.1,58.8],[31.3,58.8]],
    'k':   [[49,15.36],[52.8,15.36],[52.8,17],[54.4,17],[54.4,22.58],[52.8,22.58],[52.8,24.79],[49,24.79],[49,22.58],[47.2,22.58],[47.2,17],[49,17]],
    '2_3': [[59.3,48.3],[63.8,48.3],[63.8,51.66],[70.5,51.66],[70.5,58.73],[59.3,58.73]],
    '2_2': [[70.5,51.66],[76.4,51.66],[76.4,48.58],[80.6,48.58],[80.6,58.73],[70.5,58.73]],
    '2_1': [[76.4,35.94],[80.6,35.94],[80.6,48.58],[76.4,48.58]],
    // остановка справа от литера 12 (ген.)
    'stop4': [[91.0,23.01],[92.6,23.01],[92.6,25.29],[91.0,25.29]],
    '4_3': [[76.4,20.43],[80.7,20.43],[80.7,35.15],[76.4,35.15]],
    '4_2': [[70.6,12.36],[80.7,12.36],[80.7,20.43],[76.4,20.43],[76.4,19.79],[70.6,19.79]],
    '4_1': [[60.3,12.36],[70.6,12.36],[70.6,19.79],[64.2,19.79],[64.2,23.01],[59.8,23.01],[59.8,14.36],[60.3,14.36]],
    'wash': [[83.4,73.9],[86.9,73.9],[86.9,85.7],[83.4,85.7]],
    'top': [[79.5,8.57],[88.5,8.57],[88.5,11.07],[79.5,11.07]],
    'm910': [[42.1,53.08],[59.3,53.08],[59.3,58.8],[42.1,58.8]],
    'v': [[48.4,48.23],[52.9,48.23],[52.9,52.23],[48.4,52.23]],
  };

  names = {
    '1_1': 'Литер 1 · Подъезд 1 (ген. 9)', '1_2': 'Литер 1 · Подъезд 2 (ген. 9)', '1_3': 'Литер 1 · Подъезд 3 (ген. 9)',
    '2_1': 'Литер 2 · Подъезд 1 (ген. 10)', '2_2': 'Литер 2 · Подъезд 2 (ген. 10)', '2_3': 'Литер 2 · Подъезд 3 (ген. 10)',
    '3_1': 'Литер 3 · Подъезд 1 (ген. 11)', '3_2': 'Литер 3 · Подъезд 2 (ген. 11)', '3_3': 'Литер 3 · Подъезд 3 (ген. 11)',
    '4_1': 'Литер 4 · Подъезд 1 (ген. 12)', '4_2': 'Литер 4 · Подъезд 2 (ген. 12)', '4_3': 'Литер 4 · Подъезд 3 (ген. 12)',
    'stop4': 'Остановка №4', 'k': 'Строение Е', 'wash': 'Автомойка', 'top': 'Строение Ж', 'm910': 'Строение А', 'v': 'Строение В',
  };

  // Литер К — техпаспорт (Западный Обход 57, строение Е): два этажа
  bFloors = {
    k: { addr: 'ул. Западный Обход, 57, строение Е · ТП литера К', floors: [
      { label: '1 этаж', img: 'assets/k_floor1.png', ratio: 1912/1662,
        boxes: [ [{ poly: [[37.4,6],[82.6,6],[82.6,27.4],[99.4,27.4],[99.4,69.5],[82.6,69.5],[82.6,93],[37.4,93],[37.4,69.5],[10.5,69.5],[10.5,27.4],[37.4,27.4]] }, { l: 37.4, t: 26.5, w: 9.9, h: 6 }], null ],
        mop: [ { l: 28.2, t: 6.9, w: 9.2, h: 25.6 }, { l: 28.2, t: 65.6, w: 9.2, h: 27.4 } ] },
      { label: '2 этаж', img: 'assets/k_floor2.png', ratio: 1912/1662,
        boxes: [ null, [{ poly: [[36.1,6],[82.6,6],[82.6,27.4],[99.4,27.4],[99.4,69.5],[82.6,69.5],[82.6,93],[36.1,93],[36.1,69.5],[10.7,69.5],[10.7,27.4],[36.1,27.4]] }] ],
        mop: [ { l: 20.7, t: 4.8, w: 15.4, h: 24.7 }, { l: 20.7, t: 62.6, w: 15.4, h: 24.6 }, { l: 3.4, t: 24.1, w: 5.8, h: 42.7 } ] } ] },
    v: { addr: 'ТП литера В (между литерами 9 и 10)', floors: [
      { label: '1 этаж', img: 'assets/v_floor1.png', ratio: 690/565 } ] },
    top: { addr: 'ул. Западный Обход, 57, строение Ж · ТП литера 4а', floors: [
      { label: '1 этаж', img: 'assets/zh_floor1_v4.png', ratio: 1124/486,
        boxes: [ [{ poly: [[8.5,70.1],[44,71.4],[44,94.2],[8.5,93.6]] }], [{ poly: [[53.7,71.9],[86.8,73.3],[86.8,89.8],[92.5,90],[92.5,95.8],[53.7,94.5]] }], [{ poly: [[44.2,71.4],[53.1,71.8],[53.1,94.5],[44.2,94.2]] }] ],
        mop: [ { l: 3.2, t: 69.8, w: 5, h: 24.2 }, { l: 87, t: 73.5, w: 5.3, h: 16 }, { l: 92.9, t: 73.3, w: 3.9, h: 23.7 } ] },
      { label: 'б/н этаж', img: 'assets/a4_bn.png', ratio: 3140/800,
        boxes: [ null, null ],
        mop: [ { l: 0.5, t: 4.4, w: 4.9, h: 45 }, { l: 91.4, t: 6.9, w: 5.1, h: 45 } ] } ] },
    m910: { addr: 'ТП литера А (между литерами 9 и 10)', floors: [
      { label: '1 этаж', img: 'assets/a_floor1.png', ratio: 1350/395 } ] },
  };

  utilJk = 's2';

  residentsCapacity = 5540;

  select(id) { this.setState({ selected: id, summaryFilter: null, planZoom: false, floorIdx: 0, hoveredUnitIdx: null, zoomHoverIdx: null }); }

  closePanel() { this.setState({ selected: null, hoveredUnitIdx: null, zoomHoverIdx: null }); }

  unitFields(key) {
    const list = this.units[key] || [];
    if (!list.length) return { noCommercial: true, commercial: null, unitsLabel: '', units: '', statuses: [] };
    const isZu = String(key).startsWith('zu') || String(key).startsWith('stop');
    const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
    const counts = {};
    for (const u of list) { const s = this.unitStatus(key, u); counts[s] = (counts[s] || 0) + 1; }
    return { noCommercial: false, commercial: list.length,
      commercialLabel: isZu ? 'Мест в аренду' : 'Коммерческих помещений',
      unitsLabel: area > 0 ? 'Площадь коммерческих помещений' : '', units: area > 0 ? this.fmtArea(area) : '',
      statuses: Object.keys(counts).map(s => `${s}: ${counts[s]}`) };
  }

  renderVals() {
    if (window.OMKpAddr) window.OMKpAddr.apply(this, 's2');
    if (window.OMVolumes) this._volInfo = window.OMVolumes.fill(this);
    const vals = {};
    const fmtArea = (n) => this.fmtArea(n);
    const accent = '#2b2a27';
    const theme = this.props.theme || 'light';
    const themes = {
      light: { pageBg: '#f4f2ee', cardBg: '#fffdf9', border: '#ddd8cd', text: '#2b2a27', muted: '#6b6a64', imgCardBg: '#fff', statusNeutralBg: '#f7f5f0', statusGreenBg: '#eef6ee', statusOrangeBg: '#fbf3e6' },
      dark: { pageBg: '#1c1b18', cardBg: '#28261f', border: '#463f31', text: '#f0ece2', muted: '#a89f8f', imgCardBg: '#211f1a', statusNeutralBg: '#332f26', statusGreenBg: '#1f3324', statusOrangeBg: '#3a2c17' },
    };
    const th = themes[theme] || themes.light;
    vals.pageBg = th.pageBg; vals.cardBg = th.cardBg; vals.borderColor = th.border; vals.textColor = th.text;
    vals.mutedColor = th.muted; vals.imgCardBg = th.imgCardBg; vals.statusNeutralBg = th.statusNeutralBg;
    vals.statusGreenBg = th.statusGreenBg; vals.statusOrangeBg = th.statusOrangeBg;
    vals.statusRedBg = theme === 'dark' ? '#3a2420' : '#faf0ee';
    vals.statusNeutralBorder = '#c3bdb0';
    vals.accent = accent;

    vals.leave = () => this.leaveAll();
    vals.showActive = !!this.state.showActive;
    vals.activeBtnBg = this.state.showActive ? '#a3312b' : 'transparent';
    vals.activeBtnFg = this.state.showActive ? '#ffffff' : '#a3312b';
    vals.activeBtnLabel = this.state.showActive ? 'Скрыть актив' : 'Показать актив';
    vals.toggleActive = () => this.setState((s) => ({ showActive: !s.showActive }));
    vals.activeMarks = this.buildActiveMarks();
    vals.storefronts = this._storefronts || [];
    // сноска по цветам витрин: только категории, встречающиеся в этом ЖК
    {
      const agg = {};
      for (const sf of (vals.storefronts || [])) {
        if (!agg[sf.cat]) agg[sf.cat] = { name: sf.cat, c: sf.c, n: 0 };
        agg[sf.cat].n++;
      }
      const list = Object.keys(agg).map((k2) => agg[k2]);
      list.sort((a, b) => (a.name === 'Свободно' ? 1 : b.name === 'Свободно' ? -1 : b.n - a.n));
      vals.sfLegend = list;
    }
    vals.activeTip = this.state.activeTip || null;
    vals.buildingPolys = Object.keys(this.polys).map((k) => {
      const hov = this.state.hovered === k || this.state.selected === k;
      return { id: k, points: this.polys[k].map(p => p.join(',')).join(' '),
        fill: (k === 'wash' || k === 'top') ? 'rgba(148,147,153,0.92)' : 'transparent',
        stroke: hov ? '#a3312b' : 'transparent',
        onEnter: () => this.enter(k), onClick: () => this.select(k) };
    });

    if (this.state.hovered && this.polys[this.state.hovered]) {
      const key = this.state.hovered;
      const poly = this.polys[key];
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs);
      const by0 = Math.min(...ys);
      const TIP_W = 26, TIP_H = 24;
      let left, transform;
      if (bx1 + 1.5 + TIP_W <= 99) { left = (bx1 + 1.5) + '%'; transform = 'none'; }
      else { left = (bx0 - 1.5) + '%'; transform = 'translateX(-100%)'; }
      const top = Math.max(1, Math.min(by0, 99 - TIP_H)) + '%';
      vals.activeInfo = { name: this.names[key], left, top, transform, rnv: this.rnv[key], ...this.unitFields(key) };
    } else {
      vals.activeInfo = null;
    }

    vals.closePanel = () => this.closePanel();
    if (this.state.selected) {
      const id = this.state.selected;
      const regFor = (u) => { const t = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit); return t ? { ...t, hasBrand: !!t.brand && t.brand !== '—' } : null; };
      const list = (this.units[id] || []).map((u, idx) => ({ ...u,
        status: this.unitStatus(id, u),
        liqColor: this.liqColors[u.liq] || 'transparent',
        strike: u.status === 'Продано' ? 'line-through' : 'none',
        notSold: u.status !== 'Продано',
        role: u.role || 'Владелец',
        companyOrDash: u.company || 'не указано',
        marketPrice: u.marketPrice || u.price || 'не указана',
        fias: this.fiasOf(id, u), cadastre: this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных', fias: this.fiasOf(id, u),
        cardBg: /Продано/i.test(u.status || '') ? '#1b1916' : (this.liqColors[u.liq] || 'transparent'),
        fg: /Продано/i.test(u.status || '') ? '#f2ede4' : vals.textColor,
        fgMuted: /Продано/i.test(u.status || '') ? '#a9a196' : vals.mutedColor,
        cornerFg: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        cardPad: /Продано/i.test(u.status || '') ? '7px 10px' : '10px 12px',
        cardAlign: /Продано/i.test(u.status || '') ? 'start' : 'stretch',
        chipMargin: /Продано/i.test(u.status || '') ? '4px 0 5px' : '6px 0 8px',
        rowGap: /Продано/i.test(u.status || '') ? '1px' : '3px',
        rowFont: /Продано/i.test(u.status || '') ? '11px' : '11.5px',
        rowLine: /Продано/i.test(u.status || '') ? '14px' : '16px',
        sale: this.saleOf(id, u),
        // категория торговой точки арендатора — кружок в углу карточки (traffic.js)
        ttChipCat: (() => {
          if (/Продано/i.test(u.status || '')) return null;
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          if (!r) return null;
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.name) || 'Прочее';
        })(),
        ttChipBg: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '1f';
        })(),
        ttChipBd: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '59';
        })(),
        ttChipColor: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.c) || '#4b2e83';
        })(),
        // данные сделки показываем в каждой проданной карточке: нет записи — «нет данных»
        saleDate: (this.saleOf(id, u) || {}).date || 'нет данных',
        saleFact: (this.saleOf(id, u) || {}).fact || 'нет данных',
        saleAgent: (this.saleOf(id, u) || {}).agent || 'нет данных',
        saleBuyer: (this.saleOf(id, u) || {}).buyer || 'нет данных',
        corner: (this.actualPrice(id, u) || {}).value || (/Продано/i.test(u.status || '') ? 'нет данных' : ''),
        rentMarket: (this.actualPrice(id, u) || /Продано/i.test(u.status || '') || /^(nto|zu|stop)/.test(String(id))) ? '' : String(this.marketRentStr() || '').split(':').pop().trim(),
        cornerTitle: this.actualPrice(id, u) ? 'Актуальная цена помещения' : 'Актуальная на текущий год рыночная ставка аренды',
        cornerCaption: /Продано/i.test(u.status || '') ? 'Актуальная цена' : '',
        marketPrice: (this.actualPrice(id, u) || {}).value || u.marketPrice || u.price || 'не указана',
        marketLabel: this.actualPrice(id, u) ? 'Актуальная цена' : 'Рыночная цена',
        marketTitle: (this.actualPrice(id, u) || {}).basis || u.marketPrice || u.price || '',
        idleOnChange: this.idleOnChange(id, u),
        pastRows: this.pastTenants[id + '|' + String(u.number).split(',')[0].trim()] || [{ tenant: '—', rate: '—', period: '—' }],
        saleGrowth: this.saleGrowth(id, u),
        cadLabel: u.status === 'Продано' ? 'Наименование актуальной т.т.' : 'Кадастровый №',
        cadValue: u.status === 'Продано'
          ? (this.soldTt[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных')
          : (this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных'),
        sold: u.status === 'Продано',
        // категорию проданной точки берём из её названия единой функцией traffic.js
        ttCat: (() => {
          if (u.status !== 'Продано') return '—';
          const nm = this.soldTt[id + '|' + String(u.number).split(',')[0].trim()];
          if (!nm) return 'нет данных';
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf({ brand: nm }) : null;
          return (c && c.name) || 'нет данных';
        })(),
        price: u.priceLabel ? u.price : '',
        priceLabel: u.priceLabel || 'Цена по прайсу',
        mgmtCo: u.mgmtCo || 'нет данных',
        mgmtRate: u.mgmtCo === 'без управления' ? '—' : (u.mgmtRate || '—'),
        mgmtActive: u.mgmtActive || (u.mgmtCo ? 'активен' : 'не активен'),
        mgmtPaid: u.mgmtPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.mgmtAccrued(id, u)),
        mgmtDiscount: u.mgmtDiscount || '—',
        rentDiscount: u.rentDiscount || '—',
        rentPaid: u.rentPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.rentAccrued(id, u)),
        rentDebt: u.rentDebt || '—',
        mgmtDebt: u.mgmtDebt || '—', penalties: u.penalties || '—',
        turnoverMonths: Array.from({ length: 12 }, (_, i) => { const m = i + 1; const active = (this.state.turnoverMonth || 1) === m;
          return { m, onClick: () => this.setState({ turnoverMonth: m }), bg: active ? accent : 'rgba(0,0,0,0.06)', fg: active ? '#fff' : vals.textColor, fw: active ? 700 : 400 }; }),
        turnoverValue: (u.turnover && u.turnover[this.state.turnoverMonth || 1]) || 'нет данных',
        mgmtNote: u.mgmtNote === undefined ? 'в выгрузке КП нет данных об управлении и долгах' : u.mgmtNote,
        bti: u.btiN || null,
        btiOrDash: u.btiN || 'не указаны',
        insurance: u.insurance || 'нет',
        cxUtil: this.cxUtilOf(id, u) || '—', cxUtilC: this.cxColor(this.cxUtilOf(id, u)),
        utilOpen: !!(this.state.utilOpen || {})[id + '|' + idx], utilChevron: (this.state.utilOpen || {})[id + '|' + idx] ? 'rotate(180deg)' : 'rotate(0deg)',
        toggleUtil: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = id + '|' + idx; this.setState(s => ({ utilOpen: { ...(s.utilOpen || {}), [k]: !(s.utilOpen || {})[k] } })); },
        ukLabel: (this.literUk && this.literUk[String(id).split('_')[0]]) || 'УК МКД',
        ...this.secVals(id, idx),
        cxUtilMkd: u.cxUtilMkd || this.costStr('uk', id, u), cxUtilElec: this.utilStr('e', id, u), cxUtilWater: this.utilStr('w', id, u), cxUtilHeat: this.utilStr('h', id, u),
        cxSecurity: u.cxSecurity || '—', cxSecurityC: this.cxColor(u.cxSecurity),
        cxCleaning: u.cxCleaning || '—', cxCleaningC: this.cxColor(u.cxCleaning),
        cxTO: u.cxTO || '—', cxTOC: this.cxColor(u.cxTO),
        cxAdmin: this.cxAdminOf(id, u), cxAdminC: this.cxColor(this.cxAdminOf(id, u)),
        cxTaxes: this.cxTaxesOf(id, u), cxTaxesC: this.cxColor(this.cxTaxesOf(id, u)),
        cxInsurance: u.cxInsurance || '—', cxInsuranceC: this.cxColor(u.cxInsurance),
        cxTotal: this.cxTotalOf(id, u),
        opStart: this.startInvest(u), opRepair: this.opRepairOf(u, id), opAnchor: u.opAnchor || '—', opLoss: u.opLoss || '—',
        opTotal: this.sumRub(this.opUnit(u, id), ['opStart', 'opRepair', 'opAnchor', 'opLoss']),
        effNoi: u.effNoi || this.noiOf(id, u, this.cxTotalOf(id, u)), effPayback: u.effPayback || this.paybackOf(id, u), effRoi: u.effRoi || this.roiOf(id, u), effCapRate: u.effCapRate || this.capRateOf(id, u), effPriceDyn: u.effPriceDyn || '—', effPriceDynC: this.growthColor(u.effPriceDyn), effFull: this.fullYieldOf(id, u), effFullC: this.growthColor(this.fullYieldOf(id, u)), effFullTitle: this.fullYieldTitle(id, u),
        effFair: this.fairValueOf(id, u), effFairTitle: this.fairValueTitle(id, u),
        fairColor: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        fairBorder: /Продано/i.test(u.status || '') ? 'rgba(224,147,141,0.35)' : 'rgba(163,49,43,0.22)',
        effCap: u.effCap || '14%', effSpread: u.effSpread || this.spreadOf(id, u), effSpreadC: this.growthColor(u.effSpread || this.spreadOf(id, u)), effOpexBack: u.effOpexBack || this.opexBackOf(id, u), effGrowth: u.effGrowth || this.assetGrowth(id, u), effGrowthYear: this.assetGrowthYear(id, u), effGrowthC: this.growthColor(this.assetGrowth(id, u)),
        ...this.chip(this.unitStatus(id, u)), ...this.donutsOf(id, u),
        ...this.regRow(id, u) }));
      const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
      const bCfg = this.bFloors[id] || null;
      const fi = this.state.floorIdx || 0;
      const fp = bCfg ? bCfg.floors[fi] : (this.floorPlans[id] || null);
      const rects = bCfg ? (fp.boxes || null) : (this.planBoxes[id] || null);
      const hoveredIdx = this.state.hoveredUnitIdx;
      const bboxOf = (b) => b.poly ? (() => { const xs = b.poly.map(p => p[0]), ys = b.poly.map(p => p[1]); const l = Math.min(...xs), t = Math.min(...ys); return { l, t, w: Math.max(...xs) - l, h: Math.max(...ys) - t }; })() : b;
      const ptsOf = (b) => b.poly ? b.poly.map(p => p.join(',')).join(' ') : `${b.l},${b.t} ${b.l + b.w},${b.t} ${b.l + b.w},${b.t + b.h} ${b.l},${b.t + b.h}`;
      const centers = rects ? rects.map(grp => { if (!grp) return null; const bb = bboxOf(grp[0]); return { left: (bb.l + bb.w / 2) + '%', top: (bb.t + bb.h / 2) + '%' }; }) : null;
      const highlightBoxes = centers ? centers.map((c, idx) => c ? { ...c, opacity: hoveredIdx === idx ? 1 : 0 } : { left: '0%', top: '0%', opacity: 0 }) : null;
      const outlineOf = (idx) => (rects && idx != null && rects[idx]) ? rects[idx].map(b => ({ points: ptsOf(b) })) : null;
      vals.hoverOutline = outlineOf(hoveredIdx);
      vals.mopShapes = (bCfg ? (fp.mop || []) : (this.planMop[id] || [])).map(b => ({ points: ptsOf(b) }));
      vals.planFloorTabs = bCfg ? bCfg.floors.map((f, i) => ({ label: f.label,
        border: i === fi ? '#a3312b' : '#c3bdb0', bg: i === fi ? '#a3312b' : 'transparent', color: i === fi ? '#fffdf9' : '#948f83',
        onClick: () => this.setState({ floorIdx: i, zoomHoverIdx: null }) })) : null;
      {
        // порядок карточек зафиксирован: в аренде → в простое → не введено → продано
        list.forEach((x, i) => { if (x._i === undefined) x._i = i; });
        list.sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
        const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
        // непроданные — одной строкой, проданные — по две в ряд с новой строки
        list.forEach((x, i) => {
          const sold = /Продано/i.test(String(x.status || ''));
          x.colStart = (fs >= 0 && i === fs) ? '1' : 'auto';
          x.rowBreak = fs >= 0 && i === fs;
          x.cardFlex = '0 0 300px';
        });
      }
      vals.selectedInfo = { name: this.names[id], rnv: this.rnv[id], commercial: list.length, units: area > 0 ? fmtArea(area) : null,
        statusChips: (() => {
          const m = {};
          for (const u of (this.units[id] || [])) { const s = this.unitStatus(id, u); if (!m[s]) m[s] = { n: 0, a: 0 }; m[s].n++; const n = parseFloat(String(u.area).replace(',', '.')); if (isFinite(n)) m[s].a += n; }
          return Object.keys(m).map(s => { const c = this.chip(s); return { label: s, count: m[s].n, area: m[s].a.toFixed(1).replace('.', ',') + ' м²', bg: c.chipBg, fg: c.chipFg, bd: c.chipBd }; });
        })(),
        commercialLabel: (String(id).startsWith('zu') || String(id).startsWith('stop')) ? 'Мест в аренду' : 'Коммерческих помещений',
        addr: ((this.literAddr && this.literAddr[String(id).split('_')[0]]) || (bCfg ? bCfg.addr : null)),
        uk: (this.literUk && this.literUk[String(id).split('_')[0]]) || null, tenants: (() => { const r = (this.tenantsReg[id] || []).filter(t => !t.unit); return r.length ? r : null; })(),
        planLabel: bCfg ? 'Поэтажный план' : 'Поэтажный план · 1 этаж (подъезд)',
        planNote: bCfg ? 'Планы из техпаспорта. Кликните по плану, чтобы увеличить' : 'Серым выделены места общего пользования (МОП): лестницы, лифты, коридоры. Наведите на карточку помещения — его контур подсветится на плане',
        unitsList: list.map((u, i, arr) => ({ ...u,
          rowBreak: arr.findIndex((x) => /Продано/i.test(String(x.status || ''))) === i,
          cardFlex: '0 0 300px',
          onEnter: () => { const tf = bCfg ? bCfg.floors.findIndex(f => f.boxes && f.boxes[i]) : -1; this.setState(tf >= 0 && tf !== fi ? { hoveredUnitIdx: i, floorIdx: tf } : { hoveredUnitIdx: i }); }, onLeave: () => this.setState({ hoveredUnitIdx: null }) })),
        planImg: fp ? fp.img : null, planAspect: fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null, highlightBoxes };
      if (vals.selectedInfo) {
        const un = (vals.selectedInfo.unitsList || []);
        vals.selectedInfo.unitsUnsold = un.filter((u) => !/Продано/i.test(String(u.status || '')));
        const so = un.filter((u) => /Продано/i.test(String(u.status || '')));
        vals.selectedInfo.unitsSold = so.length ? so : null;
      }
      vals.openPlanZoom = () => this.setState({ planZoom: true });
      this.cardsScrollVals(vals);
      vals.planZoomImg = (this.state.planZoom && fp) ? fp.img : null;
      vals.stopProp = (e) => e.stopPropagation();
      {
        const zi = this.state.zoomHoverIdx;
        const zoomUnits = this.units[id] || [];
        vals.zoomHoverZones = rects ? rects.map((grp, idx) => { if (!grp) return { left: '0%', top: '0%', w: '0%', h: '0%' }; const bb = bboxOf(grp[0]); return {
          left: bb.l + '%', top: bb.t + '%', w: bb.w + '%', h: bb.h + '%',
          onHover: () => this.setState({ zoomHoverIdx: idx }), onUnhover: () => this.setState({ zoomHoverIdx: null }) }; }) : null;
        vals.zoomPins = centers ? centers.map((c, idx) => ({ ...c, opacity: zi === idx ? 1 : 0 })) : null;
        vals.zoomOutline = outlineOf(zi);
        if (zi != null && rects && rects[zi] && zoomUnits[zi]) {
          const bb = bboxOf(rects[zi][0]);
          const above = bb.t > 18;
          vals.zoomTooltip = { ...zoomUnits[zi], status: this.unitStatus(id, zoomUnits[zi]), left: (bb.l + bb.w / 2) + '%',
            top: (bb.t + bb.h / 2) + '%',
            tf: 'translate(-50%, -50%)', mt: '0px' };
        } else { vals.zoomTooltip = null; }
      }
      vals.planZoomAspect = fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null;
      vals.planZoomW = fp ? `min(92vw, calc(88vh * ${fp.ratio.toFixed(4)}))` : '92vw';
    } else {
      vals.selectedInfo = null;
      vals.planZoomImg = null;
    }
    vals.closePlanZoom = () => this.setState({ planZoom: false, zoomHoverIdx: null });

    // карта трафика
    vals.trafficVisible = !!this.state.trafficOverlay;
    vals.trafficPanelVisible = !!this.state.trafficData;
    vals.trafficHidePanel = () => this.setState({ trafficData: false });
    vals.trafficOverlayBg = this.state.trafficOverlay ? '#a3312b' : 'transparent';
    vals.trafficOverlayFg = this.state.trafficOverlay ? '#ffffff' : '#a3312b';
    vals.trafficDataBg = this.state.trafficData ? '#a3312b' : 'transparent';
    vals.trafficDataFg = this.state.trafficData ? '#ffffff' : '#a3312b';
    vals.toggleTrafficOverlay = () => this.setState((s) => ({ trafficOverlay: !s.trafficOverlay }));
    vals.toggleTrafficData = () => this.setState((s) => ({ trafficData: !s.trafficData }));
    {
      const tr = (window.OMTraffic && (this.state.trafficOverlay || this.state.trafficData)) ? window.OMTraffic.build(this, vals) : null;
      vals.trafficMarks = tr ? tr.marks : [];
      vals.trafficLines = tr ? tr.lines : [];
      vals.trafficMagnets = tr ? tr.magnets : [];
      vals.trafficVacancies = tr ? tr.vacancies : [];
      vals.trafficStats = tr ? tr.stats : [];
      vals.trafficNote = tr ? tr.note : '';
    }

    vals.toggleSummary = () => this.toggleSummary();
    vals.enterSummary = () => this.setState({ summaryHovered: true });
    vals.leaveSummary = () => this.setState({ summaryHovered: false });
    vals.summaryVisible = this.state.summaryHovered || this.state.summaryPinned;

    {
      let totalCount = 0, totalArea = 0, soldCount = 0, soldArea = 0, soldSum = 0,
        dvkCount = 0, dvkArea = 0, leasedCount = 0, leasedArea = 0, rentedCount = 0, rentedArea = 0;
      for (const key in this.units) {
        for (const u of this.units[key]) {
          const area = parseFloat(u.area.replace(',', '.'));
          const price = parseFloat((u.price || '').replace(/[^\d]/g, '')) || 0;
          totalCount++; totalArea += area;
          if (u.status === 'Продано') { soldCount++; soldArea += area; soldSum += price; }
          else if (this.isLeasedStatus(u.status) && this.isFund(u)) { dvkCount++; dvkArea += area; }
          else if (this.isLeasedStatus(u.status)) { leasedCount++; leasedArea += area; }
          else if (this.isVacantStatus(u.status)) { rentedCount++; rentedArea += area; }
        }
      }
      vals.totalCount = totalCount; vals.totalArea = fmtArea(totalArea);
      vals.soldCount = soldCount; vals.soldArea = fmtArea(soldArea);
      vals.soldSum = Math.round(soldSum).toLocaleString('ru-RU') + ' ₽';
      vals.soldAvgSqm = soldArea ? Math.round(soldSum / soldArea).toLocaleString('ru-RU') + ' ₽/м²' : '—';
      vals.dvkCount = dvkCount; vals.dvkArea = fmtArea(dvkArea);
      vals.leasedCount = leasedCount; vals.leasedArea = fmtArea(leasedArea);
      vals.rentedCount = rentedCount; vals.rentedArea = fmtArea(rentedArea);
      vals.soldSharePct = totalArea ? Math.round((soldArea / totalArea) * 100) + '%' : '—';
      vals.rentedSharePct = totalArea ? Math.round((rentedArea / totalArea) * 100) + '%' : '—';

      const m = {};
      for (const key in this.units) for (const u of this.units[key]) {
        if (!this.isVacantStatus(u.status)) continue;
        if (!m[u.liq]) m[u.liq] = { count: 0, area: 0 };
        m[u.liq].count++; m[u.liq].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.liqRented = Object.keys(m).map(l => `${l}: ${m[l].count} (${fmtArea(m[l].area)})`);
    }

    vals.problemsVisible = this.state.problemsVisible;
    vals.toggleProblems = () => this.setState(s => ({ problemsVisible: !s.problemsVisible }));
    vals.efficiencyVisible = this.state.efficiencyVisible;
    vals.toggleEfficiency = () => this.setState(s => ({ efficiencyVisible: !s.efficiencyVisible }));
    this.occupancyVals(vals);

    {
      const vacant = [];
      for (const key in this.units) for (const u of this.units[key]) {
        if (this.isVacantStatus(u.status)) vacant.push(`${this.names[key]} №${u.number} (${u.area}) — ${u.status}`);
      }
      vals.vacantColor = vacant.length ? '#a3312b' : '#3a7a42';
      vals.vacantText = vacant.length ? `Нарушение: ${vacant.length} пустующих помещений` : 'Нарушение отсутствует — пустующих помещений нет';
      vals.vacantList = vacant;

      const vacUnits = [];
      for (const key in this.units) for (const u of this.units[key]) {
        if (this.isVacantStatus(u.status)) vacUnits.push({ number: u.number, area: u.area, location: this.names[key], areaNum: parseFloat(u.area.replace(',', '.')) });
      }
      vacUnits.sort((a, b) => b.areaNum - a.areaNum);
      vals.topRented = vacUnits.slice(0, 5);

      const catOf = (company) => {
        if (/ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(company)) return 'Владельцы (фонды, ПИФ, физлица)';
        if (/^ИП /.test(company)) return 'ИП';
        return 'Компании';
      };
      const cats = {};
      for (const key in this.units) for (const u of this.units[key]) {
        if (!u.company) continue;
        const cat = catOf(u.company);
        if (!cats[cat]) cats[cat] = { count: 0, area: 0 };
        cats[cat].count++; cats[cat].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.tenantCategories = Object.keys(cats).map(c => `${c}: ${cats[c].count} (${this.fmtArea(cats[c].area)})`);
    }

    vals.openTotal = () => this.openSummaryFilter('total', 'Все коммерческие помещения');
    vals.openSold = () => this.openSummaryFilter('sold', 'Проданные помещения');
    vals.openDvk = () => this.openSummaryFilter('dvk', 'Передано в ДВК (личные фонды)');
    vals.openLeased = () => this.openSummaryFilter('leased', 'Сдано в аренду');
    vals.openRented = () => this.openSummaryFilter('vacant', 'Вакантные / в простое');
    vals.closeSummaryFilter = () => this.setState({ summaryFilter: null, summaryPinned: true });
    if (this.state.summaryFilter) {
      const key = this.state.summaryFilter.key;
      const pred = key === 'total' ? (() => true)
        : key === 'sold' ? (u => u.status === 'Продано')
        : key === 'dvk' ? (u => this.isLeasedStatus(u.status) && this.isFund(u))
        : key === 'leased' ? (u => this.isLeasedStatus(u.status) && !this.isFund(u))
        : (u => this.isVacantStatus(u.status));
      const list = [];
      for (const bkey in this.units) for (const u of this.units[bkey]) {
        if (pred(u)) list.push({ ...u, location: this.names[bkey],
          status: this.unitStatus(bkey, u),
          liqColor: this.liqColors[u.liq] || 'transparent',
          strike: u.status === 'Продано' ? 'line-through' : 'none',
          role: this.isFund(u) ? 'Владелец' : (this.isLeasedStatus(u.status) ? 'Арендатор' : 'Правообладатель') });
      }
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list };
    } else {
      vals.summaryFilterInfo = null;
    }

    this.summaryExtra(vals);
    return vals;
  }

  planColors = ['#c0392b','#2471a3','#1e8449','#b7770d','#8e44ad','#0e8686','#7b4a12','#5d6d7e','#a3312b','#2e4053'];

  // указатели «актива» — по одному на непроданное помещение, со стороны входа
  buildActiveMarks() {
    if (!this.state.showActive) return [];
    const PAL = {
      red: { c: '#a3312b', lite: '#c4645e', dark: '#7d2521', glow: 'rgba(163, 49, 43, 0.7)' },
      green: { c: '#3a7a42', lite: '#6aa370', dark: '#27562d', glow: 'rgba(58, 122, 66, 0.7)' },
      black: { c: '#2e2a24', lite: '#5c564d', dark: '#141210', glow: 'rgba(46, 42, 36, 0.6)' },
    };
    const ROT = { left: '0deg', right: '180deg', top: '90deg', bottom: '270deg' };
    const out = [];
    this._storefronts = [];
    for (const k of Object.keys(this.polys)) {
      const all = this.units[k] || [];
      const poly = this.polys[k];
      if (!all.length || !poly) continue;
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
      const boxes = this.planBoxes[k];
      const rows = [];
      all.forEach((u, gi) => {
        if (u.status === 'Продано') return;
        const shp = boxes && boxes[gi] && boxes[gi][0];
        let cx = null, cy = null, bb = null;
        if (shp) {
          if (shp.poly) {
            const px = shp.poly.map(p => p[0]), py = shp.poly.map(p => p[1]);
            bb = { x0: Math.min(...px), x1: Math.max(...px), y0: Math.min(...py), y1: Math.max(...py) };
          } else { bb = { x0: shp.l, x1: shp.l + shp.w, y0: shp.t, y1: shp.t + shp.h }; }
          cx = (bb.x0 + bb.x1) / 2; cy = (bb.y0 + bb.y1) / 2;
        }
        rows.push({ u, gi, cx, cy, bb });
      });
      rows.forEach((r, i) => { if (r.cy == null) { r.cx = 50; r.cy = (i + 0.5) / rows.length * 100; } });
      const buckets = { left: [], right: [], top: [], bottom: [] };
      const forced = this.entrySide[k];
      rows.forEach((r) => {
        const num = String(r.u.number).split(',')[0].trim();
        const own = this.entrySide[k + '#' + num] || forced;
        if (own) { buckets[own].push(r); return; }
        const d = { left: r.cx, right: 100 - r.cx, top: r.cy, bottom: 100 - r.cy };
        let side = 'left';
        for (const s of ['right', 'top', 'bottom']) if (d[s] < d[side]) side = s;
        buckets[side].push(r);
      });
      const rnvD = this.rnv[k] ? (() => { const p = String(this.rnv[k]).split('.').map(Number); return new Date(p[2], p[1] - 1, p[0]); })() : null;
      const building = rnvD && rnvD > new Date();
      for (const side of ['left', 'right', 'top', 'bottom']) {
        const arr = buckets[side];
        if (!arr.length) continue;
        const vertical = side === 'left' || side === 'right';
        arr.sort((a, b) => (vertical ? a.cy - b.cy : a.cx - b.cx));
        let prev = -99;
        arr.forEach((r) => {
          let along = vertical ? by0 + r.cy / 100 * (by1 - by0) : bx0 + r.cx / 100 * (bx1 - bx0);
          const gap = vertical ? 2.1 : 2.6;
          if (along - prev < gap) along = prev + gap;
          prev = along;
          const num = String(r.u.number).split(',')[0].trim();
          const nd = this.entryNudge[k + '#' + num] || this.entryNudge[k] || [0, 0];
          const x = (side === 'left' ? bx0 - 1.5 : side === 'right' ? bx1 + 1.5 : along) + nd[0];
          const y = (side === 'top' ? by0 - 2.6 : side === 'bottom' ? by1 + 2.6 : along) + nd[1];
          const st = this.unitStatus(k, r.u);
          const pal = (building || /Не введено/i.test(st)) ? PAL.black : /аренде/i.test(st) ? PAL.green : PAL.red;
          const tipR = (this.tenantsReg[k] || []).find(t => t.unit && String(r.u.number).split(',')[0].trim() === t.unit) || null;
          const tipRate = (tipR && this.ratePick) ? (this.ratePick(tipR) || {}).rate : null;
          const tipName = tipR ? ((tipR.brand && tipR.brand !== '—') ? tipR.brand : tipR.tenant) : null;
          const tip = 'Пом. ' + String(r.u.number).split(',')[0].trim() + ' · ' + (r.u.area || '')
            + (tipName ? ' · ' + tipName : ' · нет арендатора')
            + ' · ставка: ' + (tipRate || 'нет данных') + ' · ' + st;
          // витрина окрашена по категории арендатора (traffic.js), пустая — чёрным
          const sfCat = (tipR && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(tipR) : null;
          const sfColor = tipR ? ((sfCat && sfCat.c) || '#4b2e83') : '#a3312b';
          const sfTip = tip + (sfCat ? ' · категория: ' + sfCat.name : '');
          out.push({ pe: 'auto', tip, onTip: () => this.setState({ activeTip: { text: tip, left: x + '%', top: y + '%' } }), offTip: () => this.setState({ activeTip: null }), key: k + '_' + r.gi, left: x + '%', top: y + '%', rot: 'rotate(' + ROT[side] + ')',
            c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
          // витрина: протяжённость помещения вдоль фасада берём из поэтажного плана
          // (контур помещения в % кропа) и проецируем на соответствующее ребро подъезда
          if (r.bb) {
            const to = (v) => (vertical ? by0 + v / 100 * (by1 - by0) : bx0 + v / 100 * (bx1 - bx0));
            let a0 = to(vertical ? r.bb.y0 : r.bb.x0), a1 = to(vertical ? r.bb.y1 : r.bb.x1);
            const minLen = (vertical ? (by1 - by0) : (bx1 - bx0)) * 0.12;
            if (a1 - a0 < minLen) { const mid = (a0 + a1) / 2; a0 = mid - minLen / 2; a1 = mid + minLen / 2; }
            a0 = Math.max(vertical ? by0 : bx0, a0); a1 = Math.min(vertical ? by1 : bx1, a1);
            const ins = 0.3;
            const fx = side === 'left' ? bx0 + ins : bx1 - ins;
            const fy = side === 'top' ? by0 + ins : by1 - ins;
            const toX = (v) => bx0 + v / 100 * (bx1 - bx0);
            const toY = (v) => by0 + v / 100 * (by1 - by0);
            // угловое помещение выходит на две наружные стены — витрину рисуем углом
            const dd = { left: r.bb.x0, right: 100 - r.bb.x1, top: r.bb.y0, bottom: 100 - r.bb.y1 };
            const perp = vertical ? ['top', 'bottom'] : ['left', 'right'];
            const sec = perp.reduce((a, b) => (dd[b] < dd[a] ? b : a));
            const corner = null; // углы витрин отключены — ищем более аккуратную геометрию
            const f2 = (a, b) => a.toFixed(2) + ',' + b.toFixed(2);
            const sfPoints = (() => {
              if (!corner) return vertical ? (f2(fx, a0) + ' ' + f2(fx, a1)) : (f2(a0, fy) + ' ' + f2(a1, fy));
              const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
              if (vertical) {
                const cy = corner === 'top' ? by0 + ins : by1 - ins;
                const far = cl(side === 'left' ? toX(r.bb.x1) : toX(r.bb.x0), bx0 + ins, bx1 - ins);
                return f2(fx, corner === 'top' ? a1 : a0) + ' ' + f2(fx, cy) + ' ' + f2(far, cy);
              }
              const cx2 = corner === 'left' ? bx0 + ins : bx1 - ins;
              const far = cl(side === 'top' ? toY(r.bb.y1) : toY(r.bb.y0), by0 + ins, by1 - ins);
              return f2(corner === 'left' ? a1 : a0, fy) + ' ' + f2(cx2, fy) + ' ' + f2(cx2, far);
            })();
            this._storefronts.push({ tip: sfTip,
                onTip: () => this.setState({ activeTip: { text: sfTip,
                  left: (vertical ? fx : (a0 + a1) / 2) + '%', top: (vertical ? (a0 + a1) / 2 : fy) + '%' } }),
                offTip: () => this.setState({ activeTip: null }),
                key: 'sf_' + k + '_' + r.gi, c: sfColor,
                cat: tipR ? ((sfCat && sfCat.name) || 'Прочее') : 'Свободно',
              points: sfPoints });
          }
        });
      }
    }
    return out;
  }
  };
};

window.OMJKLogic[3] = function (DCLogic) {
  return class JK extends window.GenplanCore(DCLogic) {
  componentDidMount() {
    const apply = () => {
      const d = window.__SM_DATA_3, p = window.__SM_PLANS_3;
      if (!d || !p || !window.OMPriceNet) return false;
      this.units = d.units;
      // рыночная цена помещений — цена нетто из реестра рекомендуемых цен (август 2026)
      if (window.OMPriceNet) window.OMPriceNet.apply(3, this.units);
      // ОСК бульвара (№16220 / №16218) — цены нетто по реестру «Бульвар Самолет» (09.09.2026)
      window.OMPriceNet.applyB(3, this.bFloors);
      // прайсовые ставки аренды ОСК — «Расчёт ставок аренды Бульвар Самолет» (09.09.2026)
      if (window.OMRentPrice) window.OMRentPrice.apply(3, this.bFloors);
      this.rnv = d.rnv;
      if (window.OMSales && window.OMSales[3]) this.sales = window.OMSales[3];
      if (d.tenantsReg) this.tenantsReg = d.tenantsReg;
      if (window.OMKpAddr && window.OMKpAddr.fias) this.fias = Object.assign({}, window.OMKpAddr.fias.s3 || {});
      this.floorPlans = p.floorPlans;
      this.planBoxes = p.planBoxes;
      this.planMop = p.planMop;
      this.forceUpdate();
      return true;
    };
    if (!apply()) {
      const t = setInterval(() => { if (apply()) clearInterval(t); }, 60);
      setTimeout(() => clearInterval(t), 20000);
    }
  }

  // контуры подъездов на кропе генплана (% от изображения); литеры Г-образные: два крыла = два подъезда
  polys = {
    '18_1': [[30.3,3.7],[37.45,3.7],[37.45,9.5],[36.37,9.5],[36.37,14.4],[30.3,14.4]],
    '18_2': [[37.45,8.2],[40.65,8.2],[40.65,26.9],[36.37,26.9],[36.37,9.5],[37.45,9.5]],
    '17_2': [[52.1,3.7],[59.2,3.7],[59.2,14.2],[53.15,14.2],[53.15,9.4],[52.1,9.4]],
    '17_1': [[48.85,8.2],[52.1,8.2],[52.1,9.4],[53.15,9.4],[53.15,26.9],[48.85,26.9]],
    '16_1': [[85.6,3.7],[92.7,3.7],[92.7,9.4],[91.8,9.4],[91.8,14.2],[85.6,14.2]],
    '16_2': [[92.7,8.2],[96.2,8.2],[96.2,27],[91.8,27],[91.8,9.4],[92.7,9.4]],
    '13_1': [[36.3,62.2],[39.3,62.2],[39.3,66.8],[40.6,66.8],[40.6,85.9],[37.4,85.9],[37.4,75],[36.3,75]],
    '13_2': [[30.3,85.9],[37.4,85.9],[37.4,75],[30.3,75]],
    '14_2': [[53.1,62.2],[50.1,62.2],[50.1,66.8],[48.8,66.8],[48.8,85.9],[52,85.9],[52,75],[53.1,75]],
    '14_1': [[59.1,85.9],[52,85.9],[52,75],[59.1,75]],
    '15_1': [[91.6,62.1],[94.8,62.1],[94.8,66.7],[96.1,66.7],[96.1,86],[92.9,86],[92.9,75.1],[91.6,75.1]],
    '15_2': [[85.6,86],[92.9,86],[92.9,75.1],[85.6,75.1]],
    // остановка справа от литера 15
    'stop1': [[98.75,81.5],[99.6,81.5],[99.6,85.0],[98.75,85.0]],
    'b1': [[48.4,39.4],[60.9,39.4],[60.9,45.6],[48.4,45.6]],
    'b2': [[82.8,39.4],[95.4,39.4],[95.4,45.6],[82.8,45.6]],
    'nto12': [[5.35,43.7],[8.25,43.7],[8.25,47.2],[5.35,47.2]],
    // зона аренды земельного участка на бульваре — между НТО 12 и НТО 1
    'zu1': [[17.70,40.50],[18.27,40.61],[18.80,40.92],[19.26,41.41],[19.61,42.05],[19.83,42.80],[19.90,43.60],[19.83,44.40],[19.61,45.15],[19.26,45.79],[18.80,46.28],[18.27,46.59],[17.70,46.70],[17.13,46.59],[16.60,46.28],[16.14,45.79],[15.79,45.15],[15.57,44.40],[15.50,43.60],[15.57,42.80],[15.79,42.05],[16.14,41.41],[16.60,40.92],[17.13,40.61]],
    // НТО 1–11 на бульваре: верхний ряд 1–5 (двойные 1, 2, 3, 5; одинарный 4), нижний ряд 6–11 (двойной 6, одинарные 7–11)
    'nto1': [[27.4,40.5],[29.8,40.5],[29.8,42.9],[27.4,42.9]],
    'nto2': [[29.8,42.6],[32.1,42.6],[32.1,45.0],[29.8,45.0]],
    'nto3': [[32.2,40.5],[34.6,40.5],[34.6,42.9],[32.2,42.9]],
    'nto4': [[35.9,40.5],[38.3,40.5],[38.3,42.9],[35.9,42.9]],
    'nto5': [[39.8,40.5],[41.2,40.5],[41.2,42.9],[39.8,42.9]],
    'nto6': [[39.6,49.8],[41.1,49.8],[41.1,52.1],[39.6,52.1]],
    'nto7': [[37.3,48.3],[38.7,48.3],[38.7,50.6],[37.3,50.6]],
    'nto8': [[35.0,49.8],[36.4,49.8],[36.4,52.1],[35.0,52.1]],
    'nto9': [[31.4,49.8],[33.7,49.8],[33.7,52.1],[31.4,52.1]],
    'nto10': [[29.3,49.8],[30.7,49.8],[30.7,52.1],[29.3,52.1]],
    'nto11': [[27.0,48.0],[28.4,48.0],[28.4,50.3],[27.0,50.3]],
  };

  names = {
    '13_1': 'Литер 13 · Подъезд 1', '13_2': 'Литер 13 · Подъезд 2',
    '14_1': 'Литер 14 · Подъезд 1', '14_2': 'Литер 14 · Подъезд 2',
    '15_1': 'Литер 15 · Подъезд 1', '15_2': 'Литер 15 · Подъезд 2',
    '16_1': 'Литер 16 · Подъезд 1', '16_2': 'Литер 16 · Подъезд 2',
    '17_1': 'Литер 17 · Подъезд 1', '17_2': 'Литер 17 · Подъезд 2',
    '18_1': 'Литер 18 · Подъезд 1', '18_2': 'Литер 18 · Подъезд 2',
    'b1': 'Коммерция №16220 (Л1)', 'b2': 'Коммерция №16218 (Л2)',
    'nto12': 'НТО 12', 'zu1': 'Батут (зона аренды ЗУ)', 'stop1': 'Остановка №2',
    'nto1': 'НТО 1', 'nto2': 'НТО 2', 'nto3': 'НТО 3', 'nto4': 'НТО 4', 'nto5': 'НТО 5', 'nto6': 'НТО 6',
    'nto7': 'НТО 7', 'nto8': 'НТО 8', 'nto9': 'НТО 9', 'nto10': 'НТО 10', 'nto11': 'НТО 11',
  };

  // Отдельно стоящие здания у бульвара — техпаспорта уч. 16220 и 16218
  bFloors = {
    b1: { addr: 'ул. им. Ивана Беличенко, 85А · ТП уч. 16220', floors: [
      { label: 'Подвал', img: 'assets/b1_podval.png', ratio: 3332/1288,
        // МОП: коридоры 5 и 15, лестничные марши 1 и 14, лифтовая 3, пом. 2, 4, 20
        units: [
          { number: 'пом. 6 (+ 7)', btiN: '6, 7', area: '77,0 м²', powerKw: '5 кВт', powerTz: true, status: 'В аренде', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"', mgmtCo: 'ООО «НПК»', mgmtRate: '200 ₽/м² · 15 400 ₽/мес', mgmtActive: 'активен с 27.01.2026', mgmtNote: '' },
          { number: 'пом. 10 (+ 11)', btiN: '10, 11', area: '77,2 м²', powerKw: '5 кВт', powerTz: true, status: 'В аренде', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"', mgmtCo: 'без управления', mgmtNote: '' },
          { number: 'пом. 8 (+ 9)', btiN: '8, 9', area: '165,7 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 18 (+ 19)', btiN: '18, 19', area: '159,1 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 12 (+ 13)', btiN: '12, 13', area: '148,5 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 16 (+ 17)', btiN: '16, 17', area: '77,5 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[12,23],[21.1,23],[21.1,78],[12,78]],
          [[39.7,23],[48.8,23],[48.8,78],[39.7,78]],
          [[21.1,23],[39.7,23],[39.7,78],[21.1,78]],
          [[76.7,23],[95,23],[95,73.5],[86,73.5],[86,78],[76.7,78]],
          [[48.8,23],[68.3,23],[68.3,53],[63,53],[63,78],[48.8,78]],
          [[68.3,23],[76.7,23],[76.7,78],[68.3,78]],
        ],
        mop: [
          [[0.85,23],[12,23],[12,87],[0.85,87]],
          [[12,78],[63,78],[63,87],[12,87]],
          [[63,53],[68.3,53],[68.3,87],[63,87]],
          [[68.3,78],[86,78],[86,87],[68.3,87]],
          [[86,73.5],[95,73.5],[95,87],[86,87]],
        ] },
      { label: '1 этаж', img: 'assets/b1_f1_new.png', ratio: 2256/659,
        // 27/1 … 27/5 по экспликации; МОП — коридор 27, лестницы 28/29, лифт 25, санузлы 24/26, тамбур 23, марши 21/22
        units: [
          { number: '27/1', btiN: '27 (часть)', area: '338,5 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '27/2 (+ 24)', btiN: '24, 27 (часть)', area: '94,6 м²', powerKw: '45 кВт', powerTz: true, status: 'В аренде', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"', mgmtCo: 'ООО «НПК»', mgmtRate: '200 ₽/м² · 18 920 ₽/мес', mgmtActive: 'активен с 02.03.2026', mgmtNote: '', turnover: { 1: '8 % от товарооборота (в т.ч. НДС), но не менее 2 000 ₽/м² · 1-й год, 02.03.2026–01.03.2027 (1–8 мес. — каникулы 10 ₽/мес)', 2: '10 % от товарооборота (в т.ч. НДС), но не менее 2 500 ₽/м² · 2-й год, с 02.03.2027' } },
          { number: '27/3', btiN: '27 (часть)', area: '87,8 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '27/4', btiN: '27 (часть)', area: '164,9 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '27/5', btiN: '27 (часть)', area: '120,7 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[60,4.5],[98.5,4.5],[98.5,95.5],[70,95.5],[70,47],[60,47]],
          [[50.4,16],[60,16],[60,48.5],[65,48.5],[65,81],[56.3,81],[56.3,95.5],[50.4,95.5]],
          [[40.5,16],[50.4,16],[50.4,95.5],[40.5,95.5]],
          [[21.3,16],[40.5,16],[40.5,95.5],[21.3,95.5]],
          [[9.1,16],[21.3,16],[21.3,95.5],[6.4,95.5],[6.4,47],[9.1,47]],
        ],
        mop: [
          [[6.3,4.5],[60,4.5],[60,16],[9.1,16],[9.1,47],[6.3,47]],
          [[1.2,4.5],[6.3,4.5],[6.3,95.5],[1.2,95.5]],
          [[65,47],[70,47],[70,95.5],[56.3,95.5],[56.3,81],[65,81]],
        ] },
      { label: '2 этаж', img: 'assets/b1_f2_new.png', ratio: 2244/643,
        // 32/1 … 32/7; МОП — коридор 32, лестницы 34/35, лифт, санузлы 30/31
        units: [
          { number: '32/4', btiN: '30–33 (часть)', area: '289,1 м²', powerKw: '20 кВт', powerTz: true, status: 'В аренде', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"', mgmtCo: 'ООО «НПК»', mgmtRate: '200 ₽/м² · 57 820 ₽/мес', mgmtActive: 'активен с 23.09.2026', mgmtNote: '' },
          { number: '32/1', btiN: '30–33 (часть)', area: '87,0 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '32/2', btiN: '30–33 (часть)', area: '69,6 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '32/3', btiN: '30–33 (часть)', area: '67,6 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '32/5', btiN: '30–33 (часть)', area: '97,9 м²', powerKw: '15 кВт', powerTz: true, status: 'В аренде', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"', mgmtCo: 'ООО «НПК»', mgmtRate: '200 ₽/м² · 19 580 ₽/мес', mgmtActive: 'активен с 21.09.2026', mgmtNote: '' },
          { number: '32/6', btiN: '30–33 (часть)', area: '97,5 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '32/7', btiN: '30–33 (часть)', area: '75,0 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[69.5,4.5],[98.5,4.5],[98.5,95.5],[69.5,95.5]],
          [[6.5,4.5],[30,4.5],[30,37],[6.5,37]],
          [[30,4.5],[50,4.5],[50,37],[30,37]],
          [[50,4.5],[69.5,4.5],[69.5,37],[50,37]],
          [[41,50],[61,50],[61,95.5],[41,95.5]],
          [[20.5,50],[41,50],[41,95.5],[20.5,95.5]],
          [[6.5,50],[20.5,50],[20.5,95.5],[6.5,95.5]],
        ],
        mop: [
          [[6.5,37],[69.5,37],[69.5,50],[6.5,50]],
          [[1,4.5],[6.5,4.5],[6.5,95.5],[1,95.5]],
          [[61,50],[69.5,50],[69.5,95.5],[61,95.5]],
        ] },
      { label: 'Крыша', img: 'assets/b1_bn.png', ratio: 3334/1288,
        // эксплуатируемая кровля: пом. 39; МОП — лестницы 36/40, лифт 38, тамбур 37
        units: [
          { number: 'Кровля · пом. 39', area: '908,1 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[7,14],[95.5,14],[95.5,79],[67.5,79],[67.5,45],[62.5,45],[62.5,79],[7,79]],
        ],
        mop: [
          [[2,20],[7,20],[7,79],[2,79]],
          [[62.5,45],[67.5,45],[67.5,79],[62.5,79]],
        ] } ] },
    b2: { addr: 'ул. им. Ивана Беличенко, 87/1 · ТП уч. 16218', floors: [
      { label: 'Подвал', img: 'assets/b2_podval.png', ratio: 3290/1282,
        // МОП: коридоры 5 и 15, лестничные марши 1 и 14, лифтовая 3, пом. 2, 4, 20
        units: [
          { number: 'пом. 8 (+ 9)', area: '165,7 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 18 (+ 19)', area: '159,1 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 12 (+ 13)', area: '148,5 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 16 (+ 17)', area: '77,5 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 10 (+ 11)', area: '77,2 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: 'пом. 6 (+ 7)', area: '77,0 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[58,23],[78,23],[78,78],[58,78]],
          [[1.8,23],[20.8,23],[20.8,79],[11,79],[11,75.5],[1.8,75.5]],
          [[30,23],[49,23],[49,78],[34,78],[34,55],[30,55]],
          [[20.8,23],[30,23],[30,55],[29,55],[29,78],[20.8,78]],
          [[49,23],[58,23],[58,78],[49,78]],
          [[78,23],[87,23],[87,78],[78,78]],
        ],
        mop: [
          [[1.8,75.5],[11,75.5],[11,79],[87,79],[87,88],[1.8,88]],
          [[29,55],[34,55],[34,79],[29,79]],
          [[87,23],[96,23],[96,88],[87,88]],
        ] },
      { label: '1 этаж', img: 'assets/b2_f1_v2.png', ratio: 1848/522,
        // 25/1 … 25/5 по плану; МОП — коридор 25, лестницы 21/22/29, лифт 27, санузлы 24/26/28, тамбур 23
        units: [
          { number: '25/1', area: '337,6 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '25/3', area: '164,9 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '25/5', btiN: '23–26 (часть)', area: '121,0 м²', powerKw: '40 кВт', status: 'В аренде', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"', mgmtCo: 'ООО «НПК»', mgmtRate: '200 ₽/м² · 24 200 ₽/мес', mgmtActive: 'активен с 24.09.2026', turnover: { 1: '7 % от товарооборота (в т.ч. НДС), но не менее 1 600 ₽/м² · 1-й год, 24.09.2026–23.09.2027 (1–4 мес. — каникулы 10 ₽/мес)', 2: '7 % от товарооборота (в т.ч. НДС), но не менее 1 800 ₽/м² · 2-й год, 24.09.2027–23.09.2028' } },
          { number: '25/2 (+ 24)', btiN: '24, 25 (часть)', area: '98,9 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '25/4', area: '83,8 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[1.2,5.5],[39,5.5],[39,51],[29.6,51],[29.6,97.5],[1.2,97.5]],
          [[48.9,17.8],[67.3,17.8],[67.3,97.5],[48.9,97.5]],
          [[76.7,17.8],[88.6,17.8],[88.6,47.5],[91.3,47.5],[91.3,97.5],[76.7,97.5]],
          [[39,17.8],[48.9,17.8],[48.9,97.5],[43,97.5],[43,83.5],[34.3,83.5],[34.3,51],[39,51]],
          [[67.3,17.8],[76.7,17.8],[76.7,97.5],[67.3,97.5]],
        ],
        mop: [
          [[39,5.5],[91.3,5.5],[91.3,17.8],[39,17.8]],
          [[88.6,17.8],[91.3,17.8],[91.3,47.5],[88.6,47.5]],
          [[91.3,5.5],[96,5.5],[96,97.5],[91.3,97.5]],
          [[29.6,51],[34.3,51],[34.3,97.5],[29.6,97.5]],
          [[34.3,83.5],[43,83.5],[43,97.5],[34.3,97.5]],
        ] },
      { label: '2 этаж', img: 'assets/b2_f2_v2.png', ratio: 1848/514,
        // 32/1 … 32/5; МОП — коридор 32, лестницы 34/35, лифт, санузлы 30/31
        units: [
          { number: '32/5', btiN: '32 (часть)', area: '273,5 м²', powerKw: '100 кВт', powerTz: true, status: 'В аренде', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"', mgmtCo: 'ООО «НПК»', mgmtRate: '200 ₽/м² · 54 700 ₽/мес', mgmtActive: 'активен с 26.11.2025' },
          { number: '32/1', area: '255,9 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '32/2', area: '99,9 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '32/4 + 31', btiN: '32/4, 31', area: '90,3 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
          { number: '32/3', area: '68,8 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[38.8,50.5],[91.3,50.5],[91.3,97],[38.8,97]],
          [[1.2,4.5],[20.3,4.5],[20.3,38],[29.6,38],[29.6,97],[1.2,97]],
          [[20.4,4.5],[48.3,4.5],[48.3,37.3],[20.4,37.3]],
          [[67.8,4.5],[95.7,4.5],[95.7,15.4],[91.3,15.4],[91.3,37.3],[67.8,37.3]],
          [[48.6,4.5],[67.6,4.5],[67.6,37.3],[48.6,37.3]],
        ],
        mop: [
          [[29.6,37.5],[91.3,37.5],[91.3,50.5],[29.6,50.5]],
          [[29.6,50.5],[38.8,50.5],[38.8,97],[29.6,97]],
          [[91.3,15.4],[96,15.4],[96,97],[91.3,97]],
        ] },
      { label: 'Крыша', img: 'assets/b2_bn.png', ratio: 3344/1268,
        // эксплуатируемая кровля; МОП — лестницы, лифт, тамбур
        units: [
          { number: 'Кровля', area: '908,1 м²', status: 'Не введено в эксплуатацию', liq: '', price: '', company: 'ЛИЧНЫЙ ФОНД "СК"' },
        ],
        boxes: [
          [[2,14],[92,14],[92,88],[36,88],[36,50],[29,50],[29,88],[2,88]],
        ],
        mop: [
          [[29,50],[36,50],[36,88],[29,88]],
          [[92,14],[96,14],[96,88],[92,88]],
        ] } ] },
  };

  // сторона входа на генплане: ключ — подъезд ('13_1') или помещение ('13_1#3'); left/right/top/bottom
  entrySide = { '18_2#6': 'right', '18_2#9': 'right', '18_2#11': 'bottom', '17_1': 'right', '17_2#9': 'top', '17_2#11': 'right', '16_2#7': 'right', '16_2#6': 'top', '16_1#5': 'top',
    '15_1#1': 'top', '15_1#2': 'top', '15_1#5': 'right', '15_1#6': 'left', '15_2#7': 'bottom', '15_2#11': 'left',
    '14_2#6': 'right', '14_2#9': 'left', '14_2#10': 'top', '14_2#11': 'top', '13_1#3': 'right', '13_1#6': 'left', '13_2#9': 'bottom', '13_2#10': 'bottom' };

  // точная подвижка метки [dx, dy] в % генплана
  entryNudge = { '15_1#2': [0, 1.0] };

  // Коммунальные услуги: из данных помещения, иначе сумма по УПД РСО (utilities.js)
  utilJk = 's3';

  cxTotalOf(id, u) { return this.sumRub({ ...this.cxUnit(id, u), ...(this.occupiedFullYTD(id, u) ? { cxUtil: '0 ₽' } : {}) }, ['cxUtil', 'cxSecurity', 'cxCleaning', 'cxTO', 'cxAdmin', 'cxTaxes', 'cxInsurance', 'cxKpiAgent']); }

  // Индикатор рядом с чипом «рынок»: сдаётся ли помещение по рыночной ставке
  rentGapOf(id, u) {
    if (this.actualPrice(id, u) || /Продано/i.test(u.status || '')) return {};
    const cur = this.rateSqm(this.regRow(id, u).regRate), mkt = this.mktRate(u);
    if (!(cur > 0) || !(mkt > 0)) return {};
    const d = (cur - mkt) / mkt, pct = Math.round(Math.abs(d) * 100);
    const f = (v) => Math.round(v).toLocaleString('ru-RU');
    const at = Math.abs(d) <= 0.02, up = d > 0;
    return {
      rentGap: at ? 'по рынку' : (up ? '+' : '−') + pct + '%',
      rentGapColor: at ? '#2b4a8c' : (up ? '#2f6b3f' : '#a3312b'),
      rentGapBg: at ? 'rgba(43,74,140,0.06)' : (up ? 'rgba(47,107,63,0.07)' : 'rgba(163,49,43,0.07)'),
      rentGapBorder: at ? 'rgba(43,74,140,0.18)' : (up ? 'rgba(47,107,63,0.22)' : 'rgba(163,49,43,0.22)'),
      rentGapTitle: 'Действующая ставка ' + f(cur) + ' ₽/м² против рыночной ' + f(mkt) + ' ₽/м² — '
        + (at ? 'сдаётся по рынку (отклонение до 2%)' : up ? 'выше рынка на ' + pct + '%' : 'ниже рынка на ' + pct + '%')
    };
  }

  mgmtInactiveSince = { '14_2|9': '26.08.2026', '15_1|1': '29.12.2025', '15_1|2': '30.06.2026', '15_1|5': '26.12.2025', '15_1|6': '17.12.2025' };

  regRow(id, u) {
    const r = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
    return { reg: r,
      ttName: (r && r.brand && r.brand !== '—') ? r.brand : (u.ttName || 'не указано'),
      regRate: (() => { const p = this.ratePick(r); return (p.rate && p.rate !== '—') ? p.rate : (u.regRate || 'не указана'); })(),
      regRatePeriod: r ? (this.ratePick(r).period || 'нет данных') : (u.regRatePeriod || '—'),
      regRateNextChange: r ? (this.ratePick(r).nextChange || 'нет данных') : (u.regRateNextChange || '—'),
      regRatePrev: r ? (this.ratePick(r).prevRate || 'нет данных') : (u.regRatePrev || '—'),
      regRatePrevPeriod: r ? (this.ratePick(r).prevPeriod || 'нет данных') : (u.regRatePrevPeriod || '—'),
      regIndexation: r ? (r.indexation || 'нет данных') : (u.regIndexation || '—'),
      regIndexDate: r ? (r.indexDate || 'нет данных') : (u.regIndexDate || '—'),
      regTenant: r ? r.tenant : (u.regTenant || 'нет договора'),
      regDog: r ? (r.dogDate || 'нет данных') : (u.regDog || '—'),
      regTill: this.regTillOf(r),
      regContract: (r && r.contract && r.contract !== '—') ? r.contract : (r ? 'не активен' : (u.regContract || 'не указана')),
      mgmtActive: (u.mgmtActive && u.mgmtCo !== 'без управления') ? u.mgmtActive : (u.mgmtCo === 'без управления' || this.noMgmt[id + '|' + String(u.number).split(',')[0].trim()]) ? '—' : ((r && r.contract && r.contract !== '—' && r.contract !== 'не активен') ? ('активен с ' + r.contract) : (this.mgmtInactiveSince[id + '|' + String(u.number).split(',')[0].trim()] ? ('не активен с ' + this.mgmtInactiveSince[id + '|' + String(u.number).split(',')[0].trim()]) : 'не активен')),
      regHoliday: (r && r.contract && r.contract !== '—' && r.contract !== 'не активен') ? (r.holiday || 'нет данных') : (r ? '—' : (u.regHoliday || '—')) };
  }

  // Актуальная цена проданного помещения: ₽/м² ближайшего по площади
  // непроданного помещения того же литера (тот же класс ликвидности) × площадь
  // ручные эталоны цены: 'key|номер проданного' -> номер помещения-образца в том же литере
  priceRefs = { '13_2|8': '13_2:9', '13_2|11': '15_2:11',
    '13_1|1': '15_1:1', '13_1|2': '15_1:2', '13_1|4': '15_1:5', '13_1|5': '15_1:5',
    '14_1|1': '15_2:7',
    '15_2|8': '13_2:9', '15_2|9': '13_2:9', '15_2|10': '13_2:9',
    '15_1|3': '18_2:9', '15_1|4': '18_2:9',
    '16_2|8': '16_2:7', '16_2|9': '16_2:7', '16_2|10': '16_2:6', '16_2|11': '16_2:6',
    '16_1|2': '17_2:9', '16_1|3': '17_2:9', '16_1|4': '17_2:9',
    '17_2|7': '16_1:5' };

  // По реестру КП+РСО: есть договор услуг → управление ООО «НПК», 200 ₽/м²
  noMgmt = { '16_1|5': true, '13_1|6': true };

  duMgmt = {
    '13_1|3': 'НП.ДУ.С3У609Р1-27-24 от 01.07.2024',
    '14_2|9': 'НП.ДУ.С3У614-51-24 от 24.06.2024',
    '14_2|10': 'НП.ДУ.С3У612Р1-61-24 от 25.07.2024',
    '15_1|1': 'НП.ДУ.С3У614Р1-123-24 от 14.10.2024',
    '15_1|2': 'НП.ДУ.АР3-16-25 от 12.02.2025',
    '15_1|5': 'НП.ДУ.С3У614-6-24 от 28.06.2024',
    '15_1|6': 'НП.ДУ.С3У614-5-24 от 28.06.2024',
    '15_2|11': 'НП.ДУ.АР3-11-25 от 23.01.2025',
    '17_1|6': 'НПДУС3У598Р1-133-25 от 16.12.2026',
    '17_2|9': 'НП.ДУ.АР3-2-25 от 17.01.2025',
    '18_2|9': 'НП.ДУ.С3У600Р1-124-24 от 15.10.2024',
  };

  duMgmtForce = { '14_2|9': true, '15_1|1': true, '15_1|2': true, '15_1|5': true, '15_1|6': true };

  duMgmtRate = { '17_1|6': '73 ₽/м² · 7 220 ₽/мес', '15_1|1': '73 ₽/м² · 5 920 ₽/мес', '15_1|2': '73 ₽/м² · 3 672 ₽/мес', '15_1|5': '73 ₽/м² · 11 673 ₽/мес', '15_1|6': '73 ₽/м² · 7 220 ₽/мес', '15_2|11': '73 ₽/м² · 6 658 ₽/мес', '17_2|9': '73 ₽/м² · 6 081 ₽/мес', '14_2|10': '73 ₽/м² · 3 679 ₽/мес', '14_2|9': '73 ₽/м² · 8 074 ₽/мес', '18_2|9': '73 ₽/м² · 8 074 ₽/мес', '13_1|3': '73 ₽/м² · 8 074 ₽/мес' };

  // Адреса литеров — реестр КП+РСО
  literAddr = {
    '13': 'г. Краснодар, ул. им. Константина Гондаря, 91',
    '14': 'г. Краснодар, ул. им. Константина Гондаря, 93',
    '15': 'г. Краснодар, ул. им. Константина Гондаря, 97',
    '16': 'г. Краснодар, ул. им. Ивана Беличенко, 87',
    '17': 'г. Краснодар, ул. им. Ивана Беличенко, 85',
    '18': 'г. Краснодар, ул. им. Ивана Беличенко, 83',
  };

  // Кадастровые номера — реестр КП+РСО
  cadastre = {
    '13_1|3': '23:43:0106012:26792', '13_1|6': '23:43:0106012:26796',
    '13_2|9': '23:43:0106012:26799', '13_2|10': '23:43:0106012:26800', '13_2|11': '23:43:0106012:26801',
    '14_1|1': '23:43:0106012:22897',
    '14_2|6': '23:43:0106012:22899', '14_2|9': '23:43:0106012:22902', '14_2|10': '23:43:0106012:22903', '14_2|11': '23:43:0106012:22904',
    '15_1|1': '23:43:0106012:20507', '15_1|2': '23:43:0106012:19972', '15_1|5': '23:43:0106012:19975', '15_1|6': '23:43:0106012:19976',
    '15_2|7': '23:43:0106012:19977', '15_2|11': '23:43:0106012:19981',
    '16_1|1': '23:43:0106012:23448', '16_1|5': '23:43:0106012:23453',
    '16_2|6': '23:43:0106012:23454', '16_2|7': '23:43:0106012:23455',
    '17_1|6': '23:43:0106012:20537',
    '17_2|7': '23:43:0106012:20538', '17_2|9': '23:43:0106012:20540', '17_2|11': '23:43:0106012:20542',
    '18_1|1': '23:43:0106012:22338',
    '18_2|6': '23:43:0106012:22339', '18_2|9': '23:43:0106012:22341', '18_2|11': '23:43:0106012:22344',
  };

  // Бывшие арендаторы за последние 12 месяцев — реестр КП+РСО (расторгнутые договоры)
  pastTenants = {
    '14_2|9': [{ tenant: 'ООО «ФармСервис»', rate: '1 350 ₽/м² · 149 310 ₽/мес', period: '24.09.2024 — 26.08.2026' }],
    '15_1|1': [{ tenant: 'ИП Муртузова А.Б.', rate: '1 500 ₽/м² · 121 650 ₽/мес', period: '14.01.2025 — 29.12.2025' }],
    '15_1|2': [{ tenant: 'ООО «Д-Телеком» (ВГО)', rate: 'нет данных', period: '22.03.2024 — 30.06.2026' }],
    '15_1|5': [{ tenant: 'ООО «ФармСервис»', rate: '1 350 ₽/м² · 215 865 ₽/мес', period: '09.10.2024 — 26.12.2025' }],
    '15_1|6': [{ tenant: 'ООО «ФармСервис»', rate: '1 350 ₽/м² · 133 515 ₽/мес', period: '09.10.2024 — 17.12.2025' }],
  };

  residentsCapacity = 4500;

  // «В аренде» у фонда/ПИФ в выгрузке КП = помещение простаивает в составе ДВК, а не сдано арендатору
  statusLabel(u) { return (this.isFund(u) && (this.isLeasedStatus(u.status) || this.isVacantStatus(u.status))) ? 'Простаивает' : u.status; }

  unitFields(key) {
    const bc = this.bFloors[key];
    const list = bc ? bc.floors.filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((a, f) => a.concat(f.units || []), []) : (this.units[key] || []);
    const isZu = String(key).startsWith('zu') || String(key).startsWith('stop');
    if (!list.length) return { noCommercial: true, commercial: null, commercialLabel: '', unitsLabel: '', units: '', statuses: [] };
    const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
    const counts = {};
    for (const u of list) { const s = this.unitStatus(key, u); counts[s] = (counts[s] || 0) + 1; }
    return { noCommercial: false, commercial: list.length,
      commercialLabel: isZu ? 'Мест в аренду' : 'Коммерческих помещений',
      unitsLabel: area > 0 ? (isZu ? 'Площадь участка' : 'Площадь коммерческих помещений') : '', units: area > 0 ? this.fmtArea(area) : '',
      statuses: Object.keys(counts).map(s => `${s}: ${counts[s]}`) };
  }

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
      const opex = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
      // отдельно стоящая коммерция 16220/16218 введена, но без стройготовности — потери считаем и по ней
      buildLoss: (u, key) => !sold(u) && !isNto(key) && (/не введено/i.test(this.unitStatus(key, u))
        || (/^b\d/.test(String(key || '')) && !/в аренде/i.test(this.unitStatus(key, u)))),
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
    for (const k in preds) agg[k] = { c: 0, a: 0, p: 0, r: 0 };
    for (const key in SU) for (const u of SU[key]) {
      const mrU = this.mktRate(u);
      for (const k in preds) if (preds[k](u, key)) { agg[k].c++; agg[k].a += A(u); agg[k].p += P(u); agg[k].r += A(u) * mrU; }
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
        const ox = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
        const opex = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
          // ожидаемая динамика цены — экспертный процент из выгрузки
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
        // помещения без стройготовности (16220/16218) в простой 6+ не попадают — они в потерях по стройготовности
        if (/^b\d/.test(String(key || ''))) continue;
        const st = this.unitStatus(key, u);
        if (!/в простое/i.test(st) || /с арендатором/i.test(st)) continue;
        const info = this.idleInfo(key, u);
        if (!info) continue;
        const dm = String(info).match(/(\d+)/);
        const days = dm ? parseInt(dm[1], 10) : 0;
        if (!(days >= 182)) continue;
        stuck.push({ number: u.number, area: u.area, location: this.names[key] || key, days, areaNum: A(u), rate: this.mktRate(u) });
      }
    }
    stuck.sort((a, b) => b.days - a.days || b.areaNum - a.areaNum);
    vals.stuck6Count = stuck.length;
    vals.stuck6Area = fA(stuck.reduce((s, u) => s + u.areaNum, 0));
    {
      const mm0 = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/);
      const mr0 = mm0 ? (parseFloat(mm0[1].replace(/[\s ]/g, '')) || 0) : 0;
      const loss = stuck.reduce((s, u) => s + u.areaNum * (u.rate || mr0) * (u.days / 30.44), 0);
      vals.stuck6Loss = mr0 ? rub(loss) : 'нет данных';
      vals.stuck6LossNote = mr0 ? 'площадь × ставка (прайс бульвара / медиана ' + mr0.toLocaleString('ru-RU') + ' ₽/м²) × срок простоя' : 'нет рыночной ставки';
      vals.buildLossSum = mr0 ? rub(agg.buildLoss.r * 8) : 'нет данных';
      vals.buildLossNote = mr0 ? 'площадь × ставка (прайс бульвара / медиана ' + mr0.toLocaleString('ru-RU') + ' ₽/м²) × 8 мес' : 'нет рыночной ставки';
    }
    // НТО, аренда ЗУ и остановки: собственный расчёт по договорам реестра
    {
      let month = 0, withRate = 0;
      for (const key in (this.tenantsReg || {})) {
        if (!/^(nto|zu|stop)/.test(key)) continue;
        for (const tr of this.tenantsReg[key]) {
          const p = this.ratePick(tr);
          const m = String((p && p.rate) || '').match(/·\s*([\d\s ]+(?:,\d+)?)\s*₽\/мес/);
          if (m) { const v = parseFloat(m[1].replace(/[\s ]/g, '').replace(',', '.')); if (isFinite(v)) { month += v; withRate++; } }
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
        const mm = String((pr && pr.rate) || '').match(/·\s*([\d\s\u00a0]+(?:,\d+)?)\s*₽\/мес/);
        if (mm) { const v = parseFloat(mm[1].replace(/[\s\u00a0]/g, '').replace(',', '.')); if (isFinite(v)) month += v; }
      }
      vals.uLeasedMonth = month ? rub(month) + '/мес' : 'нет данных';
      // максимальный арендный поток и экономическая эффективность по помещениям в аренде
      const mrM = String(this.marketRentStr() || '').match(/:\s*([\d\s\u00a0]+)\s*₽/);
      const mrRate = mrM ? (parseFloat(mrM[1].replace(/[\s\u00a0]/g, '')) || 0) : 0;
      // максимум — вся площадь ЖК без проданных (наши помещения) по рыночной ставке
      const ourArea = Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0));
      const maxMonth = Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0)) || ourArea * mrRate;
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
    const workRentPot = Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0) - ((agg.buildLoss && agg.buildLoss.r) || 0));
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
      R('Доля площади без стройготовности: ' + pct(agg.buildLoss.a, allArea), 'Не введено в эксплуатацию либо без стройготовности / вся непроданная площадь × 100%'),
      H('Финансовая эффективность (01.01–31.08.2026)'),
      R('Начислено аренды: ' + (rentYtdNum ? rub(rentYtdNum) : 'нет данных'), 'Сумма начисленной аренды по всем карточкам помещений'),
      R('Начислено за управление: ' + (mgmtYtdNum ? rub(mgmtYtdNum) : 'нет данных'), 'Сумма платы за управление по карточкам'),
      R('Средняя фактическая ставка: ' + vals.rentLeasedAvg, 'Начисления по помещениям в аренде / их площадь / 8 мес'),
      R('Медианная рыночная ставка: ' + (String(this.marketRentStr() || '').split(':').pop().trim() || '—'), 'Медиана действующих ставок по реестру аренды'),
      R('Средняя цена продажи: ' + vals.soldAvgSqm, 'Сумма продаж с агентскими / их площадь'),
      H('Потери'),
      R('Потери по стройготовности: ' + vals.buildLossSum, 'Площадь без РНВ и без стройготовности × ставка помещения (прайс бульвара / медиана ЖК) × 8 мес'),
      R('Потери от простоя 6+ мес: ' + vals.stuck6Loss, 'Площадь × ставка помещения (прайс бульвара / медиана ЖК) × срок простоя'),
      H('Правовая эффективность'),
      R('Полученные пени, штрафы и неустойки: — (нет данных)', 'Сумма взысканных пеней, штрафов и неустоек с начала года'),
      H('Прочие маркеры'),
      R('Экономическая заполняемость (economic occupancy): ' + (() => { const mmx = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/); const m2 = mmx ? (parseFloat(mmx[1].replace(/[\s ]/g, '')) || 0) : 0; const pot = (workRentPot || workArea * m2) * 8; return (pot && rentYtdNum) ? pct(rentYtdNum, pot) : 'нет данных'; })(), 'Начисленная аренда / потенциальная при 100% занятости введённых помещений × 100%'),
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
    vals.openBuildLoss = () => this.openSummaryFilter('buildLoss', 'Потери по стройготовности (без РНВ и без стройготовности)');
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
      const mrM = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/);
      const mrRate = mrM ? (parseFloat(mrM[1].replace(/[\s ]/g, '')) || 0) : 0;
      for (const key in SU) for (const u of SU[key]) {
        if (!pred(u, key)) continue;
        {
          const rr0 = (this.tenantsReg[key] || []).find(t0 => t0.unit && String(u.number).split(',')[0].trim() === t0.unit) || null;
          const pr0 = rr0 ? this.ratePick(rr0) : null;
          const mm0 = String((pr0 && pr0.rate) || '').match(/·\s*([\d\s\u00a0]+(?:,\d+)?)\s*₽\/мес/);
          if (mm0) { const v0 = parseFloat(mm0[1].replace(/[\s\u00a0]/g, '').replace(',', '.')); if (isFinite(v0)) factFlowSum += v0 * 12; }
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
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list,
        showFlow: /аренд/i.test(this.state.summaryFilter.label || '') && (maxFlowSum = (Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0)) || Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0)) * mrRate) * 12) > 0,
        maxFlow: Math.round(maxFlowSum).toLocaleString('ru-RU') + ' ₽/год',
        maxFlowNote: 'площадь без проданных × ставка (прайс бульвара / медиана ' + Math.round(mrRate).toLocaleString('ru-RU') + ' ₽/м²) × 12 мес',
        econEff: (factFlowSum / maxFlowSum * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%',
        econEffColor: (factFlowSum / maxFlowSum) >= 0.9 ? '#3a6b3f' : ((factFlowSum / maxFlowSum) >= 0.7 ? '#9a6b1a' : '#a3312b'),
        econEffNote: 'факт по действующим ставкам ' + Math.round(factFlowSum).toLocaleString('ru-RU') + ' ₽/год из максимума' };
    } else {
      vals.summaryFilterInfo = null;
    }
  }

  renderVals() {
    if (window.OMVolumes) this._volInfo = window.OMVolumes.fill(this);
    const vals = {};
    const fmtArea = (n) => this.fmtArea(n);
    const accent = '#2b2a27';
    const theme = this.props.theme || 'light';
    const themes = {
      light: { pageBg: '#f4f2ee', cardBg: '#fffdf9', border: '#ddd8cd', text: '#2b2a27', muted: '#6b6a64', imgCardBg: '#fff', statusNeutralBg: '#f7f5f0', statusGreenBg: '#eef6ee', statusOrangeBg: '#fbf3e6' },
      dark: { pageBg: '#1c1b18', cardBg: '#28261f', border: '#463f31', text: '#f0ece2', muted: '#a89f8f', imgCardBg: '#211f1a', statusNeutralBg: '#332f26', statusGreenBg: '#1f3324', statusOrangeBg: '#3a2c17' },
    };
    const th = themes[theme] || themes.light;
    vals.pageBg = th.pageBg; vals.cardBg = th.cardBg; vals.borderColor = th.border; vals.textColor = th.text;
    vals.mutedColor = th.muted; vals.imgCardBg = th.imgCardBg; vals.statusNeutralBg = th.statusNeutralBg;
    vals.statusGreenBg = th.statusGreenBg; vals.statusOrangeBg = th.statusOrangeBg;
    vals.statusRedBg = theme === 'dark' ? '#3a2420' : '#faf0ee';
    vals.statusNeutralBorder = '#c3bdb0';
    vals.accent = accent;

    vals.leave = () => this.leaveAll();
    vals.showActive = !!this.state.showActive;
    vals.activeBtnBg = this.state.showActive ? '#a3312b' : 'transparent';
    vals.activeBtnFg = this.state.showActive ? '#ffffff' : '#a3312b';
    vals.activeBtnLabel = this.state.showActive ? 'Скрыть актив' : 'Показать актив';
    vals.toggleActive = () => this.setState((s) => ({ showActive: !s.showActive }));
    vals.activeMarks = [];
    vals.storefronts = [];
    vals.activeTip = this.state.activeTip || null;
    if (this.state.showActive) {
      const PAL = {
        red: { c: '#a3312b', lite: '#c4645e', dark: '#7d2521', glow: 'rgba(163, 49, 43, 0.7)' },
        green: { c: '#3a7a42', lite: '#6aa370', dark: '#27562d', glow: 'rgba(58, 122, 66, 0.7)' },
        black: { c: '#2e2a24', lite: '#5c564d', dark: '#141210', glow: 'rgba(46, 42, 36, 0.6)' },
      };
      const ROT = { left: '0deg', right: '180deg', top: '90deg', bottom: '270deg' };
      for (const k of Object.keys(this.polys)) {
        const all = this.units[k] || [];
        const poly = this.polys[k];
        if ((k === 'b1' || k === 'b2') && poly) {
          // Коммерция №16220 / №16218 — круг с секторами по помещениям, вход снизу
          const xs0 = poly.map(p => p[0]), ys0 = poly.map(p => p[1]);
          const cfg = this.bFloors[k];
          const list = cfg ? cfg.floors.filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((a, f) => a.concat(f.units || []), []) : [];
          const live = list.filter(u => u.status !== 'Продано');
          if (live.length) {
            const rank = (u) => { const st = this.unitStatus(k, u); return /аренде/i.test(st) ? 0 : /Не введено/i.test(st) ? 2 : 1; };
            const sorted = live.slice().sort((a, b) => rank(a) - rank(b));
            const n = sorted.length;
            const step = 360 / n;
            const order = [];
            for (let i = 0; i < n; i++) order.push(i % 2 ? Math.ceil(i / 2) : -i / 2);
            const petals = sorted.map((u, i) => {
              const st = this.unitStatus(k, u);
              const pal = /аренде/i.test(st) ? PAL.green : /Не введено/i.test(st) ? PAL.black : PAL.red;
              const R = 25, RI = 11, a0 = -90 + i * step, a1 = a0 + step;
              const pt = (a, rr) => [ (rr * Math.cos(a * Math.PI / 180)).toFixed(2), (rr * Math.sin(a * Math.PI / 180)).toFixed(2) ];
              const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
              const [xi1, yi1] = pt(a1, RI), [xi0, yi0] = pt(a0, RI);
              const la = step > 180 ? 1 : 0;
              const d = n === 1
                ? 'M 0 -' + R + ' A ' + R + ' ' + R + ' 0 1 1 -0.01 -' + R + ' Z M 0 -' + RI + ' A ' + RI + ' ' + RI + ' 0 1 0 0.01 -' + RI + ' Z'
                : 'M ' + x0 + ' ' + y0 + ' A ' + R + ' ' + R + ' 0 ' + la + ' 1 ' + x1 + ' ' + y1 + ' L ' + xi1 + ' ' + yi1 + ' A ' + RI + ' ' + RI + ' 0 ' + la + ' 0 ' + xi0 + ' ' + yi0 + ' Z';
              return { c: pal.c, lite: pal.lite, dark: pal.dark, r: rank(u), d };
            });
            vals.activeMarks.push({ pe: 'none', key: k, left: (Math.min(...xs0) + Math.max(...xs0)) / 2 + '%', top: Math.max(...ys0) + '%', flower: true, petals, glow: PAL.green.glow });
          }
          continue;
        }
        if ((k.startsWith('stop') || k.startsWith('zu')) && poly) {
          const xs1 = poly.map(p => p[0]), ys1 = poly.map(p => p[1]);
          const leased = (this.tenantsReg[k] || []).length > 0 || (this.units[k] || []).some(u => /аренде/i.test(this.unitStatus(k, u)));
          const pal = leased ? PAL.green : PAL.red;
          vals.activeMarks.push({ pe: 'none', key: k, left: (Math.min(...xs1) + Math.max(...xs1)) / 2 + '%', top: (Math.min(...ys1) + Math.max(...ys1)) / 2 + '%', dot: true,
            c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
          continue;
        }
        if (!all.length || !poly) continue;
        const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
        const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
        const boxes = this.planBoxes[k];
        const rows = [];
        if (k.startsWith('nto') || k.startsWith('stop') || k.startsWith('zu')) {
          // НТО, остановки, зоны аренды ЗУ: шар в центре объекта (если есть непроданные)
          const live = all.filter(u => u.status !== 'Продано');
          if (!live.length) continue;
          const sts = live.map(u => this.unitStatus(k, u));
          const pal = sts.some(s => /аренде/i.test(s)) ? PAL.green : sts.every(s => /Не введено/i.test(s)) ? PAL.black : PAL.red;
          vals.activeMarks.push({ pe: 'none', key: k, left: (bx0 + bx1) / 2 + '%', top: (by0 + by1) / 2 + '%', dot: true,
            c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
          continue;
        }
        all.forEach((u, gi) => {
          if (u.status === 'Продано') return;
          const shp = boxes && boxes[gi] && boxes[gi][0];
          let cx = null, cy = null, bb = null;
          if (shp) {
            if (shp.poly) {
              const px = shp.poly.map(p => p[0]), py = shp.poly.map(p => p[1]);
              bb = { x0: Math.min(...px), x1: Math.max(...px), y0: Math.min(...py), y1: Math.max(...py) };
            } else { bb = { x0: shp.l, x1: shp.l + shp.w, y0: shp.t, y1: shp.t + shp.h }; }
            cx = (bb.x0 + bb.x1) / 2; cy = (bb.y0 + bb.y1) / 2;
          }
          rows.push({ u, gi, cx, cy, bb });
        });
        rows.forEach((r, i) => { if (r.cy == null) { r.cx = 50; r.cy = (i + 0.5) / rows.length * 100; } });
        const buckets = { left: [], right: [], top: [], bottom: [] };
        const forced = this.entrySide[k];
        rows.forEach((r) => {
          const num = String(r.u.number).split(',')[0].trim();
          const own = this.entrySide[k + '#' + num] || forced;
          if (own) { buckets[own].push(r); return; }
          const d = { left: r.cx, right: 100 - r.cx, top: r.cy, bottom: 100 - r.cy };
          let side = 'left';
          for (const s of ['right', 'top', 'bottom']) if (d[s] < d[side]) side = s;
          buckets[side].push(r);
        });
        const rnvD = this.rnv[k] ? (() => { const p = String(this.rnv[k]).split('.').map(Number); return new Date(p[2], p[1] - 1, p[0]); })() : null;
        const building = rnvD && rnvD > new Date();
        for (const side of ['left', 'right', 'top', 'bottom']) {
          const arr = buckets[side];
          if (!arr.length) continue;
          const vertical = side === 'left' || side === 'right';
          arr.sort((a, b) => (vertical ? a.cy - b.cy : a.cx - b.cx));
          let prev = -99;
          arr.forEach((r) => {
            let along = vertical ? by0 + r.cy / 100 * (by1 - by0) : bx0 + r.cx / 100 * (bx1 - bx0);
            const gap = vertical ? 2.1 : 2.6;
            if (along - prev < gap) along = prev + gap;
            prev = along;
            const num = String(r.u.number).split(',')[0].trim();
            const nd = this.entryNudge[k + '#' + num] || this.entryNudge[k] || [0, 0];
            const x = (side === 'left' ? bx0 - 1.5 : side === 'right' ? bx1 + 1.5 : along) + nd[0];
            const y = (side === 'top' ? by0 - 2.6 : side === 'bottom' ? by1 + 2.6 : along) + nd[1];
            const st = this.unitStatus(k, r.u);
            const pal = (building || /Не введено/i.test(st)) ? PAL.black : /аренде/i.test(st) ? PAL.green : PAL.red;
            const tipR = (this.tenantsReg[k] || []).find(t => t.unit && String(r.u.number).split(',')[0].trim() === t.unit) || null;
            const tipRate = (tipR && this.ratePick) ? (this.ratePick(tipR) || {}).rate : null;
            const tipName = tipR ? ((tipR.brand && tipR.brand !== '—') ? tipR.brand : tipR.tenant) : null;
            const tip = 'Пом. ' + String(r.u.number).split(',')[0].trim() + ' · ' + (r.u.area || '')
              + (tipName ? ' · ' + tipName : ' · нет арендатора')
              + ' · ставка: ' + (tipRate || 'нет данных') + ' · ' + st;
            // витрина окрашена по категории арендатора (traffic.js), пустая — чёрным
            const sfCat = (tipR && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(tipR) : null;
            const sfColor = tipR ? ((sfCat && sfCat.c) || '#4b2e83') : '#a3312b';
            const sfTip = tip + (sfCat ? ' · категория: ' + sfCat.name : '');
            vals.activeMarks.push({ pe: 'auto', tip, onTip: () => this.setState({ activeTip: { text: tip, left: x + '%', top: y + '%' } }), offTip: () => this.setState({ activeTip: null }), key: k + '_' + r.gi, left: x + '%', top: y + '%', rot: 'rotate(' + ROT[side] + ')', arrow: true,
              c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
            // витрина: протяжённость помещения вдоль фасада берём из поэтажного плана
            // (контур помещения в % кропа) и проецируем на соответствующее ребро подъезда
            if (r.bb) {
              const to = (v) => (vertical ? by0 + v / 100 * (by1 - by0) : bx0 + v / 100 * (bx1 - bx0));
              let a0 = to(vertical ? r.bb.y0 : r.bb.x0), a1 = to(vertical ? r.bb.y1 : r.bb.x1);
              const minLen = (vertical ? (by1 - by0) : (bx1 - bx0)) * 0.12;
              if (a1 - a0 < minLen) { const mid = (a0 + a1) / 2; a0 = mid - minLen / 2; a1 = mid + minLen / 2; }
              a0 = Math.max(vertical ? by0 : bx0, a0); a1 = Math.min(vertical ? by1 : bx1, a1);
              const ins = 0.3;
              const fx = side === 'left' ? bx0 + ins : bx1 - ins;
              const fy = side === 'top' ? by0 + ins : by1 - ins;
              const toX = (v) => bx0 + v / 100 * (bx1 - bx0);
              const toY = (v) => by0 + v / 100 * (by1 - by0);
              // угловое помещение выходит на две наружные стены — витрину рисуем углом
              const dd = { left: r.bb.x0, right: 100 - r.bb.x1, top: r.bb.y0, bottom: 100 - r.bb.y1 };
              const perp = vertical ? ['top', 'bottom'] : ['left', 'right'];
              const sec = perp.reduce((a, b) => (dd[b] < dd[a] ? b : a));
              const corner = null; // углы витрин отключены — ищем более аккуратную геометрию
              const f2 = (a, b) => a.toFixed(2) + ',' + b.toFixed(2);
              const sfPoints = (() => {
                if (!corner) return vertical ? (f2(fx, a0) + ' ' + f2(fx, a1)) : (f2(a0, fy) + ' ' + f2(a1, fy));
                const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
                if (vertical) {
                  const cy = corner === 'top' ? by0 + ins : by1 - ins;
                  const far = cl(side === 'left' ? toX(r.bb.x1) : toX(r.bb.x0), bx0 + ins, bx1 - ins);
                  return f2(fx, corner === 'top' ? a1 : a0) + ' ' + f2(fx, cy) + ' ' + f2(far, cy);
                }
                const cx2 = corner === 'left' ? bx0 + ins : bx1 - ins;
                const far = cl(side === 'top' ? toY(r.bb.y1) : toY(r.bb.y0), by0 + ins, by1 - ins);
                return f2(corner === 'left' ? a1 : a0, fy) + ' ' + f2(cx2, fy) + ' ' + f2(cx2, far);
              })();
              vals.storefronts.push({ tip: sfTip,
                onTip: () => this.setState({ activeTip: { text: sfTip,
                  left: (vertical ? fx : (a0 + a1) / 2) + '%', top: (vertical ? (a0 + a1) / 2 : fy) + '%' } }),
                offTip: () => this.setState({ activeTip: null }),
                key: 'sf_' + k + '_' + r.gi, c: sfColor,
                cat: tipR ? ((sfCat && sfCat.name) || 'Прочее') : 'Свободно',
                points: sfPoints });
            }
          });
        }
      }
    }
    // сноска по цветам витрин: только категории, встречающиеся в этом ЖК
    {
      const agg = {};
      for (const sf of (vals.storefronts || [])) {
        if (!agg[sf.cat]) agg[sf.cat] = { name: sf.cat, c: sf.c, n: 0 };
        agg[sf.cat].n++;
      }
      const list = Object.keys(agg).map((k2) => agg[k2]);
      list.sort((a, b) => (a.name === 'Свободно' ? 1 : b.name === 'Свободно' ? -1 : b.n - a.n));
      vals.sfLegend = list;
    }
    vals.buildingPolys = Object.keys(this.polys).map((k) => {
      const hov = this.state.hovered === k || this.state.selected === k;
      return { id: k, points: this.polys[k].map(p => p.join(',')).join(' '),
        fill: 'transparent',
        stroke: hov ? '#a3312b' : 'transparent',
        onEnter: () => this.enter(k), onClick: () => this.select(k) };
    });

    if (this.state.hovered && this.polys[this.state.hovered]) {
      const key = this.state.hovered;
      const poly = this.polys[key];
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs);
      const by0 = Math.min(...ys);
      const TIP_W = 18, TIP_H = 30;
      let left, transform;
      if (bx1 + 1 + TIP_W <= 99) { left = (bx1 + 1) + '%'; transform = 'none'; }
      else { left = (bx0 - 1) + '%'; transform = 'translateX(-100%)'; }
      const top = Math.max(1, Math.min(by0, 99 - TIP_H)) + '%';
      vals.activeInfo = { name: this.names[key], left, top, transform, rnv: this.rnv[key], ...this.unitFields(key) };
    } else {
      vals.activeInfo = null;
    }

    vals.closePanel = () => this.closePanel();
    if (this.state.selected) {
      const id = this.state.selected;
      const bCfg0 = this.bFloors[id] || null;
      const bFloor0 = bCfg0 ? bCfg0.floors[this.state.floorIdx || 0] : null;
      const srcList = (bFloor0 && bFloor0.units) ? bFloor0.units : (this.units[id] || []);
      const list = srcList.map((u, idx) => ({ ...u,
        status: this.unitStatus(id, u),
        liqColor: this.liqColors[u.liq || (bCfg0 ? 'Ликвидное' : '')] || 'transparent',
        cardBg: /Продано/i.test(u.status || '') ? '#1b1916' : (this.liqColors[u.liq || (bCfg0 ? 'Ликвидное' : '')] || 'transparent'),
        fg: /Продано/i.test(u.status || '') ? '#f2ede4' : vals.textColor,
        fgMuted: /Продано/i.test(u.status || '') ? '#a9a196' : vals.mutedColor,
        cornerFg: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        cornerCaption: /Продано/i.test(u.status || '') ? 'Актуальная цена' : '',
        cardPad: /Продано/i.test(u.status || '') ? '7px 10px' : '10px 12px',
        cardAlign: /Продано/i.test(u.status || '') ? 'start' : 'stretch',
        chipMargin: /Продано/i.test(u.status || '') ? '4px 0 5px' : '6px 0 8px',
        rowGap: /Продано/i.test(u.status || '') ? '1px' : '3px',
        rowFont: /Продано/i.test(u.status || '') ? '11px' : '11.5px',
        rowLine: /Продано/i.test(u.status || '') ? '14px' : '16px',
        strike: u.status === 'Продано' ? 'line-through' : 'none',
        // отдельно стоящая коммерция 16220/16218: помещения без действующей аренды не имеют стройготовности
        noBuildReady: !!bCfg0 && !/в аренде/i.test(this.unitStatus(id, u)) && !/Продано/i.test(u.status || ''),
        sold: /Продано/i.test(u.status || ''),
        notSold: u.status !== 'Продано',
        role: u.role || 'Владелец',
        priceLabel: u.priceLabel || 'Цена по прайсу',
        companyOrDash: u.company || 'не указано',
        marketPrice: (this.actualPrice(id, u) || {}).value || u.marketPrice || u.price || 'не указана',
        saleGrowth: this.saleGrowth(id, u),
        corner: (this.actualPrice(id, u) || {}).value || (/Продано/i.test(u.status || '') ? 'нет данных' : ''),
        ...this.rentGapOf(id, u),
        rentMarket: (this.actualPrice(id, u) || /Продано/i.test(u.status || '') || /^(nto|zu|stop)/.test(String(id))) ? '' : (u.priceRate || String(this.marketRentStr() || '').split(':').pop().trim()),
        rentMarketTitle: u.priceRate ? 'Прайсовая ставка аренды — расчёт ставок «Бульвар Самолет» от 09.09.2026' : 'Актуальная на текущий год рыночная ставка аренды — медиана действующих ставок по ЖК',
        cornerTitle: this.actualPrice(id, u) ? 'Актуальная цена помещения' : 'Актуальная на текущий год рыночная ставка аренды',
        marketLabel: this.actualPrice(id, u) ? 'Актуальная цена' : 'Рыночная цена',
        marketTitle: (this.actualPrice(id, u) || {}).basis || u.marketPrice || u.price || '',
        powerKw: u.powerKw || '',
        sale: this.saleOf(id, u),
        // категория торговой точки арендатора — кружок в углу карточки (traffic.js)
        ttChipCat: (() => {
          if (/Продано/i.test(u.status || '')) return null;
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          if (!r) return null;
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.name) || 'Прочее';
        })(),
        ttChipBg: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '1f';
        })(),
        ttChipBd: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '59';
        })(),
        ttChipColor: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.c) || '#4b2e83';
        })(),
        // данные сделки показываем в каждой проданной карточке: нет записи — «нет данных»
        saleDate: (this.saleOf(id, u) || {}).date || 'нет данных',
        saleFact: (this.saleOf(id, u) || {}).fact || 'нет данных',
        saleAgent: (this.saleOf(id, u) || {}).agent || 'нет данных',
        saleBuyer: (this.saleOf(id, u) || {}).buyer || 'нет данных',
        price: u.priceLabel ? u.price : '',
        pastTenants: this.pastTenants[id + '|' + String(u.number).split(',')[0].trim()] || null,
        pastRows: this.pastTenants[id + '|' + String(u.number).split(',')[0].trim()] || [{ tenant: '—', rate: '—', period: '—' }],
        idleOnChange: this.idleOnChange(id, u),
        fias: this.fiasOf(id, u), cadastre: this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных', fias: this.fiasOf(id, u),
        cadLabel: u.status === 'Продано' ? 'Наименование актуальной т.т.' : 'Кадастровый №',
        cadValue: u.status === 'Продано'
          ? (this.soldTt[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных')
          : (this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных'),
        // категорию проданной точки берём из её названия единой функцией traffic.js
        ttCat: (() => {
          if (u.status !== 'Продано') return '—';
          const nm = this.soldTt[id + '|' + String(u.number).split(',')[0].trim()];
          if (!nm) return 'нет данных';
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf({ brand: nm }) : null;
          return (c && c.name) || 'нет данных';
        })(),
        mgmtCo: this.mgmtOf(id, u).co,
        mgmtRate: this.mgmtOf(id, u).rate,
        mgmtDu: this.mgmtOf(id, u).du,
        mgmtActive: this.mgmtOf(id, u).co === 'без управления' ? '—' : (u.mgmtActive || ((u.mgmtCo || this.mgmtOf(id, u).du) ? 'активен' : 'не активен')),
        mgmtPaid: u.mgmtPaid || this.mgmtAccrued(id, u),
        mgmtDiscount: u.mgmtDiscount || '—',
        rentDiscount: u.rentDiscount || '—',
        rentPaid: u.rentPaid || this.rentAccrued(id, u),
        rentDebt: u.rentDebt || '—',
        mgmtDebt: u.mgmtDebt || '—', penalties: u.penalties || '—',
        turnoverMonths: Array.from({ length: 12 }, (_, i) => { const m = i + 1; const active = (this.state.turnoverMonth || 1) === m;
          return { m, onClick: () => this.setState({ turnoverMonth: m }), bg: active ? accent : 'rgba(0,0,0,0.06)', fg: active ? '#fff' : vals.textColor, fw: active ? 700 : 400 }; }),
        turnoverValue: (u.turnover && u.turnover[this.state.turnoverMonth || 1]) || 'нет данных',
        mgmtNote: u.mgmtNote === undefined ? 'в выгрузке КП нет данных об управлении и долгах' : u.mgmtNote,
        bti: u.btiN || null,
        btiOrDash: u.btiN || 'не указаны',
        insurance: u.insurance || 'нет',
        cxUtil: this.occupiedFullYTD(id, u) ? '0 ₽' : (this.cxUtilOf(id, u) || '—'), cxUtilC: this.occupiedFullYTD(id, u) ? this.cxColor('0 ₽') : this.cxColor(this.cxUtilOf(id, u)),
        utilOpen: !!(this.state.utilOpen || {})[id + '|' + idx], utilChevron: (this.state.utilOpen || {})[id + '|' + idx] ? 'rotate(180deg)' : 'rotate(0deg)',
        toggleUtil: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = id + '|' + idx; this.setState(s => ({ utilOpen: { ...(s.utilOpen || {}), [k]: !(s.utilOpen || {})[k] } })); },
        ukLabel: (this.literUk && this.literUk[String(id).split('_')[0]]) || 'УК МКД',
        ...this.secVals(id, idx),
        cxUtilMkd: u.cxUtilMkd || this.costStr('uk', id, u), cxUtilElec: this.utilStr('e', id, u), cxUtilWater: this.utilStr('w', id, u), cxUtilHeat: this.utilStr('h', id, u),
        cxSecurity: u.cxSecurity || '—', cxSecurityC: this.cxColor(u.cxSecurity),
        cxCleaning: u.cxCleaning || '—', cxCleaningC: this.cxColor(u.cxCleaning),
        cxTO: u.cxTO || '—', cxTOC: this.cxColor(u.cxTO),
        cxAdmin: this.cxAdminOf(id, u), cxAdminC: this.cxColor(this.cxAdminOf(id, u)),
        cxTaxes: this.cxTaxesOf(id, u), cxTaxesC: this.cxColor(this.cxTaxesOf(id, u)),
        cxInsurance: u.cxInsurance || '—', cxInsuranceC: this.cxColor(u.cxInsurance),
        cxKpiAgent: u.cxKpiAgent || '—', cxKpiAgentC: this.cxColor(u.cxKpiAgent),
        cxTotal: this.cxTotalOf(id, u),
        opStart: this.startInvest(u),
        opRepair: this.opRepairOf(u, id),
        opAnchor: u.opAnchor || '—',
        opLoss: u.opLoss || '—',
        effNoi: u.effNoi || this.noiOf(id, u, this.cxTotalOf(id, u)),
        effPayback: u.effPayback || this.paybackOf(id, u),
        effRoi: u.effRoi || this.roiOf(id, u),
        effCapRate: u.effCapRate || this.capRateOf(id, u),
        effPriceDyn: u.effPriceDyn || '—', effPriceDynC: this.growthColor(u.effPriceDyn),
        effFull: this.fullYieldOf(id, u), effFullC: this.growthColor(this.fullYieldOf(id, u)), effFullTitle: this.fullYieldTitle(id, u),
        effFair: this.fairValueOf(id, u), effFairTitle: this.fairValueTitle(id, u),
        fairColor: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        fairBorder: /Продано/i.test(u.status || '') ? 'rgba(224,147,141,0.35)' : 'rgba(163,49,43,0.22)',
        effCap: u.effCap || '14%',
        effSpread: u.effSpread || this.spreadOf(id, u), effSpreadC: this.growthColor(u.effSpread || this.spreadOf(id, u)),
        effOpexBack: u.effOpexBack || this.opexBackOf(id, u),
        effGrowth: u.effGrowth || this.assetGrowth(id, u), effGrowthYear: this.assetGrowthYear(id, u), effGrowthC: this.growthColor(this.assetGrowth(id, u)),
        opTotal: this.sumRub(this.opUnit(u, id), ['opStart', 'opRepair', 'opAnchor', 'opLoss']),
        ...this.chip(this.unitStatus(id, u)), ...this.donutsOf(id, u),
        ...this.regRow(id, u) }))
        .map((u, i) => ({ ...u, _i: i }))
        .sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
      {
        const fs = list.findIndex(x => x.sold);
        // непроданные — одной строкой, проданные — по две в ряд с новой строки
        list.forEach((x, i) => {
          x.colStart = (fs >= 0 && i === fs) ? '1' : 'auto';
          x.rowBreak = fs >= 0 && i === fs;
          x.cardFlex = '0 0 300px';
        });
      }
      const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
      const bCfg = this.bFloors[id] || null;
      const fi = this.state.floorIdx || 0;
      const fp = bCfg ? bCfg.floors[fi] : (this.floorPlans[id] || null);
      const rects = bCfg ? ((bCfg.floors[fi] && bCfg.floors[fi].boxes) ? bCfg.floors[fi].boxes.map(b => [{ poly: b }]) : null) : (this.planBoxes[id] || null);
      const hoveredIdx = this.state.hoveredUnitIdx;
      const bboxOf = (b) => b.poly ? (() => { const xs = b.poly.map(p => p[0]), ys = b.poly.map(p => p[1]); const l = Math.min(...xs), t = Math.min(...ys); return { l, t, w: Math.max(...xs) - l, h: Math.max(...ys) - t }; })() : b;
      const ptsOf = (b) => b.poly ? b.poly.map(p => p.join(',')).join(' ') : `${b.l},${b.t} ${b.l + b.w},${b.t} ${b.l + b.w},${b.t + b.h} ${b.l},${b.t + b.h}`;
      const centers = rects ? rects.map(grp => { const bb = bboxOf(grp[0]); return { left: (bb.l + bb.w / 2) + '%', top: (bb.t + bb.h / 2) + '%' }; }) : null;
      const highlightBoxes = centers ? centers.map((c, idx) => ({ ...c, opacity: hoveredIdx === idx ? 1 : 0 })) : null;
      const outlineOf = (idx) => (rects && idx != null && rects[idx]) ? rects[idx].map(b => ({ points: ptsOf(b) })) : null;
      vals.hoverOutline = outlineOf(hoveredIdx);
      const bFloor = bCfg ? bCfg.floors[fi] : null;
      vals.mopShapes = (bCfg ? ((bFloor && bFloor.mop) || []) : (this.planMop[id] || [])).map(b => ({ points: ptsOf(Array.isArray(b) ? { poly: b } : b) }));
      vals.unitOutlines = [];
      vals.planFloorTabs = bCfg ? bCfg.floors.map((f, i) => ({ label: f.label,
        border: i === fi ? '#a3312b' : '#c3bdb0', bg: i === fi ? '#a3312b' : 'transparent', color: i === fi ? '#fffdf9' : '#948f83',
        onClick: () => this.setState({ floorIdx: i, zoomHoverIdx: null }) })) : null;
      const bAll = bCfg ? bCfg.floors.filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((acc, f) => acc.concat(f.units || []), []) : null;
      const bArea = bAll ? bAll.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0) : 0;
      vals.selectedInfo = { name: this.names[id], rnv: this.rnv[id],
        commercial: bAll ? bAll.length : list.length,
        units: bAll ? (bArea > 0 ? fmtArea(bArea) : null) : (area > 0 ? fmtArea(area) : null),
        commercialLabel: (String(id).startsWith('zu') || String(id).startsWith('stop')) ? 'Мест в аренду' : 'Коммерческих помещений',
        statusChips: (() => {
          const src = bAll || (this.units[id] || []);
          const m = {};
          for (const u of src) {
            const s = this.unitStatus(id, u);
            if (!m[s]) m[s] = { n: 0, a: 0 };
            m[s].n++;
            const n = parseFloat(String(u.area).replace(',', '.'));
            if (isFinite(n)) m[s].a += n;
          }
          return Object.keys(m).map(s => ({ label: s, count: m[s].n, area: fmtArea(m[s].a), ...(() => { const c = this.chip(s); return { bg: c.chipBg, fg: c.chipFg, bd: c.chipBd }; })() }));
        })(),
        addr: (this.literAddr[String(id).split('_')[0]] || (bCfg ? bCfg.addr : null)),
        uk: (this.literUk && this.literUk[String(id).split('_')[0]]) || null,
        tenants: (() => { const r = (this.tenantsReg[id] || []).filter(t => !t.unit).map(t => ({ ...t, title: (t.brand && t.brand !== '—') ? t.brand : t.tenant })); return r.length ? r : null; })(),
        planLabel: bCfg ? 'Поэтажный план' : 'Поэтажный план · 1 этаж (подъезд)',
        planNote: bCfg ? 'Планы из техпаспорта. Кликните по плану, чтобы увеличить' : 'Серым выделены места общего пользования (МОП): лестницы, лифты, коридоры. Наведите на карточку помещения — его контур подсветится на плане',
        unitsList: (() => {
          const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
          // непроданные — одной строкой, проданные — по две в ряд с новой строки
          return list.map((u, i) => ({ ...u,
            rowBreak: fs >= 0 && i === fs,
            cardFlex: '0 0 300px',
            onEnter: () => this.setState({ hoveredUnitIdx: u._i }), onLeave: () => this.setState({ hoveredUnitIdx: null }) }));
        })(),
        planImg: fp ? fp.img : null, planAspect: fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null, planW: fp ? (fp.ratio < 0.4 ? '26%' : (fp.ratio < 0.6 ? '34%' : '62%')) : '62%', highlightBoxes };
      if (vals.selectedInfo) {
        const un = (vals.selectedInfo.unitsList || []);
        vals.selectedInfo.unitsUnsold = un.filter((u) => !/Продано/i.test(String(u.status || '')));
        const so = un.filter((u) => /Продано/i.test(String(u.status || '')));
        vals.selectedInfo.unitsSold = so.length ? so : null;
      }
      vals.openPlanZoom = () => this.setState({ planZoom: true });
      this.cardsScrollVals(vals);
      vals.planZoomImg = (this.state.planZoom && fp) ? fp.img : null;
      vals.stopProp = (e) => e.stopPropagation();
      {
        const zi = this.state.zoomHoverIdx;
        const zoomUnits = srcList || [];
        // зоны наведения — по контуру помещения; мелкие фигуры рисуем последними, чтобы они были доступны поверх крупных
        vals.zoomHoverZones = rects ? rects.flatMap((grp, idx) => grp.map(b => {
          const bb = bboxOf(b);
          return { points: ptsOf(b), area: bb.w * bb.h,
            onHover: () => this.setState({ zoomHoverIdx: idx }), onUnhover: () => this.setState({ zoomHoverIdx: null }) };
        })).sort((a, b) => b.area - a.area) : null;
        vals.zoomPins = centers ? centers.map((c, idx) => ({ ...c, opacity: zi === idx ? 1 : 0 })) : null;
        vals.zoomOutline = outlineOf(zi);
        if (zi != null && rects && rects[zi] && zoomUnits[zi]) {
          const bb = bboxOf(rects[zi][0]);
          const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
          const zr = (this.tenantsReg[id] || []).find(t => t.unit && String(zoomUnits[zi].number).split(',')[0].trim() === t.unit) || null;
          vals.zoomTooltip = { ...zoomUnits[zi], status: this.unitStatus(id, zoomUnits[zi]),
            sold: /Продано/i.test(zoomUnits[zi].status || ''),
            price: /Продано/i.test(zoomUnits[zi].status || '') ? null : zoomUnits[zi].price,
            company: /Продано/i.test(zoomUnits[zi].status || '') ? null : zoomUnits[zi].company,
            actual: (this.actualPrice(id, zoomUnits[zi]) || {}).value || null,
            factPrice: (this.saleOf(id, zoomUnits[zi]) || {}).fact || null,
            sale: this.saleOf(id, zoomUnits[zi]),
            growth: this.saleGrowth(id, zoomUnits[zi]),
            regBrand: zr && zr.brand && zr.brand !== '—' ? zr.brand : null,
            regTenant: zr ? zr.tenant : null,
            regRate: zr && zr.rate && zr.rate !== '—' ? zr.rate : null,
            left: clamp(bb.l + bb.w / 2, 14, 86) + '%',
            top: clamp(bb.t + bb.h / 2, 12, 82) + '%',
            tf: 'translate(-50%, -50%)', mt: '0px' };
        } else { vals.zoomTooltip = null; }
      }
      vals.planZoomAspect = fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null;
      vals.planZoomW = fp ? `min(92vw, calc(88vh * ${fp.ratio.toFixed(4)}))` : '92vw';
    } else {
      vals.selectedInfo = null;
      vals.planZoomImg = null;
    }
    vals.closePlanZoom = () => this.setState({ planZoom: false, zoomHoverIdx: null });

    // карта трафика
    vals.trafficVisible = !!this.state.trafficOverlay;
    vals.trafficPanelVisible = !!this.state.trafficData;
    vals.trafficHidePanel = () => this.setState({ trafficData: false });
    vals.trafficOverlayBg = this.state.trafficOverlay ? '#a3312b' : 'transparent';
    vals.trafficOverlayFg = this.state.trafficOverlay ? '#ffffff' : '#a3312b';
    vals.trafficDataBg = this.state.trafficData ? '#a3312b' : 'transparent';
    vals.trafficDataFg = this.state.trafficData ? '#ffffff' : '#a3312b';
    vals.toggleTrafficOverlay = () => this.setState((s) => ({ trafficOverlay: !s.trafficOverlay }));
    vals.toggleTrafficData = () => this.setState((s) => ({ trafficData: !s.trafficData }));
    {
      const tr = (window.OMTraffic && (this.state.trafficOverlay || this.state.trafficData)) ? window.OMTraffic.build(this, vals) : null;
      vals.trafficMarks = tr ? tr.marks : [];
      vals.trafficLines = tr ? tr.lines : [];
      vals.trafficMagnets = tr ? tr.magnets : [];
      vals.trafficVacancies = tr ? tr.vacancies : [];
      vals.trafficStats = tr ? tr.stats : [];
      vals.trafficNote = tr ? tr.note : '';
    }

    vals.toggleSummary = () => this.toggleSummary();
    vals.enterSummary = () => this.setState({ summaryHovered: true });
    vals.leaveSummary = () => this.setState({ summaryHovered: false });
    vals.summaryVisible = this.state.summaryHovered || this.state.summaryPinned;

    vals.problemsVisible = this.state.problemsVisible;
    vals.toggleProblems = () => this.setState(s => ({ problemsVisible: !s.problemsVisible }));
    vals.efficiencyVisible = this.state.efficiencyVisible;
    vals.toggleEfficiency = () => this.setState(s => ({ efficiencyVisible: !s.efficiencyVisible }));
    this.occupancyVals(vals);
    this.marketRentVals(vals);

    {
      const vacant = [];
      for (const key in this.units) for (const u of this.units[key]) {
        if (this.isVacantStatus(u.status)) vacant.push(`${this.names[key]} №${u.number} (${u.area}) — ${u.status}`);
      }
      vals.vacantColor = vacant.length ? '#a3312b' : '#3a7a42';
      vals.vacantText = vacant.length ? `Нарушение: ${vacant.length} пустующих помещений` : 'Нарушение отсутствует — пустующих помещений нет';
      vals.vacantList = vacant;

      const vacUnits = [];
      for (const key in this.units) for (const u of this.units[key]) {
        if (this.isVacantStatus(u.status)) vacUnits.push({ number: u.number, area: u.area, location: this.names[key], areaNum: parseFloat(u.area.replace(',', '.')) });
      }
      vacUnits.sort((a, b) => b.areaNum - a.areaNum);
      vals.topRented = vacUnits.slice(0, 5);

      const catOf = (company) => {
        if (/ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(company)) return 'Владельцы (фонды, ПИФ, физлица)';
        if (/^ИП /.test(company)) return 'ИП';
        return 'Компании';
      };
      const cats = {};
      for (const key in this.units) for (const u of this.units[key]) {
        if (!u.company) continue;
        const cat = catOf(u.company);
        if (!cats[cat]) cats[cat] = { count: 0, area: 0 };
        cats[cat].count++; cats[cat].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.tenantCategories = Object.keys(cats).map(c => `${c}: ${cats[c].count} (${this.fmtArea(cats[c].area)})`);
    }

    vals.openTotal = () => this.openSummaryFilter('total', 'Все коммерческие помещения');
    vals.openSold = () => this.openSummaryFilter('sold', 'Проданные помещения');
    vals.openDvk = () => this.openSummaryFilter('dvk', 'Передано в ДВК (личные фонды)');
    vals.openLeased = () => this.openSummaryFilter('leased', 'Сдано в аренду');
    vals.openRented = () => this.openSummaryFilter('vacant', 'Вакантные / в простое');
    vals.closeSummaryFilter = () => this.setState({ summaryFilter: null, summaryPinned: true });
    if (this.state.summaryFilter) {
      const key = this.state.summaryFilter.key;
      const pred = key === 'total' ? (() => true)
        : key === 'sold' ? (u => u.status === 'Продано')
        : key === 'dvk' ? (u => this.isLeasedStatus(u.status) && this.isFund(u))
        : key === 'leased' ? (u => this.isLeasedStatus(u.status) && !this.isFund(u))
        : (u => this.isVacantStatus(u.status));
      const list = [];
      for (const bkey in this.units) for (const u of this.units[bkey]) {
        if (pred(u)) list.push({ ...u, location: this.names[bkey],
          status: this.unitStatus(bkey, u),
          liqColor: this.liqColors[u.liq] || 'transparent',
          strike: u.status === 'Продано' ? 'line-through' : 'none',
          role: this.isFund(u) ? 'Владелец' : (this.isLeasedStatus(u.status) ? 'Арендатор' : 'Правообладатель') });
      }
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list };
    } else {
      vals.summaryFilterInfo = null;
    }

    this.summaryExtra(vals);
    return vals;
  }
  };
};

window.OMJKLogic[4] = function (DCLogic) {
  return class JK extends window.GenplanCore(DCLogic) {
  componentDidMount() {
    const apply = () => {
      const d = window.__SM_DATA_4, p = window.__SM_PLANS_4;
      if (!d || !p || !window.OMPriceNet) return false;
      this.units = d.units;
      // рыночная цена помещений — цена нетто из реестра рекомендуемых цен (август 2026)
      if (window.OMPriceNet) window.OMPriceNet.apply(4, this.units);
      this.rnv = d.rnv;
      if (window.OMSales && window.OMSales[4]) this.sales = window.OMSales[4];
      if (d.tenantsReg) this.tenantsReg = d.tenantsReg;
      this.floorPlans = p.floorPlans;
      this.planBoxes = p.planBoxes;
      this.planMop = p.planMop;
      this.bFloors = p.buildingFloors || {};
      // ОСК бульвара (№12014 / №605) — цены нетто по реестру «Бульвар Самолет» (09.09.2026)
      window.OMPriceNet.applyB(4, this.bFloors);
      // прайсовые ставки аренды ОСК — «Расчёт ставок аренды Бульвар Самолет» (09.09.2026)
      if (window.OMRentPrice) window.OMRentPrice.apply(4, this.bFloors);
      this.forceUpdate();
      return true;
    };
    if (!apply()) {
      const t = setInterval(() => { if (apply()) clearInterval(t); }, 60);
      setTimeout(() => clearInterval(t), 20000);
    }
  }

  // контуры подъездов на кропе генплана (% от изображения); литеры Г-образные: два крыла = два подъезда
  // контуры подъездов на кропе генплана (% от изображения)
  polys = {
    '22_3': [[7.0,9.5],[14.6,9.5],[14.6,16.7],[10.5,16.7],[10.5,15.1],[8.06,15.1],[8.06,18.2],[7.0,18.2]],
    '22_4': [[14.85,9.5],[21.2,9.5],[21.2,16.7],[14.85,16.7]],
    '22_2': [[8.06,15.1],[10.5,15.1],[10.5,25.9],[7.9,25.9],[7.9,28.7],[7.0,28.7],[7.0,18.2],[8.06,18.2]],
    '22_1': [[7.9,25.9],[10.5,25.9],[10.5,39.3],[7.0,39.3],[7.0,28.7],[7.9,28.7]],
    // две остановки слева от литера 23
    'stop6': [[51.0,6.8],[52.4,6.8],[52.4,7.9],[51.0,7.9]],
    'stop7': [[50.7,9.9],[52.8,9.9],[52.8,11.5],[50.7,11.5]],
    '23_1': [[53.0,9.2],[59.0,9.2],[59.0,16.65],[53.0,16.65]],
    '23_2': [[59.4,9.2],[65.4,9.2],[65.4,16.65],[59.4,16.65]],
    '23_3': [[65.8,9.2],[71.6,9.2],[71.6,16.8],[65.8,16.8]],
    '24_1': [[76.6,9.1],[82.95,9.1],[82.95,16.7],[76.6,16.7]],
    '24_2': [[82.95,9.1],[90.6,9.1],[90.6,17.85],[89.74,17.85],[89.74,15.1],[87.1,15.1],[87.1,16.7],[82.95,16.7]],
    '24_3': [[87.1,15.1],[89.74,15.1],[89.74,17.85],[90.6,17.85],[90.6,27.8],[89.9,27.8],[89.9,25.1],[87.1,25.1]],
    '24_4': [[87.1,25.1],[89.9,25.1],[89.9,27.8],[90.6,27.8],[90.6,39.3],[87.1,39.3]],
    // остановка слева от литера 21
    'stop3': [[3.35,88.3],[4.2,88.3],[4.2,90.4],[3.35,90.4]],
    '21_3': [[7.7,61.3],[10.9,61.3],[10.9,71.6],[8.4,71.6],[8.4,74.0],[7.7,74.0]],
    '21_2': [[8.4,71.6],[10.9,71.6],[10.9,81.3],[8.3,81.3],[8.3,83.6],[7.7,83.6],[7.7,74.0],[8.4,74.0]],
    '21_1': [[8.3,81.3],[10.8,81.3],[10.8,82.8],[14.9,82.8],[14.9,92.1],[7.7,92.1],[7.7,83.6],[8.3,83.6]],
    '19_2': [[53.0,84.5],[59.1,84.5],[59.1,91.8],[53.0,91.8]],
    '19_1': [[59.1,84.5],[66.1,84.5],[66.1,91.8],[59.1,91.8]],
    '20_2': [[77.5,84.5],[84.45,84.5],[84.45,91.8],[77.5,91.8]],
    '20_1': [[84.45,84.5],[90.7,84.5],[90.7,91.8],[84.45,91.8]],
    'comm_1': [[7.07,47.22],[22.59,47.22],[22.59,51.4],[7.07,51.4]],
    'comm_2': [[77.87,44.32],[93.4,44.32],[93.4,48.28],[77.87,48.28]],
    // зона аренды земельного участка «Кружка» — справа от западной ОСК
    'zu_kruzhka2': [[46.80,46.50],[47.32,46.60],[47.80,46.88],[48.21,47.32],[48.53,47.90],[48.73,48.58],[48.80,49.30],[48.73,50.02],[48.53,50.70],[48.21,51.28],[47.80,51.72],[47.32,52.00],[46.80,52.10],[46.28,52.00],[45.80,51.72],[45.39,51.28],[45.07,50.70],[44.87,50.02],[44.80,49.30],[44.87,48.58],[45.07,47.90],[45.39,47.32],[45.80,46.88],[46.28,46.60]],
    'zu_kruzhka': [[25.60,46.50],[26.12,46.60],[26.60,46.88],[27.01,47.32],[27.33,47.90],[27.53,48.58],[27.60,49.30],[27.53,50.02],[27.33,50.70],[27.01,51.28],[26.60,51.72],[26.12,52.00],[25.60,52.10],[25.08,52.00],[24.60,51.72],[24.19,51.28],[23.87,50.70],[23.67,50.02],[23.60,49.30],[23.67,48.58],[23.87,47.90],[24.19,47.32],[24.60,46.88],[25.08,46.60]],
  };

  names = {
    '19_1': 'Литер 19 · Подъезд 1', '19_2': 'Литер 19 · Подъезд 2',
    '20_1': 'Литер 20 · Подъезд 1', '20_2': 'Литер 20 · Подъезд 2',
    '21_1': 'Литер 21 · Подъезд 1', '21_2': 'Литер 21 · Подъезд 2', '21_3': 'Литер 21 · Подъезд 3', 'stop3': 'Остановка №3',
    '22_1': 'Литер 22 · Подъезд 1', '22_2': 'Литер 22 · Подъезд 2', '22_3': 'Литер 22 · Подъезд 3', '22_4': 'Литер 22 · Подъезд 4',
    '23_1': 'Литер 23 · Подъезд 1', '23_2': 'Литер 23 · Подъезд 2', '23_3': 'Литер 23 · Подъезд 3',
    'stop6': 'Остановка №6', 'stop7': 'Остановка №7',
    '24_1': 'Литер 24 · Подъезд 1', '24_2': 'Литер 24 · Подъезд 2', '24_3': 'Литер 24 · Подъезд 3', '24_4': 'Литер 24 · Подъезд 4',
    'comm_1': 'Коммерция №12014 (Л3)', 'comm_2': 'Коммерция №605',
    'zu_kruzhka': 'Кружка №1', 'zu_kruzhka2': 'Кружка №2',
  };

  // сторона входа на генплане, если автоопределение по поэтажному плану промахивается
  // ключ — подъезд ('22_1') или конкретное помещение ('22_2#10')
  entrySide = { '22_1': 'left', '22_2#10': 'right', '22_2#15': 'left',
    '22_3#22': 'top', '22_3#23': 'top', '22_3#24': 'bottom',
    '22_4#25': 'top',
    '23_2': 'top', '24_1': 'top', '24_2': 'top', '24_3': 'right', '24_4': 'right',
    '20_1#1': 'right', '20_1#4': 'bottom',
    '19_1': 'bottom', '19_2': 'bottom',
    '21_1#1': 'bottom', '21_1#8': 'left', '21_2': 'right' };

  // точная подвижка метки [dx, dy] в % генплана
  entryNudge = { '22_3#24': [0, -1.2] };

  utilJk = 's4';

  residentsCapacity = 7943;

  unitFields(key) {
    const bc = this.bFloors[key];
    const list = (this.units[key] && this.units[key].length) ? this.units[key]
      : (bc ? bc.floors.filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((a, f) => a.concat(f.units || []), []) : []);
    if (!list.length) return { noCommercial: true, commercial: null, unitsLabel: '', units: '', statuses: [] };
    const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
    const counts = {};
    for (const u of list) { const s = this.unitStatus(key, u); counts[s] = (counts[s] || 0) + 1; }
    const isZu = String(key).startsWith('zu') || String(key).startsWith('stop');
    return { noCommercial: false, commercial: list.length,
      commercialLabel: isZu ? 'Мест в аренду' : 'Коммерческих помещений',
      unitsLabel: area > 0 ? (isZu ? 'Площадь участка' : 'Площадь коммерческих помещений') : '', units: area > 0 ? this.fmtArea(area) : '',
      statuses: Object.keys(counts).map(s => `${s}: ${counts[s]}`) };
  }

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
      const opex = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
    for (const k in preds) agg[k] = { c: 0, a: 0, p: 0, r: 0 };
    for (const key in SU) for (const u of SU[key]) {
      const mrU = this.mktRate(u);
      for (const k in preds) if (preds[k](u, key)) { agg[k].c++; agg[k].a += A(u); agg[k].p += P(u); agg[k].r += A(u) * mrU; }
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
        const ox = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
        const opex = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
        stuck.push({ number: u.number, area: u.area, location: this.names[key] || key, days, areaNum: A(u), rate: this.mktRate(u) });
      }
    }
    stuck.sort((a, b) => b.days - a.days || b.areaNum - a.areaNum);
    vals.stuck6Count = stuck.length;
    vals.stuck6Area = fA(stuck.reduce((s, u) => s + u.areaNum, 0));
    {
      const mm0 = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/);
      const mr0 = mm0 ? (parseFloat(mm0[1].replace(/[\s ]/g, '')) || 0) : 0;
      const loss = stuck.reduce((s, u) => s + u.areaNum * (u.rate || mr0) * (u.days / 30.44), 0);
      vals.stuck6Loss = mr0 ? rub(loss) : 'нет данных';
      vals.stuck6LossNote = mr0 ? 'площадь × ставка (прайс бульвара / медиана ' + mr0.toLocaleString('ru-RU') + ' ₽/м²) × срок простоя' : 'нет рыночной ставки';
      vals.buildLossSum = mr0 ? rub(agg.buildLoss.r * 8) : 'нет данных';
      vals.buildLossNote = mr0 ? 'площадь × ставка (прайс бульвара / медиана ' + mr0.toLocaleString('ru-RU') + ' ₽/м²) × 8 мес' : 'нет рыночной ставки';
    }
    // НТО, аренда ЗУ и остановки: собственный расчёт по договорам реестра
    {
      let month = 0, withRate = 0;
      for (const key in (this.tenantsReg || {})) {
        if (!/^(nto|zu|stop)/.test(key)) continue;
        for (const tr of this.tenantsReg[key]) {
          const p = this.ratePick(tr);
          const m = String((p && p.rate) || '').match(/·\s*([\d\s ]+(?:,\d+)?)\s*₽\/мес/);
          if (m) { const v = parseFloat(m[1].replace(/[\s ]/g, '').replace(',', '.')); if (isFinite(v)) { month += v; withRate++; } }
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
        const mm = String((pr && pr.rate) || '').match(/·\s*([\d\s\u00a0]+(?:,\d+)?)\s*₽\/мес/);
        if (mm) { const v = parseFloat(mm[1].replace(/[\s\u00a0]/g, '').replace(',', '.')); if (isFinite(v)) month += v; }
      }
      vals.uLeasedMonth = month ? rub(month) + '/мес' : 'нет данных';
      // максимальный арендный поток и экономическая эффективность по помещениям в аренде
      const mrM = String(this.marketRentStr() || '').match(/:\s*([\d\s\u00a0]+)\s*₽/);
      const mrRate = mrM ? (parseFloat(mrM[1].replace(/[\s\u00a0]/g, '')) || 0) : 0;
      // максимум — вся площадь ЖК без проданных (наши помещения) по рыночной ставке
      const ourArea = Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0));
      const maxMonth = Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0)) || ourArea * mrRate;
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
    const workRentPot = Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0) - ((agg.buildLoss && agg.buildLoss.r) || 0));
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
      R('Потери по стройготовности: ' + vals.buildLossSum, 'Площадь без РНВ и без стройготовности × ставка помещения (прайс бульвара / медиана ЖК) × 8 мес'),
      R('Потери от простоя 6+ мес: ' + vals.stuck6Loss, 'Площадь × ставка помещения (прайс бульвара / медиана ЖК) × срок простоя'),
      H('Правовая эффективность'),
      R('Полученные пени, штрафы и неустойки: — (нет данных)', 'Сумма взысканных пеней, штрафов и неустоек с начала года'),
      H('Прочие маркеры'),
      R('Экономическая заполняемость (economic occupancy): ' + (() => { const mmx = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/); const m2 = mmx ? (parseFloat(mmx[1].replace(/[\s ]/g, '')) || 0) : 0; const pot = (workRentPot || workArea * m2) * 8; return (pot && rentYtdNum) ? pct(rentYtdNum, pot) : 'нет данных'; })(), 'Начисленная аренда / потенциальная при 100% занятости введённых помещений × 100%'),
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
          const mm0 = String((pr0 && pr0.rate) || '').match(/·\s*([\d\s\u00a0]+(?:,\d+)?)\s*₽\/мес/);
          if (mm0) { const v0 = parseFloat(mm0[1].replace(/[\s\u00a0]/g, '').replace(',', '.')); if (isFinite(v0)) factFlowSum += v0 * 12; }
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
        showFlow: /аренд/i.test(this.state.summaryFilter.label || '') && (maxFlowSum = (Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0)) || Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0)) * mrRate2) * 12) > 0,
        maxFlow: Math.round(maxFlowSum).toLocaleString('ru-RU') + ' ₽/год',
        maxFlowNote: 'площадь без проданных × ставка (прайс бульвара / медиана ' + Math.round(mrRate2).toLocaleString('ru-RU') + ' ₽/м²) × 12 мес',
        econEff: (factFlowSum / maxFlowSum * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%',
        econEffColor: (factFlowSum / maxFlowSum) >= 0.9 ? '#3a6b3f' : ((factFlowSum / maxFlowSum) >= 0.7 ? '#9a6b1a' : '#a3312b'),
        econEffNote: 'факт по действующим ставкам ' + Math.round(factFlowSum).toLocaleString('ru-RU') + ' ₽/год из максимума' };
    } else {
      vals.summaryFilterInfo = null;
    }
  }

  renderVals() {
    const SU = this.sumUnits();
    if (window.OMKpAddr) window.OMKpAddr.apply(this, 's4');
    if (window.OMVolumes) this._volInfo = window.OMVolumes.fill(this);
    const vals = {};
    const fmtArea = (n) => this.fmtArea(n);
    const accent = '#2b2a27';
    const theme = this.props.theme || 'light';
    const themes = {
      light: { pageBg: '#f4f2ee', cardBg: '#fffdf9', border: '#ddd8cd', text: '#2b2a27', muted: '#6b6a64', imgCardBg: '#fff', statusNeutralBg: '#f7f5f0', statusGreenBg: '#eef6ee', statusOrangeBg: '#fbf3e6' },
      dark: { pageBg: '#1c1b18', cardBg: '#28261f', border: '#463f31', text: '#f0ece2', muted: '#a89f8f', imgCardBg: '#211f1a', statusNeutralBg: '#332f26', statusGreenBg: '#1f3324', statusOrangeBg: '#3a2c17' },
    };
    const th = themes[theme] || themes.light;
    vals.pageBg = th.pageBg; vals.cardBg = th.cardBg; vals.borderColor = th.border; vals.textColor = th.text;
    vals.mutedColor = th.muted; vals.imgCardBg = th.imgCardBg; vals.statusNeutralBg = th.statusNeutralBg;
    vals.statusGreenBg = th.statusGreenBg; vals.statusOrangeBg = th.statusOrangeBg;
    vals.statusRedBg = theme === 'dark' ? '#3a2420' : '#faf0ee';
    vals.statusNeutralBorder = '#c3bdb0';
    vals.accent = accent;

    vals.leave = () => this.leaveAll();
    vals.showActive = !!this.state.showActive;
    vals.activeBtnBg = this.state.showActive ? '#a3312b' : 'transparent';
    vals.activeBtnFg = this.state.showActive ? '#ffffff' : '#a3312b';
    vals.activeBtnLabel = this.state.showActive ? 'Скрыть актив' : 'Показать актив';
    vals.toggleActive = () => this.setState((s) => ({ showActive: !s.showActive }));
    // карта трафика
    vals.trafficVisible = !!this.state.trafficOverlay;
    vals.trafficPanelVisible = !!this.state.trafficData;
    vals.trafficHidePanel = () => this.setState({ trafficData: false });
    vals.trafficOverlayBg = this.state.trafficOverlay ? '#a3312b' : 'transparent';
    vals.trafficOverlayFg = this.state.trafficOverlay ? '#ffffff' : '#a3312b';
    vals.trafficDataBg = this.state.trafficData ? '#a3312b' : 'transparent';
    vals.trafficDataFg = this.state.trafficData ? '#ffffff' : '#a3312b';
    vals.toggleTrafficOverlay = () => this.setState((s) => ({ trafficOverlay: !s.trafficOverlay }));
    vals.toggleTrafficData = () => this.setState((s) => ({ trafficData: !s.trafficData }));
    {
      const tr = (window.OMTraffic && (this.state.trafficOverlay || this.state.trafficData)) ? window.OMTraffic.build(this, vals) : null;
      vals.trafficMarks = tr ? tr.marks : [];
      vals.trafficLines = tr ? tr.lines : [];
      vals.trafficMagnets = tr ? tr.magnets : [];
      vals.trafficVacancies = tr ? tr.vacancies : [];
      vals.trafficStats = tr ? tr.stats : [];
      vals.trafficNote = tr ? tr.note : '';
    }
    vals.activeMarks = [];
    vals.storefronts = [];
    vals.activeTip = this.state.activeTip || null;
    if (this.state.showActive) {
      for (const k of Object.keys(this.polys)) {
        const all = this.units[k] || [];
        const poly = this.polys[k];
        if (!all.length || !poly) continue;
        const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
        const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
        const boxes = this.planBoxes[k];
        // зоны аренды ЗУ и остановки — один шар в центре объекта, без стрелки
        if (k.startsWith('zu') || k.startsWith('stop') || k.startsWith('nto')) {
          const live = all.filter(u => u.status !== 'Продано');
          if (!live.length) continue;
          const leased = live.some(u => this.isLeasedStatus(u.status) && !this.isFund(u));
          const pal = leased
            ? { c: '#3a7a42', lite: '#6aa370', dark: '#27562d', glow: 'rgba(58, 122, 66, 0.7)' }
            : { c: '#a3312b', lite: '#c4645e', dark: '#7d2521', glow: 'rgba(163, 49, 43, 0.7)' };
          vals.activeMarks.push({ pe: 'none', key: k, left: (bx0 + bx1) / 2 + '%', top: (by0 + by1) / 2 + '%', dot: true,
            c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
          continue;
        }
        const rows = [];
        all.forEach((u, gi) => {
          if (u.status === 'Продано') return;
          const shp = boxes && boxes[gi] && boxes[gi][0];
          let cx = null, cy = null, bb = null;
          if (shp) {
            if (shp.poly) {
              const px = shp.poly.map(p => p[0]), py = shp.poly.map(p => p[1]);
              bb = { x0: Math.min(...px), x1: Math.max(...px), y0: Math.min(...py), y1: Math.max(...py) };
            } else { bb = { x0: shp.l, x1: shp.l + shp.w, y0: shp.t, y1: shp.t + shp.h }; }
            cx = (bb.x0 + bb.x1) / 2; cy = (bb.y0 + bb.y1) / 2;
          }
          rows.push({ u, gi, cx, cy, bb });
        });
        rows.forEach((r, i) => { if (r.cy == null) { r.cx = 50; r.cy = (i + 0.5) / rows.length * 100; } });
        // сторона входа = ближайшая наружная стена помещения на поэтажном плане
        const buckets = { left: [], right: [], top: [], bottom: [] };
        const forced = this.entrySide[k];
        rows.forEach((r) => {
          const num = String(r.u.number).split(',')[0].trim();
          const own = this.entrySide[k + '#' + num] || forced;
          if (own) { buckets[own].push(r); return; }
          const d = { left: r.cx, right: 100 - r.cx, top: r.cy, bottom: 100 - r.cy };
          let side = 'left';
          for (const s of ['right', 'top', 'bottom']) if (d[s] < d[side]) side = s;
          buckets[side].push(r);
        });
        const ROT = { left: '0deg', right: '180deg', top: '90deg', bottom: '270deg' };
        for (const side of ['left', 'right', 'top', 'bottom']) {
          const arr = buckets[side];
          if (!arr.length) continue;
          const vertical = side === 'left' || side === 'right';
          arr.sort((a, b) => (vertical ? a.cy - b.cy : a.cx - b.cx));
          let prev = -99;
          arr.forEach((r) => {
            let along = vertical ? by0 + r.cy / 100 * (by1 - by0) : bx0 + r.cx / 100 * (bx1 - bx0);
            const gap = vertical ? 2.1 : 2.6;
            if (along - prev < gap) along = prev + gap;
            prev = along;
            const num = String(r.u.number).split(',')[0].trim();
            const nd = this.entryNudge[k + '#' + num] || this.entryNudge[k] || [0, 0];
            const x = (side === 'left' ? bx0 - 1.5 : side === 'right' ? bx1 + 1.5 : along) + nd[0];
            const y = (side === 'top' ? by0 - 2.6 : side === 'bottom' ? by1 + 2.6 : along) + nd[1];
            const PAL = {
              red: { c: '#a3312b', lite: '#c4645e', dark: '#7d2521', glow: 'rgba(163, 49, 43, 0.7)' },
              green: { c: '#3a7a42', lite: '#6aa370', dark: '#27562d', glow: 'rgba(58, 122, 66, 0.7)' },
              black: { c: '#2e2a24', lite: '#5c564d', dark: '#141210', glow: 'rgba(46, 42, 36, 0.6)' },
            };
            const rnvD = this.rnv[k] ? (() => { const p = String(this.rnv[k]).split('.').map(Number); return new Date(p[2], p[1] - 1, p[0]); })() : null;
            const building = rnvD && rnvD > new Date();
            const st = this.unitStatus(k, r.u);
            const pal = (building || /Не введено/i.test(st)) ? PAL.black : /аренде/i.test(st) ? PAL.green : PAL.red;
            const tipR = (this.tenantsReg[k] || []).find(t => t.unit && String(r.u.number).split(',')[0].trim() === t.unit) || null;
            const tipRate = (tipR && this.ratePick) ? (this.ratePick(tipR) || {}).rate : null;
            const tipName = tipR ? ((tipR.brand && tipR.brand !== '—') ? tipR.brand : tipR.tenant) : null;
            const tip = 'Пом. ' + String(r.u.number).split(',')[0].trim() + ' · ' + (r.u.area || '')
              + (tipName ? ' · ' + tipName : ' · нет арендатора')
              + ' · ставка: ' + (tipRate || 'нет данных') + ' · ' + st;
            // витрина окрашена по категории арендатора (traffic.js), пустая — чёрным
            const sfCat = (tipR && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(tipR) : null;
            const sfColor = tipR ? ((sfCat && sfCat.c) || '#4b2e83') : '#a3312b';
            const sfTip = tip + (sfCat ? ' · категория: ' + sfCat.name : '');
            vals.activeMarks.push({ pe: 'auto', tip, onTip: () => this.setState({ activeTip: { text: tip, left: x + '%', top: y + '%' } }), offTip: () => this.setState({ activeTip: null }), key: k + '_' + r.gi, left: x + '%', top: y + '%', rot: 'rotate(' + ROT[side] + ')',
              c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
            // витрина: протяжённость помещения вдоль фасада берём из поэтажного плана
            // (контур помещения в % кропа) и проецируем на соответствующее ребро подъезда
            if (r.bb) {
              const to = (v) => (vertical ? by0 + v / 100 * (by1 - by0) : bx0 + v / 100 * (bx1 - bx0));
              let a0 = to(vertical ? r.bb.y0 : r.bb.x0), a1 = to(vertical ? r.bb.y1 : r.bb.x1);
              const minLen = (vertical ? (by1 - by0) : (bx1 - bx0)) * 0.12;
              if (a1 - a0 < minLen) { const mid = (a0 + a1) / 2; a0 = mid - minLen / 2; a1 = mid + minLen / 2; }
              a0 = Math.max(vertical ? by0 : bx0, a0); a1 = Math.min(vertical ? by1 : bx1, a1);
              const ins = 0.3;
              const fx = side === 'left' ? bx0 + ins : bx1 - ins;
              const fy = side === 'top' ? by0 + ins : by1 - ins;
              const toX = (v) => bx0 + v / 100 * (bx1 - bx0);
              const toY = (v) => by0 + v / 100 * (by1 - by0);
              // угловое помещение выходит на две наружные стены — витрину рисуем углом
              const dd = { left: r.bb.x0, right: 100 - r.bb.x1, top: r.bb.y0, bottom: 100 - r.bb.y1 };
              const perp = vertical ? ['top', 'bottom'] : ['left', 'right'];
              const sec = perp.reduce((a, b) => (dd[b] < dd[a] ? b : a));
              const corner = null; // углы витрин отключены — ищем более аккуратную геометрию
              const f2 = (a, b) => a.toFixed(2) + ',' + b.toFixed(2);
              const sfPoints = (() => {
                if (!corner) return vertical ? (f2(fx, a0) + ' ' + f2(fx, a1)) : (f2(a0, fy) + ' ' + f2(a1, fy));
                const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
                if (vertical) {
                  const cy = corner === 'top' ? by0 + ins : by1 - ins;
                  const far = cl(side === 'left' ? toX(r.bb.x1) : toX(r.bb.x0), bx0 + ins, bx1 - ins);
                  return f2(fx, corner === 'top' ? a1 : a0) + ' ' + f2(fx, cy) + ' ' + f2(far, cy);
                }
                const cx2 = corner === 'left' ? bx0 + ins : bx1 - ins;
                const far = cl(side === 'top' ? toY(r.bb.y1) : toY(r.bb.y0), by0 + ins, by1 - ins);
                return f2(corner === 'left' ? a1 : a0, fy) + ' ' + f2(cx2, fy) + ' ' + f2(cx2, far);
              })();
              vals.storefronts.push({ tip: sfTip,
                onTip: () => this.setState({ activeTip: { text: sfTip,
                  left: (vertical ? fx : (a0 + a1) / 2) + '%', top: (vertical ? (a0 + a1) / 2 : fy) + '%' } }),
                offTip: () => this.setState({ activeTip: null }),
                key: 'sf_' + k + '_' + r.gi, c: sfColor,
                cat: tipR ? ((sfCat && sfCat.name) || 'Прочее') : 'Свободно',
                points: sfPoints });
            }
          });
        }
      }
    }
    // сноска по цветам витрин: только категории, встречающиеся в этом ЖК
    {
      const agg = {};
      for (const sf of (vals.storefronts || [])) {
        if (!agg[sf.cat]) agg[sf.cat] = { name: sf.cat, c: sf.c, n: 0 };
        agg[sf.cat].n++;
      }
      const list = Object.keys(agg).map((k2) => agg[k2]);
      list.sort((a, b) => (a.name === 'Свободно' ? 1 : b.name === 'Свободно' ? -1 : b.n - a.n));
      vals.sfLegend = list;
    }
    vals.buildingPolys = Object.keys(this.polys).map((k) => {
      const hov = this.state.hovered === k || this.state.selected === k;
      return { id: k, points: this.polys[k].map(p => p.join(',')).join(' '),
        fill: 'transparent',
        stroke: hov ? '#a3312b' : 'transparent',
        onEnter: () => this.enter(k), onClick: () => this.select(k) };
    });

    if (this.state.hovered && this.polys[this.state.hovered]) {
      const key = this.state.hovered;
      const poly = this.polys[key];
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs);
      const by0 = Math.min(...ys);
      const TIP_W = 18, TIP_H = 30;
      let left, transform;
      if (bx1 + 1 + TIP_W <= 99) { left = (bx1 + 1) + '%'; transform = 'none'; }
      else { left = (bx0 - 1) + '%'; transform = 'translateX(-100%)'; }
      const top = Math.max(1, Math.min(by0, 99 - TIP_H)) + '%';
      vals.activeInfo = { name: this.names[key], left, top, transform, rnv: this.rnv[key], ...this.unitFields(key) };
    } else {
      vals.activeInfo = null;
    }

    vals.closePanel = () => this.closePanel();
    if (this.state.selected) {
      const id = this.state.selected;
      const regFor = (u) => (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
      const bCfg0 = this.bFloors[id] || null;
      const bFloor0 = bCfg0 ? bCfg0.floors[this.state.floorIdx || 0] : null;
      const srcList = (bFloor0 && bFloor0.units) ? bFloor0.units : (this.units[id] || []);
      const list = srcList.map((u, idx) => ({ ...u,
        status: this.unitStatus(id, u),
        liqColor: this.liqColors[u.liq] || 'transparent',
        strike: u.status === 'Продано' ? 'line-through' : 'none',
        notSold: u.status !== 'Продано',
        role: u.role || 'Владелец',
        companyOrDash: u.company || 'не указано',
        marketPrice: u.marketPrice || u.price || 'не указана',
        fias: this.fiasOf(id, u), cadastre: this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных', fias: this.fiasOf(id, u),
        cardBg: /Продано/i.test(u.status || '') ? '#1b1916' : (this.liqColors[u.liq] || 'transparent'),
        fg: /Продано/i.test(u.status || '') ? '#f2ede4' : vals.textColor,
        fgMuted: /Продано/i.test(u.status || '') ? '#a9a196' : vals.mutedColor,
        cornerFg: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        cardPad: /Продано/i.test(u.status || '') ? '7px 10px' : '10px 12px',
        cardAlign: /Продано/i.test(u.status || '') ? 'start' : 'stretch',
        chipMargin: /Продано/i.test(u.status || '') ? '4px 0 5px' : '6px 0 8px',
        rowGap: /Продано/i.test(u.status || '') ? '1px' : '3px',
        rowFont: /Продано/i.test(u.status || '') ? '11px' : '11.5px',
        rowLine: /Продано/i.test(u.status || '') ? '14px' : '16px',
        sale: this.saleOf(id, u),
        // категория торговой точки арендатора — кружок в углу карточки (traffic.js)
        ttChipCat: (() => {
          if (/Продано/i.test(u.status || '')) return null;
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          if (!r) return null;
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.name) || 'Прочее';
        })(),
        ttChipBg: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '1f';
        })(),
        ttChipBd: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '59';
        })(),
        ttChipColor: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.c) || '#4b2e83';
        })(),
        // данные сделки показываем в каждой проданной карточке: нет записи — «нет данных»
        saleDate: (this.saleOf(id, u) || {}).date || 'нет данных',
        saleFact: (this.saleOf(id, u) || {}).fact || 'нет данных',
        saleAgent: (this.saleOf(id, u) || {}).agent || 'нет данных',
        saleBuyer: (this.saleOf(id, u) || {}).buyer || 'нет данных',
        corner: (this.actualPrice(id, u) || {}).value || (/Продано/i.test(u.status || '') ? 'нет данных' : ''),
        ...this.rentGapOf(id, u),
        rentMarket: (this.actualPrice(id, u) || /Продано/i.test(u.status || '') || /^(nto|zu|stop)/.test(String(id))) ? '' : (u.priceRate || String(this.marketRentStr() || '').split(':').pop().trim()),
        rentMarketTitle: u.priceRate ? 'Прайсовая ставка аренды — расчёт ставок «Бульвар Самолет» от 09.09.2026' : 'Актуальная на текущий год рыночная ставка аренды — медиана действующих ставок по ЖК',
        cornerTitle: this.actualPrice(id, u) ? 'Актуальная цена помещения' : 'Актуальная на текущий год рыночная ставка аренды',
        cornerCaption: /Продано/i.test(u.status || '') ? 'Актуальная цена' : '',
        marketPrice: (this.actualPrice(id, u) || {}).value || u.marketPrice || u.price || 'не указана',
        marketLabel: this.actualPrice(id, u) ? 'Актуальная цена' : 'Рыночная цена',
        marketTitle: (this.actualPrice(id, u) || {}).basis || u.marketPrice || u.price || '',
        powerKw: u.powerKw || '',
        idleOnChange: this.idleOnChange(id, u),
        pastRows: this.pastTenants[id + '|' + String(u.number).split(',')[0].trim()] || [{ tenant: '—', rate: '—', period: '—' }],
        saleGrowth: this.saleGrowth(id, u),
        cadLabel: u.status === 'Продано' ? 'Наименование актуальной т.т.' : 'Кадастровый №',
        cadValue: u.status === 'Продано'
          ? (this.soldTt[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных')
          : (this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных'),
        sold: u.status === 'Продано',
        // категорию проданной точки берём из её названия единой функцией traffic.js
        ttCat: (() => {
          if (u.status !== 'Продано') return '—';
          const nm = this.soldTt[id + '|' + String(u.number).split(',')[0].trim()];
          if (!nm) return 'нет данных';
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf({ brand: nm }) : null;
          return (c && c.name) || 'нет данных';
        })(),
        price: u.priceLabel ? u.price : '',
        priceLabel: u.priceLabel || 'Цена по прайсу',
        mgmtCo: u.mgmtCo || 'нет данных',
        mgmtRate: u.mgmtCo === 'без управления' ? '—' : (u.mgmtRate || '—'),
        mgmtActive: u.mgmtActive || (u.mgmtCo ? 'активен' : 'не активен'),
        mgmtPaid: u.mgmtPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.mgmtAccrued(id, u)),
        mgmtDiscount: u.mgmtDiscount || '—',
        rentDiscount: u.rentDiscount || '—',
        rentPaid: u.rentPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.rentAccrued(id, u)),
        rentDebt: u.rentDebt || '—',
        mgmtDebt: u.mgmtDebt || '—', penalties: u.penalties || '—',
        turnoverMonths: Array.from({ length: 12 }, (_, i) => { const m = i + 1; const active = (this.state.turnoverMonth || 1) === m;
          return { m, onClick: () => this.setState({ turnoverMonth: m }), bg: active ? accent : 'rgba(0,0,0,0.06)', fg: active ? '#fff' : vals.textColor, fw: active ? 700 : 400 }; }),
        turnoverValue: (u.turnover && u.turnover[this.state.turnoverMonth || 1]) || 'нет данных',
        mgmtNote: u.mgmtNote === undefined ? 'в выгрузке КП нет данных об управлении и долгах' : u.mgmtNote,
        bti: u.btiN || null,
        btiOrDash: u.btiN || 'не указаны',
        insurance: u.insurance || 'нет',
        cxUtil: this.cxUtilOf(id, u) || '—', cxUtilC: this.cxColor(this.cxUtilOf(id, u)),
        utilOpen: !!(this.state.utilOpen || {})[id + '|' + idx], utilChevron: (this.state.utilOpen || {})[id + '|' + idx] ? 'rotate(180deg)' : 'rotate(0deg)',
        toggleUtil: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = id + '|' + idx; this.setState(s => ({ utilOpen: { ...(s.utilOpen || {}), [k]: !(s.utilOpen || {})[k] } })); },
        ukLabel: (this.literUk && this.literUk[String(id).split('_')[0]]) || 'УК МКД',
        ...this.secVals(id, idx),
        cxUtilMkd: u.cxUtilMkd || this.costStr('uk', id, u), cxUtilElec: this.utilStr('e', id, u), cxUtilWater: this.utilStr('w', id, u), cxUtilHeat: this.utilStr('h', id, u),
        cxSecurity: u.cxSecurity || '—', cxSecurityC: this.cxColor(u.cxSecurity),
        cxCleaning: u.cxCleaning || '—', cxCleaningC: this.cxColor(u.cxCleaning),
        cxTO: u.cxTO || '—', cxTOC: this.cxColor(u.cxTO),
        cxAdmin: this.cxAdminOf(id, u), cxAdminC: this.cxColor(this.cxAdminOf(id, u)),
        cxTaxes: this.cxTaxesOf(id, u), cxTaxesC: this.cxColor(this.cxTaxesOf(id, u)),
        cxInsurance: u.cxInsurance || '—', cxInsuranceC: this.cxColor(u.cxInsurance),
        cxTotal: this.cxTotalOf(id, u),
        opStart: this.startInvest(u), opRepair: this.opRepairOf(u, id), opAnchor: u.opAnchor || '—', opLoss: u.opLoss || '—',
        opTotal: this.sumRub(this.opUnit(u, id), ['opStart', 'opRepair', 'opAnchor', 'opLoss']),
        effNoi: u.effNoi || this.noiOf(id, u, this.cxTotalOf(id, u)), effPayback: u.effPayback || this.paybackOf(id, u), effRoi: u.effRoi || this.roiOf(id, u), effCapRate: u.effCapRate || this.capRateOf(id, u), effPriceDyn: u.effPriceDyn || '—', effPriceDynC: this.growthColor(u.effPriceDyn), effFull: this.fullYieldOf(id, u), effFullC: this.growthColor(this.fullYieldOf(id, u)), effFullTitle: this.fullYieldTitle(id, u),
        effFair: this.fairValueOf(id, u), effFairTitle: this.fairValueTitle(id, u),
        fairColor: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        fairBorder: /Продано/i.test(u.status || '') ? 'rgba(224,147,141,0.35)' : 'rgba(163,49,43,0.22)',
        effCap: u.effCap || '14%', effSpread: u.effSpread || this.spreadOf(id, u), effSpreadC: this.growthColor(u.effSpread || this.spreadOf(id, u)), effOpexBack: u.effOpexBack || this.opexBackOf(id, u), effGrowth: u.effGrowth || this.assetGrowth(id, u), effGrowthYear: this.assetGrowthYear(id, u), effGrowthC: this.growthColor(this.assetGrowth(id, u)),
        ...this.chip(this.unitStatus(id, u)), ...this.donutsOf(id, u),
        ...this.regRow(id, u) }))
        .map((u, i) => ({ ...u, _i: i }))
        .sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
      const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
      const bCfg = this.bFloors[id] || null;
      const fi = this.state.floorIdx || 0;
      const fp = bCfg ? bCfg.floors[fi] : (this.floorPlans[id] || null);
      const rects = bCfg ? ((bCfg.floors[fi] && bCfg.floors[fi].boxes) ? bCfg.floors[fi].boxes.map(b => [{ poly: b }]) : null) : (this.planBoxes[id] || null);
      const hoveredIdx = this.state.hoveredUnitIdx;
      const bboxOf = (b) => b.poly ? (() => { const xs = b.poly.map(p => p[0]), ys = b.poly.map(p => p[1]); const l = Math.min(...xs), t = Math.min(...ys); return { l, t, w: Math.max(...xs) - l, h: Math.max(...ys) - t }; })() : b;
      const ptsOf = (b) => b.poly ? b.poly.map(p => p.join(',')).join(' ') : `${b.l},${b.t} ${b.l + b.w},${b.t} ${b.l + b.w},${b.t + b.h} ${b.l},${b.t + b.h}`;
      const centers = rects ? rects.map(grp => { const bb = bboxOf(grp[0]); return { left: (bb.l + bb.w / 2) + '%', top: (bb.t + bb.h / 2) + '%' }; }) : null;
      const highlightBoxes = centers ? centers.map((c, idx) => ({ ...c, opacity: hoveredIdx === idx ? 1 : 0 })) : null;
      const outlineOf = (idx) => (rects && idx != null && rects[idx]) ? rects[idx].map(b => ({ points: ptsOf(b) })) : null;
      vals.hoverOutline = outlineOf(hoveredIdx);
      vals.mopShapes = (bCfg ? (((bCfg.floors[fi] && bCfg.floors[fi].mop) || []).map(b => ({ poly: b }))) : (this.planMop[id] || [])).map(b => ({ points: ptsOf(b) }));
      vals.planFloorTabs = bCfg ? bCfg.floors.map((f, i) => ({ label: f.label,
        border: i === fi ? '#a3312b' : '#c3bdb0', bg: i === fi ? '#a3312b' : 'transparent', color: i === fi ? '#fffdf9' : '#948f83',
        onClick: () => this.setState({ floorIdx: i, zoomHoverIdx: null }) })) : null;
      const allUnits = bCfg ? bCfg.floors.filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((a, f) => a.concat(f.units || []), []) : srcList;
      const allArea = allUnits.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
      {
        // порядок карточек зафиксирован: в аренде → в простое → не введено → продано
        list.forEach((x, i) => { if (x._i === undefined) x._i = i; });
        list.sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
        const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
        // непроданные — одной строкой, проданные — по две в ряд с новой строки
        list.forEach((x, i) => {
          const sold = /Продано/i.test(String(x.status || ''));
          x.colStart = (fs >= 0 && i === fs) ? '1' : 'auto';
          x.rowBreak = fs >= 0 && i === fs;
          x.cardFlex = '0 0 300px';
        });
      }
      vals.selectedInfo = { name: this.names[id], rnv: this.rnv[id], commercial: allUnits.length, units: allArea > 0 ? fmtArea(allArea) : null,
        statusChips: (() => {
          const m = {};
          for (const u of allUnits) { const s = this.unitStatus(id, u); if (!m[s]) m[s] = { n: 0, a: 0 }; m[s].n++; const n = parseFloat(String(u.area).replace(',', '.')); if (isFinite(n)) m[s].a += n; }
          return Object.keys(m).map(s => { const c = this.chip(s); return { label: s, count: m[s].n, area: m[s].a.toFixed(1).replace('.', ',') + ' м²', bg: c.chipBg, fg: c.chipFg, bd: c.chipBd }; });
        })(),
        commercialLabel: (String(id).startsWith('zu') || String(id).startsWith('stop')) ? 'Мест в аренду' : 'Коммерческих помещений',
        addr: ((this.literAddr && this.literAddr[String(id).split('_')[0]]) || (bCfg ? bCfg.addr : null)),
        uk: (this.literUk && this.literUk[String(id).split('_')[0]]) || null,
        tenants: (() => { const r = (this.tenantsReg[id] || []).filter(t => !t.unit); return r.length ? r : null; })(),
        planLabel: bCfg ? 'Поэтажный план' : 'Поэтажный план · 1 этаж (подъезд)',
        planNote: 'Серым выделены места общего пользования (МОП): лестницы, лифты, коридоры. Наведите на карточку помещения — его контур подсветится на плане',
        unitsList: (() => {
          const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
          // непроданные — одной строкой, проданные — по две в ряд с новой строки
          return list.map((u, i) => ({ ...u,
            rowBreak: fs >= 0 && i === fs,
            cardFlex: '0 0 300px',
            onEnter: () => this.setState({ hoveredUnitIdx: u._i }), onLeave: () => this.setState({ hoveredUnitIdx: null }) }));
        })(),
        planImg: fp ? fp.img : null, planAspect: fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null, planW: fp ? (fp.ratio < 0.4 ? '26%' : (fp.ratio < 0.6 ? '34%' : '62%')) : '62%', highlightBoxes };
      if (vals.selectedInfo) {
        const un = (vals.selectedInfo.unitsList || []);
        vals.selectedInfo.unitsUnsold = un.filter((u) => !/Продано/i.test(String(u.status || '')));
        const so = un.filter((u) => /Продано/i.test(String(u.status || '')));
        vals.selectedInfo.unitsSold = so.length ? so : null;
      }
      vals.openPlanZoom = () => this.setState({ planZoom: true });
      this.cardsScrollVals(vals);
      vals.planZoomImg = (this.state.planZoom && fp) ? fp.img : null;
      vals.stopProp = (e) => e.stopPropagation();
      {
        const zi = this.state.zoomHoverIdx;
        const zoomUnits = srcList || [];
        // зоны наведения — по контуру помещения; мелкие фигуры рисуем последними, чтобы они были доступны поверх крупных
        vals.zoomHoverZones = rects ? rects.flatMap((grp, idx) => grp.map(b => {
          const bb = bboxOf(b);
          return { points: ptsOf(b), area: bb.w * bb.h,
            onHover: () => this.setState({ zoomHoverIdx: idx }), onUnhover: () => this.setState({ zoomHoverIdx: null }) };
        })).sort((a, b) => b.area - a.area) : null;
        vals.zoomPins = centers ? centers.map((c, idx) => ({ ...c, opacity: zi === idx ? 1 : 0 })) : null;
        vals.zoomOutline = outlineOf(zi);
        if (zi != null && rects && rects[zi] && zoomUnits[zi]) {
          const bb = bboxOf(rects[zi][0]);
          const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
          vals.zoomTooltip = { ...zoomUnits[zi], status: this.unitStatus(id, zoomUnits[zi]),
            left: clamp(bb.l + bb.w / 2, 14, 86) + '%',
            top: clamp(bb.t + bb.h / 2, 12, 82) + '%',
            tf: 'translate(-50%, -50%)', mt: '0px' };
        } else { vals.zoomTooltip = null; }
      }
      vals.planZoomAspect = fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null;
      vals.planZoomW = fp ? `min(92vw, calc(88vh * ${fp.ratio.toFixed(4)}))` : '92vw';
    } else {
      vals.selectedInfo = null;
      vals.planZoomImg = null;
    }
    vals.closePlanZoom = () => this.setState({ planZoom: false, zoomHoverIdx: null });

    vals.toggleSummary = () => this.toggleSummary();
    vals.enterSummary = () => this.setState({ summaryHovered: true });
    vals.leaveSummary = () => this.setState({ summaryHovered: false });
    vals.summaryVisible = this.state.summaryHovered || this.state.summaryPinned;

    {
      let totalCount = 0, totalArea = 0, soldCount = 0, soldArea = 0, soldSum = 0,
        dvkCount = 0, dvkArea = 0, leasedCount = 0, leasedArea = 0, rentedCount = 0, rentedArea = 0;
      for (const key in SU) {
        for (const u of (SU[key] || [])) {
          const area = parseFloat(u.area.replace(',', '.'));
          const price = parseFloat((u.price || '').replace(/[^\d]/g, '')) || 0;
          totalCount++; totalArea += area;
          if (u.status === 'Продано') { soldCount++; soldArea += area; soldSum += price; }
          else if (this.isLeasedStatus(u.status) && this.isFund(u)) { dvkCount++; dvkArea += area; }
          else if (this.isLeasedStatus(u.status)) { leasedCount++; leasedArea += area; }
          else if (this.isVacantStatus(u.status)) { rentedCount++; rentedArea += area; }
        }
      }
      vals.totalCount = totalCount; vals.totalArea = fmtArea(totalArea);
      vals.soldCount = soldCount; vals.soldArea = fmtArea(soldArea);
      vals.soldSum = Math.round(soldSum).toLocaleString('ru-RU') + ' ₽';
      vals.soldAvgSqm = soldArea ? Math.round(soldSum / soldArea).toLocaleString('ru-RU') + ' ₽/м²' : '—';
      vals.dvkCount = dvkCount; vals.dvkArea = fmtArea(dvkArea);
      vals.leasedCount = leasedCount; vals.leasedArea = fmtArea(leasedArea);
      vals.rentedCount = rentedCount; vals.rentedArea = fmtArea(rentedArea);
      vals.soldSharePct = totalArea ? Math.round((soldArea / totalArea) * 100) + '%' : '—';
      vals.rentedSharePct = totalArea ? Math.round((rentedArea / totalArea) * 100) + '%' : '—';

      const m = {};
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (!this.isVacantStatus(u.status)) continue;
        if (!m[u.liq]) m[u.liq] = { count: 0, area: 0 };
        m[u.liq].count++; m[u.liq].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.liqRented = Object.keys(m).map(l => `${l}: ${m[l].count} (${fmtArea(m[l].area)})`);
    }

    vals.problemsVisible = this.state.problemsVisible;
    vals.toggleProblems = () => this.setState(s => ({ problemsVisible: !s.problemsVisible }));
    vals.efficiencyVisible = this.state.efficiencyVisible;
    vals.toggleEfficiency = () => this.setState(s => ({ efficiencyVisible: !s.efficiencyVisible }));
    this.occupancyVals(vals);

    {
      const vacant = [];
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (this.isVacantStatus(u.status)) vacant.push(`${this.names[key]} №${u.number} (${u.area}) — ${u.status}`);
      }
      vals.vacantColor = vacant.length ? '#a3312b' : '#3a7a42';
      vals.vacantText = vacant.length ? `Нарушение: ${vacant.length} пустующих помещений` : 'Нарушение отсутствует — пустующих помещений нет';
      vals.vacantList = vacant;

      const vacUnits = [];
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (this.isVacantStatus(u.status)) vacUnits.push({ number: u.number, area: u.area, location: this.names[key], areaNum: parseFloat(u.area.replace(',', '.')) });
      }
      vacUnits.sort((a, b) => b.areaNum - a.areaNum);
      vals.topRented = vacUnits.slice(0, 5);

      const catOf = (company) => {
        if (/ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(company)) return 'Владельцы (фонды, ПИФ, физлица)';
        if (/^ИП /.test(company)) return 'ИП';
        return 'Компании';
      };
      const cats = {};
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (!u.company) continue;
        const cat = catOf(u.company);
        if (!cats[cat]) cats[cat] = { count: 0, area: 0 };
        cats[cat].count++; cats[cat].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.tenantCategories = Object.keys(cats).map(c => `${c}: ${cats[c].count} (${this.fmtArea(cats[c].area)})`);
    }

    vals.openTotal = () => this.openSummaryFilter('total', 'Все коммерческие помещения');
    vals.openSold = () => this.openSummaryFilter('sold', 'Проданные помещения');
    vals.openDvk = () => this.openSummaryFilter('dvk', 'Передано в ДВК (личные фонды)');
    vals.openLeased = () => this.openSummaryFilter('leased', 'Сдано в аренду');
    vals.openRented = () => this.openSummaryFilter('vacant', 'Вакантные / в простое');
    vals.closeSummaryFilter = () => this.setState({ summaryFilter: null, summaryPinned: true });
    if (this.state.summaryFilter) {
      const key = this.state.summaryFilter.key;
      const pred = key === 'total' ? (() => true)
        : key === 'sold' ? (u => u.status === 'Продано')
        : key === 'dvk' ? (u => this.isLeasedStatus(u.status) && this.isFund(u))
        : key === 'leased' ? (u => this.isLeasedStatus(u.status) && !this.isFund(u))
        : (u => this.isVacantStatus(u.status));
      const list = [];
      for (const bkey in this.units) for (const u of this.units[bkey]) {
        if (pred(u)) list.push({ ...u, location: this.names[bkey],
          status: this.unitStatus(bkey, u),
          liqColor: this.liqColors[u.liq] || 'transparent',
          strike: u.status === 'Продано' ? 'line-through' : 'none',
          role: this.isFund(u) ? 'Владелец' : (this.isLeasedStatus(u.status) ? 'Арендатор' : 'Правообладатель') });
      }
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list };
    } else {
      vals.summaryFilterInfo = null;
    }

    this.summaryExtra(vals);
    return vals;
  }

  // август по домам «Арены» выгружен частично — расчёт заселенности ведём по июлю
  volMonth = 'Июль';

  // август по домам «Арены» выгружен частично — из таблицы потребления исключаем
  volSkipMonths = ['Август'];
  };
};

window.OMJKLogic[5] = function (DCLogic) {
  return class JK extends window.GenplanCore(DCLogic) {
  componentDidMount() {
    const apply = () => {
      const d = window.__SM_DATA_5, p = window.__SM_PLANS_5;
      if (!d || !p || !window.OMPriceNet) return false;
      this.units = d.units;
      // рыночная цена помещений — цена нетто из реестра рекомендуемых цен (август 2026)
      if (window.OMPriceNet) window.OMPriceNet.apply(5, this.units);
      this.rnv = d.rnv;
      if (window.OMSales && window.OMSales[5]) this.sales = window.OMSales[5];
      if (d.tenantsReg) this.tenantsReg = d.tenantsReg;
      this.floorPlans = p.floorPlans;
      this.planBoxes = p.planBoxes;
      this.planMop = p.planMop;
      this.bFloors = p.buildingFloors || {};
      // ОСК бульвара (№16214 / №16216 / №12012) — цены нетто по реестру «Бульвар Самолет» (09.09.2026)
      window.OMPriceNet.applyB(5, this.bFloors);
      // прайсовые ставки аренды ОСК — «Расчёт ставок аренды Бульвар Самолет» (09.09.2026)
      if (window.OMRentPrice) window.OMRentPrice.apply(5, this.bFloors);
      this.forceUpdate();
      return true;
    };
    if (!apply()) {
      const t = setInterval(() => { if (apply()) clearInterval(t); }, 60);
      setTimeout(() => clearInterval(t), 20000);
    }
  }

  // контуры подъездов на кропе генплана (% от изображения); литеры Г-образные: два крыла = два подъезда
  // контуры подъездов на кропе генплана (% от изображения)
  polys = {
    '25_2': [[5.34,2.35],[12.8,2.35],[12.8,10.15],[8.69,10.15],[8.69,8.2],[6.18,8.2],[6.18,11.6],[5.34,11.6]],
    '25_1': [[6.18,8.2],[8.69,8.2],[8.69,23.7],[5.34,23.7],[5.34,11.6],[6.18,11.6]],
    '26_1': [[45.45,1.9],[49.85,1.9],[49.85,14.2],[48.7,14.2],[48.7,13.2],[45.45,13.2]],
    '26_2': [[46.2,13.2],[48.7,13.2],[48.7,14.2],[49.85,14.2],[49.85,26.2],[46.2,26.2]],
    '27_3': [[57.0,1.6],[64.7,1.6],[64.7,9.5],[60.65,9.5],[60.65,7.5],[57.91,7.5],[57.91,10.9],[57.0,10.9]],
    '27_4': [[65.1,1.6],[71.4,1.6],[71.4,9.5],[65.1,9.5]],
    '27_2': [[57.91,7.5],[60.65,7.5],[60.65,19.6],[58.0,19.6],[58.0,22.5],[57.0,22.5],[57.0,10.9],[57.91,10.9]],
    '27_1': [[58.0,19.6],[60.65,19.6],[60.65,33.6],[57.0,33.6],[57.0,22.5],[58.0,22.5]],
    '28_1': [[80.97,1.3],[87.32,1.3],[87.32,9.5],[80.97,9.5]],
    '28_2': [[87.72,1.3],[95.45,1.3],[95.45,10.9],[91.9,10.9],[91.9,9.5],[87.72,9.5]],
    '29_2': [[5.08,69.2],[8.48,69.2],[8.48,79.5],[5.9,79.5],[5.9,81.8],[5.08,81.8]],
    '29_1': [[5.08,81.8],[5.9,81.8],[5.9,79.5],[8.48,79.5],[8.48,81.3],[12.4,81.3],[12.4,91.2],[5.08,91.2]],
    '30_1': [[58.4,62.8],[61.85,62.8],[61.85,76.5],[58.4,76.5]],
    'comm_1': [[40.5,42.7],[51.1,42.7],[51.1,47.7],[40.5,47.7]],
    'comm_3': [[5.0,42.7],[15.6,42.7],[15.6,47.7],[5.0,47.7]],
    'comm_2': [[55.5,42.7],[66.1,42.7],[66.1,47.7],[55.5,47.7]],
    // «Аквазона» — зона аренды земли слева от Коммерции №16214
    'zu_aqua': [[36.50,44.20],[37.02,44.30],[37.50,44.58],[37.91,45.02],[38.23,45.60],[38.43,46.28],[38.50,47.00],[38.43,47.72],[38.23,48.40],[37.91,48.98],[37.50,49.42],[37.02,49.70],[36.50,49.80],[35.98,49.70],[35.50,49.42],[35.09,48.98],[34.77,48.40],[34.57,47.72],[34.50,47.00],[34.57,46.28],[34.77,45.60],[35.09,45.02],[35.50,44.58],[35.98,44.30]],
    // зона аренды земли справа от Коммерции №16216
    'zu_nto': [[69.50,42.40],[70.02,42.50],[70.50,42.78],[70.91,43.22],[71.23,43.80],[71.43,44.48],[71.50,45.20],[71.43,45.92],[71.23,46.60],[70.91,47.18],[70.50,47.62],[70.02,47.90],[69.50,48.00],[68.98,47.90],[68.50,47.62],[68.09,47.18],[67.77,46.60],[67.57,45.92],[67.50,45.20],[67.57,44.48],[67.77,43.80],[68.09,43.22],[68.50,42.78],[68.98,42.50]],
  };

  names = {
    '25_1': 'Литер 25 · Подъезд 1', '25_2': 'Литер 25 · Подъезд 2',
    '26_1': 'Литер 26 · Подъезд 1', '26_2': 'Литер 26 · Подъезд 2',
    '27_1': 'Литер 27 · Подъезд 1', '27_2': 'Литер 27 · Подъезд 2', '27_3': 'Литер 27 · Подъезд 3', '27_4': 'Литер 27 · Подъезд 4',
    '28_1': 'Литер 28 · Подъезд 1', '28_2': 'Литер 28 · Подъезд 2',
    '29_1': 'Литер 29 · Подъезд 1', '29_2': 'Литер 29 · Подъезд 2',
    '30_1': 'Литер 30 · Подъезд 1', 'comm_1': 'Коммерция №16214', 'comm_2': 'Коммерция №16216', 'comm_3': 'Коммерция №12012', 'zu_nto': 'Выводы под НТО', 'zu_aqua': 'Аквазона',
  };

  utilJk = 's5';

  residentsCapacity = 5808;

  unitFields(key) {
    const bc = this.bFloors[key];
    const list = bc ? bc.floors.filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((a, f) => a.concat(f.units || []), []) : (this.units[key] || []);
    if (!list.length) return { noCommercial: true, commercial: null, unitsLabel: '', units: '', statuses: [] };
    const isZu = String(key).startsWith('zu') || String(key).startsWith('stop');
    const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
    const counts = {};
    for (const u of list) { const s = this.unitStatus(key, u); counts[s] = (counts[s] || 0) + 1; }
    return { noCommercial: false, commercial: list.length,
      commercialLabel: isZu ? 'Мест в аренду' : 'Коммерческих помещений',
      unitsLabel: area > 0 ? 'Площадь коммерческих помещений' : '', units: area > 0 ? this.fmtArea(area) : '',
      statuses: Object.keys(counts).map(s => `${s}: ${counts[s]}`) };
  }

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
      const opex = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
    for (const k in preds) agg[k] = { c: 0, a: 0, p: 0, r: 0 };
    for (const key in SU) for (const u of SU[key]) {
      const mrU = this.mktRate(u);
      for (const k in preds) if (preds[k](u, key)) { agg[k].c++; agg[k].a += A(u); agg[k].p += P(u); agg[k].r += A(u) * mrU; }
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
        const ox = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
        const opex = this.numOf(this.sumRub(this.opUnit(u, key), ['opStart', 'opRepair', 'opAnchor', 'opLoss']));
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
        stuck.push({ number: u.number, area: u.area, location: this.names[key] || key, days, areaNum: A(u), rate: this.mktRate(u) });
      }
    }
    stuck.sort((a, b) => b.days - a.days || b.areaNum - a.areaNum);
    vals.stuck6Count = stuck.length;
    vals.stuck6Area = fA(stuck.reduce((s, u) => s + u.areaNum, 0));
    {
      const mm0 = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/);
      const mr0 = mm0 ? (parseFloat(mm0[1].replace(/[\s ]/g, '')) || 0) : 0;
      const loss = stuck.reduce((s, u) => s + u.areaNum * (u.rate || mr0) * (u.days / 30.44), 0);
      vals.stuck6Loss = mr0 ? rub(loss) : 'нет данных';
      vals.stuck6LossNote = mr0 ? 'площадь × ставка (прайс бульвара / медиана ' + mr0.toLocaleString('ru-RU') + ' ₽/м²) × срок простоя' : 'нет рыночной ставки';
      vals.buildLossSum = mr0 ? rub(agg.buildLoss.r * 8) : 'нет данных';
      vals.buildLossNote = mr0 ? 'площадь × ставка (прайс бульвара / медиана ' + mr0.toLocaleString('ru-RU') + ' ₽/м²) × 8 мес' : 'нет рыночной ставки';
    }
    // НТО, аренда ЗУ и остановки: собственный расчёт по договорам реестра
    {
      let month = 0, withRate = 0;
      for (const key in (this.tenantsReg || {})) {
        if (!/^(nto|zu|stop)/.test(key)) continue;
        for (const tr of this.tenantsReg[key]) {
          const p = this.ratePick(tr);
          const m = String((p && p.rate) || '').match(/·\s*([\d\s ]+(?:,\d+)?)\s*₽\/мес/);
          if (m) { const v = parseFloat(m[1].replace(/[\s ]/g, '').replace(',', '.')); if (isFinite(v)) { month += v; withRate++; } }
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
        const mm = String((pr && pr.rate) || '').match(/·\s*([\d\s\u00a0]+(?:,\d+)?)\s*₽\/мес/);
        if (mm) { const v = parseFloat(mm[1].replace(/[\s\u00a0]/g, '').replace(',', '.')); if (isFinite(v)) month += v; }
      }
      vals.uLeasedMonth = month ? rub(month) + '/мес' : 'нет данных';
      // максимальный арендный поток и экономическая эффективность по помещениям в аренде
      const mrM = String(this.marketRentStr() || '').match(/:\s*([\d\s\u00a0]+)\s*₽/);
      const mrRate = mrM ? (parseFloat(mrM[1].replace(/[\s\u00a0]/g, '')) || 0) : 0;
      // максимум — вся площадь ЖК без проданных (наши помещения) по рыночной ставке
      const ourArea = Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0));
      const maxMonth = Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0)) || ourArea * mrRate;
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
    const workRentPot = Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0) - ((agg.buildLoss && agg.buildLoss.r) || 0));
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
      R('Потери по стройготовности: ' + vals.buildLossSum, 'Площадь без РНВ и без стройготовности × ставка помещения (прайс бульвара / медиана ЖК) × 8 мес'),
      R('Потери от простоя 6+ мес: ' + vals.stuck6Loss, 'Площадь × ставка помещения (прайс бульвара / медиана ЖК) × срок простоя'),
      H('Правовая эффективность'),
      R('Полученные пени, штрафы и неустойки: — (нет данных)', 'Сумма взысканных пеней, штрафов и неустоек с начала года'),
      H('Прочие маркеры'),
      R('Экономическая заполняемость (economic occupancy): ' + (() => { const mmx = String(this.marketRentStr() || '').match(/:\s*([\d\s ]+)\s*₽/); const m2 = mmx ? (parseFloat(mmx[1].replace(/[\s ]/g, '')) || 0) : 0; const pot = (workRentPot || workArea * m2) * 8; return (pot && rentYtdNum) ? pct(rentYtdNum, pot) : 'нет данных'; })(), 'Начисленная аренда / потенциальная при 100% занятости введённых помещений × 100%'),
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
          const mm0 = String((pr0 && pr0.rate) || '').match(/·\s*([\d\s\u00a0]+(?:,\d+)?)\s*₽\/мес/);
          if (mm0) { const v0 = parseFloat(mm0[1].replace(/[\s\u00a0]/g, '').replace(',', '.')); if (isFinite(v0)) factFlowSum += v0 * 12; }
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
        showFlow: /аренд/i.test(this.state.summaryFilter.label || '') && (maxFlowSum = (Math.max(0, (agg.total.r || 0) - ((agg.sold && agg.sold.r) || 0)) || Math.max(0, (agg.total.a || 0) - ((agg.sold && agg.sold.a) || 0)) * mrRate2) * 12) > 0,
        maxFlow: Math.round(maxFlowSum).toLocaleString('ru-RU') + ' ₽/год',
        maxFlowNote: 'площадь без проданных × ставка (прайс бульвара / медиана ' + Math.round(mrRate2).toLocaleString('ru-RU') + ' ₽/м²) × 12 мес',
        econEff: (factFlowSum / maxFlowSum * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%',
        econEffColor: (factFlowSum / maxFlowSum) >= 0.9 ? '#3a6b3f' : ((factFlowSum / maxFlowSum) >= 0.7 ? '#9a6b1a' : '#a3312b'),
        econEffNote: 'факт по действующим ставкам ' + Math.round(factFlowSum).toLocaleString('ru-RU') + ' ₽/год из максимума' };
    } else {
      vals.summaryFilterInfo = null;
    }
  }

  renderVals() {
    const SU = this.sumUnits();
    if (window.OMKpAddr) window.OMKpAddr.apply(this, 's5');
    if (window.OMVolumes) this._volInfo = window.OMVolumes.fill(this);
    const vals = {};
    const fmtArea = (n) => this.fmtArea(n);
    const accent = '#2b2a27';
    const theme = this.props.theme || 'light';
    const themes = {
      light: { pageBg: '#f4f2ee', cardBg: '#fffdf9', border: '#ddd8cd', text: '#2b2a27', muted: '#6b6a64', imgCardBg: '#fff', statusNeutralBg: '#f7f5f0', statusGreenBg: '#eef6ee', statusOrangeBg: '#fbf3e6' },
      dark: { pageBg: '#1c1b18', cardBg: '#28261f', border: '#463f31', text: '#f0ece2', muted: '#a89f8f', imgCardBg: '#211f1a', statusNeutralBg: '#332f26', statusGreenBg: '#1f3324', statusOrangeBg: '#3a2c17' },
    };
    const th = themes[theme] || themes.light;
    vals.pageBg = th.pageBg; vals.cardBg = th.cardBg; vals.borderColor = th.border; vals.textColor = th.text;
    vals.mutedColor = th.muted; vals.imgCardBg = th.imgCardBg; vals.statusNeutralBg = th.statusNeutralBg;
    vals.statusGreenBg = th.statusGreenBg; vals.statusOrangeBg = th.statusOrangeBg;
    vals.statusRedBg = theme === 'dark' ? '#3a2420' : '#faf0ee';
    vals.statusNeutralBorder = '#c3bdb0';
    vals.accent = accent;

    vals.leave = () => this.leaveAll();
    vals.showActive = !!this.state.showActive;
    vals.activeBtnBg = this.state.showActive ? '#a3312b' : 'transparent';
    vals.activeBtnFg = this.state.showActive ? '#ffffff' : '#a3312b';
    vals.activeBtnLabel = this.state.showActive ? 'Скрыть актив' : 'Показать актив';
    vals.toggleActive = () => this.setState((s) => ({ showActive: !s.showActive }));
    vals.activeMarks = this.buildActiveMarks();
    vals.storefronts = this._storefronts || [];
    // сноска по цветам витрин: только категории, встречающиеся в этом ЖК
    {
      const agg = {};
      for (const sf of (vals.storefronts || [])) {
        if (!agg[sf.cat]) agg[sf.cat] = { name: sf.cat, c: sf.c, n: 0 };
        agg[sf.cat].n++;
      }
      const list = Object.keys(agg).map((k2) => agg[k2]);
      list.sort((a, b) => (a.name === 'Свободно' ? 1 : b.name === 'Свободно' ? -1 : b.n - a.n));
      vals.sfLegend = list;
    }
    vals.activeTip = this.state.activeTip || null;
    vals.buildingPolys = Object.keys(this.polys).map((k) => {
      const hov = this.state.hovered === k || this.state.selected === k;
      return { id: k, points: this.polys[k].map(p => p.join(',')).join(' '),
        fill: 'transparent',
        stroke: hov ? '#a3312b' : 'transparent',
        onEnter: () => this.enter(k), onClick: () => this.select(k) };
    });

    if (this.state.hovered && this.polys[this.state.hovered]) {
      const key = this.state.hovered;
      const poly = this.polys[key];
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs);
      const by0 = Math.min(...ys);
      const TIP_W = 18, TIP_H = 30;
      let left, transform;
      if (bx1 + 1 + TIP_W <= 99) { left = (bx1 + 1) + '%'; transform = 'none'; }
      else { left = (bx0 - 1) + '%'; transform = 'translateX(-100%)'; }
      const top = Math.max(1, Math.min(by0, 99 - TIP_H)) + '%';
      vals.activeInfo = { name: this.names[key], left, top, transform, rnv: this.rnv[key], ...this.unitFields(key) };
    } else {
      vals.activeInfo = null;
    }

    vals.closePanel = () => this.closePanel();
    if (this.state.selected) {
      const id = this.state.selected;
      const regFor = (u) => { const t = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit); return t ? { ...t, hasBrand: !!t.brand && t.brand !== '—' } : null; };
      const bCfg0 = this.bFloors[id] || null;
      const bFloor0 = bCfg0 ? bCfg0.floors[this.state.floorIdx || 0] : null;
      const srcList = (bFloor0 && bFloor0.units) ? bFloor0.units : (this.units[id] || []);
      const list = srcList.map((u, idx) => ({ ...u,
        status: this.unitStatus(id, u),
        liqColor: this.liqColors[u.liq] || 'transparent',
        strike: u.status === 'Продано' ? 'line-through' : 'none',
        notSold: u.status !== 'Продано',
        role: u.role || 'Владелец',
        companyOrDash: u.company || 'не указано',
        marketPrice: u.marketPrice || u.price || 'не указана',
        fias: this.fiasOf(id, u), cadastre: this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных', fias: this.fiasOf(id, u),
        cardBg: /Продано/i.test(u.status || '') ? '#1b1916' : (this.liqColors[u.liq] || 'transparent'),
        fg: /Продано/i.test(u.status || '') ? '#f2ede4' : vals.textColor,
        fgMuted: /Продано/i.test(u.status || '') ? '#a9a196' : vals.mutedColor,
        cornerFg: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        cardPad: /Продано/i.test(u.status || '') ? '7px 10px' : '10px 12px',
        cardAlign: /Продано/i.test(u.status || '') ? 'start' : 'stretch',
        chipMargin: /Продано/i.test(u.status || '') ? '4px 0 5px' : '6px 0 8px',
        rowGap: /Продано/i.test(u.status || '') ? '1px' : '3px',
        rowFont: /Продано/i.test(u.status || '') ? '11px' : '11.5px',
        rowLine: /Продано/i.test(u.status || '') ? '14px' : '16px',
        sale: this.saleOf(id, u),
        // категория торговой точки арендатора — кружок в углу карточки (traffic.js)
        ttChipCat: (() => {
          if (/Продано/i.test(u.status || '')) return null;
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          if (!r) return null;
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.name) || 'Прочее';
        })(),
        ttChipBg: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '1f';
        })(),
        ttChipBd: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '59';
        })(),
        ttChipColor: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.c) || '#4b2e83';
        })(),
        // данные сделки показываем в каждой проданной карточке: нет записи — «нет данных»
        saleDate: (this.saleOf(id, u) || {}).date || 'нет данных',
        saleFact: (this.saleOf(id, u) || {}).fact || 'нет данных',
        saleAgent: (this.saleOf(id, u) || {}).agent || 'нет данных',
        saleBuyer: (this.saleOf(id, u) || {}).buyer || 'нет данных',
        corner: (this.actualPrice(id, u) || {}).value || (/Продано/i.test(u.status || '') ? 'нет данных' : ''),
        ...this.rentGapOf(id, u),
        rentMarket: (this.actualPrice(id, u) || /Продано/i.test(u.status || '') || /^(nto|zu|stop)/.test(String(id))) ? '' : (u.priceRate || String(this.marketRentStr() || '').split(':').pop().trim()),
        rentMarketTitle: u.priceRate ? 'Прайсовая ставка аренды — расчёт ставок «Бульвар Самолет» от 09.09.2026' : 'Актуальная на текущий год рыночная ставка аренды — медиана действующих ставок по ЖК',
        cornerTitle: this.actualPrice(id, u) ? 'Актуальная цена помещения' : 'Актуальная на текущий год рыночная ставка аренды',
        cornerCaption: /Продано/i.test(u.status || '') ? 'Актуальная цена' : '',
        marketPrice: (this.actualPrice(id, u) || {}).value || u.marketPrice || u.price || 'не указана',
        marketLabel: this.actualPrice(id, u) ? 'Актуальная цена' : 'Рыночная цена',
        marketTitle: (this.actualPrice(id, u) || {}).basis || u.marketPrice || u.price || '',
        powerKw: u.powerKw || '',
        idleOnChange: this.idleOnChange(id, u),
        pastRows: this.pastTenants[id + '|' + String(u.number).split(',')[0].trim()] || [{ tenant: '—', rate: '—', period: '—' }],
        saleGrowth: this.saleGrowth(id, u),
        cadLabel: u.status === 'Продано' ? 'Наименование актуальной т.т.' : 'Кадастровый №',
        cadValue: u.status === 'Продано'
          ? (this.soldTt[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных')
          : (this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных'),
        sold: u.status === 'Продано',
        // категорию проданной точки берём из её названия единой функцией traffic.js
        ttCat: (() => {
          if (u.status !== 'Продано') return '—';
          const nm = this.soldTt[id + '|' + String(u.number).split(',')[0].trim()];
          if (!nm) return 'нет данных';
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf({ brand: nm }) : null;
          return (c && c.name) || 'нет данных';
        })(),
        price: u.priceLabel ? u.price : '',
        priceLabel: u.priceLabel || 'Цена по прайсу',
        mgmtCo: u.mgmtCo || 'нет данных',
        mgmtRate: u.mgmtCo === 'без управления' ? '—' : (u.mgmtRate || '—'),
        mgmtActive: u.mgmtActive || (u.mgmtCo ? 'активен' : 'не активен'),
        mgmtPaid: u.mgmtPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.mgmtAccrued(id, u)),
        mgmtDiscount: u.mgmtDiscount || '—',
        rentDiscount: u.rentDiscount || '—',
        rentPaid: u.rentPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.rentAccrued(id, u)),
        rentDebt: u.rentDebt || '—',
        mgmtDebt: u.mgmtDebt || '—', penalties: u.penalties || '—',
        turnoverMonths: Array.from({ length: 12 }, (_, i) => { const m = i + 1; const active = (this.state.turnoverMonth || 1) === m;
          return { m, onClick: () => this.setState({ turnoverMonth: m }), bg: active ? accent : 'rgba(0,0,0,0.06)', fg: active ? '#fff' : vals.textColor, fw: active ? 700 : 400 }; }),
        turnoverValue: (u.turnover && u.turnover[this.state.turnoverMonth || 1]) || 'нет данных',
        mgmtNote: u.mgmtNote === undefined ? 'в выгрузке КП нет данных об управлении и долгах' : u.mgmtNote,
        bti: u.btiN || null,
        btiOrDash: u.btiN || 'не указаны',
        insurance: u.insurance || 'нет',
        cxUtil: this.cxUtilOf(id, u) || '—', cxUtilC: this.cxColor(this.cxUtilOf(id, u)),
        utilOpen: !!(this.state.utilOpen || {})[id + '|' + idx], utilChevron: (this.state.utilOpen || {})[id + '|' + idx] ? 'rotate(180deg)' : 'rotate(0deg)',
        toggleUtil: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = id + '|' + idx; this.setState(s => ({ utilOpen: { ...(s.utilOpen || {}), [k]: !(s.utilOpen || {})[k] } })); },
        ukLabel: (this.literUk && this.literUk[String(id).split('_')[0]]) || 'УК МКД',
        ...this.secVals(id, idx),
        cxUtilMkd: u.cxUtilMkd || this.costStr('uk', id, u), cxUtilElec: this.utilStr('e', id, u), cxUtilWater: this.utilStr('w', id, u), cxUtilHeat: this.utilStr('h', id, u),
        cxSecurity: u.cxSecurity || '—', cxSecurityC: this.cxColor(u.cxSecurity),
        cxCleaning: u.cxCleaning || '—', cxCleaningC: this.cxColor(u.cxCleaning),
        cxTO: u.cxTO || '—', cxTOC: this.cxColor(u.cxTO),
        cxAdmin: this.cxAdminOf(id, u), cxAdminC: this.cxColor(this.cxAdminOf(id, u)),
        cxTaxes: this.cxTaxesOf(id, u), cxTaxesC: this.cxColor(this.cxTaxesOf(id, u)),
        cxInsurance: u.cxInsurance || '—', cxInsuranceC: this.cxColor(u.cxInsurance),
        cxTotal: this.cxTotalOf(id, u),
        opStart: this.startInvest(u), opRepair: this.opRepairOf(u, id), opAnchor: u.opAnchor || '—', opLoss: u.opLoss || '—',
        opTotal: this.sumRub(this.opUnit(u, id), ['opStart', 'opRepair', 'opAnchor', 'opLoss']),
        effNoi: u.effNoi || this.noiOf(id, u, this.cxTotalOf(id, u)), effPayback: u.effPayback || this.paybackOf(id, u), effRoi: u.effRoi || this.roiOf(id, u), effCapRate: u.effCapRate || this.capRateOf(id, u), effPriceDyn: u.effPriceDyn || '—', effPriceDynC: this.growthColor(u.effPriceDyn), effFull: this.fullYieldOf(id, u), effFullC: this.growthColor(this.fullYieldOf(id, u)), effFullTitle: this.fullYieldTitle(id, u),
        effFair: this.fairValueOf(id, u), effFairTitle: this.fairValueTitle(id, u),
        fairColor: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        fairBorder: /Продано/i.test(u.status || '') ? 'rgba(224,147,141,0.35)' : 'rgba(163,49,43,0.22)',
        effCap: u.effCap || '14%', effSpread: u.effSpread || this.spreadOf(id, u), effSpreadC: this.growthColor(u.effSpread || this.spreadOf(id, u)), effOpexBack: u.effOpexBack || this.opexBackOf(id, u), effGrowth: u.effGrowth || this.assetGrowth(id, u), effGrowthYear: this.assetGrowthYear(id, u), effGrowthC: this.growthColor(this.assetGrowth(id, u)),
        ...this.chip(this.unitStatus(id, u)), ...this.donutsOf(id, u),
        ...this.regRow(id, u) }))
        .map((u, i) => ({ ...u, _i: i }))
        .sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
      const area = list.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
      const bCfg = this.bFloors[id] || null;
      const fi = this.state.floorIdx || 0;
      const fp = bCfg ? bCfg.floors[fi] : (this.floorPlans[id] || null);
      const rects = bCfg ? ((bCfg.floors[fi] && bCfg.floors[fi].boxes) ? bCfg.floors[fi].boxes.map(b => [{ poly: b }]) : null) : (this.planBoxes[id] || null);
      const hoveredIdx = this.state.hoveredUnitIdx;
      const bboxOf = (b) => b.poly ? (() => { const xs = b.poly.map(p => p[0]), ys = b.poly.map(p => p[1]); const l = Math.min(...xs), t = Math.min(...ys); return { l, t, w: Math.max(...xs) - l, h: Math.max(...ys) - t }; })() : b;
      const ptsOf = (b) => b.poly ? b.poly.map(p => p.join(',')).join(' ') : `${b.l},${b.t} ${b.l + b.w},${b.t} ${b.l + b.w},${b.t + b.h} ${b.l},${b.t + b.h}`;
      const centers = rects ? rects.map(grp => { const bb = bboxOf(grp[0]); return { left: (bb.l + bb.w / 2) + '%', top: (bb.t + bb.h / 2) + '%' }; }) : null;
      const highlightBoxes = centers ? centers.map((c, idx) => ({ ...c, opacity: hoveredIdx === idx ? 1 : 0 })) : null;
      const outlineOf = (idx) => (rects && idx != null && rects[idx]) ? rects[idx].map(b => ({ points: ptsOf(b) })) : null;
      vals.hoverOutline = outlineOf(hoveredIdx);
      const bFloor = bCfg ? bCfg.floors[fi] : null;
      vals.mopShapes = (bCfg ? ((bFloor && bFloor.mop) || []).map(b => ({ poly: b })) : (this.planMop[id] || [])).map(b => ({ points: ptsOf(b) }));
      vals.planFloorTabs = bCfg ? bCfg.floors.map((f, i) => ({ label: f.label,
        border: i === fi ? '#a3312b' : '#c3bdb0', bg: i === fi ? '#a3312b' : 'transparent', color: i === fi ? '#fffdf9' : '#948f83',
        onClick: () => this.setState({ floorIdx: i, zoomHoverIdx: null }) })) : null;
      const allUnits = bCfg ? bCfg.floors.filter(f => !/кровл|б\/н|крыш/i.test(f.label)).reduce((a, f) => a.concat(f.units || []), []) : list;
      const allArea = allUnits.reduce((s, u) => { const n = parseFloat(String(u.area).replace(',', '.')); return isFinite(n) ? s + n : s; }, 0);
      {
        // порядок карточек зафиксирован: в аренде → в простое → не введено → продано
        list.forEach((x, i) => { if (x._i === undefined) x._i = i; });
        list.sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
        const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
        // непроданные — одной строкой, проданные — по две в ряд с новой строки
        list.forEach((x, i) => {
          const sold = /Продано/i.test(String(x.status || ''));
          x.colStart = (fs >= 0 && i === fs) ? '1' : 'auto';
          x.rowBreak = fs >= 0 && i === fs;
          x.cardFlex = '0 0 300px';
        });
      }
      vals.selectedInfo = { name: this.names[id], rnv: this.rnv[id], commercial: allUnits.length, units: allArea > 0 ? fmtArea(allArea) : null,
        statusChips: (() => {
          const m = {};
          for (const u of allUnits) { const s = this.unitStatus(id, u); if (!m[s]) m[s] = { n: 0, a: 0 }; m[s].n++; const n = parseFloat(String(u.area).replace(',', '.')); if (isFinite(n)) m[s].a += n; }
          return Object.keys(m).map(s => { const c = this.chip(s); return { label: s, count: m[s].n, area: m[s].a.toFixed(1).replace('.', ',') + ' м²', bg: c.chipBg, fg: c.chipFg, bd: c.chipBd }; });
        })(),
        commercialLabel: (String(id).startsWith('zu') || String(id).startsWith('stop')) ? 'Мест в аренду' : 'Коммерческих помещений',
        addr: ((this.literAddr && this.literAddr[String(id).split('_')[0]]) || (bCfg ? bCfg.addr : null)),
        uk: (this.literUk && this.literUk[String(id).split('_')[0]]) || null, tenants: (() => { const r = (this.tenantsReg[id] || []).filter(t => !t.unit); return r.length ? r : null; })(),
        planLabel: bCfg ? 'Поэтажный план' : 'Поэтажный план · 1 этаж (подъезд)',
        planNote: bCfg ? 'Планы из техпаспорта. Кликните по плану, чтобы увеличить' : 'Серым выделены места общего пользования (МОП): лестницы, лифты, коридоры. Наведите на карточку помещения — его контур подсветится на плане',
        unitsList: (() => {
          const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
          // непроданные — одной строкой, проданные — по две в ряд с новой строки
          return list.map((u, i) => ({ ...u,
            rowBreak: fs >= 0 && i === fs,
            cardFlex: '0 0 300px',
            onEnter: () => this.setState({ hoveredUnitIdx: u._i }), onLeave: () => this.setState({ hoveredUnitIdx: null }) }));
        })(),
        planImg: fp ? fp.img : null, planAspect: fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null, planW: fp ? (fp.ratio < 0.4 ? '26%' : (fp.ratio < 0.6 ? '34%' : '62%')) : '62%', highlightBoxes };
      if (vals.selectedInfo) {
        const un = (vals.selectedInfo.unitsList || []);
        vals.selectedInfo.unitsUnsold = un.filter((u) => !/Продано/i.test(String(u.status || '')));
        const so = un.filter((u) => /Продано/i.test(String(u.status || '')));
        vals.selectedInfo.unitsSold = so.length ? so : null;
      }
      vals.openPlanZoom = () => this.setState({ planZoom: true });
      this.cardsScrollVals(vals);
      vals.planZoomImg = (this.state.planZoom && fp) ? fp.img : null;
      vals.stopProp = (e) => e.stopPropagation();
      {
        const zi = this.state.zoomHoverIdx;
        const zoomUnits = srcList || [];
        // зоны наведения — по контуру помещения; мелкие фигуры рисуем последними, чтобы они были доступны поверх крупных
        vals.zoomHoverZones = rects ? rects.flatMap((grp, idx) => grp.map(b => {
          const bb = bboxOf(b);
          return { points: ptsOf(b), area: bb.w * bb.h,
            onHover: () => this.setState({ zoomHoverIdx: idx }), onUnhover: () => this.setState({ zoomHoverIdx: null }) };
        })).sort((a, b) => b.area - a.area) : null;
        vals.zoomPins = centers ? centers.map((c, idx) => ({ ...c, opacity: zi === idx ? 1 : 0 })) : null;
        vals.zoomOutline = outlineOf(zi);
        if (zi != null && rects && rects[zi] && zoomUnits[zi]) {
          const bb = bboxOf(rects[zi][0]);
          const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
          vals.zoomTooltip = { ...zoomUnits[zi], status: this.unitStatus(id, zoomUnits[zi]),
            left: clamp(bb.l + bb.w / 2, 14, 86) + '%',
            top: clamp(bb.t + bb.h / 2, 12, 82) + '%',
            tf: 'translate(-50%, -50%)', mt: '0px' };
        } else { vals.zoomTooltip = null; }
      }
      vals.planZoomAspect = fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null;
      vals.planZoomW = fp ? `min(92vw, calc(88vh * ${fp.ratio.toFixed(4)}))` : '92vw';
    } else {
      vals.selectedInfo = null;
      vals.planZoomImg = null;
    }
    vals.closePlanZoom = () => this.setState({ planZoom: false, zoomHoverIdx: null });

    // карта трафика
    vals.trafficVisible = !!this.state.trafficOverlay;
    vals.trafficPanelVisible = !!this.state.trafficData;
    vals.trafficHidePanel = () => this.setState({ trafficData: false });
    vals.trafficOverlayBg = this.state.trafficOverlay ? '#a3312b' : 'transparent';
    vals.trafficOverlayFg = this.state.trafficOverlay ? '#ffffff' : '#a3312b';
    vals.trafficDataBg = this.state.trafficData ? '#a3312b' : 'transparent';
    vals.trafficDataFg = this.state.trafficData ? '#ffffff' : '#a3312b';
    vals.toggleTrafficOverlay = () => this.setState((s) => ({ trafficOverlay: !s.trafficOverlay }));
    vals.toggleTrafficData = () => this.setState((s) => ({ trafficData: !s.trafficData }));
    {
      const tr = (window.OMTraffic && (this.state.trafficOverlay || this.state.trafficData)) ? window.OMTraffic.build(this, vals) : null;
      vals.trafficMarks = tr ? tr.marks : [];
      vals.trafficLines = tr ? tr.lines : [];
      vals.trafficMagnets = tr ? tr.magnets : [];
      vals.trafficVacancies = tr ? tr.vacancies : [];
      vals.trafficStats = tr ? tr.stats : [];
      vals.trafficNote = tr ? tr.note : '';
    }

    vals.toggleSummary = () => this.toggleSummary();
    vals.enterSummary = () => this.setState({ summaryHovered: true });
    vals.leaveSummary = () => this.setState({ summaryHovered: false });
    vals.summaryVisible = this.state.summaryHovered || this.state.summaryPinned;

    {
      let totalCount = 0, totalArea = 0, soldCount = 0, soldArea = 0, soldSum = 0,
        dvkCount = 0, dvkArea = 0, leasedCount = 0, leasedArea = 0, rentedCount = 0, rentedArea = 0;
      for (const key in SU) {
        for (const u of (SU[key] || [])) {
          const area = parseFloat(u.area.replace(',', '.'));
          const price = parseFloat((u.price || '').replace(/[^\d]/g, '')) || 0;
          totalCount++; totalArea += area;
          if (u.status === 'Продано') { soldCount++; soldArea += area; soldSum += price; }
          else if (this.isLeasedStatus(u.status) && this.isFund(u)) { dvkCount++; dvkArea += area; }
          else if (this.isLeasedStatus(u.status)) { leasedCount++; leasedArea += area; }
          else if (this.isVacantStatus(u.status)) { rentedCount++; rentedArea += area; }
        }
      }
      vals.totalCount = totalCount; vals.totalArea = fmtArea(totalArea);
      vals.soldCount = soldCount; vals.soldArea = fmtArea(soldArea);
      vals.soldSum = Math.round(soldSum).toLocaleString('ru-RU') + ' ₽';
      vals.soldAvgSqm = soldArea ? Math.round(soldSum / soldArea).toLocaleString('ru-RU') + ' ₽/м²' : '—';
      vals.dvkCount = dvkCount; vals.dvkArea = fmtArea(dvkArea);
      vals.leasedCount = leasedCount; vals.leasedArea = fmtArea(leasedArea);
      vals.rentedCount = rentedCount; vals.rentedArea = fmtArea(rentedArea);
      vals.soldSharePct = totalArea ? Math.round((soldArea / totalArea) * 100) + '%' : '—';
      vals.rentedSharePct = totalArea ? Math.round((rentedArea / totalArea) * 100) + '%' : '—';

      const m = {};
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (!this.isVacantStatus(u.status)) continue;
        if (!m[u.liq]) m[u.liq] = { count: 0, area: 0 };
        m[u.liq].count++; m[u.liq].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.liqRented = Object.keys(m).map(l => `${l}: ${m[l].count} (${fmtArea(m[l].area)})`);
    }

    vals.problemsVisible = this.state.problemsVisible;
    vals.toggleProblems = () => this.setState(s => ({ problemsVisible: !s.problemsVisible }));
    vals.efficiencyVisible = this.state.efficiencyVisible;
    vals.toggleEfficiency = () => this.setState(s => ({ efficiencyVisible: !s.efficiencyVisible }));
    this.occupancyVals(vals);

    {
      const vacant = [];
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (this.isVacantStatus(u.status)) vacant.push(`${this.names[key]} №${u.number} (${u.area}) — ${u.status}`);
      }
      vals.vacantColor = vacant.length ? '#a3312b' : '#3a7a42';
      vals.vacantText = vacant.length ? `Нарушение: ${vacant.length} пустующих помещений` : 'Нарушение отсутствует — пустующих помещений нет';
      vals.vacantList = vacant;

      const vacUnits = [];
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (this.isVacantStatus(u.status)) vacUnits.push({ number: u.number, area: u.area, location: this.names[key], areaNum: parseFloat(u.area.replace(',', '.')) });
      }
      vacUnits.sort((a, b) => b.areaNum - a.areaNum);
      vals.topRented = vacUnits.slice(0, 5);

      const catOf = (company) => {
        if (/ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(company)) return 'Владельцы (фонды, ПИФ, физлица)';
        if (/^ИП /.test(company)) return 'ИП';
        return 'Компании';
      };
      const cats = {};
      for (const key in SU) for (const u of (SU[key] || [])) {
        if (!u.company) continue;
        const cat = catOf(u.company);
        if (!cats[cat]) cats[cat] = { count: 0, area: 0 };
        cats[cat].count++; cats[cat].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.tenantCategories = Object.keys(cats).map(c => `${c}: ${cats[c].count} (${this.fmtArea(cats[c].area)})`);
    }

    vals.openTotal = () => this.openSummaryFilter('total', 'Все коммерческие помещения');
    vals.openSold = () => this.openSummaryFilter('sold', 'Проданные помещения');
    vals.openDvk = () => this.openSummaryFilter('dvk', 'Передано в ДВК (личные фонды)');
    vals.openLeased = () => this.openSummaryFilter('leased', 'Сдано в аренду');
    vals.openRented = () => this.openSummaryFilter('vacant', 'Вакантные / в простое');
    vals.closeSummaryFilter = () => this.setState({ summaryFilter: null, summaryPinned: true });
    if (this.state.summaryFilter) {
      const key = this.state.summaryFilter.key;
      const pred = key === 'total' ? (() => true)
        : key === 'sold' ? (u => u.status === 'Продано')
        : key === 'dvk' ? (u => this.isLeasedStatus(u.status) && this.isFund(u))
        : key === 'leased' ? (u => this.isLeasedStatus(u.status) && !this.isFund(u))
        : (u => this.isVacantStatus(u.status));
      const list = [];
      for (const bkey in this.units) for (const u of this.units[bkey]) {
        if (pred(u)) list.push({ ...u, location: this.names[bkey],
          status: this.unitStatus(bkey, u),
          liqColor: this.liqColors[u.liq] || 'transparent',
          strike: u.status === 'Продано' ? 'line-through' : 'none',
          role: this.isFund(u) ? 'Владелец' : (this.isLeasedStatus(u.status) ? 'Арендатор' : 'Правообладатель') });
      }
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list };
    } else {
      vals.summaryFilterInfo = null;
    }

    this.summaryExtra(vals);
    return vals;
  }

  // указатели «актива» — по одному на непроданное помещение, со стороны входа
  buildActiveMarks() {
    if (!this.state.showActive) return [];
    const PAL = {
      red: { c: '#a3312b', lite: '#c4645e', dark: '#7d2521', glow: 'rgba(163, 49, 43, 0.7)' },
      green: { c: '#3a7a42', lite: '#6aa370', dark: '#27562d', glow: 'rgba(58, 122, 66, 0.7)' },
      black: { c: '#2e2a24', lite: '#5c564d', dark: '#141210', glow: 'rgba(46, 42, 36, 0.6)' },
    };
    const ROT = { left: '0deg', right: '180deg', top: '90deg', bottom: '270deg' };
    const out = [];
    this._storefronts = [];
    for (const k of Object.keys(this.polys)) {
      const all = this.units[k] || [];
      const poly = this.polys[k];
      if (!all.length || !poly) continue;
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
      const boxes = this.planBoxes[k];
      // зоны аренды ЗУ и остановки — один шар в центре объекта, без стрелки
      if (k.startsWith('zu') || k.startsWith('stop') || k.startsWith('nto')) {
        const live = all.filter(u => u.status !== 'Продано');
        if (!live.length) continue;
        const sts = live.map(u => this.unitStatus(k, u));
        const pal = sts.some(s => /аренде/i.test(s)) ? PAL.green : sts.every(s => /Не введено/i.test(s)) ? PAL.black : PAL.red;
        out.push({ pe: 'none', key: k, left: (bx0 + bx1) / 2 + '%', top: (by0 + by1) / 2 + '%', dot: true,
          c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
        continue;
      }
      const rows = [];
      all.forEach((u, gi) => {
        if (u.status === 'Продано') return;
        const shp = boxes && boxes[gi] && boxes[gi][0];
        let cx = null, cy = null, bb = null;
        if (shp) {
          if (shp.poly) {
            const px = shp.poly.map(p => p[0]), py = shp.poly.map(p => p[1]);
            bb = { x0: Math.min(...px), x1: Math.max(...px), y0: Math.min(...py), y1: Math.max(...py) };
          } else { bb = { x0: shp.l, x1: shp.l + shp.w, y0: shp.t, y1: shp.t + shp.h }; }
          cx = (bb.x0 + bb.x1) / 2; cy = (bb.y0 + bb.y1) / 2;
        }
        rows.push({ u, gi, cx, cy, bb });
      });
      rows.forEach((r, i) => { if (r.cy == null) { r.cx = 50; r.cy = (i + 0.5) / rows.length * 100; } });
      const buckets = { left: [], right: [], top: [], bottom: [] };
      const forced = this.entrySide[k];
      rows.forEach((r) => {
        const num = String(r.u.number).split(',')[0].trim();
        const own = this.entrySide[k + '#' + num] || forced;
        if (own) { buckets[own].push(r); return; }
        const d = { left: r.cx, right: 100 - r.cx, top: r.cy, bottom: 100 - r.cy };
        let side = 'left';
        for (const s of ['right', 'top', 'bottom']) if (d[s] < d[side]) side = s;
        buckets[side].push(r);
      });
      const rnvD = this.rnv[k] ? (() => { const p = String(this.rnv[k]).split('.').map(Number); return new Date(p[2], p[1] - 1, p[0]); })() : null;
      const building = rnvD && rnvD > new Date();
      for (const side of ['left', 'right', 'top', 'bottom']) {
        const arr = buckets[side];
        if (!arr.length) continue;
        const vertical = side === 'left' || side === 'right';
        arr.sort((a, b) => (vertical ? a.cy - b.cy : a.cx - b.cx));
        let prev = -99;
        arr.forEach((r) => {
          let along = vertical ? by0 + r.cy / 100 * (by1 - by0) : bx0 + r.cx / 100 * (bx1 - bx0);
          const gap = vertical ? 2.1 : 2.6;
          if (along - prev < gap) along = prev + gap;
          prev = along;
          const num = String(r.u.number).split(',')[0].trim();
          const nd = this.entryNudge[k + '#' + num] || this.entryNudge[k] || [0, 0];
          const x = (side === 'left' ? bx0 - 1.5 : side === 'right' ? bx1 + 1.5 : along) + nd[0];
          const y = (side === 'top' ? by0 - 2.6 : side === 'bottom' ? by1 + 2.6 : along) + nd[1];
          const st = this.unitStatus(k, r.u);
          const pal = (building || /Не введено/i.test(st)) ? PAL.black : /аренде/i.test(st) ? PAL.green : PAL.red;
          const tipR = (this.tenantsReg[k] || []).find(t => t.unit && String(r.u.number).split(',')[0].trim() === t.unit) || null;
          const tipRate = (tipR && this.ratePick) ? (this.ratePick(tipR) || {}).rate : null;
          const tipName = tipR ? ((tipR.brand && tipR.brand !== '—') ? tipR.brand : tipR.tenant) : null;
          const tip = 'Пом. ' + String(r.u.number).split(',')[0].trim() + ' · ' + (r.u.area || '')
            + (tipName ? ' · ' + tipName : ' · нет арендатора')
            + ' · ставка: ' + (tipRate || 'нет данных') + ' · ' + st;
          // витрина окрашена по категории арендатора (traffic.js), пустая — чёрным
          const sfCat = (tipR && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(tipR) : null;
          const sfColor = tipR ? ((sfCat && sfCat.c) || '#4b2e83') : '#a3312b';
          const sfTip = tip + (sfCat ? ' · категория: ' + sfCat.name : '');
          out.push({ pe: 'auto', tip, onTip: () => this.setState({ activeTip: { text: tip, left: x + '%', top: y + '%' } }), offTip: () => this.setState({ activeTip: null }), key: k + '_' + r.gi, left: x + '%', top: y + '%', rot: 'rotate(' + ROT[side] + ')',
            c: pal.c, lite: pal.lite, dark: pal.dark, glow: pal.glow });
          // витрина: протяжённость помещения вдоль фасада берём из поэтажного плана
          // (контур помещения в % кропа) и проецируем на соответствующее ребро подъезда
          if (r.bb) {
            const to = (v) => (vertical ? by0 + v / 100 * (by1 - by0) : bx0 + v / 100 * (bx1 - bx0));
            let a0 = to(vertical ? r.bb.y0 : r.bb.x0), a1 = to(vertical ? r.bb.y1 : r.bb.x1);
            const minLen = (vertical ? (by1 - by0) : (bx1 - bx0)) * 0.12;
            if (a1 - a0 < minLen) { const mid = (a0 + a1) / 2; a0 = mid - minLen / 2; a1 = mid + minLen / 2; }
            a0 = Math.max(vertical ? by0 : bx0, a0); a1 = Math.min(vertical ? by1 : bx1, a1);
            const ins = 0.3;
            const fx = side === 'left' ? bx0 + ins : bx1 - ins;
            const fy = side === 'top' ? by0 + ins : by1 - ins;
            const toX = (v) => bx0 + v / 100 * (bx1 - bx0);
            const toY = (v) => by0 + v / 100 * (by1 - by0);
            // угловое помещение выходит на две наружные стены — витрину рисуем углом
            const dd = { left: r.bb.x0, right: 100 - r.bb.x1, top: r.bb.y0, bottom: 100 - r.bb.y1 };
            const perp = vertical ? ['top', 'bottom'] : ['left', 'right'];
            const sec = perp.reduce((a, b) => (dd[b] < dd[a] ? b : a));
            const corner = null; // углы витрин отключены — ищем более аккуратную геометрию
            const f2 = (a, b) => a.toFixed(2) + ',' + b.toFixed(2);
            const sfPoints = (() => {
              if (!corner) return vertical ? (f2(fx, a0) + ' ' + f2(fx, a1)) : (f2(a0, fy) + ' ' + f2(a1, fy));
              const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
              if (vertical) {
                const cy = corner === 'top' ? by0 + ins : by1 - ins;
                const far = cl(side === 'left' ? toX(r.bb.x1) : toX(r.bb.x0), bx0 + ins, bx1 - ins);
                return f2(fx, corner === 'top' ? a1 : a0) + ' ' + f2(fx, cy) + ' ' + f2(far, cy);
              }
              const cx2 = corner === 'left' ? bx0 + ins : bx1 - ins;
              const far = cl(side === 'top' ? toY(r.bb.y1) : toY(r.bb.y0), by0 + ins, by1 - ins);
              return f2(corner === 'left' ? a1 : a0, fy) + ' ' + f2(cx2, fy) + ' ' + f2(cx2, far);
            })();
            this._storefronts.push({ tip: sfTip,
                onTip: () => this.setState({ activeTip: { text: sfTip,
                  left: (vertical ? fx : (a0 + a1) / 2) + '%', top: (vertical ? (a0 + a1) / 2 : fy) + '%' } }),
                offTip: () => this.setState({ activeTip: null }),
                key: 'sf_' + k + '_' + r.gi, c: sfColor,
                cat: tipR ? ((sfCat && sfCat.name) || 'Прочее') : 'Свободно',
              points: sfPoints });
          }
        });
      }
    }
    return out;
  }
  };
};

window.OMJKLogic[6] = function (DCLogic) {
  return class JK extends window.GenplanCore(DCLogic) {
  state = { partIdx: 0, hovered: null, selected: null, summaryHovered: false, summaryPinned: false, summaryFilter: null, problemsVisible: false, efficiencyVisible: false, hoveredUnitIdx: null, planZoom: false, zoomHoverIdx: null };

  componentDidMount() {
    const apply = () => {
      const d = window.__SM_DATA_6;
      if (!d || !window.OMPriceNet) return false;
      this.units = d.units;
      // рыночная цена помещений — цена нетто из реестра рекомендуемых цен (август 2026)
      if (window.OMPriceNet) window.OMPriceNet.apply(6, this.units);
      this.rnv = d.rnv;
      if (window.OMSales && window.OMSales[6]) this.sales = window.OMSales[6];
      if (d.tenantsReg) this.tenantsReg = d.tenantsReg;
      this.forceUpdate();
      return true;
    };
    if (!apply()) {
      const t = setInterval(() => { if (apply()) clearInterval(t); }, 60);
      setTimeout(() => clearInterval(t), 20000);
    }
  }

  get polys() { return this.polysByPart[this.parts[this.state.partIdx || 0].key]; }

  names = {
    '31_1': 'Литер 31 · Подъезд 1', '31_2': 'Литер 31 · Подъезд 2', '31_3': 'Литер 31 · Подъезд 3',
    '32_1': 'Литер 32 · Подъезд 1', '32_2': 'Литер 32 · Подъезд 2',
    '33_1': 'Литер 33 · Подъезд 1', '33_2': 'Литер 33 · Подъезд 2',
    '34_1': 'Литер 34 · Подъезд 1', '34_2': 'Литер 34 · Подъезд 2', '34_3': 'Литер 34 · Подъезд 3',
    '35_1': 'Литер 35 · Подъезд 1', '35_2': 'Литер 35 · Подъезд 2', '35_3': 'Литер 35 · Подъезд 3',
    '36_1': 'Литер 36 · Подъезд 1', '36_2': 'Литер 36 · Подъезд 2',
    '37_1': 'Литер 37 · Подъезд 1', '37_2': 'Литер 37 · Подъезд 2',
    '38_1': 'Литер 38 · Подъезд 1', '38_2': 'Литер 38 · Подъезд 2', '38_3': 'Литер 38 · Подъезд 3',
    '45_1': 'Литер 45 · Подъезд 1', '45_2': 'Литер 45 · Подъезд 2', '45_3': 'Литер 45 · Подъезд 3',
    '46_1': 'Литер 46 · Подъезд 1', '46_2': 'Литер 46 · Подъезд 2', '46_3': 'Литер 46 · Подъезд 3',
    '39_1': 'Литер 39 · Подъезд 1', '39_2': 'Литер 39 · Подъезд 2', '39_3': 'Литер 39 · Подъезд 3',
    '40_1': 'Литер 40 · Подъезд 1', '40_2': 'Литер 40 · Подъезд 2', '40_3': 'Литер 40 · Подъезд 3',
    '41_1': 'Литер 41 · Подъезд 1', '41_2': 'Литер 41 · Подъезд 2', '41_3': 'Литер 41 · Подъезд 3',
    '42_1': 'Литер 42 · Подъезд 1', '42_2': 'Литер 42 · Подъезд 2', '42_3': 'Литер 42 · Подъезд 3',
    '43_1': 'Литер 43 · Подъезд 1', '43_2': 'Литер 43 · Подъезд 2', '43_3': 'Литер 43 · Подъезд 3',
    '44_1': 'Литер 44 · Подъезд 1', '44_2': 'Литер 44 · Подъезд 2', '44_3': 'Литер 44 · Подъезд 3',
    '47_1': 'Литер 47 · Подъезд 1', '47_2': 'Литер 47 · Подъезд 2', '47_3': 'Литер 47 · Подъезд 3', '47_4': 'Литер 47 · Подъезд 4',
    '48_1': 'Литер 48 · Подъезд 1', '48_2': 'Литер 48 · Подъезд 2', '48_3': 'Литер 48 · Подъезд 3',
    '49_1': 'Литер 49 · Подъезд 1', '49_2': 'Литер 49 · Подъезд 2', '49_3': 'Литер 49 · Подъезд 3', '49_4': 'Литер 49 · Подъезд 4',
    '50_1': 'Литер 50 · Подъезд 1', '50_2': 'Литер 50 · Подъезд 2', '50_3': 'Литер 50 · Подъезд 3', '50_4': 'Литер 50 · Подъезд 4',
    '53_1': 'Литер 53 · Подъезд 1', '53_2': 'Литер 53 · Подъезд 2', '53_3': 'Литер 53 · Подъезд 3', '53_4': 'Литер 53 · Подъезд 4',
    '54_1': 'Литер 54 · Подъезд 1', '54_2': 'Литер 54 · Подъезд 2', '54_3': 'Литер 54 · Подъезд 3', '54_4': 'Литер 54 · Подъезд 4',
    '51_1': 'Литер 51 · Подъезд 1', '51_2': 'Литер 51 · Подъезд 2', '51_3': 'Литер 51 · Подъезд 3',
    '52_1': 'Литер 52 · Подъезд 1', '52_2': 'Литер 52 · Подъезд 2', '52_3': 'Литер 52 · Подъезд 3', '52_4': 'Литер 52 · Подъезд 4',
    '59_1': 'Литер 59 · Подъезд 1', '59_2': 'Литер 59 · Подъезд 2', '59_3': 'Литер 59 · Подъезд 3', '59_4': 'Литер 59 · Подъезд 4', '59_5': 'Литер 59 · Подъезд 5',
    '60_1': 'Литер 60 · Подъезд 1', '60_2': 'Литер 60 · Подъезд 2', '60_3': 'Литер 60 · Подъезд 3', '60_4': 'Литер 60 · Подъезд 4',
    '65_1': 'Литер 65 · Подъезд 1', '65_2': 'Литер 65 · Подъезд 2', '65_3': 'Литер 65 · Подъезд 3', '65_4': 'Литер 65 · Подъезд 4',
    '66_1': 'Литер 66 · Подъезд 1', '66_2': 'Литер 66 · Подъезд 2', '66_3': 'Литер 66 · Подъезд 3', '66_4': 'Литер 66 · Подъезд 4',
    '55_1': 'Литер 55 · Подъезд 1', '55_2': 'Литер 55 · Подъезд 2', '55_3': 'Литер 55 · Подъезд 3', '55_4': 'Литер 55 · Подъезд 4',
    '56_1': 'Литер 56 · Подъезд 1', '56_2': 'Литер 56 · Подъезд 2', '56_3': 'Литер 56 · Подъезд 3', '56_4': 'Литер 56 · Подъезд 4',
    '57_1': 'Литер 57 · Подъезд 1', '57_2': 'Литер 57 · Подъезд 2', '57_3': 'Литер 57 · Подъезд 3', '57_4': 'Литер 57 · Подъезд 4', '57_5': 'Литер 57 · Подъезд 5',
    '58_1': 'Литер 58 · Подъезд 1', '58_2': 'Литер 58 · Подъезд 2', '58_3': 'Литер 58 · Подъезд 3', '58_4': 'Литер 58 · Подъезд 4',
    '61_1': 'Литер 61 · Подъезд 1', '61_2': 'Литер 61 · Подъезд 2', '61_3': 'Литер 61 · Подъезд 3', '61_4': 'Литер 61 · Подъезд 4',
    '62_1': 'Литер 62 · Подъезд 1', '62_2': 'Литер 62 · Подъезд 2', '62_3': 'Литер 62 · Подъезд 3', '62_4': 'Литер 62 · Подъезд 4',
    '63_1': 'Литер 63 · Подъезд 1', '63_2': 'Литер 63 · Подъезд 2', '63_3': 'Литер 63 · Подъезд 3', '63_4': 'Литер 63 · Подъезд 4',
    '64_1': 'Литер 64 · Подъезд 1', '64_2': 'Литер 64 · Подъезд 2', '64_3': 'Литер 64 · Подъезд 3', '64_4': 'Литер 64 · Подъезд 4',
  };

  utilJk = 's6';

  residentsCapacity = 50580;

  unitFields(key) {
    const list = this.units[key] || [];
    if (!list.length) return { noCommercial: true, commercial: null, unitsLabel: '', units: '', statuses: [] };
    const area = list.reduce((s, u) => s + parseFloat(u.area.replace(',', '.')), 0);
    const counts = {};
    for (const u of list) { const s = this.unitStatus(key, u); counts[s] = (counts[s] || 0) + 1; }
    return { noCommercial: false, commercial: list.length, unitsLabel: 'Площадь коммерческих помещений', units: this.fmtArea(area),
      statuses: Object.keys(counts).map(s => `${s}: ${counts[s]}`) };
  }

  renderVals() {
    if (window.OMKpAddr) window.OMKpAddr.apply(this, 's6');
    if (window.OMVolumes) this._volInfo = window.OMVolumes.fill(this);
    const vals = {};
    const fmtArea = (n) => this.fmtArea(n);
    const accent = '#2b2a27';
    const theme = this.props.theme || 'light';
    const themes = {
      light: { pageBg: '#f4f2ee', cardBg: '#fffdf9', border: '#ddd8cd', text: '#2b2a27', muted: '#6b6a64', imgCardBg: '#fff', statusNeutralBg: '#f7f5f0', statusGreenBg: '#eef6ee', statusOrangeBg: '#fbf3e6' },
      dark: { pageBg: '#1c1b18', cardBg: '#28261f', border: '#463f31', text: '#f0ece2', muted: '#a89f8f', imgCardBg: '#211f1a', statusNeutralBg: '#332f26', statusGreenBg: '#1f3324', statusOrangeBg: '#3a2c17' },
    };
    const th = themes[theme] || themes.light;
    vals.pageBg = th.pageBg; vals.cardBg = th.cardBg; vals.borderColor = th.border; vals.textColor = th.text;
    vals.mutedColor = th.muted; vals.imgCardBg = th.imgCardBg; vals.statusNeutralBg = th.statusNeutralBg;
    vals.statusGreenBg = th.statusGreenBg; vals.statusOrangeBg = th.statusOrangeBg;
    vals.statusRedBg = theme === 'dark' ? '#3a2420' : '#faf0ee';
    vals.statusNeutralBorder = '#c3bdb0';
    vals.accent = accent;

    vals.genplanImg = this.parts[this.state.partIdx || 0].img;
    vals.partTabs = this.parts.map((p, i) => ({ label: p.label,
      border: i === (this.state.partIdx || 0) ? '#a3312b' : th.border,
      bg: i === (this.state.partIdx || 0) ? '#a3312b' : 'transparent',
      color: i === (this.state.partIdx || 0) ? '#fffdf9' : th.muted,
      onClick: () => this.setState({ partIdx: i, hovered: null, selected: null }) }));
    vals.leave = () => this.leaveAll();
    vals.buildingPolys = Object.keys(this.polys).map((k) => {
      const hov = this.state.hovered === k || this.state.selected === k;
      return { id: k, points: this.polys[k].map(p => p.join(',')).join(' '),
        fill: 'transparent',
        stroke: hov ? '#a3312b' : 'transparent',
        onEnter: () => this.enter(k), onClick: () => this.select(k) };
    });

    if (this.state.hovered && this.polys[this.state.hovered]) {
      const key = this.state.hovered;
      const poly = this.polys[key];
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs);
      const by0 = Math.min(...ys);
      const TIP_W = 18, TIP_H = 30;
      let left, transform;
      if (bx1 + 1 + TIP_W <= 99) { left = (bx1 + 1) + '%'; transform = 'none'; }
      else { left = (bx0 - 1) + '%'; transform = 'translateX(-100%)'; }
      const top = Math.max(1, Math.min(by0, 99 - TIP_H)) + '%';
      vals.activeInfo = { name: this.names[key], left, top, transform, rnv: this.rnv[key], ...this.unitFields(key) };
    } else {
      vals.activeInfo = null;
    }

    vals.closePanel = () => this.closePanel();
    if (this.state.selected) {
      const id = this.state.selected;
      const regFor = (u) => { const t = (this.tenantsReg[id] || []).find(t => t.unit && String(u.number).split(',')[0].trim() === t.unit); return t ? { ...t, hasBrand: !!t.brand && t.brand !== '—' } : null; };
      const list = (this.units[id] || []).map((u, idx) => ({ ...u,
        status: this.unitStatus(id, u),
        liqColor: this.liqColors[u.liq] || 'transparent',
        strike: u.status === 'Продано' ? 'line-through' : 'none',
        notSold: u.status !== 'Продано',
        role: u.role || 'Владелец',
        companyOrDash: u.company || 'не указано',
        marketPrice: u.marketPrice || u.price || 'не указана',
        fias: this.fiasOf(id, u), cadastre: this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных', fias: this.fiasOf(id, u),
        cardBg: /Продано/i.test(u.status || '') ? '#1b1916' : (this.liqColors[u.liq] || 'transparent'),
        fg: /Продано/i.test(u.status || '') ? '#f2ede4' : vals.textColor,
        fgMuted: /Продано/i.test(u.status || '') ? '#a9a196' : vals.mutedColor,
        cornerFg: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        cardPad: /Продано/i.test(u.status || '') ? '7px 10px' : '10px 12px',
        cardAlign: /Продано/i.test(u.status || '') ? 'start' : 'stretch',
        chipMargin: /Продано/i.test(u.status || '') ? '4px 0 5px' : '6px 0 8px',
        rowGap: /Продано/i.test(u.status || '') ? '1px' : '3px',
        rowFont: /Продано/i.test(u.status || '') ? '11px' : '11.5px',
        rowLine: /Продано/i.test(u.status || '') ? '14px' : '16px',
        sale: this.saleOf(id, u),
        // категория торговой точки арендатора — кружок в углу карточки (traffic.js)
        ttChipCat: (() => {
          if (/Продано/i.test(u.status || '')) return null;
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          if (!r) return null;
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.name) || 'Прочее';
        })(),
        ttChipBg: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '1f';
        })(),
        ttChipBd: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return ((c && c.c) || '#4b2e83') + '59';
        })(),
        ttChipColor: (() => {
          const r = (this.tenantsReg[id] || []).find((t) => t.unit && String(u.number).split(',')[0].trim() === t.unit) || null;
          const c = (r && window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf(r) : null;
          return (c && c.c) || '#4b2e83';
        })(),
        // данные сделки показываем в каждой проданной карточке: нет записи — «нет данных»
        saleDate: (this.saleOf(id, u) || {}).date || 'нет данных',
        saleFact: (this.saleOf(id, u) || {}).fact || 'нет данных',
        saleAgent: (this.saleOf(id, u) || {}).agent || 'нет данных',
        saleBuyer: (this.saleOf(id, u) || {}).buyer || 'нет данных',
        corner: (this.actualPrice(id, u) || {}).value || (/Продано/i.test(u.status || '') ? 'нет данных' : ''),
        rentMarket: (this.actualPrice(id, u) || /Продано/i.test(u.status || '') || /^(nto|zu|stop)/.test(String(id))) ? '' : String(this.marketRentStr() || '').split(':').pop().trim(),
        cornerTitle: this.actualPrice(id, u) ? 'Актуальная цена помещения' : 'Актуальная на текущий год рыночная ставка аренды',
        cornerCaption: /Продано/i.test(u.status || '') ? 'Актуальная цена' : '',
        marketPrice: (this.actualPrice(id, u) || {}).value || u.marketPrice || u.price || 'не указана',
        marketLabel: this.actualPrice(id, u) ? 'Актуальная цена' : 'Рыночная цена',
        marketTitle: (this.actualPrice(id, u) || {}).basis || u.marketPrice || u.price || '',
        idleOnChange: this.idleOnChange(id, u),
        pastRows: this.pastTenants[id + '|' + String(u.number).split(',')[0].trim()] || [{ tenant: '—', rate: '—', period: '—' }],
        saleGrowth: this.saleGrowth(id, u),
        cadLabel: u.status === 'Продано' ? 'Наименование актуальной т.т.' : 'Кадастровый №',
        cadValue: u.status === 'Продано'
          ? (this.soldTt[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных')
          : (this.cadastre[id + '|' + String(u.number).split(',')[0].trim()] || 'нет данных'),
        sold: u.status === 'Продано',
        // категорию проданной точки берём из её названия единой функцией traffic.js
        ttCat: (() => {
          if (u.status !== 'Продано') return '—';
          const nm = this.soldTt[id + '|' + String(u.number).split(',')[0].trim()];
          if (!nm) return 'нет данных';
          const c = (window.OMTraffic && window.OMTraffic.catOf) ? window.OMTraffic.catOf({ brand: nm }) : null;
          return (c && c.name) || 'нет данных';
        })(),
        price: u.priceLabel ? u.price : '',
        priceLabel: u.priceLabel || 'Цена по прайсу',
        mgmtCo: u.mgmtCo || 'нет данных',
        mgmtRate: u.mgmtCo === 'без управления' ? '—' : (u.mgmtRate || '—'),
        mgmtActive: u.mgmtActive || (u.mgmtCo ? 'активен' : 'не активен'),
        mgmtPaid: u.mgmtPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.mgmtAccrued(id, u)),
        mgmtDiscount: u.mgmtDiscount || '—',
        rentDiscount: u.rentDiscount || '—',
        rentPaid: u.rentPaid || ((v) => v && v !== '0 ₽' ? v : '—')(this.rentAccrued(id, u)),
        rentDebt: u.rentDebt || '—',
        mgmtDebt: u.mgmtDebt || '—', penalties: u.penalties || '—',
        turnoverMonths: Array.from({ length: 12 }, (_, i) => { const m = i + 1; const active = (this.state.turnoverMonth || 1) === m;
          return { m, onClick: () => this.setState({ turnoverMonth: m }), bg: active ? accent : 'rgba(0,0,0,0.06)', fg: active ? '#fff' : vals.textColor, fw: active ? 700 : 400 }; }),
        turnoverValue: (u.turnover && u.turnover[this.state.turnoverMonth || 1]) || 'нет данных',
        mgmtNote: u.mgmtNote === undefined ? 'в выгрузке КП нет данных об управлении и долгах' : u.mgmtNote,
        bti: u.btiN || null,
        btiOrDash: u.btiN || 'не указаны',
        insurance: u.insurance || 'нет',
        cxUtil: this.cxUtilOf(id, u) || '—', cxUtilC: this.cxColor(this.cxUtilOf(id, u)),
        utilOpen: !!(this.state.utilOpen || {})[id + '|' + idx], utilChevron: (this.state.utilOpen || {})[id + '|' + idx] ? 'rotate(180deg)' : 'rotate(0deg)',
        toggleUtil: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = id + '|' + idx; this.setState(s => ({ utilOpen: { ...(s.utilOpen || {}), [k]: !(s.utilOpen || {})[k] } })); },
        ukLabel: (this.literUk && this.literUk[String(id).split('_')[0]]) || 'УК МКД',
        ...this.secVals(id, idx),
        cxUtilMkd: u.cxUtilMkd || this.costStr('uk', id, u), cxUtilElec: this.utilStr('e', id, u), cxUtilWater: this.utilStr('w', id, u), cxUtilHeat: this.utilStr('h', id, u),
        cxSecurity: u.cxSecurity || '—', cxSecurityC: this.cxColor(u.cxSecurity),
        cxCleaning: u.cxCleaning || '—', cxCleaningC: this.cxColor(u.cxCleaning),
        cxTO: u.cxTO || '—', cxTOC: this.cxColor(u.cxTO),
        cxAdmin: this.cxAdminOf(id, u), cxAdminC: this.cxColor(this.cxAdminOf(id, u)),
        cxTaxes: this.cxTaxesOf(id, u), cxTaxesC: this.cxColor(this.cxTaxesOf(id, u)),
        cxInsurance: u.cxInsurance || '—', cxInsuranceC: this.cxColor(u.cxInsurance),
        cxTotal: this.cxTotalOf(id, u),
        opStart: this.startInvest(u), opRepair: this.opRepairOf(u, id), opAnchor: u.opAnchor || '—', opLoss: u.opLoss || '—',
        opTotal: this.sumRub(this.opUnit(u, id), ['opStart', 'opRepair', 'opAnchor', 'opLoss']),
        effNoi: u.effNoi || this.noiOf(id, u, this.cxTotalOf(id, u)), effPayback: u.effPayback || this.paybackOf(id, u), effRoi: u.effRoi || this.roiOf(id, u), effCapRate: u.effCapRate || this.capRateOf(id, u), effPriceDyn: u.effPriceDyn || '—', effPriceDynC: this.growthColor(u.effPriceDyn), effFull: this.fullYieldOf(id, u), effFullC: this.growthColor(this.fullYieldOf(id, u)), effFullTitle: this.fullYieldTitle(id, u),
        effFair: this.fairValueOf(id, u), effFairTitle: this.fairValueTitle(id, u),
        fairColor: /Продано/i.test(u.status || '') ? '#e0938d' : '#a3312b',
        fairBorder: /Продано/i.test(u.status || '') ? 'rgba(224,147,141,0.35)' : 'rgba(163,49,43,0.22)',
        effCap: u.effCap || '14%', effSpread: u.effSpread || this.spreadOf(id, u), effSpreadC: this.growthColor(u.effSpread || this.spreadOf(id, u)), effOpexBack: u.effOpexBack || this.opexBackOf(id, u), effGrowth: u.effGrowth || this.assetGrowth(id, u), effGrowthYear: this.assetGrowthYear(id, u), effGrowthC: this.growthColor(this.assetGrowth(id, u)),
        ...this.chip(this.unitStatus(id, u)), ...this.donutsOf(id, u),
        ...this.regRow(id, u) }))
        .map((u, i) => ({ ...u, _i: i }))
        .sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
      const area = list.reduce((s, u) => s + parseFloat(u.area.replace(',', '.')), 0);
      const bCfg = this.bFloors[id] || null;
      const fi = this.state.floorIdx || 0;
      const fp = bCfg ? bCfg.floors[fi] : (this.floorPlans[id] || null);
      const rects = bCfg ? null : (this.planBoxes[id] || null);
      const hoveredIdx = this.state.hoveredUnitIdx;
      const bboxOf = (b) => b.poly ? (() => { const xs = b.poly.map(p => p[0]), ys = b.poly.map(p => p[1]); const l = Math.min(...xs), t = Math.min(...ys); return { l, t, w: Math.max(...xs) - l, h: Math.max(...ys) - t }; })() : b;
      const ptsOf = (b) => b.poly ? b.poly.map(p => p.join(',')).join(' ') : `${b.l},${b.t} ${b.l + b.w},${b.t} ${b.l + b.w},${b.t + b.h} ${b.l},${b.t + b.h}`;
      const centers = rects ? rects.map(grp => { const bb = bboxOf(grp[0]); return { left: (bb.l + bb.w / 2) + '%', top: (bb.t + bb.h / 2) + '%' }; }) : null;
      const highlightBoxes = centers ? centers.map((c, idx) => ({ ...c, opacity: hoveredIdx === idx ? 1 : 0 })) : null;
      const outlineOf = (idx) => (rects && idx != null && rects[idx]) ? rects[idx].map(b => ({ points: ptsOf(b) })) : null;
      vals.hoverOutline = outlineOf(hoveredIdx);
      vals.mopShapes = (bCfg ? [] : (this.planMop[id] || [])).map(b => ({ points: ptsOf(b) }));
      vals.planFloorTabs = bCfg ? bCfg.floors.map((f, i) => ({ label: f.label,
        border: i === fi ? '#a3312b' : '#c3bdb0', bg: i === fi ? '#a3312b' : 'transparent', color: i === fi ? '#fffdf9' : '#948f83',
        onClick: () => this.setState({ floorIdx: i, zoomHoverIdx: null }) })) : null;
      {
        // порядок карточек зафиксирован: в аренде → в простое → не введено → продано
        list.forEach((x, i) => { if (x._i === undefined) x._i = i; });
        list.sort((a, b) => this.unitRank(a) - this.unitRank(b) || a._i - b._i);
        const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
        // непроданные — одной строкой, проданные — по две в ряд с новой строки
        list.forEach((x, i) => {
          const sold = /Продано/i.test(String(x.status || ''));
          x.colStart = (fs >= 0 && i === fs) ? '1' : 'auto';
          x.rowBreak = fs >= 0 && i === fs;
          x.cardFlex = '0 0 300px';
        });
      }
      vals.selectedInfo = { name: this.names[id], rnv: this.rnv[id], commercial: list.length, units: fmtArea(area),
        statusChips: (() => {
          const m = {};
          for (const u of (this.units[id] || [])) { const s = this.unitStatus(id, u); if (!m[s]) m[s] = { n: 0, a: 0 }; m[s].n++; const n = parseFloat(String(u.area).replace(',', '.')); if (isFinite(n)) m[s].a += n; }
          return Object.keys(m).map(s => { const c = this.chip(s); return { label: s, count: m[s].n, area: m[s].a.toFixed(1).replace('.', ',') + ' м²', bg: c.chipBg, fg: c.chipFg, bd: c.chipBd }; });
        })(),
        addr: ((this.literAddr && this.literAddr[String(id).split('_')[0]]) || (bCfg ? bCfg.addr : null)), uk: (this.literUk && this.literUk[String(id).split('_')[0]]) || null, tenants: this.tenantsReg[id] || null,
        planLabel: bCfg ? 'Поэтажный план' : 'Поэтажный план · 1 этаж (подъезд)',
        planNote: bCfg ? 'Планы из техпаспорта. Кликните по плану, чтобы увеличить' : 'Серым выделены места общего пользования (МОП): лестницы, лифты, коридоры. Наведите на карточку помещения — его контур подсветится на плане',
        unitsList: (() => {
          const fs = list.findIndex((x) => /Продано/i.test(String(x.status || '')));
          // непроданные — одной строкой, проданные — по две в ряд с новой строки
          return list.map((u, i) => ({ ...u,
            rowBreak: fs >= 0 && i === fs,
            cardFlex: '0 0 300px',
            onEnter: () => this.setState({ hoveredUnitIdx: u._i }), onLeave: () => this.setState({ hoveredUnitIdx: null }) }));
        })(),
        planImg: fp ? fp.img : null, planAspect: fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null, planW: fp ? (fp.ratio < 0.4 ? '26%' : (fp.ratio < 0.6 ? '34%' : '62%')) : '62%', highlightBoxes };
      if (vals.selectedInfo) {
        const un = (vals.selectedInfo.unitsList || []);
        vals.selectedInfo.unitsUnsold = un.filter((u) => !/Продано/i.test(String(u.status || '')));
        const so = un.filter((u) => /Продано/i.test(String(u.status || '')));
        vals.selectedInfo.unitsSold = so.length ? so : null;
      }
      vals.openPlanZoom = () => this.setState({ planZoom: true });
      this.cardsScrollVals(vals);
      vals.planZoomImg = (this.state.planZoom && fp) ? fp.img : null;
      vals.stopProp = (e) => e.stopPropagation();
      {
        const zi = this.state.zoomHoverIdx;
        const zoomUnits = this.units[id] || [];
        // зоны наведения — по контуру помещения; мелкие фигуры рисуем последними, чтобы они были доступны поверх крупных
        vals.zoomHoverZones = rects ? rects.flatMap((grp, idx) => grp.map(b => {
          const bb = bboxOf(b);
          return { points: ptsOf(b), area: bb.w * bb.h,
            onHover: () => this.setState({ zoomHoverIdx: idx }), onUnhover: () => this.setState({ zoomHoverIdx: null }) };
        })).sort((a, b) => b.area - a.area) : null;
        vals.zoomPins = centers ? centers.map((c, idx) => ({ ...c, opacity: zi === idx ? 1 : 0 })) : null;
        vals.zoomOutline = outlineOf(zi);
        if (zi != null && rects && rects[zi] && zoomUnits[zi]) {
          const bb = bboxOf(rects[zi][0]);
          const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
          vals.zoomTooltip = { ...zoomUnits[zi], status: this.unitStatus(id, zoomUnits[zi]),
            left: clamp(bb.l + bb.w / 2, 14, 86) + '%',
            top: clamp(bb.t + bb.h / 2, 12, 82) + '%',
            tf: 'translate(-50%, -50%)', mt: '0px' };
        } else { vals.zoomTooltip = null; }
      }
      vals.planZoomAspect = fp ? `${Math.round(fp.ratio * 1000)} / 1000` : null;
      vals.planZoomW = fp ? `min(92vw, calc(88vh * ${fp.ratio.toFixed(4)}))` : '92vw';
    } else {
      vals.selectedInfo = null;
      vals.planZoomImg = null;
    }
    vals.closePlanZoom = () => this.setState({ planZoom: false, zoomHoverIdx: null });

    // карта трафика
    vals.trafficVisible = !!this.state.trafficOverlay;
    vals.trafficPanelVisible = !!this.state.trafficData;
    vals.trafficHidePanel = () => this.setState({ trafficData: false });
    vals.trafficOverlayBg = this.state.trafficOverlay ? '#a3312b' : 'transparent';
    vals.trafficOverlayFg = this.state.trafficOverlay ? '#ffffff' : '#a3312b';
    vals.trafficDataBg = this.state.trafficData ? '#a3312b' : 'transparent';
    vals.trafficDataFg = this.state.trafficData ? '#ffffff' : '#a3312b';
    vals.toggleTrafficOverlay = () => this.setState((s) => ({ trafficOverlay: !s.trafficOverlay }));
    vals.toggleTrafficData = () => this.setState((s) => ({ trafficData: !s.trafficData }));
    {
      const tr = (window.OMTraffic && (this.state.trafficOverlay || this.state.trafficData)) ? window.OMTraffic.build(this, vals) : null;
      vals.trafficMarks = tr ? tr.marks : [];
      vals.trafficLines = tr ? tr.lines : [];
      vals.trafficMagnets = tr ? tr.magnets : [];
      vals.trafficVacancies = tr ? tr.vacancies : [];
      vals.trafficStats = tr ? tr.stats : [];
      vals.trafficNote = tr ? tr.note : '';
    }

    vals.toggleSummary = () => this.toggleSummary();
    vals.enterSummary = () => this.setState({ summaryHovered: true });
    vals.leaveSummary = () => this.setState({ summaryHovered: false });
    vals.summaryVisible = this.state.summaryHovered || this.state.summaryPinned;

    {
      let totalCount = 0, totalArea = 0, soldCount = 0, soldArea = 0, soldSum = 0,
        dvkCount = 0, dvkArea = 0, leasedCount = 0, leasedArea = 0, rentedCount = 0, rentedArea = 0;
      for (const key in this.units) {
        for (const u of this.units[key]) {
          const area = parseFloat(u.area.replace(',', '.'));
          const price = parseFloat((u.price || '').replace(/[^\d]/g, '')) || 0;
          totalCount++; totalArea += area;
          if (u.status === 'Продано') { soldCount++; soldArea += area; soldSum += price; }
          else if (this.isLeasedStatus(u.status) && this.isFund(u)) { dvkCount++; dvkArea += area; }
          else if (this.isLeasedStatus(u.status)) { leasedCount++; leasedArea += area; }
          else if (this.isVacantStatus(u.status)) { rentedCount++; rentedArea += area; }
        }
      }
      vals.totalCount = totalCount; vals.totalArea = fmtArea(totalArea);
      vals.soldCount = soldCount; vals.soldArea = fmtArea(soldArea);
      vals.soldSum = Math.round(soldSum).toLocaleString('ru-RU') + ' ₽';
      vals.soldAvgSqm = soldArea ? Math.round(soldSum / soldArea).toLocaleString('ru-RU') + ' ₽/м²' : '—';
      vals.dvkCount = dvkCount; vals.dvkArea = fmtArea(dvkArea);
      vals.leasedCount = leasedCount; vals.leasedArea = fmtArea(leasedArea);
      vals.rentedCount = rentedCount; vals.rentedArea = fmtArea(rentedArea);
      vals.soldSharePct = totalArea ? Math.round((soldArea / totalArea) * 100) + '%' : '—';
      vals.rentedSharePct = totalArea ? Math.round((rentedArea / totalArea) * 100) + '%' : '—';

      const m = {};
      for (const key in this.units) for (const u of this.units[key]) {
        if (!this.isVacantStatus(u.status)) continue;
        if (!m[u.liq]) m[u.liq] = { count: 0, area: 0 };
        m[u.liq].count++; m[u.liq].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.liqRented = Object.keys(m).map(l => `${l}: ${m[l].count} (${fmtArea(m[l].area)})`);
    }

    vals.problemsVisible = this.state.problemsVisible;
    vals.toggleProblems = () => this.setState(s => ({ problemsVisible: !s.problemsVisible }));
    vals.efficiencyVisible = this.state.efficiencyVisible;
    vals.toggleEfficiency = () => this.setState(s => ({ efficiencyVisible: !s.efficiencyVisible }));
    this.occupancyVals(vals);

    {
      const vacant = [];
      for (const key in this.units) for (const u of this.units[key]) {
        if (this.isVacantStatus(u.status)) vacant.push(`${this.names[key]} №${u.number} (${u.area}) — ${u.status}`);
      }
      vals.vacantColor = vacant.length ? '#a3312b' : '#3a7a42';
      vals.vacantText = vacant.length ? `Нарушение: ${vacant.length} пустующих помещений` : 'Нарушение отсутствует — пустующих помещений нет';
      vals.vacantList = vacant;

      const vacUnits = [];
      for (const key in this.units) for (const u of this.units[key]) {
        if (this.isVacantStatus(u.status)) vacUnits.push({ number: u.number, area: u.area, location: this.names[key], areaNum: parseFloat(u.area.replace(',', '.')) });
      }
      vacUnits.sort((a, b) => b.areaNum - a.areaNum);
      vals.topRented = vacUnits.slice(0, 5);

      const catOf = (company) => {
        if (/ЛИЧНЫЙ ФОНД|Морозов|ПРОФИТ КАПИТАЛ/.test(company)) return 'Владельцы (фонды, ПИФ, физлица)';
        if (/^ИП /.test(company)) return 'ИП';
        return 'Компании';
      };
      const cats = {};
      for (const key in this.units) for (const u of this.units[key]) {
        if (!u.company) continue;
        const cat = catOf(u.company);
        if (!cats[cat]) cats[cat] = { count: 0, area: 0 };
        cats[cat].count++; cats[cat].area += parseFloat(u.area.replace(',', '.'));
      }
      vals.tenantCategories = Object.keys(cats).map(c => `${c}: ${cats[c].count} (${this.fmtArea(cats[c].area)})`);
    }

    vals.openTotal = () => this.openSummaryFilter('total', 'Все коммерческие помещения');
    vals.openSold = () => this.openSummaryFilter('sold', 'Проданные помещения');
    vals.openDvk = () => this.openSummaryFilter('dvk', 'Передано в ДВК (личные фонды)');
    vals.openLeased = () => this.openSummaryFilter('leased', 'Сдано в аренду');
    vals.openRented = () => this.openSummaryFilter('vacant', 'Вакантные / в простое');
    vals.closeSummaryFilter = () => this.setState({ summaryFilter: null, summaryPinned: true });
    if (this.state.summaryFilter) {
      const key = this.state.summaryFilter.key;
      const pred = key === 'total' ? (() => true)
        : key === 'sold' ? (u => u.status === 'Продано')
        : key === 'dvk' ? (u => this.isLeasedStatus(u.status) && this.isFund(u))
        : key === 'leased' ? (u => this.isLeasedStatus(u.status) && !this.isFund(u))
        : (u => this.isVacantStatus(u.status));
      const list = [];
      for (const bkey in this.units) for (const u of this.units[bkey]) {
        if (pred(u)) list.push({ ...u, location: this.names[bkey],
          status: this.unitStatus(bkey, u),
          liqColor: this.liqColors[u.liq] || 'transparent',
          strike: u.status === 'Продано' ? 'line-through' : 'none',
          role: this.isFund(u) ? 'Владелец' : (this.isLeasedStatus(u.status) ? 'Арендатор' : 'Правообладатель') });
      }
      vals.summaryFilterInfo = { label: this.state.summaryFilter.label, list };
    } else {
      vals.summaryFilterInfo = null;
    }

    this.summaryExtra(vals);
    return vals;
  }

  // контуры подъездов на кропе генплана (% от изображения); литеры Г-образные: два крыла = два подъезда
  // контуры подъездов на кропе генплана (% от изображения)
  parts = [
    { key: 'a', label: 'Квартал I · литеры 31–46', img: 'assets/genplan_samolet6_a.png' },
    { key: 'b', label: 'Квартал II · литеры 47–54', img: 'assets/genplan_samolet6_b.png' },
    { key: 'c', label: 'Квартал III · литеры 55–66', img: 'assets/genplan_samolet6_c.png' },
  ];

  polysByPart = {
    a: {
      '35_3': [[16.86,40.67],[21.2,40.67],[21.2,50],[19.9,50],[19.9,57.75],[16.86,57.75]],
      '35_2': [[19.9,50],[27.24,50],[27.24,57.75],[19.9,57.75]],
      '35_1': [[27.37,50],[33.97,50],[33.97,57.75],[27.37,57.75]],
      '36_1': [[44.0,40.96],[48.08,40.96],[48.08,57.75],[45.04,57.75],[45.04,50],[44.0,50]],
      '36_2': [[38.25,50],[45.04,50],[45.04,57.75],[38.25,57.75]],
      '37_2': [[19.68,21.95],[26.28,21.95],[26.28,29.75],[21.04,29.75],[21.04,26.1],[19.68,26.1]],
      '37_1': [[18.0,26.1],[21.04,26.1],[21.04,37.92],[18.0,37.92]],
      '38_1': [[31.6,21.85],[38.21,21.85],[38.21,29.75],[31.6,29.75]],
      '38_2': [[38.35,21.95],[45.45,21.95],[45.45,26.26],[43.72,26.26],[43.72,29.75],[38.35,29.75]],
      '38_3': [[43.72,26.26],[46.99,26.26],[46.99,38.08],[43.72,38.08]],
      '45_2': [[57.2,22.83],[64.37,22.83],[64.37,30.6],[58.53,30.6],[58.53,26.83],[57.2,26.83]],
      '45_3': [[64.6,22.83],[71.79,22.83],[71.79,30.6],[64.6,30.6]],
      '45_1': [[55.5,26.83],[58.53,26.83],[58.53,38.5],[55.5,38.5]],
      '46_1': [[78.4,22.42],[85.64,22.42],[85.64,29.92],[78.4,29.92]],
      '46_2': [[85.9,22.42],[92.85,22.42],[92.85,26.5],[91.6,26.5],[91.6,29.92],[85.9,29.92]],
      '46_3': [[91.6,26.5],[94.6,26.5],[94.6,38.15],[91.6,38.15]],
      '33_2': [[19.23,60.9],[25.7,60.9],[25.7,68.33],[20.51,68.33],[20.51,64.75],[19.23,64.75]],
      '33_1': [[17.18,64.75],[20.35,64.75],[20.35,76.67],[17.18,76.67]],
      '34_1': [[31.09,60.65],[37.69,60.65],[37.69,68.58],[31.09,68.58]],
      '34_2': [[37.9,60.9],[45.19,60.9],[45.19,64.75],[44.1,64.75],[44.1,68.58],[37.9,68.58]],
      '34_3': [[44.1,64.75],[47.31,64.75],[47.31,76.67],[44.1,76.67]],
      '31_3': [[16.86,79.42],[21.2,79.42],[21.2,88.75],[19.9,88.75],[19.9,96.5],[16.86,96.5]],
      '31_2': [[19.9,88.75],[27.24,88.75],[27.24,96.5],[19.9,96.5]],
      '31_1': [[27.37,88.67],[33.97,88.67],[33.97,96.5],[27.37,96.5]],
      '32_1': [[44.0,79.75],[48.08,79.75],[48.08,96.83],[45.0,96.83],[45.0,89.08],[44.0,89.08]],
      '32_2': [[38.25,89.08],[45.0,89.08],[45.0,96.83],[38.25,96.83]],
      '43_3': [[53.85,41.08],[58.06,41.08],[58.06,50.41],[56.89,50.41],[56.89,57.9],[53.85,57.9]],
      '43_2': [[56.89,50.41],[64.23,50.41],[64.23,57.9],[56.89,57.9]],
      '43_1': [[64.36,50.41],[71.41,50.41],[71.41,57.9],[64.36,57.9]],
      '44_3': [[78.59,50.41],[85.64,50.41],[85.64,57.9],[78.59,57.9]],
      '44_2': [[86.0,50.41],[93.11,50.41],[93.11,57.9],[86.0,57.9]],
      '44_1': [[91.94,41.08],[96.15,41.08],[96.15,57.9],[93.11,57.9],[93.11,50.41],[91.94,50.41]],
      '41_2': [[56.95,61.5],[64.04,61.5],[64.04,69.08],[58.2,69.08],[58.2,65.43],[56.95,65.43]],
      '41_3': [[64.27,61.5],[71.41,61.5],[71.41,69.08],[64.27,69.08]],
      '41_1': [[54.04,65.43],[58.2,65.43],[58.2,77.17],[54.04,77.17]],
      '42_1': [[78.75,61.5],[85.9,61.5],[85.9,69.08],[78.75,69.08]],
      '42_2': [[86.12,61.5],[93.21,61.5],[93.21,65.43],[91.96,65.43],[91.96,69.08],[86.12,69.08]],
      '42_3': [[91.96,65.43],[96.12,65.43],[96.12,77.17],[91.96,77.17]],
      '39_3': [[53.85,81.25],[58.06,81.25],[58.06,90.33],[56.89,90.33],[56.89,97.83],[53.85,97.83]],
      '39_2': [[56.89,90.33],[64.23,90.33],[64.23,97.83],[56.89,97.83]],
      '39_1': [[64.36,90.33],[71.41,90.33],[71.41,97.83],[64.36,97.83]],
      '40_3': [[78.9,90.33],[85.95,90.33],[85.95,97.83],[78.9,97.83]],
      '40_2': [[86.08,90.33],[93.11,90.33],[93.11,97.83],[86.08,97.83]],
      '40_1': [[92.2,81.25],[96.15,81.25],[96.15,97.83],[93.11,97.83],[93.11,90.33],[92.2,90.33]],
    },
    b: {
      '49_1': [[5.1,30],[7.8,30],[7.8,41.7],[5.1,41.7]],
      '49_2': [[6.8,25.2],[12.4,25.2],[12.4,32.4],[7.8,32.4],[7.8,30],[6.8,30]],
      '49_3': [[12.4,25.2],[18,25.2],[18,32.4],[12.4,32.4]],
      '49_4': [[18,30],[20.5,30],[20.5,41.7],[18,41.7]],
      '50_1': [[28.3,29.9],[31.1,29.9],[31.1,41.7],[28.3,41.7]],
      '50_2': [[30.8,25],[36.1,25],[36.1,32.3],[31.1,32.3],[31.1,29.9],[30.8,29.9]],
      '50_3': [[36.1,25],[41.9,25],[41.9,29.9],[41.2,29.9],[41.2,32.3],[36.1,32.3]],
      '50_4': [[41.2,29.9],[43.8,29.9],[43.8,41.7],[41.2,41.7]],
      '53_1': [[51.6,29.9],[54.3,29.9],[54.3,41.7],[51.6,41.7]],
      '53_2': [[53,25],[59,25],[59,32.3],[54.3,32.3],[54.3,29.9],[53,29.9]],
      '53_3': [[59,25],[65,25],[65,29.9],[64.3,29.9],[64.3,32.3],[59,32.3]],
      '53_4': [[64.3,29.9],[67,29.9],[67,41.7],[64.3,41.7]],
      '54_1': [[74.6,30.1],[77.4,30.1],[77.4,42],[74.6,42]],
      '54_2': [[76.1,25.1],[82.1,25.1],[82.1,32.5],[77.4,32.5],[77.4,30.1],[76.1,30.1]],
      '54_3': [[82.1,25.1],[88.3,25.1],[88.3,30.1],[87.4,30.1],[87.4,32.5],[82.1,32.5]],
      '54_4': [[87.4,30.1],[90,30.1],[90,42],[87.4,42]],
      '47_4': [[4.1,47.9],[7.9,47.9],[7.9,56.8],[6.6,56.8],[6.6,63.8],[4.1,63.8]],
      '47_3': [[6.6,56.8],[12.3,56.8],[12.3,63.8],[6.6,63.8]],
      '47_2': [[12.3,56.8],[18.7,56.8],[18.7,63.8],[12.3,63.8]],
      '47_1': [[17.9,47.9],[21.6,47.9],[21.6,63.8],[18.7,63.8],[18.7,56.8],[17.9,56.8]],
      '48_3': [[28.8,56.9],[35.4,56.9],[35.4,64],[28.8,64]],
      '48_2': [[35.4,56.9],[42.9,56.9],[42.9,64],[35.4,64]],
      '48_1': [[40.9,46.9],[44.8,46.9],[44.8,64],[42.9,64],[42.9,56.9],[40.9,56.9]],
      '51_3': [[50.3,47.1],[54.1,47.1],[54.1,56.9],[52.2,56.9],[52.2,64],[50.3,64]],
      '51_2': [[52.2,56.9],[59.7,56.9],[59.7,64],[52.2,64]],
      '51_1': [[59.7,56.9],[66.9,56.9],[66.9,64],[59.7,64]],
      '52_4': [[73.6,47.9],[77.4,47.9],[77.4,56.8],[76.1,56.8],[76.1,63.8],[73.6,63.8]],
      '52_3': [[76.1,56.8],[82,56.8],[82,63.8],[76.1,63.8]],
      '52_2': [[82,56.8],[88.3,56.8],[88.3,63.8],[82,63.8]],
      '52_1': [[87.4,47.9],[91.2,47.9],[91.2,63.8],[88.3,63.8],[88.3,56.8],[87.4,56.8]],
    },
    c: {
      '55_4': [[7.5,77],[10,77],[10,86.6],[9.1,86.6],[9.1,94.6],[6.4,94.6],[6.4,80.2],[7.5,80.2]],
      '55_3': [[9.1,86.6],[15,86.6],[15,94.6],[9.1,94.6]],
      '55_2': [[15,86.6],[20.6,86.6],[20.6,94.6],[15,94.6]],
      '55_1': [[19.8,77],[22.4,77],[22.4,80.2],[23.3,80.2],[23.3,94.6],[20.6,94.6],[20.6,86.6],[19.8,86.6]],
      '56_4': [[33.5,77],[36,77],[36,86.6],[35.2,86.6],[35.2,94.6],[32.4,94.6],[32.4,80.2],[33.5,80.2]],
      '56_3': [[35.2,86.6],[41,86.6],[41,94.6],[35.2,94.6]],
      '56_2': [[41,86.6],[46.7,86.6],[46.7,94.6],[41,94.6]],
      '56_1': [[45.8,77],[48.3,77],[48.3,80.2],[49.2,80.2],[49.2,94.6],[46.7,94.6],[46.7,86.6],[45.8,86.6]],
      '61_4': [[58.2,77.2],[60.8,77.2],[60.8,86.9],[60,86.9],[60,95],[57.2,95],[57.2,80.4],[58.2,80.4]],
      '61_3': [[60,86.9],[65.8,86.9],[65.8,95],[60,95]],
      '61_2': [[65.8,86.9],[71.3,86.9],[71.3,95],[65.8,95]],
      '61_1': [[70.5,77.2],[73,77.2],[73,80.4],[74,80.4],[74,95],[71.3,95],[71.3,86.9],[70.5,86.9]],
      '62_4': [[78.9,76.7],[81.5,76.7],[81.5,86.3],[80.7,86.3],[80.7,94.3],[78,94.3],[78,79.9],[78.9,79.9]],
      '62_3': [[80.7,86.3],[86.5,86.3],[86.5,94.3],[80.7,94.3]],
      '62_2': [[86.5,86.3],[92.1,86.3],[92.1,94.3],[86.5,94.3]],
      '62_1': [[91.2,76.7],[93.8,76.7],[93.8,79.9],[94.6,79.9],[94.6,94.3],[92.1,94.3],[92.1,86.3],[91.2,86.3]],
      '57_5': [[7.1,45.8],[9.8,45.8],[9.8,55.6],[9.4,55.6],[9.4,64.4],[6.2,64.4],[6.2,48.9],[7.1,48.9]],
      '57_4': [[9.4,55.6],[15.7,55.6],[15.7,64.4],[9.4,64.4]],
      '57_3': [[15.7,55.6],[21.2,55.6],[21.2,64.4],[15.7,64.4]],
      '57_2': [[21.2,55.6],[26.9,55.6],[26.9,64.4],[21.2,64.4]],
      '57_1': [[26.1,45.8],[28.7,45.8],[28.7,48.9],[29.6,48.9],[29.6,64.4],[26.9,64.4],[26.9,55.6],[26.1,55.6]],
      '58_4': [[33.5,46.1],[36.1,46.1],[36.1,55.8],[35.4,55.8],[35.4,64.6],[32.6,64.6],[32.6,49.3],[33.5,49.3]],
      '58_3': [[35.4,55.8],[41.2,55.8],[41.2,64.6],[35.4,64.6]],
      '58_2': [[41.2,55.8],[46.9,55.8],[46.9,64.6],[41.2,64.6]],
      '58_1': [[46,46.1],[48.6,46.1],[48.6,49.3],[49.5,49.3],[49.5,64.6],[46.9,64.6],[46.9,55.8],[46,55.8]],
      '63_4': [[58.2,46.5],[60.9,46.5],[60.9,56.2],[59.9,56.2],[59.9,64.8],[57.2,64.8],[57.2,49.6],[58.2,49.6]],
      '63_3': [[59.9,56.2],[65.7,56.2],[65.7,64.8],[59.9,64.8]],
      '63_2': [[65.7,56.2],[71.3,56.2],[71.3,64.8],[65.7,64.8]],
      '63_1': [[70.5,46.5],[73.2,46.5],[73.2,49.6],[74,49.6],[74,64.8],[71.3,64.8],[71.3,56.2],[70.5,56.2]],
      '64_4': [[79,46.5],[81.6,46.5],[81.6,56.1],[80.9,56.1],[80.9,64.9],[78.1,64.9],[78.1,49.4],[79,49.4]],
      '64_3': [[80.9,56.1],[86.6,56.1],[86.6,64.9],[80.9,64.9]],
      '64_2': [[86.6,56.1],[92.2,56.1],[92.2,64.9],[86.6,64.9]],
      '64_1': [[91.4,46.5],[94,46.5],[94,49.4],[94.9,49.4],[94.9,64.9],[92.2,64.9],[92.2,56.1],[91.4,56.1]],
      '59_1': [[7.4,28.4],[10,28.4],[10,41.9],[7.4,41.9]],
      '59_2': [[9.2,23.8],[15.2,23.8],[15.2,32],[10,32],[10,28.4],[9.2,28.4]],
      '59_3': [[15.2,23.8],[21,23.8],[21,32],[15.2,32]],
      '59_4': [[21,23.8],[26.9,23.8],[26.9,28.4],[26,28.4],[26,32],[21,32]],
      '59_5': [[26,28.4],[28.6,28.4],[28.6,41.9],[26,41.9]],
      '60_1': [[33.8,29.3],[36.2,29.3],[36.2,42.8],[33.8,42.8]],
      '60_2': [[35,24.5],[41,24.5],[41,33.1],[36.2,33.1],[36.2,29.3],[35,29.3]],
      '60_3': [[41,24.5],[47.1,24.5],[47.1,29.3],[46.2,29.3],[46.2,33.1],[41,33.1]],
      '60_4': [[46.2,29.3],[48.6,29.3],[48.6,42.8],[46.2,42.8]],
      '65_1': [[58.2,28.9],[60.7,28.9],[60.7,42.7],[58.2,42.7]],
      '65_2': [[59.4,24.2],[65.6,24.2],[65.6,33],[60.7,33],[60.7,28.9],[59.4,28.9]],
      '65_3': [[65.6,24.2],[71.7,24.2],[71.7,28.9],[70.6,28.9],[70.6,33],[65.6,33]],
      '65_4': [[70.6,28.9],[73,28.9],[73,42.7],[70.6,42.7]],
      '66_1': [[79.3,29.45],[81.85,29.45],[81.85,43.2],[79.3,43.2]],
      '66_2': [[80.5,24.9],[86.6,24.9],[86.6,33.1],[81.85,33.1],[81.85,29.45],[80.5,29.45]],
      '66_3': [[86.6,24.9],[92.65,24.9],[92.65,29.45],[91.56,29.45],[91.56,33.1],[86.6,33.1]],
      '66_4': [[91.56,29.45],[94.1,29.45],[94.1,43.2],[91.56,43.2]],
    },
  };
  };
};
