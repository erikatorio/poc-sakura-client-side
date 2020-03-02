$(document).ready(function () {
  $(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  $(".scroll-to-top").click(function (event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "fast");
    return false;
  });

  $("#showReports").click(function () {
    if ($('#allReports').css("display") === "none") {
      $("#allReports").show();
      $('#showReports').text("Hide Reports")
    } else if ($('#allReports').css("display") === "block") {
      $("#allReports").hide();
      $('#showReports').text("All Reports");
    }
  });
})