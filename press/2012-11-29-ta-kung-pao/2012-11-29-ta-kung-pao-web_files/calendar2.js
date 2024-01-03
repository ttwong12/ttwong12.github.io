<!--



///////////////////////////////////////////////////////////////////////////////

// 2010-09-19 新增加: -- by yangzl
var autoStartYear=2005;//页面中年份在这里控制
var autoEndYear=2051;//页面中年份在这里控制
// 2010-09-19 新增加: -- by yangzl



var cld;

function drawCld(SY,SM) {

   //alert("begin drawCld");
   var i,sD,s,size;
   //xlz
   var hh;
   ////////////
   
   cld = new calendar(SY,SM);
   var nowdate = new Date();
   
   var cldPeriods = mp_periods;
   //alert(cldPeriods);

   for(i=0;i<42;i++) {

      sObj=eval('SD'+ i);
      lObj=eval('LD'+ i);      
      gObj=eval('GD'+ i);

      //xlz
      cObj=eval('CD'+ i);
      /////////////////////////

      sObj.className = '';

      sD = i - cld.firstWeek;

      if(sD>-1 && sD<cld.length) 
      { //日期内

         var testDate = "";
         if((sD+1)<10)
         	testDate += "0";
         testDate += (sD+1);

	 
	 var verifyDate = SY + "-" + appendZero(SM+1) + "-" + testDate;
	 //alert(verifyDate);
	 var oPeriod = OBJ_MP_UTILS.testDateValid(cldPeriods,verifyDate);
			
	 if(oPeriod)
	 {
		cObj.href = oPeriod.getPeriodUrl();
          sObj.style.cursor = 'pointer';
	 }
	 else
	 {
         	//alert(sD+1);
         	//gObj.innerHTML = '<font color="grey">'+(sD+1)+'</font>';
         	cObj.href = '#';
         	
         	sObj.innerHTML = sD+1;
         	sObj.color = 'silver';
         	sObj.style.cursor = 'default';
         	lObj.innerHTML = '';
         	continue;		
	 } 

      	
         sObj.innerHTML = sD+1;

         //高亮显示当天的日期
         if(SY==tY && SM == tM && sD+1 == tD)
         	sObj.color="#ea5f02";
         else
         	sObj.color="";

         ///////////////////

         if(cld[sD].isToday) sObj.className = 'todaycolor'; //今日颜色

         sObj.style.color = cld[sD].color; //国定假日颜色

         if(cld[sD].lDay==1) //显示农历月
			{
			if (cld[sD].lMonth ==1) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '正月';
			}
			else if (cld[sD].lMonth ==2) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '二月';
			}
			else if (cld[sD].lMonth ==3) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '三月';
			}
			else if (cld[sD].lMonth ==4) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '四月';
			}
			else if (cld[sD].lMonth ==5) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '五月';
			}
			else if (cld[sD].lMonth ==6) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '六月';
			}
			else if (cld[sD].lMonth ==7) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '七月';
			}
			else if (cld[sD].lMonth ==8) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '八月';
			}
			else if (cld[sD].lMonth ==9) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '九月';
			}
			else if (cld[sD].lMonth ==10) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '十月';
			}
			else if (cld[sD].lMonth ==11) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '十一月';
			}
			else if (cld[sD].lMonth ==12) {
            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + '十二月';
			}
//            lObj.innerHTML = (cld[sD].isLeap?'闰':'') + cld[sD].lMonth + '月' + (monthDays(cld[sD].lYear,cld[sD].lMonth)==29?'小':'大');
         }
	else //显示农历日
            lObj.innerHTML = cDay(cld[sD].lDay);

         s=cld[sD].lunarFestival;
         if(s.length>0) { //农历节日
            if(s.length>6) s = s.substr(0, 4)+'...';
            s = s.fontcolor('');
         }
         else { //国历节日
            s=cld[sD].solarFestival;
            if(s.length>0) {
               size = (s.charCodeAt(0)>0 && s.charCodeAt(0)<128)?8:4;
               if(s.length>size+2) s = s.substr(0, size)+'...';
               s = s.fontcolor('');
            }
            else { //廿四节气
               s=cld[sD].solarTerms;
               if(s.length>0) s = s.fontcolor('');
            }
         }
         if(s.length>0) lObj.innerHTML = s;

      }
      else { //非日期
         sObj.innerHTML = '';
         lObj.innerHTML = '';
      }
   }
   //$("upqi").style.display="block";
}




