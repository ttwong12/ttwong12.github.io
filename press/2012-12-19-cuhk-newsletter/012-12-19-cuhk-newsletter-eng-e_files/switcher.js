function setActiveStyleSheet(title) {
  var i, a, main;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
	
    if(a.getAttribute("rel") && a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) {
		  a.disabled = false;
	  }
    }
  }
}

function getActiveStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
  }
  return null;
}

function getPreferredStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1
       && a.getAttribute("rel").indexOf("alt") == -1
       && a.getAttribute("title")
       ) return a.getAttribute("title");
  }
  return null;
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

//require JQuery 
$(document).ready( function() {
	var cookie = readCookie("style");	
	var title = cookie ? cookie : getPreferredStyleSheet();
	//In case getPreferredStyleSheet() return null, hard-code to set title to "default"
	if (title == null || title == "null") title = "default";
	setActiveStyleSheet(title);
	$("div.sizing a[onclick*=\"'" + title + "'\"]").css('color', '#73216d');
	
	//This functions is used to highlight the font-size selector when it is being clicked.
	$("div.sizing a").click(function() {
		$(this).closest('div').find('a').css('color', '');
		$(this).css('color', '#73216d');
	})
	
	$(window).unload( function() {
		var title = getActiveStyleSheet();
		createCookie("style", title, 365);
	})
});

