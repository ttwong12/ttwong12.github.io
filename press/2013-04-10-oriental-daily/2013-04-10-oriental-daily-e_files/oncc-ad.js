if (typeof SWFObject === 'undefined') {
	document.write('<script type="text/javascript" src="http://home.on.cc/adv/web/corp/js/swfobject.js"></script>');
}
(function() {
var AD = window.$AD = function() {
	return new AD.fn.init(arguments);
}
AD.version = '2.04';
AD.items = [];
AD.getById = function(id) {
	for(var i = 0; i < this.items.length;i++) {
		if (this.items[i].id === id) return this.items[i];
	}
	return null;
};
AD.fn = AD.prototype = {
	init: function(args) {
		if (args.length > 0 && args.length < 4) {
			this.id = AD.getAutoId();
			this.ctnId = 'ctn_'+this.id;
			this.content = args[0];
			this.width = 0;
			this.height = 0;
			//transparent
			this.paramsObj = {'wmode':'opaque', 'allowScriptAccess':'always'};
			this.cssObj = {};
			this.fvarsObj = {};
			this.swfObj = {};
			this.childs = [];
			this.domReady = false;
			this.isFlashOut = false;
			this.isTakeOver = false;
			this.isFloating = false;
			this.align = 'left';
			this.takeOverPos = '';
			this.isTextLink = false;
			this.parent = null;
			this.ctn = null;
			this.floatTimer = null;
			this.url = '';
			this.isSwf = new RegExp('[.]swf$', 'ig').test(this.content);
			this.isIframe = new RegExp('[.](html|htm)$', 'ig').test(this.content); 
			this.isImg = (new RegExp('[.](jpg|jpeg|gif|png)$', 'ig').test(this.content) || new RegExp('adview.php', 'ig').test(this.content));
			if (args.length == 2) {
				if ((typeof args[0]).toLowerCase() === 'string' && args[1].toString().indexOf('http:') != -1) {
					this.isTextLink = !this.isImg;
					this.url = args[1];
				}
			} else {
				this.width = args[1];
				this.height = args[2];
			}
			AD.items.push(this);
			return this;
		}
	},
	params: function(obj) {
		this.storeObj(obj, this.paramsObj);
		return this;
	},
	css: function(obj) {
		var elem = this.getElem();
		if (!elem) {
			this.storeObj(obj, this.cssObj);
		} else {
			this.setCssStyle(elem, obj);
		}
		return this;
	},
	setCssStyle: function(elem, obj) {
		for(var key in obj) {
			cssKey = key.replace(/-([a-z])/ig, function(all, letter){
				return letter.toUpperCase();
			});
			elem.style[cssKey] = obj[key];
		}
	},
	flashVars: function(obj) {
		this.storeObj(obj, this.fvarsObj);
		return this;
	},
	toFlashOut: function() {
		this.isFlashOut = true;
		return this;
	},
	toTakeOver: function(param) {
		this.isTakeOver = true;
		if (param) this.takeOverPos = param;
		return this;
	},
	toFloating: function(align) {
		AD.floating = true;
		this.isFloating = true;
		var instance = this;
		this.ctn = document.createElement('div');
		this.ctn.id = this.ctnId;
		this.ctn.style.width = this.width + 'px';
		this.ctn.style.height = this.height + 'px';
		this.ctn.style.position = 'absolute';
		//this.ctn.style.zIndex = '9999';
		if (align) {
			this.align = align;
		}
		if (this.align === 'right') {
			this.ctn.style.right = '0px';
		} else if (this.align === 'center') {
			this.ctn.style.left = this.getCenterLeft() + 'px';
		} else {
			this.ctn.style.left = '0px';
		}
		//not work on IE
		//this.ctn.style.top = (AD.bodyHeight() - this.height) + 'px';
		this.ctn.style.top = '0px';
		this.ctn.innerHTML = this.render();
		AD.ready(function() {
			document.getElementsByTagName('body')[0].appendChild(instance.ctn);
			if (instance.isIframe) {
				instance.getElem().innerHTML = '<iframe scrolling="no" allowTransparency="true" frameborder="0" width="'+instance.width+'" height="'+instance.height+'" src="'+instance.content+'"></iframe>';
			} else {
				instance.writeFlash();
			}
			instance.floating();
		});
		return this;
	},
	toBottomFloating: function(align) {
		AD.floating = true;
		this.isFloating = true;
		var instance = this;
		this.ctn = document.createElement('div');
		this.ctn.id = this.ctnId;
		this.ctn.style.width = this.width + 'px';
		this.ctn.style.height = this.height + 'px';
		this.ctn.style.position = 'absolute';
		//this.ctn.style.zIndex = '9999';
		if (align) {
			this.align = align;
		}
		if (this.align === 'right') {
			this.ctn.style.right = '0px';
		} else if (this.align === 'center') {
			this.ctn.style.left = this.getCenterLeft() + 'px';
		} else {
			this.ctn.style.left = '0px';
		}
		//not work on IE
		//this.ctn.style.top = (AD.bodyHeight() - this.height) + 'px';
		this.ctn.style.top = '0px';
		this.ctn.innerHTML = this.render();
		AD.ready(function() {
			document.getElementsByTagName('body')[0].appendChild(instance.ctn);
			if (instance.isIframe) {
				instance.getElem().innerHTML = '<iframe scrolling="no" allowTransparency="true" frameborder="0" width="'+instance.width+'" height="'+instance.height+'" src="'+instance.content+'"></iframe>';
			} else {
				instance.writeFlash();
			}
			instance.bottomfloating();
		});
		return this;
	},	
	
	toCatFish: function(align) {
		//TODO
		var instance = this;
		this.ctn = document.createElement('div');
		this.ctn.id = this.ctnId;
		this.ctn.style.width = this.width + 'px';
		this.ctn.style.height = this.height + 'px';
		this.ctn.style.position = 'fixed';
		//this.ctn.style.zIndex = '9999';
	},
	floating: function() {
		var speed = 10;
		var instance = this;
		var posY = AD.bodyHeight() - this.height;
		var curTop = parseInt(this.ctn.style.top, 10);
		var targetTop  = (AD.srollTop()+posY);
		if (curTop != targetTop) {
			var dist = curTop-targetTop;
			var moveStep = parseInt(Math.abs(dist)/speed, 10);
			if (moveStep < 1) moveStep = 1;
			if (dist > 0){
				moveStep = moveStep *-1;
			}
			this.ctn.style.top = (Math.abs(dist) < moveStep) ? targetTop + 'px' :  curTop + moveStep + 'px';
			if (this.align === 'center') {
				this.ctn.style.left = this.getCenterLeft() + 'px';
			}
		}
		this.floatTimer = setTimeout(function() { instance.floating() }, 20);
	},
	
	bottomfloating: function() {
		var speed = 1;
		var instance = this;
		var posY = AD.bodyHeight() - this.height;
		var curTop = parseInt(this.ctn.style.top, 10);
		var targetTop  = (AD.srollTop()+posY);
		if (curTop != targetTop) {
			var dist = curTop-targetTop;
			var moveStep = parseInt(Math.abs(dist)/speed, 10);
			if (moveStep < 1) moveStep = 1;
			if (dist > 0){
				moveStep = moveStep *-1;
			}
			this.ctn.style.top = (Math.abs(dist) < moveStep) ? targetTop + 'px' :  curTop + moveStep + 'px';
			if (this.align === 'center') {
				this.ctn.style.left = this.getCenterLeft() + 'px';
			}
		}
		this.floatTimer = setTimeout(function() { instance.bottomfloating() }, 10);
	},	
	
	setUrl: function(s) {
		this.url = s;
		if (this.isSwf) {
			this.flashVars({'clickTAG':s, 'clickTag':s});
		}
		return this;
	},
	addChild: function(oAD) {
		if (oAD.isFlashOut) {
			if (oAD.paramsObj['wmode'] == 'opaque' && AD.browser.mozilla && (parseFloat(AD.browser.version) < 3.0)) {
				oAD.params({'wmode':'window'});//fix ff overflow auto bug
			}
			if (typeof oAD.cssObj['top'] == 'undefined' && typeof oAD.cssObj['left'] == 'undefined' && typeof oAD.cssObj['bottom'] == 'undefined' && typeof oAD.cssObj['right'] == 'undefined') {
				oAD.css({'display':'none', 'top':'0px', 'left':(this.width-oAD.width)+'px'});
			} else {
				oAD.css({'display':'none'});
			}
		} else if (oAD.toTakeOver) {
			AD.takeOver = true;
			if (oAD.paramsObj['wmode'] == 'opaque' && AD.browser.mozilla && (parseFloat(AD.browser.version) < 3.0)) {
				oAD.params({'wmode':'window'});//fix ff overflow auto bug
			}
			this.css({'visibility':'hidden'});
		}
		if (typeof oAD.cssObj['top'] != 'undefined' || typeof oAD.cssObj['left'] != 'undefined' || typeof oAD.cssObj['right'] != 'undefined' || typeof oAD.cssObj['bottom'] != 'undefined') {
			oAD.cssObj['position'] = 'absolute';
		}
		oAD.parent = this;
		this.childs.push(oAD);
		return this;
	},
	renderHtml: function() {
		if (this.width > 0 && this.height > 0) {
			this.css({width:this.width+'px', height: this.height+'px'});
		}
		var html = '';
		html += '<div id="'+this.id+'"' + this.renderCss(this.cssObj) + '>';
		if (!this.isSwf && !this.isImg) {
			html += this.content;
		} else if (this.isImg) {
			if (this.url != '') {
				html += '<a href="'+this.url+'" target="_blank">';
			}
			html += '<img src="'+this.content+'" border="0" width="'+this.width+'" height="'+this.height+'">';
			if (this.url != '') {
				html += '</a>';
			}
		}
		html += '</div>';
		for(var i = 0; i < this.childs.length;i++) {
			html += this.childs[i].renderHtml();
		}
		return html;
	},
	html: function(str) {
		var html = '';
		var elem = this.getElem();
		if (elem) {
			if (str == undefined) {
				html = elem.innerHTML;
			} else {
				html = elem.innerHTML = str;
			}
		}
		return html;
	},
	getElem: function(elemId) {
		try {
			return document.getElementById((elemId||this.id));
		} catch(e) {}
		return null;
	},
	getCenterLeft: function(width) {
		var w = width || this.width;
		var bw = AD.bodyWidth();
		return Math.floor((bw-w)/2);
	},
	writeFlash: function(oParams, oFlashVars) {
		if (this.isSwf) {
			if (this.isTakeOver) {
				this.fixIESelect();
			}
			var p = (oParams || this.paramsObj);
			var fv = (oFlashVars || this.fvarsObj);
			this.swfObj[this.id] = new SWFObject(this.content, AD.flashPrefix+this.id, this.width, this.height, '9');
			for(var key in p) {
				this.swfObj[this.id].addParam(key, p[key]);
			}
			for(var key in fv) {
				this.swfObj[this.id].addVariable(key, fv[key]);
			}
			this.swfObj[this.id].write(this.id);
		}
		for(var i = 0; i < this.childs.length;i++) {
			this.childs[i].writeFlash();
		}
	},
	rewriteFlash: function() {
		if (this.swfObj[this.id]) {
			this.swfObj[this.id].write(this.id);
		}
	},
	show: function() {
		this.fixIESelect();
		this.rewriteFlash();
		this.css({'visibility':'visible', 'display':'block'});
	},
	hide: function() {
		this.fixIESelect(false);
		if (this.isTakeOver) {
			if (this.parent != null) {
				for(var i = 0; i < this.parent.childs.length;i++) {
					if (this.parent.childs[i].isSwf) {
						this.parent.childs[i].remove();
					} else {
						this.parent.childs[i].css({'visibility':'hidden', 'display':'none'});
					}
				}
				this.parent.show();
			}
		} else {
			if (this.parent != null) {
				this.parent.rewriteFlash();
			}
			if (this.isSwf || this.isIframe) {
				this.remove();
			} else {
				this.css({'visibility':'hidden', 'display':'none'});
			}
		}
		if (this.isFloating) {
			this.getElem(this.ctnId).style.display = 'none';
		}
	},
	remove: function() {
		if (this.floatTimer) clearTimeout(this.floatTimer);
		this.css({'visibility':'hidden', 'display':'none'});
		for(var i = 0; i < this.childs.length;i++) {
			if (this.childs[i] != this) {
				this.childs[i].remove();
			}
		}
		this.getElem(this.id).innerHTML = '';
	},
	write: function() {
		document.write(this.render());
		this.writeFlash();
		return this;
	},
	render: function() {
		var rtnVal = '';
		if (!this.isTextLink) {
			var zIndex = 'z-index:' + (this.cssObj['z-index'] || 9999)+';';
			var margin = '';
			if (this.cssObj['margin-left']) {
				margin += 'margin-left:'+this.cssObj['margin-left']+';';
			}
			if (this.cssObj['margin-right']) {
				margin += 'margin-right:'+this.cssObj['margin-right']+';';
			}
			var id = (this.isFloating) ? '' : ' id="'+this.ctnId+'"';
			rtnVal = '<div'+id+' style="position:relative;width:'+this.width+'px;height:'+this.height+'px;'+zIndex+margin+'">'+this.renderHtml()+'</div>';
		} else {
			rtnVal = '<a href="'+this.url+'" class="adsTextLink" target="_blank">'+this.content+'</a>';
		}
		return rtnVal;
	},
	embed: function(id) {
		var target = this.getElem(id);
		if (target != null) {
			target.innerHTML = this.render();
			this.writeFlash();
		}
		return this;
	},
	renderCss: function(oCss) {
		var css = '';
		for(var key in oCss) {
			css += key + ':' + oCss[key] + ';';
		}
		if (css != '') css = ' style="'+ css + '"';
		return css;
	},
	storeObj: function(objFrom, objTo) {
		for(var key in objFrom) {
			objTo[key] = objFrom[key];
		}
	},
	fixIESelect: function(flag) {
		var attr = (flag == false) ? 'visible' : 'hidden';
		if (AD.browser.msie && (AD.browser.version < 7) && this.parent != null && (this.isTakeOver || this.isFlashOut)) {
			var selectSet = document.getElementsByTagName('select');
			for(var i = 0;i < selectSet.length; i++) {
				selectSet[i].style.visibility = attr;
			}
		}
	}
}
AD.fn.init.prototype = AD.fn;
AD.jQuery = (typeof $ === 'function');
AD.autoId = 0;
AD.hasBoxBg = true;
AD.autoIdPrefix = 'onccAD_';
AD.flashPrefix = 'fl_';
AD.takeOver = false;
AD.floating = false;
AD.getAutoId = function() {
	return this.autoIdPrefix + (this.autoId += 1);
};
AD.addEvent = function(type, evt) {
	if(AD.browser.msie) {
		window.attachEvent('on'+type, evt);
	} else {
		window.addEventListener(type, evt, false);
	}
};
AD.ready = function(evt) {
	if (this.jQuery) {
		$(document).ready(evt);
	} else {
		this.addEvent('load', evt);
	}
};
AD.dropDown = {
	data: {},
	dataRow: {},
	add: function(sects, title, color, url, row) {
		var bgColor = '';
		var txtColor = '#000';
		var s = sects.split(',');
		var colors = color.split('|');
		var r = (row || 0);
		bgColor = colors[0];
		if (colors.length > 1) txtColor = colors[1];
		for(var i = 0; i < s.length; i++) {
			var sect = s[i].replace(/^\s+|\s+$/g, "");
			if (r == 0) {
				if (typeof this.data[sect] === 'undefined') {
					this.data[sect] = [];
				}
				this.data[sect].push({'title':title, 'bgColor':bgColor, 'txtColor':txtColor, 'url':url});
			} else {
				if (typeof this.dataRow[sect] === 'undefined') {
					this.dataRow[sect] = [];
				}
				this.dataRow[sect].push({'title':title, 'bgColor':bgColor, 'txtColor':txtColor, 'url':url, 'row':r});
			}
		}
	}
};
AD.headline = {
	data: {},
	add: function(opts) {
		if (typeof opts.sections === 'undefined') {
			if (typeof console !== 'undefined') console.log('Missing sections!!!');
			return;
		}
		if (typeof opts.title === 'undefined') {
			if (typeof console !== 'undefined') console.log('Missing title!!!');
			return;
		}
		if (typeof opts.bgColor === 'undefined') {
			if (typeof console !== 'undefined') console.log('Missing bgColor!!!');
			return;
		}
		if (typeof opts.url === 'undefined') {
			if (typeof console !== 'undefined') console.log('Missing url!!!');
			return;
		}
		var s = opts.sections.split(',');
		for (var i=0; i<s.length; i++) {
			var sect = s[i].replace(/^\s+|\s+$/g, "");
			if (typeof this.data[sect] === 'undefined') {
				this.data[sect] = [];
			}
			this.data[sect].push({
				title: opts.title,
				bgColor: opts.bgColor,
				txtColor : (typeof opts.txtColor !== 'undefined') ? opts.txtColor : '#000',
				url: opts.url,
				photo: (typeof opts.photo !== 'undefined') ? opts.photo : '',
				paragraph: (typeof opts.paragraph !== 'undefined') ? opts.paragraph : ''
			});
		}
	}
};
AD.feature = {
	data: [],
	add: function(name, title, photo, url, impression) {
		this.data.push({'name':name, 'title':title, 'photo':photo,'url':url, 'impression':impression});
	}
};
AD.keyword = {
	data: {},
	add: function(sections, keywords, objAD, className, cusX, cusY) {
		var c = '';
		if (typeof className != 'undefined') c = ' ' + className;
		this.func(sections, keywords, objAD, className, cusX, cusY);
		/*
		if (typeof ODN.keywordContent != 'undefined') {
			ODN.keywordContent.addPopup(sections, keywords, objAD, className);
		} else if (typeof TSN.keywordContent != 'undefined') {
			TSN.keywordContent.addPopup(sections, keywords, objAD, className);
		}
		*/
	},
	func: function() {}
};
AD.srollTop = function() {
  return (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
};
AD.bodyHeight = function() {
	return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
};
AD.bodyWidth = function() {
	return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
};
AD.hFrame = {
	loaded: false,
	cssPath: '',
	right: '',
	left: '',
	loadOnReady: false,
	load: function(cssPath, left, right) {
		if (typeof ODN !== 'undefined' || typeof TSN !== 'undefined') {
			var root = (ODN.sect) ? ODN : TSN;
			
			//if (root.pubDate === root.arcDate) {
				this.cssPath = cssPath;
				this.right = right;
				this.left = left;
				AD.attachFile(cssPath);
				this.loaded = true;
			//}
		} else if (window.ONCC || window.$hframe) {
			this.cssPath = cssPath;
			this.right = right;
			this.left = left;
			AD.attachFile(cssPath);
			this.loaded = true;
		}
	},
	show: function() {
		this.left.show();
		this.right.show();
	},
	close: function() {
		this.left.hide();
		this.right.hide();
		var cssLinks = document.getElementsByTagName("link");
		for(var i=0; i < cssLinks.length; i++) {
			if(cssLinks[i].getAttribute("href").toLowerCase()==this.cssPath) {
				cssLinks[i].disabled = true;
			}
		}
		var corpbar;
		try {
			corpbar = document.getElementById('corpbar');
		} catch(e) {
		}
		if (corpbar) {
			corpbar.className = corpbar.className.replace('mini', '');
		}
	}
};
AD.ctnBox = {
	loaded: false,
	title: '',
	desc: '',
	img: {},
	target: '_self',
	url: '',
	load: function(title, desc, url, img, target) {
		this.title = title;
		this.desc = desc;
		this.url = url;
		this.img = img;
		this.target = (target || '_self');
		this.loaded = true;
	}
};
AD.attachFile = function(path) {
	var fileType = (new RegExp('[.]css$', 'ig').test(path)) ? 'link' : 'script';
	var elem = document.createElement(fileType);
	elem.rel = (fileType == 'link') ? 'stylesheet' : '';
	elem.type = (fileType == 'link') ? 'text/css' : 'text/javascript';
	elem.href = path;
	document.getElementsByTagName('head')[0].appendChild(elem);
}

AD.hide = function(content) {
	//if no content specific, will hide all items
	var l = AD.items.length;
	
	if (!content) {
		while(l--) {
			AD.items[l].hide();
		}
	} else {
		while(l--) {
			if (AD.items[l].content === content) {
				AD.items[l].hide();
			}
		}
	}
};

AD.hideByType = function(type) {
	var l = AD.items.length;
	if (type === 'floating') {
		while(l--) {
			if (AD.items[l].isFloating) {
				AD.items[l].hide();
			}
		}
	} else if (type === 'flashout') {
		while(l--) {
			if (AD.items[l].isFlashOut) {
				AD.items[l].hide();
			}
		}
	} else if (type === 'takeover') {
		while(l--) {
			if (AD.items[l].isTakeOver) {
				AD.items[l].hide();
			}
		}
	} else if (type === 'textlink') {
		while(l--) {
			if (AD.items[l].isTextLink) {
				AD.items[l].hide();
			}
		}
	}
};

var userAgent = navigator.userAgent.toLowerCase();
// Figure out what browser is being used
AD.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

AD.addEvent('unload', function() {
	var l = AD.items.length;
	while(l--) {
		AD.items[l] = null;
	}
});

})();
