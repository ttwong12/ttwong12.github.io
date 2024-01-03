<!--    以下参数需要根据不同的站点来进行配置   ---->
var ifPlay = true; //是否需要 朗读 功能 true 表示需要  false  表示不需要
var ifsearch = true; //是否需要 全文检索 功能 true 表示需要  false  表示不需要
var ifShowgoIndex = true;//返回首页 显示控制   true 表示需要  false  表示不需要
var ifShowgoTilePage = true;//版面概览 显示控制   true 表示需要  false  表示不需要
var ifShowbmdh = true;//版面导航 显示控制   true 表示需要  false  表示不需要
var ifShowbtdh = true;//标题导航 显示控制   true 表示需要  false  表示不需要
var ifShowdmt = true;//多媒体数字报链接  显示控制   true 表示需要  false  表示不需要
var dbids = "2503";//ddldbids=all  全文检索 传入的库(all代表整个网站) 可以是单个库 如： 新闻中心（dbids="xwzx01"）
var DmtpagerName = "饮服时报"; //报纸名称
var indexPageUrl = "../../../paperindex.htm"; //首页地址
var PDFReadDownUrl = "/AdbeRdr708_zh_CN.rar"; //PDF阅览器下载地址 如果为空侧表示不显示该项
var Plug_In_Url = "../../../js/aheading.exe";//在线阅读多媒体时需要下载的
var linkOurUrl = ""; //联系我们地址
var titlePageUrl = "node_1741.htm";//标题页面文件名（版面概览）

// 2010-09-10 新增加: -- by yangzl
var ifShowPerNext=true; // 是否以弹窗口的形式提示:已经是第一版 或者 已经是最后一版  true 表示不需要  false  表示需要
// 2010-09-10 新增加: -- by yangzl

//----------------------------------------------------------------------------------------------------------------




<!-- 朗读 ---->
var TTSPlayeriframeSrc = "../../../framepage/TTSPost.htm"; //iframe的页面地址
var TTSPostSrc= "http://www.cnepaper.com:8080/VoiceControl/TTSPlay.action"; //要调用的TTSPalyer的地址
//----------------------------------------------------------------------------------------------------------------

<!-- 全文检索 ---->
var nkval = "dgb";  // 只要修改此处，不需要修改nk=
//var searchurl = "http://www.cnepaper.com:8080/HLFtiDemo/" + nkval + ".jsp";//全文检索页面地址
var searchurl = "http://fullsearch.cnepaper.com/eso/dgb.aspx";//全文检索页面地址
//----------------------------------------------------------------------------------------------------------------

//SetPageinIt();//初始货页面
//初始货页面
 function SetPageinIt()
{
	if (document.readyState == 'complete' )
    {

	   fnInitialize(); //朗读 页面初始化  	
	   InItsearch();//全文检索 页面初始化
	   ShowdmtLink();//显示多媒体数字版了链接
	   Showbmdh();//版面导航显示控制
	   Showbtdh();//标题导航显示控制
	   ShowcopyLK();//显示落款信息
	   ShowgoIndex();//返回首页显示控制
	   ShowgoTilePage();//版面概览显示控制显示控制

	   // 2010-09-10 新增加: -- 当前期次变色 -- by yangzl
	   changeCurPageColor();//当前期次变色
	   showEdPreNext();//是否以弹窗口的形式提示:已经是第一版 或者 已经是最后一版  需要结合ifShowPerNext使用
	   // 2010-09-10 新增加: -- 当前期次变色 -- by yangzl
    }
    else
	{
	  window.setTimeout("SetPageinIt()","100"); 
	}
}

JQ(function(){
//	  var so = new SWFObject("../../../js/banner.gif", "mymovie", "782", "83", "7", "#336699");//width="320" height="200" 
//	  so.addParam("wmode", "transparent");
//	  so.write("showgg"); //页面中需要与之对应的id，当前是版面图所在的div		
	  
	   fnInitialize(); //朗读 页面初始化  	
	   InItsearch();//全文检索 页面初始化
	   ShowdmtLink();//显示多媒体数字版了链接
	   Showbmdh();//版面导航显示控制
	   Showbtdh();//标题导航显示控制
	   ShowcopyLK();//显示落款信息
	   ShowgoIndex();//返回首页显示控制
	   ShowgoTilePage();//版面概览显示控制显示控制

	   // 2010-09-10 新增加: -- 当前期次变色 -- by yangzl
	   changeCurPageColor();//当前期次变色
	   //showEdPreNext();//是否以弹窗口的形式提示:已经是第一版 或者 已经是最后一版  需要结合ifShowPerNext使用
	   // 2010-09-10 新增加: -- 当前期次变色 -- by yangzl	  
	   // 自定义 农历日期
	   JQ("#tim_header").html(RunGLNL());
	   //一行为白色，一行为灰色
	   JQ(".bmdh_tr").each(function(i){this.style.backgroundColor=['#e8e8e8','#ffffff'][i%2]})
});
// 2010-09-10 新增加: -- by yangzl

