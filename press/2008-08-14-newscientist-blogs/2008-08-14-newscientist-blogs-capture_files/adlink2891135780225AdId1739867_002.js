document.write('<!-- Template Id = 1 Template Name = Banner Creative (Flash) -->\n<!-- Copyright 2002 DoubleClick Inc., All rights reserved. --><script src=\"http://m1.2mdn.net/879366/flashwrite_1_2.js\"><\/script>');document.write('\n');
 
var dcswf = "http://m1.2mdn.net/1888019/lif_fuel_more_models_v2_728x90.swf"; 
var dcgif = "http://m1.2mdn.net/1888019/lif_fuel_more_models_v2_728x90.jpg"; 
var advurl = "http://ad.doubleclick.net/click%3Bh=v8/3769/7/3e/%2a/j%3B206667500%3B1-0%3B0%3B27995282%3B3454-728/90%3B28150656/28168535/1%3B%3B%7Efdr%3D205209242%3B0-0%3B0%3B25587705%3B3454-728/90%3B27166913/27184792/1%3B%3B%7Esscs%3D%3fhttp%3A//adserver.adtech.de/adlink%7C289%7C113578%7C0%7C225%7CAdId%3D1739867%3BBnId%3D1%3Bitime%3D869955440%3Bkey%3Dblogtech%3Blink%3Dhttp://www.chevy.com/fuelsolutions";
var dcadvurl = escape(advurl);
var dcminversion = 6;
var dccreativewidth = "728";
var dccreativeheight = "90";
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
 document.write('<A TARGET="_blank" HREF="http://ad.doubleclick.net/click%3Bh=v8/3769/7/3e/%2a/j%3B206667500%3B1-0%3B0%3B27995282%3B3454-728/90%3B28150656/28168535/1%3B%3B%7Efdr%3D205209242%3B0-0%3B0%3B25587705%3B3454-728/90%3B27166913/27184792/1%3B%3B%7Esscs%3D%3fhttp%3A//adserver.adtech.de/adlink%7C289%7C113578%7C0%7C225%7CAdId%3D1739867%3BBnId%3D1%3Bitime%3D869955440%3Bkey%3Dblogtech%3Blink%3Dhttp://www.chevy.com/fuelsolutions"><IMG SRC="' + dcgif + '" alt="" BORDER=0></A>');
}
//-->

document.write('<NOSCRIPT><A TARGET=\"_blank\" HREF=\"http://ad.doubleclick.net/click%3Bh=v8/3769/7/3e/%2a/j%3B206667500%3B1-0%3B0%3B27995282%3B3454-728/90%3B28150656/28168535/1%3B%3B%7Efdr%3D205209242%3B0-0%3B0%3B25587705%3B3454-728/90%3B27166913/27184792/1%3B%3B%7Esscs%3D%3fhttp%3A//adserver.adtech.de/adlink%7C289%7C113578%7C0%7C225%7CAdId%3D1739867%3BBnId%3D1%3Bitime%3D869955440%3Bkey%3Dblogtech%3Blink%3Dhttp://www.chevy.com/fuelsolutions\"><IMG SRC=\"http://m1.2mdn.net/1888019/lif_fuel_more_models_v2_728x90.jpg\" alt=\"\" BORDER=0></A></NOSCRIPT>');
