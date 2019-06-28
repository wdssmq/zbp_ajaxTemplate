$(function() {
  $.ajaxTemplate(
    { host: "/", replaceSelector: -replaceSelector-},
    function(pageObject) {-callbackIng-},
    function(pageObject, xhrData) {-callbackEd-}
  );
});
