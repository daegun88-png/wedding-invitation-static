// ===== 공유하기 =====
// KAKAO_JS_KEY, copyText, showToast는 main.js에 있는 걸 그대로 가져다 써요.
// (일반 <script>로 불러온 파일끼리는 맨 바깥에 선언한 변수·함수를 공유해요)

// 배포된 청첩장 주소 (공유할 링크)
const SITE_URL = "https://daegun88-png.github.io/wedding-invitation-static/";

// 카카오 SDK 초기화 (한 번만)
if (window.Kakao && !Kakao.isInitialized()) {
  Kakao.init(KAKAO_JS_KEY);
}

// ===== 카카오톡 공유 =====
document.getElementById("shareKakao").addEventListener("click", () => {
  if (!window.Kakao || !Kakao.isInitialized()) {
    showToast("카카오톡 공유를 불러오지 못했어요. 링크 복사를 이용해 주세요");
    return;
  }

  // feed: 이미지 + 제목 + 설명 + 버튼으로 된 카드형 메시지
  Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: "김민준 ♥ 이서연 결혼합니다",
      description: "2027년 4월 17일 토요일 오후 1시\n라온 가든홀 2층 플로라홀",
      imageUrl: SITE_URL + "images/og-image.jpg",
      link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
    },
    buttons: [
      {
        title: "청첩장 보기",
        link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
      },
    ],
  });
});

// ===== 링크 복사 =====
document.getElementById("shareLink").addEventListener("click", async () => {
  const ok = await copyText(SITE_URL);
  showToast(ok ? "청첩장 링크를 복사했어요" : "복사하지 못했어요");
});
