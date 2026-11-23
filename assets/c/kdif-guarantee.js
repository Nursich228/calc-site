/* Сгенерировано из assets/calcs.js скриптом split.js: ядро + один калькулятор. */
(function (root) {
  const E = root.ESEPTE = root.ESEPTE || {};
  E.calcs = E.calcs || [];
  E.add = def => E.calcs.push(def);

  E.cats = [
    { id: 'payroll', ru: 'Зарплата и кадры', kk: 'Жалақы және кадрлар' },
    { id: 'social', ru: 'Пособия и пенсии', kk: 'Жәрдемақылар мен зейнетақы' },
    { id: 'business', ru: 'Налоги ИП и бизнеса', kk: 'ЖК мен бизнес салықтары' },
    { id: 'tax', ru: 'Налоги физлиц', kk: 'Жеке тұлғалардың салықтары' },
    { id: 'property', ru: 'Недвижимость и земля', kk: 'Жылжымайтын мүлік және жер' },
    { id: 'auto', ru: 'Авто', kk: 'Көлік' },
    { id: 'finance', ru: 'Кредиты и финансы', kk: 'Несие және қаржы' },
    { id: 'legal', ru: 'Юридические', kk: 'Заңгерлік' },
    { id: 'construction', ru: 'Строительство и ремонт', kk: 'Құрылыс және жөндеу' },
    { id: 'utilities', ru: 'Коммунальные услуги', kk: 'Коммуналдық қызметтер' },
    { id: 'health', ru: 'Здоровье', kk: 'Денсаулық' },
    { id: 'education', ru: 'Образование', kk: 'Білім' },
    { id: 'religious', ru: 'Религиозные', kk: 'Діни' },
    { id: 'useful', ru: 'Конвертеры и математика', kk: 'Түрлендіргіштер және математика' }
  ];

  E.t = (L, ru, kk) => (L === 'kk' ? kk : ru);
  E.round = (x, d = 0) => { const k = Math.pow(10, d); return Math.round((x + Number.EPSILON) * k) / k; };
  E.clamp = (x, a, b) => Math.min(Math.max(x, a), b);
  E.pos = x => (x > 0 ? x : 0);

  const nf = {};
  E.num = (x, d = 0) => {
    if (x === null || x === undefined || isNaN(x)) return '—';
    if (d === 'auto') d = Math.abs(x - Math.round(x)) > 0.004 ? 2 : 0;
    const key = d;
    if (!nf[key]) nf[key] = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
    return nf[key].format(E.round(x, d)).replace(/ /g, ' ');
  };
  E.money = (x, d = 0) => E.num(x, d) + ' ₸';
  E.pct = x => E.num(x, Math.abs(x - Math.round(x)) > 1e-9 ? (Math.abs(x * 10 - Math.round(x * 10)) > 1e-9 ? 2 : 1) : 0) + '%';

  /* Даты */
  E.parseDate = s => {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  };
  E.daysBetween = (a, b) => Math.round((b - a) / 86400000);
  E.fmtDate = (d, L) => {
    if (!d) return '—';
    const mru = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const mkk = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
    const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
    return L === 'kk' ? `${y} жылғы ${day} ${mkk[m]}` : `${day} ${mru[m]} ${y} года`;
  };
  E.todayISO = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  /* Разница дат в годах, месяцах, днях (конец включительно, если incl) */
  E.ymd = (a, b, incl) => {
    let end = new Date(b.getTime());
    if (incl) end = new Date(end.getTime() + 86400000);
    let y = end.getUTCFullYear() - a.getUTCFullYear();
    let m = end.getUTCMonth() - a.getUTCMonth();
    let d = end.getUTCDate() - a.getUTCDate();
    if (d < 0) {
      m -= 1;
      const prev = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
      d += prev.getUTCDate();
    }
    if (m < 0) { y -= 1; m += 12; }
    return { y, m, d };
  };
  E.plural = (n, f1, f2, f5) => {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return f5;
    if (b > 1 && b < 5) return f2;
    if (b === 1) return f1;
    return f5;
  };
  E.ymdText = (o, L) => L === 'kk'
    ? `${o.y} жыл ${o.m} ай ${o.d} күн`
    : `${o.y} ${E.plural(o.y, 'год', 'года', 'лет')} ${o.m} ${E.plural(o.m, 'месяц', 'месяца', 'месяцев')} ${o.d} ${E.plural(o.d, 'день', 'дня', 'дней')}`;

  /* ИПН по прогрессивной шкале с учётом облагаемого дохода с начала года */
  E.ipnProgressive = (taxable, ytd, R, rateLow = R.IPN, rateHigh = R.IPNhigh, thrMRP = R.IPNthresholdMRP) => {
    const thr = thrMRP * R.MRP;
    const room = E.pos(thr - (ytd || 0));
    const low = Math.min(taxable, room);
    const high = E.pos(taxable - low);
    return { low, high, tax: E.round(low * rateLow / 100 + high * rateHigh / 100), thr };
  };

  /*
    Зарплатный расчёт по трудовому договору.
    o: { employer: 'llp'|'ip_our'|'snr', cat: 'std'|'pens', born1975, ded, ytd }
  */
  E.payroll = (g, o, R) => {
    const MZP = R.MZP, MRP = R.MRP;
    const isP = o.cat === 'pens';
    const opv = isP ? 0 : E.round(Math.min(g, R.OPVmaxMZP * MZP) * R.OPV / 100);
    const vosms = isP ? 0 : E.round(Math.min(g, R.VOSMSmaxMZP * MZP) * R.VOSMS / 100);
    const before = E.pos(g - opv - vosms);
    const ded = o.ded ? Math.min(R.baseDeductionMRP * MRP, before) : 0;
    const taxable = E.pos(before - ded);
    const ip = E.ipnProgressive(taxable, o.ytd, R);
    const ipn = ip.tax;
    const net = g - opv - vosms - ipn;

    const opvrBase = E.clamp(g, R.OPVRminMZP * MZP, R.OPVRmaxMZP * MZP);
    const opvr = (isP || o.born1975 || g <= 0) ? 0 : E.round(opvrBase * R.OPVR / 100);
    const soBase = E.clamp(g - opv, R.SOminMZP * MZP, R.SOmaxMZP * MZP);
    const so = (isP || g <= 0) ? 0 : E.round(soBase * R.SO / 100);
    const oosms = (isP || g <= 0) ? 0 : E.round(Math.min(g, R.OOSMSmaxMZP * MZP) * R.OOSMS / 100);
    let sn = 0, snBase = 0;
    if (g > 0 && o.employer === 'llp') {
      snBase = Math.max(g - opv - vosms, R.SNminMRP * MRP);
      sn = E.round(snBase * R.SN / 100);
    } else if (g > 0 && o.employer === 'ip_our') {
      sn = R.SN_IPemployeeMRP * MRP;
    }
    const empl = opvr + so + oosms + sn;
    return { g, opv, vosms, before, ded, taxable, ip, ipn, net, opvr, opvrBase, so, soBase, oosms, sn, snBase, empl, cost: g + empl, isP };
  };

  /* Общие поля зарплатных калькуляторов */
  E.payrollFields = [
    { id: 'employer', type: 'select', def: 'llp', label: { ru: 'Работодатель', kk: 'Жұмыс беруші' }, options: [
      { v: 'llp', ru: 'ТОО на общем режиме (ОУР)', kk: 'ЖБТ-дағы ЖШС' },
      { v: 'ip_our', ru: 'ИП на общем режиме (ОУР)', kk: 'ЖБТ-дағы ЖК' },
      { v: 'snr', ru: 'ИП или ТОО на упрощёнке', kk: 'Оңайлатылғандағы ЖК не ЖШС' }
    ] },
    { id: 'cat', type: 'select', def: 'std', label: { ru: 'Работник', kk: 'Қызметкер' }, options: [
      { v: 'std', ru: 'Гражданин РК', kk: 'ҚР азаматы' },
      { v: 'pens', ru: 'Пенсионер по возрасту', kk: 'Жасына байланысты зейнеткер' }
    ] },
    { id: 'ded', type: 'check', def: true, label: { ru: 'Применять вычет 30 МРП (основное место работы, есть заявление)', kk: '30 АЕК шегерімін қолдану (негізгі жұмыс орны, өтініш берілген)' } },
    { id: 'born1975', type: 'check', def: false, when: v => v.cat !== 'pens', label: { ru: 'Родился до 1 января 1975 года (ОПВР не платится)', kk: '1975 жылғы 1 қаңтарға дейін туған (ЖМЗЖ төленбейді)' } },
    { id: 'ytd', type: 'money', def: 0, adv: true, label: { ru: 'Облагаемый доход с начала года до этого месяца', kk: 'Жыл басынан осы айға дейінгі салық салынатын табыс' }, hint: { ru: 'Нужен только при больших доходах: с суммы свыше 8 500 МРП за год ИПН — 15%.', kk: 'Тек үлкен табыс кезінде керек: жылына 8 500 АЕК-тен асқан сомаға ЖТС — 15%.' } }
  ];

  /* Строки результата зарплатного расчёта */
  E.payrollRows = (p, L, R) => {
    const t = (a, b) => E.t(L, a, b);
    const rows = [
      { head: true, label: t('Удерживается из зарплаты', 'Жалақыдан ұсталады') },
      { label: t(`ОПВ ${E.pct(R.OPV)}`, `МЗЖ ${E.pct(R.OPV)}`), value: p.opv },
      { label: t(`ВОСМС ${E.pct(R.VOSMS)}`, `МӘМСЖ ${E.pct(R.VOSMS)}`), value: p.vosms },
      { label: t('ИПН', 'ЖТС'), value: p.ipn },
      { label: t('Итого удержано', 'Барлығы ұсталды'), value: p.opv + p.vosms + p.ipn, strong: true },
      { head: true, label: t('Платит работодатель сверх зарплаты', 'Жұмыс беруші жалақыдан бөлек төлейді') },
      { label: t(`ОПВР ${E.pct(R.OPVR)}`, `ЖМЗЖ ${E.pct(R.OPVR)}`), value: p.opvr },
      { label: t(`Социальные отчисления ${E.pct(R.SO)}`, `Әлеуметтік аударымдар ${E.pct(R.SO)}`), value: p.so },
      { label: t(`ООСМС ${E.pct(R.OOSMS)}`, `МӘМС аударымдары ${E.pct(R.OOSMS)}`), value: p.oosms },
      { label: t('Социальный налог', 'Әлеуметтік салық'), value: p.sn },
      { label: t('Итого платит работодатель', 'Жұмыс беруші барлығы төлейді'), value: p.empl, strong: true },
      { label: t('Стоимость работника для работодателя', 'Жұмыс берушіге қызметкердің құны'), value: p.cost, strong: true }
    ];
    return rows;
  };

  E.payrollSteps = (p, o, L, R) => {
    const t = (a, b) => E.t(L, a, b), m = E.money;
    const s = [];
    if (p.isP) s.push(t('Пенсионер по возрасту: ОПВ, ВОСМС, ОПВР, СО и ООСМС не начисляются.', 'Жасына байланысты зейнеткер: МЗЖ, МӘМСЖ, ЖМЗЖ, ӘА және МӘМС аударымдары есептелмейді.'));
    else {
      s.push(t(`ОПВ = ${m(Math.min(p.g, R.OPVmaxMZP * R.MZP))} × ${E.pct(R.OPV)} = ${m(p.opv)}`, `МЗЖ = ${m(Math.min(p.g, R.OPVmaxMZP * R.MZP))} × ${E.pct(R.OPV)} = ${m(p.opv)}`));
      s.push(t(`ВОСМС = ${m(Math.min(p.g, R.VOSMSmaxMZP * R.MZP))} × ${E.pct(R.VOSMS)} = ${m(p.vosms)}`, `МӘМСЖ = ${m(Math.min(p.g, R.VOSMSmaxMZP * R.MZP))} × ${E.pct(R.VOSMS)} = ${m(p.vosms)}`));
    }
    s.push(t(`База ИПН = ${m(p.g)} − ${m(p.opv)} − ${m(p.vosms)} − вычет ${m(p.ded)} = ${m(p.taxable)}`,
      `ЖТС базасы = ${m(p.g)} − ${m(p.opv)} − ${m(p.vosms)} − шегерім ${m(p.ded)} = ${m(p.taxable)}`));
    if (p.ip.high > 0) s.push(t(`ИПН = ${m(p.ip.low)} × ${E.pct(R.IPN)} + ${m(p.ip.high)} × ${E.pct(R.IPNhigh)} = ${m(p.ipn)}`, `ЖТС = ${m(p.ip.low)} × ${E.pct(R.IPN)} + ${m(p.ip.high)} × ${E.pct(R.IPNhigh)} = ${m(p.ipn)}`));
    else s.push(t(`ИПН = ${m(p.taxable)} × ${E.pct(R.IPN)} = ${m(p.ipn)}`, `ЖТС = ${m(p.taxable)} × ${E.pct(R.IPN)} = ${m(p.ipn)}`));
    s.push(t(`На руки = ${m(p.g)} − ${m(p.opv)} − ${m(p.vosms)} − ${m(p.ipn)} = ${m(p.net)}`, `Қолға = ${m(p.g)} − ${m(p.opv)} − ${m(p.vosms)} − ${m(p.ipn)} = ${m(p.net)}`));
    if (!p.isP) {
      if (p.opvr) s.push(t(`ОПВР = ${m(p.opvrBase)} × ${E.pct(R.OPVR)} = ${m(p.opvr)}`, `ЖМЗЖ = ${m(p.opvrBase)} × ${E.pct(R.OPVR)} = ${m(p.opvr)}`));
      s.push(t(`СО = (${m(p.g)} − ${m(p.opv)}), но от 1 до 7 МЗП → ${m(p.soBase)} × ${E.pct(R.SO)} = ${m(p.so)}`, `ӘА = (${m(p.g)} − ${m(p.opv)}), бірақ 1-ден 7 ЕТЖ-ға дейін → ${m(p.soBase)} × ${E.pct(R.SO)} = ${m(p.so)}`));
      s.push(t(`ООСМС = ${m(Math.min(p.g, R.OOSMSmaxMZP * R.MZP))} × ${E.pct(R.OOSMS)} = ${m(p.oosms)}`, `МӘМС аударымдары = ${m(Math.min(p.g, R.OOSMSmaxMZP * R.MZP))} × ${E.pct(R.OOSMS)} = ${m(p.oosms)}`));
    }
    if (o.employer === 'llp') s.push(t(`Соцналог = (${m(p.g)} − ОПВ − ВОСМС), но не меньше 14 МРП → ${m(p.snBase)} × ${E.pct(R.SN)} = ${m(p.sn)}`, `Әлеуметтік салық = (${m(p.g)} − МЗЖ − МӘМСЖ), бірақ 14 АЕК-тен кем емес → ${m(p.snBase)} × ${E.pct(R.SN)} = ${m(p.sn)}`));
    else if (o.employer === 'ip_our') s.push(t(`Соцналог ИП за работника = ${R.SN_IPemployeeMRP} МРП = ${m(p.sn)}`, `ЖК-нің қызметкер үшін әлеуметтік салығы = ${R.SN_IPemployeeMRP} АЕК = ${m(p.sn)}`));
    else s.push(t('На упрощённой декларации социальный налог не уплачивается.', 'Оңайлатылған декларацияда әлеуметтік салық төленбейді.'));
    return s;
  };
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const per = [];
for (let i = 1; i <= 5; i++) {
    per.push({ id: 's' + i, type: 'date', def: i === 1 ? '2018-03-01' : '', optional: true, half: true, label: { ru: `Период ${i}: с`, kk: `${i}-кезең: бастап` } });
    per.push({ id: 'e' + i, type: 'date', def: i === 1 ? 'today' : '', optional: true, half: true, label: { ru: 'по', kk: 'дейін' } });
  }
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const ipSelf = (declared, regime, born1975, R) => {
    const base = E.clamp(declared, R.MZP, R.OPVmaxMZP * R.MZP);
    const opv = E.round(base * R.OPV / 100);
    const opvr = born1975 ? 0 : E.round(E.clamp(declared, R.OPVRminMZP * R.MZP, R.OPVRmaxMZP * R.MZP) * R.OPVR / 100);
    const soBase = E.clamp(declared, R.SOminMZP * R.MZP, R.SOmaxMZP * R.MZP);
    const so = E.round(soBase * R.SO / 100);
    const vosms = E.round(R.VOSMS_IPbaseMZP * R.MZP * R.VOSMS_IP / 100);
    const sn = regime === 'our' ? R.SN_IPselfMRP * R.MRP : 0;
    return { base, opv, opvr, soBase, so, vosms, sn, total: opv + opvr + so + vosms + sn };
  };
E.ipSelf = ipSelf;
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const RU = {
    u: ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
    uf: ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
    teen: ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
    tens: ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'],
    h: ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'],
    g: [null, ['тысяча', 'тысячи', 'тысяч', 1], ['миллион', 'миллиона', 'миллионов'], ['миллиард', 'миллиарда', 'миллиардов'], ['триллион', 'триллиона', 'триллионов']]
  };
const ruTriad = (n, fem) => {
    const w = [], h = Math.floor(n / 100), r = n % 100, d = Math.floor(r / 10), u = r % 10;
    if (h) w.push(RU.h[h]);
    if (r >= 10 && r < 20) w.push(RU.teen[r - 10]);
    else { if (d) w.push(RU.tens[d]); if (u) w.push((fem ? RU.uf : RU.u)[u]); }
    return w;
  };
E.wordsRu = (n, fem) => {
    if (n === 0) return 'ноль';
    const parts = []; let i = 0;
    while (n > 0) {
      const tri = n % 1000;
      if (tri) {
        const g = RU.g[i], w = ruTriad(tri, g ? g[3] : fem);
        if (g) w.push(E.plural(tri, g[0], g[1], g[2]));
        parts.unshift(w.join(' '));
      }
      n = Math.floor(n / 1000); i++;
    }
    return parts.join(' ');
  };
const KK = {
    u: ['', 'бір', 'екі', 'үш', 'төрт', 'бес', 'алты', 'жеті', 'сегіз', 'тоғыз'],
    tens: ['', 'он', 'жиырма', 'отыз', 'қырық', 'елу', 'алпыс', 'жетпіс', 'сексен', 'тоқсан'],
    g: ['', 'мың', 'миллион', 'миллиард', 'триллион']
  };
const kkTriad = n => {
    const w = [], h = Math.floor(n / 100), d = Math.floor((n % 100) / 10), u = n % 10;
    if (h) w.push(KK.u[h] + ' жүз');
    if (d) w.push(KK.tens[d]);
    if (u) w.push(KK.u[u]);
    return w;
  };
E.wordsKk = n => {
    if (n === 0) return 'нөл';
    const parts = []; let i = 0;
    while (n > 0) {
      const tri = n % 1000;
      if (tri) { const w = kkTriad(tri); if (KK.g[i]) w.push(KK.g[i]); parts.unshift(w.join(' ')); }
      n = Math.floor(n / 1000); i++;
    }
    return parts.join(' ');
  };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const CUR = [['USD', 'доллар США', 'АҚШ доллары'], ['EUR', 'евро', 'еуро'], ['RUB', 'российский рубль', 'Ресей рублі'], ['CNY', 'китайский юань', 'Қытай юані'], ['KGS', 'киргизский сом', 'қырғыз сомы'], ['UZS', 'узбекский сум', 'өзбек сумы'], ['TRY', 'турецкая лира', 'түрік лирасы'], ['AED', 'дирхам ОАЭ', 'БАӘ дирхамы'], ['GBP', 'фунт стерлингов', 'фунт стерлинг']];
const TU = [['s', 1, 'секунды', 'секунд'], ['min', 60, 'минуты', 'минут'], ['h', 3600, 'часы', 'сағат'], ['d', 86400, 'дни', 'күн'], ['w', 604800, 'недели', 'апта'], ['mo', 2629746, 'месяцы (в среднем)', 'ай (орташа)'], ['y', 31556952, 'годы (в среднем)', 'жыл (орташа)']];
const retireAge = (sex, year) => sex === 'm' ? 63 : (year <= 2027 ? 61 : year === 2028 ? 61.5 : year === 2029 ? 62 : year === 2030 ? 62.5 : 63);
const addMonths = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate()));
const ROM = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
E.toRoman = n => { let s = ''; for (const [a, r] of ROM) while (n >= a) { s += r; n -= a; } return s; };
E.fromRoman = s => { s = s.toUpperCase(); let n = 0, i = 0; for (const [a, r] of ROM) while (s.startsWith(r, i)) { n += a; i += r.length; } return i === s.length && s ? n : null; };
const UNITS = {
    len: [['мм', 'мм', 0.001], ['см', 'см', 0.01], ['м', 'м', 1], ['км', 'км', 1000], ['дюйм', 'дюйм', 0.0254], ['фут', 'фут', 0.3048], ['ярд', 'ярд', 0.9144], ['миля', 'миля', 1609.344]],
    mass: [['мг', 'мг', 1e-6], ['г', 'г', 0.001], ['кг', 'кг', 1], ['т', 'т', 1000], ['унция', 'унция', 0.028349523125], ['фунт', 'фунт', 0.45359237]],
    vol: [['мл', 'мл', 0.001], ['л', 'л', 1], ['м³', 'м³', 1000], ['галлон США', 'АҚШ галлоны', 3.785411784], ['баррель нефти', 'мұнай баррелі', 158.987294928]],
    area: [['м²', 'м²', 1], ['сотка', 'сотық', 100], ['гектар', 'гектар', 10000], ['км²', 'км²', 1e6], ['фут²', 'фут²', 0.09290304], ['акр', 'акр', 4046.8564224]],
    speed: [['м/с', 'м/с', 1], ['км/ч', 'км/сағ', 1 / 3.6], ['миль/ч', 'миль/сағ', 0.44704], ['узел', 'түйін', 0.514444]],
    temp: [['°C', '°C'], ['°F', '°F'], ['K', 'K']]
  };
