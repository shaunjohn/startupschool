(function() {
  var A_BOTTOM, A_LEFT, A_WIDTH, LOGO_FACTOR, LOGO_MARGIN, PAGE_FACTOR, adjustArrow, adjustCTA, adjustLogo;

  LOGO_FACTOR = 270 / 91;

  LOGO_MARGIN = 40;

  PAGE_FACTOR = .7;

  A_LEFT = 0.785;

  A_BOTTOM = 0.870252;

  A_WIDTH = 0.045475;

  adjustLogo = function() {
    var $logo, logo_h, logo_w, w;
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
    return adjustArrow(logo_w, logo_h);
  };

  adjustArrow = function(logo_w, logo_h) {
    var $arrow, $body, $head, $tail, arrow_b, arrow_height, arrow_l, arrow_w;
    $arrow = $("#arrow");
    $head = $("#arrow > .arrow_head");
    $body = $("#arrow > .arrow_body");
    $tail = $("#arrow > .arrow_tail");
    arrow_height = $(window).height() * .5;
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
      "height": "" + arrow_height + "px",
      "margin-left": "" + (arrow_w / 2) + "px"
    });
    $arrow.css("left", arrow_l);
    $arrow.css("bottom", arrow_b);
    return $arrow.show();
  };

  adjustCTA = function() {
    var $cta;
    return $cta = $("#call_to_action");
  };

  jQuery(function() {
    $(window).resize(adjustLogo);
    return adjustLogo();
  });

}).call(this);
