/**
 * 통합 공통 자바스크립트 모듈
 */

// 1. 클립보드 복사 유틸리티 (Contact 페이지 등에서 사용)
function copyToClipboard(text) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    // 토스트 알림 메시지 표시
    const toast = document.getElementById('toast-message');
    const toastText = document.getElementById('toast-text');
    if (toast && toastText) {
        toastText.innerText = `[${text}] 클립보드에 복사되었습니다.`;
        toast.classList.remove('hidden');
        toast.classList.add('flex');

        setTimeout(() => {
            toast.classList.remove('flex');
            toast.classList.add('hidden');
        }, 3000);
    }
}

// 2. 모바일 메뉴 토글 로직
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// 3. 비동기 컴포넌트 로더 및 인터랙션 초기화
async function loadComponents() {
    const headerHolder = document.getElementById('header-placeholder');
    const footerHolder = document.getElementById('footer-placeholder');
    
    const promises = [];
    
    if (headerHolder) {
        promises.push(
            fetch('components/header.html')
                .then(response => {
                    if (!response.ok) throw new Error('Header load failed');
                    return response.text();
                })
                .then(html => {
                    headerHolder.innerHTML = html;
                })
        );
    }
    
    if (footerHolder) {
        promises.push(
            fetch('components/footer.html')
                .then(response => {
                    if (!response.ok) throw new Error('Footer load failed');
                    return response.text();
                })
                .then(html => {
                    footerHolder.innerHTML = html;
                })
        );
    }
    
    try {
        // 헤더와 푸터 템플릿이 완전히 로딩될 때까지 대기
        await Promise.all(promises);
        
        // 컴포넌트 로딩 완료 후 인터랙션 바인딩 실행
        initInteractions();
    } catch (error) {
        console.error('컴포넌트를 불러오는 중 오류가 발생했습니다:', error);
    }
}

// 4. 컴포넌트 로딩 완료 후 실행될 이벤트 바인딩 및 스타일 설정
function initInteractions() {
    // 모바일 메뉴 버튼 리스너 바인딩
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    // 스크롤 진행률 표시 바 제어
    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById("scroll-progress-bar");
        if (progressBar) {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressBar.style.width = scrolled + "%";
        }
    });

    // 현재 활성화된 페이지 링크 강조 표시 (Active State)
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
            if (currentPath.includes(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html')))) {
                if (!link.classList.contains('bg-slate-800')) {
                    link.classList.remove('text-slate-800');
                    link.classList.add('text-butter-600', 'font-bold');
                }
            }
        }
    });
}

// DOM이 완전히 로드되면 컴포넌트 호출 시작
document.addEventListener('DOMContentLoaded', loadComponents);