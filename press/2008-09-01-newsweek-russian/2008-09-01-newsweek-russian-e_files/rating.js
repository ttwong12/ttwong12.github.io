// JavaScript Document
var ballEmpty = new Image();
ballEmpty.src = '/images/zvezda_empty.gif';
var ballHalf = new Image();
ballHalf.src = '/images/zvezda_part.gif';
var ballFull = new Image();
ballFull.src = '/images/zvezda_full.gif';

var Cookie = {
  set: function(name, value, daysToExpire) {
    var expire = '';
    if (daysToExpire != undefined) {
      var d = new Date();
      d.setTime(d.getTime() + (86400000 * parseFloat(daysToExpire)));
      expire = '; expires=' + d.toGMTString();
    }
    return (document.cookie = escape(name) + '=' + escape(value || '') + expire + '; path=/');
  },
  get: function(name) {
    var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'));
    return (cookie ? unescape(cookie[2]) : null);
  },
  erase: function(name) {
    var cookie = Cookie.get(name) || true;
    Cookie.set(name, '', -1);
    return cookie;
  },
  accept: function() {
    if (typeof navigator.cookieEnabled == 'boolean') {
      return navigator.cookieEnabled;
    }
    Cookie.set('_test', '1');
    return (Cookie.erase('_test') = '1');
  }
}

function setRating(itemId, ball)
{
	var cookie = Cookie.get("rating");
	//alert(cookie);
	if (!cookie || !(cookie.indexOf('*'+itemId+'*') >= 0))
	{
		if (!cookie) cookie = '';
		cookie += '*'+itemId+'*';
		Cookie.set("rating",cookie,365);
		new Ajax.Request('/rating/setrating.php?itemId='+itemId+'&ball='+ball,
						 {
							 onSuccess: setNewRating,
							 method: 'get'
						 }
						 );
	}
}

function setNewRating(r)
{
	var newRating = parseFloat(r.responseText);
	showRating(newRating);
	startRating = newRating;
	$('ratingAvg').innerHTML = newRating;
	try { $('ratingAvgsecond').innerHTML = newRating; } catch (e) {};
}

function setOverRating(ball)
{
	for (var i = 1; i <= ball; i++)
	{
		$('rset'+i).src = ballFull.src;
		try { $('rset'+i+'second').src = ballFull.src; } catch(e) {};
	}
	for (var i = ball+1; i <= 5; i++)
	{
		$('rset'+i).src = ballEmpty.src;
		try { $('rset'+i+'second').src = ballEmpty.src; } catch(e) {};
	}
}

function setOutRating()
{
	showRating(startRating);
}

function showRating(rating)
{
	var rDig = Math.floor(rating);
	var rOst = rating - rDig;
	var rImg = '';
	for (var i = 1; i <= 5; i++)
	{
		if (i <= rDig) rImg = ballFull;
		else if (i > rDig && i == (rDig + 1) && rOst >= 0.5) rImg = ballHalf;
		else if (i > rDig && i == (rDig + 1) && rOst < 0.5) rImg = ballEmpty;
		else rImg = ballEmpty;
		$('rset'+i).src = rImg.src;
		if ($('rset'+i+'second')) $('rset'+i+'second').src = rImg.src;
	}
}

