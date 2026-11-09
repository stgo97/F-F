document.addEventListener('DOMContentLoaded', () => {

    const toggle = document.querySelector(
        '.mobile-menu-toggle'
    );

    const drawer = document.querySelector(
        '.mobile-drawer'
    );

    const closeBtn = document.querySelector(
        '.mobile-drawer-close'
    );

    const backdrop = document.querySelector(
        '.mobile-drawer-backdrop'
    );

    if (!toggle || !drawer) return;

    const categories = drawer.querySelectorAll(
        '.mobile-drawer-category'
    );

    function openDrawer() {
        drawer.classList.add('open');
        document.body.classList.add('drawer-open');

        drawer.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', '전체 메뉴 닫기');

        closeBtn.focus();
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        document.body.classList.remove('drawer-open');

        drawer.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '전체 메뉴 열기');

        toggle.focus();
    }

    // 햄버거 버튼
    toggle.addEventListener('click', () => {
        if (drawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    // X 버튼
    closeBtn.addEventListener('click', closeDrawer);

    // 검은 배경 클릭
    backdrop.addEventListener('click', closeDrawer);

    // ESC 키
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' &&
            drawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    // 카테고리 아코디언
    categories.forEach((category) => {

        category.addEventListener('click', () => {

            const item = category.closest(
                '.mobile-drawer-item'
            );

            const isOpen = item.classList.contains(
                'active'
            );

            // 다른 메뉴 닫기
            categories.forEach((btn) => {
                btn.closest('.mobile-drawer-item')
                   .classList.remove('active');

                btn.setAttribute(
                    'aria-expanded', 'false'
                );
            });

            // 선택 메뉴 열기
            if (!isOpen) {
                item.classList.add('active');

                category.setAttribute(
                    'aria-expanded', 'true'
                );
            }
        });
    });

    // 태블릿 이상으로 변경되면 닫기
    window.matchMedia('(min-width: 768px)')
        .addEventListener('change', (e) => {
            if (e.matches &&
                drawer.classList.contains('open')) {
                closeDrawer();
            }
        });
});

$(function () {

    const $arrival = $(".new-arrival");
    const $items = $arrival.find(".accordion-item");
    const $buttons = $arrival.find(
        ".arrival-mobile-nav button"
    );

    // 활성 배너 변경
    function activateArrival(index) {

        if (index < 0 || index >= $items.length) {
            return;
        }

        // 기존 활성 상태 제거
        $items.removeClass("active");
        $buttons.removeClass("active")
                .attr("aria-pressed", "false");

        // 선택한 배너 활성화
        $items.eq(index).addClass("active");

        $buttons.eq(index)
                .addClass("active")
                .attr("aria-pressed", "true");
    }

    // PC: 마우스 호버 시 확장
    $items.on("click", function () {

        if (window.matchMedia(
            "(min-width: 1200px) and (hover: hover)"
        ).matches) {

            const index = $(this).index();
            activateArrival(index);
        }

    });

    // 태블릿: 배너 터치로 활성화
$items.on("click", function (e) {
    if (!window.matchMedia(
        "(min-width: 768px) and (max-width: 1199px)"
    ).matches) return;

    if (!$(this).hasClass("active")) {
        e.preventDefault();
        activateArrival($(this).index());
    }
});

    // 모바일: 하단 번호 버튼 클릭
    $buttons.on("click", function () {

        const index = $(this).index();
        activateArrival(index);

    });

});


/* =========================================
   HERO 자동 슬라이드
========================================= */

$(function () {

    const $hero = $(".hero-visual");
    const $slides = $hero.find(".hero-slide");
    const $menus = $hero.find(".hero-indicator li");

    const slideInterval = 5000;
    let currentIndex = 0;
    let slideTimer = null;

    // 슬라이드 전환
    function showSlide(index) {

        $slides.removeClass("active");
        $slides.eq(index).addClass("active");

        $menus.removeClass("active");
        $menus.find("a").removeAttr("aria-current");

        $menus.eq(index).addClass("active");
        $menus.eq(index)
              .find("a")
              .attr("aria-current", "true");

        currentIndex = index;
    }

    // 다음 슬라이드
    function nextSlide() {
        const nextIndex =
            (currentIndex + 1) % $slides.length;

        showSlide(nextIndex);
    }

    // 자동 재생
    function startSlide() {
        clearInterval(slideTimer);

        slideTimer = setInterval(function () {
            nextSlide();
        }, slideInterval);
    }

    // 메뉴 클릭
    $menus.find("a").on("click", function (e) {
        e.preventDefault();

        const index = $(this).parent().index();

        showSlide(index);
        startSlide();
    });

    // 슬라이드 개수 확인
    if ($slides.length > 1 &&
        $slides.length === $menus.length) {

        showSlide(0);
        startSlide();
    }

});

/* =========================================
   태블릿 검색 패널
========================================= */

document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.header');
    const searchForm = header?.querySelector('.search-form');
    const searchInput = header?.querySelector('.search-input');
    const panel = document.querySelector('.tablet-search-panel');

    if (!header || !searchForm || !searchInput || !panel) {
        return;
    }

    const tabletMedia = window.matchMedia(
        '(min-width: 768px) and (max-width: 1199px)'
    );

    function openTabletSearch() {
        if (!tabletMedia.matches) return;

        header.classList.add('tablet-search-open');
        panel.setAttribute('aria-hidden', 'false');
        searchInput.setAttribute('aria-expanded', 'true');
    }

    function closeTabletSearch() {
        header.classList.remove('tablet-search-open');
        panel.setAttribute('aria-hidden', 'true');
        searchInput.setAttribute('aria-expanded', 'false');
    }

    // 검색창 클릭 시 열기
    searchInput.addEventListener('focus', openTabletSearch);
    searchForm.addEventListener('click', openTabletSearch);

    // 패널 외부 클릭 시 닫기
    document.addEventListener('pointerdown', (event) => {
        if (!header.classList.contains('tablet-search-open')) {
            return;
        }

        if (
            searchForm.contains(event.target) ||
            panel.contains(event.target)
        ) {
            return;
        }

        closeTabletSearch();
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeTabletSearch();
        }
    });

    // 태블릿 영역을 벗어나면 닫기
    tabletMedia.addEventListener('change', (event) => {
        if (!event.matches) {
            closeTabletSearch();
        }
    });

    // 검색어 클릭 시 검색창에 입력
    panel.querySelectorAll('.tablet-popular-list a')
        .forEach((link) => {

            link.addEventListener('click', (event) => {
                event.preventDefault();

                searchInput.value = link.textContent.trim();
                searchInput.focus();
            });
        });
});


