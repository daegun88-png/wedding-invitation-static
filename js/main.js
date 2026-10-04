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

renderCalendar();
renderDday();
