/* Load demo image into canvas */
Caman(".canvas-working>img", function () {
  this.render();
});
Caman(".canvas-original>img", function () {
  this.render();
});

var operationStack = [];

// function resetWorkingCanvas(render = false, callback = null){
// 	Caman(".canvas-working>canvas", function () {
// 		this.reset();
// 		var self = this;
// 		$(operationStack).each(function(index, el) {
// 			console.log(el);
// 			switch (el.featureName){
// 				case 'Curves':
// 						self.curves('rgb', [el.param[0], 255-el.param[1]], [el.param[2], 255-el.param[3]], [el.param[4], 255-el.param[5]], [el.param[6], 255-el.param[7]]).render();
// 					break;
// 				case 'Exposure':
// 						self.exposure(el.param[0]);
// 					break;
// 				case 'Gamma':
// 						self.gamma(el.param[0]);
// 					break;
// 				case 'Contrast':
// 						self.contrast(el.param[0]);
// 					break;
// 				case 'Brightness':
// 						self.brightness(el.param[0]);
// 					break;
// 				case 'Colorize':
// 						self.colorize(el.param[0], el.param[1]);
// 					break;
// 				default:
// 					break;
// 			}
// 		});
// 		if (render){
// 			if (callback !== null && typeof(callback) === 'function'){
// 				this.render(callback);
// 			} else{
// 				this.render();
// 			}
// 		}
// 	});
// }

function resetWorkingCanvas(i, callback = null){
	if (operationStack.length === 0){
		Caman(".canvas-working>canvas", function () {
			this.reset();
		});
	}
	if (i >= operationStack.length) {
		if (callback !== null && typeof(callback) === 'function'){
			callback();
		}
		return;
	}

	Caman(".canvas-working>canvas", function () {
		if (i===0) this.reset();
		var el = operationStack[i];

		switch (el.featureName){
			case 'Curves':
					this.curves('rgb', [el.param[0], 255-el.param[1]], [el.param[2], 255-el.param[3]], [el.param[4], 255-el.param[5]], [el.param[6], 255-el.param[7]]);
				break;
			case 'Exposure':
					this.exposure(el.param[0]);
				break;
			case 'Gamma':
					this.gamma(el.param[0]);
				break;
			case 'Contrast':
					this.contrast(el.param[0]);
				break;
			case 'Brightness':
					this.brightness(el.param[0]);
				break;
			case 'Colorize':
					this.colorize(el.param[0], el.param[1]);
				break;
			default:
				break;
		}
		this.render(function(){
			resetWorkingCanvas(i+1, callback);
		});
	});
}


/* Features */

var features = [
{
	'name': 'Curves',
	'desc': 'Lighten the blacks and decrease shadows in your photo',
	'keywords': ['fade, lighten, darken, washed out'],
}, {
	'name': 'Brightness',
	'desc': 'Expand the highlights in your photo',
	'keywords': ['fade, lighten, darken, washed out'],
}, {
	'name': 'Contrast',
	'desc': 'Increase contrast to make your photo less flat',
	'keywords': ['fade'],
}, {
	'name': 'Colorize',
	'desc': 'Uniformly shifts the colors in an image towards the given color.',
	'keywords': ['tone'],
}, {
	'name': 'Exposure',
	'desc': 'Simple exposure adjustment',
	'keywords': ['fade, lighten, darken, washed out'],
}, {
	'name': 'Gamma',
	'desc': 'Adjust the gamma of the image',
	'keywords': ['fade, lighten, darken, washed out'],
}
];

var Feature = Backbone.Model.extend({
	initialize: function () {
		// console.log('model working');
	}
});

