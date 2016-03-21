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
		TemplateEngine.getInstance().displayPreloader()

		var params = getUrlParameters()

		if (params.length == 1) {
			if (params[0] == 'about') {
				console.Log('|| Display about')
				setPageMeta('category', params[0])
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

	var displayAllArticles = function() {
		var articles = Article.getInstance().all()
		if (articles) {
			TemplateEngine.getInstance().renderTemplate('articles', articles)
			setPageMeta('category', null)
		}
	}

	var displayArticles = function(category) {
		var articles = Article.getInstance().findByCategory(category)
		if (articles) {
			TemplateEngine.getInstance().renderTemplate('articles', articles)
			setPageMeta('category', Category.getInstance().find(category))
		}
	}

	var displayArticle = function(id) {
		var article = Article.getInstance().find(id)
		if (article) {
			TemplateEngine.getInstance().renderTemplate('article', article)
			setPageMeta('category', article)
		}
	}

	var displayHtml = function() {
		return TemplateEngine.getInstance().renderTemplate('html', Category.getInstance().all())	
	}

	var setPageMeta = function(type, item) {
		if (type == 'article') {
			document.title = 'Kitsch & Chic | ' + item.title
		}
		else if (type == 'category') {
			document.title = (item) ? 'Kitsch & Chic | ' + item.title : 'Kitsch & Chic'
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
			Category.initDatas(),
			Article.initDatas(),
			$.Deferred(function(deferred){
				$(deferred.resolve)
			})
		).done(function(){
			$.when(displayHtml())
				.then(function() {
						processView()
					})
		})
		.fail(function(e) {
			console.error("Error while loading datas.")
		})
		
		setEvents()
	}

	this.init(datas)
}