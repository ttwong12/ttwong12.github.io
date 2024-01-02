ODN.keywordContent = {
	autoId: 0,
	data: {},
	getAutoId: function() {
		this.autoId++;
		return this.autoId;
	},
	add: function(sects, regEx, func, objAD, aId, limit) {
		var s = sects.split(',');
		var id = (aId || this.getAutoId());
		var l = (limit || 0);
		for(var i = 0; i < s.length; i++) {
			var sect = s[i].replace(/^\s+|\s+$/g, "");
			if (typeof this.data[sect] === 'undefined') {
				this.data[sect] = new Array();
			}
			this.data[sect].push({'id':id, 'regEx':regEx, 'func': func, 'objAD':objAD, 'limit':l});
		}
	},
	addPopup: function(sections, keywords, objAD, className, cusX, cusY) {
		var aId = this.getAutoId();
		className = (className) ? ' ' + className : '';
		this.add(
			sections,
			new RegExp(keywords, 'g'), 
			function(kw) {
				return '<a href="'+objAD.url+'" target="_blank" class="adKeyword'+className+'" onmouseover="ODN.keywordContent.showPopup(this, '+aId+', \''+kw+'\','+cusX+','+cusY+')" onmouseout="ODN.keywordContent.hidePopup()">'+kw+'</a>';
			}, 
			objAD,
			aId,
			15
		);

	},
	init: function() {
		if (!ODN.isAD) {
			var contentCTN = $('#contentCTN-right');
			if (contentCTN.length > 0 && typeof this.data[ODN.sect] != 'undefined') {
				for(var i = 0; i < this.data[ODN.sect].length; i++) {
					this.renderHtml(this.data[ODN.sect][i].regEx, this.data[ODN.sect][i].func, this.data[ODN.sect][i].limit);
				}
			}
		}
	},
	renderHtml: function(regEx, func, limit) {
		var count = 0;
		$('#leadin p, #contentCTN-right p').each(
			function() {
				var ctn = $(this).html();
				var keywords = ctn.match(regEx);
				if (keywords != null) {
					if (limit == 0) {
						keywords = $.arrayUtils.unique(keywords);
						for(var i = 0; i < keywords.length;i++) {
							ctn = ctn.replace(new RegExp(keywords[i], 'g'), func(keywords[i]));
						}
					} else {
						if (count < limit) {
							var tmpHtml = [];
							var tmpCtn = ctn;
							for(var i = 0; i < keywords.length;i++) {
								var tmpsplit = tmpCtn.split(keywords[i]);
								if (tmpsplit.length > 0) {
									tmpHtml.push(tmpsplit[0] + func(keywords[i]));
									tmpsplit.shift();
									tmpCtn = tmpsplit.join(keywords[i]);
									count++;
									if (count == limit) {
										break;
									}
								} else {
									tmpCtn = tmpsplit.toString();
								}
							}
							tmpHtml.push(tmpCtn);
							ctn = tmpHtml.join('');
						}
					}
					$(this).html(ctn);
				}
			}
		);
	},
	getDataById: function(id) {
		for(var i = 0; i < this.data[ODN.sect].length; i++) {
			if (id == this.data[ODN.sect][i].id) {
				return this.data[ODN.sect][i];
			}
		}
		return null;
	},
	puTimerId: null,
	puBoxId: 'keyword-popup-box',
	showPopup: function(target, id, kw, cusX, cusY) {
		clearTimeout(this.puTimerId);
		$('#'+this.puBoxId).remove();
		var tPos = $(target).position();
		var data = this.getDataById(id);
		if (data != null) {
			var boxTop = tPos.top - data.objAD.height;
			var boxLeft = tPos.left;
			var margin = 20;
			if (tPos.left + data.objAD.width + margin > $(document).width()) {
				boxLeft = boxLeft - ((tPos.left + data.objAD.width) - $(document).width()) - margin;
			}
			data.objAD.flashVars({'kw':kw});

			if(cusY == undefined)
			{
				cusY = boxTop;
			}
			else
			{
				cusY += tPos.top;
			}
			if(cusX == undefined)
			{
				cusX = boxLeft;
			}
			else
			{
				cusX += tPos.left;
			}
			var s = '<div id="'+this.puBoxId+'" style="z-index:99999;position:absolute;width:'+data.objAD.width+'px;height:'+data.objAD.height+'px;top:'+cusY+'px;left:'+cusX+'px" onmouseover="ODN.keywordContent.overPopup()" onmouseout="ODN.keywordContent.hidePopup()">'+data.objAD.renderHtml()+'</div>';
			$('body').append(s);
			data.objAD.writeFlash();
		}
	},
	overPopup: function() {
		clearTimeout(this.puTimerId);
	},
	hidePopup: function() {
		this.puTimerId = setTimeout("ODN.keywordContent.closePopup()", 200);
	},
	closePopup: function() {
		clearTimeout(this.puTimerId);
		$('#'+this.puBoxId).remove();
	}
}
$AD.keyword.func = function() { ODN.keywordContent.addPopup(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]); };
//e:keywordContent

ODN.stockQuoteBox = {
	id: '#stockQuoteBox',
	ctn: null,
	submit: function() {
		if (!this.ctn) {
			this.ctn = $('#stockQuoteBox');
		}
		var input = this.ctn.find('input.tb');
		var num = input.val();
		if (num !== '' && new RegExp('^[0-9]{1,5}$').test(num)) {	
			window.location.href = 'http://money18.on.cc/info/liveinfo_quote.html?symbol=' + $.digitPad('0',num, 5);
		} else {
			alert("請輸入正確股票編號。");
			input.focus();
		}
	}
};

ODN.stockBox = {
	show: function(insymbol) {
		var w = 320;
		var h = 467;
		var rootpath = 'http://money18.on.cc';
		var opts = {
			width: w,
			height: h,
			innerHTML: function() {
				return "<table cellpadding='0' cellspacing='0' border='0'><tr><td colspan='3'><div class='png_bg' style='width:374px;height:23px;background:url("+rootpath+"/img/lightbox_top.png) no-repeat;cursor:pointer;' onclick='ODN.stockBox.hide();'></div></td></tr><tr><td><div class='png_bg' style='width:20px;height:467px;background:url("+rootpath+"/img/lightbox_left.png) no-repeat;'></div></td><td><iframe frameborder='0' hspace='0' src='' id='M18_iframeContent' scrolling='no' name='LQB_iframeContent"+new Date().getTime()+"' style='width:"+w+"px;height:"+h+"px;margin:0px;padding:0px;' > </iframe></td><td><div class='png_bg' style='width:34px;height:467px;background:url("+rootpath+"/img/lightbox_right.png) no-repeat;'></div></td></tr><tr><td colspan='3'><div class='png_bg' style='width:374px;height:28px;background:url("+rootpath+"/img/lightbox_bottom.png) no-repeat;'></div></td></tr></table>"+unescape('%3C!--[if IE 6]%3E%3Cscript type="text/javascript"%3EDD_belatedPNG.fix(\'.png_bg\')%3C/script%3E%3C![endif]--%3E');
			}
		};
		$.thickbox.show(opts, null);
		$('#M18_iframeContent').attr('src',rootpath+'/info/liveinfo_lightbox.html?symbol='+insymbol+'&refer=odn');
	},
	hide: function() {
		$.thickbox.remove();
	}
};

ODN.content.stockKeyword = {
	regEx: /\（\d{4,5}\）/g,
	renderHtml: function(kw) {
		var stockNum = kw.match(/\d{4,5}/g);
		if (stockNum != null) {
			var bool_repTeam = false;
			var keyword_array = ["1","2","3","4","5","6","8","10","11","12","13","14","16","17","19","20","23","27","41","45","53","54","62","66","69","73","83","101","116","119","123","127","135","142","144","148","151","152","165","168","175","177","179","189","200","210","242","247","257","267","268","270","272","276","291","293","297","302","303","316","321","322","323","330","331","336","338","341","345","347","358","363","371","384","386","388","390","392","410","425","440","460","467","486","489","493","494","511","522","525","538","551","552","555","576","589","590","604","606","631","639","656","658","659","669","670","678","682","683","688","691","694","697","700","709","728","737","751","753","754","762","763","773","806","813","817","823","829","836","845","857","861","868","880","881","883","891","902","914","916","917","933","939","941","960","966","973","975","980","981","991","992","998","1025","1038","1044","1051","1055","1066","1068","1072","1088","1099","1101","1109","1114","1128","1133","1138","1157","1169","1171","1177","1186","1193","1199","1208","1211","1212","1288","1299","1313","1333","1368","1378","1387","1393","1398","1618","1683","1688","1700","1728","1733","1766","1800","1813","1818","1828","1833","1836","1880","1882","1888","1893","1898","1899","1919","1928","1988","2007","2009","2018","2020","2038","2099","2128","2168","2222","2233","2238","2314","2318","2319","2328","2331","2333","2338","2342","2343","2357","2378","2388","2600","2601","2628","2688","2689","2727","2777","2778","2800","2821","2823","2827","2828","2833","2840","2866","2877","2883","2888","2899","3308","3311","3323","3328","3333","3339","3360","3368","3377","3383","3389","3618","3800","3808","3818","3898","3900","3933","3968","3983","3988","3993","3998"];
			
			 for(var i=0; i<keyword_array.length; i++){
			      if(keyword_array[i] == ( parseInt(stockNum, 10) + "")){
			          bool_repTeam = true;
			      }
			}
       		
       		var today = todaydate.substring(0,8);
       		
			if ( bool_repTeam && (parseInt(today) >= parseInt('20110919')) && (parseInt(today) <= parseInt('20120103')) ) {
	//if ( bool_repTeam ) {
				$('.rabobank').delegate('','hover', function(){
					$(this).css('background-color','#FFF');
				});
				return kw.replace(stockNum, '<a href="http://money18.on.cc/info/liveinfo_quote.html?symbol='+stockNum+'" onclick="ODN.stockBox.show(\''+stockNum+'\');return false;"  class="stockNum">'+stockNum+'</a><a class="rabobank" href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40171" target="_blank"><img src="http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:40171" style="position: relative;top: 4px;" /></a>');
				
				
			} else {
			//return kw.replace(stockNum, '<a href="http://money18.on.cc/info/liveinfo_quote.html?symbol='+stockNum+'" target="_blank">'+stockNum+'</a>');
				return kw.replace(stockNum, '<a href="http://money18.on.cc/info/liveinfo_quote.html?symbol='+stockNum+'" onclick="ODN.stockBox.show(\''+stockNum+'\');return false;"  class="stockNum">'+stockNum+'</a>');
			}
		}
		return kw;
	}
};
ODN.miscPanel = {
	init: function() {
		$('#miscPanel').html(this.renderHTML());
	},
	renderHTML: function() {
		var html = [];
		html.push('<div class="articleUrl">本文連結 : <a class="shareLink" href="'+ODN.href+'">'+ODN.href+'</a></div>');
        html.push('<div id="iReportInfo"><table>');
        html.push('<tr>');
        html.push('<td rowspan="3" class="title">人人做記者<br>爆料方法 :</td>');
        html.push('<td class="col1">爆料熱線：&nbsp;</td>');
        html.push('<td class="col2">(852) 3600 3600</td>');
        html.push('<td class="col3">電 郵：&nbsp;</td>');
        html.push('<td class="col4"><a href="mailto:news@opg.com.hk">news@opg.com.hk</a></td>');
        html.push('<td class="col1"><a href="http://ireport1.on.cc/p/b5/web/SubmitPage.jsp" target="_blank">網上爆料</a></td>');
        html.push('</tr>');
        html.push('<tr>');
        html.push('<td class="col1">傳 真：&nbsp;</td>');
        html.push('<td class="col2">(852) 3600 8800</td>');
        html.push('<td class="col3">手機網站：&nbsp;</td>');
        html.push('<td class="col4">m.on.cc</td>');
        html.push('</tr>');
        html.push('<tr>');
        html.push('<td class="col1">SMS：&nbsp;</td>');
        html.push('<td class="col2">(852) 6500 6500</td>');
        html.push('<td class="col3">MMS：&nbsp;</td>');
		html.push('<td class="col4"><a href="mailto:ireport@on.cc">ireport@on.cc</a></td>');
        html.push('</tr>');
        html.push('</table>');
        html.push('</td><td class="r corner"></td>');
        html.push('</tr>');
    	html.push('<tr>');
        html.push('<td class="blc corner"></td><td class="b"></td><td class="brc corner"></td>');
        html.push('</tr>');
   		html.push('</table></div>');
		return html.join('');
	}
};