/*****************************************************************************
                                   个人偏好设定
*****************************************************************************/

var conWeekend = 3;  // 星期六颜色显示: 1=黑色, 2=绿色, 3=红色, 4=隔周休


/*****************************************************************************
                                   日期资料
*****************************************************************************/

var lunarInfo=new Array(
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
0x14b63);

var solarMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
var Animals=new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");
var solarTerm = new Array("小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至");
var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758);
var nStr1 = new Array('日','一','二','三','四','五','六','七','八','九','十');
var nStr2 = new Array('初','十','廿','卅','□');
var monthName = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");

var sFtv = new Array(
"0101*元旦",
"0501*劳动节",
"1001*国庆")


//农历节日 *表示放假日
var lFtv = new Array(
"0101*春节",
"0102*初二",
"0103*初三",
"0115*元宵",
"0505*端午",
"0815*中秋",
"0909*重阳",
"0100*除夕")

//某月的第几个星期几。 5,6,7,8 表示到数第 1,2,3,4 个星期几
var wFtv = new Array(
//"0520 母亲节",
//"0630 父亲节",
//"1144 感恩节"
);

/*****************************************************************************
                                      日期计算
*****************************************************************************/

//====================================== 传回农历 y年的总天数
function lYearDays(y) {
   var i, sum = 348;
   for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-2006] & i)? 1: 0;
   return(sum+leapDays(y));
}

//====================================== 传回农历 y年闰月的天数
function leapDays(y) {
   if(leapMonth(y))  return((lunarInfo[y-2006] & 0x10000)? 30: 29);
   else return(0);
}

//====================================== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
function leapMonth(y) {
   return(lunarInfo[y-2006] & 0xf);
}

//====================================== 传回农历 y年m月的总天数
function monthDays(y,m) {
   return( (lunarInfo[y-2006] & (0x10000>>m))? 30: 29 );
}


//====================================== 算出农历, 传入日期物件, 传回农历日期物件
//                                       该物件属性有 .year .month .day .isLeap
function Lunar(objDate) {

   var i, leap=0, temp=0;
   var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(2006,0,31))/86400000;

   for(i=2006; i<2050 && offset>0; i++) { temp=lYearDays(i); offset-=temp; }

   if(offset<0) { offset+=temp; i--; }

   this.year = i;

   leap = leapMonth(i); //闰哪个月
   this.isLeap = false;

   for(i=1; i<13 && offset>0; i++) {
      //闰月
      if(leap>0 && i==(leap+1) && this.isLeap==false)
         { --i; this.isLeap = true; temp = leapDays(this.year); }
      else
         { temp = monthDays(this.year, i); }

      //解除闰月
      if(this.isLeap==true && i==(leap+1)) this.isLeap = false;

      offset -= temp;
   }

   if(offset==0 && leap>0 && i==leap+1)
      if(this.isLeap)
         { this.isLeap = false; }
      else
         { this.isLeap = true; --i; }

   if(offset<0){ offset += temp; --i; }

   this.month = i;
   this.day = offset + 1;
}

//==============================传回国历 y年某m+1月的天数
function solarDays(y,m) {
   if(m==1)
      return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
   else
      return(solarMonth[m]);
}
//============================== 传入 offset 传回干支, 0=甲子
function cyclical(num) {
   return(Gan[num%10]+Zhi[num%12]);
}

