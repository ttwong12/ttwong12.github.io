// JavaScript Document

var Urchin = {
	
	domain: 'orientaldaily.on.cc',
	//domain: 'odn.preview06.uat.cms',
	ugifpath : '/img/__utm.gif',
	current_path : '',
	
	matching : {
	'index' : 'index_%E6%9D%B1%E6%96%B9%E4%B8%BB%E9%A0%81',
'main_news' : 'index_news_%E4%B8%BB%E9%A0%81_%E8%A6%81%E8%81%9E%E6%B8%AF%E8%81%9E',
'main_china_world' : 'index_china_world_%E4%B8%BB%E9%A0%81_%E5%85%A9%E5%B2%B8%E5%9C%8B%E9%9A%9B',
'main_finance' : 'index_finance_%E4%B8%BB%E9%A0%81_%E8%B2%A1%E7%B6%93',
'main_entertainment' : 'index_entertainment_%E4%B8%BB%E9%A0%81_%E5%A8%9B%E6%A8%82',
'main_lifestyle' : 'index_lifestyle_%E4%B8%BB%E9%A0%81_%E5%89%AF%E5%88%8A',
'main_news_ads' : 'index_news_ads_%E4%B8%BB%E9%A0%81_%E8%A6%81%E8%81%9E%E6%B8%AF%E8%81%9E_%E5%BB%A3%E5%91%8A',
'main_china_world_ads' : 'index_china_world_ads_%E4%B8%BB%E9%A0%81_%E5%85%A9%E5%B2%B8%E5%9C%8B%E9%9A%9B_%E5%BB%A3%E5%91%8A',
'main_finance_ads' : 'index_finance_ads_%E4%B8%BB%E9%A0%81_%E8%B2%A1%E7%B6%93_%E5%BB%A3%E5%91%8A',
'main_entertainment_ads' : 'index_entertainment_ads_%E4%B8%BB%E9%A0%81_%E5%A8%9B%E6%A8%82_%E5%BB%A3%E5%91%8A',
'main_lifestyle_ads' : 'index_lifestyle_ads_%E4%B8%BB%E9%A0%81_%E5%89%AF%E5%88%8A_%E5%BB%A3%E5%91%8A',
'cnt_news' : 'cnt_news_%E5%85%A7%E9%A0%81_%E8%A6%81%E8%81%9E%E6%B8%AF%E8%81%9E',
'cnt_china_world' : 'cnt_china_world_%E5%85%A7%E9%A0%81_%E5%85%A9%E5%B2%B8%E5%9C%8B%E9%9A%9B',
'cnt_finance' : 'cnt_finance_%E5%85%A7%E9%A0%81_%E8%B2%A1%E7%B6%93',
'cnt_entertainment' : 'cnt_entertainment_%E5%85%A7%E9%A0%81_%E5%A8%9B%E6%A8%82',
'cnt_lifestyle' : 'cnt_lifestyle_%E5%85%A7%E9%A0%81_%E5%89%AF%E5%88%8A',
'cnt_adult' : 'cnt_adult_%E5%85%A7%E9%A0%81_%E7%94%B7%E6%A5%B5%E5%9C%88',
'cnt_sport' : 'cnt_sport_%E5%85%A7%E9%A0%81_%E9%AB%94%E8%82%B2',
'cnt_charity' : 'cnt_charity_%E5%85%A7%E9%A0%81_%E6%85%88%E5%96%84%E5%9F%BA%E9%87%91',
'cnt_sitemap' : 'cnt_sitemap_%E5%85%A7%E9%A0%81_%E6%96%B0%E8%81%9E%E7%B8%BD%E8%A6%BD',
'cnt_news_ads' : 'cnt_news_ads_%E5%85%A7%E9%A0%81_%E8%A6%81%E8%81%9E%E6%B8%AF%E8%81%9E_%E5%BB%A3%E5%91%8A',
'cnt_china_world_ads' : 'cnt_china_world_ads_%E5%85%A7%E9%A0%81_%E5%85%A9%E5%B2%B8%E5%9C%8B%E9%9A%9B_%E5%BB%A3%E5%91%8A',
'cnt_finance_ads' : 'cnt_finance_ads_%E5%85%A7%E9%A0%81_%E8%B2%A1%E7%B6%93_%E5%BB%A3%E5%91%8A',
'cnt_entertainment_ads' : 'cnt_entertainment_ads_%E5%85%A7%E9%A0%81_%E5%A8%9B%E6%A8%82_%E5%BB%A3%E5%91%8A',
'cnt_lifestyle_ads' : 'cnt_lifestyle_ads_%E5%85%A7%E9%A0%81_%E5%89%AF%E5%88%8A_%E5%BB%A3%E5%91%8A',
'cnt_adult_ads' : 'cnt_adult_ads_%E5%85%A7%E9%A0%81_%E7%94%B7%E6%A5%B5%E5%9C%88_%E5%BB%A3%E5%91%8A',
'cnt_sport_ads' : 'cnt_sport_ads_%E5%85%A7%E9%A0%81_%E9%AB%94%E8%82%B2_%E5%BB%A3%E5%91%8A',
'cnt_charity_ads' : 'cnt_charity_ads_%E5%85%A7%E9%A0%81_%E6%85%88%E5%96%84%E5%9F%BA%E9%87%91_%E5%BB%A3%E5%91%8A',
'cnt_sitemap_ads' : 'cnt_sitemap_ads_%E5%85%A7%E9%A0%81_%E6%96%B0%E8%81%9E%E7%B8%BD%E8%A6%BD_%E5%BB%A3%E5%91%8A',
'cnt_archive_ads' : 'cnt_archive_ads_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%96%87%E7%AB%A0_%E5%BB%A3%E5%91%8A',
'cnt_event_showall' : 'cnt_event_showall_%E5%85%A7%E9%A0%81_%E6%99%82%E9%96%93%E8%BB%B8',
'cnt_lbox_image' : 'cnt_lbox_image_%E5%85%A7%E9%A0%81_%E5%9C%96%E7%89%87lightbox',
'cnt_lbox_video' : 'cnt_lbox_video_%E5%85%A7%E9%A0%81_%E5%BD%B1%E7%89%87lightbox',
'cnt_archive_index' : 'cnt_archive_index_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%9D%B1%E6%96%B9%E6%90%9C%E5%B0%8B%E4%B8%BB%E9%A0%81',
'cnt_archive' : 'cnt_archive_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%9D%B1%E6%96%B9%E6%90%9C%E5%B0%8Bcnt%E7%B6%B2%E9%A0%81',
'cnt_archive_search' : 'cnt_archive_search_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%9D%B1%E6%96%B9%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%A0%81',
'cnt_other' : 'cnt_other_%E5%85%A7%E9%A0%81_%E5%85%B6%E4%BB%96',
'cnt_archive_news_column' : 'cnt_archive_news_column_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%96%87%E7%AB%A0iframe-%E6%9D%B1%E6%96%B9%E6%97%A5%E5%A0%B1%E6%AD%A3%E8%AB%96%20/%20%E5%8A%9F%E5%A4%AB%E8%8C%B6%20/%20%E9%BE%8D%E9%96%80%E9%99%A3',
'cnt_archive_china_world_column' : 'cnt_archive_china_world_column_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%96%87%E7%AB%A0iframe-%E7%A5%9E%E5%B7%9E%E8%A7%80%E5%AF%9F%20/%20%E4%B8%96%E7%95%8C%E8%A6%96%E7%B7%9A',
'cnt_archive_finance_column' : 'cnt_archive_finance_column_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%96%87%E7%AB%A0iframe-%E7%94%A2%E8%A9%95',
'cnt_archive_lifestyle_column' : 'cnt_archive_lifestyle_column_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%96%87%E7%AB%A0iframe-%E5%89%AF%E5%88%8A%E5%B0%88%E6%AC%84%E6%96%87%E7%AB%A0',
'cnt_archive_other_column' : 'cnt_archive_other_column_%E5%85%A7%E9%A0%81_%E6%98%94%E6%97%A5%E6%96%87%E7%AB%A0iframe-%E5%85%B6%E4%BB%96',
'polling' : 'polling_%E6%B0%91%E6%84%8F%E4%B8%AD%E5%BF%83',
'promo_contents' : 'promo_contents_%E6%9D%B1%E6%96%B9%E6%96%B0%E7%89%88_%E6%84%8F%E8%A6%8B%E7%AE%B1',
'yahoo_search' : 'yahoo_search_Yahoo_iframe%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%A0%81',
'facebook' : 'facebook_Facebook_%E5%88%86%E4%BA%AB%E5%9B%9E%E9%A5%8B',
'promo_comments' : 'promo_comments_%E7%94%A8%E6%88%B6%E6%84%8F%E8%A6%8B%E6%94%B6%E9%9B%86' },
	
	content_view : function( path ) {

		_udn = this.domain;
		_ugifpath= this.ugifpath;
		
		_var_cat = 'html';
		_var_action = 'pageview';
		__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching(getUrchinSect()));
		urchinTracker(path);
		//Urchin by joe
		//Urchin by joe
		function getUrchinSect() {
			var rtn;
			var s = ODN.sect;
			var l3 = ODN.sect_L3;
			var ad = ODN.isAD;
			if (ODN.href.indexOf('/polling/') != -1) {
				rtn = 'polling';

			} else if (s == 'main') {
				rtn = 'index';
			} else if (s == 'news') {
				if ((l3 == 'index' && !ad) || (l3 == '' && !ad)) {
					rtn = 'main_news';
				} else if ( l3 == 'showall') {
					rtn = 'cnt_event_showall';
				} else {
					rtn = 'cnt_news';
				}
			} else if (s == 'china_world') {
				if ((l3 == 'index' && !ad) || (l3 == '' && !ad)) {
					rtn = 'main_china_world';
				} else {
					rtn = 'cnt_china_world';
				}
			} else if (s == 'finance') {
				if ((l3 == 'index' && !ad) || (l3 == '' && !ad)) {
					rtn = 'main_finance';
				} else {
					rtn = 'cnt_finance';
				}
			} else if (s == 'entertainment') {
				if ((l3 == 'index' && !ad) || (l3 == '' && !ad)) {
					rtn = 'main_entertainment';
				} else {
					rtn = 'cnt_entertainment';
				}
			} else if (s == 'lifestyle') {
				if ((l3 == 'index' && !ad) || (l3 == '' && !ad)) {
					rtn = 'main_lifestyle';
				} else {
					rtn = 'cnt_lifestyle';
				}
			} else if (s == 'adult') {
				rtn = 'cnt_adult';
			} else if (s == 'sport') {
				rtn = 'cnt_sport';
			} else if (s == 'charity') {
				rtn = 'cnt_charity';
			} else if (s == 'sitemap') {
				rtn = 'cnt_sitemap';
			} else if ( (ODN.href.indexOf('/archive/') != -1) && (ODN.href.indexOf('html') != -1) && (ODN.href.indexOf('kw') != -1) ) {
				rtn = 'cnt_archive_search';
			} else if ( (ODN.href.indexOf('/archive/') != -1) && (ODN.href.indexOf('index.html') != -1) ) {
				rtn = 'cnt_archive_index';	
			} else if ( (ODN.href.indexOf('/archive/') != -1) && (ODN.href.indexOf('cnt.html') != -1) ) {
				rtn = 'cnt_archive';
			} else if (ODN.href.indexOf('/archive/') != -1) {
				rtn = 'cnt_archive';
			} else if ( s == '') {
				if ( l3 == 'showall' ) {
					rtn = 'cnt_event_showall';	
				}else {
					rtn = 'other';
				}
			} else {
				rtn = 'other';	
			}
			return rtn;
		}

		if ($.urlParams.get('facebook') === 'y') {
			_udn = this.domain;
			_ugifpath= this.ugifpath;
			//urchinTracker(path);
			_var_cat = 'sharing';
			_var_action = 'pageview';
			__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("facebook"));

		}
		
	},
	
	super_banner_view : function( path ) {
		
		var title = '';
		var temptitle = '';
		if ( parent && (path.indexOf('/ifm/') != -1)  ) {
			
			_udn = this.domain;
			_ugifpath= this.ugifpath;
			temptitle = _ubd.title;
		
			_var_cat = 'ads';
			_var_action = 'pageview';
		
			if (path.indexOf('/ifm/m_news/') != -1) {
				//title = "%E8%A6%81%E8%81%9E%E6%B8%AF%E8%81%9E_%E4%B8%BB%E9%A0%81%E5%BB%A3%E5%91%8A";
				title = "要聞港聞 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("main_news_ads"));
				
			} else if (path.indexOf('/ifm/m_china_world/') != -1) {
				//title = "%E5%85%A9%E5%B2%B8%E5%9C%8B%E9%9A%9B_%E4%B8%BB%E9%A0%81%E5%BB%A3%E5%91%8A";
				title = "兩岸國際 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("main_china_world_ads"));
				
			} else if (path.indexOf('/ifm/m_finance/') != -1) {
				//title = "%E8%B2%A1%E7%B6%93_%E4%B8%BB%E9%A0%81%E5%BB%A3%E5%91%8A";
				title = "財經 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "main_finance_ads"));
				
			} else if (path.indexOf('/ifm/m_entertainment/') != -1) {
				//title = "%E5%A8%9B%E6%A8%82_%E4%B8%BB%E9%A0%81%E5%BB%A3%E5%91%8A";
				title = "娛樂 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching("main_entertainment_ads"));
				
			} else if (path.indexOf('/ifm/m_lifestyle/') != -1) {
				//title = "%E5%89%AF%E5%88%8A_%E4%B8%BB%E9%A0%81%E5%BB%A3%E5%91%8A";
				title = "副刊 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("main_lifestyle_ads"));
				
			} else if (path.indexOf('/ifm/news/') != -1) {
				//title = "%E8%A6%81%E8%81%9E%E6%B8%AF%E8%81%9E_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "要聞港聞 - 內頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_news_ads"));
				
			} else if (path.indexOf('/ifm/china_world/') != -1) {
				//title = "%E5%85%A9%E5%B2%B8%E5%9C%8B%E9%9A%9B_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "兩岸國際 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_china_world_ads"));
				
			} else if (path.indexOf('/ifm/finance/') != -1) {
				//title = "%E8%B2%A1%E7%B6%93_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "財經 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_finance_ads"));
				
			} else if (path.indexOf('/ifm/entertainment/') != -1) {
				//title = "%E5%A8%9B%E6%A8%82_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "娛樂 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "cnt_entertainment_ads"));
				
			} else if (path.indexOf('/ifm/lifestyle/') != -1) {
				//title = "%E5%89%AF%E5%88%8A_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "副刊 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_lifestyle_ads"));
				
			} else if (path.indexOf('/ifm/adult/') != -1) {
				//title ="%E7%94%B7%E6%A5%B5%E5%9C%88_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "男極圈 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "cnt_adult_ads"));
				
			} else if (path.indexOf('/ifm/sport/') != -1) {
				//title = "%E9%AB%94%E8%82%B2_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "體育 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_sport_ads"));
				
			} else if (path.indexOf('/ifm/charity/') != -1) {
				//title = "%E6%85%88%E5%96%84%E5%9F%BA%E9%87%91_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "慈善基金 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "cnt_charity_ads"));
				
			} else if (path.indexOf('/ifm/sitemap/') != -1) {
				//title = "%E6%96%B0%E8%81%9E%E7%B8%BD%E8%A6%BD_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "新聞總覽 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "cnt_sitemap_ads"));
				
			} else if (path.indexOf('/ifm/archive/') != -1) {
				//title = "%E6%98%94%E6%97%A5%E6%9D%B1%E6%96%B9%E8%A6%BD_%E5%85%A7%E7%89%88%E5%BB%A3%E5%91%8A";
				title = "昔日東方 - 內版廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_archive_ads"));
				
			} else if (path.indexOf('/ifm/m_adult/') != -1) {
				//title = "%E5%BB%A3%E5%91%8A";
				title = "男極圈 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "main_adult_ads"));
				
			} else if (path.indexOf('/ifm/m_archive/') != -1) {
				//title = "%E5%BB%A3%E5%91%8A";
				title = "昔日東方覽 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("main_archive_ads"));
				
			} else if (path.indexOf('/ifm/m_charity/') != -1) {
				//title = "%E5%BB%A3%E5%91%8A";
				title = "慈善基金 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "main_charity_ads"));
				
			} else if (path.indexOf('/ifm/m_sitemap/') != -1) {
				//title = "%E5%BB%A3%E5%91%8A";
				title = "新聞總覽 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("main_sitemap_ads"));
				
			} else if (path.indexOf('/ifm/m_sport/') != -1) {
				//title = "%E5%BB%A3%E5%91%8A";
				title = "體育 - 主頁廣告";
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("main_sport_ads"));
				
			} else {
				//title = "%E5%BB%A3%E5%91%8A";
				title = "廣告";
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "other_ads"));
				
			}
			_ubd.title = title;
			parent.urchinTracker(path);
			_ubd.title = temptitle;
		
		}
	},
	
	lightbox_view : function( path ) {
		
		if ( parent && (path.indexOf('/imageGallery') != -1)) {

			_udn = this.domain;
			_ugifpath= this.ugifpath;
			
			parent.urchinTracker(path);
			_var_cat = 'ads';
			_var_action = 'pageview';
			parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_lbox_image"));
				
		}

	},
	
	search_view : function(  path , qPath ) {
		
		if ( parent ) {
			_udn = this.domain;
			_ugifpath= this.ugifpath;
			// yahoo not add page, this pageview will add to archive
			parent.urchinTracker(qPath);
			_var_cat = 'yahoo';
			_var_action = 'pageview';
			parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("yahoo_search"));
		}
		
	},
	
	comments_view : function(  path ) {
		
		_udn = this.domain;
		_ugifpath= this.ugifpath;
		urchinTracker(path);
		_var_cat = 'html';
		_var_action = 'pageview';
		__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("promo_comments"));

		
	},
	
	column_view : function( path ) {
				
		if ( parent && (path.indexOf('/cnt/') != -1) ) {
			_udn = this.domain;
			_ugifpath= this.ugifpath;
			parent.urchinTracker(path);
			_var_cat = 'ads';
			_var_action = 'pageview';
		
			if (path.indexOf('/cnt/news/') != -1) {
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_archive_news_column"));
			} else if (path.indexOf('/cnt/china_world/') != -1) {
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_archive_china_world_column"));
			} else if (path.indexOf('/cnt/lifestyle/') != -1) {
				parent.__utmTrackEvent(_var_cat, _var_action, Urchin.getMatching("cnt_archive_lifestyle_column"));
			} else if (path.indexOf('/cnt/finance/') != -1) {
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching("cnt_archive_finance_column"));
			} else {
				parent.__utmTrackEvent(_var_cat, _var_action,Urchin.getMatching( "cnt_archive_other_column"));
			}
		}
	},

	getMatching : function ( str ) {
		if (typeof Urchin.matching[str] !== 'undefined')
			return Urchin.matching[str];
		else 
			return str;
	}	
}