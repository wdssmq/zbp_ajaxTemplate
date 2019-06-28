(function($) {
  $("[href*='zb_system']").each(function() {
    $(this).attr("rel", "external");
  });
  /**
   * 配置
   * @type {Object}
   */
  var options = {
    host: "/",
    replaceSelector: []
  };
  /**
   * 主程序函数
   */
  function ajaxTemplate(callbacking, callbacked) {
    var isThisPage = false;
    if ($.type(options.replaceSelector) != "array") {
      return false;
    }
    page.base(options.host);
    page("*", function(pageObject) {
      // console.log(isThisPage);

      if (isThisPage) {
        if (location.href.indexOf(pageObject.path) > -1) {
          return;
        }

        callbacking(pageObject);
        $.get(pageObject.canonicalPath, function(data) {
          var domParser = new DOMParser();
          var $parsed = $(domParser.parseFromString(data, "text/html"));
          $.each(options.replaceSelector, function(index, value) {
            $parsed.find(value).replaceAll(value);
          });
          // !pageObject.hash &&
          callbacked(pageObject, data);
          $("body,html").animate(
            {
              scrollTop: pageObject.hash
                ? $(`#${pageObject.hash}`).offset().top - 159
                : 0
            },
            500
          );
        });
      }
      isThisPage = true;
    });
    page();
    // page.start(options);
    return true;
  }
  /**
   * ajaxTemplate
   */
  $.ajaxTemplate = $.fn.ajaxTemplate = function() {
    var optionsByUser = {};
    var callbacking = null;
    var callbacked = null;

    if (arguments.length === 2) {
      callbacking = arguments[0];
      callbacked = arguments[1];
    } else if (arguments.length === 1) {
      options = arguments[0];
    } else {
      optionsByUser = arguments[0];
      callbacking = arguments[1];
      callbacked = arguments[2];
    }

    $.extend(options, optionsByUser);
    ajaxTemplate.call(this, callbacking, callbacked);

    return this;
  };
})(jQuery);