//============================== 月历属性
function calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,cYear,cMonth,cDay) {

      this.isToday    = false;
      //国历
      this.sYear      = sYear;   //西元年4位数字
      this.sMonth     = sMonth;  //西元月数字
      this.sDay       = sDay;    //西元日数字
      this.week       = week;    //星期, 1个中文
      //农历
      this.lYear      = lYear;   //西元年4位数字
      this.lMonth     = lMonth;  //农历月数字
      this.lDay       = lDay;    //农历日数字
      this.isLeap     = isLeap;  //是否为农历闰月?
      //八字
      this.cYear      = cYear;   //年柱, 2个中文
      this.cMonth     = cMonth;  //月柱, 2个中文
      this.cDay       = cDay;    //日柱, 2个中文

      this.color      = '';

      this.lunarFestival = ''; //农历节日
      this.solarFestival = ''; //国历节日
      this.solarTerms    = ''; //节气
}

//===== 某年的第n个节气为几日(从0小寒起算)
function sTerm(y,n) {
   var offDate = new Date( ( 31556925974.7*(y-2006) + sTermInfo[n]*60000  ) + Date.UTC(2006,0,6,2,5) );
   return(offDate.getUTCDate());
}




//============================== 传回月历物件 (y年,m+1月)
/*
功能说明: 传回整个月的日期资料物件

使用方式: OBJ = new calendar(年,零起算月);

  OBJ.length      传回当月最大日
  OBJ.firstWeek   传回当月一日星期

  由 OBJ[日期].属性名称 即可取得各项值

  OBJ[日期].isToday  传回是否为今日 true 或 false

  其他 OBJ[日期] 属性参见 calElement() 中的注解
*/
function calendar(y,m) {
   //alert("calendar begin");
   var sDObj, lDObj, lY, lM, lD=1, lL, lX=0, tmp1, tmp2, tmp3;
   var cY, cM, cD; //年柱,月柱,日柱
   var lDPOS = new Array(3);
   var n = 0;
   var firstLM = 0;

   sDObj = new Date(y,m,1,0,0,0,0);    //当月一日日期

   this.length    = solarDays(y,m);    //国历当月天数
   this.firstWeek = sDObj.getDay();    //国历当月1日星期几


//alert("calendar end 1");


   ////////年柱 2006年春分后为庚子年(60进制36)
   if(m<2) cY=cyclical(y-2006+36-1);
   else cY=cyclical(y-2006+22);
   var term2=sTerm(y,2); //立春日期

   ////////月柱 1900年1月小寒以前为 丙子月(60进制12)
   var firstNode = sTerm(y,m*2) //传回当月「节」为几日开始
   cM = cyclical((y-2006)*12+m+12);

   //当月一日与 1900/1/1 相差天数
   //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
   var dayCyclical = Date.UTC(y,m,1,0,0,0,0)/86400000+25567+10;
//alert("calendar end 2");
   for(var i=0;i<this.length;i++) {

      if(lD>lX) {
         sDObj = new Date(y,m,i+1);    //当月一日日期
         lDObj = new Lunar(sDObj);     //农历
         lY    = lDObj.year;           //农历年
         lM    = lDObj.month;          //农历月
         lD    = lDObj.day;            //农历日
         lL    = lDObj.isLeap;         //农历是否闰月
         lX    = lL? leapDays(lY): monthDays(lY,lM); //农历当月最后一天

         if(n==0) firstLM = lM;
         lDPOS[n++] = i-lD+1;
      }

      //依节气调整二月分的年柱, 以春分为界
      if(m==1 && (i+1)==term2) cY=cyclical(y-2006+36);
      //依节气月柱, 以「节」为界
      if((i+1)==firstNode) cM = cyclical((y-2006)*12+m+13);
      //日柱
      cD = cyclical(dayCyclical+i);

      //sYear,sMonth,sDay,week,
      //lYear,lMonth,lDay,isLeap,
      //cYear,cMonth,cDay
      this[i] = new calElement(y, m+1, i+1, nStr1[(i+this.firstWeek)%7],
                               lY, lM, lD++, lL,
                               cY ,cM, cD );



   }
//alert("calendar end 3");



//alert("calendar end 4");

   //今日
   if(y==tY && m==tM) this[tD-1].isToday = true;

//alert("calendar end");
}

