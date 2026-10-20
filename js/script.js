(() => {
  const slides = [
    {img:'slide01.png', title:'GENESIS G90', sub:'Flagship Luxury Sedan'},
    {img:'slide02.png', title:'GENESIS GV80', sub:'Luxury SUV'},
    {img:'slide03.png', title:'GENESIS GV80', sub:'Signature Presence'},
    {img:'slide04.png', title:'GENESIS INTERIOR', sub:'Athletic Elegance Inside'},
    {img:'slide05.png', title:'GENESIS G80', sub:'Road Performance'},
    {img:'slide06.jpg', title:'GENESIS GV70', sub:'Urban Luxury SUV'},
    {img:'slide07.jpg', title:'GENESIS GV70', sub:'Dynamic Design'},
    {img:'slide08.jpg', title:'GENESIS G80', sub:'Grand Touring Sedan'}
  ];

  const track = document.querySelector('#track');
  const prevBtn = document.querySelector('#prevBtn');
  const nextBtn = document.querySelector('#nextBtn');
  const currentEl = document.querySelector('#current');
  const progressBar = document.querySelector('#progressBar');
  const carousel = document.querySelector('#carousel');

  const slideHTML = (s, realIndex) => `
    <article class="slide" data-real-index="${realIndex}" tabindex="0" role="link" aria-label="${s.title} 상세페이지 열기">
      <img src="./images/${s.img}" alt="${s.title}" draggable="false">
      <div class="slide-copy">
        <div class="eyebrow">GENESIS</div>
        <h2>${s.title}</h2>
        <p>${s.sub}</p>
      </div>
    </article>`;

  track.innerHTML =
    slideHTML(slides[slides.length - 1], slides.length - 1) +
    slides.map((s, i) => slideHTML(s, i)).join('') +
    slideHTML(slides[0], 0);

  const items = [...track.children];
  let index = 1;
  let timer = null;
  let animating = false;
  let pointerDown = false;
  let startX = 0;
  let currentX = 0;
  let dragged = false;
  let pressedSlide = null;

  const AUTO_DELAY = 4000;
  const DRAG_THRESHOLD = 55;
  const CLICK_THRESHOLD = 10;

  const realIndex = () => (index - 1 + slides.length) % slides.length;
  const xForIndex = () => -index * window.innerWidth;

  function openLanding(slide){
    if(!slide) return;
    const i = Number(slide.dataset.realIndex);
    if(Number.isNaN(i)) return;
    window.open(`./landing.html?slide=${i + 1}`, '_blank', 'noopener,noreferrer');
  }

  function setTransform(px, animate = true){
    track.style.transition = animate ? 'transform .5s cubic-bezier(.22,.61,.36,1)' : 'none';
    track.style.transform = `translate3d(${px}px,0,0)`;
  }

  function updateCounter(){
    currentEl.textContent = String(realIndex() + 1).padStart(2, '0');
  }

  function restartProgress(){
    progressBar.classList.remove('running');
    void progressBar.offsetWidth;
    progressBar.classList.add('running');
  }

  function stopAuto(){
    clearTimeout(timer);
    timer = null;
    progressBar.classList.remove('running');
  }

  function startAuto(){
    stopAuto();
    restartProgress();
    timer = setTimeout(() => goTo(index + 1), AUTO_DELAY);
  }

  function goTo(nextIndex){
    if(animating) return;
    animating = true;
    index = nextIndex;
    setTransform(xForIndex(), true);
    updateCounter();
    stopAuto();
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  track.addEventListener('transitionend', () => {
    if(index === items.length - 1){
      index = 1;
      setTransform(xForIndex(), false);
    } else if(index === 0){
      index = items.length - 2;
      setTransform(xForIndex(), false);
    }
    animating = false;
    updateCounter();
    startAuto();
  });

  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    stopAuto();
    next();
  });

  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    stopAuto();
    prev();
  });

  // 데스크탑 마우스 드래그 + 모바일 터치 스와이프
  carousel.addEventListener('pointerdown', e => {
    if(e.target.closest('.nav')) return;

    pressedSlide = e.target.closest('.slide');
    if(!pressedSlide) return;

    pointerDown = true;
    dragged = false;
    startX = e.clientX;
    currentX = startX;
    stopAuto();

    try { carousel.setPointerCapture(e.pointerId); } catch (_) {}
    track.style.transition = 'none';
  });

  carousel.addEventListener('pointermove', e => {
    if(!pointerDown) return;

    currentX = e.clientX;
    const dx = currentX - startX;
    if(Math.abs(dx) > CLICK_THRESHOLD) dragged = true;
    setTransform(xForIndex() + dx, false);
  });

  function endPointer(e){
    if(!pointerDown) return;

    pointerDown = false;
    const dx = currentX - startX;
    const slideToOpen = pressedSlide;
    pressedSlide = null;

    try { carousel.releasePointerCapture(e.pointerId); } catch (_) {}

    if(Math.abs(dx) >= DRAG_THRESHOLD){
      dragged = true;
      animating = false;
      dx < 0 ? next() : prev();
      return;
    }

    // 이동 거리가 짧으면 '클릭/탭'으로 판단하여 즉시 랜딩페이지 이동
    if(Math.abs(dx) <= CLICK_THRESHOLD && !dragged){
      openLanding(slideToOpen);
      return;
    }

    // 임계값 이하의 짧은 드래그는 현재 슬라이드 위치로 복귀
    setTransform(xForIndex(), true);
    setTimeout(() => {
      animating = false;
      startAuto();
    }, 520);
  }

  carousel.addEventListener('pointerup', endPointer);
  carousel.addEventListener('pointercancel', e => {
    if(!pointerDown) return;
    pointerDown = false;
    pressedSlide = null;
    try { carousel.releasePointerCapture(e.pointerId); } catch (_) {}
    setTransform(xForIndex(), true);
    setTimeout(() => {
      animating = false;
      startAuto();
    }, 520);
  });

  // 키보드 접근성
  track.addEventListener('keydown', e => {
    const slide = e.target.closest('.slide');
    if(!slide) return;

    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      openLanding(slide);
    }
  });

  window.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  window.addEventListener('resize', () => setTransform(xForIndex(), false));

  setTransform(xForIndex(), false);
  updateCounter();
  startAuto();
})();
