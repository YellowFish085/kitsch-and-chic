var TemplateEngine = (function() {
	var instance

	function init(el) {
		// Private
		var element = el
		console.log(element)

		function getArticleTemplate(datas) {
			var template = '<p>Article {{name}}</p>'
			Mustache.parse(template)

			var rendered = Mustache.render(template, datas)
			console.log(rendered)
		}

		function getArticlesTemplate(datas) {
			var template = '<div><h2>{{title}}</h2><h3>{{author}}</h3></div>'
			Mustache.parse(template)

			var rendered = ''
			$.each(datas, function(i, article) {
				rendered += Mustache.render(template, article)
			})
			console.log(rendered)

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
		// Get the singleton instance
		getInstance: function (element = 'content') {
			if (!instance) {
				instance = init(element)
				return instance
			}
			else {
				return instance
			}
		}
	}
})()