ODN.stockQuote = function() {
	var qSymbolTf = document.getElementById('txt_qstock_symbol');
	var qSymbol = qSymbolTf.value;
	
	//UAT
	/*var priceURL = "http://210.177.167.128/info/liveinfo_quote.html?symbol=";*/

	//LIVE
	var priceURL = "http://money18.on.cc/info/liveinfo_quote.html?symbol=";
	
	if (qSymbol != '' && qSymbol.match(new RegExp(/^\d{0,5}$/))) {
		qSymbol = onccLib.digitPad('0',qSymbol, 5);
		window.location = priceURL + qSymbol;
	} else {
		alert("請輸入正確股票編號。");
		qSymbolTf.focus();
	}
};
ODN.onFocusStock = function(obj) {if (obj.value == '輸入股票編號') {obj.value = '';}}
ODN.onBlurStock = function(obj) {if (obj.value == '') {obj.value = '輸入股票編號';}}
ODN.imageGalleryInfo = {
	obj: null,
	domReady: false,
	data: [],
	init: function() {
		this.domReady = true;
		this.obj = $('a.thickbox');
		this.obj.each(function(index){
			ODN.imageGalleryInfo.data.push([$(this).attr('href'), $(this).attr('title')]);
		});
		var w =  980;
		var h = $(window).height()-100;
		/*
		if (screen.width <= 800) {
			w =  650;
			h = 400;
		} else if (screen.width <= 1024) {
			w =  934;
			h = 586;
		}
		*/
		this.obj.thickbox({
			width: w,
			height: h,
			hiddenObjSelector: (ODN.sect_L3 != '' && ODN.priority != '') ? '#superIframe, div.largeAdsCTN object, div.largeAdsCTN embed' : 'object, embed',
			innerHTML: function(target) {
			return '<iframe scrolling="no" frameborder="0" onLoad="ODN.imageGalleryInfo.galleryButton()" style="width: '+w+'px; height: '+h+'px;" name="TB_iframeContent205" id="TB_iframeContent" src="/cnt/'+ODN.sect+'/v2/imageGallery_'+ODN.getSectCode()+'.html?pId='+target.attr('href')+'" hspace="0"> </iframe>'}
		});
	},
	resize: function(h) {
		$('#TB_iframeContent').css('height', h);
	},
	queue: function() {
		return false;
	},
	galleryButton:function(){
		/*var html = '<a href="#" style="color:#4c4c4c;float:right" onClick="ODN.imageGallery.prevPic()" ><div style="width:1px;height:1px;overflow:hidden">上一張</div></a>';
		html += '<a href="#" style="color:#4c4c4c;float:right" onClick="ODN.imageGallery.nextPic()" ><div style="width:1px;height:1px;overflow:hidden">下一張</div></a>';
		html += '<a href="#" style="color:#4c4c4c;float:right" onClick="ODN.imageGallery.hide()" ><div style="width:1px;height:1px;overflow:hidden">關閉</div></a>';	
		$('#TB_window iframe').contents().find('body').append(html);
		$('#TB_window iframe').contents().find('a')[0].focus();*/
		//return html;
	}
};

ODN.articleNav = {
	init: function() {
		var listbox;
		if (listbox = ODN.articleListSELECT) {
			listbox.prevBtn = $('a.prevArticle');
			listbox.nextBtn = $('a.nextArticle');
			var index = listbox.targ[0].selectedIndex;
			var extraItem = (ODN.sect != 'finance') ? 3 : 4;
			if (index + 1 <= listbox.targ[0].length - extraItem && listbox.nextBtn.length > 0) {
				var nextOption = listbox.targ[0].options[index + 1];
				var urls = nextOption.value.split('|');
				listbox.nextBtn.attr('href', urls[0]).attr('target', (urls.length > 1) ? '_blank' : '_self');
				var title = listbox.nextBtn.find('span');
				if (title.length > 0) {
					title.text('：'+nextOption.text);
				}
				listbox.nextBtn.css('display', 'inline-block');
			}
			if (index - 1 >= 0 && listbox.prevBtn.length > 0) {
				var prevOption = listbox.targ[0].options[index - 1];
				var urls = prevOption.value.split('|');
				listbox.prevBtn.attr('href', urls[0]).attr('target', (urls.length > 1) ? '_blank' : '_self');
				var title = listbox.prevBtn.find('span');
				if (title.length > 0) {
					title.text('：'+prevOption.text);
				}
				listbox.prevBtn.css('display', 'inline-block');
			}
		}
	}
};

ODN.toolBar = {
	id: '#toolBar',
	getShareUrl: function(type) {
		var urlPattern;
		if (type==='facebook') {
			urlPattern = 'http://www.facebook.com/share.php?u={url}'+encodeURIComponent('?facebook=y');
			//urlPattern = 'http://www.facebook.com/share.php?u={url}&facebook=y';
		} else if (type==='twitter') {
			urlPattern = 'http://twitter.com/home?status={title} {url}';
		} else if (type==='plurk') {
			urlPattern = 'http://plurk.com/?qualifier=shares&status={title} {url}';
		} else if (type==='sina') {
			var content = $('#leadin p').eq(0).text();
			
			if ( content.length >= 67 ) {
				content = content.substring(0, 67) + "...";	
			} else {
				content += "...";
			}	
			
			content = encodeURIComponent(content);			
					
			if ( $('img.thumbnail').length >=1 ){
				var img_path = "http://" + window.location.hostname + $('img.thumbnail').eq(0).attr('src');
			
				//urlPattern = 'http://v.t.sina.com.cn/share/share.php?url={url}&title={title} '+ encodeURIComponent('(分享自 @oncc東方互動)') +  content   +'&pic='+img_path;
				urlPattern = 'http://service.weibo.com/share/share.php?url=&title={title} '+ encodeURIComponent('(分享自 @oncc東方互動)') +  content  + '{url}'+'&pic='+img_path;
			} else {
				//urlPattern = 'http://v.t.sina.com.cn/share/share.php?url={url}&title={title} '+  encodeURIComponent('(分享自 @oncc東方互動)') +   content  ;
				urlPattern = 'http://service.weibo.com/share/share.php?url=&title={title} '+  encodeURIComponent('(分享自 @oncc東方互動)') +   content  +'{url}';
			}
		} else if (type==='qq') {
			var content = $('#leadin p').eq(0).text();
			
			if ( content.length >= 67 ) {
				content = content.substring(0, 67) + "...";	
			} else {
				content += "...";
			}
			
			content = encodeURIComponent(content);
			
			var title = encodeURIComponent(ODN.content.getTitle()+' - 東方日報');
			
			if ( $('img.thumbnail').length >=1 ){
				var img_path = "http://" + window.location.hostname + $('img.thumbnail').eq(0).attr('src');			
				//urlPattern = 'http://v.t.qq.com/share/share.php?url={url}&title={title}&pic='+img_path+'&content='+title+  encodeURIComponent('(分享自 @onccnews)') +content;
				urlPattern = 'http://v.t.qq.com/share/share.php?url=&title={title}&pic='+img_path+'&content='+title+  encodeURIComponent('(分享自 @onccnews)') +content+'{url}';
			} else {
				urlPattern = 'http://v.t.qq.com/share/share.php?url=&title={title}&content='+title+  encodeURIComponent(' (分享自 @onccnews) ')  + content+'{url}';	
			}
		}
		return urlPattern.replace('{url}', ODN.href).replace('{title}', encodeURIComponent(ODN.content.getTitle()+' - 東方日報'));
	},
	init: function() {
		var html = '';
		html += '<li class="print" title="列印此頁" onClick="ODN.print();"></li>';
		
		html += '<li class="qq" title="騰訊微博"><a href="'+this.getShareUrl('qq')+'" target="_blank"></a></li>';
		
		html += '<li class="sina" title="新浪微博"><a href="'+this.getShareUrl('sina')+'" target="_blank"></a></li>';
		//html += '<li class="plurk" title="Plurk"><a href="'+this.getShareUrl('plurk')+'" target="_blank"></a></li>';
    	html += '<li class="twitter" title="Twitter"><a href="'+this.getShareUrl('twitter')+'" target="_blank"></a></li>';
    	html += '<li class="facebook" title="在Facebook上分享""><a href="'+this.getShareUrl('facebook')+'" target="_blank"></a></li>';
    	html += '<li class="largeFont" title="放大字型" onClick="ODN.fontSizePanel.large();"></li>';
    	html += '<li class="smallFont" title="縮小字型" onClick="ODN.fontSizePanel.small();"></li>';
		$(this.id).html(html);
	}
};

ODN.yahooBox = {
	url:'http://home.on.cc/search/index.html?o=0',
	text: '輸入關鍵字',
	focus: function(t) {
		t.value = '';
	},
	blur: function(t) {
		if (t.value === '') {
			t.value = this.text;
		}
	},
	search: function() {
		var kw = $('#search_query');
		window.location.href = this.getUrl((kw.val() !== this.text) ? kw.val() : '');
	},
	getUrl: function(k) {
		return this.url + '&sk='+encodeURIComponent(k);
	},
	show: function() {
		/*
		$('#yahooBox').html('<form id="search_form" name="search_form" action="javascript:ODN.yahooBox.search()" method="get" target="_top"><input id="search_query" name="sk" value="輸入關鍵字" maxlength="100" onfocus="ODN.yahooBox.focus(this)" onblur="ODN.yahooBox.blur(this)" type="text"><img src="http://home.on.cc/adv/web/corp/img/corpbar_search_btn.gif" alt="新聞搜尋" title="新聞搜尋" width="50" border="0" height="19" style="cursor:pointer" onclick="ODN.yahooBox.search()"><img src="http://home.on.cc/adv/web/corp/img/corpbar_yahoo_logo.gif" border="0"></form>').show();
		*/
		/* Slim */
		$('#yahooBox').html('<iframe src="http://home.on.cc/adv/web/corp/js/searchbox_yahoo.html?gfghf=gfghdf" width="152px"  height="23px"  scrolling="no" frameborder="0" ></iframe>').show();
		
		
		//<input src="http://home.on.cc/adv/web/corp/img/corpbar_search_btn.gif" alt="新聞搜尋" title="新聞搜尋" width="50" border="0" height="19" type="image">
		//$('#yahooBox').html('yahoo').show();
	}
};

ODN.fontSizePanel = {
	cksId: 'odn-fontSize',
	selectors: ['#leadin', '#contentCTN-right'],
	sizes: [{'h1':13, 'h3':12, 'p':12, 'lh':19}, {'h1':15, 'h3':13, 'p':13, 'lh':21}, {'h1':19, 'h3':16, 'p':16, 'lh':23}, {'h1':23, 'h3':21, 'p':21, 'lh':26}, {'h1':26, 'h3':24, 'p':24, 'lh':30}],
	curIdx: 3,
	init: function() {
		var idx = $.cookie(this.cksId);
		if (String(idx) != String(this.curIdx) && idx != null) {
			this.curIdx = idx;
			this.writeCss();
		}
	},
	small: function() {
		if (this.curIdx > 1) this.curIdx--;
		this.changeSize();
	},
	large: function() {
		if (this.curIdx < this.sizes.length) this.curIdx++;
		this.changeSize();
	},
	changeSize: function() {
		for (var i = 0; i < this.selectors.length;i++) {
			var selector = $(this.selectors[i]);
			selector.css({'line-height': this.sizes[this.curIdx-1].lh + 'px'});
			selector.find('h1').css({'font-size': this.sizes[this.curIdx-1].h1 + 'px'});
			selector.find('h3').css({'font-size': this.sizes[this.curIdx-1].h3 + 'px'});
			selector.find('p, table.commonTable td, table.commonTable th, .infoBox').css({'font-size': this.sizes[this.curIdx-1].p + 'px'});
		}
		$.cookie(this.cksId, this.curIdx, {expires: 365, path:'/'});
	},
	writeCss: function() {
		var css = ['<style type="text/css">'];
		for (var i = 0; i < this.selectors.length;i++) {
			var selector = this.selectors[i];
			css.push(selector + '{line-height:'+this.sizes[this.curIdx-1].lh+'px;}');
			css.push(selector + ' h1 {font-size:'+this.sizes[this.curIdx-1].h1+'px;}');
			css.push(selector + ' h3 {font-size:'+this.sizes[this.curIdx-1].h3+'px;}');
			css.push(selector + ' p, ' + selector + ' table.commonTable td, '+ selector + 'table.commonTable th, '+ selector + ' .infoBox {font-size:'+this.sizes[this.curIdx-1].p+'px;}');
		}
		css.push('</style>');
		document.write(css.join(''));
	}
};
ODN.fontSizePanel.init();

