$(function () {
  var _html = $('html');
  var _body = $('body');
  var _window = $(window);

  var ww = _window.width();
  var wh = _window.height();
  var wwNew = ww;

  const wwSlim = 480;
  const wwMedium = 700; //此值以下是手機
  const wwNormal = 1000; //此值以上是電腦
  const wwMaximum = 1200;

  var _webHeader = $('.webHeader');
  var _menu = _webHeader.find('.menu');
  var _sidebar = $('.sidebar');
  var _goTop = $('.goTop');

  _html.removeClass('no-js');

  // 製作側欄選單遮罩 ///////////////
  _body.append('<div class="sidebarMask"></div>');
  var _sidebarMask = $('.sidebarMask');

  // 固定版頭 //////////////////////////////
  var fixHeadThreshold;
  var hh = _webHeader.outerHeight();
  if (ww >= wwNormal) {
    fixHeadThreshold = hh - _menu.outerHeight();
  } else {
    fixHeadThreshold = 0;
  }

  _window.scroll(function () {
    if (_window.scrollTop() > fixHeadThreshold) {
      _webHeader.addClass('fixed');
      _body.offset({ top: hh });
    } else {
      _webHeader.removeClass('fixed');
      _body.removeAttr('style');
    }

    // goTop button 顯示、隱藏
    if (_window.scrollTop() > 200) {
      _goTop.addClass('show');
    } else {
      _goTop.removeClass('show');
    }
  });
  _window.trigger('scroll');
  // 固定版頭 end //////////////////////////////

  // 向上捲動箭頭 //////////////////////////////
  _goTop.click(function () {
    _html.stop(true, false).animate({ scrollTop: 0 }, 800, function () {
      $('.goCenter').focus();
    });
  });
  // 向上捲動箭頭 end //////////////////////////////

  // 主選單 hover a 顯示次選單 /////////////////////////////////////////////
  // 找出_menu中有次選單的li ----------
  _menu.find('li').has('ul').addClass('hasChild');

  // 寬版「主選單」/////////////////////////////////////////////
  // 只顯示到第兩層 ----------
  var _mmHasChild = _menu.find('.hasChild');
  var _mmA = _menu.children('ul').children('li').children('a');

  // li hover
  _mmHasChild
    .on('mouseenter', function () {
      $(this).addClass('here').children('ul').stop().animate({ opacity: 1 }, 300);
      $(this).siblings().children('a').blur().removeClass();
    })
    .on('mouseleave', function () {
      $(this)
        .children('ul')
        .stop()
        .animate({ opacity: 0 }, 200, function () {
          $(this).removeAttr('style').parent().removeClass('here');
        });
      $(this).children('a').blur().removeClass();
    });

  // focus
  _mmA.focus(function () {
    let _this = $(this);
    let _parentLi = _this.parent();
    _parentLi.siblings().children('a').removeClass('focused');
    _parentLi
      .siblings()
      .children('ul')
      .stop()
      .animate({ opacity: 0 }, 500, function () {
        $(this).removeAttr('style').parent().removeClass('here');
      });
    if (_parentLi.hasClass('hasChild')) {
      _this.addClass('focused');
      _parentLi.addClass('here').children('ul').stop().animate({ opacity: 1 }, 300);
    }
  });

  // 離開 _menu 隱藏所有次選單
  $('*').focus(function () {
    if ($(this).parents('.menu').length == 0) {
      _menu.find('.hasChild').removeClass('here').find('ul').removeAttr('style');
      _mmA.removeClass('focused');
    }
  });
  // 主選單 end ////////////////////////////////////////////////////////////

  // 行動版側欄主選單 /////////////////////////////////////////////
  // 複製「主選單」到側欄給行動版用
  _menu.clone().prependTo(_sidebar);
  $('.topLinks').clone().appendTo(_sidebar);
  var _sidebarCtrl = _webHeader.find('.sidebarCtrl');
  var _sidebarMenu = _sidebar.find('.menu');
  var _hasChild = _sidebarMenu.find('.hasChild>a');
  _sidebar.append('<button class="skip" type="button">回到側欄開關</button>');
  var _skipToSidebarCtrl = _sidebar.find('.skip');

  _hasChild.click(function (e) {
    e.preventDefault();

    let _this = $(this);
    let _subMenu = _this.next('ul');

    if (_subMenu.is(':hidden')) {
      _subMenu.stop(true, false).slideDown();
      _this.parent().addClass('closeIt').siblings().removeClass('closeIt').find('ul:visible').slideUp().parent().removeClass('closeIt');
    } else {
      _subMenu.stop(true, false).slideUp().find('ul:visible').slideUp();
      _subMenu.find('.closeIt').removeClass('closeIt');
      _this.parent().removeClass('closeIt');
    }
  });

  _sidebarCtrl.click(function () {
    if (_sidebar.hasClass('reveal')) {
      _sidebar.removeClass('reveal');
      _sidebarCtrl.removeClass('closeIt');
      _sidebarMask.fadeOut(400);
      _body.removeClass('noScroll');
    } else {
      _sidebar.addClass('reveal');
      _sidebarCtrl.addClass('closeIt');
      _sidebarMask.fadeIn(400);
      _body.addClass('noScroll');
    }
  });
  _sidebarMask.click(function () {
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt');
    _body.removeClass('noScroll');
    $(this).fadeOut(400);
  });

  _skipToSidebarCtrl.focus(function () {
    _sidebarCtrl.focus();
  });

  // 版頭查詢區開合 /////////////////////////////////////////////
  var _searchCtrl = $('.searchCtrl');
  var _search = $('.search');
  _search.append('<button class="skip" type="button">回到控制開關</button>');
  var _skipSearch = _search.find('.skip');
  const srSpeed = 510;
  _searchCtrl.click(function () {
    if (_search.hasClass('reveal')) {
      _search.removeClass('reveal');
      setTimeout(function () {
        _search.hide();
      }, srSpeed);
    } else {
      _search.show(0, function () {
        _search.addClass('reveal');
        setTimeout(function () {
          _search.find('input[type="text"]').focus();
        }, srSpeed);
      });
    }
  });
  _skipSearch.focus(function () {
    _search.removeClass('reveal');
    setTimeout(function () {
      _search.hide();
    }, srSpeed);
    _searchCtrl.focus();
  });
  // 版頭查詢區開合 end /////////////////////////////////////////////

  // window resize /////////////////////////////////////////////
  var winResizeTimer;
  var wwNew;
  _window.resize(function () {
    clearTimeout(winResizeTimer);
    winResizeTimer = setTimeout(function () {
      wwNew = _window.width();

      // 由小螢幕到寬螢幕
      if (ww < wwNormal && wwNew >= wwNormal) {
        if (_sidebar.hasClass('reveal')) {
          _sidebar.removeClass('reveal');
          _sidebarCtrl.removeClass('closeIt');
          _sidebarMask.hide();
          _body.removeClass('noScroll');
        }
        _body.removeAttr('style');
        _webHeader.removeClass('fixed');
        _search.removeClass('reveal').removeAttr('style');
        hh = _webHeader.outerHeight();
        fixHeadThreshold = hh - _menu.outerHeight();
        _window.trigger('scroll');
      }

      // 由寬螢幕到小螢幕
      if (ww >= wwNormal && wwNew < wwNormal) {
        hh = _webHeader.outerHeight();
        fixHeadThreshold = 0;
        _body.removeAttr('style');
        _window.trigger('scroll');
      }
      ww = wwNew;
    }, 200);
  });
  // window resize  end /////////////////////////////////////////////

  // ------------------------------------------ //
  // -------- 外掛套件 slick 參數設定 --------- //

  // 首頁大圖輪播
  $('.bigBanner').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    speed: 800,
    autoplay: true,
    arrows: true,
    dots: true,
    fade: false,
    infinite: true,
    zIndex: 8,
  });

  // 首頁《即時影音》
  $('.videoFlow ')
    .find('.flowList')
    .slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 600,
      autoplay: false,
      arrows: true,
      dots: true,
      fade: false,
      infinite: true,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 700,
          settings: { slidesToShow: 2 },
        },
        {
          breakpoint: 1000,
          settings: { slidesToShow: 3 },
        },
      ],
    });

  // 首頁《主題專區》
  $('.topics')
    .find('.flowList')
    .slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      speed: 600,
      autoplay: false,
      arrows: true,
      dots: false,
      fade: false,
      infinite: true,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 700,
          settings: { slidesToShow: 3 },
        },
      ],
    });

  // 首頁《Contact Us》地圖與聯絡資訊切換
  $('.mapList').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: true,
    infinite: true,
    asNavFor: '.cardList',
  });
  $('.cardBox').find('.cardList').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    fade: false,
    infinite: true,
    asNavFor: '.mapList',
  });

  // ---------- slick 參數設定：結束 --------- //
  // ------------------------------------------ //

  // 首頁《Contact Us》地圖與聯絡資訊切換：補上方區域名稱切換 //////////////////////////////
  var _navMapDots = $('.contactUs').find('.cardBox').find('.slick-dots');
  var _navMapLi = _navMapDots.find('li');
  const region = ['署本部', '臺北', '北區', '中區', '南區', '高屏', '東區'];
  for (let i = 0; i < region.length; i++) {
    _navMapLi.eq(i).find('button').text(region[i]);
  }
  _navMapDots.prependTo('.cardBox .cardList');
  _navMapLi.find('button').focus(function () {
    $(this).trigger('click');
  });
  // 首頁《Contact Us》 end /////////////////////////////////////////////////////////////////

  // 複合功能圖示 ///////////////////////////////////////////////////////////
  // 文字大小和分享
  var _compIcon = $('.compound'); //li
  _compIcon.each(function () {
    let _this = $(this);
    let _controler = _this.children('button');
    let _optList = _this.children('ul');
    let _optItem = _optList.children('li');
    let _optButton = _optItem.children('button');
    let _optLink = _optItem.children('a');
    let count = _optItem.length;

    const speed = 300;

    // 改變 li 的 z-index 值，第一個 li 要在最上面
    for (let i = 0; i < count; i++) {
      _optItem.eq(i).css('z-index', count - i);
    }

    // 收合
    function glideUp() {
      for (let i = 0; i < count; i++) {
        _optList.stop(true, false).animate({ top: 0 }, speed);
        _optItem
          .eq(i)
          .delay(speed * i * 0.4)
          .stop(true, false)
          .animate({ top: 0 }, speed, function () {
            if (i == count - 1) {
              _optList.height(0).hide();
            }
          });
      }
    }

    _controler.click(function () {
      if (_optList.is(':hidden')) {
        _optList.show();
        let height = _optItem.outerHeight(true);
        _optList.stop(true, false).animate({ top: height }, speed);
        for (let i = 0; i < count; i++) {
          _optItem
            .eq(i)
            .delay(speed * i * 0.3)
            .stop(true, false)
            .animate({ top: height * i }, speed, function () {
              _optList.height(height * count);
            });
        }
      } else {
        glideUp();
      }
    });

    _optButton.add(_optLink).click(glideUp);
    _this.siblings().click(glideUp);
    _this.siblings().children('a, button').focus(glideUp);
    _optItem
      .last()
      .children('button')
      .on('keydown', function (e) {
        if (e.which === 9 && !e.shiftKey) {
          glideUp();
        }
      });
  });
  // 複合功能圖示 end ///////////////////////////////////////////////////////////

  // font size 和 cookie /////////////////////////////////////////////
  // font size：顯示所選項目
  var _fontSize = $('.fontSize');
  var _fontSizeBtn = _fontSize.children('button');
  var _fsOption = _fontSize.find('ul>li>button');

  _fsOption.click(function () {
    let fontClass = $(this).attr('class');
    _fontSizeBtn.removeClass().addClass(fontClass);
    _body.removeClass('largeFont mediumFont smallFont').addClass(fontClass);
    createCookie('FontSize', fontClass, 365);
  });

  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  window.onload = function () {
    var cookie = readCookie('FontSize');

    _body.removeClass('largeFont mediumFont smallFont').addClass(cookie);
    _fontSizeBtn.removeClass().addClass(cookie);
  };
  // font size 和 cookie end ////////////////////////////////////////////////////////////

  // 頁籤功能 ////////////////////////////////////////////////////////////
  function tabFun() {
    var activeClass = 'active'; // 啟動的 class
    var tabSet = $('.tabSet');

    tabSet.each(function () {
      let _this = $(this);
      // var _tabBtnBlock = _this.find('.tabItems');
      let _tabBtn = _this.find('.tabItems').children('button');
      let _tabBtnLength = _tabBtn.length;
      let _tabContent = _this.find('.tabContent');

      _tabBtn.removeClass(activeClass).eq(0).addClass(activeClass);
      _tabContent.eq(0).show();

      for (let i = 0; i < _tabBtnLength; i++) {
        (function (i) {
          let _this = _tabBtn.eq(i);
          let _thisContent = _tabContent.eq(i);
          let _thisPrevItem = _tabContent.eq(i - 1);
          let _itemAllA = _thisContent.find('[href], input'); //這一個頁籤內容所有a和input項目
          let _prevItemAllA = _thisPrevItem.find('[href], input'); //前一個頁籤內容所有a和input項目
          let _isFirstTab = i === 0; //如果是第一個頁籤
          let _isLastTab = i === _tabBtnLength - 1; //如果是最後一個頁籤
          let _itemFirstA = _itemAllA.eq(0); //頁籤內容第一個a或是input
          let _itemLastA = _itemAllA.eq(-1); //頁籤內容最後一個a或是input
          let _prevItemLastA = _prevItemAllA.eq(-1); //前一個頁籤的最後一個a或是input

          // _this頁籤觸發focus內容裡的第一個a
          _this.on('keydown', function (e) {
            //頁籤第幾個按鈕觸發時無
            if (e.which === 9 && !e.shiftKey) {
              // 按下 tab 時沒有按著 shift
              e.preventDefault();
              startTab(i); //啟動頁籤切換功能
              if (_itemAllA.length) {
                // 如果 _itemAllA.length 不是 0（內容有至少一個 a 或 input）
                _itemFirstA.focus(); // 內容的第一個 a 或是 input focus
              } else {
                _tabBtn.eq(i + 1).focus(); // 當內容沒有 a 或是 input 跳下一個頁籤
              }
            } else if (e.which === 9 && e.shiftKey && !_isFirstTab) {
              // 按下 tab 時同時按著 shift，且不是第一個頁籤
              e.preventDefault();
              startTab(i - 1); //啟動頁籤切換功能，切換到上一個頁籤

              if (_prevItemAllA.length) {
                // 如果前ㄧ個頁籤的內容有至少一個 a 或 input
                _prevItemLastA.focus(); // 前一個頁籤內容的最後一個a或是input focus
              } else {
                // 當內容沒有a或是input
                _tabBtn.eq(i - 1).focus(); // focus 上一個頁籤
              }
            }
          });

          // 當按下shift+tab且為該內容的第一個a或是input
          // 將focus目標轉回tab頁籤上，呼叫上方功能startTab(i - 1);往前一個頁籤
          _itemFirstA.on('keydown', function (e) {
            if (e.which === 9 && e.shiftKey) {
              e.preventDefault();
              _tabBtn.eq(i).focus();
            }
          });

          //當按下shift+tab且為該內容的最後一個a或是input，focus到下一個頁籤
          _itemLastA.on('keydown', function (e) {
            if (e.which === 9 && !e.shiftKey && !_isLastTab) {
              e.preventDefault();
              _tabBtn.eq(i + 1).focus();
            }
          });
        })(i);

        //滑鼠點擊事件
        _tabBtn.on('click', function (e) {
          e.preventDefault();
          startTab($(this).index());
        });

        //切換tab
        function startTab(_now) {
          _tabBtn.eq(_now).addClass(activeClass).siblings().removeClass(activeClass);
          _tabContent.hide().eq(_now).show();
        }
      }
    });
  }
  tabFun();
  // 頁籤功能 end //////////////////////////////////////////////////////////

  // 內文區塊展開／收合 //////////////////////////////////////////////////////////
  $('.showHideList').each(function () {
    let _showHideList = $(this);
    let _ctrlBtn = _showHideList.find('.ctrlBtn');
    let _showHideItems = _showHideList.children('ul').children('li');
    let _title = _showHideItems.find('.title');
    let _content = _showHideItems.find('.content');
    const textOpen = _ctrlBtn.text();
    const textClose = _ctrlBtn.attr('data-altitle');

    console.log(_showHideItems);

    _title.click(function () {
      let _this = $(this);
      console.log(_this);
      if (_this.hasClass('show')) {
        _this.next().slideUp(400);
        _this.removeClass('show');
        _this.find('.openclose_btn').text('展開');
      } else {
        _this.next().slideDown(400);
        _this.addClass('show').parent().siblings().find('.content').slideUp(400);
        _this.addClass('show').parent().siblings().find('.title').removeClass('show');
        _this.find('.openclose_btn').text('收合');
        _this.parent().siblings().find('.openclose_btn').text('展開');
      }
    });

    _ctrlBtn.click(function () {
      let _this = $(this);
      if (_this.hasClass('closeAll')) {
        _content.slideUp(400);
        _showHideItems.removeClass('show');
        _this.removeClass('closeAll').text(textOpen);
      } else {
        _content.slideDown(400);
        _showHideItems.addClass('show');
        _this.addClass('closeAll').text(textClose);
      }
    });
  });
  // 內文區塊展開／收合 end //////////////////////////////////////////////////////////

  // 可收合區 //////////////////////////////////////////////////////////
  _drawer = $('.drawer');
  _drawer.each(function () {
    let _this = $(this);
    let _handle = _this.find('.handle');
    let _tray = _this.find('.tray');
    const speed = 500;

    _handle.click(function () {
      if (_tray.is(':hidden')) {
        _tray.stop(true, false).slideDown(speed);
        _handle.removeClass('openIt');
      } else {
        _tray.stop(true, false).slideUp(speed, function () {
          _handle.addClass('openIt');
        });
      }
    });
  });
  // 可收合區 end //////////////////////////////////////////////////////////

  // rwd Table //////////////////////////////////////////////////////////
  // 把 th 的內容複製到對應的td的 data-th 屬性值
  _rwdTable = $('.rwdTable');
  _rwdTable.each(function () {
    let _this = $(this);
    let _th = _this.find('thead>tr>th');
    let count = _th.length;
    let _tr = _this.find('tbody').children('tr');

    _tr.each(function () {
      let _td = $(this).children('td');
      for (let i = 0; i < count; i++) {
        _td.eq(i).attr('data-th', _th.eq(i).text());
      }
    });
  });

  // rwd Table *end* //////////////////////////////////////////////////////////

  //////////////////////////////////////////////
  // 燈箱 //////////////////////////////////////////////
  var _lightbox = $('.lightbox');
  var _hideLightbox = _lightbox.find('.closeThis');
  const lbxSpeed = 400;

  _lightbox.before('<div class="coverAll"></div>');
  _lightbox.append('<button type="button" class="skip">Go to the "close light box" button</button>');
  var _cover = $('.coverAll');
  var _skipToClose = _lightbox.find('.skip');

  _skipToClose.focus(function () {
    _hideLightbox.focus();
  });

  // 關燈箱
  _hideLightbox.click(function () {
    let _targetLbx = $(this).parents('.lightbox');
    _targetLbx.stop(true, false).fadeOut(lbxSpeed, function () {
      _cpBigPhoto.find('.flowList').find('li').hide();
    });
    _targetLbx.prev(_cover).fadeOut(lbxSpeed);
    _body.removeClass('noScroll');
  });

  _cover.click(function () {
    let _targetLbx = $(this).next('.lightbox');
    $(this).fadeOut(lbxSpeed);
    _body.removeClass('noScroll');
    _targetLbx.stop(true, false).fadeOut(lbxSpeed, function () {
      _cpBigPhoto.find('.flowList').find('li').hide();
    });
  });
  // 燈箱 end //////////////////////////////////////////////

  // .photoflow：cp頁的相關圖片（Related Photos）//////////////////////////////////////
  // 點擊圖片要開燈箱並顯示大圖
  var _photoflow = $('.photoflow');
  var _cpBigPhoto = $('.lightbox.bigPhotos');
  var photoIndex;
  var _keptFlowItem;

  _photoflow.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 400;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator 和 自訂屬性 data-index
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find('.flowNav>ul');
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li></li>';
      _flowItem.eq(n).attr('data-index', n);
    }
    _indicator.append(_dots);

    // 複製到燈箱中 *** //
    _floxBox.clone().insertBefore(_skipToClose);

    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);
    _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      if (ww < wwMedium) {
        if (slideCount > 1) {
          flownavShow();
        } else {
          flownavHide();
        }
      }
      if (ww >= wwMedium) {
        if (slideCount <= 2) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
        }
      }
      if (ww >= wwNormal) {
        if (slideCount <= 4) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 3) % slideCount).addClass(actClassName);
        }
      }
    }
    function flownavShow() {
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide() {
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }

    function slideForward() {
      _flowList.stop(true, false).animate({ 'margin-left': -1 * slideDistance }, speed, function () {
        j = (i + 1) % slideCount;
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(i).removeClass(actClassName);
        _indicatItem.eq(j).addClass(actClassName);
        _flowList.css('margin-left', 0);
        if (ww >= wwMedium) {
          _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        }
        if (ww >= wwNormal) {
          _indicatItem.eq((j + 3) % slideCount).addClass(actClassName);
        }
        i = j;
      });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css('margin-left', -1 * slideDistance);

      _flowList.stop(true, false).animate({ 'margin-left': 0 }, speed, function () {
        _indicatItem.eq(j).addClass(actClassName);
        if (ww >= wwNormal) {
          _indicatItem.eq((i + 3) % slideCount).removeClass(actClassName);
        } else if (ww >= wwMedium) {
          _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
        } else {
          _indicatItem.eq(i).removeClass(actClassName);
        }
        i = j;
      });
    }

    // 點擊向右箭頭
    _btnRight.click(function () {
      slideForward();
    });

    // 點擊向左箭頭
    _btnLeft.click(function () {
      slideBackward();
    });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {
        slideBackward();
      },
      swipeLeft: function () {
        slideForward();
      },
      threshold: 20,
    });

    ///////////////////////////////////////////////////////
    // 點擊.photoflow的圖片，開燈箱顯示大圖 ***
    _flowItem.children('a').click(function () {
      _keptFlowItem = $(this);
      photoIndex = _keptFlowItem.parent().attr('data-index');
      _cpBigPhoto
        .stop(true, false)
        .fadeIn()
        .find('.flowList')
        .find('li')
        .filter(function () {
          return $(this).attr('data-index') == photoIndex;
        })
        .show();
      _hideLightbox.focus();
      _cover.stop(true, false).fadeIn();
      _body.addClass('noScroll');
    });

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });
  });

  // cp 頁大圖燈箱 *** ////////////////////////////
  _cpBigPhoto.each(function () {
    let _this = $(this);
    let _photoBox = _this.find('.flowBox');
    let _photoList = _photoBox.find('.flowList');
    let _photoItem = _photoList.children('li');
    let photoCount = _photoItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    let _hideBigPhoto = _this.find('.closeThis');

    const speed = 400;
    let i, j;

    _photoItem.find('img').unwrap('a');

    // 點擊向右箭頭
    _btnRight.click(function () {
      i = Number(_photoItem.filter(':visible').attr('data-index'));
      j = (i + 1) % photoCount;

      _photoItem
        .filter(function () {
          return $(this).attr('data-index') == i;
        })
        .stop(true, false)
        .fadeOut(speed, function () {
          $(this).hide();
        });
      _photoItem
        .filter(function () {
          return $(this).attr('data-index') == j;
        })
        .stop(true, false)
        .fadeIn(speed);
    });

    // 點擊向左箭頭
    _btnLeft.click(function () {
      i = Number(_photoItem.filter(':visible').attr('data-index'));
      j = (i - 1 + photoCount) % photoCount;

      _photoItem
        .filter(function () {
          return $(this).attr('data-index') == i;
        })
        .stop(true, false)
        .fadeOut(speed, function () {
          $(this).hide();
        });
      _photoItem
        .filter(function () {
          return $(this).attr('data-index') == j;
        })
        .stop(true, false)
        .fadeIn(speed);
    });

    // 關閉大圖燈箱
    _hideBigPhoto.add(_cover).click(function () {
      _photoItem.hide();
      _keptFlowItem.focus();
    });
  });
  // cp 頁大圖燈箱 *** end ////////////////////////////////////

  // 計算照片張數 ////////////////////////////////////
  var _countPhoto = $('.imgSlick').filter('.count');
  _countPhoto.each(function () {
    let _this = $(this);
    _this.prepend('<div class="photoCount"><span class="current" title="目前位置"></span><span class="total" title="總張數"></span></div>');
    let _photoCount = _this.find('.photoCount');
    let _current = _photoCount.find('.current');
    let _total = _photoCount.find('.total');
    let _countThis = _this.find('.slider-for');

    _total.text(_countThis.find('.slick-slide').length);
    _current.text(_countThis.find('.slick-current').index() + 1);

    _this
      .find('.slick-arrow')
      .add('.slick-slide')
      .click(function () {
        _current.text(_countThis.find('.slick-current').index() + 1);
      });
  });
  // 計算照片張數 end ////////////////////////////////////

  // 分區業務組  ----------------------------------------------------20230619
  var _divisions = $('.divisions');
  var _showDivs = $('.showDivs>button');
  var _closeDivs = _divisions.find('.closeThis');
  var _divOffices = _divisions.find('.offices');
  var _eachOffice = _divOffices.find('li').find('li>a');
  var _officeInfo = _divOffices.find('.info');

  _showDivs.click(function (e) {
    _divisions.stop(true, false).fadeIn(400);
    _closeDivs.focus();
    _body.addClass('noScroll');
    e.preventDefault;
  });

  _closeDivs.click(function () {
    _eachOffice.parent().removeClass('closeIt').find('.info').slideUp(200);
    _divisions.stop(true, false).fadeOut(400, function () {
      _showDivs.focus();
    });
    _body.removeClass('noScroll');
  });

  _eachOffice.click(function (e) {
    let _thisOffice = $(this).parent('li');
    let _thisOfficeInfo = _thisOffice.find('.info');
    if (_thisOffice.hasClass('closeIt')) {
      _thisOffice.removeClass('closeIt');
      _thisOfficeInfo.slideUp(300);
    } else {
      _eachOffice.parent().removeClass('closeIt');
      _thisOffice.addClass('closeIt');
      _officeInfo.slideUp(300);
      _thisOfficeInfo.slideDown(300);
    }
    e.preventDefault;
  });

  // ***** //
  _divOffices
    .children('li:last-child')
    .find('li:last-child')
    .children('a')
    .blur(function () {
      _closeDivs.focus();
    });

  // fatfooter 開合 -----------------------------------------------------
  var _fatFootCtrl = $('.fatFootCtrl');
  var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');
  const text1 = _fatFootCtrl.text();
  const text2 = _fatFootCtrl.attr('data-altText');

  _fatFootCtrl.click(function () {
    if (_footSiteTree.is(':visible')) {
      _footSiteTree.slideUp();
      $(this).addClass('closed').text(text2);
    } else {
      _footSiteTree.slideDown();
      $(this).removeClass('closed').text(text1);
    }
  });

  // cp說明文字展開收合
  $('.illustrate_group .illustrate_btn').click(function () {
    $(this).toggleClass('open');
    $('.illustrate_group .illustrate_block').slideToggle();
  });

  /*-----------------------------------*/
  /////////// 無障礙快捷鍵盤組合  //////////
  /*-----------------------------------*/
  $(document).on('keydown', function (e) {
    // alt+S 查詢
    if (e.altKey && e.keyCode == 83) {
      $('html, body').animate({ scrollTop: 0 }, 200, 'easeOutExpo');
      $('.search').find('input[type="text"]').focus();
    }
    // alt+U header
    if (e.altKey && e.keyCode == 85) {
      $('html, body').animate({ scrollTop: 0 }, 200, 'easeOutExpo');
      $('header').find('.accesskey').focus();
    }
    // alt+C 主要內容區
    if (e.altKey && e.keyCode == 67) {
      $('html, body')
        .stop(true, true)
        .animate({ scrollTop: $('.main').find('.accesskey').offset().top - 70 }, 800, 'easeOutExpo');
      $('.main').find('.accesskey').focus();
    }
    // alt+Z footer
    if (e.altKey && e.keyCode == 90) {
      $('html, body')
        .stop(true, true)
        .animate({ scrollTop: $('footer').find('.accesskey').offset().top }, 800, 'easeOutExpo');
      $('footer').find('.accesskey').focus();
    }
  });
  //
  $('.cpArticle table').wrap('<div class="scroltable-container"></div>');
});

// 內文展開收合
$(document).ready(function () {
  var _window = $(window);

  var _expansile = $('.expansile');
  var textLess = '收起全文';
  var textAll = '查看全文';
  _expansile.addClass('partial').wrapInner('<div class="innerPart"></div>');
  var hPartial = _expansile.height();
  _expansile.append('<button type="button" class="readAll"></button>');

  _expansile.each(function () {
    var _this = $(this);
    var _readAll = _this.find('.readAll').text(textAll);
    var hFull;
    _readAll.click(function () {
      if (_this.hasClass('partial')) {
        hFull = _this.find('.innerPart').innerHeight();
        _this.animate({ height: hFull }, 500, function () {
          _this.removeClass('partial');
          _readAll.text(textLess);
        });
      } else {
        _this.animate({ height: hPartial }, 500, function () {
          _this.addClass('partial');
          _readAll.text(textAll);
        });
      }
    });
  });

  function resetHeight() {
    _expansile.removeAttr('style');
  }

  // window resize
  var winResizeTimer;
  _window.resize(function () {
    clearTimeout(winResizeTimer);
    winResizeTimer = setTimeout(function () {
      resetHeight();
    });
  });
});
