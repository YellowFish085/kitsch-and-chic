var Article = (function() {
	var instance

	function init() {
		// Singleton
		// Private
		var articles

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
								    return true
									},
									function(data) {
										return false
									})
			},

			all: function () {
				return articles
			},

			find: function (id) {
				$.each(articles.articles, function(i, article) {
			    if (article.id == id) {
			        return r
			    }
				})
				return null
			},

			findByCategory: function(category) {
				var r = []
				$.each(articles.articles, function(i, article) {
					if ($.inArray(category, article.categories) != -1) {
						r.push(article)
					}
				})
				return r
			}
		}
	}

	return {
		// Get the singleton instance
		getInstance: function () {
			if (!instance) {
				instance = init()
				return instance
			}
			else {
				return instance
			}
		}
	}
})()