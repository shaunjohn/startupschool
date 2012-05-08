# LOGO_FACTOR = 1484 / 500 # Ratio of width to height
# LOGO_MARGIN = 40 # Static pixel margins around the logo
# PAGE_FACTOR = .8 # How much of the page the logo takes up

SIZE_CUTOFF = 640

# Relative position of the left side of the arrow relative to the logo's left.
# A_LEFT = 0.7820
# A_LEFT = 0.7820
# Relative position of the bottom of the arrow relative to the logo's bottom.
# A_BOTTOM = 0.870252
# A_BOTTOM = 0.65
A_BOTTOM = 0.70
# Relative width of the arrow relative to the logo's width
A_WIDTH = 0.048
# A_WIDTH = 0.048
CONTENT_H = 0
nav_opacity = {} # Keeps track of nav opacity for hover


updateCache = ->
  window.cache =
    row_width: $(".row").width()
    icon_width: $(".icon").width()

# Adjusts the Cirriculum bars. Fired on scroll

# Sets the logo size and position and blank padding space above the logo
window.adjustLogo = ->
  $logo = $(".logo")

  # if $(window).width() < SIZE_CUTOFF
  #   # $("#call_to_action").hide()
  #   $logo.attr("src", "img/BSS_Logo_256x761.png")
  # else
  #   # $("#call_to_action").show()
  #   $logo.attr("src", "img/BSS_Logo_500x1484_noarrow.png")

  # w = $(window).width()
  # logo_w = w * PAGE_FACTOR
  # logo_h = w * PAGE_FACTOR / LOGO_FACTOR

  # Needed important flags for svg resizing
  # $logo.css
  #   width: "#{logo_w}px !important"
  #   height: "#{logo_h}px !important"
  # $logo.attr 'width', "#{logo_w}px !important"
  # $logo.attr 'height', "#{logo_h}px !important"

  # $logo_svg = $($logo[0].contentDocument).find("svg")
  # if $logo_svg.length
  #   $logo_svg.attr "width", "#{logo_w}px"
  #   $logo_svg.attr "height", "#{logo_h}px"
  #   $logo_svg.attr "viewBox", "0 0 #{logo_w} #{logo_h}"
  #   $logo_svg.attr "enable-background", "new 0 0 #{logo_w} #{logo_h}"
  #   $logo_svg.css
  #     width: "#{logo_w}px !important"
  #     height: "#{logo_h}px !important"

  # # Setting padding so no content accidentally flows over the logo.
  # $("#page").css
  #   "padding-bottom": logo_h + LOGO_MARGIN

  # $logo.hide()
  # $logo.show()

  # Calculate how much empty space we should generate above the logo to ensure
  # a clean landing page.
  # stack = logo_h + LOGO_MARGIN + $("#hero").outerHeight()
  m = $(window).height() - $("#hero").height()
  m = Math.max(m, 80)
  $("#hero").css
    "margin-top":"#{m}px"

  # Adjust the arrow too.
  adjustArrow()

# Sizes the arrow proporationally to the logo and positions it properly
adjustArrow = () ->
  logo_h = $(".logo").outerHeight(true)

  $arrow = $("#arrow")
  $head = $("#arrow_head")
  $body = $("#arrow_body")

  $arrow.show()
  # if $(window).width() < SIZE_CUTOFF
  #   A_LEFT = 1
  #   $arrow.css "visibility", "hidden"
  # else
  #   A_LEFT = 0.7820
  #   $arrow.css "visibility", "visible"

  arrow_w = $(".logo").outerWidth() * A_WIDTH
  # arrow_l = logo_w * A_LEFT - arrow_w / 2
  arrow_b = logo_h * A_BOTTOM
  $head.css
    "border-right":"#{arrow_w}px solid transparent"
    "border-left":"#{arrow_w}px solid transparent"
    "border-bottom":"#{arrow_w}px solid #3ba4db"
  $body.css
    "width":"#{arrow_w}px"
    "margin-left":"#{arrow_w/2}px"
  $("#arrow_track").css
    "height":"#{CONTENT_H+140}px"
    "width":"#{arrow_w}px"
    "margin-left":"-#{(arrow_w+2)/2}px"

  # $arrow.css "left", arrow_l
  $arrow.css "bottom", arrow_b

  arrowHeight()

  # page_w = $body.offset().left + arrow_w + 30
  # $("#page").width page_w