ODN.releatedArticle = {
	keywords: [],
	primaryKid: '',
	commSect: ['00186','00190','00182','00192','00273','00184'],
	init: function() {
		var ak = ODN.data.getArticleKeyword(ODN.aid);
		if (ak) {
			
			var akl = ak.articleKeywordList;
			
			for (var i = 0; i < akl.length;i++) {
				//if (akl[i].show && akl[i].keyword.show) {
					//if (akl[i].seq === '1') {
						//ODN.writeScript('/js/keywords/relatedArticle/'+ODN.arcDate+'/'+akl[i].kid+'Article.js');
						//this.primaryKid = akl[i].kid;
					if (akl[i].seq !== '0') {
						this.keywords.push(akl[i].kid);
					}
					ODN.writeScript(ODN.keyword.getInfoPath(akl[i].kid));
				//}
			}
		}
	},
	showArticle: function() {
		var ka = ODN.data.keywordArticle;
		var availKa = [];
		var availKaComm = [];
		var commSect = this.commSect;
		var isDuplicate = function(data, aid) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].aid === aid) {
					return true;
				}
			}
			return false;
		};
		var renderList = function(list) {
			var html = '';
			for (var i = 0; i < list.length;i++) {
				var a = ODN.getArticleById(list[i].aid);
				if (a.L1 !== 'football' && a.L1 !== 'racing') {
					var info = ODN.getAIDInfo(list[i].aid);
					var url = ODN.getArticleHref(info.pubdate, a.L1, info.sect_L3, info.priority);
					html += '<li><a href="'+url+'">'+a.title+'</a></li>';
				}
			}
			return html;
		};
		
		if (this.primaryKid  !== '') {
			//for (var i = 0; i < this.keywords.length; i++) {
			//if (typeof ka[this.keywords[i]] !== 'undefined') {
			var kal = ka[this.primaryKid].keywordArticleList;
			for (var j = 0; j < kal.length; j++) {
				var info = ODN.getAIDInfo(kal[j].article.aid);
				if (kal[j].article.aid !== ODN.aid) {
					if ($.arrayUtils.contains(commSect, info.sect_L3)) {
						availKaComm.push(kal[j].article);
					} else {
						//!isDuplicate(availKa, kal[j].article.aid) && 
						availKa.push(kal[j].article);
					}
				}
			}
				//}
			//}
			
			if (availKa.length > 0) {
				var html = '<h2>相關新聞</h2><ul class="commonList">';
				html += renderList(availKa);
				html += '</ul>';
				$('#relatedNews').html(html).show();
			}
		
			if (availKaComm.length > 0) {
				var html = '<h2>相關評論</h2><ul class="commonList">';
				html += renderList(availKaComm);
				html += '</ul>';
				$('#relatedComm').html(html).show();
			}
		}
	},
	showKeyword: function() {
		var kinfo = ODN.data.keywordInfo;
		if (this.keywords.length > 0) {
			var html = '';
			var max = 5;
			if (this.keywords.length < max) {
				max = this.keywords.length;
			}
			for (var i = 0; i < max; i++) {
				if (typeof kinfo[this.keywords[i]] !== 'undefined') {
					var k = kinfo[this.keywords[i]];
					if (k.show) {
						if (html !== '') html += '、';
						html += '<a href="'+ODN.yahooBox.getUrl(k.displayName)+'">'+k.displayName+'</a>';
					}
				}
			}
			if (html!=='') {
				if ( ODN.sect_L3 != '00651') {				
					$('#moreNews').html('<h2>關鍵字</h2>'+html).show();
				} else {
					$('#moreNews').html('<div>' + html + '</div>').show();	
				}
			}
		}
	},
	checkKeywordStatus: function() {
		var tmp = [];
		for(var i = 0; i < this.keywords.length; i++) {
			if (typeof ODN.data.keywordInfo[this.keywords[i]] !== 'undefined') {
				var k = ODN.data.keywordInfo[this.keywords[i]];
				if (k.extract || k.show) {
					tmp.push(this.keywords[i]);
					if (this.primaryKid === '' && k.extract) {
						this.primaryKid = this.keywords[i];
					}
				}
			}
		}
		this.keywords = tmp;
	},
	bind: function() {
		this.checkKeywordStatus();
		if (this.keywords.length > 0) {
			$.getScript('/js/keywords/relatedArticle/'+ODN.arcDate+'/'+this.primaryKid+'Article.js', function() { ODN.releatedArticle.showArticle(); });
		}
		if ( ODN.sect_L3 != '00651') {	
			this.showKeyword();
		}
		ODN.yahooBox.show();
	}
};
ODN.releatedArticle.init();


