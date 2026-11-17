// Площадки НТО по схеме «Расположение НТО на генеральном плане» (01.04.2026).
// Координаты — доли мастер-плана assets/master_genplan.jpg (%); в планы очередей
// пересчитываются через OMGeo.master.boxes. Ключ id — номер площадки со схемы.
window.OMNto = {
  color: '#d0342c',
  pads: [{"id":"4/2","zone":"4","box":[3.78,79.89,5.15,81.445]},{"id":"4/1","zone":"4","box":[3.78,81.445,5.15,83]},{"id":"2/1","zone":"2","box":[3.78,83.65,5.15,84.62]},{"id":"2/2","zone":"2","box":[3.78,84.62,5.15,85.59]},{"id":"1.1/1","zone":"1","box":[3.78,86.11,5.15,87.297]},{"id":"1.1/2","zone":"1","box":[3.78,87.297,5.15,88.483]},{"id":"1.1/3","zone":"1","box":[3.78,88.483,5.15,89.67]},{"id":"1.2/1","zone":"1","box":[3.78,89.67,5.15,90.857]},{"id":"1.2/2","zone":"1","box":[3.78,90.857,5.15,92.043]},{"id":"1.2/3","zone":"1","box":[3.78,92.043,5.15,93.23]},{"id":"14/1","zone":"14","box":[48.71,6.51,49.515,8.2]},{"id":"14/2","zone":"14","box":[49.515,6.51,50.32,8.2]},{"id":"15/1","zone":"15","box":[63.12,6.51,63.925,8.2]},{"id":"15/2","zone":"15","box":[63.925,6.51,64.73,8.2]},{"id":"16/1","zone":"16","box":[65.38,6.51,66.145,8.2]},{"id":"16/2","zone":"16","box":[66.145,6.51,66.91,8.2]},{"id":"17/1","zone":"17","box":[81,6.51,81.765,8.2]},{"id":"17/2","zone":"17","box":[81.765,6.51,82.53,8.2]},{"id":"22/1","zone":"22","box":[48.15,83.26,49.235,85.59]},{"id":"22/2","zone":"22","box":[49.235,83.26,50.32,85.59]},{"id":"24.1/1","zone":"24","box":[63.29,84.94,64.57,86.154]},{"id":"24.1/2","zone":"24","box":[63.29,86.154,64.57,87.368]},{"id":"24.2/1","zone":"24","box":[63.29,87.368,64.57,88.581]},{"id":"24.2/2","zone":"24","box":[63.29,88.581,64.57,89.795]},{"id":"24.3/1","zone":"24","box":[63.29,89.795,64.57,91.009]},{"id":"24.3/2","zone":"24","box":[63.29,91.009,64.57,92.222]},{"id":"24.4/1","zone":"24","box":[63.29,92.222,64.57,93.436]},{"id":"24.4/2","zone":"24","box":[63.29,93.436,64.57,94.65]}],
  // площадки в координатах картинки img (% ширины/высоты), с отсечением по краю;
  // павильон показывается только на «своём» кадре (part из nto_sz.js), если он задан
  forImage(img) {
    var G = window.OMGeo && window.OMGeo.master; if (!G) return [];
    var b = img === G.img ? { x: 0, y: 0, w: 1, h: 1 } : G.boxes[img]; if (!b) return [];
    var sz = window.OMNtoSZ, home = {};
    if (sz) sz.rows.forEach(function (r) { if (r.part) home[r.sub || r.zone] = 'genplan_samolet' + r.jk + '_' + r.part + '.png'; });
    var out = [];
    for (var i = 0; i < this.pads.length; i++) { var p = this.pads[i], r = p.box;
      var hk = home[p.id.split('/')[0]] || home[p.zone]; if (hk && img.indexOf(hk) < 0 && /genplan_samolet6_/.test(img)) continue;
      var x0 = (r[0] / 100 - b.x) / b.w * 100, y0 = (r[1] / 100 - b.y) / b.h * 100, x1 = (r[2] / 100 - b.x) / b.w * 100, y1 = (r[3] / 100 - b.y) / b.h * 100;
      if (x1 <= 0 || y1 <= 0 || x0 >= 100 || y0 >= 100) continue;
      var cx0 = Math.max(0, x0), cy0 = Math.max(0, y0), cx1 = Math.min(100, x1), cy1 = Math.min(100, y1);
      if ((cx1 - cx0) < (x1 - x0) * 0.5 || (cy1 - cy0) < (y1 - y0) * 0.5) continue;
      out.push({ id: p.id, zone: p.zone, x: cx0, y: cy0, w: cx1 - cx0, h: cy1 - cy0,
        points: [[cx0, cy0], [cx1, cy0], [cx1, cy1], [cx0, cy1]].map(function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); }).join(' '),
        lx: ((cx0 + cx1) / 2).toFixed(2) + '%', ly: ((cy0 + cy1) / 2).toFixed(2) + '%' });
    }
    return out;
  },
  // готовые значения для шаблона: полигоны + подписи; hovered — id площадки под курсором
  vals(comp, img) {
    var list = this.forImage(img), hov = comp.state.ntoHover, sz = window.OMNtoSZ;
    var rowOf = function (p) { if (!sz) return null; return sz.rows.filter(function (q) { return q.sub ? p.id.indexOf(q.sub + '/') === 0 : q.zone === p.zone; })[0] || null; };
    var pads = list.map(function (p) { var r = rowOf(p), k = r ? 'nto' + r.n : null, h = hov === p.id || (k && comp.state.selected === k); return {
      id: p.id, points: p.points, left: p.lx, top: p.ly, label: p.id, n: r ? r.n : null,
      fill: h ? 'rgba(208,52,44,0.55)' : 'rgba(208,52,44,0.32)', stroke: '#d0342c',
      onEnter: function () { comp.setState({ ntoHover: p.id }); }, onLeave: function () { comp.setState({ ntoHover: null }); },
      onClick: function () { if (k && comp.units && comp.units[k]) comp.select(k); } }; });
    pads.labels = pads.map(function (p) { return { label: p.label, left: p.left, top: p.top }; });
    // подсказка «НТО №N» над павильоном под курсором
    var hp = pads.filter(function (p) { return p.id === hov && p.n; })[0];
    if (hp) { var g = list.filter(function (p) { var r = rowOf(p); return r && r.n === hp.n; }), x0 = 1e9, y0 = 1e9, x1 = -1e9;
      g.forEach(function (p) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x + p.w); });
      pads.tip = { text: 'НТО №' + hp.n, left: ((x0 + x1) / 2).toFixed(2) + '%', top: y0.toFixed(2) + '%' }; }
    return pads;
  }
};