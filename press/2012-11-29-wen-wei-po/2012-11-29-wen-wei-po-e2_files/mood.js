var moodzt = "0";
var http_request = false;
function makeRequest(url, functionName, httpType, sendData) {

	http_request = false;
	if (!httpType) httpType = "GET";

	if (window.XMLHttpRequest) { // Non-IE...
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {
			http_request.overrideMimeType('text/plain');
		}
	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!http_request) {
		alert('Cannot send an XMLHTTP request');
		return false;
	}

	var changefunc="http_request.onreadystatechange = "+functionName;
	eval (changefunc);
	//http_request.onreadystatechange = alertContents;
	http_request.open(httpType, url, true);
	http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	http_request.send(sendData);
}


function makeRequest_nof(url, functionName, httpType, sendData) {

	http_request = false;
	if (!httpType) httpType = "GET";

	if (window.XMLHttpRequest) { // Non-IE...
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {
			http_request.overrideMimeType('text/plain');
		}
	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!http_request) {
		alert('Cannot send an XMLHTTP request');
		return false;
	}

	var changefunc="http_request.onreadystatechange = "+functionName;
	eval (changefunc);
	//http_request.onreadystatechange = alertContents;
	http_request.open(httpType, url, true);
	http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	http_request.send(sendData);
}

function $() {
  var elements = new Array();

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);

    if (arguments.length == 1)
      return element;

    elements.push(element);
  }

  return elements;
}
function SetCookie(name,value)//兩個參數，一個是cookie的名子，一個是值
{
    var Seconds = 3600; //此 cookie 將被保存 1 小時(3600秒)
    var exp  = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Seconds*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)//取cookies函數        
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); return null;

}
function delCookie(name)//刪除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

 function remood()
{

	url = "/vote_big5/action.php?action=show&id="+infoid+"&classid="+classid+"&m=" + Math.random();
	makeRequest(url,'return_review1','GET','');
	
}

function get_mood(mood_id)
{var cookie = getCookie(infoid);

	//if(moodzt == "1" || cookie== (classid+infoid)) 
	//{
	//	alert("親愛的文匯網友，您已經發表過心情感受了，謝謝！");

	//}
	//else {
		SetCookie (infoid, (classid+infoid));
		url = "/vote_big5/action.php?action=mood&classid="+classid+"&id="+infoid+"&typee="+mood_id+"&m=" + Math.random();
		makeRequest(url,'return_review1','GET','');
		location.replace(location.href);
		moodzt = "1";
		
	//}
}

function return_review1(ajax)
{
	 
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var str_error_num = http_request.responseText;
			if(str_error_num=="error")
			{
				alert("信息不存在！");
			}
			//else if(str_error_num==0)
			//{
			//	alert("親愛的文匯網友，您已經發表過心情感受了，謝謝！");
			//}
 
			else
			{
				moodinner(str_error_num);
			}
		//} else {
		//	alert('發生了未知錯誤!');
		}
	}
}

function moodinner(moodtext)
{
	var imga =  "http://image.wenweipo.com/vote_big5/images/pre_02.gif";
	var imgb =   "http://image.wenweipo.com/vote_big5/pre_b1.gif";
	var color1 = "#666666";
	var color2 = "#EB610E";
	var heightz = "80";	//圖片100%時的高
	var hmax = 0;
	var hmaxpx = 0;
	var heightarr = new Array();
	var moodarr = moodtext.split(",");
	var moodzs = 0;
	for(k=0;k<8;k++) {
		moodarr[k] = parseInt(moodarr[k]);
		moodzs += moodarr[k];
	}
	for(i=0;i<8;i++) {
		heightarr[i]= Math.round(moodarr[i]/moodzs*heightz);
		if(heightarr[i]<1) heightarr[i]=1;
		if(moodarr[i]>hmaxpx) {
		hmaxpx = moodarr[i];
		}
	}
	$("moodtitle").innerHTML = "<span style='color: #555555;padding-left: 20px;'>您的態度和心情(已有<font color='#FF0000'>"+moodzs+"</font>人表態</span>)：";
	for(j=0;j<8;j++)
	{
		if(moodarr[j]==hmaxpx && moodarr[j]!=0) {
			$("moodinfo"+j).innerHTML = "<span style='color: "+color2+";'>"+moodarr[j]+"</span><br><img src='"+imgb+"' width='20' height='"+heightarr[j]+"'>";
		} else {
			$("moodinfo"+j).innerHTML = "<span style='color: "+color1+";'>"+moodarr[j]+"</span><br><img src='"+imga+"' width='20' height='"+heightarr[j]+"'>";
		}
	}
}
document.writeln("<table width=\"520\" border=\"0\" cellpadding=\"0\" cellspacing=\"2\" style=\"font-size:12px;margin-top: 20px;margin-bottom: 20px;\">");
document.writeln("<tr>");
document.writeln("<td colspan=\"8\" id=\"moodtitle\"  class=\"left\"><\/td>");
document.writeln("<\/tr>");
document.writeln("<tr align=\"center\" valign=\"bottom\">");
document.writeln("<td height=\"60\" id=\"moodinfo0\">");
document.writeln("<\/td><td height=\"30\" id=\"moodinfo1\">");
document.writeln("<\/td><td height=\"30\" id=\"moodinfo2\">");
document.writeln("<\/td><td height=\"30\" id=\"moodinfo3\">");
document.writeln("<\/td><td height=\"30\" id=\"moodinfo4\">");
document.writeln("<\/td><td height=\"30\" id=\"moodinfo5\">");
document.writeln("<\/td><td height=\"30\" id=\"moodinfo6\">");
document.writeln("<\/td><td height=\"30\" id=\"moodinfo7\">");
document.writeln("<\/td><\/tr>");
document.writeln("<tr align=\"center\" valign=\"middle\">");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood1\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/b20.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood2\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/n3.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood3\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/n1.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood4\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/n2.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood5\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/b0.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood6\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/c1.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood7\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/b2.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<td><a href='#mood' onClick=\"get_mood(\'mood8\')\"><img src=\"");
document.writeln("http:\/\/image.wenweipo.com\/vote_big5\/images\/b5.gif\" width=\"25\" height=\"25\" border=\"0\"></a><\/td>");
document.writeln("<\/tr>");
document.writeln("<tr>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">重要<\/td>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">不重要<\/td>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">喜歡<\/td>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">不喜歡<\/td>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">開心<\/td>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">感動<\/td>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">生氣<\/td>");
document.writeln("<td align=\"center\" class=\"hui\" width=\"65\">難過<\/td>");
document.writeln("<\/tr>");
document.writeln("<tr align=\"center\">");
document.writeln("<td><input onClick=\"get_mood(\'mood1\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<td><input onClick=\"get_mood(\'mood2\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<td><input onClick=\"get_mood(\'mood3\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<td><input onClick=\"get_mood(\'mood4\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<td><input onClick=\"get_mood(\'mood5\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<td><input onClick=\"get_mood(\'mood6\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<td><input onClick=\"get_mood(\'mood7\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<td><input onClick=\"get_mood(\'mood8\')\" type=\"radio\" name=\"radiobutton\" value=\"radiobutton\"><\/td>");
document.writeln("<\/tr>");
document.writeln("<\/table>")
remood();