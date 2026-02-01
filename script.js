// Menu mobile hamburger
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    // Ferme le menu si on clique en dehors
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', ()=>{
  const btns = document.querySelectorAll('.nav-toggle');
  const navs = document.querySelectorAll('.nav');
  btns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = document.querySelector('.nav');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  });

  // close on ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      const nav = document.querySelector('.nav');
      if(nav && nav.classList.contains('open')){
        nav.classList.remove('open');
        const btn = document.querySelector('.nav-toggle');
        if(btn) btn.setAttribute('aria-expanded','false');
      }
    }
  });

  // close when clicking a nav link (mobile)
  document.querySelectorAll('.nav a').forEach(a=>{
    a.addEventListener('click', ()=>{
      const nav = document.querySelector('.nav');
      if(nav && nav.classList.contains('open')){
        nav.classList.remove('open');
        const btn = document.querySelector('.nav-toggle');
        if(btn) btn.setAttribute('aria-expanded','false');
      }
    });
  });
  
  // Reveal on scroll using IntersectionObserver
  const revealObserver = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
        entry.target.classList.remove('reveal-hidden');
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.08});

  // apply reveal-hidden to immediate children of main.container if not already set
  document.querySelectorAll('main.container').forEach(main=>{
    Array.from(main.children).forEach((child, i)=>{
      if(!child.classList.contains('reveal') && !child.classList.contains('reveal-hidden')){
        child.classList.add('reveal-hidden');
        child.style.transitionDelay = `${i * 70}ms`;
        revealObserver.observe(child);
      }
    });
  });

  // observe footer reveal
  const footer = document.querySelector('.footer');
  if(footer){
    footer.classList.add('reveal-hidden');
    revealObserver.observe(footer);
  }

  // Page transition: intercept internal link clicks to animate out
  function isInternalLink(a){
    try{
      const url = new URL(a.href, location.href);
      return url.origin === location.origin && url.pathname !== location.pathname;
    }catch(e){return false}
  }

  document.querySelectorAll('a').forEach(a=>{
    if(a.target === '_blank') return;
    if(a.getAttribute('href') && (a.getAttribute('href').startsWith('mailto:') || a.getAttribute('href').startsWith('tel:'))) return;
    a.addEventListener('click', (e)=>{
      if(!isInternalLink(a)) return;
      e.preventDefault();
      const href = a.href;
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ location.href = href; return }
      document.body.classList.add('page-exit');
      // match CSS transition (.42s) for a smooth exit
      setTimeout(()=> location.href = href, 420);
    });
  });

  // ensure page-enter class for smooth appearance
  requestAnimationFrame(()=>{
    document.body.classList.remove('page-exit');
    document.body.classList.add('page-enter');
  });

  // Simple lightbox for gallery images
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<div class="inner"><img alt="" /><div class="caption"></div></div>';
  document.body.appendChild(lightbox);

  function openLightbox(img){
    const lbImg = lightbox.querySelector('img');
    const cap = lightbox.querySelector('.caption');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    cap.textContent = img.getAttribute('data-caption') || img.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox || e.target.tagName === 'IMG') closeLightbox();
  });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

  document.querySelectorAll('.gallery img, .card img').forEach(img=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> openLightbox(img));
  });
});
