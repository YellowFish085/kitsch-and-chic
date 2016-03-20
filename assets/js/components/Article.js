var Article = (function() {
	var instance

	function init() {
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
				return articles.articles
			},

			find: function (id) {
				var r = false
				$.each(articles.articles, function(i, article) {
			    if (article.id == id) {
			        r = article
			        return false
			    }
				})
				return r
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
		initInstance: function() {
			if (!instance) {
				instance = init()
			}
		},

		initDatas: function() {
			this.initInstance()
			return instance.loadArticles()
		},

		// Get the singleton instance
		getInstance: function () {
			this.initInstance()
			return instance
		}
	}
})()