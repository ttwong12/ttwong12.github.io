__ADTECH_CODE__ = "";
__theDocument = document;
__theWindow = window;
__bCodeFlushed = false;

function __flushCode() {
	if (!__bCodeFlushed) {
		var span = parent.document.createElement("SPAN");
		span.innerHTML = __ADTECH_CODE__;
		window.frameElement.parentNode.appendChild(span);
		__bCodeFlushed = true;
	}
}

if (typeof inFIF != "undefined") {
	document.write = function(str) {
		__ADTECH_CODE__ += str;
	};
	
	document.writeln = function(str) { document.write(str + "\n"); };

	__theDocument = parent.document;
	__theWindow = parent;
}
document.write("<div style=\"width:298px; height:248px; background-image: url(http://www.newscientist.com/data/ads/nssubs/us/2010/2010_dropdown_mpu.jpg); font-family:arial, sans-serif;\">\n");
document.write("<div style= \"margin-top:20px; padding:12px\">\n");
document.write("	<div style=\"margin-top:30pt;margin-bottom:4pt;font-size:14pt; color:#000000; font-weight:bold\">Subscribe to New Scientist to get the latest science news, <br />\n");
document.write("    no matter where you live.</div>\n");
document.write("	<form id=\"subsddropdown\"  action=\"http://adserver.adtech.de/adlink|289|113580|1|170|AdId=5124607;BnId=3;itime=624500719;ku=2929747;key=tech+dn19166+nosbscrbr;nodecode=yes;link=https://www.newscientistsubscriptions.com/default.aspx\" method=\"get\">\n");
document.write("<input type=\"hidden\" name=\"prom\" value=\"4551\"/>\n");
document.write("	<select class=\"textinput\" name=\"iso\" style=\"width:220px; margin:10px 0;\">\n");
document.write("		<option>Select a country</option>\n");
document.write("		<option value=\"GBR\">United Kingdom</option>\n");
document.write("		<option value=\"USA\">USA</option>\n");
document.write("		<option value=\"CAN\">Canada</option>\n");
document.write("		<option value=\"AUS\">Australia</option>\n");
document.write("		<option value=\"NZL\">New Zealand</option>\n");
document.write("		<option>Other</option>\n");
document.write("	</select>\n");
document.write("	<input type=\"submit\" value=\"Subscribe\" class=\"formbutton\" style=\"background:#c00;\"/>\n");
document.write("</form>\n");
document.write("</div>\n");
document.write("</div>\n");
function cleanUp() {
	if (typeof __parent.swappedRefs == "undefined") {
		__parent.swappedRefs = new Array();
	}
		
	while (__parent.swappedRefs.length > 0) {
		var ref = __parent.swappedRefs.pop();
		if (ref != "swappedRefs") {
			__parent[ref] = null;
		}
	}
}

if (typeof inFIF != "undefined" && inFIF == true) {
	__parent = window.parent;
	window.onunload = cleanUp;
	cleanUp();

	
	for (var ref in window) {
		if ((typeof __parent[ref] == "undefined" || __parent[ref] == null) 
					&& ref != "frameElement" && ref != "event" && ref != "swappedRefs" && ref != "onunload") {
			try {__parent[ref] = window[ref]; __parent.swappedRefs.push(ref);} catch (e) {}
		}
	}	
}	




if (typeof inFIF != "undefined" && inFIF) {
	__flushCode();
}

if (typeof inFIF != "undefined" && inFIF == true) {
try {parent.write = write;
} catch (e) {}try {parent.writeln = writeln;
} catch (e) {}try {parent.__flushCode = __flushCode;
} catch (e) {}}

var adcount_113580_1_=new Image();
adcount_113580_1_.src="http://adserver.adtech.de/adcount|2.0|289|113580|1|170|AdId=5124607;BnId=3;ct=3420026487;st=601;adcid=1;itime=624500719;reqtype=5";
