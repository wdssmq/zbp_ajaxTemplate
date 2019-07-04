(function($) {
  $("[href*='zb_system'],[href='javascipt:;']").each(function() {
    $(this).attr("rel", "external");
  });

  // 刷新CSS
  let addLinks = function(elDoc) {
    const head = document.getElementsByTagName("head")[0];
    let elLinks = elDoc.getElementsByTagName("link");
    let nLinks = [];
    for (let i = 0; i < elLinks.length; i++) {
      const elem = elLinks[i],
        rel = elem.rel;
      if (typeof rel != "string" || rel.length == 0 || rel == "stylesheet") {
        let href = elem.getAttribute("href");
        if (head.querySelector(`link[href^="${href}"]`)) {
          continue;
        }
        // console.log(href);
        // console.log(head.querySelector(`link[href^="${href}"]`));
        nLinks[i] = document.createElement("link");
        nLinks[i].rel = "stylesheet";
        nLinks[i].href = elem.getAttribute("href");
        head.appendChild(nLinks[i]);
      }
    }
  };
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
      // console.log(pageObject);
      // console.log(location);

      if (isThisPage) {
        // if (pageObject.pathname.indexOf(location.pathname) > -1) {
        //   return;
        // }

        callbacking(pageObject);
        $.get(pageObject.canonicalPath, function(data) {
          let domParser = new DOMParser();
          let $parsed = $(domParser.parseFromString(data, "text/html"));

          // console.log($parsed);

          $.each(options.replaceSelector, function(index, value) {
            $parsed.find(value).replaceAll(value);
          });

          addLinks($parsed[0]);

          $("body,html").animate(
            {
              scrollTop: pageObject.hash
                ? $(`#${pageObject.hash}`).offset().top - 159
                : 0
            },
            500
          );
          $("[href*='zb_system'],[href='javascipt:;']").each(function() {
            $(this).attr("rel", "external");
          });
          callbacked(pageObject, data);
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
