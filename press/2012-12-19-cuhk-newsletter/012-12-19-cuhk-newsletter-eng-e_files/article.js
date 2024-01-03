var bShiftPrevImage = false;
var bShiftNextImage = true;

var iCurrentPhotoPage = 1;
var iPhotoNumPerPage = 3;
var iPhotoNum;

$(document).ready(function () {

    var currentpage = $.query.get("page");

    iPhotoNum = $("div#photo_col div.image-item").length;

    $("img#image-gallery-back").css("cursor", "auto"); //Disable the pointer cursor of Previous Image button at the start time.

    //Slimbox
    $("div#photo_col a[rel], a[rel='image-gallery']").slimbox({},
        function (el) {
            return [el.href, $(el).closest("div.image-wrapper").next().find("h5").html()];
        }
    );

    if (iPhotoNum <= iPhotoNumPerPage) {
        $("div#photo_col div#button-panel").remove();
        if ($("div#photo_col").height() < 200) {
            $("div#photo_col").height(200);
        }
    }
    else {
        $("div#photo_col div.image-item:gt(2)").hide();
    }

    $("div#photo_col div#button-panel img.photo_next")
    .hover(
        function () {
            if ($(this).hasClass("end") == false) {
                $(this).attr("src", $(this).attr("src").replace("_off.gif", "_on.gif"));
            }
        },

        function () {
            if ($(this).hasClass("end") == false) {
                $(this).attr("src", $(this).attr("src").replace("_on.gif", "_off.gif"));
            }
        }
    )
    .click(function () {

        if ($(this).hasClass("end") == false) {
            $("div#photo_col div.image-item:visible").hide();
            iCurrentPhotoPage++;
            for (i = ((iCurrentPhotoPage - 1) * iPhotoNumPerPage); i < ((iCurrentPhotoPage) * iPhotoNumPerPage); i++) {
                $("div#photo_col div.image-item:eq(" + i + ")").show();
            }

            var $objPrevButton = $("div#photo_col div#button-panel img.photo_prev");
            if ($objPrevButton.hasClass("end")) {
                var strSrc = $objPrevButton.attr("src");
                var strNewSrc = strSrc.replace("_blank.gif", "_off.gif");
                $objPrevButton.removeClass("end").css("cursor", "pointer").attr("src", strNewSrc);
            }

            if (iCurrentPhotoPage == parseInt(iPhotoNum / iPhotoNumPerPage) * 1 + (iPhotoNum % iPhotoNumPerPage == 0 ? 0 : 1)) {
                var strSrc = $(this).attr("src");
                var strNewSrc = strSrc.replace(/_(on|off).gif$/, "_blank.gif");
                $(this).addClass("end").css("cursor", "auto").attr("src", strNewSrc);
            }
        } else {
        }

    });

    $("div#photo_col div#button-panel img.photo_prev")
    .hover(
        function () {
            if ($(this).hasClass("end") == false) {
                $(this).attr("src", $(this).attr("src").replace("_off.gif", "_on.gif"));
            }
        },

        function () {
            if ($(this).hasClass("end") == false) {
                $(this).attr("src", $(this).attr("src").replace("_on.gif", "_off.gif"));
            }
        }
    )
    .click(function () {

        if ($(this).hasClass("end") == false) {
            $("div#photo_col div.image-item:visible").hide();
            iCurrentPhotoPage--;
            for (i = ((iCurrentPhotoPage - 1) * iPhotoNumPerPage); i < ((iCurrentPhotoPage) * iPhotoNumPerPage); i++) {
                $("div#photo_col div.image-item:eq(" + i + ")").show();
            }

            var $objNextButton = $("div#photo_col div#button-panel img.photo_next");
            if ($objNextButton.hasClass("end")) {
                var strSrc = $objNextButton.attr("src");
                var strNewSrc = strSrc.replace("_blank.gif", "_off.gif");
                $objNextButton.removeClass("end").css("cursor", "pointer").attr("src", strNewSrc);
            }

            if (iCurrentPhotoPage == 1) {
                var strSrc = $(this).attr("src");
                var strNewSrc = strSrc.replace(/_(on|off).gif$/, "_blank.gif");
                $(this).addClass("end").css("cursor", "auto").attr("src", strNewSrc);
            }

        } else {
        }

    });

    var strCurrentUrl = document.location.href;
    var $objCurrentItem = null;

    //Find Sub-Article
    $("span#lblTOC >ul:first li").each(function () {
        if ($(this).find(">a").length > 0) {
            var strTOCItemUrl = $(this).find(">a").attr("href");
            var re = new RegExp(strTOCItemUrl.replace("?", "\\?") + "&?.*$");
            //alert(strTOCItemUrl + " : " + strCurrentUrl);
            //if (strCurrentUrl.indexOf(strTOCItemUrl) >= 0) {
            if (re.test(strCurrentUrl)) {
                $objCurrentItem = $(this);
            }
        }
    });

    if ($objCurrentItem != null) {
	
		//Hard code - remove sub-article list in article "Meeting Fresh Faces/校園新臉孔" (id:54144) in the article
		if (location.search.indexOf("articleid=54144") >= 0) {
			//Do Nothing
		} else {
			var $subArticleList = $("<ul id='subArticleList'></ul>");
			$objCurrentItem.find(">ul >li").each(function () {
				$(this).clone().appendTo($subArticleList);
			});

			$subArticleList.appendTo("div#subArticle");
			$("div#subArticle").appendTo("span#lblArticleContent");

			//20110902 - All (level 3) items are hidden if their parents (level 2) items has link.
			$(" >li:has(>a) >ul", $subArticleList).hide();
		}
	
    }

    //Flattened the TOC Hierarchy.
    //Find Previous and Next Article
    /*var $FlattenedTOCHierarchy = $("<ul></ul>");

    $("span#lblTOC >ul:first li").each(function () {
    $objClone = $(this).clone();
    //alert("Before:\r\n " + $objClone.html());
    $objClone.find(">ul").remove();
    //alert("After:\r\n " + $objClone.html());
    $objClone.appendTo($FlattenedTOCHierarchy);
    });

    $objCurrentItem = null;

    $(">li", $FlattenedTOCHierarchy).each(function () {

    if ($(this).find(">a").length > 0) {
    var strTOCItemUrl = $(this).find(">a").attr("href");
    var re = new RegExp(strTOCItemUrl.replace("?", "\\?") + "$");
    //alert(strTOCItemUrl + " : " + strCurrentUrl);
    //if (strCurrentUrl.indexOf(strTOCItemUrl) >= 0) {
    if (re.test(strCurrentUrl)) {
    $objCurrentItem = $(this);
    }
    }
    });*/

    $("li", $("span#lblTOC >ul:first li")).each(function () {

        if ($(this).find(">a").length > 0) {
            var strTOCItemUrl = $(this).find(">a").attr("href");
            var re = new RegExp(strTOCItemUrl.replace("?", "\\?") + "$");
            //alert(strTOCItemUrl + " : " + strCurrentUrl);
            //if (strCurrentUrl.indexOf(strTOCItemUrl) >= 0) {
            if (re.test(strCurrentUrl)) {
                $objCurrentItem = $(this);
            }
        }
    });

    if ($objCurrentItem) {
        if ($objCurrentItem.prevAll("li").length > 0) {
            var $objTemp = $objCurrentItem.prevAll("li").first();
            var strText;
            var strLink;

            if ($objTemp.find(">a").length > 0) {
                strText = $objTemp.find(">a").text();
                strLink = $objTemp.find(">a").attr("href");
            } else {
                strText = $objTemp.find(">span").text() + ": ";

                var $objInnerTemp = $objTemp.find(">ul >li:first >a");

                strText += $objInnerTemp.text();
                strLink = $objInnerTemp.attr("href");
            }

            if (strLink != undefined) {
                var $link = $("<a></a>").attr("href", strLink).text(strText);
                $("<img></img>").attr("src", "/english/images/newsletter/news/but_prev_artic.gif").attr("alt", "Previous Article").attr("border", "0").css("display", "inline").css("padding-bottom", "5px").prependTo($link);
                $("<br/>").insertAfter($link.find("img"));
                $link.appendTo("div#prevArticle");
            }

        }

        if ($objCurrentItem.nextAll("li:has('>a')").length > 0) {
            var $objTemp = $objCurrentItem.nextAll("li").first();
            var strText;
            var strLink;
            if ($objTemp.find(">a").length > 0) {
                strText = $objTemp.find(">a").text();
                strLink = $objTemp.find(">a").attr("href");
            } else {
                strText = $objTemp.find(">span").text() + ": ";

                var $objInnerTemp = $objTemp.find(">ul >li:first >a");

                strText += $objInnerTemp.text();
                strLink = $objInnerTemp.attr("href");
            }

            if (strLink != undefined) {
                var $link = $("<a></a>").attr("href", strLink).text(strText);
                $("<img></img>").attr("src", "/english/images/newsletter/news/but_next_artic.gif").attr("alt", "Next Article").attr("border", "0").css("display", "inline").css("padding-bottom", "5px").prependTo($link);
                $("<br/>").insertAfter($link.find("img"));
                $link.appendTo("div#nextArticle");
            }

        }
    }


    var iMaxheight = 500;
    var iLeastheight = 170;
    var iHeight = 0;
    var iPages = 1;


    $("div#pageNo >a").live('click', function () {
        if ($("~ span.pageNo", $(this)).length == 0 && $("~ a", $(this)).length == 0) {
            //Clicked page is the last page
            $("div#fb-comment").show();
        } else {
            //Clicked page is the not last page
            $("div#fb-comment").hide();
        }
        $("div#pageNo >span.pageNo").each(function () {
            $(this).replaceWith(
                    function () {
                        return "<a href='javascript:;'>" + $(this).text() + "</a>";
                    }
                );
        });


        $(this).replaceWith(function () {
            return "<span class='pageNo'>" + $(this).text() + "</span>";
        });

        var iSelectedPage = $(this).text();

        $("span#lblArticleContent >*").hide();

        if (iSelectedPage * 1 > 1) {
            $("span#lblArticleContent >div.pagedivider:eq(" + (iSelectedPage * 1 - 2) + ")").nextUntil("div.pagedivider").show();
            //Remove any leading empty paragraph on the top of the page after div.pagedivider tag
            var bInitialEmpty = true;
            $("span#lblArticleContent >div.pagedivider:eq(" + (iSelectedPage * 1 - 2) + ")").nextUntil("div.pagedivider", "p").each(function () {
                if ($.trim($(this).text()) == "" && bInitialEmpty) {
                    $(this).remove();
                } else {
                    bInitialEmpty = false;
                }
            });
        } else {
            $("span#lblArticleContent >div.pagedivider:first").prevAll().show();
        }

    });

    $("span#lblArticleContent >*").each(function () {
        iHeight += $(this).height();
        if (iHeight >= iMaxheight) {
            var bCondition = true;

            //If it is the last block tag in the article content, don't add pagedivider tag
            bCondition = this != $("span#lblArticleContent >*:last-child")[0];

            bCondition = !($(this).hasClass("heading") || $(this).hasClass("sectionhead") ||
                    $(this).hasClass("subhead") || $(this).hasClass("subhead2") ||
                    $(this).hasClass("subhead3") || $(this).hasClass("subhead4") ||
                    $(this).hasClass("introduction") || $(this).hasClass("quote") ||
                    $(this).hasClass("caption") || $(this).hasClass("highlight") ||
                    $(this).hasClass("notes"));

            if ($(this).next().is("p.notes")) {
                bCondition = false;
            }
            if ($(this).is("p.notes") && $(this).next().is(":not(p.notes)")) {
                bCondition = true;
            }

            if (bCondition) {
                $("<div class='pagedivider'></div>").insertAfter($(this));
                iHeight = 0;
                iPages++;
            }
        }
    });

    //Remove the last pagedivider if the height of the last page is not longer than iLeastheight.
    if (iHeight < iLeastheight) {
        $("span#lblArticleContent >div.pagedivider:last").remove();
        iPages--;
    }

    if (iPages > 1) {
        $("<span>pages </span>").appendTo("div#pageNo");
        for (i = 1; i <= iPages; i++) {
            $("<a href=\"javascript:;\"></a>").text(i).appendTo("div#pageNo");
            $("div#pageNo").html($("div#pageNo").html() + "&nbsp;");
        }

        //Click to current page if current page is specified

        if (currentpage == "last") {
            $("div#pageNo >a:last").click();
        } else if (currentpage == "first") {
            $("div#pageNo >a:first").click();
        } else {
            $("div#pageNo >a:first").click();
        }

        //End of Click to current page if current page is specified

        $("div#fb-comment").hide();

    } else {
    }

    //Special Implementation for table or cell <td> contains class: border-bottom, border-bottom2, border-top, border-left, border-right
    $("span#lblArticleContent table:has('td.border-bottom, td.border-bottom2, td.border-top, td.border-left, td.border-right')").addClass("noborder");


    //Remove "Campus News/校園消息" in breadcrumb
    if ($("span#lblBreadCrumb").html().indexOf("Campus News&nbsp;&gt;&nbsp;") >= 0) {
        $("span#lblBreadCrumb").html($("span#lblBreadCrumb").html().replace("Campus News&nbsp;&gt;&nbsp;", ""));
    }
    if ($("span#lblBreadCrumb").html().indexOf("校園消息&nbsp;&gt;&nbsp;") >= 0) {
        $("span#lblBreadCrumb").html($("span#lblBreadCrumb").html().replace("校園消息&nbsp;&gt;&nbsp;", ""));
    }
	
    //Back Issues
    $("span#lblBackIssues > div.narBoxMid > h3").css("cursor", "pointer").click(function (event) {

        var $objAccordion = $(this).next("div.accordion");

        if ($objAccordion.find(":visible").length == 0) {
			$objAccordion.show();
            $objAccordion.trigger("setAccordionEvent");
			//jScrollPaneTuned();
        } else {
            $objAccordion.hide();
        }

    });

	$("span#lblBackIssues > div.narBoxMid > div.accordion").hide();
	
    //Social-bookmarking
    $("div#social-bookmarking img[id]").css('cursor', 'pointer');

    var strTitleExtension = "";
    if ($("div#article >h1:first").length == 1) {
        strTitleExtension = "::" + $("div#article >h1:first").text();
    }

    //Twitter Bookmarking
    $("img#bookmark-twitter").click(function () {
        window.open('http://twitter.com/home?status=' + encodeURIComponent(document.title + strTitleExtension) + '+' + encodeURIComponent(document.location.href), '_blank', 'width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');
        bookmarkingLogging('Twitter');
    })

    //Facebook Bookmarking
    $("img#bookmark-facebook").click(function () {
        window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(document.location.href) + '&t=' + encodeURIComponent(document.title + strTitleExtension), '_blank', 'width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');
        bookmarkingLogging('Facebook');
    })

    //Google Bookmarking
    $("img#bookmark-google").click(function () {
        window.open('http://www.google.com/bookmarks/mark?op=edit&bkmk=' + encodeURIComponent(document.location.href) + '&title=' + encodeURIComponent(document.title + strTitleExtension), '_blank', 'width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');
        bookmarkingLogging('Google');
    })

    //Baidu Bookmarking
    $("img#bookmark-baidu").click(function () {
        window.open('http://cang.baidu.com/do/add?it=' + encodeURIComponent((document.title + strTitleExtension).substring(0, 76)) + '&iu=' + encodeURIComponent(location.href) + '&fr=ien#nw=1', '_blank', 'scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
        bookmarkingLogging('Baidu');
    })

    //QQ Bookmarking
    $("img#bookmark-qq").click(function () {
        window.open('http://shuqian.qq.com/post?from=3&title=' + encodeURIComponent(document.title + strTitleExtension) + '&uri=' + encodeURIComponent(document.location.href) + '&jumpback=2&noui=1', 'favit', 'width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');

        bookmarkingLogging('QQ');
    })

    function bookmarkingLogging(strProvider) {
        var strTitle = document.title;
        var strUrl = document.location.href;

        $.get('http://mmlab.itsc.cuhk.edu.hk/iso/social-bookmarking-stat.aspx',
			{ 'title': strTitle, 'provider': strProvider, 'url': strUrl },
			function (data) {
			    if (/true/i.test(data.status)) { //If Status == "true"
			        //alert(data.reason);
			    } else {
			        //alert(data.reason);
			    }
			}, 'jsonp')
    }

    //End of Social Bookmarking

    //Remove Social Bookmarking and "Email to Your Friends" Section for "Personalia" section

    var bUnderPersonalia = false;

    $("span#lblBreadCrumb a").each(function () {
        if ($.trim($(this).text()) == "Personalia") {
            bUnderPersonalia = true;
        }
    })

    if (bUnderPersonalia) {
        $("div#social-bookmarking").prev("br").remove();
        $("div#social-bookmarking").remove();

        var $divEmailToFriend = $("a#emailtofriend").closest("div.narBox")
        $divEmailToFriend.prev("br").remove();
        $divEmailToFriend.remove();
    }

    //End of Remove Social Bookmarking and "Email to Your Friends" Section for "Personalia" section
})