onResize = ->
  CONTENT_H = $(document).height() - $("#hero").outerHeight(true)
  updateCache()
  adjustLogo()
  fixCurriculum()
  # headers('fix_width')
  setupElements()
  adjustLogo() # Re-setup now that elements have been setup
  slideTo()
  onScroll()

show_scroll = 0
instructions_shown = false
instruction_show_time = null
onScroll = ->

  # Sometimes on heavy load conditions we will miss the 5th scroll. Keep
  # checking for a bit more afterwards to ensure we get rid of the element
  if show_scroll >= 15 and show_scroll < 20
    $("#scroll_up").fadeOut('slow')
    $(".nav_item").animate
      opacity:100

  if not instructions_shown
    if $(window).scrollTop() < $("#instruction_header").offset().top + 5
      instruction_show_time = new Date().getTime()
      $("#instruction_header").trigger("click")
      instructions_shown = true

  arrowHeight()
  fixCurriculum()
  doNavColoring()
  # headers()

  show_scroll += 1

# headers = (fix_width=false)->
#   section_headers = $(".section_header")
#   scroll_top = $(window).scrollTop()
#   h = section_headers.outerHeight()
# 
#   # Fade out the 'Apply now' button if we're close to the apply section
#   d_apply = Math.min(Math.abs(scroll_top - $("#apply").offset().top), 1500)
#   opacity = Math.max(1/750 * d_apply - 1, 0)
#   $("#call_to_action").css
#     opacity:opacity
# 
#   if fix_width is true or fix_width is 'fix_width'
#     section_headers.width $("#page").width() - 100
# 
#   # Determine which are currently fixed and how high the stack is.
#   nav_h = 0
#   nav_bot_h = 0
#   for header in section_headers
#     if $(header).hasClass('fixed_top') then nav_h += h
#     else if $(header).hasClass('fixed_bot') then nav_bot_h += h
# 
#   win_h = $(window).height()
#   for header in section_headers
#     $section = $("##{$(header).data("section")}")
#     section_top = $section.offset().top
#     $header = $(header)
#     num_sections = $(".section_header").length - 1
# 
#     if $header.hasClass('fixed_top')
#       if scroll_top + nav_h > section_top
#         null
#       else
#         $header.css 'position', 'absolute'
#         $header.removeClass 'fixed_bot'
#         $header.removeClass 'fixed_top'
#         $header.css('top', section_top - h)
#     else if $header.hasClass('fixed_bot')
#       if scroll_top + win_h - nav_bot_h + h < section_top
#         null
#       else
#         $header.css 'position', 'absolute'
#         $header.removeClass 'fixed_bot'
#         $header.removeClass 'fixed_top'
#         $header.css('top', section_top - h)
#     else
#       # The header is positioned absolutely, determine which fixed mode it should be in given the position on the page
#       if scroll_top + nav_h > section_top - h
#         $header.css 'position', 'fixed'
#         $header.css('bottom', 'auto')
#         $header.css('top', h * $(header).data("order"))
#         $header.removeClass 'fixed_bot'
#         $header.addClass 'fixed_top'
#       else if $header.offset().top + h + nav_bot_h > scroll_top + win_h
#         $header.css 'position', 'fixed'
#         $header.css('top', 'auto')
#         $header.css('bottom', h * (num_sections - $(header).data("order")))
#         $header.addClass 'fixed_bot'
#         $header.removeClass 'fixed_top'
#       else
#         $header.css('top', section_top - h)

