var Article = (function() {
	var instance;

	function init() {
		// Singleton
		// Private
		var articles;

		return {
			// Public
			loadArticles: function() {
				return	$.ajax({
									url: '/assets/json/articles.json',
									cache: false,
									contentType: "application/json; charset=utf-8",
									dataType: "json"
								})
									.then( function(data) {
								    articles = data
								    return true;
									},
									function(data) {
										console.log(data.responseText);
										return false;
									});
			},

			all: function () {
				return articles;
			},

			find: function (id) {
				var r = null;
				$.each(articles.articles, function(i, v) {
			    if (v.id == id) {
			        r = v;
			    }
				});
				return r;
			}
		};
	};

	return {
		// Get the singleton instance
		getInstance: function () {
			if (!instance) {
				instance = init();
				return instance;
			}
			else {
				return instance;
			}
		}
	};
})();

$(document).ready( function() {
	articles = Article.getInstance();
	articles.loadArticles()
		.done( function(r) {
			processDisplay(articles);
		})
		.fail( function(r) {
			alert('Could not load the json file.');
		});

	$('body').on('click', 'a', function(e) {
		e.preventDefault();
		History.pushState(null, e.target.title, e.target.href);
	});
});

function processDisplay(articles) {
	var params = getUrlParameters();

	if (params[0] == 'articles' || params.length == 0) {
		console.log('// show articles');
		displayAllArticles(articles);
	}
	else if (params[0] == 'article' && params.length == 2) {
		console.log('// show article');
		displayArticle(articles, params[1]);
	}
}

function displayAllArticles(articles) {
	$.ajax({
		url: '/ajax/article.php',
		type: 'POST',
		data: {action: 'list', data: articles.all()}
	})
		.done( function(data) {
	    $("#content").append(data);
		});
}

function displayArticle(articles, id) {
	var article = articles.find(id);

	$.ajax({
		url: '/ajax/article.php',
		type: 'POST',
		data: {action: 'show', data: article}
	})
		.done( function(data) {
	    $("#content").append(data);
		});
}

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

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	url = url.toLowerCase(); // This is just to avoid case sensitiveness  
	name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}