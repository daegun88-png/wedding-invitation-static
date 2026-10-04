// ===== Firebase 공통 설정 =====
// 방명록(guestbook.js)과 RSVP(rsvp.js)가 이 파일 하나를 같이 써요.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⬇️ guestbook.js에 넣었던 내 설정값을 여기로 옮겨주세요
const firebaseConfig = {
  apiKey: "AIzaSyDSyw_Rab7K07ijErmM9o00j1y9uYMR7SA",
  authDomain: "toyprj-32214.firebaseapp.com",
  projectId: "toyprj-32214",
  storageBucket: "toyprj-32214.firebasestorage.app",
  messagingSenderId: "8193064190",
  appId: "1:8193064190:web:697b2453dce475cf0379af"
};

// 다른 파일에서 import { db } 로 가져다 써요
export const db = getFirestore(initializeApp(firebaseConfig));
export const isConfigured = !firebaseConfig.projectId.startsWith("여기에");
