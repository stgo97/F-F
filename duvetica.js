$(function () {

    const $menu = $(".mobile-menu");
    const $toggle = $(".menu-toggle");
    const $close = $(".menu-close");

    // 햄버거 클릭 - 메뉴 열기
    $toggle.on("click", function () {
        $menu
            .removeAttr("inert")
            .attr("aria-hidden", "false")
            .addClass("open");

        $toggle.attr("aria-expanded", "true");
        $("body").addClass("menu-open");
        $close.trigger("focus");
    });

    // 메뉴 닫기
    function closeMenu() {
        $toggle.trigger("focus");

        $menu
            .removeClass("open")
            .attr("aria-hidden", "true")
            .attr("inert", "");

        $toggle.attr("aria-expanded", "false");
        $("body").removeClass("menu-open");
    }

    $close.on("click", closeMenu);

    // ESC 키로도 닫기
    $(document).on("keydown", function (e) {
        if (e.key === "Escape" && $menu.hasClass("open")) {
            closeMenu();
        }
    });

});

$(function () {

    $(".mobile-category").on("click", function () {

        const $item = $(this).closest(".mobile-item");
        const isOpen = $item.hasClass("open");

        $(".mobile-item")
            .removeClass("open")
            .find(".mobile-category")
            .attr("aria-expanded", "false");

        $(".sub-menu")
            .stop(true, true)
            .slideUp(300);

        if (!isOpen) {
            $item.addClass("open");

            $(this).attr("aria-expanded", "true");

            $item.find(".sub-menu")
                .stop(true, true)
                .slideDown(300);
        }

    });

});

/* PC 헤더  */
$(function () {

    const $header = $("header");
    const $links = $(".header-inner .nav-left a, .header-inner .nav-right a");

    const $mega = $(`
        <div class="pc-mega" aria-hidden="true" inert>
            <div class="pc-mega-inner"></div>
        </div>
    `);

    $(".header-inner").after($mega);

    const $megaInner = $mega.find(".pc-mega-inner");

    $links.each(function () {

        const name = $(this).text().trim();

        const $mobileItem = $(".mobile-item").filter(function () {
            return $(this).find(".menu-label").first().text().trim() === name;
        }).first();

        if (!$mobileItem.length) return;

        $(this)
            .addClass("pc-menu-trigger")
            .attr("data-menu", name)
            .attr("aria-expanded", "false");

        const $panel = $("<div></div>")
            .addClass("pc-mega-panel")
            .attr("data-menu", name);

        const $content = $mobileItem
            .children(".sub-menu")
            .children()
            .clone();

        $panel.append($content);
        $megaInner.append($panel);

    });

    const $triggers = $(".pc-menu-trigger");
    const $panels = $(".pc-mega-panel");

    function openMega(name) {

        if (window.innerWidth < 1200) return;

        const $target = $panels.filter(function () {
            return $(this).attr("data-menu") === name;
        });

        if (!$target.length) return;

        const isVisible = $mega.is(":visible");

        $panels.removeClass("is-active");
        $target.addClass("is-active");

        $triggers
            .removeClass("is-active")
            .attr("aria-expanded", "false");

        $triggers.filter(function () {
            return $(this).attr("data-menu") === name;
        })
        .addClass("is-active")
        .attr("aria-expanded", "true");

        $mega
            .removeAttr("inert")
            .attr("aria-hidden", "false");

        if (!isVisible) {
            $mega.stop(true, true).slideDown(350);
        }
    }

    function closeMega() {

        $triggers
            .removeClass("is-active")
            .attr("aria-expanded", "false");

        $mega.stop(true, true).slideUp(300, function () {
            $mega
                .attr("aria-hidden", "true")
                .attr("inert", "");
        });
    }

    $triggers.on("mouseenter focusin", function () {
        openMega($(this).attr("data-menu"));
    });

    $header.on("mouseleave", closeMega);

    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            closeMega();
        }
    });

    $(window).on("resize", function () {
        if (window.innerWidth < 1200) {
            $mega.stop(true, true).hide()
                .attr("aria-hidden", "true")
                .attr("inert", "");

            $triggers
                .removeClass("is-active")
                .attr("aria-expanded", "false");
        }
    });

});



/*메인비주얼*/

$(function () {

    const $left = $(".left-track");
    const $right = $(".right-track");

    const $leftSlides = $left.children(".slide");
    const $rightSlides = $right.children(".slide");

    const total = Math.min($leftSlides.length, $rightSlides.length);

    if (total < 2) return;

    // 왼쪽 첫 이미지 복제
    $left.append($leftSlides.first().clone());

    // 오른쪽은 이미지 순서를 반대로 배치
    const $rightClone = $rightSlides.first().clone();

    $rightSlides.get().reverse().forEach(function (slide) {
        $right.append(slide);
    });

    $right.prepend($rightClone);

    let index = 0;
    let moving = false;

    // 오른쪽 첫 이미지 위치 설정
    $right.css({
        transition: "none",
        transform: `translateX(-${total * 100}%)`
    });

    $right[0].offsetWidth;

    $right.css("transition", "transform 1.1s ease-in-out");

    function moveSlide() {

        if (moving) return;

        moving = true;
        index++;

        // 왼쪽은 왼쪽 방향으로
        $left.css(
            "transform",
            `translateX(-${index * 100}%)`
        );

        // 오른쪽은 오른쪽 방향으로
        $right.css(
            "transform",
            `translateX(-${(total - index) * 100}%)`
        );
    }

    // 마지막 이미지 이후 처음으로 연결
    $left.on("transitionend", function (e) {

        if (e.target !== this ||
            e.originalEvent.propertyName !== "transform") {
            return;
        }

        if (index === total) {

            $left.add($right).css("transition", "none");

            $left.css("transform", "translateX(0%)");

            $right.css(
                "transform",
                `translateX(-${total * 100}%)`
            );

            $left[0].offsetWidth;

            $left.add($right).css(
                "transition",
                "transform 1.1s ease-in-out"
            );

            index = 0;
        }

        moving = false;
    });

    // 4초마다 자동 전환
    setInterval(moveSlide, 4000);

});

