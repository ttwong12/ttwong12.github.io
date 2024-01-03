$(document).ready( function() {
	
	if(document.location.hostname == "translate.itsc.cuhk.edu.hk") {
		$("a#linkSC").attr("id", "linkTC").html("&#x7E41;&#x9AD4;");  //&#x7E41;&#x9AD4; represents 繁體
		
		//Convert back all links to ebook the same as in Traditional Chinese Version
		//alert($("a[href*='/www.iso.cuhk.edu.hk/ebook/index.html']").length);
		$("a[href*='/www.iso.cuhk.edu.hk/ebook/index.html']").each(function() {
			var strUrl = $(this).attr("href").replace(/translate\.itsc\.cuhk\.edu\.hk\/uniTS\//, "");
			$(this).attr("href", strUrl);
		});
	}	
	
	//Make sure all elements containing superscript and subscript have a line-height greater than or equal to 1.3;
	//The following also related to sup, sub definition in style sheet /chinese/style/default.css 
	//Reference url about this implementation: http://www.cs.tut.fi/~jkorpela/www/linespacing.html
    $("*:has(>sup, >sub)").each(function () {
        var strLineHeight = $(this).css("line-height");
        var iLineHeight;
        var iFontSize;

        if (/[a-z]+/gi.test(strLineHeight)) {
            iLineHeight = $(this).css("line-height").replace(/[a-z]+/gi, "");
            iFontSize = $(this).css("font-size").replace(/[a-z]+/gi, "");

            iLineHeight = Math.round((iLineHeight * 100) / (iFontSize * 1)) / 100;

        } else {
            iLineHeight = strLineHeight * 1;
        }

        if (iLineHeight < 1.3) {
            $(this).css("line-height", 1.3);
        }

    });
	

	//Example, check by filename
	//<a href="/chinese/about-us/publication-sch/publication-sch-10.html" rel="/chinese/about-us/publication-sch/publication-sch-?\d*\.html">Publication Schedules</a>
	
	//Example, check by folder
	//<a href="/chinese/about-us/publication-sch/publication-sch-10.html" rel="/chinese/about-us/">Publication Schedules</a>


	var strCurrentUrl = document.location.pathname;

	//Remove sub-item of current folder
	$("div#subheader-bottom >div#menu >ul >li >a").each(function() {
		var strSectionFolder = $(this).attr("href").replace(/^.*\/([^\/]+)\/[^\/]+$/, "/$1/");
		if (strSectionFolder != "/english/" && strSectionFolder != "/chinese/") {
			if (strCurrentUrl.indexOf(strSectionFolder) >= 0) {
				$(this).removeClass("sub").addClass("current");
				//$(this).closest("li").find("table,div.panel").remove();
			}
		}
	});
		
	$("div#panelISOPub >ul").each(function() {
		var ul_width = $(this).width();
		$(">li", $(this)).width(ul_width);
 	});
	
	$(window).load(function() {
		alignHeight();
	});
	
	$("div.sizing span.t1 a, div.sizing span.t2 a, div.sizing span.t3 a").click( function() {
		alignHeight();
	});
	
	function alignHeight() {
		var iMaxHeight = 0;
		$("div#menu div#panelISOPub ul").css("height", "");
		$("div#menu div#panelISOPub ul").each( function() {
			iMaxHeight = $(this).height() > iMaxHeight ? $(this).height() : iMaxHeight;
		});
		$("div#menu div#panelISOPub ul").each( function() {
			$(this).height(iMaxHeight);
		});
		
		//$("div#menu div#panelISOPub").height(iMaxHeight + $("div#menu div#panelISOPub div.head").height());
	}
	
    //Remove the ebook button if the client is using IOS
    if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
		$("div#side_menu a[rel], div#menu a[rel]").each(function() {
			var strUrl = $(this).attr("rel");
			$(this).attr("href", strUrl);
			if (/(\.aspx|\.html?)$/.test(strUrl) == false) {
				$(this).attr("target", "_blank");
			}
		});
    }

		
	$("div#side_menu a").each( 
		function() {
			
			var strHref = "";
			var objRegexp;
			var bCorrectUrl = false;
			
			if ($(this).attr("rel").length > 0) {
				//Using Regular Expression to check
				var arrRel = $(this).attr("rel").split(",");
				strHref = $(this).attr("rel");
				objRegexp = new RegExp(strHref);
				bCorrectUrl = objRegexp.test(strCurrentUrl);
			} else {
				strHref = $(this).attr("href");
				bCorrectUrl = (strHref == strCurrentUrl) ? true : strCurrentUrl.replace(/index\d*\.(aspx|html)/, "").replace(/previous-issues\d*\.aspx/, "index.aspx") == strHref;
			}
			
			if (bCorrectUrl) {
				//Find the right item
				//Check which layer the current item is situated.
				if ($(this).closest("div")[0].id == "sub_side_menu") {
					//Inner Layer
					//1. Highlight -> addClass = current					
					$(this).addClass("current");
					//2. Show the current layer
					$(this).closest("div").show();
				} else {
					//Outer Layer
					//1. Highlight -> addClass = current
					$(this).addClass("current");
					//Show the sub-layer if existing
					var $objNextItem = $(this).next();

					if ($objNextItem.length > 0) {  
						if ($objNextItem[0].id == "sub_side_menu") {
						$objNextItem.show();
						}
					}
				}
			}
	});

  //The following section is to update the url in "translate.itsc.cuhk.edu.hk" from uniTS "mode" to "gb" mode
  $(document).ready(function() {
	if (document.location.hostname == "translate.itsc.cuhk.edu.hk") {
		
		//Calendar or Weilun
		var arrChangeURL = [{"pattern":/\/www.cuhk.edu.hk(:\d+)?\/iso\/(calendar|weilun)\//, "from":"http://translate.itsc.cuhk.edu.hk/uniTS/", "to":"http://translate.itsc.cuhk.edu.hk/gb/" }];
	
		$("a").each(function() {
			for (i in arrChangeURL) {
				var strURL = $(this).attr("href");
				if (arrChangeURL[0].pattern.test(strURL)) {
					$(this).attr("href", strURL.replace(arrChangeURL[0]["from"], arrChangeURL[0]["to"]));
				}
			}
			
		});
	}
  });
  //End of section	
	
	//Social Bookmarking
	$("div.tools img[id]").css('cursor','pointer');
	
	
	//Twitter Bookmarking
	$("img#bookmark-twitter").click(function() {
		window.open('http://twitter.com/home?status='+encodeURIComponent(document.title)+'+'+encodeURIComponent(document.location.href),'_blank','width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');

		bookmarkingLogging('Twitter');
	})
	
	//Facebook Bookmarking
	$("img#bookmark-facebook").click(function() {
		window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(document.location.href)+'&t='+encodeURIComponent(document.title),'_blank','width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');

		bookmarkingLogging('Facebook');
	})
	
	//Google Bookmarking
	$("img#bookmark-google").click(function() {
		window.open('http://www.google.com/bookmarks/mark?op=edit&bkmk='+encodeURIComponent(document.location.href)+'&title='+encodeURIComponent(document.title)	,'_blank','width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');

		bookmarkingLogging('Google');
	})
	
	//Baidu Bookmarking
	$("img#bookmark-baidu").click(function() {
		window.open('http://cang.baidu.com/do/add?it='+encodeURIComponent(document.title.substring(0,76))+'&iu='+encodeURIComponent(location.href)+'&fr=ien#nw=1','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
		
		bookmarkingLogging('Baidu');
		
	})
	
	//QQ Bookmarking
	$("img#bookmark-qq").click(function() {
		window.open('http://shuqian.qq.com/post?from=3&title='+encodeURIComponent(document.title)+'&uri='+encodeURIComponent(document.location.href)+'&jumpback=2&noui=1','favit','width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');

		bookmarkingLogging('QQ');
	})
	
	function bookmarkingLogging(strProvider) {
		var strTitle = document.title;
		var strUrl = document.location.href;
		
        $.get('http://mmlab.itsc.cuhk.edu.hk/iso/social-bookmarking-stat.aspx', 
			{'title': strTitle, 'provider':strProvider, 'url':strUrl}, 
			function(data) {
				if (/true/i.test(data.status)) { //If Status == "true"
					//alert(data.reason);
                } else {
					//alert(data.reason);
                }
            }, 'jsonp')
	}

	//Search Quick Form Submit
	/*     /chinese/includes/publications/article-search.html*/

	var arrIncludeSearchInRightCol = ["/chinese/about-us/", "/chinese/publications/[\\w-]+/", "/chinese/publications/(cuhk-in-pictures|five-research-areas)\.html", "/chinese/features/", "/chinese/resource/", "/chinese/(site-map|disclaimer|contact-us|privacy)\.html"];
	var arrIncludeSearchInLeftCol = ["/chinese/publications/(publications|others|online-resources)\.aspx"];

	for (i = 0; i < arrIncludeSearchInRightCol.length; i++) {
	    //var strUrl = document.location.href;
	    var objRE = new RegExp(arrIncludeSearchInRightCol[i]);

	    if (objRE.test(strCurrentUrl) == true) {
	        $.get("/chinese/includes/publications/article-search.html", function (strHtml) {
	            var $searchbox = $(strHtml);
				
				var $backissuebox = $("div#rightCol div.narBox:has(span#lblBackIssues, div.narBoxMid div.BackIssuesBox):first");
				
				if ($backissuebox.length > 0) {
					$searchbox.insertBefore($backissuebox);
				} else {
					$("div#rightCol").prepend($searchbox);
				}
				
	            $("form#searchform").submit(function (e) {
	                e.preventDefault();
	                var strKeyword = $("input:text.search", $(this)).val();
	                document.location.href = '/chinese/publications/search.aspx#keyword=' + encodeURIComponent(strKeyword);
	            });
	        }, "html");
	    }
	}

	for (i = 0; i < arrIncludeSearchInLeftCol.length; i++) {
	    //var strUrl = document.location.href;
	    var objRE = new RegExp(arrIncludeSearchInLeftCol[i]);

	    if (objRE.test(strCurrentUrl) == true) {
	        $.get("/chinese/includes/publications/article-search.html", function (strHtml) {
	            var $searchbox = $(strHtml);
	            $("div#leftCol").prepend($searchbox);
	            $("form#searchform").submit(function (e) {
	                e.preventDefault();
	                var strKeyword = $("input:text.search", $(this)).val();
	                document.location.href = '/chinese/publications/search.aspx#keyword=' + encodeURIComponent(strKeyword);
	            });
	        }, "html");
	    }
	}


})

//Google Analytics

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-15251751-2']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//End of Google Analytics