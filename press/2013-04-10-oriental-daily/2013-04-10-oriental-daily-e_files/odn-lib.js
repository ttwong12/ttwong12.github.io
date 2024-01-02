var adsCombo;
var onccLib = {};
var MASTERHEAD = false;

//Extend jQuery: Url Utils
$.urlUtils = {
	timeStamp: function(daily) {
		var today = new Date();
		if (daily) return today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString();
		return today.getTime().toString();
	},
	append: function(url, params) {
		var urlParams = [];
		var cnt = 0;
		var temp = url.split('?');
		var qs = this.qsToObj(url);
		for (var key in params) {
			qs[key] = params[key];
		}
		for (var key in qs) {
			if (cnt !== 0) urlParams.push('&');
			urlParams.push(key+'='+qs[key]);
			cnt++;
		}
		if (urlParams.length > 0) {
			return temp[0] + '?'+urlParams.join('');
		} else {
			return url;
		}
	},
	get: function(path, daily) {
		return this.append(path, {'t': this.timeStamp(daily)});
	},
	qsToObj: function(url) {
		var rtnVal = {};
		var temp = url.split('?');
		if (temp.length > 1) {
			var qs =temp[1].split('&');
			for(var i = 0; i < qs.length;i++) {
				var keyVal = qs[i].split('=');
				if (keyVal.length > 1) {
					rtnVal[keyVal[0]] = decodeURIComponent(keyVal[1]);
				}
			}
		}
		return rtnVal;
	}
};
//Extend jQuery: Convert string to date
$.strToDate = function(str) {
	if (str.length >= 8) {
		var yyyy = str.substring(0,4);
		var mm = parseInt(str.substring(4,6), 10) - 1;
		var dd = str.substring(6,8);
		var HH = (str.length >= 10) ? str.substring(8,10) : 0;
		var MM = (str.length >= 12) ? str.substring(10,12) : 0;
		var ss = (str.length >= 14) ? str.substring(12,14) : 0;
		return new Date(yyyy, mm, dd, HH, MM, ss);
	}
	return new Date();
};
//Extend jQuery: Digit Padding
$.digitPad = onccLib.digitPad = function(symbol, val, len) {
	var str = String(val);
	while (str.length < len) { str= symbol+str; }
	return str;
};

//Extend jQuery: Format date by given pattern
$.dateFormat = onccLib.dateFormat = function (aDate, aFormatStr) {
	// Some common format strings
	var masks = {'default':'ddd mmm dd yyyy HH:MM:ss'};
	// Internationalization strings
	var i18n = {
		dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', '日', '一', '二', '三', '四', '五', '六'],
		monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};

	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			len = len || 2;
			return $.digitPad('0',val,len);
		};

	var formatter = function (date, mask, utc) {
		
			mask = String(masks[mask] || mask || masks['default']);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == 'UTC:') {
				mask = mask.slice(4);
				utc = true;
			}

			var	_ = utc ? 'getUTC' : 'get',
				d = date[_ + 'Date'](),
				D = date[_ + 'Day'](),
				m = date[_ + 'Month'](),
				y = date[_ + 'FullYear'](),
				H = date[_ + 'Hours'](),
				M = date[_ + 'Minutes'](),
				s = date[_ + 'Seconds'](),
				L = date[_ + 'Milliseconds'](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  i18n.dayNames[D],
					dddd: i18n.dayNames[D + 7],
					m:    m + 1,
					mm:   pad(m + 1),
					mmm:  i18n.monthNames[m],
					mmmm: i18n.monthNames[m + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					//h:    H % 12 || 12 remove by James 18/11
					h:    H,
					hh:   pad(H),
					H:    H,
					HH:   pad(H),
					M:    M,
					MM:   pad(M),
					s:    s,
					ss:   pad(s),
					l:    pad(L, 3),
					L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? 'a'  : 'p',
					tt:   H < 12 ? 'am' : 'pm',
					T:    H < 12 ? 'A'  : 'P',
					TT:   H < 12 ? 'AM' : 'PM',
					Z:    utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
					o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
	};
	var typeOfDate = (typeof aDate).toLowerCase();
	var theDate;
	if (typeOfDate === 'object' && aDate.constructor === Date) {
		theDate = aDate;
	} else if (typeOfDate === 'string'){
		theDate = $.strToDate(aDate);
	}
	return formatter(theDate, aFormatStr, false);
};


//Extend jQuery: Image resize
$.imageResize = onccLib.imageResize = function(img, w, h) {

		var imgWidth = parseInt(img.width, 10); //506
		var imgHeight = parseInt(img.height, 10); //500
		if (imgHeight > imgWidth) {
			imgHeight = parseInt(imgHeight * (w / imgWidth), 10);
			imgWidth = w;
		} else {
			imgWidth = parseInt(imgWidth * (h / imgHeight), 10);
			imgHeight = h;
		}
		if (imgWidth < w) {
			img.width = w+'';
		} else if (imgHeight < h) {
			img.height = h+'';
		} else {
			img.width = imgWidth+'';
			img.height = imgHeight+'';
		}
};

//Extend jQuery: Cookies
$.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
// TSN prop
var TSN = {
	domain: 'http://the-sun.on.cc',
	pubDate: '',
	getSectHref: function(sect, pdate) {
		var href = '';
		var hrefDate = (pdate || this.pubDate);
		if (sect == 'main' && hrefDate == TSN.pubDate) {
			href = '/';
		} else if (sect == 'finance') {
			href = '/go/?pd='+hrefDate+'&s=00432';
		} else if (sect == 'adult') {
			href = '/go/?pd='+hrefDate+'&s=00506';
		} else {
			href = '/cnt/'+sect+'/'+hrefDate+'/index.html';
		}
		return href;
	},
	sectName: {
		'news': '港聞','finance': '財經新聞','adult': 'SUN樂園','sport': '體育新聞','lifestyle': '副刊新聞','entertainment': '娛樂新聞', 'china_world':'兩岸國際新聞', 'charity':'愛心基金'
	},
	convertSect: function(sect) {
		return sect;
	}
};
// ODN prop
var ODN = {
	version: 2,
	init : function() {
		this.href = window.location.href;
		this.pubDate = ODN_PUBDATE;
		//this.pubDate = '20111231';
		var info = this.getHrefInfo();
		this.arcDate = (info.pubdate != '') ? info.pubdate : this.pubDate;
		this.sect = info.sect_L1_name;
		this.orgSect = info.orgSect;
		this.sect_L3 = info.sect_L3;
		this.priority = info.priority;
		//TSN.pubDate = corpbar_tsn_date;
		TSN.pubDate = TSN_PUBDATE;
	},
	domain: 'http://orientaldaily.on.cc',
	pubDate: '20090119',
	arcDate: '20090101',
	sect: '',
	orgSect: '',
	sect_L3: '',
	priority : '',
	isAD: false,
	startDate: '20090401',
	getSectCode: function(sect) {
		var s = (sect || this.sect);
		switch(s) {
			case 'news': return '00167';
			case 'china_world': return '00359';
			case 'finance': return '00168';
			case 'entertainment': return '00169';
			case 'lifestyle': return '00171';
			case 'adult': return '00358';
			case 'sport': return '00170';
			case 'charity': return '00172';
		}
		return '';
	},
	aid: null,
	href: '',
	getGoHref: function(pubDate, sect) {
		return '/go/?pd='+pubDate+'&s='+sect;
	},
	getArticleHref: function(pubDate, sectL1, sectL3, prty) {
		return '/cnt/'+sectL1+'/'+pubDate+'/'+sectL3+'_'+prty+'.html';
	},
	getSectHref: function(sect, pdate) {
		var href = '';
		var hrefDate = (pdate || this.pubDate);
		if (sect == 'main' && hrefDate == ODN.pubDate) {
			href= '/';
		} else if (hrefDate < this.startDate) {
			href = '/archive/' + hrefDate + '/new/new_a00cnt.html';
		} else {
			href = '/cnt/'+sect+'/'+hrefDate+'/index.html';
		}
		return href;
	},
	getArticleById: function(aid) {
		var d = ODN.data.rawArticleList;
		if (d) {
			for (var i = 0; i < d.article.length; i++) {
				if (d.article[i].aid === aid)
					return d.article[i];
			}
		}
		return null;
	},
	getAIDInfo: function(aid, L1) {
		var o = {pubdate:'', sect_L3:'', priority:''};
		var m = aid.match(new RegExp('odn-([0-9]{8})-[0-9]{3}._([0-9]{5})_([0-9]{3})'));
		if (m) {
			o.pubdate = m[1];
			o.sect_L3 = m[2];
			o.priority = m[3];
			if (L1) {
				o.sect_L1_name = L1;
			}
		}
		return o;
	},
	getHrefInfo: function(href) {
		var o = {sect_L1_name:'', pubdate:'', sect_L3:'', priority:'', orgSect: ''};
		var h = (href || this.href).replace('http://', '');
		var ex = h.split('/');
		for(var i = ex.length -1; i > -1 ; i--) {
			if (ex[i].indexOf('.html') != -1) {
				var dotEx = ex[i].split('.');
				var tmpEx = dotEx[0].split('_');
				o.sect_L3 = tmpEx[0];
				if (tmpEx.length > 1) {
					o.priority = tmpEx[1];
				}
			} else if (ex[i].match(/^\d{8}$/)) {
				o.pubdate = ex[i];
			} else {
				if (ex[i].indexOf('adult') != -1) o.sect_L1_name = 'adult';
				else if (ex[i].indexOf('entertainment') != -1) o.sect_L1_name = 'entertainment';
				else if (ex[i].indexOf('china_world') != -1) o.sect_L1_name = 'china_world';
				else if (ex[i].indexOf('finance') != -1) o.sect_L1_name = 'finance';
				else if (ex[i].indexOf('charity') != -1) o.sect_L1_name = 'charity';
				else if (ex[i].indexOf('lifestyle') != -1) o.sect_L1_name = 'lifestyle';
				else if (ex[i].indexOf('news') != -1) o.sect_L1_name = 'news';
				else if (ex[i].indexOf('sport') != -1) o.sect_L1_name = 'sport';
				else if (ex[i].indexOf('archive') != -1) o.sect_L1_name = 'archive';
				else if (ex[i].indexOf('sitemap') != -1) o.sect_L1_name = 'sitemap';
				else if (ex[i].indexOf('commentary') != -1) {
					o.orgSect = 'commentary';
					o.sect_L1_name = 'news';
				}
				else if (h.indexOf('/cnt/main/') != -1 || ex.length == 2) {
					o.sect_L1_name = 'main';
				}
			}
		}
		
		//mapping sect main to correct L3
		if (o.priority == '') {
			if (o.sect_L3 == 'index' || o.sect_L3 == '') {
				if (o.sect_L1_name == 'charity') {
					o.pubdate = this.pubDate;
					o.sect_L3 = '00332';
					o.priority = '001';
				} else if (o.sect_L1_name == 'sport') {
					o.sect_L3 = '00286';
					o.priority = '001';
				} else if (o.sect_L1_name == 'adult') {
					o.sect_L3 = '00290';
					o.priority = '001';
				}
			}
		}
		
		if (o.orgSect == 'commentary') {
				o.sect_L3 = '00186';
				o.priority = '001';
		}
		
		if (o.orgSect == '') {
			o.orgSect = o.sect_L1_name;
		}
		return o;
	},
	print: function() {
		window.print();
	},
	writeScript: function(url) {
		document.write(unescape("%3Cscript src='"+url+"' type='text/javascript'%3E%3C/script%3E"));
	},
	printDate: function(dateStr, format) {
		document.write($.dateFormat(dateStr, format));
	},
	popFeedback: function() {
		var w = window.open ("/promo/comments.html", "feedback","dependent=yes,location=no,toolbar=no,scrollbars=yes,menubar=no,status=no,resizable=no,width=500,height=443");
		return false;
	},
	articleListUL: null,
	articleListSELECT: null
};

$(document).ready(function(){
	$('#adsSuperCTN').after('<a name="top"></a>');
});

ODN.init();
//e:ODN

/*ODN.data*/
ODN.data = {};
ODN.data.articleList = {};
ODN.data.articleVideo = null;
ODN.data.videoInfo = {};
ODN.data.rawArticleList = null;
ODN.data.articleKeyword = [];
ODN.data.getArticleKeyword = function(aid) {
	for (var i = 0; i < ODN.data.articleKeyword.length; i++) {
		if (ODN.data.articleKeyword[i].article.aid === aid) {
			return ODN.data.articleKeyword[i];
		}
	}
	return null;
};
ODN.data.keywordArticle = {};
ODN.data.keywordInfo = {};
ODN.data.storySeriesList = null;
ODN.data.storySeries = {};

/*ODN.jsonCB*/
ODN.jsonCB = {};
ODN.jsonCB.articleVideo = function(d) { ODN.data.articleVideo = d; };
ODN.jsonCB.videoInfo = function(d) { ODN.data.videoInfo[d.createTime] = d; };
ODN.jsonCB.articleList = function(d) {
	ODN.data.rawArticleList = d;
	/* use old list-js 
	var al = ODN.data.articleList;
	for (var i = 0; i < d.article.length; i++) {
		var info = ODN.getAIDInfo(d.article[i].aid, d.article[i].section);
		if (typeof al[info.sect_L1_name] === 'undefined') {
			al[info.sect_L1_name] = [];
		}
		
		al[info.sect_L1_name].push({pubdate:info.pubdate, sect_L1_name:info.sect_L1_name, sect_L2:info.sect_L2, sect_L3:info.sect_L3, priority:info.priority, title:d.article[i].title, is_main_article:String(d.article[i].isMain)});
	}
	for (var key in al) {
		al[key].sort(function(a,b) { return a.priority > b.priority });
	}
	*/
};
ODN.jsonCB.articleKeyword = function(d) {
	ODN.data.articleKeyword.push(d);
};
ODN.jsonCB.keywordArticle = function(d) {
	ODN.data.keywordArticle[d.keyword.kid] = d;
};
ODN.jsonCB.storySeriesList = function(d) {
	ODN.data.storySeriesList = d;
};
ODN.jsonCB.storySeries = function(d, latest) {
	if (typeof ODN.data.storySeries[d.sid] === 'undefined') {
		ODN.data.storySeries[d.sid] = {};
	}
	d.storyList.sort(function(a,b) { 
		return a.pubDate - b.pubDate
	});
	if (latest===true) {
		ODN.data.storySeries[d.sid]['latest'] = d;
	} else {
		ODN.data.storySeries[d.sid][d.m] = d;
	}
};
ODN.jsonCB.keywordInfo = function(d) {
	ODN.data.keywordInfo[d.kid] = d;
};

ODN.listGroup = {}; //{n:'我要讚讚你', L2:['00651']},
ODN.listGroup['news'] = [{n:'要聞', L2:['is_main_article']},{n:'港聞', L2:['00175', '00651']},{n:'東方日報正論', L2:['00185'], L3:['00186']},{n:'功夫茶', L2:['00189'], L3:['00190']},{n:'龍門陣', L2:['00183'], L3:['00184']},{n:'投訴', L2:['00195']}];

ODN.listGroup['finance'] = [{n:'要聞', L2:['is_main_article']},{n:'財經新聞', L2:['00201']},{n:'地產', L2:['00203']},{n:'投資', L2:['00209']},{n:'產評', L2:['00272'], L3:['00273']},{n:'專欄', L2:['00274']}];

ODN.listGroup['china_world'] = [{n:'要聞', L2:['is_main_article']},{n:'國際', L2:['00179']},{n:'世界視線', L2:['00191'], L3:['00192']},{n:'兩岸', L2:['00177']},{n:'神州觀察', L2:['00181'], L3:['00182']}];

