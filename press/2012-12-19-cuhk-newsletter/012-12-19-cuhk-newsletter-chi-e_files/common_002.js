$(document).ready(function () {

    $("a#btnTOC").click(function (event) {
        event.preventDefault();
        $("div#toc").toggle("slide",
			function () {
			    var imgsrc = $("a#btnTOC").find(">img").attr("src");
			    if ($("div#toc").is(":visible")) {
			        $("a#btnTOC").find(">img").attr("src", imgsrc.replace("_1", "_2"));
			    } else {
			        $("a#btnTOC").find(">img").attr("src", imgsrc.replace("_2", "_1"));
			    }
			});
    })
	
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

    $("div#btnTOCClose").click(function (event) {
        event.preventDefault();
        $("div#toc").toggle("slide", null, "slow");
    })

    $("div.toc ul").css("cursor", "default");
    $("div.toc ul li:has('>ul')").css("cursor", "pointer");


    $("div.toc ul li").click(function (e) {
        e.stopPropagation();
    });
    $("div.toc ul li:has('>ul')").click(function (e) {        
        $(this).find(">ul").toggle('fast', function () {
            if ($(this).is(":hidden")) {
                //$(this).prev("a, span").removeClass("drop").addClass("on");
                $(this).parent().removeClass("drop").addClass("on");
            } else {
                //$(this).prev("a, span").removeClass("on").addClass("drop");
                $(this).parent().removeClass("on").addClass("drop");
            }
        });
    });

    $("div.toc ul li a").click(function (e) {
        e.stopPropagation();
    });

    //Reset the JScrollPane Height
    if ($('div.scroll-pane-content').length > 0) {
        $("div.sizing a").click(function () {
            jScrollPaneTuned();
        });

        $(window).load(function () {
            jScrollPaneTuned();
        });
    }

    function jScrollPaneTuned() {
        $('div.scroll-pane-content:visible').each(function () {
            if ($(this).parent().hasClass("jScrollPaneContainer")) {
                $(this).jScrollPane({ showArrows: true, dragMinHeight: 40, dragMaxHeight: 40 });
            } else if ($(this).height() >= 300 ){
				$(this).height(300);
				$(this).jScrollPane({ showArrows: true, dragMinHeight: 40, dragMaxHeight: 40 });
			}
        });
    }

    $("div.scroll-pane-content").each(function () {
        $(this).width(169);

        //If the height is over 300px, set scrollbar using jScrollPane
        $(this).css("height", "auto");
        if ($(this).height() >= 300) {
            $(this).css("height", 300);
            $(this).jScrollPane({ showArrows: true, dragMinHeight: 40, dragMaxHeight: 40 });
        } else {
        }
    });

	$("span#lblBackIssues li img").each(function() {
		$(this).css("cursor", "pointer").click(function() {
			var strUrl = $(this).closest("li").find("a").attr("href");
			if (/^https?:/.test(strUrl) && ! /translate.itsc.cuhk.edu.hk\/\w+\/www.iso.cuhk.edu.hk/.test(strUrl)) {
				window.open($(this).closest("li").find("a").attr("href"));
			} else {
				document.location.href= $(this).closest("li").find("a").attr("href");
			}
		});
	});

	$accordion_def = 
		{ fillSpace: false, autoHeight: false, height: 200,
            change: function (event, ui) {
                //If the active content of div.accordion contains inner accordion (i.e. div.accordion), remove the bottom border
                if ($("div.accordion", ui.newContent).length > 0) {
                    var $innerAccordion = $(">div.accordion", ui.newContent);
					
					$innerAccordion.each(function() {
						if ($(this).hasClass("Accordion-called") == false) {
							$(this).trigger("setAccordionEvent");
						}
					});
					
                    var iActiveTab = $innerAccordion.accordion("option", "active");

                    if (iActiveTab == $(">h3.ui-accordion-header", $innerAccordion).length - 1) {
                        //If the active tab is the last one
                        $(">h3.ui-accordion-header:last", $innerAccordion).next().css("border-bottom", "0");
                        $(">h3.ui-accordion-header:last", $innerAccordion).css("border-bottom", "1px");
                    } else {
                        $(">h3.ui-accordion-header:last", $innerAccordion).next().css("border-bottom", "1px");
                        $(">h3.ui-accordion-header:last", $innerAccordion).css("border-bottom", "0");
                    }
                } else if ($(this).closest("div.accordion").length > 0) {
                    var iActiveTab = $(this).accordion("option", "active");
                    if (iActiveTab == $(">h3.ui-accordion-header", $(this)).length - 1) {
                        //If the active tab is the last one
                        $(">h3.ui-accordion-header:last", $(this)).next().css("border-bottom", "0");
                        $(">h3.ui-accordion-header:last", $(this)).css("border-bottom", "1px");
                    } else {
                        $(">h3.ui-accordion-header:last", $(this)).next().css("border-bottom", "1px");
                        $(">h3.ui-accordion-header:last", $(this)).css("border-bottom", "0");
                    }
                }
				jScrollPaneTuned();
            },
            create: function (event, ui) {

                var level = 0;
                var iCount = 0;
                var $objCurrent = $(this);

                while ($objCurrent.parent()[0] != $("span#lblBackIssues")[0] && iCount < 100) {
                    iCount++;
                    $objCurrent = $objCurrent.parent();
                    if ($objCurrent.hasClass("accordion")) level++;
                }

                $(">h3", $(this)).css({ "padding-left": (10 * level) + "px" });

                if (level == 0) {
                    $(">h3", $(this)).css({ "background-image": "url('/chinese/images/inner/s_menu_bg.jpg')" });
                    $(">h3 >a", $(this)).css({ "color": "#006666" });
                }

                $(">h3 >span.ui-icon", $(this)).each(function () {
                    if (level > 0) {
                        var iconleft = $(this).css("left").replace(/[a-z]*/gi, "");
                        var iconleftunit = $(this).css("left").replace(/[\d\.]*/gi, "");
                        $(this).css("left", ((iconleft * 1) + (10 * level)) + iconleftunit);
                    }
                });
            }
        };
	
	
	$("div.accordion").bind("setAccordionEvent", setAccordion);
	
	function setAccordion() {
		if (typeof ($("div.accordion").accordion) == "function") {
			if ($(this).hasClass("Accordion-called") == false) {
				$(this).accordion($accordion_def);
				$(this).addClass("Accordion-called");
				jScrollPaneTuned();
				
				//Only set the first level of accordion to have their margin-left and margin-right set to 1px;
				//For 2nd level, set their margin-left and margin-right set to 0px;
				$("span#lblBackIssues > div.narBoxMid > div.ui-accordion").css("margin", "0 1px");
			
				//if all 1st level accordions that contain inner accordion, set the background of content pane to 
				$("span#lblBackIssues > div.narBoxMid > div.ui-accordion >div.ui-accordion-content").each(function() {
					if ($(this).find("div.ui-accordion").length > 0) {
						$(this).css("background-image", "url(/chinese/images/inner/sub_side_menu_bg.gif)");
					}
				});
			}
			if (typeof (getOrginalImage) == "function") {
				$(">.ui-accordion-content:visible img[altsrc]", $(this)).trigger("getOrginalImageEvent");
			}
		}
	};
	
	//Hide only the primary level of div.accordion and show the inner layers of div.accordion
	$("span#lblBackIssues > div.narBoxMid > div.accordion div.accordion").show();
	$("div.accordion:visible").each(function() {
		if ($(this).hasClass("Accordion-called") == false) {
			$(this).trigger("setAccordionEvent");
		}
	});
	
	//A dummy image is set to reduce loading (i.e. enhance performance)
	//Restore the original image from altsrc attribute and then remove altsrc attribute
	$("img[altsrc]").bind("getOrginalImageEvent", getOrginalImage);
	
	function getOrginalImage() {
		//Set the value of "altarc" attribute to src attribute and remove "altsrc" attribute
		$(this).attr("src", $(this).attr("altsrc")).removeAttr("altsrc");
	}


    //Load the cover shadow
    $(window).load(function () {

        var isIE6Below = document.all && /MSIE (5|6)/.test(navigator.userAgent);

        if (isIE6Below) return;

        if ($("div#panelCover").length == 0) return;

		if ($("img#imgCover").length > 0 ) {
			strIssueCoverUrl = $("img#imgCover").attr("src");
			
			var iTop = $("div#panelCover").height() - $("img#imgCover").height();
			if (iTop >= 0) {
				if ($("div#cover-shadow").length == 0) {
					$("<div id='cover-shadow'></div>").addClass("cover-shadow").insertAfter($("div#panelCover"));	
				}
				$("div#cover-shadow").css("background", "url('/chinese/images/publications/publications/right-shadow.png') no-repeat right " + iTop + "px transparent");

				$("img#imgCover").css("margin-top", iTop+"px");
				
			}				
		} else {
			strIssueCoverUrl = $("div#panelCover").css("background-image").replace(/^url\(['"](.*)['"]\)$/, "$1").replace(/([^:])\/\//, "$1/");
			var imgIssueCover = new Image();
			imgIssueCover.src = strIssueCoverUrl;
			imgIssueCover.onload = function () {
				var iTop = $("div#panelCover").height() - this.height;
				if (iTop >= 0) {
					if ($("div#cover-shadow").length == 0) {
						$("<div id='cover-shadow'></div>").addClass("cover-shadow").insertAfter($("div#panelCover"));	
					}
					$("div#cover-shadow").css("background", "url('/chinese/images/publications/publications/right-shadow.png') no-repeat right " + iTop + "px transparent");
				}
			}
		}
    });
	
	//Remove the ebook button if the client is using IOS
	if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
		$("a#linkEbook").remove();
		$("a#linkCover").attr("href", $("a#linkPDF").attr("href"));
		$("span#lblTOC a").each(function() {
            var strID = this.id;
            var strUrl = $(this).attr("href");
            if (strUrl.indexOf("/ebook/index.html") >= 0) {
				var strMatches = strUrl.match(/#page=(\d+)/);
				var pageno = strMatches[1];
                $(this).attr("href", $("a#linkPDF").attr("href") + "#page=" + pageno);
            }
		});
		
		//Change to rel attribute as href on left navigation bar
		$("div#side_menu a[rel]").each(function() {
			var strAltURL = $(this).attr("rel");
			
			$(this).attr("href", strAltURL).attr("target", "_blank");
		});
		
	}
	
    if (typeof jQuery.ui != "undefined") {
        /*Information Remarks*/
        $("div#publications-remarks").dialog({ autoOpen: false, width: 700, modal: true });

        $("img#imgInformationRemarks").click(function () {
            $("div#publications-remarks").dialog("open");
        });
    }	
	
})
