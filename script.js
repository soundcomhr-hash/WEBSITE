// mobile menu
  const burger=document.getElementById('burger'), links=document.getElementById('navLinks');
  burger.addEventListener('click',()=>links.classList.toggle('open'));
  links.querySelectorAll('a:not(.nav__ddtoggle)').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
  // gefen dropdown
  const gToggle=document.getElementById('gefenToggle'),gDd=document.getElementById('gefenDd');
  if(gToggle){
    gToggle.addEventListener('click',e=>{e.preventDefault();gDd.classList.toggle('open');});
    document.addEventListener('click',e=>{if(!gDd.contains(e.target))gDd.classList.remove('open');});
    gDd.querySelectorAll('.nav__ddmenu a').forEach(a=>a.addEventListener('click',()=>{gDd.classList.remove('open');links.classList.remove('open');}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){gDd.classList.remove('open');links.classList.remove('open');}});
  }
  // mobile program-page nav
  const mnavTrigger=document.getElementById('mnavTrigger'),mmenu=document.getElementById('mmenu'),navPill=document.querySelector('.nav__pill'),navLogo=document.getElementById('navLogo');
  function isMobileUI(){return mnavTrigger&&getComputedStyle(mnavTrigger).display!=='none';}
  function closeMenu(){if(navPill)navPill.classList.remove('menu-open');}
  if(mnavTrigger&&navPill){
    mnavTrigger.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();navPill.classList.toggle('menu-open');});
    document.addEventListener('click',e=>{if(!navPill.contains(e.target))closeMenu();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  }
  if(mmenu){
    mmenu.querySelectorAll('a').forEach(a=>{a.addEventListener('click',()=>{closeMenu();});});
  }
  if(navLogo){
    navLogo.addEventListener('click',()=>{closeMenu();});
  }

  // playable color keys (Figurenotes -> note)
  const NOTES={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00,B4:493.88,C5:523.25};
  let actx=null;
  function play(freq,dur){
    dur=dur||1.6;
    try{
      actx=actx||new (window.AudioContext||window.webkitAudioContext)();
      if(actx.state==='suspended')actx.resume();
      const o=actx.createOscillator(),g=actx.createGain();
      o.type='triangle';o.frequency.value=freq;o.connect(g);g.connect(actx.destination);
      const t=actx.currentTime;
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.28,t+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      o.start(t);o.stop(t+dur+0.05);
    }catch(err){}
  }
  const bounce=k=>k.animate([{transform:'translateY(0)'},{transform:'translateY(-12px)'},{transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
  let isDown=false,lastKey=null;
  function trigger(k){if(!k)return;play(NOTES[k.dataset.note]);bounce(k);lastKey=k;}
  const keysEl=document.querySelector('.keys');
  if(keysEl){
    keysEl.addEventListener('pointerdown',e=>{const k=e.target.closest('b[data-note]');if(!k)return;e.preventDefault();isDown=true;trigger(k);});
    keysEl.addEventListener('pointermove',e=>{if(!isDown)return;const el=document.elementFromPoint(e.clientX,e.clientY);const k=el&&el.closest&&el.closest('b[data-note]');if(k&&k!==lastKey)trigger(k);});
    window.addEventListener('pointerup',()=>{isDown=false;lastKey=null;});
    window.addEventListener('pointercancel',()=>{isDown=false;lastKey=null;});
  }
  document.querySelectorAll('.keys b[data-note]').forEach(k=>{
    k.tabIndex=0;k.setAttribute('role','button');k.setAttribute('aria-label','צליל '+k.dataset.note);
    k.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();trigger(k);}});
  });
  // sample piece: Twinkle Twinkle (color notes light up)
  const DEMO=[['C4',430],['C4',430],['G4',430],['G4',430],['A4',430],['A4',430],['G4',760],['F4',430],['F4',430],['E4',430],['E4',430],['D4',430],['D4',430],['C4',760]];
  const playPiece=document.getElementById('playPiece');
  const notation=document.getElementById('notation');
  const nblocks=notation?notation.querySelectorAll('.nb'):[];
  let isPlaying=false;
  if(playPiece){playPiece.addEventListener('click',e=>{
    e.preventDefault();
    if(isPlaying)return;
    isPlaying=true;
    if(notation)notation.classList.add('show');
    playPiece.textContent='מנגן... ♪';
    let tt=0;
    DEMO.forEach(([n,d],i)=>{
      setTimeout(()=>{
        play(NOTES[n],d/1000*0.92);
        const k=document.querySelector('.keys b[data-note="'+n+'"]');if(k)bounce(k);
        const nb=nblocks[i];if(nb){nb.classList.add('lit');setTimeout(()=>nb.classList.remove('lit'),Math.min(d,420));}
      },tt);
      tt+=d;
    });
    setTimeout(()=>{isPlaying=false;playPiece.textContent='↑ נסו בעצמכם';},tt+250);
  });}

  // scroll reveal
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.18});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
