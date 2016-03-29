var TemplateEngine = (function() {
	var instance

	function init(el) {
		// Private
		var appElement = el
		var contentElement = '#content'
		var headerArticleElement = "#header-article"

		function showContent(element, duration = "slow") {
			return $(element).fadeIn(duration).promise()
		}

		function hideContent(element, duration = "slow") {
			return $(element).fadeOut(duration).promise()
		}

		function render(element, content, duration = "slow") {
			return $(element).html(content).promise()
		}

		function getLinktemplate(datas) {
			var template = '<a href="{{{url}}}" title="{{{title}}}">{{{title}}}</a>'
			Mustache.parse(template)
			return Mustache.render(template, datas)
		}

		function renderArticleTemplate(datas) {
			var articleHeaderRendered = getHeaderArticleTemplate(datas)

			var template 	= '<div class="article">'
										+ '	<div class="article-header">'
										+ '		<span class="article-categories">{{{categoriesLinks}}}</span>'
										+ '		<h2 class="article-subtitle">{{subtitle}}</h2>'
										+ '	</div>'
										+ '	<div class="article-body">'
										+ '		<div class="article-description">{{{description}}}</div>'
										+ '		<div class="article-content">{{{content}}}</div>'
										+ '	<div class="article-footer">{{{articleFooter}}}</div>'
										+ '</div>'

			Mustache.parse(template)
			var linksRendered = ''
			$.each(datas.categories, function(i, category) {
				linksRendered += getLinktemplate(category)
			})
			datas.categoriesLinks = linksRendered
			
			datas.articleFooter = getSharingFooter("_heart");

			var rendered = Mustache.render(template, datas)

			hideContent(contentElement + ', ' + headerArticleElement)
				.then(function() {
					return render('#header-article', articleHeaderRendered)
				})
				.then(function() {
					return render(contentElement, rendered)
				})
				.then(function() {
					replaceImgArticleByDiv(".article-content","class")
					return showContent(contentElement + ', ' + headerArticleElement)
				})
				.then(function() {
					return hideContent('#loading', 'fast')
				})
		}
		
		function replaceImgArticleByDiv(selector, typeSelector){
			var imgSelector = $(selector).find("img");

			if(imgSelector.length !==0){
				$.each(imgSelector, function(i){
					var img = imgSelector.eq(i).clone()
					
					var divImgContainer = $("<div></div>").addClass("article-image-container")
					var divImgSizeContainer = $("<div></div>").addClass("article-image-container-size")
										
					if(img.attr(typeSelector).indexOf("half-size-picture") != -1){
						divImgContainer.addClass('half-size-picture col-xs-6 col-sm-6')
						img.removeClass('half-size-picture')
					}
					else if(img.attr(typeSelector).indexOf("complete-size-picture") != -1){
						divImgContainer.addClass('complete-size-picture col-xs-6 col-sm-12')
						img.removeClass('complete-size-picture')
					}
					
					img.appendTo(divImgSizeContainer)
					divImgSizeContainer.appendTo(divImgContainer)
					
					imgSelector.eq(i).replaceWith(divImgContainer)
				})
			}
		}

		function renderArticlesTemplate(datas) {
			var articleHeaderRendered = getHeaderArticleTemplate(datas.lastArticle)
			var rendered = getListArticlesTemplate(datas.articles)

			hideContent(contentElement + ', ' + headerArticleElement)
				.then(function() {
					return render('#header-article', articleHeaderRendered)
				})
				.then(function() {
					return render(contentElement, rendered)
				})
				.then(function() {
					return showContent(contentElement + ', ' + headerArticleElement)
				})
				.then(function() {
					return hideContent('#loading', 'fast')
				})
		}

		/*--------renderHomeTemplate------------*/
		function renderHomeTemplate(datas) {
			
			var articleHeaderRendered = getHeaderArticleTemplate(datas.lastArticle)
			
			var homeListTemplate = '<div id="welcomeMessage"><h2>Bienvenu <3</h2></div>'
									+ '<div class="home-list-categories">'
									+ '	{{{categories}}}'
									+ '</div>'
			
			Mustache.parse(homeListTemplate)
			
			var categoryTemplate = '<div class="row home-section">'
									+ '	<div class="home-section-title"><span class="home-section-title-text">{{category}}</span></div>'
									+ '	{{{articles}}}'
									+ '</div>'
									
			Mustache.parse(categoryTemplate)
							
			var categoryRender = ''
			
			$.each(datas.articles, function(i, section){
				section.category = section.category.title
				section.articles = getListArticlesTemplate(section.articles)
				categoryRender += Mustache.render(categoryTemplate, section)
			})

			var rendered = Mustache.render(homeListTemplate, {"categories": categoryRender})

			hideContent(contentElement + ', ' + headerArticleElement)
				.then(function() {
					return render('#header-article', articleHeaderRendered)
				})
				.then(function() {
					return render(contentElement, rendered)
				})
				.then(function() {
					return showContent(contentElement + ', ' + headerArticleElement)
				})
				.then(function() {
					return hideContent('#loading', 'fast')
				})
		}
		/*--------------------------------------*/
		
		function renderHtmlTemplate(datas) {
			var template 	= '{{{main-header}}}'
										+ '<div id="content"></div>'
										+ '{{{main-footer}}}'
										+ '<div id="loading">Loading</div>'

			Mustache.parse(template)
			var rendered = Mustache.render(template,
				{
					"main-header": getMainHeaderTemplate(datas.header),
					"main-footer": getMainFooterTemplate()
				})

			hideContent(contentElement + ', ' + headerArticleElement)
				.then(function() {
					return render(appElement, rendered, 'fast')
				})
				.then(function() {
					return showContent(contentElement + ', ' + headerArticleElement)
				})
				.then(function() {
					return hideContent('#loading', 'fast')
				})
		}

		function getMainHeaderTemplate(datas) {
			var headerTemplate 	= '<header id="main-header">'
													+ '	<div class="container">'
													+ '		<div class="row">'
													+ '			<div class="main-header-logo col-sm-3 col-md-4 hidden-xs">'
													+ ' 			<img src="/assets/images/kitsch_and_chic_logo.png" />'
													+ '			</div>'
													+ '			<div class="main-header-nav col-sm-9 col-md-8 col-xs-12">{{{nav}}}</div>'
													+ '			<div class="main-header-nav-bg absolute-in-row hidden-xs"></div>'
													+ '			<div class="main-header-highlight-container absolute-in-row hidden-xs">'
													+ '				<div class="row">'
													+ '					<div class="main-header-highlight col-sm-12 hidden-xs" id="header-article"></div>'
													+ ' 			</div>'
													+ ' 		</div>'
													+ ' 	</div>'
													+ '	</div>'
													+ '</header>'

			var navRendered = getNavTemplate(datas.categories)

			var rendered = Mustache.render(headerTemplate, {"nav": navRendered})
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
										+ '		<a href="/article/{{id}}" title="{{title}}" class="main-header-highlight-article-text-title">{{title}}</span></a>'
										+ '		<span class="main-header-highlight-article-text-author">{{author}}</span>'
										+ '	</div>'
										+ '</div>'

			Mustache.parse(template)

			return Mustache.render(template, article)
		}

		function getMainFooterTemplate() {
			return '<footer id="main-footer"></footer>'
		}

		/*--------getListArticlesTemplate------------*/
		function getListArticlesTemplate(datas) {
			var articleListTemplate = '<div class="row article-list">{{{articles}}}</div>'

			Mustache.parse(articleListTemplate)

			var articleTemplate = '<div class="article-list-item col-xs-12 col-sm-{{sizeCols}}">'
													+ '	<span class="arcitle-list-item-categories">{{{categoriesLinks}}}</span>'
													+ ' <div class = "article-list-item-images-container">'
													+ ' 	{{#image}}<img src="{{image}}" alt="{{title}}" title="{{title}}" />{{/image}}'
													+ ' </div>'
													+ ' <div class = "article-list-item-text">'
													+ '		<h2 class="article-list-item-text-title"><a href="/article/{{id}}" title="{{title}}">{{title}}</a></h2>'
													+ '		<h3 class="article-list-item-text-author">{{author}}</h3>'
													+ ' </div>'
													+ '</div>'

			Mustache.parse(articleTemplate)

			var articlesRendered = ''
			
			var sizeCols
			var sizeDefened =false
			if(datas.length <= 2){
				sizeCols = 6
				sizeDefened = true
			}
			else if (datas.length <= 3){
				sizeCols = 4
				sizeDefened = true
			}
			
			$.each(datas, function(i, article) {
				var linksRendered = ''
				$.each(article.categories, function(i, category) {
					linksRendered += getLinktemplate(category)
				})
				article.categoriesLinks = linksRendered
				
				if(!sizeDefened){
					if(i%5 < 2) sizeCols = 6;
					else sizeCols = 4;
				}
				article.sizeCols = sizeCols;
				
				articlesRendered += Mustache.render(articleTemplate, article)
			})

			var rendered = Mustache.render(articleListTemplate, {"articles": articlesRendered})
			
			return rendered;
		}
		/*-------------------------------------------*/
		
		/*--------getSharingFooter------------*/
		function getSharingFooter(suffixe){
			var template = '<div class="row"><h2>Partager</h2>'
									+ '	<div class="network-icones">{{{icones}}}</div>'
									+ '</div>'
			
			Mustache.parse(template)
			
			var socialNetWork =["facebook","twitter","google+","pinterest","tumblr"]
			
			var iconeTemplate = '<div class="network-icone">'
										+ '	<a href="#" title="{{netWork}}"><img src="/assets/images/socialNetWork/{{picture}}.png" alt="{{netWork}}"/></a>'
										+ '</div>'
			
			Mustache.parse(iconeTemplate)
			
			var renderedList = ''
			$.each(socialNetWork, function(i,netWork){
				renderedList += Mustache.render(iconeTemplate, {'netWork' : netWork, 'picture': netWork + suffixe})
			})
			
			return Mustache.render(template, {"icones": renderedList})
			
		}
		/*---------------------------------*/
		
		// Public
		return {
			renderTemplate: function(template, datas) {
				this.displayPreloader()
				.then(function() {
					console.log('lol')
					switch (template) {
						case 'article':
							return renderArticleTemplate(datas)
						case 'articles':
							return renderArticlesTemplate(datas)
						case 'home':
							return renderHomeTemplate(datas)
						default:
							console.error('Template not found')
							return false
					}
				})
			},

			displayPreloader: function() {
				return showContent('#loading', 'fast')
			},

			renderHtml: function(datas) {
				return hideContent(contentElement + ', ' + headerArticleElement).then(function() { renderHtmlTemplate(datas) })
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