ODN.storyTimeline = {
	sid: '',
	story: null,
	id: '#timelineSlider',
	startDate: null,
	endDate: null,
	displayStartDate: null,
	displayEndDate: null,
	oneDayTime: 86400000,
	slider: null,
	startArticle: null,
	endArticle: null,
	loadPrevItem: true,
	loadNextItem: true,
	opts: {'maxVisible':6, 'moveIdx':6},
	tmpPrev: [],
	tmpNext: [],
	tmpList: [],
	ttId: null,
	loadTmpPrev: false,
	loadTmpNext: false,
	nextDisable: false,
	prevDisable: false,
	rolling: false,
	load: function() {
		this.sid = ODN.story.getIdByAId(ODN.aid);
		if (this.sid !== '') {
			this.story = ODN.story.getStory(this.sid);
			if (this.story) {
				if (typeof this.story.head !== 'undefined') {
					this.name = this.story.name;
					if (this.name !== '') {
						this.startArticle = this.story.head;
						var startInfo = ODN.getAIDInfo(this.startArticle.aid);
						this.startDate = startInfo.pubdate;
						ODN.writeScript(ODN.story.getStoryPath(this.sid, 'latest'));
						ODN.writeScript(ODN.story.getStoryPath(this.sid, this.startDate.substr(0,6)));
					}
				}
			}
		}
	},
	init: function() {
		if (this.name !== '' && typeof ODN.data.storySeries[this.sid] !== 'undefined' && ODN.arcDate >= this.startDate) {
			if (typeof ODN.data.storySeries[this.sid]['latest'] !== 'undefined') {
				
				this.slider = $(this.id);
				this.slider.html('<a href="/archive/index.html" class="prevEnd ttDown">起源</a><div class="prevButton"></div><a href="#" class="nextEnd ttDown">最新發展</a><div class="nextButton"></div><ul class="bar"></ul>');
				
				var latestList = ODN.data.storySeries[this.sid]['latest'].storyList;
				var lastArticle = latestList[latestList.length -1].articleList[0];
				
				this.endArticle = {section:lastArticle.section, aid:lastArticle.aid};
				this.endDate = latestList[latestList.length -1].pubDate;
				
				if (ODN.arcDate !== ODN.pubDate) {
					this.displayStartDate = this.displayEndDate;
					var storyDate = ODN.arcDate.substr(0, 6);
					this.loadTmpPrev = true;
					this.loadStoryList(storyDate);
				} else {
					
					var tmp = [];
					var cnt = 0;
					var startIdx = 0;
					if (latestList.length > 6) {
						startIdx = 1;
					}
					for (var i = startIdx; i <latestList.length; i++ ) {
						if (latestList[i].pubDate >= this.startDate) {
							tmp.push(latestList[i]);
							cnt++;
						}
						if (cnt === 6) break;
					}
					if (tmp.length > 0) {
						//this.displayStartDate = tmp[0].pubDate;
						//this.displayEndDate = tmp[tmp.length-1].pubDate;
						this.bind(tmp);
					}
				}
			}
		}
	},
	callBack: function(storyDate, direction) {
		if (typeof ODN.data.storySeries[this.sid] !== 'undefined') {
			if (typeof ODN.data.storySeries[this.sid][storyDate] !== 'undefined') {
				var sl = ODN.data.storySeries[this.sid][storyDate].storyList;
				if (!direction) {
					this.checkInitPoint(storyDate);
				} else {
					if (this.checkPoint(storyDate, direction)) {
						if (direction==='prev') {
							this.prependList(this.tmpList);
							this.slider.rollSlider('prev');
						}
					} else {
						var newDate = this.adjustMonth(storyDate, (direction==='prev') ? -1 : 1);
						ODN.story.getArticleList(this.sid, newDate, function() { ODN.storyTimeline.callBack(newDate, direction) });
					}
				}
			}
		}
	},
	hasPrev: function() {
		/*
		var sl;
		if (this.displayStartDate.substr(0,6) > this.startDate.substr(0,6)) {
			var prevM = this.adjustMonth(this.displayStartDate.substr(0,6), -1);
			
			if (typeof ODN.data.storySeries[this.sid][prevM] !== 'undefined') {
				sl = ODN.data.storySeries[this.sid][prevM].storyList;
				for(var i = 0;i < sl.length; i++) {
					if (sl[i].pubDate < this.displayStartDate && sl[i].pubDate > this.startDate && this.displayStartDate != this.startDate) {
						return true;
					}
				}
			} else {
				return true;
			}
			
		} else {
			sl = ODN.data.storySeries[this.sid][this.displayStartDate.substr(0,6)].storyList;
			for(var i = 0;i < sl.length; i++) {
				if (sl[i].pubDate < this.displayStartDate && sl[i].pubDate > this.startDate && this.displayStartDate != this.startDate) {
					return true;
				}
			}
		}
		return false;
		*/
		return !(this.startDate === this.displayStartDate);
	},
	hasNext: function() {
		if (this.displayEndDate.substr(0,6) < this.endDate.substr(0,6)) {
			return true;
		} else {
			var sl = ODN.data.storySeries[this.sid][this.displayEndDate.substr(0,6)].storyList;
			for(var i = 0;i < sl.length; i++) {
				if (sl[i].pubDate > this.displayEndDate) {
					return true;
				}
			}
		}
		return false;
	},
	loadStoryList: function(cmd) {
		var direction = null;
		var storyDate;
		if (cmd==='prev' || cmd==='next') {
			direction = cmd;
			this.tmpList.length = 0;
			if (cmd==='prev') {
				var sl = ODN.data.storySeries[this.sid][this.displayStartDate.substr(0,6)].storyList;
				for (var i =0; i < sl.length; i++) {
					if (sl[i].pubDate < this.displayStartDate && sl[i].pubDate >= this.startDate) {
						this.tmpList.push(sl[i]);
					}
					if (this.tmpList.length === 6) break;
				}
				var adjMonth = this.adjustMonth(this.displayEndDate.substr(0,6), -1);
				if (this.tmpList.length < 6 && this.displayStartDate.substr(0,6) > this.startDate.substr(0,6)) {
					storyDate = adjMonth;
				} else {
					
					this.prependList(this.tmpList);
					this.slider.rollSlider('prev');
				}
				
				if(IsShowContentTopBox()){
					ReSetCssForTimerSlider();
				}	
			} else {
				var sl = ODN.data.storySeries[this.sid][this.displayEndDate.substr(0,6)].storyList;
				for (var i =0; i < sl.length; i++) {
					if (sl[i].pubDate > this.displayEndDate && sl[i].pubDate <= this.endDate) {
						this.tmpList.push(sl[i]);
					}
					if (this.tmpList.length === 6) break;
				}
				var adjMonth = this.adjustMonth(this.displayEndDate.substr(0,6), 1);
				if (this.tmpList.length < 6 && this.displayEndDate.substr(0,6) < this.endDate.substr(0,6)) {
					storyDate = adjMonth;
				} else {
					this.appendList(this.tmpList);
					this.slider.rollSlider('next');
				}
			}
			
		} else {
			storyDate = cmd;
		}
		if (storyDate) {
			if (typeof ODN.data.storySeries[this.sid][storyDate] === 'undefined') {
				ODN.story.getArticleList(this.sid, storyDate, function() { ODN.storyTimeline.callBack(storyDate, direction) });
			} else {
				ODN.storyTimeline.callBack(storyDate, direction);
			}
		}
	},
	checkPoint: function(storyDate, direction) {
		var sl = ODN.data.storySeries[this.sid][storyDate].storyList;
		if (direction==='prev') {
			var tmp = [];
			var limit = Math.abs(this.tmpList.length - 6);
			for (var i =sl.length-1;i>-1;i--) {
				if (sl[i].pubDate < this.displayStartDate) {
					tmp.push(sl[i]);
				}
				limit--;
				if (limit === 0) break;
			}
			tmp.reverse();
			this.tmpList = tmp.concat(this.tmpList);
			if (this.tmpList.length === 6 || storyDate === this.startDate.substr(0,6)) {
				return true;
			}
		} else {
			for (var i =0;i<sl.length;i++) {
				if (sl[i].pubDate > this.displayEndDate) {
					this.tmpList.push(sl[i]);
				}
				if (this.tmpList.length === 6) break;
			}
			if (this.tmpList.length === 6 && storyDate === this.endDate.substr(0, 6)) {
				return true;
			}
		}
		
		return false;
	},
	findStory: function(date) {
		var sl = ODN.data.storySeries[this.sid][date.substr(0, 6)].storyList;
		for (var i =0;i<sl.length;i++) {
			if (sl[i].pubDate === date) {
				return sl[i];
			}
		}
		return null;
	},
	findArticle: function(date) {
		var latest = ODN.data.storySeries[this.sid]['latest'].storyList;
		for (var i = 0; i <latest.length;i++) {
			if (latest[i].pubDate === date)
				return latest[i].articleList;
		}
		var sl = ODN.data.storySeries[this.sid][date.substr(0,6)].storyList;
		for (var i = 0; i <sl.length;i++) {
			if (sl[i].pubDate === date)
				return sl[i].articleList;
		}
		return null;
	},
	checkInitPoint: function(storyDate) {
		var sl = ODN.data.storySeries[this.sid][storyDate].storyList;
		if (this.loadTmpPrev) {
			var tmp = [];
			var limit = Math.abs(this.tmpPrev.length - 6);
			for (var i =sl.length-1;i>-1;i--) {
				if (sl[i].pubDate < ODN.arcDate && sl[i].pubDate >= this.startDate) {
					tmp.push(sl[i]);
					limit--;
				}
				if (limit === 0) break;
			}
			tmp.reverse();

			this.tmpPrev = tmp.concat(this.tmpPrev);
			
			if (this.tmpPrev.length < 7 && storyDate > this.startDate.substr(0, 6)) {
				this.loadStoryList(this.adjustMonth(storyDate, -1));
			} else {
				this.loadTmpPrev = false;
				for (var i =0;i<sl.length;i++) {
					if (sl[i].pubDate > ODN.arcDate) {
						this.tmpNext.push(sl[i]);
					}
					if (this.tmpNext.length === 6) break;
				}
				if (this.tmpNext.length < 7 && storyDate < this.endDate.substr(0, 6)) {
					this.loadTmpNext = true;
					this.loadStoryList(this.adjustMonth(storyDate, 1));
				} else {
					
					var today = this.findStory(ODN.arcDate);
					//this.tmpPrev.push(today);
					//var tmpList = this.tmpPrev.concat(this.tmpNext);
					this.bind(this.mergeList(this.tmpPrev, this.tmpNext, today));
				}
			}
		} else if (this.loadTmpNext) {
			for (var i =0;i<sl.length;i++) {
				if (sl[i].pubDate > ODN.arcDate) {
					this.tmpNext.push(sl[i]);
				}
				if (this.tmpNext.length === 6) break;
			}
			if (this.tmpNext.length < 7 && storyDate < this.endDate.substr(0, 6)) {
				this.loadStoryList(this.adjustMonth(storyDate, 1));
			} else {
				this.loadTmpNext = false;
				var today = this.findStory(ODN.arcDate);
				//this.tmpPrev.push(today);
				//var tmpList = this.tmpPrev.concat(this.tmpNext);
				this.bind(this.mergeList(this.tmpPrev, this.tmpNext, today));
			}
		}
	},
	mergeList: function(prevList, nextList, today) {
		
		if (nextList.length + prevList.length < 6) {
			prevList.push(today);
			return prevList.concat(nextList);
		} else if (prevList.length < 4)  {
			prevList.push(today);
			var nextLimit = Math.abs(prevList.length - 6);
			if (nextLimit > nextList.length) {
				nextLimit = nextList.length;
			}
			return prevList.concat(nextList.slice(0, nextLimit));
			
		} else if (nextList.length < 3)  {
			var prevLimit = Math.abs(nextList.length - 5);
			if (prevLimit > prevList.length) {
				prevLimit = prevList.length;
			}

			var tmpPrev = prevList.splice(prevList.length-prevLimit, prevList.length);

			tmpPrev.push(today);
			
			return tmpPrev.concat(nextList);
		}
		
		var tmpPrev = prevList.splice(prevList.length-3, prevList.length);
		var tmpNext = nextList.splice(0, 2);
		tmpPrev.push(today);
		return tmpPrev.concat(tmpNext);
		
	},
	adjustMonth: function(dateStr, number) {
		var d = $.strToDate(dateStr+'01');
		var adjust = d.getTime() + (number*(this.oneDayTime*((number > 0) ? 31 :1))); //TODO: only can adjust 1 month
		d.setTime(adjust);
		return $.dateFormat(d, 'yyyymm');
	},
	bind: function(d) {
		this.displayEndDate = d[d.length-1].pubDate;
		this.displayStartDate = d[0].pubDate;
		this.opts.maxVisible = this.opts.moveIdx = d.length;
		var sInfo = $('#storyInfo');
		sInfo.find('span.name').text(this.story.name).css('display','inline');
		if (ODN.arcDate !== ODN.pubDate) { 
			sInfo.prepend('<a href="/cnt/'+ODN.sect+'/'+ODN.pubDate+'/index.html" class="backToday">返回今日</a>');
		}
		var sid = this.sid;
		sInfo.find('input.showAll').replaceWith('<a href="/cnt/event/showall.html?sid='+sid+'&s='+ODN.getSectCode()+'&returnUrl='+encodeURIComponent(ODN.href)+'" class="picBtn"><img src="/img/v2/ic_showall.png" style="vertical-align:middle;margin-left:10px"></a>');
		//sInfo.find('input.showAll').css('display','inline').click(function(){window.location.href = '/cnt/event/showall.html?sid='+sid+'&s='+ODN.getSectCode()+'&returnUrl='+encodeURIComponent(ODN.href);});
		
		var lastInfo = ODN.getAIDInfo(this.endArticle.aid);
		var lastUrl = ODN.getArticleHref(lastInfo.pubdate, this.endArticle.section, lastInfo.sect_L3, lastInfo.priority);
		
		var lastButton = this.slider.find('.nextEnd');
		
		if (lastInfo.pubdate == ODN.arcDate) {
			lastButton.addClass('nextEnd-disable');
			lastButton.attr('href', '#');
			lastButton.click(function() { return false;});
		} else {
			lastButton.append('<em>'+lastInfo.pubdate+'</em>');
			lastButton.attr('href', lastUrl);
			lastButton.mouseover(function(evt) { ODN.storyTimeline.showArticleList(evt.target); });
			lastButton.mouseout(function(evt) { ODN.toolTip.autoHide(); });
			//lastButton.attr('onmouseover', 'ODN.storyTimeline.showArticleList(this)');
			//lastButton.attr('onmouseout', 'ODN.toolTip.autoHide()');
		}
		
		var startInfo = ODN.getAIDInfo(this.startArticle.aid);
		var startUrl = ODN.getArticleHref(startInfo.pubdate, this.startArticle.section, startInfo.sect_L3, startInfo.priority);
		
		var prevButton = this.slider.find('.prevEnd');
		
		if (startInfo.pubdate == ODN.arcDate) {
			prevButton.addClass('prevEnd-disable');
			prevButton.attr('href', '#');
			prevButton.click(function() { return false;});
		} else {
			prevButton.append('<em>'+startInfo.pubdate+'</em>');
			prevButton.attr('href', startUrl);
			prevButton.mouseover(function(evt) { ODN.storyTimeline.showArticleList(evt.target); });
			prevButton.mouseout(function(evt) { ODN.toolTip.autoHide(); });
		}
		
		this.slider.find('.bar').append(this.renderDateList(d));
		this.opts.prevHandle = function() {
			ODN.storyTimeline.prevHandle();
		};
		this.opts.nextHandle = function() {
			ODN.storyTimeline.nextHandle();
		};
		this.opts.onFirstItemAppear = function() {
			ODN.storyTimeline.onFirstItemAppear();
		};
		this.opts.onLastItemAppear = function() {
			ODN.storyTimeline.onLastItemAppear();
		};
		this.opts.onFirstItemDisappear = function() {
			ODN.storyTimeline.onFirstItemDisappear();
		};
		this.opts.onLastItemDisappear = function() {
			ODN.storyTimeline.onLastItemDisappear();
		};
		
		this.opts.onRollingStart = function() {
			ODN.storyTimeline.onRollingStart();
		};
		
		this.opts.onRollingFinish = function() {
			ODN.storyTimeline.onRollingFinish();
		};
		
		this.slider.show().rollSlider(this.opts);
		if (ODN.pubDate !== ODN.arcDate) {
			this.disablePrev(!this.hasPrev());
			this.disableNext(!this.hasNext());
		} else {
			var lastSl = ODN.data.storySeries[this.sid]['latest'].storyList;
			if (lastSl.length < 6 || this.displayStartDate === this.startDate) {
				this.disablePrev();
			}
			this.disableNext();
		}
	},
	showArticleList: function(elem) {
		var target = $(elem);
		var date = target.find('em').text();
		var al = this.findArticle(date);
		var showDateStr = (target.hasClass('prevEnd') || target.hasClass('nextEnd')) ? '<span class="pubdate">{0}</span>' : '';
		var content = '<ul class="commonList-white storyArticleList">';
		var count = 0;
		for (var i = 0; i < al.length; i++) {
			var info = ODN.getAIDInfo(al[i].aid);
			
			content += '<li><a href="'+ODN.getArticleHref(info.pubdate, al[i].section, info.sect_L3, info.priority)+'">'+al[i].title+'</a></li>';
			count++;
			//if (i==3) break;
			if (i==9) break;
		}
		content += '</ul>';
		if (count > 0) {
			this.ttId = ODN.toolTip.show(elem, {content:'<div class="storyArticleList">'+showDateStr.replace('{0}', $.dateFormat(info.pubdate, 'dd/mm'))+content+'</div>'});
		}
	},
	prevHandle: function() {
		if (!this.prevDisable && !this.rolling) {
			ODN.toolTip.hide();
			var startDate = this.displayStartDate.substr(0,6);
			if (typeof ODN.data.storySeries[this.sid][startDate] !== 'undefined') {
				this.loadStoryList('prev');
			} else {
				ODN.story.getArticleList(this.sid, startDate, function() { ODN.storyTimeline.prevHandle(); });
			}
		}
	},
	nextHandle: function() {
		if (!this.nextDisable && !this.rolling) {
			ODN.toolTip.hide();
			var endDate = this.displayEndDate.substr(0,6);
			if (typeof ODN.data.storySeries[this.sid][endDate] !== 'undefined') {
				this.loadStoryList('next');
			} else {
				ODN.story.getArticleList(this.sid, endDate, function() { ODN.storyTimeline.nextHandle(); });
			}
		}
	},
	onFirstItemAppear: function() {
		this.disablePrev(!this.hasPrev());
	},
	onLastItemAppear: function() {
		this.disableNext(!this.hasNext());
	},
	onFirstItemDisappear: function() {
		this.disablePrev(false);
	},
	onLastItemDisappear: function() {
		this.disableNext(false);
	},
	onRollingStart: function() {
		this.rolling = true;
	},
	onRollingFinish: function() {
		this.rolling = false;
	},
	disablePrev: function(disable) {
		if (disable===false) {
			this.slider.find('.prevButton').removeClass('prevButton-disable');
			this.prevDisable = false;
		} else {
			this.slider.find('.prevButton').addClass('prevButton-disable');
			this.prevDisable = true;
		}
	},
	disableNext: function(disable) {
		if (disable===false) {
			this.slider.find('.nextButton').removeClass('nextButton-disable');
			this.nextDisable = false;
		} else {
			this.slider.find('.nextButton').addClass('nextButton-disable');
			this.nextDisable = true;
		}
	},
	renderNode: function(date) {
		var html = '';
		var al = this.findArticle(date);
		if (al) {
			if (al.length > 0) {
				var firstA = al[0];
			}
		}
		var todayClass = (ODN.arcDate == date) ? ' today':'';
		var info = ODN.getAIDInfo(firstA.aid);
		var url = ODN.getArticleHref(info.pubdate, firstA.section, info.sect_L3, info.priority);
		var label = '';
		if (this.startDate === date) label = '<strong>起源</strong>';
		else if (this.endDate === date) label = '<strong>最新</strong>';
		html += '<a href="'+url+'" onmouseover="ODN.storyTimeline.showArticleList(this)" onmouseout="ODN.toolTip.autoHide()" class="ttDown'+todayClass+'"><span class="date">'+label+$.dateFormat(date, 'dd/mm')+'</span><em>'+date+'</em></a>';
		return html;
	},
	renderDateList: function(dateList) {
		var html = '';
		for (var i = 0; i < dateList.length; i++) {
			var ptDate = dateList[i].pubDate;
			html += '<li class="item">'+this.renderNode(ptDate)+'</li>';
		}
		return html;
	},
	appendList: function(d) {
		if (d.length > 0) {
			this.displayEndDate = d[d.length-1].pubDate;
			for (var i = 0; i < d.length; i++) {
				var ptDate = d[i].pubDate;
				this.slider.rollSlider('appendItem', this.renderNode(ptDate));
			}
		}
	},
	prependList: function(d) {
		if (d.length > 0) {
			this.displayStartDate = d[0].pubDate;
			d.reverse();
			for (var i = 0; i < d.length; i++) {
				var ptDate = d[i].pubDate;
				this.slider.rollSlider('prependItem', this.renderNode(ptDate));
			}
		}
	}
};
ODN.storyTimeline.load();

