LOGO_FACTOR = 270 / 91
LOGO_MARGIN = 40
PAGE_FACTOR = .7

A_LEFT = 0.785
A_BOTTOM = 0.870252
A_WIDTH = 0.045475

fixCurriculum = ->
  X_START = 40 + 128 - 10
  X_END = $("#page").width() - 30

  # How many pixels of scroll does it take to fully expand the bar
  EXP_LEN = 200

  bar_w = X_END - X_START - 15
  $(".bar").width(bar_w)

  scroll_top = $(window).scrollTop()
  for el in $(".bar_cover")
    factor = Math.min(Math.max(($(el).offset().top - scroll_top) / EXP_LEN, 0), 1)
    $(el).width(factor * bar_w)

adjustLogo = ->
  $logo = $("#svg_logo")
  w = $(window).width()
  logo_w = w * PAGE_FACTOR
  logo_h = w * PAGE_FACTOR / LOGO_FACTOR
  $logo.css
    width: logo_w
    height: logo_h
  $logo.hide()
  $logo.show()

  $("#page").css
    "padding-bottom": logo_h + LOGO_MARGIN

  stack = logo_h + LOGO_MARGIN + $("#hero").outerHeight(true)
  m = $(window).height() - stack + LOGO_MARGIN
  # m = $(window).height() - ($(document).height() - $("#hero").offset().top)
  $("#hero").css
    "margin-top":"#{m}px"

  adjustArrow(logo_w, logo_h)

adjustArrow = (logo_w, logo_h) ->
  $arrow = $("#arrow")
  $head = $("#arrow_head")
  $body = $("#arrow_body")
  $tail = $("#arrow_tail")


  arrow_w = logo_w * A_WIDTH
  arrow_l = LOGO_MARGIN + logo_w * A_LEFT - arrow_w / 2
  arrow_b = LOGO_MARGIN + logo_h * A_BOTTOM

  $head.css
    "border-right":"#{arrow_w}px solid transparent"
    "border-left":"#{arrow_w}px solid transparent"
    "border-bottom":"#{arrow_w}px solid #3ba4db"
  $tail.css
    "border-top":"#{arrow_w/2}px solid #3ba4db"
    "border-right":"#{arrow_w/2}px solid #3ba4db"
    "border-left":"#{arrow_w/2}px solid #3ba4db"
    "border-bottom":"#{arrow_w/2}px solid transparent"
    "margin-left":"#{arrow_w/2}px"
  $body.css
    "width":"#{arrow_w}px"
    "margin-left":"#{arrow_w/2}px"

  $arrow.css "left", arrow_l
  $arrow.css "bottom", arrow_b

  arrowHeight()

  $arrow.show()

  page_w = $body.offset().left + arrow_w + 30
  $("#page").width page_w

arrowHeight = ->
  wh = $(window).height()
  dh = $(document).height()
  view_visible = wh/dh

  # When scrolled to the bottom, this is the relative percentage from the WINDOW top we want the arrow to start at.
  from_top = -0.666 * view_visible + 0.666

  # The percent down the page the user has scrolled
  scroll_percent = $(window).scrollTop() / (dh - wh)

  # The absolute position of where the arrowhead should end up. Affected by both window height and scroll position.
  doc_top = $(window).scrollTop() + scroll_percent * from_top * wh

  # Set the arrow height to a positive number
  arrow_height = Math.max($("#arrow_tail").offset().top - doc_top, 128)
  $("#arrow_body").height(arrow_height)

  fixCurriculum()

jQuery ->

  console.log $(document).height()
  adjustLogo()
  arrowHeight()
  $(window).resize adjustLogo
  $(window).scroll arrowHeight

  $(window).scrollTop($(document).height())
  $("#page").css
    visibility:"visible"

  $("#svg_logo").load ->
    console.log "SVG Loaded"
