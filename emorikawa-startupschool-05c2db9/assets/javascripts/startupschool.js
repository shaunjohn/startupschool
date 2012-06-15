$(function() {
  $('.lightbox').lightBox({fixedNavigation:true});
  var $container = $('.track');
  $container.imagesLoaded(function(){
    $container.masonry({
      itemSelector : '.student_profile',
      columnWidth : 235
    });
  });
});