const ucat = [['len', 'Длина', 'Ұзындық'], ['mass', 'Масса', 'Масса'], ['vol', 'Объём', 'Көлем'], ['area', 'Площадь', 'Аудан'], ['speed', 'Скорость', 'Жылдамдық'], ['temp', 'Температура', 'Температура']];
const TZ = [['Astana', 'Астана / Алматы', 'Астана / Алматы', null], ['Moscow', 'Москва', 'Мәскеу', 'Europe/Moscow'], ['Tashkent', 'Ташкент', 'Ташкент', 'Asia/Tashkent'], ['Bishkek', 'Бишкек', 'Бішкек', 'Asia/Bishkek'], ['Istanbul', 'Стамбул', 'Ыстамбұл', 'Europe/Istanbul'], ['Dubai', 'Дубай', 'Дубай', 'Asia/Dubai'], ['Beijing', 'Пекин', 'Бейжің', 'Asia/Shanghai'], ['Seoul', 'Сеул', 'Сеул', 'Asia/Seoul'], ['Tokyo', 'Токио', 'Токио', 'Asia/Tokyo'], ['Delhi', 'Дели', 'Дели', 'Asia/Kolkata'], ['Bangkok', 'Бангкок', 'Бангкок', 'Asia/Bangkok'], ['Singapore', 'Сингапур', 'Сингапур', 'Asia/Singapore'], ['Berlin', 'Берлин', 'Берлин', 'Europe/Berlin'], ['Paris', 'Париж', 'Париж', 'Europe/Paris'], ['London', 'Лондон', 'Лондон', 'Europe/London'], ['NewYork', 'Нью-Йорк', 'Нью-Йорк', 'America/New_York'], ['LosAngeles', 'Лос-Анджелес', 'Лос-Анджелес', 'America/Los_Angeles'], ['Sydney', 'Сидней', 'Сидней', 'Australia/Sydney']];
const leap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const ceil = Math.ceil;
const priceField = (def, ru, kk) => ({ id: 'price', type: 'money', def, adv: true, label: lab(ru, kk) });
const BRICK = { s: [51, 102, 153, 204], o: [39, 78, 117, 156] };
const LAMBDA = { mw: [0.04, 'Минеральная вата', 'Минералды мақта'], eps: [0.038, 'Пенопласт (ППС)', 'Пенопласт (ППС)'], xps: [0.032, 'Экструдированный пенополистирол', 'Экструзиялық пенополистирол'], pir: [0.024, 'PIR-плиты', 'PIR тақталары'] };
E.faraid = (h) => {
    const kids = h.sons + h.daughters > 0, share = {};
    if (h.husband) share.husband = kids ? 1 / 4 : 1 / 2;
    if (h.wives) share.wives = kids ? 1 / 8 : 1 / 4;
    const spouse = (share.husband || 0) + (share.wives || 0);
    if (h.mother) share.mother = kids ? 1 / 6 : (h.father && spouse ? (1 - spouse) / 3 : 1 / 3);
    if (h.father && h.sons) share.father = 1 / 6;
    if (!h.sons && h.daughters) share.daughters = h.daughters === 1 ? 1 / 2 : 2 / 3;
    if (h.father && !h.sons && h.daughters) share.father = 1 / 6;
    let fixed = Object.values(share).reduce((a, b) => a + b, 0), awl = false;
    if (fixed > 1 + 1e-9) { awl = true; for (const k in share) share[k] /= fixed; fixed = 1; }
    let rest = 1 - fixed;
    if (rest > 1e-9) {
      if (h.sons) { const u = rest / (2 * h.sons + h.daughters); share.sons = 2 * u * h.sons; if (h.daughters) share.daughters = u * h.daughters; rest = 0; }
      else if (h.father) { share.father = (share.father || 0) + rest; rest = 0; }
    }
    let radd = false;
    if (rest > 1e-9) {
      const keys = Object.keys(share).filter(k => k !== 'husband' && k !== 'wives'), sum = keys.reduce((a, k) => a + share[k], 0);
      if (sum > 0) { radd = true; for (const k of keys) share[k] += rest * share[k] / sum; rest = 0; }
      else if (spouse) { radd = true; for (const k of ['husband', 'wives']) if (share[k]) share[k] += rest; rest = 0; }
    }
    return { share, awl, radd, rest };
  };
