// ===== 예식 정보 =====
// 날짜를 바꾸고 싶으면 여기만 고치면 달력과 D-day가 같이 바뀌어요.
// 주의: JS의 월(month)은 0부터 시작해요. 4월 = 3
const WEDDING = new Date(2027, 3, 17, 13, 0);

// ===== 달력 그리기 =====
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const year = WEDDING.getFullYear();
  const month = WEDDING.getMonth();

  // 요일 머리글
  ["일", "월", "화", "수", "목", "금", "토"].forEach((name, i) => {
    const cell = document.createElement("div");
    cell.className = "calendar__head" + (i === 0 ? " calendar__sun" : "");
    cell.textContent = name;
    calendar.appendChild(cell);
  });

  const firstDay = new Date(year, month, 1).getDay();       // 1일이 무슨 요일인지 (0=일)
  const lastDate = new Date(year, month + 1, 0).getDate();  // 그 달의 마지막 날짜

  // 1일 앞의 빈칸
  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  // 날짜 칸
  for (let date = 1; date <= lastDate; date++) {
    const cell = document.createElement("div");
    cell.className = "calendar__day";
    cell.textContent = date;

    if ((firstDay + date - 1) % 7 === 0) cell.classList.add("calendar__sun");
    if (date === WEDDING.getDate()) cell.classList.add("calendar__day--wedding");

    calendar.appendChild(cell);
  }
}

// ===== D-day 계산 =====
function renderDday() {
  const dday = document.getElementById("dday");

  // 시간은 빼고 '날짜'만 비교해야 하루 오차가 안 생겨요
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(WEDDING);
  target.setHours(0, 0, 0, 0);

  const ONE_DAY = 1000 * 60 * 60 * 24;
  const diff = Math.round((target - today) / ONE_DAY);

  if (diff > 0) {
    dday.innerHTML = `민준 ♥ 서연의 결혼식이 <strong>${diff}일</strong> 남았습니다`;
  } else if (diff === 0) {
    dday.innerHTML = `<strong>오늘</strong>, 저희 결혼합니다`;
  } else {
    dday.innerHTML = `함께한 지 <strong>${-diff}일</strong>째입니다`;
  }
}

// ===== 갤러리 사진 목록 =====
// 사진을 바꾸거나 추가하려면 images/gallery 폴더에 넣고 여기 한 줄만 추가하면 돼요.
const GALLERY = [
  { src: "images/gallery/photo1.jpg", alt: "웨딩 사진 1" },
  { src: "images/gallery/photo2.jpg", alt: "웨딩 사진 2" },
  { src: "images/gallery/photo3.jpg", alt: "웨딩 사진 3" },
  { src: "images/gallery/photo4.jpg", alt: "웨딩 사진 4" },
  { src: "images/gallery/photo5.jpg", alt: "웨딩 사진 5" },
  { src: "images/gallery/photo6.jpg", alt: "웨딩 사진 6" },
];

// ===== 갤러리 그리기 =====
function renderGallery() {
  const track = document.getElementById("galleryTrack");
  const dots = document.getElementById("galleryDots");

  GALLERY.forEach((photo, index) => {
    // 사진 한 장 = 누를 수 있는 버튼
    const slide = document.createElement("button");
    slide.className = "gallery__slide";
    slide.setAttribute("aria-label", `${photo.alt} 크게 보기`);
    slide.innerHTML = `<img src="${photo.src}" alt="${photo.alt}" loading="lazy">`;
    slide.addEventListener("click", () => openLightbox(index));
    track.appendChild(slide);

    // 아래 점 하나
    const dot = document.createElement("button");
    dot.className = "gallery__dot";
    dot.setAttribute("aria-label", `${index + 1}번째 사진으로 이동`);
    dot.addEventListener("click", () => {
      slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
    dots.appendChild(dot);
  });

  // 스크롤할 때마다 지금 몇 번째 사진인지 계산해서 점 색 바꾸기
  const updateDots = () => {
    const slideWidth = track.firstElementChild.offsetWidth + 12; // 12 = CSS의 gap
    const current = Math.round(track.scrollLeft / slideWidth);
    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
    });
  };
  track.addEventListener("scroll", updateDots);
  updateDots();
}

// ===== 사진 크게 보기 (라이트박스) =====
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbCount = document.getElementById("lbCount");
let currentIndex = 0;

function showPhoto(index) {
  // 마지막 다음은 처음으로, 처음 이전은 마지막으로 (순환)
  currentIndex = (index + GALLERY.length) % GALLERY.length;
  lbImage.src = GALLERY[currentIndex].src;
  lbImage.alt = GALLERY[currentIndex].alt;
  lbCount.textContent = `${currentIndex + 1} / ${GALLERY.length}`;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden"; // 뒤에 있는 페이지가 스크롤되지 않게
  document.getElementById("lbClose").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => showPhoto(currentIndex - 1));
document.getElementById("lbNext").addEventListener("click", () => showPhoto(currentIndex + 1));

// 사진 바깥 어두운 부분을 누르면 닫기
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// PC 키보드: ← → 로 넘기고 Esc로 닫기
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPhoto(currentIndex - 1);
  if (e.key === "ArrowRight") showPhoto(currentIndex + 1);
});

// 모바일: 손가락을 좌우로 밀어서 넘기기
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});
lightbox.addEventListener("touchend", (e) => {
  const moved = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(moved) < 50) return;          // 50px 미만은 실수로 본다
  showPhoto(moved < 0 ? currentIndex + 1 : currentIndex - 1);
});

renderCalendar();
renderDday();
renderGallery();
