(function() {
  var A_BOTTOM, A_LEFT, A_WIDTH, LOGO_FACTOR, LOGO_MARGIN, PAGE_FACTOR, adjustArrow, adjustLogo, arrowHeight, fixCurriculum;

  LOGO_FACTOR = 270 / 91;

  LOGO_MARGIN = 40;

  PAGE_FACTOR = .7;

  A_LEFT = 0.785;

  A_BOTTOM = 0.870252;

  A_WIDTH = 0.045475;

  fixCurriculum = function() {
    var EXP_LEN, X_END, X_START, bar_w, el, factor, scroll_top, _i, _len, _ref, _results;
    X_START = 40 + 128 - 10;
    X_END = $("#page").width() - 30;
    EXP_LEN = 200;
    bar_w = X_END - X_START - 15;
    $(".bar").width(bar_w);
    scroll_top = $(window).scrollTop();
    _ref = $(".bar_cover");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      factor = Math.min(Math.max(($(el).offset().top - scroll_top) / EXP_LEN, 0), 1);
      _results.push($(el).width(factor * bar_w));
    }
    return _results;
  };

  adjustLogo = function() {
    var $logo, logo_h, logo_w, m, stack, w;
    $logo = $("#svg_logo");
    w = $(window).width();
    logo_w = w * PAGE_FACTOR;
    logo_h = w * PAGE_FACTOR / LOGO_FACTOR;
    $logo.css({
      width: logo_w,
      height: logo_h
    });
    $logo.hide();
    $logo.show();
    $("#page").css({
      "padding-bottom": logo_h + LOGO_MARGIN
    });
    stack = logo_h + LOGO_MARGIN + $("#hero").outerHeight(true);
    m = $(window).height() - stack + LOGO_MARGIN;
    $("#hero").css({
      "margin-top": "" + m + "px"
    });
    return adjustArrow(logo_w, logo_h);
  };

  adjustArrow = function(logo_w, logo_h) {
    var $arrow, $body, $head, $tail, arrow_b, arrow_l, arrow_w, page_w;
    $arrow = $("#arrow");
    $head = $("#arrow_head");
    $body = $("#arrow_body");
    $tail = $("#arrow_tail");
    arrow_w = logo_w * A_WIDTH;
    arrow_l = LOGO_MARGIN + logo_w * A_LEFT - arrow_w / 2;
    arrow_b = LOGO_MARGIN + logo_h * A_BOTTOM;
    $head.css({
      "border-right": "" + arrow_w + "px solid transparent",
      "border-left": "" + arrow_w + "px solid transparent",
      "border-bottom": "" + arrow_w + "px solid #3ba4db"
    });
    $tail.css({
      "border-top": "" + (arrow_w / 2) + "px solid #3ba4db",
      "border-right": "" + (arrow_w / 2) + "px solid #3ba4db",
      "border-left": "" + (arrow_w / 2) + "px solid #3ba4db",
      "border-bottom": "" + (arrow_w / 2) + "px solid transparent",
      "margin-left": "" + (arrow_w / 2) + "px"
    });
    $body.css({
      "width": "" + arrow_w + "px",
      "margin-left": "" + (arrow_w / 2) + "px"
    });
    $arrow.css("left", arrow_l);
    $arrow.css("bottom", arrow_b);
    arrowHeight();
    $arrow.show();
    page_w = $body.offset().left + arrow_w + 30;
    return $("#page").width(page_w);
  };

  arrowHeight = function() {
    var arrow_height, dh, doc_top, from_top, scroll_percent, view_visible, wh;
    wh = $(window).height();
    dh = $(document).height();
    view_visible = wh / dh;
    from_top = -0.666 * view_visible + 0.666;
    scroll_percent = $(window).scrollTop() / (dh - wh);
    doc_top = $(window).scrollTop() + scroll_percent * from_top * wh;
    arrow_height = Math.max($("#arrow_tail").offset().top - doc_top, 128);
    $("#arrow_body").height(arrow_height);
    return fixCurriculum();
  };

  jQuery(function() {
    console.log($(document).height());
    adjustLogo();
    arrowHeight();
    $(window).resize(adjustLogo);
    $(window).scroll(arrowHeight);
    $(window).scrollTop($(document).height());
    $("#page").css({
      visibility: "visible"
    });
    return $("#svg_logo").load(function() {
      return console.log("SVG Loaded");
    });
  });

}).call(this);
