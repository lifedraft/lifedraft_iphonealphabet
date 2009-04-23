
jQuery.fn.lifedraft_iphonealphabet = function(options) {
  var options = jQuery.extend({
    elements: "li a",
    
    marginTop: "auto",
    paddingTop: 10,
    paddingBottom: 10,
    
    setLetter: function(element, letter, id, defaultConstruct) {
      jQuery(element).parent().before(defaultConstruct);
    },
    
    getLetter: function(element) {
      return element.innerHTML.substring(0, 1);
    },
    speed: 3000
  }, options);

  var parent = this,
  parentOffset = this.offset(),
  elements = jQuery(options.elements),
  nameSpace = "alphabet-",
  
  alphabetElements = [],
  mapLetterOrderedIndex = {},
  mapLetterOrderedOffsetTop = {},
  parentHeight = parent.height(),
  scrollSpeed = options.speed/parentHeight;

  for (var i=0; i < elements.length; i++) {

    var firstLetter = options.getLetter(elements[i]);
    if(!(nameSpace+firstLetter in mapLetterOrderedIndex)) {
      options.setLetter(elements[i], firstLetter, nameSpace+firstLetter, "<li class='"+nameSpace+"letter'><span id='"+nameSpace+firstLetter+"'><strong>"+firstLetter+"</strong></span></li>");
      mapLetterOrderedIndex[nameSpace+firstLetter] = i;
      alphabetElements.push("<li><a href='#"+nameSpace+firstLetter+"'>"+firstLetter+"</a></li>");
    }
    
  };
  
  parent.before("<ol id='"+nameSpace+"list'>"+alphabetElements.join("")+"</ol>");
  
  jQuery("#"+nameSpace+"list a").click(function(event) {
    var href = this.href.split("#")[1];
    var duration = (document.documentElement.scrollTop || document.body.scrollTop)-mapLetterOrderedOffsetTop[href].offset;
    if(duration < 0) duration = -(duration);
    duration =  duration*scrollSpeed;
    
    jQuery("html").animate({scrollTop: mapLetterOrderedOffsetTop[href].offset}, duration, function() {
      window.location.hash = href;
    });
    return false;
  });
  

  var calculatePositions = function() {
    var prevLetter;
    for (var letter in mapLetterOrderedIndex) {
      var offset = Math.ceil(jQuery("#"+letter+"").offset().top);
      mapLetterOrderedOffsetTop[letter] = { offset: offset };

      if(prevLetter) {
        mapLetterOrderedOffsetTop[prevLetter].diff = offset-mapLetterOrderedOffsetTop[prevLetter].offset;
      }
      var prevLetter = letter;
    };
    mapLetterOrderedOffsetTop[prevLetter].diff = (parent.offset().top + parentHeight)-mapLetterOrderedOffsetTop[prevLetter].offset;  
  };
  calculatePositions();
  
  var between = function(_this, first, second) {
  	return _this >= first && _this <= second;
  };
  
  var height = jQuery(".alphabet-letter span").height();
  var alphabetLetters = jQuery(".alphabet-letter span").bind("scroll", function(event, vOffset) {
    var offsets = mapLetterOrderedOffsetTop[this.id];
    var offset = offsets.offset;
    var diff = offset+offsets.diff;

    if(between(vOffset, offset, diff)) {
      
      lifedraft_style.set("#"+this.id+"", {position:"fixed", top: 0});
      if( vOffset - diff > -(height) ) lifedraft_style.set("#"+this.id+"", {top: ((diff-height) - vOffset)+"px"});
      
    } else {
      lifedraft_style.set("#"+this.id+"", {position:"static"});
    }
  });
  
  var resize = function() {
    var vOffset = (document.documentElement.scrollTop || document.body.scrollTop),
    offset  = (vOffset < parentOffset.top && options.marginTop == "auto") ? (parentOffset.top - vOffset) + options.paddingTop : options.paddingTop,
    height  = Math.round(((window.innerHeight || document.documentElement.clientHeight) - options.paddingBottom - offset) / alphabetElements.length );
    
    lifedraft_style.set("#alphabet-list", { top: offset + "px"});
    lifedraft_style.set("#"+nameSpace+"list a", {
      height: height+"px", 
      "line-height": height+"px"
    });
  };
  
  resize();
  jQuery(window).bind("resize", function() {
    resize();
  });

  jQuery(window).bind("scroll", function(event) {
    var vOffset = (document.documentElement.scrollTop || document.body.scrollTop);
    alphabetLetters.trigger("scroll", vOffset);
    resize();
  });
  
  return this;
};