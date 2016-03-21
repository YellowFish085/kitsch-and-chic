var Article = (function() {
	var instance

	function init() {
		// Private
		var articles

		function setArticlesCategories(datas) {
			var r = []
			$.each(datas, function(i, article) {
				var rArticle = article
				if (article.categories) {
					var rArticle = setArticleCategories(rArticle)
				}
				r.push(rArticle)
			})
			return r
		}

		function setArticleCategories(article) {
			var categories = []
			$.each(article.categories, function(i, category) {
				categories.push(Category.getInstance().find(category))
			})
			article.categories = categories

			return article
		}

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
				return setArticlesCategories(articles.articles)
			},

			find: function (id) {
				var r = null
				$.each(articles.articles, function(i, article) {
			    if (article.id == id) {
			        r = article
			        return false
			    }
				})
				r = setArticleCategories(r)
				return r
			},

			findByCategory: function(category) {
				var r = []
				$.each(articles.articles, function(i, article) {
					if ($.inArray(category, article.categories) != -1) {
						r.push(article)
					}
				})
				r = setArticlesCategories(r)
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