/* =========================================
   찜하기 버튼 이미지 변경
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const likeButtons = document.querySelectorAll(".btn-like");

    likeButtons.forEach(function (button) {

        const heartImg = button.querySelector("img");

        if (!heartImg) return;

        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", function (e) {

            e.preventDefault();
            e.stopPropagation();

            const isLiked = button.classList.toggle("liked");

            heartImg.src = isLiked
                ? "images/Heart_icon2.png"
                : "images/Heart_icon1.png";

            button.setAttribute(
                "aria-pressed",
                String(isLiked)
            );

        });

    });

});




/* =========================================
   INFLUENCER 탭 전환
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".influencer");
    if (!section) return;

    const tabs = section.querySelectorAll(".filter-tab .tab-btn");
    const contents = section.querySelectorAll(
        ".influencer-grid[data-content]"
    );

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const selectedTab = tab.dataset.tab;

            // 탭 버튼 활성화
            tabs.forEach(function (btn) {

                const isActive = btn === tab;

                btn.classList.toggle("active", isActive);
                btn.setAttribute("aria-selected", String(isActive));

            });

            // 해당 탭의 이미지 그리드 표시
            contents.forEach(function (content) {

                const isActive =
                    content.dataset.content === selectedTab;

                content.classList.toggle("active", isActive);

            });

        });

    });

});


/* =========================================
   HISTORY 찜하기 하트 클릭 기능
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const historyGroups = document.querySelectorAll(
        ".history .history-group"
    );

    historyGroups.forEach(function (group) {

        const isRecent = group.querySelector(
            ".group-title"
        )?.textContent.trim() === "최근 본 제품";

        const heartOff = isRecent
            ? "card_btn_favorited1.svg"
            : "card_btn_favorited3.svg";

        const heartOn = isRecent
            ? "card_btn_favorited3.svg"
            : "card_btn_favorited1.svg";

        const buttons = group.querySelectorAll(".btn-wish");

        buttons.forEach(function (button) {

            const img = button.querySelector("img");
            if (!img) return;

            const originalSrc = img.getAttribute("src");
            const imagePath = originalSrc.substring(
                0,
                originalSrc.lastIndexOf("/") + 1
            );

            img.src = imagePath + heartOff;
            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", function (e) {

                e.preventDefault();
                e.stopPropagation();

                const isLiked = button.classList.toggle("liked");

                img.src = imagePath + (
                    isLiked ? heartOn : heartOff
                );

                button.setAttribute(
                    "aria-pressed",
                    String(isLiked)
                );

            });

        });

    });

});

