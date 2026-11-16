(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Accessible mobile navigation.
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    };
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
    });
  }

  // Accordion gallery: expandable service panels; keyboard, hover and touch.
  const gallery = document.querySelector('[data-accordion-gallery]');
  if (gallery) {
    const panels = [...gallery.querySelectorAll('.accordion-panel')];
    const name = document.getElementById('treatment-name');
    const description = document.getElementById('treatment-description');
    const count = document.getElementById('treatment-count');
    const cta = document.getElementById('treatment-cta');
    const activate = index => {
      panels.forEach((panel, i) => {
        const active = i === index;
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-pressed', String(active));
      });
      const panel = panels[index];
      if (!panel) return;
      if (name) name.textContent = panel.dataset.name || '';
      if (description) description.textContent = panel.dataset.summary || '';
      if (count) count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(panels.length).padStart(2, '0');
      if (cta) cta.href = 'https://wa.me/5565992086417?text=' + encodeURIComponent('Olá! Gostaria de saber mais sobre ' + (panel.dataset.name || 'os tratamentos') + ' na Primor.');
    };
    panels.forEach((panel, index) => {
      panel.addEventListener('click', () => activate(index));
      panel.addEventListener('focus', () => activate(index));
      panel.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' && !reducedMotion.matches) activate(index);
      });
      panel.addEventListener('keydown', event => {
        let next = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % panels.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + panels.length) % panels.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = panels.length - 1;
        if (next !== -1) {
          event.preventDefault();
          panels[next].focus();
          activate(next);
        }
      });
    });
    activate(0);
  }

  // Window-driven scroll stack. Uses native scroll/sticky positioning, without
  // hijacking wheel, touch, scrollbar or keyboard events.
  const stack = document.querySelector('[data-scroll-stack]');
  const stackCards = stack ? [...stack.querySelectorAll('.stack-card')] : [];
  let scheduled = false;
  const renderStack = () => {
    scheduled = false;
    if (!stack || reducedMotion.matches) {
      stackCards.forEach(card => { card.style.transform = ''; card.style.filter = ''; });
      return;
    }
    const topBase = window.innerWidth <= 780 ? 76 : 100;
    const distance = window.innerWidth <= 780 ? 13 : 23;
    stackCards.forEach((card, index) => {
      const next = stackCards[index + 1];
      if (!next) { card.style.transform = ''; card.style.filter = ''; return; }
      const pinY = topBase + distance * index;
      const nextTop = next.getBoundingClientRect().top;
      const overlap = Math.max(0, Math.min(1, (pinY + card.offsetHeight - nextTop) / Math.max(180, card.offsetHeight - distance)));
      const scale = 1 - overlap * 0.055;
      card.style.transform = overlap > 0 ? 'scale(' + scale.toFixed(4) + ')' : '';
      card.style.filter = overlap > 0 ? 'brightness(' + (1 - overlap * .075).toFixed(3) + ')' : '';
    });
  };
  const scheduleStack = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(renderStack);
    }
  };
  if (stackCards.length) {
    window.addEventListener('scroll', scheduleStack, {passive:true});
    window.addEventListener('resize', scheduleStack, {passive:true});
    reducedMotion.addEventListener?.('change', scheduleStack);
    scheduleStack();
  }

  // Animate only elements in view.
  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }, {threshold: .08, rootMargin:'0px 0px -25px 0px'});
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Video playback honors page visibility, reduced motion and Save-Data.
  const video = document.querySelector('.ambient-video');
  const film = document.querySelector('.film-frame');
  const videoButton = document.querySelector('.film-toggle');
  if (video && film) {
    const saveData = !!navigator.connection?.saveData;
    let userPaused = false;
    let visible = false;
    const canAutoplay = () => !reducedMotion.matches && !saveData && !userPaused && visible && !document.hidden;
    const updateVideo = () => {
      if (canAutoplay()) {
        video.play().then(() => {
          film.classList.remove('video-failed', 'video-reduced');
        }).catch(() => {
          film.classList.add('video-failed');
        });
      } else {
        video.pause();
        if (reducedMotion.matches || saveData) film.classList.add('video-reduced');
        else film.classList.remove('video-reduced');
      }
      if (videoButton) {
        videoButton.textContent = userPaused ? 'Reproduzir ▶' : 'Pausar Ⅱ';
        videoButton.setAttribute('aria-label', userPaused ? 'Reproduzir vídeo' : 'Pausar vídeo');
        videoButton.setAttribute('aria-pressed', String(userPaused));
      }
    };
    video.addEventListener('error', () => film.classList.add('video-failed'));
    if (video.querySelector('source')) video.querySelector('source').addEventListener('error', () => film.classList.add('video-failed'));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = !!entries[0]?.isIntersecting;
        updateVideo();
      }, {threshold: .3});
      observer.observe(film);
    } else {
      visible = true;
      updateVideo();
    }
    videoButton?.addEventListener('click', () => {
      userPaused = !userPaused;
      updateVideo();
    });
    reducedMotion.addEventListener?.('change', updateVideo);
    document.addEventListener('visibilitychange', updateVideo);
    video.pause();
  }
})();