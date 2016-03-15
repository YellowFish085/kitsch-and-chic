<?php
$r .= '<div class="articles">';
foreach ($articles as $key => $article) {
	$r .= '<div class="article">';
	$r .= '<h3><a href="/article/' . $article['id'] . '" title="' . $article['title'] . '">' . $article['title'] . '</a></h3>';
	$r .=	'<h4>' . $article['author'] . '</h3>';
	$r .= '<p>' . $article['content'] . '</p>';
	$r .= '</div>';
}
$r .= '</div>';
?>