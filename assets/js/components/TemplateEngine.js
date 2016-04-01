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

		function getLinktemplate(datas, htmlClass = "") {
			var template = '<a href="{{{datas.url}}}" title="{{{datas.title}}}" class="{{{htmlClass}}}">{{{datas.title}}}</a>'
			Mustache.parse(template)
			return Mustache.render(template, {"datas": datas, "htmlClass": htmlClass})
		}

		function renderArticleTemplate(datas) {
			var articleHeaderRendered = getHeaderArticleTemplate(datas)

			var template 	= '<div class="article">'
										+ '	<div class="article-header">'
										+ '		<span class="article-categories">{{{categoriesLinks}}}</span>'
										+ '		<h2 class="article-subtitle">{{subtitle}}</h2>'
										+ '	</div>'
										+ '	<div class="article-body">'
										+ '		{{{contentArticle}}}'
										+ '	<div class="article-footer">'
										+ '		<h2>Partager</h2>'
										+ '		{{{articleFooter}}}'
										+ '	</div>'
										+ '</div>'

			Mustache.parse(template)
			var linksRendered = ''
			$.each(datas.categories, function(i, category) {
				linksRendered += getLinktemplate(category, "hvr hvr-sweep-to-right")
			})
			datas.categoriesLinks = linksRendered
			
			if(fromCategory(datas.categories,'astuces')) datas.contentArticle = getAstuceArticle(datas)
			else datas.contentArticle = getClassicArticle({"description" : datas.description, "content":datas.content})
			
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
		
		/* --------DESOLE JE SAIS PAS OU LES METTRE -----------*/
		function fromCategory(categories, nameCategory){
			var isFrom = false;
			$.each(categories, function(i, category){
				if(nameCategory == category.slug){
					isFrom =true;
					return false;
				}
			})
			
			return isFrom;
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
						divImgContainer.addClass('complete-size-picture col-xs-12 col-sm-12')
						img.removeClass('complete-size-picture')
					}
					
					img.appendTo(divImgSizeContainer)
					divImgSizeContainer.appendTo(divImgContainer)
					
					imgSelector.eq(i).replaceWith(divImgContainer)
				})
			}
		}
		/* --------------------------------- */
		
		
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
			var template 	= '<div class="wrapper">'
										+ '	{{{main-header}}}'
										+ '	<div id="content"></div>'
										+ '	<div class="push"></div>'
										+ '</div>'
										+ '{{{main-footer}}}'
										+ '<div id="loading"><div class="loading-center"><img src="/assets/images/flamingo_pink.png"/><p>Loading...</p></div></div>'

			Mustache.parse(template)
			var rendered = Mustache.render(template,
				{
					"main-header": getMainHeaderTemplate(datas.header),
					"main-footer": getMainFooterTemplate(datas.header.categories)
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
													+ '			<div class="main-header-logo-mobile col-sm-3 col-md-4 visible-xs hidden-sm">'
													+ ' 			<img src="/assets/images/kitsch_and_chic_logo_mobile.png" />'
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
										+ ' <div class="main-header-highlight-img-container">{{#image}}<img src="{{image}}" alt="{{title}}" title="{{title}}" class="img-responsive" />{{/image}}</div>'
										+ '	<div class="main-header-highlight-article-text">'
										+ '		{{{link}}}'
										+ '		<span class="main-header-highlight-article-text-author">{{author}}</span>'
										+ '	</div>'
										+ '</div>'

			Mustache.parse(template)

			article.link = getLinktemplate(
				{
					"url": '/article/' + article.id,
					"title": article.title
				}, "hvr hvr-bubble-float-left main-header-highlight-article-text-title")

			return Mustache.render(template, article)
		}

		function getMainFooterTemplate(categories) {
			var template = '<footer id="main-footer">'
										+ '	<div class="container">'
										+ '		<div class="row">'
										+ '			<div class="main-footer-text-container col-xs-12 col-sm-4 col-md-4">'
										+ '				<div class="main-footer-text-legal-mention"><span>2016 © Kitsch & Chick - site web by Kitsch & Chick Team</span></div>'
										+ '			</div>'
										+ '			<div class="main-footer-sharing col-xs-12 col-sm-4 col-md-4">'
										+ '				<div class="row">'
										+ '					<h2 class="hidden-xs">Rejoins-nous</h2>'
										+ '					<div class="col-xs-12 col-sm-12">{{{sharing}}}</div>'
										+ '			</div>'
										+ ' 	</div>'
										+ '	</div>'
										+ '</footer>'
										
			Mustache.parse(template)				
			
			var renderedNavUl = getNavItemTemplate(categories)
			var renderedSharing = getSharingFooter()
			
			var renderer = Mustache.render(template, {"nav-ul-content" : renderedNavUl , "sharing" : renderedSharing})
						
			return renderer;
		}

		/*--------getListArticlesTemplate------------*/
		function getListArticlesTemplate(datas) {
			var articleListTemplate = '<div class="row article-list">{{{articlesRendered}}}</div>'

			var articleTemplate = '<div class="article-list-item col-xs-12 col-sm-{{sizeCols}}">'
													+ '	<span class="arcitle-list-item-categories">{{{article.categoriesLinks}}}</span>'
													+ ' <div class = "article-list-item-images-container">'
													+ ' 	{{#article.image}}<img src="{{article.image}}" alt="{{article.title}}" title="{{article.title}}" />{{/article.image}}'
													+ ' </div>'
													+ ' <div class = "article-list-item-text">'
													+ '		<h2 class="article-list-item-text-title hvr hvr-bubble-float-right">{{{article.link}}}</h2>'
													+ '		<h3 class="article-list-item-text-author">{{article.author}}</h3>'
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
					linksRendered += getLinktemplate(category, "hvr hvr-sweep-to-right")
				})
				article.categoriesLinks = linksRendered
				
				if(!sizeDefened){
					if(i%5 < 2) sizeCols = 6;
					else sizeCols = 4;
				}

				article.link = getLinktemplate({'url': '/article/' + article.id, 'title': article.title})
				
				articlesRendered += Mustache.render(articleTemplate, {"article": article, "sizeCols": sizeCols})
			})

			Mustache.parse(articleListTemplate)
			var rendered = Mustache.render(articleListTemplate, {'articlesRendered': articlesRendered})
			
			return rendered;
		}
		/*-------------------------------------------*/
		
		/*--------getClassicArticle------------*/
		function getClassicArticle(datas){
			var template = '<div class="article-description">{{{description}}}</div>'
										+ '<div class="article-content">{{{content}}}</div>'
			
			Mustache.parse(template)
			
			return Mustache.render(template, datas)
		}
		/*-------------------------------------*/
		
		/*--------getAstuceArticle------------*/
		function getAstuceArticle(datas){
			var template = '<div class="astuce-description">{{{description}}}</div>'
										+ '<div class="astuce-content">{{{steps}}}</div>'
			
			Mustache.parse(template)
			
			var stepTemplate = '<div class=" row astuce-step">'
										+ '	<div class="astuce-step-container col-sm-12 col-xs-12">'
										+ '		<img src={{{image}}} alt={{{title}}}/>'
										+ '		<div class="astuce-step-content col-sm-6 col-xs-6">'
										+ '			<div class="astuce-step-content-number">'
										+ '				<h2>{{{number}}}</h2>'
										+ '			</div>'
										+ '			<h2 class="astuce-step-content-title">{{{title}}}</h2>'
										+ '			<div class="astuce-step-content-text">{{{content}}}</div>'
										+ '		</div>'
										+ '	</div>'
										+ '</div>'
										
			Mustache.parse(stepTemplate)
			
			var renderedStep =''
			$.each(datas.content, function(i, step){
				step.number = i+1
				renderedStep += Mustache.render(stepTemplate, step)
			})
			
			return Mustache.render(template, {"description" : datas.description, "steps" : renderedStep})
		}
		/*------------------------------------*/
		
		/*--------getSharingFooter------------*/
		function getSharingFooter(suffixe = ''){
			var template = '<div class="row">'
									+ '	<div class="network-icones">{{{icones}}}</div>'
									+ '</div>'
			
			Mustache.parse(template)
			
			var socialNetWork =["facebook","twitter","googleplus","pinterest","tumblr"]
			
			var iconeTemplate = '<div class="network-icone network-{{netWork}} col-xs-1 col-sm-2 {{#first}}col-sm-offset-1 col-xs-offset-1{{/first}}">'
										+ '	<a href="#" title="{{netWork}}"><img src="/assets/images/socialNetWork/{{picture}}.png" alt="{{netWork}}"/></a>'
										+ '</div>'
			
			Mustache.parse(iconeTemplate)
			
			var renderedList = ''
			var count = 0
			$.each(socialNetWork, function(i,netWork){
				var first = false
				if (count == 0) {
					first = true
				}
				renderedList += Mustache.render(iconeTemplate, {'netWork' : netWork, 'picture': netWork + suffixe, 'first': first})
				count++
			})
			
			return Mustache.render(template, {"icones": renderedList})
			
		}
		/*---------------------------------*/
		
		// Public
		return {
			renderTemplate: function(template, datas) {
				this.displayPreloader()
				.then(function() {
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