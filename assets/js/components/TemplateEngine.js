var TemplateEngine = (function() {
	var instance

	function init(el) {
		// Private
		var element = el

		function getArticleTemplate(datas) {
			var template 	= '<div>'
										+ '	<h1>{{name}}</h1>'
										+ '	<h2>{{author}}</h2>'
										+ '	<p>{{content}}</p>'
										+ '</div>'

			Mustache.parse(template)

			var rendered = Mustache.render(template, datas)

			console.log(rendered)

			document.getElementById(el).innerHTML = rendered
		}

		function getArticlesTemplate(datas) {
			var template 	= '<div>'
										+ '	<h2><a href="/article/{{id}}" title="{{title}}">{{title}}</a></h2>'
										+	'	<h3>{{author}}</h3>'
										+ '</div>'

			Mustache.parse(template)

			var rendered = ''
			$.each(datas, function(i, article) {
				rendered += Mustache.render(template, article)
			})

			document.getElementById(el).innerHTML = rendered
		}

		// Public
		return {
			renderTemplate: function(template, datas) {
				switch (template) {
					case 'article':
						getArticleTemplate(datas)
						break
					case 'articles':
						getArticlesTemplate(datas)
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
		initInstance: function(element = 'content') {
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