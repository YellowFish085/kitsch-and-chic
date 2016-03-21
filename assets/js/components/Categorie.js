var Category = (function() {
	var instance

	function init() {
		// Private
		var categories = []

		function findCategory(cat, slug) {
			var r = null
			$.each(cat, function(i, category) {
		    if (category.slug == slug) {
		        r = $.extend(true, {}, category)
		        return false
		    }
				if (category.subcategories != null) {
					var sub = findCategory(category.subcategories, slug)
					if (sub) {
						r = sub
						return false
					}
				}
			})
			return r
		}

		return {
			// Public
			loadCategories: function() {
				return	$.ajax({
									url: '/assets/json/categories.json',
									cache: false,
									contentType: "application/json; charset=utf-8",
									dataType: "json"
								})
									.then( function(data) {
								    categories = data
								    return true
									},
									function(data) {
										return false
									})
			},

			all: function () {
				var r = $.extend(true, {}, categories.categories)
				return r
			},

			find: function (slug) {
				return findCategory(categories.categories, slug);
			}
		}
	}

	return {
		initInstance: function() {
			if (!instance) {
				instance = init()
			}
		},

		initDatas: function() {
			this.initInstance()
			return instance.loadCategories()
		},

		// Get the singleton instance
		getInstance: function () {
			this.initInstance()
			return instance
		}
	}
})()