/* 모바일 상품 탭 메뉴 */
$(function () {

    $(".tab-menu button").on("click", function () {

        let tab = $(this).data("tab");

        $(".tab-menu button").removeClass("active");
        $(this).addClass("active");

        $(".product-panel").removeClass("active");
        $("#" + tab).addClass("active");

    });

});

/*------------- 상품 컬러 변경 -------------*/
$(function () {

$(".color-circle").on("click", function () {

// 클릭한 컬러 원
const $color = $(this);

// 클릭한 컬러 원이 속한 상품 카드
const $card = $color.closest(".product-card");

// 선택한 컬러의 이미지 경로
const mainImg = $color.attr("data-main");
const hoverImg = $color.attr("data-hover");

// 기본 이미지 변경
$card.find(".product-main-img")
.attr("src", mainImg);

// 호버 이미지 변경
$card.find(".product-hover-img")
.attr("src", hoverImg);

// 기존 컬러 선택 해제
$card.find(".color-circle")
.removeClass("active")
.attr("aria-pressed", "false");

// 클릭한 컬러 활성화
$color
.addClass("active")
.attr("aria-pressed", "true");

});

});

/* DROP 스크롤 애니메이션 */
$(function () {

    const $drop = $(".drop-section");

    if (!$drop.length) return;

    function revealDrop() {

        const dropTop = $drop[0].getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (dropTop < windowHeight * 0.85) {

            $drop.addClass("is-visible");

            $(window).off(
                "scroll.dropReveal resize.dropReveal"
            );
        }
    }

    $(window).on(
        "scroll.dropReveal resize.dropReveal",
        revealDrop
    );

    revealDrop();

});

/* 캠페인 슬라이드 */
$(function () {

    const $campaign = $(".campaign-section");
    const $slides = $(".campaign-slide");
    const $thumbs = $(".campaign-thumb");
    const $progress = $(".progress-line");

    const total = $slides.length;
    const stepDuration = 4000;
    const totalDuration = stepDuration * total;

    if (!total || $thumbs.length < total) return;

    let activeIndex = -1;
    let elapsed = 0;
    let previousTime = null;
    let animationId = null;

    function changeSlide(index) {

    if (activeIndex === index) return;

    activeIndex = index;

    $slides.removeClass("active");
    $slides.eq(index).addClass("active");

    // 썸네일 초기화
    $thumbs
        .removeClass(
            "active is-current is-next is-third is-fourth"
        )
        .css("order", "");

    // 현재 메인 이미지 다음 4장
    const next1 = (index + 1) % total;
    const next2 = (index + 2) % total;
    const next3 = (index + 3) % total;
    const next4 = (index + 4) % total;

    $thumbs.eq(next1)
        .addClass("is-current")
        .css("order", 0);

    $thumbs.eq(next2)
        .addClass("is-next")
        .css("order", 1);

    $thumbs.eq(next3)
        .addClass("is-third")
        .css("order", 2);

    $thumbs.eq(next4)
        .addClass("is-fourth")
        .css("order", 3);
}

    function animateCampaign(time) {

        if (previousTime === null) {
            previousTime = time;
        }

        elapsed += Math.min(time - previousTime, 64);
        previousTime = time;

        const currentTime = elapsed % totalDuration;
        const index = Math.floor(currentTime / stepDuration);
        const progress = currentTime / totalDuration;

        $progress.css(
            "transform",
            `scaleX(${progress})`
        );

        changeSlide(index);

        animationId = requestAnimationFrame(animateCampaign);
    }

    changeSlide(0);

    function startCampaign() {

        if (animationId !== null) return;

        previousTime = null;
        animationId = requestAnimationFrame(animateCampaign);
    }

    function pauseCampaign() {

        if (animationId === null) return;

        cancelAnimationFrame(animationId);
        animationId = null;
        previousTime = null;
    }

    const observer = new IntersectionObserver(function (entries) {

        if (entries[0].isIntersecting) {
            startCampaign();
        } else {
            pauseCampaign();
        }

    }, {
        threshold: 0.15
    });

    observer.observe($campaign[0]);

});

/* 아카이브 스크롤 애니메이션 */
$(function () {

    const $archive = $(".archive-section");

    if (!$archive.length) return;

    $archive.addClass("archive-ready");

    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        $archive.addClass("is-visible");
        return;
    }

    const observer = new IntersectionObserver(function (entries) {

        if (entries[0].isIntersecting) {

            $archive.addClass("is-visible");

            observer.unobserve($archive[0]);
        }

    }, {
        threshold: 0.2
    });

    observer.observe($archive[0]);

});
