(function() {
  var A_BOTTOM, A_LEFT, A_WIDTH, LOGO_FACTOR, LOGO_MARGIN, PAGE_FACTOR, adjustArrow, adjustLogo, arrowHeight, fixCurriculum, formSubmission, headers, limitChar, limitWord, onResize, onScroll, show_scroll, validateForm;

  LOGO_FACTOR = 270 / 91;

  LOGO_MARGIN = 40;

  PAGE_FACTOR = .8;

  A_LEFT = 0.7820;

  A_BOTTOM = 0.65;

  A_WIDTH = 0.048;

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
    return headers('fix_width');
  };

  show_scroll = 0;

  onScroll = function() {
    if (show_scroll === 10) $("#scroll_up").fadeOut('slow');
    arrowHeight();
    fixCurriculum();
    headers();
    return show_scroll += 1;
  };

  headers = function(fix_width) {
    var $header, $section, h, header, nav_h, scroll_top, section_headers, _i, _j, _len, _len2, _results;
    if (fix_width == null) fix_width = false;
    section_headers = $("h1.section_header");
    scroll_top = $(window).scrollTop();
    h = section_headers.outerHeight();
    if (fix_width === true || fix_width === 'fix_width') {
      section_headers.width($("#page").width() - 100);
    }
    nav_h = 0;
    for (_i = 0, _len = section_headers.length; _i < _len; _i++) {
      header = section_headers[_i];
      if ($(header).css('position') === "fixed") nav_h += h;
    }
    _results = [];
    for (_j = 0, _len2 = section_headers.length; _j < _len2; _j++) {
      header = section_headers[_j];
      $section = $("#" + ($(header).data("section")));
      $header = $(header);
      if ($header.css('position') === "fixed") {
        if (scroll_top + nav_h > $section.offset().top) {
          _results.push(null);
        } else {
          $header.css('position', 'absolute');
          _results.push($header.css('top', $section.offset().top - h));
        }
      } else {
        if (scroll_top + nav_h > $section.offset().top - h) {
          $header.css('position', 'fixed');
          _results.push($header.css('top', h * $(header).data("order")));
        } else {
          _results.push($header.css('top', $section.offset().top - h));
        }
      }
    }
    return _results;
  };

  arrowHeight = function() {
    var $arrow_body, arrow_height, dh, doc_top, from_top, scroll_percent, view_visible, wh;
    wh = $(window).height();
    dh = $(document).height();
    view_visible = wh / dh;
    from_top = -0.666 * view_visible + 0.666;
    scroll_percent = $(window).scrollTop() / (dh - wh);
    doc_top = $(window).scrollTop() + scroll_percent * from_top * wh;
    $arrow_body = $("#arrow_body");
    arrow_height = Math.max($arrow_body.offset().top + $arrow_body.height() - doc_top, 10);
    $arrow_body.stop(true);
    return $arrow_body.animate({
      height: "" + arrow_height + "px"
    }, 70);
  };

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

  formSubmission = function(e) {
    var data;
    e.preventDefault();
    $(".help-inline").html("");
    if (validateForm()) {
      data = $(this).serializeObject();
      console.log(data);
      $.post("pages/wufoo", data, function(r) {
        var error, id, _i, _len, _ref;
        console.log(r);
        if (r.Success === 1) {
          $(window).scrollTop(0);
          $("#application").fadeOut();
          return $("#success").fadeOut();
        } else {
          if (r.FieldErrors != null) {
            _ref = r.FieldErrors;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              error = _ref[_i];
              id = $("input[name='app[" + error.ID + "]'],textarea[name='app[" + error.ID + "]']").attr('id');
              console.log("" + id + "_error");
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

  jQuery(function() {
    onResize();
    $("h1.section_header").show();
    $(window).resize(onResize);
    $(window).scroll(onScroll);
    $(window).scrollTop($(document).height());
    $("#page").css({
      visibility: "visible"
    });
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
    return $("h1.section_header").click(function() {
      var $section, correction;
      $section = $("#" + ($(this).data("section")));
      correction = $(this).offset().top - $(window).scrollTop() + $(this).height();
      return $("body,html").animate({
        scrollTop: $section.offset().top - correction
      });
    });
  });

}).call(this);