//-- 当前期次变色
function changeCurPageColor(){
	var currentUrl = escape(window.location);
	currentUrl = currentUrl.substring(currentUrl.indexOf("node"));
	
	JQ(".rigth_bmdh_href").each(function(){
		objLink = JQ(this).attr("href");
		objLink = objLink.substring(objLink.indexOf("node"));
		if (objLink == currentUrl){
			JQ(this).attr({ style: "color:#900; font-weight:bold;" });
		}		
    });	
}

// 是否以弹窗口的形式提示:已经是第一版 或者 已经是最后一版
// 是否显示'javascript:alert('已经是第一版')'或者'javascript:alert('已经是最后一版')'
function showEdPreNext(){
	if (ifShowPerNext){
		var ed_link;
		ed_link = document.getElementById("ed_pre");
		if (ed_link){
			if (ed_link.href == "javascript:alert('已经是第一版')"){
				document.getElementById('ed_pre').style.display="none";
			}
		}
		ed_link = document.getElementById("ed_next");
		if (ed_link){
			if (ed_link.href == "javascript:alert('已经是最后一版')"){
				document.getElementById('ed_next').style.display="none";
			}
		}
	}
}

// 2010-09-10 新增加: -- by yangzl


//---------------------- 朗读 -------------------------------- 
// 此段脚本执行 朗读 页面初始化
function fnInitialize()
  {
    var obj;
	var objiframe;
	var objhtml = "<a onClick=\"readTxt();\" href=\"javascript:;\">朗读<img height=16 src=\"../../../image/soundon.gif\" width=16 align=absMiddle border=0></a>";
	   	if(ifPlay)
	    {
			obj = document.getElementById("readTxtQY");
			if(obj != null)
			{
				//obj.style.display="inline";			
				//obj.innerHTML = objhtml;
				JQ("#readTxtQY").html(objhtml);
				JQ("#readTxtQY").show();
			}else
			{
				//alert("页面中找不到 readTxtQY 对象,本对象表示 朗读 存位置<span>")
			}
			
			obj = document.getElementById("readTxtQY2");
			if(obj != null)
			{
				//obj.style.display="inline";			
				//obj.innerHTML = objhtml;
				JQ("#readTxtQY2").html(objhtml);
				JQ("#readTxtQY2").show();	
			}else
			{
				//alert("页面中找不到 readTxtQY2 对象,本对象表示 朗读 存位置<span>")
			}
			
			objiframe = document.getElementById("TTSPlayeriframe");
			if(obj != null)
			{
			   objiframe.src = TTSPlayeriframeSrc;
			}else
			{
				//alert("页面中找不到 TTSPlayeriframe 对象,本对象表示 朗读提交 存位置<iframe>")
			}
	    }
    
  }

 
 function playerPlay(url,text)
 {  
    try{
        document.TTSPlayeriframe.document.form1.TTsText.value = text;
        document.TTSPlayeriframe.document.form1.playPageUrl.value = url;
	    document.TTSPlayeriframe.document.form1.action = TTSPostSrc;
	    document.TTSPlayeriframe.document.form1.submit();
	 }catch(e)
	 {
	    alert("页面未加载完成，请稍后再用。" + e);
	 }
		
 }
 
 function readTxt()
 {

	var txtobj = document.all("ozoom");
	if(typeof(txtobj) == "object")
	{	
		var url= document.location.href;
		var txt = txtobj.innerText;
		playerPlay(url,txt);
	}
    else
    {
      alert("无法获取文章内容(can't find ozoom object)");
    }
	
 }
 //--------------------------- 全文检索 --------------------------- 