# Adjusts the height of the arrow on page resize or scroll
arrowHeight = ->
  if show_scroll < 10 then return

  # if $(window).width() < SIZE_CUTOFF
  #   if $("#arrow_body").height() < 20 then return
  #   else
  #     $("#arrow_body").animate
  #       height:"#20px"
  #     ,70
  #     return
  $("#arrow_body").animate
    height:"#20px"
  ,70

  wh = $(window).height()
  dh = $(document).height()
  $arrow_body = $("#arrow_body")

  # We're scrolled near the bottom
  if $(window).scrollTop() + wh + 40 > dh
    arrow_height = 20
  else
    view_visible = wh/dh

    # When scrolled to the bottom, this is the relative percentage from the WINDOW top we want the arrow to start at.
    from_top = -0.666 * view_visible + 0.666

    # The percent down the page the user has scrolled
    scroll_percent = $(window).scrollTop() / (dh - wh)

    # The absolute position of where the arrowhead should end up. Affected by both window height and scroll position.
    doc_top = $(window).scrollTop() + scroll_percent * from_top * wh

    # Set the arrow height to a positive number
    arrow_height = Math.max($arrow_body.offset().top + $arrow_body.height() - doc_top, 10)
    $arrow_body.stop(true)

  $arrow_body.animate
    height:"#{arrow_height}px"
  ,70

fixCurriculum = ->
  # Position of the start of the sliding bar
  # X_START = 40 + 128 - 10
  # End position of the sliding bar
  # X_END = $("#page").width()

  # How many pixels of scroll does it take to fully expand the bar
  EXP_LEN = $(window).height() / 4

  # bar_w = X_END - X_START
  bar_w = cache.row_width - cache.icon_width
  $(".bar").width(bar_w)

  if $(window).width() >= SIZE_CUTOFF
    scroll_top = $(window).scrollTop()
    for el in $(".bar_cover")
      factor = Math.min(Math.max(($(el).offset().top - scroll_top) / EXP_LEN, 0), 1)
      $(el).width(factor * bar_w)
  else
    $(".bar_cover").width bar_w

setFormErrorState = ->
  $(".form_error_area").show()
  $("#submit_application").html("Fix Errors & Try Again")
  onScroll()
clearFormErrorState = ->
  $(".form_error_area").hide()
  $("#submit_application").html("Submit Application")
  onScroll()

formSubmission = ->
  $(".help-inline").html ""
  if validateForm()
    data = $("#application").serializeObject()
    $.post "pages/wufoo", data, (r) ->
      if r.Success is 1
        submit_delta = Math.round((new Date().getTime() - instruction_show_time) / 1000)
        mpq.track("Submit Application Success", {"time_to_submit":submit_delta, "mp_note":"A user successfully submitted an application. They took #{submit_delta} seconds to fill it out."})

        $(window).scrollTop(0)
        $("#instructions_container").hide()
        $("#application").fadeOut ->
          onScroll()
        $("#success").fadeIn ->
          onScroll()
      else
        if r.FieldErrors?
          setFormErrorState()
          mpq.track("Submit Application Error", {"time_to_submit":submit_delta, "mp_note":"A user tried to submit an application but had errors. They took #{submit_delta} seconds to fill it out."})
          for error in r.FieldErrors
            id = $("input[name='app[#{error.ID}]'],textarea[name='app[#{error.ID}]']").attr('id')
            $("##{id}_error").html error.ErrorText
          onScroll()
  else
    setFormErrorState()
    submit_delta = Math.round((new Date().getTime() - instruction_show_time) / 1000)
    mpq.track("Submit Application Error", {"time_to_submit":submit_delta, "mp_note":"A user tried to submit an application but had errors. They took #{submit_delta} seconds to fill it out."})
    onScroll()
  return false

# Catch submission, validate, send it to wufoo backend and display results.
gettingStarted = ->
  data = $("#getting_started").serializeObject()
  $.post "pages/wufoo", data, (r) ->
    if r.Success is 1
      mpq.track("Submit Getting Started Success", {"mp_note":"A user successfully signed up."})

      showApplication()
      $("#awesome").show()
    else
      if r.FieldErrors?
        for error in r.FieldErrors
          id = $("input[name='app[#{error.ID}]']").attr('id')
          $("##{id}_error").html error.ErrorText
        onScroll()
  return false

window.showApplication = ->
  $("#application").slideDown 400, ->
    onScroll()
  $("#getting_started").slideUp()
  $("#instructions_container").fadeIn()
  $("#instructions").css('top',"-#{$('#instruction_content').outerHeight()}px")
  $("#instructions").removeClass('opened')
  $("#email").val($("#getting_started_email").val())