ODN.listGroup['lifestyle'] = [
{n:'時尚潮流', L2:['00314', '00305'], 
L3:['00315', '00316', '00294', '00296', '00316', '00292', '00312', '00311', '00319', '00320', '00353']},
{n:'科技新知', L2:['00299'],
L3:['00317', '00318', '00302', '00300']},
{n:'名家專欄', L2:['00293'],
L3:['00324', '00325', '00326', '00327', '00328', '00329', '00378', '00313']},
{n:'保健．教育', L2:['00297'],
L3:['00298', '00304']}
];

ODN.listGroup['entertainment'] = [{n:'要聞', L2:['is_main_article']}, {n:'本地娛樂', L2:['00281']}, {n:'國際娛樂', L2:['00287']}];
//{n:'今日星蹤', L2:['00280']}
ODN.listGroup['adult'] = [{n:'男極圈', L2:['00289']}];

ODN.listGroup['sport'] = [{n:'體育', L2:['00285']}];
ODN.listGroup['charity'] = [{n:'愛心個案', L2:['00331']}, {n:'募捐個案', L2:['00335']}];
//get info by L2
ODN.getListGroupInfo = function(L2) {
	for(var key in ODN.listGroup) {
		for (var i = 0; i < ODN.listGroup[key].length; i++) {
			if (ODN.listGroup[key][i].L2[0] == L2) {
				ODN.listGroup[key][i].sect = key;
				return ODN.listGroup[key][i];
			}
		}
	}
	return null;
}
//e:ODN.listGroup


//ODN content
ODN.content = {
	getTitle: function() {
		return $('#leadin h1').text();
	}
};
//e:content
ODN.topNav = {
	init: function() {
		
		var html = '';
		var isArchive = (ODN.pubDate != ODN.arcDate && ODN.arcDate != '');
		var linkDate = (isArchive) ? ODN.arcDate : ODN.pubDate;
		var curSect = ODN.sect;
		var curSubCat = ODN.sect_L3;
		
		if (typeof Urchin != 'undefined') {
			Urchin.content_view(window.location.href);
		}
		
		var sm = {
			'commentary': [{k:'00185'},{k:'00189'},{k:'00181'},{k:'00191'},{k:'00272'},{k:'00183'}],
			'lifestyle': [{k:'00314'},{k:'00299'},{k:'00293'},{k:'00297'}],
			'charity': [{n:'愛心個案', k:'00332'},{n:'募捐個案', k:'00336'},{n:'慈善基金資訊', k:'info', url:'/cnt/charity/info.html'},{n:'捐款方法', k:'donate', url:'/cnt/charity/donate.html'}],
			'archive': [{n:'返回今日',k:'main'}]
		};
		var isCurCat = function(catSet, L3) {
			if (typeof catSet != 'undefined') {
				for(var j = 0;j < catSet.length;j++) {
					if (catSet[j] == L3) {
						return true;
					}
				}
			}
			return false;
		}
		var genSubMenu = function(sect) {
			var smHead = '<div class="infoBox" id="topMenu-'+sect+'"><div class="arrow"><!--NULL--></div><div class="rightShadow"><div class="contentBox"><ul class="clearList subMenuList clear">';
			var smFooter = '</ul></div></div><div class="footerShadow"><!--NULL--></div></div>';
			var s = '';
			for(var i = 0;i < sm[sect].length;i++) {
				var grpInfo = ODN.getListGroupInfo(sm[sect][i].k);
				var c = '';
				if (grpInfo != null) {
					c = isCurCat(grpInfo.L3, curSubCat) ? 'on' : '';
				} else if (sect == 'charity') {
					c = (sm[sect][i].k == curSubCat) ? 'on' : '';
				}
				if (i==0) c += ' first';
				if (c != '') c = ' class="'+c+'"';
				var url = '';
				if (sect == 'commentary') {
					if (sm[sect][i].k == '00272')  {
						url = ODN.getGoHref(ODN.arcDate, grpInfo.L2[0]);
					} else {
						url = ODN.getArticleHref(ODN.arcDate, grpInfo.sect, grpInfo.L3[0], '001');
					}
				} else if (sect == 'lifestyle') {
					url = ODN.getGoHref(ODN.arcDate, grpInfo.L2[0])
				} else if (sect == 'charity') {
					var tmpDate = (sm[sect] === '00336') ? ODN.pubDate : ODN.arcDate;
					url = (sm[sect][i].url || ODN.getArticleHref(tmpDate, sect, sm[sect][i].k, '001'));
				} else if (sect == 'archive') {
					url = '/';
				}

				//s += '<li'+c+'>&nbsp;<a href="'+url+'"'+aClass+'>'+(sm[sect][i].n || grpInfo.n)+'</a></li>';
				s += '<li'+c+'><a href="'+url+'" class="smenu-'+sm[sect][i].k+'" title="'+(sm[sect][i].n || grpInfo.n)+'"></a></li>';
			}
			return smHead + s + smFooter;
		}
		
		//Weather infomation
		//$('#topToolbar').append($ONCC.corpBar.renderSearchBox()+$ONCC.corpBar.renderWeatherInfo()+$ONCC.corpBar.renderWeatherBreaking());
		var yahooIframeUrl = $ONCC.domain+'/adv/web/corp/js/searchbox.html?ref='+document.domain;
		$('#topToolbar').append('<li class="yahoo"><iframe src="#" width="212" height="20" frameborder="0" scrolling="no" id="ODN_corpbar_searchbox" name="ODN_corpbar_searchbox"></iframe></li>'+$ONCC.corpBar.renderWeatherInfo()+$ONCC.corpBar.renderWeatherBreaking());
		window.frames["ODN_corpbar_searchbox"].location = yahooIframeUrl;
		
		var tm = $('#topMenu');
		
		tm.find('li.today').html($.dateFormat(ODN.arcDate, 'yyyy年mm月dd日(dddd)'));
		
		var isShowCom = (((curSect!= '' && curSect != 'entertainment' && curSect != 'lifestyle' && curSect != 'charity' && curSect != 'archive' && curSect != 'adult' && curSect != 'sport') && ODN.priority == '') || ODN.sect_L3 == '00186' || ODN.sect_L3 == '00190' || ODN.sect_L3 == '00184' || ODN.sect_L3 == '00273' || ODN.sect_L3 == '00192' || ODN.sect_L3 == '00182');
		if (curSect !== '') {
			tm.find('a.'+curSect).parent().addClass('on');
		}
		
		var logoTitle = (isArchive) ? '昔日東方' : '東方日報網頁';
		var logoImg = (isArchive)? '<img src="/img/v2/logo_odn_archive.png" border="0" width="97" height="22">' : '<img src="/img/v2/logo_odn.png" border="0" width="122" height="22">';
		$('#topHeader li.logo').html('<a title="'+logoTitle+'" href="'+ODN.getSectHref('main', linkDate)+'" class="picBtn">'+logoImg+'</a>');
		
		//promo
		if (!$AD.hFrame.loaded) {
			$('#topHeader').append('<li style="padding-left:20px;padding-top:5px;"><a href="http://news.on.cc/" class="arrowBtn">即時新聞</a></li><li style="padding-left:20px;padding-top:5px;"><a href="/promo/comments.html" class="arrowBtn" target="_blank" onclick="return ODN.popFeedback()">東方新版意見箱</a></li>');
		}
		
		
		if (curSect == 'commentary' || curSect == 'lifestyle' || curSect == 'charity' || curSect == 'archive') {
			tm.after(genSubMenu(curSect));
		}
		
		if (isShowCom) {
			tm.find('a.commentary').parent().addClass('on');
			tm.after(genSubMenu('commentary'));
		}
		
		if (ODN.arcDate !== ODN.pubDate) {
			tm.after(genSubMenu('archive'));
		}
		
		if (typeof $AD.hFrame != 'undefined') {
			isMini = $AD.hFrame.loaded;
			if (isMini) {
				var utilsCtn = $('#utilsCTN');
				var hframeHTML = $AD.hFrame.right.css({'position':'absolute', 'top':'0px','right':-$AD.hFrame.right.width+'px'}).renderHtml() +  $AD.hFrame.left.css({'position':'absolute', 'top':'0px','left':-$AD.hFrame.left.width+'px'}).renderHtml();
				utilsCtn.append(hframeHTML);
				//to fix h-frame and takeover show at same time
				if ($AD.hFrame.loadOnReady) {
					$(document).ready(function() {
						if (!$AD.takeOver) {
							$AD.hFrame.left.writeFlash();
							$AD.hFrame.right.writeFlash();
						}
					});
				} else {
						$AD.hFrame.left.writeFlash();
						$AD.hFrame.right.writeFlash();
				}
			}
		}
		
		
		

		
	}
	
};
//e:topNav


		
		
ODN.footer = {
	init: function() {
		var sect = 'odn';
		if ( $.browser.msie ) {
			$("#footerCTN").css( "height","103px" );
		 }
		document.write('<div class="menu" style="margin-bottom:5px;">| '+$ONCC.footer.getMenuList(sect).join(' | ')+' |</div>' +
					   '<div style="margin-bottom:5px;padding-left:5px">本網站已採納無障礙網頁設計。如閣下對此網站在使用上有任何查詢或意見，請以下列方式聯絡我們。 電郵 : <a href="mailto:enquiry@on.cc">enquiry@on.cc</a> </div>' +
					   '<div class="slogan">'+$ONCC.footer.getSlogan(sect)+'</div>' +
					   '<div class="copyright">'+$ONCC.footer.getCopyRight(sect)+'</div>');
	}
	
};
//e:footer

