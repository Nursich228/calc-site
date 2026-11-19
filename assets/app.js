/* Есепте — работа страниц: формы калькуляторов, избранное, поиск, тема. */
(function () {
  'use strict';
  const doc = document, L = doc.documentElement.lang === 'kk' ? 'kk' : 'ru';
  const UI = {
    ru: { result: 'Результат', how: 'Как посчитали', more: 'Дополнительно', copy: 'Скопировать', copied: 'Скопировано', share: 'Ссылка на расчёт', shared: 'Ссылка скопирована', print: 'Печать / PDF', reset: 'Сбросить', fav: 'В избранное', unfav: 'В избранном', none: 'Ничего не найдено', favs: 'Избранное', note: 'Обратите внимание', site: 'Расчёт на сайте Есепте', date: 'Дата расчёта', light: 'Светлая тема', dark: 'Тёмная тема', rows: 'строк' },
    kk: { result: 'Нәтиже', how: 'Қалай есептелді', more: 'Қосымша', copy: 'Көшіру', copied: 'Көшірілді', share: 'Есепке сілтеме', shared: 'Сілтеме көшірілді', print: 'Басып шығару / PDF', reset: 'Тазарту', fav: 'Таңдаулыларға', unfav: 'Таңдаулыларда', none: 'Ештеңе табылмады', favs: 'Таңдаулылар', note: 'Назар аударыңыз', site: 'Есепте сайтындағы есеп', date: 'Есеп күні', light: 'Жарық тақырып', dark: 'Қараңғы тақырып', rows: 'жол' }
  }[L];

  /* --- хранилище (может быть недоступно) --- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('esepte:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('esepte:' + k, JSON.stringify(v)); } catch (e) { /* без сохранения */ } }
  };

  /* --- тема --- */
  const themeBtn = doc.getElementById('theme-toggle');
  const applyTheme = th => {
    if (th) doc.documentElement.setAttribute('data-theme', th); else doc.documentElement.removeAttribute('data-theme');
    if (themeBtn) {
      const dark = th === 'dark' || (!th && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      themeBtn.setAttribute('aria-label', dark ? UI.light : UI.dark);
      themeBtn.title = dark ? UI.light : UI.dark;
    }
  };
  applyTheme(store.get('theme', null));
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const cur = doc.documentElement.getAttribute('data-theme');
    const dark = cur === 'dark' || (!cur && matchMedia('(prefers-color-scheme: dark)').matches);
    const next = dark ? 'light' : 'dark';
    store.set('theme', next); applyTheme(next);
  });

  /* --- главная: поиск и избранное --- */
  const search = doc.getElementById('search');
  if (search) {
    const cards = Array.from(doc.querySelectorAll('[data-card]'));
    const empty = doc.getElementById('search-empty');
    const norm = s => s.toLowerCase().replace(/ё/g, 'е');
    search.addEventListener('input', () => {
      const q = norm(search.value.trim()); let shown = 0;
      cards.forEach(c => { const ok = !q || norm(c.getAttribute('data-search')).includes(q); c.hidden = !ok; if (ok) shown++; });
      doc.querySelectorAll('[data-cat-section]').forEach(s => { s.hidden = !s.querySelector('[data-card]:not([hidden])'); });
      if (empty) empty.hidden = shown > 0;
    });
    const favWrap = doc.getElementById('favorites');
    const favs = store.get('fav', []);
    if (favWrap && favs.length) {
      const grid = favWrap.querySelector('.grid');
      favs.forEach(id => { const c = doc.querySelector(`[data-card="${id}"]`); if (c) { const cl = c.cloneNode(true); cl.removeAttribute('data-card'); grid.appendChild(cl); } });
      favWrap.hidden = !grid.children.length;
    }
  }

  /* --- уведомление о cookie (Яндекс Метрика), показывается один раз --- */
  (function () {
    const n = doc.getElementById('cookie-note'); if (!n) return;
    if (store.get('cookie-ok', false)) return;
    n.hidden = false;
    doc.getElementById('cookie-ok').addEventListener('click', () => { store.set('cookie-ok', true); n.hidden = true; });
  })();

  /* --- отзывы и предложения: карточка «Помогите сделать сайт лучше» и окно с формой --- */
  (function feedback() {
    const FB = { ru: { empty: 'Поставьте оценку или напишите пару слов', err: 'Не удалось отправить. Откроем почтовую программу', subj: 'Есепте: отзыв' },
                 kk: { empty: 'Баға қойыңыз немесе бірнеше сөз жазыңыз', err: 'Жіберу мүмкін болмады. Пошта бағдарламасын ашамыз', subj: 'Есепте: пікір' } }[L];
    const MAIL = 'dester1310@gmail.com', ENDPOINT = 'https://formsubmit.co/ajax/' + MAIL;
    const dlg = doc.getElementById('fb-dialog');
    doc.querySelectorAll('[data-open-feedback]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      if (!dlg) return;
      const kind = b.getAttribute('data-kind');
      if (kind) { const r = dlg.querySelector(`input[name="kind"][value="${kind}"]`); if (r) r.checked = true; }
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    }));
    doc.querySelectorAll('.fb-close').forEach(b => b.addEventListener('click', () => { const d = b.closest('dialog'); if (d.close) d.close(); else d.removeAttribute('open'); }));
    if (dlg) dlg.addEventListener('click', e => { if (e.target === dlg && dlg.close) dlg.close(); });
    doc.querySelectorAll('form.fb-form').forEach(form => {
      const stars = form.querySelectorAll('.stars button');
      stars.forEach((s, i) => s.addEventListener('click', () => { form.rating.value = i + 1; stars.forEach((x, j) => { x.classList.toggle('on', j <= i); x.setAttribute('aria-pressed', j === i ? 'true' : 'false'); }); }));
      const text = form.message, count = form.querySelector('.fb-count');
      if (text && count) text.addEventListener('input', () => { count.textContent = text.value.length + ' / 2000'; });
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (data._honey) return;
        if (!data.message && !data.rating) { alertBox(form, FB.empty); return; }
        data.page = location.pathname; data.lang = L;
        data._subject = FB.subj + (data.kind ? ' — ' + data.kind : '');
        data._template = 'table'; data._captcha = 'false';
        const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
        try {
          const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error(r.status);
          form.hidden = true; form.parentElement.querySelector('.fb-thanks').hidden = false;
        } catch (err) {
          alertBox(form, FB.err);
          setTimeout(() => { location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(data._subject) + '&body=' + encodeURIComponent((data.rating ? '★' + data.rating + '\n' : '') + (data.message || '') + '\n\n' + location.href); }, 900);
        } finally { btn.disabled = false; }
      });
    });
    function alertBox(form, msg) { let a = form.querySelector('.fb-alert'); if (!a) { a = doc.createElement('p'); a.className = 'fb-alert'; a.setAttribute('role', 'alert'); form.appendChild(a); } a.textContent = msg; }
    /* карточка с оценкой «нравится / не нравится» — общий счетчик Abacus, без cookie */
    const card = doc.getElementById('fb-card');
    if (!card) return;
    if (store.get('fbc-hidden', false)) { card.hidden = true; return; }
    const x = card.querySelector('.fbc-x');
    if (x) x.addEventListener('click', () => { store.set('fbc-hidden', true); card.hidden = true; });
    const API = 'https://abacus.jasoncameron.dev/', NS = 'calc-practicetap-com', KEY = { like: 'site-like', dislike: 'site-dislike' };
    let my = store.get('fbc-vote', '');
    const put = (v, n) => { const el = card.querySelector(`[data-c="${v}"]`); if (el) el.textContent = n; };
    const render = () => {
      card.querySelectorAll('.fbc-v').forEach(b => { const on = b.dataset.v === my; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      const m = card.querySelector('.fbc-msg'); if (m) m.hidden = !my;
    };
    ['like', 'dislike'].forEach(v => fetch(API + 'get/' + NS + '/' + KEY[v]).then(r => r.status === 404 ? { value: 0 } : r.json()).then(d => put(v, d.value != null ? d.value : 0)).catch(() => put(v, '–')));
    card.querySelectorAll('.fbc-v').forEach(b => b.addEventListener('click', () => {
      if (my) return;
      my = b.dataset.v; store.set('fbc-vote', my); render();
      fetch(API + 'hit/' + NS + '/' + KEY[my]).then(r => r.json()).then(d => put(my, d.value)).catch(() => {});
    }));
    render();
  })();

  /* --- страница калькулятора --- */
  const formEl = doc.getElementById('calc-form');
  if (!formEl || !window.ESEPTE || !window.RATES) return;
  const E = window.ESEPTE, R = window.RATES;
  const id = formEl.getAttribute('data-calc');
  const C = E.calcs.find(c => c.id === id);
  if (!C) return;
  const resEl = doc.getElementById('calc-result');

  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const defOf = f => f.def === 'today' ? today() : (f.def === 'base' ? R.baseRate : f.def);
  const parseNum = s => { if (typeof s === 'number') return s; const v = parseFloat(String(s).replace(/[\s  ₸%]/g, '').replace(',', '.')); return isNaN(v) ? 0 : v; };
  const fmtInput = (n, dec) => { if (n === '' || n === null || isNaN(n)) return ''; return E.num(n, dec ? 'auto' : 0); };
  const lbl = o => (o && typeof o === 'object') ? (o[L] || o.ru) : (o || '');
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  /* значения: по умолчанию → из ссылки */
  const params = new URLSearchParams(location.search);
  const values = {};
  C.fields.forEach(f => {
    let v = defOf(f);
    if (params.has(f.id)) {
      const p = params.get(f.id);
      if (f.type === 'check') v = p === '1';
      else if (['money', 'number', 'percent'].includes(f.type)) v = parseNum(p);
      else v = p;
    }
    values[f.id] = v;
  });

  const options = f => typeof f.options === 'function' ? f.options(R) : f.options === 'history' ? R.history.map(h => ({ v: h.y, ru: h.y.replace('*', '') + (h.note ? ` (${h.note})` : ''), kk: h.y.replace('*', '') + (h.note ? ' *' : '') })) : f.options;

  /* построение формы */
  const build = () => {
    const main = doc.createElement('div'); main.className = 'fields';
    let adv = null;
    C.fields.forEach(f => {
      const w = doc.createElement('div');
      w.className = 'field field-' + f.type + (f.half ? ' half' : '');
      w.dataset.field = f.id;
      const fid = 'f-' + f.id;
      let html = '';
      if (f.type === 'check') {
        html = `<label class="check"><input type="checkbox" id="${fid}" ${values[f.id] ? 'checked' : ''}><span>${esc(lbl(f.label))}</span></label>`;
      } else if (f.type === 'seg') {
        html = `<span class="label" id="${fid}-l">${esc(lbl(f.label))}</span><div class="seg" role="radiogroup" aria-labelledby="${fid}-l">` +
          f.options.map(o => `<label><input type="radio" name="${fid}" value="${esc(o.v)}" ${String(values[f.id]) === String(o.v) ? 'checked' : ''}><span>${esc(lbl(o))}</span></label>`).join('') + '</div>';
      } else if (f.type === 'select') {
        html = `<label for="${fid}" class="label">${esc(lbl(f.label))}</label><select id="${fid}">` +
          options(f).map(o => `<option value="${esc(o.v)}" ${String(values[f.id]) === String(o.v) ? 'selected' : ''}>${esc(lbl(o))}</option>`).join('') + '</select>';
      } else if (f.type === 'date' || f.type === 'time') {
        html = `<label for="${fid}" class="label">${esc(lbl(f.label))}</label><input type="${f.type}" id="${fid}" value="${esc(values[f.id] || '')}">`;
      } else if (f.type === 'text') {
        html = `<label for="${fid}" class="label">${esc(lbl(f.label))}</label><div class="input"><input type="text" autocomplete="off" id="${fid}" value="${esc(values[f.id] || '')}"></div>`;
      } else {
        const suf = f.type === 'money' ? '₸' : (f.type === 'percent' ? '%' : lbl(f.suffix));
        const dec = f.type !== 'money' || f.dec;
        html = `<label for="${fid}" class="label">${esc(lbl(f.label))}</label><div class="input${suf ? ' has-suf' : ''}"><input type="text" inputmode="decimal" autocomplete="off" id="${fid}" value="${esc(fmtInput(values[f.id], dec))}">${suf ? `<span class="suf">${esc(suf)}</span>` : ''}</div>`;
      }
      if (f.hint) html += `<small class="hint">${esc(lbl(f.hint))}</small>`;
      w.innerHTML = html;
      if (f.adv) {
        if (!adv) { adv = doc.createElement('details'); adv.className = 'adv'; adv.innerHTML = `<summary>${UI.more}</summary><div class="fields"></div>`; }
        if (values[f.id]) adv.open = true;
        adv.querySelector('.fields').appendChild(w);
      } else main.appendChild(w);
    });
    formEl.innerHTML = '';
    formEl.appendChild(main);
    if (adv) formEl.appendChild(adv);

    C.fields.forEach(f => {
      const fid = 'f-' + f.id;
      if (f.type === 'seg') {
        formEl.querySelectorAll(`input[name="${fid}"]`).forEach(r => r.addEventListener('change', () => { values[f.id] = r.value; update(); }));
        return;
      }
      const el = doc.getElementById(fid);
      if (f.type === 'check') el.addEventListener('change', () => { values[f.id] = el.checked; update(); });
      else if (['select', 'date', 'time', 'text'].includes(f.type)) el.addEventListener('input', () => { values[f.id] = el.value; update(); });
      else {
        const dec = f.type !== 'money' || f.dec;
        el.addEventListener('input', () => { values[f.id] = parseNum(el.value); update(); });
        el.addEventListener('blur', () => { if (el.value.trim() !== '') el.value = fmtInput(values[f.id], dec); });
        el.addEventListener('focus', () => { setTimeout(() => { try { el.select(); } catch (e) { /* */ } }, 0); });
      }
    });
  };

  const fmtVal = (v, fmt) => {
    if (typeof v === 'string' && fmt !== 'text' && fmt !== 'words') return esc(v);
    switch (fmt) {
      case 'svg': return v;
      case 'text': case 'words': return esc(v);
      case 'money2': return E.money(v, 2);
      case 'num': return E.num(v, 0);
      case 'num1': return E.num(v, 1);
      case 'num2': return E.num(v, 2);
      case 'int': return String(v);
      case 'pct': return E.num(v, Math.abs(v - Math.round(v)) > 1e-9 ? 2 : 0) + '%';
      default: return E.money(v, 0);
    }
  };
  const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

  let last = null;
  /* плашка с итогом на телефоне: видна, пока сам результат за экраном */
  const mini = doc.getElementById('calc-mini'), panel = doc.getElementById('result-panel');
  let miniWanted = false, panelVisible = false;
  const miniShow = () => { if (mini) mini.hidden = !miniWanted || panelVisible; };
  if (mini && panel && 'IntersectionObserver' in window) {
    new IntersectionObserver(es => { panelVisible = es[0].isIntersecting; miniShow(); }, { threshold: 0.15 }).observe(panel);
  }
  const visibility = () => {
    C.fields.forEach(f => {
      const w = formEl.querySelector(`[data-field="${f.id}"]`);
      if (w) w.hidden = f.when ? !f.when(values) : false;
    });
  };

  const update = () => {
    visibility();
    let r;
    try { r = C.calc(Object.assign({}, values), R, L); } catch (e) { r = { error: e.message }; }
    last = r;
    if (r.error) { resEl.innerHTML = `<div class="res-error" role="status">${esc(r.error)}</div>`; return; }
    let h = `<div class="res-main"><div class="res-label">${esc(r.main.label)}</div><div class="res-value${r.main.fmt === 'words' || r.main.fmt === 'svg' ? ' words' : ''}">${fmtVal(r.main.value, r.main.fmt)}</div></div>`;
    if (r.cards && r.cards.length) h += '<div class="res-cards">' + r.cards.map(c => `<div class="res-card"><span>${esc(c.label)}</span><b class="${c.fmt === 'words' ? 'words' : ''}">${fmtVal(c.value, c.fmt)}</b></div>`).join('') + '</div>';
    if (r.rows && r.rows.length) h += '<table class="res-rows"><tbody>' + r.rows.map(x => x.head ? `<tr class="head"><th colspan="2">${esc(x.label)}</th></tr>` : `<tr class="${x.strong ? 'strong' : ''}"><td>${esc(x.label)}</td><td>${fmtVal(x.value, x.fmt)}</td></tr>`).join('') + '</tbody></table>';
    if (r.notes && r.notes.length) h += r.notes.map(n => `<p class="res-note">${esc(n)}</p>`).join('');
    if (r.steps && r.steps.length) h += `<details class="res-steps" open><summary>${UI.how}</summary><ol>${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></details>`;
    if (r.table) {
      const T = r.table;
      h += `<details class="res-table"><summary>${esc(T.title)} · ${T.rows.length} ${UI.rows}</summary><div class="scroll"><table><thead><tr>${T.head.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>` +
        T.rows.map(row => `<tr>${row.map((c, i) => `<td>${fmtVal(c, T.fmt[i])}</td>`).join('')}</tr>`).join('') + '</tbody></table></div></details>';
    }
    resEl.innerHTML = h;
    if (mini) {
      const words = r.main.fmt === 'words';
      mini.querySelector('span').textContent = plain(r.main.label);
      mini.querySelector('b').innerHTML = words ? '' : fmtVal(r.main.value, r.main.fmt);
      miniWanted = !words;
      miniShow();
    }
  };

  /* кнопки */
  const toast = (btn, text) => { const old = btn.textContent; btn.textContent = text; btn.disabled = true; setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1600); };
  const copyText = txt => {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    return new Promise((ok, no) => { const ta = doc.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; doc.body.appendChild(ta); ta.select(); try { doc.execCommand('copy'); ok(); } catch (e) { no(e); } ta.remove(); });
  };
  const shareUrl = () => {
    const p = new URLSearchParams();
    C.fields.forEach(f => { const v = values[f.id]; if (f.when && !f.when(values)) return; p.set(f.id, f.type === 'check' ? (v ? '1' : '0') : String(v)); });
    return location.origin + location.pathname + '?' + p.toString();
  };
  const actions = doc.getElementById('calc-actions');
  if (actions) {
    actions.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      const act = b.dataset.act;
      if (act === 'copy' && last && !last.error) {
        const title = doc.querySelector('h1').textContent.trim();
        let t = `${title}\n${plain(last.main.label)}: ${plain(fmtVal(last.main.value, last.main.fmt))}\n`;
        (last.cards || []).forEach(c => { t += `${plain(c.label)}: ${plain(fmtVal(c.value, c.fmt))}\n`; });
        (last.rows || []).forEach(x => { t += x.head ? `\n${x.label}\n` : `${plain(x.label)}: ${plain(fmtVal(x.value, x.fmt))}\n`; });
        if (last.copy) t = last.copy + '\n';
        t += `\n${UI.date}: ${E.fmtDate(E.parseDate(today()), L)}\n${UI.site}: ${location.origin + location.pathname}`;
        copyText(t).then(() => toast(b, UI.copied)).catch(() => {});
      } else if (act === 'share') {
        const u = shareUrl();
        try { history.replaceState(null, '', u); } catch (e) { /* */ }
        copyText(u).then(() => toast(b, UI.shared)).catch(() => {});
      } else if (act === 'print') {
        window.print();
      } else if (act === 'reset') {
        C.fields.forEach(f => { values[f.id] = defOf(f); });
        try { history.replaceState(null, '', location.pathname); } catch (e) { /* */ }
        build(); update();
      } else if (act === 'fav') {
        let favs = store.get('fav', []);
        favs = favs.includes(id) ? favs.filter(x => x !== id) : favs.concat(id);
        store.set('fav', favs); favState();
      }
    });
  }
  const favBtn = actions && actions.querySelector('[data-act="fav"]');
  const favState = () => {
    if (!favBtn) return;
    const on = store.get('fav', []).includes(id);
    favBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    favBtn.querySelector('span').textContent = on ? UI.unfav : UI.fav;
  };
  favState();
  build();
  update();
})();
