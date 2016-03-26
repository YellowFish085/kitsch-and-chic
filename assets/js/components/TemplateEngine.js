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
			var template 	= '<div class="article">'
										+ ' {{#image}}<img src="{{image}}" alt="{{title}}" title="{{title}}" class="img-responsive" />{{/image}}'
										+ '	<h1 class="article-title">{{title}}</h1>'
										+ '	<h2 class="article-author">{{author}}</h2>'
										+ '	<span class="article-categories">{{{categoriesLinks}}}</span>'
										+ '	<div class="article-content">{{{content}}}</div>'
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
			var articleListTemplate = '<div class="row article-list">{{{articles}}}</div>'

			Mustache.parse(articleListTemplate)

			var articleTemplate = '<div class="article-list-item col-xs-12 col-sm-3">'
													+ ' {{#image}}<img src="{{image}}" alt="{{title}}" title="{{title}}" />{{/image}}'
													+ '	<h2 class="article-list-item-title"><a href="/article/{{id}}" title="{{title}}">{{title}}</a></h2>'
													+ '	<span class="arcitle-list-item-categories">{{{categoriesLinks}}}</span>'
													+	'	<h3 class="article-list-item-author">{{author}}</h3>'
													+ '</div>'

			Mustache.parse(articleTemplate)

			var articlesRendered = ''
			$.each(datas, function(i, article) {
				var linksRendered = ''
				$.each(article.categories, function(i, category) {
					linksRendered += getLinktemplate(category)
				})
				article.categoriesLinks = linksRendered

				articlesRendered += Mustache.render(articleTemplate, article)
			})

			var rendered = Mustache.render(articleListTemplate, {"articles": articlesRendered})

			render(contentElement, rendered)
		}

		function renderHtmlTemplate(datas) {
			var template 	= '{{{main-header}}}'
										+ '<div id="content"></div>'
										+ '{{{main-footer}}}'

			Mustache.parse(template)
			var rendered = Mustache.render(template,
				{
					"main-header": getMainHeaderTemplate(datas.header),
					"main-footer": getMainFooterTemplate()
				})

			render(appElement, rendered, 'fast')
		}

		function getMainHeaderTemplate(datas) {
			var headerTemplate 	= '<header id="main-header">'
													+ '	<div class="container">'
													+ '		<div class="row">'
													+ '			<div class="main-header-logo col-sm-3 col-md-4 hidden-xs">'
													+ ' 			<img src="/assets/images/kitsch_and_chic_logo.png" />'
													+ '			</div>'
													+ '			<div class="main-header-nav col-sm-9 col-md-8 hidden-xs">{{{nav}}}</div>'
													+ '			<div class="main-header-nav-bg absolute-in-row"></div>'
													+ '			<div class="main-header-highlight-container absolute-in-row">'
													+ '				<div class="row">'
													+ '					<div class="main-header-highlight col-sm-12 hidden-xs">{{{article}}}</div>'
													+ ' 			</div>'
													+ ' 		</div>'
													+ ' 	</div>'
													+ '	</div>'
													+ '</header>'

			var navRendered = getNavTemplate(datas.categories)
			var articleRendered = getHeaderArticleTemplate(datas.article)

			var rendered = Mustache.render(headerTemplate, {"nav": navRendered, "article": articleRendered})
			return rendered
		}

		function getNavTemplate(categories) {
			var navTemplate = '<nav>'
											+ '	<ul class="main-nav">'
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

		function getHeaderArticleTemplate(article) {
			var template 	= '<div class="main-header-highlight-article">'
										+ ' {{#image}}<img src="{{image}}" alt="{{title}}" title="{{title}}" class="img-responsive" />{{/image}}'
										+ '	<div class="main-header-highlight-article-text">'
										+ '		<a href="/article/{{id}}" title="{{title}}">'
										+ '			<span class="main-header-highlight-article-text-title">{{title}}</span>'
										+ '			<span class="main-header-highlight-article-text-author">{{author}}</span>'
										+ '		</a>'
										+ '	</div>'
										+ '</div>'

			Mustache.parse(template)

			return Mustache.render(template, article)
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
			},

			renderHtml: function(datas) {
				return hideContent(appElement)
								.then(function() {
									renderHtmlTemplate(datas)
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