window.hideApplication = ->
  $("#application").slideUp()
  $("#getting_started").slideDown 500, ->
    onScroll()
  $("#instructions_container").fadeOut()
  $("#instructions").css('top',"-#{$('#instruction_content').outerHeight()}px")
  $("#instructions").removeClass('opened')
  $("#getting_started_email").val($("#email").val())
  onScroll()

# Custom front-end form validators
validateForm = ->
  num_errors = 0

  if $("#name").val().split(" ").length < 2
    num_errors += 1
    $("#name_error").html "Only 'Cher' can have one name. What's your FULL name?"
  if $("#name").val() is ""
    num_errors += 1
    $("#name_error").html "If you don't give us a name, we'll make one up for you (not)"

  if $("#email").val() is ""
    num_errors += 1
    $("#email_error").html "We need your email. How else would we get in touch with you"

  if $("input[type=radio]:checked").length is 0
    num_errors += 1
    $("#track_error").html "Please choose a track"

  if $("#whoami").val().length > 140
    num_errors += 1
    $("#whoami_error").html "Too many characters! Be concise please."
  if $("#whoami").val() is ""
    num_errors += 1
    $("#whoami_error").html "Please give us a short bio."

  if $("#social").val() is ""
    num_errors += 1
    $("#social_error").html "Give us some indication of stuff you've done"

  if $("#the_why").val() is ""
    num_errors += 1
    $("#the_why_error").html "Come on, aren't you interested?"

  if $("#accomplished").val() is ""
    num_errors += 1
    $("#accomplished_error").html "It can even be that volcano you built in 1st grade."

  if $("#good_hire").val().length > 250
    num_errors += 1
    $("#good_hire_error").html "Too many characters! Be concise please."
  if $("#good_hire").val() is ""
    num_errors += 1
    $("#good_hire_error").html "Please indicate some amount of awesomeness."

  if $("#other").val().split(" ").length > 250
    num_errors += 1
    $("#other_error").html "Too many words! Be concise please."

  if num_errors > 0
    return false
  else
    return true

# Limits the characters to `limit`
limitChar = (limit) ->
  c = ".#{$(@).attr("id")}_count"
  len = $(@).val().length

  if len > limit
    new_val = $(@).val().substr(0,limit)
    $(@).val new_val
    # So we show the correct length
    len -= 1

  $(c).html "#{len}/#{limit} characters"

# Limits the words to `limit`. Words are defined as any non blank text
# separated by a space.
limitWord = (limit) ->
  c = ".#{$(@).attr("id")}_count"
  word_arr = $(@).val().split(" ")
  # Remove white space array elements from split
  word_arr = word_arr.filter (word) ->
    if word == "" then false else true
  len = word_arr.length

  if len > limit
    crop = word_arr.slice(0,limit)
    new_val = crop.join(" ")
    $(@).val new_val
    # So we show the correct length
    len -= 1

  $(c).html "#{len}/#{limit} words"

# Helper method that turns the form into a nice javascript object
jQuery.fn.serializeObject = ->
  arrayData = @serializeArray()
  objectData = {}

  $.each arrayData, ->
    if @value? then value = @value else value = ''

    if objectData[@name]?
      unless objectData[@name].push
        objectData[@name] = [objectData[@name]]

      objectData[@name].push value
    else
      objectData[@name] = value

  return objectData

setupElements = ->
  # window.addEventListener 'SVGLoad', (e) ->
  #   adjustLogo()

  $(".section_header").show()

  $("#instructions").css
    top:"-#{$("#instruction_content").outerHeight()}px"
  # Need to make sure hidden container
  h = $("#instruction_header").outerHeight() + 10
  $("#instructions_container").height h

  # cta_t = $(".logo").outerHeight(true)
  # $("#call_to_action").css
  #   bottom:"#{cta_t - $("#call_to_action").outerHeight()}px"

  $("#page, #scroll_up, #arrow_track").css
    visibility:"visible"

  $(window).scrollTop($(document).height())

  # if $(window).width() < SIZE_CUTOFF
  #   $("#scroll_up").hide()

