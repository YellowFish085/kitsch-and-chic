var TemplateEngine = (function() {
	var instance

	function init(el) {
		// Private
		var element = el

		function getArticleTemplate(datas) {
			var template 	= '<div>'
										+ '	<p>Article {{name}}</p>'
										+ '</div>'

			Mustache.parse(template)

			var rendered = Mustache.render(template, datas)
			console.log(rendered)
		}

		function getArticlesTemplate(datas) {
			var template 	= '<div>'
										+ '	<h2>{{title}}</h2>'
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
			getTemplate: function(template, datas) {
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