

$(function() {

    /* =======================================
    1. 모바일 / 태블릿 서랍 메뉴
    ======================================= */
    // 초기화: 활성화된 메뉴 및 서브메뉴 리셋
    function resetMenu() {
        $('.m-gnb > li').removeClass('active');
        $('.mobile_sub .m_sub').removeClass('active');
    }

    // 햄버거 버튼 클릭: 서랍 열기
    $('.btn_ham').on('click', function(e) {
        e.preventDefault();
        resetMenu(); // 처음 열릴 때는 서브메뉴 없이 깔끔하게 시작
        $('.mobile').addClass('active');
    });

    // 닫기(X) 버튼 클릭: 서랍 닫기
    $('.btn_close').on('click', function() {
        $('.mobile').removeClass('active');
        resetMenu();
    });

    // 대메뉴 클릭 시: 해당 순번의 서브메뉴만 토글 표시
    $('.m-gnb > li').on('click', function(e) {
        e.preventDefault();
        const idx = $(this).index(); // 클릭한 메뉴 순번 (0, 1, 2...)
        $(this).addClass('active').siblings().removeClass('active');
        $('.mobile_sub .m_sub').removeClass('active').eq(idx).addClass('active');
    });


    /* =======================================
    2. Hero 무한 루프 캐러셀 슬라이더
    ======================================= */
    const $bannerList = $('.banner_list');
    const $slides = $('.banner_list > li');
    const originalCount = $slides.length; // 원본 배너 개수 (3개)
    let currentIdx = 1;                   // 복제본 때문에 1번이 진짜 첫 번째 배너
    let isMoving = false;                 // 애니메이션 중복 클릭 방지 플래그
    let autoPlayTimer = null;

    // 앞뒤로 슬라이드 복제본 삽입 (무한 루프용 트릭)
    const $firstClone = $slides.first().clone().addClass('clone');
    const $lastClone = $slides.last().clone().addClass('clone');
    $bannerList.append($firstClone);
    $bannerList.prepend($lastClone);

    const totalCount = originalCount + 2; // 복제본 포함 총 5개

    // 리스트 및 슬라이드 폭 동적 계산 세팅
    $bannerList.css({
        'display': 'flex',
        'width': (totalCount * 100) + '%',
        'margin': 0,
        'padding': 0
    });
    $('.banner_list > li').css({
        'width': (100 / totalCount) + '%',
        'flex-shrink': 0
    });

    // 위치 이동 보조 함수
    function setPosition(index) {
        const movePercent = -(index * (100 / totalCount));
        $bannerList.css('transform', `translateX(${movePercent}%)`);
    }

    // 초기 위치 지정 (진짜 1번 배너 위치로 이동)
    setPosition(currentIdx);

    // 슬라이드 전환 실행 함수
    function goToSlide(targetIdx) {
        if (isMoving) return;
        isMoving = true;

        currentIdx = targetIdx;
        const movePercent = -(currentIdx * (100 / totalCount));

        $bannerList.css({
            'transition': 'transform 0.5s ease',
            'transform': `translateX(${movePercent}%)`
        });

        // 0.5초 이동 애니메이션 완료 후 순간이동 점검
        setTimeout(function() {
            // 마지막 복제본 도달 시 -> 진짜 1번 배너로 순간이동
            if (currentIdx === totalCount - 1) {
                $bannerList.css('transition', 'none');
                currentIdx = 1;
                setPosition(currentIdx);
            }
            // 첫 번째 복제본 도달 시 -> 진짜 마지막 배너로 순간이동
            if (currentIdx === 0) {
                $bannerList.css('transition', 'none');
                currentIdx = totalCount - 2;
                setPosition(currentIdx);
            }
            isMoving = false;
        }, 500);
    }

    // 다음(Next) 버튼
    $('.next_btn').off('click').on('click', function(e) {
        e.preventDefault();
        goToSlide(currentIdx + 1);
        restartTimer();
    });

    // 이전(Prev) 버튼
    $('.prev_btn').off('click').on('click', function(e) {
        e.preventDefault();
        goToSlide(currentIdx - 1);
        restartTimer();
    });

    // 자동 넘김 타이머 함수 (3.5초 간격)
    function startTimer() {
        autoPlayTimer = setInterval(function() {
            goToSlide(currentIdx + 1);
        }, 3500);
    }

    function restartTimer() {
        clearInterval(autoPlayTimer);
        startTimer();
    }

    // 배너 영역에 마우스 올리면 정지, 벗어나면 재실행
    $('.m_banner').hover(
        function() { clearInterval(autoPlayTimer); },
        function() { startTimer(); }
    );

    // 자동 슬라이드 시작
    startTimer();


    const $fashionCards = $('.card_list > li');

    // 카드 위에 마우스 올렸을 때: 해당 카드만 .on 붙이고 나머지는 제거
    $fashionCards.on('mouseenter', function() {
        $(this).addClass('on').siblings().removeClass('on');
    });

    // 패션 카드 전체 영역을 마우스가 벗어났을 때: 원래대로 균등 분할 복귀
    $('.card_list').on('mouseleave', function() {
        $fashionCards.removeClass('on');
    });

    
    const $retailSection = $('.retail');

    // 스크롤 체크 함수
    function checkRetailScroll() {
        if ($retailSection.length === 0) return;

        const windowHeight = $(window).height();       // 현재 화면 높이
        const scrollTop = $(window).scrollTop();         // 현재 스크롤한 위치
        const retailTop = $retailSection.offset().top;   // 리테일 영역의 문서상 시작 위치

        // 리테일 섹션이 화면 아래에서 약 20% 정도 들어왔을 때 실행
        if (scrollTop + windowHeight > retailTop + 100) {
            $retailSection.addClass('show');
        }
    }

    // 1) 스크롤할 때마다 위치 감지
    $(window).on('scroll', checkRetailScroll);

    // 2) 새로고침했을 때 이미 리테일 위치에 와 있는 경우 바로 노출
    checkRetailScroll();
    

    const $newsList = $('.news_list');
    const $newsItems = $('.news_list > li');
    const newsOriginalCount = $newsItems.length; // 원본 카드 5개
    let newsIdx = 0;
    let newsTimer = null;
    let isNewsMoving = false;

    // 화면 크기별로 보여줄 카드 개수 (PC/태블릿은 2장, 모바일은 1장)
    function getVisibleCount() {
        return $(window).width() >= 768 ? 2 : 1;
    }

    // 카드 복제본 추가 (무한 루프를 위해 앞뒤로 필요한 만큼 복제)
    const visibleCount = 2; // 안전하게 2장 기준으로 복제
    for (let i = 0; i < visibleCount; i++) {
        $newsList.append($newsItems.eq(i).clone().addClass('news-clone'));
    }

    const newsTotalCount = newsOriginalCount + visibleCount; // 총 7개 (원본 5 + 복제 2)

    // 크기 자동 계산 함수
    function resizeNewsSlider() {
        const wrapWidth = $('.news-wrap').width();
        const currentVisible = getVisibleCount();
        const gap = 24; // 카드 사이 간격 (px)

        // 각 카드의 실제 너비 계산: (전체 폭 - (간격 * (보이는 개수 - 1))) / 보이는 개수
        const cardWidth = (wrapWidth - (gap * (currentVisible - 1))) / currentVisible;

        // 각 카드에 너비와 오른쪽 마진 적용
        $('.news_list > li').css({
            'width': cardWidth + 'px',
            'margin-right': gap + 'px'
        });

        // 레일 전체 너비 설정
        $newsList.css({
            'width': ((cardWidth + gap) * newsTotalCount) + 'px'
        });

        // 현재 인덱스 위치로 즉시 이동
        moveNewsSlide(newsIdx, 0);
    }

    // 슬라이드 이동 함수 (speed가 0이면 순간이동)
    function moveNewsSlide(index, speed = 500) {
        const wrapWidth = $('.news-wrap').width();
        const currentVisible = getVisibleCount();
        const gap = 24;
        const cardWidth = (wrapWidth - (gap * (currentVisible - 1))) / currentVisible;
        const moveDistance = -(index * (cardWidth + gap));

        if (speed === 0) {
            $newsList.css({
                'transition': 'none',
                'transform': `translateX(${moveDistance}px)`
            });
        } else {
            $newsList.css({
                'transition': `transform ${speed}ms ease`,
                'transform': `translateX(${moveDistance}px)`
            });
        }
    }

    // 다음 카드로 넘어가는 메인 함수
    function nextNewsSlide() {
        if (isNewsMoving) return;
        isNewsMoving = true;
        newsIdx++;

        moveNewsSlide(newsIdx, 500);

        // 5장 다 돌고 복제본 위치에 도달했을 때 -> 0번 진짜 원본 위치로 순간이동!
        if (newsIdx >= newsOriginalCount) {
            setTimeout(function() {
                newsIdx = 0;
                moveNewsSlide(newsIdx, 0); // 눈속임 순간이동
                isNewsMoving = false;
            }, 500);
        } else {
            setTimeout(function() {
                isNewsMoving = false;
            }, 500);
        }
    }

    // 자동 재생 (3.5초 간격으로 스르륵 다음 카드로 이동)
    function startNewsAutoPlay() {
        newsTimer = setInterval(nextNewsSlide, 3000);
    }

    function stopNewsAutoPlay() {
        clearInterval(newsTimer);
    }

    // 마우스 올리면 정지, 벗어나면 다시 자동 재생
    $('.brand_news').hover(stopNewsAutoPlay, startNewsAutoPlay);

    // 창 크기 변경 시 너비 재계산
    $(window).on('resize', resizeNewsSlider);

    // 슬라이더 초기 세팅 및 시작
    resizeNewsSlider();
    startNewsAutoPlay();
});