retrieveForm = ->
  if window.localStorage?
    for el in $("input[type=text], textarea")
      key = $(el).attr('name')
      val = localStorage.getItem key
      $(el).val(val)
  else 
    $(".no_save").show()
    return false

saveForm = ->
  if window.localStorage?
    for el in $("input[type=text], textarea")
      key = $(el).attr('name')
      val = $(el).val()
      localStorage.setItem key, val
  else return false

doNavColoring = ->
  select_section_id = ""
  page_top = $(window).scrollTop()
  page_bot = page_top + $(window).height()
  page_h = page_bot - page_top
  for section in $("section")
    sec_top = $(section).offset().top
    sec_bot = sec_top + $(section).outerHeight()
    sec_h = sec_bot - sec_top
    sec_id = $(section).attr("id")

    if sec_top - page_top < 0 and page_bot - sec_bot < 0
      # Div entirely in page and therefore 100%
      percent_showing = 1
    else
      percent_from_top = Math.min(sec_h, sec_bot - page_top) / sec_h
      percent_from_bot = Math.min(sec_h, page_bot - sec_top) / sec_h
      percent_showing = Math.min(percent_from_top, percent_from_bot)
      percent_showing = Math.max(percent_showing, 0)

    nav_opacity["nav_#{sec_id}"] = percent_showing

    if percent_showing > 0 and select_section_id == ""
      select_section_id = sec_id

    $("#nav_#{sec_id}").find(".nav_bg").css
      opacity:percent_showing

  $("#nav_selector").val(select_section_id)

  # Only update if we're not programmatically scrolling.
  if window.scrolling is false and window.enableHashUpdates is true
    window.location.hash = "!/#{select_section_id}"

# Videos inserted asynchronously after the page loads
placeVideos = ->
  w = $("#video_one").width()
  h = w * 0.5625
  $("#video_one").append """
    <iframe src="http://fast.wistia.com/embed/iframe/518902fe54?videoWidth=640&amp;videoHeight=360&amp;controlsVisibleOnLoad=true&amp;plugin%5BpostRoll%5D%5Bversion%5D=v1&amp;plugin%5BpostRoll%5D%5Btext%5D=Learn%20more%20at%26nbsp%3Bhttp%3A%2F%2Fviximo.com&amp;plugin%5BpostRoll%5D%5Blink%5D=http%3A%2F%2Fviximo.com%2Fwant-join-team-awesome&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5BbackgroundColor%5D=%23616161&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5Bcolor%5D=%23ffffff&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5BfontSize%5D=36px&amp;plugin%5BpostRoll%5D%5Bstyle%5D%5BfontFamily%5D=Gill%20Sans%2C%20Helvetica%2C%20Arial%2C%20sans-serif" allowtransparency="true" frameborder="0" class="wistia_embed video_frame" name="wistia_embed" width="#{w}px" height="#{h}px"></iframe>
  """

  $("#video_two").append """
    <iframe class="video_frame" src="http://player.vimeo.com/video/39066066" width="#{w}px" height="#{h}px" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
  """

  $("#video_three").append """
    <iframe class="video_fram" width="#{w}" height="#{h}" src="http://www.youtube.com/embed/9V_7aSj0-jI" frameborder="0" allowfullscreen></iframe>
  """

# slideTo sets the hash variable. The hashchange event triggers the
# slide_to section.
slideTo = ->
  $("html, body").stop(true, true) # Stop previous animations
  section = window.location.hash[3..window.location.hash.length]
  if section is "" or section is "!/"then return
  $section = $("##{section}")
  header_height = $section.prev("h1").outerHeight()
  nav_h = if $("#top_nav:visible").length is 0 then 0 else $("#top_nav").outerHeight()
  window.scrolling = true
  $("html, body").animate
    scrollTop : $section.offset().top - header_height - nav_h
  , ->
    window.scrolling = false

navigateTo = (section) ->
  window.clicked = true
  window.location.hash = "!/#{section}"