ODN.calender = {
	pubDate: ODN.pubDate,
	minYear: 2002,
	minMonth: 6,
	maxYear: parseInt(ODN.pubDate.substring(0, 4), 10),
	digitPad: function(n) {
		return onccLib.digitPad('0', n, 2);
	},
	getFebDay: function(yyyy) {
		return (((yyyy%4 == 0) && (yyyy%100 != 0)) || (yyyy%400 == 0)) ? 29 : 28;
	},
	isHoliday: function(yyyy, mm, dd, type) {
		t = (type || 'hk');
		var hd = yyyy + this.digitPad(mm) + this.digitPad(dd);
		var list = this.holidaySet[t]['day'][yyyy];
		if (typeof list != 'undefined') {
			for (var i = 0; i < list.length;i++) {
				if (list[i] == hd) {
					return true;
				}
			}
		}
		return false;
	},
	holidaySet: {
		hk: {
			day: {
				'2011': ["20110101", "20110203", "20110204", "20110205", "20110405", "20110422", "20110423", "20110425", "20110502", "20110510", "20110606", "20110701", "20110913", "20111001", "20111005", "20111226", "20111227"],
				'2010': ["20100101", "20100213", "20100215", "20100216", "20100402", "20100403", "20100405", "20100406", "20100501", "20100521", "20100616", "20100701", "20100923", "20101001", "20101016", "20101225", "20101227"],
				'2009': ["20090101", "20090126", "20090127", "20090128", "20090404", "20090410", "20090411", "20090413", "20090501", "20090502", "20090528", "20090701", "20091001", "20091003", "20091026", "20091225", "20091226"],
				'2008': ["20080101", "20080207", "20080208", "20080209", "20080321", "20080322", "20080324", "20080404", "20080501", "20080512", "20080609", "20080701", "20080915", "20081001", "20081007", "20081225", "20081226"],
				'2007': ["20070101", "20070217", "20070219", "20070220", "20070405", "20070406", "20070407", "20070409", "20070501", "20070524", "20070619", "20070702", "20070926", "20071001", "20071019", "20071225", "20071226"],
				'2006': ["20060102", "20060128", "20060130", "20060131", "20060405", "20060414", "20060415", "20060417", "20060501", "20060505", "20060531", "20060701", "20061002", "20061007", "20061030", "20061225", "20061226"],
				'2005': ["20050101", "20050209", "20050210", "20050211", "20050325", "20050326", "20050328", "20050405", "20050502", "20050516", "20050611", "20050701", "20050919", "20051001", "20051011", "20051226", "20051227"],
				'2004': ["20040101", "20040122", "20040123", "20040124", "20040405", "20040409", "20040410", "20040412", "20040501", "20040526", "20040622", "20040701", "20040929", "20041001", "20041022", "20041225", "20041227"],
				'2003': ["20030101", "20030201", "20030131", "20030203", "20030405", "20030418", "20030419", "20030421", "20030501", "20030508", "20030604", "20030701", "20030912", "20031001", "20031004", "20031225", "20031226"],
				'2002': ["20020101", "20020212", "20020213", "20020214", "20020329", "20020330", "20020401", "20020405", "20020501", "20020520", "20020615", "20020701", "20020921", "20021001", "20021014", "20021225", "20021226"]
			}
		}
	},
	getDayList: function(yyyy, mm) {
		var daySet = [31, this.getFebDay(yyyy), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var firstDay = new Date(yyyy, mm-1, 1);
		var dc = 0;
		var dayList = [];
		for (var w = 0; w < 6; w++) {
			for (var i = 0; i < 7; i++) {
                if (w == 0 && i < firstDay.getDay()) {
						dayList.push(-1);
                } else {
                    if (dc < daySet[mm-1]) {
                        dc++;
						dayList.push(dc);
                    }
                }
            }
		}
		return dayList;
	},
	min: {
		curYear: 0,
		curMonth: 0,
		id: '#calender-min',
		loaded: false,
		toggle: function() {
			if(this.curYear == 0) {
				yyyy = ODN.calender.pubDate.substring(0,4);
				mm = ODN.calender.pubDate.substring(4,6);
				this.render(yyyy, mm);
			}
			var calender = $(this.id);
			ODN.utils.fixIESelect(calender.css('display') === 'none');
			calender.toggle();
		},
		show: function(yyyy, mm) {
			this.render(yyyy,mm);
			$(this.id).show();
			ODN.utils.fixIESelect(true);
		},
		render: function(yyyy, mm) {
			if (!this.loaded) {
				$(this.id).html('<div class="clear"><a href="#" class="close" title="關閉"></a></div><div class="header clear"><a href="#" class="prev"></a><a href="#" class="next"></a><span></span></div><div class="calender-table"></div>');
				$(this.id+' a.close').click(function() { ODN.calender.min.hide(); return false;});
				$(this.id+' a.prev').click(function() { ODN.calender.min.prev(); return false;});
				$(this.id+' a.next').click(function() { ODN.calender.min.next(); return false;});
				this.loaded = true;
			}
			this.curYear = parseInt(yyyy, 10);
			this.curMonth = parseInt(mm, 10);
			$(this.id + ' .header span').html(this.curYear+'年'+ODN.calender.digitPad(this.curMonth)+'月');
			$(this.id + ' .calender-table').html(this.renderTable(this.curYear,this.curMonth));
			
			if (this.curYear == ODN.calender.maxYear && this.curMonth >= parseInt(ODN.pubDate.substring(4,6), 10)) {
				$(this.id+' a.next').addClass('nextDisable');
				$(this.id+' a.next').attr('title', '');
			} else {
				$(this.id+' a.next').removeClass('nextDisable');
				$(this.id+' a.next').attr('title', '下月');
			}
			if (this.curYear == ODN.calender.minYear && this.curMonth == ODN.calender.minMonth) {
				$(this.id+' a.prev').addClass('prevDisable');
				$(this.id+' a.prev').attr('title', '');
			} else {
				$(this.id+' a.prev').removeClass('prevDisable');
				$(this.id+' a.prev').attr('title', '上月');
			}

		},
		renderTable: function(yyyy, mm) {
			var dayList = ODN.calender.getDayList(yyyy, mm);
			var rows = Math.ceil(dayList.length/7);
			var html = ['<table class="calender"><tr><th class="hd">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>'];
			for(var i = 0;i < rows;i++) {
				html.push('<tr>');
				for(var j = 0; j < 7;j++) {
					var index = (i*7)+j;
					if (index < dayList.length && dayList[index] != -1) {
						
						var curDate = yyyy + onccLib.digitPad('0', mm, 2) + onccLib.digitPad('0', dayList[index], 2);
						var tdClass = '';
						if (curDate == ODN.pubDate) {
							tdClass = 't';
						}
						var isHkHd = ODN.calender.isHoliday(yyyy, mm, dayList[index]);
						if (j == 0 || isHkHd) {
							tdClass += ' hd';
						}
						if (tdClass != '') {
							tdClass = ' class="'+tdClass+'"';
						}
						html.push('<td'+tdClass+'>');
						html.push(this.addLink(yyyy,mm,dayList[index]));
						html.push('</td>');
					} else {
						html.push('<td></td>');
					}
				}
				html.push('</tr>');
				if (i < rows - 1) {
					html.push('<tr><td colspan="7"><div class="hr"><!--NULL--></div></td></tr>');
				}
			}
			html.push('</table>');
			return html.join('');
		},
		addLink: function(yyyy, mm, dd) {
			var d = yyyy + onccLib.digitPad('0',mm,2) + onccLib.digitPad('0',dd,2);
			if (d <= ODN.pubDate) {
				return '<a href="'+ODN.timelineSlider.getHref(d)+'">'+dd+'</a>';
			}
			return '<div>'+dd+'</div>';
		},
		hide: function() {
			$(this.id).hide();
			ODN.utils.fixIESelect(false);
		},
		prev: function() {
			if (this.curYear + ODN.calender.digitPad(this.curMonth) > ODN.calender.minYear + ODN.calender.digitPad(ODN.calender.minMonth)) {
				var mm = this.curMonth;
				if (mm > 1 && mm < 13) {
					mm--;
				} else if (mm < 2 && this.curYear > ODN.calender.minYear) {
					this.curYear--;
					mm = 12;
				}
				this.curMonth = mm;
				this.render(this.curYear, this.curMonth);
			}
			return false;
		},
		next: function() {
			if (this.curYear + ODN.calender.digitPad(this.curMonth) < ODN.calender.pubDate.substring(0,6)) {
				var mm = this.curMonth;
				if (mm > 0 && mm < 12) {
					mm++;
				} else if (mm > 11) {
					this.curYear++;
					mm = 1;
				}
				this.curMonth = mm;
				this.render(this.curYear, this.curMonth);
			}
			return false;
		}
	}
};
//e:calender

ODN.browserHistory = {
	id: '',
	toggleCksId: 'odn-browserHistory-tg',
	cksId: 'odn-browserHistory',
	maxSize: 10,
	data: [],
	sRow: '^',
	sDataSet: '|',
	testIdx: 0,
	init: function() {
		var cks = $.cookie(this.cksId);
		if (cks != null && cks != '') {
			var rows = cks.split(this.sRow);
			for (var i=0; i<((rows.length<this.maxSize)?rows.length:this.maxSize); i++) {
				var dataSet = rows[i].split(this.sDataSet);
				this.data.push(dataSet);
			}
		}
	},
	add: function(date, sect, sect_l3, prty, title) {
		if (title != '' && date != '' && sect != '' && sect_l3 != '' && prty!= '') {
			if (!this.isExists(date, sect, sect_l3, prty, title)) {
				if (this.data.length >= this.maxSize) {
					this.data.shift();
				}
				this.data.push([date, sect, sect_l3, prty, title]);
			}
		}
		this.save();
	},
	isExists: function(date, sect, sect_l3, prty, title) {
		for(var i = 0; i < this.data.length; i ++) {
			var recent = this.data[i];
			if (recent[0] == date && recent[1] == sect && recent[2] == sect_l3 && recent[3] == prty && recent[4] == title)
				return true;
		}
		return false;
	},
	save: function() {
		var cksStr = [];
		for(var i = 0; i < this.data.length; i++) {
			cksStr.push(this.data[i].join(this.sDataSet));
		}
		$.cookie(this.cksId, cksStr.join(this.sRow), {expires: 1, path:'/'});
	},
	bind: function(id) {
		this.id = id;
		this.init();
		var flag = $.cookie(this.toggleCksId);
		var isDisplay = (flag == '1' || flag == null) ? 'block' : 'none';
		var icon = (flag == '1' || flag == null) ? '' : 'expand';
		var html = '';
		for(var i = this.data.length-1; i > -1 ; i--) {
			var date = (this.data[i][0] == ODN.pubDate) ? '今日' : $.dateFormat(this.data[i][0], 'dd/mm');
			html += '<li><a href="'+ODN.getArticleHref(this.data[i][0], this.data[i][1], this.data[i][2], this.data[i][3]) +'">'+ this.decodeTitle(this.data[i][4]) + ' ('+date+')</a></li>';
		}
		$(id).html('<h2 class="'+icon+'" onclick="ODN.browserHistory.toggle(this)">我的瀏覽記錄</h2><div class="hrThin"></div><ul class="commonList" style="display:'+isDisplay+'">'+html+'<div class="right" style="margin-top:5px"><a href="#" onclick="ODN.browserHistory.clear();return false;" class="btnClear">清除記錄</a></div></ul>');
		this.saveCurrent();
	},
	saveCurrent: function() {
		var info = ODN.getHrefInfo();
		if (info.sect_L1_name != '' && info.pubdate != '' && info.sect_L3 != '' && info.priority != '') {
			var title = ODN.content.getTitle();
			if (title != '') {
				this.add(info.pubdate, info.sect_L1_name, info.sect_L3, info.priority, this.encodeTitle(title));
			}
		}
	},
	encodeTitle: function(str) {
		var rtnVal = str;
		var ansiArr = rtnVal.match(new RegExp('[A-Za-z]', 'g'));
		if (ansiArr !== null) {
			ansiArr = $.arrayUtils.unique(ansiArr);
			for(var i = 0; i < ansiArr.length; i++) {
				rtnVal = rtnVal.replace(new RegExp(ansiArr[i], 'g'), ansiArr[i]+'_');
			}
		}
		return rtnVal;
	},
	decodeTitle: function(str) {
		return str.replace(new RegExp('_', 'g'), '');
	},
	toggle: function(obj) {
		var h2 = $(obj);
		var contract = h2.hasClass('expand');
		var historyList = $(this.id + ' ul.commonList');
		if (contract) {
			h2.removeClass('expand');
			historyList.show();
		} else {
			h2.addClass('expand');
			historyList.hide();
		}
		$.cookie(this.toggleCksId, (contract ? '1' : '0'), {expires: 365, path:'/'});
	},
	clear: function() {
		this.data = [];
		this.save();
		$(this.id + ' ul.commonList li').remove();
	}
};
//e:browserHistory

ODN.pollInfo = {
	id: '#pollInfoCTN',
	xmlPath: '/xml/polling.xml',
	init: function(sect) {
		if (sect == 'china_world') sect = 'news';
		$.get(this.xmlPath, function(data) { ODN.pollInfo.bind(data, sect) });
	},
	bind: function(data, sect) {
		var targSect = (sect || '');
		var html = '';
		$(data).find('polling').each(function() {
			var s = $(this).find('sect_L1_name').text();
			var sectName = $(this).find('sect_L1_cname').text();
			var url = $(this).find('url').text();
			var title = $(this).find('title').text();
			var showTitle = title;
			var pathIdx = url.indexOf('/cgi-bin/');
			url = '/polling/index.html?url='+url.substring(pathIdx, url.length).replace('?', '+');
			var maxLen = 20;
			if (showTitle.length > maxLen) {
				showTitle = title.substring(0,maxLen)+'...';
			}
			if (targSect != '') {
				if (s == targSect) {
					html += '<div><a href="'+url+'" title="'+title+'">'+sectName+'：'+showTitle+'</a></div>';
				}
			} else {
				if (s == 'entertainment' || s == 'news' || s == 'finance' || s == 'lifestyle') {
					html += '<div><a href="'+url+'" title="'+title+'">'+sectName+'：'+showTitle+'</a></div>';
				}
			}
		});
		$(this.id).append(html);
	}
};

//e:pollInfo

ODN.ad = {
	write: function(pos, s, iframe) {
		//ad: no iframe in news section
		//if ((pos == 'super' && ODN.sect != 'main' && ODN.sect != 'news' &&  ODN.sect != 'entertainment') || (pos == 'super' && ODN.priority === '') || iframe===true) {
		
		/*if (pos == 'large1' && s == '00173') {
			$AD.attachFile('/css/v2/content-skin/sony.css');
			$AD('http://ad2.on.cc/html/sony/201005/sony_bravia_20100520_360x290.swf', 360, 290).flashVars({'clickTAG':'http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=28886'}).params({'wmode':'opaque'}).write();
			var sonyImpression = new Image();
			sonyImpression.src = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:28886';
			$(document).ready(function() {
				var ctnTop = $('#contentCTN-top');
				ctnTop.before('<div id="skin-sony-top"></div>');
				ctnTop.after('<div id="skin-sony-bottom"></div>');
			});
		} else*/
		
		/*if ( pos == 'super' &&  ( s == '00175' || s == '00183' || s == '00185' || s == '00189' || s == '00195' || s == '00331' || s == '00335' || s == '00400') ) {
			document.write('<iframe src="/ifm/news/super_test.html?t=' +  Math.floor((Math.random()*10000000)+1) + '&p='+pos+'&s='+s+'" frameborder="0" width="0" height="0" scrolling="no" id="superIframe2"></iframe>');
		}*/
		
		if (pos == 'super' && ODN.sect != 'main') {
			
			if (MASTERHEAD) {
				ODN.writeScript('/js/adv/masterhead_'+s+'.js');
			} else {
				var isM = ((ODN.sect_L3 == 'index' || ODN.sect_L3 == '') && ODN.sect != 'archive' && ODN.sect != 'sitemap') ? 'm_' : '';
				var iframeUrl = '/ifm/'+((ODN.sect != '') ? isM+ODN.sect : isM+'news')+'/super.html?p='+pos+'&s='+s+'&t='+new Date().getTime();
				
				
				document.write('<iframe src="#" frameborder="0" width="728" height="90" scrolling="no" id="superIframe" name="ODN_superIframe"></iframe>');
				
				window.frames["ODN_superIframe"].location = iframeUrl;
			}
			//ODN_superIframe'].location = iframeUrl;
			
			//$('#'+iframeId).attr('src', iframeUrl);
			//document.write('<iframe src="http://orientaldaily.on.cc/ifm/'+((ODN.sect != '') ? isM+ODN.sect : isM+'news')+'/super.html?p='+pos+'&s='+s+'" frameborder="0" width="728" height="90" scrolling="no" id="superIframe"></iframe>');
			
		} else {
			if (pos==='text1') pos = 'text';
			ODN.writeScript('/js/adv/'+pos+'_'+s+'.js');
			//ODN.writeScript('http://orientaldaily.on.cc/js/adv/'+pos+'_'+s+'.js');
		}
	}
}
ODN.utils = {
	selectCache: null,
	fixIESelect: function(flag) {
		if ($.browser.msie && (parseInt($.browser.version)<7)) {
			if (!this.selectCache) {
				this.selectCache = $('#articleListSELECT');
			}
			var attr = (flag === false) ? 'visible' : 'hidden';
			this.selectCache.css('visibility', attr);
		}
	}
};
ODN.toolTip = {
	toolTipId: 0,
	autoId: function() {
		return 'toolTip-'+this.toolTipId++;
	},
	currentId: '',
	toolTipSet:[],
	timerId: null,
	show: function(elem, params) {
		this.cancelAutoHide();
		this.hide();
		ODN.utils.fixIESelect(true);
		var ttId = this.autoId();
		this.toolTipSet.push([ttId, elem]);
		$('body').append('<div id="'+ttId+'" class="toolTipBox" onmouseover="ODN.toolTip.cancelAutoHide()" onmouseout="ODN.toolTip.autoHide()"><div class="upArrow"><!--NULL--></div><div class="content"></div><div class="downArrow"><!--NULL--></div></div>');
		
		var targ = $(elem);
		var tt = $('#'+ttId);
		var pos = targ.offset();
		var top = pos.top;
		var left = pos.left;
		var arrowLeft = 10;
		
		var content;
		if (params) {
			if (params['content']) {
				content = params['content'];
			}
		}
		
		tt.find('.content').html(content);
		if (targ.hasClass('ttUp')) {
			tt.find('div.upArrow').remove();
			top -= tt.height();
			
		} else {
			tt.find('div.downArrow').remove();
			top += targ.height();
		}
		var docWidth = $(document).width();
		if (left + tt.width() > docWidth) {
			left = docWidth-tt.width();
			var dist = pos.left - left;
			arrowLeft += dist;
			if (targ.width() < 27) {
				left += (Math.floor(targ.width()/2) + 19);
			}
		} else {
			if (targ.width() < 27) {
				left += (Math.floor(targ.width()/2) - 19);
			}
		}
		tt.find('.upArrow').css({'margin-left':arrowLeft+'px'});
		tt.find('.downArrow').css({'margin-left':arrowLeft+'px'});
		tt.css({width:tt.width(), 'top': top, 'left':left}).show();
		this.currentId = ttId;
		return ttId;
	},
	autoHide: function() {
		this.timerId = setTimeout(function() { ODN.toolTip.hide() }, 500);
	},
	cancelAutoHide: function() {
		clearTimeout(this.timerId);
	},
	hide: function(val) {
		ODN.utils.fixIESelect(false);
		if (typeof val === 'undefined') {
			if (this.currentId !== '') {
				$('#'+this.currentId).remove();
			}
		} else {
			for(var i = 0; i < this.toolTipSet.length;i++) {
				if (val == this.toolTipSet[i][1]) {
					$('#'+this.toolTipSet[i][0]).remove();
				}
			}
		}
	}
};

ODN.keyword = {
	getInfoPath: function(kid) {
		return '/js/keywords/info/'+kid.substr(kid.length-2, 2)+'/'+kid+'.js';
	}
};

ODN.story = {
	listBySection: function(sect) {
		var list = [];
		var sl = ODN.data.storySeriesList;
		if (sl) {
			for(var i = 0; i < sl.length; i++) {
				if (typeof sl[i].showIn !== 'undefined') {
					for (var j = 0; j < sl[i].showIn.length; j++) {
						if (sl[i].showIn[j] === sect) {
							list.push(sl[i]);
							break;
						}
					}
				}
			}
		}
		return list;
	},
	getIdByAId: function(aid) {
		if (ODN.data.rawArticleList) {
			var d = ODN.data.rawArticleList.article;
			for (var i = 0; i < d.length; i++) {
				if (d[i].aid === aid){
					if (typeof d[i].sid !== 'undefined') {
						return d[i].sid;
					}
				}
			}
		}
		return '';
	},
	getStoryPath: function(sid, date) {
		var path;
		if (date==='latest') {
			path = '/js/keywords/serialStory/'+sid+'_latestDays.js';
		} else {
			var monthStr = date.substring(0, 6);
			path = '/js/keywords/serialStory/'+monthStr+'/'+sid+'_'+monthStr+'.js';
		}
		return $.urlUtils.get(path, true);
	},
	getArticleList: function(sid, date, callback) {
		$.getScript(this.getStoryPath(sid, date), callback);
	},
	getStory: function(sid) {
		var sl = ODN.data.storySeriesList;
		for (var i = 0; i < sl.length; i++) {
			if (sid === sl[i].sid) return sl[i];
		}
		return null;
	}
};


//焦點事件
ODN.feature = {
	list: null,
	storyLoaded: 0,
	maxThumbShow: 3,
	maxStoryShow: 3,
	arcticleList: [],
	vInfoPaths: [],
	vInfoLoaded: 0,
	num_of_adv: 3,
	init: function() {
		this.list = ODN.story.listBySection(ODN.sect);
		for (var i = 0; i < this.list.length; i++) {
			ODN.story.getArticleList(this.list[i].sid, 'latest', function() { ODN.feature.loadCallBack() });
		}
	},
	loadCallBack: function() {
		this.storyLoaded++;
		if (this.storyLoaded === this.list.length) {
			//setTimeout(function() { ODN.feature.initList(); }, 500);
			ODN.feature.initList();
		}
	},
	vInfoCallBack: function() {
		this.vInfoLoaded++;
		if (this.vInfoLoaded === this.vInfoPaths.length) {
			this.bind();
		}
	},
	
	initList: function() {
		var maxShow = this.maxStoryShow;
		if (typeof $AD.feature !== 'undefined') {
			if ($AD.feature.data.length > 0 && ODN.sect==='main') {
				maxShow--;
			}
		}
		
		var len = ODN.feature.num_of_adv;
		if (ODN.sect != "main") {
			len = this.list.length;
		}
		
		for(var i = 0; i < len; i++) {
		//for(var i = 0; i < ODN.feature.num_of_adv; i++) {
		//for(var i = 0; i < this.list.length; i++) {
			var storyList = ODN.data.storySeries[this.list[i].sid]['latest'].storyList;
			if (storyList.length > 0) {
				var latestStory = storyList[storyList.length-1];
				var alist = latestStory.articleList;
				if (alist.length > 0) {
					alist[0].sid = this.list[i].sid;
					alist[0].seq = this.list[i].seq;
					
					this.arcticleList.push(alist[0]);
					if (typeof alist[0].vid !== 'undefined') {
						this.vInfoPaths.push('/js/video/info/'+$.dateFormat(new Date(alist[0].createTime * 1000), 'yyyymmdd')+'/'+alist[0].vid+'.js')
					}
				}
			}
			if (this.arcticleList.length === maxShow) break;
		}
		
		if (this.vInfoPaths.length > 0) {
			for (var i =0;i<this.vInfoPaths.length;i++) {
				$.getScript(this.vInfoPaths[i], function() { ODN.feature.vInfoCallBack(); });
			}
		} else {
			this.bind();
		}
	},
	renderThumbBox: function(idx, name, thumb, url, tooltip) {
		var html = '';
		

		var imgHtml = '';
		if (url.indexOf('00651') !=-1) {
			imgHtml = '<div class="like">我要讚讚你</div>';	
		}
		
		html += '<div class="item '+ ((idx % 2 != 0) ? 'even' : 'odd') +'">';
		html+= imgHtml;
		if (tooltip) {
			//tooltip =(tooltip.indexOf('我要讚讚你：') == -1 ? tooltip : tooltip.replace('我要讚讚你：', '') );
			var tooltipStr = ' onmouseover="ODN.toolTip.show(this, {content:\''+tooltip+'\'})" onmouseout="ODN.toolTip.hide()"';
		}
		//if (url.indexOf('00651') !=-1) {
		//	html += '<a href="'+url+'" class="thumb ttUp"'+tooltipStr+'><img src="'+thumb+'"></a><ul class="commonBigList"><li><h3><a href="'+url+'">'+
		//				tooltip +
		//			'</a></h3></li></ul>';			
		//} else {			
			html += '<a href="'+url+'" class="thumb ttUp"'+tooltipStr+'><img src="'+thumb+'"></a><ul class="commonBigList"><li><h3><a href="'+url+'">'+
						name+
					'</a></h3></li></ul>';
		//}
		html += '</div>';
		return html;
	},
	bind: function() {
		
		var html = '<h2 title="焦點事件"><em>焦點事件</em></h2>';
		//var html = '';
		
		this.arcticleList.sort(function(a, b) {
			return a.seq - b.seq;
		});
		for (var i = 0; i < this.arcticleList.length; i++) {
			var a = this.arcticleList[i];
			var info = ODN.getAIDInfo(a.aid);
			var name = ODN.story.getStory(a.sid).name;
			var sect = a.section;
			var url = ODN.getArticleHref(info.pubdate, sect, info.sect_L3, info.priority);
			
				if (typeof $AD.feature !== 'undefined') {
					if (i == 0 && $AD.feature.data.length > 0 && ODN.sect==='main') {
						var ad = $AD.feature.data[0];
						html += this.renderThumbBox(i+1, ad.name, ad.photo, ad.url, '<div style=padding:5px>'+ad.title + ' ('+$.dateFormat(ODN.pubDate, 'dd/mm')+')</div>');
						var impress = new Image();
						impress.src = ad.impression;
					}
				}
			
			// else {
			
				if (typeof a.thumbnail !== 'undefined' || typeof a.vid !== 'undefined') {
					var thumbPath;
					
					
					/*
					if (typeof a.vid !== 'undefined') {
						thumbPath = '/ontv/'+info.pubdate+'/'+ODN.data.videoInfo[a.createTime].fileName;
					} else {
						thumbPath = '/cnt/'+sect+'/'+info.pubdate+'/photo/'+a.thumbnail;
					}
					*/
					
					
						
					if (typeof a.vid !== 'undefined' && info.pubdate && ODN.data.videoInfo[a.createTime].fileName){
						thumbPath = '/ontv/'+info.pubdate+'/'+ODN.data.videoInfo[a.createTime].fileName;
					} else if ( sect && info.pubdate &&  a.thumbnail) {
						thumbPath = '/cnt/'+sect+'/'+info.pubdate+'/photo/'+a.thumbnail;	
					}
					
					
					var toolTip = '<div style=padding:5px>'+a.title + ' ('+$.dateFormat(info.pubdate, 'dd/mm')+')</div>';
				
					if  ( a.title.indexOf('我要讚讚你') == -1) {
					
						html += this.renderThumbBox(i, name, thumbPath, url, toolTip);
					} else {
						var titleName = (a.title.indexOf('我要讚讚你：') == -1 ? a.title : a.title.replace('我要讚讚你：', '') );
						html += this.renderThumbBox(i, titleName, thumbPath, url, toolTip);	
					}
				} else {
					html += '<div href="'+url+'" class="item title">';
					html += '<ul class="commonBigList"><li><h3><a href="'+url+'">'+name+'</a></h3></li><li class="noBullet"><a href="'+url+'">'+a.title+'</a></li></ul>';
					html += '</div>';
				}
				
				var today = todaydate.substring(0, 8);
					/*if ( i == 0  && ODN.sect == "main" ) {				
						//if ( (parseInt(today) >= parseInt('20121231')) && (parseInt(today) <= parseInt('20130106')) || (window.location.href.indexOf("milk201212") != -1) ) {
							html = this.renderThumbBox(i, "最純正新鮮的鮮奶",  "http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:50868", "http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=50868", "<div style=padding:5px>最純正新鮮的鮮奶</div>");
							html += '<h2 title="焦點事件"><em>焦點事件</em></h2>';
						//}
						
						
					}*/
			
			//}
		}

		
		if ( ODN.feature.num_of_adv == 1 && ODN.sect == "main") {
			/*
			//$('#featureCTN').html('<div style="padding-bottom: 15px;"  class="ad_hangseng">' + 
			$('#featureCTN').html('<div class="ad_hangseng">' + 
							//'<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40735">'+
							//'<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40527">'+
							'<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41305">'+
							//'<img src="http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:40527" /></a>'+
							'<img src="http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:41305" /></a>'+
							'<ul class="commonBigList" >'+
							'<li><h3 style="font-weight: bold;">' + 
							'<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41305" target="_blank">全天候銀行服務<br>更多的創作空間</a></h3></li></ul>'+								
							//'<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40527" target="_blank">全天候銀行服務<br>更多的創作空間</a></h3></li></ul>'+								
							//'<a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40735" target="_blank">掌握投資先機<br>爭取最佳回報</a></h3></li></ul>'+								
							'</div>' + html).show();
			*//*
			var impImage = new Image();
			var todayWithTime = todaydate.substring(0, 12);
			
			// for Macau ad 
			if ( (parseInt(todayWithTime) >= parseInt('201109260000')) && (parseInt(todayWithTime) <= parseInt('201109282359')) ) {
				impImage.src = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:40773';		
				$('#featureCTN').append('<div style="width:200px;" class="ad_macau"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40773" target="_blank"><img src="img/ad/british_airways/ba_photo_highlight.jpg" /></a><ul class="commonBigList" ><li><h3 style="font-weight: bold;"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40773" target="_blank">英國航空：中小企最佳商務旅遊夥伴</a></h3></li></ul></div>');				
			} else if ((parseInt(todayWithTime) >= parseInt('201109290000')) && (parseInt(todayWithTime) <= parseInt('201110021759'))) {
				impImage.src = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:41703';
				$('#featureCTN').append('<div style="width:200px;" class="ad_macau"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank"><img src="img/ad/mgto/mgto_odn_photoHighlight_3rdphase.jpg" /></a><ul class="commonBigList" ><li><h3 style="font-weight: bold;"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank">第五十八屆澳門格蘭披治大賽車</a></h3></li></ul></div>');
				
			} else {
				impImage.src = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:41703';
				$('#featureCTN').append('<div style="width:200px;" class="ad_macau"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank"><img src="img/ad/mgto/mgto_odn_photoHighlight_3rdphase.jpg" /></a><ul class="commonBigList" ><li><h3 style="font-weight: bold;"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank">第五十八屆澳門格蘭披治大賽車</a></h3></li></ul></div>');
			}
*/
		} else if (ODN.sect == "main") {
			
			$('#featureCTN').html(html).show();
	/*
			var impImage = new Image();
			var todayWithTime = todaydate.substring(0, 12);
			
			if ( (parseInt(todayWithTime) >= parseInt('201109260000')) && (parseInt(todayWithTime) <= parseInt('201109282359')) ) {
				impImage.src = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:40773';		
				$('#featureCTN').append('<div style="width:200px;" class="ad_macau"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40773" target="_blank"><img src="img/ad/british_airways/ba_photo_highlight.jpg" /></a><ul class="commonBigList" ><li><h3 style="font-weight: bold;"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=40773" target="_blank">英國航空：中小企最佳商務旅遊夥伴</a></h3></li></ul></div>');				
			} else if ((parseInt(todayWithTime) >= parseInt('201109290000')) && (parseInt(todayWithTime) <= parseInt('201110021759'))) {
				impImage.src = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:41703';
				$('#featureCTN').append('<div style="width:200px;" class="ad_macau"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank"><img src="img/ad/mgto/mgto_odn_photoHighlight_3rdphase.jpg" /></a><ul class="commonBigList" ><li><h3 style="font-weight: bold;"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank">第五十八屆澳門格蘭披治大賽車</a></h3></li></ul></div>');
			} else {
				impImage.src = 'http://ad1.on.cc/phpAdsNew/adview.php?what=bannerid:41703';
				$('#featureCTN').append('<div style="width:200px;" class="ad_macau"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank"><img src="img/ad/mgto/mgto_odn_photoHighlight_3rdphase.jpg" /></a><ul class="commonBigList" ><li><h3 style="font-weight: bold;"><a href="http://ad1.on.cc/phpAdsNew/adclick.php?bannerid=41703" target="_blank">第五十八屆澳門格蘭披治大賽車</a></h3></li></ul></div>');
			}
				*/
		} else {
			$('#featureCTN').html(html).show();		
		}
		
		if  (adsH != undefined) {
			if ( adsH == 'hframe' ) {
				
				// for shell banner 20130409
				$('#m18_quote_box').hide();
				
				$('#pty_mini_search_frm4').hide();
				$('#adv_yahoo_keyword_box').hide();
				$('#miscContentCTN').hide();
				$('#ysmIframe').hide();
				$('#pty_mini_search_frm').hide();
				
				$('.ad_hangseng').addClass("item");
				$('.ad_macau').addClass("item");
				$('.ad_hangseng').css('padding-top', '29px');
				$('.ad_macau').css('padding-top', '29px');
	
				$('#featureCTN').css('height','220px');
				$('#featureCTN').css('width','690px');
				 
				$('#featureCTN h2').css('display','none');
				$('#featureCTN h2').css('height','220px');
				
				$('.odd').css('padding-top','29px');
				
				
				$('#featureCTN').css('background-color','#eeeeee');
				$('#featureCTN').css('padding-top','0px');
				
				$('#featureCTN h2').after('<div style="float: left; padding-left: 10px; padding-top: 41px;"><img src="../../img/v2/title_feature_v.png"></div>');
				
				//$('#headlineCTN').css('padding-bottom','15px');
				$('.even').css('padding-top','0px');
				$('#featureCTN .item').css('padding-left', '12px');

			}
		}
	}
};

ODN.timelineSlider = {
	id: '#timelineSlider',
	startDate: null,
	endDate: null,
	oneDayTime: 86400000,
	slider: null,
	loadPrevItem: true,
	loadNextItem: true,
	init: function() {
		this.slider = $(this.id);
		this.slider.html('<div class="calenderCTN"><div id="calender-min"></div></div><a href="/archive/index.html" class="prevEnd" onclick="ODN.calender.min.toggle();return false;">昔日</a><div class="prevButton"></div><a href="#" class="nextEnd"></a><div class="nextButton"></div><ul class="bar"></ul>');
		var lastButton = this.slider.find('.nextEnd');
		lastButton.attr('href', ((ODN.arcDate === ODN.pubDate) ? '#' : this.getHref(ODN.pubDate)));
		if (ODN.arcDate === ODN.pubDate) {
			lastButton.addClass('nextEnd-disable');
		}
		lastButton.text((ODN.arcDate === ODN.pubDate) ? '今日' : '返回今日');
		this.slider.find('.bar').append(this.renderDateList(this.dateList()));
		var opts = {'maxVisible':6, 'moveIdx':6};
		opts.prevHandle = function() {
			ODN.timelineSlider.prevHandle();
		};
		opts.nextHandle = function() {
			ODN.timelineSlider.nextHandle();
		};
		opts.onFirstItemAppear = function() {
			ODN.timelineSlider.onFirstItemAppear();
		};
		opts.onLastItemAppear = function() {
			ODN.timelineSlider.onLastItemAppear();
		};
		opts.onFirstItemDisappear = function() {
			ODN.timelineSlider.onFirstItemDisappear();
		};
		opts.onLastItemDisappear = function() {
			ODN.timelineSlider.onLastItemDisappear();
		};
		this.slider.show().rollSlider(opts);
		//this.prependDateList(this.beforeDateList());
		//this.appendDateList(this.afterDateList());
		
	},
	prevHandle: function() {
		if (this.loadPrevItem) {
			this.prependDateList(this.beforeDateList());
			this.loadPrevItem = false;
		}
		this.slider.rollSlider('prev');
	},
	nextHandle: function() {
		if (this.loadNextItem) {
			this.appendDateList(this.afterDateList());
			this.loadNextItem = false;
		}
		this.slider.rollSlider('next');
	},
	onFirstItemAppear: function() {
		this.loadPrevItem = true;
	},
	onLastItemAppear: function() {
		this.loadNextItem = true;
		this.slider.find('.nextButton').addClass('nextButton-disable');
	},
	onFirstItemDisappear: function() {
	},
	onLastItemDisappear: function() {
		this.slider.find('.nextButton').removeClass('nextButton-disable');
	},
	dateList: function() {
		var list = [];
		var aDate = $.strToDate(ODN.arcDate);
		var pDate = $.strToDate(ODN.pubDate);
		var within7Days = (aDate.getTime() >= pDate.getTime()-(this.oneDayTime*6));
		if (within7Days) {
			for (var i = 6; i >= 1; i--) {
				list.push(new Date(pDate.getTime()-(this.oneDayTime*i)));
			}
			this.slider.find('.nextButton').addClass('nextButton-disable');
		} else {
			list.push(new Date(aDate.getTime()-(this.oneDayTime*3)));
			list.push(new Date(aDate.getTime()-(this.oneDayTime*2)));
			list.push(new Date(aDate.getTime()-(this.oneDayTime*1)));
			list.push(new Date(aDate.getTime()));
			list.push(new Date(aDate.getTime()+(this.oneDayTime*1)));
			list.push(new Date(aDate.getTime()+(this.oneDayTime*2)));
		}
		this.startDate = list[0];
		this.endDate = list[list.length-1];
		return list;
	},
	beforeDateList: function() {
		var list = [];
		for (var i = 1; i <= 6; i++) {
			list.push(new Date(this.startDate.getTime()-(this.oneDayTime*i)));
		}
		this.startDate = list[list.length-1];
		return list;
	},
	afterDateList: function() {
		
		var list = [];
		var pDate = $.strToDate(ODN.pubDate);
		var maxDays = 6;
		var remainDays = ((pDate.getTime()-this.oneDayTime) - this.endDate.getTime())/this.oneDayTime;
		if (remainDays > 0) {
			if (remainDays < maxDays) maxDays = remainDays;
			
			for (var i = 1; i <= maxDays; i++) {
				list.push(new Date(this.endDate.getTime()+(this.oneDayTime*i)));
			}
			if (list.length > 0) {
				this.endDate = list[list.length-1];
			}
		}
		return list;
	},
	getHref: function(date) {
		var href = ODN.href.replace('index.html', '');
		var dateStr = $.dateFormat(date, 'yyyymmdd');
		if (dateStr >= ODN.startDate) {
			if(/\/\d{8}\//.test(href)) {
				href = href.replace(/\/\d{8}\//, '/'+dateStr+'/');
			} else if (/^http:.+[\.]\w{2,3}\/$/.test(href)) {
				href += 'cnt/main/'+dateStr+'/';
			} else {
				href += dateStr+'/';
			}
			href += 'index.html';
		} else {
			href = ODN.getSectHref('main', dateStr);
		}
		return href;
	},
	renderDateList: function(dateList) {
		var html = '';
		for (var i = 0; i < dateList.length; i++) {
			var ptDate = dateList[i];
			var aDate = $.strToDate(ODN.arcDate);
			var todayClass = (aDate.getTime() == ptDate.getTime()) ? ' class="today"':'';
			html += '<li class="item"><a href="'+this.getHref(ptDate)+'"'+todayClass+'><span class="date">'+$.dateFormat(ptDate, 'dd/mm')+'</span></a></li>';
		}
		return html;
	},
	appendDateList: function(dateList) {
		for (var i = 0; i < dateList.length; i++) {
			var ptDate = dateList[i];
			this.slider.rollSlider('appendItem', '<a href="'+this.getHref(ptDate)+'"><span class="date">'+$.dateFormat(ptDate, 'dd/mm')+'</span></a>');
		}
	},
	prependDateList: function(dateList) {
		for (var i = 0; i < dateList.length; i++) {
			var ptDate = dateList[i];
			this.slider.rollSlider('prependItem', '<a href="'+this.getHref(ptDate)+'"><span class="date">'+$.dateFormat(ptDate, 'dd/mm')+'</span></a>');
		}
	}
};

ODN.articleList = function(id, ds, grps) {
	if (id) {
		this.prevBtn = null;
		this.nextBtn = null;
		this.targ = $(id);
		this.id = id;
		this.dataSet = (ds || ODN.data.articleList[ODN.sect]);
		this.groups = (grps || ODN.listGroup[ODN.sect]);
		this.isSelect = (this.targ.attr('tagName') == 'SELECT');
		if (typeof this.dataSet != 'undefined' || this.isSelect == false) {
			this.bind();
		}
	}
};
ODN.articleList.prototype.bind = function() {
	var html = [];
	var rows = 0;
	if (this.isSelect) {
		
		if (ODN.sect == 'main') {
			html.push('<option value="#">請選擇&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要聞港聞</option>');
			html.push('<option value="#">'+onccLib.digitPad('-', '', 65)+'</option>');
		}
		
		if (ODN.sect == 'china_world') {
			//exchange order by main article
			var mainSect = '00179';
			for(var i = 0; i < this.dataSet.length;i++) {
				if (this.dataSet[i].is_main_article == 'true') {
					mainSect = this.dataSet[i].sect_L2;
					break;
				}
			}
			if (mainSect != '00179') {
				var grp1 = ODN.listGroup['china_world'][1];
				var grp2 = ODN.listGroup['china_world'][2];
				var grp3 = ODN.listGroup['china_world'][3];
				var grp4 = ODN.listGroup['china_world'][4];
				ODN.listGroup['china_world'][1] = grp3;
				ODN.listGroup['china_world'][2] = grp4;
				ODN.listGroup['china_world'][3] = grp1;
				ODN.listGroup['china_world'][4] = grp2;
			}
			
		}
	
		
		for(var i = 0; i <this.groups.length;i++) {
			var grpHTML = this.genByGroup(this.groups[i]);
			if (grpHTML.length != 0) {
				
				if (typeof $AD.dropDown.dataRow[ODN.sect] != 'undefined' && (ODN.arcDate == ODN.pubDate)) {
					var adRow =  $AD.dropDown.dataRow[ODN.sect];
					for (var j = 0; j < adRow.length; j++) {
						if (adRow[j].row <= (rows + grpHTML.length)) {
							var exURL = adRow[j].url.split('&redirect=')[1];
							var selectedStr = (ODN.href.indexOf(exURL) != -1) ? ' selected' : '';
							var tempOpt = '<option value="'+adRow[j].url+'" style="color:'+adRow[j].txtColor+';background-color:'+adRow[j].bgColor+'"'+selectedStr+'>'+adRow[j].title+'</option>';
							grpHTML.splice((adRow[j].row - rows)-1, 0, tempOpt);
							adRow.splice(j,1);
						}
					}
				}
				html.push('<optgroup label="'+this.groups[i].n+'">');
				html.push(grpHTML.join(''));
				html.push('</optgroup>');
				rows += grpHTML.length;
				
			}
			if (i == 0 && typeof $AD.dropDown.data[ODN.sect] != 'undefined' && (ODN.arcDate == ODN.pubDate)) {
				var ad = $AD.dropDown.data[ODN.sect];

				html.push('<optgroup label="客戶資訊">');
			
				for (var j = 0; j < ad.length; j++) {
					var exURL = ad[j].url.split('&redirect=')[1];
					var selectedStr = (ODN.href.indexOf(exURL) != -1) ? ' selected' : '';
					html.push('<option value="'+ad[j].url+'" style="color:'+ad[j].txtColor+';background-color:'+ad[j].bgColor+'"'+selectedStr+'>'+ad[j].title+'</option>');
				}
				html.push('</optgroup>');
			}
		}
	} else {
		if (ODN.arcDate == ODN.pubDate) {
			if (typeof $AD.dropDown.dataRow[ODN.sect] != 'undefined') {
				var adRow = $AD.dropDown.dataRow[ODN.sect];
				for (var j = 0; j < adRow.length; j++) {
					var urls = ad[j].url.split('|');
					var isBlank = (urls.length > 1) ? ' target="_blank"' : '';
					$(this.id + ' li:eq('+(adRow[j].row-1)+')').before('<li><a href="'+urls[0]+'" style="background-color:'+adRow[j].bgColor+';color:'+adRow[j].txtColor+'"'+isBlank+'>'+adRow[j].title+'</a></li>');
				}
			}
			if (typeof $AD.dropDown.data[ODN.sect] != 'undefined') {
				var ulList = $(this.id + ' ul:first');
				if (ulList.length > 0) {
						var ad = $AD.dropDown.data[ODN.sect];
						var adHtml = [];
						
								
						adHtml.push('<h2>客戶資訊</h2><ul class="commonBigList">');
					
						for (var j = 0; j < ad.length; j++) {
							var urls = ad[j].url.split('|');
							var isBlank = (urls.length > 1) ? ' target="_blank"' : '';
							adHtml.push('<li><a href="'+urls[0]+'" style="background-color:'+ad[j].bgColor+';color:'+ad[j].txtColor+'"'+isBlank+'>'+ad[j].title+'</a></li>');
						}
						adHtml.push('</ul>');
						ulList.after(adHtml.join(''));
				}
			}
		}
	}
	var extraItem = '';
	var mySect = ODN.sect;
	var tsnSect = TSN.convertSect(mySect);
	var tsnName = '更多太陽報';
	if (typeof TSN.sectName[mySect] != 'undefined') {
		if (this.isSelect) {
			extraItem = '<option value="#">'+onccLib.digitPad('-', '', 40)+'</option><option value="'+TSN.domain+TSN.getSectHref(tsnSect)+'">'+tsnName+TSN.sectName[mySect]+'</option>';
			if (mySect == 'finance') {
				extraItem += '<option value="http://money18.on.cc">更多Money18投資資訊</option>';
			}
		} else {
			extraItem = '<div id="linkRefer">';
			extraItem += '<div><a href="'+TSN.domain+TSN.getSectHref(tsnSect)+'">'+tsnName+TSN.sectName[mySect]+'</a></div>';
			if (mySect == 'finance') {
				extraItem += '<div><a href="http://money18.on.cc">更多Money18投資資訊</a></div>';
			}
			extraItem += '</div>';
		}
	}
	html.push(extraItem);
	this.targ.append(html.join(''));
	if (this.isSelect) {
		
		this.targ.change(function() {
			var val = $(this).val();
			if (val != '#') {
				var urls = val.split('|');
				if (urls.length > 1) {
					if (urls[1] === 'blank') {
						window.open(urls[0], '_blank');
					}
				} else {
					window.location = val;
				}
			}
		});
		
	} else {
		this.targ.find('ul').each(
			function() {
				$(this).find('li').not('.photo').each(function(idx) {
					if (idx % 2 === 0) {
						$(this).addClass('odd');
					}
				 });
			}
		);
	}
};
ODN.articleList.prototype.genByGroup = function(grp) {
	var html = [];
	for(var i = 0; i < grp.L2.length;i++) {
		var is_main_article = (grp.L2[i] == 'is_main_article');
		for(var j = 0; j < this.dataSet.length;j++) {
			if (is_main_article) {
				if (this.dataSet[j].is_main_article == 'true') {
					html.push(this.genItem(this.dataSet[j]));
				}
			} else {
				if ((this.dataSet[j].sect_L2 == grp.L2[i] || this.dataSet[j].sect_L3 == grp.L2[i]) && this.dataSet[j].is_main_article != 'true') {
					html.push(this.genItem(this.dataSet[j]));
				}
			}
		}
	}

	return html;
};
ODN.articleList.prototype.genItem = function(data) {
	var html = '';
	var href = ODN.getArticleHref(data.pubdate, data.sect_L1_name, data.sect_L3, data.priority);
	if (this.isSelect) {
		var isSelected = (ODN.href.indexOf(href) != -1) ? ' selected' : '';
		if (ODN.orgSect == 'commentary' && data.sect_L3 == '00186' && data.priority == '001') {
			 isSelected = ' selected';
		}
		html= '<option value="'+href+'"'+isSelected+'>'+data.title+'</option>';
	} else {
		html= '<li><a href="'+href+'">'+data.title+'</a></li>';
	}
	return html;
};
//e:articleList

(function($){
	$.urlParams = {
		get: function(strParamName){
			return $.urlParams.extract(strParamName,window.location.href);
		},
		extract: function(strParamName,strHref){
			var strReturn = "";
			var bFound=false;

			var cmpstring = strParamName + "=";
			var cmplen = cmpstring.length;

			if ( strHref.indexOf("?") > -1 ){
			var strQueryString = strHref.substr(strHref.indexOf("?")+1);
			var aQueryString = strQueryString.split("&");
				for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
				  if (aQueryString[iParam].substr(0,cmplen)==cmpstring){
					var aParam = aQueryString[iParam].split("=");
					strReturn = decodeURIComponent(aParam[1]);//should decode url string
					bFound=true;
					break;
				  }
				}
			}
			if (bFound==false) return null;
			return strReturn;
		},
		set: function(url,parameterName,parameterValue){
			return url+"?"+encodeURIComponent(parameterName)+"="+encodeURIComponent(parameterValue);
		},
		append: function(url,parameterName,parameterValue){
			return url+"&"+encodeURIComponent(parameterName)+"="+encodeURIComponent(parameterValue);
		}
	}
})(jQuery);

(function($){
	$.arrayUtils = {
		unique: function(a) {
			var r = [];
			var l = a.length;
			for(var i=0; i<l; i++) {
			  for(var j=i+1; j<l; j++) {
				// If this[i] is found later in the array
				if (a[i] === a[j])
				  j = ++i;
			  }
			  r.push(a[i]);
			}
			return r;
		},
		contains: function(a, obj, func) {
			for(var i = 0; i < a.length; i++) {
				if (typeof func === 'function') {
					if (func(a[i], obj)) return true;
				} else {
					if (a[i]===obj) return true;
				}
			}
			return false;
		}
	}
})(jQuery);

/*rollSlider plugin*/
(function($) {
		  
	$.fn.rollSlider = function() {
		
			if (arguments.length > 0) {
				var $this = this;
				var opts, is;
				var typeofParams = typeof arguments[0];
				if (typeofParams === 'object') {
					opts = $.extend({}, $.fn.rollSlider.defaults, arguments[0]);
					var visibleDimension = (opts.style === 'horizontal') ? $this.find('.bar').width() : $this.find('.bar').height();
					var items = $this.find('.item');
					is = $.extend({}, $.fn.rollSlider.itemSetting, {});
					
					if (items.size() < opts.maxVisible) opts.maxVisible = items.size();
					is.dimension = (opts.style === 'horizontal') ? items.width() : items.height();
					is.margin = (visibleDimension - is.dimension*opts.maxVisible)/opts.maxVisible;
			
					is.suffixPrev  = (opts.style === 'horizontal')?'left':'top';
					is.suffixNext = (opts.style === 'horizontal')?'right':'bottom';
					
					var padding  = Math.floor(is.margin/2);
					is.delta = Math.floor(is.dimension+is.margin);
					is.prevPosLimit = padding;
					
					is.nextPosLimit = padding+((opts.maxVisible-1)*is.delta);
					//alert('is.prevPosLimit ,' + is.prevPosLimit + ', is.nextPosLimit : '+is.nextPosLimit + ', is.delta : ' + is.delta);
					
					
					items.each(function(idx) {
						$(this).css(is.suffixPrev, (idx===0) ? padding-(opts.initIdx*is.delta) : padding+(idx*is.delta)-(opts.initIdx*is.delta));
					});
			
					if (!opts.prevHandle) {
						opts.prevHandle = function(slider) { slider.rollSlider('prev'); };
					}
					
					if (!opts.nextHandle) {
						opts.nextHandle = function(slider) { slider.rollSlider('next'); };
					}
			
					$this.find('.prevButton').unbind('click.rollSlider').bind('click.rollSlider', function(e) { opts.prevHandle($this); });
					$this.find('.nextButton').unbind('click.rollSlider').bind('click.rollSlider', function(e) { opts.nextHandle($this); });
					$this.data('options', opts);
					$this.data('itemSetting', is);
				} else if (typeofParams === 'string') {
					opts = $this.data('options');
					is = $this.data('itemSetting');
					
					function itemMoveTo(idx) {
						if (!is.rolling) {
							var itms = $this.find('.item');
							if (idx < 0) {
								idx = 0;
							} else if (itms.length - idx < opts.maxVisible) {
								idx = itms.length - opts.maxVisible;
							}
							var itm = itms.eq(idx);
							var pos = parseInt(itm.css(is.suffixPrev),10);
							var dist = 0;
							
							if (pos !== is.prevPosLimit) {
								if (pos > is.prevPosLimit) {
									dist = -(pos - is.prevPosLimit);
								} else {
									dist = Math.abs(pos) + is.prevPosLimit;
								}
								is.rolling = true;
								itms.each(function(idx) {
									var itm = $(this);
									var curPos = parseInt(itm.css(is.suffixPrev),10);
									var targetPos  = curPos+dist;
									//itm.css(is.suffixPrev, curPos+dist);
									var aniProps = {};
									aniProps[is.suffixPrev] = targetPos;
									itm.animate(aniProps, 'normal', function(){
										if (opts.onRollingFinish !== null) opts.onRollingFinish($this);
										is.rolling = false;
										if (idx === 0) {
											if (targetPos === is.prevPosLimit) {
												if (opts.onFirstItemAppear !== null) {
													opts.onFirstItemAppear($this);
												}
											} else {
												if (opts.onFirstItemDisappear !== null) {
													opts.onFirstItemDisappear($this);
												}
											}
										} else if (idx === itms.size()-1) {
											if (targetPos === is.nextPosLimit) {
												if (opts.onLastItemAppear !== null) {
													opts.onLastItemAppear($this);
												}
											} else {
												if (opts.onLastItemDisappear !== null) {
													opts.onLastItemDisappear($this);
												}
											}
										}
									});
								});
							}
						}
					}
					/*
					function imgShift(direction) {
						
						if (!is.rolling) {
							var itms = $this.find('.item');
							var dist = opts.moveIdx*is.delta;
							var move = false;
							var pos;
							if (direction === 'prev') {
								var firstItem = $this.find('.item:first');
								pos = parseInt(firstItem.css(is.suffixPrev),10);
								if (pos + dist > is.prevPosLimit) {
									dist = Math.abs(pos) + is.prevPosLimit;
								}
								move = (pos !== is.prevPosLimit);
							} else {
								var lastItem = $this.find('.item:last');
								dist = dist*-1;
								pos = parseInt(lastItem.css(is.suffixPrev),10);
								
								if (pos + dist < is.nextPosLimit) {
									dist = (pos - is.nextPosLimit)*-1;
								}
								move = (pos !== is.nextPosLimit);
							}
							if (move) {
								if (opts.onRollingStart !== null) opts.onRollingStart($this);
								is.rolling = true;
								itms.each(function(idx) {
									var itm = $(this);
									var curPos = parseInt(itm.css(is.suffixPrev),10);
									var targetPos  = curPos+dist;
									//itm.css(is.suffixPrev, curPos+dist);
									var aniProps = {};
									aniProps[is.suffixPrev] = targetPos;
									itm.animate(aniProps, 'normal', function(){
										if (opts.onRollingFinish !== null) opts.onRollingFinish($this);
										is.rolling = false;
										if (idx === 0) {
											if (targetPos === is.prevPosLimit) {
												if (opts.onFirstItemAppear !== null) {
													opts.onFirstItemAppear($this);
												}
											} else {
												if (opts.onFirstItemDisappear !== null) {
													opts.onFirstItemDisappear($this);
												}
											}
										} else if (idx === itms.size()-1) {
											if (targetPos === is.nextPosLimit) {
												if (opts.onLastItemAppear !== null) {
													opts.onLastItemAppear($this);
												}
											} else {
												if (opts.onLastItemDisappear !== null) {
													opts.onLastItemDisappear($this);
												}
											}
										}
									});
								});
							}
						}
					}
					*/
					function getCurIdx() {
						var itms = $this.find('.item');
						for (var i = 0; i < itms.length; i++) {
							if (parseInt(itms.eq(i).css(is.suffixPrev), 10) === is.prevPosLimit) {
								return i;
							}
						}
						return 0;
					}
					
					switch(arguments[0]) {
						case 'next':
							itemMoveTo(getCurIdx()+opts.moveIdx);
							//imgShift('next');
							break;
						case 'prev':
							itemMoveTo(getCurIdx()-opts.moveIdx);
							//imgShift('prev');
							break;
						case 'move':
							itemMoveTo(arguments[1]);
							break;
						case 'appendItem':
							var lastItem = $this.find('.item:last');
							var pos = (lastItem.length === 0) ? 0 : parseInt(lastItem.css(is.suffixPrev),10) + is.delta;
							$this.find('.bar').append('<li class="item" style="'+is.suffixPrev+':'+pos+'px">'+arguments[1]+'</li>');
							break;
						case 'prependItem':
							var firstItem = $this.find('.item:first');
							var pos = (firstItem.length === 0) ? 0 : parseInt(firstItem.css(is.suffixPrev),10) - is.delta;
							$this.find('.bar').prepend('<li class="item" style="'+is.suffixPrev+':'+pos+'px">'+arguments[1]+'</li>');
							break;
					}
				}
			}
			return this;
	};
	
	$.fn.rollSlider.itemSetting = {
		container: null,
		dimension: 0,
		margin: 0,
		suffixPrev: 'left',
		suffixNext: 'right',
		rolling: false,
		delta: 0,
		prevPosLimit: 0,
		nextPosLimit: 0
	};
	
	$.fn.rollSlider.defaults = {
		maxVisible: 1,
		style: 'horizontal',//vertical, horizontal
		initIdx: 0,
		moveIdx: 1,
		nextHandle: null,
		prevHandle: null,
		onFirstItemAppear: null,
		onLastItemAppear: null,
		onFirstItemDisappear: null,
		onLastItemDisappear: null,
		onRollingStart: null,
		onRollingFinish: null
	};
})(jQuery);





////// PTY  ************************************************
$strToDate = function(str) {
	if (str.length >= 8) {
		var yyyy = str.substring(0,4);
		var mm = parseInt(str.substring(4,6), 10) - 1;
		var dd = str.substring(6,8);
		var HH = (str.length >= 10) ? str.substring(8,10) : 0;
		var MM = (str.length >= 12) ? str.substring(10,12) : 0;
		var ss = (str.length >= 14) ? str.substring(12,14) : 0;
		return new Date(yyyy, mm, dd, HH, MM, ss);
	}
	return new Date();
};

/// query string
var $QueryString = function(url) {
	this.url = (url || window.location.href);
	this.params = this.getParams(this.url);
};
$QueryString.prototype.get = function(key) {
	if (typeof this.params[key] !== 'undefined') return this.params[key];
	return null;
};
$QueryString.prototype.set = function(params) {
	for (var key in params) {
		this.params[key] = params[key];
	}
};
$QueryString.prototype.toString = function() {
	var temp = this.url.split('?');
	var urlParams = [];
	var cnt = 0;
	for (var key in this.params) {
		if (cnt !== 0) urlParams.push('&');
		urlParams.push(key+'='+encodeURIComponent(this.params[key]));
		cnt++;
	}
	return temp[0] + ((urlParams.length > 0) ? '?'+urlParams.join('') : '');
};
$QueryString.prototype.getParams = function(url) {
	var o = {};
	var temp = url.split('?');
	if (temp.length > 1) {
		var qs = temp[1].split('&');
		var l = qs.length;
		while(l--) {
			var valSet = qs[l].split('=');
			if (valSet.length > 1) {
				o[valSet[0]] = decodeURIComponent(valSet[1]);
			}
		}
	}
	return o;
};
//#$QueryString

PTY = {
	cgiRoot: '/cgi-bin/',
	brkRoot: '/brknews/cnt/',
	atlRoot: '/articles/cnt/',
	svrDRoot: '/prop/cnt/',
	trnsctnRoot: '/transaction/cnt/',
	photoRoot: '/prop/cnt/',
	calcPath: '/Marketing/Oncc/Mortgage.aspx',
	ckIdLstKey: 'IDLIST',
	ckDtLstKey: 'DTLIST',
	print: function() {
		window.print();
	},
	qs: new $QueryString(),
	writeScript: function(url) {
		document.write(unescape("%3Cscript src='"+url+"' type='text/javascript'%3E%3C/script%3E"));
	},
	loadScript: function(url, callback, cbparams) {
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		var done = false;
		script.src = url;
		script.charset = 'utf-8';
		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function() {
			if (!done && (!this.readyState||this.readyState =="loaded"||this.readyState == "complete")) {
				done = true;
				callback(cbparams);
				// Handle memory leak in IE
				script.onload=script.onreadystatechange=null;
				head.removeChild(script);
			}
		};
		head.appendChild(script);
	},
	getTTLink: function(baseurl, params){
		var url = new $QueryString(baseurl);
		url.set(params);
		return url.toString();
	},
	getTimeStamp: function(daily) {
		var today = new Date();
		if (daily) return today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString();
		var tString =  today.getTime().toString();
		return tString.substring(0,tString.length-3)+'9'+tString.substring(tString.length-2,tString.length);
	},
	printDate: function(dateStr, format) {
		document.write($.dateFormat(dateStr, format));
	}
};

PTY.date = {
	server: null,
	client: null,
	adjust: 0,
	init: function() {
		this.server = (typeof todaydate === 'string') ? $strToDate(todaydate) : new Date(),
		this.client = new Date();
		this.adjust = this.server.getTime() - this.client.getTime();
	},
	now: function() {
		return new Date(new Date().getTime() + this.adjust);
	}
};
PTY.date.init();

PTY.config = {
	isNew: function(day) {return day<2}
};

PTY.cmnPrms = {
	cfg: {
		numrec:20,
		sorted:1,
		order:1,
		date:180
	},
	usr: {
		whichpage:null,
		district:null,
		district_id:null,
		estate:null,
		propertytype :null
	},
	range: {
		minprice:null,
		maxprice:null,
		minsize:null,
		maxsize:null,
		minroom:null,
		maxroom:null,
		ownerlisting:null
	},
	get: function(cfg, usr, range, custom) {
		var retVal = {};
		if (typeof PTY.qs === 'undefined') {
			PTY.qs = new $QueryString();
		}
		for (var key in cfg) {
			var val = PTY.qs.get(key);
			retVal[key] = (val)?val:cfg[key];
		}
		for (var key in usr) {
			var val = PTY.qs.get(key);
			if (val) {
				retVal[key] = val;
			}
		}
		for (var key in range) {
			var val = PTY.qs.get(key);
			if (val) {
				retVal[key] = val;
			}
		}
		if (custom) {
			for (var key in custom) {
				retVal[key] = custom[key];
			}
		}
		if (typeof retVal.district_id !== 'undefined') {
			delete retVal.district;
		}
		return retVal;
	}
}

PTY.srchPrms = {
	cfg: $.extend({}, PTY.cmnPrms.cfg, {type:1}),
	usr: $.extend({}, PTY.cmnPrms.usr),
	range: $.extend({}, PTY.cmnPrms.range),
	get: function(custom) {return PTY.cmnPrms.get(this.cfg, this.usr, this.range, $.extend((custom)?custom:{},{type:1}))}
};

PTY.dtlPrms = {
	cfg: $.extend({}, PTY.cmnPrms.cfg, {type:2, otherpro:'Y', otherpronum:50, relatedpro:'Y', relatedpronum:25}),
	usr: $.extend({}, PTY.cmnPrms.usr, {List_ID:null, currentrec:null}),
	range: $.extend({}, PTY.cmnPrms.range),
	get: function(custom){return PTY.cmnPrms.get(this.cfg, this.usr, this.range, $.extend((custom)?custom:{}, {type:2}))}
};


PTY.searchType = function() {
	var sell = null;
	var rent = null;
	var hasValue = false;
	
	if (arguments.length>=2) {
		hasValue = true;
		sell = arguments[0];
		rent = arguments[1];
	}
	if (typeof PTY.qs === 'undefined') {
		PTY.qs = new $QueryString();
	}
	var pType = (function(){
		if (PTY.qs.get('propertytype')) {
			return PTY.qs.get('propertytype');
		}
		if (typeof PTY.searchPageType!=='undefined') {
			return PTY.searchPageType
		}
		return null;
	})();
	if (pType){
		switch (pType) {
			case '1':
				return $.extend({ttxt:'出售', ptxt:'售價', stxt:'售價', cssClass:'sell'}, (hasValue)?{val:(sell)?('$'+sell.toChiUnit(1)):'-'}:{});
				break;
			case '2':
				return $.extend({ttxt:'出租', ptxt:'租價', stxt:'租價', cssClass:'rent'}, (hasValue)?{val:(rent)?('$'+rent.toCommasString(1)):'-'}:{});
				break;
			case '3':
				if (hasValue) {
					if (sell) {
						return $.extend({ttxt:'出售/租', ptxt:'售價', stxt:'售/租價', cssClass:'sell'}, {val:('$'+sell.toChiUnit(1))});
					} else if (rent) {
						return $.extend({ttxt:'出售/租', ptxt:'租價', stxt:'售/租價', cssClass:'sell'}, {val:('$'+rent.toCommasString(1))});
					} else {
						return $.extend({ttxt:'出售/租', ptxt:'售價', stxt:'售/租價', cssClass:'sell'}, {val:'-'});
					}
				} else {
					return {ttxt:'出售/租', ptxt:'售價', stxt:'售/租價', cssClass:'sell'};
				}
				break;
			default:break;
		}
	}
	
	return null;
};

PTY.area = {
	data:{raw:null, htmlStr:null, hk:null, kln:null, nt: null, is: null},
	extCB:null,
	init: function(extCB) {
		this.extCB = extCB;
		$.ajax({
			dataType:'script',
			scriptCharset:'utf-8',
			url: 'http://property.on.cc/js/property_arealst_order.js',
			//url: 'http://property.on.cc' + PTY.svrDRoot+'js/property_arealst.js?t='+PTY.getTimeStamp(),
			success:this.cb
		});
	},
	cb: function() {
		if (typeof area_hk!=='undefined' && typeof area_kln!=='undefined' && typeof area_nt!=='undefined' && typeof area_is!=='undefined') {
			with (PTY.area) {
				data.raw = {hk:area_hk, kln:area_kln, nt:area_nt, is:area_is};
				var opts = [];
				var hk_arr = [];
				var kln_arr = [];
				var nt_arr = [];
				var is_arr = [];											
				opts.push('<option value="-1" selected>任何</option>');
				
				for (var key in data.raw) {
					var d = data.raw[key];
					if (d.Member.length>0) {
						opts.push('<optgroup label="'+d.Name_TC+'">');
						for (var i=0; i<d.Member.length; i++) {
							var member = d.Member[i];
							opts.push('<option value="'+member.District_ID+'">&nbsp;'+member.District+'&nbsp;</option>');
							if(key == "hk") {
								hk_arr.push('<option value="'+member.District_ID+'">&nbsp;'+member.District+'&nbsp;</option>');
							} else if  (key == "kln") {
								kln_arr.push('<option value="'+member.District_ID+'">&nbsp;'+member.District+'&nbsp;</option>');
							} else if  (key == "nt") {
								nt_arr.push('<option value="'+member.District_ID+'">&nbsp;'+member.District+'&nbsp;</option>');
							} else if (key == "is") {
								is_arr.push('<option value="'+member.District_ID+'">&nbsp;'+member.District+'&nbsp;</option>');
							}
							
						}
						opts.push('</optgroup>');
					}
				}
				data.htmlStr = opts.join('');
				data.hk = hk_arr.join('');
				data.kln = kln_arr.join('');
				data.nt = nt_arr.join('');
				data.is =	is_arr.join('');											
				if (extCB) {
					extCB(PTY.area.data);
				}
			}
		}
	}
};

PTY.searchFrm = {
	/*
	option:{
		sell: {
			minprice: '<option value="-1" selected>任何</option><option value="0">0</option><option value="1000000">100萬</option><option value="1500000">150萬</option><option value="2000000">200萬</option><option value="2500000">250萬</option><option value="3000000">300萬</option><option value="3500000">350萬</option><option value="4000000">400萬</option><option value="4500000">450萬</option><option value="5000000">500萬</option><option value="5500000">550萬</option><option value="6000000">600萬</option><option value="6500000">650萬</option><option value="7000000">700萬</option><option value="7500000">750萬</option><option value="8000000">800萬</option><option value="8500000">850萬</option><option value="9000000">900萬</option>',
			maxprice: '<option value="-1" selected>任何</option><option value="1000000">100萬</option><option value="1500000">150萬</option><option value="2000000">200萬</option><option value="2500000">250萬</option><option value="3000000">300萬</option><option value="3500000">350萬</option><option value="4000000">400萬</option><option value="4500000">450萬</option><option value="5000000">500萬</option><option value="5500000">550萬</option><option value="6000000">600萬</option><option value="6500000">650萬</option><option value="7000000">700萬</option><option value="7500000">750萬</option><option value="8000000">800萬</option><option value="8500000">850萬</option><option value="9000000">900萬</option><option value="10000000">1000萬</option><option value="infinite">&gt;1000萬</option>'
		},
		rent:{
			minprice:'<option value="-1" selected>任何</option><option value="0">0</option><option value="2500">2,500</option><option value="5000">5,000</option><option value="7500">7,500</option><option value="10000">10,000</option><option value="15000">15,000</option><option value="20000">20,000</option><option value="25000">25,000</option><option value="30000">30,000</option><option value="50000">50,000</option><option value="70000">70,000</option><option value="100000">100,000</option>',
			maxprice:'<option value="-1" selected>任何</option><option value="2500">2,500</option><option value="5000">5,000</option><option value="7500">7,500</option><option value="10000">10,000</option><option value="15000">15,000</option><option value="20000">20,000</option><option value="25000">25,000</option><option value="30000">30,000</option><option value="50000">50,000</option><option value="70000">70,000</option><option value="100000">100,000</option><option value="infinite">&gt;100,000</option>'
		}
	},
	*/
	init: function() {
		//$("#pty_search_area").append(PTY.searchFrm.render_form());
		
		//PTY.area.init(this.fillArea);
		
		/*
		if (arguments.length>=1&&arguments[0]=='rent') {
			$('#priceLabel').empty().append('租價(元)');
			$('#minprice').empty().append(this.option.rent.minprice);
			$('#maxprice').empty().append(this.option.rent.maxprice);
		} else {
			$('#priceLabel').empty().append('售價(元)');
			$('#minprice').empty().append(this.option.sell.minprice);
			$('#maxprice').empty().append(this.option.sell.maxprice);
		}
		$('#searchForm input[name=propertytype]:radio').change(function(evt){
			with (PTY.searchFrm.option) {
				switch ($(evt.target).val()) {
					case '1':
						$('#priceLabel').empty().append('售價(元)');
						$('#minprice').empty().append(sell.minprice);
						$('#maxprice').empty().append(sell.maxprice);
					break;
					case '2':
						$('#priceLabel').empty().append('租價(元)');
						$('#minprice').empty().append(rent.minprice);
						$('#maxprice').empty().append(rent.maxprice);
					break;
				}
			}
		});
		*/
		
		var m18_box_id = "";
		if ( ODN.sect == "main" ) {
			m18_box_id = "#m18_quote_box";
			$( m18_box_id).after(PTY.searchFrm.render_mini_form());
		} else if ( ODN.sect == "finance"  && ODN.sect_L3 == "index") {
			m18_box_id = "#m18Widget";
			$( m18_box_id).after(PTY.searchFrm.render_mini_form());
		} else if (  ODN.sect == "finance" && ! (ODN.sect_L3 == "index") ) {
			m18_box_id = "#stockQuoteBox";
			$( m18_box_id).after(PTY.searchFrm.render_mini_form());
		} else if ( ODN.sect == "news"  && ODN.sect_L3 == "index") {
			m18_box_id = "#adv_yahoo_keyword_box";
			$( m18_box_id).before(PTY.searchFrm.render_mini_form());
		}
		
		//$('#pty_mini_search_frm').css('height','0px');
		//$('#pty_mini_search_frm').css('padding-top','0px');
		/* S: mini search */
		//$("#stockQuoteBox").after(PTY.searchFrm.render_mini_form());
		
		$('#searchForm_mini').submit(this.validate_mini);
		$('#btn_search_mini').click(this.validate_mini);
		$("#district_mini").change(function(){ 			
    		//alert($("#district_mini option:selected").text() );
			if ( $("#district_mini option:selected").val() == -2) {
				$("#district_area_mini").empty();
				$("#district_area_mini").append("<option selected=\"\" value=\"-2\">---</option>");
				$("#district_area_mini").append("<option  value=\"-1\">任何</option>");
			} else if ( $("#district_mini option:selected").val() == -1) { //All
				$("#district_area_mini").empty();
				
				$("#district_area_mini").append("<option selected=\"\" value=\"-1\">任何</option>");
				$("#district_area_mini").append('<optgroup label="香港">');
				$("#district_area_mini").append(PTY.area.data.hk);
				$("#district_area_mini").append('</optgroup>');	
				
				$("#district_area_mini").append('<optgroup label="九龍">');
				$("#district_area_mini").append(PTY.area.data.kln);
				$("#district_area_mini").append('</optgroup>');						
						
				$("#district_area_mini").append('<optgroup label="新界">');
				$("#district_area_mini").append(PTY.area.data.nt);
				$("#district_area_mini").append('</optgroup>');								
							
				$("#district_area_mini").append('<optgroup label="離島">');
				$("#district_area_mini").append(PTY.area.data.is);
				$("#district_area_mini").append('</optgroup>');									
							
			} else if ( $("#district_mini option:selected").val() == 1) { //hk
				$("#district_area_mini").empty();
				//$("#district_area_mini").append("<option selected=\"\" value=\"-1\">任何</option>");
				$("#district_area_mini").append(PTY.area.data.hk);
			} else if ( $("#district_mini option:selected").val() == 2) { //kln
				$("#district_area_mini").empty();
				//$("#district_area_mini").append("<option selected=\"\" value=\"-1\">任何</option>");
				$("#district_area_mini").append(PTY.area.data.kln);				
			} else if ( $("#district_mini option:selected").val() == 3) { //nt
				$("#district_area_mini").empty();
				//$("#district_area_mini").append("<option selected=\"\" value=\"-1\">任何</option>");
				$("#district_area_mini").append(PTY.area.data.nt);				
			} else if ( $("#district_mini option:selected").val() == 4) { //is
				$("#district_area_mini").empty();
				//$("#district_area_mini").append("<option selected=\"\" value=\"-1\">任何</option>");
				$("#district_area_mini").append(PTY.area.data.is);				
			}
		});
		/* E: mini_search */
	},
	/* curDistrict:null, */
	validate_mini: function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		
		var prmtrs = {};
		
		if ($('#district_area_mini').val() != '-2') {
			if ($('#district_area_mini option:selected').val() != '-1') {
				prmtrs = $.extend({}, prmtrs, {district_id:$('#district_area_mini').val(), district:$.trim($('#district_area_mini option:selected').text())});
			}
		}	else {
			alert('請選擇地點！');
			return false;
		}
		prmtrs = $.extend({}, prmtrs, {propertytype:$('#searchForm_mini input[name=propertytype_mini]:checked').val()});
		window.location = "http://p18.on.cc" +  PTY.getTTLink('/search/results.html', prmtrs);
	},
	resetFrm: function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		$('#searchForm')
			.find(':selected').removeAttr('selected').end()
			.find('option[value=-1]').attr('selected','').end()
			.find(':radio')
				.removeAttr('checked').end()
			.find(':radio')
				.each(function(i){
					if ($(this).attr('value')=='1') {
						this.checked = true;
					}
				})
			.end()
			.find(':checkbox')
				.each(function(i){
					this.checked = false;
				})
			.end()
			.find(':text').val('');
	}, 
	render_mini_form: function() {
		
		
		var form = [];
		
		//$('#pty_mini_search_frm').css('border','solid 1px #d4c3b3');
//$('#pty_mini_search_frm').html('<iframe src="http://p18.on.cc/preview/search/search_engine.html" border="0" width="302px"  frameborder="0"><p>Your browser does not support iframes.</p></iframe>')


		
		if ( ODN.sect == "finance"  && ODN.sect_L3 == "index" ) {
			form.push('<div id=\"pty_mini_search_frm\" style=\"width:300px;border:solid 1px #d4c3b3;margin-top: 5px;margin-bottom: 5px;padding-bottom: 25px;padding-top: 0px;\">' + PTY.searchFrm.build() + '</div>');
			//form.push("<div id=\"pty_mini_search_frm\" style=\"width:300px;border:solid 1px #d4c3b3;margin-top: 5px;margin-bottom: 5px;padding-bottom: 0px;padding-top: 0px;\"><iframe scrolling=\"no\" src=\"http://p18.on.cc/search/search_engine.html\" border=\"0\" width=\"300px\"  frameborder=\"0\"></iframe></div>");
		} else if ( ODN.sect == "finance" ) {
			form.push('<div id=\"pty_mini_search_frm\" style=\"width:200px;border:solid 1px #d4c3b3;padding-bottom: 25px;padding-top: 0px;\">' + PTY.searchFrm.buildThin() + '</div>');
			//form.push("<div id=\"pty_mini_search_frm\" style=\"width:200px;border:solid 1px #d4c3b3;padding-bottom: 0px;padding-top: 0px;\"><iframe scrolling=\"no\" src=\"http://p18.on.cc/search/search_engine_thin.html\" border=\"0\" height=\"200px\" width=\"200px\"  frameborder=\"0\"></iframe></div>");
		} else  {
			form.push('<div id=\"pty_mini_search_frm\" style=\"width:300px;border:solid 1px #d4c3b3;padding-bottom: 25px;padding-top: 0px;\">' + PTY.searchFrm.build() + '</div>');
			//form.push("<div id=\"pty_mini_search_frm\" style=\"width:300px;border:solid 1px #d4c3b3;padding-bottom: 0px;padding-top: 0px;\"><iframe scrolling=\"no\" src=\"http://p18.on.cc/search/search_engine.html\" border=\"0\" width=\"300px\"  frameborder=\"0\"></iframe></div>");
		}
		
		

		
		/*form.push("<div id=\"pty_mini_search_frm\"><div class=\"header\"><div></div></div>");
		
		form.push("<div class=\"content\">");
		form.push("<div class=\"header_title\" style=\" cursor: pointer;\" onclick=\"window.location.href='http://p18.on.cc';\"></div>");
		form.push("<form method=\"post\" id=\"searchForm_mini\" name=\"searchForm_mini\" autocomplete=\"on\"><table >");
		form.push("<tbody>");
		
			var height_str = "";
		if ( ODN.sect == "main"  || ODN.sect == "news" ) {
			height_str = "35";
		} else if ( ODN.sect == "finance"  && ODN.sect_L3 == "index") {
			height_str = "35";
		} else if (  ODN.sect == "finance" && !(ODN.sect_L3 == "index") ) {
			height_str = "20";
		}
		
		//form.push("<tr style='height:20px;'>");
		form.push("<tr style='height:"  +  height_str +  "px;'>");
		form.push("<td width='35px' >租/售</td>");
		form.push("<td >");
		form.push("<input type=\"radio\" value=\"2\" name=\"propertytype_mini\">&nbsp;租&nbsp;&nbsp;");
		form.push("<input type=\"radio\" checked=\"\" value=\"1\" name=\"propertytype_mini\">&nbsp;售");
		form.push("</td>");
		
		var rowspan = 3;
		if ( ODN.sect == "main" ) {
			rowspan=2;
		} else if  ( ODN.sect == "news"  && ODN.sect_L3 == "index") {
			rowspan=2;
		} else if ( ODN.sect == "finance"  && ODN.sect_L3 == "index") {
			rowspan=2;
		}
		
		form.push("<td rowspan=" + rowspan +">");
		form.push("<a href=\"#\" id=\"btn_search_mini\"><img alt=\"搜尋\" src=\"/img/pty_search_button.jpg\"></a>");
		form.push("</td>");
		form.push("</tr>");		
		
		form.push("<tr ><td >地區</td><td >");
		form.push("<select id=\"district_mini\" name=\"district_mini\">");
			form.push("<option selected=\"\" value=\"-2\">---</option>");
			form.push("<option  value=\"-1\">任何</option>");
			form.push("<option  value=\"1\">香港</option>");
			form.push("<option  value=\"2\">九龍</option>");
			form.push("<option  value=\"3\">新界</option>");
			form.push("<option  value=\"4\">離島</option>");
		form.push("</select>");

		if ( ODN.sect == "main" ) {
			form.push("&nbsp;&nbsp;地點&nbsp;&nbsp;&nbsp;");
			form.push("<select id=\"district_area_mini\" name=\"district_area_mini\">");
			form.push("<option selected=\"\" value=\"-2\">---</option>");
			//form.push("<option selected=\"\" value=\"-1\">任何</option>");
			form.push("</select>");
		} else if ( ODN.sect == "finance"  && ODN.sect_L3 == "index") {
			form.push("&nbsp;&nbsp;地點&nbsp;&nbsp;&nbsp;");
			form.push("<select id=\"district_area_mini\" name=\"district_area_mini\">");
			form.push("<option selected=\"\" value=\"-2\">---</option>");
			//form.push("<option selected=\"\" value=\"-1\">任何</option>");
			form.push("</select>");
		} else if ( ODN.sect == "news"  && ODN.sect_L3 == "index") {
			form.push("&nbsp;&nbsp;地點&nbsp;&nbsp;&nbsp;");
			form.push("<select id=\"district_area_mini\" name=\"district_area_mini\">");
			form.push("<option selected=\"\" value=\"-2\">---</option>");
			//form.push("<option selected=\"\" value=\"-1\">任何</option>");
			form.push("</select>");
		}
		form.push("</td></tr>");

		if (  ODN.sect == "finance" && !(ODN.sect_L3 == "index") ) {
			form.push("<tr><td>");
			form.push("地點");
			form.push("</td><td><select id=\"district_area_mini\" name=\"district_area_mini\">");
			form.push("<option selected=\"\" value=\"-2\">---</option>");
			//form.push("<option selected=\"\" value=\"-1\">任何</option>");
			form.push("</select>");
			form.push("</td></tr>");
		}
		
		
		form.push("<tr><td colspan=3><span class='gohomeSponsorTxt'>樓盤由GoHome.com.hk提供</span></td></tr>");
		
		
		form.push("<tr style=\"display:none;\"><td>");
		form.push("<select class=\"col2a\" id=\"minroom_mini\" name=\"minroom_mini\">");

		form.push("<option selected=\"\" value=\"-1\">任何</option>");
		form.push("</select>");
		form.push("<select class=\"col2a\" id=\"minprice_mini\" name=\"minprice_mini\"></select>");
		form.push("<select class=\"col2c\" id=\"maxprice_mini\" name=\"maxprice_mini\"></select>");
		form.push("<select class=\"col2a\" id=\"minsize_mini\" name=\"minsize_mini\">");
		form.push("<option selected=\"\" value=\"-1\">最小</option>");
		form.push("</select>");
		form.push("<select class=\"col2c\" id=\"maxsize_mini\" name=\"maxsize_mini\">");
		form.push("<option selected=\"\" value=\"-1\">最大</option>");
		form.push("</select>");
		form.push("<input type=\"text\" id=\"estate_mini\" name=\"estate_mini\" >");
		form.push("<input type=\"checkbox\" value=\"0\" id=\"ownerlisting_mini\" name=\"ownerlisting_mini\">");		
		form.push("<a href=\"#\" id=\"btn_reset_mini\"><img alt=\"重設\" src=\"/img/btn_reset.png\"></a>");	
		form.push("</td></tr></tbody></table>");
		form.push("</form>");	
		form.push("</div>");
		form.push("<div class=\"footer\"><div></div></div>");
		form.push("</div>");*/
		return form.join('');
	},
	build:function(){
		var html = '';
        html += '<div class="searchProperty" style="margin:0;padding:0">';
        html += '    <div class="header" style="background: url(\'/img/search_engine_patt.gif\') repeat-x scroll 0 0 transparent;height: 40px;left: 0;position: relative;top: 0;width: 100%;">';
        html += '        <div class="left" style="left: 10px;position: absolute;top: 4px;">';
        html += '            <img src="/img/search_engine_logo.png" />';
        html += '        </div>';
        html += '        <div class="right" style="position: absolute;left: 120px;top: 12px;">';
        html += '            <img src="/img/search_engine_title.png" />';
        html += '        </div>';
        html += '    </div>';
        html += '   <table border="0" cellspacing="0" cellpadding="0" style="height: 60px;margin: 0 auto;width: 280px;margin-top:5px;">';
        html += '        <tr>';
        html += '            <td style="font-size: 13px;">租／售</td>';
        html += '            <td style="font-size: 13px;">';
        html += '                <input type="radio" value="2" name="propertytype">&nbsp;租&nbsp;&nbsp;';
        html += '                <input type="radio" value="1" name="propertytype">&nbsp;售';
        html += '            </td>';
        html += '           <td rowspan="2">';
        html += '                <div style="cursor: pointer;" id="prop_search_btn" onClick="PTY.searchFrm.goSearch()"><img src="/img/search_engine_search.png" /></div>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td>';
        html += '                <select style="width:100px" id="district" name="district" onChange="PTY.searchFrm.changeDist()"><option selected="" value="-1">地區</option><optgroup area="hk" label="香港" area_id="1"><option area="1" value="HA">&nbsp;香港仔&nbsp;</option><option area="1" value="HWC">&nbsp;灣仔&nbsp;</option><option area="1" value="HSY">&nbsp;西營盤&nbsp;</option><option area="1" value="HSW">&nbsp;上環&nbsp;</option><option area="1" value="HSS">&nbsp;小西灣&nbsp;</option><option area="1" value="HSK">&nbsp;筲箕灣&nbsp;</option><option area="1" value="HRB">&nbsp;淺水灣&nbsp;</option><option area="1" value="HQB">&nbsp;鰂魚涌&nbsp;</option><option area="1" value="HPF">&nbsp;薄扶林&nbsp;</option><option area="1" value="HNP">&nbsp;北角&nbsp;</option><option area="1" value="HNH">&nbsp;北角半山&nbsp;</option><option area="1" value="HMW">&nbsp;西半山&nbsp;</option><option area="1" value="HME">&nbsp;東半山&nbsp;</option><option area="1" value="HMC">&nbsp;中半山&nbsp;</option><option area="1" value="HKT">&nbsp;堅尼地城&nbsp;</option><option area="1" value="HHV">&nbsp;跑馬地&nbsp;</option><option area="1" value="HCW">&nbsp;柴灣&nbsp;</option><option area="1" value="HCB">&nbsp;銅鑼灣&nbsp;</option><option area="1" value="HWH">&nbsp;黃竹坑&nbsp;</option></optgroup><optgroup area="kln" label="九龍" area_id="2"><option area="2" value="KCS">&nbsp;長沙灣&nbsp;</option><option area="2" value="KNT">&nbsp;牛頭角&nbsp;</option><option area="2" value="KSK">&nbsp;石硤尾 / 又一村&nbsp;</option><option area="2" value="KSP">&nbsp;新蒲崗&nbsp;</option><option area="2" value="KTK">&nbsp;大角咀&nbsp;</option><option area="2" value="KTS">&nbsp;尖沙咀&nbsp;</option><option area="2" value="KTW">&nbsp;土瓜灣&nbsp;</option><option area="2" value="KWT">&nbsp;黃大仙&nbsp;</option><option area="2" value="KYM">&nbsp;油麻地&nbsp;</option><option area="2" value="KNC">&nbsp;牛池灣&nbsp;</option><option area="2" value="KLT">&nbsp;藍田&nbsp;</option><option area="2" value="KDH">&nbsp;鑽石山&nbsp;</option><option area="2" value="KHH">&nbsp;紅磡&nbsp;</option><option area="2" value="KHM">&nbsp;何文田&nbsp;</option><option area="2" value="KKB">&nbsp;九龍灣&nbsp;</option><option area="2" value="KKC">&nbsp;九龍城&nbsp;</option><option area="2" value="KKL">&nbsp;九龍塘&nbsp;</option><option area="2" value="KKT">&nbsp;觀塘&nbsp;</option><option area="2" value="KLC">&nbsp;荔枝角 / 美孚&nbsp;</option><option area="2" value="KYT">&nbsp;油塘&nbsp;</option></optgroup><optgroup area="nt" label="新界東" area_id="3"><option area="3" value="NFL">&nbsp;粉嶺&nbsp;</option><option area="3" value="NMO">&nbsp;馬鞍山&nbsp;</option><option area="3" value="NSK">&nbsp;西貢&nbsp;</option><option area="3" value="NSS">&nbsp;上水&nbsp;</option><option area="3" value="NST">&nbsp;沙田&nbsp;</option><option area="3" value="NTK">&nbsp;將軍澳&nbsp;</option><option area="3" value="NTP">&nbsp;大埔&nbsp;</option></optgroup><optgroup area="is" label="新界西" area_id="4"><option area="4" value="NKC">&nbsp;葵涌&nbsp;</option><option area="4" value="NMW">&nbsp;馬灣&nbsp;</option><option area="4" value="NTC">&nbsp;東涌&nbsp;</option><option area="4" value="NTM">&nbsp;屯門&nbsp;</option><option area="4" value="NTS">&nbsp;天水圍&nbsp;</option><option area="4" value="NTW">&nbsp;荃灣&nbsp;</option><option area="4" value="NTY">&nbsp;青衣&nbsp;</option><option area="4" value="NYL">&nbsp;元朗&nbsp;</option></optgroup></select>';
        html += '            </td>';
        html += '            <td>';
        html += '                <select style="width:100px" id="estate" name="estate"><option value="-1">任何</option></select>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td colspan="2"><span style="color: #827349; font-size: 13px;">樓盤由property.hk提供</span></td>';
        html += '        </tr>';
        html += '    </table>';
        html += '</div>';
		return html;
	},
	buildThin:function(){
		var packageName = 'PTY.searchFrm';
        var html = '';
		html += '<div class="searchProperty" style="margin:0;padding:0">';
        html += '    <div class="header" style="background: url(\'/img/search_engine_patt.gif\') repeat-x scroll 0 0 transparent;height: 40px;left: 0;position: relative;top: 0;width: 100%;">';
        html += '        <div class="left" style="left: 10px;position: absolute;top: 4px;">';
        html += '            <img src="/img/search_engine_logo.png" />';
        html += '        </div>';
        html += '        <div class="right" style="position: absolute;left: 120px;top: 12px;">';
        html += '           <img src="/img/search_engine_title.png" />';
        html += '        </div>';
        html += '    </div>';
        html += '    <table border="0" cellspacing="0" cellpadding="0" style="height: 60px;margin: 0 auto;width: 180px;margin-top:5px;">';
        html += '        <tr>';
        html += '            <td style="padding: 3px 0px;font-size: 13px;">租／售</td>';
        html += '            <td rowspan="4" valign="top">';
        html += '                <div style="cursor: pointer;" id="prop_search_btn" onClick="PTY.searchFrm.goSearch()" ><img src="/img/search_engine_search.png" /></div>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td style="padding: 3px 0px;font-size: 13px;">';
        html += '                <input type="radio" value="2" name="propertytype">&nbsp;租&nbsp;&nbsp;';
        html += '                <input type="radio" value="1" name="propertytype">&nbsp;售';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '           <td style="padding: 3px 0px;">';
        html += '                <select style="width:100px" id="district" name="district" onChange="PTY.searchFrm.changeDist()"><option selected="" value="-1" >地區</option><optgroup area="hk" label="香港" area_id="1"><option area="1" value="HA">&nbsp;香港仔&nbsp;</option><option area="1" value="HWC">&nbsp;灣仔&nbsp;</option><option area="1" value="HSY">&nbsp;西營盤&nbsp;</option><option area="1" value="HSW">&nbsp;上環&nbsp;</option><option area="1" value="HSS">&nbsp;小西灣&nbsp;</option><option area="1" value="HSK">&nbsp;筲箕灣&nbsp;</option><option area="1" value="HRB">&nbsp;淺水灣&nbsp;</option><option area="1" value="HQB">&nbsp;鰂魚涌&nbsp;</option><option area="1" value="HPF">&nbsp;薄扶林&nbsp;</option><option area="1" value="HNP">&nbsp;北角&nbsp;</option><option area="1" value="HNH">&nbsp;北角半山&nbsp;</option><option area="1" value="HMW">&nbsp;西半山&nbsp;</option><option area="1" value="HME">&nbsp;東半山&nbsp;</option><option area="1" value="HMC">&nbsp;中半山&nbsp;</option><option area="1" value="HKT">&nbsp;堅尼地城&nbsp;</option><option area="1" value="HHV">&nbsp;跑馬地&nbsp;</option><option area="1" value="HCW">&nbsp;柴灣&nbsp;</option><option area="1" value="HCB">&nbsp;銅鑼灣&nbsp;</option><option area="1" value="HWH">&nbsp;黃竹坑&nbsp;</option></optgroup><optgroup area="kln" label="九龍" area_id="2"><option area="2" value="KCS">&nbsp;長沙灣&nbsp;</option><option area="2" value="KNT">&nbsp;牛頭角&nbsp;</option><option area="2" value="KSK">&nbsp;石硤尾 / 又一村&nbsp;</option><option area="2" value="KSP">&nbsp;新蒲崗&nbsp;</option><option area="2" value="KTK">&nbsp;大角咀&nbsp;</option><option area="2" value="KTS">&nbsp;尖沙咀&nbsp;</option><option area="2" value="KTW">&nbsp;土瓜灣&nbsp;</option><option area="2" value="KWT">&nbsp;黃大仙&nbsp;</option><option area="2" value="KYM">&nbsp;油麻地&nbsp;</option><option area="2" value="KNC">&nbsp;牛池灣&nbsp;</option><option area="2" value="KLT">&nbsp;藍田&nbsp;</option><option area="2" value="KDH">&nbsp;鑽石山&nbsp;</option><option area="2" value="KHH">&nbsp;紅磡&nbsp;</option><option area="2" value="KHM">&nbsp;何文田&nbsp;</option><option area="2" value="KKB">&nbsp;九龍灣&nbsp;</option><option area="2" value="KKC">&nbsp;九龍城&nbsp;</option><option area="2" value="KKL">&nbsp;九龍塘&nbsp;</option><option area="2" value="KKT">&nbsp;觀塘&nbsp;</option><option area="2" value="KLC">&nbsp;荔枝角 / 美孚&nbsp;</option><option area="2" value="KYT">&nbsp;油塘&nbsp;</option></optgroup><optgroup area="nt" label="新界東" area_id="3"><option area="3" value="NFL">&nbsp;粉嶺&nbsp;</option><option area="3" value="NMO">&nbsp;馬鞍山&nbsp;</option><option area="3" value="NSK">&nbsp;西貢&nbsp;</option><option area="3" value="NSS">&nbsp;上水&nbsp;</option><option area="3" value="NST">&nbsp;沙田&nbsp;</option><option area="3" value="NTK">&nbsp;將軍澳&nbsp;</option><option area="3" value="NTP">&nbsp;大埔&nbsp;</option></optgroup><optgroup area="is" label="新界西" area_id="4"><option area="4" value="NKC">&nbsp;葵涌&nbsp;</option><option area="4" value="NMW">&nbsp;馬灣&nbsp;</option><option area="4" value="NTC">&nbsp;東涌&nbsp;</option><option area="4" value="NTM">&nbsp;屯門&nbsp;</option><option area="4" value="NTS">&nbsp;天水圍&nbsp;</option><option area="4" value="NTW">&nbsp;荃灣&nbsp;</option><option area="4" value="NTY">&nbsp;青衣&nbsp;</option><option area="4" value="NYL">&nbsp;元朗&nbsp;</option></optgroup></select>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td style="padding: 3px 0px;">';
        html += '                <select style="width:100px" id="estate" name="estate"><option value="-1">任何</option></select>';
        html += '            </td>';
        html += '        </tr>';
        html += '        <tr>';
        html += '            <td colspan="2"><span style="color: #827349; font-size: 13px;">樓盤由property.hk提供</span></td>';
        html += '        </tr>';
        html += '    </table>';
        html += '</div>';
		return html;
	},
	showSelectList:function(){
        var html_arr = [];
		var value = $('.searchProperty #district').val();
		if(value != -1){
			html_arr.push('<option value="-1">任何</option>');
			for (var i = 0; i < property_count_ALL[value].Property_ID.length; i++) {
				html_arr.push('<option>' + property_count_ALL[value].Property_ID[i] + '</option>');
			}
			$('#estate').html(html_arr.join(''));
		}
	},
	changeDist:function(){
        if ($('#district ').val() != -1) {
			if(typeof property_count_ALL == "undefined"){
			var url = '/js/property_count_ALL.js';
				$.ajax({
					url: url,
					success: function(){PTY.searchFrm.showSelectList()},
					dataType: 'script',
					scriptCharset: 'utf-8'
				});
			}else{
				PTY.searchFrm.showSelectList();
			}
			/*
            var url = 'http://p18.on.cc/prop/cnt/js/property_count/property_count_' + $('#district ').val() + '.js';
            $.ajax({
                url: url,
                success: function(){PTY.searchFrm.showSelectList()},
                dataType: 'script',
                scriptCharset: 'utf-8'
            });
			*/
        }
	},
	goSearch:function(){
        var url = 'http://p18.on.cc/search/results.html';
        var sellRent = '';
              
        if (parseInt($('input[name=propertytype]:checked').val()) == 2) {
            sellRent = '&minpricerent=1';
        } else if (parseInt($('input[name=propertytype]:checked').val()) == 1) {
            sellRent = '&minprice=0.001';
        }
               
        if ($('#district').val() != -1) {
            if ($('#estate').val() != -1) {
                url += '?district_id=' + $('#district').val() + '&district=' + encodeURIComponent($.trim($('#district option:selected').text())) + '&estate=' + encodeURIComponent($('#estate').val()) + '&propertytype=3' + sellRent;
                window.open(url);
            } else {
                url += '?district_id=' + $('#district').val() + '&district=' + encodeURIComponent($.trim($('#district option:selected').text())) + '&propertytype=3' + sellRent;
                window.open(url);
            }
        } else {
            url += '?district_id=ALL&district='+encodeURIComponent('地區')+'&propertytype=3' + sellRent;
            window.open(url);
        }
	}
};
//// E: PTY