//======================================= 传回该年的复活节(春分后第一次满月周后的第一主日)
function easter(y) {

   var term2=sTerm(y,5); //取得春分日期
   var dayTerm2 = new Date(Date.UTC(y,2,term2,0,0,0,0)); //取得春分的国历日期物件(春分一定出现在3月)
   var lDayTerm2 = new Lunar(dayTerm2); //取得取得春分农历

   if(lDayTerm2.day<15) //取得下个月圆的相差天数
      var lMlen= 15-lDayTerm2.day;
   else
      var lMlen= (lDayTerm2.isLeap? leapDays(y): monthDays(y,lDayTerm2.month)) - lDayTerm2.day + 15;

   //一天等于 1000*60*60*24 = 86400000 毫秒
   var l15 = new Date(dayTerm2.getTime() + 86400000*lMlen ); //求出第一次月圆为国历几日
   var dayEaster = new Date(l15.getTime() + 86400000*( 7-l15.getUTCDay() ) ); //求出下个周日

   this.m = dayEaster.getUTCMonth();
   this.d = dayEaster.getUTCDate();

}

//====================== 中文日期
function cDay(d){
   var s;

   switch (d) {
      case 10:
         s = '初十'; break;
      case 20:
         s = '二十'; break;
         break;
      case 30:
         s = '三十'; break;
         break;
      default :
         s = nStr2[Math.floor(d/10)];
         s += nStr1[d%10];
   }
   return(s);
}


function changeCld() {
   var y,m;
   y=CLD.SY.selectedIndex+autoStartYear;
   m=CLD.SM.selectedIndex;
   drawCld(y,m);
}

function pushBtm(K) {
   switch (K){
      case 'YU' :
         if(CLD.SY.selectedIndex>0) CLD.SY.selectedIndex--;
         break;
      case 'YD' :
         if(CLD.SY.selectedIndex<150) CLD.SY.selectedIndex++;
         break;
      case 'MU' :
         if(CLD.SM.selectedIndex>0) {
            CLD.SM.selectedIndex--;
         }
         else {
            CLD.SM.selectedIndex=11;
            if(CLD.SY.selectedIndex>0) CLD.SY.selectedIndex--;
         }
         break;
      case 'MD' :
         if(CLD.SM.selectedIndex<11) {
            CLD.SM.selectedIndex++;
         }
         else {
            CLD.SM.selectedIndex=0;
            if(CLD.SY.selectedIndex<150) CLD.SY.selectedIndex++;
         }
         break;
      default :
         CLD.SY.selectedIndex=tY-autoStartYear;
         CLD.SM.selectedIndex=tM;
   }
   changeCld();
}

var Today = new Date();
var tY = Today.getFullYear();
var tM = Today.getMonth();
var tD = Today.getDate();
//////////////////////////////////////////////////////////////////////////////

var width = "130";
var offsetx = 2;
var offsety = 8;

var x = 0;
var y = 0;
var snow = 0;
var sw = 0;
var cnt = 0;

var dStyle;
//document.onmousemove = mEvn;

//显示详细日期资料
function mOvr(v) {
   var s,festival;
   var sObj=eval('SD'+ v);
   var d=sObj.innerHTML-1;

      //sYear,sMonth,sDay,week,
      //lYear,lMonth,lDay,isLeap,
      //cYear,cMonth,cDay

   if(sObj.innerHTML!='') {

      sObj.style.cursor = '';

      if(cld[d].solarTerms == '' && cld[d].solarFestival == '' && cld[d].lunarFestival == '')
         festival = '';
      else
         festival = '<TABLE WIDTH=100% BORDER=0 CELLPADDING=4 CELLSPACING=0 BGCOLOR="red"><TR><TD style="font-size:12px; line-height:18px; color:#ffffff;">'+
         '<b>'+cld[d].solarTerms + ' ' + cld[d].solarFestival + ' ' + cld[d].lunarFestival+'</b></TD>'+
         '</TR></TABLE>';

      s= '<table cellpadding=1 cellspacing=0 border=0 bgcolor=black><tr><td><TABLE WIDTH="100%" BORDER=0 CELLPADDING="3" CELLSPACING=0 BGCOLOR="#FFFFE1"><TR>' +
         '<TD style="font-size:12px;line-height:18px;">'+
         cld[d].sYear+'年'+cld[d].sMonth+'月'+cld[d].sDay+'日，星期'+cld[d].week+'<br>'+
         '农历'+(cld[d].isLeap?'闰':'')+cld[d].lMonth+'月'+cld[d].lDay+'日<br>'+
         ''+cld[d].cYear+'年 '+cld[d].cMonth+'月 '+cld[d].cDay + '日'+
         '</TD></TR></TABLE>'+ festival +'</td></tr></table>';

      document.all["detail"].innerHTML = s;

      if (snow == 0) {
         dStyle.left = x+offsetx-(width/2);
         dStyle.top = y+offsety;
         dStyle.visibility = "visible";
         snow = 1;
      }
   }
}

