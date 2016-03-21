var TemplateEngine = (function() {
	var instance

	function init(el) {
		// Private
		var appElement = el
		var contentElement = '#content'

		function hideContent(element, duration = "fast") {
			return $(element).fadeOut(duration).promise()
		}

		function render(element, content, duration = "slow") {
			return $(element).html(content).fadeIn(duration).promise()
		}

		function getLinktemplate(datas) {
			var template = '<a href="{{{url}}}" title="{{{title}}}">{{{title}}}</a>'
			Mustache.parse(template)
			return Mustache.render(template, datas)
		}

		function renderArticleTemplate(datas) {
			var template 	= '<div>'
										+ '	<h1>{{name}}</h1>'
										+ '	<h2>{{author}}</h2>'
										+ '	<h3>{{{categoriesLinks}}}</h3>'
										+ '	<p>{{content}}</p>'
										+ '</div>'

			Mustache.parse(template)
			var linksRendered = ''
			$.each(datas.categories, function(i, category) {
				linksRendered += getLinktemplate(category)
			})
			datas.categoriesLinks = linksRendered

			var rendered = Mustache.render(template, datas)

			render(contentElement, rendered)
		}

		function renderArticlesTemplate(datas) {
			var template 	= '<div>'
										+ '	<h2><a href="/article/{{id}}" title="{{title}}">{{title}}</a></h2>'
										+ '	<h3>{{{categoriesLinks}}}</h3>'
										+	'	<h3>{{author}}</h3>'
										+ '</div>'

			Mustache.parse(template)

			var rendered = ''
			$.each(datas, function(i, article) {
				var linksRendered = ''
				$.each(article.categories, function(i, category) {
					linksRendered += getLinktemplate(category)
				})
				article.categoriesLinks = linksRendered

				rendered += Mustache.render(template, article)
			})

			render(contentElement, rendered)
		}

		function renderHtmlTemplate(datas) {
			var template 	= '{{{main-header}}}'
										+ '<div id="content"></div>'
										+ '{{{main-footer}}}'

			Mustache.parse(template)
			var rendered = Mustache.render(template,
				{
					"main-header": getMainHeaderTemplate(datas),
					"main-footer": getMainFooterTemplate()
				})

			render(appElement, rendered, 'fast')
		}

		function getMainHeaderTemplate(datas) {
			var headerTemplate = '<header id="main-header">{{{nav}}}</header>'

			var r = getNavTemplate(datas)

			var rendered = Mustache.render(headerTemplate, {"nav": r})
			return rendered
		}

		function getNavTemplate(categories) {
			var navTemplate = '<nav class="row">'
											+ '	<ul class="col-xs-12 col-sm-12 main-nav">'
											+ '		<li><a href="/" title="Accueil">Accueil</a></li>'
											+ '		{{{nav-ul-content}}}'
											+ '	</ul>'
											+ '</nav>'

			var rendered = getNavItemTemplate(categories)

			Mustache.parse(navTemplate)
			return Mustache.render(navTemplate, {"nav-ul-content": rendered})
		}

		function getNavItemTemplate(categories) {
			var navItemDropdownTemplate = '<li>'
																	+ '	<span type="button" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
						    									+ '		{{title}}'
						  										+ '	</span>'
						  										+ '	<ul class="dropdown-menu">{{{dropdown-content}}}</ul>'
						  										+ '</li>'
			Mustache.parse(navItemDropdownTemplate)

			var navItemTemplate = '<li>{{{link}}}</li>'
			Mustache.parse(navItemTemplate)

			var rendered = ''
			$.each(categories, function(i, category) {
				if (category.subcategories != null) {
					rendered += Mustache.render(navItemDropdownTemplate, {"title": category.title, "dropdown-content": getNavItemTemplate(category.subcategories)})
				}
				else {
					rendered += Mustache.render(navItemTemplate, {"link": getLinktemplate(category)})
				}
			})

			return rendered
		}

		function getMainFooterTemplate() {
			return '<footer id="main-footer"></footer>'
		}

		// Public
		return {
			renderTemplate: function(template, datas) {
				switch (template) {
					case 'article':
						return hideContent(contentElement)
										.then(function() {
											renderArticleTemplate(datas)
										})
					case 'articles':
						return hideContent(contentElement)
										.then(function() {
											renderArticlesTemplate(datas)
										})
					case 'html':
						return hideContent(appElement)
										.then(function() {
											renderHtmlTemplate(datas)
										})
					default:
						console.error('Template not found')
						return false
				}
			},

			displayPreloader: function() {
				return hideContent(contentElement)
								.then(function() {
									render(contentElement, 'loading', 'fast')
								})
			}
		}
	}

	return {
		initInstance: function(element = 'app') {
			if (!instance) {
				instance = init(element)
			}
		},
		
		// Get the singleton instance
		getInstance: function () {
			this.initInstance()
			return instance
		}
	}
})()