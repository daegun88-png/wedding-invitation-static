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

// ===== 예식장 정보 =====
// 좌표(위도 lat, 경도 lng)는 카카오맵에서 장소를 우클릭 → '좌표 확인' 등으로 찾을 수 있어요.
const VENUE = {
  name: "라온 가든홀",
  address: "서울특별시 강남구 테헤란로 123",
  lat: 37.4995,
  lng: 127.0287,
};

// 카카오 디벨로퍼스에서 발급받은 JavaScript 키
// (브라우저에 노출되는 키라 공개돼도 괜찮고, 대신 등록한 도메인에서만 동작해요)
const KAKAO_JS_KEY = "여기에_JavaScript_키를_넣으세요";

// ===== 카카오 지도 =====
function loadKakaoMap() {
  const mapBox = document.getElementById("map");
  const showFallback = () => {
    mapBox.innerHTML =
      '<p class="location__map-fallback">지도를 불러오지 못했어요.<br>아래 버튼으로 지도 앱에서 확인해 주세요.</p>';
  };

  // 지도 SDK 스크립트를 JS에서 직접 불러와요 (키를 한 곳에서 관리하려고)
  const script = document.createElement("script");
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
  script.onerror = showFallback;

  script.onload = () => {
    // autoload=false로 불러왔으니, 준비가 끝나면 실행할 함수를 넘겨줘요
    kakao.maps.load(() => {
      mapBox.innerHTML = "";
      const position = new kakao.maps.LatLng(VENUE.lat, VENUE.lng);

      const map = new kakao.maps.Map(mapBox, {
        center: position,
        level: 3, // 숫자가 작을수록 확대
      });

      // 청첩장을 스크롤하다 지도에 손가락이 걸려 멈추지 않도록 고정
      map.setDraggable(false);
      map.setZoomable(false);

      new kakao.maps.Marker({ map, position });
    });
  };

  document.head.appendChild(script);
}

// ===== 지도 앱 링크 =====
function setMapLinks() {
  const { name, lat, lng, address } = VENUE;
  document.getElementById("kakaoMapLink").href =
    `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`;
  document.getElementById("naverMapLink").href =
    `https://map.naver.com/p/search/${encodeURIComponent(address)}`;
}

// ===== 짧은 알림 =====
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2000);
}

// ===== 복사하기 (주소·계좌 공통) =====
// 최신 방식(navigator.clipboard)을 먼저 시도하고,
// 안 되는 환경(오래된 브라우저, 일부 인앱 브라우저)에서는 옛날 방식으로 한 번 더 시도해요.
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    const ok = document.execCommand("copy");
    temp.remove();
    return ok;
  }
}

// ===== 주소 복사 =====
document.getElementById("copyAddress").addEventListener("click", async () => {
  const ok = await copyText(VENUE.address);
  showToast(ok ? "주소를 복사했어요" : "복사하지 못했어요. 주소를 길게 눌러 복사해 주세요");
});

// ===== 계좌 정보 =====
// 실제 계좌로 바꿀 땐 저장소 공개 여부를 꼭 다시 확인하세요.
const ACCOUNTS = [
  {
    side: "신랑측",
    list: [
      { who: "신랑", name: "김민준", bank: "하나은행", number: "000-000000-00000" },
      { who: "아버지", name: "김정호", bank: "국민은행", number: "000000-00-000000" },
      { who: "어머니", name: "박미경", bank: "신한은행", number: "000-000-000000" },
    ],
  },
  {
    side: "신부측",
    list: [
      { who: "신부", name: "이서연", bank: "카카오뱅크", number: "0000-00-0000000" },
      { who: "아버지", name: "이성훈", bank: "우리은행", number: "0000-000-000000" },
      { who: "어머니", name: "최윤희", bank: "농협은행", number: "000-0000-0000-00" },
    ],
  },
];

// ===== 계좌 목록 그리기 =====
function renderAccounts() {
  const container = document.getElementById("accountGroups");

  ACCOUNTS.forEach((group) => {
    // <details>는 JS 없이도 누르면 펼쳐지고 접히는 태그예요
    const details = document.createElement("details");
    details.className = "account__group";

    const items = group.list
      .map(
        (acc) => `
        <div class="account__item">
          <div>
            <span class="account__who">${acc.who}</span>
            <span class="account__name">${acc.name}</span>
            <div class="account__number">${acc.bank} ${acc.number}</div>
          </div>
          <button class="account__copy" data-copy="${acc.bank} ${acc.number}">복사</button>
        </div>`
      )
      .join("");

    details.innerHTML = `<summary>${group.side}에 마음 전하기</summary>${items}`;
    container.appendChild(details);
  });

  // 복사 버튼마다 이벤트를 다는 대신, 부모 한 곳에서 클릭을 받아 처리 (이벤트 위임)
  container.addEventListener("click", async (e) => {
    const button = e.target.closest(".account__copy");
    if (!button) return;
    const ok = await copyText(button.dataset.copy);
    showToast(ok ? "계좌번호를 복사했어요" : "복사하지 못했어요. 길게 눌러 복사해 주세요");
  });
}

renderCalendar();
renderDday();
renderGallery();
setMapLinks();
loadKakaoMap();
renderAccounts();
