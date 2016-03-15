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
									url: 'assets/json/articles.json',
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
				return id;
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
			console.log(articles.all());
		})
		.fail( function(r) {
			alert('Could not load the json file.');
		});

	$('a').on('click', function(e) {
		e.preventDefault();
		History.pushState(null, e.target.title, e.target.href);
	});
});			