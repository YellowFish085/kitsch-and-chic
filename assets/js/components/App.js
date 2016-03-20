var App = function(datas) {
	// Private
	var setEvents = function() {
		$('body').on('click', 'a', function(e) {
			e.preventDefault()
			History.pushState(null, e.target.title, e.target.href)
		})

		window.onstatechange = function() {
			console.log('|| state change')
			processView()
		}
	}

	var processView = function() {
		var params = getUrlParameters()

		if (params.length == 1) {
			if (params[0] == 'about') {
				console.Log('|| Display about')
				setPageMeta('category', params[0])
			}
			else {
				console.log('|| Display articles from ' + params[0] + ' category')
				displayArticles(params[0])
				setPageMeta('category', params[0])
			}
		}
		else if (params.length == 2) {
			if (params[0] == 'article') {
				console.log('|| Display article ' + params[1])
				displayArticle(params[1])
				setPageMeta('article', params[1])
			}
			else {
				console.log('|| Display articles from ' + params[0] + '/' + params[1] + ' subcategory')
				displayArticles(params[1])
				setPageMeta('category', params[1])
			}
		}
		else {
			console.log('|| Display all articles')
			displayAllArticles()
			setPageMeta('category', 'accueil')
		}
	}

	var displayAllArticles = function() {
		TemplateEngine.getInstance().renderTemplate('articles', Article.getInstance().all())
	}

	var displayArticles = function(category) {
		TemplateEngine.getInstance().renderTemplate('articles', Article.getInstance().findByCategory(category))
	}

	var displayArticle = function(id) {
		TemplateEngine.getInstance().renderTemplate('article', Article.getInstance().find(id))
	}

	var displayHtml = function() {
		TemplateEngine.getInstance().renderTemplate('html', Category.getInstance().all())	
	}

	var setPageMeta = function(type, datas) {
		if (type == 'article') {
			var article = Article.getInstance().find(datas)
			document.title = (article) ? toCamelCase(article.title) : ''
		}
		else if (type == 'category') {
			var category = Category.getInstance().find(datas)
			document.title = (category) ? toCamelCase(category.title) : 'Accueil'
		}
	}

	// Private helpers
	var getUrlParameters = function() {
		var params = window.location.pathname.split("/");

		while (params[0] == "") {
			params.shift();
		}
		while (params[params.length-1] == "") {
			params.pop();
		}

		return params;
	}

	var toCamelCase = function(input) {
		return input.replace(/-/g, ' ').replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
	}

	// Public
	this.init = function(datas) {
		TemplateEngine.initInstance(datas.element)

		$.when(
			Article.initDatas(),
			Category.initDatas(),
			$.Deferred(function(deferred){
				$(deferred.resolve)
			})
		).done(function(){
			displayHtml()
			processView()
		})
		.fail(function(e) {
			console.error("Error while loading datas.")
		})
		
		setEvents()
	}

	this.init(datas)
}