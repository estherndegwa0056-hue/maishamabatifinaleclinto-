document.addEventListener('DOMContentLoaded',()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  $$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

  const header=$('.site-header');
  let scrollTick=false, scrollTimer;
  const polishScroll=()=>{
    if(!scrollTick){requestAnimationFrame(()=>{
      header?.classList.toggle('scrolled',scrollY>18);
      const dock=$('.contact-dock');
      if(dock){dock.classList.add('is-scrolling');clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>dock.classList.remove('is-scrolling'),220);}
      scrollTick=false;
    });scrollTick=true;}
  };
  addEventListener('scroll',polishScroll,{passive:true}); polishScroll();

  const toggle=$('.nav-toggle'), mobile=$('.mobile-menu');
  toggle?.addEventListener('click',()=>mobile.classList.toggle('open'));
  $$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')));

  const progress=$('.progress');
  const updateProgress=()=>{if(progress){const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?(scrollY/h)*100:0)+'%'}};
  addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

  const reveal=()=>$$('.reveal').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.88)el.classList.add('show')});
  addEventListener('scroll',reveal,{passive:true}); reveal();

  // Hero slider: background first, then a staggered text entrance on every slide.
  const hero=$('.hero'), heroCopy=$('.hero-copy'), heroProgress=$('.hero-progress span');
  const slides=$$('.hero-slide'), dots=$$('.hero-dot'); let slideIndex=0, timer, heroProgressTimer;
  const resetHeroProgress=()=>{if(!heroProgress)return;heroProgress.classList.remove('running');void heroProgress.offsetWidth;heroProgress.classList.add('running')};
  const replayHeroCopy=()=>{if(!heroCopy)return;heroCopy.classList.remove('replay');void heroCopy.offsetWidth;heroCopy.classList.add('replay');setTimeout(()=>heroCopy.classList.remove('replay'),1600)};
  const showSlide=(i,first=false)=>{if(!slides.length)return; slideIndex=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===slideIndex));dots.forEach((d,n)=>d.classList.toggle('active',n===slideIndex));if(!first){resetHeroProgress();replayHeroCopy()}};
  const start=()=>{clearInterval(timer);if(slides.length>1)timer=setInterval(()=>showSlide(slideIndex+1),4000)};
  $$('.hero-next').forEach(b=>b.addEventListener('click',()=>{showSlide(slideIndex+1);start()}));
  $$('.hero-prev').forEach(b=>b.addEventListener('click',()=>{showSlide(slideIndex-1);start()}));
  dots.forEach((d,n)=>d.addEventListener('click',()=>{showSlide(n);start()}));
  showSlide(0,true);setTimeout(()=>{resetHeroProgress();start()},1050);

  // WhatsApp links: keep the destination editable in HTML through data-wa.
  $$('[data-wa]').forEach(a=>a.addEventListener('click',e=>{const msg=a.dataset.wa;if(msg){e.preventDefault();location.href='https://wa.me/254750005298?text='+encodeURIComponent(msg)}}));

  // Product filtering and modal.
  const filterButtons=$$('.filter-btn'), cards=$$('.product-card[data-category]');
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{filterButtons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;cards.forEach(card=>card.hidden=!(f==='all'||card.dataset.category===f));}));
  const modal=$('.modal'), modalImg=$('[data-modal-img]'), modalTitle=$('[data-modal-title]'), modalDesc=$('[data-modal-desc]'), modalMeta=$('[data-modal-meta]'), modalWa=$('[data-modal-wa]');
  const closeModal=()=>modal?.classList.remove('open');
  $$('.product-more').forEach(btn=>btn.addEventListener('click',()=>{if(!modal)return;const card=btn.closest('.product-card');modalImg.src=card.dataset.image;modalImg.alt=card.dataset.title;modalTitle.textContent=card.dataset.title;modalDesc.textContent=card.dataset.description;modalMeta.innerHTML='<div><strong>Category:</strong> '+card.dataset.categoryLabel+'</div><div><strong>Enquiries:</strong> +254 750 005 298</div>';modalWa.href='https://wa.me/254750005298?text='+encodeURIComponent('Hello Maisha Mabati Roofing, I would like to enquire about '+card.dataset.title+'.');modal.classList.add('open')}));
  $('.modal-close')?.addEventListener('click',closeModal); modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()}); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

  // Customer feedback carousel: autoplay, arrows, dots and a visible timing bar.
  const quotes=$$('.testimonial'), qdots=$$('.testimonial-dot'), qprev=$('.testimonial-prev'), qnext=$('.testimonial-next'), qbar=$('.testimonial-bar span'), qcurrent=$('[data-review-current]'), qtotal=$('[data-review-total]'); let qi=0,qt;
  if(qtotal)qtotal.textContent=String(quotes.length).padStart(2,'0');
  const resetReviewProgress=()=>{if(!qbar)return;qbar.classList.remove('running');void qbar.offsetWidth;qbar.classList.add('running')};
  const qshow=i=>{if(!quotes.length)return;qi=(i+quotes.length)%quotes.length;quotes.forEach((q,n)=>q.classList.toggle('active',n===qi));qdots.forEach((d,n)=>d.classList.toggle('active',n===qi));if(qcurrent)qcurrent.textContent=String(qi+1).padStart(2,'0');resetReviewProgress()};
  const qstart=()=>{clearInterval(qt);if(quotes.length>1)qt=setInterval(()=>qshow(qi+1),4000)};
  qdots.forEach((d,n)=>d.addEventListener('click',()=>{qshow(n);qstart()}));qnext?.addEventListener('click',()=>{qshow(qi+1);qstart()});qprev?.addEventListener('click',()=>{qshow(qi-1);qstart()});
  const qstage=$('.testimonial-stage');qstage?.addEventListener('mouseenter',()=>clearInterval(qt));qstage?.addEventListener('mouseleave',qstart);qstage?.addEventListener('focusin',()=>clearInterval(qt));qstage?.addEventListener('focusout',qstart);qshow(0);qstart();

  // FAQ accordion.
  $$('.faq-q').forEach(q=>q.addEventListener('click',()=>q.closest('.faq-item').classList.toggle('open')));

  // Manufacturing process tabs.
  const processSteps=$$('.process-step'), processHero=$('[data-process-image]'), processTitle=$('[data-process-title]'), processText=$('[data-process-text]');
  processSteps.forEach(step=>step.addEventListener('click',()=>{processSteps.forEach(s=>s.classList.remove('active'));step.classList.add('active');if(processHero)processHero.style.backgroundImage=`url('${step.dataset.image}')`;if(processTitle)processTitle.textContent=step.dataset.title;if(processText)processText.innerHTML=step.dataset.text}));

  // Back to top.
  const top=$('.backtop'); addEventListener('scroll',()=>top?.classList.toggle('show',scrollY>600),{passive:true});top?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // Floating contact interactions: tactile ripple feedback and accessible labels.
  $$('.float-btn').forEach(btn=>btn.addEventListener('click',e=>{
    const rect=btn.getBoundingClientRect();
    const ripple=document.createElement('span'); ripple.className='floating-ripple';
    const size=Math.max(rect.width,rect.height); ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=(e.clientX-rect.left-size/2)+'px'; ripple.style.top=(e.clientY-rect.top-size/2)+'px';
    btn.appendChild(ripple); setTimeout(()=>ripple.remove(),600);
  }));

  // Image fallback: prevents broken-image icons when a user later replaces an asset.
  $$('img').forEach(img=>img.addEventListener('error',()=>{if(img.dataset.fallbackApplied)return;img.dataset.fallbackApplied='1';img.src='assets/images/fallback.jpg'}));
});
