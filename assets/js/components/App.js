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
		console.log(params);
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
			displayHome();
			//displayAllArticles()
		}
	}
	/*--------displayHome------------*/
	var displayHome = function(){
		var categories = Category.getInstance().all();
		var articles = [];
		
		var nbArticle;
		
		$.each(categories,function(i, category){

			switch (category.slug){
				case "intetieurs":
					nbArticle = 5
					break
				case "astuces":
					nbArticle = 2
					break
				case "createurs":
					nbArticle = 3
					break
				case "insolites":
					nbArticle = 2
					break
				case "passion-kitsch":
					nbArticle = 3
					break
				default:
					nbArticle = null
					break
			}
			
			articles.push({
				category : category,
				articles : Article.getInstance().findLastByCategory(category.slug,nbArticle)
			});
		})
		
		if(articles.length !== 0){
			TemplateEngine.getInstance().renderTemplate('home',
				{
					"lastArticle" : Article.getInstance().last(),
					"articles" : articles
				}
			)
			setPageMeta('category', null)
		}
	}
	/*------------------------------*/
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
			TemplateEngine.getInstance().renderTemplate('articles', 
				{
					"lastArticle" : Article.getInstance().findLastByCategory(category,1),
					"articles" : articles
				}
			)
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
		return TemplateEngine.getInstance().renderHtml(
			{
				"header": {
					"categories": Category.getInstance().all()
				}
			})	
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
		var url = window.location.href.replace(URL_base,"")
		var params = url.split("/");
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