//清除详细日期资料
function mOut() {

}

//取得位置
function mEvn() {
   x=event.x;
   y=event.y;
   /*
   if (document.body.scrollLeft)
      {x=event.x+document.body.scrollLeft; y=event.y+document.body.scrollTop;}
   */
   if (snow){
      dStyle.left = x+offsetx-(width/2);
      dStyle.top = y+offsety;
   }
}


///////////////////////////////////////////////////////////////////////////

function initialize() {
   dStyle = detail.style;
   //从连接中获取年月
   var pos1,pos2;
   var curUrl;
	
   curUrl = window.location.href;
   
   var re = /\/(\d{4})-(\d{2})\/(\d{2})\/node_(\d+).htm/im;
   
   if(curUrl.match(re))
   {
   	tY = RegExp.$1 - 0;
   	tM = RegExp.$2 - 1;
   	tD = RegExp.$3;
	//alert(firstPageid);
   	//alert(tY);
   }
   else
   {
	    re = /\/(\d{4})-(\d{2})\/(\d{2})\/content_(\d+)_(\d+).htm/im;
        if(curUrl.match(re))
        {
		tY = RegExp.$1 - 0;
   		tM = RegExp.$2 - 1;
   		tD = RegExp.$3;
		//alert(firstPageid);
   		//alert(tY);
        }
        else
        {
            re = /\/(\d{4})-(\d{2})\/(\d{2})\/index_(\d+)-(\d+)-(\d+).htm/im;
            if(curUrl.match(re))
            {
		    tY = RegExp.$1 - 0;
   		    tM = RegExp.$2 - 1;
   		    tD = RegExp.$3;
			JQ("#daydh").attr({ style: "FILTER: alpha(opacity=100); display: none; position: absolute; left: 500px; top: 65px; z-index:99;" });
            }
        }
   }
       
   //////////////////////
   CLD.SY.selectedIndex=tY-autoStartYear;
   CLD.SM.selectedIndex=tM;
   //drawCld(tY,tM);

}

function terminate() {
   setCookie("TZ1",objContinentMenu.selectedIndex);
   setCookie("TZ2",objCountryMenu.selectedIndex);
}


function turnpage(src,mode){

  currPos = src.selectedIndex;

  if(mode==0){//前翻
  	if(currPos==0) return;
	else {
	  src.selectedIndex = currPos -1;
	  src.onchange();
	}  
  }else{
     if(currPos == src.length-1)
	 return;
	 else {
	   src.selectedIndex = currPos +1;
	   src.onchange();
	 }
  }
}


function changeMPCld()
{
   var y,m;
   y=CLD.SY.selectedIndex + autoStartYear;
   m=CLD.SM.selectedIndex;
   //alert(m);
   OBJ_MP_LOADACTION.loadPeriods("",y+"-"+appendZero(m+1));

}

function autoShowDate(){
	//var dateX=event.clientX + document.body.scrollLeft;
	//var dateY=event.clientY + document.body.scrollTop;
	//document.getElementById("dateDiv").style.left=dateX + "px";
	//document.getElementById("dateDiv").style.top=dateY + "px";
	if(document.getElementById("daydh").style.display=="none"){
		document.getElementById("daydh").style.display="block";
	}else{
		document.getElementById("daydh").style.display="none";
	}
}


//-->