hashChanged = ->
  # Determine whether the hash changed because we clicked something, or
  # just scrolled to a different part of the page
  if window.clicked
    slideTo()
    window.clicked = false

events = ->
  $(window).on("hashchange", hashChanged)

  $("*[rel=popover]").popover({placement:'top'})

  placeVideos()

  # Bind resizing and scrolling
  $(window).resize onResize
  $(window).scroll onScroll
  $("#page")[0].ontouchmove = onScroll

  $("input, textarea").blur saveForm
  $("input, textarea").focus clearFormErrorState

  $("#submit_getting_started").click ->
    gettingStarted()
  $("#submit_application").click ->
    formSubmission()

  $("#whoami").keyup (e) ->
    limitChar.call(@, 140)

  $("#good_hire").keyup (e) ->
    limitChar.call(@, 250)

  $("#other").keyup (e) ->
    limitWord.call(@, 250)

  $(".section_header").click ->
    $section = $("##{$(@).data("section")}")
    correction = $(@).data("order") * $(@).height() + $(@).height()
    $("body,html").animate
      scrollTop: $section.offset().top - correction

  $(".show_application").click ->
    email = $("#getting_started_email").val()
    mpq.track("Show Application", {"user_email":email, "mp_note":"User with email #{email} viewed the full application"})
    showApplication()

  $(".hide_application").click hideApplication

  # $("#call_to_action").click ->
  #   scroll_pos = $(window).scrollTop() / ($(document).height() - $(window).height()) * 100
  #   mpq.track("Apply Now", {"scroll_pos":scroll_pos, "mp_note":"Sidebar Apply Now call to action clicked at #{scroll_pos}% on the page"})
  #   $section = $("#apply")
  #   correction = $(@).offset().top - $(window).scrollTop() + $(@).height()
  #   $("body,html").animate
  #     scrollTop: $section.offset().top - correction
  #   ,'slow'

  $("#apply_now_btn").click ->
    navigateTo "apply"

  $(".instruction_toggle").click ->
    $instructions = $("#instructions")
    $container = $("#instructions_container")
    if $instructions.hasClass "opened"
      $instructions.animate
        top:"-#{$('#instruction_content').outerHeight()}px"
      , ->
        $container.height($("#instruction_header").outerHeight() + 10)
      $instructions.toggleClass "opened"
      $("#toggle_instructions").html "open"
    else
      h = $("#instruction_header").outerHeight() + $("#instruction_content").outerHeight() + 20
      $container.height h
      $instructions.animate
        top:"0px"
      $instructions.toggleClass "opened"
      $("#toggle_instructions").html "close"

  # NAVIGATION
  $("#floating_nav > ul > li").click ->
    navigateTo $(@).data("section_id")
  $("#floating_nav > ul > li").hover ->
    $(@).find(".nav_bg").css
      opacity : 1
  , ->
    $(@).find(".nav_bg").css
      opacity : nav_opacity[$(@).attr("id")]


  $("#nav_selector").change (e) ->
    navigateTo $(@).val()

  $("#apply_now_top_nav").click (e) ->
    navigateTo "apply"

placeImages = ->
  for img in $(".post_load_img")
    $img = $(img)
    $img.load onResize
    pwidth = $img.parent().width()
    if pwidth <= 320 then size = "small"
    else if pwidth > 320 and pwidth <= 640 then size = "medium"
    else if pwidth > 640 then size = "large"
    else size = "large"

    base_name = $img.data("base_name")
    format = $img.data("format")
    $img.attr("src", "img/#{base_name}_#{size}.#{format}")


jQuery ->

  # Setup the logo and arrow height for the first time
  events()
  placeImages()
  onResize()

  retrieveForm()
  doNavColoring()

  $(window).scrollTop($(document).height())

  # Go to the appropriate section if there's a hash in the url
  slideTo()
  window.scrolling = false

  # Scroll events are triggered all the time while elements load onto the
  # page (a side effect of trying to always have the bottom in focus).
  # Delay scroll-based hash updates for a bit after the page loads to
  # prevent this issue.
  window.enableHashUpdates = false
  setTimeout -> 
    window.enableHashUpdates = true
  , 1000