const GPA = [['A', 4, 'Отлично', 'Өте жақсы'], ['A-', 3.67, 'Отлично', 'Өте жақсы'], ['B+', 3.33, 'Хорошо', 'Жақсы'], ['B', 3, 'Хорошо', 'Жақсы'], ['B-', 2.67, 'Хорошо', 'Жақсы'], ['C+', 2.33, 'Хорошо', 'Жақсы'], ['C', 2, 'Удовлетворительно', 'Қанағаттанарлық'], ['C-', 1.67, 'Удовлетворительно', 'Қанағаттанарлық'], ['D+', 1.33, 'Удовлетворительно', 'Қанағаттанарлық'], ['D', 1, 'Удовлетворительно', 'Қанағаттанарлық'], ['FX', 0.5, 'Неудовлетворительно', 'Қанағаттанарлықсыз'], ['F', 0, 'Неудовлетворительно', 'Қанағаттанарлықсыз']];
const gf = [];
for (let i = 1; i <= 8; i++) {
    gf.push({ id: 'g' + i, type: 'select', def: i <= 3 ? ['A', 'B+', 'A-'][i - 1] : '', half: true, label: lab(`Дисциплина ${i}: оценка`, `${i}-пән: баға`), options: [{ v: '', ru: '—', kk: '—' }].concat(GPA.map(g => ({ v: g[0], ru: g[0], kk: g[0] }))) });
    gf.push({ id: 'c' + i, type: 'number', def: i <= 3 ? 5 : 5, min: 0, max: 30, half: true, label: lab('Кредиты (ECTS)', 'Кредиттер (ECTS)') });
  }
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const ann = (S, rate, n) => { const i = rate / 1200; return n <= 0 ? 0 : i === 0 ? S / n : S * i / (1 - Math.pow(1 + i, -n)); };
E.annuity = ann;
const yrs = (L, n) => t(L, `${E.num(n, 'auto')} ${E.plural(Math.round(n), 'год', 'года', 'лет')}`, `${E.num(n, 'auto')} жыл`);
const mon = (L, n) => { const y = Math.floor(n / 12), k = n % 12; return t(L, [y ? `${y} ${E.plural(y, 'год', 'года', 'лет')}` : '', k ? `${k} ${E.plural(k, 'месяц', 'месяца', 'месяцев')}` : ''].filter(Boolean).join(' ') || '0 месяцев', [y ? `${y} жыл` : '', k ? `${k} ай` : ''].filter(Boolean).join(' ') || '0 ай'); };
const money = (id, def, ru, kk, extra) => Object.assign({ id, type: 'money', def, label: lab(ru, kk) }, extra || {});
const pct = (id, def, ru, kk, extra) => Object.assign({ id, type: 'percent', def, min: 0, max: 100, step: 'any', label: lab(ru, kk) }, extra || {});
const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
const NOTE_FIN = (L) => t(L, 'Расчёт справочный и не является финансовой рекомендацией. Точные условия — в договоре с банком.', 'Есеп анықтамалық сипатта, қаржылық ұсыным емес. Нақты шарттар — банкпен жасалған шартта.');
const infYears = R => Object.keys(R.inflation).map(Number).sort((a, b) => a - b);
const PROG = [
    { v: '72025', ru: '«7-20-25»', kk: '«7-20-25»', rate: () => 7, down: 20, years: 25, priceMax: 30e6, loanMax: 0 },
    { v: 'nauryz', ru: '«Наурыз» (Отбасы банк)', kk: '«Наурыз» (Отбасы банк)', rate: s => s ? 7 : 9, down: 20, years: 19, priceMax: 0, loanMax: 36e6 },
    { v: 'otau', ru: '«Отау» (Отбасы банк)', kk: '«Отау» (Отбасы банк)', rate: s => s ? 7 : 9, down: 20, years: 19, priceMax: 0, loanMax: 36e6 },
    { v: 'market', ru: 'Рыночная ипотека', kk: 'Нарықтық ипотека', rate: (s, v) => v.rate, down: 0, years: 30, priceMax: 0, loanMax: 0 }
  ];