ODN.access = {
	init:function(){
		
		var currentUrl = '';
		
		//home page , section page
		if($('#contentCTN-right').length == 0){
			currentUrl = 'headlineCTN';
		}
		
		//content page
		if($('#leadin').length > 0){
			currentUrl = 'leadin';
		}
		
		if($('.tfYahooKeyword').length > 0){
			$('.tfYahooKeyword').attr('title','請輸入關鍵字');
			$('.tfYahooKeyword').attr('id','tfYahooKeyword');
			currentUrl = 'tfYahooKeyword';
		}
		
		$('#topMenu li .news').attr('id','mainMenu');
		$('body').prepend('<a title="跳至主目錄" href="#mainMenu" style="color:white;position:absolute;left: 0px;top: 0px;width: 1px;height: 1px;overflow: hidden;">​跳至主目錄​</a>');
		$('body').prepend('<a title="跳至主要內容" href="#'+currentUrl+'" style="color:white;position:absolute;left: 0px;top: 0px;width: 1px;height: 1px;overflow: hidden;">跳至主要內容</a>');

	}
}

$(document).ready(function(){
	ODN.access.init();
});

/*Story Js*/
ODN.writeScript($.urlUtils.get('/js/keywords/serialStory/SerialStory_List.js', true));

//e:urlParams



//s:mcdonald corpbar 2010
//$ONCC.corpBar.hidePromo = true;
//document.write(unescape("%3Clink rel='stylesheet' type='text/css' href='http://ad2.on.cc/html/mcdonalds/cnydora/unicorp.css' media='all'%3E"));
//e:mcdonald corpbar 2010
