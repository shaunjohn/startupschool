(function() {
  var A_BOTTOM, A_WIDTH, CONTENT_H, SIZE_CUTOFF, adjustArrow, arrowHeight, clearFormErrorState, doNavColoring, events, fixCurriculum, formSubmission, gettingStarted, instruction_show_time, instructions_shown, limitChar, limitWord, nav_opacity, onResize, onScroll, placeVideos, retrieveForm, saveForm, setFormErrorState, setupElements, show_scroll, updateCache, validateForm;

  SIZE_CUTOFF = 640;

  A_BOTTOM = 0.74;

  A_WIDTH = 0.048;

  CONTENT_H = 0;

  nav_opacity = {};

  updateCache = function() {
    return window.cache = {
      row_width: $(".row").width(),
      icon_width: $(".icon").width()
    };
  };

  window.adjustLogo = function() {
    var $logo, m;
    $logo = $(".logo");
    m = $(window).height() - $("#hero").height();
    m = Math.max(m, 80);
    $("#hero").css({
      "margin-top": "" + m + "px"
    });
    return adjustArrow();
  };

  adjustArrow = function() {
    var $arrow, $body, $head, arrow_b, arrow_w, logo_h;
    logo_h = $(".logo").outerHeight(true);
    $arrow = $("#arrow");
    $head = $("#arrow_head");
    $body = $("#arrow_body");
    $arrow.show();
    arrow_w = $(".logo").outerWidth() * A_WIDTH;
    arrow_b = logo_h * A_BOTTOM;
    $head.css({
      "border-right": "" + arrow_w + "px solid transparent",
      "border-left": "" + arrow_w + "px solid transparent",
      "border-bottom": "" + arrow_w + "px solid #3ba4db"
    });
    $body.css({
      "width": "" + arrow_w + "px",
      "margin-left": "" + (arrow_w / 2) + "px"
    });
    $("#arrow_track").css({
      "height": "" + (CONTENT_H + 140) + "px",
      "width": "" + arrow_w + "px",
      "margin-left": "-" + ((arrow_w + 2) / 2) + "px"
    });
    $arrow.css("bottom", arrow_b);
    return arrowHeight();
  };

  onResize = function() {
    CONTENT_H = $(document).height() - $("#hero").outerHeight(true);
    updateCache();
    adjustLogo();
    fixCurriculum();
    setupElements();
    return adjustLogo();
  };

  show_scroll = 0;

  instructions_shown = false;

  instruction_show_time = null;

  onScroll = function() {
    if (show_scroll === 10) {
      $("#scroll_up").fadeOut('slow');
      $(".nav_item").animate({
        opacity: 100
      });
    }
    if (!instructions_shown) {
      if ($(window).scrollTop() < $("#instruction_header").offset().top + 5) {
        instruction_show_time = new Date().getTime();
        $("#instruction_header").trigger("click");
        instructions_shown = true;
      }
    }
    arrowHeight();
    fixCurriculum();
    return show_scroll += 1;
  };

  arrowHeight = function() {
    var $arrow_body, arrow_height, dh, doc_top, from_top, scroll_percent, view_visible, wh;
    if (show_scroll < 10) return;
    $("#arrow_body").animate({
      height: "#20px"
    }, 70);
    wh = $(window).height();
    dh = $(document).height();
    $arrow_body = $("#arrow_body");
    if ($(window).scrollTop() + wh + 40 > dh) {
      arrow_height = 20;
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
    var EXP_LEN, bar_w, el, factor, scroll_top, _i, _len, _ref, _results;
    EXP_LEN = 400;
    bar_w = cache.row_width - cache.icon_width;
    $(".bar").width(bar_w);
    if ($(window).width() >= SIZE_CUTOFF) {
      scroll_top = $(window).scrollTop();
      _ref = $(".bar_cover");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        factor = Math.min(Math.max(($(el).offset().top - scroll_top) / EXP_LEN, 0), 1);
        _results.push($(el).width(factor * bar_w));
      }
      return _results;
    } else {
      return $(".bar_cover").width(bar_w);
    }
  };

  setFormErrorState = function() {
    $(".form_error_area").show();
    $("#submit_application").html("Fix Errors & Try Again");
    return onScroll();
  };

  clearFormErrorState = function() {
    $(".form_error_area").hide();
    $("#submit_application").html("Submit Application");
    return onScroll();
  };

  formSubmission = function() {
    var data, submit_delta;
    $(".help-inline").html("");
    if (validateForm()) {
      data = $("#application").serializeObject();
      $.post("pages/wufoo", data, function(r) {
        var error, id, submit_delta, _i, _len, _ref;
        if (r.Success === 1) {
          submit_delta = Math.round((new Date().getTime() - instruction_show_time) / 1000);
          mpq.track("Submit Application Success", {
            "time_to_submit": submit_delta,
            "mp_note": "A user successfully submitted an application. They took " + submit_delta + " seconds to fill it out."
          });
          $(window).scrollTop(0);
          $("#application").fadeOut(function() {
            return onScroll();
          });
          return $("#success").fadeIn(function() {
            return onScroll();
          });
        } else {
          if (r.FieldErrors != null) {
            setFormErrorState();
            mpq.track("Submit Application Error", {
              "time_to_submit": submit_delta,
              "mp_note": "A user tried to submit an application but had errors. They took " + submit_delta + " seconds to fill it out."
            });
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
      setFormErrorState();
      submit_delta = Math.round((new Date().getTime() - instruction_show_time) / 1000);
      mpq.track("Submit Application Error", {
        "time_to_submit": submit_delta,
        "mp_note": "A user tried to submit an application but had errors. They took " + submit_delta + " seconds to fill it out."
      });
      onScroll();
    }
    return false;
  };

  gettingStarted = function() {
    var data;
    data = $("#getting_started").serializeObject();
    console.log(data);
    $.post("pages/wufoo", data, function(r) {
      var error, id, _i, _len, _ref;
      if (r.Success === 1) {
        mpq.track("Submit Getting Started Success", {
          "mp_note": "A user successfully signed up."
        });
        showApplication();
        return $("#awesome").show();
      } else {
        console.log("ERROR", r);
        if (r.FieldErrors != null) {
          _ref = r.FieldErrors;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            error = _ref[_i];
            id = $("input[name='app[" + error.ID + "]']").attr('id');
            $("#" + id + "_error").html(error.ErrorText);
          }
          return onScroll();
        }
      }
    });
    return false;
  };

  window.showApplication = function() {
    $("#application").slideDown(400, function() {
      return onScroll();
    });
    $("#getting_started").slideUp();
    $("#instructions_container").fadeIn();
    $("#instructions").css('top', "-" + ($('#instruction_content').outerHeight()) + "px");
    $("#instructions").removeClass('opened');
    return $("#email").val($("#getting_started_email").val());
  };

  window.hideApplication = function() {
    $("#application").slideUp();
    $("#getting_started").slideDown(500, function() {
      return onScroll();
    });
    $("#instructions_container").fadeOut();
    $("#instructions").css('top', "-" + ($('#instruction_content').outerHeight()) + "px");
    $("#instructions").removeClass('opened');
    $("#getting_started_email").val($("#email").val());
    return onScroll();
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
      $("#the_why_error").html("Come on, aren't you interested?");
    }
    if ($("#accomplished").val() === "") {
      num_errors += 1;
      $("#accomplished_error").html("It can even be that volcano you built in 1st grade.");
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
    var h;
    $(".section_header").show();
    $("#instructions").css({
      top: "-" + ($("#instruction_content").outerHeight()) + "px"
    });
    h = $("#instruction_header").outerHeight() + 10;
    $("#instructions_container").height(h);
    $("#page, #scroll_up, #arrow_track").css({
      visibility: "visible"
    });
    return $(window).scrollTop($(document).height());
  };

  retrieveForm = function() {
    var el, key, val, _i, _len, _ref, _results;
    if (window.localStorage != null) {
      _ref = $("input[type=text], textarea");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        key = $(el).attr('name');
        val = localStorage.getItem(key);
        _results.push($(el).val(val));
      }
      return _results;
    } else {
      $(".no_save").show();
      return false;
    }
  };

  saveForm = function() {
    var el, key, val, _i, _len, _ref, _results;
    if (window.localStorage != null) {
      _ref = $("input[type=text], textarea");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        key = $(el).attr('name');
        val = $(el).val();
        _results.push(localStorage.setItem(key, val));
      }
      return _results;
    } else {
      return false;
    }
  };

  doNavColoring = function() {
    var page_bot, page_h, page_top, percent_from_bot, percent_from_top, percent_showing, sec_bot, sec_h, sec_id, sec_top, section, _i, _len, _ref, _results;
    page_top = $(window).scrollTop();
    page_bot = page_top + $(window).height();
    page_h = page_bot - page_top;
    _ref = $("section");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      sec_top = $(section).offset().top;
      sec_bot = sec_top + $(section).outerHeight();
      sec_h = sec_bot - sec_top;
      sec_id = $(section).attr("id");
      if (sec_top - page_top < 0 && page_bot - sec_bot < 0) {
        percent_showing = 1;
      } else {
        percent_from_top = Math.min(sec_h, sec_bot - page_top) / sec_h;
        percent_from_bot = Math.min(sec_h, page_bot - sec_top) / sec_h;
        percent_showing = Math.min(percent_from_top, percent_from_bot);
        percent_showing = Math.max(percent_showing, 0);
      }
      nav_opacity["nav_" + sec_id] = percent_showing;
      _results.push($("#nav_" + sec_id).find(".nav_bg").css({
        opacity: percent_showing
      }));
    }
    return _results;
  };

  placeVideos = function() {
    var h, w;
    w = $("#video_one").width();
    h = w * 0.5625;
    $("#video_one").append("<iframe src=\"http://fast.wistia.com/embed/iframe/518902fe54?videoWidth=640&amp;videoHeight=360&amp;controlsVisibleOnLoad=true&amp;plugin%5BpostRoll%5D%5Bversion%5D=v1&amp;plugin%5BpostRoll%5D%5Btext%5D=Learn%20more%20at%26nbsp%3Bhttp%3A%2F%2Fviximo.com&amp;plugin%5BpostRoll%5D%5Blink%5D=http%3A%2F%2Fviximo.com%2Fwant-join-team-awesome&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5BbackgroundColor%5D=%23616161&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5Bcolor%5D=%23ffffff&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5BfontSize%5D=36px&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5BfontFamily%5D=Gill%20Sans%2C%20Helvetica%2C%20Arial%2C%20sans-serif\" allowtransparency=\"true\" frameborder=\"0\" class=\"wistia_embed\" name=\"wistia_embed\" width=\"" + w + "px\" height=\"" + h + "px\"></iframe>");
    return $("#video_two").append("<iframe src=\"http://player.vimeo.com/video/39066066\" width=\"" + w + "px\" height=\"" + h + "px\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
  };

  events = function() {
    placeVideos();
    $(window).resize(onResize);
    $(window).scroll(onScroll);
    $("input, textarea").blur(saveForm);
    $("input, textarea").focus(clearFormErrorState);
    $("#submit_getting_started").click(function() {
      console.log("GETTING STARTED CLICK");
      return gettingStarted();
    });
    $("#submit_application").click(function() {
      console.log("APPLICATION SUBMISSION CLICK");
      return formSubmission();
    });
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
    $(".show_application").click(function() {
      var email;
      email = $("#getting_started_email").val();
      mpq.track("Show Application", {
        "user_email": email,
        "mp_note": "User with email " + email + " viewed the full application"
      });
      return showApplication();
    });
    $(".hide_application").click(hideApplication);
    $(".instruction_toggle").click(function() {
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
    $("#floating_nav > ul > li").click(function() {
      return $("html, body").animate({
        scrollTop: $("#" + ($(this).data("section_id"))).offset().top - 70
      });
    });
    $("#floating_nav > ul > li").hover(function() {
      return $(this).find(".nav_bg").css({
        opacity: 1
      });
    }, function() {
      return $(this).find(".nav_bg").css({
        opacity: nav_opacity[$(this).attr("id")]
      });
    });
    return $(window).scroll(doNavColoring);
  };

  jQuery(function() {
    events();
    onResize();
    retrieveForm();
    doNavColoring();
    return $(window).scrollTop($(document).height());
  });

}).call(this);
