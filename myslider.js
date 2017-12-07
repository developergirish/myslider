$.fn.mySlider = function(newConfig){
	var constant = {}, that = {}, current = {}, Config = {}, that = $(this.selector), timer = '';
	Config = {
		"scroll" : 100,
		"scrollType" : "%",
		"scrollTime": 1000,
		"nextLabel": ">>",
		"previousLabel" : "<<",
		"nextBtn": "nextLink",
		"previousBtn": "prevLink",
		"startPosition": 0,
		"autoStart": false,
		"autoScrollTime": 3000,
		"nodes": "li",
		"controlNode" : "label",
		"slideCount" : "1",
		"textAlign":"left",
		"thumbnails": false
	}
	if($(newConfig).length)
		$.extend( Config, newConfig );	
	if(Config.slideCount == 0)
		Config.slideCount = 1;	
	if(Config.startPosition > that.children(Config.nodes).length)
		Config.startPosition = 0;	
		
	that.children("li").css({"display":"inline-block", "position":"absolute", "text-align":Config.textAlign});	
	that.before('<div class="controlls"><'+ Config.controlNode +' href="#" class="' + Config.previousBtn + '">' + Config.previousLabel + '</'+Config.controlNode+'><'+Config.controlNode+' href="#" class="' + Config.nextBtn + '" >' + Config.nextLabel + '</'+Config.controlNode+'></div>');
	$("." + Config.previousBtn).css({"float":"left", "display":"inline-block", "margin":"0px", "cursor":"pointer"});
	$("." + Config.nextBtn).css({"float":"right", "display":"inline-block", "margin":"0px", "cursor":"pointer"});	
	that.children(Config.nodes).each(function(i,e){		
		dataLeft = (i - Config.startPosition)*Config.scroll / Config.slideCount;
		left = dataLeft+Config.scrollType;
		slideWidth = ($(".sliderContainer").width() / Config.slideCount);	// - 20
		$(this).attr("data-left", dataLeft).css({"left":left, "width":slideWidth});		
	});
	current = Config.startPosition;
	$(that).prev(".controlls").children("." + Config.nextBtn).click(function(){
		constant = 1;
		var len = that.children(Config.nodes).length-1;
		len = Math.floor(len/Config.slideCount);
		if(current == len){
			constant = len*-1;
			current = -1;
		}		
		current += 1;		
		that.children(Config.nodes).each(function(i,e){
			left = $(this).attr("data-left").trim();
			left = parseInt(left);
			leftPos = left - constant * Config.scroll;
			$(this).attr("data-left", leftPos).animate({'left': leftPos + Config.scrollType}, Config.scrollTime);
		});		
		if(Config.autoStart){
			clearInterval(timer);
			timer = setInterval(function(){
				that.prev(".controlls").children("." + Config.nextBtn).trigger("click");
			}, Config.autoScrollTime);
		}
		if(Config.thumbnails)
			$(".sliderThumbnails ul li").removeClass("active").eq(current).addClass("active");		
		return false;
	});	
	$(that).prev(".controlls").children("." + Config.previousBtn).click(function(){
		constant = 1;
		if(current == 0){
			constant = that.children(Config.nodes).length-1;
			constant *= -1;
			current = that.children(Config.nodes).length;
		}
		current -= 1;
		that.children(Config.nodes).each(function(){
			left = $(this).attr("data-left").trim();
			left = parseInt(left);
			leftPos = left + constant * Config.scroll;
			$(this).attr("data-left", leftPos).animate({'left': leftPos + Config.scrollType}, Config.scrollTime);
		});		
		if(Config.autoStart){
			clearInterval(timer);
			timer = setInterval(function(){
				that.prev(".controlls").children("." + Config.nextBtn).trigger("click");
			}, Config.autoScrollTime);
		}
		if(Config.thumbnails)
			$(".sliderThumbnails ul li").removeClass("active").eq(current).addClass("active");
		return false;
	});	
	if(Config.autoStart){
		timer = setInterval(function(){
			that.prev(".controlls").children("." + Config.nextBtn).trigger("click");
		}, Config.autoScrollTime);
	}	
	if(Config.thumbnails){		
		$(this).after("<div class='sliderThumbnails'><ul></ul></div>");
		if($(this).children("li").length){
			for(var thumb=0; thumb <$(this).children("li").length; thumb++){
				$(".sliderThumbnails ul").append('<li class="">'+(thumb+1)+'</li>');
			}
		}
		$(".sliderThumbnails ul li").eq(0).addClass("active");
		$(".sliderThumbnails ul li").on("click", function(){
			var clicked = $(this).index();
			if(current < clicked){			
				constant = clicked;				
				that.children(Config.nodes).each(function(i,e){
					left = $(this).attr("data-left").trim();
					left = parseInt(left);
					leftPos = left - (constant-current) * Config.scroll;
					$(this).attr("data-left", leftPos).animate({'left': leftPos + Config.scrollType}, Config.scrollTime);
				});
				current = clicked;
				if(Config.autoStart){
					clearInterval(timer);
					timer = setInterval(function(){
						that.prev(".controlls").children("." + Config.nextBtn).trigger("click");
					}, Config.autoScrollTime);
				}
			}
			else if(current > clicked){
				constant = clicked;				
				that.children(Config.nodes).each(function(){
					left = $(this).attr("data-left").trim();
					left = parseInt(left);
					leftPos = left + (current-constant) * Config.scroll;
					$(this).attr("data-left", leftPos).animate({'left': leftPos + Config.scrollType}, Config.scrollTime);
				});
				current = clicked;
				if(Config.autoStart){
					clearInterval(timer);
					timer = setInterval(function(){
						that.prev(".controlls").children("." + Config.nextBtn).trigger("click");
					}, Config.autoScrollTime);
				}		
			}
			$(".active").removeClass("active");
			$(this).addClass("active");
		});
	}	
	destroy = function(){
		that.siblings(".sliderThumbnails, .controlls").remove();
		that.children("li").removeAttr("data-left").removeAttr("style");
		clearInterval(timer);
	};
}

var config = {
	'autoStart' : true,
	'autoScrollTime' : 5000,
	"slideCount" : 1,
	"textAlign": "center",
	"thumbnails": true,
	"nextLabel" : "<img src='http://srchildrenacademy.com/img/next.png' />",
	"previousLabel": "<img src='http://srchildrenacademy.com/img/prev.png' />"
}
var slides = $(".slides").mySlider(config);
//slides:destroy(); // To destroy myslider.
$(window).on("resize", function(){
	that.children(Config.nodes).each(function(i,e){		
		  slideWidth = ($(".sliderContainer").width() / Config.slideCount);	// - 20
		  $(this).css({"width":slideWidth});		
		  var imgaeHeight = $(".mySlider .slides li img").height();
		  that.css("min-height", parseFloat(imgaeHeight)+20);
	});
});
$(window).resize();