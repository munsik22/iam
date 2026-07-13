/**
 * 문식이 일상 갤러리 슬라이더 및 터치 제스처 스크립트
 */
document.addEventListener("DOMContentLoaded", () => {
  let currentMunsikSlide = 0;
  const totalMunsikSlides = 3;
  const carouselTrack = document.getElementById("munsik-carousel");
  const dotsContainer = document.getElementById("carousel-dots");

  if (!carouselTrack) return; // 캐러셀이 없는 페이지에서는 작동 중단

  function updateSlidePosition() {
    carouselTrack.style.transform = `translateX(-${currentMunsikSlide * 100}%)`;

    // 인디케이터 도트(Dots) 활성화 상태 동적 변경
    if (dotsContainer) {
      const dots = dotsContainer.getElementsByTagName("button");
      for (let i = 0; i < dots.length; i++) {
        if (i === currentMunsikSlide) {
          dots[i].classList.remove("bg-slate-300", "hover:bg-slate-400");
          dots[i].classList.add("bg-butter-500");
        } else {
          dots[i].classList.remove("bg-butter-500");
          dots[i].classList.add("bg-slate-300", "hover:bg-slate-400");
        }
      }
    }
  }

  window.nextSlide = function () {
    currentMunsikSlide = (currentMunsikSlide + 1) % totalMunsikSlides;
    updateSlidePosition();
  };

  window.prevSlide = function () {
    currentMunsikSlide =
      (currentMunsikSlide - 1 + totalMunsikSlides) % totalMunsikSlides;
    updateSlidePosition();
  };

  window.setSlide = function (index) {
    currentMunsikSlide = index;
    updateSlidePosition();
  };

  // 모바일 터치 스와이프 제스처 이벤트 리스너 추가
  let touchStartX = 0;
  let touchEndX = 0;

  const carouselWindow = carouselTrack.parentElement;
  if (carouselWindow) {
    carouselWindow.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    carouselWindow.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true },
    );
  }

  function handleSwipe() {
    const threshold = 40; // 스와이프 인식 임계치 설정 (픽셀)
    if (touchStartX - touchEndX > threshold) {
      nextSlide(); // 왼쪽으로 스와이프 -> 다음 이미지
    } else if (touchEndX - touchStartX > threshold) {
      prevSlide(); // 오른쪽으로 스와이프 -> 이전 이미지
    }
  }
});
