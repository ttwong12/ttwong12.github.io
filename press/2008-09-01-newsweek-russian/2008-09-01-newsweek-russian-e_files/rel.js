var SEEMORE_charset;

if (document.characterSet) SEEMORE_charset = document.characterSet;
else if (document.charset) SEEMORE_charset = document.charset;
else if (document.defaultCharset) SEEMORE_charset = document.defaultCharset;
else SEEMORE_charset = "";
	
var Rnd = Math.round(Math.random() * 1000000000);

document.write( '<sc' + 'ript language="JavaScript" type="text/javascript" src="http://www.seemore.ru/js/test_js.php?list=1&refer='+escape(document.location)+'&encoding='+SEEMORE_charset+'&rndnum='+Rnd+'" ></s' + 'cript>' );
