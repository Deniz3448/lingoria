/* ============================================================
   LINGORIA — REELS motoru
   DOM'u (telefon + 8 gerçek uygulama ekranı) kurar ve
   LingoriaReel.play({title, beats}) ile zaman çizelgesini oynatır.
   ============================================================ */
(function(){

const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <symbol id="i-chev" viewBox="0 0 24 24"><path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
 <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19.5 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol>
 <symbol id="i-close" viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></symbol>
 <symbol id="i-flame" viewBox="0 0 24 24"><path d="M13.6 1.8c.7 4-1.9 6-3.8 8.7C8.4 12.4 7.6 14.2 7.6 16.2A5.4 5.4 0 0 0 18.4 16c0-1.8-.5-3.2-1.5-4.6.2 1.5-.6 2.6-1.7 3.1 1-3.9-.7-7.4-1.6-12.7z" fill="currentColor"/></symbol>
 <symbol id="i-book" viewBox="0 0 24 24"><path d="M6.5 2.8h11a1 1 0 0 1 1 1v14.4H8.3a1.8 1.8 0 0 0-1.8 1.8V2.8z" fill="currentColor"/><path d="M6.5 19a1.8 1.8 0 0 1 1.8-1.8h10.2v3.2A.8.8 0 0 1 17.7 21H8.3A1.8 1.8 0 0 1 6.5 19z" fill="currentColor" opacity=".55"/></symbol>
 <symbol id="i-pad" viewBox="0 0 24 24"><path d="M8 7.5h8a5.2 5.2 0 0 1 5.1 6.2l-.6 3.1a2.8 2.8 0 0 1-5.2.7l-1.4-2H10l-1.4 2a2.8 2.8 0 0 1-5.2-.7l-.6-3.1A5.2 5.2 0 0 1 8 7.5z" fill="currentColor"/><circle cx="7.4" cy="12.6" r="1.5" fill="#fff"/><circle cx="16.4" cy="12.6" r="1.5" fill="#fff"/></symbol>
 <symbol id="i-map" viewBox="0 0 24 24"><path d="M9 3.4 3.4 5.5v15.1L9 18.5l6 2.1 5.6-2.1V3.4L15 5.5l-6-2.1z" fill="currentColor"/></symbol>
 <symbol id="i-person" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.1" fill="currentColor"/><path d="M4.4 20.5a7.6 7.6 0 0 1 15.2 0z" fill="currentColor"/></symbol>
 <symbol id="i-crown" viewBox="0 0 24 24"><path d="M2.8 8.4 7 11.7 12 4.7l5 7 4.2-3.3-1.9 11.6H4.7z" fill="currentColor"/></symbol>
 <symbol id="i-spk" viewBox="0 0 24 24"><path d="M4 9h3.4L13 4.4v15.2L7.4 15H4z" fill="currentColor"/><path d="M16.2 9.3a4 4 0 0 1 0 5.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></symbol>
 <symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 2.2l2.4 6.9L21.3 12l-6.9 2.4L12 21.8l-2.4-6.9L2.7 12l6.9-2.4z" fill="currentColor"/></symbol>
 <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5.5" y="10.3" width="13" height="9.7" rx="2.4" fill="currentColor"/><path d="M8.4 10.3V7.8a3.6 3.6 0 0 1 7.2 0v2.5" fill="none" stroke="currentColor" stroke-width="2.1"/></symbol>
 <symbol id="i-fork" viewBox="0 0 24 24"><path d="M7 2.5v7M9.5 2.5v7M5 2.5v6.5a2.5 2.5 0 0 0 2.5 2.5h.5V21M17 2.5c-2 0-3 2.5-3 6 0 2.5 1 3.5 2 3.7V21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</defs></svg>`;

const TAB = function(active){
  const t=[['i-book','Öğren'],['i-pad','Pratik'],['i-map','Yol'],['i-person','Ben']];
  return '<div class="tabbar">'+t.map((x,k)=>
    '<div class="tab'+(k===active?' on':'')+'"><svg><use href="#'+x[0]+'"/></svg><span>'+x[1]+'</span></div>'
  ).join('')+'</div>';
};

const SCREENS = `
<div class="scr" data-s="1">
 <div class="statusbar"></div>
 <div class="body">
  <div class="chip rise" style="--d:.05s">🇬🇧 İngilizce öğreniyorsun</div>
  <div class="lr-head rise" style="--d:.15s">
   <div><div class="lr-eyebrow">A2 · Günlük Hayat</div>
    <div class="lr-title">A2 Seviyesi</div>
    <div class="lr-goal">Hedef: Akıcı günlük konuşma</div></div>
   <div class="lr-pct num">%64</div>
  </div>
  <div class="lr-bar rise" style="--d:.25s"><i></i></div>
  <div class="lr-count rise" style="--d:.32s">6 / 10 bölüm tamamlandı</div>
  <div class="path">
   <div class="node done node-off-l rise" style="--d:.4s"><svg><use href="#i-check"/></svg></div>
   <div class="dline rise" style="--d:.44s"></div>
   <div class="node done rise" style="--d:.48s"><svg><use href="#i-check"/></svg></div>
   <div class="dline rise" style="--d:.52s"></div>
   <div class="node now node-off-r rise" style="--d:.56s">
    <div class="halo"></div><svg><use href="#i-flame"/></svg><div class="tag">Başla →</div></div>
   <div class="dline rise" style="--d:.6s"></div>
   <div class="node lock node-off-l rise" style="--d:.64s"><svg><use href="#i-lock"/></svg></div>
  </div>
 </div>` + TAB(0) + `</div>

<div class="scr" data-s="2">
 <div class="statusbar"></div>
 <div class="navbar">
  <div class="nav-ic"><svg><use href="#i-close"/></svg></div>
  <div class="nav-prog"><i></i></div>
  <div class="nav-ic" style="color:var(--amber);font-weight:800;font-size:calc(13*var(--pt))">🔥4</div>
 </div>
 <div class="body">
  <div class="q-eyebrow rise" style="--d:.05s">Boşluğu doldur</div>
  <div class="q-sent rise" style="--d:.15s">She <span class="q-blank"></span> coffee every morning.</div>
  <div class="opts">
   <div class="opt correct rise" style="--d:.3s"><span>drinks</span><svg class="tick"><use href="#i-check"/></svg></div>
   <div class="opt rise" style="--d:.38s"><span>drink</span><svg class="tick"><use href="#i-check"/></svg></div>
   <div class="opt rise" style="--d:.46s"><span>drinking</span><svg class="tick"><use href="#i-check"/></svg></div>
   <div class="opt rise" style="--d:.54s"><span>drank</span><svg class="tick"><use href="#i-check"/></svg></div>
  </div>
  <div class="xp-toast">+15 XP · Doğru! 🎉</div>
 </div>
</div>

<div class="scr" data-s="3">
 <div class="statusbar"></div>
 <div class="navbar">
  <div class="nav-ic"><svg><use href="#i-chev"/></svg></div>
  <div class="nav-mid"><div class="nav-title">Restoran</div>
   <div class="nav-sub">Garson Sophie · A2</div></div>
  <div class="nav-ic"><svg><use href="#i-spk"/></svg></div>
 </div>
 <div class="body">
  <div class="scn-banner rise" style="--d:.05s">
   <div class="scn-ic"><svg><use href="#i-fork"/></svg></div>
   <div><b>Restoran</b><br><span>20+ gerçek hayat senaryosundan biri</span></div>
  </div>
  <div class="bubble b-ai rise" style="--d:.2s">Good evening! Welcome to Bella Notte. How many people tonight?<span class="spk"><svg><use href="#i-spk"/></svg></span></div>
  <div class="choices">
   <div class="cc rise" style="--d:.45s">Just one, please.</div>
   <div class="cc pick rise" style="--d:.55s">Two people, thank you.</div>
   <div class="cc rise" style="--d:.65s">I'm waiting for someone.</div>
  </div>
  <div class="bubble b-ai b-react">Wonderful, a table for two. Right this way!<span class="spk"><svg><use href="#i-spk"/></svg></span></div>
 </div>
</div>

<div class="scr" data-s="4">
 <div class="statusbar"></div>
 <div class="navbar">
  <div class="nav-ic"><svg><use href="#i-chev"/></svg></div>
  <div class="nav-mid"><div class="nav-title">Kelime Kartları</div></div>
  <div class="nav-ic" style="font-size:calc(13*var(--pt));font-weight:700;color:var(--ink-sub)">3/10</div>
 </div>
 <div class="body">
  <div class="dots rise" style="--d:.05s"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></div>
  <div class="fc-wrap rise" style="--d:.15s">
   <div class="fc">
    <div class="fc-face fc-front">
     <div class="fc-word">resilient</div>
     <div class="fc-ipa">/rɪˈzɪl.i.ənt/ <svg><use href="#i-spk"/></svg></div>
     <div class="fc-hint">Anlamı için karta dokun</div>
    </div>
    <div class="fc-face fc-back">
     <div class="fc-tr">dayanıklı</div>
     <div class="fc-ex">"She stayed resilient through every challenge."</div>
    </div>
   </div>
  </div>
  <div class="fc-actions rise" style="--d:.3s">
   <div class="btn ghost">Tekrar et</div>
   <div class="btn amber"><svg><use href="#i-check"/></svg> Biliyorum</div>
  </div>
 </div>
</div>

<div class="scr" data-s="5">
 <div class="statusbar"></div>
 <div class="navbar">
  <div class="nav-ic"><svg><use href="#i-chev"/></svg></div>
  <div class="nav-mid"><div class="nav-title">Okuma</div></div>
  <div class="nav-ic"></div>
 </div>
 <div class="body">
  <div class="bk-row rise" style="--d:.05s">
   <div class="bk-cv"><svg><use href="#i-book"/></svg></div>
   <div><b>The Lighthouse Keeper</b><span class="bk-badge">A2 · Kısa Hikâye</span></div>
  </div>
  <p class="read rise" style="--d:.2s">Every night, the old keeper climbed the stairs. He was very <span class="rw">curious<span class="tr-pop">curious — meraklı</span></span> about the ships sailing far away on the dark, quiet sea.</p>
  <div class="btn ghost listen rise" style="--d:.4s">
   <svg style="color:var(--amber-700)"><use href="#i-spk"/></svg> Sesli Dinle
  </div>
 </div>
</div>

<div class="scr" data-s="6">
 <div class="statusbar"></div>
 <div class="body">
  <div class="rm-title rise" style="--d:.05s">Yol Haritası</div>
  <div class="rm-sub rise" style="--d:.12s">A1'den C2'ye — 6 seviye, net bir plan</div>
  <div class="rm-list">
   <div class="card rm-row rm-done rise" style="--d:.2s">
    <div class="rm-badge">A1</div>
    <div class="rm-info"><b>A1 · Başlangıç</b><div class="rm-meta">Tamamlandı</div></div>
    <svg class="rm-stat"><use href="#i-check"/></svg></div>
   <div class="card rm-row rm-now rise" style="--d:.3s">
    <div class="rm-badge">A2</div>
    <div class="rm-info"><b>A2 · Günlük Hayat</b><div class="rm-mini"><i></i></div></div></div>
   <div class="card rm-row rm-lock rise" style="--d:.4s">
    <div class="rm-badge">B1</div>
    <div class="rm-info"><b>B1 · Orta Seviye</b><div class="rm-meta">Kilitli</div></div>
    <svg class="rm-stat"><use href="#i-lock"/></svg></div>
   <div class="card rm-row rm-lock rise" style="--d:.48s">
    <div class="rm-badge">B2</div>
    <div class="rm-info"><b>B2 · İleri Seviye</b><div class="rm-meta">Kilitli</div></div>
    <svg class="rm-stat"><use href="#i-lock"/></svg></div>
   <div class="card rm-row rm-lock rise" style="--d:.56s">
    <div class="rm-badge">C1</div>
    <div class="rm-info"><b>C1 · Akıcı</b><div class="rm-meta">Kilitli</div></div>
    <svg class="rm-stat"><use href="#i-lock"/></svg></div>
  </div>
 </div>` + TAB(2) + `</div>

<div class="scr" data-s="7">
 <div class="statusbar"></div>
 <div class="body">
  <div class="me-head rise" style="--d:.05s">
   <div class="me-av"><svg><use href="#i-person"/></svg></div>
   <div><b>Deniz</b><br><span>A2 · 1.240 XP · Maceracı</span></div>
  </div>
  <div class="card streak-card rise" style="--d:.15s">
   <svg class="flame"><use href="#i-flame"/></svg>
   <div><div class="sc-num num">12</div><div class="sc-lbl">günlük seri</div></div>
   <div class="freeze">❄️ 2 dondurucu</div>
  </div>
  <div class="ring-wrap rise" style="--d:.25s">
   <div class="ring-in"><b class="num">8/10</b><span>dakika · bugünkü hedef</span></div>
  </div>
  <div class="stat-row rise" style="--d:.4s">
   <div class="card stat"><b class="num">248</b><span>KELİME</span></div>
   <div class="card stat"><b class="num">14sa</b><span>PRATİK</span></div>
   <div class="card stat"><b class="num">5</b><span>ROZET</span></div>
  </div>
 </div>` + TAB(3) + `</div>

<div class="scr" data-s="8">
 <div class="statusbar"></div>
 <div class="body ctr" style="gap:calc(11*var(--pt))">
  <div class="crown rise" style="--d:.05s"><svg><use href="#i-crown"/></svg></div>
  <div class="pm-tag rise" style="--d:.15s">✦ LINGORIA PREMIUM</div>
  <div class="pm-title rise" style="--d:.22s">Premium'a geç</div>
  <div class="price-card rise" style="--d:.3s">
   <div class="pm-disc">%50 İNDİRİM · SINIRLI SÜRE</div>
   <div class="pm-period">Yıllık abonelik</div>
   <div class="pm-prices"><span class="pm-old">999 TL</span><span class="pm-new">499 TL</span></div>
   <div class="pm-hint">/ yıl · ayda yaklaşık 42 TL</div>
  </div>
  <div class="feat rise" style="--d:.4s">
   <div class="feat-row"><span class="fck"><svg><use href="#i-check"/></svg></span><span>Sınırsız AI Tutor konuşma</span></div>
   <div class="feat-row"><span class="fck"><svg><use href="#i-check"/></svg></span><span>Tüm kitap kütüphanesi</span></div>
   <div class="feat-row"><span class="fck"><svg><use href="#i-check"/></svg></span><span>Telaffuz geri bildirimi + Streak shield</span></div>
   <div class="feat-row"><span class="fck"><svg><use href="#i-check"/></svg></span><span>Sınırsız hata · Offline kullanım</span></div>
  </div>
  <div class="btn gold rise" style="--d:.52s;width:100%"><svg><use href="#i-check"/></svg> 24 saat ücretsiz dene</div>
  <div class="pm-store rise" style="--d:.62s"><img src="app-icon.png" alt=""> App Store'da · Lingoria</div>
 </div>
</div>`;

const STAGE = `
<div class="stage" id="stage">
 <div class="glow g1"></div><div class="glow g2"></div><div class="glow g3"></div>
 <div class="reel-badge" id="reelBadge"></div>
 <div class="headline" id="headline"></div>
 <div class="phone enter"><div class="island"></div>
  <div class="screen-host">`+SCREENS+`</div>
 </div>
 <div class="watermark"><img src="app-icon.png" alt="Lingoria"> Lingoria</div>
 <div class="progress-wrap"><div class="progress" id="progress"></div></div>
</div>
<div class="controls" id="controls">
 <button data-act="play" id="playBtn">⏸ Durdur</button>
 <button data-act="restart">↺ Baştan</button>
 <button data-act="rec">● Kayıt modu</button>
 <span class="hint">Boşluk: durdur · R: baştan · H: kayıt modu · T: yazıyı gizle</span>
</div>`;

document.body.insertAdjacentHTML('afterbegin', SPRITE + STAGE);

// iOS status bar
const SB = '<span class="sb-time">9:41</span><span class="sb-right">'
 + '<svg viewBox="0 0 20 12"><rect x="0" y="7.5" width="3" height="4.5" rx="1" fill="currentColor"/>'
 + '<rect x="5.5" y="5" width="3" height="7" rx="1" fill="currentColor"/>'
 + '<rect x="11" y="2.5" width="3" height="9.5" rx="1" fill="currentColor"/>'
 + '<rect x="16.5" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>'
 + '<svg viewBox="0 0 16 12"><path d="M1 4.2a10 10 0 0 1 14 0M3.4 7a6.5 6.5 0 0 1 9.2 0M5.9 9.8a3 3 0 0 1 4.2 0" '
 + 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
 + '<circle cx="8" cy="11" r="1.1" fill="currentColor"/></svg>'
 + '<span class="bat"><i></i></span></span>';
document.querySelectorAll('.statusbar').forEach(s=>s.innerHTML=SB);

// ---- OYNATICI ----
window.LingoriaReel = {
  play: function(cfg){
    const beats   = cfg.beats;
    const screens = [...document.querySelectorAll('.scr')];
    const headline= document.getElementById('headline');
    const progress= document.getElementById('progress');
    const playBtn = document.getElementById('playBtn');
    const badge   = document.getElementById('reelBadge');
    if(cfg.title) badge.textContent = cfg.title;
    const TOTAL = beats.reduce((a,b)=>a+b.d,0);
    let i=-1, playing=true, timer=null, prevS=null;

    function show(n){
      i=n; const b=beats[n];
      if(String(b.s)!==prevS){
        screens.forEach(s=>s.classList.toggle('active', s.dataset.s===String(b.s)));
        prevS=String(b.s);
      }
      headline.textContent=b.h;
      headline.classList.remove('pop'); void headline.offsetWidth; headline.classList.add('pop');
      const before=beats.slice(0,n).reduce((a,x)=>a+x.d,0);
      progress.style.transition='none';
      progress.style.width=(before/TOTAL*100)+'%';
      void progress.offsetWidth;
      if(playing){
        progress.style.transition='width '+b.d+'ms linear';
        progress.style.width=((before+b.d)/TOTAL*100)+'%';
      }
    }
    function tick(){
      clearTimeout(timer);
      if(!playing) return;
      timer=setTimeout(()=>{
        let n=(i+1)%beats.length;
        if(n===0) prevS=null;     // döngü başında ekran animasyonu yeniden oynasın
        show(n); tick();
      }, beats[i].d);
    }
    function start(){ prevS=null; show(0); tick(); }
    function setPlaying(p){
      playing=p;
      playBtn.textContent = p ? '⏸ Durdur' : '▶ Oynat';
      if(p) tick();
      else{ clearTimeout(timer);
        const w=getComputedStyle(progress).width;
        progress.style.transition='none'; progress.style.width=w; }
    }

    document.getElementById('controls').addEventListener('click',e=>{
      const a=e.target.dataset.act;
      if(a==='play')    setPlaying(!playing);
      if(a==='restart'){ setPlaying(true); start(); }
      if(a==='rec')      document.body.classList.toggle('recording');
    });
    document.addEventListener('keydown',e=>{
      if(e.code==='Space'){ e.preventDefault(); setPlaying(!playing); }
      if(e.key==='r'||e.key==='R'){ setPlaying(true); start(); }
      if(e.key==='h'||e.key==='H'){ document.body.classList.toggle('recording'); }
      if(e.key==='t'||e.key==='T'){ document.body.classList.toggle('notext'); }
    });
    let idle;
    function wake(){ document.body.classList.remove('idle');
      clearTimeout(idle); idle=setTimeout(()=>document.body.classList.add('idle'),2600); }
    document.addEventListener('mousemove',wake); wake();

    start();
  }
};
})();
