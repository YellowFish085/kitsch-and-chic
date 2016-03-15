<?php
function render($template, $datas = null) {
	ob_start();

	if (!empty($datas)) {
		extract($datas, EXTR_SKIP);
	}

	$r = '';
	include('./templates/' . $template . '.php');

	return $r;
}
?>