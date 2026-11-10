(() => {
  document.documentElement.classList.add('js');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hours, open-now status and tonight's event (Dallas time) ---------- */
  // [open, close] in 24h. Closing times after midnight are written past 24 (1 AM = 25).
  const HOURS = { 0: [15, 22], 1: null, 2: null, 3: [18, 24], 4: null, 5: [18, 25], 6: [15, 24] };
  const EVENTS = { 0: 'Fourth & Tipsy: Sunday Football', 3: 'Wednesday Night Interlude w/ DJ Papa Ron', 5: 'R&B Night', 6: 'Tequila Therapy Day Party' };
  const HAPPY = { 0: '4 – 8 PM', 3: '8 – 9 PM (reverse)', 5: '7 – 10 PM (reverse)', 6: '3 – 7 PM' };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fmt = h => {
    const hr = h % 24;
    if (hr === 0) return '12 AM';
    return `${hr % 12 || 12} ${hr >= 12 ? 'PM' : 'AM'}`;
  };
  function dallasNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    return { day: DAYS.indexOf(get('weekday')), time: (parseInt(get('hour'), 10) % 24) + parseInt(get('minute'), 10) / 60 };
  }
  function updateStatus() {
    const { day, time } = dallasNow();
    const prevDay = (day + 6) % 7;
    const today = HOURS[day], prev = HOURS[prevDay];
    let open = false, label, eventDay = day;

    if (prev && prev[1] > 24 && time < prev[1] - 24) {
      open = true; label = `Open now · until ${fmt(prev[1])}`; eventDay = prevDay;
    } else if (today && time >= today[0] && time < today[1]) {
      open = true; label = `Open now · until ${fmt(today[1])}`;
    } else if (today && time < today[0]) {
      label = `Opens today at ${fmt(today[0])}`;
    } else {
      for (let i = 1; i <= 7; i++) {
        const d = (day + i) % 7;
        if (HOURS[d]) { label = `Closed · opens ${i === 1 ? 'tomorrow' : DAYS[d]} ${fmt(HOURS[d][0])}`; break; }
      }
    }
    const status = $('#openStatus');
    if (status) { status.textContent = label; status.classList.toggle('is-open', open); }
    const hoursEl = $('#todayHours');
    const shown = HOURS[eventDay];
    if (hoursEl) hoursEl.textContent = shown ? `${fmt(shown[0])} – ${fmt(shown[1])}` : 'Closed';
    const eventEl = $('#todayEvent');
    if (eventEl) eventEl.textContent = EVENTS[eventDay] || 'Closed tonight';
    const hhEl = $('#todayHH');
    if (hhEl) hhEl.textContent = HAPPY[eventDay] || 'Wed – Sun';
    $$('#hoursList li').forEach(li => li.classList.toggle('today', +li.dataset.day === eventDay));
    $$('#nights li').forEach(li => li.classList.toggle('today', +li.dataset.day === eventDay));
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Hero slideshow ---------- */
  const hero = $('.hero');
  const slides = $$('.slide', hero);
  const dotsWrap = $('#slideDots');
  const caption = $('#slideCaption');
  const pauseBtn = $('#slidePause');
  const SLIDE_MS = 6000;
  let current = 0, timer = null, userPaused = reduceMotion, hoverPaused = false;
  hero.style.setProperty('--slide-ms', `${SLIDE_MS}ms`);

  const dots = slides.map((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dot';
    b.setAttribute('aria-label', `Show photo ${i + 1}: ${s.dataset.caption}`);
    b.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });
  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const on = n === current;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', !on);
      if (on) { const img = $('img', s); if (img.loading === 'lazy') img.loading = 'eager'; }
    });
    dots.forEach((d, n) => {
      d.classList.toggle('done', n < current);
      d.removeAttribute('aria-current');
      if (n === current) { void d.offsetWidth; d.setAttribute('aria-current', 'true'); }
    });
    caption.textContent = slides[current].dataset.caption;
    // warm up the next image so the crossfade never shows a blank frame
    const next = $('img', slides[(current + 1) % slides.length]);
    if (next.loading === 'lazy') next.loading = 'eager';
  }
  function restart() {
    clearInterval(timer);
    const paused = userPaused || hoverPaused || document.hidden;
    hero.classList.toggle('paused', paused);
    if (!paused) timer = setInterval(() => go(current + 1), SLIDE_MS);
  }
  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute('aria-pressed', userPaused);
    pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
    if (!userPaused) go(current);
    restart();
  });
  if (reduceMotion) { pauseBtn.setAttribute('aria-pressed', 'true'); pauseBtn.setAttribute('aria-label', 'Play slideshow'); }
  $('.hero-inner').addEventListener('focusin', () => { hoverPaused = true; restart(); });
  $('.hero-inner').addEventListener('focusout', () => { hoverPaused = false; restart(); });
  document.addEventListener('visibilitychange', restart);
  let sx = null;
  hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 60) { go(current + (dx < 0 ? 1 : -1)); restart(); }
    sx = null;
  });
  go(0);
  restart();

  /* ---------- Header: solid on scroll, mobile menu ---------- */
  const header = $('.site-header');
  const actionBar = $('.action-bar');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    if (actionBar) actionBar.classList.toggle('show', y > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('.menu-toggle');
  const mobileNav = $('#mobileNav');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.hidden = !open;
    if (open) header.classList.add('scrolled'); else onScroll();
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', mobileNav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); toggle.focus(); } });

  /* ---------- Scroll-synced nav ---------- */
  const navLinks = $$('.nav a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === `#${entry.target.id}` ? 'true' : 'false'));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(s => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); reveal.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach(el => reveal.observe(el));

  /* ---------- Menu tabs ---------- */
  const tabs = $$('[role="tab"]');
  const selectTab = tab => tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    $('#' + t.getAttribute('aria-controls')).hidden = !on;
  });
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next); next.focus();
    });
  });

  /* ---------- Gallery marquee: duplicate each track for a seamless loop ---------- */
  const tiles = $$('[data-gallery] .tile'); // originals only, collected before cloning
  if (!reduceMotion) {
    $$('[data-gallery] .track').forEach((track, i) => {
      [...track.children].forEach(tile => {
        const clone = tile.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        clone.dataset.clone = '';
        track.appendChild(clone);
      });
      // keep a steady speed regardless of row length: about 40px per second
      const setDur = () => track.style.setProperty('--dur', `${Math.max(30, track.scrollWidth / 2 / 40)}s`);
      setDur();
      window.addEventListener('load', setDur);
    });
  }

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const marquee = $('[data-gallery]');
  if (lb && typeof lb.showModal === 'function') {
    const lbImg = $('img', lb), lbCount = $('.lb-count', lb);
    let index = 0, opener = null;
    const show = i => {
      index = (i + tiles.length) % tiles.length;
      const t = tiles[index];
      lbImg.src = t.dataset.full;
      lbImg.alt = $('img', t).alt;
      lbCount.textContent = `${index + 1} / ${tiles.length}`;
    };
    $$('[data-gallery] .tile').forEach(t => t.addEventListener('click', () => {
      const src = t.dataset.full;
      opener = t;
      show(tiles.findIndex(o => o.dataset.full === src));
      marquee.classList.add('is-paused');
      lb.showModal();
    }));
    $('.lb-close', lb).addEventListener('click', () => lb.close());
    $('.lb-prev', lb).addEventListener('click', () => show(index - 1));
    $('.lb-next', lb).addEventListener('click', () => show(index + 1));
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'ArrowLeft') show(index - 1);
    });
    lb.addEventListener('close', () => {
      marquee.classList.remove('is-paused');
      if (opener && !opener.hasAttribute('data-clone')) opener.focus();
    });
    let startX = null;
    lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------- Event inquiry form ---------- */
  const form = $('#eventForm');
  if (form) {
    const status = $('#formStatus');
    const now = new Date();
    $('#eventDate').min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'form-status';
      let firstBad = null;
      $$('[required]', form).forEach(f => {
        const bad = !f.checkValidity();
        f.classList.toggle('invalid', bad);
        f.setAttribute('aria-invalid', bad);
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) {
        status.textContent = 'Please fill in the highlighted fields.';
        status.classList.add('err');
        firstBad.focus();
        return;
      }
      if (form.action.includes('YOUR_FORM_ID')) {
        status.textContent = 'Form not connected yet. Add the Formspree form ID to go live.';
        status.classList.add('err');
        return;
      }
      const btn = $('button[type="submit"]', form);
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
        form.reset();
        status.textContent = 'Thanks! The Seek events team will reach out within 48 hours.';
        status.classList.add('ok');
      } catch {
        status.textContent = 'Something went wrong. Please try again or message us on Instagram.';
        status.classList.add('err');
      } finally {
        btn.disabled = false; btn.textContent = 'Send inquiry';
      }
    });
    form.addEventListener('input', e => {
      if (e.target.classList.contains('invalid') && e.target.checkValidity()) {
        e.target.classList.remove('invalid'); e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }

  /* ---------- Menu viewer ---------- */
  const md = $('#menuDialog');
  if (md && typeof md.showModal === 'function') {
    const MENUS = {
      food: { title: 'Food menu', src: 'img/menu-food.webp', w: 1402, h: 1122,
        alt: 'Seek Trinity Groves food menu: appetizers, entrées, sides, combo baskets, nachos, desserts and healthy choices with prices' },
      drinks: { title: 'Drink menu', src: 'img/menu-drinks.webp', w: 1536, h: 1024,
        alt: 'Seek Trinity Groves drink menu: cocktails, wine, bottle service, champagne, beer and non-alcoholic drinks with prices' }
    };
    const body = $('#mdBody'), img = $('#mdImg'), full = $('#mdFull'), hint = $('#mdHint'), title = $('#menuDialogTitle');
    let which = 'food', opener = null;
    const setZoom = (on, x = .5, y = .3) => {
      body.classList.toggle('zoomed', on);
      hint.textContent = on ? 'Drag to look around · tap to fit' : (matchMedia('(max-width: 640px)').matches ? 'Swipe across to read · tap to zoom' : 'Tap the menu to zoom');
      if (on) requestAnimationFrame(() => {
        body.scrollLeft = (body.scrollWidth - body.clientWidth) * x;
        body.scrollTop = (body.scrollHeight - body.clientHeight) * y;
      });
    };
    const show = key => {
      which = key; const m = MENUS[key];
      img.src = m.src; img.width = m.w; img.height = m.h; img.alt = m.alt;
      full.href = m.src; title.textContent = m.title;
      $$('[data-menu]', md).forEach(b => b.setAttribute('aria-pressed', b.dataset.menu === key));
      setZoom(false); body.scrollTop = 0;
    };
    $$('[data-menu-open]').forEach(el => el.addEventListener('click', e => {
      e.preventDefault(); opener = el; show(el.dataset.menuOpen); md.showModal();
      document.documentElement.classList.add('modal-open');
    }));
    $$('[data-menu]', md).forEach(b => b.addEventListener('click', () => show(b.dataset.menu)));
    $('.md-close', md).addEventListener('click', () => md.close());
    md.addEventListener('click', e => { if (e.target === md) md.close(); });
    md.addEventListener('close', () => { document.documentElement.classList.remove('modal-open'); if (opener) opener.focus(); });
    img.addEventListener('click', e => {
      if (body.classList.contains('zoomed')) return setZoom(false);
      const r = img.getBoundingClientRect();
      setZoom(true, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    });
    md.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') show(which === 'food' ? 'drinks' : 'food');
    });
    // preload the other menu
    const pre = new Image(); pre.src = MENUS.drinks.src;
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
