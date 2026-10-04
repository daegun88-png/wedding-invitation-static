// ===== Firebase 불러오기 =====
// 설정은 firebase.js에서 한 번만 하고, 여기선 가져다 쓰기만 해요.
import { db, isConfigured } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const guestbookRef = collection(db, "guestbook");

// =====================================================
//  데이터 접근 함수 (저장소와 대화하는 코드는 여기에만!)
//  JSP 버전에서는 이 두 함수 속만 fetch('/guestbook')로 바꾸면 돼요.
// =====================================================
async function getGuestbook() {
  const q = query(guestbookRef, orderBy("createdAt", "desc"), limit(100));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      message: data.message,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    };
  });
}

async function addGuestbook(name, message) {
  await addDoc(guestbookRef, {
    name,
    message,
    createdAt: serverTimestamp(), // 사용자 컴퓨터 시간이 아니라 서버 시간으로 저장
  });
}

// ===== 화면 요소 =====
const form = document.getElementById("guestbookForm");
const nameInput = document.getElementById("gbName");
const messageInput = document.getElementById("gbMessage");
const counter = document.getElementById("gbCounter");
const submitButton = document.getElementById("gbSubmit");
const list = document.getElementById("guestbookList");
const status = document.getElementById("guestbookStatus");
const moreButton = document.getElementById("guestbookMore");

const PAGE_SIZE = 5;
let entries = [];
let shownCount = PAGE_SIZE;

// ===== 목록 그리기 =====
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function renderList() {
  list.innerHTML = "";

  if (entries.length === 0) {
    status.textContent = "첫 번째 축하 메시지를 남겨주세요";
    moreButton.hidden = true;
    return;
  }
  status.textContent = "";

  entries.slice(0, shownCount).forEach((entry) => {
    const li = document.createElement("li");
    li.className = "guestbook__item";

    // ⚠️ 다른 사람이 쓴 글은 innerHTML 대신 textContent로 넣어요.
    // innerHTML을 쓰면 누군가 <script> 같은 코드를 글로 남겼을 때 그대로 실행돼버려요 (XSS 공격).
    const meta = document.createElement("div");
    meta.className = "guestbook__meta";

    const name = document.createElement("span");
    name.className = "guestbook__name";
    name.textContent = entry.name;

    const date = document.createElement("span");
    date.className = "guestbook__date";
    date.textContent = formatDate(entry.createdAt);

    const message = document.createElement("p");
    message.className = "guestbook__message";
    message.textContent = entry.message;

    meta.append(name, date);
    li.append(meta, message);
    list.appendChild(li);
  });

  moreButton.hidden = shownCount >= entries.length;
}

async function loadGuestbook() {
  try {
    entries = await getGuestbook();
    renderList();
  } catch (error) {
    console.error(error);
    status.textContent = "방명록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요";
  }
}

// ===== 이벤트 =====
messageInput.addEventListener("input", () => {
  counter.textContent = `${messageInput.value.length} / 300`;
});

moreButton.addEventListener("click", () => {
  shownCount += PAGE_SIZE;
  renderList();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 폼 기본 동작(페이지 새로고침) 막기

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) {
    window.showToast("이름과 메시지를 모두 입력해 주세요");
    return;
  }

  submitButton.disabled = true; // 연속 클릭으로 두 번 저장되는 것 방지
  try {
    await addGuestbook(name, message);
    form.reset();
    counter.textContent = "0 / 300";
    window.showToast("축하 메시지를 남겼어요");
    shownCount = PAGE_SIZE;
    await loadGuestbook();
  } catch (error) {
    console.error(error);
    window.showToast("저장하지 못했어요. 잠시 후 다시 시도해 주세요");
  } finally {
    submitButton.disabled = false;
  }
});

// 설정값을 아직 안 넣었으면 하염없이 기다리지 않게 바로 안내
if (!isConfigured) {
  status.textContent = "Firebase 설정값을 firebase.js에 넣어주세요";
  submitButton.disabled = true;
} else {
  loadGuestbook();
}
