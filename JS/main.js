/* ============================================
   COORDI ARCHIVE — main.js
   인터랙션 / UI 동작 처리
   ============================================ */

/* ── 스크롤 감지 → 헤더 그림자 ── */
const header = document.querySelector('.header')

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 1px 20px rgba(0,0,0,0.06)'
  } else {
    header.style.boxShadow = 'none'
  }
})


/* ── 좋아요 (Like) 버튼 토글 ── */
const likeBtn   = document.getElementById('likeBtn')
const likeCount = document.getElementById('likeCount')

if (likeBtn && likeCount) {
  let liked = false
  let count = parseInt(likeCount.textContent, 10)

  likeBtn.addEventListener('click', () => {
    liked = !liked
    count = liked ? count + 1 : count - 1
    likeCount.textContent = count
    likeBtn.classList.toggle('liked', liked)
    likeBtn.firstChild.textContent = liked ? '♥ ' : '♡ '
  })
}


/* ── 저장 (Save) 버튼 토글 ── */
const saveBtn = document.getElementById('saveBtn')

if (saveBtn) {
  let saved = false

  saveBtn.addEventListener('click', () => {
    saved = !saved
    saveBtn.classList.toggle('saved', saved)
    saveBtn.textContent = saved ? '■ Saved' : '□ Save'
  })
}


/* ── 카드 IntersectionObserver — 스크롤 페이드인 ── */
const cards = document.querySelectorAll('.card, .item-row')

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running'
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1 }
)

cards.forEach((card) => {
  card.style.animationPlayState = 'paused'
  observer.observe(card)
})


/* ── 네비게이션 액티브 상태 — 스크롤 위치 기반 ── */
const sections  = document.querySelectorAll('section[id]')
const navLinks  = document.querySelectorAll('.nav-link')

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'))
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`)
        if (active) active.classList.add('active')
      }
    })
  },
  { threshold: 0.4 }
)

sections.forEach((section) => sectionObserver.observe(section))


/* ── 이미지 지연 로딩 (Lazy Load) ── */
const lazyImgs = document.querySelectorAll('img[data-src]')

if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute('data-src')
        imgObserver.unobserve(img)
      }
    })
  })
  lazyImgs.forEach((img) => imgObserver.observe(img))
} else {
  // 폴백: IntersectionObserver 미지원 시 즉시 로드
  lazyImgs.forEach((img) => {
    img.src = img.dataset.src
  })
}


/* ── 부드러운 앵커 스크롤 ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'))
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})
