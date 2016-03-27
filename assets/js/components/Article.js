var Article = (function() {
	var instance

	function init() {
		// Private
		var articles

		function setArticlesCategories(datas) {
			var r = []
			$.each(datas, function(i, article) {
				if (article.categories) {
					var article = setArticleCategories(article)
				}
				r.push(article)
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
				var r = $.extend(true, {}, articles.articles)
				return setArticlesCategories(r)
			},

			find: function (id) {
				var r = null
				$.each(articles.articles, function(i, article) {
			    if (article.id == id) {
			        r = $.extend(true, {}, article)
			        return false
			    }
				})
				r = setArticleCategories(r)
				return r
			},

			findByCategory: function(category, lim) {
				var r = []
				$.each(articles.articles, function(i, article) {
					if ($.inArray(category, article.categories) != -1) {
						r.push($.extend(true, {}, article))
					}
					if(lim != null && lim < r.length) return true; 
				})
				r = setArticlesCategories(r)
				return r
			},
		
			/*--------findLastByCategory------------*/
			findLastByCategory: function(category, lim) {
				var r = []
				//console.log("category = "+category  +" -- lim = "+lim)
				$.each(articles.articles.reverse(), function(i, article) {
					if ($.inArray(category, article.categories) != -1) {
						//console.log(article)
						r.push($.extend(true, {}, article))
					}
					//console.log("lim = "+lim+" -- r.length = "+r.length)
					if(lim != null && lim <= r.length) return false; 
				})
				r = setArticlesCategories(r)
				return r
			},
			/*-----------------------------------*/
			
			last: function() {
				var r = $.extend(true, {}, articles.articles[articles.articles.length - 1])
				return setArticleCategories(r)
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