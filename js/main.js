/**
 * 공통 자바스크립트 모듈
 */

// 1. 클립보드 복사 유틸리티
function copyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  // 토스트 알림 메시지 표시
  const toast = document.getElementById("toast-message");
  const toastText = document.getElementById("toast-text");
  if (toast && toastText) {
    toastText.innerText = `[${text}] 클립보드에 복사되었습니다.`;
    toast.classList.remove("hidden");
    toast.classList.add("flex");

    setTimeout(() => {
      toast.classList.remove("flex");
      toast.classList.add("hidden");
    }, 3000);
  }
}

// 2. 모바일 메뉴 토글 로직
function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) {
    menu.classList.toggle("hidden");
  }
}

// 네비게이션 활성화 표시 및 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  // 모바일 메뉴 버튼 리스너 바인딩
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMenu);
  }

  // 3. 스크롤 진행률 표시 바 제어
  window.addEventListener("scroll", () => {
    const progressBar = document.getElementById("scroll-progress-bar");
    if (progressBar) {
      const winScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + "%";
    }
  });

  // 현재 활성화된 페이지 링크 강조 표시 (Active State)
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#")) {
      // 경로 비교를 통한 액티브 클래스 부여
      if (
        currentPath.includes(href) ||
        (href === "index.html" &&
          (currentPath === "/" || currentPath.endsWith("index.html")))
      ) {
        if (link.classList.contains("bg-navy-800")) {
          // 버튼 스타일은 스킵하거나 다른 포인트를 줌
        } else {
          link.classList.remove("text-navy-800");
          link.classList.add("text-butter-600", "font-bold");
        }
      }
    }
  });
});
