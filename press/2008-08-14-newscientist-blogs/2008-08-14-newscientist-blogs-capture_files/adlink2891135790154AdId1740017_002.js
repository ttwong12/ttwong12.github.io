document.write('<!-- Template Id = 1 Template Name = Banner Creative (Flash) -->\n<!-- Copyright 2002 DoubleClick Inc., All rights reserved. --><script src=\"http://m1.2mdn.net/879366/flashwrite_1_2.js\"><\/script>');document.write('\n');
 
var dcswf = "http://m1.2mdn.net/1888019/lif_fuel_daisies_8over30_160x600.swf"; 
var dcgif = "http://m1.2mdn.net/1888019/lif_fuel_daisies_8over30_160x600.jpg"; 
var advurl = "http://ad.doubleclick.net/click%3Bh=v8/371e/7/3e/%2a/u%3B206667440%3B1-0%3B0%3B27994192%3B2321-160/600%3B27761987/27779866/1%3B%3B%7Efdr%3D205206714%3B0-0%3B0%3B25587796%3B2321-160/600%3B27165066/27182945/1%3B%3B%7Esscs%3D%3fhttp%3A//adserver.adtech.de/adlink%7C289%7C113579%7C0%7C154%7CAdId%3D1740017%3BBnId%3D1%3Bitime%3D869780589%3Bkey%3Dblogtech%3Blink%3Dhttp://www.chevy.com/fuelsolutions";
var dcadvurl = escape(advurl);
var dcminversion = 6;
var dccreativewidth = "160";
var dccreativeheight = "600";
var dcwmode = "opaque";
var dcbgcolor = "";
var dcallowscriptaccess = "never";

function getFlashVer() {
        var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=RegExp("^"+u+" (\\d)");
        if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
        else if(!!(window.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i}catch(e){}
        return 0;
      }

if (dcminversion<=getFlashVer())  {
 adcode = '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+
  ' ID=FLASH_AD WIDTH="'+ dccreativewidth +'" HEIGHT="'+ dccreativeheight +'">'+
  '<PARAM NAME=movie VALUE="' + dcswf + '"><param name="flashvars" value="clickTag='+ dcadvurl +'"><PARAM NAME=quality VALUE=high><PARAM NAME=bgcolor VALUE=#'+ dcbgcolor +'><PARAM NAME=wmode VALUE='+ dcwmode +'><PARAM NAME="AllowScriptAccess" VALUE="'+dcallowscriptaccess+'">'+
  '<EMBED src="' + dcswf + '?clickTag='+ dcadvurl +'" quality=high wmode='+dcwmode+
  ' swLiveConnect=TRUE WIDTH="'+ dccreativewidth +'" HEIGHT="'+ dccreativeheight +'" bgcolor=#'+ dcbgcolor+
  ' TYPE="application/x-shockwave-flash" AllowScriptAccess="'+dcallowscriptaccess+'"></EMBED></OBJECT>';
if(('j'!="j")&&(typeof dclkFlashWrite!="undefined")){dclkFlashWrite(adcode);}else{document.write(adcode);}
} else {
 document.write('<A TARGET="_blank" HREF="http://ad.doubleclick.net/click%3Bh=v8/371e/7/3e/%2a/u%3B206667440%3B1-0%3B0%3B27994192%3B2321-160/600%3B27761987/27779866/1%3B%3B%7Efdr%3D205206714%3B0-0%3B0%3B25587796%3B2321-160/600%3B27165066/27182945/1%3B%3B%7Esscs%3D%3fhttp%3A//adserver.adtech.de/adlink%7C289%7C113579%7C0%7C154%7CAdId%3D1740017%3BBnId%3D1%3Bitime%3D869780589%3Bkey%3Dblogtech%3Blink%3Dhttp://www.chevy.com/fuelsolutions"><IMG SRC="' + dcgif + '" alt="" BORDER=0></A>');
}
//-->

document.write('<NOSCRIPT><A TARGET=\"_blank\" HREF=\"http://ad.doubleclick.net/click%3Bh=v8/371e/7/3e/%2a/u%3B206667440%3B1-0%3B0%3B27994192%3B2321-160/600%3B27761987/27779866/1%3B%3B%7Efdr%3D205206714%3B0-0%3B0%3B25587796%3B2321-160/600%3B27165066/27182945/1%3B%3B%7Esscs%3D%3fhttp%3A//adserver.adtech.de/adlink%7C289%7C113579%7C0%7C154%7CAdId%3D1740017%3BBnId%3D1%3Bitime%3D869780589%3Bkey%3Dblogtech%3Blink%3Dhttp://www.chevy.com/fuelsolutions\"><IMG SRC=\"http://m1.2mdn.net/1888019/lif_fuel_daisies_8over30_160x600.jpg\" alt=\"\" BORDER=0></A></NOSCRIPT>');
