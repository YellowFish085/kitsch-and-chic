<?php
include_once "functions.php";

switch ($_POST['action']) {
	case 'list':
		if ( !empty($_POST['data']['articles']) ) {
			echo render('list_articles', $_POST['data']);
		}
		else {
			echo render('list_articles_empty');
		}
		break;

	case 'show':
		if ( !empty($_POST['data']) ) {
			echo render('article', $_POST['data']);
		}
		else {
			echo render('article_not_found');
		}
}
?>