ODN.columnistList = {
	curSect: null,
	sect: {
		'news':[{L3:'00186', n:'東方日報正論'}, {L3:'00190', n:'功夫茶'}, {L3:'00184', n:'龍門陣'}],
		'china_world': [{L3:'00182', n:'神州觀察'}, {L3:'00192', n:'世界視線'}],
		'finance':[{L3:'00273', n:'產評'}],
		'lifestyle':[{L3:'00325', n:'文章'}, {L3:'00327', n:'文章'}, {L3:'00326', n:'文章'}, {L3:'00328', n:'文章'}, {L3:'00329', n:'文章'}, {L3:'00378', n:'文章'}, {L3:'00313', n:'文章'}]
	},
	init: function() {
		var pubdate = ODN.arcDate;
		var L3 = ODN.sect_L3;
		if (typeof this.sect[ODN.sect] !== 'undefined') {
			for (var i = 0; i < this.sect[ODN.sect].length;i++) {
				if (this.sect[ODN.sect][i].L3 === ODN.sect_L3) {
					this.curSect = this.sect[ODN.sect][i];
				}
			}
		}
		if (ODN.sect === 'finance' && ODN.href.indexOf('odn_notice.html') != -1) {
			this.curSect = this.sect[ODN.sect][0];
			pubdate = ODN.pubDate;
			L3 = '00273';
		}
		
		if (this.curSect) {
			$.get(this.getListUrl(ODN.sect, pubdate, L3), function(d) { ODN.columnistList.bind(d);});
		}
	},
	bind: function(d) {
		
		var html = '<div id="columnistList">';
		html += '<h2>昔日'+this.curSect.n+'</h2><ul class="commonList">';
		var articles = $(d).find('article');
		articles.each(function(idx) {
			var $this = $(this);
			var aid = $this.attr('id');
			if (aid !== ODN.aid) {
				var info = ODN.getAIDInfo(aid);
				var url = ODN.getArticleHref(info.pubdate, ODN.sect, info.sect_L3, info.priority);
				var hideStyle = (idx > 9) ? ' style="display:none"' : '';
				var date = (info.pubdate == ODN.pubDate) ? '今日' : $.dateFormat(info.pubdate, 'dd/mm');
				html += '<li'+hideStyle+'><a href="'+url+'" onclick="ODN.columnistList.showContent(\''+info.pubdate+'\', \''+info.sect_L3+'\', \''+info.priority+'\');return false;">'+$this.find('title').text()+'('+date+')</a></li>';
			}
		});
		html += '</ul><div class="right"><a href="#" onclick="ODN.columnistList.listAll();return false;" class="arrowBtn">更多</a></div></div>';
		$('#contentCTN-left').prepend(html);
	},
	listAll: function() {
		$('#columnistList li').show();
		$('#columnistList a.arrowBtn').attr('onclick', '').attr('href', '/archive/index.html').html('昔日東方');
	},
	getIframeHref: function(sect, pubdate, L3, priority) {
		return '/cnt/'+sect+'/column.html?sect='+sect+'&pubdate='+pubdate+'&L3='+L3+'&priority='+priority;
	},
	showContent: function(pubdate, L3, priority) {
		var title = '昔日'+this.curSect.n;
		var w = 1000;
		var h = parseInt($(window).height()-150, 10);
		var opts = {
			width: w,
			height: h,
			innerHTML: function() {
				return '<div id="columnistContent"><div class="closeCTN"><div class="closeButton" onclick="ODN.columnistList.hideContent()"></div></div><div class="title">'+title+'</div><iframe scrolling="no" id="columnIframe" frameborder="0" style="width:700px;height;200px;" src="'+ODN.columnistList.getIframeHref(ODN.sect, pubdate, L3, priority)+'"></iframe></div>';
			}
		};
		$.thickbox.show(opts, null);
		//$.get(this.getContentUrl(ODN.sect, '20100418', '00184', '001'), function(d) { ODN.columnistList.bindContent(d);});
		//$.get(this.getContentUrl(ODN.sect, pubdate, L3, priority), function(d) { ODN.columnistList.bindContent(d);});
	},
	hideContent: function() {
		$.thickbox.remove();
	},
	getListUrl: function(sect, pubdate, L3) {
		return '/cnt/'+sect+'/'+pubdate+'/xml/'+L3+'_editorials.xml';
	},
	resize: function(height) {
		$('#columnIframe').css('height', height);
	}
};

