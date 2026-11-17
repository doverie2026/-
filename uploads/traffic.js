// Карта трафика — расчёт из уже имеющихся данных: реестр аренды (виды деятельности)
// и геометрия подъездов на генплане (this.polys, координаты в % изображения).
// Никаких внешних данных о посещаемости нет; всё, что показывается, выводится
// из этих двух источников и подписано формулой.
(function () {
  // Порядок важен: первая сработавшая категория и определяет вес. Красота стоит
  // выше общепита, иначе «барбершоп» ловится на «бар»; продуктовые — ниже красоты,
  // иначе «Магнит Косметик» уходит в продукты.
  var CATS = [
    { re: /пвз|пункт выдачи|wildberries|ozon|озон|яндекс маркет|сдэк|cdek|boxberry|5post|почтомат/i, w: 3, name: 'ПВЗ и постаматы', c: '#a3312b' },
    { re: /аптек|оптик|медиц|стомат|клиник|лаборатор/i, w: 2.5, name: 'Аптеки и медицина', c: '#3a7a42' },
    { re: /барбер|парикмахер|красот|космет|ногт|маникюр|массаж|солярий|тату|салон красоты|нейл|эпиляц|брови|ресниц/i, w: 1.2, name: 'Красота', c: '#a34b7d' },
    { re: /продукт|супермаркет|магнит|пятёрочка|пятерочка|дикси|верный|бристоль|красное|алкогол|табак|разлив|мясо|рыб(?:а|ный)|овощ/i, w: 3, name: 'Продукты и напитки', c: '#c2703c' },
    { re: /пекарн|кофе|кондитер|булочн|кулинар|шаурм|фастфуд|пицц|суши|донер|блинн/i, w: 2, name: 'Пекарни и кофе', c: '#c98a2b' },
    { re: /кафе|ресторан|столов|общепит|кухни мира|бургер|burger|плов|вкусно и точка|кальян|паб\b|\bбар\b|бистро|фуд/i, w: 1.5, name: 'Общепит', c: '#8a5a2b' },
    { re: /детск|развива|образова|школ|детский сад|кружок|репетит|логопед/i, w: 1.5, name: 'Детское и образование', c: '#4a6fa5' },
    { re: /фитнес|спорт|тренаж|йог|бассейн|единоборст|танц/i, w: 1.5, name: 'Спорт', c: '#2f7d7a' },
    { re: /банк|мфц|почта|нотариу|страхов|микрозайм|ломбард|юрид|агентство недвиж/i, w: 1, name: 'Услуги и финансы', c: '#6b665c' },
    { re: /зоо|цвет|хозтовар|ремонт|ателье|химчист|мастерск|прачеч|ключ|вейп|табачн/i, w: 1, name: 'Бытовые услуги', c: '#8a8479' },
  ];

  function cat(t) {
    var s = [t && t.activity, t && t.brand, t && t.tenant].filter(Boolean).join(' ');
    // «мебельный салон», «салон связи» и подобное не относится к красоте
    s = s.replace(/(мебельн\w*|швейн\w*|шинн\w*|автомобильн\w*|ювелирн\w*)\s+салон/gi, '$1');
    s = s.replace(/салон\s+(мебели|связи|шин|дверей|обуви|оптики|тканей)/gi, '');
    for (var i = 0; i < CATS.length; i++) if (CATS[i].re.test(s)) return CATS[i];
    // тёмно-фиолетовый: светло-бежевый сливался с корпусами литеров на генплане
    return { w: 0.5, name: 'Прочее', c: '#4b2e83' };
  }
  function num(a) {
    var v = parseFloat(String(a == null ? '' : a).replace(/[^\d,.]/g, '').replace(/\s/g, '').replace(',', '.'));
    return isFinite(v) ? v : 0;
  }
  function centroid(poly) {
    var xs = poly.map(function (p) { return p[0]; }), ys = poly.map(function (p) { return p[1]; });
    return [(Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2,
            (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2];
  }
  function fmtArea(v) { return v.toFixed(1).replace('.', ',') + ' м²'; }

  // c — экземпляр логики генплана (this), vals — объект значений шаблона
  function build(c, vals) {
    var polys = c.polys || {}, units = c.units || {}, reg = c.tenantsReg || {}, names = c.names || {};
    var keys = Object.keys(polys).filter(function (k) { return (polys[k] || []).length >= 3; });
    var nodes = {};
    keys.forEach(function (k) {
      var cen = centroid(polys[k]);
      var list = reg[k] || [];
      var own = 0, anchors = [];
      list.forEach(function (t) {
        var cc = cat(t);
        own += cc.w;
        anchors.push({ name: (t.brand && t.brand !== '—') ? t.brand : (t.tenant || 'арендатор'), cat: cc.name, w: cc.w, area: num(t.area) });
      });
      nodes[k] = { key: k, x: cen[0], y: cen[1], own: own, anchors: anchors, label: names[k] || k };
    });

    // гравитационный индекс: свои магниты + магниты соседей с затуханием по расстоянию
    var maxScore = 0;
    keys.forEach(function (k) {
      var n = nodes[k], s = n.own;
      keys.forEach(function (o) {
        if (o === k || !nodes[o].own) return;
        var dx = nodes[o].x - n.x, dy = nodes[o].y - n.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        s += nodes[o].own / (1 + d / 6);
      });
      n.score = s;
      if (s > maxScore) maxScore = s;
    });
    keys.forEach(function (k) { nodes[k].rel = maxScore ? nodes[k].score / maxScore : 0; });

    // линии тяготения: от подъезда без своих магнитов к ближайшему магниту
    var anchorKeys = keys.filter(function (k) { return nodes[k].own > 0; });
    var lines = [];
    keys.forEach(function (k) {
      if (nodes[k].own > 0) return;
      var best = null, bd = 1e9;
      anchorKeys.forEach(function (a) {
        var dx = nodes[a].x - nodes[k].x, dy = nodes[a].y - nodes[k].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < bd) { bd = d; best = a; }
      });
      if (!best || bd > 40) return;
      lines.push({ x1: nodes[k].x, y1: nodes[k].y, x2: nodes[best].x, y2: nodes[best].y,
        w: (bd < 8 ? 3 : bd < 18 ? 2 : 1.2) });
    });

    // маркеры: размер и цвет по индексу трафика
    var marks = keys.map(function (k) {
      var n = nodes[k];
      var size = Math.round(22 + n.rel * 24);
      var strong = n.rel >= 0.66, mid = n.rel >= 0.33;
      // якорные продуктовые «Магнит» и «Пятёрочка» показываем треугольником
      var isBig = n.anchors.some(function (a) { return /магнит|пятёрочка|пятерочка/i.test(a.name || ''); });
      return { key: k, left: n.x + '%', top: n.y + '%', size: size + 'px',
        bg: strong ? 'rgba(163,49,43,0.92)' : mid ? 'rgba(163,49,43,0.62)' : 'rgba(107,102,92,0.55)',
        bd: strong ? '#7d2521' : mid ? '#a3312b' : '#8a8479',
        big: isBig,
        radius: isBig ? '2px' : '50%',
        clip: isBig ? 'polygon(50% 0%, 100% 100%, 0% 100%)' : 'none',
        border: isBig ? '0' : '2px',
        pad: isBig ? Math.round(size * 0.3) + 'px' : '0',
        label: n.own > 0 ? String(n.anchors.length) : '' };
    });

    // магниты списком
    var magnets = [];
    anchorKeys.sort(function (a, b) { return nodes[b].own - nodes[a].own; }).forEach(function (k) {
      nodes[k].anchors.sort(function (a, b) { return b.w - a.w; }).forEach(function (a) {
        magnets.push({ liter: nodes[k].label, name: a.name, cat: a.cat,
          area: a.area ? fmtArea(a.area) : '—', weight: a.w.toFixed(1).replace('.0', '').replace('.', ',') });
      });
    });

    // рейтинг вакантных помещений по индексу трафика их подъезда
    var vac = [];
    keys.forEach(function (k) {
      var n = nodes[k];
      (units[k] || []).forEach(function (u) {
        var st = String(u.status || '');
        if (/Продано|процессе оформления/i.test(st)) return;
        var taken = (reg[k] || []).some(function (t) { return t.unit && String(u.number).split(',')[0].trim() === t.unit; });
        if (taken) return;
        vac.push({ number: String(u.number), liter: n.label, area: fmtArea(num(u.area)),
          idx: Math.round(n.rel * 100), own: n.own > 0,
          mark: n.rel >= 0.66 ? 'высокий' : n.rel >= 0.33 ? 'средний' : 'низкий',
          color: n.rel >= 0.66 ? '#3a7a42' : n.rel >= 0.33 ? '#b4802a' : '#8a8479' });
      });
    });
    vac.sort(function (a, b) { return b.idx - a.idx || num(b.area) - num(a.area); });

    var perLiter = '—';
    var occ = parseFloat(String(vals && vals.occResidents || '').replace(/[^\d]/g, ''));
    if (isFinite(occ) && occ > 0 && keys.length) perLiter = Math.round(occ / keys.length).toLocaleString('ru-RU') + ' чел. на подъезд (равномерная оценка)';

    return {
      marks: marks, lines: lines, magnets: magnets,
      vacancies: vac.slice(0, 10),
      stats: [
        { k: 'Магнитов в реестре', v: String(magnets.length) },
        { k: 'Подъездов с магнитами', v: anchorKeys.length + ' из ' + keys.length },
        { k: 'Линий тяготения', v: String(lines.length) },
        { k: 'Жильцы рядом с коммерцией', v: perLiter },
      ],
      note: 'Индекс трафика = вес магнитов подъезда + веса магнитов соседей с затуханием по расстоянию на генплане. Веса: ПВЗ и продукты 3, аптеки 2,5, пекарни 2, общепит/детское/спорт 1,5, красота 1,2, услуги 1, прочее 0,5. Данных счётчиков посещаемости нет — расчёт по реестру аренды на 27.08.2026 и геометрии генплана.',
      empty: !magnets.length,
    };
  }

  // Скоринг по реестру аренды без геометрии — для матрицы: веса те же, что в карте генплана
  function scoreReg(reg) {
    var own = 0, anchors = [], byCat = {};
    for (var k in (reg || {})) (reg[k] || []).forEach(function (tt) {
      var cc = cat(tt);
      own += cc.w;
      byCat[cc.name] = (byCat[cc.name] || 0) + 1;
      anchors.push({ liter: k, unit: tt.unit || '', name: (tt.brand && tt.brand !== '—') ? tt.brand : (tt.tenant || 'арендатор'),
        cat: cc.name, w: cc.w, c: cc.c, area: num(tt.area) });
    });
    anchors.sort(function (a, b) { return b.w - a.w || b.area - a.area; });
    var cats = Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; })
      .map(function (c) { return c + ' · ' + byCat[c]; });
    return { own: own, anchors: anchors, cats: cats, byCat: byCat };
  }

  // catOf — категория одного арендатора (имя, вес, цвет): для подсветки витрин на генплане
  window.OMTraffic = { build: build, scoreReg: scoreReg, catOf: cat, cats: CATS };
})();
