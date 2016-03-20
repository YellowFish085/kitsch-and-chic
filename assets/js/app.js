$(document).ready(function() {
	$.when(
		$.getScript('/assets/js/components/Article.js'),
		$.getScript('/assets/js/components/TemplateEngine.js'),
		$.Deferred(function(deferred){
			$(deferred.resolve)
		})
	).done(function(){
		initApp()
	})
	.fail(function(e) {
		console.error(e.responseText)
	})
})

// Init app
function initApp() {
	TemplateEngine.initInstance('content')

	Article.initDatas()
		.done( function() {
			processView()
		})
		.fail( function() {
			alert('ERROR: Could not load the json file.')
		})

	setEvents()
}

// Events
function setEvents() {
	$('body').on('click', 'a', function(e) {
		e.preventDefault()
		History.pushState(null, e.target.title, e.target.href)
	})

	window.onstatechange = function() {
		console.log('|| state change')
		processView()
	}
}

// Check the url params and call the template method
function processView() {
	TemplateEngine.getInstance().displayPreloader()

	var params = getUrlParameters()

	if (params.length == 1) {
		if (params[0] == 'about') {
			console.Log('|| Display about')
		}
		else {
			console.log('|| Display articles from ' + params[0] + ' category')
			displayArticles(params[0])
		}
	}
	else if (params.length == 2) {
		if (params[0] == 'article') {
			console.log('|| Display article ' + params[1])
			displayArticle(params[1])
		}
		else {
			console.log('|| Display articles from ' + params[0] + '/' + params[1] + ' subcategory')
			displayArticles(params[1])
		}
	}
	else {
		console.log('|| Display all articles')
		displayAllArticles()
	}
}

function displayAllArticles() {
	/*
	$.ajax({
		url: '/ajax/article.php',
		type: 'POST',
		data: {action: 'list', data: Article.getInstance().all()}
	})
		.done( function(data) {
	    $("#content").html(data)
		})
	*/
}

function displayArticles(category) {
	TemplateEngine.getInstance().getTemplate('articles', Article.getInstance().findByCategory(category))
}

function displayArticle( id) {
	/*
	var article = Article.getInstance().find(id)

	$.ajax({
		url: '/ajax/article.php',
		type: 'POST',
		data: {action: 'show', data: article}
	})
		.done( function(data) {
	    $("#content").html(data)
		})
	*/
}

// Helper methods
function getUrlParameters() {
	var params = window.location.pathname.split("/");

	while (params[0] == "") {
		params.shift();
	}
	while (params[params.length-1] == "") {
		params.pop();
	}

	return params;
}