ODN.vodPlayerInfo = {
	articleId: '',
	vlXmlPath: '/cnt/keyinfo/'+ODN.arcDate+'/videolist.xml',
	data: {mid:'', msect:'', mtype:'', mtime:''},
	screenWidth: screen.width,
	videoTitle: '',
	videoThmbnl: '/ontv/'+ODN.arcDate+'/',
	bind: function(data) {
		var found = false;
		var tvURL;
		$(data).find('news').each(function(){
			if (($(this).find('articleID').text()==ODN.vodPlayerInfo.articleId)&&!found) {
				found = true;
				var tmp = $(this).find('video_title').text();
				ODN.vodPlayerInfo.videoTitle = (tmp.length>12)?tmp.substring(0,12)+'...':tmp;
				ODN.vodPlayerInfo.videoThmbnl += $(this).find('thumbnail').text();
				tvURL = $(this).find('video_url').text();
				ODN.vodPlayerInfo.data.mid = $.urlParams.extract('mid', tvURL);
				ODN.vodPlayerInfo.data.mtype = $.urlParams.extract('mtype', tvURL);
				ODN.vodPlayerInfo.data.mtime = $.urlParams.extract('mtime', tvURL);
				ODN.vodPlayerInfo.data.msect =
					(tvURL.indexOf('broadcast.html')!=-1)?'2':
					((tvURL.indexOf('commentary.html')!=-1)?'41':
					((tvURL.indexOf('ent.html')!=-1)?'4':
					((tvURL.indexOf('life.html')!=-1)?'5':
					((tvURL.indexOf('news.html')!=-1)?'3':''))));
			}
		});
		if (found) {
			
			/*
			 if (window.location.href.indexOf('00651_') !== -1) {
			$('#contentCTN-top')
				.after('<div class="content_video"><div id="btnMoreVideoCTN"><div class="title">東方電視</div><a class="arrowBtn" href="http://tv.on.cc" target="_blank">更多新聞短片</a></div><div id="playerCTN" class="clear"><div id="player_flash"></div></div>');
			} else {
			$('#contentCTN-right')
				.prepend('<div class="content_video"><div id="btnMoreVideoCTN"><div class="title">東方電視</div><a class="arrowBtn" href="http://tv.on.cc" target="_blank">更多新聞短片</a></div><div id="playerCTN" class="clear"><div id="player_flash"></div></div>');
			}
			var showHTC = false;
			
			if (((ODN.pubDate >='20110627' && ODN.pubDate <= '20110629') || (ODN.pubDate >='20110704' && ODN.pubDate <= '20110705')) && (ODN.sect == 'news' || ODN.sect == 'china_world') || window.location.href.indexOf('?htc') !== -1) {
				showHTC = true;
			}
			var playerURL = (showHTC) ? '/img/player_htc.swf' : '/img/player.swf';
			var pw = (showHTC) ? 722 : 600;
			var ph = 381;
			if (showHTC) {
				$('div.content_video, #playerCTN, #btnMoreVideoCTN').css('width',722);
				$('div.content_video').css('background','none');
			}
			with (ODN.vodPlayerInfo.data) {
				with ($.urlUtils) {
					playerURL = get(append(playerURL,{'id':mid,msect:msect,ssect:'odn',createTime:mtime,adType:'odn'}));
				}
			}
			var showHTC = false;
			 */
			
			
			if (window.location.href.indexOf('00651_') !== -1) {
			$('#contentCTN-top')
				.after('<div class="content_video"><div id="btnMoreVideoCTN"><div class="title">東方電視</div><a class="arrowBtn" href="http://tv.on.cc" target="_blank">更多新聞短片</a></div><div id="playerCTN" class="clear"><div id="player_flash"></div></div>');
			} else {
			$('#contentCTN-right')
				.prepend('<div class="content_video"><div id="btnMoreVideoCTN"><div class="title">東方電視</div><a class="arrowBtn" href="http://tv.on.cc" target="_blank">更多新聞短片</a></div><div id="playerCTN" class="clear"><div id="player_flash"></div></div>');
			}
			
			
			var sony = false;
			var disney = false;
			var disney2 = false;
			var htc201204 = false;
			var scb = false;
			var cityofdream = false;
			
			
			//gary 2012-11-13
			var friso201211 = false;
			
			var today = todaydate.substring(0,8);

			if (ODN.sect == 'news' || ODN.sect == "china_world") {
				// 6 Jan, 9 Jan, 11-12Jan, 18-19Jan	
				if ( (today =='20120106')  ||  (today =='20120109')  ||   (today >='20120111' && today <= '20120112') ||   (today >='20120118' && today <= '20120119')  || 	 window.location.href.indexOf('cityofdream') != -1   ) {
					cityofdream = true;
				} else if ( (today =='20130220') ||  (today =='20130221')  ||  (today =='20130222') || (window.location.href.indexOf("scb20120112") != -1)  ) {
									
					scb = true;
				/*} else if (   (today =='20120525')  ||   (today >='20120528' && today <= '20120529')  ||  (window.location.href.indexOf("sony201205") != -1)  ) {
					sony = true;
				} else if (   (today >='20120424' && today <= '20120426')  ||  (window.location.href.indexOf("disney201204") != -1)  ) {
					
					disney2 = true;
				} else if (   (today == '20120423')  ||  (window.location.href.indexOf("htc201204") != -1)  ) {
					
					htc201204 = true;
					
				} else if ( (today =='20121119')  ||  (today =='20121120')  ||(window.location.href.indexOf("friso201211") != -1)){
					//gary 2012-11-13
					var friso201211 = true;
					
				}*/
				
				}
			}
			
			
			
			var playerURL = '/img/player.swf';			
			if (scb ) {
				playerURL =  '/img/ad/scb/player.swf';
			} 
			
			if (cityofdream ) {
				playerURL =  '/img/ad/cityofdream/player.swf';
			} 			
			if (sony) {
				playerURL =  '/img/ad/sony201205/player.swf';
			}
			if (disney || disney2 ) {
				playerURL =  '/img/ad/disney201203/player.swf';
			}
			if (htc201204) {
				playerURL =  '/img/ad/htc201204/player.swf';
			}
			//gary 2012-11-13
			if (friso201211) {
				playerURL =  '/img/ad/friso201211/player.swf';
			}
			
			var pw = 600;
			var ph = 381;
			if (scb){
				pw = (scb) ? 740 : 600;
				ph = (scb) ? 420 : 381;
			}
			
			if (disney || disney2){
				pw = (disney ||disney2) ? 743 : 600;
				ph = (disney ||disney2) ? 480 : 381;			
			}
			if (cityofdream){
				pw = (cityofdream) ? 740 : 600;
				ph = (cityofdream) ? 450 : 381;			
			}
			if (sony){
				pw = (sony) ? 743 : 600;
				ph = (sony) ? 480 : 381;			
			}
			if (htc201204){
				pw = (htc201204) ? 740 : 600;
				ph = (htc201204) ? 420 : 381;			
			}
			//gary 2012-11-13
			if (friso201211){
				pw = (friso201211) ? 740 : 600;
				ph = (friso201211) ? 420 : 381;			
			}
			//gary 2012-11-13
			if (scb || cityofdream ||disney ||disney2 ||htc201204 ||sony || friso201211) {
				$('div.content_video, #playerCTN, #btnMoreVideoCTN').css('width',734);
				$('div.content_video, #playerCTN').css('height',490);
				$('div.content_video').css('background','none');
			}

			
			with (ODN.vodPlayerInfo.data) {
				with ($.urlUtils) {
					playerURL = get(append(playerURL,{'id':mid,msect:msect,ssect:'odn',createTime:mtime,adType:'odn'}));
				}
			}
			
			var fv = {
				today: todaydate,
				tvc: 1,
				tvcSeq: 1,
				playMode: '4',
				autoPlay: 0,
				loadThumb: 1,
				bumper: 0,
				buttons: 'vol',
				tvcAdZones: '1181,1180,1182,1183,1188',
				customThumbPath: '/ontv/'+ODN.arcDate+'/large',
				useAgent: navigator.userAgent
			};
			/*
			 if (showHTC) {
				var impId = (ODN.pubDate >='20110627' && ODN.pubDate <= '20110629') ? '38183' : '38327';
				fv.fixTvc = 'http://ad2.on.cc/html/htc/htc_sensation_itvc.xml';
				fv.tvcSeq = 0;
				fv.autoPlay = 1;
				fv.impression = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:'+impId;
			}
			 */

				//gary 2012-11-13
			 if (scb || cityofdream ||disney || disney2 || htc201204 ||sony || friso201211) {
				//var impId = (ODN.pubDate >='20110627' && ODN.pubDate <= '20110629') ? '38183' : '38327';
				
				if ( cityofdream ) {
					fv.fixTvc = '/img/ad/cityofdream/cityofdream_itvc.xml';
				}
				
				//fv.tvcSeq = 0;
				//fv.autoPlay = 1;
				//fv.impression = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:42362';
			}
			
			//gary 2012-11-13
			if (scb || cityofdream || disney|| disney2 || htc201204||sony || friso201211) {
				//fv.tvc = 0;
				
				fv.tvcSeq = 0;

				if ( scb) {		
					fv.tvcSeq = 1;
					var img = new Image();
					img.src = "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:51570";		
				}
				if ( sony) {			
					fv.clickTag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45674";							
					fv.clickTAG = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45674";							
					fv._clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45674";	
					fv.clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45674";	

					var img = new Image();
					img.src = "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:45674";		
				}
				
				if( cityofdream) {
					
					fv.clickTag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=43145";							
					var img = new Image();
					img.src = "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:43145";							
				}
				
				if ( disney) {			
					fv.clickTag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";							
					fv.clickTAG = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";							
					fv._clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";	
					fv.clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";	
					fv.fixTvc = '/img/ad/disney201203/disney201203_itvc.xml';
					var img = new Image();
					img.src = "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:44581";		
				}
				if ( disney2) {			
					fv.clickTag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";							
					fv.clickTAG = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";							
					fv._clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";	
					fv.clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44583";	
					fv.fixTvc = '/img/ad/disney201203/disney201204_itvc.xml';
					var img = new Image();
					img.src = "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:44584";		
				}
				if ( htc201204) {			
					fv.clickTag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44948";							
					fv.clickTAG = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44948";							
					fv._clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44948";	
					fv.clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44948";	
					fv.fixTvc = '/img/ad/htc201204/htc201204_itvc.xml';
					var img = new Image();
					img.src = "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:44951";		
				}
				//gary 2012-11-13
				if ( friso201211) {			
					fv.clickTag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675";							
					fv.clickTAG = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675";							
					fv._clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675";	
					fv.clicktag = "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675";	
					fv.fixTvc = '/img/ad/friso201211/friso201211_itvc.xml';
					var img = new Image();
					img.src = "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:49675";		
				}
				
			} 
			
			
			var params = {
				allowFullScreen: true,
				allowScriptAccess: 'always',
				wmode: 'opaque'
			};
			swfobject.embedSWF(playerURL, "player_flash", pw, ph, "9.0.0","expressInstall.swf", fv, params, {name:'player_flash'});
			
			/*if ( scb ) {
				$('#playerCTN').css('position', 'relative');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=43359" target="_blank" style="position:absolute; display:block; width:241px; height:420px;top:0px;left:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=43359" target="_blank" style="position:absolute; display:block; width:740px; height:79px;top:0px;left:0px; opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<a  href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=43359" target="_blank" style="position:absolute; display:block; width:10px; height:420px;left:730px; top:0px; opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');				
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=43359" target="_blank" style="position:absolute; display:block; width:740px; height:33px;left:0px; top:392px;opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<style> #playerCTN a:hover {   background-color:#ababab; opacity:0.0;filter:alpha(opacity=1); }   </style>');
			}*/
			
			if ( disney) {
				$('#playerCTN').css('position', 'relative');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44581" target="_blank" style="position:absolute; display:block; width:144px; height:480px;top:0px;left:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44581" target="_blank" style="position:absolute; display:block; width:740px; height:21px;top:0px;left:0px; opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<a  href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44581" target="_blank" style="position:absolute; display:block; width:23px; height:420px;left:720px; top:0px; opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');				
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44581" target="_blank" style="position:absolute; display:block; width:740px; height:134px;left:0px; top:346px;opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<style> #playerCTN a:hover {   background-color:#ababab; opacity:0.0;filter:alpha(opacity=1); }   </style>');
			}
			if (disney2) {
				$('#playerCTN').css('position', 'relative');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44584" target="_blank" style="position:absolute; display:block; width:144px; height:480px;top:0px;left:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44584" target="_blank" style="position:absolute; display:block; width:740px; height:21px;top:0px;left:0px; opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<a  href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44584" target="_blank" style="position:absolute; display:block; width:23px; height:420px;left:720px; top:0px; opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');				
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44584" target="_blank" style="position:absolute; display:block; width:740px; height:134px;left:0px; top:346px;opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<style> #playerCTN a:hover {   background-color:#ababab; opacity:0.0;filter:alpha(opacity=1); }   </style>');
			}
			if (htc201204) {
				$('#playerCTN').css('position', 'relative');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44951" target="_blank" style="position:absolute; display:block; width:75px; height:420px;top:0px;left:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:blue; "><em>_</em></a>');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44951" target="_blank" style="position:absolute; display:block; width:740px; height:44px;top:0px;left:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:yellow; "><em>_</em></a>');
				$('#playerCTN').append('<a  href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44951" target="_blank" style="position:absolute; display:block; width:90px; height:420px;left:650px;top:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:pink; "><em>_</em></a>');				
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=44951" target="_blank" style="position:absolute; display:block; width:740px; height:60px;left:0px;top:368px;opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<style> #playerCTN a:hover {   background-color:#ababab; opacity:0.0;filter:alpha(opacity=1); }   </style>');
			}
			//gary 2012-11-13
			if (friso201211) {
				$('#playerCTN').css('position', 'relative');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675" target="_blank" style="position:absolute; display:block; width:75px; height:420px;top:0px;left:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:blue; "><em>_</em></a>');
				$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675" target="_blank" style="position:absolute; display:block; width:740px; height:44px;top:0px;left:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99; background-color:yellow; "><em>_</em></a>');
				$('#playerCTN').append('<a  href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675" target="_blank" style="position:absolute; display:block; width:90px; height:420px;left:650px;top:0px;opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:pink; "><em>_</em></a>');				
				//$('#playerCTN').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=49675" target="_blank" style="position:absolute; display:block; width:740px; height:60px;left:0px;top:368px;opacity:0.0;filter:alpha(opacity=1); z-index:99;background-color:#ababab; "><em>_</em></a>');
				$('#playerCTN').append('<style> #playerCTN a:hover {   background-color:#ababab; opacity:0.0;filter:alpha(opacity=1); }   </style>');
			}
			//opacity:0.0;filter:alpha(opacity=1);
		}
	},
	init: function() {
		this.articleId = ODN.aid;
		with(ODN.vodPlayerInfo) {
			$.get(vlXmlPath, bind);
		}
	}
};
/* Alan */
ODN.contentBoxTopAd = {
	timeId : null,
	init: function (){
		ODN.contentBoxTopAd.timeId = window.setInterval("ODN.contentBoxTopAd.init2();", 1000);
	},
	init2: function() {
		var type1 =  ODN.sect;
//		if (type1 == "newsanson"){
//		 
//			if($('#timelineSlider').css('display') == 'block'){
//				$('#contentCTN-top').css("padding-top", "61px");
//				$('#contentCTN-top').css("mini-height", "500px");
//			}else{
//				$('#contentCTN-top').css("padding-top", "136px");
//				$('#contentCTN-top').css("mini-height", "420px");
//			}
//			$('#contentCTN-top').css("width", "941px");
//			$('#contentCTN-top').css("background-image", "url(/img/ad/nike/skin_970x516.jpg)");
//			$('#contentCTN-top').css("background-repeat", "no-repeat");
//			$('#leadin h1').css("color","#FFFFFF");
//			$('#contentCTN-top').css("background-color", "#FFFFFF");
//			
//			$('#contentCTN-top').css('position', 'relative');
//			$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51302" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:970px; height:136px;top:0px;left:0px; z-index:99; background-color:#ababab;"><em>_</em></a>');
//			$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51302" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:15px; height:365px;top:136px;left:0px; z-index:99; background-color:#ababab;"><em>_</em></a>');
//			$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51302" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:970px; height:15px;top:501px;left:0px; z-index:99; background-color:#ababab;"><em>_</em></a>');
//			$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51302" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:15px; height:365px;top:136px;left:955px; z-index:99; background-color:#ababab;"><em>_</em></a>');
//			
//			
//			$('#largeAdsCTN').hide();
//			$('#contentCTN-top').append('<div id="adPlayerLayer" style="position:absolute; display:block; width:360px; height:365px;top:70px;left:595px; z-index:99;padding-bottom:15px;"><div id="contentADPlayer" ></div></div>');
//			
//			var fv = {};
//			var params = {
//			menu: false,
//			wmode: 'transparent'
//				};
//			swfobject.embedSWF('/img/ad/nike/tvc_360x365.swf', "contentADPlayer", 360, 365, "9.0.0", "expressInstall.swf", fv, params);
//		
//		}
		if (type1 == "news" || type1 == "sport"){
			//if($('#storyInfo .name').html() != ''){

			if($('#timelineSlider').css('display') == 'block'){
				$('#contentCTN-top').css("padding-top", "60px");
				$('#contentCTN-top').css("min-height", "431px");
			}else{
				$('#contentCTN-top').css("padding-top", "60px");
				$('#contentCTN-top').css("min-height", "431px");
			}
			
			$('#contentCTN-top').css("width", "940px");
			$('#contentCTN-top').css("background-image", "url(/img/ad/20130306_adidas/bg_970516.jpg)");
			$('#contentCTN-top').css("background-repeat", "no-repeat");
			$('#contentCTN-top').css("background-color", "#000000");
			$('#contentCTN-top').css('position', 'relative');

//                    var imp = new Image();
//                    if (type1 == 'sport') {
//                        imp.src= "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:51303";
//                    } else {
//                        imp.src= "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:51302";
//                    }

			document.getElementById('contentCTN-top').onclick=TestClick;
			//$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45514" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:970px; height:136px;top:0px;left:0px; z-index:99; background-color:#ababab;"><em>_</em></a>');
			//$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45514" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:15px; height:365px;top:136px;left:0px; z-index:99; background-color:#ababab;"><em>_</em></a>');
			//$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45514" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:970px; height:15px;top:501px;left:0px; z-index:99; background-color:#ababab;"><em>_</em></a>');
			//$('#contentCTN-top').append('<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=45514" target="_blank" style="position:absolute; display:block;opacity:0.0;filter:alpha(opacity=1); width:15px; height:365px;top:136px;left:955px; z-index:99; background-color:#ababab;"><em>_</em></a>');

			var contentSkinTop = $('#contentCTN-top').offset().top + 136;
			var contentSkinLeft = $('#contentCTN-top').offset().left + 579.5;

			if($('#timelineSlider').css('display') == 'block'){
//                        $('#contentCTN-top').after('<div id="adPlayerLayer" style="position:absolute; display:block; width:360px; height:280px;top:' + contentSkinTop + 'px;left:' + contentSkinLeft + 'px; z-index:99;padding-bottom:15px;"><div id="contentADPlayer"></div></div>');
				$('#contentCTN-top').after('<div id="adPlayerLayer" style="position:absolute; display:block; width:360px; height:280px;top:' + contentSkinTop + 'px;margin-left: 580px; z-index:99;padding-bottom:15px;"><div id="contentADPlayer"></div></div>');
			}else{
//                        $('#contentCTN-top').after('<div id="adPlayerLayer" style="position:absolute; display:block; width:360px; height:280px;top:' + contentSkinTop + 'px;left:' + contentSkinLeft + 'px; z-index:99;padding-bottom:15px;"><div id="contentADPlayer"></div></div>');
				$('#contentCTN-top').after('<div id="adPlayerLayer" style="position:absolute; display:block; width:360px; height:280px;top:' + contentSkinTop + 'px;margin-left: 580px; z-index:99;padding-bottom:15px;"><div id="contentADPlayer"></div></div>');
			}
			if ($.browser.msie && $.browser.version == '7.0') {
				$('#contentCTN-top').css('margin-bottom', '10px');
			}
			var fv = {};
			fv.clickTAG = GetClickTagUrl();
			if (type1 == 'news') {
				fv.impression = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51791';
			} else {
				fv.impression = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51792';
			}
//                    alert('impress');
			var params = {
				menu: false,
				wmode: 'transparent'
			};
			setTimeout(function() {
				swfobject.embedSWF('/img/ad/20130306_adidas/360365_CS4.swf', "contentADPlayer", 360, 365, "9.0.0", "expressInstall.swf", fv, params);
			}, 1000);
		}
		window.clearInterval(ODN.contentBoxTopAd.timeId);
		ReSetCssForTimerSlider();
		$('#contentCTN-top').css('margin-left', '-14px');
		$('.largeAdsCTN').hide();
		//$('#adPlayerLayer').hide();
		document.getElementById("contentCTN-top").style.cursor="pointer";
		document.getElementById("leadin").style.cursor="default";
		document.getElementById("leadin").onmouseover=InReadPage;
		document.getElementById("leadin").onmouseout=OutReadPage;
		document.getElementsByName("textAdsCTN").onmouseover=InReadPage;
		document.getElementsByName("textAdsCTN").onmouseout=OutReadPage;
		document.getElementById("timelineSlider").onmouseover=InReadPage;
		document.getElementById("timelineSlider").onmouseout=OutReadPage;
		document.getElementById("storyInfo").onmouseover=InReadPage;
		document.getElementById("storyInfo").onmouseout=OutReadPage;
		if (document.getElementById("contentADPlayer")) {
			document.getElementById("contentADPlayer").onmouseover=InReadPage;
			document.getElementById("contentADPlayer").onmouseout=OutReadPage;
		}
		//document.getElementById("contentADPlayer").onmouseover=OutReadPage;
	}
};

