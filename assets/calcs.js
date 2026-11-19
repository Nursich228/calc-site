/* Сгенерировано src/build.js из src/calcs — правьте исходники, а не этот файл. */
/* Общие функции для всех калькуляторов. */
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

/* Зарплата и кадры */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;

  /* 1. Зарплата на руки */
  E.add({
    id: 'salary', cat: 'payroll', popular: true,
    title: { ru: 'Зарплата на руки', kk: 'Қолға тиетін жалақы' },
    short: { ru: 'Удержания из зарплаты и расходы работодателя', kk: 'Жалақыдан ұсталымдар және жұмыс берушінің шығыстары' },
    badge: (R, L) => t(L, `ИПН ${E.pct(R.IPN)}`, `ЖТС ${E.pct(R.IPN)}`),
    keys: 'зарплата оклад опв восмс ипн со оосмс опвр соцналог на руки жалақы',
    fields: [{ id: 'gross', type: 'money', def: 300000, label: { ru: 'Начисленная зарплата за месяц', kk: 'Айлық есептелген жалақы' }, hint: { ru: 'Оклад плюс премии и доплаты до удержаний', kk: 'Ұсталымға дейінгі жалақы, сыйлықақы мен үстемеақы' } }].concat(E.payrollFields),
    calc(v, R, L) {
      const p = E.payroll(v.gross, v, R);
      const notes = [];
      if (v.gross > 0 && v.gross < R.MZP) notes.push(t(L, `Зарплата ниже МЗП (${m(R.MZP)}). За полный месяц при полной ставке так быть не должно.`, `Жалақы ЕТЖ-дан (${m(R.MZP)}) төмен. Толық ставкамен толық ай үшін бұлай болмауы керек.`));
      if (p.ip.high > 0) notes.push(t(L, 'Часть дохода превысила годовой порог 8 500 МРП — к ней применена ставка 15%.', 'Табыстың бір бөлігі 8 500 АЕК жылдық шегінен асты — оған 15% мөлшерлеме қолданылды.'));
      return {
        main: { label: t(L, 'На руки', 'Қолға'), value: p.net },
        cards: [
          { label: t(L, 'Удержано', 'Ұсталды'), value: p.opv + p.vosms + p.ipn },
          { label: t(L, 'Расходы работодателя', 'Жұмыс беруші шығыны'), value: p.cost }
        ],
        rows: E.payrollRows(p, L, R), steps: E.payrollSteps(p, v, L, R), notes
      };
    }
  });

  /* 2. От суммы на руки */
  E.add({
    id: 'salary-reverse', cat: 'payroll', popular: true,
    title: { ru: 'Зарплата от суммы на руки', kk: 'Қолға тиетін сомадан жалақы' },
    short: { ru: 'Какой оклад нужен, чтобы получить нужную сумму', kk: 'Қажетті соманы алу үшін қандай жалақы керек' },
    badge: (R, L) => t(L, 'net → gross', 'net → gross'),
    keys: 'от обратного на руки gross net оклад кері есеп',
    fields: [{ id: 'net', type: 'money', def: 250000, label: { ru: 'Сколько работник должен получить на руки', kk: 'Қызметкер қолға қанша алуы керек' } }].concat(E.payrollFields),
    calc(v, R, L) {
      const target = v.net;
      if (!(target > 0)) return { error: t(L, 'Введите сумму на руки', 'Қолға тиетін соманы енгізіңіз') };
      let lo = 0, hi = target * 3 + 1e6;
      for (let i = 0; i < 80 && hi - lo > 0.5; i++) {
        const mid = (lo + hi) / 2;
        if (E.payroll(mid, v, R).net >= target) hi = mid; else lo = mid;
      }
      let g = Math.ceil(hi);
      while (g > 1 && E.payroll(g - 1, v, R).net >= target) g--;
      const p = E.payroll(g, v, R);
      const notes = [];
      if (p.net !== target) notes.push(t(L, `Из-за округления налогов до тенге точно ${m(target)} не получается: ближайший оклад даёт ${m(p.net)}.`, `Салықтарды теңгеге дейін дөңгелектеу салдарынан дәл ${m(target)} шықпайды: ең жақын жалақы ${m(p.net)} береді.`));
      return {
        main: { label: t(L, 'Нужно начислить', 'Есептеу керек'), value: g },
        cards: [{ label: t(L, 'На руки', 'Қолға'), value: p.net }, { label: t(L, 'Расходы работодателя', 'Жұмыс беруші шығыны'), value: p.cost }],
        rows: E.payrollRows(p, L, R), steps: [t(L, `Подобрали начисленную зарплату ${m(g)}, при которой на руки остаётся ${m(p.net)}.`, `Қолға ${m(p.net)} қалатын ${m(g)} жалақы таңдалды.`)].concat(E.payrollSteps(p, v, L, R)), notes
      };
    }
  });

  /* 3. Договор ГПХ */
  E.add({
    id: 'gph', cat: 'payroll',
    title: { ru: 'Договор ГПХ: налоги', kk: 'АҚС шарты: салықтар' },
    short: { ru: 'Удержания с вознаграждения физлица по договору услуг', kk: 'Қызмет көрсету шарты бойынша жеке тұлғаның сыйақысынан ұсталымдар' },
    badge: (R, L) => t(L, 'ГПХ', 'АҚС'),
    keys: 'гпх договор услуг подряд физлицо агент азаматтық-құқықтық',
    fields: [
      { id: 'amount', type: 'money', def: 200000, label: { ru: 'Вознаграждение по договору за месяц', kk: 'Шарт бойынша айлық сыйақы' } },
      { id: 'cat', type: 'select', def: 'std', label: { ru: 'Исполнитель', kk: 'Орындаушы' }, options: [
        { v: 'std', ru: 'Гражданин РК, не ИП', kk: 'ҚР азаматы, ЖК емес' },
        { v: 'pens', ru: 'Пенсионер по возрасту', kk: 'Жасына байланысты зейнеткер' }] },
      { id: 'ded', type: 'check', def: false, label: { ru: 'Применить вычет 30 МРП (подано заявление, вычет нигде больше не применяется)', kk: '30 АЕК шегерімін қолдану (өтініш берілген, басқа жерде қолданылмайды)' } },
      { id: 'ytd', type: 'money', def: 0, adv: true, label: { ru: 'Облагаемый доход с начала года', kk: 'Жыл басынан салық салынатын табыс' } }
    ],
    calc(v, R, L) {
      const a = v.amount, isP = v.cat === 'pens';
      const opv = isP ? 0 : E.round(Math.min(a, R.OPVmaxMZP * R.MZP) * R.OPV / 100);
      const vosms = isP ? 0 : E.round(Math.min(a, R.VOSMSmaxMZP * R.MZP) * R.VOSMS / 100);
      const before = E.pos(a - opv - vosms);
      const ded = v.ded ? Math.min(R.baseDeductionMRP * R.MRP, before) : 0;
      const ip = E.ipnProgressive(E.pos(before - ded), v.ytd, R);
      const net = a - opv - vosms - ip.tax;
      const soBase = Math.min(E.pos(a - opv), R.SOmaxMZP * R.MZP);
      const so = isP ? 0 : E.round(soBase * R.SO / 100);
      return {
        main: { label: t(L, 'Исполнитель получит', 'Орындаушы алады'), value: net },
        cards: [{ label: t(L, 'Удержано', 'Ұсталды'), value: opv + vosms + ip.tax }, { label: t(L, 'Расходы заказчика', 'Тапсырыс беруші шығыны'), value: a + so }],
        rows: [
          { head: true, label: t(L, 'Удерживает заказчик (налоговый агент)', 'Тапсырыс беруші (салық агенті) ұстайды') },
          { label: t(L, 'ОПВ 10%', 'МЗЖ 10%'), value: opv },
          { label: t(L, 'ВОСМС 2%', 'МӘМСЖ 2%'), value: vosms },
          { label: t(L, 'ИПН', 'ЖТС'), value: ip.tax },
          { head: true, label: t(L, 'Платит заказчик сверху', 'Тапсырыс беруші қосымша төлейді') },
          { label: t(L, 'Социальные отчисления 5%', 'Әлеуметтік аударымдар 5%'), value: so }
        ],
        steps: [
          t(L, `ОПВ = ${m(a)} × 10% = ${m(opv)}; ВОСМС = ${m(a)} × 2% = ${m(vosms)}`, `МЗЖ = ${m(a)} × 10% = ${m(opv)}; МӘМСЖ = ${m(a)} × 2% = ${m(vosms)}`),
          t(L, `ИПН = (${m(a)} − ${m(opv)} − ${m(vosms)} − вычет ${m(ded)}) × 10% = ${m(ip.tax)}`, `ЖТС = (${m(a)} − ${m(opv)} − ${m(vosms)} − шегерім ${m(ded)}) × 10% = ${m(ip.tax)}`),
          t(L, `СО = (${m(a)} − ${m(opv)}), но не больше 7 МЗП → ${m(soBase)} × 5% = ${m(so)}`, `ӘА = (${m(a)} − ${m(opv)}), бірақ 7 ЕТЖ-дан аспайды → ${m(soBase)} × 5% = ${m(so)}`)
        ],
        notes: [t(L, 'Для пенсионеров по выслуге лет, лиц с инвалидностью, студентов и иностранцев порядок отличается.', 'Еңбек сіңірген жылдары үшін зейнеткерлерге, мүгедектігі бар адамдарға, студенттер мен шетелдіктерге тәртіп басқаша.')]
      };
    }
  });

  /* 4. Отпускные */
  E.add({
    id: 'vacation', cat: 'payroll', popular: true,
    title: { ru: 'Отпускные', kk: 'Демалыс ақысы' },
    short: { ru: 'Средний дневной заработок за 12 месяцев × рабочие дни отпуска', kk: '12 айдағы орташа күндік табыс × демалыстың жұмыс күндері' },
    badge: (R, L) => t(L, `${R.vacationDays} дня`, `${R.vacationDays} күн`),
    keys: 'отпуск отпускные средний заработок демалыс',
    fields: [
      { id: 'income', type: 'money', def: 3600000, label: { ru: 'Начисленная зарплата за расчётный период', kk: 'Есептік кезеңдегі есептелген жалақы' }, hint: { ru: 'Обычно 12 месяцев перед месяцем отпуска. Пособия и материальная помощь не включаются.', kk: 'Әдетте демалыс айының алдындағы 12 ай. Жәрдемақы мен материалдық көмек кірмейді.' } },
      { id: 'worked', type: 'number', def: 247, min: 1, max: 366, label: { ru: 'Отработанных рабочих дней в этом периоде', kk: 'Осы кезеңде жұмыс істеген жұмыс күндері' }, suffix: { ru: 'дн.', kk: 'күн' } },
      { id: 'vac', type: 'number', def: 17, min: 0, max: 200, label: { ru: 'Рабочих дней, приходящихся на отпуск', kk: 'Демалысқа келетін жұмыс күндері' }, suffix: { ru: 'дн.', kk: 'күн' }, hint: { ru: '24 календарных дня отпуска — это обычно 16–18 рабочих дней. Праздники не считаются.', kk: '24 күнтізбелік күн — әдетте 16–18 жұмыс күні. Мереке күндері есептелмейді.' } },
      { id: 'deduct', type: 'check', def: true, label: { ru: 'Показать удержания (ОПВ, ВОСМС, ИПН)', kk: 'Ұсталымдарды көрсету (МЗЖ, МӘМСЖ, ЖТС)' } }
    ],
    calc(v, R, L) {
      if (!(v.worked > 0)) return { error: t(L, 'Укажите отработанные дни', 'Жұмыс істеген күндерді көрсетіңіз') };
      const avg = v.income / v.worked;
      const pay = E.round(avg * v.vac);
      const rows = [{ label: t(L, 'Средний дневной заработок', 'Орташа күндік табыс'), value: avg, fmt: 'money2' }, { label: t(L, 'Отпускные до удержаний', 'Ұсталымға дейінгі демалыс ақысы'), value: pay, strong: true }];
      const steps = [
        t(L, `Средний дневной заработок = ${m(v.income)} ÷ ${v.worked} дн. = ${m(avg, 2)}`, `Орташа күндік табыс = ${m(v.income)} ÷ ${v.worked} күн = ${m(avg, 2)}`),
        t(L, `Отпускные = ${m(avg, 2)} × ${v.vac} дн. = ${m(pay)}`, `Демалыс ақысы = ${m(avg, 2)} × ${v.vac} күн = ${m(pay)}`)
      ];
      let net = pay;
      if (v.deduct) {
        const opv = E.round(pay * R.OPV / 100), vosms = E.round(pay * R.VOSMS / 100), ipn = E.round(E.pos(pay - opv - vosms) * R.IPN / 100);
        net = pay - opv - vosms - ipn;
        rows.push({ head: true, label: t(L, 'Удержания', 'Ұсталымдар') },
          { label: t(L, 'ОПВ 10%', 'МЗЖ 10%'), value: opv }, { label: t(L, 'ВОСМС 2%', 'МӘМСЖ 2%'), value: vosms },
          { label: t(L, 'ИПН 10% (без вычета)', 'ЖТС 10% (шегерімсіз)'), value: ipn }, { label: t(L, 'На руки', 'Қолға'), value: net, strong: true });
        steps.push(t(L, `ИПН = (${m(pay)} − ${m(opv)} − ${m(vosms)}) × 10% = ${m(ipn)}`, `ЖТС = (${m(pay)} − ${m(opv)} − ${m(vosms)}) × 10% = ${m(ipn)}`));
      }
      return {
        main: { label: v.deduct ? t(L, 'Отпускные на руки', 'Қолға тиетін демалыс ақысы') : t(L, 'Отпускные', 'Демалыс ақысы'), value: net },
        cards: [{ label: t(L, 'До удержаний', 'Ұсталымға дейін'), value: pay }, { label: t(L, 'В день', 'Күніне'), value: avg, fmt: 'money2' }],
        rows, steps,
        notes: [t(L, 'Вычет 30 МРП в месяце отпуска обычно применяется один раз — вместе с зарплатой, поэтому здесь он не учтён. Если в периоде повышали оклад всем работникам, отпускные пересчитывают с коэффициентом.', 'Демалыс айында 30 АЕК шегерімі әдетте бір рет — жалақымен бірге қолданылады, сондықтан мұнда ескерілмеген. Кезеңде барлық қызметкерлердің жалақысы көтерілсе, демалыс ақысы коэффициентпен қайта есептеледі.')]
      };
    }
  });

  /* 5. Больничный */
  E.add({
    id: 'sick-leave', cat: 'social',
    title: { ru: 'Больничный', kk: 'Ауырған күндер үшін жәрдемақы' },
    short: { ru: 'Пособие по временной нетрудоспособности с пределом 25 МРП', kk: '25 АЕК шегімен уақытша еңбекке жарамсыздық жәрдемақысы' },
    badge: (R, L) => t(L, `до ${R.sickCapMRP} МРП`, `${R.sickCapMRP} АЕК дейін`),
    keys: 'больничный нетрудоспособность пособие лист еңбекке жарамсыздық',
    fields: [
      { id: 'income', type: 'money', def: 3600000, label: { ru: 'Зарплата за последние 12 месяцев', kk: 'Соңғы 12 айдағы жалақы' } },
      { id: 'worked', type: 'number', def: 247, min: 1, max: 366, label: { ru: 'Отработанных рабочих дней за эти месяцы', kk: 'Осы айларда жұмыс істеген жұмыс күндері' }, suffix: { ru: 'дн.', kk: 'күн' } },
      { id: 'sick', type: 'number', def: 5, min: 0, max: 100, label: { ru: 'Рабочих дней по больничному листу в этом месяце', kk: 'Осы айда ауырған жұмыс күндері' }, suffix: { ru: 'дн.', kk: 'күн' } }
    ],
    calc(v, R, L) {
      if (!(v.worked > 0)) return { error: t(L, 'Укажите отработанные дни', 'Жұмыс істеген күндерді көрсетіңіз') };
      const avg = v.income / v.worked, full = E.round(avg * v.sick), cap = R.sickCapMRP * R.MRP, ben = Math.min(full, cap);
      const notes = [];
      if (full > cap) notes.push(t(L, `Расчёт ${m(full)} выше предела ${R.sickCapMRP} МРП (${m(cap)}) за месяц. Разницу работодатель может доплатить за свой счёт, если это предусмотрено договором.`, `Есеп ${m(full)} айлық ${R.sickCapMRP} АЕК (${m(cap)}) шегінен жоғары. Айырманы жұмыс беруші шартта көзделсе, өз есебінен төлей алады.`));
      notes.push(t(L, 'Из пособия удерживаются ИПН и пенсионные взносы в общем порядке — уточните у бухгалтера.', 'Жәрдемақыдан ЖТС пен зейнетақы жарналары жалпы тәртіппен ұсталады — бухгалтерден нақтылаңыз.'));
      return {
        main: { label: t(L, 'Пособие до удержаний', 'Ұсталымға дейінгі жәрдемақы'), value: ben },
        cards: [{ label: t(L, 'Средний дневной', 'Орташа күндік'), value: avg, fmt: 'money2' }, { label: t(L, 'Предел за месяц', 'Айлық шек'), value: cap }],
        rows: [{ label: t(L, 'Расчёт без предела', 'Шексіз есеп'), value: full }, { label: t(L, `Предел ${R.sickCapMRP} МРП`, `${R.sickCapMRP} АЕК шегі`), value: cap }, { label: t(L, 'К выплате', 'Төлеуге'), value: ben, strong: true }],
        steps: [
          t(L, `Средний дневной заработок = ${m(v.income)} ÷ ${v.worked} = ${m(avg, 2)}`, `Орташа күндік табыс = ${m(v.income)} ÷ ${v.worked} = ${m(avg, 2)}`),
          t(L, `Пособие = ${m(avg, 2)} × ${v.sick} дн. = ${m(full)}, но не больше ${m(cap)} → ${m(ben)}`, `Жәрдемақы = ${m(avg, 2)} × ${v.sick} күн = ${m(full)}, бірақ ${m(cap)}-ден аспайды → ${m(ben)}`)
        ], notes
      };
    }
  });

  /* 6. Декретные */
  E.add({
    id: 'maternity', cat: 'social',
    title: { ru: 'Декретные: беременность и роды', kk: 'Жүктілік және босану төлемі' },
    short: { ru: 'Выплата из ГФСС за 126, 140 или 170 дней', kk: 'МӘСҚ-дан 126, 140 немесе 170 күнге төлем' },
    badge: (R, L) => t(L, `до ${R.maternityCapMZP} МЗП`, `${R.maternityCapMZP} ЕТЖ дейін`),
    keys: 'декрет декретные беременность роды гфсс пособие жүктілік босану',
    fields: [
      { id: 'income', type: 'money', def: 3600000, label: { ru: 'Доход за последние 12 месяцев, с которого платились СО', kk: 'Соңғы 12 айдағы ӘА төленген табыс' } },
      { id: 'days', type: 'select', def: '126', label: { ru: 'Дней по листу нетрудоспособности', kk: 'Еңбекке жарамсыздық парағы бойынша күндер' }, options: [
        { v: '126', ru: '126 — обычные роды', kk: '126 — қалыпты босану' },
        { v: '140', ru: '140 — осложнённые роды или двое и более детей', kk: '140 — асқынған босану немесе екі және одан көп бала' },
        { v: '170', ru: '170 — проживание в зоне экологического бедствия', kk: '170 — экологиялық апат аймағында тұру' },
        { v: '56', ru: '56 — усыновление новорождённого', kk: '56 — жаңа туған баланы асырап алу' }] }
    ],
    calc(v, R, L) {
      const days = +v.days, avgRaw = v.income / 12, cap = R.maternityCapMZP * R.MZP, avg = Math.min(avgRaw, cap);
      const pay = E.round(avg * days / 30), opv = E.round(pay * R.maternityOPV / 100), net = pay - opv;
      return {
        main: { label: t(L, 'К получению', 'Алуға'), value: net },
        cards: [{ label: t(L, 'Назначено', 'Тағайындалды'), value: pay }, { label: t(L, 'ОПВ 10%', 'МЗЖ 10%'), value: opv }],
        rows: [{ label: t(L, 'Среднемесячный доход', 'Орташа айлық табыс'), value: avgRaw }, { label: t(L, `Учитывается (не выше ${R.maternityCapMZP} МЗП)`, `Ескеріледі (${R.maternityCapMZP} ЕТЖ-дан аспайды)`), value: avg }, { label: t(L, 'Коэффициент дней', 'Күндер коэффициенті'), value: days / 30, fmt: 'num2' }, { label: t(L, 'Выплата', 'Төлем'), value: pay }, { label: t(L, 'ОПВ', 'МЗЖ'), value: opv }, { label: t(L, 'На руки', 'Қолға'), value: net, strong: true }],
        steps: [
          t(L, `Среднемесячный доход = ${m(v.income)} ÷ 12 = ${m(avgRaw)}${avgRaw > cap ? `, ограничен ${R.maternityCapMZP} МЗП = ${m(cap)}` : ''}`, `Орташа айлық табыс = ${m(v.income)} ÷ 12 = ${m(avgRaw)}${avgRaw > cap ? `, ${R.maternityCapMZP} ЕТЖ = ${m(cap)} шектелген` : ''}`),
          t(L, `Выплата = ${m(avg)} × ${days} ÷ 30 = ${m(pay)}`, `Төлем = ${m(avg)} × ${days} ÷ 30 = ${m(pay)}`),
          t(L, `ОПВ = ${m(pay)} × 10% = ${m(opv)}; на руки ${m(net)}`, `МЗЖ = ${m(pay)} × 10% = ${m(opv)}; қолға ${m(net)}`)
        ],
        notes: [t(L, 'Право на выплату и её точный размер определяет ГФСС по данным о социальных отчислениях. Проверьте участие в системе соцстрахования на egov.kz.', 'Төлемге құқықты және нақты мөлшерін МӘСҚ әлеуметтік аударымдар деректері бойынша анықтайды. Әлеуметтік сақтандыруға қатысуды egov.kz-тен тексеріңіз.')]
      };
    }
  });

  /* 7. Командировочные */
  E.add({
    id: 'business-trip', cat: 'payroll',
    title: { ru: 'Командировочные (суточные)', kk: 'Іссапар (тәуліктік ақы)' },
    short: { ru: 'Сколько суточных не облагается налогом', kk: 'Тәуліктік ақының қаншасына салық салынбайды' },
    badge: (R, L) => t(L, `${R.perDiemRK_MRP} МРП/день`, `${R.perDiemRK_MRP} АЕК/күн`),
    keys: 'командировка суточные командировочные іссапар тәуліктік',
    fields: [
      { id: 'where', type: 'seg', def: 'rk', label: { ru: 'Куда', kk: 'Қайда' }, options: [{ v: 'rk', ru: 'По Казахстану', kk: 'Қазақстан бойынша' }, { v: 'abroad', ru: 'За рубеж', kk: 'Шетелге' }] },
      { id: 'days', type: 'number', def: 5, min: 1, max: 365, label: { ru: 'Дней командировки', kk: 'Іссапар күндері' }, suffix: { ru: 'дн.', kk: 'күн' } },
      { id: 'perDay', type: 'money', def: 30000, label: { ru: 'Суточные в день по приказу', kk: 'Бұйрық бойынша күніне тәуліктік ақы' } }
    ],
    calc(v, R, L) {
      const lim = (v.where === 'abroad' ? R.perDiemAbroad_MRP : R.perDiemRK_MRP) * R.MRP;
      const total = v.perDay * v.days, freeDays = Math.min(v.days, R.perDiemMaxDays);
      const free = Math.min(v.perDay, lim) * freeDays, taxable = E.pos(total - free);
      const notes = [];
      if (v.days > R.perDiemMaxDays) notes.push(t(L, `Командировка дольше ${R.perDiemMaxDays} дней: суточные сверх этого срока полностью облагаются.`, `Іссапар ${R.perDiemMaxDays} күннен ұзақ: осы мерзімнен тыс тәуліктік ақыға толық салық салынады.`));
      return {
        main: { label: t(L, 'Облагаемая часть', 'Салық салынатын бөлік'), value: taxable },
        cards: [{ label: t(L, 'Всего суточных', 'Барлық тәуліктік'), value: total }, { label: t(L, 'Без налога', 'Салықсыз'), value: free }],
        rows: [{ label: t(L, 'Необлагаемый предел в день', 'Күніне салық салынбайтын шек'), value: lim }, { label: t(L, 'Дней в пределах нормы', 'Норма шегіндегі күндер'), value: freeDays, fmt: 'num' }, { label: t(L, 'Не облагается', 'Салық салынбайды'), value: free }, { label: t(L, 'Облагается как доход работника', 'Қызметкер табысы ретінде салық салынады'), value: taxable, strong: true }],
        steps: [t(L, `Предел = ${v.where === 'abroad' ? R.perDiemAbroad_MRP : R.perDiemRK_MRP} МРП × ${m(R.MRP)} = ${m(lim)} в день`, `Шек = ${v.where === 'abroad' ? R.perDiemAbroad_MRP : R.perDiemRK_MRP} АЕК × ${m(R.MRP)} = күніне ${m(lim)}`),
          t(L, `Без налога = min(${m(v.perDay)}; ${m(lim)}) × ${freeDays} дн. = ${m(free)}`, `Салықсыз = min(${m(v.perDay)}; ${m(lim)}) × ${freeDays} күн = ${m(free)}`),
          t(L, `Облагается = ${m(total)} − ${m(free)} = ${m(taxable)}`, `Салық салынады = ${m(total)} − ${m(free)} = ${m(taxable)}`)], notes
      };
    }
  });

  /* 8. Алименты */
  E.add({
    id: 'alimony', cat: 'payroll',
    title: { ru: 'Алименты', kk: 'Алимент' },
    short: { ru: 'Доля дохода на содержание детей', kk: 'Балаларды асырауға табыс үлесі' },
    badge: (R, L) => t(L, '¼ · ⅓ · ½', '¼ · ⅓ · ½'),
    keys: 'алименты дети содержание алимент бала',
    fields: [
      { id: 'income', type: 'money', def: 250000, label: { ru: 'Доход за месяц после налогов', kk: 'Салықтан кейінгі айлық табыс' } },
      { id: 'kids', type: 'seg', def: '1', label: { ru: 'Детей', kk: 'Балалар саны' }, options: [{ v: '1', ru: '1', kk: '1' }, { v: '2', ru: '2', kk: '2' }, { v: '3', ru: '3 и больше', kk: '3 және одан көп' }] }
    ],
    calc(v, R, L) {
      const sh = { 1: [1, 4], 2: [1, 3], 3: [1, 2] }[v.kids], amt = E.round(v.income * sh[0] / sh[1]);
      return {
        main: { label: t(L, 'Алименты в месяц', 'Айына алимент'), value: amt },
        cards: [{ label: t(L, 'Доля', 'Үлес'), value: `${sh[0]}/${sh[1]}`, fmt: 'text' }, { label: t(L, 'Останется', 'Қалады'), value: v.income - amt }],
        rows: [{ label: t(L, 'Доход после налогов', 'Салықтан кейінгі табыс'), value: v.income }, { label: t(L, 'Алименты', 'Алимент'), value: amt, strong: true }],
        steps: [t(L, `${m(v.income)} × ${sh[0]}/${sh[1]} = ${m(amt)}`, `${m(v.income)} × ${sh[0]}/${sh[1]} = ${m(amt)}`)],
        notes: [t(L, 'Суд может уменьшить или увеличить долю, а также назначить алименты в твёрдой сумме.', 'Сот үлесті азайтуы не көбейтуі, сондай-ақ алиментті тұрақты сомада тағайындауы мүмкін.')]
      };
    }
  });

  /* 9. Трудовой стаж */
  const per = [];
  for (let i = 1; i <= 5; i++) {
    per.push({ id: 's' + i, type: 'date', def: i === 1 ? '2018-03-01' : '', optional: true, half: true, label: { ru: `Период ${i}: с`, kk: `${i}-кезең: бастап` } });
    per.push({ id: 'e' + i, type: 'date', def: i === 1 ? 'today' : '', optional: true, half: true, label: { ru: 'по', kk: 'дейін' } });
  }
  E.add({
    id: 'work-experience', cat: 'payroll',
    title: { ru: 'Трудовой стаж', kk: 'Еңбек өтілі' },
    short: { ru: 'Сумма периодов работы в годах, месяцах и днях', kk: 'Жұмыс кезеңдерінің жиыны жыл, ай, күнмен' },
    badge: (R, L) => t(L, 'г/м/д', 'ж/а/к'),
    keys: 'стаж трудовой периоды работы еңбек өтілі',
    fields: per,
    calc(v, R, L) {
      let Y = 0, M = 0, D = 0, days = 0; const rows = [];
      for (let i = 1; i <= 5; i++) {
        const a = E.parseDate(v['s' + i]), b = E.parseDate(v['e' + i]);
        if (!a || !b) continue;
        if (b < a) return { error: t(L, `В периоде ${i} дата окончания раньше начала`, `${i}-кезеңде аяқталу күні басталудан бұрын`) };
        const o = E.ymd(a, b, true); Y += o.y; M += o.m; D += o.d; days += E.daysBetween(a, b) + 1;
        rows.push({ label: t(L, `Период ${i}`, `${i}-кезең`), value: E.ymdText(o, L), fmt: 'text' });
      }
      if (!rows.length) return { error: t(L, 'Заполните хотя бы один период', 'Кемінде бір кезеңді толтырыңыз') };
      M += Math.floor(D / 30); D = D % 30; Y += Math.floor(M / 12); M = M % 12;
      const tot = { y: Y, m: M, d: D };
      rows.push({ label: t(L, 'Итого', 'Барлығы'), value: E.ymdText(tot, L), fmt: 'text', strong: true });
      return {
        main: { label: t(L, 'Общий стаж', 'Жалпы өтіл'), value: E.ymdText(tot, L), fmt: 'text' },
        cards: [{ label: t(L, 'Календарных дней', 'Күнтізбелік күн'), value: days, fmt: 'num' }],
        rows,
        steps: [t(L, 'Каждый период считается включительно. Дни переводятся в месяцы по 30, месяцы в годы по 12.', 'Әр кезең қоса есептеледі. Күндер 30-дан айға, айлар 12-ден жылға айналдырылады.')],
        notes: [t(L, 'Пересекающиеся периоды будут сложены дважды — вводите их без наложений.', 'Қиылысатын кезеңдер екі рет қосылады — оларды қабаттаспай енгізіңіз.')]
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Налоги ИП и бизнеса */
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

  /* 10. ИП за себя */
  E.add({
    id: 'ip-self', cat: 'business', popular: true,
    title: { ru: 'Платежи ИП за себя', kk: 'ЖК-нің өзі үшін төлемдері' },
    short: { ru: 'ОПВ, ОПВР, СО, ВОСМС и соцналог за месяц и год', kk: 'Айлық және жылдық МЗЖ, ЖМЗЖ, ӘА, МӘМСЖ және әлеуметтік салық' },
    badge: (R, L) => m(ipSelf(R.MZP, 'snr', false, R).total),
    keys: 'ип за себя опв со восмс опвр соцналог жк өзі үшін',
    fields: [
      { id: 'regime', type: 'seg', def: 'snr', label: { ru: 'Режим', kk: 'Режим' }, options: [{ v: 'snr', ru: 'Упрощённая декларация', kk: 'Оңайлатылған декларация' }, { v: 'our', ru: 'Общеустановленный', kk: 'Жалпыға бірдей' }] },
      { id: 'declared', type: 'money', def: 85000, label: { ru: 'Заявленный доход в месяц', kk: 'Айлық мәлімделген табыс' }, hint: { ru: 'ИП сам выбирает сумму: не меньше 1 МЗП. От неё считаются ОПВ, ОПВР и СО.', kk: 'ЖК соманы өзі таңдайды: 1 ЕТЖ-дан кем емес. Одан МЗЖ, ЖМЗЖ және ӘА есептеледі.' } },
      { id: 'born1975', type: 'check', def: false, label: { ru: 'Родился до 1 января 1975 года (ОПВР не платится)', kk: '1975 жылғы 1 қаңтарға дейін туған (ЖМЗЖ төленбейді)' } }
    ],
    calc(v, R, L) {
      const p = ipSelf(v.declared, v.regime, v.born1975, R), notes = [];
      if (v.declared < R.MZP) notes.push(t(L, `Заявленный доход меньше 1 МЗП — расчёт сделан от ${m(R.MZP)}.`, `Мәлімделген табыс 1 ЕТЖ-дан аз — есеп ${m(R.MZP)}-ден жасалды.`));
      notes.push(t(L, 'Срок уплаты — до 25-го числа следующего месяца.', 'Төлеу мерзімі — келесі айдың 25-іне дейін.'));
      return {
        main: { label: t(L, 'В месяц', 'Айына'), value: p.total },
        cards: [{ label: t(L, 'За год', 'Жылына'), value: p.total * 12 }],
        rows: [
          { label: t(L, `ОПВ ${E.pct(R.OPV)}`, `МЗЖ ${E.pct(R.OPV)}`), value: p.opv },
          { label: t(L, `ОПВР ${E.pct(R.OPVR)}`, `ЖМЗЖ ${E.pct(R.OPVR)}`), value: p.opvr },
          { label: t(L, `Социальные отчисления ${E.pct(R.SO)}`, `Әлеуметтік аударымдар ${E.pct(R.SO)}`), value: p.so },
          { label: t(L, `ВОСМС ${E.pct(R.VOSMS_IP)} от ${E.num(R.VOSMS_IPbaseMZP, 1)} МЗП`, `МӘМСЖ ${E.pct(R.VOSMS_IP)}, ${E.num(R.VOSMS_IPbaseMZP, 1)} ЕТЖ-дан`), value: p.vosms },
          { label: t(L, 'Социальный налог', 'Әлеуметтік салық'), value: p.sn },
          { label: t(L, 'Итого в месяц', 'Айына барлығы'), value: p.total, strong: true }
        ],
        steps: [
          t(L, `ОПВ = ${m(p.base)} × ${E.pct(R.OPV)} = ${m(p.opv)}`, `МЗЖ = ${m(p.base)} × ${E.pct(R.OPV)} = ${m(p.opv)}`),
          v.born1975 ? t(L, 'ОПВР не начисляется.', 'ЖМЗЖ есептелмейді.') : t(L, `ОПВР = ${m(p.base)} × ${E.pct(R.OPVR)} = ${m(p.opvr)}`, `ЖМЗЖ = ${m(p.base)} × ${E.pct(R.OPVR)} = ${m(p.opvr)}`),
          t(L, `СО = ${m(p.soBase)} (от 1 до 7 МЗП) × ${E.pct(R.SO)} = ${m(p.so)}`, `ӘА = ${m(p.soBase)} (1-ден 7 ЕТЖ-ға дейін) × ${E.pct(R.SO)} = ${m(p.so)}`),
          t(L, `ВОСМС = ${E.num(R.VOSMS_IPbaseMZP, 1)} × ${m(R.MZP)} × ${E.pct(R.VOSMS_IP)} = ${m(p.vosms)}`, `МӘМСЖ = ${E.num(R.VOSMS_IPbaseMZP, 1)} × ${m(R.MZP)} × ${E.pct(R.VOSMS_IP)} = ${m(p.vosms)}`),
          v.regime === 'our' ? t(L, `Соцналог = ${R.SN_IPselfMRP} МРП = ${m(p.sn)}`, `Әлеуметтік салық = ${R.SN_IPselfMRP} АЕК = ${m(p.sn)}`) : t(L, 'На упрощённой декларации социальный налог не платится.', 'Оңайлатылған декларацияда әлеуметтік салық төленбейді.')
        ], notes
      };
    }
  });

  /* 11. Упрощёнка */
  E.add({
    id: 'simplified', cat: 'business', popular: true,
    title: { ru: 'Налог ИП на упрощёнке (910)', kk: 'Оңайлатылған декларациядағы ЖК салығы (910)' },
    short: { ru: 'Налог за полугодие и запас до лимита дохода', kk: 'Жарты жылдық салық және табыс лимитіне дейінгі қор' },
    badge: (R, L) => E.pct(R.simplified),
    keys: 'упрощенка 910 упрощенная декларация ип налог 4 процента оңайлатылған',
    fields: [
      { id: 'income', type: 'money', def: 6000000, label: { ru: 'Доход за полугодие', kk: 'Жарты жылдағы табыс' } },
      { id: 'rate', type: 'percent', def: 4, min: 2, max: 6, step: 0.5, label: { ru: 'Ставка в вашем регионе', kk: 'Сіздің өңірдегі мөлшерлеме' }, hint: { ru: 'Базовая 4%. Маслихат может изменить её в пределах 2–6%.', kk: 'Базалық 4%. Мәслихат оны 2–6% шегінде өзгерте алады.' } },
      { id: 'prev', type: 'money', def: 0, adv: true, label: { ru: 'Доход за первое полугодие (если считаете второе)', kk: 'Бірінші жарты жылдағы табыс (екіншісін есептесеңіз)' } }
    ],
    calc(v, R, L) {
      const rate = E.clamp(v.rate, R.simplifiedMin, R.simplifiedMax), tax = E.round(v.income * rate / 100);
      const lim = R.simplifiedLimitMRP * R.MRP, year = v.income + (v.prev || 0), left = lim - year, notes = [];
      if (left < 0) notes.push(t(L, `Годовой доход превышает лимит ${E.num(R.simplifiedLimitMRP)} МРП (${m(lim)}): упрощённый режим применять нельзя.`, `Жылдық табыс ${E.num(R.simplifiedLimitMRP)} АЕК (${m(lim)}) лимитінен асады: оңайлатылған режимді қолдануға болмайды.`));
      notes.push(t(L, 'Декларация 910.00 — до 15 августа и 15 февраля, уплата — до 25 августа и 25 февраля. Платежи за себя и за работников считаются отдельно.', '910.00 декларациясы — 15 тамыз бен 15 ақпанға дейін, төлеу — 25 тамыз бен 25 ақпанға дейін. Өзі және қызметкерлер үшін төлемдер бөлек есептеледі.'));
      return {
        main: { label: t(L, 'Налог за полугодие', 'Жарты жылдық салық'), value: tax },
        cards: [{ label: t(L, 'Запас до лимита', 'Лимитке дейінгі қор'), value: left }, { label: t(L, 'Годовой лимит', 'Жылдық лимит'), value: lim }],
        rows: [{ label: t(L, 'Доход за полугодие', 'Жарты жылдағы табыс'), value: v.income }, { label: t(L, 'Ставка', 'Мөлшерлеме'), value: rate, fmt: 'pct' }, { label: t(L, 'Налог (ИПН для ИП, КПН для ТОО)', 'Салық (ЖК үшін ЖТС, ЖШС үшін КТС)'), value: tax, strong: true }],
        steps: [t(L, `Налог = ${m(v.income)} × ${E.pct(rate)} = ${m(tax)}`, `Салық = ${m(v.income)} × ${E.pct(rate)} = ${m(tax)}`), t(L, `Лимит = ${E.num(R.simplifiedLimitMRP)} МРП × ${m(R.MRP)} = ${m(lim)}`, `Лимит = ${E.num(R.simplifiedLimitMRP)} АЕК × ${m(R.MRP)} = ${m(lim)}`)], notes
      };
    }
  });

  /* 12. Самозанятый */
  E.add({
    id: 'self-employed', cat: 'business',
    title: { ru: 'Самозанятый: платежи 4%', kk: 'Өзін-өзі жұмыспен қамтыған: 4% төлемдер' },
    short: { ru: 'Соцплатежи с дохода и проверка лимита 300 МРП', kk: 'Табыстан әлеуметтік төлемдер және 300 АЕК лимитін тексеру' },
    badge: (R, L) => '4%',
    keys: 'самозанятый 4 процента приложение өзін-өзі жұмыспен қамтыған',
    fields: [{ id: 'income', type: 'money', def: 400000, label: { ru: 'Доход за месяц', kk: 'Айлық табыс' } }],
    calc(v, R, L) {
      const S = R.selfEmployed, lim = R.selfEmployedLimitMRP * R.MRP, a = v.income;
      const p = { opv: E.round(a * S.OPV / 100), opvr: E.round(a * S.OPVR / 100), so: E.round(a * S.SO / 100), vosms: E.round(a * S.VOSMS / 100) };
      const total = p.opv + p.opvr + p.so + p.vosms, notes = [];
      if (a > lim) notes.push(t(L, `Доход выше лимита ${R.selfEmployedLimitMRP} МРП в месяц (${m(lim)}): режим самозанятого применять нельзя.`, `Табыс айына ${R.selfEmployedLimitMRP} АЕК (${m(lim)}) лимитінен жоғары: өзін-өзі жұмыспен қамтыған режимін қолдануға болмайды.`));
      notes.push(t(L, 'Режим доступен только для видов деятельности из перечня Правительства и без наёмных работников.', 'Режим тек Үкімет тізбесіндегі қызмет түрлері үшін және жалдамалы қызметкерсіз қолжетімді.'));
      return {
        main: { label: t(L, 'Платежи за месяц', 'Айлық төлемдер'), value: total },
        cards: [{ label: t(L, 'Останется', 'Қалады'), value: a - total }, { label: t(L, 'Лимит в месяц', 'Айлық лимит'), value: lim }],
        rows: [{ label: t(L, 'ИПН', 'ЖТС'), value: 0 }, { label: t(L, 'ОПВ 1%', 'МЗЖ 1%'), value: p.opv }, { label: t(L, 'ОПВР 1%', 'ЖМЗЖ 1%'), value: p.opvr }, { label: t(L, 'СО 1%', 'ӘА 1%'), value: p.so }, { label: t(L, 'ВОСМС 1%', 'МӘМСЖ 1%'), value: p.vosms }, { label: t(L, 'Итого 4%', 'Барлығы 4%'), value: total, strong: true }],
        steps: [t(L, `${m(a)} × 4% = ${m(total)} (по 1% на ОПВ, ОПВР, СО и ВОСМС; ИПН 0%)`, `${m(a)} × 4% = ${m(total)} (МЗЖ, ЖМЗЖ, ӘА және МӘМСЖ-ге 1%-дан; ЖТС 0%)`)], notes
      };
    }
  });

  /* 13. Сравнение: самозанятый или ИП */
  E.add({
    id: 'regime-compare', cat: 'business',
    title: { ru: 'Самозанятый или ИП на упрощёнке', kk: 'Өзін-өзі жұмыспен қамтыған немесе оңайлатылған ЖК' },
    short: { ru: 'Где меньше платежей при вашем доходе', kk: 'Сіздің табысыңызда қай жерде төлем аз' },
    badge: (R, L) => t(L, 'сравнение', 'салыстыру'),
    keys: 'сравнение режимов самозанятый ип упрощенка выгоднее салыстыру',
    fields: [
      { id: 'income', type: 'money', def: 500000, label: { ru: 'Доход в месяц', kk: 'Айлық табыс' } },
      { id: 'rate', type: 'percent', def: 4, min: 2, max: 6, step: 0.5, label: { ru: 'Ставка упрощёнки в регионе', kk: 'Өңірдегі оңайлатылған мөлшерлеме' } },
      { id: 'declared', type: 'money', def: 85000, adv: true, label: { ru: 'Заявленный доход ИП для взносов', kk: 'Жарналар үшін ЖК-нің мәлімделген табысы' } }
    ],
    calc(v, R, L) {
      const a = v.income, lim = R.selfEmployedLimitMRP * R.MRP, se = E.round(a * 0.04), ok = a <= lim;
      const ip = ipSelf(v.declared, 'snr', false, R), ipTax = E.round(a * v.rate / 100), ipTotal = ipTax + ip.total;
      const better = !ok ? 'ip' : (se <= ipTotal ? 'se' : 'ip');
      return {
        main: { label: t(L, 'Выгоднее', 'Тиімдірек'), value: better === 'se' ? t(L, 'Самозанятый', 'Өзін-өзі жұмыспен қамтыған') : t(L, 'ИП на упрощёнке', 'Оңайлатылған ЖК'), fmt: 'text' },
        cards: [{ label: t(L, 'Самозанятый в месяц', 'Өзін-өзі жұмыспен қамтыған, айына'), value: ok ? se : t(L, 'недоступно', 'қолжетімсіз'), fmt: ok ? 'money' : 'text' }, { label: t(L, 'ИП в месяц', 'ЖК айына'), value: ipTotal }],
        rows: [
          { head: true, label: t(L, 'Самозанятый', 'Өзін-өзі жұмыспен қамтыған') },
          { label: t(L, 'Платежи 4%', '4% төлемдер'), value: ok ? se : t(L, `доход выше ${m(lim)}`, `табыс ${m(lim)}-ден жоғары`), fmt: ok ? 'money' : 'text' },
          { head: true, label: t(L, 'ИП на упрощённой декларации', 'Оңайлатылған декларациядағы ЖК') },
          { label: t(L, `Налог ${E.pct(v.rate)}`, `Салық ${E.pct(v.rate)}`), value: ipTax },
          { label: t(L, 'Платежи за себя', 'Өзі үшін төлемдер'), value: ip.total },
          { label: t(L, 'Итого ИП', 'ЖК барлығы'), value: ipTotal, strong: true }
        ],
        steps: [t(L, `Самозанятый: ${m(a)} × 4% = ${m(se)}`, `Өзін-өзі жұмыспен қамтыған: ${m(a)} × 4% = ${m(se)}`), t(L, `ИП: ${m(a)} × ${E.pct(v.rate)} + ${m(ip.total)} за себя = ${m(ipTotal)}`, `ЖК: ${m(a)} × ${E.pct(v.rate)} + өзі үшін ${m(ip.total)} = ${m(ipTotal)}`)],
        notes: [t(L, 'Самозанятый не может нанимать работников и работает только по перечню видов деятельности. ИП даёт больше свободы, но требует отчётности 910.00.', 'Өзін-өзі жұмыспен қамтыған қызметкер жалдай алмайды және тек тізбедегі қызмет түрлерімен айналысады. ЖК көбірек еркіндік береді, бірақ 910.00 есептілігін талап етеді.')]
      };
    }
  });

  /* 14. Единый платёж */
  E.add({
    id: 'unified-payment', cat: 'business',
    title: { ru: 'Единый платёж с зарплаты', kk: 'Жалақыдан бірыңғай төлем' },
    short: { ru: 'Одна сумма вместо шести платежей и её состав', kk: 'Алты төлемнің орнына бір сома және оның құрамы' },
    badge: (R, L) => E.pct(R.unified),
    keys: 'единый платеж ефот бірыңғай төлем',
    fields: [
      { id: 'salary', type: 'money', def: 200000, label: { ru: 'Зарплата одного работника', kk: 'Бір қызметкердің жалақысы' } },
      { id: 'count', type: 'number', def: 1, min: 1, max: 1000, label: { ru: 'Работников с такой зарплатой', kk: 'Осындай жалақысы бар қызметкерлер' }, suffix: { ru: 'чел.', kk: 'адам' } }
    ],
    calc(v, R, L) {
      const fot = v.salary * v.count, total = E.round(fot * R.unified / 100), S = R.unifiedShares;
      const names = { IPN: t(L, 'ИПН', 'ЖТС'), OPV: t(L, 'ОПВ', 'МЗЖ'), OPVR: t(L, 'ОПВР', 'ЖМЗЖ'), SO: t(L, 'Соцотчисления', 'ӘА'), OOSMS: t(L, 'ООСМС', 'МӘМС аударымдары'), VOSMS: t(L, 'ВОСМС', 'МӘМСЖ') };
      const rows = Object.keys(S).map(k => ({ label: `${names[k]} — ${E.pct(S[k])} ${t(L, 'от платежа', 'төлемнен')}`, value: E.round(total * S[k] / 100) }));
      rows.push({ label: t(L, 'Итого единый платёж', 'Барлығы бірыңғай төлем'), value: total, strong: true });
      return {
        main: { label: t(L, 'Единый платёж в месяц', 'Айлық бірыңғай төлем'), value: total },
        cards: [{ label: t(L, 'Фонд оплаты труда', 'Еңбекақы қоры'), value: fot }],
        rows,
        steps: [t(L, `${m(fot)} × ${E.pct(R.unified)} = ${m(total)}`, `${m(fot)} × ${E.pct(R.unified)} = ${m(total)}`), t(L, 'Сумма распределяется по долям, установленным на 2026 год.', 'Сома 2026 жылға белгіленген үлестер бойынша бөлінеді.')],
        notes: [t(L, 'Единый платёж могут применять не все: условия и ограничения — в ст. 822 Налогового кодекса. Срок уплаты — до 25-го числа следующего месяца.', 'Бірыңғай төлемді барлығы қолдана алмайды: шарттары мен шектеулері — Салық кодексінің 822-бабында. Төлеу мерзімі — келесі айдың 25-іне дейін.')]
      };
    }
  });

  /* 15. НДС */
  E.add({
    id: 'vat', cat: 'business', popular: true,
    title: { ru: 'НДС: начислить и выделить', kk: 'ҚҚС: есептеу және бөліп алу' },
    short: { ru: 'Сумма с НДС, без НДС и сам налог', kk: 'ҚҚС-пен, ҚҚС-сыз сома және салықтың өзі' },
    badge: (R, L) => E.pct(R.VAT),
    keys: 'ндс 16 процентов выделить начислить ққс',
    fields: [
      { id: 'mode', type: 'seg', def: 'add', label: { ru: 'Что сделать', kk: 'Не істеу керек' }, options: [{ v: 'add', ru: 'Начислить НДС', kk: 'ҚҚС есептеу' }, { v: 'extract', ru: 'Выделить НДС', kk: 'ҚҚС бөліп алу' }] },
      { id: 'amount', type: 'money', def: 100000, dec: 2, label: { ru: 'Сумма', kk: 'Сома' } },
      { id: 'rate', type: 'select', def: '16', label: { ru: 'Ставка', kk: 'Мөлшерлеме' }, options: [{ v: '16', ru: '16% — основная', kk: '16% — негізгі' }, { v: '5', ru: '5% — лекарства и медуслуги (2026)', kk: '5% — дәрілер мен медициналық қызметтер (2026)' }, { v: '0', ru: '0% — экспорт и др.', kk: '0% — экспорт және т.б.' }] }
    ],
    calc(v, R, L) {
      const r = +v.rate, a = v.amount;
      let net, vat, gross;
      if (v.mode === 'add') { net = a; vat = E.round(a * r / 100, 2); gross = E.round(a + vat, 2); }
      else { gross = a; vat = E.round(a * r / (100 + r), 2); net = E.round(a - vat, 2); }
      return {
        main: { label: t(L, 'НДС', 'ҚҚС'), value: vat, fmt: 'money2' },
        cards: [{ label: t(L, 'Без НДС', 'ҚҚС-сыз'), value: net, fmt: 'money2' }, { label: t(L, 'С НДС', 'ҚҚС-пен'), value: gross, fmt: 'money2' }],
        rows: [{ label: t(L, 'Сумма без НДС', 'ҚҚС-сыз сома'), value: net, fmt: 'money2' }, { label: t(L, `НДС ${r}%`, `ҚҚС ${r}%`), value: vat, fmt: 'money2' }, { label: t(L, 'Сумма с НДС', 'ҚҚС-пен сома'), value: gross, fmt: 'money2', strong: true }],
        steps: [v.mode === 'add' ? t(L, `НДС = ${m(a, 2)} × ${r}% = ${m(vat, 2)}`, `ҚҚС = ${m(a, 2)} × ${r}% = ${m(vat, 2)}`) : t(L, `НДС = ${m(a, 2)} × ${r} ÷ ${100 + r} = ${m(vat, 2)}`, `ҚҚС = ${m(a, 2)} × ${r} ÷ ${100 + r} = ${m(vat, 2)}`)],
        notes: r === 5 ? [t(L, 'Льготная ставка 5% действует в 2026 году; с 2027 года — 10%.', 'Жеңілдікті 5% мөлшерлеме 2026 жылы қолданылады; 2027 жылдан — 10%.')] : []
      };
    }
  });

  /* 16. Порог НДС */
  E.add({
    id: 'vat-threshold', cat: 'business',
    title: { ru: 'Порог постановки на учёт по НДС', kk: 'ҚҚС бойынша тіркеу шегі' },
    short: { ru: 'Сколько оборота осталось до 10 000 МРП', kk: '10 000 АЕК-ке дейін қанша айналым қалды' },
    badge: (R, L) => t(L, `${E.num(R.VATthresholdMRP)} МРП`, `${E.num(R.VATthresholdMRP)} АЕК`),
    keys: 'порог ндс постановка на учет оборот ққс шегі',
    fields: [{ id: 'turnover', type: 'money', def: 30000000, label: { ru: 'Оборот с начала года', kk: 'Жыл басынан бергі айналым' } }],
    calc(v, R, L) {
      const thr = R.VATthresholdMRP * R.MRP, left = thr - v.turnover, share = v.turnover / thr * 100;
      return {
        main: { label: left >= 0 ? t(L, 'Осталось до порога', 'Шекке дейін қалды') : t(L, 'Порог превышен на', 'Шек асырылды'), value: Math.abs(left) },
        cards: [{ label: t(L, 'Порог', 'Шек'), value: thr }, { label: t(L, 'Использовано', 'Пайдаланылды'), value: share, fmt: 'pct' }],
        rows: [{ label: t(L, 'Оборот с начала года', 'Жыл басынан айналым'), value: v.turnover }, { label: t(L, 'Порог 10 000 МРП', '10 000 АЕК шегі'), value: thr }],
        steps: [t(L, `Порог = ${E.num(R.VATthresholdMRP)} × ${m(R.MRP)} = ${m(thr)}`, `Шек = ${E.num(R.VATthresholdMRP)} × ${m(R.MRP)} = ${m(thr)}`)],
        notes: [left < 0 ? t(L, 'При превышении порога нужно подать уведомление о регистрации по НДС в установленный срок.', 'Шек асқанда белгіленген мерзімде ҚҚС бойынша тіркеу туралы хабарлама беру керек.') : t(L, 'Плательщики упрощённой декларации плательщиками НДС, как правило, не являются.', 'Оңайлатылған декларация төлеушілері, әдетте, ҚҚС төлеушісі болып табылмайды.')]
      };
    }
  });

  /* 17. Дивиденды */
  E.add({
    id: 'dividends', cat: 'business',
    title: { ru: 'ИПН с дивидендов', kk: 'Дивидендтерден ЖТС' },
    short: { ru: 'Налог 5% и 15% по годовой шкале', kk: 'Жылдық шкала бойынша 5% және 15% салық' },
    badge: (R, L) => E.pct(R.dividends),
    keys: 'дивиденды тоо участник ипн дивидендтер',
    fields: [
      { id: 'amount', type: 'money', def: 5000000, label: { ru: 'Сумма дивидендов к выплате', kk: 'Төленетін дивидендтер сомасы' } },
      { id: 'prev', type: 'money', def: 0, adv: true, label: { ru: 'Дивиденды, полученные ранее в этом году', kk: 'Осы жылы бұрын алынған дивидендтер' } }
    ],
    calc(v, R, L) {
      const ip = E.ipnProgressive(v.amount, v.prev, R, R.dividends, R.dividendsHigh, R.dividendsThresholdMRP);
      return {
        main: { label: t(L, 'ИПН', 'ЖТС'), value: ip.tax },
        cards: [{ label: t(L, 'Получит участник', 'Қатысушы алады'), value: v.amount - ip.tax }],
        rows: [{ label: t(L, `По ставке ${E.pct(R.dividends)}`, `${E.pct(R.dividends)} мөлшерлемемен`), value: ip.low }, { label: t(L, `По ставке ${E.pct(R.dividendsHigh)}`, `${E.pct(R.dividendsHigh)} мөлшерлемемен`), value: ip.high }, { label: t(L, 'ИПН', 'ЖТС'), value: ip.tax, strong: true }],
        steps: [t(L, `Порог = ${E.num(R.dividendsThresholdMRP)} МРП = ${m(ip.thr)} в год`, `Шек = ${E.num(R.dividendsThresholdMRP)} АЕК = жылына ${m(ip.thr)}`), t(L, `ИПН = ${m(ip.low)} × ${E.pct(R.dividends)} + ${m(ip.high)} × ${E.pct(R.dividendsHigh)} = ${m(ip.tax)}`, `ЖТС = ${m(ip.low)} × ${E.pct(R.dividends)} + ${m(ip.high)} × ${E.pct(R.dividendsHigh)} = ${m(ip.tax)}`)],
        notes: [t(L, 'Для резидента РК — физического лица. В отдельных случаях дивиденды освобождаются от налога: проверьте условия в Налоговом кодексе.', 'ҚР резиденті — жеке тұлға үшін. Кейбір жағдайларда дивидендтер салықтан босатылады: шарттарын Салық кодексінен тексеріңіз.')]
      };
    }
  });

  /* 18. КПН */
  E.add({
    id: 'cit', cat: 'business',
    title: { ru: 'КПН для ТОО', kk: 'ЖШС үшін КТС' },
    short: { ru: 'Корпоративный подоходный налог с прибыли', kk: 'Пайдадан корпоративтік табыс салығы' },
    badge: (R, L) => E.pct(R.CIT),
    keys: 'кпн корпоративный подоходный налог тоо прибыль ктс',
    fields: [
      { id: 'profit', type: 'money', def: 10000000, label: { ru: 'Налогооблагаемый доход за год', kk: 'Жылдық салық салынатын табыс' } },
      { id: 'rate', type: 'select', def: '20', label: { ru: 'Ставка', kk: 'Мөлшерлеме' }, options: [
        { v: '20', ru: '20% — общая', kk: '20% — жалпы' }, { v: '3', ru: '3% — сельхозпроизводители', kk: '3% — ауыл шаруашылығы өндірушілері' },
        { v: '5', ru: '5% — социальная сфера (2026)', kk: '5% — әлеуметтік сала (2026)' }, { v: '6', ru: '6% — сельхозкооперативы', kk: '6% — ауыл шаруашылығы кооперативтері' },
        { v: '25', ru: '25% — банки и игорный бизнес', kk: '25% — банктер мен ойын бизнесі' }] }
    ],
    calc(v, R, L) {
      const r = +v.rate, tax = E.round(E.pos(v.profit) * r / 100);
      return {
        main: { label: t(L, 'КПН за год', 'Жылдық КТС'), value: tax },
        cards: [{ label: t(L, 'Чистая прибыль', 'Таза пайда'), value: v.profit - tax }],
        rows: [{ label: t(L, 'Налогооблагаемый доход', 'Салық салынатын табыс'), value: v.profit }, { label: t(L, 'Ставка', 'Мөлшерлеме'), value: r, fmt: 'pct' }, { label: t(L, 'КПН', 'КТС'), value: tax, strong: true }],
        steps: [t(L, `КПН = ${m(v.profit)} × ${r}% = ${m(tax)}`, `КТС = ${m(v.profit)} × ${r}% = ${m(tax)}`)],
        notes: [t(L, 'Налогооблагаемый доход — это совокупный годовой доход минус вычеты и корректировки по Налоговому кодексу, а не просто выручка.', 'Салық салынатын табыс — бұл жай түсім емес, Салық кодексі бойынша шегерімдер мен түзетулерді шегергендегі жылдық жиынтық табыс.')]
      };
    }
  });

  /* 19. Амортизация */
  E.add({
    id: 'depreciation', cat: 'business',
    title: { ru: 'Амортизация основных средств', kk: 'Негізгі құралдардың амортизациясы' },
    short: { ru: 'Налоговая по группам и бухгалтерская линейная', kk: 'Топтар бойынша салықтық және бухгалтерлік сызықтық' },
    badge: (R, L) => '10–40%',
    keys: 'амортизация основные средства износ группа норма амортизация',
    fields: [
      { id: 'mode', type: 'seg', def: 'tax', label: { ru: 'Вид', kk: 'Түрі' }, options: [{ v: 'tax', ru: 'Налоговая', kk: 'Салықтық' }, { v: 'acc', ru: 'Бухгалтерская', kk: 'Бухгалтерлік' }] },
      { id: 'group', type: 'select', def: 'II', when: v => v.mode === 'tax', label: { ru: 'Группа', kk: 'Топ' }, options: [
        { v: 'I', ru: 'I — здания, сооружения (до 10%)', kk: 'I — ғимараттар, құрылыстар (10%-ға дейін)' }, { v: 'II', ru: 'II — машины и оборудование (до 25%)', kk: 'II — машиналар мен жабдықтар (25%-ға дейін)' },
        { v: 'III', ru: 'III — компьютеры и ПО (до 40%)', kk: 'III — компьютерлер мен БҚ (40%-ға дейін)' }, { v: 'IV', ru: 'IV — прочие (до 15%)', kk: 'IV — басқалары (15%-ға дейін)' }] },
      { id: 'balance', type: 'money', def: 5000000, when: v => v.mode === 'tax', label: { ru: 'Стоимостный баланс группы на начало года', kk: 'Жыл басындағы топтың құндық балансы' } },
      { id: 'rate', type: 'percent', def: 25, min: 0, max: 40, when: v => v.mode === 'tax', label: { ru: 'Ваша норма (не выше предельной)', kk: 'Сіздің нормаңыз (шектіден аспайды)' } },
      { id: 'cost', type: 'money', def: 5000000, when: v => v.mode === 'acc', label: { ru: 'Первоначальная стоимость', kk: 'Бастапқы құн' } },
      { id: 'salvage', type: 'money', def: 0, when: v => v.mode === 'acc', label: { ru: 'Ликвидационная стоимость', kk: 'Жою құны' } },
      { id: 'years', type: 'number', def: 5, min: 1, max: 100, when: v => v.mode === 'acc', label: { ru: 'Срок полезного использования', kk: 'Пайдалы пайдалану мерзімі' }, suffix: { ru: 'лет', kk: 'жыл' } }
    ],
    calc(v, R, L) {
      if (v.mode === 'tax') {
        const max = R.depreciation[v.group], r = Math.min(v.rate, max), am = E.round(v.balance * r / 100), notes = [];
        if (v.rate > max) notes.push(t(L, `Норма снижена до предельной ${max}% для группы ${v.group}.`, `Норма ${v.group} тобы үшін шекті ${max}%-ға дейін төмендетілді.`));
        return {
          main: { label: t(L, 'Амортизация за год', 'Жылдық амортизация'), value: am },
          cards: [{ label: t(L, 'Остаток баланса', 'Баланс қалдығы'), value: v.balance - am }, { label: t(L, 'Норма', 'Норма'), value: r, fmt: 'pct' }],
          rows: [{ label: t(L, 'Баланс на начало года', 'Жыл басындағы баланс'), value: v.balance }, { label: t(L, 'Предельная норма', 'Шекті норма'), value: max, fmt: 'pct' }, { label: t(L, 'Амортизация', 'Амортизация'), value: am, strong: true }],
          steps: [t(L, `${m(v.balance)} × ${E.pct(r)} = ${m(am)}`, `${m(v.balance)} × ${E.pct(r)} = ${m(am)}`)], notes
        };
      }
      const y = E.pos((v.cost - v.salvage) / v.years);
      return {
        main: { label: t(L, 'Амортизация за год', 'Жылдық амортизация'), value: y, fmt: 'money2' },
        cards: [{ label: t(L, 'В месяц', 'Айына'), value: y / 12, fmt: 'money2' }, { label: t(L, 'Норма в год', 'Жылдық норма'), value: v.cost ? y / v.cost * 100 : 0, fmt: 'pct' }],
        rows: [{ label: t(L, 'Амортизируемая стоимость', 'Амортизацияланатын құн'), value: v.cost - v.salvage }, { label: t(L, 'Срок', 'Мерзім'), value: v.years, fmt: 'num' }, { label: t(L, 'В год', 'Жылына'), value: y, fmt: 'money2', strong: true }],
        steps: [t(L, `(${m(v.cost)} − ${m(v.salvage)}) ÷ ${v.years} = ${m(y, 2)} в год`, `(${m(v.cost)} − ${m(v.salvage)}) ÷ ${v.years} = жылына ${m(y, 2)}`)], notes: []
      };
    }
  });

  /* 20. Пеня по налогам */
  E.add({
    id: 'tax-penalty', cat: 'business', popular: true,
    title: { ru: 'Пеня по налогам', kk: 'Салық бойынша өсімпұл' },
    short: { ru: 'Пеня за каждый день просрочки по базовой ставке', kk: 'Базалық мөлшерлеме бойынша әр мерзімі өткен күнге өсімпұл' },
    badge: (R, L) => t(L, `базовая × ${E.num(R.penaltyMult, 2)}`, `базалық × ${E.num(R.penaltyMult, 2)}`),
    keys: 'пеня просрочка налог базовая ставка өсімпұл',
    fields: [
      { id: 'debt', type: 'money', def: 100000, dec: 2, label: { ru: 'Сумма недоимки', kk: 'Бересі сомасы' } },
      { id: 'due', type: 'date', def: '2026-10-25', label: { ru: 'Последний день срока уплаты', kk: 'Төлеу мерзімінің соңғы күні' } },
      { id: 'paid', type: 'date', def: 'today', label: { ru: 'Дата уплаты', kk: 'Төлеген күн' } },
      { id: 'base', type: 'percent', def: 'base', min: 0, max: 100, step: 0.25, label: { ru: 'Базовая ставка НБРК, % годовых', kk: 'ҚРҰБ базалық мөлшерлемесі, жылдық %' } }
    ],
    calc(v, R, L) {
      const a = E.parseDate(v.due), b = E.parseDate(v.paid);
      if (!a || !b) return { error: t(L, 'Укажите обе даты', 'Екі күнді де көрсетіңіз') };
      const days = E.pos(E.daysBetween(a, b)), daily = v.base * R.penaltyMult / 100 / R.penaltyDaysInYear, pen = E.round(v.debt * daily * days, 2);
      return {
        main: { label: t(L, 'Пеня', 'Өсімпұл'), value: pen, fmt: 'money2' },
        cards: [{ label: t(L, 'Дней просрочки', 'Мерзімі өткен күн'), value: days, fmt: 'num' }, { label: t(L, 'Всего к оплате', 'Барлығы төлеуге'), value: v.debt + pen, fmt: 'money2' }],
        rows: [{ label: t(L, 'Недоимка', 'Бересі'), value: v.debt, fmt: 'money2' }, { label: t(L, 'Ставка пени в год', 'Жылдық өсімпұл мөлшерлемесі'), value: v.base * R.penaltyMult, fmt: 'pct' }, { label: t(L, 'Дней', 'Күн'), value: days, fmt: 'num' }, { label: t(L, 'Пеня', 'Өсімпұл'), value: pen, fmt: 'money2', strong: true }],
        steps: [t(L, `Дни: со дня после ${E.fmtDate(a, L)} по ${E.fmtDate(b, L)} включительно = ${days}`, `Күндер: ${E.fmtDate(a, L)} кейінгі күннен ${E.fmtDate(b, L)} қоса алғанда = ${days}`), t(L, `Пеня = ${m(v.debt, 2)} × ${E.num(v.base, 2)}% × ${E.num(R.penaltyMult, 2)} ÷ ${R.penaltyDaysInYear} × ${days} = ${m(pen, 2)}`, `Өсімпұл = ${m(v.debt, 2)} × ${E.num(v.base, 2)}% × ${E.num(R.penaltyMult, 2)} ÷ ${R.penaltyDaysInYear} × ${days} = ${m(pen, 2)}`)],
        notes: [t(L, 'Если базовая ставка менялась внутри периода, посчитайте каждый отрезок отдельно и сложите.', 'Егер базалық мөлшерлеме кезең ішінде өзгерсе, әр бөлікті бөлек есептеп, қосыңыз.')]
      };
    }
  });

  /* 21. Неустойка */
  E.add({
    id: 'contract-penalty', cat: 'legal',
    title: { ru: 'Неустойка по договору', kk: 'Шарт бойынша тұрақсыздық айыбы' },
    short: { ru: 'Пеня по договору или проценты по ст. 353 ГК', kk: 'Шарт бойынша өсімпұл немесе АК 353-бабы бойынша сыйақы' },
    badge: (R, L) => t(L, '% в день', 'күніне %'),
    keys: 'неустойка пеня договор просрочка ст 353 гк проценты тұрақсыздық айыбы',
    fields: [
      { id: 'mode', type: 'seg', def: 'contract', label: { ru: 'Как считать', kk: 'Қалай есептеу' }, options: [{ v: 'contract', ru: '% в день по договору', kk: 'Шарт бойынша күніне %' }, { v: 'gk', ru: 'Базовая ставка (ст. 353 ГК)', kk: 'Базалық мөлшерлеме (АК 353-бабы)' }] },
      { id: 'debt', type: 'money', def: 1000000, dec: 2, label: { ru: 'Сумма долга', kk: 'Қарыз сомасы' } },
      { id: 'from', type: 'date', def: '2026-10-01', label: { ru: 'Срок исполнения по договору', kk: 'Шарт бойынша орындау мерзімі' } },
      { id: 'to', type: 'date', def: 'today', label: { ru: 'Дата оплаты или расчёта', kk: 'Төлеу немесе есептеу күні' } },
      { id: 'day', type: 'percent', def: 0.1, min: 0, max: 10, step: 0.01, when: v => v.mode === 'contract', label: { ru: 'Неустойка в день', kk: 'Күніне тұрақсыздық айыбы' } },
      { id: 'cap', type: 'percent', def: 0, min: 0, max: 100, when: v => v.mode === 'contract', label: { ru: 'Ограничение от суммы долга (0 — нет)', kk: 'Қарыз сомасынан шектеу (0 — жоқ)' } },
      { id: 'base', type: 'percent', def: 'base', min: 0, max: 100, step: 0.25, when: v => v.mode === 'gk', label: { ru: 'Базовая ставка НБРК, % годовых', kk: 'ҚРҰБ базалық мөлшерлемесі, жылдық %' } }
    ],
    calc(v, R, L) {
      const a = E.parseDate(v.from), b = E.parseDate(v.to);
      if (!a || !b) return { error: t(L, 'Укажите обе даты', 'Екі күнді де көрсетіңіз') };
      const days = E.pos(E.daysBetween(a, b));
      let pen, step, capped = false;
      if (v.mode === 'contract') {
        pen = v.debt * v.day / 100 * days;
        if (v.cap > 0 && pen > v.debt * v.cap / 100) { pen = v.debt * v.cap / 100; capped = true; }
        step = t(L, `${m(v.debt, 2)} × ${E.num(v.day, 2)}% × ${days} дн.${capped ? `, но не больше ${E.pct(v.cap)} долга` : ''}`, `${m(v.debt, 2)} × ${E.num(v.day, 2)}% × ${days} күн${capped ? `, бірақ қарыздың ${E.pct(v.cap)}-нан аспайды` : ''}`);
      } else {
        pen = v.debt * v.base / 100 * days / 365;
        step = t(L, `${m(v.debt, 2)} × ${E.num(v.base, 2)}% × ${days} ÷ 365`, `${m(v.debt, 2)} × ${E.num(v.base, 2)}% × ${days} ÷ 365`);
      }
      pen = E.round(pen, 2);
      return {
        main: { label: v.mode === 'gk' ? t(L, 'Проценты за просрочку', 'Мерзімі өткені үшін сыйақы') : t(L, 'Неустойка', 'Тұрақсыздық айыбы'), value: pen, fmt: 'money2' },
        cards: [{ label: t(L, 'Дней просрочки', 'Мерзімі өткен күн'), value: days, fmt: 'num' }, { label: t(L, 'Долг с неустойкой', 'Айыбымен қарыз'), value: v.debt + pen, fmt: 'money2' }],
        rows: [{ label: t(L, 'Долг', 'Қарыз'), value: v.debt, fmt: 'money2' }, { label: t(L, 'Дней', 'Күн'), value: days, fmt: 'num' }, { label: t(L, 'Сумма', 'Сома'), value: pen, fmt: 'money2', strong: true }],
        steps: [step + ` = ${m(pen, 2)}`],
        notes: [t(L, 'Суд вправе уменьшить явно несоразмерную неустойку. Проценты по ст. 353 ГК применяются, если договором не установлено иное.', 'Сот анық сәйкессіз тұрақсыздық айыбын азайтуға құқылы. АК 353-бабы бойынша сыйақы, егер шартта өзгеше белгіленбесе, қолданылады.')]
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Имущество и авто */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;

  /* 22. Налог на транспорт */
  E.add({
    id: 'vehicle-tax', cat: 'auto', popular: true,
    title: { ru: 'Налог на транспорт', kk: 'Көлік салығы' },
    short: { ru: 'Годовой налог на авто с учётом возраста машины', kk: 'Көліктің жасын ескере отырып жылдық салық' },
    badge: (R, L) => t(L, 'от 1 МРП', '1 АЕК-тен'),
    keys: 'транспортный налог машина авто объем двигателя көлік салығы',
    fields: [
      { id: 'type', type: 'select', def: 'car', label: { ru: 'Транспорт', kk: 'Көлік түрі' }, options: [
        { v: 'car', ru: 'Легковой автомобиль', kk: 'Жеңіл автомобиль' }, { v: 'truck', ru: 'Грузовой автомобиль', kk: 'Жүк автомобилі' },
        { v: 'bus', ru: 'Автобус', kk: 'Автобус' }, { v: 'moto', ru: 'Мотоцикл (до 55 кВт)', kk: 'Мотоцикл (55 кВт-қа дейін)' }] },
      { id: 'cc', type: 'number', def: 1600, min: 0, max: 20000, when: v => v.type === 'car', label: { ru: 'Объём двигателя', kk: 'Қозғалтқыш көлемі' }, suffix: { ru: 'см³', kk: 'см³' } },
      { id: 'made', type: 'number', def: 2015, min: 1950, max: 2100, when: v => v.type === 'car', label: { ru: 'Год выпуска', kk: 'Шығарылған жылы' } },
      { id: 'tons', type: 'select', def: '1.5', when: v => v.type === 'truck', label: { ru: 'Грузоподъёмность', kk: 'Жүк көтергіштігі' }, options: [
        { v: '1', ru: 'до 1 т', kk: '1 т дейін' }, { v: '1.5', ru: 'свыше 1 до 1,5 т', kk: '1-ден 1,5 т-ға дейін' }, { v: '5', ru: 'свыше 1,5 до 5 т', kk: '1,5-тен 5 т-ға дейін' }, { v: '99', ru: 'свыше 5 т', kk: '5 т-дан жоғары' }] },
      { id: 'seats', type: 'select', def: '12', when: v => v.type === 'bus', label: { ru: 'Посадочных мест', kk: 'Отыратын орындар' }, options: [
        { v: '12', ru: 'до 12', kk: '12-ге дейін' }, { v: '25', ru: 'свыше 12 до 25', kk: '12-ден 25-ке дейін' }, { v: '99', ru: 'свыше 25', kk: '25-тен жоғары' }] },
      { id: 'months', type: 'number', def: 12, min: 1, max: 12, label: { ru: 'Месяцев владения в году', kk: 'Жылдағы иелену айлары' }, suffix: { ru: 'мес.', kk: 'ай' } }
    ],
    calc(v, R, L) {
      let mrp = 0, extra = 0, k = 1; const steps = [];
      if (v.type === 'car') {
        const band = R.vehicleCars.find(b => v.cc <= b.upTo);
        mrp = band.mrp; extra = band.from ? E.pos(v.cc - band.from) * R.vehiclePerCC : 0;
        const age = R.year - v.made;
        const c = R.vehicleAgeCoef.find(x => age >= x.from && age <= x.to); if (c) k = c.k;
        steps.push(t(L, `Ставка для ${E.num(v.cc)} см³ = ${mrp} МРП = ${m(mrp * R.MRP)}`, `${E.num(v.cc)} см³ үшін мөлшерлеме = ${mrp} АЕК = ${m(mrp * R.MRP)}`));
        if (extra) steps.push(t(L, `Доплата: (${E.num(v.cc)} − ${E.num(band.from)}) × ${R.vehiclePerCC} ₸ = ${m(extra)}`, `Қосымша: (${E.num(v.cc)} − ${E.num(band.from)}) × ${R.vehiclePerCC} ₸ = ${m(extra)}`));
        steps.push(t(L, `Возраст ${age} ${E.plural(age, 'год', 'года', 'лет')} → коэффициент ${E.num(k, 1)}`,`Жасы ${age} жыл → коэффициент ${E.num(k, 1)}`));
      } else if (v.type === 'truck') { mrp = R.vehicleTrucks.find(b => +v.tons <= b.upTo).mrp; steps.push(t(L, `Ставка = ${mrp} МРП`, `Мөлшерлеме = ${mrp} АЕК`)); }
      else if (v.type === 'bus') { mrp = R.vehicleBuses.find(b => +v.seats <= b.upTo).mrp; steps.push(t(L, `Ставка = ${mrp} МРП`, `Мөлшерлеме = ${mrp} АЕК`)); }
      else { mrp = R.vehicleMotoMRP; steps.push(t(L, `Ставка = ${mrp} МРП`, `Мөлшерлеме = ${mrp} АЕК`)); }
      const year = E.round((mrp * R.MRP + extra) * k), tax = E.round(year * v.months / 12);
      steps.push(t(L, `Налог = (${m(mrp * R.MRP)} + ${m(extra)}) × ${E.num(k, 1)} × ${v.months}/12 = ${m(tax)}`, `Салық = (${m(mrp * R.MRP)} + ${m(extra)}) × ${E.num(k, 1)} × ${v.months}/12 = ${m(tax)}`));
      return {
        main: { label: t(L, `Налог за ${R.year} год`, `${R.year} жылғы салық`), value: tax },
        cards: [{ label: t(L, 'Ставка', 'Мөлшерлеме'), value: t(L, `${mrp} МРП`, `${mrp} АЕК`), fmt: 'text' }, { label: t(L, 'Коэффициент возраста', 'Жас коэффициенті'), value: E.num(k, 1), fmt: 'text' }],
        rows: [{ label: t(L, 'Ставка в тенге', 'Теңгедегі мөлшерлеме'), value: mrp * R.MRP }, { label: t(L, 'Доплата за объём', 'Көлем үшін қосымша'), value: extra }, { label: t(L, 'Коэффициент', 'Коэффициент'), value: k, fmt: 'num1' }, { label: t(L, 'Налог', 'Салық'), value: tax, strong: true }],
        steps,
        notes: [t(L, `Физлица платят налог за ${R.year} год до 1 апреля ${R.year + 1} года по уведомлению. Возраст считается по году выпуска; в пограничных случаях (ровно 10 или 20 лет) уточните в КГД.`, `Жеке тұлғалар ${R.year} жылғы салықты ${R.year + 1} жылғы 1 сәуірге дейін хабарлама бойынша төлейді. Жасы шығарылған жылы бойынша есептеледі; шекаралық жағдайларда (дәл 10 немесе 20 жыл) МКК-дан нақтылаңыз.`)]
      };
    }
  });

  /* 23. Налог на имущество */
  E.add({
    id: 'property-tax', cat: 'property',
    title: { ru: 'Налог на имущество физлиц', kk: 'Жеке тұлғалардың мүлік салығы' },
    short: { ru: 'Налог на квартиру или дом по прогрессивной шкале', kk: 'Прогрессивті шкала бойынша пәтер немесе үй салығы' },
    badge: (R, L) => '0,05%+',
    keys: 'налог на имущество квартира дом недвижимость мүлік салығы',
    fields: [{ id: 'value', type: 'money', def: 15000000, label: { ru: 'Стоимость объекта для налогообложения', kk: 'Салық салу үшін объектінің құны' }, hint: { ru: 'Это стоимость, которую определяет государство (указана в уведомлении), а не рыночная цена.', kk: 'Бұл нарықтық баға емес, мемлекет белгілейтін құн (хабарламада көрсетілген).' } }],
    calc(v, R, L) {
      const sc = R.propertyScale; let row = sc[0];
      for (const r of sc) if (v.value > r[0]) row = r;
      const tax = E.round(row[1] + E.pos(v.value - row[0]) * row[2] / 100);
      return {
        main: { label: t(L, 'Налог за год', 'Жылдық салық'), value: tax },
        cards: [{ label: t(L, 'Ставка сверх порога', 'Шектен асқан мөлшерлеме'), value: row[2], fmt: 'pct' }],
        rows: [{ label: t(L, 'Стоимость', 'Құны'), value: v.value }, { label: t(L, 'Порог ступени', 'Саты шегі'), value: row[0] }, { label: t(L, 'Фиксированная часть', 'Тұрақты бөлік'), value: row[1] }, { label: t(L, 'Налог', 'Салық'), value: tax, strong: true }],
        steps: [t(L, `${m(row[1])} + (${m(v.value)} − ${m(row[0])}) × ${E.num(row[2], 2)}% = ${m(tax)}`, `${m(row[1])} + (${m(v.value)} − ${m(row[0])}) × ${E.num(row[2], 2)}% = ${m(tax)}`)],
        notes: [t(L, `Налог за ${R.year} год уплачивается до 1 октября ${R.year + 1} года. Если объектов несколько и их общая стоимость выше 450 млн ₸, применяется особый порядок.`, `${R.year} жылғы салық ${R.year + 1} жылғы 1 қазанға дейін төленеді. Объектілер бірнешеу болып, жалпы құны 450 млн ₸-ден жоғары болса, ерекше тәртіп қолданылады.`)]
      };
    }
  });

  /* 24. Налог при продаже жилья */
  E.add({
    id: 'property-sale-tax', cat: 'property',
    title: { ru: 'Налог при продаже жилья', kk: 'Тұрғын үйді сатқандағы салық' },
    short: { ru: 'ИПН с прироста стоимости и срок для освобождения', kk: 'Құн өсімінен ЖТС және босату мерзімі' },
    badge: (R, L) => '10%',
    keys: 'продажа квартиры налог прирост стоимости 270 имущественный доход пәтер сату',
    fields: [
      { id: 'buy', type: 'money', def: 25000000, label: { ru: 'Цена покупки', kk: 'Сатып алу бағасы' } },
      { id: 'sell', type: 'money', def: 30000000, label: { ru: 'Цена продажи', kk: 'Сату бағасы' } },
      { id: 'from', type: 'date', def: '2025-06-01', label: { ru: 'Дата регистрации права собственности', kk: 'Меншік құқығын тіркеген күн' } },
      { id: 'to', type: 'date', def: 'today', label: { ru: 'Дата продажи', kk: 'Сату күні' } }
    ],
    calc(v, R, L) {
      const a = E.parseDate(v.from), b = E.parseDate(v.to);
      if (!a || !b || b < a) return { error: t(L, 'Проверьте даты', 'Күндерді тексеріңіз') };
      const need = a >= Date.UTC(2026, 0, 1) ? R.saleExemptYearsFrom2026 : R.saleExemptYearsBefore2026;
      const limit = new Date(Date.UTC(a.getUTCFullYear() + need, a.getUTCMonth(), a.getUTCDate()));
      const exempt = b >= limit, gain = E.pos(v.sell - v.buy);
      const ip = E.ipnProgressive(gain, 0, R), tax = exempt ? 0 : ip.tax;
      return {
        main: { label: t(L, 'ИПН', 'ЖТС'), value: tax },
        cards: [{ label: t(L, 'Прирост стоимости', 'Құн өсімі'), value: gain }, { label: t(L, 'Освобождение', 'Босату'), value: exempt ? t(L, 'да', 'иә') : t(L, 'нет', 'жоқ'), fmt: 'text' }],
        rows: [{ label: t(L, 'Срок владения для освобождения', 'Босату үшін иелену мерзімі'), value: t(L, `${need} ${E.plural(need, 'год', 'года', 'лет')}`, `${need} жыл`), fmt: 'text' }, { label: t(L, 'Без налога можно продать с', 'Салықсыз сатуға болады'), value: E.fmtDate(limit, L), fmt: 'text' }, { label: t(L, 'Налог', 'Салық'), value: tax, strong: true }],
        steps: exempt ? [t(L, `Владение с ${E.fmtDate(a, L)} дольше ${need} ${E.plural(need, 'года', 'лет', 'лет')} — доход от продажи не облагается.`, `${E.fmtDate(a, L)} бастап иелену ${need} жылдан ұзақ — сатудан түскен табысқа салық салынбайды.`)]
          : [t(L, `Прирост = ${m(v.sell)} − ${m(v.buy)} = ${m(gain)}`, `Өсім = ${m(v.sell)} − ${m(v.buy)} = ${m(gain)}`), t(L, `ИПН = ${m(ip.low)} × 10%${ip.high ? ` + ${m(ip.high)} × 15%` : ''} = ${m(tax)}`, `ЖТС = ${m(ip.low)} × 10%${ip.high ? ` + ${m(ip.high)} × 15%` : ''} = ${m(tax)}`)],
        notes: [t(L, 'Для жилья, зарегистрированного с 1 января 2026 года, срок для освобождения — 2 года, до этой даты — 1 год. Декларация 270.00 — до 15 сентября следующего года, уплата — до 25 сентября. Расчёт для одного объекта жилья; прочие случаи уточняйте.', '2026 жылғы 1 қаңтардан бастап тіркелген тұрғын үй үшін босату мерзімі — 2 жыл, бұл күнге дейін — 1 жыл. 270.00 декларациясы — келесі жылғы 15 қыркүйекке дейін, төлеу — 25 қыркүйекке дейін. Есеп бір тұрғын үй объектісі үшін; басқа жағдайларды нақтылаңыз.')]
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Кредиты и финансы */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;

  /* 25. Кредит */
  E.add({
    id: 'credit', cat: 'finance', popular: true,
    title: { ru: 'Кредитный калькулятор', kk: 'Несие калькуляторы' },
    short: { ru: 'Ежемесячный платёж, переплата и график', kk: 'Ай сайынғы төлем, артық төлем және кесте' },
    badge: (R, L) => t(L, 'график', 'кесте'),
    keys: 'кредит ипотека аннуитет дифференцированный платеж переплата несие',
    fields: [
      { id: 'sum', type: 'money', def: 3000000, label: { ru: 'Сумма кредита', kk: 'Несие сомасы' } },
      { id: 'rate', type: 'percent', def: 20, min: 0, max: 100, step: 0.1, label: { ru: 'Ставка, % годовых', kk: 'Мөлшерлеме, жылдық %' } },
      { id: 'months', type: 'number', def: 36, min: 1, max: 360, label: { ru: 'Срок', kk: 'Мерзімі' }, suffix: { ru: 'мес.', kk: 'ай' } },
      { id: 'kind', type: 'seg', def: 'ann', label: { ru: 'Способ погашения', kk: 'Өтеу тәсілі' }, options: [{ v: 'ann', ru: 'Аннуитетный', kk: 'Аннуитеттік' }, { v: 'diff', ru: 'Дифференцированный', kk: 'Сараланған' }] }
    ],
    calc(v, R, L) {
      const S = v.sum, n = Math.round(v.months), i = v.rate / 1200;
      if (!(S > 0 && n > 0)) return { error: t(L, 'Введите сумму и срок', 'Сома мен мерзімді енгізіңіз') };
      const rows = []; let bal = S, total = 0, first = 0, last = 0;
      const ann = i === 0 ? S / n : S * i / (1 - Math.pow(1 + i, -n));
      for (let k = 1; k <= n; k++) {
        const int = bal * i, princ = v.kind === 'ann' ? (k === n ? bal : ann - int) : S / n, pay = princ + int;
        bal = E.pos(bal - princ); total += pay; if (k === 1) first = pay; last = pay;
        rows.push([k, pay, princ, int, bal]);
      }
      const over = total - S;
      return {
        main: { label: v.kind === 'ann' ? t(L, 'Ежемесячный платёж', 'Ай сайынғы төлем') : t(L, 'Первый платёж', 'Бірінші төлем'), value: first, fmt: 'money2' },
        cards: [{ label: t(L, 'Переплата', 'Артық төлем'), value: over, fmt: 'money2' }, { label: t(L, 'Всего выплат', 'Барлық төлем'), value: total, fmt: 'money2' }],
        rows: [{ label: t(L, 'Сумма кредита', 'Несие сомасы'), value: S }, { label: t(L, 'Проценты за весь срок', 'Бүкіл мерзімге сыйақы'), value: over, fmt: 'money2' }, v.kind === 'diff' ? { label: t(L, 'Последний платёж', 'Соңғы төлем'), value: last, fmt: 'money2' } : null, { label: t(L, 'Всего вернуть', 'Барлығы қайтару'), value: total, fmt: 'money2', strong: true }].filter(Boolean),
        steps: v.kind === 'ann'
          ? [t(L, `Месячная ставка = ${E.num(v.rate, 2)}% ÷ 12 = ${E.num(i * 100, 4)}%`, `Айлық мөлшерлеме = ${E.num(v.rate, 2)}% ÷ 12 = ${E.num(i * 100, 4)}%`), t(L, `Платёж = ${m(S)} × i ÷ (1 − (1 + i)^−${n}) = ${m(ann, 2)}`, `Төлем = ${m(S)} × i ÷ (1 − (1 + i)^−${n}) = ${m(ann, 2)}`)]
          : [t(L, `Основной долг каждый месяц = ${m(S)} ÷ ${n} = ${m(S / n, 2)}; проценты — на остаток долга`, `Ай сайынғы негізгі қарыз = ${m(S)} ÷ ${n} = ${m(S / n, 2)}; сыйақы — қарыз қалдығына`)],
        table: { title: t(L, 'График платежей', 'Төлем кестесі'), head: [t(L, '№', '№'), t(L, 'Платёж', 'Төлем'), t(L, 'Основной долг', 'Негізгі қарыз'), t(L, 'Проценты', 'Сыйақы'), t(L, 'Остаток', 'Қалдық')], fmt: ['int', 'money2', 'money2', 'money2', 'money2'], rows },
        notes: [t(L, 'Расчёт без комиссий и страховок. Реальную полную стоимость кредита (ГЭСВ) банк обязан указать в договоре.', 'Есеп комиссиялар мен сақтандырусыз. Несиенің нақты толық құнын (ЖТСМ) банк шартта көрсетуге міндетті.')]
      };
    }
  });

  /* 26. Депозит */
  E.add({
    id: 'deposit', cat: 'finance',
    title: { ru: 'Депозит', kk: 'Депозит' },
    short: { ru: 'Доход по вкладу с капитализацией и пополнениями', kk: 'Капиталдандыру және толықтырумен салым табысы' },
    badge: (R, L) => t(L, 'капитализация', 'капиталдандыру'),
    keys: 'депозит вклад капитализация пополнение доход салым',
    fields: [
      { id: 'sum', type: 'money', def: 1000000, label: { ru: 'Сумма вклада', kk: 'Салым сомасы' } },
      { id: 'rate', type: 'percent', def: 14, min: 0, max: 100, step: 0.1, label: { ru: 'Ставка, % годовых', kk: 'Мөлшерлеме, жылдық %' } },
      { id: 'months', type: 'number', def: 12, min: 1, max: 360, label: { ru: 'Срок', kk: 'Мерзімі' }, suffix: { ru: 'мес.', kk: 'ай' } },
      { id: 'cap', type: 'check', def: true, label: { ru: 'Ежемесячная капитализация', kk: 'Ай сайынғы капиталдандыру' } },
      { id: 'add', type: 'money', def: 0, label: { ru: 'Пополнение каждый месяц', kk: 'Ай сайын толықтыру' } }
    ],
    calc(v, R, L) {
      const i = v.rate / 1200, n = Math.round(v.months); let bal = v.sum, interest = 0, paidIn = v.sum; const rows = [];
      for (let k = 1; k <= n; k++) {
        const inc = bal * i; interest += inc; if (v.cap) bal += inc;
        if (k < n && v.add > 0) { bal += v.add; paidIn += v.add; }
        rows.push([k, inc, v.cap ? bal : bal + interest]);
      }
      const end = v.cap ? bal : bal + interest;
      return {
        main: { label: t(L, 'Доход', 'Табыс'), value: interest, fmt: 'money2' },
        cards: [{ label: t(L, 'В конце срока', 'Мерзім соңында'), value: end, fmt: 'money2' }, { label: t(L, 'Вложено', 'Салынды'), value: paidIn }],
        rows: [{ label: t(L, 'Вложено своих денег', 'Өз ақшасы салынды'), value: paidIn }, { label: t(L, 'Начислено процентов', 'Сыйақы есептелді'), value: interest, fmt: 'money2' }, { label: t(L, 'Итого', 'Барлығы'), value: end, fmt: 'money2', strong: true }],
        steps: [t(L, `Каждый месяц: остаток × ${E.num(v.rate, 2)}% ÷ 12${v.cap ? ', проценты прибавляются к вкладу' : ''}`, `Ай сайын: қалдық × ${E.num(v.rate, 2)}% ÷ 12${v.cap ? ', сыйақы салымға қосылады' : ''}`)],
        table: { title: t(L, 'По месяцам', 'Айлар бойынша'), head: [t(L, 'Месяц', 'Ай'), t(L, 'Проценты', 'Сыйақы'), t(L, 'Сумма', 'Сома')], fmt: ['int', 'money2', 'money2'], rows },
        notes: [t(L, 'Упрощённая модель: банк может начислять проценты по дням и иначе учитывать пополнения. Налоги не учтены.', 'Жеңілдетілген модель: банк сыйақыны күн бойынша есептеп, толықтыруды басқаша ескеруі мүмкін. Салықтар ескерілмеген.')]
      };
    }
  });

  /* 27. Наценка и маржа */
  E.add({
    id: 'margin', cat: 'finance',
    title: { ru: 'Наценка и маржа', kk: 'Үстеме баға және маржа' },
    short: { ru: 'Цена продажи, наценка, маржа и прибыль', kk: 'Сату бағасы, үстеме, маржа және пайда' },
    badge: (R, L) => '%',
    keys: 'наценка маржа маржинальность цена себестоимость үстеме баға',
    fields: [
      { id: 'mode', type: 'seg', def: 'price', label: { ru: 'Что известно', kk: 'Не белгілі' }, options: [{ v: 'price', ru: 'Цена продажи', kk: 'Сату бағасы' }, { v: 'markup', ru: 'Наценка, %', kk: 'Үстеме, %' }, { v: 'margin', ru: 'Маржа, %', kk: 'Маржа, %' }] },
      { id: 'cost', type: 'money', def: 1000, dec: 2, label: { ru: 'Себестоимость (закупка)', kk: 'Өзіндік құн (сатып алу)' } },
      { id: 'price', type: 'money', def: 1500, dec: 2, when: v => v.mode === 'price', label: { ru: 'Цена продажи', kk: 'Сату бағасы' } },
      { id: 'pct', type: 'percent', def: 30, min: 0, max: 1000, step: 0.1, when: v => v.mode !== 'price', label: { ru: 'Процент', kk: 'Пайыз' } }
    ],
    calc(v, R, L) {
      const c = v.cost; let p;
      if (v.mode === 'price') p = v.price; else if (v.mode === 'markup') p = c * (1 + v.pct / 100);
      else { if (v.pct >= 100) return { error: t(L, 'Маржа должна быть меньше 100%', 'Маржа 100%-дан аз болуы керек') }; p = c / (1 - v.pct / 100); }
      const profit = p - c, mk = c ? profit / c * 100 : 0, mg = p ? profit / p * 100 : 0;
      return {
        main: { label: v.mode === 'price' ? t(L, 'Прибыль с единицы', 'Бірліктен пайда') : t(L, 'Цена продажи', 'Сату бағасы'), value: v.mode === 'price' ? profit : p, fmt: 'money2' },
        cards: [{ label: t(L, 'Наценка', 'Үстеме'), value: mk, fmt: 'pct' }, { label: t(L, 'Маржа', 'Маржа'), value: mg, fmt: 'pct' }],
        rows: [{ label: t(L, 'Себестоимость', 'Өзіндік құн'), value: c, fmt: 'money2' }, { label: t(L, 'Цена', 'Баға'), value: p, fmt: 'money2' }, { label: t(L, 'Прибыль', 'Пайда'), value: profit, fmt: 'money2', strong: true }],
        steps: [t(L, `Наценка = прибыль ÷ себестоимость = ${E.num(mk, 2)}%`, `Үстеме = пайда ÷ өзіндік құн = ${E.num(mk, 2)}%`), t(L, `Маржа = прибыль ÷ цена = ${E.num(mg, 2)}%`, `Маржа = пайда ÷ баға = ${E.num(mg, 2)}%`)],
        notes: []
      };
    }
  });

  /* 28. Точка безубыточности */
  E.add({
    id: 'breakeven', cat: 'finance',
    title: { ru: 'Точка безубыточности', kk: 'Залалсыздық нүктесі' },
    short: { ru: 'Сколько продать, чтобы покрыть расходы', kk: 'Шығынды жабу үшін қанша сату керек' },
    badge: (R, L) => t(L, 'бизнес', 'бизнес'),
    keys: 'точка безубыточности окупаемость продажи расходы залалсыздық',
    fields: [
      { id: 'fixed', type: 'money', def: 500000, label: { ru: 'Постоянные расходы в месяц', kk: 'Айлық тұрақты шығындар' }, hint: { ru: 'Аренда, зарплата, налоги за себя, связь', kk: 'Жалдау, жалақы, өзі үшін салықтар, байланыс' } },
      { id: 'price', type: 'money', def: 3000, dec: 2, label: { ru: 'Цена единицы', kk: 'Бірлік бағасы' } },
      { id: 'varc', type: 'money', def: 1800, dec: 2, label: { ru: 'Переменные расходы на единицу', kk: 'Бірлікке ауыспалы шығындар' } }
    ],
    calc(v, R, L) {
      const cm = v.price - v.varc;
      if (!(cm > 0)) return { error: t(L, 'Цена должна быть выше переменных расходов', 'Баға ауыспалы шығыннан жоғары болуы керек') };
      const q = Math.ceil(v.fixed / cm), rev = q * v.price;
      return {
        main: { label: t(L, 'Продаж в месяц', 'Айлық сату'), value: q, fmt: 'num' },
        cards: [{ label: t(L, 'Выручка', 'Түсім'), value: rev }, { label: t(L, 'Маржинальный доход с единицы', 'Бірліктен маржалық табыс'), value: cm, fmt: 'money2' }],
        rows: [{ label: t(L, 'Постоянные расходы', 'Тұрақты шығындар'), value: v.fixed }, { label: t(L, 'Маржинальный доход с единицы', 'Бірліктен маржалық табыс'), value: cm, fmt: 'money2' }, { label: t(L, 'Точка безубыточности, шт.', 'Залалсыздық нүктесі, дана'), value: q, fmt: 'num', strong: true }],
        steps: [t(L, `${m(v.fixed)} ÷ (${m(v.price, 2)} − ${m(v.varc, 2)}) = ${E.num(v.fixed / cm, 2)} → ${q} шт.`, `${m(v.fixed)} ÷ (${m(v.price, 2)} − ${m(v.varc, 2)}) = ${E.num(v.fixed / cm, 2)} → ${q} дана`)], notes: []
      };
    }
  });

  /* 29. Проценты */
  E.add({
    id: 'percent', cat: 'useful',
    title: { ru: 'Процентный калькулятор', kk: 'Пайыз калькуляторы' },
    short: { ru: 'Процент от числа, доля, изменение, прибавить или вычесть', kk: 'Саннан пайыз, үлес, өзгеріс, қосу немесе алу' },
    badge: (R, L) => '%',
    keys: 'проценты процент от числа изменение доля пайыз',
    fields: [
      { id: 'mode', type: 'select', def: 'of', label: { ru: 'Что посчитать', kk: 'Не есептеу' }, options: [
        { v: 'of', ru: 'A% от числа B', kk: 'B санының A%-ы' }, { v: 'share', ru: 'Сколько процентов A составляет от B', kk: 'A саны B-ның неше пайызы' },
        { v: 'change', ru: 'На сколько % изменилось A → B', kk: 'A → B неше %-ға өзгерді' }, { v: 'plus', ru: 'Прибавить A% к B', kk: 'B-ға A% қосу' }, { v: 'minus', ru: 'Вычесть A% из B', kk: 'B-дан A% алу' }] },
      { id: 'a', type: 'number', def: 15, step: 'any', label: { ru: 'A', kk: 'A' } },
      { id: 'b', type: 'number', def: 200000, step: 'any', label: { ru: 'B', kk: 'B' } }
    ],
    calc(v, R, L) {
      const a = v.a, b = v.b; let r, s, fmt = 'num2';
      if (v.mode === 'of') { r = b * a / 100; s = `${E.num(b, 'auto')} × ${E.num(a, 'auto')}% = ${E.num(r, 'auto')}`; }
      else if (v.mode === 'share') { if (!b) return { error: t(L, 'B не может быть 0', 'B 0 бола алмайды') }; r = a / b * 100; fmt = 'pct'; s = `${E.num(a, 'auto')} ÷ ${E.num(b, 'auto')} × 100 = ${E.num(r, 2)}%`; }
      else if (v.mode === 'change') { if (!a) return { error: t(L, 'A не может быть 0', 'A 0 бола алмайды') }; r = (b - a) / Math.abs(a) * 100; fmt = 'pct'; s = `(${E.num(b, 'auto')} − ${E.num(a, 'auto')}) ÷ ${E.num(a, 'auto')} × 100 = ${E.num(r, 2)}%`; }
      else if (v.mode === 'plus') { r = b * (1 + a / 100); s = `${E.num(b, 'auto')} × (1 + ${E.num(a, 'auto')}%) = ${E.num(r, 'auto')}`; }
      else { r = b * (1 - a / 100); s = `${E.num(b, 'auto')} × (1 − ${E.num(a, 'auto')}%) = ${E.num(r, 'auto')}`; }
      return { main: { label: t(L, 'Результат', 'Нәтиже'), value: r, fmt }, rows: [], steps: [s], notes: [] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Полезное */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;

  /* 30. МРП и МЗП */
  E.add({
    id: 'mrp', cat: 'useful', popular: true,
    title: { ru: 'МРП и МЗП в тенге', kk: 'АЕК және ЕТЖ теңгемен' },
    short: { ru: 'Перевод МРП и МЗП в тенге по годам', kk: 'АЕК пен ЕТЖ-ны жылдар бойынша теңгеге аудару' },
    badge: (R, L) => m(R.MRP),
    keys: 'мрп мзп месячный расчетный показатель минимальная зарплата аек етж',
    fields: [
      { id: 'n', type: 'number', def: 10, min: 0, step: 'any', label: { ru: 'Количество', kk: 'Саны' } },
      { id: 'unit', type: 'seg', def: 'mrp', label: { ru: 'Чего', kk: 'Неден' }, options: [{ v: 'mrp', ru: 'МРП', kk: 'АЕК' }, { v: 'mzp', ru: 'МЗП', kk: 'ЕТЖ' }] },
      { id: 'year', type: 'select', def: '2026', label: { ru: 'Год', kk: 'Жыл' }, options: 'history' }
    ],
    calc(v, R, L) {
      const h = R.history.find(x => x.y === v.year) || R.history[0], unit = v.unit === 'mzp' ? h.mzp : h.mrp, sum = E.round(v.n * unit, 2);
      return {
        main: { label: t(L, 'В тенге', 'Теңгемен'), value: sum, fmt: 'money2' },
        cards: [{ label: t(L, `1 ${v.unit === 'mzp' ? 'МЗП' : 'МРП'} в ${h.y.replace('*', '')}`, `${h.y.replace('*', '')} жылы 1 ${v.unit === 'mzp' ? 'ЕТЖ' : 'АЕК'}`), value: unit }],
        rows: [], steps: [`${E.num(v.n, 'auto')} × ${m(unit)} = ${m(sum, 'auto')}`],
        table: { title: t(L, 'МРП и МЗП по годам', 'Жылдар бойынша АЕК және ЕТЖ'), head: [t(L, 'Год', 'Жыл'), t(L, 'МРП', 'АЕК'), t(L, 'МЗП', 'ЕТЖ'), t(L, 'Примечание', 'Ескерту')], fmt: ['text', 'money', 'money', 'text'], rows: R.history.map(x => [x.y.replace('*', ''), x.mrp, x.mzp, x.note ? t(L, x.note, x.note.replace('для пособий и соцвыплат', 'жәрдемақылар мен әлеуметтік төлемдер үшін').replace('для налогов и штрафов весь 2022 год', 'салықтар мен айыппұлдар үшін 2022 жыл бойы').replace(/^с /, '')) : '']) },
        notes: [t(L, 'Для налогов берут МРП на 1 января года, за который считают налог.', 'Салықтар үшін салық есептелетін жылдың 1 қаңтарындағы АЕК алынады.')]
      };
    }
  });

  /* 31. Сумма прописью */
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
  E.add({
    id: 'number-to-words', cat: 'useful', popular: true,
    title: { ru: 'Сумма прописью', kk: 'Сома жазумен' },
    short: { ru: 'Сумма словами на русском и казахском для договоров и счетов', kk: 'Шарттар мен шоттар үшін соманы орыс және қазақ тілінде сөзбен жазу' },
    badge: (R, L) => 'RU · KZ',
    keys: 'сумма прописью словами число прописью договор счет сома жазумен',
    fields: [
      { id: 'amount', type: 'money', def: 1250500, dec: 2, label: { ru: 'Сумма', kk: 'Сома' } },
      { id: 'cur', type: 'seg', def: 'kzt', label: { ru: 'Валюта', kk: 'Валюта' }, options: [{ v: 'kzt', ru: 'Тенге', kk: 'Теңге' }, { v: 'none', ru: 'Просто число', kk: 'Жай сан' }] }
    ],
    calc(v, R, L) {
      const a = Math.abs(v.amount || 0);
      if (a >= 1e15) return { error: t(L, 'Слишком большое число', 'Сан тым үлкен') };
      const whole = Math.floor(a + 1e-9), kop = Math.round((a - whole) * 100), kz = v.cur === 'kzt';
      const tiyn = String(kop).padStart(2, '0');
      const ru = cap(E.wordsRu(whole, !kz && kop > 0)) +(kz ? ` тенге ${tiyn} тиын` : (kop ? ` ${E.plural(whole, 'целая', 'целых', 'целых')} ${E.wordsRu(kop, true)} ${E.plural(kop, 'сотая', 'сотых', 'сотых')}` : ''));
      const kk = cap(E.wordsKk(whole)) + (kz ? ` теңге ${tiyn} тиын` : (kop ? ` бүтін жүзден ${E.wordsKk(kop)}` : ''));
      return {
        main: { label: L === 'kk' ? 'Қазақша' : 'По-русски', value: L === 'kk' ? kk : ru, fmt: 'words' },
        cards: [{ label: L === 'kk' ? 'Орысша' : 'По-казахски', value: L === 'kk' ? ru : kk, fmt: 'words' }],
        rows: [], steps: [], copy: ru + '\n' + kk,
        notes: [t(L, 'Проверьте написание перед подписанием документа. Сотни на казахском пишутся с «бір» («бір жүз»), как принято в финансовых документах.', 'Құжатқа қол қоймас бұрын жазылуын тексеріңіз. Қазақша жүздіктер қаржы құжаттарындағыдай «бір» сөзімен («бір жүз») жазылады.')]
      };
    }
  });

  /* 32. Даты */
  E.add({
    id: 'date-diff', cat: 'useful',
    title: { ru: 'Дни между датами', kk: 'Күндер арасындағы айырма' },
    short: { ru: 'Сколько дней между датами или какая дата через N дней', kk: 'Күндер арасы қанша немесе N күннен кейін қай күн' },
    badge: (R, L) => t(L, 'даты', 'күндер'),
    keys: 'дни между датами срок дата прибавить дней күндер',
    fields: [
      { id: 'mode', type: 'seg', def: 'diff', label: { ru: 'Режим', kk: 'Режим' }, options: [{ v: 'diff', ru: 'Разница дат', kk: 'Күндер айырмасы' }, { v: 'add', ru: 'Прибавить дни', kk: 'Күн қосу' }] },
      { id: 'd1', type: 'date', def: 'today', label: { ru: 'Начальная дата', kk: 'Бастапқы күн' } },
      { id: 'd2', type: 'date', def: '2026-12-31', when: v => v.mode === 'diff', label: { ru: 'Конечная дата', kk: 'Соңғы күн' } },
      { id: 'incl', type: 'check', def: false, when: v => v.mode === 'diff', label: { ru: 'Включить конечную дату', kk: 'Соңғы күнді қосу' } },
      { id: 'n', type: 'number', def: 30, min: -100000, max: 100000, when: v => v.mode === 'add', label: { ru: 'Сколько дней прибавить (минус — вычесть)', kk: 'Қанша күн қосу (минус — алу)' } }
    ],
    calc(v, R, L) {
      const a = E.parseDate(v.d1);
      if (!a) return { error: t(L, 'Укажите дату', 'Күнді көрсетіңіз') };
      const wd = L === 'kk' ? ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'] : ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
      if (v.mode === 'add') {
        const r = new Date(a.getTime() + v.n * 86400000);
        return { main: { label: t(L, 'Дата', 'Күн'), value: E.fmtDate(r, L), fmt: 'text' }, cards: [{ label: t(L, 'День недели', 'Апта күні'), value: wd[r.getUTCDay()], fmt: 'text' }], rows: [], steps: [`${E.fmtDate(a, L)} ${v.n >= 0 ? '+' : '−'} ${Math.abs(v.n)} = ${E.fmtDate(r, L)}`], notes: [] };
      }
      const b = E.parseDate(v.d2);
      if (!b) return { error: t(L, 'Укажите вторую дату', 'Екінші күнді көрсетіңіз') };
      const [x, y] = a <= b ? [a, b] : [b, a];
      const days = E.daysBetween(x, y) + (v.incl ? 1 : 0), o = E.ymd(x, y, v.incl);
      return {
        main: { label: t(L, 'Дней', 'Күн'), value: days, fmt: 'num' },
        cards: [{ label: t(L, 'Недель', 'Апта'), value: E.num(days / 7, 1), fmt: 'text' }, { label: t(L, 'Годы, месяцы, дни', 'Жыл, ай, күн'), value: E.ymdText(o, L), fmt: 'text' }],
        rows: [], steps: [t(L, `С ${E.fmtDate(x, L)} по ${E.fmtDate(y, L)}${v.incl ? ' включительно' : ''}: ${days} дн.`, `${E.fmtDate(x, L)} бастап ${E.fmtDate(y, L)} дейін${v.incl ? ' қоса алғанда' : ''}: ${days} күн`)], notes: []
      };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Конвертеры и математика */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;
  const lab = (ru, kk) => ({ ru, kk });
  const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });

  /* Курс валют (курс вводит пользователь) */
  const CUR = [['USD', 'доллар США', 'АҚШ доллары'], ['EUR', 'евро', 'еуро'], ['RUB', 'российский рубль', 'Ресей рублі'], ['CNY', 'китайский юань', 'Қытай юані'], ['KGS', 'киргизский сом', 'қырғыз сомы'], ['UZS', 'узбекский сум', 'өзбек сумы'], ['TRY', 'турецкая лира', 'түрік лирасы'], ['AED', 'дирхам ОАЭ', 'БАӘ дирхамы'], ['GBP', 'фунт стерлингов', 'фунт стерлинг']];
  E.add({
    id: 'currency-converter', cat: 'useful', popular: true,
    title: lab('Конвертер валют', 'Валюта айырбастау'), short: lab('Перевод валюты в тенге и обратно по вашему курсу', 'Валютаны сіздің бағамыңыз бойынша теңгеге және кері аудару'),
    badge: () => '$ € ₽', keys: 'курс валют доллар евро рубль юань обмен валюта бағамы',
    fields: [
      { id: 'dir', type: 'seg', def: 'to', label: lab('Что перевести', 'Нені аудару'), options: [{ v: 'to', ru: 'Валюту в тенге', kk: 'Валютаны теңгеге' }, { v: 'from', ru: 'Тенге в валюту', kk: 'Теңгені валютаға' }] },
      { id: 'cur', type: 'select', def: 'USD', label: lab('Валюта', 'Валюта'), options: CUR.map(c => ({ v: c[0], ru: `${c[0]} — ${c[1]}`, kk: `${c[0]} — ${c[2]}` })) },
      { id: 'amount', type: 'number', def: 100, step: 'any', label: lab('Сумма', 'Сома') },
      { id: 'rate', type: 'number', def: 470, step: 'any', label: lab('Курс: тенге за 1 единицу валюты', 'Бағам: 1 валюта бірлігіне теңге'), hint: lab('Официальный курс Нацбанка на сегодня — на nationalbank.kz. По умолчанию — курс доллара на 18 ноября 2026 года.', 'Ұлттық Банктің бүгінгі ресми бағамы — nationalbank.kz сайтында. Әдепкі мән — 2026 жылғы 18 қарашадағы доллар бағамы.') }
    ],
    calc(v, R, L) {
      if (!(v.rate > 0)) return { error: t(L, 'Введите курс', 'Бағамды енгізіңіз') };
      const res = v.dir === 'to' ? v.amount * v.rate : v.amount / v.rate;
      return {
        main: { label: v.dir === 'to' ? t(L, 'В тенге', 'Теңгемен') : t(L, `В ${v.cur}`, `${v.cur}`), value: v.dir === 'to' ? E.money(res, 2) : `${E.num(res, 2)} ${v.cur}`, fmt: 'text' },
        rows: [], steps: [v.dir === 'to' ? `${E.num(v.amount, 'auto')} ${v.cur} × ${E.num(v.rate, 2)} = ${m(res, 2)}` : `${m(v.amount, 'auto')} ÷ ${E.num(v.rate, 2)} = ${E.num(res, 2)} ${v.cur}`],
        notes: [t(L, 'В обменниках и банках курс покупки и продажи отличается от официального.', 'Айырбастау пункттері мен банктерде сатып алу және сату бағамы ресми бағамнан өзгеше.')]
      };
    }
  });

  /* Время */
  const TU = [['s', 1, 'секунды', 'секунд'], ['min', 60, 'минуты', 'минут'], ['h', 3600, 'часы', 'сағат'], ['d', 86400, 'дни', 'күн'], ['w', 604800, 'недели', 'апта'], ['mo', 2629746, 'месяцы (в среднем)', 'ай (орташа)'], ['y', 31556952, 'годы (в среднем)', 'жыл (орташа)']];
  E.add({
    id: 'time-converter', cat: 'useful',
    title: lab('Конвертер времени', 'Уақыт түрлендіргіші'), short: lab('Секунды, минуты, часы, дни, недели, месяцы и годы', 'Секунд, минут, сағат, күн, апта, ай және жыл'),
    badge: () => 'ч ↔ мин', keys: 'время часы минуты секунды перевод уақыт',
    fields: [{ id: 'n', type: 'number', def: 90, step: 'any', label: lab('Значение', 'Мән') }, { id: 'u', type: 'select', def: 'min', label: lab('Единица', 'Бірлік'), options: TU.map(x => ({ v: x[0], ru: x[2], kk: x[3] })) }],
    calc(v, R, L) {
      const sec = v.n * TU.find(x => x[0] === v.u)[1], h = Math.floor(sec / 3600), mi = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
      return {
        main: { label: t(L, 'Часы:минуты:секунды', 'Сағат:минут:секунд'), value: `${h}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}`, fmt: 'text' },
        rows: TU.map(x => ({ label: t(L, x[2], x[3]), value: E.num(sec / x[1], sec / x[1] < 100 ? 4 : 2).replace(/,?0+$/, ''), fmt: 'text' })), steps: [], notes: [t(L, 'Месяц — 30,44 дня, год — 365,24 дня (средние значения).', 'Ай — 30,44 күн, жыл — 365,24 күн (орташа мәндер).')]
      };
    }
  });

  /* Время прописью */
  E.add({
    id: 'time-to-words', cat: 'useful',
    title: lab('Время прописью', 'Уақыт жазумен'), short: lab('Время словами на русском и казахском', 'Уақытты орыс және қазақ тілінде сөзбен жазу'),
    badge: () => 'RU · KZ', keys: 'время прописью словами часы минуты уақыт жазумен',
    fields: [{ id: 'tm', type: 'time', def: '15:30', label: lab('Время', 'Уақыт') }],
    calc(v, R, L) {
      const mm = /^(\d{1,2}):(\d{2})/.exec(v.tm || '');
      if (!mm) return { error: t(L, 'Укажите время', 'Уақытты көрсетіңіз') };
      const h = +mm[1], mi = +mm[2];
      const ru = `${E.wordsRu(h) === 'ноль' ? 'ноль' : E.wordsRu(h)} ${E.plural(h, 'час', 'часа', 'часов')}` + (mi ? ` ${E.wordsRu(mi, true)} ${E.plural(mi, 'минута', 'минуты', 'минут')}` : ' ровно');
      const kk = `${E.wordsKk(h)} сағат` + (mi ? ` ${E.wordsKk(mi)} минут` : '');
      return { main: { label: L === 'kk' ? 'Қазақша' : 'По-русски', value: L === 'kk' ? kk : ru, fmt: 'words' }, cards: [{ label: L === 'kk' ? 'Орысша' : 'По-казахски', value: L === 'kk' ? ru : kk, fmt: 'words' }], rows: [], steps: [], notes: [], copy: ru + '\n' + kk };
    }
  });

  /* Возраст и пенсия */
  const retireAge = (sex, year) => sex === 'm' ? 63 : (year <= 2027 ? 61 : year === 2028 ? 61.5 : year === 2029 ? 62 : year === 2030 ? 62.5 : 63);
  const addMonths = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate()));
  E.add({
    id: 'age', cat: 'useful',
    title: lab('Калькулятор возраста', 'Жас калькуляторы'), short: lab('Точный возраст и сколько осталось до пенсии', 'Нақты жас және зейнетке дейін қанша қалды'),
    badge: (R, L) => t(L, 'лет и дней', 'жыл мен күн'), keys: 'возраст сколько лет пенсия день рождения жас зейнет',
    fields: [{ id: 'birth', type: 'date', def: '1990-05-15', label: lab('Дата рождения', 'Туған күні') }, { id: 'on', type: 'date', def: 'today', label: lab('На дату', 'Күнге') }, { id: 'sex', type: 'seg', def: 'm', label: lab('Пол (для пенсии)', 'Жынысы (зейнет үшін)'), options: [{ v: 'm', ru: 'Мужчина', kk: 'Ер' }, { v: 'f', ru: 'Женщина', kk: 'Әйел' }] }],
    calc(v, R, L) {
      const b = E.parseDate(v.birth), d = E.parseDate(v.on);
      if (!b || !d || d < b) return { error: t(L, 'Проверьте даты', 'Күндерді тексеріңіз') };
      const o = E.ymd(b, d, false), days = E.daysBetween(b, d);
      let next = new Date(Date.UTC(d.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate())); if (next < d) next = new Date(Date.UTC(d.getUTCFullYear() + 1, b.getUTCMonth(), b.getUTCDate()));
      let ret = null;
      for (let mo = 61 * 12; mo <= 63 * 12; mo++) { const dt = addMonths(b, mo); if (mo / 12 >= retireAge(v.sex, dt.getUTCFullYear())) { ret = dt; break; } }
      const left = ret && ret > d ? E.ymd(d, ret, false) : null;
      return {
        main: { label: t(L, 'Возраст', 'Жасы'), value: E.ymdText(o, L), fmt: 'text' },
        cards: [{ label: t(L, 'Прожито дней', 'Өмір сүрген күн'), value: days, fmt: 'num' }, { label: t(L, 'До дня рождения', 'Туған күнге дейін'), value: t(L, `${E.daysBetween(d, next)} дн.`, `${E.daysBetween(d, next)} күн`), fmt: 'text' }],
        rows: [R1(L, 'Пенсионный возраст наступает', 'Зейнеткерлік жас басталады', ret ? E.fmtDate(ret, L) : '—', 'text'), R1(L, 'До пенсии', 'Зейнетке дейін', left ? E.ymdText(left, L) : t(L, 'уже наступил', 'басталды'), 'text', true)],
        steps: [t(L, 'Пенсионный возраст: мужчины — 63 года; женщины — 61 год до 2027 года, затем +6 месяцев в год до 63 лет в 2031 году.', 'Зейнеткерлік жас: ерлер — 63 жас; әйелдер — 2027 жылға дейін 61 жас, кейін жылына +6 ай, 2031 жылы 63 жасқа дейін.')], notes: []
      };
    }
  });

  /* Возраст питомца */
  E.add({
    id: 'pet-age', cat: 'useful',
    title: lab('Возраст питомца в человеческих годах', 'Үй жануарының адам жасымен жасы'), short: lab('Сколько лет кошке или собаке по-человечески', 'Мысық немесе ит адамша неше жаста'),
    badge: (R, L) => t(L, 'кошки и собаки', 'мысық пен ит'), keys: 'возраст кошки собаки питомца мысық ит жасы',
    fields: [{ id: 'pet', type: 'select', def: 'cat', label: lab('Питомец', 'Жануар'), options: [{ v: 'cat', ru: 'Кошка', kk: 'Мысық' }, { v: 'dogS', ru: 'Собака мелкой породы (до 10 кг)', kk: 'Кішкентай ит (10 кг дейін)' }, { v: 'dogM', ru: 'Собака средней породы (10–25 кг)', kk: 'Орташа ит (10–25 кг)' }, { v: 'dogL', ru: 'Собака крупной породы (более 25 кг)', kk: 'Ірі ит (25 кг-нан жоғары)' }] }, { id: 'age', type: 'number', def: 5, min: 0, max: 30, step: 'any', label: lab('Возраст питомца', 'Жануардың жасы'), suffix: lab('лет', 'жыл') }],
    calc(v, R, L) {
      const per = { cat: 4, dogS: 4, dogM: 5, dogL: 7 }[v.pet], a = v.age;
      const h = a <= 1 ? a * 15 : a <= 2 ? 15 + (a - 1) * 9 : 24 + (a - 2) * per;
      return { main: { label: t(L, 'По-человечески', 'Адамша'), value: t(L, `${E.num(h, 0)} ${E.plural(Math.round(h), 'год', 'года', 'лет')}`, `${E.num(h, 0)} жас`), fmt: 'text' }, rows: [], steps: [t(L, `Первый год = 15 лет, второй = +9, далее +${per} за каждый год.`, `Бірінші жыл = 15 жас, екінші = +9, әрі қарай әр жылға +${per}.`)], notes: [t(L, 'Это приблизительная шкала ветеринаров; старение зависит от породы и здоровья.', 'Бұл ветеринарлардың шамамен шкаласы; қартаю тұқымға және денсаулыққа байланысты.')] };
    }
  });

  /* Римские цифры */
  const ROM = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  E.toRoman = n => { let s = ''; for (const [a, r] of ROM) while (n >= a) { s += r; n -= a; } return s; };
  E.fromRoman = s => { s = s.toUpperCase(); let n = 0, i = 0; for (const [a, r] of ROM) while (s.startsWith(r, i)) { n += a; i += r.length; } return i === s.length && s ? n : null; };
  E.add({
    id: 'roman-numerals', cat: 'useful',
    title: lab('Римские цифры', 'Рим цифрлары'), short: lab('Перевод чисел в римские цифры и обратно', 'Сандарды рим цифрларына және кері аудару'),
    badge: () => 'XIV', keys: 'римские цифры перевод рим цифрлары',
    fields: [{ id: 'x', type: 'text', def: '2026', label: lab('Число или римская запись (1–3999)', 'Сан немесе рим жазбасы (1–3999)') }],
    calc(v, R, L) {
      const s = String(v.x || '').trim();
      if (/^\d+$/.test(s)) { const n = +s; if (n < 1 || n > 3999) return { error: t(L, 'Число от 1 до 3999', '1-ден 3999-ға дейінгі сан') }; return { main: { label: t(L, 'Римскими цифрами', 'Рим цифрларымен'), value: E.toRoman(n), fmt: 'text' }, rows: [], steps: [], notes: [] }; }
      const n = E.fromRoman(s);
      if (!n || E.toRoman(n) !== s.toUpperCase()) return { error: t(L, 'Не похоже на правильную римскую запись', 'Дұрыс рим жазбасына ұқсамайды') };
      return { main: { label: t(L, 'Арабскими цифрами', 'Араб цифрларымен'), value: n, fmt: 'num' }, rows: [], steps: [], notes: [] };
    }
  });

  /* Конвертер единиц */
  const UNITS = {
    len: [['мм', 'мм', 0.001], ['см', 'см', 0.01], ['м', 'м', 1], ['км', 'км', 1000], ['дюйм', 'дюйм', 0.0254], ['фут', 'фут', 0.3048], ['ярд', 'ярд', 0.9144], ['миля', 'миля', 1609.344]],
    mass: [['мг', 'мг', 1e-6], ['г', 'г', 0.001], ['кг', 'кг', 1], ['т', 'т', 1000], ['унция', 'унция', 0.028349523125], ['фунт', 'фунт', 0.45359237]],
    vol: [['мл', 'мл', 0.001], ['л', 'л', 1], ['м³', 'м³', 1000], ['галлон США', 'АҚШ галлоны', 3.785411784], ['баррель нефти', 'мұнай баррелі', 158.987294928]],
    area: [['м²', 'м²', 1], ['сотка', 'сотық', 100], ['гектар', 'гектар', 10000], ['км²', 'км²', 1e6], ['фут²', 'фут²', 0.09290304], ['акр', 'акр', 4046.8564224]],
    speed: [['м/с', 'м/с', 1], ['км/ч', 'км/сағ', 1 / 3.6], ['миль/ч', 'миль/сағ', 0.44704], ['узел', 'түйін', 0.514444]],
    temp: [['°C', '°C'], ['°F', '°F'], ['K', 'K']]
  };
  const ucat = [['len', 'Длина', 'Ұзындық'], ['mass', 'Масса', 'Масса'], ['vol', 'Объём', 'Көлем'], ['area', 'Площадь', 'Аудан'], ['speed', 'Скорость', 'Жылдамдық'], ['temp', 'Температура', 'Температура']];
  E.add({
    id: 'unit-converter', cat: 'useful',
    title: lab('Конвертер единиц', 'Өлшем бірліктерін түрлендіргіш'), short: lab('Длина, масса, объём, площадь, скорость, температура', 'Ұзындық, масса, көлем, аудан, жылдамдық, температура'),
    badge: () => 'м ↔ фут', keys: 'единицы измерения метры футы килограммы фунты сотки гектары температура бірліктер',
    fields: [{ id: 'k', type: 'select', def: 'len', label: lab('Что переводим', 'Нені аударамыз'), options: ucat.map(c => ({ v: c[0], ru: c[1], kk: c[2] })) }, { id: 'n', type: 'number', def: 1, step: 'any', label: lab('Значение', 'Мән') }]
      .concat(Object.keys(UNITS).map(k => ({ id: 'u_' + k, type: 'select', def: UNITS[k][k === 'temp' ? 0 : (k === 'area' ? 1 : 2)][0], when: v => v.k === k, label: lab('Из единицы', 'Бірліктен'), options: UNITS[k].map(u => ({ v: u[0], ru: u[0], kk: u[1] })) }))),
    calc(v, R, L) {
      const U = UNITS[v.k], from = v['u_' + v.k], n = v.n;
      if (v.k === 'temp') {
        const c = from === '°C' ? n : from === '°F' ? (n - 32) * 5 / 9 : n - 273.15;
        return { main: { label: '°C', value: E.num(c, 2), fmt: 'text' }, rows: [{ label: '°C', value: E.num(c, 2), fmt: 'text' }, { label: '°F', value: E.num(c * 9 / 5 + 32, 2), fmt: 'text' }, { label: 'K', value: E.num(c + 273.15, 2), fmt: 'text' }], steps: [], notes: [] };
      }
      const base = n * U.find(u => u[0] === from)[2];
      const f = x => { const a = Math.abs(x); return E.num(x, a >= 100 ? 2 : a >= 1 ? 4 : 6).replace(/,?0+$/, '') || '0'; };
      const show = U[{ len: 2, mass: 2, vol: 1, area: 0, speed: 1 }[v.k]];
      return { main: { label: `${E.num(n, 'auto')} ${from}`, value: `${f(base / show[2])} ${L === 'kk' ? show[1] : show[0]}`, fmt: 'text' }, rows: U.map(u => ({ label: L === 'kk' ? u[1] : u[0], value: f(base / u[2]), fmt: 'text' })), steps: [], notes: [] };
    }
  });

  /* Часовые пояса */
  const TZ = [['Astana', 'Астана / Алматы', 'Астана / Алматы', null], ['Moscow', 'Москва', 'Мәскеу', 'Europe/Moscow'], ['Tashkent', 'Ташкент', 'Ташкент', 'Asia/Tashkent'], ['Bishkek', 'Бишкек', 'Бішкек', 'Asia/Bishkek'], ['Istanbul', 'Стамбул', 'Ыстамбұл', 'Europe/Istanbul'], ['Dubai', 'Дубай', 'Дубай', 'Asia/Dubai'], ['Beijing', 'Пекин', 'Бейжің', 'Asia/Shanghai'], ['Seoul', 'Сеул', 'Сеул', 'Asia/Seoul'], ['Tokyo', 'Токио', 'Токио', 'Asia/Tokyo'], ['Delhi', 'Дели', 'Дели', 'Asia/Kolkata'], ['Bangkok', 'Бангкок', 'Бангкок', 'Asia/Bangkok'], ['Singapore', 'Сингапур', 'Сингапур', 'Asia/Singapore'], ['Berlin', 'Берлин', 'Берлин', 'Europe/Berlin'], ['Paris', 'Париж', 'Париж', 'Europe/Paris'], ['London', 'Лондон', 'Лондон', 'Europe/London'], ['NewYork', 'Нью-Йорк', 'Нью-Йорк', 'America/New_York'], ['LosAngeles', 'Лос-Анджелес', 'Лос-Анджелес', 'America/Los_Angeles'], ['Sydney', 'Сидней', 'Сидней', 'Australia/Sydney']];
  E.add({
    id: 'timezone', cat: 'useful',
    title: lab('Часовые пояса', 'Уақыт белдеулері'), short: lab('Который час в других городах, если в Казахстане…', 'Қазақстанда … болса, басқа қалаларда сағат нешеде'),
    badge: () => 'UTC+5', keys: 'часовой пояс время в мире разница во времени уақыт белдеуі',
    fields: [{ id: 'd', type: 'date', def: 'today', half: true, label: lab('Дата в Казахстане', 'Қазақстандағы күн') }, { id: 'tm', type: 'time', def: '09:00', half: true, label: lab('Время в Казахстане', 'Қазақстандағы уақыт') }],
    calc(v, R, L) {
      const d = E.parseDate(v.d), mm = /^(\d{1,2}):(\d{2})/.exec(v.tm || '');
      if (!d || !mm) return { error: t(L, 'Укажите дату и время', 'Күн мен уақытты көрсетіңіз') };
      const utc = new Date(d.getTime() + ((+mm[1] - 5) * 60 + +mm[2]) * 60000);
      const fmt = tz => { try { return new Intl.DateTimeFormat(L === 'kk' ? 'kk-KZ' : 'ru-RU', { timeZone: tz, hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }).format(utc); } catch (e) { return '—'; } };
      return { main: { label: t(L, 'Время в Казахстане', 'Қазақстандағы уақыт'), value: `${v.tm} (UTC+5)`, fmt: 'text' }, rows: TZ.slice(1).map(z => ({ label: t(L, z[1], z[2]), value: fmt(z[3]), fmt: 'text' })), steps: [], notes: [t(L, 'С 1 марта 2024 года во всём Казахстане единое время UTC+5. Летнее время в других странах учитывается автоматически.', '2024 жылғы 1 наурыздан бастап бүкіл Қазақстанда бірыңғай UTC+5 уақыты. Басқа елдердегі жазғы уақыт автоматты ескеріледі.')] };
    }
  });

  /* Генератор паролей */
  E.add({
    id: 'password-generator', cat: 'useful',
    title: lab('Генератор паролей', 'Құпиясөз генераторы'), short: lab('Надёжный пароль прямо в браузере', 'Сенімді құпиясөз тікелей браузерде'),
    badge: () => '••••', keys: 'пароль генератор надежный пароль құпиясөз',
    fields: [{ id: 'len', type: 'number', def: 16, min: 6, max: 64, label: lab('Длина', 'Ұзындығы'), suffix: lab('симв.', 'таңба') }, { id: 'up', type: 'check', def: true, label: lab('Заглавные буквы A–Z', 'Бас әріптер A–Z') }, { id: 'dig', type: 'check', def: true, label: lab('Цифры 0–9', 'Цифрлар 0–9') }, { id: 'sym', type: 'check', def: true, label: lab('Символы !@#$%', 'Таңбалар !@#$%') }, { id: 'clear', type: 'check', def: true, label: lab('Без похожих символов (0/O, 1/l/I)', 'Ұқсас таңбаларсыз (0/O, 1/l/I)') }],
    calc(v, R, L) {
      let set = 'abcdefghijklmnopqrstuvwxyz'; if (v.up) set += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (v.dig) set += '0123456789'; if (v.sym) set += '!@#$%^&*-_=+?';
      if (v.clear) set = set.replace(/[0O1lI]/g, '');
      const n = E.clamp(Math.round(v.len) || 16, 6, 64), cr = root.crypto;
      if (!cr || !cr.getRandomValues) return { error: t(L, 'Браузер не поддерживает безопасную генерацию', 'Браузер қауіпсіз генерацияны қолдамайды') };
      const lim = 256 - (256 % set.length); let out = '';
      while (out.length < n) { const b = cr.getRandomValues(new Uint8Array(n * 2)); for (const x of b) if (x < lim && out.length < n) out += set[x % set.length]; }
      const bits = Math.round(n * Math.log2(set.length));
      return { main: { label: t(L, 'Пароль', 'Құпиясөз'), value: out, fmt: 'words' }, cards: [{ label: t(L, 'Стойкость', 'Беріктігі'), value: t(L, `${bits} бит`, `${bits} бит`), fmt: 'text' }], rows: [], steps: [], copy: out, notes: [t(L, 'Пароль создаётся в вашем браузере и никуда не передаётся. Чтобы получить новый, измените любой параметр.', 'Құпиясөз сіздің браузеріңізде жасалады және ешқайда жіберілмейді. Жаңасын алу үшін кез келген параметрді өзгертіңіз.')] };
    }
  });

  /* QR-код */
  E.add({
    id: 'qr-code-generator', cat: 'useful', scripts: ['qrcode.js'],
    title: lab('Генератор QR-кода', 'QR-код генераторы'), short: lab('QR-код для ссылки, телефона, Wi-Fi или текста', 'Сілтеме, телефон, Wi-Fi немесе мәтін үшін QR-код'),
    badge: () => 'QR', keys: 'qr код генератор ссылка wifi qr-код',
    fields: [
      { id: 'kind', type: 'select', def: 'url', label: lab('Что закодировать', 'Нені кодтау'), options: [{ v: 'url', ru: 'Ссылка или текст', kk: 'Сілтеме немесе мәтін' }, { v: 'tel', ru: 'Номер телефона', kk: 'Телефон нөмірі' }, { v: 'wifi', ru: 'Wi-Fi', kk: 'Wi-Fi' }] },
      { id: 'text', type: 'text', def: 'https://example.kz', when: v => v.kind === 'url', label: lab('Ссылка или текст', 'Сілтеме немесе мәтін') },
      { id: 'tel', type: 'text', def: '+77001234567', when: v => v.kind === 'tel', label: lab('Телефон', 'Телефон') },
      { id: 'ssid', type: 'text', def: 'MyWiFi', when: v => v.kind === 'wifi', label: lab('Имя сети', 'Желі атауы') },
      { id: 'pass', type: 'text', def: '', when: v => v.kind === 'wifi', label: lab('Пароль сети', 'Желі құпиясөзі') }
    ],
    calc(v, R, L) {
      const q = root.qrcode;
      if (!q) return { error: t(L, 'Модуль QR не загрузился', 'QR модулі жүктелмеді') };
      const esc = s => String(s).replace(/([\\;,:"])/g, '\\$1');
      const data = v.kind === 'tel' ? 'tel:' + String(v.tel).replace(/[^\d+]/g, '') : v.kind === 'wifi' ? `WIFI:T:${v.pass ? 'WPA' : 'nopass'};S:${esc(v.ssid)};P:${esc(v.pass)};;` : String(v.text || '');
      if (!data || data === 'tel:') return { error: t(L, 'Заполните поле', 'Өрісті толтырыңыз') };
      q.stringToBytes = q.stringToBytesFuncs['UTF-8'];
      const qr = q(0, 'M'); qr.addData(data); qr.make();
      const svg = qr.createSvgTag({ cellSize: 6, margin: 4, scalable: true }).replace('<svg ', '<svg style="width:100%;max-width:260px;background:#fff;border-radius:8px" ');
      return { main: { label: t(L, 'QR-код', 'QR-код'), value: svg, fmt: 'svg' }, rows: [], steps: [], notes: [t(L, 'QR-код создаётся в браузере. Чтобы сохранить: правый клик (или долгое нажатие) по картинке, либо снимок экрана. Перед печатью проверьте его камерой телефона.', 'QR-код браузерде жасалады. Сақтау үшін: суретке оң жақ батырмамен басыңыз (немесе ұзақ басыңыз) не скриншот жасаңыз. Басып шығармас бұрын телефон камерасымен тексеріңіз.')] };
    }
  });

  /* Скидки */
  E.add({
    id: 'discount', cat: 'useful',
    title: lab('Калькулятор скидок', 'Жеңілдік калькуляторы'), short: lab('Цена со скидкой, в том числе двойной', 'Жеңілдікпен баға, оның ішінде қос жеңілдік'),
    badge: () => '−%', keys: 'скидка цена со скидкой распродажа акция жеңілдік',
    fields: [{ id: 'price', type: 'money', def: 25000, dec: 2, label: lab('Цена', 'Баға') }, { id: 'd1', type: 'percent', def: 20, min: 0, max: 100, step: 'any', label: lab('Скидка', 'Жеңілдік') }, { id: 'd2', type: 'percent', def: 0, min: 0, max: 100, step: 'any', adv: true, label: lab('Дополнительная скидка поверх первой', 'Біріншісінің үстіне қосымша жеңілдік') }],
    calc(v, R, L) {
      const p1 = v.price * (1 - v.d1 / 100), p2 = p1 * (1 - v.d2 / 100), save = v.price - p2, tot = v.price ? save / v.price * 100 : 0;
      return { main: { label: t(L, 'Цена со скидкой', 'Жеңілдікпен баға'), value: p2, fmt: 'money2' }, cards: [{ label: t(L, 'Экономия', 'Үнемдеу'), value: save, fmt: 'money2' }, { label: t(L, 'Итоговая скидка', 'Жалпы жеңілдік'), value: tot, fmt: 'pct' }], rows: [], steps: [`${m(v.price, 2)} × (1 − ${E.num(v.d1, 'auto')}%)${v.d2 ? ` × (1 − ${E.num(v.d2, 'auto')}%)` : ''} = ${m(p2, 2)}`], notes: v.d2 ? [t(L, `Две скидки ${E.num(v.d1, 'auto')}% и ${E.num(v.d2, 'auto')}% — это не ${E.num(v.d1 + v.d2, 'auto')}%, а ${E.num(tot, 2)}%.`, `${E.num(v.d1, 'auto')}% және ${E.num(v.d2, 'auto')}% екі жеңілдік — ${E.num(v.d1 + v.d2, 'auto')}% емес, ${E.num(tot, 2)}%.`)] : [] };
    }
  });

  /* Чаевые */
  E.add({
    id: 'tip-split', cat: 'useful',
    title: lab('Чаевые и деление счёта', 'Шайпұл және шотты бөлу'), short: lab('Сколько платит каждый с учётом чаевых', 'Шайпұлды ескеріп әркім қанша төлейді'),
    badge: () => '÷', keys: 'чаевые счет разделить ресторан кафе шайпұл',
    fields: [{ id: 'bill', type: 'money', def: 30000, label: lab('Сумма счёта', 'Шот сомасы') }, { id: 'tip', type: 'percent', def: 10, min: 0, max: 100, step: 'any', label: lab('Чаевые или обслуживание', 'Шайпұл немесе қызмет көрсету') }, { id: 'n', type: 'number', def: 3, min: 1, max: 100, label: lab('Сколько человек', 'Неше адам'), suffix: lab('чел.', 'адам') }],
    calc(v, R, L) {
      const tip = v.bill * v.tip / 100, tot = v.bill + tip, per = tot / Math.max(1, Math.round(v.n));
      return { main: { label: t(L, 'С каждого', 'Әр адамнан'), value: per, fmt: 'money2' }, cards: [{ label: t(L, 'Чаевые', 'Шайпұл'), value: tip }, { label: t(L, 'Всего', 'Барлығы'), value: tot }], rows: [], steps: [`(${m(v.bill)} + ${m(tip)}) ÷ ${Math.round(v.n)} = ${m(per, 2)}`], notes: [] };
    }
  });

  /* Високосный год */
  const leap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  E.add({
    id: 'leap-year', cat: 'useful',
    title: lab('Високосный год', 'Кібісе жыл'), short: lab('Високосный ли год и сколько их в диапазоне', 'Жыл кібісе ме және аралықта қаншасы бар'),
    badge: () => '366', keys: 'високосный год 366 дней кібісе жыл',
    fields: [{ id: 'y', type: 'number', def: 2028, min: 1, max: 9999, label: lab('Год', 'Жыл') }, { id: 'y2', type: 'number', def: 0, min: 0, max: 9999, adv: true, label: lab('Конец диапазона (для подсчёта)', 'Аралықтың соңы (санау үшін)') }],
    calc(v, R, L) {
      const y = Math.round(v.y), is = leap(y), nxt = []; for (let k = y + 1; nxt.length < 3; k++) if (leap(k)) nxt.push(k);
      const rows = [R1(L, 'Дней в году', 'Жылдағы күн', is ? 366 : 365, 'num'), R1(L, 'Следующие високосные', 'Келесі кібісе жылдар', nxt.join(', '), 'text')];
      if (v.y2 > y) { let c = 0; for (let k = y; k <= v.y2; k++) if (leap(k)) c++; rows.push(R1(L, `Високосных с ${y} по ${Math.round(v.y2)}`, `${y}–${Math.round(v.y2)} аралығында кібісе`, c, 'num', true)); }
      return { main: { label: String(y), value: is ? t(L, 'Високосный', 'Кібісе') : t(L, 'Не високосный', 'Кібісе емес'), fmt: 'text' }, rows, steps: [t(L, 'Год високосный, если делится на 4, но не на 100, либо делится на 400.', 'Жыл 4-ке бөлінсе, бірақ 100-ге бөлінбесе, не 400-ге бөлінсе — кібісе.')], notes: [] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Строительство, здоровье, религия, образование, недвижимость */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;
  const lab = (ru, kk) => ({ ru, kk });
  const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
  const ceil = Math.ceil;
  const priceField = (def, ru, kk) => ({ id: 'price', type: 'money', def, adv: true, label: lab(ru, kk) });

  /* ---------- Строительство ---------- */
  E.add({
    id: 'concrete-volume', cat: 'construction',
    title: lab('Калькулятор бетона', 'Бетон калькуляторы'), short: lab('Объём бетона для плиты, ленточного фундамента или колонн', 'Плита, таспалы іргетас немесе бағандар үшін бетон көлемі'),
    badge: () => 'м³', keys: 'бетон фундамент плита объем кубы бетон көлемі',
    fields: [
      { id: 'shape', type: 'seg', def: 'slab', label: lab('Конструкция', 'Құрылым'), options: [{ v: 'slab', ru: 'Плита', kk: 'Плита' }, { v: 'strip', ru: 'Лента', kk: 'Таспа' }, { v: 'col', ru: 'Колонны', kk: 'Бағандар' }] },
      { id: 'a', type: 'number', def: 10, step: 'any', when: v => v.shape !== 'col', label: lab('Длина (для ленты — общий периметр)', 'Ұзындығы (таспа үшін — жалпы периметр)'), suffix: lab('м', 'м') },
      { id: 'b', type: 'number', def: 8, step: 'any', when: v => v.shape === 'slab', label: lab('Ширина', 'Ені'), suffix: lab('м', 'м') },
      { id: 'w', type: 'number', def: 0.4, step: 'any', when: v => v.shape === 'strip', label: lab('Ширина ленты', 'Таспа ені'), suffix: lab('м', 'м') },
      { id: 'h', type: 'number', def: 0.2, step: 'any', label: lab('Толщина / высота', 'Қалыңдығы / биіктігі'), suffix: lab('м', 'м') },
      { id: 'd', type: 'number', def: 0.3, step: 'any', when: v => v.shape === 'col', label: lab('Диаметр колонны', 'Баған диаметрі'), suffix: lab('м', 'м') },
      { id: 'n', type: 'number', def: 4, min: 1, when: v => v.shape === 'col', label: lab('Количество колонн', 'Бағандар саны'), suffix: lab('шт.', 'дана') },
      { id: 'res', type: 'percent', def: 5, min: 0, max: 50, label: lab('Запас', 'Қор') },
      priceField(0, 'Цена бетона за м³ (необязательно)', 'Бетонның 1 м³ бағасы (міндетті емес)')
    ],
    calc(v, R, L) {
      const vol = v.shape === 'slab' ? v.a * v.b * v.h : v.shape === 'strip' ? v.a * v.w * v.h : Math.PI * Math.pow(v.d / 2, 2) * v.h * Math.round(v.n);
      const tot = vol * (1 + v.res / 100);
      return { main: { label: t(L, 'Заказать бетона', 'Тапсырыс беретін бетон'), value: `${E.num(tot, 2)} м³`, fmt: 'text' }, cards: [{ label: t(L, 'Без запаса', 'Қорсыз'), value: `${E.num(vol, 2)} м³`, fmt: 'text' }].concat(v.price ? [{ label: t(L, 'Стоимость', 'Құны'), value: tot * v.price }] : []), rows: [], steps: [t(L, `Объём ${E.num(vol, 3)} м³ + запас ${E.num(v.res, 'auto')}% = ${E.num(tot, 2)} м³`, `Көлемі ${E.num(vol, 3)} м³ + ${E.num(v.res, 'auto')}% қор = ${E.num(tot, 2)} м³`)], notes: [t(L, 'Бетон заказывают с запасом 3–7%: часть остаётся в миксере и насосе.', 'Бетонға 3–7% қормен тапсырыс беріледі: бір бөлігі миксер мен сорғыда қалады.')] };
    }
  });

  const BRICK = { s: [51, 102, 153, 204], o: [39, 78, 117, 156] };
  E.add({
    id: 'brick', cat: 'construction',
    title: lab('Расчёт кирпича и газоблока', 'Кірпіш пен газоблокты есептеу'), short: lab('Сколько кирпича или газоблока нужно на стену', 'Қабырғаға қанша кірпіш немесе газоблок керек'),
    badge: (R, L) => t(L, 'шт.', 'дана'), keys: 'кирпич газоблок кладка стена сколько нужно кірпіш',
    fields: [
      { id: 'mat', type: 'select', def: 's', label: lab('Материал', 'Материал'), options: [{ v: 's', ru: 'Кирпич одинарный 250×120×65', kk: 'Бір қабатты кірпіш 250×120×65' }, { v: 'o', ru: 'Кирпич полуторный 250×120×88', kk: 'Бір жарым кірпіш 250×120×88' }, { v: 'g', ru: 'Газоблок 600×200 (лицевая сторона)', kk: 'Газоблок 600×200 (бет жағы)' }] },
      { id: 'th', type: 'select', def: '1', when: v => v.mat !== 'g', label: lab('Толщина кладки', 'Қалау қалыңдығы'), options: [{ v: '0', ru: 'в ½ кирпича (12 см)', kk: '½ кірпіш (12 см)' }, { v: '1', ru: 'в 1 кирпич (25 см)', kk: '1 кірпіш (25 см)' }, { v: '2', ru: 'в 1½ кирпича (38 см)', kk: '1½ кірпіш (38 см)' }, { v: '3', ru: 'в 2 кирпича (51 см)', kk: '2 кірпіш (51 см)' }] },
      { id: 'len', type: 'number', def: 30, step: 'any', label: lab('Длина стен', 'Қабырғалар ұзындығы'), suffix: lab('м', 'м') },
      { id: 'h', type: 'number', def: 2.8, step: 'any', label: lab('Высота', 'Биіктігі'), suffix: lab('м', 'м') },
      { id: 'open', type: 'number', def: 6, step: 'any', label: lab('Площадь окон и дверей', 'Терезе мен есік ауданы'), suffix: lab('м²', 'м²') },
      { id: 'res', type: 'percent', def: 5, min: 0, max: 30, label: lab('Запас на бой и подрезку', 'Сынуға және кесуге қор') },
      priceField(0, 'Цена за штуку (необязательно)', 'Бір дананың бағасы (міндетті емес)')
    ],
    calc(v, R, L) {
      const area = E.pos(v.len * v.h - v.open), per = v.mat === 'g' ? 1 / (0.6 * 0.2) : BRICK[v.mat][+v.th], n = ceil(area * per * (1 + v.res / 100));
      return { main: { label: t(L, 'Нужно', 'Керек'), value: t(L, `${E.num(n)} шт.`, `${E.num(n)} дана`), fmt: 'text' }, cards: [{ label: t(L, 'Площадь кладки', 'Қалау ауданы'), value: `${E.num(area, 2)} м²`, fmt: 'text' }].concat(v.price ? [{ label: t(L, 'Стоимость', 'Құны'), value: n * v.price }] : []), rows: [], steps: [t(L, `${E.num(area, 2)} м² × ${E.num(per, 2)} шт/м² + ${E.num(v.res, 'auto')}% = ${E.num(n)} шт.`, `${E.num(area, 2)} м² × ${E.num(per, 2)} дана/м² + ${E.num(v.res, 'auto')}% = ${E.num(n)} дана`)], notes: [t(L, 'Нормы расхода даны с учётом шва 10 мм. Для газоблока количество не зависит от толщины стены — она равна ширине блока.', 'Шығын нормалары 10 мм жікті ескеріп берілген. Газоблок саны қабырға қалыңдығына байланысты емес — ол блок еніне тең.')] };
    }
  });

  E.add({
    id: 'wallpaper', cat: 'construction',
    title: lab('Расчёт обоев', 'Тұсқағаз есебі'), short: lab('Сколько рулонов обоев нужно на комнату', 'Бөлмеге неше орам тұсқағаз керек'),
    badge: (R, L) => t(L, 'рулоны', 'орамдар'), keys: 'обои рулоны сколько нужно комната тұсқағаз',
    fields: [
      { id: 'a', type: 'number', def: 4, step: 'any', half: true, label: lab('Длина комнаты', 'Бөлме ұзындығы'), suffix: lab('м', 'м') }, { id: 'b', type: 'number', def: 3.5, step: 'any', half: true, label: lab('Ширина', 'Ені'), suffix: lab('м', 'м') },
      { id: 'h', type: 'number', def: 2.7, step: 'any', label: lab('Высота стен', 'Қабырға биіктігі'), suffix: lab('м', 'м') },
      { id: 'open', type: 'number', def: 2.2, step: 'any', label: lab('Ширина окон и дверей вместе', 'Терезе мен есіктердің жалпы ені'), suffix: lab('м', 'м') },
      { id: 'rw', type: 'select', def: '0.53', half: true, label: lab('Ширина рулона', 'Орам ені'), options: [{ v: '0.53', ru: '0,53 м', kk: '0,53 м' }, { v: '0.7', ru: '0,7 м', kk: '0,7 м' }, { v: '1.06', ru: '1,06 м', kk: '1,06 м' }] },
      { id: 'rl', type: 'number', def: 10.05, step: 'any', half: true, label: lab('Длина рулона', 'Орам ұзындығы'), suffix: lab('м', 'м') },
      { id: 'rap', type: 'number', def: 0, step: 'any', label: lab('Раппорт рисунка (0 — без подгонки)', 'Өрнек раппорты (0 — сәйкестендірусіз)'), suffix: lab('см', 'см') }
    ],
    calc(v, R, L) {
      const per = E.pos(2 * (v.a + v.b) - v.open), strip = v.h + 0.1 + v.rap / 100, perRoll = Math.floor(v.rl / strip);
      if (perRoll < 1) return { error: t(L, 'Рулон короче высоты стены', 'Орам қабырға биіктігінен қысқа') };
      const strips = ceil(per / +v.rw), rolls = ceil(strips / perRoll);
      return { main: { label: t(L, 'Рулонов', 'Орам'), value: rolls, fmt: 'num' }, cards: [{ label: t(L, 'Полос', 'Жолақ'), value: strips, fmt: 'num' }, { label: t(L, 'Полос из рулона', 'Орамнан жолақ'), value: perRoll, fmt: 'num' }], rows: [], steps: [t(L, `Периметр без проёмов ${E.num(per, 2)} м ÷ ${String(v.rw).replace('.', ',')} м = ${strips} полос`, `Ойықсыз периметр ${E.num(per, 2)} м ÷ ${String(v.rw).replace('.', ',')} м = ${strips} жолақ`), t(L, `Из рулона ${E.num(v.rl, 2)} м выходит ${perRoll} полос (высота + 10 см на подрезку + раппорт)`, `${E.num(v.rl, 2)} м орамнан ${perRoll} жолақ шығады (биіктік + 10 см + раппорт)`)], notes: [t(L, 'Купите один рулон про запас из одной партии.', 'Бір партиядан бір орам қор ала салыңыз.')] };
    }
  });

  E.add({
    id: 'flooring', cat: 'construction',
    title: lab('Напольные покрытия', 'Еден жабындары'), short: lab('Ламинат, плитка, линолеум: сколько упаковок и плинтуса', 'Ламинат, плитка, линолеум: неше қаптама және плинтус'),
    badge: (R, L) => t(L, 'упаковки', 'қаптамалар'), keys: 'ламинат плитка линолеум паркет пол упаковки плинтус еден',
    fields: [
      { id: 'a', type: 'number', def: 5, step: 'any', half: true, label: lab('Длина комнаты', 'Бөлме ұзындығы'), suffix: lab('м', 'м') }, { id: 'b', type: 'number', def: 4, step: 'any', half: true, label: lab('Ширина', 'Ені'), suffix: lab('м', 'м') },
      { id: 'pack', type: 'number', def: 2.13, step: 'any', label: lab('Площадь в одной упаковке', 'Бір қаптамадағы аудан'), suffix: lab('м²', 'м²') },
      { id: 'lay', type: 'select', def: '7', label: lab('Укладка', 'Төсеу'), options: [{ v: '5', ru: 'Прямая, простая комната (+5%)', kk: 'Тік, қарапайым бөлме (+5%)' }, { v: '7', ru: 'Прямая со смещением (+7%)', kk: 'Ығысумен тік (+7%)' }, { v: '15', ru: 'Диагональ или ёлочка (+15%)', kk: 'Диагональ немесе шырша (+15%)' }] },
      { id: 'door', type: 'number', def: 0.9, step: 'any', label: lab('Ширина дверных проёмов (для плинтуса)', 'Есік ойықтарының ені (плинтус үшін)'), suffix: lab('м', 'м') },
      priceField(0, 'Цена упаковки (необязательно)', 'Қаптама бағасы (міндетті емес)')
    ],
    calc(v, R, L) {
      if (!(v.pack > 0)) return { error: t(L, 'Укажите площадь упаковки', 'Қаптама ауданын көрсетіңіз') };
      const area = v.a * v.b, need = area * (1 + +v.lay / 100), packs = ceil(need / v.pack), plinth = E.pos(2 * (v.a + v.b) - v.door);
      return { main: { label: t(L, 'Упаковок', 'Қаптама'), value: packs, fmt: 'num' }, cards: [{ label: t(L, 'Площадь пола', 'Еден ауданы'), value: `${E.num(area, 2)} м²`, fmt: 'text' }, { label: t(L, 'Плинтус', 'Плинтус'), value: `${E.num(plinth, 2)} м`, fmt: 'text' }].concat(v.price ? [{ label: t(L, 'Стоимость', 'Құны'), value: packs * v.price }] : []), rows: [], steps: [t(L, `${E.num(area, 2)} м² + ${v.lay}% = ${E.num(need, 2)} м² ÷ ${E.num(v.pack, 2)} м² = ${packs} уп.`, `${E.num(area, 2)} м² + ${v.lay}% = ${E.num(need, 2)} м² ÷ ${E.num(v.pack, 2)} м² = ${packs} қапт.`)], notes: [] };
    }
  });

  const LAMBDA = { mw: [0.04, 'Минеральная вата', 'Минералды мақта'], eps: [0.038, 'Пенопласт (ППС)', 'Пенопласт (ППС)'], xps: [0.032, 'Экструдированный пенополистирол', 'Экструзиялық пенополистирол'], pir: [0.024, 'PIR-плиты', 'PIR тақталары'] };
  E.add({
    id: 'insulation', cat: 'construction',
    title: lab('Утепление дома', 'Үйді жылыту'), short: lab('Толщина утеплителя по требуемому сопротивлению теплопередаче', 'Қажетті жылу беру кедергісі бойынша жылытқыш қалыңдығы'),
    badge: () => 'R, λ', keys: 'утепление утеплитель толщина минвата пенопласт стены жылытқыш',
    fields: [
      { id: 'mat', type: 'select', def: 'mw', label: lab('Утеплитель', 'Жылытқыш'), options: Object.keys(LAMBDA).map(k => ({ v: k, ru: `${LAMBDA[k][1]} (λ ≈ ${String(LAMBDA[k][0]).replace('.', ',')})`, kk: `${LAMBDA[k][2]} (λ ≈ ${String(LAMBDA[k][0]).replace('.', ',')})` })) },
      { id: 'rReq', type: 'number', def: 3.2, step: 'any', label: lab('Требуемое сопротивление R, м²·°C/Вт', 'Қажетті кедергі R, м²·°C/Вт'), hint: lab('Значение для вашего района берут из СН РК 2.04-07-2022 или у проектировщика.', 'Өңіріңіз үшін мәнді ҚР ҚН 2.04-07-2022-ден немесе жобалаушыдан алады.') },
      { id: 'rWall', type: 'number', def: 0.6, step: 'any', label: lab('Сопротивление самой стены R, м²·°C/Вт', 'Қабырғаның өз кедергісі R, м²·°C/Вт'), hint: lab('Например, кирпич 38 см ≈ 0,5–0,7', 'Мысалы, 38 см кірпіш ≈ 0,5–0,7') },
      { id: 'area', type: 'number', def: 120, step: 'any', label: lab('Площадь утепления', 'Жылыту ауданы'), suffix: lab('м²', 'м²') },
      priceField(0, 'Цена утеплителя за м³ (необязательно)', 'Жылытқыштың 1 м³ бағасы (міндетті емес)')
    ],
    calc(v, R, L) {
      const lam = LAMBDA[v.mat][0], dR = E.pos(v.rReq - v.rWall), th = dR * lam, thMm = ceil(th * 1000 / 10) * 10, vol = v.area * thMm / 1000;
      return { main: { label: t(L, 'Толщина утеплителя', 'Жылытқыш қалыңдығы'), value: `${thMm} мм`, fmt: 'text' }, cards: [{ label: t(L, 'Объём', 'Көлемі'), value: `${E.num(vol, 2)} м³`, fmt: 'text' }].concat(v.price ? [{ label: t(L, 'Стоимость', 'Құны'), value: vol * v.price }] : []), rows: [], steps: [t(L, `(${E.num(v.rReq, 2)} − ${E.num(v.rWall, 2)}) × ${E.num(lam, 3)} = ${E.num(th * 1000, 0)} мм → округлено до ${thMm} мм`, `(${E.num(v.rReq, 2)} − ${E.num(v.rWall, 2)}) × ${E.num(lam, 3)} = ${E.num(th * 1000, 0)} мм → ${thMm} мм-ге дейін дөңгелектелді`)], notes: [t(L, 'Теплопроводность λ взята типовая для сухого материала; точное значение — в паспорте утеплителя.', 'Жылу өткізгіштік λ құрғақ материал үшін типтік; нақты мән — жылытқыш төлқұжатында.')] };
    }
  });

  /* ---------- Здоровье ---------- */
  E.add({
    id: 'bmi', cat: 'health', popular: true,
    title: lab('Индекс массы тела (ИМТ)', 'Дене салмағының индексі (ДСИ)'), short: lab('ИМТ и оценка по шкале ВОЗ', 'ДСИ және ДДҰ шкаласы бойынша бағалау'),
    badge: () => 'кг/м²', keys: 'имт индекс массы тела вес рост дси салмақ',
    fields: [{ id: 'w', type: 'number', def: 70, step: 'any', label: lab('Вес', 'Салмақ'), suffix: lab('кг', 'кг') }, { id: 'h', type: 'number', def: 175, step: 'any', label: lab('Рост', 'Бой'), suffix: lab('см', 'см') }],
    calc(v, R, L) {
      if (!(v.h > 0)) return { error: t(L, 'Укажите рост', 'Бойды көрсетіңіз') };
      const b = v.w / Math.pow(v.h / 100, 2);
      const c = b < 18.5 ? t(L, 'Ниже нормы', 'Нормадан төмен') : b < 25 ? t(L, 'Норма', 'Норма') : b < 30 ? t(L, 'Избыточный вес', 'Артық салмақ') : t(L, 'Ожирение', 'Семіздік');
      const lo = 18.5 * Math.pow(v.h / 100, 2), hi = 24.9 * Math.pow(v.h / 100, 2);
      return { main: { label: t(L, 'ИМТ', 'ДСИ'), value: E.num(b, 1), fmt: 'text' }, cards: [{ label: t(L, 'Оценка ВОЗ', 'ДДҰ бағасы'), value: c, fmt: 'text' }, { label: t(L, 'Нормальный вес при этом росте', 'Осы бойдағы қалыпты салмақ'), value: `${E.num(lo, 0)}–${E.num(hi, 0)} кг`, fmt: 'text' }], rows: [], steps: [`${E.num(v.w, 'auto')} ÷ (${E.num(v.h / 100, 2)})² = ${E.num(b, 1)}`], notes: [t(L, 'ИМТ не учитывает мышечную массу, возраст и телосложение. Для оценки здоровья обратитесь к врачу.', 'ДСИ бұлшықет массасын, жасты және дене бітімін ескермейді. Денсаулықты бағалау үшін дәрігерге жүгініңіз.')] };
    }
  });

  E.add({
    id: 'calories', cat: 'health',
    title: lab('Суточная норма калорий', 'Тәуліктік калория нормасы'), short: lab('Сколько калорий нужно в день по формуле Миффлина — Сан Жеора', 'Миффлин — Сан Жеор формуласы бойынша күніне қанша калория керек'),
    badge: () => 'ккал', keys: 'калории норма в день похудение калория',
    fields: [
      { id: 'sex', type: 'seg', def: 'm', label: lab('Пол', 'Жынысы'), options: [{ v: 'm', ru: 'Мужчина', kk: 'Ер' }, { v: 'f', ru: 'Женщина', kk: 'Әйел' }] },
      { id: 'age', type: 'number', def: 30, min: 14, max: 100, label: lab('Возраст', 'Жасы'), suffix: lab('лет', 'жас') },
      { id: 'w', type: 'number', def: 70, step: 'any', half: true, label: lab('Вес', 'Салмақ'), suffix: lab('кг', 'кг') }, { id: 'h', type: 'number', def: 175, step: 'any', half: true, label: lab('Рост', 'Бой'), suffix: lab('см', 'см') },
      { id: 'act', type: 'select', def: '1.375', label: lab('Активность', 'Белсенділік'), options: [{ v: '1.2', ru: 'Почти нет движения', kk: 'Қозғалыс жоққа тән' }, { v: '1.375', ru: 'Лёгкие тренировки 1–3 раза в неделю', kk: 'Аптасына 1–3 рет жеңіл жаттығу' }, { v: '1.55', ru: 'Тренировки 3–5 раз в неделю', kk: 'Аптасына 3–5 рет жаттығу' }, { v: '1.725', ru: 'Интенсивно 6–7 раз в неделю', kk: 'Аптасына 6–7 рет қарқынды' }, { v: '1.9', ru: 'Тяжёлая физическая работа', kk: 'Ауыр дене жұмысы' }] }
    ],
    calc(v, R, L) {
      const bmr = 10 * v.w + 6.25 * v.h - 5 * v.age + (v.sex === 'm' ? 5 : -161), tdee = bmr * +v.act;
      return { main: { label: t(L, 'Поддержание веса', 'Салмақты сақтау'), value: `${E.num(tdee)} ккал`, fmt: 'text' }, cards: [{ label: t(L, 'Базовый обмен', 'Базалық алмасу'), value: `${E.num(bmr)} ккал`, fmt: 'text' }], rows: [], steps: [`BMR = 10 × ${E.num(v.w, 'auto')} + 6,25 × ${E.num(v.h, 'auto')} − 5 × ${v.age} ${v.sex === 'm' ? '+ 5' : '− 161'} = ${E.num(bmr)}`, `× ${String(v.act).replace('.', ',')} = ${E.num(tdee)}`], notes: [t(L, 'Это средняя оценка для здорового взрослого. Цели по весу и питанию лучше обсуждать с врачом.', 'Бұл сау ересек адам үшін орташа баға. Салмақ пен тамақтану мақсаттарын дәрігермен талқылаған дұрыс.')] };
    }
  });

  E.add({
    id: 'pregnancy', cat: 'health',
    title: lab('Калькулятор беременности', 'Жүктілік калькуляторы'), short: lab('Срок беременности и предполагаемая дата родов', 'Жүктілік мерзімі және болжамды босану күні'),
    badge: () => '40 нед.', keys: 'беременность срок дата родов пдр жүктілік босану',
    fields: [{ id: 'by', type: 'seg', def: 'lmp', label: lab('Считать от', 'Неден есептеу'), options: [{ v: 'lmp', ru: 'Первого дня последних месячных', kk: 'Соңғы етеккірдің бірінші күні' }, { v: 'conc', ru: 'Даты зачатия', kk: 'Ұрықтану күні' }] }, { id: 'd', type: 'date', def: '2026-06-01', label: lab('Дата', 'Күні') }, { id: 'on', type: 'date', def: 'today', label: lab('Срок на дату', 'Күнгі мерзім') }],
    calc(v, R, L) {
      const d = E.parseDate(v.d), on = E.parseDate(v.on);
      if (!d || !on) return { error: t(L, 'Укажите даты', 'Күндерді көрсетіңіз') };
      const lmp = v.by === 'lmp' ? d : new Date(d.getTime() - 14 * 86400000), due = new Date(lmp.getTime() + 280 * 86400000), days = E.daysBetween(lmp, on);
      const wk = Math.floor(days / 7), dd = days % 7, tri = wk < 14 ? 1 : wk < 28 ? 2 : 3;
      return { main: { label: t(L, 'Предполагаемая дата родов', 'Болжамды босану күні'), value: E.fmtDate(due, L), fmt: 'text' }, cards: [{ label: t(L, 'Срок', 'Мерзімі'), value: days >= 0 ? t(L, `${wk} нед. ${dd} дн.`, `${wk} апта ${dd} күн`) : '—', fmt: 'text' }, { label: t(L, 'Триместр', 'Триместр'), value: days >= 0 ? tri : '—', fmt: 'text' }], rows: [], steps: [t(L, 'Дата родов = первый день последних месячных + 280 дней (правило Негеле).', 'Босану күні = соңғы етеккірдің бірінші күні + 280 күн (Негеле ережесі).')], notes: [t(L, 'Это ориентир. Точный срок определяет врач по УЗИ.', 'Бұл бағдар. Нақты мерзімді дәрігер УДЗ бойынша анықтайды.')] };
    }
  });

  E.add({
    id: 'body-fat', cat: 'health',
    title: lab('Процент жира в организме', 'Ағзадағы май пайызы'), short: lab('Оценка по обхватам тела (формула ВМС США)', 'Дене өлшемдері бойынша бағалау (АҚШ ӘТК формуласы)'),
    badge: () => '%', keys: 'процент жира организм обхват талии май пайызы',
    fields: [{ id: 'sex', type: 'seg', def: 'm', label: lab('Пол', 'Жынысы'), options: [{ v: 'm', ru: 'Мужчина', kk: 'Ер' }, { v: 'f', ru: 'Женщина', kk: 'Әйел' }] }, { id: 'h', type: 'number', def: 175, step: 'any', label: lab('Рост', 'Бой'), suffix: lab('см', 'см') }, { id: 'neck', type: 'number', def: 38, step: 'any', half: true, label: lab('Шея', 'Мойын'), suffix: lab('см', 'см') }, { id: 'waist', type: 'number', def: 85, step: 'any', half: true, label: lab('Талия (на уровне пупка)', 'Бел (кіндік деңгейінде)'), suffix: lab('см', 'см') }, { id: 'hip', type: 'number', def: 95, step: 'any', when: v => v.sex === 'f', label: lab('Бёдра', 'Жамбас'), suffix: lab('см', 'см') }],
    calc(v, R, L) {
      const lg = Math.log10, x = v.sex === 'm' ? v.waist - v.neck : v.waist + v.hip - v.neck;
      if (!(x > 0 && v.h > 0)) return { error: t(L, 'Проверьте обхваты', 'Өлшемдерді тексеріңіз') };
      const bf = v.sex === 'm' ? 495 / (1.0324 - 0.19077 * lg(x) + 0.15456 * lg(v.h)) - 450 : 495 / (1.29579 - 0.35004 * lg(x) + 0.221 * lg(v.h)) - 450;
      return { main: { label: t(L, 'Жир', 'Май'), value: `${E.num(bf, 1)}%`, fmt: 'text' }, rows: [], steps: [], notes: [t(L, 'Погрешность метода — около 3–4%. Точнее измеряют биоимпедансом или DEXA.', 'Әдістің қателігі — шамамен 3–4%. Дәлірек биоимпеданс немесе DEXA арқылы өлшейді.')] };
    }
  });

  E.add({
    id: 'sleep', cat: 'health',
    title: lab('Калькулятор сна', 'Ұйқы калькуляторы'), short: lab('Когда лечь, чтобы проснуться между циклами сна', 'Ұйқы циклдері арасында ояну үшін қашан жату керек'),
    badge: () => '90 мин', keys: 'сон циклы сна когда лечь проснуться ұйқы',
    fields: [{ id: 'mode', type: 'seg', def: 'wake', label: lab('Я знаю', 'Мен білемін'), options: [{ v: 'wake', ru: 'Когда встать', kk: 'Қашан тұру' }, { v: 'bed', ru: 'Когда лягу', kk: 'Қашан жатамын' }] }, { id: 'tm', type: 'time', def: '07:00', label: lab('Время', 'Уақыт') }],
    calc(v, R, L) {
      const mm = /^(\d{1,2}):(\d{2})/.exec(v.tm || ''); if (!mm) return { error: t(L, 'Укажите время', 'Уақытты көрсетіңіз') };
      const base = +mm[1] * 60 + +mm[2], f = x => { x = ((x % 1440) + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };
      const opts = [6, 5, 4].map(c => [c, v.mode === 'wake' ? f(base - c * 90 - 15) : f(base + c * 90 + 15)]);
      return { main: { label: v.mode === 'wake' ? t(L, 'Лучше лечь в', 'Жатқан дұрыс') : t(L, 'Лучше встать в', 'Тұрған дұрыс'), value: opts[0][1], fmt: 'text' }, rows: opts.map(o => R1(L, `${o[0]} циклов (${E.num(o[0] * 1.5, 1)} ч)`, `${o[0]} цикл (${E.num(o[0] * 1.5, 1)} сағ)`, o[1], 'text')), steps: [t(L, 'Цикл сна ≈ 90 минут, плюс около 15 минут на засыпание.', 'Ұйқы циклі ≈ 90 минут, оған ұйықтап кетуге 15 минуттай қосылады.')], notes: [] };
    }
  });

  E.add({
    id: 'water-intake', cat: 'health',
    title: lab('Норма воды в день', 'Күндік су нормасы'), short: lab('Сколько воды пить с учётом веса, спорта и жары', 'Салмақ, спорт және ыстықты ескеріп қанша су ішу керек'),
    badge: () => 'л', keys: 'норма воды сколько пить воду в день су нормасы',
    fields: [{ id: 'w', type: 'number', def: 70, step: 'any', label: lab('Вес', 'Салмақ'), suffix: lab('кг', 'кг') }, { id: 'sport', type: 'number', def: 30, min: 0, max: 600, label: lab('Тренировки в день', 'Күніне жаттығу'), suffix: lab('мин', 'мин') }, { id: 'hot', type: 'check', def: false, label: lab('Жаркая погода', 'Ыстық ауа райы') }],
    calc(v, R, L) {
      const l = v.w * 0.03 + v.sport / 60 * 0.5 + (v.hot ? 0.5 : 0);
      return { main: { label: t(L, 'В день', 'Күніне'), value: `${E.num(l, 1)} л`, fmt: 'text' }, cards: [{ label: t(L, 'Стаканов по 250 мл', '250 мл стақан'), value: Math.ceil(l / 0.25), fmt: 'num' }], rows: [], steps: [t(L, `${E.num(v.w, 'auto')} кг × 30 мл + 0,5 л на час тренировки${v.hot ? ' + 0,5 л в жару' : ''}`, `${E.num(v.w, 'auto')} кг × 30 мл + жаттығудың әр сағатына 0,5 л${v.hot ? ' + ыстықта 0,5 л' : ''}`)], notes: [t(L, 'Ориентир для здорового человека; часть воды поступает с едой. При болезнях почек и сердца норму определяет врач.', 'Сау адамға арналған бағдар; судың бір бөлігі тамақпен түседі. Бүйрек пен жүрек аурулары кезінде норманы дәрігер белгілейді.')] };
    }
  });

  E.add({
    id: 'alcohol-blood', cat: 'health',
    title: lab('Алкоголь в крови', 'Қандағы алкоголь'), short: lab('Примерная концентрация алкоголя и время выведения (формула Видмарка)', 'Алкогольдің шамамен концентрациясы және шығу уақыты (Видмарк формуласы)'),
    badge: () => '‰', keys: 'алкоголь в крови промилле видмарк когда за руль алкоголь',
    fields: [{ id: 'sex', type: 'seg', def: 'm', label: lab('Пол', 'Жынысы'), options: [{ v: 'm', ru: 'Мужчина', kk: 'Ер' }, { v: 'f', ru: 'Женщина', kk: 'Әйел' }] }, { id: 'w', type: 'number', def: 75, step: 'any', label: lab('Вес', 'Салмақ'), suffix: lab('кг', 'кг') }, { id: 'ml', type: 'number', def: 500, step: 'any', half: true, label: lab('Выпито', 'Ішілді'), suffix: lab('мл', 'мл') }, { id: 'abv', type: 'percent', def: 5, min: 0, max: 96, step: 'any', half: true, label: lab('Крепость', 'Күші') }, { id: 'hrs', type: 'number', def: 1, min: 0, max: 48, step: 'any', label: lab('Прошло часов с начала', 'Басталғаннан бері өткен сағат'), suffix: lab('ч', 'сағ') }],
    calc(v, R, L) {
      const g = v.ml * v.abv / 100 * 0.789, r = v.sex === 'm' ? 0.68 : 0.55, peak = g / (v.w * r), now = E.pos(peak - 0.15 * v.hrs), left = now / 0.15;
      return { main: { label: t(L, 'Сейчас примерно', 'Қазір шамамен'), value: `${E.num(now, 2)} ‰`, fmt: 'text' }, cards: [{ label: t(L, 'Выведется примерно через', 'Шамамен шығады'), value: t(L, `${E.num(left, 1)} ч`, `${E.num(left, 1)} сағ`), fmt: 'text' }, { label: t(L, 'Чистого спирта', 'Таза спирт'), value: `${E.num(g, 1)} г`, fmt: 'text' }], rows: [], steps: [`${E.num(g, 1)} г ÷ (${E.num(v.w, 'auto')} кг × ${String(r).replace('.', ',')}) − 0,15‰ × ${E.num(v.hrs, 'auto')} ч = ${E.num(now, 2)} ‰`], notes: [t(L, 'Это грубая оценка: реальная скорость выведения у людей разная. Не используйте расчёт, чтобы решить, можно ли садиться за руль. После алкоголя безопасно только не водить.', 'Бұл өрескел баға: шығу жылдамдығы әр адамда әртүрлі. Рөлге отыруға болатынын шешу үшін есепті пайдаланбаңыз. Алкогольден кейін көлік жүргізбеу ғана қауіпсіз.')] };
    }
  });

  E.add({
    id: 'bad-habits-cost', cat: 'health',
    title: lab('Стоимость курения и алкоголя', 'Темекі мен алкогольдің құны'), short: lab('Сколько уходит на вредные привычки и сколько дал бы вклад', 'Зиянды әдеттерге қанша кетеді және салым қанша берер еді'),
    badge: () => '₸/год', keys: 'стоимость курения сигареты алкоголь расходы темекі',
    fields: [{ id: 'packs', type: 'number', def: 1, step: 'any', label: lab('Пачек сигарет в день', 'Күніне темекі қорабы'), suffix: lab('шт.', 'дана') }, { id: 'pp', type: 'money', def: 1300, label: lab('Цена пачки', 'Қорап бағасы') }, { id: 'alc', type: 'money', def: 5000, label: lab('На алкоголь в неделю', 'Аптасына алкогольге') }, { id: 'years', type: 'number', def: 10, min: 1, max: 50, label: lab('Горизонт', 'Мерзім'), suffix: lab('лет', 'жыл') }, { id: 'rate', type: 'percent', def: 12, min: 0, max: 50, step: 'any', adv: true, label: lab('Доходность вклада, % годовых', 'Салым кірістілігі, жылдық %') }],
    calc(v, R, L) {
      const month = v.packs * v.pp * 30.44 + v.alc * 52.18 / 12, year = month * 12, n = Math.round(v.years) * 12, i = v.rate / 1200;
      const fv = i ? month * (Math.pow(1 + i, n) - 1) / i : month * n;
      return { main: { label: t(L, 'Уходит в год', 'Жылына кетеді'), value: year }, cards: [{ label: t(L, 'В месяц', 'Айына'), value: month }, { label: t(L, `На вкладе за ${Math.round(v.years)} лет`, `${Math.round(v.years)} жылда салымда`), value: fv }], rows: [], steps: [t(L, 'Если каждый месяц откладывать эту сумму на вклад с ежемесячной капитализацией.', 'Егер бұл соманы ай сайын ай сайынғы капиталдандырумен салымға салса.')], notes: [] };
    }
  });

  /* ---------- Религиозные ---------- */
  E.add({
    id: 'zakat', cat: 'religious',
    title: lab('Калькулятор закята', 'Зекет калькуляторы'), short: lab('Закят 2,5% с имущества сверх нисаба', 'Нисабтан асқан мүліктен 2,5% зекет'),
    badge: () => '2,5%', keys: 'закят зекет нисаб золото',
    fields: [{ id: 'cash', type: 'money', def: 6000000, label: lab('Деньги на счетах и наличные', 'Шоттағы және қолма-қол ақша') }, { id: 'gold', type: 'money', def: 0, label: lab('Золото и серебро (стоимость)', 'Алтын мен күміс (құны)') }, { id: 'goods', type: 'money', def: 0, label: lab('Товары для продажи', 'Сатуға арналған тауарлар') }, { id: 'debts', type: 'money', def: 0, label: lab('Долги, которые надо вернуть сейчас', 'Қазір қайтару керек қарыздар') }, { id: 'gp', type: 'money', def: 60000, label: lab('Цена 1 грамма золота', '1 грамм алтынның бағасы'), hint: lab('Нисаб = 85 г золота. Цену уточните на день расчёта.', 'Нисаб = 85 г алтын. Бағаны есеп күніне нақтылаңыз.') }],
    calc(v, R, L) {
      const base = E.pos(v.cash + v.gold + v.goods - v.debts), nisab = 85 * v.gp, due = base >= nisab ? base * 0.025 : 0;
      return { main: { label: t(L, 'Закят', 'Зекет'), value: due }, cards: [{ label: t(L, 'Нисаб', 'Нисаб'), value: nisab }, { label: t(L, 'Облагаемое имущество', 'Зекет берілетін мүлік'), value: base }], rows: [], steps: [base >= nisab ? `${m(base)} × 2,5% = ${m(due)}` : t(L, 'Имущество меньше нисаба — закят не обязателен.', 'Мүлік нисабтан аз — зекет міндетті емес.')], notes: [t(L, 'Закят выплачивают, если имущество не ниже нисаба в течение лунного года. По сложным вопросам обратитесь к имаму или в ДУМК.', 'Мүлік ай жылы бойы нисабтан кем болмаса, зекет беріледі. Күрделі сұрақтар бойынша имамға немесе ҚМДБ-ға жүгініңіз.')] };
    }
  });

  E.add({
    id: 'kurban-sacrifice', cat: 'religious',
    title: lab('Расходы на курбан', 'Құрбандық шығындары'), short: lab('Стоимость жертвоприношения на Курбан айт на человека', 'Құрбан айтқа құрбандықтың бір адамға құны'),
    badge: (R, L) => t(L, 'Курбан айт', 'Құрбан айт'), keys: 'курбан айт жертвоприношение баран корова құрбандық',
    fields: [{ id: 'an', type: 'select', def: 'sheep', label: lab('Животное', 'Мал'), options: [{ v: 'sheep', ru: 'Баран или коза (1 человек)', kk: 'Қой немесе ешкі (1 адам)' }, { v: 'cow', ru: 'Корова или бык (до 7 человек)', kk: 'Сиыр немесе өгіз (7 адамға дейін)' }] }, { id: 'price', type: 'money', def: 90000, label: lab('Цена животного', 'Малдың бағасы') }, { id: 'n', type: 'number', def: 7, min: 1, max: 7, when: v => v.an === 'cow', label: lab('Сколько человек в доле', 'Үлесте неше адам'), suffix: lab('чел.', 'адам') }, { id: 'extra', type: 'money', def: 10000, label: lab('Забой, разделка, доставка', 'Сою, бөлшектеу, жеткізу') }, { id: 'meat', type: 'number', def: 20, step: 'any', adv: true, label: lab('Вес мяса', 'Ет салмағы'), suffix: lab('кг', 'кг') }],
    calc(v, R, L) {
      const n = v.an === 'cow' ? Math.max(1, Math.round(v.n)) : 1, tot = v.price + v.extra, per = tot / n, kg = v.meat / n / 3;
      return { main: { label: t(L, 'На одного участника', 'Бір қатысушыға'), value: per }, cards: [{ label: t(L, 'Всего', 'Барлығы'), value: tot }], rows: v.meat ? [R1(L, 'Мясо на участника: себе / родным / нуждающимся', 'Қатысушыға ет: өзіне / туыстарға / мұқтаждарға', `${E.num(kg, 1)} кг × 3`, 'text')] : [], steps: [`(${m(v.price)} + ${m(v.extra)}) ÷ ${n} = ${m(per)}`], notes: [t(L, 'Мясо по традиции делят на три части: себе, родственникам и нуждающимся. Требования к животному уточняйте в ДУМК.', 'Ет дәстүр бойынша үш бөлікке бөлінеді: өзіне, туыстарға және мұқтаждарға. Малға қойылатын талаптарды ҚМДБ-дан нақтылаңыз.')] };
    }
  });

  E.add({
    id: 'ramadan-sadaqah', cat: 'religious',
    title: lab('Фитр-садака и фидия', 'Пітір садақа және фидия'), short: lab('Сколько отдать за семью в Рамадан', 'Рамазанда отбасы үшін қанша беру керек'),
    badge: () => '735 ₸', keys: 'фитр садака фидия рамадан ораза пітір',
    fields: [{ id: 'n', type: 'number', def: 4, min: 0, max: 50, label: lab('Членов семьи (включая детей)', 'Отбасы мүшелері (балаларды қоса)'), suffix: lab('чел.', 'адам') }, { id: 'fitr', type: 'select', def: '735', label: lab('Фитр-садака на человека (ДУМК, 2026)', 'Бір адамға пітір садақа (ҚМДБ, 2026)'), options: [{ v: '735', ru: '735 ₸ — 2 кг муки', kk: '735 ₸ — 2 кг ұн' }, { v: '318', ru: '318 ₸ — 2 кг пшеницы', kk: '318 ₸ — 2 кг бидай' }, { v: '514', ru: '514 ₸ — 4 кг ячменя', kk: '514 ₸ — 4 кг арпа' }, { v: '6400', ru: '6 400 ₸ — 2 кг изюма', kk: '6 400 ₸ — 2 кг мейіз' }, { v: '12400', ru: '12 400 ₸ — 4 кг фиников', kk: '12 400 ₸ — 4 кг құрма' }] }, { id: 'days', type: 'number', def: 0, min: 0, max: 30, label: lab('Пропущенных дней поста (фидия)', 'Өткізілген ораза күндері (фидия)'), suffix: lab('дн.', 'күн') }, { id: 'fid', type: 'money', def: 4000, label: lab('Фидия за день (ДУМК, 2026)', 'Күніне фидия (ҚМДБ, 2026)') }],
    calc(v, R, L) {
      const f = Math.round(v.n) * +v.fitr, fd = Math.round(v.days) * v.fid;
      return { main: { label: t(L, 'Итого', 'Барлығы'), value: f + fd }, cards: [{ label: t(L, 'Фитр-садака', 'Пітір садақа'), value: f }, { label: t(L, 'Фидия', 'Фидия'), value: fd }], rows: [], steps: [`${Math.round(v.n)} × ${m(+v.fitr)} + ${Math.round(v.days)} × ${m(v.fid)} = ${m(f + fd)}`], notes: [t(L, 'Суммы на 2026 год объявило Духовное управление мусульман Казахстана. Фидию платят только те, кто не может держать пост по уважительной причине.', '2026 жылғы сомаларды Қазақстан мұсылмандары діни басқармасы жариялады. Фидияны тек дәлелді себеппен ораза ұстай алмайтындар төлейді.')] };
    }
  });

  /* Фараиз: супруг(а), сыновья, дочери, отец, мать */
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
  E.add({
    id: 'islamic-inheritance', cat: 'religious',
    title: lab('Исламское наследство (фараиз)', 'Ислами мұра (фараиз)'), short: lab('Предварительный раздел долей между близкими наследниками', 'Жақын мұрагерлер арасында үлестерді алдын ала бөлу'),
    badge: () => '½ ¼ ⅛', keys: 'фараиз наследство шариат доли мирас мұра',
    fields: [{ id: 'estate', type: 'money', def: 30000000, label: lab('Наследство после долгов и завещания', 'Қарыз бен өсиеттен кейінгі мұра') }, { id: 'sp', type: 'select', def: 'wife', label: lab('Супруг(а) умершего', 'Марқұмның жұбайы'), options: [{ v: 'none', ru: 'Нет', kk: 'Жоқ' }, { v: 'husband', ru: 'Муж', kk: 'Күйеуі' }, { v: 'wife', ru: 'Жена', kk: 'Әйелі' }] }, { id: 'sons', type: 'number', def: 1, min: 0, max: 20, half: true, label: lab('Сыновей', 'Ұлдары'), suffix: lab('чел.', 'адам') }, { id: 'daughters', type: 'number', def: 1, min: 0, max: 20, half: true, label: lab('Дочерей', 'Қыздары'), suffix: lab('чел.', 'адам') }, { id: 'father', type: 'check', def: false, label: lab('Отец жив', 'Әкесі тірі') }, { id: 'mother', type: 'check', def: false, label: lab('Мать жива', 'Анасы тірі') }],
    calc(v, R, L) {
      const h = { husband: v.sp === 'husband', wives: v.sp === 'wife' ? 1 : 0, sons: Math.round(v.sons), daughters: Math.round(v.daughters), father: v.father, mother: v.mother };
      const r = E.faraid(h), names = { husband: t(L, 'Муж', 'Күйеуі'), wives: t(L, 'Жена', 'Әйелі'), mother: t(L, 'Мать', 'Анасы'), father: t(L, 'Отец', 'Әкесі'), sons: t(L, `Сыновья (${h.sons}), каждому поровну`, `Ұлдар (${h.sons}), әрқайсысына тең`), daughters: t(L, `Дочери (${h.daughters}), каждой поровну`, `Қыздар (${h.daughters}), әрқайсысына тең`) };
      const rows = Object.keys(r.share).map(k => ({ label: `${names[k]} — ${E.num(r.share[k] * 100, 2)}%`, value: v.estate * r.share[k] }));
      if (!rows.length) return { error: t(L, 'Укажите хотя бы одного наследника', 'Кемінде бір мұрагерді көрсетіңіз') };
      const notes = [t(L, 'Учтены только супруг(а), дети и родители. Если есть братья, сёстры, внуки, деды или несколько жён, доли меняются — обратитесь к имаму или в ДУМК. По закону РК наследство делится по Гражданскому кодексу; раздел по шариату возможен по соглашению наследников.', 'Тек жұбайы, балалары және ата-анасы ескерілді. Аға-інілері, апа-сіңлілері, немерелері, аталары немесе бірнеше әйелі болса, үлестер өзгереді — имамға немесе ҚМДБ-ға жүгініңіз. ҚР заңы бойынша мұра Азаматтық кодекспен бөлінеді; шариат бойынша бөлу мұрагерлердің келісімімен мүмкін.')];
      if (r.awl) notes.unshift(t(L, 'Сумма долей превысила целое — применён ауль (пропорциональное уменьшение).', 'Үлестер сомасы бүтіннен асты — ауль (пропорционалды азайту) қолданылды.'));
      if (r.radd) notes.unshift(t(L, 'Остаток возвращён наследникам пропорционально долям (радд).', 'Қалдық мұрагерлерге үлестеріне сай қайтарылды (радд).'));
      return { main: { label: t(L, 'Наследство', 'Мұра'), value: v.estate }, rows, steps: [], notes };
    }
  });

  E.add({
    id: 'hajj', cat: 'religious',
    title: lab('Хадж и умра: бюджет', 'Қажылық пен умра: бюджет'), short: lab('Сколько стоит поездка на хадж или умру', 'Қажылыққа немесе умраға сапар қанша тұрады'),
    badge: (R, L) => t(L, 'бюджет', 'бюджет'), keys: 'хадж умра стоимость поездки мекка қажылық',
    fields: [{ id: 'pkg', type: 'money', def: 2500000, label: lab('Пакет туроператора на человека', 'Бір адамға туроператор пакеті') }, { id: 'n', type: 'number', def: 1, min: 1, max: 20, label: lab('Сколько человек', 'Неше адам'), suffix: lab('чел.', 'адам') }, { id: 'ins', type: 'money', def: 30000, label: lab('Страховка и документы на человека', 'Бір адамға сақтандыру мен құжаттар') }, { id: 'qurb', type: 'money', def: 120000, label: lab('Жертвоприношение в Мекке на человека', 'Бір адамға Меккедегі құрбандық') }, { id: 'pocket', type: 'money', def: 300000, label: lab('Карманные расходы на человека', 'Бір адамға қалта шығындары') }],
    calc(v, R, L) {
      const per = v.pkg + v.ins + v.qurb + v.pocket, n = Math.max(1, Math.round(v.n));
      return { main: { label: t(L, 'Всего', 'Барлығы'), value: per * n }, cards: [{ label: t(L, 'На человека', 'Бір адамға'), value: per }], rows: [], steps: [`(${m(v.pkg)} + ${m(v.ins)} + ${m(v.qurb)} + ${m(v.pocket)}) × ${n}`], notes: [t(L, 'Цены пакетов меняются каждый сезон — введите предложение вашего туроператора. Квоты на хадж распределяет ДУМК.', 'Пакет бағалары әр маусым сайын өзгереді — туроператорыңыздың ұсынысын енгізіңіз. Қажылық квоталарын ҚМДБ бөледі.')] };
    }
  });

  E.add({
    id: 'islamic-mortgage', cat: 'religious',
    title: lab('Исламская ипотека (мурабаха)', 'Исламдық ипотека (мурабаха)'), short: lab('Платёж по мурабахе и сравнение с обычной ипотекой', 'Мурабаха бойынша төлем және кәдімгі ипотекамен салыстыру'),
    badge: (R, L) => t(L, 'наценка', 'үстеме'), keys: 'исламская ипотека мурабаха иджара наценка исламдық',
    fields: [{ id: 'price', type: 'money', def: 30000000, label: lab('Стоимость жилья', 'Тұрғын үй құны') }, { id: 'down', type: 'money', def: 6000000, label: lab('Первоначальный взнос', 'Бастапқы жарна') }, { id: 'mk', type: 'percent', def: 12, min: 0, max: 60, step: 'any', label: lab('Наценка банка в год', 'Банктің жылдық үстемесі') }, { id: 'months', type: 'number', def: 120, min: 1, max: 360, label: lab('Срок', 'Мерзімі'), suffix: lab('мес.', 'ай') }, { id: 'rate', type: 'percent', def: 18, min: 0, max: 60, step: 'any', adv: true, label: lab('Ставка обычной ипотеки для сравнения', 'Салыстыру үшін кәдімгі ипотека мөлшерлемесі') }],
    calc(v, R, L) {
      const S = E.pos(v.price - v.down), n = Math.max(1, Math.round(v.months)), markup = S * v.mk / 100 * n / 12, pay = (S + markup) / n, i = v.rate / 1200, ann = i ? S * i / (1 - Math.pow(1 + i, -n)) : S / n;
      return { main: { label: t(L, 'Платёж в месяц', 'Айлық төлем'), value: pay, fmt: 'money2' }, cards: [{ label: t(L, 'Наценка за весь срок', 'Бүкіл мерзімге үстеме'), value: markup }, { label: t(L, 'Обычная ипотека: платёж', 'Кәдімгі ипотека: төлем'), value: ann, fmt: 'money2' }], rows: [R1(L, 'Банк покупает жильё и продаёт вам дороже на', 'Банк тұрғын үйді сатып алып, сізге қымбатырақ сатады', markup), R1(L, 'Переплата по обычной ипотеке', 'Кәдімгі ипотека бойынша артық төлем', ann * n - S, 'money2')], steps: [`(${m(S)} + ${m(markup)}) ÷ ${n} = ${m(pay, 2)}`], notes: [t(L, 'Наценка фиксируется при сделке и не меняется. Точные условия — в исламском банке.', 'Үстеме мәміле кезінде бекітіліп, өзгермейді. Нақты шарттар — исламдық банкте.')] };
    }
  });

  /* ---------- Образование ---------- */
  const GPA = [['A', 4, 'Отлично', 'Өте жақсы'], ['A-', 3.67, 'Отлично', 'Өте жақсы'], ['B+', 3.33, 'Хорошо', 'Жақсы'], ['B', 3, 'Хорошо', 'Жақсы'], ['B-', 2.67, 'Хорошо', 'Жақсы'], ['C+', 2.33, 'Хорошо', 'Жақсы'], ['C', 2, 'Удовлетворительно', 'Қанағаттанарлық'], ['C-', 1.67, 'Удовлетворительно', 'Қанағаттанарлық'], ['D+', 1.33, 'Удовлетворительно', 'Қанағаттанарлық'], ['D', 1, 'Удовлетворительно', 'Қанағаттанарлық'], ['FX', 0.5, 'Неудовлетворительно', 'Қанағаттанарлықсыз'], ['F', 0, 'Неудовлетворительно', 'Қанағаттанарлықсыз']];
  const gf = [];
  for (let i = 1; i <= 8; i++) {
    gf.push({ id: 'g' + i, type: 'select', def: i <= 3 ? ['A', 'B+', 'A-'][i - 1] : '', half: true, label: lab(`Дисциплина ${i}: оценка`, `${i}-пән: баға`), options: [{ v: '', ru: '—', kk: '—' }].concat(GPA.map(g => ({ v: g[0], ru: g[0], kk: g[0] }))) });
    gf.push({ id: 'c' + i, type: 'number', def: i <= 3 ? 5 : 5, min: 0, max: 30, half: true, label: lab('Кредиты (ECTS)', 'Кредиттер (ECTS)') });
  }
  E.add({
    id: 'gpa', cat: 'education', popular: false,
    title: lab('Калькулятор GPA', 'GPA калькуляторы'), short: lab('Средний балл GPA по казахстанской шкале с учётом кредитов', 'Кредиттерді ескеріп қазақстандық шкала бойынша GPA'),
    badge: () => '4,0', keys: 'gpa средний балл оценки кредиты университет',
    fields: gf,
    calc(v, R, L) {
      let pts = 0, cr = 0;
      for (let i = 1; i <= 8; i++) { const g = GPA.find(x => x[0] === v['g' + i]); if (g && v['c' + i] > 0) { pts += g[1] * v['c' + i]; cr += v['c' + i]; } }
      if (!cr) return { error: t(L, 'Выберите хотя бы одну оценку', 'Кемінде бір бағаны таңдаңыз') };
      const gpa = pts / cr, trad = gpa >= 3.67 ? t(L, 'Отлично', 'Өте жақсы') : gpa >= 2.33 ? t(L, 'Хорошо', 'Жақсы') : gpa >= 1 ? t(L, 'Удовлетворительно', 'Қанағаттанарлық') : t(L, 'Неудовлетворительно', 'Қанағаттанарлықсыз');
      return { main: { label: 'GPA', value: E.num(gpa, 2), fmt: 'text' }, cards: [{ label: t(L, 'Традиционная оценка', 'Дәстүрлі баға'), value: trad, fmt: 'text' }, { label: t(L, 'Кредитов', 'Кредит'), value: cr, fmt: 'num' }], rows: [], steps: [t(L, `Σ(балл × кредиты) ÷ Σ кредитов = ${E.num(pts, 2)} ÷ ${E.num(cr, 'auto')} = ${E.num(gpa, 2)}`, `Σ(балл × кредит) ÷ Σ кредит = ${E.num(pts, 2)} ÷ ${E.num(cr, 'auto')} = ${E.num(gpa, 2)}`)], table: { title: t(L, 'Шкала оценок', 'Бағалар шкаласы'), head: [t(L, 'Буква', 'Әріп'), 'GPA', t(L, 'Оценка', 'Баға')], fmt: ['text', 'text', 'text'], rows: GPA.map(g => [g[0], E.num(g[1], 2), t(L, g[2], g[3])]) }, notes: [] };
    }
  });

  E.add({
    id: 'ent-score', cat: 'education', popular: false,
    title: lab('Калькулятор баллов ЕНТ', 'ҰБТ балдарының калькуляторы'), short: lab('Сумма баллов ЕНТ и проверка пороговых баллов', 'ҰБТ балдарының қосындысы және шекті балдарды тексеру'),
    badge: () => '140', keys: 'ент баллы порог грант тест ұбт',
    fields: [{ id: 'hist', type: 'number', def: 15, min: 0, max: 20, label: lab('История Казахстана (из 20)', 'Қазақстан тарихы (20-дан)') }, { id: 'math', type: 'number', def: 7, min: 0, max: 10, label: lab('Математическая грамотность (из 10)', 'Математикалық сауаттылық (10-нан)') }, { id: 'read', type: 'number', def: 8, min: 0, max: 10, label: lab('Грамотность чтения (из 10)', 'Оқу сауаттылығы (10-нан)') }, { id: 'p1', type: 'number', def: 35, min: 0, max: 50, label: lab('Профильный предмет 1 (из 50)', '1-бейіндік пән (50-ден)') }, { id: 'p2', type: 'number', def: 30, min: 0, max: 50, label: lab('Профильный предмет 2 (из 50)', '2-бейіндік пән (50-ден)') }],
    calc(v, R, L) {
      const s = [v.hist, v.math, v.read, v.p1, v.p2].map(x => Math.round(x)), tot = s.reduce((a, b) => a + b, 0);
      const minOk = s[0] >= 5 && s[1] >= 3 && s[2] >= 3 && s[3] >= 5 && s[4] >= 5;
      const th = [[50, 'Большинство направлений, сельское хозяйство, ветеринария', 'Көптеген бағыттар, ауыл шаруашылығы, ветеринария'], [65, 'Национальные вузы', 'Ұлттық ЖОО'], [70, 'Здравоохранение', 'Денсаулық сақтау'], [75, 'Педагогика и право', 'Педагогика және құқық']];
      return { main: { label: t(L, 'Сумма баллов', 'Балдар қосындысы'), value: t(L, `${tot} из 140`, `140-тан ${tot}`), fmt: 'text' }, rows: th.map(x => ({ label: `${t(L, x[1], x[2])} — ${x[0]}`, value: minOk && tot >= x[0] ? t(L, 'проходит', 'өтеді') : t(L, 'не проходит', 'өтпейді'), fmt: 'text' })), steps: [], notes: [t(L, 'Минимум по предметам: история и профильные — от 5, грамотность чтения и математическая грамотность — от 3. Пороги — по Типовым правилам приёма; проходной балл на грант каждый год свой. Сверяйте с testcenter.kz.', 'Пәндер бойынша ең аз: тарих пен бейіндік — 5-тен, оқу және математикалық сауаттылық — 3-тен. Шектер — Қабылдаудың үлгілік қағидалары бойынша; грантқа өту балы жыл сайын әртүрлі. testcenter.kz-пен салыстырыңыз.')].concat(minOk ? [] : [t(L, 'Не набран минимум по одному из предметов — к конкурсу не допускают.', 'Пәндердің бірі бойынша ең аз балл жиналмады — конкурсқа жіберілмейді.')]) };
    }
  });

  /* ---------- Недвижимость ---------- */
  E.add({
    id: 'fair-rental-price', cat: 'property',
    title: lab('Цена аренды по доходности', 'Кірістілік бойынша жалдау бағасы'), short: lab('Какую аренду ставить, чтобы квартира окупалась', 'Пәтер ақталуы үшін қандай жалдау ақысын қою керек'),
    badge: () => '%', keys: 'аренда квартиры цена посуточно доходность сдать жалдау',
    fields: [{ id: 'price', type: 'money', def: 30000000, label: lab('Стоимость квартиры', 'Пәтер құны') }, { id: 'y', type: 'percent', def: 8, min: 0, max: 50, step: 'any', label: lab('Желаемая доходность в год', 'Қалаған жылдық кірістілік') }, { id: 'cost', type: 'money', def: 15000, label: lab('Ваши расходы в месяц (КСК, налог, ремонт)', 'Айлық шығындарыңыз (ПИК, салық, жөндеу)') }, { id: 'occ', type: 'percent', def: 60, min: 1, max: 100, adv: true, label: lab('Загрузка при посуточной аренде', 'Тәуліктік жалдауда толу') }],
    calc(v, R, L) {
      const month = v.price * v.y / 100 / 12 + v.cost, day = month / (30.44 * v.occ / 100);
      return { main: { label: t(L, 'Аренда в месяц', 'Айлық жалдау'), value: month }, cards: [{ label: t(L, 'Посуточно', 'Тәулігіне'), value: day }, { label: t(L, 'Окупаемость', 'Өтелу'), value: t(L, `${E.num(100 / v.y, 1)} лет`, `${E.num(100 / v.y, 1)} жыл`), fmt: 'text' }], rows: [], steps: [`${m(v.price)} × ${E.num(v.y, 'auto')}% ÷ 12 + ${m(v.cost)} = ${m(month)}`], notes: [t(L, 'Это расчёт от вашей цели, а не рыночная цена. Рыночную аренду сравните с объявлениями в вашем районе.', 'Бұл нарықтық баға емес, сіздің мақсатыңыздан жасалған есеп. Нарықтық жалдауды ауданыңыздағы хабарландырулармен салыстырыңыз.'), t(L, 'Доход от аренды облагается налогом.', 'Жалдаудан түскен табысқа салық салынады.')] };
    }
  });

  E.add({
    id: 'apartment-valuation', cat: 'property',
    title: lab('Оценка квартиры', 'Пәтерді бағалау'), short: lab('Ориентир стоимости по цене квадратного метра в районе', 'Аудандағы шаршы метр бағасы бойынша құн бағдары'),
    badge: () => '₸/м²', keys: 'оценка квартиры стоимость квадратный метр цена пәтер бағалау',
    fields: [{ id: 'area', type: 'number', def: 61, step: 'any', label: lab('Площадь', 'Аудан'), suffix: lab('м²', 'м²') }, { id: 'ppm', type: 'money', def: 550000, label: lab('Цена 1 м² похожих квартир в районе', 'Аудандағы ұқсас пәтерлердің 1 м² бағасы'), hint: lab('Посмотрите 5–10 объявлений рядом и возьмите среднее.', 'Жақын маңдағы 5–10 хабарландыруды қарап, орташасын алыңыз.') }, { id: 'adj', type: 'percent', def: 0, min: -50, max: 50, step: 'any', label: lab('Поправка за ремонт, этаж, вид (±%)', 'Жөндеу, қабат, көрініс түзетуі (±%)') }, { id: 'bargain', type: 'percent', def: 3, min: 0, max: 30, step: 'any', label: lab('Торг', 'Саудаласу') }],
    calc(v, R, L) {
      const ask = v.area * v.ppm * (1 + v.adj / 100), deal = ask * (1 - v.bargain / 100);
      return { main: { label: t(L, 'Цена предложения', 'Ұсыныс бағасы'), value: ask }, cards: [{ label: t(L, 'С учётом торга', 'Саудаласуды ескергенде'), value: deal }], rows: [], steps: [`${E.num(v.area, 'auto')} м² × ${m(v.ppm)} × (1 ${v.adj >= 0 ? '+' : '−'} ${E.num(Math.abs(v.adj), 'auto')}%) = ${m(ask)}`], notes: [t(L, 'Это ориентир, а не отчёт об оценке. Для банка и сделки нужен отчёт лицензированного оценщика.', 'Бұл бағдар, бағалау есебі емес. Банк пен мәміле үшін лицензиясы бар бағалаушының есебі керек.')] };
    }
  });

  E.add({
    id: 'cost-of-living', cat: 'property',
    title: lab('Стоимость жизни: семейный бюджет', 'Өмір сүру құны: отбасы бюджеті'), short: lab('Сколько уходит в месяц и сколько остаётся', 'Айына қанша кетеді және қанша қалады'),
    badge: (R, L) => t(L, 'бюджет', 'бюджет'), keys: 'стоимость жизни бюджет расходы семья өмір сүру құны',
    fields: [{ id: 'inc', type: 'money', def: 600000, label: lab('Доход семьи в месяц', 'Отбасының айлық табысы') }, { id: 'rent', type: 'money', def: 200000, label: lab('Жильё (аренда или ипотека)', 'Тұрғын үй (жалдау немесе ипотека)') }, { id: 'util', type: 'money', def: 35000, label: lab('Коммунальные и связь', 'Коммуналдық және байланыс') }, { id: 'food', type: 'money', def: 180000, label: lab('Продукты', 'Азық-түлік') }, { id: 'trans', type: 'money', def: 40000, label: lab('Транспорт', 'Көлік') }, { id: 'other', type: 'money', def: 80000, label: lab('Прочее (одежда, дети, досуг)', 'Басқа (киім, балалар, демалыс)') }],
    calc(v, R, L) {
      const exp = v.rent + v.util + v.food + v.trans + v.other, left = v.inc - exp, sh = x => v.inc ? `${E.num(x / v.inc * 100, 0)}%` : '—';
      return { main: { label: left >= 0 ? t(L, 'Остаётся', 'Қалады') : t(L, 'Не хватает', 'Жетпейді'), value: Math.abs(left) }, cards: [{ label: t(L, 'Расходы', 'Шығындар'), value: exp }, { label: t(L, 'Доля жилья', 'Тұрғын үй үлесі'), value: sh(v.rent), fmt: 'text' }], rows: [R1(L, 'Жильё', 'Тұрғын үй', `${m(v.rent)} · ${sh(v.rent)}`, 'text'), R1(L, 'Коммунальные и связь', 'Коммуналдық және байланыс', `${m(v.util)} · ${sh(v.util)}`, 'text'), R1(L, 'Продукты', 'Азық-түлік', `${m(v.food)} · ${sh(v.food)}`, 'text'), R1(L, 'Транспорт', 'Көлік', `${m(v.trans)} · ${sh(v.trans)}`, 'text'), R1(L, 'Прочее', 'Басқа', `${m(v.other)} · ${sh(v.other)}`, 'text')], steps: [], notes: [t(L, 'Подставьте цены своего города — так сравнение будет честным.', 'Өз қалаңыздың бағаларын қойыңыз — салыстыру сонда әділ болады.')] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Финансы: вклады, кредиты, ипотека, инвестиции */
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

  /* ---------- Сложный процент ---------- */
  E.add({
    id: 'compound-interest', cat: 'finance',
    title: lab('Калькулятор сложного процента', 'Күрделі пайыз калькуляторы'), short: lab('Рост вклада с капитализацией и пополнениями', 'Капиталдандыру мен толықтыру арқылы салымның өсуі'),
    badge: () => '%', keys: 'сложный процент капитализация накопления вклад рост күрделі пайыз',
    fields: [money('start', 1000000, 'Начальная сумма', 'Бастапқы сома'), money('add', 50000, 'Пополнение каждый месяц', 'Ай сайынғы толықтыру'), pct('rate', 14, 'Ставка, % годовых', 'Мөлшерлеме, жылдық %'), numF('years', 10, 'Срок', 'Мерзімі', 'лет', 'жыл', { max: 50 }),
      { id: 'cap', type: 'seg', def: '12', label: lab('Капитализация', 'Капиталдандыру'), options: [{ v: '12', ru: 'Ежемесячно', kk: 'Ай сайын' }, { v: '4', ru: 'Раз в квартал', kk: 'Тоқсан сайын' }, { v: '1', ru: 'Раз в год', kk: 'Жылына бір рет' }] }],
    calc(v, R, L) {
      const n = Math.round(v.years * 12), step = 12 / +v.cap; let bal = v.start, acc = 0, paid = v.start; const rows = [];
      for (let k = 1; k <= n; k++) { acc += bal * v.rate / 1200; if (k % step === 0) { bal += acc; acc = 0; } bal += v.add; paid += v.add; if (k % 12 === 0) rows.push([k / 12, paid, bal - paid, bal]); }
      bal += acc;
      return { main: { label: t(L, 'Итоговая сумма', 'Қорытынды сома'), value: bal }, cards: [{ label: t(L, 'Вложено', 'Салынды'), value: paid }, { label: t(L, 'Доход', 'Табыс'), value: bal - paid }], rows: [],
        table: rows.length ? { title: t(L, 'По годам', 'Жылдар бойынша'), head: [t(L, 'Год', 'Жыл'), t(L, 'Вложено', 'Салынды'), t(L, 'Доход', 'Табыс'), t(L, 'Остаток', 'Қалдық')], fmt: ['int', 'money', 'money', 'money'], rows } : null,
        steps: [t(L, `Каждый месяц начисляется ${E.num(v.rate, 'auto')}% ÷ 12, проценты прибавляются к сумме ${v.cap === '12' ? 'ежемесячно' : v.cap === '4' ? 'раз в квартал' : 'раз в год'}.`, `Ай сайын ${E.num(v.rate, 'auto')}% ÷ 12 есептеледі, сыйақы сомаға ${v.cap === '12' ? 'ай сайын' : v.cap === '4' ? 'тоқсан сайын' : 'жылына бір рет'} қосылады.`)],
        notes: [t(L, 'Сравнивайте вклады по ГЭСВ — она уже учитывает капитализацию.', 'Салымдарды ЖТСМ бойынша салыстырыңыз — онда капиталдандыру ескерілген.')] };
    }
  });

  /* ---------- Досрочное погашение ---------- */
  E.add({
    id: 'early-repayment', cat: 'finance',
    title: lab('Досрочное погашение кредита', 'Несиені мерзімінен бұрын өтеу'), short: lab('Что выгоднее: сократить срок или платёж', 'Не тиімді: мерзімді немесе төлемді азайту'),
    badge: (R, L) => t(L, 'экономия', 'үнемдеу'), keys: 'досрочное погашение кредита ипотеки сократить срок платеж мерзімінен бұрын өтеу',
    fields: [money('bal', 10000000, 'Остаток долга', 'Қарыз қалдығы'), pct('rate', 18, 'Ставка, % годовых', 'Мөлшерлеме, жылдық %'), numF('months', 60, 'Осталось платить', 'Төлеуге қалды', 'мес.', 'ай', { min: 1, max: 360 }), money('extra', 1000000, 'Сумма досрочного погашения', 'Мерзімінен бұрын өтеу сомасы'),
      { id: 'mode', type: 'seg', def: 'term', label: lab('Что уменьшить', 'Нені азайту'), options: [{ v: 'term', ru: 'Срок', kk: 'Мерзім' }, { v: 'pay', ru: 'Платёж', kk: 'Төлем' }] }],
    calc(v, R, L) {
      const n = Math.round(v.months), P = ann(v.bal, v.rate, n), S2 = E.pos(v.bal - v.extra), i = v.rate / 1200;
      if (!(v.bal > 0 && n > 0)) return { error: t(L, 'Введите остаток и срок', 'Қалдық пен мерзімді енгізіңіз') };
      const oldInt = P * n - v.bal; let newInt, P2 = P, n2 = n;
      if (v.mode === 'pay') { P2 = ann(S2, v.rate, n); newInt = P2 * n - S2; }
      else { let b = S2, k = 0, tot = 0; while (b > 0.005 && k < 1000) { const int = b * i, pay = Math.min(P, b + int); b = b + int - pay; tot += pay; k++; } n2 = k; newInt = tot - S2; }
      const save = oldInt - newInt;
      return { main: { label: t(L, 'Экономия на процентах', 'Сыйақыдан үнемдеу'), value: save }, cards: v.mode === 'pay' ? [{ label: t(L, 'Новый платёж', 'Жаңа төлем'), value: P2, fmt: 'money2' }, { label: t(L, 'Было', 'Бұрын'), value: P, fmt: 'money2' }] : [{ label: t(L, 'Новый срок', 'Жаңа мерзім'), value: mon(L, n2), fmt: 'text' }, { label: t(L, 'Сокращение', 'Қысқару'), value: mon(L, n - n2), fmt: 'text' }],
        rows: [R1(L, 'Проценты без досрочного погашения', 'Мерзімінен бұрын өтеусіз сыйақы', oldInt, 'money2'), R1(L, 'Проценты после погашения', 'Өтеуден кейінгі сыйақы', newInt, 'money2')], steps: [],
        notes: [t(L, 'Сокращение срока почти всегда даёт большую экономию, уменьшение платежа снижает нагрузку на бюджет. Порядок досрочного погашения смотрите в договоре займа.', 'Мерзімді қысқарту әдетте көбірек үнемдейді, төлемді азайту бюджетке түсетін жүктемені жеңілдетеді. Мерзімінен бұрын өтеу тәртібін қарыз шартынан қараңыз.'), NOTE_FIN(L)] };
    }
  });

  /* ---------- Рефинансирование ---------- */
  E.add({
    id: 'refinancing', cat: 'finance',
    title: lab('Калькулятор рефинансирования', 'Қайта қаржыландыру калькуляторы'), short: lab('Выгодно ли перекредитоваться под меньшую ставку', 'Төмен мөлшерлемемен қайта несиелену тиімді ме'),
    badge: (R, L) => t(L, 'выгода', 'пайда'), keys: 'рефинансирование перекредитование ставка выгода қайта қаржыландыру',
    fields: [money('bal', 5000000, 'Остаток по текущему кредиту', 'Ағымдағы несие қалдығы'), pct('rate', 24, 'Текущая ставка, %', 'Ағымдағы мөлшерлеме, %'), numF('months', 36, 'Осталось месяцев', 'Қалған айлар', 'мес.', 'ай', { min: 1, max: 360 }),
      pct('nrate', 18, 'Новая ставка, %', 'Жаңа мөлшерлеме, %'), numF('nmonths', 36, 'Новый срок', 'Жаңа мерзім', 'мес.', 'ай', { min: 1, max: 360 }), money('fee', 0, 'Расходы на переоформление', 'Қайта ресімдеу шығындары', { adv: true })],
    calc(v, R, L) {
      const n1 = Math.round(v.months), n2 = Math.round(v.nmonths), P1 = ann(v.bal, v.rate, n1), P2 = ann(v.bal, v.nrate, n2), T1 = P1 * n1, T2 = P2 * n2 + v.fee, gain = T1 - T2;
      return { main: { label: gain >= 0 ? t(L, 'Выгода', 'Пайда') : t(L, 'Потеря', 'Шығын'), value: Math.abs(gain) }, cards: [{ label: t(L, 'Платёж сейчас', 'Қазіргі төлем'), value: P1, fmt: 'money2' }, { label: t(L, 'Платёж после', 'Кейінгі төлем'), value: P2, fmt: 'money2' }],
        rows: [R1(L, 'Осталось выплатить по текущему кредиту', 'Ағымдағы несие бойынша төленетіні', T1, 'money2'), R1(L, 'Выплатите по новому кредиту с расходами', 'Жаңа несие бойынша шығындарымен төлейтініңіз', T2, 'money2')], steps: [],
        notes: [n2 > n1 ? t(L, 'Новый срок длиннее: платёж ниже, но переплата может вырасти.', 'Жаңа мерзім ұзағырақ: төлем төмен, бірақ артық төлем өсуі мүмкін.') : '', t(L, 'Сравнивайте ГЭСВ: в ней учтены комиссии и страховки.', 'ЖТСМ-ді салыстырыңыз: онда комиссиялар мен сақтандыру ескерілген.'), NOTE_FIN(L)].filter(Boolean) };
    }
  });

  /* ---------- Микрокредит ---------- */
  E.add({
    id: 'microloan', cat: 'finance',
    title: lab('Калькулятор микрозайма', 'Микроқарыз калькуляторы'), short: lab('Переплата и ГЭСВ по займу в МФО, проверка лимитов закона', 'МҚҰ қарызы бойынша артық төлем мен ЖТСМ, заң шектерін тексеру'),
    badge: (R) => R.mfoShortAPR + '%', keys: 'микрозайм мфо займ до зарплаты гэсв переплата микроқарыз',
    fields: [money('sum', 100000, 'Сумма займа', 'Қарыз сомасы'), pct('daily', 0.25, 'Ставка в день, %', 'Күндік мөлшерлеме, %', { max: 5 }), numF('days', 30, 'Срок', 'Мерзімі', 'дн.', 'күн', { min: 1, max: 1825 }), money('fee', 0, 'Комиссии и прочие платежи', 'Комиссиялар мен басқа төлемдер', { adv: true })],
    calc(v, R, L) {
      if (!(v.sum > 0 && v.days > 0)) return { error: t(L, 'Введите сумму и срок', 'Сома мен мерзімді енгізіңіз') };
      const int = v.sum * v.daily / 100 * v.days, over = int + v.fee, total = v.sum + over, apr = (Math.pow(total / v.sum, 365 / v.days) - 1) * 100;
      const short = v.days <= R.mfoShortDays && v.sum <= R.mfoShortMRP * R.MRP, lim = short ? R.mfoShortAPR : R.mfoAPR, notes = [];
      if (apr > lim + 0.05) notes.push(t(L, `ГЭСВ выше предела ${lim}% — такие условия нарушают требования АРРФР и НБ РК.`, `ЖТСМ ${lim}% шегінен жоғары — мұндай шарттар ҚНРДА мен ҚР ҰБ талаптарын бұзады.`));
      if (short && v.daily >= R.mfoShortDaily) notes.push(t(L, `По займам до ${R.mfoShortDays} дней и до ${R.mfoShortMRP} МРП ставка должна быть меньше ${E.num(R.mfoShortDaily, 1)}% в день.`, `${R.mfoShortDays} күнге дейінгі және ${R.mfoShortMRP} АЕК-ке дейінгі қарыздар бойынша мөлшерлеме күніне ${E.num(R.mfoShortDaily, 1)}%-дан аз болуы керек.`));
      if (short && over > v.sum / 2) notes.push(t(L, 'Переплата по такому займу не может быть больше половины суммы займа.', 'Мұндай қарыз бойынша артық төлем қарыз сомасының жартысынан аспауы керек.'));
      notes.push(t(L, 'МФО не вправе брать с физлиц комиссии. Проверьте лицензию организации в реестре АРРФР.', 'МҚҰ жеке тұлғалардан комиссия алуға құқылы емес. Ұйымның лицензиясын ҚНРДА тізілімінен тексеріңіз.'));
      return { main: { label: t(L, 'Вернуть', 'Қайтару'), value: total, fmt: 'money2' }, cards: [{ label: t(L, 'Переплата', 'Артық төлем'), value: over, fmt: 'money2' }, { label: t(L, 'ГЭСВ (примерно)', 'ЖТСМ (шамамен)'), value: `${E.num(apr, 1)}%`, fmt: 'text' }],
        rows: [R1(L, short ? 'Тип займа: до 45 дней и до 45 МРП' : 'Тип займа: прочий микрокредит', short ? 'Қарыз түрі: 45 күнге және 45 АЕК-ке дейін' : 'Қарыз түрі: басқа микрокредит', t(L, `предел ГЭСВ ${lim}%`, `ЖТСМ шегі ${lim}%`), 'text')], steps: [`${m(v.sum)} × ${E.num(v.daily, 'auto')}% × ${v.days} = ${m(int, 2)}`], notes };
    }
  });

  /* ---------- КФГД ---------- */
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

  /* ---------- Долговая нагрузка ---------- */
  E.add({
    id: 'debt-burden', cat: 'finance',
    title: lab('Коэффициент долговой нагрузки (КДН)', 'Борыштық жүктеме коэффициенті (БЖК)'), short: lab('Пройдёте ли вы по порогу 50% для нового кредита', 'Жаңа несие үшін 50% шегінен өтесіз бе'),
    badge: (R) => R.dtiMax + '%', keys: 'кдн долговая нагрузка 50% одобрение кредита dti борыштық жүктеме',
    fields: [money('inc', 400000, 'Средний подтверждённый доход в месяц (за 6 месяцев)', 'Айына орташа расталған табыс (6 ай)'), money('cur', 60000, 'Платежи по действующим кредитам в месяц', 'Қолданыстағы несиелер бойынша айлық төлем'), money('card', 0, 'Использованный лимит кредитных карт', 'Несие карталарының пайдаланылған лимиті', { hint: lab('Берётся 10% в месяц', 'Айына 10% алынады') }), money('due', 0, 'Просроченные платежи', 'Мерзімі өткен төлемдер', { adv: true }), money('neu', 80000, 'Платёж по новому кредиту', 'Жаңа несие бойынша төлем')],
    calc(v, R, L) {
      if (!(v.inc > 0)) return { error: t(L, 'Введите доход', 'Табысты енгізіңіз') };
      const pay = v.cur + v.card * 0.1 + v.due + v.neu, k = pay / v.inc * 100, free = E.pos(v.inc * R.dtiMax / 100 - (pay - v.neu));
      return { main: { label: t(L, 'КДН', 'БЖК'), value: `${E.num(k, 1)}%`, fmt: 'text' }, cards: [{ label: k <= R.dtiMax ? t(L, 'Проходит порог', 'Шектен өтеді') : t(L, 'Выше порога', 'Шектен жоғары'), value: `≤ ${R.dtiMax}%`, fmt: 'text' }, { label: t(L, 'Максимальный новый платёж', 'Ең жоғары жаңа төлем'), value: free }],
        rows: [R1(L, 'Все платежи в месяц', 'Айлық барлық төлемдер', pay)], steps: [`${m(pay)} ÷ ${m(v.inc)} × 100 = ${E.num(k, 1)}%`],
        notes: [t(L, 'Предел КДН 0,5 установлен нормативами Национального банка РК. Банк может отказать и при меньшем КДН по своей оценке.', 'БЖК 0,5 шегі ҚР Ұлттық банкінің нормативтерімен белгіленген. Банк өз бағасы бойынша БЖК төмен болса да бас тартуы мүмкін.')] };
    }
  });

  /* ---------- Инфляция ---------- */
  const infYears = R => Object.keys(R.inflation).map(Number).sort((a, b) => a - b);
  E.add({
    id: 'inflation', cat: 'finance',
    title: lab('Калькулятор инфляции', 'Инфляция калькуляторы'), short: lab('Как изменилась покупательная способность тенге', 'Теңгенің сатып алу қабілеті қалай өзгерді'),
    badge: (R) => `${E.num(R.inflation[infYears(R).slice(-1)[0]], 1)}%`, keys: 'инфляция покупательная способность ипц обесценивание инфляция',
    fields: [money('amount', 100000, 'Сумма', 'Сома'), { id: 'mode', type: 'seg', def: 'hist', label: lab('Расчёт', 'Есеп'), options: [{ v: 'hist', ru: 'По прошлым годам', kk: 'Өткен жылдар бойынша' }, { v: 'fore', ru: 'Прогноз', kk: 'Болжам' }] },
      { id: 'y1', type: 'select', def: '2020', half: true, when: v => v.mode === 'hist', label: lab('Цены на конец года', 'Жыл соңындағы баға'), options: R => [infYears(R)[0] - 1].concat(infYears(R)).slice(0, -1).map(y => ({ v: String(y), ru: String(y), kk: String(y) })) },
      { id: 'y2', type: 'select', def: '2025', half: true, when: v => v.mode === 'hist', label: lab('Пересчитать на конец года', 'Жыл соңына қайта есептеу'), options: R => infYears(R).map(y => ({ v: String(y), ru: String(y), kk: String(y) })) },
      pct('rate', 8, 'Ожидаемая инфляция, % в год', 'Күтілетін инфляция, жылына %', { when: v => v.mode === 'fore' }), numF('years', 5, 'Через сколько лет', 'Неше жылдан кейін', 'лет', 'жыл', { when: v => v.mode === 'fore', max: 50 })],
    calc(v, R, L) {
      if (v.mode === 'fore') {
        const k = Math.pow(1 + v.rate / 100, v.years);
        return { main: { label: t(L, 'Столько будет стоить то же самое', 'Дәл сол зат осынша тұрады'), value: v.amount * k }, cards: [{ label: t(L, 'Покупательная способность суммы', 'Соманың сатып алу қабілеті'), value: v.amount / k }], rows: [], steps: [`${m(v.amount)} × (1 + ${E.num(v.rate, 'auto')}%)^${E.num(v.years, 'auto')} = ${m(v.amount * k)}`], notes: [t(L, 'Цель Национального банка — инфляция около 5% в год.', 'Ұлттық банктің мақсаты — жылына шамамен 5% инфляция.')] };
      }
      const a = +v.y1, b = +v.y2; if (b <= a) return { error: t(L, 'Второй год должен быть позже первого', 'Екінші жыл біріншісінен кейін болуы керек') };
      let k = 1; const rows = []; for (let y = a + 1; y <= b; y++) { k *= 1 + R.inflation[y] / 100; rows.push(R1(L, `${y}`, `${y}`, `${E.num(R.inflation[y], 1)}%`, 'text')); }
      return { main: { label: t(L, `В ценах конца ${b} года`, `${b} жыл соңындағы бағамен`), value: v.amount * k }, cards: [{ label: t(L, 'Цены выросли', 'Бағалар өсті'), value: `${E.num((k - 1) * 100, 1)}%`, fmt: 'text' }, { label: t(L, `Сумма ${b} г. в деньгах ${a} г.`, `${b} ж. сомасы ${a} ж. ақшасымен`), value: v.amount / k }], rows,
        steps: [t(L, 'Перемножаются годовые индексы потребительских цен (декабрь к декабрю).', 'Тұтыну бағаларының жылдық индекстері (желтоқсан желтоқсанға) көбейтіледі.')], notes: [t(L, 'Источник: Бюро национальной статистики АСПиР РК (stat.gov.kz). По отдельным товарам рост цен может отличаться.', 'Дереккөз: ҚР СЖРА Ұлттық статистика бюросы (stat.gov.kz). Жекелеген тауарлар бойынша бағаның өсуі өзгеше болуы мүмкін.')] };
    }
  });

  /* ---------- Аренда или покупка ---------- */
  E.add({
    id: 'rent-vs-buy', cat: 'finance',
    title: lab('Аренда или ипотека: что выгоднее', 'Жалдау ма, ипотека ма: қайсысы тиімді'), short: lab('Сравнение капитала через N лет', 'N жылдан кейінгі капиталды салыстыру'),
    badge: (R, L) => t(L, 'сравнение', 'салыстыру'), keys: 'аренда или покупка ипотека снимать квартиру выгоднее жалдау немесе сатып алу',
    fields: [money('price', 30000000, 'Цена квартиры', 'Пәтер бағасы'), money('down', 6000000, 'Первоначальный взнос', 'Бастапқы жарна'), pct('rate', 18, 'Ставка ипотеки, %', 'Ипотека мөлшерлемесі, %'), numF('years', 15, 'Срок ипотеки', 'Ипотека мерзімі', 'лет', 'жыл', { min: 1, max: 30 }),
      money('rent', 250000, 'Аренда в месяц', 'Айлық жалдау'), pct('rg', 7, 'Рост аренды в год, %', 'Жалдаудың жылдық өсуі, %', { adv: true }), pct('pg', 6, 'Рост цены жилья в год, %', 'Тұрғын үй бағасының жылдық өсуі, %', { adv: true }), pct('dr', 12, 'Доходность вклада, %', 'Салым кірістілігі, %', { adv: true })],
    calc(v, R, L) {
      const n = Math.round(v.years * 12), S = E.pos(v.price - v.down), P = ann(S, v.rate, n); let inv = v.down, rent = v.rent;
      for (let k = 1; k <= n; k++) { inv = inv * (1 + v.dr / 1200) + (P - rent); if (k % 12 === 0) rent *= 1 + v.rg / 100; }
      const home = v.price * Math.pow(1 + v.pg / 100, v.years), diff = home - inv;
      return { main: { label: diff >= 0 ? t(L, 'Покупка выгоднее на', 'Сатып алу тиімдірек') : t(L, 'Аренда выгоднее на', 'Жалдау тиімдірек'), value: Math.abs(diff) }, cards: [{ label: t(L, 'Платёж по ипотеке', 'Ипотека төлемі'), value: P }, { label: t(L, 'Квартира через срок', 'Мерзімнен кейін пәтер'), value: home }],
        rows: [R1(L, 'Покупка: стоимость квартиры в конце срока', 'Сатып алу: мерзім соңындағы пәтер құны', home), R1(L, 'Аренда: взнос и разница с платежом на вкладе', 'Жалдау: жарна мен төлем айырмасы салымда', inv)],
        steps: [t(L, 'Если снимать, взнос и разницу между платежом по ипотеке и арендой кладут на вклад. Сравнивается капитал в конце срока ипотеки.', 'Жалға алсаңыз, жарна мен ипотека төлемі мен жалдау айырмасы салымға салынады. Ипотека мерзімінің соңындағы капитал салыстырылады.')],
        notes: [t(L, 'Не учтены ремонт, налог на имущество, страховка и коммунальные платежи. Результат сильно зависит от роста цен — попробуйте разные варианты.', 'Жөндеу, мүлік салығы, сақтандыру және коммуналдық төлемдер ескерілмеген. Нәтиже бағаның өсуіне қатты байланысты — әртүрлі нұсқаларды көріңіз.')] };
    }
  });

  /* ---------- FIRE ---------- */
  E.add({
    id: 'fire', cat: 'finance',
    title: lab('Калькулятор финансовой независимости (FIRE)', 'Қаржылық тәуелсіздік калькуляторы (FIRE)'), short: lab('Какой капитал нужен и когда вы его накопите', 'Қандай капитал керек және оны қашан жинайсыз'),
    badge: () => '4%', keys: 'fire финансовая независимость пассивный доход капитал пенсия ранняя қаржылық тәуелсіздік',
    fields: [money('exp', 400000, 'Расходы в месяц', 'Айлық шығыс'), money('have', 2000000, 'Уже накоплено', 'Жиналған'), money('save', 200000, 'Откладываете в месяц', 'Айына жинайсыз'), pct('ret', 8, 'Доходность сверх инфляции, % в год', 'Инфляциядан тыс кірістілік, жылына %'), pct('wr', 4, 'Безопасное изъятие, % в год', 'Қауіпсіз алу, жылына %', { adv: true })],
    calc(v, R, L) {
      if (!(v.wr > 0)) return { error: t(L, 'Укажите процент изъятия', 'Алу пайызын көрсетіңіз') };
      const target = v.exp * 12 / (v.wr / 100); let bal = v.have, k = 0;
      while (bal < target && k < 1200) { bal = bal * (1 + v.ret / 1200) + v.save; k++; }
      return { main: { label: t(L, 'Нужный капитал', 'Қажетті капитал'), value: target }, cards: [{ label: t(L, 'Накопите через', 'Жинайсыз'), value: k >= 1200 ? t(L, 'больше 100 лет', '100 жылдан астам') : mon(L, k), fmt: 'text' }],
        rows: [], steps: [`${m(v.exp)} × 12 ÷ ${E.num(v.wr, 'auto')}% = ${m(target)}`], notes: [t(L, 'Правило 4% основано на исследованиях рынка США. Доходность указывайте реальную, то есть сверх инфляции.', '4% ережесі АҚШ нарығын зерттеуге негізделген. Кірістілікті нақты, яғни инфляциядан тыс көрсетіңіз.'), NOTE_FIN(L)] };
    }
  });

  /* ---------- ROI / NPV ---------- */
  E.add({
    id: 'business-roi', cat: 'finance',
    title: lab('ROI, NPV и окупаемость проекта', 'Жобаның ROI, NPV және өтелуі'), short: lab('Стоит ли вкладывать деньги в проект', 'Жобаға ақша салу керек пе'),
    badge: () => 'NPV', keys: 'roi npv irr окупаемость инвестиции проект бизнес өтелу',
    fields: [money('inv', 10000000, 'Вложения', 'Салым'), money('cf', 3000000, 'Чистый денежный поток в год', 'Жылдық таза ақша ағыны'), numF('years', 5, 'Срок проекта', 'Жоба мерзімі', 'лет', 'жыл', { min: 1, max: 50 }), pct('disc', 15, 'Ставка дисконтирования, %', 'Дисконттау мөлшерлемесі, %', { hint: lab('Например, ставка по вкладу или кредиту', 'Мысалы, салым немесе несие мөлшерлемесі') }), money('res', 0, 'Остаточная стоимость в конце', 'Соңындағы қалдық құн', { adv: true })],
    calc(v, R, L) {
      const n = Math.round(v.years), npvAt = r => { let s = -v.inv; for (let k = 1; k <= n; k++) s += v.cf / Math.pow(1 + r, k); return s + v.res / Math.pow(1 + r, n); };
      const npv = npvAt(v.disc / 100); let lo = -0.99, hi = 10, irr = null;
      if (npvAt(lo) * npvAt(hi) < 0) { for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (npvAt(mid) > 0) lo = mid; else hi = mid; } irr = (lo + hi) / 2; }
      const roi = (v.cf * n + v.res - v.inv) / v.inv * 100, pb = v.cf > 0 ? v.inv / v.cf : null;
      return { main: { label: 'NPV', value: npv }, cards: [{ label: 'IRR', value: irr === null ? '—' : `${E.num(irr * 100, 1)}%`, fmt: 'text' }, { label: t(L, 'Окупаемость', 'Өтелу'), value: pb === null ? '—' : yrs(L, E.round(pb, 1)), fmt: 'text' }],
        rows: [R1(L, 'ROI за весь срок', 'Бүкіл мерзімдегі ROI', `${E.num(roi, 1)}%`, 'text')], steps: [t(L, 'NPV = −вложения + Σ поток ÷ (1 + ставка)^год', 'NPV = −салым + Σ ағын ÷ (1 + мөлшерлеме)^жыл')],
        notes: [npv >= 0 ? t(L, 'NPV больше нуля: проект доходнее, чем альтернатива под указанную ставку.', 'NPV нөлден үлкен: жоба көрсетілген мөлшерлемедегі баламадан тиімдірек.') : t(L, 'NPV меньше нуля: при такой ставке деньги выгоднее вложить в альтернативу.', 'NPV нөлден кіші: мұндай мөлшерлемеде ақшаны баламаға салған тиімдірек.')] };
    }
  });

  /* ---------- Кэшбэк ---------- */
  E.add({
    id: 'cashback', cat: 'finance',
    title: lab('Калькулятор кэшбэка', 'Кэшбэк калькуляторы'), short: lab('Сколько вернёт карта за месяц и за год', 'Карта айына және жылына қанша қайтарады'),
    badge: (R, L) => t(L, 'бонусы', 'бонустар'), keys: 'кэшбэк бонусы карта kaspi halyk бонус возврат',
    fields: [money('s1', 150000, 'Продукты в месяц', 'Айына азық-түлік', { half: true }), pct('p1', 1, '% кэшбэка', 'Кэшбэк %', { half: true }), money('s2', 40000, 'Кафе и рестораны', 'Кафе мен мейрамханалар', { half: true }), pct('p2', 5, '% кэшбэка', 'Кэшбэк %', { half: true }),
      money('s3', 30000, 'Топливо и такси', 'Жанармай мен такси', { half: true }), pct('p3', 3, '% кэшбэка', 'Кэшбэк %', { half: true }), money('s4', 100000, 'Остальные покупки', 'Басқа сатып алулар', { half: true }), pct('p4', 0.5, '% кэшбэка', 'Кэшбэк %', { half: true }),
      money('cap', 0, 'Лимит кэшбэка в месяц (0 — без лимита)', 'Айлық кэшбэк лимиті (0 — лимитсіз)', { adv: true }), money('fee', 0, 'Обслуживание карты в год', 'Картаға жылдық қызмет', { adv: true })],
    calc(v, R, L) {
      let mo = v.s1 * v.p1 / 100 + v.s2 * v.p2 / 100 + v.s3 * v.p3 / 100 + v.s4 * v.p4 / 100; const raw = mo; if (v.cap > 0) mo = Math.min(mo, v.cap);
      return { main: { label: t(L, 'В год чистыми', 'Жылына таза'), value: mo * 12 - v.fee }, cards: [{ label: t(L, 'В месяц', 'Айына'), value: mo }], rows: raw > mo ? [R1(L, 'Потеряно из-за лимита в месяц', 'Лимитке байланысты айына жоғалды', raw - mo)] : [], steps: [],
        notes: [t(L, 'Проценты и категории берите из условий своей карты: они часто меняются каждый месяц.', 'Пайыздар мен санаттарды картаңыздың шарттарынан алыңыз: олар жиі ай сайын өзгереді.')] };
    }
  });

  /* ---------- Кассовый разрыв ---------- */
  E.add({
    id: 'cash-flow-gap', cat: 'finance',
    title: lab('Калькулятор кассового разрыва', 'Кассалық алшақтық калькуляторы'), short: lab('Сколько оборотных денег нужно бизнесу', 'Бизнеске қанша айналым қаражаты керек'),
    badge: (R, L) => t(L, 'цикл', 'цикл'), keys: 'кассовый разрыв оборотные средства финансовый цикл дебиторка кредиторка кассалық алшақтық',
    fields: [money('cost', 3000000, 'Расходы в месяц (закуп, зарплата, аренда)', 'Айлық шығыстар (сатып алу, жалақы, жалдау)'), numF('stock', 30, 'Товар лежит на складе', 'Тауар қоймада тұрады', 'дн.', 'күн'), numF('recv', 30, 'Покупатели платят через', 'Сатып алушылар төлейді', 'дн.', 'күн'), numF('pay', 15, 'Вы платите поставщикам через', 'Жеткізушілерге төлейсіз', 'дн.', 'күн')],
    calc(v, R, L) {
      const cyc = v.stock + v.recv - v.pay, gap = E.pos(cyc) * v.cost / 30;
      return { main: { label: t(L, 'Нужно оборотных денег', 'Айналым қаражаты керек'), value: gap }, cards: [{ label: t(L, 'Финансовый цикл', 'Қаржылық цикл'), value: t(L, `${E.num(cyc)} дн.`, `${E.num(cyc)} күн`), fmt: 'text' }], rows: [],
        steps: [t(L, `(${E.num(v.stock)} + ${E.num(v.recv)} − ${E.num(v.pay)}) дн. × ${m(v.cost)} ÷ 30 = ${m(gap)}`, `(${E.num(v.stock)} + ${E.num(v.recv)} − ${E.num(v.pay)}) күн × ${m(v.cost)} ÷ 30 = ${m(gap)}`)],
        notes: [t(L, 'Сократить разрыв помогают предоплата от покупателей, отсрочка у поставщиков и меньшие запасы.', 'Алшақтықты сатып алушылардың алдын ала төлемі, жеткізушілердің кейінге қалдыруы және қордың азаюы қысқартады.')] };
    }
  });

  /* ---------- Франшиза ---------- */
  E.add({
    id: 'franchise-payback', cat: 'finance',
    title: lab('Окупаемость франшизы', 'Франшизаның өтелуі'), short: lab('Через сколько месяцев окупится франшиза', 'Франшиза неше айда өтеледі'),
    badge: (R, L) => t(L, 'роялти', 'роялти'), keys: 'франшиза окупаемость роялти паушальный взнос франшиза өтелуі',
    fields: [money('lump', 3000000, 'Паушальный взнос', 'Біржолғы жарна'), money('inv', 7000000, 'Прочие вложения (ремонт, оборудование)', 'Басқа салымдар (жөндеу, жабдық)'), money('rev', 2500000, 'Выручка в месяц', 'Айлық түсім'), money('cost', 1700000, 'Расходы в месяц', 'Айлық шығыстар'), pct('roy', 5, 'Роялти, % выручки', 'Роялти, түсімнің %'), pct('ad', 2, 'Маркетинговый сбор, % выручки', 'Маркетингтік алым, түсімнің %', { adv: true })],
    calc(v, R, L) {
      const profit = v.rev - v.cost - v.rev * (v.roy + v.ad) / 100, total = v.lump + v.inv;
      if (profit <= 0) return { main: { label: t(L, 'Прибыль в месяц', 'Айлық пайда'), value: profit }, rows: [], steps: [], notes: [t(L, 'При таких цифрах франшиза не окупится.', 'Мұндай сандарда франшиза өтелмейді.')] };
      const k = Math.ceil(total / profit);
      return { main: { label: t(L, 'Окупится через', 'Өтеледі'), value: mon(L, k), fmt: 'text' }, cards: [{ label: t(L, 'Прибыль в месяц', 'Айлық пайда'), value: profit }, { label: t(L, 'Все вложения', 'Барлық салым'), value: total }], rows: [R1(L, 'Роялти и сборы в месяц', 'Айлық роялти мен алымдар', v.rev * (v.roy + v.ad) / 100)],
        steps: [`${m(total)} ÷ ${m(profit)} = ${E.num(total / profit, 1)}`], notes: [t(L, 'Закладывайте 3–6 месяцев на раскрутку, когда выручка ниже плановой. Налоги учтите в расходах.', 'Түсім жоспардан төмен болатын 3–6 айлық бастапқы кезеңді ескеріңіз. Салықтарды шығыстарға қосыңыз.')] };
    }
  });

  /* ---------- Ипотека по программам ---------- */
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
    id: 'mortgage-specialized', cat: 'finance',
    title: lab('Ипотечный калькулятор: льготные программы', 'Ипотека калькуляторы: жеңілдікті бағдарламалар'), short: lab('Платёж по «7-20-25», «Наурыз», «Отау» и рыночной ипотеке', '«7-20-25», «Наурыз», «Отау» және нарықтық ипотека бойынша төлем'),
    badge: () => '7%', keys: 'ипотека 7-20-25 наурыз отау льготная ипотека платеж ипотека',
    fields: [{ id: 'prog', type: 'select', def: '72025', label: lab('Программа', 'Бағдарлама'), options: PROG.map(p => ({ v: p.v, ru: p.ru, kk: p.kk })) }].concat(mortFields.map(f => f.id === 'rate' ? Object.assign({}, f, { when: v => v.prog === 'market' }) : f.id === 'soc' ? Object.assign({}, f, { when: v => v.prog === 'nauryz' || v.prog === 'otau' }) : f)),
    calc(v, R, L) {
      const p = PROG.find(x => x.v === v.prog), S = v.price * (1 - v.downPct / 100), n = Math.round(v.years * 12), r = p.rate(v.soc, v), P = ann(S, r, n), bad = progCheck(p, v, S, L);
      return { main: { label: t(L, 'Платёж в месяц', 'Айлық төлем'), value: P, fmt: 'money2' }, cards: [{ label: t(L, 'Ставка', 'Мөлшерлеме'), value: `${E.num(r, 'auto')}%`, fmt: 'text' }, { label: t(L, 'Нужен доход от', 'Қажетті табыс'), value: P / (R.dtiMax / 100) }],
        rows: [R1(L, 'Первоначальный взнос', 'Бастапқы жарна', v.price - S), R1(L, 'Сумма займа', 'Қарыз сомасы', S), R1(L, 'Переплата', 'Артық төлем', P * n - S, 'money2'), R1(L, 'Условия программы', 'Бағдарлама шарттары', bad.length ? t(L, 'не проходит: ', 'сәйкес емес: ') + bad.join(', ') : t(L, 'подходит', 'сәйкес'), 'text', true)],
        steps: [t(L, `Аннуитет: ${m(S)} под ${E.num(r, 'auto')}% на ${n} мес.`, `Аннуитет: ${m(S)}, ${E.num(r, 'auto')}%, ${n} ай`)], notes: [NOTE_MORT(L), NOTE_FIN(L)] };
    }
  });
  E.add({
    id: 'mortgage-compare', cat: 'finance',
    title: lab('Сравнение ипотечных программ', 'Ипотека бағдарламаларын салыстыру'), short: lab('Все программы рядом: платёж, переплата, условия', 'Барлық бағдарлама қатар: төлем, артық төлем, шарттар'),
    badge: (R, L) => t(L, 'сравнение', 'салыстыру'), keys: 'сравнение ипотеки программы 7-20-25 наурыз отау рыночная ипотека салыстыру',
    fields: mortFields,
    calc(v, R, L) {
      const S = v.price * (1 - v.downPct / 100), n = Math.round(v.years * 12);
      const res = PROG.map(p => { const r = p.rate(v.soc, v), P = ann(S, r, n), bad = progCheck(p, v, S, L); return { p, r, P, over: P * n - S, ok: !bad.length, bad }; });
      const oks = res.filter(x => x.ok), best = oks.sort((a, b) => a.P - b.P)[0];
      return { main: { label: best ? t(L, 'Самый низкий платёж', 'Ең төмен төлем') : t(L, 'Платёж', 'Төлем'), value: best ? best.P : res[3].P, fmt: 'money2' }, cards: best ? [{ label: t(L, 'Программа', 'Бағдарлама'), value: best.p[L], fmt: 'text' }] : [],
        rows: [{ head: true, label: t(L, `Заём ${m(S)} на ${n} мес.`, `Қарыз ${m(S)}, ${n} ай`) }].concat(...res.map(x => [{ head: true, label: `${x.p[L]} — ${E.num(x.r, 'auto')}%` }, R1(L, 'Платёж в месяц', 'Айлық төлем', x.P, 'money2', true), R1(L, 'Переплата', 'Артық төлем', x.over), R1(L, 'Условия', 'Шарттар', x.ok ? t(L, 'подходит', 'сәйкес') : t(L, 'не проходит: ', 'сәйкес емес: ') + x.bad.join(', '), 'text')])),
        steps: [], notes: [NOTE_MORT(L), NOTE_FIN(L)] };
    }
  });

  /* ---------- Отбасы банк: накопление ---------- */
  E.add({
    id: 'otbasy-bank', cat: 'finance',
    title: lab('Калькулятор Отбасы банка: накопления и заём', 'Отбасы банк калькуляторы: жинақ және қарыз'), short: lab('Сколько копить, премия государства 20% и платёж по жилищному займу', 'Қанша жинау керек, мемлекет сыйлықақысы 20% және тұрғын үй қарызы төлемі'),
    badge: (R) => R.otbasyPremium + '%', keys: 'отбасы банк жилстройсбережения премия государства 20% жилищный заём отбасы',
    fields: [money('contract', 20000000, 'Договорная сумма', 'Шарттық сома'), money('start', 0, 'Уже накоплено', 'Жиналған'), money('add', 150000, 'Пополнение в месяц', 'Айлық толықтыру'), pct('dep', 2, 'Ставка по депозиту, %', 'Депозит мөлшерлемесі, %', { adv: true }), pct('lr', 5, 'Ставка жилищного займа, %', 'Тұрғын үй қарызының мөлшерлемесі, %'), numF('ly', 10, 'Срок займа', 'Қарыз мерзімі', 'лет', 'жыл', { min: 1, max: 25 })],
    calc(v, R, L) {
      if (!(v.contract > 0)) return { error: t(L, 'Введите договорную сумму', 'Шарттық соманы енгізіңіз') };
      const need = v.contract / 2, capY = R.otbasyPremiumBaseMRP * R.MRP; let bal = v.start, k = 0, yearAdd = 0, prem = 0, acc = 0;
      while ((bal < need || k < 36) && k < 600) { acc += bal * v.dep / 1200; bal += v.add; yearAdd += v.add; k++; if (k % 12 === 0) { const p = Math.min(yearAdd, capY) * R.otbasyPremium / 100; bal += acc + p; prem += p; acc = 0; yearAdd = 0; } }
      if (k >= 600) return { error: t(L, 'При таком пополнении накопить 50% не получится', 'Мұндай толықтырумен 50% жинау мүмкін емес') };
      const loan = E.pos(v.contract - bal), P = ann(loan, v.lr, Math.round(v.ly * 12));
      return { main: { label: t(L, 'Накопите 50% через', '50%-ды жинайсыз'), value: mon(L, k), fmt: 'text' }, cards: [{ label: t(L, 'Платёж по займу', 'Қарыз төлемі'), value: P, fmt: 'money2' }, { label: t(L, 'Премия государства', 'Мемлекет сыйлықақысы'), value: prem }],
        rows: [R1(L, 'Накоплено', 'Жиналды', bal), R1(L, 'Жилищный заём', 'Тұрғын үй қарызы', loan)],
        steps: [t(L, `Премия — ${R.otbasyPremium}% от пополнений за год, но не больше чем с ${R.otbasyPremiumBaseMRP} МРП (${m(capY)}). Минимальный срок накопления — 3 года.`, `Сыйлықақы — жылдық толықтырудың ${R.otbasyPremium}%-ы, бірақ ${R.otbasyPremiumBaseMRP} АЕК-тен (${m(capY)}) аспайтын сомадан. Ең аз жинау мерзімі — 3 жыл.`)],
        notes: [t(L, 'Расчёт упрощён: не учтён оценочный показатель, от которого зависит очередь на заём. Условия уточняйте в Отбасы банке.', 'Есеп жеңілдетілген: қарыз кезегі тәуелді болатын бағалау көрсеткіші ескерілмеген. Шарттарды Отбасы банктен нақтылаңыз.'), NOTE_FIN(L)] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Авто: растаможка, утильсбор, регистрация, ОГПО, штрафы и расходы */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;
  const lab = (ru, kk) => ({ ru, kk });
  const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
  const money = (id, def, ru, kk, extra) => Object.assign({ id, type: 'money', def, label: lab(ru, kk) }, extra || {});
  const pct = (id, def, ru, kk, extra) => Object.assign({ id, type: 'percent', def, min: 0, max: 100, step: 'any', label: lab(ru, kk) }, extra || {});
  const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
  const yearF = (def) => ({ id: 'year', type: 'number', def, min: 1950, max: 2100, label: lab('Год выпуска', 'Шығарылған жылы') });
  const mrp = (L, x, R) => t(L, `${E.num(x, 'auto')} МРП`, `${E.num(x, 'auto')} АЕК`);

  /* утильсбор: коэффициент */
  E.recyclingCoef = (R, type, size, ev, ru, tractor) => {
    const tab = R.recycling[type], col = ru ? 2 : 1;
    if (ev) return tab[0][col];
    if (type === 'truck' && tractor) return tab.find(r => r[0] === 'tractor')[col];
    const row = tab.find(r => typeof r[0] === 'number' && size <= r[0]) || tab.filter(r => typeof r[0] === 'number').slice(-1)[0];
    return row[col];
  };
  /* сбор за первичную регистрацию */
  E.regFee = (R, year, ev) => { const d = R.year - year, arr = ev ? R.regFeeEV : R.regFeeCar; return arr[d < 2 ? 0 : d === 2 ? 1 : 2]; };

  /* ---------- Растаможка ---------- */
  E.add({
    id: 'customs-clearance', cat: 'auto', popular: true,
    title: lab('Растаможка автомобиля', 'Автокөлікті кедендеу'), short: lab('Пошлина, НДС, акциз и сборы при ввозе авто в Казахстан', 'Көлікті Қазақстанға әкелгенде баж, ҚҚС, акциз және алымдар'),
    badge: () => '€/см³', keys: 'растаможка авто пошлина ввоз автомобиля етп таможня утильсбор кедендеу',
    fields: [
      { id: 'from', type: 'seg', def: 'third', label: lab('Откуда ввозится', 'Қайдан әкелінеді'), options: [{ v: 'third', ru: 'Не из ЕАЭС', kk: 'ЕАЭО-дан емес' }, { v: 'eaeu', ru: 'Из ЕАЭС', kk: 'ЕАЭО-дан' }] },
      { id: 'ru', type: 'check', def: false, when: v => v.from === 'eaeu', label: lab('Из России или Беларуси', 'Ресейден немесе Беларусьтен') },
      { id: 'mode', type: 'seg', def: 'decl', when: v => v.from === 'third', label: lab('Как оформляется', 'Қалай ресімделеді'), options: [{ v: 'decl', ru: 'Декларация на товары', kk: 'Тауарларға декларация' }, { v: 'pers', ru: 'Для личного пользования', kk: 'Жеке пайдалану үшін' }] },
      { id: 'ev', type: 'check', def: false, label: lab('Электромобиль (без гибридной установки)', 'Электромобиль (гибридсіз)') },
      { id: 'price', type: 'number', def: 15000, min: 0, label: lab('Стоимость автомобиля', 'Көлік құны'), suffix: lab('€', '€') },
      { id: 'eur', type: 'number', def: 540, min: 0, step: 'any', label: lab('Курс евро', 'Еуро бағамы'), suffix: lab('₸', '₸'), hint: lab('Курс Нацбанка на день подачи декларации', 'Декларация берілген күнгі Ұлттық банк бағамы') },
      numF('cc', 2000, 'Объём двигателя', 'Қозғалтқыш көлемі', 'см³', 'см³', { when: v => !v.ev }), yearF(2022)
    ],
    calc(v, R, L) {
      const age = R.year - v.year, val = v.price * v.eur, rows = [], notes = [];
      let duty = 0, excise = 0, vat = 0, fee = 0, etp = 0;
      if (v.from === 'third') {
        if (v.mode === 'decl') {
          duty = v.ev ? 0 : Math.max(val * R.customsDuty / 100, age > 7 ? R.customsMinOld * v.cc * v.eur : 0);
          if (!v.ev && v.cc > 3000) excise += R.exciseOver3000 * v.cc;
          if (val >= 18000 * R.MRP) { excise += val * 0.1; notes.push(t(L, 'Стоимость от 18 000 МРП — добавлен акциз 10% (уточните в КГД).', 'Құны 18 000 АЕК-тен бастап — 10% акциз қосылды (МКК-дан нақтылаңыз).')); }
          fee = R.customsFeeMRP * R.MRP; vat = (val + duty + excise) * R.VAT / 100;
          rows.push(R1(L, v.ev ? 'Пошлина (электромобиль — 0%)' : `Пошлина ${R.customsDuty}%${age > 7 ? `, не менее ${E.num(R.customsMinOld, 1)} €/см³` : ''}`, v.ev ? 'Баж (электромобиль — 0%)' : `Баж ${R.customsDuty}%${age > 7 ? `, кемінде ${E.num(R.customsMinOld, 1)} €/см³` : ''}`, duty), R1(L, 'Акциз', 'Акциз', excise), R1(L, `НДС ${R.VAT}%`, `ҚҚС ${R.VAT}%`, vat), R1(L, `Таможенный сбор ${R.customsFeeMRP} МРП`, `Кедендік алым ${R.customsFeeMRP} АЕК`, fee));
          notes.push(t(L, 'Авто, растаможенное по ставкам изъятий РК, можно использовать только в Казахстане.', 'ҚР алып тастау мөлшерлемелерімен кедендеген көлікті тек Қазақстанда пайдалануға болады.'));
        } else {
          if (v.ev) return { error: t(L, 'Электромобиль оформляется по декларации на товары', 'Электромобиль тауарларға декларация бойынша ресімделеді') };
          let eur;
          if (age < 3) { const r = R.ettNew.find(x => v.price <= x[0]); eur = Math.max(v.price * r[1] / 100, r[2] * v.cc); rows.push(R1(L, `До 3 лет: ${r[1]}% стоимости, не менее ${E.num(r[2], 1)} €/см³`, `3 жылға дейін: құнның ${r[1]}%-ы, кемінде ${E.num(r[2], 1)} €/см³`, `${E.num(eur, 0)} €`, 'text')); }
          else { const r = R.ettPersonal.find(x => v.cc <= x[0]), k = age <= 5 ? r[1] : r[2]; eur = k * v.cc; rows.push(R1(L, `${age <= 5 ? '3–5 лет' : 'Старше 5 лет'}: ${E.num(k, 1)} €/см³ × ${E.num(v.cc)}`, `${age <= 5 ? '3–5 жыл' : '5 жылдан асқан'}: ${E.num(k, 1)} €/см³ × ${E.num(v.cc)}`, `${E.num(eur, 0)} €`, 'text')); }
          etp = eur * v.eur; rows.push(R1(L, 'Единый таможенный платёж', 'Бірыңғай кедендік төлем', etp));
        }
      } else rows.push(R1(L, 'Таможенные платежи из ЕАЭС', 'ЕАЭО-дан кедендік төлемдер', t(L, 'не платятся', 'төленбейді'), 'text'));
      const customs = duty + excise + vat + fee + etp, rc = E.recyclingCoef(R, 'car', v.cc, v.ev, v.from === 'eaeu' && v.ru), util = R.recyclingBaseMRP * R.MRP * rc, reg = E.regFee(R, v.year, v.ev) * R.MRP, extra = (R.srtsMRP + R.platesMRP) * R.MRP;
      rows.push({ head: true, label: t(L, 'При постановке на учёт', 'Есепке қою кезінде') }, R1(L, `Утильсбор: 50 МРП × ${E.num(rc, 'auto')}`, `Кәдеге жарату алымы: 50 АЕК × ${E.num(rc, 'auto')}`, util), R1(L, `Сбор за первичную регистрацию (${mrp(L, E.regFee(R, v.year, v.ev))})`, `Алғашқы тіркеу алымы (${mrp(L, E.regFee(R, v.year, v.ev))})`, reg), R1(L, 'Номера и техпаспорт', 'Нөмірлер мен техпаспорт', extra));
      notes.push(t(L, 'Расчёт ориентировочный: таможня может скорректировать стоимость, для отдельных случаев действуют другие ставки. Перед покупкой проверьте сумму у таможенного представителя или в КГД.', 'Есеп шамамен: кеден құнды түзетуі мүмкін, жекелеген жағдайларға басқа мөлшерлемелер қолданылады. Сатып алмас бұрын соманы кедендік өкілден немесе МКК-дан тексеріңіз.'));
      return { main: { label: t(L, 'Таможенные платежи', 'Кедендік төлемдер'), value: customs }, cards: [{ label: t(L, 'Всего с утильсбором и регистрацией', 'Кәдеге жарату және тіркеумен бірге'), value: customs + util + reg + extra }, { label: t(L, 'Возраст авто', 'Көлік жасы'), value: t(L, `${age} ${E.plural(age, 'год', 'года', 'лет')}`, `${age} жыл`), fmt: 'text' }], rows, steps: [`${E.num(v.price)} € × ${E.num(v.eur, 'auto')} = ${m(val)}`], notes };
    }
  });

  /* ---------- Утильсбор ---------- */
  E.add({
    id: 'recycling-fee', cat: 'auto',
    title: lab('Утилизационный сбор на авто', 'Көлікке кәдеге жарату алымы'), short: lab('Утильсбор при ввозе и первой регистрации', 'Әкелу мен алғашқы тіркеу кезіндегі кәдеге жарату алымы'),
    badge: (R, L) => `${R.recyclingBaseMRP} ${t(L, 'МРП', 'АЕК')}`, keys: 'утильсбор утилизационный платеж авто россия беларусь кәдеге жарату',
    fields: [{ id: 'type', type: 'seg', def: 'car', label: lab('Тип', 'Түрі'), options: [{ v: 'car', ru: 'Легковой', kk: 'Жеңіл' }, { v: 'truck', ru: 'Грузовой', kk: 'Жүк' }, { v: 'bus', ru: 'Автобус', kk: 'Автобус' }] },
      { id: 'ru', type: 'check', def: false, label: lab('Ввоз из России или Беларуси', 'Ресейден немесе Беларусьтен әкелу') }, { id: 'ev', type: 'check', def: false, label: lab('Электромобиль (без гибридной установки)', 'Электромобиль (гибридсіз)') },
      numF('cc', 1500, 'Объём двигателя', 'Қозғалтқыш көлемі', 'см³', 'см³', { when: v => v.type !== 'truck' && !v.ev }), numF('mass', 3.5, 'Полная масса', 'Толық массасы', 'т', 'т', { step: 'any', when: v => v.type === 'truck' && !v.ev && !v.tractor }),
      { id: 'tractor', type: 'check', def: false, when: v => v.type === 'truck' && !v.ev, label: lab('Седельный тягач 12–50 т', 'Ершікті тартқыш 12–50 т') }],
    calc(v, R, L) {
      const k = E.recyclingCoef(R, v.type, v.type === 'truck' ? v.mass : v.cc, v.ev, v.ru, v.tractor), base = R.recyclingBaseMRP * R.MRP, sum = base * k, other = E.recyclingCoef(R, v.type, v.type === 'truck' ? v.mass : v.cc, v.ev, !v.ru, v.tractor) * base;
      return { main: { label: t(L, 'Утильсбор', 'Кәдеге жарату алымы'), value: sum }, cards: [{ label: t(L, 'Коэффициент', 'Коэффициент'), value: E.num(k, 'auto'), fmt: 'text' }, { label: v.ru ? t(L, 'Если не из России и Беларуси', 'Ресей мен Беларусьтен болмаса') : t(L, 'Если из России или Беларуси', 'Ресейден немесе Беларусьтен болса'), value: other }],
        rows: [], steps: [`${R.recyclingBaseMRP} × ${m(R.MRP)} × ${E.num(k, 'auto')} = ${m(sum)}`],
        notes: [t(L, 'Платят один раз — производитель или импортёр, в том числе физлицо, которое само ввезло авто. Оплата — оператору РОП (АО «Жасыл даму»), подтверждение нужно для первичной регистрации.', 'Бір рет төленеді — өндіруші немесе импорттаушы, оның ішінде көлікті өзі әкелген жеке тұлға. Төлем — ӨКМ операторына («Жасыл даму» АҚ), растау алғашқы тіркеуге қажет.')] };
    }
  });

  /* ---------- Первичная регистрация ---------- */
  E.add({
    id: 'registration-fee', cat: 'auto',
    title: lab('Сбор за первичную регистрацию авто', 'Көлікті алғашқы тіркеу алымы'), short: lab('Сколько стоит поставить ввезённое авто на учёт', 'Әкелінген көлікті есепке қою қанша тұрады'),
    badge: (R, L) => `${R.regFeeCar[2]} ${t(L, 'МРП', 'АЕК')}`, keys: 'первичная регистрация авто сбор 500 мрп постановка на учет тіркеу алымы',
    fields: [{ id: 'ev', type: 'check', def: false, label: lab('Электромобиль', 'Электромобиль') }, yearF(2020)],
    calc(v, R, L) {
      const k = E.regFee(R, v.year, v.ev), reg = k * R.MRP, srts = R.srtsMRP * R.MRP, pl = R.platesMRP * R.MRP;
      return { main: { label: t(L, 'Всего', 'Барлығы'), value: reg + srts + pl }, cards: [{ label: t(L, 'Регистрационный сбор', 'Тіркеу алымы'), value: reg }],
        rows: [R1(L, `Сбор (${mrp(L, k)})`, `Алым (${mrp(L, k)})`, reg), R1(L, `Свидетельство о регистрации (${mrp(L, R.srtsMRP)})`, `Тіркеу куәлігі (${mrp(L, R.srtsMRP)})`, srts), R1(L, `Госномера (${mrp(L, R.platesMRP)})`, `Мемлекеттік нөмірлер (${mrp(L, R.platesMRP)})`, pl)],
        steps: [t(L, `Ставки для ${v.ev ? 'электромобилей' : 'легковых'}: до 2 лет — ${(v.ev ? R.regFeeEV : R.regFeeCar)[0]}, 2 года — ${(v.ev ? R.regFeeEV : R.regFeeCar)[1]}, от 3 лет — ${(v.ev ? R.regFeeEV : R.regFeeCar)[2]} МРП. Возраст — разница между текущим годом и годом выпуска.`, `${v.ev ? 'Электромобильдер' : 'Жеңіл көліктер'} үшін: 2 жылға дейін — ${(v.ev ? R.regFeeEV : R.regFeeCar)[0]}, 2 жыл — ${(v.ev ? R.regFeeEV : R.regFeeCar)[1]}, 3 жылдан — ${(v.ev ? R.regFeeEV : R.regFeeCar)[2]} АЕК. Жасы — ағымдағы жыл мен шығарылған жылдың айырмасы.`)],
        notes: [t(L, 'Для грузовиков и автобусов действуют свои ставки. Переоформление авто, уже стоящего на учёте в РК, стоит 0,25 МРП — см. калькулятор переоформления.', 'Жүк көліктері мен автобустар үшін өз мөлшерлемелері бар. ҚР-да есепте тұрған көлікті қайта ресімдеу 0,25 АЕК тұрады — қайта ресімдеу калькуляторын қараңыз.')] };
    }
  });

  /* ---------- ОГПО ---------- */
  E.add({
    id: 'insurance-premium', cat: 'auto', popular: true,
    title: lab('Калькулятор ОГПО (автостраховка)', 'МСАҚ калькуляторы (автосақтандыру)'), short: lab('Стоимость обязательной страховки по региону, водителю и классу бонус-малус', 'Өңір, жүргізуші және бонус-малус сыныбы бойынша міндетті сақтандыру құны'),
    badge: (R, L) => `${E.num(R.ogpoBaseMRP, 1)} ${t(L, 'МРП', 'АЕК')}`, keys: 'огпо страховка авто осаго бонус малус полис мсақ сақтандыру',
    fields: [{ id: 'reg', type: 'select', def: 'alm', label: lab('Где зарегистрировано авто', 'Көлік қайда тіркелген'), options: R => R.ogpoTerritory.map(r => ({ v: r[0], ru: r[1], kk: r[2] })) },
      { id: 'small', type: 'check', def: false, when: v => !['ast', 'alm', 'shy'].includes(v.reg), label: lab('Не областной центр (другой город или село)', 'Облыс орталығы емес (басқа қала немесе ауыл)') },
      { id: 'type', type: 'select', def: 'car', label: lab('Тип транспорта', 'Көлік түрі'), options: [{ v: 'car', ru: 'Легковой (B)', kk: 'Жеңіл (B)' }, { v: 'truck', ru: 'Грузовой свыше 3,5 т (C)', kk: 'Жүк, 3,5 т-дан жоғары (C)' }, { v: 'busS', ru: 'Автобус до 16 мест', kk: '16 орынға дейін автобус' }, { v: 'busL', ru: 'Автобус свыше 16 мест', kk: '16 орыннан көп автобус' }, { v: 'moto', ru: 'Мотоцикл, прицеп', kk: 'Мотоцикл, тіркеме' }] },
      { id: 'jur', type: 'check', def: false, label: lab('Страхователь — юрлицо', 'Сақтанушы — заңды тұлға') },
      { id: 'young', type: 'check', def: false, when: v => !v.jur, label: lab('Есть водитель младше 25 лет', '25 жасқа толмаған жүргізуші бар') }, { id: 'nov', type: 'check', def: false, when: v => !v.jur, label: lab('Есть водитель со стажем меньше 2 лет', 'Өтілі 2 жылдан аз жүргізуші бар') },
      { id: 'old', type: 'check', def: false, label: lab('Авто старше 7 лет', 'Көлік 7 жастан асқан') },
      { id: 'bm', type: 'number', def: 1, min: 0.5, max: 3.5, step: 'any', label: lab('Коэффициент бонус-малус', 'Бонус-малус коэффициенті'), hint: lab('Класс 3 = 1,0; первый договор — 1,2. Свой класс смотрите в истории страхования (ГКБ, eGov)', '3-сынып = 1,0; алғашқы шарт — 1,2. Сыныбыңызды сақтандыру тарихынан қараңыз (МКБ, eGov)') },
      numF('months', 12, 'Срок полиса', 'Полис мерзімі', 'мес.', 'ай', { min: 1, max: 12, adv: true })],
    calc(v, R, L) {
      const tr = R.ogpoTerritory.find(r => r[0] === v.reg), kt = tr[3] * tr[4] * (v.small && !['ast', 'alm', 'shy'].includes(v.reg) ? 0.8 : 1), ty = R.ogpoType[v.type];
      const ka = v.jur ? 1.2 : (v.young && v.nov ? 1.1 : v.young || v.nov ? 1.05 : 1), ko = v.old ? 1.1 : 1, base = R.ogpoBaseMRP * R.MRP, year = base * kt * ty * ka * ko * v.bm, sum = year * Math.min(12, Math.max(1, Math.round(v.months))) / 12;
      return { main: { label: t(L, 'Стоимость полиса', 'Полис құны'), value: sum }, cards: [{ label: t(L, 'Базовая премия', 'Базалық сыйлықақы'), value: base, fmt: 'money2' }],
        rows: [R1(L, 'Территория (по закону × поправка АРРФР)', 'Аумақ (заң бойынша × ҚНРДА түзетуі)', `${E.num(tr[3], 2)} × ${E.num(tr[4], 2)}${kt !== tr[3] * tr[4] ? ' × 0,8' : ''} = ${E.num(kt, 3)}`, 'text'), R1(L, 'Тип транспорта', 'Көлік түрі', E.num(ty, 2), 'text'), R1(L, v.jur ? 'Юрлицо' : 'Возраст и стаж водителей', v.jur ? 'Заңды тұлға' : 'Жүргізушілердің жасы мен өтілі', E.num(ka, 2), 'text'), R1(L, 'Возраст авто', 'Көлік жасы', E.num(ko, 2), 'text'), R1(L, 'Бонус-малус', 'Бонус-малус', E.num(v.bm, 2), 'text')],
        steps: [`${m(base, 1)} × ${E.num(kt, 3)} × ${E.num(ty, 2)} × ${E.num(ka, 2)} × ${E.num(ko, 2)} × ${E.num(v.bm, 2)} = ${m(year)}`],
        notes: [t(L, 'Страховщик может отклонить поправочный коэффициент региона на ±10%, поэтому цены компаний немного различаются. Полис оформляют онлайн у страховщиков или через eGov.', 'Сақтандырушы өңірдің түзету коэффициентін ±10%-ға өзгерте алады, сондықтан компаниялардың бағасы аздап өзгеше. Полисті сақтандырушылардан онлайн немесе eGov арқылы рәсімдейді.')] };
    }
  });

  /* ---------- Посылки ---------- */
  E.add({
    id: 'parcel-customs', cat: 'auto',
    title: lab('Пошлина на посылки из-за рубежа', 'Шетелден келген сәлемдемелерге баж'), short: lab('Лимит 200 € и 31 кг: сколько платить сверх', '200 € және 31 кг шегі: асқаны үшін қанша төлеу керек'),
    badge: () => '200 €', keys: 'пошлина посылки лимит 200 евро 31 кг aliexpress temu маркетплейс сәлемдеме баж',
    fields: [{ id: 'mode', type: 'seg', def: 'person', label: lab('Посылка', 'Сәлемдеме'), options: [{ v: 'person', ru: 'Обычная (от физлица / магазина)', kk: 'Кәдімгі (жеке тұлғадан / дүкеннен)' }, { v: 'market', ru: 'Маркетплейс (новый режим ЕАЭС)', kk: 'Маркетплейс (ЕАЭО жаңа режимі)' }] },
      { id: 'price', type: 'number', def: 300, min: 0, step: 'any', label: lab('Стоимость с доставкой', 'Жеткізумен құны'), suffix: lab('€', '€') }, numF('kg', 5, 'Вес', 'Салмағы', 'кг', 'кг', { step: 'any' }),
      { id: 'eur', type: 'number', def: 540, min: 0, step: 'any', label: lab('Курс евро', 'Еуро бағамы'), suffix: lab('₸', '₸') }],
    calc(v, R, L) {
      let eur;
      if (v.mode === 'market') eur = v.price > R.parcelFreeEUR ? Math.max(v.price * 0.05, v.kg * 1) : 0;
      else eur = Math.max(E.pos(v.price - R.parcelFreeEUR) * R.parcelRate / 100, E.pos(v.kg - R.parcelFreeKg) * R.parcelPerKg);
      return { main: { label: t(L, 'Пошлина', 'Баж'), value: eur * v.eur }, cards: [{ label: t(L, 'В евро', 'Еуромен'), value: `${E.num(eur, 2)} €`, fmt: 'text' }], rows: [],
        steps: [v.mode === 'market' ? t(L, 'Свыше 200 € — 5% от всей стоимости, но не менее 1 € за кг.', '200 €-дан асса — бүкіл құнның 5%-ы, бірақ 1 кг үшін кемінде 1 €.') : t(L, `Свыше ${R.parcelFreeEUR} € или ${R.parcelFreeKg} кг — ${R.parcelRate}% от превышения стоимости или ${R.parcelPerKg} € за каждый кг сверх лимита, что больше.`, `${R.parcelFreeEUR} € немесе ${R.parcelFreeKg} кг-нан асса — құн асқан бөлігінің ${R.parcelRate}%-ы немесе шектен асқан әр кг үшін ${R.parcelPerKg} €, қайсысы көп болса.`)],
        notes: [t(L, 'Режим для маркетплейсов применяется со дня вступления в силу протокола к Таможенному кодексу ЕАЭС — уточните дату в КГД. Платёж вносят через Казпочту или таможенного представителя.', 'Маркетплейстерге арналған режим ЕАЭО Кеден кодексіне хаттама күшіне енген күннен бастап қолданылады — күнін МКК-дан нақтылаңыз. Төлем Қазпошта немесе кедендік өкіл арқылы енгізіледі.')] };
    }
  });

  /* ---------- КАСКО ---------- */
  E.add({
    id: 'kasko', cat: 'auto',
    title: lab('Калькулятор КАСКО', 'КАСКО калькуляторы'), short: lab('Стоимость добровольной страховки по тарифу страховщика', 'Сақтандырушы тарифі бойынша ерікті сақтандыру құны'),
    badge: (R, L) => t(L, 'тариф', 'тариф'), keys: 'каско страховка авто тариф франшиза каско',
    fields: [money('value', 12000000, 'Страховая стоимость авто', 'Көліктің сақтандыру құны'), pct('tariff', 5, 'Тариф страховщика, % в год', 'Сақтандырушы тарифі, жылына %'), pct('disc', 0, 'Скидка за франшизу и прочие, %', 'Франшиза және басқа жеңілдіктер, %'), numF('months', 12, 'Срок', 'Мерзімі', 'мес.', 'ай', { min: 1, max: 12 })],
    calc(v, R, L) {
      const sum = v.value * v.tariff / 100 * (1 - v.disc / 100) * Math.round(v.months) / 12;
      return { main: { label: t(L, 'Стоимость полиса', 'Полис құны'), value: sum }, cards: [{ label: t(L, 'В месяц', 'Айына'), value: sum / Math.max(1, Math.round(v.months)) }], rows: [], steps: [`${m(v.value)} × ${E.num(v.tariff, 'auto')}% × (1 − ${E.num(v.disc, 'auto')}%) × ${Math.round(v.months)}/12`],
        notes: [t(L, 'КАСКО добровольное, тарифы у страховщиков свои — обычно 3–8% стоимости авто в год. Введите тариф из предложения компании.', 'КАСКО ерікті, тарифтер сақтандырушыларда әртүрлі — әдетте көлік құнының жылына 3–8%-ы. Компания ұсынысындағы тарифті енгізіңіз.')] };
    }
  });

  /* ---------- Стоимость владения ---------- */
  E.add({
    id: 'vehicle-tco', cat: 'auto',
    title: lab('Стоимость владения автомобилем', 'Көлікті ұстау құны'), short: lab('Сколько на самом деле стоит авто в месяц и за километр', 'Көлік шын мәнінде айына және шақырымына қанша тұрады'),
    badge: (R, L) => t(L, '₸/км', '₸/км'), keys: 'стоимость владения авто расходы на машину в месяц топливо обслуживание көлік шығындары',
    fields: [money('price', 10000000, 'Цена покупки', 'Сатып алу бағасы'), numF('years', 5, 'Сколько лет владеть', 'Неше жыл ұстау', 'лет', 'жыл', { min: 1, max: 30 }), pct('resale', 60, 'Цена продажи в конце, % от покупки', 'Соңында сату бағасы, сатып алудың %'),
      numF('km', 15000, 'Пробег в год', 'Жылдық жүріс', 'км', 'км'), numF('cons', 8, 'Расход', 'Шығыны', 'л/100 км', 'л/100 км', { step: 'any' }), money('fuel', 280, 'Цена литра топлива', 'Жанармай литрінің бағасы'),
      money('ins', 40000, 'Страховка в год', 'Жылдық сақтандыру'), money('tax', 15000, 'Налог на транспорт в год', 'Жылдық көлік салығы'), money('serv', 150000, 'ТО, шины, ремонт в год', 'ТҚ, шиналар, жөндеу жылына'), money('other', 120000, 'Парковка, мойка, прочее в год', 'Тұрақ, жуу, басқасы жылына')],
    calc(v, R, L) {
      const y = Math.max(1, Math.round(v.years)), dep = v.price * (1 - v.resale / 100), fuel = v.km * v.cons / 100 * v.fuel * y, fixed = (v.ins + v.tax + v.serv + v.other) * y, total = dep + fuel + fixed, km = v.km * y;
      return { main: { label: t(L, 'В месяц', 'Айына'), value: total / (y * 12) }, cards: [{ label: t(L, 'За километр', 'Шақырымына'), value: km ? total / km : 0, fmt: 'money2' }, { label: t(L, 'Всего за срок', 'Барлық мерзімге'), value: total }],
        rows: [R1(L, 'Потеря стоимости', 'Құнның төмендеуі', dep), R1(L, 'Топливо', 'Жанармай', fuel), R1(L, 'Страховка', 'Сақтандыру', v.ins * y), R1(L, 'Налог', 'Салық', v.tax * y), R1(L, 'Обслуживание и ремонт', 'Қызмет көрсету және жөндеу', v.serv * y), R1(L, 'Прочее', 'Басқасы', v.other * y)], steps: [], notes: [t(L, 'Если авто в кредите, прибавьте переплату по кредиту.', 'Көлік несиеге алынса, несие бойынша артық төлемді қосыңыз.')] };
    }
  });

  /* ---------- Автолизинг ---------- */
  E.add({
    id: 'auto-leasing', cat: 'auto',
    title: lab('Калькулятор автолизинга', 'Автолизинг калькуляторы'), short: lab('Платёж по лизингу с авансом и выкупным платежом', 'Аванс пен сатып алу төлемі бар лизинг төлемі'),
    badge: (R, L) => t(L, 'аванс', 'аванс'), keys: 'автолизинг лизинг авто платеж аванс выкуп лизинг',
    fields: [money('price', 15000000, 'Стоимость авто', 'Көлік құны'), pct('adv', 20, 'Аванс, %', 'Аванс, %'), pct('rate', 18, 'Ставка, % годовых', 'Мөлшерлеме, жылдық %'), numF('months', 36, 'Срок', 'Мерзімі', 'мес.', 'ай', { min: 1, max: 120 }), pct('buy', 10, 'Выкупной платёж в конце, %', 'Соңындағы сатып алу төлемі, %'), pct('fee', 1, 'Разовая комиссия, %', 'Біржолғы комиссия, %', { adv: true })],
    calc(v, R, L) {
      const n = Math.round(v.months), i = v.rate / 1200, a = v.price * v.adv / 100, S = v.price - a, B = v.price * v.buy / 100, f = v.price * v.fee / 100;
      const P = i === 0 ? (S - B) / n : (S - B / Math.pow(1 + i, n)) * i / (1 - Math.pow(1 + i, -n)), total = a + P * n + B + f;
      return { main: { label: t(L, 'Платёж в месяц', 'Айлық төлем'), value: P, fmt: 'money2' }, cards: [{ label: t(L, 'Переплата', 'Артық төлем'), value: total - v.price }, { label: t(L, 'Всего', 'Барлығы'), value: total }],
        rows: [R1(L, 'Аванс', 'Аванс', a), R1(L, 'Выкупной платёж', 'Сатып алу төлемі', B), R1(L, 'Комиссия', 'Комиссия', f)], steps: [],
        notes: [t(L, 'До выкупа авто принадлежит лизинговой компании. Для ИП и ТОО лизинговые платежи могут уменьшать налогооблагаемый доход — уточните у бухгалтера.', 'Сатып алғанға дейін көлік лизингтік компанияға тиесілі. ЖК мен ЖШС үшін лизингтік төлемдер салық салынатын табысты азайтуы мүмкін — бухгалтерден нақтылаңыз.')] };
    }
  });

  /* ---------- Рыночная стоимость ---------- */
  E.add({
    id: 'car-market-value', cat: 'auto',
    title: lab('Оценка стоимости авто', 'Көліктің құнын бағалау'), short: lab('Примерная цена подержанного авто с учётом возраста и пробега', 'Жасы мен жүрісін ескере отырып, пайдаланылған көліктің шамамен бағасы'),
    badge: (R, L) => t(L, 'оценка', 'бағалау'), keys: 'оценка авто стоимость подержанного машины рыночная цена көлік бағасы',
    fields: [money('price', 12000000, 'Цена нового авто', 'Жаңа көлік бағасы'), numF('age', 4, 'Возраст', 'Жасы', 'лет', 'жыл', { max: 40 }), numF('km', 60000, 'Пробег', 'Жүрісі', 'км', 'км'),
      { id: 'cond', type: 'seg', def: '1', label: lab('Состояние', 'Жағдайы'), options: [{ v: '1.05', ru: 'Отличное', kk: 'Өте жақсы' }, { v: '1', ru: 'Обычное', kk: 'Қалыпты' }, { v: '0.85', ru: 'Требует ремонта', kk: 'Жөндеу керек' }] },
      pct('d1', 15, 'Потеря цены за первый год, %', 'Бірінші жылғы баға төмендеуі, %', { adv: true }), pct('dn', 10, 'За каждый следующий год, %', 'Келесі әр жылға, %', { adv: true })],
    calc(v, R, L) {
      const a = Math.round(v.age), base = a < 1 ? v.price : v.price * (1 - v.d1 / 100) * Math.pow(1 - v.dn / 100, a - 1), norm = Math.max(1, a) * 15000, kmAdj = E.clamp(1 - (v.km - norm) / 10000 * 0.02, 0.8, 1.1), val = base * kmAdj * +v.cond;
      return { main: { label: t(L, 'Примерная цена', 'Шамамен баға'), value: val }, cards: [{ label: t(L, 'Диапазон', 'Ауқымы'), value: `${m(val * 0.9)} – ${m(val * 1.1)}`, fmt: 'text' }],
        rows: [R1(L, 'По возрасту', 'Жасы бойынша', base), R1(L, `Поправка за пробег (норма ${E.num(norm)} км)`, `Жүріс түзетуі (норма ${E.num(norm)} км)`, `× ${E.num(kmAdj, 2)}`, 'text')], steps: [],
        notes: [t(L, 'Это ориентир. Сравните с объявлениями о продаже таких же авто; для банка и суда нужен отчёт оценщика.', 'Бұл бағдар. Дәл осындай көліктерді сату хабарландыруларымен салыстырыңыз; банк пен сот үшін бағалаушының есебі қажет.')] };
    }
  });

  /* ---------- Переоформление ---------- */
  E.add({
    id: 'car-transfer', cat: 'auto',
    title: lab('Переоформление авто: расходы', 'Көлікті қайта ресімдеу: шығындар'), short: lab('Сборы, номера, нотариус и налог при покупке-продаже авто', 'Көлікті сатып алу-сату кезіндегі алымдар, нөмірлер, нотариус және салық'),
    badge: (R, L) => `${E.num(R.reRegMRP, 'auto')} ${t(L, 'МРП', 'АЕК')}`, keys: 'переоформление авто купля продажа машины сбор номера нотариус қайта ресімдеу',
    fields: [money('sale', 5000000, 'Цена продажи', 'Сату бағасы'), money('buy', 4500000, 'Цена, за которую продавец купил авто', 'Сатушы көлікті сатып алған баға', { adv: true }), numF('held', 24, 'Продавец владел авто', 'Сатушы көлікті иеленді', 'мес.', 'ай', { adv: true }),
      { id: 'party', type: 'select', def: 'egov', label: lab('Договор', 'Шарт'), options: [{ v: 'egov', ru: 'Через eGov с ЭЦП — без нотариуса', kk: 'eGov арқылы ЭЦҚ-мен — нотариуссыз' }, { v: '0', ru: 'У нотариуса: близкие родственники', kk: 'Нотариуста: жақын туыстар' }, { v: '1', ru: 'У нотариуса: физлица', kk: 'Нотариуста: жеке тұлғалар' }, { v: '2', ru: 'У нотариуса: с участием юрлица', kk: 'Нотариуста: заңды тұлғаның қатысуымен' }] }],
    calc(v, R, L) {
      const reg = R.reRegMRP * R.MRP, srts = R.srtsMRP * R.MRP, pl = R.platesMRP * R.MRP, nk = v.party === 'egov' ? 0 : R.notary.car[+v.party], not = nk * R.MRP;
      const gain = E.pos(v.sale - v.buy), ipn = v.held < 12 ? gain * R.IPN / 100 : 0;
      return { main: { label: t(L, 'Расходы на переоформление', 'Қайта ресімдеу шығындары'), value: reg + srts + pl + not }, cards: [{ label: t(L, 'ИПН продавца', 'Сатушының ЖТС'), value: ipn }],
        rows: [R1(L, `Регистрационный сбор (${mrp(L, R.reRegMRP)})`, `Тіркеу алымы (${mrp(L, R.reRegMRP)})`, reg), R1(L, `Свидетельство о регистрации (${mrp(L, R.srtsMRP)})`, `Тіркеу куәлігі (${mrp(L, R.srtsMRP)})`, srts), R1(L, `Номера (${mrp(L, R.platesMRP)})`, `Нөмірлер (${mrp(L, R.platesMRP)})`, pl), R1(L, nk ? `Нотариус (${mrp(L, nk)})` : 'Договор через eGov', nk ? `Нотариус (${mrp(L, nk)})` : 'eGov арқылы шарт', not)],
        steps: [v.held < 12 ? t(L, `Продавец владел авто меньше года: ИПН ${R.IPN}% с прироста ${m(gain)}.`, `Сатушы көлікті бір жылдан аз иеленді: ${m(gain)} өсімнен ${R.IPN}% ЖТС.`) : t(L, 'Авто во владении год и больше — ИПН с продажи не платится.', 'Көлік бір жыл және одан көп иеленген — сатудан ЖТС төленбейді.')],
        notes: [t(L, 'Покупателю нужен новый полис ОГПО — посчитайте его в калькуляторе ОГПО. Переоформить авто нужно в течение 10 рабочих дней после сделки.', 'Сатып алушыға жаңа МСАҚ полисі керек — оны МСАҚ калькуляторында есептеңіз. Көлікті мәміледен кейін 10 жұмыс күні ішінде қайта ресімдеу керек.')] };
    }
  });

  /* ---------- Топливо ---------- */
  E.add({
    id: 'fuel-cost', cat: 'auto',
    title: lab('Расчёт стоимости топлива на поездку', 'Сапарға жанармай құнын есептеу'), short: lab('Сколько бензина нужно и сколько платит каждый', 'Қанша бензин керек және әркім қанша төлейді'),
    badge: (R, L) => t(L, 'л/100 км', 'л/100 км'), keys: 'расход топлива поездка бензин стоимость поездки жанармай',
    fields: [numF('km', 500, 'Расстояние', 'Қашықтық', 'км', 'км'), { id: 'back', type: 'check', def: true, label: lab('Туда и обратно', 'Бару және қайту') }, numF('cons', 8, 'Расход', 'Шығыны', 'л/100 км', 'л/100 км', { step: 'any' }), money('price', 280, 'Цена литра', 'Литр бағасы'), numF('n', 1, 'Человек делят расходы', 'Шығынды бөлетін адамдар', 'чел.', 'адам', { min: 1, max: 50 })],
    calc(v, R, L) {
      const km = v.km * (v.back ? 2 : 1), l = km * v.cons / 100, sum = l * v.price, n = Math.max(1, Math.round(v.n));
      return { main: { label: t(L, 'Стоимость топлива', 'Жанармай құны'), value: sum }, cards: [{ label: t(L, 'Литров', 'Литр'), value: E.num(l, 1), fmt: 'text' }, { label: t(L, 'С каждого', 'Әркімнен'), value: sum / n }], rows: [], steps: [`${E.num(km)} км × ${E.num(v.cons, 'auto')} ÷ 100 × ${m(v.price)} = ${m(sum)}`], notes: [] };
    }
  });

  /* ---------- Штрафы ПДД ---------- */
  const FINE_NAMES = { sp20: ['Превышение скорости на 10–20 км/ч', 'Жылдамдықты 10–20 км/сағ асыру'], sp40: ['Превышение скорости на 20–40 км/ч', 'Жылдамдықты 20–40 км/сағ асыру'], sp60: ['Превышение скорости на 40–60 км/ч', 'Жылдамдықты 40–60 км/сағ асыру'], sp60p: ['Превышение скорости на 60 км/ч и более', 'Жылдамдықты 60 км/сағ және одан көп асыру'], red: ['Проезд на красный свет', 'Қызыл бағдаршамнан өту'], belt: ['Не пристёгнут ремень', 'Қауіпсіздік белдігі тағылмаған'], phone: ['Телефон за рулём без hands-free', 'Рөлде hands-free-сіз телефон'], park: ['Нарушение правил остановки и стоянки', 'Тоқтау және тұрақ ережелерін бұзу'], ped: ['Не уступил дорогу пешеходу', 'Жаяу жүргіншіге жол бермеу'], tint: ['Тонировка лобового или передних боковых стёкол', 'Алдыңғы немесе алдыңғы бүйір әйнектерді күңгірттеу'], ogpo: ['Езда без полиса ОГПО', 'МСАҚ полисісіз жүру'], child: ['Ребёнок без детского кресла', 'Балалар орындығынсыз бала'], noplate: ['Без госномеров или без регистрации', 'Мемлекеттік нөмірсіз немесе тіркеусіз'] };
  E.add({
    id: 'traffic-fines', cat: 'auto',
    title: lab('Штрафы ПДД со скидкой 50%', '50% жеңілдікпен ЖҚЕ айыппұлдары'), short: lab('Размер штрафа по КоАП и сумма при оплате за 7 дней', 'ӘҚБтК бойынша айыппұл мөлшері және 7 күнде төлегендегі сома'),
    badge: () => '−50%', keys: 'штрафы пдд превышение скорости красный свет скидка 50% коап айыппұл',
    fields: [{ id: 'viol', type: 'select', def: 'sp40', label: lab('Нарушение', 'Құқықбұзушылық'), options: R => R.fines.map(f => ({ v: f[0], ru: FINE_NAMES[f[0]][0], kk: FINE_NAMES[f[0]][1] })) },
      { id: 'rep', type: 'check', def: false, label: lab('Повторно в течение года', 'Бір жыл ішінде қайталап') }, { id: 'fast', type: 'check', def: true, label: lab('Оплачу в течение 7 суток', '7 тәулік ішінде төлеймін') }],
    calc(v, R, L) {
      const f = R.fines.find(x => x[0] === v.viol), k = v.rep && f[3] ? f[3] : f[2], full = k * R.MRP, pay = v.fast ? full / 2 : full;
      return { main: { label: t(L, 'К оплате', 'Төлеуге'), value: pay }, cards: [{ label: t(L, 'Полный штраф', 'Толық айыппұл'), value: full }, { label: t(L, 'Статья КоАП', 'ӘҚБтК бабы'), value: f[1], fmt: 'text' }],
        rows: [R1(L, 'Размер в МРП', 'АЕК-пен мөлшері', E.num(k, 'auto'), 'text')], steps: v.fast ? [t(L, 'Скидка 50% при оплате в течение 7 суток (ст. 811 КоАП).', '7 тәулік ішінде төлесе 50% жеңілдік (ӘҚБтК 811-бабы).')] : [],
        notes: [v.rep && !f[3] ? t(L, 'За это нарушение повтор отдельно не усилен.', 'Бұл құқықбұзушылық үшін қайталау бөлек күшейтілмеген.') : '', t(L, 'Скидки нет, если за нарушение кроме штрафа предусмотрены арест или лишение прав. Проверяйте штрафы на eGov.', 'Айыппұлдан басқа қамаққа алу немесе құқықтан айыру көзделсе, жеңілдік жоқ. Айыппұлдарды eGov-та тексеріңіз.')].filter(Boolean) };
    }
  });

  /* ---------- Красивые номера ---------- */
  const PLATE_NAMES = { std: ['Обычный (случайный)', 'Кәдімгі (кездейсоқ)'], any: ['Любая выбранная комбинация', 'Кез келген таңдалған комбинация'], mirror: ['Зеркальные цифры (101, 121)', 'Айналы цифрлар (101, 121)'], tens: ['010–090, 077, 707 или три одинаковые буквы', '010–090, 077, 707 немесе үш бірдей әріп'], mirrorSame: ['Зеркальные + три одинаковые буквы', 'Айналы + үш бірдей әріп'], tensSame: ['010–090, 077, 707 + три одинаковые буквы', '010–090, 077, 707 + үш бірдей әріп'], round: ['Круглые и одинаковые цифры (100, 111, 222)', 'Дөңгелек және бірдей цифрлар (100, 111, 222)'], roundSame: ['Круглые + три одинаковые буквы', 'Дөңгелек + үш бірдей әріп'], elite: ['001–009 и 777', '001–009 және 777'], eliteSame: ['001–009, 777 + три одинаковые буквы', '001–009, 777 + үш бірдей әріп'] };
  E.add({
    id: 'fancy-plates', cat: 'auto',
    title: lab('Стоимость красивого госномера', 'Әдемі мемлекеттік нөмірдің құны'), short: lab('Сколько стоит выбранный или «блатной» номер', 'Таңдалған немесе «блатной» нөмір қанша тұрады'),
    badge: () => '777', keys: 'красивые номера блатной номер 777 001 стоимость госномер әдемі нөмір',
    fields: [{ id: 'cat', type: 'select', def: 'any', label: lab('Номер', 'Нөмір'), options: R => R.plates.map(p => ({ v: p[0], ru: `${PLATE_NAMES[p[0]][0]} — ${E.num(p[1], 'auto')} МРП`, kk: `${PLATE_NAMES[p[0]][1]} — ${E.num(p[1], 'auto')} АЕК` })) }, numF('n', 1, 'Сколько комплектов', 'Неше жиынтық', 'шт.', 'дана', { min: 1, max: 100, adv: true })],
    calc(v, R, L) {
      const p = R.plates.find(x => x[0] === v.cat), n = Math.max(1, Math.round(v.n)), sum = p[1] * R.MRP * n;
      return { main: { label: t(L, 'Стоимость', 'Құны'), value: sum }, cards: [{ label: t(L, 'В МРП', 'АЕК-пен'), value: E.num(p[1] * n, 'auto'), fmt: 'text' }], rows: [], steps: [`${E.num(p[1], 'auto')} × ${m(R.MRP)}${n > 1 ? ` × ${n}` : ''} = ${m(sum)}`],
        notes: [t(L, 'Сбор за номер повышенного спроса — одна сумма, а не доплата к обычному номеру. Купить номер у другого владельца нельзя, передать его можно только близкому родственнику.', 'Сұранысы жоғары нөмір алымы — кәдімгі нөмірге қосымша төлем емес, бір сома. Нөмірді басқа иеленушіден сатып алуға болмайды, оны тек жақын туысқа беруге болады.')] };
    }
  });

  /* ---------- Размер шин ---------- */
  E.add({
    id: 'tire-size', cat: 'auto',
    title: lab('Шинный калькулятор', 'Шина калькуляторы'), short: lab('Сравнение размеров шин и погрешность спидометра', 'Шина өлшемдерін салыстыру және спидометр қателігі'),
    badge: () => 'R', keys: 'шинный калькулятор размер шин диаметр колеса спидометр шина',
    fields: [numF('w', 205, 'Ширина сейчас', 'Қазіргі ені', 'мм', 'мм', { half: true }), numF('p', 55, 'Профиль сейчас', 'Қазіргі профилі', '%', '%', { half: true }), numF('r', 16, 'Диаметр диска сейчас', 'Қазіргі диск диаметрі', '″', '″'),
      numF('w2', 215, 'Новая ширина', 'Жаңа ені', 'мм', 'мм', { half: true }), numF('p2', 50, 'Новый профиль', 'Жаңа профилі', '%', '%', { half: true }), numF('r2', 17, 'Новый диаметр диска', 'Жаңа диск диаметрі', '″', '″')],
    calc(v, R, L) {
      const d1 = v.r * 25.4 + 2 * v.w * v.p / 100, d2 = v.r2 * 25.4 + 2 * v.w2 * v.p2 / 100; if (!(d1 > 0)) return { error: t(L, 'Введите размеры', 'Өлшемдерді енгізіңіз') };
      const diff = (d2 / d1 - 1) * 100;
      return { main: { label: t(L, 'Разница диаметров', 'Диаметрлер айырмасы'), value: `${diff > 0 ? '+' : ''}${E.num(diff, 2)}%`, fmt: 'text' }, cards: [{ label: t(L, 'При 100 км/ч на спидометре реально', 'Спидометрде 100 км/сағ болғанда нақты'), value: t(L, `${E.num(100 * d2 / d1, 1)} км/ч`, `${E.num(100 * d2 / d1, 1)} км/сағ`), fmt: 'text' }],
        rows: [R1(L, 'Диаметр колеса сейчас', 'Қазіргі дөңгелек диаметрі', `${E.num(d1, 1)} мм`, 'text'), R1(L, 'Новый диаметр', 'Жаңа диаметр', `${E.num(d2, 1)} мм`, 'text'), R1(L, 'Изменение клиренса', 'Клиренстің өзгеруі', `${E.num((d2 - d1) / 2, 1)} мм`, 'text')], steps: [t(L, 'Диаметр = диск × 25,4 + 2 × ширина × профиль', 'Диаметр = диск × 25,4 + 2 × ені × профилі')],
        notes: [Math.abs(diff) > 3 ? t(L, 'Разница больше 3% — такую замену обычно не рекомендуют: врёт спидометр, может задевать арки.', 'Айырма 3%-дан көп — мұндай ауыстыруды әдетте ұсынбайды: спидометр қате көрсетеді, доғаға тиюі мүмкін.') : t(L, 'Разница в пределах 3% — обычно допустима. Проверьте допустимые размеры в инструкции к авто.', 'Айырма 3% шегінде — әдетте рұқсат етіледі. Рұқсат етілген өлшемдерді көлік нұсқаулығынан тексеріңіз.')] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Юридические: госпошлина, нотариус, наследство, развод, сроки, банкротство */
(function (root) {
  const E = root.ESEPTE, t = E.t, m = E.money;
  const lab = (ru, kk) => ({ ru, kk });
  const R1 = (L, ru, kk, value, fmt, strong) => ({ label: t(L, ru, kk), value, fmt, strong });
  const money = (id, def, ru, kk, extra) => Object.assign({ id, type: 'money', def, label: lab(ru, kk) }, extra || {});
  const numF = (id, def, ru, kk, sru, skk, extra) => Object.assign({ id, type: 'number', def, min: 0, label: lab(ru, kk), suffix: lab(sru, skk) }, extra || {});
  const mrp = (L, x) => t(L, `${E.num(x, 'auto')} МРП`, `${E.num(x, 'auto')} АЕК`);
  const NOTE_LAW = L => t(L, 'Расчёт справочный и не заменяет консультацию юриста.', 'Есеп анықтамалық сипатта және заңгер кеңесін алмастырмайды.');
  /* госпошлина по имущественному иску */
  E.courtProp = (R, sum, jur) => Math.min(sum * (jur ? R.courtPropJur : R.courtPropPhys) / 100, (jur ? R.courtCapJurMRP : R.courtCapPhysMRP) * R.MRP);

  /* ---------- Госпошлина в суд ---------- */
  const COURT = [['prop', 'Имущественный иск (взыскание денег, ущерба, имущества)', 'Мүліктік талап (ақша, залал, мүлік өндіру)'], ['divorce', 'Расторжение брака', 'Некені бұзу'], ['nonprop', 'Прочий неимущественный иск', 'Басқа мүліктік емес талап'], ['adm', 'Обжалование действий госоргана', 'Мемлекеттік орган әрекетіне шағым'], ['defam', 'Защита чести и достоинства с компенсацией', 'Ар-намысты өтемақымен қорғау'], ['bankrupt', 'Банкротство или восстановление платёжеспособности', 'Банкроттық немесе төлем қабілеттілігін қалпына келтіру'], ['free', 'Алименты, трудовой спор, вред здоровью', 'Алимент, еңбек дауы, денсаулыққа зиян']];
  E.add({
    id: 'court-fee', cat: 'legal', popular: true,
    title: lab('Госпошлина в суд', 'Сотқа мемлекеттік баж'), short: lab('Сколько платить за иск: 1% для граждан, 3% для организаций', 'Талап үшін қанша төлеу керек: азаматтарға 1%, ұйымдарға 3%'),
    badge: (R) => `${R.courtPropPhys}% / ${R.courtPropJur}%`, keys: 'госпошлина суд иск 1% 3% размер пошлины мемлекеттік баж сот',
    fields: [{ id: 'who', type: 'seg', def: 'phys', label: lab('Истец', 'Талапкер'), options: [{ v: 'phys', ru: 'Гражданин или ИП', kk: 'Азамат немесе ЖК' }, { v: 'jur', ru: 'Организация', kk: 'Ұйым' }] },
      { id: 'kind', type: 'select', def: 'prop', label: lab('Вид иска', 'Талап түрі'), options: COURT.map(c => ({ v: c[0], ru: c[1], kk: c[2] })) },
      money('sum', 1000000, 'Цена иска', 'Талап бағасы', { when: v => v.kind === 'prop' || v.kind === 'defam' })],
    calc(v, R, L) {
      const jur = v.who === 'jur'; let fee = 0, how = '';
      if (v.kind === 'prop' || v.kind === 'defam') { fee = E.courtProp(R, v.sum, jur); how = `${m(v.sum)} × ${jur ? R.courtPropJur : R.courtPropPhys}%${fee < v.sum * (jur ? R.courtPropJur : R.courtPropPhys) / 100 ? t(L, ', ограничено максимумом', ', ең жоғарғы шекпен шектелді') : ''}`; }
      else if (v.kind === 'divorce') { fee = R.courtDivorceMRP * R.MRP; how = mrp(L, R.courtDivorceMRP); }
      else if (v.kind === 'nonprop') { fee = R.courtNonPropMRP * R.MRP; how = mrp(L, R.courtNonPropMRP); }
      else if (v.kind === 'adm') { const k = jur ? R.courtAdmJurMRP : R.courtAdmPhysMRP; fee = k * R.MRP; how = mrp(L, k); }
      else if (v.kind === 'bankrupt') { const k = jur ? R.courtNonPropMRP : R.courtBankruptPhysMRP; fee = k * R.MRP; how = mrp(L, k); }
      else how = t(L, 'освобождено от госпошлины', 'мемлекеттік баждан босатылған');
      return { main: { label: t(L, 'Госпошлина', 'Мемлекеттік баж'), value: fee, fmt: 'money2' }, cards: [{ label: t(L, 'Как посчитано', 'Қалай есептелді'), value: how, fmt: 'text' }],
        rows: [R1(L, 'Максимум по имущественным искам', 'Мүліктік талаптар бойынша ең жоғарғысы', (jur ? R.courtCapJurMRP : R.courtCapPhysMRP) * R.MRP)], steps: [],
        notes: [t(L, 'Пошлину платят до подачи иска. Освобождены, в частности, иски об алиментах, трудовые споры и иски о вреде здоровью, а по всем делам — ветераны и лица с инвалидностью. При мировом соглашении в первой инстанции пошлина возвращается.', 'Баж талап берілгенге дейін төленеді. Атап айтқанда, алимент, еңбек даулары және денсаулыққа зиян туралы талаптар, ал барлық істер бойынша ардагерлер мен мүгедектігі бар адамдар босатылады. Бірінші сатыда бітімгершілік келісім жасалса, баж қайтарылады.'), NOTE_LAW(L)] };
    }
  });

  /* ---------- Нотариус ---------- */
  const NOT = [['realty', 'Договор продажи или дарения жилья', 'Тұрғын үйді сату немесе сыйға тарту шарты'], ['mortgage', 'Покупка жилья в городе по ипотеке', 'Қалада ипотекамен тұрғын үй сатып алу'], ['car', 'Договор продажи авто', 'Көлікті сату шарты'], ['will', 'Завещание', 'Өсиет'], ['inherit', 'Свидетельство о праве на наследство', 'Мұраға құқық туралы куәлік'], ['spouse', 'Свидетельство о доле супруга', 'Жұбайының үлесі туралы куәлік'], ['poa', 'Доверенность на распоряжение имуществом', 'Мүлікке билік ету сенімхаты'], ['copy', 'Заверение копий', 'Көшірмелерді куәландыру']];
  E.add({
    id: 'notary', cat: 'legal',
    title: lab('Стоимость услуг нотариуса', 'Нотариус қызметтерінің құны'), short: lab('Единый тариф 2026 года для частных нотариусов', 'Жеке нотариустарға арналған 2026 жылғы бірыңғай тариф'),
    badge: (R, L) => t(L, 'МРП', 'АЕК'), keys: 'нотариус тариф стоимость доверенность завещание договор купли продажи нотариус құны',
    fields: [{ id: 'act', type: 'select', def: 'realty', label: lab('Нотариальное действие', 'Нотариаттық әрекет'), options: NOT.map(c => ({ v: c[0], ru: c[1], kk: c[2] })) },
      { id: 'party', type: 'seg', def: '1', when: v => v.act === 'realty' || v.act === 'car', label: lab('Стороны', 'Тараптар'), options: [{ v: '0', ru: 'Близкие родственники', kk: 'Жақын туыстар' }, { v: '1', ru: 'Физлица', kk: 'Жеке тұлғалар' }, { v: '2', ru: 'С юрлицом', kk: 'Заңды тұлғамен' }] },
      { id: 'place', type: 'seg', def: 'city', when: v => v.act === 'realty', label: lab('Где находится жильё', 'Тұрғын үй қайда'), options: [{ v: 'city', ru: 'Город', kk: 'Қала' }, { v: 'village', ru: 'Село', kk: 'Ауыл' }] },
      money('value', 20000000, 'Стоимость жилья', 'Тұрғын үй құны', { when: v => v.act === 'realty' && v.place === 'city' }),
      numF('heirs', 2, 'Наследников', 'Мұрагерлер', 'чел.', 'адам', { min: 1, max: 30, when: v => v.act === 'inherit' }), numF('pages', 1, 'Страниц', 'Беттер', 'стр.', 'бет', { min: 1, max: 500, when: v => v.act === 'copy' })],
    calc(v, R, L) {
      const N = R.notary, notes = []; let k = 0, n = 1;
      switch (v.act) {
        case 'realty': k = (v.place === 'city' ? N.realtyCity : N.realtyVillage)[+v.party]; if (v.place === 'city' && v.value <= 30 * R.MRP) notes.push(t(L, 'При стоимости до 30 МРП в городе тариф ниже — уточните у нотариуса.', 'Қалада құны 30 АЕК-ке дейін болса, тариф төмен — нотариустан нақтылаңыз.')); break;
        case 'mortgage': k = N.realtyMortgage; break;
        case 'car': k = N.car[+v.party]; notes.push(t(L, 'Договор на авто можно подписать через eGov с ЭЦП обеих сторон — без нотариуса.', 'Көлік шартына екі тарап та ЭЦҚ-мен eGov арқылы қол қоя алады — нотариуссыз.')); break;
        case 'will': k = N.will; break;
        case 'inherit': k = N.inheritCert; n = Math.max(1, Math.round(v.heirs)); break;
        case 'spouse': k = N.spouseShare; break;
        case 'poa': k = N.poaProperty; break;
        default: k = N.copyPage; n = Math.max(1, Math.round(v.pages));
      }
      const sum = k * n * R.MRP;
      notes.push(t(L, 'С 2026 года у частных нотариусов единый тариф в МРП за действие — без отдельной платы за технические услуги. От оплаты освобождены, в частности, ветераны и лица с инвалидностью. Тарифы — по приказу Министра юстиции РК № 533 от 27 сентября 2025 года.', '2026 жылдан бастап жеке нотариустарда әрекет үшін АЕК-пен бірыңғай тариф — техникалық қызметтерге бөлек ақысыз. Атап айтқанда, ардагерлер мен мүгедектігі бар адамдар төлемнен босатылады. Тарифтер — ҚР Әділет министрінің 2025 жылғы 27 қыркүйектегі № 533 бұйрығы бойынша.'));
      return { main: { label: t(L, 'Стоимость', 'Құны'), value: sum, fmt: 'money2' }, cards: [{ label: t(L, 'Тариф', 'Тариф'), value: `${mrp(L, k)}${n > 1 ? ` × ${n}` : ''}`, fmt: 'text' }], rows: [], steps: [], notes };
    }
  });

  /* ---------- Наследство по закону ---------- */
  E.add({
    id: 'inheritance', cat: 'legal',
    title: lab('Калькулятор наследства по закону', 'Заң бойынша мұра калькуляторы'), short: lab('Доли наследников по очередям ГК РК и расходы у нотариуса', 'ҚР АК кезектері бойынша мұрагерлердің үлесі және нотариус шығындары'),
    badge: (R, L) => t(L, '6 мес.', '6 ай'), keys: 'наследство по закону очередь доли наследников нотариус мұра',
    fields: [money('estate', 30000000, 'Стоимость имущества', 'Мүлік құны'), { id: 'spouse', type: 'check', def: true, label: lab('Есть переживший супруг', 'Тірі қалған жұбайы бар') },
      { id: 'joint', type: 'check', def: true, when: v => v.spouse, label: lab('Имущество нажито в браке (супругу сначала половина)', 'Мүлік некеде жиналған (жұбайына алдымен жартысы)') },
      numF('kids', 2, 'Детей', 'Балалар', 'чел.', 'адам', { half: true, max: 30 }), numF('parents', 0, 'Живых родителей', 'Тірі ата-ана', 'чел.', 'адам', { half: true, max: 2 }),
      numF('sib', 0, 'Братьев и сестёр', 'Аға-іні, апа-сіңлілер', 'чел.', 'адам', { half: true, max: 30, adv: true }), numF('grand', 0, 'Дедушек и бабушек', 'Аталар мен әжелер', 'чел.', 'адам', { half: true, max: 4, adv: true }), numF('unc', 0, 'Дядь и тёть', 'Ағалар мен апайлар', 'чел.', 'адам', { max: 30, adv: true })],
    calc(v, R, L) {
      const sp = v.spouse ? 1 : 0, half = v.spouse && v.joint ? v.estate / 2 : 0, mass = v.estate - half, k = Math.round(v.kids), p = Math.round(v.parents), s = Math.round(v.sib), g = Math.round(v.grand), u = Math.round(v.unc);
      let order, groups;
      if (sp + k + p) { order = 1; groups = [[sp, 'Супруг(а)', 'Жұбайы'], [k, 'Дети', 'Балалары'], [p, 'Родители', 'Ата-анасы']]; }
      else if (s + g) { order = 2; groups = [[s, 'Братья и сёстры', 'Аға-іні, апа-сіңлілері'], [g, 'Дедушки и бабушки', 'Аталары мен әжелері']]; }
      else if (u) { order = 3; groups = [[u, 'Дяди и тёти', 'Ағалары мен апайлары']]; }
      else return { error: t(L, 'Укажите наследников. Без наследников имущество переходит государству.', 'Мұрагерлерді көрсетіңіз. Мұрагерлер болмаса, мүлік мемлекетке өтеді.') };
      const cnt = groups.reduce((a, x) => a + x[0], 0), share = mass / cnt, fee = (R.notary.inheritCert * cnt + (half ? R.notary.spouseShare : 0)) * R.MRP;
      const rows = []; if (half) rows.push(R1(L, 'Супружеская доля (½ общего имущества)', 'Жұбайының үлесі (ортақ мүліктің ½)', half));
      groups.filter(x => x[0]).forEach(x => rows.push(R1(L, `${x[1]}: ${x[0]} × ${m(share)}`, `${x[2]}: ${x[0]} × ${m(share)}`, x[0] * share)));
      return { main: { label: t(L, 'Доля каждого наследника', 'Әр мұрагердің үлесі'), value: share }, cards: [{ label: t(L, 'Очередь', 'Кезек'), value: t(L, `${order}-я`, `${order}-кезек`), fmt: 'text' }, { label: t(L, 'Нотариус (ориентир)', 'Нотариус (бағдар)'), value: fee }], rows,
        steps: [t(L, `Наследственная масса ${m(mass)} делится поровну между ${cnt} наследниками ${order}-й очереди.`, `Мұра массасы ${m(mass)} ${order}-кезектегі ${cnt} мұрагерге тең бөлінеді.`)],
        notes: [t(L, 'Принять наследство нужно в течение 6 месяцев со дня смерти. Несовершеннолетние и нетрудоспособные дети, нетрудоспособные супруг и родители получают обязательную долю даже при завещании. Внуки наследуют долю умершего родителя по праву представления.', 'Мұраны қайтыс болған күннен бастап 6 ай ішінде қабылдау керек. Кәмелетке толмаған және еңбекке жарамсыз балалар, еңбекке жарамсыз жұбайы мен ата-анасы өсиет болса да міндетті үлес алады. Немерелер қайтыс болған ата-анасының үлесін ұсыну құқығы бойынша мұраға алады.'), NOTE_LAW(L)] };
    }
  });

  /* ---------- Развод ---------- */
  E.add({
    id: 'divorce', cat: 'legal',
    title: lab('Сколько стоит развод', 'Ажырасу қанша тұрады'), short: lab('Развод через ЗАГС или суд: пошлины и сроки', 'АХАЖ немесе сот арқылы ажырасу: баждар мен мерзімдер'),
    badge: (R, L) => `${E.num(R.courtDivorceMRP, 1)} ${t(L, 'МРП', 'АЕК')}`, keys: 'развод стоимость госпошлина загс суд расторжение брака ажырасу',
    fields: [{ id: 'agree', type: 'check', def: true, label: lab('Оба супруга согласны', 'Екі жұбай да келіседі') }, { id: 'kids', type: 'check', def: false, label: lab('Есть общие несовершеннолетние дети', 'Ортақ кәмелетке толмаған балалар бар') },
      { id: 'prop', type: 'check', def: false, label: lab('Спор о разделе имущества', 'Мүлікті бөлу туралы дау') }, money('claim', 10000000, 'Стоимость доли, которую требуете', 'Талап ететін үлестің құны', { when: v => v.prop })],
    calc(v, R, L) {
      const zags = v.agree && !v.kids && !v.prop, rows = [];
      if (zags) { const fee = R.divorceRegistry * (1 + R.VAT / 100); return { main: { label: t(L, 'Через ЗАГС', 'АХАЖ арқылы'), value: fee }, cards: [{ label: t(L, 'Срок', 'Мерзімі'), value: t(L, 'не раньше чем через месяц', 'бір айдан ерте емес'), fmt: 'text' }], rows: [R1(L, 'Плата за регистрацию (с НДС)', 'Тіркеу ақысы (ҚҚС-пен)', fee)], steps: [`${m(R.divorceRegistry)} + ${R.VAT}%`], notes: [t(L, 'Подаётся совместное заявление в ЗАГС или через eGov. Это плата за услугу, а не госпошлина — точную сумму уточните в ЦОН.', 'Бірлескен өтініш АХАЖ-ға немесе eGov арқылы беріледі. Бұл мемлекеттік баж емес, қызмет ақысы — нақты соманы ХҚКО-дан нақтылаңыз.')] }; }
      const base = R.courtDivorceMRP * R.MRP, pf = v.prop ? E.courtProp(R, v.claim, false) : 0;
      rows.push(R1(L, `Госпошлина за иск о разводе (${mrp(L, R.courtDivorceMRP)})`, `Ажырасу туралы талапқа баж (${mrp(L, R.courtDivorceMRP)})`, base, 'money2')); if (v.prop) rows.push(R1(L, `Раздел имущества: ${R.courtPropPhys}% от цены иска`, `Мүлікті бөлу: талап бағасының ${R.courtPropPhys}%-ы`, pf));
      if (v.kids) rows.push(R1(L, 'Иск об алиментах', 'Алимент туралы талап', t(L, 'без пошлины', 'бажсыз'), 'text'));
      return { main: { label: t(L, 'Через суд', 'Сот арқылы'), value: base + pf, fmt: 'money2' }, cards: [{ label: t(L, 'Срок', 'Мерзімі'), value: t(L, '1–3 месяца, с разделом — дольше', '1–3 ай, бөлумен — ұзағырақ'), fmt: 'text' }], rows, steps: [],
        notes: [t(L, 'Суд может дать супругам срок на примирение. Услуги адвоката в расчёт не входят.', 'Сот жұбайларға татуласуға мерзім беруі мүмкін. Адвокат қызметі есепке кірмейді.'), NOTE_LAW(L)] };
    }
  });

  /* ---------- Раздел имущества ---------- */
  E.add({
    id: 'property-division', cat: 'legal',
    title: lab('Раздел имущества супругов', 'Ерлі-зайыптылардың мүлкін бөлу'), short: lab('Сколько получит каждый и сколько стоит иск', 'Әрқайсысы қанша алады және талап қанша тұрады'),
    badge: () => '50/50', keys: 'раздел имущества при разводе супругов 50 на 50 совместно нажитое мүлікті бөлу',
    fields: [money('realty', 25000000, 'Квартира, дом, участок', 'Пәтер, үй, жер учаскесі'), money('cars', 8000000, 'Автомобили', 'Көліктер'), money('dep', 3000000, 'Вклады и деньги', 'Салымдар мен ақша'), money('other', 0, 'Прочее (бизнес, ценности)', 'Басқасы (бизнес, құндылықтар)'), money('debts', 0, 'Общие долги на нужды семьи', 'Отбасы қажеттіліктеріне ортақ қарыздар'),
      { id: 'share', type: 'percent', def: 50, min: 0, max: 100, step: 'any', label: lab('Ваша доля, %', 'Сіздің үлесіңіз, %'), hint: lab('По закону доли равны; суд может отступить от этого в интересах детей', 'Заң бойынша үлестер тең; сот балалардың мүддесі үшін одан ауытқуы мүмкін') }],
    calc(v, R, L) {
      const assets = v.realty + v.cars + v.dep + v.other, net = assets - v.debts, mine = net * v.share / 100, fee = E.courtProp(R, assets * v.share / 100, false);
      return { main: { label: t(L, 'Ваша часть', 'Сіздің бөлігіңіз'), value: mine }, cards: [{ label: t(L, 'Часть второго супруга', 'Екінші жұбайдың бөлігі'), value: net - mine }, { label: t(L, 'Госпошлина за иск', 'Талапқа баж'), value: fee }],
        rows: [R1(L, 'Всё общее имущество', 'Барлық ортақ мүлік', assets), R1(L, 'Минус общие долги', 'Ортақ қарыздарды шегергенде', net)], steps: [`${m(net)} × ${E.num(v.share, 'auto')}% = ${m(mine)}`],
        notes: [t(L, 'Делится только нажитое в браке. Добрачное, подаренное и унаследованное имущество остаётся у владельца. Требовать раздела после развода можно в течение 3 лет.', 'Тек некеде жиналған мүлік бөлінеді. Некеге дейінгі, сыйға тартылған және мұраға қалған мүлік иесінде қалады. Ажырасқаннан кейін бөлуді 3 жыл ішінде талап етуге болады.'), NOTE_LAW(L)] };
    }
  });

  /* ---------- Исковая давность ---------- */
  const LIM = [['gen', 'Общий срок исковой давности', 'Талап қоюдың жалпы мерзімі', 36, 'ст. 178 ГК РК', 'ҚР АК 178-бабы'], ['debt', 'Долг по договору или расписке', 'Шарт немесе қолхат бойынша қарыз', 36, 'ст. 178 ГК РК', 'ҚР АК 178-бабы'], ['damage', 'Возмещение имущественного вреда', 'Мүліктік зиянды өтеу', 36, 'ст. 178 ГК РК', 'ҚР АК 178-бабы'],
    ['labor', 'Трудовой спор (кроме увольнения)', 'Еңбек дауы (жұмыстан шығарудан басқа)', 12, 'ТК РК', 'ҚР ЕК'], ['reinst', 'Увольнение — обращение в согласительную комиссию', 'Жұмыстан шығару — келісім комиссиясына жүгіну', 1, 'ТК РК', 'ҚР ЕК'],
    ['inherit', 'Принятие наследства', 'Мұраны қабылдау', 6, 'ст. 1072 ГК РК', 'ҚР АК 1072-бабы'], ['acq', 'Приобретательная давность: недвижимость', 'Иелену мерзімі: жылжымайтын мүлік', 84, 'ст. 240 ГК РК', 'ҚР АК 240-бабы'], ['acqm', 'Приобретательная давность: движимое имущество', 'Иелену мерзімі: жылжымалы мүлік', 60, 'ст. 240 ГК РК', 'ҚР АК 240-бабы'], ['none', 'Вред жизни и здоровью, честь и достоинство', 'Өмір мен денсаулыққа зиян, ар-намыс', 0, 'ст. 187 ГК РК', 'ҚР АК 187-бабы']];
  E.add({
    id: 'statute-limitations', cat: 'legal',
    title: lab('Срок исковой давности', 'Талап қою мерзімі'), short: lab('До какой даты можно подать иск', 'Талапты қай күнге дейін беруге болады'),
    badge: (R, L) => t(L, '3 года', '3 жыл'), keys: 'срок исковой давности 3 года дата иска гк рк талап қою мерзімі',
    fields: [{ id: 'cat', type: 'select', def: 'gen', label: lab('Требование', 'Талап'), options: LIM.map(c => ({ v: c[0], ru: c[1], kk: c[2] })) }, { id: 'd', type: 'date', def: 'today', label: lab('Когда узнали о нарушении', 'Бұзушылық туралы қашан білдіңіз') }],
    calc(v, R, L) {
      const c = LIM.find(x => x[0] === v.cat), d = E.parseDate(v.d);
      if (!d) return { error: t(L, 'Укажите дату', 'Күнді көрсетіңіз') };
      if (!c[3]) return { main: { label: t(L, 'Срок', 'Мерзімі'), value: t(L, 'давность не применяется', 'мерзім қолданылмайды'), fmt: 'text' }, rows: [R1(L, 'Норма', 'Норма', t(L, c[4], c[5]), 'text')], steps: [], notes: [t(L, 'По закону на эти требования исковая давность не распространяется (с оговорками для отдельных требований о возмещении).', 'Заң бойынша бұл талаптарға талап қою мерзімі қолданылмайды (өтеу туралы жекелеген талаптарға ескертпелермен).'), NOTE_LAW(L)] };
      const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + c[3], d.getUTCDate())), today = E.parseDate(E.todayISO()), left = E.daysBetween(today, end);
      return { main: { label: t(L, 'Последний день', 'Соңғы күн'), value: E.fmtDate(end, L), fmt: 'text' }, cards: [{ label: left >= 0 ? t(L, 'Осталось дней', 'Қалған күндер') : t(L, 'Срок истёк дней назад', 'Мерзім өткеннен бері күн'), value: Math.abs(left), fmt: 'num' }],
        rows: [R1(L, 'Срок', 'Мерзімі', c[3] % 12 ? t(L, `${c[3]} ${E.plural(c[3], 'месяц', 'месяца', 'месяцев')}`, `${c[3]} ай`) : t(L, `${c[3] / 12} ${E.plural(c[3] / 12, 'год', 'года', 'лет')}`, `${c[3] / 12} жыл`), 'text'), R1(L, 'Норма', 'Норма', t(L, c[4], c[5]), 'text')], steps: [],
        notes: [t(L, 'Срок течёт с момента, когда лицо узнало или должно было узнать о нарушении. Он прерывается иском или признанием долга (в том числе частичной оплатой) и после этого начинается заново. Если последний день нерабочий, срок переносится на следующий рабочий день. Суд применяет давность только по заявлению ответчика.', 'Мерзім адам бұзушылық туралы білген немесе білуге тиіс болған сәттен басталады. Ол талап қоюмен немесе қарызды мойындаумен (оның ішінде ішінара төлеммен) үзіледі және содан кейін қайта басталады. Соңғы күн жұмыс күні болмаса, мерзім келесі жұмыс күніне ауысады. Сот мерзімді тек жауапкердің өтініші бойынша қолданады.'), NOTE_LAW(L)] };
    }
  });

  /* ---------- Банкротство физлиц ---------- */
  E.add({
    id: 'bankruptcy', cat: 'legal',
    title: lab('Банкротство физических лиц', 'Жеке тұлғалардың банкроттығы'), short: lab('Какая процедура подходит: внесудебная, судебная или восстановление', 'Қандай рәсім сәйкес: соттан тыс, сот немесе қалпына келтіру'),
    badge: (R, L) => `${E.num(R.bankruptOutMRP)} ${t(L, 'МРП', 'АЕК')}`, keys: 'банкротство физлиц внесудебное 1600 мрп долги списание банкроттық',
    fields: [money('debt', 5000000, 'Сумма всех долгов', 'Барлық қарыз сомасы'), numF('over', 12, 'Нет платежей подряд', 'Қатарынан төлем жоқ', 'мес.', 'ай', { max: 600 }), { id: 'banks', type: 'check', def: true, label: lab('Долги только банкам, МФО и коллекторам', 'Қарыздар тек банктерге, МҚҰ мен коллекторларға') },
      { id: 'prop', type: 'check', def: false, label: lab('Есть имущество в собственности', 'Меншікте мүлік бар') }, money('inc', 200000, 'Доход в месяц', 'Айлық табыс'), money('exp', 150000, 'Обязательные расходы в месяц', 'Айлық міндетті шығыстар')],
    calc(v, R, L) {
      const lim = R.bankruptOutMRP * R.MRP, free = v.inc - v.exp, rows = [R1(L, `Порог внесудебной процедуры (${mrp(L, R.bankruptOutMRP)})`, `Соттан тыс рәсім шегі (${mrp(L, R.bankruptOutMRP)})`, lim)]; let proc, fee = 0;
      if (v.debt <= lim && v.over >= R.bankruptOverdueMonths && v.banks && !v.prop) proc = t(L, 'Внесудебное банкротство', 'Соттан тыс банкроттық');
      else if (free > 0 && free * 60 >= v.debt) { proc = t(L, 'Восстановление платёжеспособности', 'Төлем қабілеттілігін қалпына келтіру'); fee = R.courtBankruptPhysMRP * R.MRP; rows.push(R1(L, 'Погасите долг примерно за', 'Қарызды шамамен өтейсіз', t(L, `${Math.ceil(v.debt / free)} мес.`, `${Math.ceil(v.debt / free)} ай`), 'text')); }
      else { proc = t(L, 'Судебное банкротство', 'Сот банкроттығы'); fee = R.courtBankruptPhysMRP * R.MRP; }
      return { main: { label: t(L, 'Подходящая процедура', 'Сәйкес рәсім'), value: proc, fmt: 'text' }, cards: [{ label: t(L, 'Госпошлина', 'Мемлекеттік баж'), value: fee, fmt: 'money2' }], rows, steps: [],
        notes: [t(L, 'Внесудебная процедура бесплатна и подаётся через eGov: долг до 1 600 МРП, нет платежей 12 месяцев подряд, нет имущества и иных кредиторов. В судебной процедуре работает финансовый управляющий, его услуги оплачиваются отдельно. Основание — Закон РК «О восстановлении платёжеспособности и банкротстве граждан Республики Казахстан».', 'Соттан тыс рәсім тегін және eGov арқылы беріледі: қарыз 1 600 АЕК-ке дейін, 12 ай қатарынан төлем жоқ, мүлік пен басқа кредиторлар жоқ. Сот рәсімінде қаржы басқарушысы жұмыс істейді, оның қызметі бөлек төленеді. Негіз — «Қазақстан Республикасы азаматтарының төлем қабілеттілігін қалпына келтіру және банкроттығы туралы» ҚР Заңы.'), NOTE_LAW(L)] };
    }
  });

  /* ---------- Моральный вред ---------- */
  const MD = [['health', 'Вред жизни и здоровью', 'Өмір мен денсаулыққа зиян', 0], ['labor', 'Нарушение трудовых прав', 'Еңбек құқықтарын бұзу', 0], ['prosec', 'Незаконное осуждение или арест', 'Заңсыз сотталу немесе қамалу', 0], ['defam', 'Распространение порочащих сведений', 'Абыройға нұқсан келтіретін мәліметтер тарату', 1], ['other', 'Иное нарушение неимущественных прав', 'Мүліктік емес құқықтардың басқа бұзылуы', 2]];
  E.add({
    id: 'moral-damage', cat: 'legal',
    title: lab('Иск о моральном вреде: госпошлина', 'Моральдық зиян туралы талап: мемлекеттік баж'), short: lab('Сколько стоит подать иск о компенсации морального вреда', 'Моральдық зиянды өтеу туралы талап беру қанша тұрады'),
    badge: (R, L) => t(L, 'пошлина', 'баж'), keys: 'моральный вред компенсация иск госпошлина моральдық зиян',
    fields: [{ id: 'kind', type: 'select', def: 'defam', label: lab('Основание', 'Негіз'), options: MD.map(c => ({ v: c[0], ru: c[1], kk: c[2] })) }, money('sum', 1000000, 'Сумма, которую требуете', 'Талап ететін сома', { when: v => v.kind === 'defam' })],
    calc(v, R, L) {
      const c = MD.find(x => x[0] === v.kind), fee = c[3] === 0 ? 0 : c[3] === 1 ? E.courtProp(R, v.sum, false) : R.courtNonPropMRP * R.MRP;
      return { main: { label: t(L, 'Госпошлина', 'Мемлекеттік баж'), value: fee, fmt: 'money2' }, cards: [{ label: t(L, 'Как посчитано', 'Қалай есептелді'), value: c[3] === 0 ? t(L, 'освобождено', 'босатылған') : c[3] === 1 ? `${R.courtPropPhys}%` : mrp(L, R.courtNonPropMRP), fmt: 'text' }], rows: [], steps: [],
        notes: [t(L, 'Размер компенсации определяет суд с учётом характера страданий, вины и требований разумности (ст. 951–952 ГК РК). Фиксированных сумм закон не устанавливает, поэтому калькулятор их не прогнозирует.', 'Өтемақы мөлшерін сот азаптың сипатын, кінәні және ақылға қонымдылық талаптарын ескере отырып айқындайды (ҚР АК 951–952-баптары). Заң тіркелген сомаларды белгілемейді, сондықтан калькулятор оларды болжамайды.'), NOTE_LAW(L)] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Пенсии, пособия, трудовые выплаты */
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

  /* ---------- Пенсия ---------- */
  E.add({
    id: 'pension', cat: 'social', popular: true,
    title: lab('Пенсионный калькулятор', 'Зейнетақы калькуляторы'), short: lab('Базовая, солидарная и накопительная пенсия', 'Базалық, ортақ және жинақтаушы зейнетақы'),
    badge: (R, L) => t(L, `${R.retireMen} / ${R.retireWomen} лет`, `${R.retireMen} / ${R.retireWomen} жас`), keys: 'пенсия размер пенсии базовая солидарная накопительная енпф зейнетақы',
    fields: [sexF, numF('birth', 1975, 'Год рождения', 'Туған жылы', '', '', { min: 1930, max: 2010 }), numF('st98', 5, 'Стаж до 1998 года', '1998 жылға дейінгі өтіл', 'лет', 'жыл', { half: true, max: 50 }), numF('st', 25, 'Стаж после 1998 года', '1998 жылдан кейінгі өтіл', 'лет', 'жыл', { half: true, max: 60 }),
      money('inc', 250000, 'Средний доход за любые 3 года подряд с 1998 года', '1998 жылдан бастап қатарынан кез келген 3 жылдағы орташа табыс', { when: v => v.st98 > 0 }), money('enpf', 5000000, 'Накопления в ЕНПФ сейчас', 'Қазіргі БЖЗҚ-дағы жинақ'),
      money('opv', 30000, 'ОПВ в месяц до пенсии', 'Зейнетке дейін айлық МЗЖ', { adv: true }), pct('ret', 9, 'Доходность ЕНПФ, % в год', 'БЖЗҚ кірістілігі, жылына %', { adv: true })],
    calc(v, R, L) {
      const ry = retireYear(v.sex, Math.round(v.birth), R), years = E.pos(ry - R.year), stTot = v.st98 + v.st;
      const bp = Math.min(R.basePensionMin + 2 * Math.max(Math.floor(stTot) - 10, 0), R.basePensionMax), base = R.PM * bp / 100;
      const norm = v.sex === 'm' ? 25 : 20; let sol = 0;
      if (v.st98 > 0) { const p = Math.min(60 + Math.max(0, Math.floor(v.st98) - norm), 75), full = Math.max(Math.min(v.inc, R.solidaryCapMRP * R.MRP) * p / 100, R.minPension); sol = full * Math.min(v.st98 / norm, 1); }
      let fv = v.enpf; for (let k = 0; k < years * 12; k++) fv = fv * (1 + v.ret / 1200) + v.opv;
      const lump = fv <= 12 * R.minPension, acc = lump ? 0 : Math.max(fv * R.enpfPayoutPct / 100 / 12, 0.7 * R.PM);
      return { main: { label: t(L, 'Пенсия в месяц', 'Айлық зейнетақы'), value: base + sol + acc }, cards: [{ label: t(L, 'Год выхода на пенсию', 'Зейнетке шығу жылы'), value: String(ry), fmt: 'text' }, { label: t(L, 'Накопления к пенсии', 'Зейнетке дейінгі жинақ'), value: fv }],
        rows: [R1(L, `Базовая (${bp}% прожиточного минимума)`, `Базалық (күнкөріс деңгейінің ${bp}%-ы)`, base), R1(L, 'Солидарная (за стаж до 1998 года)', 'Ортақ (1998 жылға дейінгі өтіл үшін)', sol), R1(L, lump ? 'Накопительная: выплатят сразу всей суммой' : 'Накопительная (из ЕНПФ)', lump ? 'Жинақтаушы: бүкіл сомамен бірден төленеді' : 'Жинақтаушы (БЖЗҚ-дан)', lump ? fv : acc)],
        steps: [t(L, `Пенсионный возраст: ${E.num(E.retireAge(v.sex, ry, R), 'auto')} лет. Суммы — в ценах 2026 года, без индексации.`, `Зейнеткерлік жас: ${E.num(E.retireAge(v.sex, ry, R), 'auto')}. Сомалар — 2026 жылғы бағамен, индекстеусіз.`)],
        notes: [t(L, 'Солидарная пенсия назначается при стаже до 1998 года не меньше 6 месяцев. Выплата из ЕНПФ в первый год — 6,5% накоплений, не меньше 70% прожиточного минимума. Свой прогноз смотрите в личном кабинете enpf.kz.', 'Ортақ зейнетақы 1998 жылға дейінгі өтіл кемінде 6 ай болса тағайындалады. БЖЗҚ-дан бірінші жылғы төлем — жинақтың 6,5%-ы, күнкөріс деңгейінің 70%-ынан кем емес. Өз болжамыңызды enpf.kz жеке кабинетінен қараңыз.'), NOTE_SOC(L)] };
    }
  });

  /* ---------- Пенсионный аннуитет ---------- */
  E.add({
    id: 'pension-annuity', cat: 'social',
    title: lab('Пенсионный аннуитет', 'Зейнетақы аннуитеті'), short: lab('Примерная пожизненная выплата от страховой компании', 'Сақтандыру компаниясынан өмір бойы төленетін шамамен төлем'),
    badge: (R, L) => t(L, 'пожизненно', 'өмір бойы'), keys: 'пенсионный аннуитет страховая компания пожизненная выплата енпф аннуитет',
    fields: [sexF, numF('age', 55, 'Возраст начала выплат', 'Төлемдердің басталу жасы', 'лет', 'жыл', { min: 45, max: 80 }), money('sum', 15000000, 'Пенсионные накопления', 'Зейнетақы жинағы'),
      numF('le', 80, 'Ожидаемая продолжительность жизни', 'Күтілетін өмір ұзақтығы', 'лет', 'жыл', { adv: true, min: 60, max: 100 }), pct('real', 3, 'Доходность страховщика сверх индексации, %', 'Индекстеуден тыс сақтандырушы кірістілігі, %', { adv: true })],
    calc(v, R, L) {
      const n = Math.max(5, v.le - v.age) * 12, i = v.real / 1200, pay = i === 0 ? v.sum / n : v.sum * i / (1 - Math.pow(1 + i, -n)), min = 0.7 * R.PM;
      return { main: { label: t(L, 'Выплата в месяц', 'Айлық төлем'), value: pay }, cards: [{ label: t(L, 'Минимум для аннуитета', 'Аннуитет үшін ең аз'), value: min }, { label: pay >= min ? t(L, 'Накоплений хватает', 'Жинақ жетеді') : t(L, 'Накоплений не хватает', 'Жинақ жетпейді'), value: pay >= min ? '✓' : '✗', fmt: 'text' }],
        rows: [R1(L, 'Срок выплат в расчёте', 'Есептегі төлем мерзімі', yrs(L, n / 12), 'text')], steps: [t(L, 'Накопления делятся на ожидаемый срок выплат с учётом доходности; выплаты ежегодно индексируются.', 'Жинақ кірістілікті ескере отырып, күтілетін төлем мерзіміне бөлінеді; төлемдер жыл сайын индекстеледі.')],
        notes: [t(L, 'Это грубая оценка. Точную сумму считает страховая компания по своим тарифам и таблицам смертности — сравните 2–3 предложения. Накоплений должно хватать на выплату не ниже 70% прожиточного минимума.', 'Бұл шамамен бағалау. Нақты соманы сақтандыру компаниясы өз тарифтері мен өлім кестелері бойынша есептейді — 2–3 ұсынысты салыстырыңыз. Жинақ күнкөріс деңгейінің 70%-ынан кем емес төлемге жетуі керек.')] };
    }
  });

  /* ---------- Пособие по потере работы ---------- */
  const unempK = n => n < 6 ? 0 : n < 12 ? 0.7 : n < 24 ? 0.75 : n < 36 ? 0.85 : n < 48 ? 0.9 : n < 60 ? 0.95 : n < 72 ? 1 : Math.min(1.3, 1 + 0.02 * Math.floor((n - 60) / 12));
  const unempN = n => n < 6 ? 0 : n < 12 ? 1 : n < 24 ? 2 : n < 36 ? 3 : n < 48 ? 4 : n < 60 ? 5 : 6;
  E.add({
    id: 'unemployment', cat: 'social',
    title: lab('Пособие по потере работы', 'Жұмыстан айырылу бойынша жәрдемақы'), short: lab('Выплата ГФСС при увольнении: размер и срок', 'Жұмыстан шыққанда МӘСҚ төлемі: мөлшері мен мерзімі'),
    badge: () => '45%', keys: 'пособие по безработице потеря работы гфсс увольнение выплата жұмыссыздық',
    fields: [money('inc', 400000, 'Средний доход за последние 24 месяца', 'Соңғы 24 айдағы орташа табыс'), numF('st', 36, 'Стаж уплаты соцотчислений', 'Әлеуметтік аударымдар өтілі', 'мес.', 'ай', { max: 600 })],
    calc(v, R, L) {
      const st = Math.round(v.st), k = unempK(st), n = unempN(st);
      if (!k) return { error: t(L, 'Нужно не меньше 6 месяцев уплаты социальных отчислений', 'Кемінде 6 ай әлеуметтік аударымдар төленуі керек') };
      const base = Math.min(v.inc, R.unempCapMZP * R.MZP), pay = base * R.unempReplace / 100 * k, opv = pay * R.OPV / 100;
      return { main: { label: t(L, 'Выплата в месяц', 'Айлық төлем'), value: pay }, cards: [{ label: t(L, 'Срок', 'Мерзімі'), value: t(L, `${n} ${E.plural(n, 'месяц', 'месяца', 'месяцев')}`, `${n} ай`), fmt: 'text' }, { label: t(L, 'На руки за весь срок', 'Бүкіл мерзімге қолға'), value: (pay - opv) * n }],
        rows: [R1(L, `Доход для расчёта (не больше ${R.unempCapMZP} МЗП)`, `Есептеуге арналған табыс (${R.unempCapMZP} ЕТЖ-дан аспайды)`, base), R1(L, 'Коэффициент стажа', 'Өтіл коэффициенті', E.num(k, 2), 'text'), R1(L, `Удерживается ОПВ ${R.OPV}%`, `${R.OPV}% МЗЖ ұсталады`, opv)],
        steps: [`${m(base)} × ${R.unempReplace}% × ${E.num(k, 2)} = ${m(pay)}`],
        notes: [t(L, 'Сначала нужно встать на учёт безработным в карьерном центре или на enbek.kz. С 1 января 2027 года срок выплаты — не больше 3 месяцев, а размер — не выше 45% от 7 МЗП.', 'Алдымен мансап орталығында немесе enbek.kz-те жұмыссыз ретінде тіркелу керек. 2027 жылғы 1 қаңтардан бастап төлем мерзімі — 3 айдан аспайды, ал мөлшері — 7 ЕТЖ-ның 45%-ынан аспайды.'), NOTE_SOC(L)] };
    }
  });

  /* ---------- АСП ---------- */
  E.add({
    id: 'social-assistance', cat: 'social',
    title: lab('Адресная социальная помощь (АСП)', 'Атаулы әлеуметтік көмек (АӘК)'), short: lab('Положена ли семье АСП и в каком размере', 'Отбасына АӘК тиесілі ме және қандай мөлшерде'),
    badge: () => 'АСП', keys: 'асп адресная социальная помощь малообеспеченные черта бедности атаулы әлеуметтік көмек',
    fields: [money('inc', 200000, 'Доход семьи за прошлый квартал', 'Отбасының өткен тоқсандағы табысы'), numF('n', 4, 'Членов семьи', 'Отбасы мүшелері', 'чел.', 'адам', { min: 1, max: 20 }), numF('kids', 1, 'Из них детей от 1 до 6 лет', 'Оның ішінде 1-ден 6 жасқа дейінгі балалар', 'чел.', 'адам', { max: 20 }),
      money('line', 35596, 'Черта бедности в вашем регионе', 'Өңіріңіздегі кедейлік шегі', { hint: lab('Устанавливает акимат; часто 70% прожиточного минимума', 'Әкімдік белгілейді; көбіне күнкөріс деңгейінің 70%-ы') })],
    calc(v, R, L) {
      const n = Math.max(1, Math.round(v.n)), per = v.inc / n / 3, ok = per <= v.line, main = ok ? (v.line - per) * n : 0, kid = ok ? Math.round(v.kids) * R.aspChildMRP * R.MRP : 0;
      return { main: { label: t(L, 'АСП в месяц', 'Айына АӘК'), value: main + kid }, cards: [{ label: t(L, 'Доход на человека в месяц', 'Адам басына айлық табыс'), value: per }, { label: ok ? t(L, 'Право на АСП есть', 'АӘК алуға құқық бар') : t(L, 'Доход выше черты бедности', 'Табыс кедейлік шегінен жоғары'), value: ok ? '✓' : '✗', fmt: 'text' }],
        rows: [R1(L, 'Основная выплата', 'Негізгі төлем', main), R1(L, `Доплата на детей 1–6 лет (${E.num(R.aspChildMRP, 1)} МРП)`, `1–6 жастағы балаларға қосымша (${E.num(R.aspChildMRP, 1)} АЕК)`, kid)],
        steps: [`(${m(v.line)} − ${m(per)}) × ${n} = ${m(main)}`],
        notes: [t(L, 'Заявление подают в карьерный центр, акиму села или через eGov. Трудоспособные члены семьи должны встать на учёт как ищущие работу.', 'Өтінішті мансап орталығына, ауыл әкіміне немесе eGov арқылы береді. Еңбекке қабілетті отбасы мүшелері жұмыс іздеуші ретінде тіркелуі керек.'), NOTE_SOC(L)] };
    }
  });

  /* ---------- ГОНС ---------- */
  E.add({
    id: 'gons', cat: 'education',
    title: lab('Калькулятор ГОНС', 'БЖЖМ калькуляторы'), short: lab('Накопления на образование ребёнка с премией государства', 'Мемлекет сыйлықақысымен баланың біліміне жинақ'),
    badge: (R) => `+${R.gonsPremium}%`, keys: 'гонс образовательный вклад накопления на учёбу ребенка премия государства білім жинақ',
    fields: [money('start', 500000, 'Первый взнос', 'Алғашқы жарна'), money('add', 20000, 'Пополнение в месяц', 'Айлық толықтыру'), numF('years', 10, 'Срок накопления', 'Жинау мерзімі', 'лет', 'жыл', { min: 1, max: 20 }), pct('rate', 13, 'Ставка банка, %', 'Банк мөлшерлемесі, %'), { id: 'prio', type: 'check', def: false, label: lab('Приоритетная категория (премия 7%)', 'Басым санат (7% сыйлықақы)') }],
    calc(v, R, L) {
      const y = Math.round(v.years), pp = v.prio ? R.gonsPremiumPriority : R.gonsPremium, cap = R.gonsCapMRP * R.MRP; let bal = v.start, paid = v.start, prem = 0, int = 0;
      for (let k = 1; k <= y * 12; k++) { const i = bal * v.rate / 1200; bal += i + v.add; int += i; paid += v.add; if (k % 12 === 0) { const p = Math.min(bal * pp / 100, cap); bal += p; prem += p; } }
      return { main: { label: t(L, 'Накопится', 'Жиналады'), value: bal }, cards: [{ label: t(L, 'Премия государства', 'Мемлекет сыйлықақысы'), value: prem }, { label: t(L, 'Проценты банка', 'Банк сыйақысы'), value: int }], rows: [R1(L, 'Внесено', 'Салынды', paid)],
        steps: [t(L, `Каждый год государство начисляет ${pp}% на сумму вклада, но не больше ${R.gonsCapMRP} МРП (${m(cap)}).`, `Мемлекет жыл сайын салым сомасына ${pp}% қосады, бірақ ${R.gonsCapMRP} АЕК-тен (${m(cap)}) аспайды.`)],
        notes: [t(L, 'Премия государства идёт только на оплату образования ребёнка. Условия вклада и порядок выплаты уточняйте в банке-участнике программы.', 'Мемлекет сыйлықақысы тек баланың білімін төлеуге жұмсалады. Салым шарттары мен төлеу тәртібін бағдарламаға қатысушы банктен нақтылаңыз.')] };
    }
  });

  /* ---------- Порог достаточности ЕНПФ ---------- */
  E.add({
    id: 'enpf-threshold', cat: 'social',
    title: lab('Излишек пенсионных накоплений ЕНПФ', 'БЖЗҚ зейнетақы жинағының артығы'), short: lab('Сколько можно снять на жильё или лечение по порогу 2026 года', '2026 жылғы шек бойынша тұрғын үйге немесе емделуге қанша алуға болады'),
    badge: () => 'ПМД', keys: 'порог достаточности енпф излишек снять пенсионные на жилье лечение жеткіліктілік шегі',
    fields: [numF('age', 35, 'Ваш возраст', 'Жасыңыз', 'лет', 'жыл', { min: 18, max: 80 }), money('sum', 15000000, 'Накопления по ОПВ в ЕНПФ', 'БЖЗҚ-дағы МЗЖ бойынша жинақ', { hint: lab('Без сумм, переданных управляющим инвестпортфелем', 'Инвестициялық портфель басқарушыларына берілген сомаларсыз') })],
    calc(v, R, L) {
      const a = E.clamp(Math.round(v.age), 20, 62), thr = R.enpfThreshold[a], ex = v.sum - thr;
      return { main: { label: ex > 0 ? t(L, 'Можно использовать', 'Пайдалануға болады') : t(L, 'Не хватает до порога', 'Шекке дейін жетпейді'), value: Math.abs(ex) }, cards: [{ label: t(L, `Порог для ${a} лет`, `${a} жасқа шек`), value: thr }], rows: [],
        steps: [`${m(v.sum)} − ${m(thr)} = ${m(ex)}`],
        notes: [t(L, 'Пороги 2026 года — по методике ПП РК № 422 от 21 мая 2026 года. Излишек переводится уполномоченному оператору на жильё или лечение, наличными не выдаётся. Точную сумму смотрите на enpf.kz или в eGov.', '2026 жылғы шектер — 2026 жылғы 21 мамырдағы № 422 ҚР ҮҚ әдістемесі бойынша. Артық сома тұрғын үйге немесе емделуге уәкілетті операторға аударылады, қолма-қол берілмейді. Нақты соманы enpf.kz-тен немесе eGov-тан қараңыз.')] };
    }
  });

  /* ---------- Выходное пособие ---------- */
  E.add({
    id: 'severance-pay', cat: 'payroll',
    title: lab('Расчёт при увольнении', 'Жұмыстан шыққандағы есеп'), short: lab('Компенсация за отпуск и выходное пособие', 'Демалыс үшін өтемақы және шығу жәрдемақысы'),
    badge: (R, L) => t(L, 'ст. 131 ТК', 'ЕК 131-б.'), keys: 'выходное пособие увольнение сокращение компенсация за отпуск расчёт жұмыстан шығу',
    fields: [money('avg', 300000, 'Средняя зарплата в месяц за последние 12 месяцев', 'Соңғы 12 айдағы айлық орташа жалақы'), { id: 'why', type: 'select', def: 'own', label: lab('Основание увольнения', 'Жұмыстан шығу негізі'), options: [{ v: 'own', ru: 'По своему желанию или соглашению', kk: 'Өз қалауымен немесе келісім бойынша' }, { v: 'red', ru: 'Сокращение или ликвидация', kk: 'Қысқарту немесе тарату' }, { v: 'viol', ru: 'Работодатель нарушил трудовой договор', kk: 'Жұмыс беруші еңбек шартын бұзды' }, { v: 'eco', ru: 'Снижение объёма производства', kk: 'Өндіріс көлемінің төмендеуі' }] },
      numF('vac', 12, 'Неиспользованный отпуск', 'Пайдаланылмаған демалыс', 'кал. дн.', 'күнт. күн', { max: 365 })],
    calc(v, R, L) {
      const sdz = v.avg * 12 / 247, wd = Math.round(v.vac * 5 / 7), comp = sdz * wd, k = v.why === 'red' || v.why === 'viol' ? 1 : v.why === 'eco' ? 2 : 0, sev = v.avg * k, g = comp + sev;
      const p = E.payroll(g, { employer: 'llp', cat: 'std', ded: true, ytd: 0 }, R);
      return { main: { label: t(L, 'К выплате на руки', 'Қолға төленеді'), value: p.net }, cards: [{ label: t(L, 'Начислено', 'Есептелді'), value: g }],
        rows: [R1(L, `Компенсация за отпуск: ${wd} раб. дн. × ${m(sdz)}`, `Демалыс өтемақысы: ${wd} жұм. күн × ${m(sdz)}`, comp), R1(L, k ? `Выходное пособие: ${k} ${E.plural(k, 'средняя зарплата', 'средние зарплаты', 'средних зарплат')}` : 'Выходное пособие не положено', k ? `Шығу жәрдемақысы: ${k} орташа жалақы` : 'Шығу жәрдемақысы тиесілі емес', sev), R1(L, 'ОПВ, ВОСМС и ИПН', 'МЗЖ, МӘМСЖ және ЖТС', p.opv + p.vosms + p.ipn)],
        steps: [t(L, 'Средний дневной заработок = зарплата за 12 месяцев ÷ рабочие дни (247 в 2026 году). Календарные дни отпуска переведены в рабочие примерно (× 5/7).', 'Орташа күндік жалақы = 12 айдағы жалақы ÷ жұмыс күндері (2026 жылы 247). Демалыстың күнтізбелік күндері шамамен жұмыс күндеріне аударылды (× 5/7).')],
        notes: [t(L, 'Трудовым или коллективным договором выходное пособие может быть больше. Расчёт выплачивается в день увольнения. Точная сумма компенсации зависит от рабочих дней, приходящихся на период отпуска.', 'Еңбек немесе ұжымдық шартта шығу жәрдемақысы көбірек болуы мүмкін. Есеп жұмыстан шыққан күні төленеді. Өтемақының нақты сомасы демалыс кезеңіне келетін жұмыс күндеріне байланысты.')] };
    }
  });

  /* ---------- Средний заработок ---------- */
  E.add({
    id: 'average-earnings', cat: 'payroll',
    title: lab('Средний заработок', 'Орташа жалақы'), short: lab('Средний дневной и часовой заработок по правилам № 908', '№ 908 қағидалар бойынша орташа күндік және сағаттық жалақы'),
    badge: (R, L) => t(L, 'СДЗ', 'ОКЖ'), keys: 'средний заработок сдз средний дневной расчет отпускных орташа жалақы',
    fields: [money('sum', 3600000, 'Зарплата за последние 12 месяцев', 'Соңғы 12 айдағы жалақы', { hint: lab('Без материальной помощи и выплат, не связанных с работой', 'Материалдық көмек пен жұмысқа байланысты емес төлемдерсіз') }), numF('days', 247, 'Отработано рабочих дней', 'Жұмыс істеген жұмыс күндері', 'дн.', 'күн', { min: 1, max: 366 }), numF('hours', 1976, 'Отработано часов', 'Жұмыс істеген сағаттар', 'ч', 'сағ', { adv: true, min: 1 })],
    calc(v, R, L) {
      const d = v.sum / Math.max(1, v.days), h = v.sum / Math.max(1, v.hours);
      return { main: { label: t(L, 'Средний дневной заработок', 'Орташа күндік жалақы'), value: d, fmt: 'money2' }, cards: [{ label: t(L, 'Средний часовой', 'Орташа сағаттық'), value: h, fmt: 'money2' }, { label: t(L, 'В среднем в месяц', 'Айына орташа'), value: v.sum / 12 }], rows: [], steps: [`${m(v.sum)} ÷ ${E.num(v.days)} = ${m(d, 2)}`],
        notes: [t(L, 'Расчётный период — 12 месяцев перед событием. Если отработано меньше, берут фактическое время. Норма 2026 года при пятидневке — 247 рабочих дней и 1 976 часов.', 'Есеп кезеңі — оқиғаға дейінгі 12 ай. Аз жұмыс істесе, нақты уақыт алынады. Бес күндік аптада 2026 жылғы норма — 247 жұмыс күні және 1 976 сағат.')] };
    }
  });

  /* ---------- Сверхурочные ---------- */
  E.add({
    id: 'overtime', cat: 'payroll',
    title: lab('Оплата сверхурочных, выходных и ночных часов', 'Үстеме, демалыс және түнгі сағаттарға ақы'), short: lab('Не ниже полуторного размера часовой ставки', 'Сағаттық мөлшерлеменің бір жарым еселенген мөлшерінен кем емес'),
    badge: () => '×1,5', keys: 'сверхурочные выходные праздничные ночные часы оплата 1.5 үстеме жұмыс',
    fields: [money('salary', 300000, 'Месячный оклад', 'Айлық жалақы'), numF('norm', 164.7, 'Норма часов в месяце', 'Айдағы сағат нормасы', 'ч', 'сағ', { step: 'any', min: 1 }), numF('h', 8, 'Часов сверх нормы, в выходной или ночью', 'Нормадан тыс, демалыста немесе түнде сағаттар', 'ч', 'сағ', { step: 'any' }), { id: 'k', type: 'number', def: 1.5, min: 1.5, max: 5, step: 'any', label: lab('Коэффициент оплаты', 'Ақы коэффициенті'), hint: lab('По закону — не ниже 1,5; договор может установить больше', 'Заң бойынша — 1,5-тен кем емес; шарт көбірек белгілей алады') }],
    calc(v, R, L) {
      const rate = v.salary / v.norm, sum = rate * v.h * v.k;
      return { main: { label: t(L, 'Доплата (до налогов)', 'Қосымша ақы (салыққа дейін)'), value: sum }, cards: [{ label: t(L, 'Часовая ставка', 'Сағаттық мөлшерлеме'), value: rate, fmt: 'money2' }], rows: [], steps: [`${m(v.salary)} ÷ ${E.num(v.norm, 1)} × ${E.num(v.h, 'auto')} × ${E.num(v.k, 'auto')} = ${m(sum)}`],
        notes: [t(L, 'Сверхурочные — не больше 2 часов в день и 12 часов в месяц. Они запрещены для беременных, работников до 18 лет и лиц с инвалидностью. Вместо оплаты работы в выходной работник может выбрать другой день отдыха.', 'Үстеме жұмыс — күніне 2 сағаттан және айына 12 сағаттан аспайды. Ол жүкті әйелдерге, 18 жасқа толмаған қызметкерлерге және мүгедектігі бар адамдарға тыйым салынған. Демалыс күнгі жұмыс үшін ақының орнына қызметкер басқа демалыс күнін таңдай алады.')] };
    }
  });

  /* ---------- Совместительство ---------- */
  E.add({
    id: 'second-job', cat: 'payroll',
    title: lab('Зарплата по совместительству', 'Қоса атқарудағы жалақы'), short: lab('Налоги на основной и второй работе: вычет 30 МРП только у одного агента', 'Негізгі және екінші жұмыстағы салықтар: 30 АЕК шегерімі тек бір агентте'),
    badge: (R, L) => t(L, '2 работы', '2 жұмыс'), keys: 'совместительство вторая работа налоги вычет 30 мрп қоса атқару',
    fields: [money('main', 400000, 'Зарплата на основной работе', 'Негізгі жұмыстағы жалақы'), money('second', 200000, 'Зарплата на второй работе', 'Екінші жұмыстағы жалақы'), { id: 'where', type: 'seg', def: 'main', label: lab('Где применяется вычет 30 МРП', '30 АЕК шегерімі қайда қолданылады'), options: [{ v: 'main', ru: 'На основной', kk: 'Негізгіде' }, { v: 'second', ru: 'На второй', kk: 'Екіншіде' }] }],
    calc(v, R, L) {
      const a = E.payroll(v.main, { employer: 'llp', cat: 'std', ded: v.where === 'main', ytd: 0 }, R), b = E.payroll(v.second, { employer: 'llp', cat: 'std', ded: v.where === 'second', ytd: 0 }, R);
      return { main: { label: t(L, 'Всего на руки', 'Барлығы қолға'), value: a.net + b.net }, cards: [{ label: t(L, 'Основная', 'Негізгі'), value: a.net }, { label: t(L, 'Вторая', 'Екінші'), value: b.net }],
        rows: [R1(L, 'ИПН на основной', 'Негізгідегі ЖТС', a.ipn), R1(L, 'ИПН на второй', 'Екіншідегі ЖТС', b.ipn), R1(L, 'ОПВ всего', 'Барлығы МЗЖ', a.opv + b.opv), R1(L, 'ВОСМС всего', 'Барлығы МӘМСЖ', a.vosms + b.vosms)], steps: [],
        notes: [t(L, 'Базовый вычет 30 МРП применяет только один налоговый агент — по заявлению работника. Работа по основному месту и по совместительству вместе — не больше 12 часов в сутки.', '30 АЕК базалық шегерімін тек бір салық агенті — қызметкердің өтініші бойынша қолданады. Негізгі жұмыс пен қоса атқарылатын жұмыс бірге — тәулігіне 12 сағаттан аспайды.')] };
    }
  });

  /* ---------- Зарплата учителя ---------- */
  E.add({
    id: 'teacher-salary', cat: 'payroll', popular: true,
    title: lab('Зарплата учителя', 'Мұғалімнің жалақысы'), short: lab('Оклад по БДО, категория, нагрузка и доплаты', 'БЛЖ бойынша жалақы, санат, жүктеме және үстемеақылар'),
    badge: (R) => `БДО ${E.num(R.BDO)}`, keys: 'зарплата учителя педагога бдо категория модератор эксперт нагрузка мұғалім жалақысы',
    fields: [{ id: 'lvl', type: 'select', def: 'first', label: lab('Уровень квалификации', 'Біліктілік деңгейі'), options: [{ v: 'highest', ru: 'Высший', kk: 'Жоғары' }, { v: 'first', ru: 'Первый', kk: 'Бірінші' }, { v: 'second', ru: 'Второй', kk: 'Екінші' }, { v: 'none', ru: 'Без категории', kk: 'Санатсыз' }] },
      numF('exp', 10, 'Педагогический стаж', 'Педагогикалық өтіл', 'лет', 'жыл', { max: 60 }),
      { id: 'cat', type: 'select', def: 'moderator', label: lab('Квалификационная категория', 'Біліктілік санаты'), options: [{ v: 'none', ru: 'Нет', kk: 'Жоқ' }, { v: 'moderator', ru: 'Педагог-модератор', kk: 'Педагог-модератор' }, { v: 'expert', ru: 'Педагог-эксперт', kk: 'Педагог-сарапшы' }, { v: 'researcher', ru: 'Педагог-исследователь', kk: 'Педагог-зерттеуші' }, { v: 'master', ru: 'Педагог-мастер', kk: 'Педагог-шебер' }] },
      numF('load', 16, 'Нагрузка в неделю', 'Апталық жүктеме', 'ч', 'сағ', { max: 40 }), { id: 'rural', type: 'check', def: false, label: lab('Работа в сельской местности (+25%)', 'Ауылдық жерде жұмыс (+25%)') },
      { id: 'cls', type: 'check', def: false, label: lab('Классное руководство', 'Сынып жетекшілігі') }, { id: 'prim', type: 'check', def: false, when: v => v.cls, label: lab('Начальные классы', 'Бастауыш сыныптар') }, { id: 'nb', type: 'check', def: false, label: lab('Проверка тетрадей', 'Дәптер тексеру') }],
    calc(v, R, L) {
      const idx = R.teacherExp.findIndex(x => v.exp < x), k = R.teacherCoef[v.lvl][idx < 0 ? 10 : idx], base = Math.round(R.BDO * k * R.teacherCorr), f = v.load / 16, byLoad = Math.round(base * f);
      const catP = R.teacherCat[v.cat], cat = Math.round(byLoad * catP / 100), rural = v.rural ? Math.round(byLoad * 0.25) : 0, cls = v.cls ? Math.round(R.BDO * (v.prim ? 0.5 : 0.6) * f) : 0, nb = v.nb ? Math.round(R.BDO * 0.4 * f) : 0, g = byLoad + cat + rural + cls + nb;
      const p = E.payroll(g, { employer: 'llp', cat: 'std', ded: true, ytd: 0 }, R);
      return { main: { label: t(L, 'На руки', 'Қолға'), value: p.net }, cards: [{ label: t(L, 'Начислено', 'Есептелді'), value: g }, { label: t(L, 'Коэффициент', 'Коэффициент'), value: E.num(k, 2), fmt: 'text' }],
        rows: [R1(L, `Оклад: ${m(R.BDO)} × ${E.num(k, 2)} × ${R.teacherCorr} × ${E.num(v.load, 'auto')}/16 ч`, `Жалақы: ${m(R.BDO)} × ${E.num(k, 2)} × ${R.teacherCorr} × ${E.num(v.load, 'auto')}/16 сағ`, byLoad), R1(L, `Доплата за категорию ${catP}%`, `Санат үшін үстеме ${catP}%`, cat), R1(L, 'Сельская надбавка', 'Ауылдық үстеме', rural), R1(L, 'Классное руководство', 'Сынып жетекшілігі', cls), R1(L, 'Проверка тетрадей', 'Дәптер тексеру', nb), R1(L, 'ОПВ, ВОСМС и ИПН', 'МЗЖ, МӘМСЖ және ЖТС', p.opv + p.vosms + p.ipn)],
        steps: [t(L, `Ставка — 16 часов в неделю. БДО педагогов — ${m(R.BDO)}, поправочный коэффициент — ${R.teacherCorr}.`, `Мөлшерлеме — аптасына 16 сағат. Педагогтердің БЛЖ — ${m(R.BDO)}, түзету коэффициенті — ${R.teacherCorr}.`)],
        notes: [t(L, 'Расчёт ориентировочный: в школе могут быть другие доплаты (за кабинет, языки, экологию). Точный оклад смотрите в тарификации своей организации.', 'Есеп шамамен: мектепте басқа үстемеақылар болуы мүмкін (кабинет, тілдер, экология үшін). Нақты жалақыны ұйымыңыздың тарификациясынан қараңыз.')] };
    }
  });

  /* ---------- Производственный календарь ---------- */
  E.workdays = (a, b, R) => { let w = 0, wk = 0, h = 0; const d = new Date(a.getTime()); while (d <= b) { const iso = d.toISOString().slice(0, 10), y = d.getUTCFullYear(), dw = d.getUTCDay(), hol = (R.holidays[y] || []).includes(iso), sat = (R.workSaturdays[y] || []).includes(iso); if (hol) h++; else if ((dw === 0 || dw === 6) && !sat) wk++; else w++; d.setUTCDate(d.getUTCDate() + 1); } return { w, wk, h, all: w + wk + h }; };
  E.add({
    id: 'production-calendar', cat: 'payroll',
    title: lab('Производственный календарь 2026', '2026 жылғы өндірістік күнтізбе'), short: lab('Рабочие дни и часы за любой период 2026 года', '2026 жылдың кез келген кезеңіндегі жұмыс күндері мен сағаттары'),
    badge: () => '247', keys: 'производственный календарь 2026 рабочие дни часы норма праздники өндірістік күнтізбе',
    fields: [{ id: 'a', type: 'date', def: '2026-01-01', half: true, label: lab('С', 'Бастап') }, { id: 'b', type: 'date', def: '2026-12-31', half: true, label: lab('По', 'Дейін') }, { id: 'week', type: 'seg', def: '40', label: lab('Рабочая неделя', 'Жұмыс аптасы'), options: [{ v: '40', ru: '40 часов', kk: '40 сағат' }, { v: '36', ru: '36 часов', kk: '36 сағат' }] }],
    calc(v, R, L) {
      const a = E.parseDate(v.a), b = E.parseDate(v.b); if (!a || !b || b < a) return { error: t(L, 'Проверьте даты', 'Күндерді тексеріңіз') };
      if (a.getUTCFullYear() !== 2026 || b.getUTCFullYear() !== 2026) return { error: t(L, 'Календарь заполнен на 2026 год', 'Күнтізбе 2026 жылға толтырылған') };
      const r = E.workdays(a, b, R), hpd = v.week === '40' ? 8 : 7.2;
      return { main: { label: t(L, 'Рабочих дней', 'Жұмыс күндері'), value: r.w, fmt: 'num' }, cards: [{ label: t(L, 'Рабочих часов', 'Жұмыс сағаттары'), value: E.num(r.w * hpd, 1), fmt: 'text' }],
        rows: [R1(L, 'Календарных дней', 'Күнтізбелік күндер', r.all, 'num'), R1(L, 'Выходных', 'Демалыс күндері', r.wk, 'num'), R1(L, 'Праздничных и перенесённых (в будни)', 'Мереке және ауыстырылған (жұмыс күндерінде)', r.h, 'num')], steps: [],
        notes: [t(L, 'Учтены праздники 2026 года и переносы выходных. День Конституции теперь 15 марта, 30 августа — обычный день. Норма года при пятидневке — 247 рабочих дней.', '2026 жылғы мерекелер мен демалыс күндерінің ауыстырылуы ескерілді. Конституция күні енді 15 наурызда, 30 тамыз — кәдімгі күн. Бес күндік аптада жылдық норма — 247 жұмыс күні.')] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Налоги физлиц: вычеты, выигрыши, крипта, аренда, декларация, переводы, земля */
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

  /* ---------- ИПН с зарплаты ---------- */
  E.add({
    id: 'income-tax', cat: 'tax', popular: true,
    title: lab('Калькулятор ИПН с зарплаты', 'Жалақыдан ЖТС калькуляторы'), short: lab('Индивидуальный подоходный налог 10% и 15% с учётом вычетов', 'Шегерімдерді ескергендегі 10% және 15% жеке табыс салығы'),
    badge: (R) => `${R.IPN}% / ${R.IPNhigh}%`, keys: 'ипн подоходный налог 10% 15% зарплата вычет 30 мрп жтс',
    fields: [money('gross', 500000, 'Начисленная зарплата за месяц', 'Айлық есептелген жалақы')].concat(E.payrollFields.filter(f => f.id !== 'employer')),
    calc(v, R, L) {
      const p = E.payroll(v.gross, Object.assign({ employer: 'llp' }, v), R), eff = v.gross ? p.ipn / v.gross * 100 : 0;
      return { main: { label: t(L, 'ИПН за месяц', 'Айлық ЖТС'), value: p.ipn }, cards: [{ label: t(L, 'Эффективная ставка от начисленного', 'Есептелгеннен тиімді мөлшерлеме'), value: `${E.num(eff, 2)}%`, fmt: 'text' }, { label: t(L, 'ИПН за год при такой зарплате', 'Осындай жалақыда жылдық ЖТС'), value: E.ipnProgressive(p.taxable * 12, 0, R).tax }],
        rows: [R1(L, 'Начислено', 'Есептелді', p.g), R1(L, `ОПВ ${R.OPV}%`, `МЗЖ ${R.OPV}%`, p.opv), R1(L, `ВОСМС ${R.VOSMS}%`, `МӘМСЖ ${R.VOSMS}%`, p.vosms), R1(L, 'Вычет', 'Шегерім', p.ded), R1(L, 'Облагаемый доход', 'Салық салынатын табыс', p.taxable, null, true), R1(L, 'ИПН', 'ЖТС', p.ipn, null, true)],
        steps: E.payrollSteps(p, v, L, R), notes: [t(L, `С 2026 года ставка ИПН — ${R.IPN}%, а с дохода сверх ${E.num(R.IPNthresholdMRP)} МРП за год (${m(R.IPNthresholdMRP * R.MRP)}) — ${R.IPNhigh}%.`, `2026 жылдан бастап ЖТС мөлшерлемесі — ${R.IPN}%, ал жылына ${E.num(R.IPNthresholdMRP)} АЕК-тен (${m(R.IPNthresholdMRP * R.MRP)}) асатын табыстан — ${R.IPNhigh}%.`)] };
    }
  });

  /* ---------- Налоговые вычеты ---------- */
  E.add({
    id: 'tax-deductions', cat: 'tax',
    title: lab('Налоговые вычеты по ИПН 2026', '2026 жылғы ЖТС бойынша салық шегерімдері'), short: lab('Базовый вычет 30 МРП и льготные вычеты для лиц с инвалидностью', '30 АЕК базалық шегерім және мүгедектігі бар адамдарға жеңілдік шегерімдері'),
    badge: (R) => `${R.baseDeductionMRP} МРП`, keys: 'налоговый вычет ипн 30 мрп инвалидность 882 мрп 5000 мрп салық шегерімі',
    fields: [money('gross', 300000, 'Зарплата за месяц', 'Айлық жалақы'), chk('base', true, 'Базовый вычет 30 МРП (подано заявление)', '30 АЕК базалық шегерімі (өтініш берілді)'),
      { id: 'dis', type: 'select', def: 'none', label: lab('Льготный вычет', 'Жеңілдік шегерімі'), options: [{ v: 'none', ru: 'Нет', kk: 'Жоқ' }, { v: 'g3', ru: 'Инвалидность III группы — 882 МРП в год', kk: 'III топтағы мүгедектік — жылына 882 АЕК' }, { v: 'par', ru: 'Родитель ребёнка с инвалидностью, ветераны и приравненные — 882 МРП в год', kk: 'Мүгедектігі бар баланың ата-анасы, ардагерлер және оларға теңестірілгендер — жылына 882 АЕК' }, { v: 'g12', ru: 'Инвалидность I или II группы — 5 000 МРП в год', kk: 'I немесе II топтағы мүгедектік — жылына 5 000 АЕК' }] }],
    calc(v, R, L) {
      const g = v.gross, g12 = v.dis === 'g12', disabled = v.dis === 'g3' || g12, opv = g12 ? 0 : E.round(Math.min(g, R.OPVmaxMZP * R.MZP) * R.OPV / 100), vosms = disabled ? 0 : E.round(Math.min(g, R.VOSMSmaxMZP * R.MZP) * R.VOSMS / 100);
      const before = E.pos(g - opv - vosms), base = v.base ? Math.min(R.baseDeductionMRP * R.MRP, before) : 0, sp = v.dis === 'g3' || v.dis === 'par' ? 882 * R.MRP / 12 : g12 ? 5000 * R.MRP / 12 : 0, spUsed = Math.min(sp, E.pos(before - base));
      const tax = E.ipnProgressive(E.pos(before - base - spUsed), 0, R).tax, taxNo = E.ipnProgressive(before, 0, R).tax;
      return { main: { label: t(L, 'Экономия на ИПН в месяц', 'Айлық ЖТС үнемі'), value: taxNo - tax }, cards: [{ label: t(L, 'ИПН с вычетами', 'Шегерімдермен ЖТС'), value: tax }, { label: t(L, 'Экономия за год', 'Жылдық үнем'), value: (taxNo - tax) * 12 }],
        rows: [R1(L, 'Базовый вычет', 'Базалық шегерім', base), R1(L, 'Льготный вычет в месяц', 'Айлық жеңілдік шегерімі', spUsed), R1(L, 'ОПВ', 'МЗЖ', opv), R1(L, 'ВОСМС', 'МӘМСЖ', vosms)], steps: [],
        notes: [t(L, 'С 2026 года перечень вычетов закрытый: вычеты на обучение, лечение, проценты по ипотеке и добровольные пенсионные взносы отменены. Лица с инвалидностью не платят ВОСМС; при I–II группе бессрочно не удерживаются и ОПВ.', '2026 жылдан бастап шегерімдер тізбесі жабық: оқуға, емделуге, ипотека сыйақысына және ерікті зейнетақы жарналарына шегерімдер жойылды. Мүгедектігі бар адамдар МӘМСЖ төлемейді; I–II топта мерзімсіз болса, МЗЖ да ұсталмайды.'), NOTE_TAX(L)] };
    }
  });

  /* ---------- Налог на роскошь ---------- */
  E.add({
    id: 'luxury-tax', cat: 'tax',
    title: lab('Налог на роскошь в Казахстане', 'Қазақстандағы сән-салтанат салығы'), short: lab('Акциз 10% на дорогие авто, налог на дорогое жильё и мощные машины', 'Қымбат көліктерге 10% акциз, қымбат тұрғын үй мен қуатты көліктерге салық'),
    badge: () => '10%', keys: 'налог на роскошь акциз 10% дорогие авто 18000 мрп дорогое жилье сән салтанат салығы',
    fields: [{ id: 'kind', type: 'seg', def: 'car', label: lab('Имущество', 'Мүлік'), options: [{ v: 'car', ru: 'Авто', kk: 'Көлік' }, { v: 'boat', ru: 'Яхта, самолёт', kk: 'Яхта, ұшақ' }, { v: 'home', ru: 'Жильё', kk: 'Тұрғын үй' }] },
      money('price', 90000000, 'Стоимость', 'Құны'), numF('cc', 4500, 'Объём двигателя', 'Қозғалтқыш көлемі', 'см³', 'см³', { when: v => v.kind === 'car' }), numF('made', 2026, 'Год выпуска', 'Шығарылған жылы', '', '', { min: 1950, max: 2100, when: v => v.kind === 'car' })],
    calc(v, R, L) {
      const rows = []; let main = 0;
      if (v.kind === 'home') { main = E.propTax(R, v.price); rows.push(R1(L, 'Налог на имущество в год', 'Жылдық мүлік салығы', main)); }
      else {
        const thr = (v.kind === 'car' ? R.luxuryCarMRP : R.luxuryBoatMRP) * R.MRP, exc = v.price >= thr ? v.price * R.luxuryExcise / 100 : 0; main = exc;
        rows.push(R1(L, `Акциз ${R.luxuryExcise}% (порог ${m(thr)})`, `${R.luxuryExcise}% акциз (шегі ${m(thr)})`, exc));
        if (v.kind === 'car') rows.push(R1(L, 'Налог на транспорт в год', 'Жылдық көлік салығы', E.carTax(R, v.cc, v.made)));
      }
      return { main: { label: v.kind === 'home' ? t(L, 'Налог в год', 'Жылдық салық') : t(L, 'Акциз при покупке', 'Сатып алғандағы акциз'), value: main }, rows, steps: [],
        notes: [t(L, 'Отдельного налога на роскошь нет. Акциз 10% платят один раз при покупке или ввозе авто стоимостью от 18 000 МРП и судна или самолёта от 24 000 МРП. Налог на жильё дороже 450 млн ₸ — 2% с превышения; на авто свыше 4 000 см³ — 117 МРП плюс 7 ₸ за каждый см³ сверх.', 'Жеке сән-салтанат салығы жоқ. 10% акцизді құны 18 000 АЕК-тен бастап көлікті және 24 000 АЕК-тен бастап кемені не ұшақты сатып алғанда немесе әкелгенде бір рет төлейді. 450 млн ₸-ден қымбат тұрғын үйге салық — асқан бөліктің 2%-ы; 4 000 см³-тен асатын көлікке — 117 АЕК және асқан әр см³ үшін 7 ₸.'), NOTE_TAX(L)] };
    }
  });

  /* ---------- Выигрыши ---------- */
  E.add({
    id: 'casino-winnings-tax', cat: 'tax',
    title: lab('Налог на выигрыш', 'Ұтыс салығы'), short: lab('ИПН с выигрыша в казино, у букмекера и в лотерею', 'Казинодағы, букмекердегі және лотереядағы ұтыстан ЖТС'),
    badge: (R) => `${R.IPN}%`, keys: 'налог на выигрыш казино букмекер лотерея ипн ұтыс салығы',
    fields: [{ id: 'kind', type: 'seg', def: 'bet', label: lab('Где выиграли', 'Қайда ұттыңыз'), options: [{ v: 'bet', ru: 'Казино, букмекер', kk: 'Казино, букмекер' }, { v: 'lot', ru: 'Лотерея', kk: 'Лотерея' }] },
      money('win', 1000000, 'Выплата', 'Төлем'), money('stake', 100000, 'Ставка', 'Бәс', { when: v => v.kind === 'bet' }), ytdF],
    calc(v, R, L) {
      const free = R.lotteryFreeMRP * R.MRP, base = v.kind === 'bet' ? E.pos(v.win - v.stake) : E.pos(v.win - free), tax = E.ipnProgressive(base, v.ytd, R).tax;
      return { main: { label: t(L, 'Налог', 'Салық'), value: tax }, cards: [{ label: t(L, 'На руки', 'Қолға'), value: v.win - tax }], rows: [R1(L, 'Облагаемая сумма', 'Салық салынатын сома', base)],
        steps: [v.kind === 'bet' ? t(L, `Облагается чистый выигрыш: ${m(v.win)} − ${m(v.stake)}`, `Таза ұтысқа салық салынады: ${m(v.win)} − ${m(v.stake)}`) : t(L, `Выигрыш по одной лотерее до ${R.lotteryFreeMRP} МРП (${m(free)}) не облагается`, `Бір лотерея бойынша ${R.lotteryFreeMRP} АЕК-ке (${m(free)}) дейінгі ұтысқа салық салынбайды`)],
        notes: [t(L, 'Налог удерживает организатор при выплате. Если организатор зарубежный и налог не удержан, выигрыш указывают в декларации 270.00 до 15 сентября следующего года.', 'Салықты ұйымдастырушы төлеген кезде ұстайды. Ұйымдастырушы шетелдік болып, салық ұсталмаса, ұтыс келесі жылғы 15 қыркүйекке дейін 270.00 декларациясында көрсетіледі.'), NOTE_TAX(L)] };
    }
  });

  /* ---------- Криптовалюта ---------- */
  E.add({
    id: 'crypto-tax', cat: 'tax',
    title: lab('Налог на криптовалюту', 'Криптовалюта салығы'), short: lab('Налог с прибыли от продажи крипты для физлица, ИП и ТОО', 'Жеке тұлға, ЖК және ЖШС үшін криптоны сатудан түскен пайдаға салық'),
    badge: (R) => `${R.IPN}%`, keys: 'налог на криптовалюту биткоин крипта прибыль декларация криптовалюта салығы',
    fields: [{ id: 'who', type: 'seg', def: 'phys', label: lab('Кто продаёт', 'Кім сатады'), options: [{ v: 'phys', ru: 'Физлицо', kk: 'Жеке тұлға' }, { v: 'ip', ru: 'ИП на упрощёнке', kk: 'Оңайлатылғандағы ЖК' }, { v: 'llp', ru: 'ТОО', kk: 'ЖШС' }] },
      money('buy', 1000000, 'Куплено за', 'Сатып алынды'), money('sell', 1500000, 'Продано за', 'Сатылды'), Object.assign({}, ytdF, { when: v => v.who === 'phys' })],
    calc(v, R, L) {
      const gain = E.pos(v.sell - v.buy); let tax, how;
      if (v.who === 'phys') { tax = E.ipnProgressive(gain, v.ytd, R).tax; how = t(L, `ИПН ${R.IPN}% с прироста`, `Өсімнен ${R.IPN}% ЖТС`); }
      else if (v.who === 'ip') { tax = v.sell * R.simplified / 100; how = t(L, `${R.simplified}% с дохода от продажи`, `Сатудан түскен табыстың ${R.simplified}%-ы`); }
      else { tax = gain * R.CIT / 100; how = t(L, `КПН ${R.CIT}% с прибыли`, `Пайдадан ${R.CIT}% КТС`); }
      return { main: { label: t(L, 'Налог', 'Салық'), value: tax }, cards: [{ label: t(L, 'Прибыль', 'Пайда'), value: gain }, { label: t(L, 'Как считается', 'Қалай есептеледі'), value: how, fmt: 'text' }], rows: [], steps: [],
        notes: [t(L, 'Физлицо декларирует доход в форме 270.00 до 15 сентября следующего года и платит налог до 25 сентября. Майнинг разрешён только ИП и юрлицам по лицензии.', 'Жеке тұлға табысты келесі жылғы 15 қыркүйекке дейін 270.00 нысанында декларациялап, салықты 25 қыркүйекке дейін төлейді. Майнингке тек лицензиясы бар ЖК мен заңды тұлғаларға рұқсат етілген.'), NOTE_TAX(L)] };
    }
  });

  /* ---------- Аренда ---------- */
  E.add({
    id: 'rental-income-tax', cat: 'tax',
    title: lab('Налог со сдачи квартиры в аренду', 'Пәтерді жалға беруден салық'), short: lab('Сравнение: физлицо 10%, самозанятый 4%, ИП на упрощёнке 4%', 'Салыстыру: жеке тұлға 10%, өзін-өзі жұмыспен қамтыған 4%, оңайлатылғандағы ЖК 4%'),
    badge: (R) => `${R.IPN}% / 4%`, keys: 'налог с аренды сдача квартиры самозанятый декларация 270 жалға беру салығы',
    fields: [money('rent', 200000, 'Арендная плата в месяц', 'Айлық жалдау ақысы'), numF('months', 12, 'Месяцев сдачи в году', 'Жылына жалға беру айлары', 'мес.', 'ай', { min: 1, max: 12 }), ytdF],
    calc(v, R, L) {
      const n = Math.round(v.months), year = v.rent * n, phys = E.ipnProgressive(year, v.ytd, R).tax, se = R.selfEmployed, seRate = se.OPV + se.OPVR + se.SO + se.VOSMS, seOk = v.rent <= R.selfEmployedLimitMRP * R.MRP, self = year * seRate / 100, ip = year * R.simplified / 100;
      const best = [[phys, t(L, 'Физлицо (декларация)', 'Жеке тұлға (декларация)')], [seOk ? self : Infinity, t(L, 'Самозанятый', 'Өзін-өзі жұмыспен қамтыған')], [ip, t(L, 'ИП на упрощёнке', 'Оңайлатылғандағы ЖК')]].sort((a, b) => a[0] - b[0])[0];
      return { main: { label: t(L, 'Меньше всего налогов', 'Ең аз салық'), value: best[1], fmt: 'text' }, cards: [{ label: t(L, 'Доход за год', 'Жылдық табыс'), value: year }],
        rows: [R1(L, `Физлицо: ИПН ${R.IPN}%`, `Жеке тұлға: ${R.IPN}% ЖТС`, phys), R1(L, `Самозанятый: соцплатежи ${seRate}%`, `Өзін-өзі жұмыспен қамтыған: ${seRate}% әлеуметтік төлемдер`, seOk ? self : t(L, `доход выше ${R.selfEmployedLimitMRP} МРП в месяц`, `табыс айына ${R.selfEmployedLimitMRP} АЕК-тен жоғары`), seOk ? null : 'text'), R1(L, `ИП на упрощёнке: ${R.simplified}% (без учёта взносов за себя)`, `Оңайлатылғандағы ЖК: ${R.simplified}% (өзі үшін жарналарсыз)`, ip)], steps: [],
        notes: [t(L, 'Физлицо без ИП подаёт декларацию 270.00 до 15 сентября следующего года. Если арендатор — ТОО или ИП, налог удерживает он. Режим самозанятого подходит только для сдачи жилья. Расходы на содержание квартиры не вычитаются.', 'ЖК-сыз жеке тұлға 270.00 декларациясын келесі жылғы 15 қыркүйекке дейін береді. Жалға алушы ЖШС немесе ЖК болса, салықты сол ұстайды. Өзін-өзі жұмыспен қамтыған режимі тек тұрғын үйді жалға беруге жарайды. Пәтерді ұстау шығындары шегерілмейді.'), NOTE_TAX(L)] };
    }
  });

  /* ---------- Всеобщее декларирование ---------- */
  E.add({
    id: 'universal-declaration', cat: 'tax',
    title: lab('Нужно ли подавать декларацию 270.00', '270.00 декларациясын тапсыру керек пе'), short: lab('Проверка обязанности по всеобщему декларированию с 2026 года', '2026 жылдан бастап жалпыға бірдей декларациялау міндетін тексеру'),
    badge: () => '270.00', keys: 'всеобщее декларирование декларация 270 кто сдает 15 сентября жалпыға бірдей декларациялау',
    fields: [chk('gov', false, 'Госслужащий или приравненное лицо', 'Мемлекеттік қызметші немесе оған теңестірілген тұлға'), chk('quasi', false, 'Руководитель или учредитель в квазигоссекторе', 'Квазимемлекеттік сектордағы басшы немесе құрылтайшы'), chk('founder', false, 'Учредитель юрлица с долей больше 10%', '10%-дан астам үлесі бар заңды тұлғаның құрылтайшысы'),
      chk('income', false, 'Был доход, с которого налог не удержан (аренда, продажа имущества, доход из-за рубежа)', 'Салығы ұсталмаған табыс болды (жалдау, мүлікті сату, шетелден табыс)'), chk('foreign', false, 'Деньги на зарубежных счетах или имущество за рубежом больше 1 000 МРП', 'Шетелдік шоттардағы ақша немесе шетелдегі мүлік 1 000 АЕК-тен көп'),
      chk('big', false, 'Покупка дороже 20 000 МРП (жильё, авто, доли)', '20 000 АЕК-тен қымбат сатып алу (тұрғын үй, көлік, үлестер)'), chk('crypto', false, 'Есть цифровые активы', 'Цифрлық активтер бар'), chk('high', false, 'Доход за год больше 8 500 МРП', 'Жылдық табыс 8 500 АЕК-тен көп')],
    calc(v, R, L) {
      const yearly = v.gov || v.quasi || v.founder, cond = v.income || v.foreign || v.big || v.crypto || v.high, need = yearly || cond, next = R.year + 1;
      return { main: { label: t(L, 'Декларация 270.00', '270.00 декларациясы'), value: need ? t(L, 'нужно подать', 'тапсыру керек') : t(L, 'не нужна', 'қажет емес'), fmt: 'text' }, cards: need ? [{ label: t(L, `Срок за ${R.year} год`, `${R.year} жыл үшін мерзім`), value: t(L, `до 15 сентября ${next} года`, `${next} жылғы 15 қыркүйекке дейін`), fmt: 'text' }] : [],
        rows: [R1(L, 'Основание', 'Негіз', yearly ? t(L, 'вы подаёте декларацию ежегодно', 'декларацияны жыл сайын тапсырасыз') : cond ? t(L, 'есть доход или имущество, которые нужно задекларировать', 'декларациялау керек табыс немесе мүлік бар') : t(L, 'условий для подачи нет', 'тапсыру шарттары жоқ'), 'text')], steps: [],
        notes: [t(L, 'Декларацию подают через eGov или приложение eSalyq Azamat. Налог по декларации платят до 25 сентября. Условия упрощены — точный перечень см. в ст. 417 Налогового кодекса.', 'Декларацияны eGov немесе eSalyq Azamat қосымшасы арқылы тапсырады. Декларация бойынша салық 25 қыркүйекке дейін төленеді. Шарттар жеңілдетілген — нақты тізбе Салық кодексінің 417-бабында.'), NOTE_TAX(L)] };
    }
  });

  /* ---------- Переводы на карту ---------- */
  E.add({
    id: 'mobile-transfers', cat: 'tax',
    title: lab('Переводы на карту: заинтересуется ли налоговая', 'Картаға аударымдар: салық органы қызығады ма'), short: lab('Проверка по критериям: 100 отправителей и 12 МЗП за 3 месяца', 'Критерийлер бойынша тексеру: 3 айда 100 жөнелтуші және 12 ЕТЖ'),
    badge: () => '100+', keys: 'переводы на карту налоговая kaspi 100 отправителей 12 мзп аударымдар салық',
    fields: [numF('s1', 40, 'Месяц 1: разных отправителей', '1-ай: әртүрлі жөнелтушілер', 'чел.', 'адам', { half: true }), money('a1', 300000, 'Месяц 1: сумма', '1-ай: сома', { half: true }), numF('s2', 40, 'Месяц 2: отправителей', '2-ай: жөнелтушілер', 'чел.', 'адам', { half: true }), money('a2', 300000, 'Месяц 2: сумма', '2-ай: сома', { half: true }), numF('s3', 40, 'Месяц 3: отправителей', '3-ай: жөнелтушілер', 'чел.', 'адам', { half: true }), money('a3', 300000, 'Месяц 3: сумма', '3-ай: сома', { half: true })],
    calc(v, R, L) {
      const n = R.transfersSenders, lim = R.transfersMZP * R.MZP, sum = v.a1 + v.a2 + v.a3, s = Math.min(v.s1, v.s2, v.s3) >= n, hit = s && sum > lim;
      return { main: { label: t(L, 'Результат', 'Нәтиже'), value: hit ? t(L, 'попадаете под критерии', 'критерийлерге сәйкессіз') : t(L, 'не попадаете под критерии', 'критерийлерге сәйкес емессіз'), fmt: 'text' }, cards: [{ label: t(L, 'Сумма за 3 месяца', '3 айдағы сома'), value: sum }, { label: t(L, `Порог ${R.transfersMZP} МЗП`, `${R.transfersMZP} ЕТЖ шегі`), value: lim }],
        rows: [R1(L, `${n}+ отправителей в каждом месяце`, `Әр айда ${n}+ жөнелтуші`, s ? t(L, 'да', 'иә') : t(L, 'нет', 'жоқ'), 'text')], steps: [],
        notes: [t(L, 'Это не автоматический налог: банк передаёт сведения, а налоговая может попросить пояснения. Переводы от родных и друзей, возврат долгов и разовая продажа личных вещей налогом не облагаются. Если вы регулярно получаете деньги за товары или услуги — оформитесь самозанятым или ИП.', 'Бұл автоматты салық емес: банк мәліметтерді береді, ал салық органы түсініктеме сұрауы мүмкін. Туыстар мен достардан аударымдарға, қарызды қайтаруға және жеке заттарды бір рет сатуға салық салынбайды. Тауар немесе қызмет үшін тұрақты ақша алсаңыз — өзін-өзі жұмыспен қамтыған немесе ЖК ретінде тіркеліңіз.')] };
    }
  });

  /* ---------- Земельный налог на сельхозземли ---------- */
  E.add({
    id: 'farm-land-tax', cat: 'property',
    title: lab('Земельный налог на сельхозземли', 'Ауыл шаруашылығы жерлеріне жер салығы'), short: lab('Ставка по баллу бонитета и почвенной зоне, ст. 576 НК РК', 'Бонитет балы мен топырақ аймағы бойынша мөлшерлеме, СК 576-бабы'),
    badge: (R, L) => t(L, '₸/га', '₸/га'), keys: 'земельный налог сельхозземли бонитет гектар крестьянское хозяйство жер салығы',
    fields: [{ id: 'zone', type: 'seg', def: 'steppe', label: lab('Почвенно-климатическая зона', 'Топырақ-климаттық аймақ'), options: [{ v: 'steppe', ru: 'Степная, сухостепная', kk: 'Дала, құрғақ дала' }, { v: 'desert', ru: 'Полупустынная, пустынная', kk: 'Шөлейт, шөл' }] },
      numF('ball', 40, 'Балл бонитета', 'Бонитет балы', '', '', { min: 1, max: 150 }), numF('ha', 100, 'Площадь', 'Ауданы', 'га', 'га', { step: 'any' }), chk('idle', false, 'Земля не используется по назначению после предписания (× 40)', 'Нұсқамадан кейін жер мақсатына сай пайдаланылмайды (× 40)')],
    calc(v, R, L) {
      const tab = v.zone === 'steppe' ? R.farmSteppe : R.farmDesert, b = Math.round(v.ball), rate = b > 100 ? tab[100] : tab[Math.max(1, b) - 1], tax = rate * v.ha * (v.idle ? R.farmIdleMult : 1);
      return { main: { label: t(L, 'Налог за год', 'Жылдық салық'), value: tax, fmt: 'money2' }, cards: [{ label: t(L, 'Ставка', 'Мөлшерлеме'), value: t(L, `${E.num(rate, 2)} ₸/га`, `${E.num(rate, 2)} ₸/га`), fmt: 'text' }], rows: [],
        steps: [`${E.num(rate, 2)} × ${E.num(v.ha, 'auto')} га${v.idle ? ` × ${R.farmIdleMult}` : ''} = ${m(tax, 2)}`],
        notes: [t(L, 'Зону и балл бонитета берут из документов на землю и материалов почвенного обследования. Юрлица и ИП подают декларацию до 31 марта и платят до 10 апреля. Крестьянские хозяйства на специальном режиме земельный налог по этим землям не платят. Ставки сверяйте со ст. 576 НК РК.', 'Аймақ пен бонитет балы жерге арналған құжаттардан және топырақты зерттеу материалдарынан алынады. Заңды тұлғалар мен ЖК декларацияны 31 наурызға дейін тапсырып, 10 сәуірге дейін төлейді. Арнаулы режимдегі шаруа қожалықтары осы жерлер бойынша жер салығын төлемейді. Мөлшерлемелерді СК 576-бабымен салыстырыңыз.')] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);

/* Коммунальные услуги: расчёт только по тарифам, которые вводит пользователь */
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

  /* ---------- Электроэнергия ---------- */
  E.add({
    id: 'electricity', cat: 'utilities',
    title: lab('Расчёт оплаты за электроэнергию', 'Электр энергиясына төлемді есептеу'), short: lab('Сумма по показаниям счётчика и вашему тарифу, в том числе по ступеням', 'Есептегіш көрсеткіштері мен тарифіңіз бойынша сома, оның ішінде сатылар бойынша'),
    badge: (R, L) => t(L, 'кВт·ч', 'кВт·сағ'), keys: 'электроэнергия свет счётчик квт тариф оплата электр энергиясы',
    fields: [numF('ea', 12000, 'Предыдущие показания', 'Алдыңғы көрсеткіштер', 'кВт·ч', 'кВт·сағ', { half: true }), numF('eb', 12200, 'Текущие показания', 'Ағымдағы көрсеткіштер', 'кВт·ч', 'кВт·сағ', { half: true }),
      tariff('t1', 'Тариф (1-я ступень)', 'Тариф (1-саты)', 'кВт·ч', 'кВт·сағ'), { id: 'tiers', type: 'check', def: false, label: lab('Тариф по ступеням потребления', 'Тұтыну сатылары бойынша тариф') },
      numF('l1', 0, 'Граница 1-й ступени', '1-сатының шегі', 'кВт·ч', 'кВт·сағ', { when: v => v.tiers, half: true }), tariff('t2', 'Тариф 2-й ступени', '2-сатының тарифі', 'кВт·ч', 'кВт·сағ', { when: v => v.tiers, half: true }),
      numF('l2', 0, 'Граница 2-й ступени', '2-сатының шегі', 'кВт·ч', 'кВт·сағ', { when: v => v.tiers, half: true }), tariff('t3', 'Тариф 3-й ступени', '3-сатының тарифі', 'кВт·ч', 'кВт·сағ', { when: v => v.tiers, half: true })],
    calc(v, R, L) {
      if (!(v.t1 > 0)) return NEED(L);
      const k = vol(v, 'e'), rows = []; let sum = 0;
      if (v.tiers && v.l1 > 0) {
        const p1 = Math.min(k, v.l1), p2 = v.l2 > v.l1 ? Math.min(E.pos(k - v.l1), v.l2 - v.l1) : E.pos(k - v.l1), p3 = v.l2 > v.l1 ? E.pos(k - v.l2) : 0;
        sum = p1 * v.t1 + p2 * (v.t2 || v.t1) + p3 * (v.t3 || v.t2 || v.t1);
        rows.push(R1(L, `1-я ступень: ${E.num(p1, 'auto')} кВт·ч`, `1-саты: ${E.num(p1, 'auto')} кВт·сағ`, p1 * v.t1, 'money2'), R1(L, `2-я ступень: ${E.num(p2, 'auto')} кВт·ч`, `2-саты: ${E.num(p2, 'auto')} кВт·сағ`, p2 * (v.t2 || v.t1), 'money2'));
        if (p3) rows.push(R1(L, `3-я ступень: ${E.num(p3, 'auto')} кВт·ч`, `3-саты: ${E.num(p3, 'auto')} кВт·сағ`, p3 * (v.t3 || v.t2 || v.t1), 'money2'));
      } else sum = k * v.t1;
      return { main: { label: t(L, 'К оплате', 'Төлеуге'), value: sum, fmt: 'money2' }, cards: [{ label: t(L, 'Расход', 'Шығын'), value: t(L, `${E.num(k, 'auto')} кВт·ч`, `${E.num(k, 'auto')} кВт·сағ`), fmt: 'text' }], rows, steps: [], notes: [NOTE_U(L)] };
    }
  });

  /* ---------- Вода ---------- */
  E.add({
    id: 'water', cat: 'utilities',
    title: lab('Расчёт оплаты за воду', 'Суға төлемді есептеу'), short: lab('Холодная и горячая вода, водоотведение по вашим тарифам', 'Сіздің тарифтеріңіз бойынша суық және ыстық су, су бұру'),
    badge: () => 'м³', keys: 'вода холодная горячая водоотведение канализация счётчик оплата су',
    fields: [numF('cold', 6, 'Холодная вода за месяц', 'Айлық суық су', 'м³', 'м³', { half: true }), tariff('tc', 'Тариф холодной воды', 'Суық су тарифі', 'м³', 'м³', { half: true }), numF('hot', 3, 'Горячая вода за месяц', 'Айлық ыстық су', 'м³', 'м³', { half: true }), tariff('th', 'Тариф горячей воды', 'Ыстық су тарифі', 'м³', 'м³', { half: true }),
      tariff('ts', 'Тариф водоотведения', 'Су бұру тарифі', 'м³', 'м³', { hint: lab('Обычно начисляется на весь объём холодной и горячей воды', 'Әдетте суық және ыстық судың бүкіл көлеміне есептеледі') })],
    calc(v, R, L) {
      if (!(v.tc > 0 || v.th > 0 || v.ts > 0)) return NEED(L);
      const c = v.cold * v.tc, h = v.hot * v.th, s = (v.cold + v.hot) * v.ts;
      return { main: { label: t(L, 'К оплате', 'Төлеуге'), value: c + h + s, fmt: 'money2' }, cards: [{ label: t(L, 'Всего воды', 'Барлық су'), value: `${E.num(v.cold + v.hot, 'auto')} м³`, fmt: 'text' }],
        rows: [R1(L, 'Холодная вода', 'Суық су', c, 'money2'), R1(L, 'Горячая вода', 'Ыстық су', h, 'money2'), R1(L, 'Водоотведение', 'Су бұру', s, 'money2')], steps: [], notes: [NOTE_U(L)] };
    }
  });

  /* ---------- Отопление ---------- */
  E.add({
    id: 'heating', cat: 'utilities',
    title: lab('Расчёт оплаты за отопление', 'Жылытуға төлемді есептеу'), short: lab('По площади квартиры или по гигакалориям общедомового счётчика', 'Пәтер ауданы немесе жалпы үй есептегішінің гигакалориялары бойынша'),
    badge: () => 'Гкал', keys: 'отопление гкал площадь тариф оплата за тепло жылыту',
    fields: [{ id: 'mode', type: 'seg', def: 'area', label: lab('Как начисляют', 'Қалай есептеледі'), options: [{ v: 'area', ru: 'По площади', kk: 'Аудан бойынша' }, { v: 'gcal', ru: 'По Гкал', kk: 'Гкал бойынша' }] },
      numF('area', 60, 'Отапливаемая площадь', 'Жылытылатын аудан', 'м²', 'м²'), tariff('ta', 'Тариф за 1 м² в месяц', 'Айына 1 м² үшін тариф', 'м²', 'м²', { when: v => v.mode === 'area' }),
      numF('gcal', 0, 'Гкал по дому за месяц', 'Айына үй бойынша Гкал', 'Гкал', 'Гкал', { when: v => v.mode === 'gcal', half: true }), numF('house', 0, 'Площадь всех квартир дома', 'Үйдегі барлық пәтерлердің ауданы', 'м²', 'м²', { when: v => v.mode === 'gcal', half: true }), tariff('tg', 'Тариф за 1 Гкал', '1 Гкал үшін тариф', 'Гкал', 'Гкал', { when: v => v.mode === 'gcal' })],
    calc(v, R, L) {
      if (v.mode === 'area') { if (!(v.ta > 0)) return NEED(L); const s = v.area * v.ta; return { main: { label: t(L, 'К оплате за месяц', 'Айына төлеуге'), value: s, fmt: 'money2' }, rows: [], steps: [`${E.num(v.area, 'auto')} м² × ${m(v.ta, 2)}`], notes: [NOTE_U(L)] }; }
      if (!(v.tg > 0)) return NEED(L); if (!(v.house > 0)) return { error: t(L, 'Укажите площадь всех квартир дома', 'Үйдегі барлық пәтерлердің ауданын көрсетіңіз') };
      const g = v.gcal * v.area / v.house, s = g * v.tg;
      return { main: { label: t(L, 'К оплате за месяц', 'Айына төлеуге'), value: s, fmt: 'money2' }, cards: [{ label: t(L, 'Ваша доля тепла', 'Сіздің жылу үлесіңіз'), value: `${E.num(g, 3)} Гкал`, fmt: 'text' }], rows: [], steps: [`${E.num(v.gcal, 'auto')} × ${E.num(v.area, 'auto')} ÷ ${E.num(v.house, 'auto')} × ${m(v.tg, 2)}`], notes: [NOTE_U(L)] };
    }
  });

  /* ---------- Газ ---------- */
  E.add({
    id: 'gas', cat: 'utilities',
    title: lab('Расчёт оплаты за газ', 'Газға төлемді есептеу'), short: lab('Сумма по показаниям газового счётчика и вашему тарифу', 'Газ есептегішінің көрсеткіштері мен тарифіңіз бойынша сома'),
    badge: () => 'м³', keys: 'газ счётчик тариф оплата за газ газ төлемі',
    fields: [numF('ga', 1000, 'Предыдущие показания', 'Алдыңғы көрсеткіштер', 'м³', 'м³', { half: true }), numF('gb', 1150, 'Текущие показания', 'Ағымдағы көрсеткіштер', 'м³', 'м³', { half: true }), tariff('tg', 'Тариф за 1 м³', '1 м³ үшін тариф', 'м³', 'м³')],
    calc(v, R, L) {
      if (!(v.tg > 0)) return NEED(L);
      const k = vol(v, 'g'), s = k * v.tg;
      return { main: { label: t(L, 'К оплате', 'Төлеуге'), value: s, fmt: 'money2' }, cards: [{ label: t(L, 'Расход', 'Шығын'), value: `${E.num(k, 'auto')} м³`, fmt: 'text' }], rows: [], steps: [`${E.num(k, 'auto')} м³ × ${m(v.tg, 2)}`], notes: [NOTE_U(L)] };
    }
  });

  /* ---------- Отопление частного дома ---------- */
  const FUEL = { gas: [9.3, 0.9, 'м³', 'м³'], coal: [5, 0.7, 'кг', 'кг'], el: [1, 0.98, 'кВт·ч', 'кВт·сағ'], wood: [4, 0.7, 'кг', 'кг'] };
  E.add({
    id: 'house-heating', cat: 'utilities',
    title: lab('Отопление частного дома', 'Жеке үйді жылыту'), short: lab('Мощность котла и расход газа, угля или электричества за сезон', 'Қазандық қуаты және маусымдағы газ, көмір немесе электр шығыны'),
    badge: () => 'кВт', keys: 'отопление частного дома котел мощность расход газа угля сезон жеке үйді жылыту',
    fields: [numF('area', 120, 'Площадь дома', 'Үй ауданы', 'м²', 'м²'), { id: 'ins', type: 'seg', def: '100', label: lab('Утепление', 'Жылыту'), options: [{ v: '70', ru: 'Хорошее', kk: 'Жақсы' }, { v: '100', ru: 'Среднее', kk: 'Орташа' }, { v: '140', ru: 'Слабое', kk: 'Әлсіз' }] },
      numF('days', 200, 'Отопительный сезон', 'Жылыту маусымы', 'дн.', 'күн', { min: 30, max: 365 }),
      { id: 'fuel', type: 'select', def: 'gas', label: lab('Топливо', 'Отын'), options: [{ v: 'gas', ru: 'Природный газ', kk: 'Табиғи газ' }, { v: 'coal', ru: 'Уголь', kk: 'Көмір' }, { v: 'el', ru: 'Электричество', kk: 'Электр' }, { v: 'wood', ru: 'Дрова', kk: 'Отын (ағаш)' }] },
      tariff('price', 'Цена единицы топлива', 'Отын бірлігінің бағасы', 'ед.', 'бірл.', { hint: lab('За 1 м³ газа, 1 кг угля или дров, 1 кВт·ч', '1 м³ газ, 1 кг көмір немесе ағаш, 1 кВт·сағ үшін') })],
    calc(v, R, L) {
      const kw = v.area * +v.ins / 1000, kwh = kw * 24 * v.days * 0.45, f = FUEL[v.fuel], qty = kwh / (f[0] * f[1]), cost = qty * v.price;
      return { main: { label: v.price > 0 ? t(L, 'Расходы за сезон', 'Маусымдағы шығын') : t(L, 'Мощность котла', 'Қазандық қуаты'), value: v.price > 0 ? cost : t(L, `${E.num(Math.ceil(kw * 1.2))} кВт`, `${E.num(Math.ceil(kw * 1.2))} кВт`), fmt: v.price > 0 ? undefined : 'text' },
        cards: [{ label: t(L, 'Мощность котла с запасом 20%', '20% қоры бар қазандық қуаты'), value: t(L, `${E.num(Math.ceil(kw * 1.2))} кВт`, `${E.num(Math.ceil(kw * 1.2))} кВт`), fmt: 'text' }, { label: t(L, 'Топлива за сезон', 'Маусымдағы отын'), value: `${E.num(qty, 0)} ${t(L, f[2], f[3])}`, fmt: 'text' }],
        rows: [R1(L, 'Тепла за сезон', 'Маусымдағы жылу', t(L, `${E.num(kwh, 0)} кВт·ч`, `${E.num(kwh, 0)} кВт·сағ`), 'text'), v.price > 0 ? R1(L, 'В среднем в месяц сезона', 'Маусымның айына орташа', cost / (v.days / 30.4)) : null].filter(Boolean),
        steps: [t(L, `Теплопотери ≈ ${v.ins} Вт на 1 м² в сильный мороз; в среднем за сезон котёл работает примерно на 45% мощности.`, `Жылу шығыны ≈ қатты аязда 1 м²-ге ${v.ins} Вт; маусым ішінде қазандық орта есеппен қуатының 45%-ымен жұмыс істейді.`)],
        notes: [t(L, 'Это грубая оценка для дома с потолками около 2,7 м. Точный расчёт теплопотерь делает проектировщик. Цену топлива вводите свою.', 'Бұл төбесі шамамен 2,7 м үйге арналған шамамен бағалау. Жылу шығынының нақты есебін жобалаушы жасайды. Отын бағасын өзіңіз енгізіңіз.')] };
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
