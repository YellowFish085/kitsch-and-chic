var TemplateEngine = (function() {
	var instance

	function init(el) {
		// Private
		var element = el

		function renderArticleTemplate(datas) {
			var template 	= '<div>'
										+ '	<h1>{{name}}</h1>'
										+ '	<h2>{{author}}</h2>'
										+ '	<p>{{content}}</p>'
										+ '</div>'

			Mustache.parse(template)

			var rendered = Mustache.render(template, datas)

			document.getElementById('content').innerHTML = rendered
		}

		function renderArticlesTemplate(datas) {
			var template 	= '<div>'
										+ '	<h2><a href="/article/{{id}}" title="{{title}}">{{title}}</a></h2>'
										+	'	<h3>{{author}}</h3>'
										+ '</div>'

			Mustache.parse(template)

			var rendered = ''
			$.each(datas, function(i, article) {
				rendered += Mustache.render(template, article)
			})

			document.getElementById('content').innerHTML = rendered
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

			document.getElementById(el).innerHTML = rendered
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

			var rendered = getNavLinks(categories)

			Mustache.parse(navTemplate)
			return Mustache.render(navTemplate, {"nav-ul-content": rendered})
		}

		function getNavLinks(categories) {
			var navItemDropdownTemplate = '<li>'
																	+ '	<span type="button" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
						    									+ '		{{title}}'
						  										+ '	</span>'
						  										+ '	<ul class="dropdown-menu">{{{dropdown-content}}}</ul>'
						  										+ '</li>'
			Mustache.parse(navItemDropdownTemplate)

			var navItemTemplate = '<li><a href="{{{url}}}" title="{{{title}}}">{{{title}}}</a></li>'
			Mustache.parse(navItemTemplate)

			var rendered = ''
			$.each(categories, function(i, category) {
				if (category.subcategories != null) {
					rendered += Mustache.render(navItemDropdownTemplate, {"title": category.title, "dropdown-content": getNavLinks(category.subcategories)})
				}
				else {
					rendered += Mustache.render(navItemTemplate, category)
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
						renderArticleTemplate(datas)
						break
					case 'articles':
						renderArticlesTemplate(datas)
						break
					case 'html':
						renderHtmlTemplate(datas)
						break
					default:
						console.error('Template not found')
						break
				}
			},

			displayPreloader: function() {

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