ODN.contentBoxTopAd2 = {
	timeId : null,
	init: function (){
		ODN.contentBoxTopAd2.timeId = window.setInterval("ODN.contentBoxTopAd2.init2();", 1000);
	},
	init2: function() {
		var type1 =  ODN.sect;
		if (type1 == "news" || type1 == "entertainment" || type1 == "sport"){
			if($('#timelineSlider').css('display') == 'block'){
				$('#contentCTN-top').css("padding-top", "50px");
				$('#contentCTN-top').css("min-height", "451px");
			}else{
				$('#contentCTN-top').css("padding-top", "60px");
				$('#contentCTN-top').css("min-height", "441px");
			}
			$('#contentCTN-top').css("width", "940px");
			$('#contentCTN-top').css("background-image", "url(http://202.125.90.45/img/ad/nike/20130312/970x516_oncc.jpg)");
			$('#contentCTN-top').css("background-repeat", "no-repeat");
			$('#contentCTN-top').css("background-color", "#000000");
			$('#contentCTN-top').css('position', 'relative');
			document.getElementById('contentCTN-top').onclick=TestClick2;
			var contentSkinTop = $('#contentCTN-top').offset().top + 120;
			if($('#timelineSlider').css('display') == 'block'){
				$('#contentCTN-top').after('<div id="adPlayerLayer" style="position:absolute; display:block; width:360px; height:280px;top:' + contentSkinTop + 'px;margin-left: 596px; z-index:99;padding-bottom:15px;"><div id="contentADPlayer"></div></div>');
			}else{
				$('#contentCTN-top').after('<div id="adPlayerLayer" style="position:absolute; display:block; width:360px; height:280px;top:' + contentSkinTop + 'px;margin-left: 596px; z-index:99;padding-bottom:15px;"><div id="contentADPlayer"></div></div>');
			}
			if ($.browser.msie && $.browser.version == '7.0') {
				$('#contentCTN-top').css('margin-bottom', '10px');
			}
			var fv = {};
			fv.clickTAG = GetClickTagUrl2();
			if (type1 == 'news') {
				fv.impression = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51879';
			} else if (type1 == 'entertainment') {
				fv.impression = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51880';
			} else {
				fv.impression = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51881';
			}
			var params = {
				menu: false,
				wmode: 'transparent'
			};
			setTimeout(function() {
				swfobject.embedSWF('http://202.125.90.45/img/ad/nike/20130312/360x365_oncc.swf', "contentADPlayer", 360, 365, "9.0.0", "expressInstall.swf", fv, params);
			}, 1000);
		}
		window.clearInterval(ODN.contentBoxTopAd2.timeId);
		//ReSetCssForTimerSlider();
		$('#leadin h1').css('color', '#000000');
		$('#timelineSlider ul li a .date').css('color', '#ffffff');
		$('#timelineSlider ul li .date').css('background-color', '#20356a');
		$('#timelineSlider ul li a .date').css('background-color', '#20356a');
		$('#timelineSlider ul li .today .date').css('color', '#EC2A80');
		$('#storyInfo .name').css('color', '#ffffff');
		$('#leadin').css('width', '570px');
		$('#leadin > h1').css('color', '#ffffff');
		$('#contentCTN-top').css('margin-left', '-14px');
		$('.largeAdsCTN').hide();
		$('.textAdsCTN').hide();
		//$('#adPlayerLayer').hide();
		document.getElementById("contentCTN-top").style.cursor="pointer";
		document.getElementById("leadin").style.cursor="default";
		document.getElementById("leadin").onmouseover=InReadPage;
		document.getElementById("leadin").onmouseout=OutReadPage;
		document.getElementsByName("textAdsCTN").onmouseover=InReadPage;
		document.getElementsByName("textAdsCTN").onmouseout=OutReadPage;
		document.getElementById("timelineSlider").onmouseover=InReadPage;
		document.getElementById("timelineSlider").onmouseout=OutReadPage;
		document.getElementById("storyInfo").onmouseover=InReadPage;
		document.getElementById("storyInfo").onmouseout=OutReadPage;
		if (document.getElementById("contentADPlayer")) {
			document.getElementById("contentADPlayer").onmouseover=InReadPage;
			document.getElementById("contentADPlayer").onmouseout=OutReadPage;
		}
		//document.getElementById("contentADPlayer").onmouseover=OutReadPage;
	}
};

function IsShowContentTopBox(){
	if (typeof m_ContentBoxTop != 'undefined'){
			if (m_ContentBoxTop==true) {
					return true;
			}	
	}
	return false;
}

function ReSetCssForTimerSlider(){
		$('#leadin h1').css('color', '#000000');
//		$('#timelineSlider ul li a .date').css('color', '#ffffff');
		$('#timelineSlider ul li a .date').css('color', '#000000');
//		$('#timelineSlider ul li .date').css('background-color', '#000000');
//		$('#timelineSlider ul li a .date').css('background-color', '#000000');
//		$('#timelineSlider ul li .date').css('background-color', 'transparent');
//		$('#timelineSlider ul li a .date').css('background-color', 'transparent');
		$('#timelineSlider ul li .today .date').css('color', '#EC2A80');
		$('#storyInfo').css('color', '#ffffff');
                $('#leadin').css('width', '570px');
}

var _InReadPage = false;
function InReadPage(){
_InReadPage = true;
}

function OutReadPage(){
_InReadPage = false;
}
/* Alan */
function TestClick(){
    if(_InReadPage==true) return;
    var type1 =  ODN.sect;
    var url='';
    switch(type1){
        case 'sport':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51792';
        break;
        case 'news':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51791';
        break;
        default:
        break;
    }
//    alert(url);
    window.open(url);
}

function TestClick2(){
    if(_InReadPage==true) return;
    var type1 =  ODN.sect;
    var url='';
    switch(type1){
        case 'news':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51879';
        break;
        case 'entertainment':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51880';
        break;
		case 'sport':
			url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51881';
        break;
        default:
        break;
    }
    window.open(url);
}

function GetClickTagUrl(){
    var type1 =  ODN.sect;
    var url='';
    switch(type1){
        case 'sport':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51792';
        break;
        case 'news':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51791';
        break;
        default:
        break;
    }
	return url; 
}

function GetClickTagUrl2(){
    var type1 =  ODN.sect;
    var url='';
    switch(type1){
        case 'news':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51879';
        break;
        case 'entertainment':
            url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51880';
        break;
		case 'sport':
			url = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=51881';
        break;
        default:
        break;
    }
	return url; 
}

/* slim */
ODN.ysm = {
	init: function() {
		var iframeStr = [];
		var urlString ;
		
		var type1 =  ODN.sect;
		

		
		urlString = "http://" + location.hostname + "/js/v2/iframe_ysm_utf8.html?size=wider&key=" + type1 + "&url=" + location.href;

		iframeStr.push("<iframe frameborder=0  marginheight=0 marginwidth=0 scrolling=no width='700px' height='320px' src='" +  urlString + "'></iframe>");
		
		$("#articleNav").after(iframeStr.join(''));		
	}
};

/* slim */
ODN.yahoo_keywords_list = {
	init: function() {
		/*
		var yahoo_keyword_list = new Array();
		//yahoo keyword ONE
		yahoo_keyword_list[0] = new Object();
		yahoo_keyword_list[0].promoname = "18&#x597D;&#x8DEF;&#x6578;";
		yahoo_keyword_list[0].promoname1 = "新聞1";
		yahoo_keyword_list[0].promolink = "http://money18.on.cc/promo/guide/guide4.html";

		//yahoo keyword TWO
		yahoo_keyword_list[1] = new Object();
		yahoo_keyword_list[1].promoname = "&#x7956;&#x5152;&#x88AB;&#x8E29;&#x6B4C;&#x661F;&#x4ED4;";
		yahoo_keyword_list[1].promoname1 = "新聞2";
		yahoo_keyword_list[1].promolink = "http://tv.on.cc/index.html?s=4&ss=20&i=OEN100830-11171-101M&d=1283182225";

		//yahoo keyword THREE
		yahoo_keyword_list[2] = new Object();
		yahoo_keyword_list[2].promoname = "&#x69CD;&#x624B;&#x9A0E;&#x52AB;&#x5EB7;&#x6CF0;&#x5718;";
		yahoo_keyword_list[2].promoname1 = "新聞3";
		yahoo_keyword_list[2].promolink = "http://tv.on.cc/index.html?s=3&ss=15&i=ONS-100830-11240-23M-APN&d=1283177651";
		*/
		
		var randArrayindex;
		if(yahoo_keyword_list.length > 999)
		{
			randArrayindex = randomXnumberfromY(3, yahoo_keyword_list.length);
		}
		else
		{
			randArrayindex = new Array();
			for(var i=0; i<yahoo_keyword_list.length; i++)
			{
				randArrayindex.push(i);
			}
		}
		var yahoo_keywords_html = "";
		var count =1;
		for(var i=0; i<randArrayindex.length; i++)
		{
			if ( count == 3 ) {
				count=1;
				yahoo_keywords_html += '<a href="http://home.on.cc/search/index.html?o=0&sk='+ encodeURIComponent(yahoo_keyword_list[randArrayindex[i]].promoname1) +'&x=0&y=0"  class="yahoo_key">'+yahoo_keyword_list[randArrayindex[i]].promoname1 +'&nbsp;&nbsp;</a><div style="height:8px;"></div>';
			} else {
				yahoo_keywords_html += '<a href="http://home.on.cc/search/index.html?o=0&sk='+ encodeURIComponent(yahoo_keyword_list[randArrayindex[i]].promoname1) +'&x=0&y=0"  class="yahoo_key">'+yahoo_keyword_list[randArrayindex[i]].promoname1 +'&nbsp;&nbsp;</a>';				
				count++;
			}
		}
		//document.getElementById("adsCTN").innerHTML = promo_text;
		$("#yahooBox").append('<div style="height:8px;"></div><div id="adv_yahoo_keyword_head">熱門:</div>' + yahoo_keywords_html );
	}
};


// Get Random from Array Slim
function randomXnumberfromY(inX, inY)
{
	var randomXnumberArray = new Array();
	for(var i=0; i<inX; i++)
	{
		var this_rand_no = parseInt((Math.random()*inY)+"");
		var ok = 0;
		while(ok == 0)
		{
			var repeat = 0;
			for (var j=0; j<randomXnumberArray.length; j++)
			{
				if(this_rand_no == randomXnumberArray[j])
				{
					repeat = 1;
				}
			}
			if(repeat == 1)
			{
				this_rand_no = parseInt((Math.random()*inY)+"");
			}
			else
			{
				ok = 1;
			}
		}
		randomXnumberArray.push(this_rand_no);
	}
	return randomXnumberArray;
}