// 此段脚本执行 全文检索 页面初始化
function InItsearch()
{	
    var obj;
	var objhtml = "";	
	objhtml = "<input name=\"keyword\" type=\"text\" id=\"keyword\" style=\"height:20px;width:150\">&nbsp;<input name=\"Btsearch\" type=\"button\" id=\"Btsearch\" value=\"搜索\" style=\"height:20px;\" onClick=\"searchWord()\">";

    	if(ifsearch)
	    {
			obj = document.getElementById("searchQY");
			if(obj != null)
			{
				//obj.style.display="inline";			
				//obj.innerHTML = objhtml;
				JQ("#searchQY").html(objhtml);
				JQ("#searchQY").show();	
			}else
			{
				//alert("页面中找不到 searchQY 对象,本对象表示 搜索框 存位置<span>")
			}
	    }
}

function searchWord()
{
	var url = "";
	//var key = escape(document.getElementById("keyword").value);//编码
	var key = encodeURI(document.getElementById("keyword").value);//编码
	url = searchurl + "?key="+key+"&dbids=" + dbids;
	//url = searchurl + "?searchText1="+key+"&op=new&nk="+nkval;
	window.open(url);
}
 
 //--------------------------- 多媒体数字版了链接 --------------------------- 
 
 ShowdmtLink();
 //显示多媒体数字版了链接
 function ShowdmtLink()
{
	var obj;
    var objhtml = "<table width=\"116\" border=0 cellpadding=0 cellspacing=0>";
      
        objhtml +=     "<tr>";
        objhtml +=        "<td height=\"\">";	
  if(ifShowdmt)   objhtml +=  "<a href=\"javascript:;\" onClick=\"viewOL_RMP()\"><img src=\"../../../image/duo.gif\" width=\"116\" height=\"39\" border=\"0\"></a><br>";	 
    if(ifShowdmt)   objhtml +=  "<a href=\"" + Plug_In_Url + "\"  target=\"_blank\"><img src=\"../../../image/xia.gif\" width=\"116\" height=\"14\" border=\"0\"></a>";


		objhtml +=        "</td>";
        objhtml +=     "</tr>";
        objhtml +=  "</table>";
		
            obj = document.getElementById("dmtFrameQY");
			if(obj != null)
			{		
				obj.innerHTML = objhtml;
			}else
			{
				//alert("页面中找不到 dmtFrameQY 对象,本对象表示 多媒体数字版链接 存位置<span>")
			}
}

//--------------------------- 版面导航显示控制 ---------------------------  
 function Showbmdh()
{
	var obj;
	
    	obj = document.getElementById("bmdhSpan");
			if(obj != null)
			{		
				if(ifShowbmdh)
				   obj.style.display="inline";
				else
				   obj.style.display="none";
			}else
			{
				//alert("页面中找不到 bmdhSpan 对象,本对象表示 版面导航显示控制  存位置<span>")
			}
}

//--------------------------- 标题导航显示控制 ---------------------------  
 //标题导航显示控制
 function Showbtdh()
{
	var obj;
	
    	obj = document.getElementById("btdhSpan");
			if(obj != null)
			{		
				if(ifShowbtdh)
				   obj.style.display="inline";
				else
				   obj.style.display="none";
			}else
			{
				//alert("页面中找不到 btdhSpan 对象,本对象表示 标题导航显示控制  存位置<span>")
			}
}

//--------------------------- 返回首页显示控制 ---------------------------  
 //返回首页显示控制
 function ShowgoIndex()
{
	var obj;
	
    	obj = document.getElementById("goIndexSpan");
			if(obj != null)
			{		
				if(ifShowgoIndex)
				   obj.style.display="inline";
				else
				   obj.style.display="none";
			}else
			{
				//alert("页面中找不到 goIndexSpan 对象,本对象表示 标题导航显示控制  存位置<span>")
			}
}

//--------------------------- 版面概览显示控制 ---------------------------  
 //版面概览显示控制显示控制
 function ShowgoTilePage()
{
	var obj;
	
    	obj = document.getElementById("goTilePageSpan");
			if(obj != null)
			{		
				if(ifShowgoTilePage)
				   obj.style.display="inline";
				else
				   obj.style.display="none";
			}else
			{
				//alert("页面中找不到 goIndexSpan 对象,本对象表示 标题导航显示控制  存位置<span>")
			}
}


