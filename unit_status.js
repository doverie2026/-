// Статус помещения «как в карточке» — единственное место, где он вычисляется.
// В выгрузке КП статусы другие («Не продается», «Проверка», «Аренда» = простаивает),
// карточка генплана их не показывает: продажа берётся из выгрузки, остальное —
// из реестра договоров аренды и даты РНВ. Здесь та же формула, что в методе unitStatus
// генпланов; результат проставляется в поле cardStatus каждой карточки.
window.OMStatus = {
  // РНВ считается наступившей, только если дата уже прошла
  rnvDone: function (v) {
    var m = String(v || '').match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return false;
    return new Date(+m[3], +m[2] - 1, +m[1]) <= new Date();
  },

  of: function (src, key, u) {
    if (/Продано|процессе оформления/i.test(u.status || '')) return 'Продано';
    var reg = (src.tenantsReg && src.tenantsReg[key]) || [];
    var num = String(u.number).split(',')[0].trim();
    var r = null;
    for (var i = 0; i < reg.length; i++) if (reg[i].unit && String(reg[i].unit) === num) { r = reg[i]; break; }
    var rnv = this.rnvDone(src.rnv && src.rnv[key]);
    var ended = r && (/законч|не предусмотр|^нет\b/i.test(r.holiday || '') || /^\d{2}\.\d{2}\.\d{4}$/.test(String(r.contract || '')));
    if (r && ended) return 'В аренде';
    if (r) return rnv ? 'В простое с арендатором' : 'Не введено в эксплуатацию с арендатором';
    if (!rnv) return 'Не введено в эксплуатацию';
    // реестр без привязки к номерам помещений (С1) — сопоставить с договорами нечем,
    // поэтому аренду берём по статусу выгрузки
    if ((!this.regHasUnits(src) || u.kpLease) && /В аренде/i.test(u.status || '')) return 'В аренде';
    return 'В простое';
  },

  regHasUnits: function (src) {
    if (src._regHasUnits === undefined) {
      var has = false, reg = src.tenantsReg || {};
      for (var k in reg) { for (var i = 0; i < reg[k].length; i++) if (reg[k][i].unit) { has = true; break; } if (has) break; }
      src._regHasUnits = has;
    }
    return src._regHasUnits;
  },

  // проставляет cardStatus во все карточки ЖК; у отдельно стоящей коммерции
  // из поэтажных планов статус задан прямо в плане — его и оставляем
  apply: function (src) {
    if (!src || src._statusApplied) return src;
    var k, i;
    for (k in (src.units || {})) {
      for (i = 0; i < src.units[k].length; i++) src.units[k][i].cardStatus = this.of(src, k, src.units[k][i]);
    }
    for (k in (src.extraUnits || {})) {
      for (i = 0; i < src.extraUnits[k].length; i++) {
        var u = src.extraUnits[k][i];
        u.cardStatus = u.status || this.of(src, k, u);
      }
    }
    src._statusApplied = true;
    return src;
  },
};