const progCheck = (p, v, S, L) => {
    const bad = [];
    if (v.downPct < p.down) bad.push(t(L, `взнос от ${p.down}%`, `жарна ${p.down}%-дан`));
    if (v.years > p.years) bad.push(t(L, `срок до ${p.years} лет`, `мерзім ${p.years} жылға дейін`));
    if (p.priceMax && v.price > p.priceMax) bad.push(t(L, `жильё до ${E.num(p.priceMax / 1e6)} млн ₸`, `тұрғын үй ${E.num(p.priceMax / 1e6)} млн ₸-ге дейін`));
    if (p.loanMax && S > p.loanMax) bad.push(t(L, `заём до ${E.num(p.loanMax / 1e6)} млн ₸`, `қарыз ${E.num(p.loanMax / 1e6)} млн ₸-ге дейін`));
    return bad;
  };
const mortFields = [money('price', 25000000, 'Стоимость жилья', 'Тұрғын үй құны'), pct('downPct', 20, 'Первоначальный взнос, %', 'Бастапқы жарна, %'), numF('years', 19, 'Срок', 'Мерзімі', 'лет', 'жыл', { min: 1, max: 30 }),
    { id: 'soc', type: 'check', def: false, label: lab('Социально уязвимая категория (очередь на жильё)', 'Әлеуметтік осал санат (тұрғын үй кезегі)') }, pct('rate', 21, 'Ставка рыночной ипотеки, %', 'Нарықтық ипотека мөлшерлемесі, %')];
