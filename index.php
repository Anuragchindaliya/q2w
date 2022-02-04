<?php
//--->get app url > start

if (
  isset($_SERVER['HTTPS']) &&
  ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) ||
  isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
  $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https'
) {
  $ssl = 'https';
} else {
  $ssl = 'http';
}

$app_url = ($ssl)
  . "://" . $_SERVER['HTTP_HOST']
  //. $_SERVER["SERVER_NAME"]
  . (dirname($_SERVER["SCRIPT_NAME"]) == DIRECTORY_SEPARATOR ? "" : "/")
  . trim(str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])), "/");

//--->get app url > end

header("Access-Control-Allow-Origin: *");

//app url
define("APPURL", $app_url);
define("AJAX_URL", $app_url . '/api');

//absolute path to root directory of app
define("ABSPATH", str_replace("\\", "/",  dirname(__FILE__)));



//libs
include_once ABSPATH . '/routes/libs/class_AltoRouter.php';
include_once ABSPATH . '/routes/libs/class_SimpleDBClass.php';




$router = new AltoRouter();
$base_path = trim(str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])), "/");
$router->setBasePath($base_path ? "/" . $base_path : "");


//--->rountes
include_once ABSPATH . '/routes/app-route.php';



// match current request url
$match = $router->match();

// call closure or throw 404 status
if ($match && is_callable($match['target'])) {
  call_user_func_array($match['target'], array_values($match['params']));
} else {

  // no route was matched

  $app_url_asset = APPURL;
  die(APPURL . ' > 404 page');
}
