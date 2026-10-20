(() => {
  const DATA = [
    {img:'slide01.png', title:'GENESIS G90', sub:'Flagship Luxury Sedan', price:'₩ 98,000,000~', specs:[['전장','5,275 mm'],['전폭','1,930 mm'],['승차정원','5명'],['구동방식','AWD'],['엔진','3.5T 가솔린'],['최고출력','380 PS']]},
    {img:'slide02.png', title:'GENESIS GV80', sub:'Luxury SUV', price:'₩ 72,000,000~', specs:[['전장','4,940 mm'],['전폭','1,975 mm'],['승차정원','5~7명'],['구동방식','AWD'],['엔진','2.5T 가솔린'],['최고출력','304 PS']]},
    {img:'slide03.png', title:'GENESIS GV80', sub:'Signature Presence', price:'₩ 72,000,000~', specs:[['전장','4,940 mm'],['전폭','1,975 mm'],['승차정원','5~7명'],['구동방식','AWD'],['엔진','3.5T 가솔린'],['최고출력','380 PS']]},
    {img:'slide04.png', title:'GENESIS INTERIOR', sub:'Athletic Elegance Inside', price:'₩ 85,000,000~', specs:[['디스플레이','파노라믹 와이드'],['오디오','프리미엄 사운드'],['시트','퀼팅 가죽'],['무드','앰비언트 라이트'],['콘솔','전자식 다이얼'],['편의','첨단 운전자 보조']]},
    {img:'slide05.png', title:'GENESIS G80', sub:'Road Performance', price:'₩ 59,000,000~', specs:[['전장','5,005 mm'],['전폭','1,925 mm'],['승차정원','5명'],['구동방식','RWD / AWD'],['엔진','2.5T 가솔린'],['최고출력','304 PS']]},
    {img:'slide06.jpg', title:'GENESIS GV70', sub:'Urban Luxury SUV', price:'₩ 54,000,000~', specs:[['전장','4,715 mm'],['전폭','1,910 mm'],['승차정원','5명'],['구동방식','RWD / AWD'],['엔진','2.5T 가솔린'],['최고출력','304 PS']]},
    {img:'slide07.jpg', title:'GENESIS GV70', sub:'Dynamic Design', price:'₩ 54,000,000~', specs:[['전장','4,715 mm'],['전폭','1,910 mm'],['휠','19~21 inch'],['구동방식','AWD'],['엔진','3.5T 가솔린'],['최고출력','380 PS']]},
    {img:'slide08.jpg', title:'GENESIS G80', sub:'Grand Touring Sedan', price:'₩ 59,000,000~', specs:[['전장','5,005 mm'],['전폭','1,925 mm'],['승차정원','5명'],['구동방식','RWD / AWD'],['엔진','3.5T 가솔린'],['최고출력','380 PS']]}
  ];

  const params = new URLSearchParams(location.search);
  const idx = Math.min(Math.max((Number(params.get('slide')) || 1) - 1, 0), DATA.length - 1);
  const item = DATA[idx];

  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('#heroBg');
  const parallaxImage = document.querySelector('#parallaxImage');
  const title = document.querySelector('#modelTitle');
  const sub = document.querySelector('#modelSub');
  const price = document.querySelector('#modelPrice');
  const specGrid = document.querySelector('#specGrid');
  const goTop = document.querySelector('#goTop');

  heroBg.style.backgroundImage = `url('./images/${item.img}')`;
  parallaxImage.style.backgroundImage = `url('./images/${item.img}')`;
  title.textContent = item.title;
  sub.textContent = item.sub;
  price.textContent = item.price;
  specGrid.innerHTML = item.specs.map(([k,v]) => `<div class="spec"><span>${k}</span><strong>${v}</strong></div>`).join('');

  requestAnimationFrame(() => hero.classList.add('loaded'));

  // 스크롤 등장 애니메이션
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('on');
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // 패럴럭스: 스크롤 위치에 따라 이미지가 천천히 이동
  const parallaxSection = document.querySelector('#parallaxSection');
  let ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const r = parallaxSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - r.top) / (vh + r.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const offset = (clamped - .5) * 90;
      parallaxImage.style.transform = `translate3d(0,${offset}px,0) scale(1.08)`;
      goTop.classList.toggle('show', window.scrollY > vh * .7);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  goTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();