// create a feature view
var FeatureView = Backbone.View.extend({
	// model: ...
	tagName: 'li',
	template: _.template($('#feature-view').html()),
	// hover over a feature and show preview
	events: {
		'mouseenter': 'previewFeature',
		'mouseleave': 'resetCanvas',
		'click': 'openControls'
	},
	busy: false,
	previewFeature: function (){
		$('.canvas-original').show();
		var featureName = this.model.get('name').toLowerCase();
		resetWorkingCanvas(0, function(){
			Caman(".canvas-working>canvas", function () {
				switch (featureName){
					case 'curves':
							this.curves('rgb', [0, 0], [100, 120], [180, 240], [255, 255]);
						break;
					case 'brightness':
							this.brightness(20);
						break;
					case 'contrast':
							this.contrast(-20);
						break;
					case 'colorize':
							this.colorize("#4090D5", 20);
						break;
					case 'exposure':
							this.exposure(20);
						break;
					case 'gamma':
							this.gamma(1.5);
						break;
					default:
						break;
				}
				this.render();
			});
		});
	},
	// resetCanvas: function (){
	// 	var self = this;
	// 	resetWorkingCanvas();
	// 	$('.canvas-original').hide();
	// },
	openControls: function (){
		filteredWorkflows.reset();
		filteredFeatures.reset();
		resetWorkingCanvas(0, function(){});
		$('.canvas-original').hide();

		$controls.find('.control').hide();
		$controls.show();
		
		var featureName = this.model.get('name').toLowerCase();

		switch (featureName){
			case 'curves':
				$controls.find('.control-curves').show();
				break;
			case 'brightness':
				$controls.find('.control-brightness').show();
				break;
			case 'contrast':
				$controls.find('.control-contrast').show();
				break;
			case 'colorize':
				$controls.find('.control-colorize').show();
				break;
			case 'exposure':
				$controls.find('.control-exposure').show();
				break;
			case 'gamma':
				$controls.find('.control-gamma').show();
				break;
			default:
				break;
		}
	},
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// create a total collection
var FeatureCollection = Backbone.Collection.extend({
	model: Feature
});
var featureDb = new FeatureCollection();
featureDb.add(features);

// create a filtered collection
var filteredFeatures = new FeatureCollection();
var currentFeatures = new FeatureCollection();





/* Workflows */

var workflows = [{
	// 'wid': 1,
	'name': 'Vintage Effect',
	'desc': 'Add vintage effect to your photo',
	'keywords': ['fade'],
	'instruction': 'Curves + Levels + Color Adjustment',
	'step-number': 3,
	'features': [0,1,2]
}];

var Workflow = Backbone.Model.extend({
	initialize: function(){
		// console.log(workflow model working);
	}
});

var WorkFlowCollection = Backbone.Collection.extend({
	model: Workflow
});

var workflowDb = new WorkFlowCollection();
workflowDb.add(workflows);

var filteredWorkflows = new WorkFlowCollection();

var WorkflowView = Backbone.View.extend({
	template: _.template($('#workflow-view').html()),
	tagName: 'li',
	events: {
		'click .tutorial': 'openTutorial',
		'click .grab-tools': 'grabTools'
	},
	openTutorial: function (){
		$('.tools').addClass('tutorial-mode');
		this.grabTools();
	},
	grabTools: function (){
		var tools = this.model.get('features');
		currentFeatures.reset();
		$.each(tools, function(i){
			currentFeatures.add(features[i]);
		});
		filteredWorkflows.reset();
		filteredFeatures.reset();
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var WorkflowSearchResultsView = Backbone.View.extend({
	template: _.template($('#workflow-search-results-view').html()),
	initialize: function(){
		this.listenTo(this.collection, 'reset', this.render);
	},
	render: function(){
		this.$el.html(this.template());

		var $ul = this.$('ul');
		this.collection.each(function(model){
			var workflowView = new WorkflowView({'model': model});
			$ul.append(workflowView.render().el);
		});
		return this;
	}
});

// create a search results view and bind the filtered collection to it
var FeatureSearchResultsView = Backbone.View.extend({
	template: _.template($('#feature-search-results-view').html()),
	// in that view, listen to the changes in the filtered collection
	initialize: function() {
		this.listenTo(this.collection, 'reset', this.render);
	},
	render: function() {
		this.$el.html(this.template());

		var $ul = this.$('ul');
		this.collection.each(function(model) {
			var featureView = new FeatureView({'model': model});
			$ul.append(featureView.render().el);
		});
		return this;
	}
});

// create a search bar view
var SearchBarView = Backbone.View.extend({
	template: _.template($('#search-bar-view').html()),
	events: {
		// in that view, add event for input on keyup, add callback func
		'keyup input': 'update',
		'click button': 'clear',
	},
	render: function () {
		this.$el.html(this.template());
		return this;
	},
	clear: function (){
		filteredWorkflows.reset();
		filteredFeatures.reset();
		this.$('input').val('');
		this.$('button').hide();
	},
	update: function (){
		$clear = this.$('button');
		if ((this.$('input').val()) !== ''){
			$clear.show();
		} else{
			$clear.hide();
		}
		$controls.hide();
		currentFeatures.reset();
		this.updateFilteredWorkFlows();
		this.updateFilteredFeatures();
	},
	updateFilteredFeatures: function (e) {
		// in callback func, update filtered collection
		var searchPhrases = this.$('input').val().toLowerCase().split(' '),
			filteredAll = [];

		$.each(searchPhrases, function(index, searchPhrase) {
			if (stopWords.indexOf(searchPhrase) === -1){
				filtered = featureDb.filter(function(model){
					var keywords = model.get('keywords'),
						name = model.get('name').toLowerCase(),
						found = false;

					if (searchPhrase !== '' && name.indexOf(searchPhrase) !== -1){
						return true;
					}

					if (searchPhrase !== ''){
						$.each(keywords, function(index, elem){
						 if (elem.toLowerCase().indexOf(searchPhrase) !== -1){
								found = true;
								return false;
							 } else{
								return true;
							 }
						});
					}

					return found;
				});
				filteredAll = filteredAll.concat(filtered);
			}
		});
			
		filteredFeatures.reset(filteredAll);
	},
	updateFilteredWorkFlows: function (e) {
		// in callback func, update filtered collection
		var searchPhrases = this.$('input').val().toLowerCase().split(' '),
			filteredAll = [];

		$.each(searchPhrases, function(index, searchPhrase) {
			if (stopWords.indexOf(searchPhrase) === -1){
				filtered = workflowDb.filter(function(model){
					var keywords = model.get('keywords'),
						name = model.get('name').toLowerCase(),
						found = false;

					if (searchPhrase !== '' && name.indexOf(searchPhrase) !== -1){
						return true;
					}

					if (searchPhrase !== ''){
						$.each(keywords, function(index, elem){
						 if (elem.toLowerCase().indexOf(searchPhrase) !== -1){
								found = true;
								return false;
							 } else{
								return true;
							 }
						});
					}

					return found;
				});
				filteredAll = filteredAll.concat(filtered);
			}
		});

		filteredWorkflows.reset(filteredAll);
	}
});


// create a grab tools view
// listen to reset of the current tools collection
var GrabToolsView = Backbone.View.extend({
	template: _.template($('#grab-tools-view').html()),
	initialize: function(){
		this.listenTo(this.collection, 'reset', this.clearTools);
		this.listenTo(this.collection, 'add', this.addTool);
	},
	events:{
		'click li': 'openTool'
	},
	clearTools: function(){
		this.$('ul').empty();
	},
	addTool: function(feature){
		var featureName = feature.get('name');

		if (this.$('ul>li').length === 0 && $('.tools').hasClass('tutorial-mode')){
			this.openToolHandler(featureName);
		}

		this.$('ul').append('<li>' + featureName + '</li>');
	},
	openToolHandler: function (featureName){
		$('.canvas-original').hide();

		$controls.find('.control').hide();
		$controls.show();

		switch (featureName.toLowerCase()){
			case 'curves':
				$controls.find('.control-curves').show();
				break;
			case 'brightness':
				$controls.find('.control-brightness').show();
				break;
			case 'contrast':
				$controls.find('.control-contrast').show();
				break;
			default:
				break;
		}
	},
	openTool: function (e){
		var featureName = $(e.target).html().toLowerCase();

		this.openToolHandler(featureName);
	},
	render: function(){
		this.$el.html(this.template());
		return this;
	}
});


// create a control view for different features
var BrightnessControlView = Backbone.View.extend({
	brightnessValue: 0,
	template: _.template($('#brightness-control-view').html()),
	events: {
		'click button.close': 'close',
		'click button.apply': 'apply',
		'click button.cancel': 'close'
	},
	apply: function (){
		var self = this;

		resetWorkingCanvas(0, function(){
			Caman(".canvas-working>canvas", function () {
				this.brightness(self.brightnessValue).render(
					function(){
						operationStack.push({
							featureName: 'Brightness',
							param: [self.brightnessValue]
						});
					}
				);
			});
		});

		Caman(".canvas-original>canvas", function () {
			this.brightness(self.brightnessValue).render();
		});

		// setTimeout(function(){
		// 	operationStack.push({
		// 		featureName: 'Brightness',
		// 		param: [self.brightnessValue]
		// 	});
		// }, 500);

		$controls.hide();
	},
	close: function (){
		$controls.hide();
	},
	render: function(){
		this.$el.html(this.template());
		var $brightness = this.$('span'),
			self = this;
		this.$('#brightness-slider').slider({
			min: -100,
			value: 0,
			max: 100,
			stop: function( event, ui ) {
				$brightness.html(ui.value);
				self.brightnessValue = ui.value;

				resetWorkingCanvas(0, function(){
					Caman(".canvas-working>canvas", function () {
						this.brightness(ui.value).render();
					});
				});
			}
		});
		return this;
	}
});

var ContrastControlView = Backbone.View.extend({
	contrastValue: 0,
	template: _.template($('#contrast-control-view').html()),
	events: {
		'click button.close': 'close',
		'click button.apply': 'apply',
		'click button.cancel': 'close'
	},
	apply: function (){
		var self = this;

		resetWorkingCanvas(0, function(){
			Caman(".canvas-working>canvas", function () {
				this.contrast(self.contrastValue).render(
					function(){
						operationStack.push({
							featureName: 'Contrast',
							param: [self.contrastValue]
						});
					}
				);
			});
		});

		Caman(".canvas-original>canvas", function () {
			this.contrast(self.contrastValue).render();
		});

		// setTimeout(function(){
		// 	operationStack.push({
		// 		featureName: 'Contrast',
		// 		param: [self.contrastValue]
		// 	});
		// }, 500);

		$controls.hide();
	},
	close: function (){
		$controls.hide();
	},
	render: function(){
		this.$el.html(this.template());
		var $contrast = this.$('span'),
			self = this;
		this.$('#contrast-slider').slider({
			min: -100,
			value: 0,
			max: 100,
			stop: function( event, ui ) {
				$contrast.html(ui.value);
				resetWorkingCanvas(0, function(){
					Caman(".canvas-working>canvas", function () {
						this.contrast(ui.value).render();
					});
				});
				self.contrastValue = ui.value;
			}
		});
		return this;
	}
});

var ColorizeControlView = Backbone.View.extend({
	$colorPickerValue: null,
	$colorSliderValue: null,
	template: _.template($('#colorize-control-view').html()),
	events: {
		'click button.close': 'close',
		'click button.apply': 'apply',
		'click button.cancel': 'close'
	},
	apply: function (){
		var self = this;

		resetWorkingCanvas(0, function(){
			Caman(".canvas-working>canvas", function () {
				this.colorize(self.$colorPickerValue.val(), self.$colorSliderValue.val()).render(
					function(){
						operationStack.push({
							featureName: 'Colorize',
							param: [self.$colorPickerValue.val(), self.$colorSliderValue.val()]
						});
					}
				);
			});
		});
		
		Caman(".canvas-original>canvas", function () {
			this.colorize(self.$colorPickerValue.val(), self.$colorSliderValue.val()).render();
		});

		$controls.hide();

		// setTimeout(function(){
		// 	operationStack.push({
		// 		featureName: 'Colorize',
		// 		param: [self.$colorPickerValue.val(), self.$colorSliderValue.val()]
		// 	});
		// }, 500);
	},
	close: function (){
		$controls.hide();
	},
	render: function(){
		this.$el.html(this.template());

		var $colorize = this.$('span'),
			self = this;

		this.$colorPickerValue = this.$('.color-picker-value');
		this.$colorSliderValue = this.$('.color-slider-value');

		this.$('#color-picker').iris({
			hide: false,
			palettes: true,
			change: function(event, ui) {
				resetWorkingCanvas(0, function(){
					Caman(".canvas-working>canvas", function () {
						this.colorize(ui.color.toString(), self.$colorSliderValue.val()).render();
					});
				});
				self.$colorPickerValue.val(ui.color.toString());
			}
		});

		this.$('#colorize-slider').slider({
			min: 0,
			value: 20,
			max: 100,
			stop: function( event, ui ) {
				resetWorkingCanvas(0, function(){
					Caman(".canvas-working>canvas", function () {
						this.colorize(self.$colorPickerValue.val(), ui.value).render();
					});
				});
				$colorize.html(ui.value);
				self.$colorSliderValue.val(ui.value);
			}
		});
		
		return this;
	}
});

var ExposureControlView = Backbone.View.extend({
	exposureValue: 0,
	template: _.template($('#exposure-control-view').html()),
	events: {
		'click button.close': 'close',
		'click button.apply': 'apply',
		'click button.cancel': 'close'
	},
	apply: function (){
		var self = this;

		resetWorkingCanvas(0, function(){
			Caman(".canvas-working>canvas", function () {
				this.exposure(self.exposureValue).render(
					function(){
						operationStack.push({
							featureName: 'Exposure',
							param: [self.exposureValue]
						});
					}
				);
			});
		});
		
		Caman(".canvas-original>canvas", function () {
			this.exposure(self.exposureValue).render();
		});

		// setTimeout(function(){
		// 	operationStack.push({
		// 		featureName: 'Exposure',
		// 		param: [self.exposureValue]
		// 	});
		// }, 500);

		$controls.hide();
	},
	close: function (){
		$controls.hide();
	},
	render: function(){
		this.$el.html(this.template());
		var $exposure = this.$('span'),
			self = this;

		this.$('#exposure-slider').slider({
			min: -100,
			value: 0,
			max: 100,
			stop: function( event, ui ) {
				$exposure.html(ui.value);
				self.exposureValue = ui.value;
				resetWorkingCanvas(0, function(){
					Caman(".canvas-working>canvas", function () {
						this.exposure(ui.value).render();
					});
				});
			}
		});
		return this;
	}
});

var GammaControlView = Backbone.View.extend({
	gammaValue: 1,
	template: _.template($('#gamma-control-view').html()),
	events: {
		'click button.close': 'close',
		'click button.apply': 'apply',
		'click button.cancel': 'close'
	},
	apply: function (){
		var self = this;

		resetWorkingCanvas(0, function(){
			Caman(".canvas-working>canvas", function () {
				this.gamma(self.gammaValue).render(
					function(){
						operationStack.push({
							featureName: 'Gamma',
							param: [self.gammaValue]
						});
					}
				);
			});
		});

		Caman(".canvas-original>canvas", function () {
			this.gamma(self.gammaValue).render();
		});

		// setTimeout(function(){
		// 	operationStack.push({
		// 		featureName: 'Gamma',
		// 		param: [self.gammaValue]
		// 	});
		// }, 500);

		$controls.hide();
	},
	close: function (){
		$controls.hide();
	},
	render: function(){
		this.$el.html(this.template());
		var $gamma = this.$('span'),
			self = this;

		this.$('#gamma-slider').slider({
			min: 0,
			value: 1,
			step: 0.01,
			max: 5,
			stop: function( event, ui ) {
				$gamma.html(ui.value);
				self.gammaValue = ui.value;
				resetWorkingCanvas(0, function(){
					Caman(".canvas-working>canvas", function () {
						this.gamma(ui.value).render();
					});
				});
			}
		});
		return this;
	}
});

var CurvesControlView = Backbone.View.extend({
	template: _.template($('#curves-control-view').html()),
	events: {
		'click button.close': 'close',
		'click button.apply': 'apply',
		'click button.cancel': 'close'
	},
	apply: function (){
		var self = this;

		resetWorkingCanvas(0, function(){
			Caman(".canvas-working>canvas", function () {
				this.curves('rgb', [self.pts[0], 255-self.pts[1]], [self.pts[2], 255-self.pts[3]], [self.pts[4], 255-self.pts[5]], [self.pts[6], 255-self.pts[7]]).render(
					function(){
						operationStack.push({
							featureName: 'Curves',
							param: self.pts
						});
					}
				);
			});
		});

		Caman(".canvas-original>canvas", function () {
			this.curves('rgb', [self.pts[0], 255-self.pts[1]], [self.pts[2], 255-self.pts[3]], [self.pts[4], 255-self.pts[5]], [self.pts[6], 255-self.pts[7]]).render();
		});

		// setTimeout(function(){
		// 	operationStack.push({
		// 		featureName: 'Curves',
		// 		param: self.pts
		// 	});
		// }, 500);

		$controls.hide();
	},
	close: function (){
		$controls.hide();
	},
	pts: [],
	drawBezierCurve: function(){
		var c = this.$('canvas').get(0),
			ctx = c.getContext("2d"),
			self = this;

		self.pts = [];

		this.$('.control-point').each(function(index, el) {
			self.pts.push(
				parseInt($(el).css('left'),10)
			);
			self.pts.push(
				parseInt($(el).css('top'),10)
			);
		});

		ctx.clearRect(0,0,255,255);
		ctx.beginPath();
		ctx.moveTo(this.pts[0],this.pts[1]);
		ctx.bezierCurveTo(this.pts[2],this.pts[3],this.pts[4],this.pts[5],this.pts[6],this.pts[7]);
		ctx.stroke();
	},
	render: function(){
		this.$el.html(this.template());

		var latestPos = {clientX: 0, clientY: 0},
			mouseDown = false,
			controlPoint = null,
			self = this;

		this.$('.curves-canvas').on('mousedown', function(e){
			if ($(e.target).hasClass('control-point')){
				mouseDown = true;
				controlPoint = e.target;
				latestPos.clientX = e.clientX;
				latestPos.clientY = e.clientY;
			}
		}).on('mousemove', function(e){
			if (controlPoint === null) return;
			var $controlPoint = $(controlPoint);

			if (mouseDown){
				newTop = parseInt($controlPoint.css('top'), 10) + e.clientY - latestPos.clientY;
				newLeft = parseInt($controlPoint.css('left'), 10) + e.clientX - latestPos.clientX;

				if (newTop > 255) newTop = 255;
				if (newLeft > 255) newLeft = 255;

				if (newTop < 0) newTop = 0;
				if (newLeft < 0) newLeft = 0;

				$controlPoint.css({
					'top': newTop + 'px',
					'left': newLeft + 'px'
				});

				latestPos.clientX = e.clientX;
				latestPos.clientY = e.clientY;

				self.drawBezierCurve();
			}
		}).on('mouseup', function(e){
			mouseDown = false;
			resetWorkingCanvas(0, function(){
				Caman(".canvas-working>canvas", function () {
					this.curves('rgb', [self.pts[0], 255-self.pts[1]], [self.pts[2], 255-self.pts[3]], [self.pts[4], 255-self.pts[5]], [self.pts[6], 255-self.pts[7]]).render();
				});
			});
		});

		return this;
	}
});

var stopWords = ['a','about','above','after','again','against','all','am','an','and','any','are','aren\'t','as','at','be','because','been','before','being','below','between','both','but','by','can\'t','cannot','could','couldn\'t','did','didn\'t','do','does','doesn\'t','doing','don\'t','down','during','each','few','for','from','further','had','hadn\'t','has','hasn\'t','have','haven\'t','having','he','he\'d','he\'ll','he\'s','her','here','here\'s','hers','herself','him','himself','his','how','how\'s','i','i\'d','i\'ll','i\'m','i\'ve','if','in','into','is','isn\'t','it','it\'s','its','itself','let\'s','me','more','most','mustn\'t','my','myself','no','nor','not','of','off','on','once','only','or','other','ought','our','ours','ourselves','out','over','own','same','shan\'t','she','she\'d','she\'ll','she\'s','should','shouldn\'t','so','some','such','than','that','that\'s','the','their','theirs','them','themselves','then','there','there\'s','these','they','they\'d','they\'ll','they\'re','they\'ve','this','those','through','to','too','under','until','up','very','was','wasn\'t','we','we\'d','we\'ll','we\'re','we\'ve','were','weren\'t','what','what\'s','when','when\'s','where','where\'s','which','while','who','who\'s','whom','why','why\'s','with','won\'t','would','wouldn\'t','you','you\'d','you\'ll','you\'re','you\'ve','your','yours','yourself','yourselves'];


// render views in html
var $search = $('.search'),
	$bar = $search.find('.bar'),
	$suggestions = $search.find('.suggestions'),
	$tools = $('.tools'),
	$controls = $('.controls');

$suggestions.on('mouseleave', function(e){
	resetWorkingCanvas(0, function(){});
	$('.canvas-original').hide();
});

var searchBarView = new SearchBarView({collection: filteredFeatures}),
	workflowSearchResultsView = new WorkflowSearchResultsView({collection: filteredWorkflows}),
	featureSearchResultsView = new FeatureSearchResultsView({collection: filteredFeatures}),
	grabToolsView = new GrabToolsView({collection: currentFeatures}),
	brightnessControlView = new BrightnessControlView(),
	contrastControlView = new ContrastControlView(),
	colorizeControlView = new ColorizeControlView(),
	exposureControlView = new ExposureControlView(),
	gammaControlView = new GammaControlView(),
	curvesControlView = new CurvesControlView();

$bar.prepend(searchBarView.render().el);
$suggestions.append(workflowSearchResultsView.render().el);
$suggestions.append(featureSearchResultsView.render().el);
$tools.append(grabToolsView.render().el);
$controls
	.append(brightnessControlView.render().el)
	.append(contrastControlView.render().el)
	.append(colorizeControlView.render().el)
	.append(exposureControlView.render().el)
	.append(gammaControlView.render().el)
	.append(curvesControlView.render().el);


// var featureView = new FeatureView({model: feature1});
// $('body').append(featureView.render().el);