//--------------------------- 落款信息 --------------------------- 
 //显示落款信息
 function ShowcopyLK()
{
	var obj;
	var objhtml = "<font style='font-size:14px; color:#000000; line-height:30px;'>大公网简介   |   免责条款   |   广告服务   |   联系我们   |   京ICP备10049068号</font><br><font style='font-size:12px; line-height:20px; color:#666666;'> 大公报总机：+852-2575 7181     大公网：香港 +852-2573 1269     北京 +86-10-5204 7777 <br>向报社投稿,请Email： tkppub@takungpao.com     向大公网投稿,请Email： tkpnews@takungpao.com<br>大公网版权所有，未经允许,不得转载 中国大公网络有限公司<br><a href='http://www.aheading.com' target='_blank'>杭州前方信息技术有限公司</a> <a href='http://www.cnepaper.com'  target='_blank'> 搜报网</a> 提供技术服务</font>";
    	obj = document.getElementById("copyLK");
			if(obj != null)
			{		
				obj.innerHTML = objhtml;
			}else
			{
				//alert("页面中找不到 copyLK 对象,本对象表示 落款信息 存位置<span>")
			}
}

//--------------------------- 返回首页 --------------------------- 
 //返回首页
 function goPageIndex()
{	
	location.href = indexPageUrl;
}

//--------------------------- 联系我们 --------------------------- 
 //联系我们
 function linkOur()
{	
	window.open(linkOurUrl);
}

//--------------------------- 标题页面文件名（导航） --------------------------- 
 //标题页面文件名（导航）
 function GOtitlePageUrl()
{	
	location.href = titlePageUrl;
}

//--------------------------- 版面导航显示位置 --------------------------- 
 function setbmdh_()
{	
	var obj = document.getElementById("bmdh");
	obj.style.left = event.clientX - obj.offsetWidth + 10;
	obj.style.top = event.clientY -2;
}
//--------------------------- 标题导航显示位置 --------------------------- 
 function setbtdh_()
{	
	var obj = document.getElementById("btdh");
	obj.style.left = event.clientX - obj.offsetWidth + 10;
	obj.style.top = event.clientY -2;
}
//--------------------------- 版面导航显示位置 --------------------------- 
 function setbmdh(e){	
	var event = JQ.event.fix(e); 
	var obj = document.getElementById("bmdh");
	obj.style.left = event.pageX - obj.offsetWidth + 10;
	obj.style.top = event.pageY -2;
}
//--------------------------- 标题导航显示位置 --------------------------- 
 function setbtdh(e){
    var event = JQ.event.fix(e);
	var obj = document.getElementById("btdh");
	obj.style.left = event.pageX - obj.offsetWidth + 10;
	obj.style.top = event.pageY -2;
}
//--------------------------- 文章页面没插图的文章隐藏插图区块 --------------------------- 
function HideNewsPic()
{	
	if(document.getElementById('newspic').innerHTML.match("img")==null&&document.getElementById('newspic').innerHTML.match("IMG")==null)
	{
	    document.getElementById('newspic').style.display="none";
	}
}

//--------------------------- 标题页面文件名（导航） --------------------------- 
 //标题页面文件名（导航）
 function GOtitlePageUrl()
{	
	location.href = titlePageUrl;
}

