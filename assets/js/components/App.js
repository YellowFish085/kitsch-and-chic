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
		TemplateEngine.getInstance().renderTemplate('articles', Article.getInstance().all())
	}

	var displayArticles = function(category) {
		TemplateEngine.getInstance().renderTemplate('articles', Article.getInstance().findByCategory(category))
	}

	var displayArticle = function(id) {
		TemplateEngine.getInstance().renderTemplate('article', Article.getInstance().find(id))
	}

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

	// Public
	this.init = function(datas) {
		TemplateEngine.initInstance(datas.element)

		Article.initDatas()
			.done( function() {
				processView()
			})
			.fail( function() {
				alert('ERROR: Could not load the json file.')
			})

		setEvents()
	}

	this.init(datas)
}