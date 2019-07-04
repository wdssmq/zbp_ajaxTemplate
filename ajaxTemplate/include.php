<?php
#注册插件
RegisterPlugin("ajaxTemplate", "ActivePlugin_ajaxTemplate");

function ActivePlugin_ajaxTemplate()
{
  // Add_Filter_Plugin('Filter_Plugin_Html_Js_Add', 'ajaxTemplate_html_js_add');
  Add_Filter_Plugin('Filter_Plugin_Zbp_BuildTemplate', 'ajaxTemplate_Zbp_BuildTemplate');
}

function ajaxTemplate_Zbp_BuildTemplate(&$templates)
{
  global $zbp;
  global $bloghost;
  $parsedUrl = parse_url($bloghost);
  $config = unserialize($zbp->Config('ajaxTemplate')->selectors);
  $callbackIng = $zbp->Config('ajaxTemplate')->callbackIng;
  $callbackEd = $zbp->Config('ajaxTemplate')->callbackEd;
  $path = $parsedUrl['path'];
  if ($path !== '/') {
    $path = substr($path, 0, strrpos($path, '/'));
  }

  $ajax = file_get_contents($zbp->path . "zb_users/plugin/ajaxTemplate/var/ajax.js");

  $ajax = str_replace("-replaceSelector-", json_encode($config), $ajax);
  $ajax = str_replace("-callbackIng-", $callbackIng, $ajax);
  $ajax = str_replace("-callbackEd-", $callbackEd, $ajax);

  file_put_contents($zbp->path . "zb_users/plugin/ajaxTemplate/usr/ajax.js", $ajax);

  $templates['footer'] = str_replace('{$footer}', '<script src="' . $zbp->host . 'zb_users/plugin/ajaxTemplate/var/page.min.js"></script>{$footer}', $templates['footer']);
  $templates['footer'] = str_replace('{$footer}', '<script src="' . $zbp->host . 'zb_users/plugin/ajaxTemplate/var/ajaxtemplate.js"></script>{$footer}', $templates['footer']);
  $templates['footer'] = str_replace('{$footer}', '<script src="' . $zbp->host . 'zb_users/plugin/ajaxTemplate/usr/ajax.js"></script>{$footer}', $templates['footer']);
}

// function ajaxTemplate_html_js_add()
// {

//   global $zbp;
//   global $bloghost;
//   $parsedUrl = parse_url($bloghost);
//   $config = unserialize($zbp->Config('ajaxTemplate')->selectors);
//   $callbackIng = $zbp->Config('ajaxTemplate')->callbackIng;
//   $callbackEd = $zbp->Config('ajaxTemplate')->callbackEd;
//   $path = $parsedUrl['path'];
//   if ($path !== '/') {
//     $path = substr($path, 0, strrpos($path, '/'));
//   }

//   echo "\n" . '; document.writeln("<script src=\"' . $bloghost . 'zb_users/plugin/ajaxTemplate/ajaxtemplate.js\"></script><script src=\"' . $bloghost . 'zb_users/plugin/ajaxTemplate/page.js\"></script>");';
//   echo '$(function() {';
//   echo '$.ajaxTemplate({host: "' . $path . '", replaceSelector: ' . json_encode($config) . '}, function(pageObject) {' . $callbackIng . '}, function(pageObject, xhrData) {' . $callbackEd . '});';
//   echo '});';
//   echo "\n";
// }

function InstallPlugin_ajaxTemplate()
{
  global $zbp;
  $zbp->BuildTemplate();
}
function UninstallPlugin_ajaxTemplate()
{
  global $zbp;
  $zbp->BuildTemplate();
}
