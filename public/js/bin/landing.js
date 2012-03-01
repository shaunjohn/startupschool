(function() {
  var A_BOTTOM, A_LEFT, A_WIDTH, LOGO_FACTOR, LOGO_MARGIN, PAGE_FACTOR, adjustArrow, arrowHeight, events, fixCurriculum, formSubmission, headers, instructions_shown, limitChar, limitWord, onResize, onScroll, setupElements, show_scroll, validateForm;

  LOGO_FACTOR = 1484 / 500;

  LOGO_MARGIN = 40;

  PAGE_FACTOR = .8;

  A_LEFT = 0.7820;

  A_BOTTOM = 0.65;

  A_WIDTH = 0.048;

  window.adjustLogo = function() {
    var $logo, logo_h, logo_w, m, stack, w;
    $logo = $("#svg_logo");
    w = $(window).width();
    logo_w = w * PAGE_FACTOR;
    logo_h = w * PAGE_FACTOR / LOGO_FACTOR;
    $logo.css({
      width: "" + logo_w + "px !important",
      height: "" + logo_h + "px !important"
    });
    $logo.attr('width', "" + logo_w + "px !important");
    $logo.attr('height', "" + logo_h + "px !important");
    $("#page").css({
      "padding-bottom": logo_h + LOGO_MARGIN
    });
    stack = logo_h + LOGO_MARGIN + $("#hero").outerHeight();
    m = $(window).height() - stack + LOGO_MARGIN;
    $("#hero").css({
      "margin-top": "" + m + "px"
    });
    return adjustArrow(logo_w, logo_h);
  };

  adjustArrow = function(logo_w, logo_h) {
    var $arrow, $body, $head, arrow_b, arrow_l, arrow_w, page_w;
    $arrow = $("#arrow");
    $head = $("#arrow_head");
    $body = $("#arrow_body");
    arrow_w = logo_w * A_WIDTH;
    arrow_l = LOGO_MARGIN + logo_w * A_LEFT - arrow_w / 2;
    arrow_b = LOGO_MARGIN + logo_h * A_BOTTOM;
    $head.css({
      "border-right": "" + arrow_w + "px solid transparent",
      "border-left": "" + arrow_w + "px solid transparent",
      "border-bottom": "" + arrow_w + "px solid #3ba4db"
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

  onResize = function() {
    adjustLogo();
    fixCurriculum();
    headers('fix_width');
    return setupElements();
  };

  show_scroll = 0;

  instructions_shown = false;

  onScroll = function() {
    if (show_scroll === 10) $("#scroll_up").fadeOut('slow');
    if (!instructions_shown) {
      if ($(window).scrollTop() < $("#instruction_header").offset().top + 5) {
        $("#instruction_header").trigger("click");
        instructions_shown = true;
      }
    }
    arrowHeight();
    fixCurriculum();
    headers();
    return show_scroll += 1;
  };

  headers = function(fix_width) {
    var $header, $section, d_apply, h, header, nav_bot_h, nav_h, num_sections, opacity, scroll_top, section_headers, section_top, win_h, _i, _j, _len, _len2, _results;
    if (fix_width == null) fix_width = false;
    section_headers = $(".section_header");
    scroll_top = $(window).scrollTop();
    h = section_headers.outerHeight();
    d_apply = Math.min(Math.abs(scroll_top - $("#apply").offset().top), 1500);
    opacity = Math.max(1 / 750 * d_apply - 1, 0);
    $("#call_to_action").css({
      opacity: opacity
    });
    if (fix_width === true || fix_width === 'fix_width') {
      section_headers.width($("#page").width() - 100);
    }
    nav_h = 0;
    nav_bot_h = 0;
    for (_i = 0, _len = section_headers.length; _i < _len; _i++) {
      header = section_headers[_i];
      if ($(header).hasClass('fixed_top')) {
        nav_h += h;
      } else if ($(header).hasClass('fixed_bot')) {
        nav_bot_h += h;
      }
    }
    win_h = $(window).height();
    _results = [];
    for (_j = 0, _len2 = section_headers.length; _j < _len2; _j++) {
      header = section_headers[_j];
      $section = $("#" + ($(header).data("section")));
      section_top = $section.offset().top;
      $header = $(header);
      num_sections = $(".section_header").length - 1;
      if ($header.hasClass('fixed_top')) {
        if (scroll_top + nav_h > section_top) {
          _results.push(null);
        } else {
          $header.css('position', 'absolute');
          $header.removeClass('fixed_bot');
          $header.removeClass('fixed_top');
          _results.push($header.css('top', section_top - h));
        }
      } else if ($header.hasClass('fixed_bot')) {
        if (scroll_top + win_h - nav_bot_h + h < section_top) {
          _results.push(null);
        } else {
          $header.css('position', 'absolute');
          $header.removeClass('fixed_bot');
          $header.removeClass('fixed_top');
          _results.push($header.css('top', section_top - h));
        }
      } else {
        if (scroll_top + nav_h > section_top - h) {
          $header.css('position', 'fixed');
          $header.css('bottom', 'auto');
          $header.css('top', h * $(header).data("order"));
          $header.removeClass('fixed_bot');
          _results.push($header.addClass('fixed_top'));
        } else if ($header.offset().top + h + nav_bot_h > scroll_top + win_h) {
          $header.css('position', 'fixed');
          $header.css('top', 'auto');
          $header.css('bottom', h * (num_sections - $(header).data("order")));
          $header.addClass('fixed_bot');
          _results.push($header.removeClass('fixed_top'));
        } else {
          _results.push($header.css('top', section_top - h));
        }
      }
    }
    return _results;
  };

  arrowHeight = function() {
    var $arrow_body, arrow_height, dh, doc_top, from_top, scroll_percent, view_visible, wh;
    if (show_scroll < 10) return;
    wh = $(window).height();
    dh = $(document).height();
    $arrow_body = $("#arrow_body");
    if ($(window).scrollTop() + wh + 40 > dh) {
      arrow_height = 2;
    } else {
      view_visible = wh / dh;
      from_top = -0.666 * view_visible + 0.666;
      scroll_percent = $(window).scrollTop() / (dh - wh);
      doc_top = $(window).scrollTop() + scroll_percent * from_top * wh;
      arrow_height = Math.max($arrow_body.offset().top + $arrow_body.height() - doc_top, 10);
      $arrow_body.stop(true);
    }
    return $arrow_body.animate({
      height: "" + arrow_height + "px"
    }, 70);
  };

  fixCurriculum = function() {
    var EXP_LEN, X_END, X_START, bar_w, el, factor, scroll_top, _i, _len, _ref, _results;
    X_START = 40 + 128 - 10;
    X_END = $("#page").width() - 30;
    EXP_LEN = 400;
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

  formSubmission = function(e) {
    var data;
    e.preventDefault();
    $(".help-inline").html("");
    if (validateForm()) {
      data = $(this).serializeObject();
      $.post("pages/wufoo", data, function(r) {
        var error, id, _i, _len, _ref;
        if (r.Success === 1) {
          $(window).scrollTop(0);
          $("#application").fadeOut();
          return $("#success").fadeIn();
        } else {
          if (r.FieldErrors != null) {
            _ref = r.FieldErrors;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              error = _ref[_i];
              id = $("input[name='app[" + error.ID + "]'],textarea[name='app[" + error.ID + "]']").attr('id');
              $("#" + id + "_error").html(error.ErrorText);
            }
            return onScroll();
          }
        }
      });
    } else {
      onScroll();
    }
    return false;
  };

  validateForm = function() {
    var num_errors;
    num_errors = 0;
    if ($("#name").val().split(" ").length < 2) {
      num_errors += 1;
      $("#name_error").html("Only 'Cher' can have one name. What's your FULL name?");
    }
    if ($("#name").val() === "") {
      num_errors += 1;
      $("#name_error").html("If you don't give us a name, we'll make one up for you (not)");
    }
    if ($("#email").val() === "") {
      num_errors += 1;
      $("#email_error").html("We need your email. How else would we get in touch with you");
    }
    if ($("input[type=radio]:checked").length === 0) {
      num_errors += 1;
      $("#track_error").html("Please choose a track");
    }
    if ($("#whoami").val().length > 140) {
      num_errors += 1;
      $("#whoami_error").html("Too many characters! Be concise please.");
    }
    if ($("#whoami").val() === "") {
      num_errors += 1;
      $("#whoami_error").html("Please give us a short bio.");
    }
    if ($("#social").val() === "") {
      num_errors += 1;
      $("#social_error").html("Give us some indication of stuff you've done");
    }
    if ($("#the_why").val() === "") {
      num_errors += 1;
      $("#the_why_error").html("Come on, a 60 second video is super simple. You can do it with your phone.");
    }
    if ($("#accomplished").val() === "") {
      num_errors += 1;
      $("#accomplished_error").html("Come on, a 60 second video is super simple. You can do it with your phone.");
    }
    if ($("#good_hire").val().length > 250) {
      num_errors += 1;
      $("#good_hire_error").html("Too many characters! Be concise please.");
    }
    if ($("#good_hire").val() === "") {
      num_errors += 1;
      $("#good_hire_error").html("Please indicate some amount of awesomeness.");
    }
    if ($("#other").val().split(" ").length > 250) {
      num_errors += 1;
      $("#other_error").html("Too many words! Be concise please.");
    }
    if (num_errors > 0) {
      return false;
    } else {
      return true;
    }
  };

  limitChar = function(limit) {
    var c, len, new_val;
    c = "." + ($(this).attr("id")) + "_count";
    len = $(this).val().length;
    if (len > limit) {
      new_val = $(this).val().substr(0, limit);
      $(this).val(new_val);
      len -= 1;
    }
    return $(c).html("" + len + "/" + limit + " characters");
  };

  limitWord = function(limit) {
    var c, crop, len, new_val, word_arr;
    c = "." + ($(this).attr("id")) + "_count";
    word_arr = $(this).val().split(" ");
    word_arr = word_arr.filter(function(word) {
      if (word === "") {
        return false;
      } else {
        return true;
      }
    });
    len = word_arr.length;
    if (len > limit) {
      crop = word_arr.slice(0, limit);
      new_val = crop.join(" ");
      $(this).val(new_val);
      len -= 1;
    }
    return $(c).html("" + len + "/" + limit + " words");
  };

  jQuery.fn.serializeObject = function() {
    var arrayData, objectData;
    arrayData = this.serializeArray();
    objectData = {};
    $.each(arrayData, function() {
      var value;
      if (this.value != null) {
        value = this.value;
      } else {
        value = '';
      }
      if (objectData[this.name] != null) {
        if (!objectData[this.name].push) {
          objectData[this.name] = [objectData[this.name]];
        }
        return objectData[this.name].push(value);
      } else {
        return objectData[this.name] = value;
      }
    });
    return objectData;
  };

  setupElements = function() {
    var cta_t, h;
    $(".section_header").show();
    $("#instructions").css({
      top: "-" + ($("#instruction_content").outerHeight()) + "px"
    });
    h = $("#instruction_header").outerHeight() + 10;
    $("#instructions_container").height(h);
    cta_t = $("#svg_logo").outerHeight() + LOGO_MARGIN;
    $("#call_to_action").css({
      bottom: "" + (cta_t - $("#call_to_action").outerHeight()) + "px"
    });
    $("#page, #scroll_up, #call_to_action").css({
      visibility: "visible"
    });
    return $(window).scrollTop($(document).height());
  };

  events = function() {
    $(window).resize(onResize);
    $(window).scroll(onScroll);
    $("#application").submit(formSubmission);
    $("#whoami").keyup(function(e) {
      return limitChar.call(this, 140);
    });
    $("#good_hire").keyup(function(e) {
      return limitChar.call(this, 250);
    });
    $("#other").keyup(function(e) {
      return limitWord.call(this, 250);
    });
    $(".section_header").click(function() {
      var $section, correction;
      $section = $("#" + ($(this).data("section")));
      correction = $(this).data("order") * $(this).height() + $(this).height();
      return $("body,html").animate({
        scrollTop: $section.offset().top - correction
      });
    });
    $("#call_to_action").click(function() {
      var $section, correction;
      $section = $("#apply");
      correction = $(this).offset().top - $(window).scrollTop() + $(this).height();
      return $("body,html").animate({
        scrollTop: $section.offset().top - correction
      }, 'slow');
    });
    return $(".instruction_toggle").click(function() {
      var $container, $instructions, h;
      $instructions = $("#instructions");
      $container = $("#instructions_container");
      if ($instructions.hasClass("opened")) {
        $instructions.animate({
          top: "-" + ($('#instruction_content').outerHeight()) + "px"
        }, function() {
          return $container.height($("#instruction_header").outerHeight() + 10);
        });
        $instructions.toggleClass("opened");
        return $("#toggle_instructions").html("open");
      } else {
        h = $("#instruction_header").outerHeight() + $("#instruction_content").outerHeight() + 20;
        $container.height(h);
        $instructions.animate({
          top: "0px"
        });
        $instructions.toggleClass("opened");
        return $("#toggle_instructions").html("close");
      }
    });
  };

  jQuery(function() {
    events();
    onResize();
    return $(window).scrollTop($(document).height());
  });

}).call(this);