//自定义 农历日期
function RunGLNL() {
	var today = new Date();
	var d = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	var DDDD = d[today.getDay()];
	DDDD = DDDD + " " + (CnDateofDateStr(today)); //显示农历  
	DDDD = DDDD + SolarTerm(today); //显示二十四节气  
	DDDD = CnFullCurrDate() + DDDD;
	//document.write(DDDD);
	return  DDDD;
}
function DaysNumberofDate(DateGL) {
	return parseInt((Date.parse(DateGL) - Date.parse(DateGL.getFullYear() + "/1/1")) / 86400000) + 1;
}
function CnDateofDate(DateGL) {
	var CnData = new Array(
	0x16, 0x2a, 0xda, 0x00, 0x83, 0x49, 0xb6, 0x05, 0x0e, 0x64, 0xbb, 0x00, 0x19, 0xb2, 0x5b, 0x00,
	0x87, 0x6a, 0x57, 0x04, 0x12, 0x75, 0x2b, 0x00, 0x1d, 0xb6, 0x95, 0x00, 0x8a, 0xad, 0x55, 0x02,
	0x15, 0x55, 0xaa, 0x00, 0x82, 0x55, 0x6c, 0x07, 0x0d, 0xc9, 0x76, 0x00, 0x17, 0x64, 0xb7, 0x00,
	0x86, 0xe4, 0xae, 0x05, 0x11, 0xea, 0x56, 0x00, 0x1b, 0x6d, 0x2a, 0x00, 0x88, 0x5a, 0xaa, 0x04,
	0x14, 0xad, 0x55, 0x00, 0x81, 0xaa, 0xd5, 0x09, 0x0b, 0x52, 0xea, 0x00, 0x16, 0xa9, 0x6d, 0x00,
	0x84, 0xa9, 0x5d, 0x06, 0x0f, 0xd4, 0xae, 0x00, 0x1a, 0xea, 0x4d, 0x00, 0x87, 0xba, 0x55, 0x04
	);
	var CnMonth = new Array();
	var CnMonthDays = new Array();
	var CnBeginDay;
	var LeapMonth;
	var Bytes = new Array();
	var I;
	var CnMonthData;
	var DaysCount;
	var CnDaysCount;
	var ResultMonth;
	var ResultDay;
	var yyyy = DateGL.getFullYear();
	var mm = DateGL.getMonth() + 1;
	var dd = DateGL.getDate();
	if (yyyy < 100) yyyy += 1900;
	if ((yyyy < 1997) || (yyyy > 2020)) {
		return 0;
	}
	Bytes[0] = CnData[(yyyy - 1997) * 4];
	Bytes[1] = CnData[(yyyy - 1997) * 4 + 1];
	Bytes[2] = CnData[(yyyy - 1997) * 4 + 2];
	Bytes[3] = CnData[(yyyy - 1997) * 4 + 3];
	if ((Bytes[0] & 0x80) != 0) {
		CnMonth[0] = 12;
	}
	else {
		CnMonth[0] = 11;
	}
	CnBeginDay = (Bytes[0] & 0x7f);
	CnMonthData = Bytes[1];
	CnMonthData = CnMonthData << 8;
	CnMonthData = CnMonthData | Bytes[2];
	LeapMonth = Bytes[3];
	for (I = 15; I >= 0; I--) {
		CnMonthDays[15 - I] = 29;
		if (((1 << I) & CnMonthData) != 0) {
			CnMonthDays[15 - I]++;
		}
		if (CnMonth[15 - I] == LeapMonth) {
			CnMonth[15 - I + 1] = -LeapMonth;
		}
		else {
			if (CnMonth[15 - I] < 0) {
				CnMonth[15 - I + 1] = -CnMonth[15 - I] + 1;
			}
			else {
				CnMonth[15 - I + 1] = CnMonth[15 - I] + 1;
			}
			if (CnMonth[15 - I + 1] > 12) {
				CnMonth[15 - I + 1] = 1;
			}
		}
	}
	DaysCount = DaysNumberofDate(DateGL) - 1;
	if (DaysCount <= (CnMonthDays[0] - CnBeginDay)) {
		if ((yyyy > 1901) && (CnDateofDate(new Date((yyyy - 1) + "/12/31")) < 0)) {
			ResultMonth = -CnMonth[0];
		}
		else {
			ResultMonth = CnMonth[0];
		}
		ResultDay = CnBeginDay + DaysCount;
	}
	else {
		CnDaysCount = CnMonthDays[0] - CnBeginDay;
		I = 1;
		while ((CnDaysCount < DaysCount) && (CnDaysCount + CnMonthDays[I] < DaysCount)) {
			CnDaysCount += CnMonthDays[I];
			I++;
		}
		ResultMonth = CnMonth[I];
		ResultDay = DaysCount - CnDaysCount;
	}
	if (ResultMonth > 0) {
		return ResultMonth * 100 + ResultDay;
	}
	else {
		return ResultMonth * 100 - ResultDay;
	}
}
function CnYearofDate(DateGL) {
	var YYYY = DateGL.getFullYear();
	var MM = DateGL.getMonth() + 1;
	var CnMM = parseInt(Math.abs(CnDateofDate(DateGL)) / 100);
	if (YYYY < 100) YYYY += 1900;
	if (CnMM > MM) YYYY--;
	YYYY -= 1864;
	return CnEra(YYYY) + "年";
}
function CnMonthofDate(DateGL) {
	var CnMonthStr = new Array("零", "正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊");
	var Month;
	Month = parseInt(CnDateofDate(DateGL) / 100);
	if (Month < 0) {
		return "闰" + CnMonthStr[ - Month] + "月";
	}
	else {
		return CnMonthStr[Month] + "月";
	}
}
function CnDayofDate(DateGL) {
	var CnDayStr = new Array("零",
	"初一", "初二", "初三", "初四", "初五",
	"初六", "初七", "初八", "初九", "初十",
	"十一", "十二", "十三", "十四", "十五",
	"十六", "十七", "十八", "十九", "二十",
	"廿一", "廿二", "廿三", "廿四", "廿五",
	"廿六", "廿七", "廿八", "廿九", "三十");
	var Day;
	Day = (Math.abs(CnDateofDate(DateGL))) % 100;
	return CnDayStr[Day];
}
function DaysNumberofMonth(DateGL) {
	var MM1 = DateGL.getFullYear();
	MM1 < 100 ? MM1 += 1900 : MM1;
	var MM2 = MM1;
	MM1 += "/" + (DateGL.getMonth() + 1);
	MM2 += "/" + (DateGL.getMonth() + 2);
	MM1 += "/1";
	MM2 += "/1";
	return parseInt((Date.parse(MM2) - Date.parse(MM1)) / 86400000);
}
function CnEra(YYYY) {
	var Tiangan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
	//var Dizhi=new Array("子(鼠)","丑(牛)","寅(虎)","卯(兔)","辰(龙)","巳(蛇)",  
	//"午(马)","未(羊)","申(猴)","酉(鸡)","戌(狗)","亥(猪)");  
	var Dizhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
	return Tiangan[YYYY % 10] + Dizhi[YYYY % 12];
}
function CnDateofDateStr(DateGL) {
	if (CnMonthofDate(DateGL) == "零月") return "　请调整您的计算机日期!";
	else return "农历" + CnYearofDate(DateGL) + " " + CnMonthofDate(DateGL) + CnDayofDate(DateGL);
}
function SolarTerm(DateGL) {
	var SolarTermStr = new Array(
	"小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
	"清明", "谷雨", "立夏", "小满", "芒种", "夏至",
	"小暑", "大暑", "立秋", "处暑", "白露", "秋分",
	"寒露", "霜降", "立冬", "小雪", "大雪", "冬至");
	var DifferenceInMonth = new Array(
	1272060, 1275495, 1281180, 1289445, 1299225, 1310355,
	1321560, 1333035, 1342770, 1350855, 1356420, 1359045,
	1358580, 1355055, 1348695, 1340040, 1329630, 1318455,
	1306935, 1297380, 1286865, 1277730, 1274550, 1271556);
	var DifferenceInYear = 31556926;
	var BeginTime = new Date(1901 / 1 / 1);
	BeginTime.setTime(947120460000);
	for (; DateGL.getFullYear() < BeginTime.getFullYear();) {
		BeginTime.setTime(BeginTime.getTime() - DifferenceInYear * 1000);
	}
	for (; DateGL.getFullYear() > BeginTime.getFullYear();) {
		BeginTime.setTime(BeginTime.getTime() + DifferenceInYear * 1000);
	}
	for (var M = 0; DateGL.getMonth() > BeginTime.getMonth(); M++) {
		BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
	}
	if (DateGL.getDate() > BeginTime.getDate()) {
		BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
		M++;
	}
	if (DateGL.getDate() > BeginTime.getDate()) {
		BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
		M == 23 ? M = 0 : M++;
	}
	var JQ = "二十四节气";
	if (DateGL.getDate() == BeginTime.getDate()) {
		JQ += "    今日 <font color='#598F03'><b>" + SolarTermStr[M] + "</b></font>";
	}
	else if (DateGL.getDate() == BeginTime.getDate() - 1) {
		JQ += "　 明日 <font color='#598F03'><b>" + SolarTermStr[M] + "</b></font>";
	}
	else if (DateGL.getDate() == BeginTime.getDate() - 2) {
		JQ += "　 后日 <font color='#598F03'><b>" + SolarTermStr[M] + "</b></font>";
	}
	else {
		JQ = " 二十四节气";
		if (DateGL.getMonth() == BeginTime.getMonth()) {
			JQ += " 本月";
		}
		else {
			JQ += " 下月";
		}
		JQ += BeginTime.getDate() + "日" + "<font color='#598F03'><b>" + SolarTermStr[M] + "</b></font>";
	}
	return JQ;
}
 function CnFullCurrDate() {
	var obj_date = new Date();
	var temp,YYYY,MM,DD;
	YYYY = obj_date.getFullYear();
	MM = obj_date.getMonth() + 1;
	DD = obj_date.getDate();
	temp = YYYY + "年" + MM + "月" + DD + "日 ";
	return temp;
}

//////////////////////////
function autoShowDate(){
	//var dateX=event.clientX + document.body.scrollLeft;
	//var dateY=event.clientY + document.body.scrollTop;
	//document.getElementById("daydh").style.left=dateX + "px";
	//document.getElementById("daydh").style.top=dateY + "px";
	if(document.getElementById("daydh").style.display=="none"){
		document.getElementById("daydh").style.display="block";
	}else{
		document.getElementById("daydh").style.display="none";
	}
}