/* pending to use
ODN.vodPlayerInfo = {
	data: {mid:'', msect:'', mtype:'', mtime:''},
	screenWidth: screen.width,
	videoTitle: '',
	videoThmbnl: '/ontv/'+ODN.arcDate+'/',
	bind: function(vid) {
		var d = ODN.data.videoInfo;
		for (var i = 0; i < d.length; i++) {
			if (vid === d[i].vid) {
				var v = d[i];
				this.videoTitle = (v.title.length>14)?v.title.substring(0,14)+'...':v.title;
				this.videoThmbnl += v.fileName;
				this.data.mid = v.vid;
				this.data.mtype = 'Video';
				this.data.msect = v.group[0];
				this.data.mtime = v.createTime;
				
				var w = 905;
				var h = 395;
				if (screen.width <= 800) {
					w =  760;
					h = 340;
				} else if (screen.width <= 1024) {
					w =  874;
					h = 401;
				}
				
				var vbox = $('#videoThumbBox');
				vbox.find('.title').text(v.title);
				vbox.thickbox({
					width: w,
					height: h,
					hiddenObjSelector: (ODN.sect_L3 != '' && ODN.priority != '') ? '#superIframe, div.largeAdsCTN object, div.largeAdsCTN embed' : 'object, embed',
					innerHTML: function(target) {
					return '<iframe scrolling="no" frameborder="0" style="width: '+w+'px; height: '+h+'px;" name="TB_iframeContent205" id="TB_iframeContent" src="/cnt/'+ODN.sect+'/v2/videoPlayer_'+ODN.getSectCode()+'.html" hspace="0"></iframe>'}
				});
				vbox.css({'background-image':'url('+this.videoThmbnl+')', 'display':'block'});
			}
		}
		/*
		var found = false;
		var tvURL;
		$(data).find('news').each(function(){
			if (($(this).find('articleID').text()==ODN.vodPlayerInfo.articleId)&&!found) {
				found = true;
				var tmp = $(this).find('video_title').text();
				//ODN.vodPlayerInfo.videoTitle = (tmp.length>14)?tmp.substring(0,14)+'...':tmp;
				//ODN.vodPlayerInfo.videoThmbnl += $(this).find('thumbnail').text();
				tvURL = $(this).find('video_url').text();
				ODN.vodPlayerInfo.data.mid = $.urlParams.extract('mid', tvURL);
				ODN.vodPlayerInfo.data.mtype = $.urlParams.extract('mtype', tvURL);
				ODN.vodPlayerInfo.data.mtime = $.urlParams.extract('mtime', tvURL);
				ODN.vodPlayerInfo.data.msect =
					(tvURL.indexOf('broadcast.html')!=-1)?'2':
					((tvURL.indexOf('commentary.html')!=-1)?'41':
					((tvURL.indexOf('ent.html')!=-1)?'4':
					((tvURL.indexOf('life.html')!=-1)?'5':
					((tvURL.indexOf('news.html')!=-1)?'3':''))));
			}
		});
		if (found) {
			var videoBox = $('#videoThumbBox');
			videoBox.find('.title').text(ODN.vodPlayerInfo.videoTitle);
			videoBox.css({'background-image':'url('+ODN.vodPlayerInfo.videoThmbnl+')', 'display':'block'});
		}
		
	},
	init: function() {
		var d = ODN.data.articleVideo;
		if (d) {
			for(var i =0;i<d.length;i++) {
				if (d[i].aid===ODN.aid) {;
					//$('body').prepend(d[i].createTime * 1000 + ',' +new Date(d[i].createTime * 1000)+', /js/video/info/'+$.dateFormat(new Date(d[i].createTime * 1000), 'yyyymmdd')+'/'+d[i].vid+'.js');
					var vid = d[i].vid;
					$.getScript('/js/video/info/'+$.dateFormat(new Date(d[i].createTime * 1000), 'yyyymmdd')+'/'+vid+'.js', function() {ODN.vodPlayerInfo.bind(vid); } );
				}
			}
		}
	}
};
*/
(function($) {
		  
	$.fn.thickbox = function(p_opts) {
		//var opts = (p_opts != null) ? p_opts : $.fn.thickbox.defaults;
		var opts = $.extend({}, $.fn.thickbox.defaults, p_opts);
		return this.each(function() {
			$(this).unbind('click.thickbox').bind('click.thickbox', {tbOptions:opts, tbAnchor:this}, function(e) {
				e.preventDefault();
				$(e.target).blur();
				$.thickbox.show(e.data.tbOptions, $(e.data.tbAnchor));
				return false;
			});
		});
		return this;
	};
	
	/* Public Methods */
	$.thickbox = {};
	
	$.thickbox.remove = function() {
		tb_remove();
	};
	
	$.thickbox.show = function(tbOptions, target) {
		tb_show(tbOptions, target);
	};
	
	$.thickbox.parseQuery = function(query) {
		var Params = {};
		if ( ! query ) {return Params;}// return empty object
		var Pairs = query.split(/[;&]/);
		for ( var i = 0; i < Pairs.length; i++ ) {
			var KeyVal = Pairs[i].split('=');
			if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
			var key = unescape( KeyVal[0] );
			var val = unescape( KeyVal[1] );
			val = val.replace(/\+/g, ' ');
			Params[key] = val;
		}
		return Params;
	};
	
	/* Inner Methods */	
	function tb_show(tbOptions, target) {
		try {
			if (typeof document.body.style.maxHeight === 'undefined') {//if IE 6
				if (document.getElementById('TB_HideSelect') === null) {//iframe to hide select elements in ie6
					$('body').append('<iframe id="TB_HideSelect"></iframe><div id="TB_overlay"></div><div id="TB_window"></div>');
				}
			} else {//all others
				if(document.getElementById('TB_overlay') === null){
					$('body').append('<div id="TB_overlay"></div><div id="TB_window"></div>');
				}
			}
			
			if (tb_detectMacXFF()) {
				$('#TB_overlay').addClass('TB_overlayMacFFBGHack');//use png overlay so hide flash
			} else {
				$('#TB_overlay').addClass('TB_overlayBG');//use background and opacity
			}
			
			$(tbOptions.hiddenObjSelector).css('visibility','hidden');
			
			$("#TB_window").append(tbOptions.innerHTML(target));
			$("#TB_window").css('display','block');
			$("#TB_window").data('tbOptions',tbOptions);
			tb_position();
			
			document.onkeyup = function(e){ 	
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					tb_remove();
				}	
			}
		} catch (e) {
			alert(e);
		}
	};
	
	function tb_detectMacXFF() {
		var userAgent = navigator.userAgent.toLowerCase();
		if (userAgent.indexOf('mac')!=-1 && userAgent.indexOf('firefox')!=-1) {
			return true;
		}
	};
	
	function tb_position() {
		var tbOptions = $('#TB_window').data('tbOptions');
		var scTop = $(document).scrollTop();
		var adjTop = $(window).height() - tbOptions.height;
		if (adjTop < 0)
			adjTop = scTop;
		else
			adjTop = scTop+Math.round(adjTop/2);
		
		if ($(window).width() > tbOptions.width) {
			$('#TB_window').css({left:'50%', marginLeft: '-' + parseInt((tbOptions.width / 2),10) + 'px', width: tbOptions.width + 'px'});
		} else {
			$('#TB_window').css({left:'0px', marginLeft:'0px'});
		}
		$('#TB_window').css({marginTop: adjTop + 'px'});
	};
	
	function tb_remove() {
		var tbOptions = $('#TB_window').data('tbOptions');
		$('#TB_window').css('display','none');
		$('#TB_window,#TB_overlay,#TB_HideSelect').trigger('unload').unbind().remove();
		$(tbOptions.hiddenObjSelector).css('visibility','visible');
	};
	
	$.fn.thickbox.defaults = {
		width :	980,
		height : 600,
		hiddenObjSelector : 'object, embed',
		innerHTML : function(target) {return 'Missing Content!!!'}
	};
	
})(jQuery)
;




//$AD.dropDown.add('lifestyle', '&#x745e;&#x58eb;&#x5bf6;&#x85ba;&#x840a;&#x8155;&#x9336;', '#1375ba|#ffffff', 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=27105|blank');
//$AD.keyword.add('news', '的|工作', $AD('/ifm/testAd/classified_popup.swf', 220, 140).setUrl('http://classified.on.cc/'));
//$AD.keyword.add('finance', '的', $AD('/ifm/testAd/kw.swf', 200, 90).setUrl('http://on.cc'));
//$AD.keyword.add('news, china_world', '政府|我', $AD('http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:20796', 210, 90).setUrl('http://tv.on.cc'));
//$AD.keyword.add('news, china_world', '流感|預防|衛生|感染|發燒|防疫|H1N1|隔離|接觸|確診|個案|患者|疫情|醫院|入境|病例|停課|體溫|傷風|感冒|咳嗽|喉嚨痛|觀察|桉葉|病徵|特敏福|病毒|口罩|陽性|防控工作', $AD('http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:22535', 210, 90).setUrl('http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=22535'), 'kw_pfy');

ODN.keywordContent.add('finance', ODN.content.stockKeyword.regEx, ODN.content.stockKeyword.renderHtml);
if ($.browser.msie && (parseInt($.browser.version)<7)) {
	document.write(unescape("%3Cscript src='/js/DD_belatedPNG_0.0.8a.js' type='text/javascript'%3E%3C/script%3E"));
}

$(document).ready(function() {
	
	
	/*
	if (ODN.sect == "news") {
		// SONY ad
		$('#adsSuperCTN').hide(); 
		$('.largeAdsCTN').hide();
		$('#leadin').width(940);
	
		//$('#topNavCTN').after('<div class="clear"></div>');
		$('#pageCTN').before('<div style="margin-left: auto; margin-right: auto; width: 1000px;"><div id="sony_player_flash"></div></div>');
	
		var playerURL = '/img/ad/sony/oncc_1000X250.swf';
		
		/*
		with (ODN.vodPlayerInfo.data) {
			with ($.urlUtils) {
				playerURL = get(append(playerURL,{'id':mid,msect:msect,ssect:'odn',createTime:mtime,adType:'odn'}));
			}
		}
		
		var fv = {
			today: todaydate,
			tvc: 0,
			tvcSeq: 1,
			playMode: 4,
			autoPlay: 1,
			loadThumb: 0,
			bumper: 0,
			buttons: 'vol',
			tvcAdZones: '',
			customThumbPath: '',
					useAgent: navigator.userAgent
				};
	 
			fv.tvcSeq = 0;
			fv.autoPlay = 1;
			fv.impression = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:37801';
			fv.clickTAG = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=37801';
			fv.clickTAG2 = 'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=37801';					
		var params = {
			allowFullScreen: true,
			allowScriptAccess: 'always',
			wmode: 'opaque'
		};
	
		swfobject.embedSWF(playerURL, "sony_player_flash", 1000, 250, "9.0.0","expressInstall.swf", fv, params, {name:'sony_player_flash'});	
	}
	*/
	
	
	
	
	
	/*$('a.thickbox').thickbox({
		width: 980,
		height: 600,
		hiddenObjSelector: (ODN.sect_L3 != '' && ODN.priority != '') ? '#superIframe, #adsCTN object, #adsCTN embed, #newsInfoCTN object, #newsInfoCTN embed' : 'object, embed',
		innerHTML: function(target) {
		return '<iframe scrolling="no" frameborder="0" style="width: 980px; height: 600px;" name="TB_iframeContent205" id="TB_iframeContent" src="http://jqtest/odn-thickbox/news/imageGallery_00167.html?pId='+target.attr('href')+'" hspace="0"> </iframe>'}
	});
	
	$('a.videobox').thickbox({
		width: 905,
		height: 395,
		hiddenObjSelector: (ODN.sect_L3 != '' && ODN.priority != '') ? '#superIframe, #adsCTN object, #adsCTN embed, #newsInfoCTN object, #newsInfoCTN embed' : 'object, embed',
		innerHTML: function(target) {
		return '<iframe scrolling="no" frameborder="0" style="width: 905px; height: 395px;" name="TB_iframeContent205" id="TB_iframeContent" src="http://jqtest/odn-thickbox/news/videoPlayer_00167.html?pId='+target.attr('href')+'" hspace="0"> </iframe>'}
	});*/
	
	//ODN.fontSizePanel.init();
	
	//$('head').append('<link rel="stylesheet" type="text/css" href="/css/odn_content_print.css" media="print">');
	//$('#topNavCTN').append('<img src="/img/v2/logo_odn.png" border="0" class="printable">');
	
	ODN.keywordContent.init();
	
/*
	//double large fix
var p1 = $('#contentCTN-right p:eq(0)');
var h3 = p1.prev('h3');
var leadin = $('#leadin div.leadin');
if (h3.length) {leadin.append(h3);}
if (p1.length) {leadin.append(p1);}
*/
	
	ODN.browserHistory.bind('#browseHistoryList');
	
	ODN.articleNav.init();
	
	ODN.miscPanel.init();
	
	ODN.toolBar.init();
	
	ODN.imageGalleryInfo.init();
	
	ODN.vodPlayerInfo.init();
	
	ODN.releatedArticle.bind();

	ODN.columnistList.init();
	
	
	if ( ODN.sect_L3 != '00651') {
		ODN.storyTimeline.init();
	}
	
	/* slim */
	ODN.ysm.init();
	/*slim*/
	ODN.yahoo_keywords_list.init();
	
	/*Alan*/
	
	//if (window.location.href.indexOf('nike201205')  != -1 ) {
		//ODN.contentBoxTopAd.init();
		
	//	if (typeof m_ContentBoxTop != 'undefined'){
	//		if (m_ContentBoxTop==true) {
			if(IsShowContentTopBox()){
				//ODN.contentBoxTopAd.init();
			}
	//	}
	//}
	/*Alan*/

	if (ODN.sect == 'entertainment') {
		//if (todaydate > 20121205160000 && location.href.indexOf('20121206_nike') != -1) {
		if ((todaydate >= 20121207000000 && todaydate <= 20121211235900) || (todaydate >= 20121213000000 && todaydate <= 20121213235900) || (todaydate >= 20121215000000 && todaydate <= 20121215235900) || location.href.indexOf('20121206_nike') != -1) {
			//ODN.contentBoxTopAd.init();
		}
	}
	
	if ( ODN.sect == "finance") {
		//if ie6 hide it to fix select box bug
		if (!($AD.browser.msie && $AD.browser.version < 7)) {
			PTY.searchFrm.init();	
		}
	}
	
	for(var i=0; i < $('.footerAds a').length; i++) {
	
		$('.footerAds a').eq(i).html( $('.footerAds a').eq(i).text() );
	
	}
	
	/*Gary @ 04 Sep 2012*/
	if(ODN.sect == 'news'){
		var tracking = '48027';
		if(todaydate >= 20121201000000 && todaydate < 20121231595959){
			tracking = '50120';
                        $('li.facebook').after('<li style="width:98px"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid='+tracking+'" target="_blank"><img style="position:relative;" src="http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:'+tracking+'" /></a></li>');
		}else if(todaydate >= 20130101000000 && todaydate < 20130131595959){
			tracking = '50121';
                        $('li.facebook').after('<li style="width:98px"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid='+tracking+'" target="_blank"><img style="position:relative;" src="http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:'+tracking+'" /></a></li>');
		}else if(todaydate >= 20130201000000){
			tracking = '50122';
		}
		
	}
	/*Gary*/
	
	var timesRun = 0;
	var interval = setInterval(function(){
		timesRun += 1;
		if($('#topNavCTN').find('#topMenu-archive').length > 0){
			clearInterval(interval);
			if (!($.browser.msie && parseInt(document.documentMode) == 7)) {
				$('#banad').height(280);
			}
		} else if (timesRun === 10) {
			clearInterval(interval);
		}
	}, 500);
	
	if (location.href.indexOf('adidaspreview') > -1) {
		ODN.contentBoxTopAd.init();
	}
	
	if (location.href.indexOf('nikepreview') > -1) {
		ODN.contentBoxTopAd2.init();
	}
});