const NOTE_MORT = L => t(L, 'Условия на 2026 год: «7-20-25» — только первичное жильё, лимит цены зависит от города; «Наурыз» и «Отау» — через Отбасы банк, первые годы платёж выше (проценты плюс пополнение депозита), затем жилищный заём под 3,5–5%. Лимиты и требования меняются — проверяйте на otbasybank.kz и сайте Казахстанского фонда устойчивости.', '2026 жылғы шарттар: «7-20-25» — тек бастапқы тұрғын үй, баға шегі қалаға байланысты; «Наурыз» және «Отау» — Отбасы банк арқылы, алғашқы жылдары төлем жоғары (сыйақы мен депозитті толықтыру), кейін 3,5–5% тұрғын үй қарызы. Шектер мен талаптар өзгереді — otbasybank.kz және Қазақстан тұрақтылық қоры сайтынан тексеріңіз.');
E.add({
    id: 'kdif-guarantee', cat: 'finance',
    title: lab('Гарантия депозитов КФГД', 'ҚДКБҚ депозиттер кепілдігі'), short: lab('Сколько вернёт фонд, если у банка отзовут лицензию', 'Банктің лицензиясы қайтарып алынса, қор қанша қайтарады'),
    badge: (R) => E.num(R.kdif.total / 1e6) + ' млн', keys: 'кфгд гарантия депозитов возмещение вклады банк лицензия кепілдік',
    fields: [money('sav', 15000000, 'Сберегательные вклады в тенге', 'Теңгедегі жинақ салымдары'), money('oth', 3000000, 'Карты, текущие счета и прочие вклады в тенге', 'Карталар, ағымдағы шоттар және басқа теңге салымдары'), money('fx', 0, 'Валютные вклады (в тенге)', 'Валюталық салымдар (теңгемен)'), money('loan', 0, 'Долг по кредиту в этом же банке', 'Осы банктегі несие қарызы', { adv: true })],
    calc(v, R, L) {
      const K = R.kdif; let loan = v.loan; const b = { oth: v.oth, fx: v.fx, sav: v.sav };
      for (const k of ['oth', 'fx', 'sav']) { const d = Math.min(b[k], loan); b[k] -= d; loan -= d; }
      const g = { sav: Math.min(b.sav, K.savingsKZT), oth: Math.min(b.oth, K.otherKZT), fx: Math.min(b.fx, K.fx) }, sum = Math.min(g.sav + g.oth + g.fx, K.total), dep = v.sav + v.oth + v.fx, net = b.sav + b.oth + b.fx;
      return { main: { label: t(L, 'Вернёт КФГД', 'ҚДКБҚ қайтарады'), value: sum }, cards: [{ label: t(L, 'Не покрыто гарантией', 'Кепілдікпен жабылмаған'), value: E.pos(net - sum) }],
        rows: [R1(L, `Сберегательные (до ${E.num(K.savingsKZT / 1e6)} млн)`, `Жинақ салымдары (${E.num(K.savingsKZT / 1e6)} млн-ға дейін)`, g.sav), R1(L, `Прочие в тенге (до ${E.num(K.otherKZT / 1e6)} млн)`, `Басқа теңге салымдары (${E.num(K.otherKZT / 1e6)} млн-ға дейін)`, g.oth), R1(L, `Валютные (до ${E.num(K.fx / 1e6)} млн)`, `Валюталық (${E.num(K.fx / 1e6)} млн-ға дейін)`, g.fx), v.loan ? R1(L, 'Зачтено в счёт кредита', 'Несие есебіне есептелді', dep - net) : null].filter(Boolean),
        steps: [t(L, `Итог не больше ${E.num(K.total / 1e6)} млн ₸ на одного вкладчика в одном банке.`, `Бір банктегі бір салымшыға қорытынды ${E.num(K.total / 1e6)} млн ₸-ден аспайды.`)],
        notes: [t(L, 'Выплаты начинаются не позднее 20 рабочих дней после лишения банка лицензии. Суммы сверх гарантии возвращают из ликвидационной массы, если хватит средств. Порядок зачёта кредита упрощён.', 'Төлемдер банк лицензиясынан айырылған соң 20 жұмыс күнінен кешіктірілмей басталады. Кепілдіктен асатын сомалар жеткілікті болса, тарату массасынан қайтарылады. Несиені есепке алу тәртібі жеңілдетілген.')] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const money = (id, def, ru, kk, extra) => Object.assign({ id, type: 'money', def, label: lab(ru, kk) }, extra || {});
const pct = (id, def, ru, kk, extra) => Object.assign({ id, type: 'percent', def, min: 0, max: 100, step: 'any', label: lab(ru, kk) }, extra || {});
const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
const yearF = (def) => ({ id: 'year', type: 'number', def, min: 1950, max: 2100, label: lab('Год выпуска', 'Шығарылған жылы') });
const mrp = (L, x, R) => t(L, `${E.num(x, 'auto')} МРП`, `${E.num(x, 'auto')} АЕК`);
E.recyclingCoef = (R, type, size, ev, ru, tractor) => {
    const tab = R.recycling[type], col = ru ? 2 : 1;
    if (ev) return tab[0][col];
    if (type === 'truck' && tractor) return tab.find(r => r[0] === 'tractor')[col];
    const row = tab.find(r => typeof r[0] === 'number' && size <= r[0]) || tab.filter(r => typeof r[0] === 'number').slice(-1)[0];
    return row[col];
  };
E.regFee = (R, year, ev) => { const d = R.year - year, arr = ev ? R.regFeeEV : R.regFeeCar; return arr[d < 2 ? 0 : d === 2 ? 1 : 2]; };
const FINE_NAMES = { sp20: ['Превышение скорости на 10–20 км/ч', 'Жылдамдықты 10–20 км/сағ асыру'], sp40: ['Превышение скорости на 20–40 км/ч', 'Жылдамдықты 20–40 км/сағ асыру'], sp60: ['Превышение скорости на 40–60 км/ч', 'Жылдамдықты 40–60 км/сағ асыру'], sp60p: ['Превышение скорости на 60 км/ч и более', 'Жылдамдықты 60 км/сағ және одан көп асыру'], red: ['Проезд на красный свет', 'Қызыл бағдаршамнан өту'], belt: ['Не пристёгнут ремень', 'Қауіпсіздік белдігі тағылмаған'], phone: ['Телефон за рулём без hands-free', 'Рөлде hands-free-сіз телефон'], park: ['Нарушение правил остановки и стоянки', 'Тоқтау және тұрақ ережелерін бұзу'], ped: ['Не уступил дорогу пешеходу', 'Жаяу жүргіншіге жол бермеу'], tint: ['Тонировка лобового или передних боковых стёкол', 'Алдыңғы немесе алдыңғы бүйір әйнектерді күңгірттеу'], ogpo: ['Езда без полиса ОГПО', 'МСАҚ полисісіз жүру'], child: ['Ребёнок без детского кресла', 'Балалар орындығынсыз бала'], noplate: ['Без госномеров или без регистрации', 'Мемлекеттік нөмірсіз немесе тіркеусіз'] };
const PLATE_NAMES = { std: ['Обычный (случайный)', 'Кәдімгі (кездейсоқ)'], any: ['Любая выбранная комбинация', 'Кез келген таңдалған комбинация'], mirror: ['Зеркальные цифры (101, 121)', 'Айналы цифрлар (101, 121)'], tens: ['010–090, 077, 707 или три одинаковые буквы', '010–090, 077, 707 немесе үш бірдей әріп'], mirrorSame: ['Зеркальные + три одинаковые буквы', 'Айналы + үш бірдей әріп'], tensSame: ['010–090, 077, 707 + три одинаковые буквы', '010–090, 077, 707 + үш бірдей әріп'], round: ['Круглые и одинаковые цифры (100, 111, 222)', 'Дөңгелек және бірдей цифрлар (100, 111, 222)'], roundSame: ['Круглые + три одинаковые буквы', 'Дөңгелек + үш бірдей әріп'], elite: ['001–009 и 777', '001–009 және 777'], eliteSame: ['001–009, 777 + три одинаковые буквы', '001–009, 777 + үш бірдей әріп'] };
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const money = (id, def, ru, kk, extra) => Object.assign({ id, type: 'money', def, label: lab(ru, kk) }, extra || {});
const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
const mrp = (L, x) => t(L, `${E.num(x, 'auto')} МРП`, `${E.num(x, 'auto')} АЕК`);
const NOTE_LAW = L => t(L, 'Расчёт справочный и не заменяет консультацию юриста.', 'Есеп анықтамалық сипатта және заңгер кеңесін алмастырмайды.');
E.courtProp = (R, sum, jur) => Math.min(sum * (jur ? R.courtPropJur : R.courtPropPhys) / 100, (jur ? R.courtCapJurMRP : R.courtCapPhysMRP) * R.MRP);
const COURT = [['prop', 'Имущественный иск (взыскание денег, ущерба, имущества)', 'Мүліктік талап (ақша, залал, мүлік өндіру)'], ['divorce', 'Расторжение брака', 'Некені бұзу'], ['nonprop', 'Прочий неимущественный иск', 'Басқа мүліктік емес талап'], ['adm', 'Обжалование действий госоргана', 'Мемлекеттік орган әрекетіне шағым'], ['defam', 'Защита чести и достоинства с компенсацией', 'Ар-намысты өтемақымен қорғау'], ['bankrupt', 'Банкротство или восстановление платёжеспособности', 'Банкроттық немесе төлем қабілеттілігін қалпына келтіру'], ['free', 'Алименты, трудовой спор, вред здоровью', 'Алимент, еңбек дауы, денсаулыққа зиян']];
const NOT = [['realty', 'Договор продажи или дарения жилья', 'Тұрғын үйді сату немесе сыйға тарту шарты'], ['mortgage', 'Покупка жилья в городе по ипотеке', 'Қалада ипотекамен тұрғын үй сатып алу'], ['car', 'Договор продажи авто', 'Көлікті сату шарты'], ['will', 'Завещание', 'Өсиет'], ['inherit', 'Свидетельство о праве на наследство', 'Мұраға құқық туралы куәлік'], ['spouse', 'Свидетельство о доле супруга', 'Жұбайының үлесі туралы куәлік'], ['poa', 'Доверенность на распоряжение имуществом', 'Мүлікке билік ету сенімхаты'], ['copy', 'Заверение копий', 'Көшірмелерді куәландыру']];
const LIM = [['gen', 'Общий срок исковой давности', 'Талап қоюдың жалпы мерзімі', 36, 'ст. 178 ГК РК', 'ҚР АК 178-бабы'], ['debt', 'Долг по договору или расписке', 'Шарт немесе қолхат бойынша қарыз', 36, 'ст. 178 ГК РК', 'ҚР АК 178-бабы'], ['damage', 'Возмещение имущественного вреда', 'Мүліктік зиянды өтеу', 36, 'ст. 178 ГК РК', 'ҚР АК 178-бабы'],
    ['labor', 'Трудовой спор (кроме увольнения)', 'Еңбек дауы (жұмыстан шығарудан басқа)', 12, 'ТК РК', 'ҚР ЕК'], ['reinst', 'Увольнение — обращение в согласительную комиссию', 'Жұмыстан шығару — келісім комиссиясына жүгіну', 1, 'ТК РК', 'ҚР ЕК'],
    ['inherit', 'Принятие наследства', 'Мұраны қабылдау', 6, 'ст. 1072 ГК РК', 'ҚР АК 1072-бабы'], ['acq', 'Приобретательная давность: недвижимость', 'Иелену мерзімі: жылжымайтын мүлік', 84, 'ст. 240 ГК РК', 'ҚР АК 240-бабы'], ['acqm', 'Приобретательная давность: движимое имущество', 'Иелену мерзімі: жылжымалы мүлік', 60, 'ст. 240 ГК РК', 'ҚР АК 240-бабы'], ['none', 'Вред жизни и здоровью, честь и достоинство', 'Өмір мен денсаулыққа зиян, ар-намыс', 0, 'ст. 187 ГК РК', 'ҚР АК 187-бабы']];
const MD = [['health', 'Вред жизни и здоровью', 'Өмір мен денсаулыққа зиян', 0], ['labor', 'Нарушение трудовых прав', 'Еңбек құқықтарын бұзу', 0], ['prosec', 'Незаконное осуждение или арест', 'Заңсыз сотталу немесе қамалу', 0], ['defam', 'Распространение порочащих сведений', 'Абыройға нұқсан келтіретін мәліметтер тарату', 1], ['other', 'Иное нарушение неимущественных прав', 'Мүліктік емес құқықтардың басқа бұзылуы', 2]];
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const money = (id, def, ru, kk, extra) => Object.assign({ id, type: 'money', def, label: lab(ru, kk) }, extra || {});
const pct = (id, def, ru, kk, extra) => Object.assign({ id, type: 'percent', def, min: 0, max: 100, step: 'any', label: lab(ru, kk) }, extra || {});
const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
const sexF = { id: 'sex', type: 'seg', def: 'm', label: lab('Пол', 'Жынысы'), options: [{ v: 'm', ru: 'Мужчина', kk: 'Ер' }, { v: 'f', ru: 'Женщина', kk: 'Әйел' }] };
const yrs = (L, n) => t(L, `${E.num(n, 'auto')} ${E.plural(Math.floor(n), 'год', 'года', 'лет')}`, `${E.num(n, 'auto')} жыл`);
const NOTE_SOC = L => t(L, 'Расчёт ориентировочный. Точную сумму назначают ГФСС, ЕНПФ или Госкорпорация по вашим данным.', 'Есеп шамамен. Нақты соманы деректеріңіз бойынша МӘСҚ, БЖЗҚ немесе Мемлекеттік корпорация тағайындайды.');
E.retireAge = (sex, year, R) => sex === 'm' ? R.retireMen : (year <= 2027 ? R.retireWomen : Math.min(R.retireMen, R.retireWomen + (year - 2027) * 0.5));
const retireYear = (sex, birth, R) => { for (let y = birth + 50; y < birth + 80; y++) if (y - birth >= E.retireAge(sex, y, R)) return y; return birth + 63; };
const unempK = n => n < 6 ? 0 : n < 12 ? 0.7 : n < 24 ? 0.75 : n < 36 ? 0.85 : n < 48 ? 0.9 : n < 60 ? 0.95 : n < 72 ? 1 : Math.min(1.3, 1 + 0.02 * Math.floor((n - 60) / 12));
const unempN = n => n < 6 ? 0 : n < 12 ? 1 : n < 24 ? 2 : n < 36 ? 3 : n < 48 ? 4 : n < 60 ? 5 : 6;
E.workdays = (a, b, R) => { let w = 0, wk = 0, h = 0; const d = new Date(a.getTime()); while (d <= b) { const iso = d.toISOString().slice(0, 10), y = d.getUTCFullYear(), dw = d.getUTCDay(), hol = (R.holidays[y] || []).includes(iso), sat = (R.workSaturdays[y] || []).includes(iso); if (hol) h++; else if ((dw === 0 || dw === 6) && !sat) wk++; else w++; d.setUTCDate(d.getUTCDate() + 1); } return { w, wk, h, all: w + wk + h }; };
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const money = (id, def, ru, kk, extra) => Object.assign({ id, type: 'money', def, label: lab(ru, kk) }, extra || {});
const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
const chk = (id, def, ru, kk, extra) => Object.assign({ id, type: 'check', def, label: lab(ru, kk) }, extra || {});
const ytdF = money('ytd', 0, 'Другие облагаемые доходы за год (зарплата и пр.)', 'Жылдағы басқа салық салынатын табыстар (жалақы және т.б.)', { adv: true, hint: lab('Нужно для порога 15%: 8 500 МРП в год', '15% шегі үшін керек: жылына 8 500 АЕК') });
const NOTE_TAX = L => t(L, 'Расчёт справочный. Сверяйтесь с Налоговым кодексом РК и разъяснениями КГД.', 'Есеп анықтамалық. ҚР Салық кодексімен және МКК түсіндірмелерімен салыстырыңыз.');
E.propTax = (R, value) => { let row = R.propertyScale[0]; for (const r of R.propertyScale) if (value > r[0]) row = r; return E.round(row[1] + E.pos(value - row[0]) * row[2] / 100); };
E.carTax = (R, cc, made) => { const b = R.vehicleCars.find(x => cc <= x.upTo), extra = b.from ? E.pos(cc - b.from) * R.vehiclePerCC : 0, age = R.year - made, c = R.vehicleAgeCoef.find(x => age >= x.from && age <= x.to); return E.round((b.mrp * R.MRP + extra) * (c ? c.k : 1)); };
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
const E = root.ESEPTE, t = E.t, m = E.money;
const lab = (ru, kk) => ({ ru, kk });
const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, step: 'any', label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
const tariff = (id, ru, kk, unitRu, unitKk, extra) => Object.assign({ id, type: 'number', def: 0, min: 0, step: 'any', label: lab(ru, kk), suffix: lab(`₸/${unitRu}`, `₸/${unitKk}`), hint: lab('Из вашей квитанции или с сайта поставщика', 'Түбіртегіңізден немесе жеткізушінің сайтынан') }, extra || {});
const NEED = L => ({ error: t(L, 'Введите тариф из своей квитанции или с сайта поставщика', 'Тарифті түбіртегіңізден немесе жеткізушінің сайтынан енгізіңіз') });
const NOTE_U = L => t(L, 'Калькулятор не содержит тарифов: суммы считаются только по тем, что вы ввели. Тарифы зависят от города и поставщика и указаны в квитанции.', 'Калькуляторда тарифтер жоқ: сомалар тек сіз енгізгендер бойынша есептеледі. Тарифтер қала мен жеткізушіге байланысты және түбіртекте көрсетілген.');
const meter = (pre, kk) => [numF(pre + 'a', 0, 'Предыдущие показания', 'Алдыңғы көрсеткіштер', '', '', { half: true }), numF(pre + 'b', 0, 'Текущие показания', 'Ағымдағы көрсеткіштер', '', '', { half: true })];
const vol = (v, p) => E.pos(v[p + 'b'] - v[p + 'a']);
const FUEL = { gas: [9.3, 0.9, 'м³', 'м³'], coal: [5, 0.7, 'кг', 'кг'], el: [1, 0.98, 'кВт·ч', 'кВт·сағ'], wood: [4, 0.7, 'кг', 'кг'] };
})(typeof window !== 'undefined' ? window : globalThis);
