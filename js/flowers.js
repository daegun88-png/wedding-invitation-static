import { db, isConfigured } from "./firebase.js";
import {
  doc,
  setDoc,
  onSnapshot,
  increment,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 숫자 하나만 들어있는 문서: cheers/flowers → { count: 123 }
const flowersRef = doc(db, "cheers", "flowers");

// =====================================================
//  데이터 접근 함수
// =====================================================

// 서버의 숫자가 바뀔 때마다 callback을 불러줘요 (실시간 구독)
function subscribeFlowers(callback) {
  return onSnapshot(flowersRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.data().count : 0);
  });
}

// 숫자를 n만큼 올려요.
// increment(n)은 "지금 값 + n"을 서버가 직접 계산해서,
// 여러 명이 동시에 눌러도 숫자가 덮어써지지 않아요.
// merge: true 덕분에 문서가 아직 없으면 새로 만들어요.
async function addFlowers(n) {
  await setDoc(flowersRef, { count: increment(n) }, { merge: true });
}

// ===== 화면 요소 =====
const button = document.getElementById("flowerButton");
const stage = document.getElementById("flowerStage");
const countText = document.getElementById("flowerCount");

const MAX_PER_SEND = 20;   // 보안 규칙과 같은 숫자 (한 번에 최대 20)
const SEND_DELAY = 1000;   // 1초 동안 모았다가 한꺼번에 보내기

let serverCount = null;    // 서버에서 받은 숫자 (아직 모르면 null)
let pending = 0;           // 눌렀지만 아직 안 보낸 횟수
let sendTimer = null;

// 움직임 줄이기 설정 사용자는 꽃잎 효과 생략
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PETAL_COLORS = ["var(--blush)", "var(--rose)", "var(--lilac)", "var(--sage)"];

// ===== 숫자 표시 =====
function renderCount() {
  if (serverCount === null) return;
  const total = serverCount + pending;   // 서버 숫자 + 내가 방금 누른 것 (바로 반영되는 느낌)

  if (total === 0) {
    countText.textContent = "첫 번째 꽃을 보내주세요";
    return;
  }
  countText.innerHTML =
    `지금까지 <strong class="bump">${total.toLocaleString("ko-KR")}송이</strong>의 축하가 도착했어요`;
}

// ===== 꽃잎 터뜨리기 =====
function burstPetals() {
  if (reduceMotion) return;

  for (let i = 0; i < 6; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";

    // 사방으로 무작위로 퍼지게: 각도와 거리를 랜덤으로
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 50;
    petal.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    petal.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    petal.style.setProperty("--r", `${Math.random() * 360}deg`);
    petal.style.setProperty("--petal-color", PETAL_COLORS[i % PETAL_COLORS.length]);

    // 애니메이션이 끝나면 지워서 화면에 쌓이지 않게
    petal.addEventListener("animationend", () => petal.remove());
    stage.appendChild(petal);
  }
}

// ===== 모아둔 클릭 보내기 =====
async function flush() {
  sendTimer = null;
  if (pending === 0) return;

  const n = Math.min(pending, MAX_PER_SEND);
  pending -= n;

  try {
    await addFlowers(n);
  } catch (error) {
    console.error(error);
    showToastSafe("꽃을 보내지 못했어요. 잠시 후 다시 눌러주세요");
  }

  // 20개 넘게 모였으면 남은 건 다음 차례에
  if (pending > 0) sendTimer = setTimeout(flush, SEND_DELAY);
}

function showToastSafe(message) {
  if (window.showToast) window.showToast(message);
}

// ===== 클릭 =====
button.addEventListener("click", () => {
  pending += 1;
  renderCount();
  burstPetals();

  // 타이머가 없을 때만 새로 예약 (연타해도 1초에 한 번만 전송)
  if (!sendTimer) sendTimer = setTimeout(flush, SEND_DELAY);
});

// 창을 닫거나 다른 앱으로 넘어갈 때 아직 안 보낸 게 있으면 바로 보내기
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && pending > 0) {
    clearTimeout(sendTimer);
    flush();
  }
});

// ===== 시작 =====
if (!isConfigured) {
  countText.textContent = "Firebase 설정값을 firebase.js에 넣어주세요";
  button.disabled = true;
} else {
  subscribeFlowers((count) => {
    serverCount = count;
    renderCount();
  });
}
