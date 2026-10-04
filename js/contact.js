// ===== 연락처 정보 =====
// 실제 번호로 바꿀 땐 저장소 공개 여부를 꼭 다시 확인하세요.
const CONTACTS = [
  {
    side: "신랑측",
    list: [
      { who: "신랑", name: "김민준", phone: "010-0000-0000" },
      { who: "어머니", name: "박미경", phone: "010-0000-0000" },
    ],
  },
  {
    side: "신부측",
    list: [
      { who: "신부", name: "이서연", phone: "010-0000-0000" },
      { who: "아버지", name: "이성훈", phone: "010-0000-0000" },
      { who: "어머니", name: "최윤희", phone: "010-0000-0000" },
    ],
  },
];

// 아이콘 (SVG를 문자열로 들고 있다가 버튼 안에 넣어요)
const ICON_PHONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>`;
const ICON_SMS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>`;

function renderContacts() {
  const container = document.getElementById("contactGroups");

  CONTACTS.forEach((group) => {
    const people = group.list
      .map((person) => {
        // 링크에는 하이픈(-) 없는 숫자만 넣어요: 010-1234-5678 → 01012345678
        const number = person.phone.replace(/[^0-9]/g, "");
        return `
          <div class="contact__person">
            <div>
              <span class="contact__who">${person.who}</span>
              <span class="contact__name">${person.name}</span>
            </div>
            <div class="contact__actions">
              <a class="contact__btn" href="tel:${number}" aria-label="${person.name}에게 전화하기">${ICON_PHONE}</a>
              <a class="contact__btn" href="sms:${number}" aria-label="${person.name}에게 문자 보내기">${ICON_SMS}</a>
            </div>
          </div>`;
      })
      .join("");

    const column = document.createElement("div");
    column.innerHTML = `<p class="contact__side">${group.side}</p>${people}`;
    container.appendChild(column);
  });
}

renderContacts();
