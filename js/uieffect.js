$(function(){

  var _html = $('html');
  var _body = $('body');
  var _window = $(window);

  var ww = _window.width();
  var wh = _window.height();
  var wwNew = ww;

  const wwSlim = 480;
  const wwMedium = 700; //此值以下是手機
  const wwNormal = 960;  //此值以上是電腦
  const wwMaximum = 1200;

  var _menu = $('.webHeader .menu');
  var _sidebar = $('.sidebar');
  var _webHeader = $('.webHeader');
  var _webFooter = $('.webFooter');

  _html.removeClass('no-js');

  // 製作側欄選單遮罩 ///////////////
  _body.append('<div class="sidebarMask"></div>');
  var _sidebarMask = $('.sidebarMask');

  // 找出_menu中有次選單的li ///////////////
  _menu.find('li').has('ul').addClass('hasChild');

  // 寬版「主選單」/////////////////////////////////////////////
  var _mmHasChild = _menu.find('.hasChild');
  var _mmA = _menu.children('ul').children('li').children('a');

  // hover
  _mmHasChild.on( 'mouseenter', function(){
    let _thisLi = $(this);
    let _childUl = _thisLi.children('ul');
    _childUl.addClass('show').offset({ left:_menu.children('ul').offset().left });
  }).on( 'mouseleave', function(){
    $(this).children('ul').removeClass('show');
  })

  // focus
  _mmA.focus(function(){
    $(this).parent().siblings().children('ul').removeClass('show');
    $(this).next('ul').addClass('show').offset({ left:_menu.children('ul').offset().left });
  });
  /////////////// end ////////////////////////////////////////////////////////////
  

  // 行動版側欄主選單 /////////////////////////////////////////////
  // 複製「主選單」到側欄給行動版用
  _menu.clone().prependTo(_sidebar);
  $('.topLinks').clone().appendTo(_sidebar);
  var _sidebarCtrl = _webHeader.find('.sidebarCtrl');
  var _sidebarMenu = _sidebar.find('.menu');
  var _hasChild = _sidebarMenu.find('.hasChild>a');
  _sidebar.append('<button class="skip" type="button">回到側欄開關</button>');
  var _skipToSidebarCtrl = _sidebar.find('.skip');

  _hasChild.click(
    function(e){
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
    }
  )
  
  
  _sidebarCtrl.click(function(){
    if (_sidebar.hasClass('reveal')) {
      _sidebar.removeClass('reveal');
      _sidebarCtrl.removeClass('closeIt');
      _sidebarMask.fadeOut(400);
      _body.removeClass('noScroll');
    } else {
      _sidebar.addClass('reveal');
      _sidebarCtrl.addClass('closeIt');
      _sidebarMask.fadeIn(400);
      _body.addClass('noScroll')
    }
  })
  _sidebarMask.click(function(){
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt');
    _body.removeClass('noScroll');
    $(this).fadeOut(400);
  })

  _skipToSidebarCtrl.focus(function (){
    _sidebarCtrl.focus();
  })
  
  
  
  let winResizeTimer0;
  _window.resize(function () {
    clearTimeout(winResizeTimer0);
    ww = _window.width();
    winResizeTimer = setTimeout(function () {
      if(ww >= wwNormal) {
        _sidebarMask.hide();
        _body.removeClass('noScroll');
        _sidebar.removeClass('reveal');
        _sidebarCtrl.removeClass('closeIt');
      } else {
        _menu.hide().removeAttr('style');
      }
    }, 200);
  });
  /////////////// end /////////////////////////////////////////////
  
  
  // 版頭查詢區開合 /////////////////////////////////////////////
  var _searchCtrl = $('.searchCtrl');
  var _search = $('.search');
  _search.append('<button class="skip" type="button">回到控制開關</button>');
  var _skipSearch = _search.find('.skip');
  const srSpeed = 510;
  _searchCtrl.click(function(){
    if( _search.hasClass('reveal')) {
      _search.removeClass('reveal');
      setTimeout(function(){_search.hide()}, srSpeed);
    } else {
      _search.show(0, function(){
        _search.addClass('reveal');
        setTimeout (function(){_search.find('input[type="text"]').focus()}, srSpeed);
      });
    }
  })
  _skipSearch.focus(function(){
    _search.removeClass('reveal');
    setTimeout(function(){_search.hide()}, srSpeed);
    _searchCtrl.focus();
  })

  /////////////// end /////////////////////////////////////////////

  


  // ------------------------------------------ //
  // -------- 外掛套件 slick 參數設定 --------- //

  // 首頁大圖輪播
  $('.bigBanner').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade: false,
    infinite: true,
    zIndex:8
  });

  // 首頁《即時影音》
  $('.videoFlow ').find('.flowList').slick({
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
        settings: {slidesToShow: 2}
      },
      {
        breakpoint: 1000,
        settings: {slidesToShow: 3}
      }
    ]

  });

  // 首頁《主題專區》
  $('.topics').find('.flowList').slick({
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
        settings: {slidesToShow: 3}
      }
    ]
  });

  // 首頁《Contact Us》地圖與聯絡資訊切換 
  $('.mapList').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: true,
    infinite: true,
    asNavFor: '.cardList'
  });
  $('.cardBox').find('.cardList').slick({
    slidesToShow: 1,  
    slidesToScroll: 1,
    dots: true,
    fade: false,
    infinite: true,
    asNavFor: '.mapList'
  });

  // ---------- slick 參數設定：結束 --------- //
  // ------------------------------------------ //


  // 首頁《Contact Us》地圖與聯絡資訊切換：補上方區域名稱切換 //////////////////////////////
  var _navMapDots = $('.contactUs').find('.cardBox').find('.slick-dots');
  var _navMapLi = _navMapDots.find('li');
  const region = ["署本部", "臺北", "北區", "中區", "南區", "高屏", "東區"];
  for (let i=0 ; i<region.length ; i++) {
    _navMapLi.eq(i).find('button').text(region[i]);
  }
  _navMapDots.prependTo('.cardBox .cardList');
  _navMapLi.find('button').focus( function(){$(this).trigger('click');} )
  //////////////////////////////////////////////////////////////////////////////////////////



  // 複合功能圖示 /////////////////////////////////////////////
  // 文字大小和分享
  var _compIcon = $('.compound'); //li
  _compIcon.each(function(){
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
      _optItem.eq(i).css('z-index', count - i)
    }

    // 收合
    function glideUp() {
      for (let i = 0; i < count; i++) {
        _optList.stop(true, false).animate({ 'top': 0 }, speed);
        _optItem.eq(i).delay( speed * i * .4).stop(true, false).animate({ 'top': 0 }, speed, function(){
          if ( i == count-1) {_optList.height(0).hide()}
        });
      }
    }

    _controler.click(function(){
      if (_optList.is(':hidden')) {
        _optList.show();
        let height = _optItem.outerHeight(true);
        _optList.stop(true, false).animate({ 'top': height }, speed);
        for (let i = 0; i < count; i++) {
          _optItem.eq(i).delay( speed*i*.3 ).stop(true, false).animate({ 'top': height * i }, speed, function(){
            _optList.height( height * count);
          })
        }
      } else {
        glideUp();
      }
    })

    _optButton.add(_optLink).click(glideUp);
    _this.siblings().click(glideUp);
    _this.siblings().children('a, button').focus(glideUp);
  })
  
  /////////// font size 和 cookie /////////////////////////////////////////////
  // font size：顯示所選項目
  var _fontSize = $('.fontSize');
  var _fontSizeBtn = _fontSize.children('button');
  var _fsOption = _fontSize.find('ul>li>button');
  var _innerMain = $('.main.inner');

  _fsOption.click(function(){
    let fontClass = $(this).attr('class');
    _fontSizeBtn.removeClass().addClass(fontClass);
    _innerMain.removeClass('largeFont mediumFont smallFont').addClass(fontClass);
    createCookie('FontSize', fontClass , 365);
  })

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

    _innerMain.removeClass('largeFont mediumFont smallFont').addClass(cookie);
    _fontSizeBtn.removeClass().addClass(cookie);
  }

  // end //////////////////////////////////////////////////////////// //




  

















  // 可收合區
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
        _tray.stop(true, false).slideUp(speed, function(){
          _handle.addClass('openIt');
        })
      }
    })
  })


  // rwd Table
  // 把 th 的內容複製到對應的td的 data-th 屬性值
  _rwdTable = $('.rwdTable');
  _rwdTable.each( function(){
    let _this = $(this);
    let _th = _this.find('thead>tr>th');
    let count = _th.length;
    let _tr = _this.find('tbody').children('tr');

      _tr.each(function(){
        let _td = $(this).children('td');
        for ( let i = 0; i<count; i++ ) {
          _td.eq(i).attr('data-th', _th.eq(i).text());
        }
      })
  })






  //////////////////////////////////////////////
  // 燈箱 ---------------------------------------
  var _lightbox = $('.lightbox');
  var _hideLightbox = _lightbox.find('.closeThis');
  const lbxSpeed = 400;

  _lightbox.before('<div class="coverAll"></div>');
  _lightbox.append('<button type="button" class="skip">Go to the "close light box" button</button>');
  var _cover = $('.coverAll');
  var _skipToClose = _lightbox.find('.skip');

  _skipToClose.focus( function () {
    _hideLightbox.focus();
  })

  // 關燈箱
  _hideLightbox.click(function(){
    let _targetLbx = $(this).parents('.lightbox');
    _targetLbx.stop(true, false).fadeOut(lbxSpeed,
      function(){
        _cpBigPhoto.find('.flowList').find('li').hide();
      }
    );
    _targetLbx.prev(_cover).fadeOut(lbxSpeed);
    _body.removeClass('noScroll');
  })

  _cover.click(function(){
    let _targetLbx = $(this).next('.lightbox');
    $(this).fadeOut(lbxSpeed);
    _body.removeClass('noScroll');
    _targetLbx.stop(true, false).fadeOut(lbxSpeed,
      function(){
        _cpBigPhoto.find('.flowList').find('li').hide();
      }
    );
  })


  //////////////////////////////////////
  // .photoflow：cp頁的相關圖片（Related Photos）
  // 點擊圖片要開燈箱並顯示大圖
  var _photoflow = $('.photoflow');
  var _cpBigPhoto = $('.lightbox.bigPhotos');
  var photoIndex;
  
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
    let _indicator = _this.find(".flowNav>ul");
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
      // _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
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
          // _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
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
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }

    function slideForward(){
      _flowList.stop(true, false).animate({'margin-left': -1 * slideDistance }, speed, function(){
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
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
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
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });




    /////////////////************************** *//
    // 點擊.photoflow的圖片，開燈箱顯示大圖
    _flowItem.children('a').click(function(){
      photoIndex = $(this).parent().attr('data-index');
      _cpBigPhoto.stop(true, false).fadeIn().find('.flowList').find('li').filter( function(){
        return $(this).attr('data-index') == photoIndex;
      }).show();
      _hideLightbox.focus();
      _cover.stop(true, false).fadeIn();
    })

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



  // cp 頁大圖燈箱
  _cpBigPhoto.each(function(){
    let _this = $(this);
    let _photoBox = _this.find('.flowBox');
    let _photoList = _photoBox.find('.flowList');
    let _photoItem = _photoList.children('li');
    let photoCount = _photoItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 400;
    let i, j;

    _photoItem.hide();

    // 點擊向右箭頭
    _btnRight.click(function(){
      i = Number( _photoItem.filter(':visible').attr('data-index') );
      j = (i+1) % photoCount;

      _photoItem.filter( function(){
        return $(this).attr('data-index') == i;
      }).stop(true, false).fadeOut(speed, function(){
        $(this).hide();
      });
      _photoItem.filter( function(){
        return $(this).attr('data-index') == j;
      }).stop(true, false).fadeIn(speed);
    })
    
    // 點擊向左箭頭
    _btnLeft.click(function(){
      i = Number(_photoItem.filter(':visible').attr('data-index'));
      j = (i-1+photoCount) % photoCount;

      _photoItem.filter(function(){
        return $(this).attr('data-index') == i;
      }).stop(true, false).fadeOut(speed, function(){
        $(this).hide();
      });
      _photoItem.filter( function(){
        return $(this).attr('data-index') == j;
      }).stop(true, false).fadeIn(speed);
    })
  })



  // 計算照片張數
  var _countPhoto = $('.imgSlick').filter('.count');
  _countPhoto.each(function(){
    let _this = $(this);
    _this.prepend('<div class="photoCount"><span class="current" title="目前位置"></span><span class="total" title="總張數"></span></div>');
    let _photoCount = _this.find('.photoCount');
    let _current = _photoCount.find('.current');
    let _total = _photoCount.find('.total');
    let _countThis = _this.find('.slider-for');

    _total.text(_countThis.find('.slick-slide').length);
    _current.text( _countThis.find('.slick-current').index()+1);

    _this.find('.slick-arrow').add('.slick-slide').click( function(){
      _current.text( _countThis.find('.slick-current').index()+1);
    })
  })
  



  _body.keydown(function(e){
    // 未完成
    // // --- if mac
    // if ( (e.ctrlKey) && ( e.altKey ) && (e.keyCode != 17) && (e.keyCode != 18)  ) {
    //   if ( e.keyCode == 83 ) {
    //      _search.show().addClass('reveal');
    //   }
    // }

    // --- if windows
    if ( ( e.altKey ) && (e.keyCode != 18) ) {
      if ( e.keyCode == 83 ) {
        _search.show().addClass('reveal').find('input[type="text"]').focus();
      }
    }
  })

  // --end of-- 查詢區 -----------------------------------------------------


  // 分區業務組  ----------------------------------------------------20230619
  var _divisions = $('.divisions');
  var _showDivs = $('.showDivs>button');
  var _closeDivs = _divisions.find('.closeThis');
  var _divOffices = _divisions.find('.offices');
  var _eachOffice = _divOffices.find('li').find('li>a');
  var _officeInfo = _divOffices.find('.info');

  _showDivs.click( function(e){
    _divisions.stop(true, false).fadeIn(400);
    _closeDivs.focus();
    _body.addClass('noScroll');
    e.preventDefault;
  })

  _closeDivs.click( function(){
    _eachOffice.parent().removeClass('closeIt').find('.info').slideUp(200);
    _divisions.stop(true, false).fadeOut(400, function(){
      _showDivs.focus();
    });
    _body.removeClass('noScroll');
  })

  _eachOffice.click(function(e){
    let _thisOffice = $(this).parent('li');
    let _thisOfficeInfo  = _thisOffice.find('.info');
    if ( _thisOffice.hasClass('closeIt') ){
      _thisOffice.removeClass('closeIt');
      _thisOfficeInfo.slideUp(300);
    } else {
      _eachOffice.parent().removeClass('closeIt');
      _thisOffice.addClass('closeIt');
      _officeInfo.slideUp(300);
      _thisOfficeInfo.slideDown(300);
    }
    e.preventDefault;
  })
  
  // ***** //
  _divOffices.children('li:last-child').find('li:last-child').children('a').blur( function(){
    _closeDivs.focus();
  });

  


  // fatfooter 開合 -----------------------------------------------------
  var _fatFootCtrl = $('.fatFootCtrl');
  var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');
  const text1 = _fatFootCtrl.text();
  const text2 = _fatFootCtrl.attr('data-altText');

  _fatFootCtrl.click(function(){
    if ( _footSiteTree.is(':visible')) {
      _footSiteTree.slideUp();
      $(this).addClass('closed').text(text2);
    } else {
      _footSiteTree.slideDown();
      $(this).removeClass('closed').text(text1);
    }
  })


  // 向上捲動箭頭 //////////////////////////////
  var _goTop = $('.goTop');

  _goTop.click(function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800, function(){
      $('.goCenter').focus();
    });
  });

  _window.scroll(function () {
    if (_window.scrollTop() > 200) {
      _goTop.addClass('show');
    } else {
      _goTop.removeClass('show');
    }
  });
  // --end of-- 向上捲動箭頭 //////////////////////////////


})