//Email to friends
$(document).ready(function () {
    var strMode = "";

    if (document.location.href.indexOf("/article") >= 0) {
        strMode = "article";
    } else {
        strMode = "issue";
    }

    $("a#emailtofriend").click(function (event) {
        event.preventDefault();
        $.fancybox({
            'padding': 0,
            'href': 'email-to-friend.aspx' + document.location.search + (document.location.search.length == 0 ? "?" : "&") + "mode=" + strMode,
            'width': 900,
            'height': 567,
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'type': 'iframe'
        })
    });
});

//Facebook comment social plugin
$(document).ready(function () {
    if ($("#fb-comment").length > 0) {

        strUrl = $("head meta[property='og:url']").attr("content");
		
		strUrl = strUrl.replace("/cuhk-newsletter/", "/newsletter/").replace(":88/", "/");
		
        var strHtml = 'There is/are <fb:comments-count href="' + strUrl + '" ></fb:comments-count>&nbsp;comment(s).';
        strHtml += '<fb:comments mobile="false" href="' + strUrl + '" num_posts="5" width="500"></fb:comments>';
        $("#fb-comment").html(strHtml);

        $("<span id='fb_like' style='margin-left:5px;'></span>").appendTo("div#article:first h1:first");
        $("#fb_like").html('<fb:like href="' + strUrl + '" send="false" layout="button_count" width="120" show_faces="true"></fb:like>');

    }
});

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