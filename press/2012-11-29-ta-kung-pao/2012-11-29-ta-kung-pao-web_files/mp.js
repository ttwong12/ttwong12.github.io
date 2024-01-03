var browser;
var b_version;
var version;
var browserType = 0;
browser = navigator.appName;
b_version = navigator.appVersion;
version = parseFloat(b_version);
if (browser.indexOf("Microsoft Internet Explorer") != -1 ||
browser.indexOf("Microsoft") != -1) 
    browserType = 1;
else 
    if (browser.indexOf("Netscape") != -1) 
        browserType = 2;
var djConfig = {
    useXDomain: true,
    xdWaitSeconds: 100,
    baseScriptUri: 'dojo.js',
    extraLocale: ['en-us', 'de', 'nl', 'ja', 'zh-cn', 'zh-tw']
};


/*----------------------------------------------------------------------------------*/
//期次类 封装期次数据并提供一些方法
var MP_PERIOD = Class.create();

MP_PERIOD.prototype = {

    initialize: function(xmlEle){
    
        //alert("init period");
        this.period_date = OBJ_MP_UTILS.getNodeText(xmlEle, "date");
        
        //		this.period_id = OBJ_MP_UTILS.getAttributeText(xmlEle,"id");
        //		this.period_name = OBJ_MP_UTILS.getNodeText(xmlEle,"period_name");
        //		this.paper_id = OBJ_MP_UTILS.getNodeText(xmlEle,"paper_id");
        //		this.period_date = OBJ_MP_UTILS.getNodeText(xmlEle,"period_date");
        		this.rmp_exe_path = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_exe_path");
        //		this.rmp_pic_path = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_pic_path");
        //		this.rmp_xml_path = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_xml_path");
        //		this.rmp_build_time = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_build_time");
    
    },
    
    downloadRMP: function(){
    },
    
    getRmpExePath: function(){
        if (typeof this.rmp_exe_path == "string" && this.rmp_exe_path.length > 0) {
            //return "../../../rmp/" + this.rmp_exe_path;
            return "../../../resfile/" + this.rmp_exe_path;
        }
        else {
            return "";
        }
        
    },
    
    getRmpPicPath: function(){
        if (typeof this.rmp_pic_path == "string" && this.rmp_pic_path.length > 0) {
            return "../../../../rmp/" + this.rmp_pic_path;
        }
        else {
            return "";
        }
    },
    
    getDateStr: function(){
        if (typeof this.period_date == "string") {
            var r = this.period_date.match(/\d{4}-\d{2}-(\d{2})/i);
            if (r) {
                return r[1];
            }
            else 
                return '';
        }
        else 
            return '';
    },
    
    getPeriodDate: function(){
    
        if (typeof this.period_date == "string") {
            var r = this.period_date.match(/(\d{4})-(\d{2})-(\d{2})/i);
            if (r) {
                var ret = new Date();
                ret.setFullYear(parseInt(r[1]), parseInt(r[2]) - 1, r[3]);
                return ret;
                
            }
            else 
                return null;
        }
        else 
            return null;
        
    },
    
    getPeriodDateArray: function(){
        if (typeof this.period_date == "string") {
            var r = this.period_date.match(/(\d{4})-(\d{2})-(\d{2})/i);
            if (r) {
                return r;
                
            }
            else 
                return null;
        }
        else 
            return null;
    },
    
    
    getPeriodUrl: function(){
    
        var sUrl = location.href;
        var r = this.getPeriodDateArray();
        if (r) {
            sUrl = sUrl.replace(/\d{4}-\d{2}\/\d{2}/g, r[1] + "-" + r[2] + "/" + r[3]);
            var contentRe = /content_\d+\_\d+\.htm/i;
            var r1 = sUrl.match(contentRe);
            if (r1) {
                if (typeof OBJ_MP_CONFIG.content_htm_jump == "string" && OBJ_MP_CONFIG.content_htm_jump.length > 0) {
                    sUrl = sUrl.replace(contentRe, OBJ_MP_CONFIG.content_htm_jump);
                    return sUrl;
                }
                else {
                    alert("没有为内容页指定跳转目标");
                    return "#";
                }
            }
            
            var nodeRe = /node_\d+\.htm/i;
            var r2 = sUrl.match(nodeRe);
            if (r2) {
                if (typeof OBJ_MP_CONFIG.node_htm_jump == "string" && OBJ_MP_CONFIG.node_htm_jump.length > 0) {
                    sUrl = sUrl.replace(nodeRe, OBJ_MP_CONFIG.node_htm_jump);
                    return sUrl;
                }
                else {
                    return sUrl;
                }
            }
            //2009-11-24新添加
            var indexRe = /index_\d+\-\d+\-\d+\.htm/i;
            var r3 = sUrl.match(indexRe);
            if (r3) {
                if (typeof OBJ_MP_CONFIG.index_htm_jump == "string" && OBJ_MP_CONFIG.index_htm_jump.length > 0) {
                    sUrl = sUrl.replace(indexRe, OBJ_MP_CONFIG.index_htm_jump);
                    return sUrl;
                }
                else {
                    return sUrl;
                }
            }
        }
        else 
            return "#";
        
    }
    
}

/*-----------------------------------------------------------------------------------*/
//版次类
var MP_PAGENODE = Class.create();
MP_PAGENODE.prototype = {

    initialize: function(xmlEle){
    
        this.pagenodename = OBJ_MP_UTILS.getAttributeText(xmlEle, "name");
        this.pagenodeid = OBJ_MP_UTILS.getAttributeText(xmlEle, "id");
        var pages = [];
        var ePages;
        if (browserType == 1) 
            ePages = xmlEle.selectNodes("period");
        else 
            if (browserType == 2) 
                ePages = xmlEle.getElementsByTagName("period");
            else 
                ePages = xmlEle.getElementsByTagName("period");
        var arrPages = $A(ePages);
        var index = 0;
        arrPages.each(function(node){
        
            var tmpPeriodid = parseInt(OBJ_MP_UTILS.getAttributeText(node, "id"));
            //alert("periodid == "+tmpPeriodid);
            if (typeof tmpPeriodid == "number" && tmpPeriodid > 0) {
                //alert("a page == "+tmpPeriodid);
                pages[index] = new MP_PAGE(node);
                index++;
            }
            
        });
        
        this.pages = pages;
        
    }
}


var MP_PAGE = Class.create();
MP_PAGE.prototype = {

    initialize: function(xmlEle){
    
    
        this.period_id = OBJ_MP_UTILS.getAttributeText(xmlEle, "id");
        var classnodes = [];
        var eClassnodes;
        if (browserType == 1) 
            eClassnodes = xmlEle.selectNodes("nodeid");
        else 
            if (browserType == 2) 
                eClassnodes = xmlEle.getElementsByTagName("nodeid");
            else 
                eClassnodes = xmlEle.getElementsByTagName("nodeid");
        var arrClassnodes = $A(eClassnodes);
        var index = 0;
        arrClassnodes.each(function(node){
            var classnode = parseInt(OBJ_MP_UTILS.getAttributeText(node, "id"));
            if (typeof classnode == "number" && classnode > 0) {
                classnodes[index] = classnode;
                index++;
            }
            
        });
        this.classnodes = classnodes;
        
    }
    
}



/*-----------------------------------------------------------------------------------*/
//工具类
var MP_UTILS = Class.create();

MP_UTILS.prototype = {

    initialize: function(){
    },
    
    getNodeText: function(xmlEle, nodeName){
        //alert(nodeName);
        return Try.these(function(){
            if (browserType == 1) 
                return xmlEle.selectSingleNode(nodeName).text;
            else 
                if (browserType == 2) 
                    return xmlEle.getElementsByTagName(nodeName)[0].firstChild.data;
                else 
                    return xmlEle.getElementsByTagName(nodeName)[0].firstChild.data;
        }, function(){
            return ''
        })
    },
    
    getAttributeText: function(xmlEle, attrName){
    
        //alert(nodeName);
        return Try.these(function(){
            return xmlEle.getAttribute(attrName);
        }, function(){
            return ''
        })
    },
    
    testDateValid: function(periods, testdate){
        if (typeof periods == "object") {
            return periods.detect(function(node){
                return testdate == node.getDateStr() || testdate == node.period_date;
            });
        }
        else {
            return null;
        }
    }
    
}

var OBJ_MP_UTILS = new MP_UTILS();

/*-----------------------------------------------------------------------------------*/
//xml装载类
var MP_LOADACTION = Class.create();

MP_LOADACTION.prototype = {

    initialize: function(){
        this.period_xml_month = "";
        this.page_xml_month = "";
    },
    
    
    /*---有关period.xml的装载逻辑--*/
    //装载XML并初始化期次列表
    loadPeriods: function(xmlUrl, sMonth){
        mp_periods = [];
        var myXmlUrl = xmlUrl;
        //首先计算xmlUrl 如果没有传入 就用函数自动查找
        if (!(typeof xmlUrl == "string" && xmlUrl.length > 0)) 
            myXmlUrl = this.findPeriodXmlUrl(sMonth);
        
        if (typeof myXmlUrl != "string" || myXmlUrl.length == 0) {
            //alert("没有xmlUrl！");
            return;
        }
        
        //	alert("hi "+myXmlUrl);
        var myAjax = new Ajax.Request(myXmlUrl, {
            method: 'get',
            parameters: '',
            onSuccess: this._loadPeriodSuccess,
            onFailure: this._loadPeriodFailure
        });
        
    },
    
    
    
    
    //寻找新的一月对应的XML地址
    //var l
    findPeriodXmlUrl: function(sMonth){
    
    
        var localUrl = location.href;
        var re = /[\s\S]+?(\d{4}-\d{2})[\/\\]/i;
        var monthRe = /\d{4}-\d{2}/i;
        var r = localUrl.match(re);
        if (r) {
            //			var retUrl = r[0] + "period.xml";
            var retUrl = r[0] + "navi.xml";
            this.period_xml_month = r[1];
            if (typeof sMonth == "string" && monthRe.test(sMonth)) {
                this.period_xml_month = sMonth;
                
                retUrl = retUrl.replace(monthRe, sMonth);
            }
            
            return retUrl;
        }
        else {
            alert("location.href no date param");
        }
        
    },
    
    
    
    
    _loadPeriodFailure: function(retRequest){
    
        OBJ_MP_CALLBACK.onPeriodListLoaded([]);
    },
    
    _loadPeriodSuccess: function(retRequest){
        try {
        
            //alert("装载完毕");
            var periods = [];
            retTxt = retRequest.responseText;
            retDoc = retRequest.responseXML;
            var xList;
            //			if(browserType == 1)
            //				xList = retDoc.selectNodes("/periodlist/period");
            //			else if(browserType==2)
            //				xList = retDoc.getElementsByTagName("period");
            //			else
            //				xList = retDoc.getElementsByTagName("period");
            if (browserType == 1) 
                xList = retDoc.selectNodes("/navi/calendar");
            else 
                if (browserType == 2) 
                    xList = retDoc.getElementsByTagName("calendar");
                else 
                    xList = retDoc.getElementsByTagName("calendar");
            var aList = $A(xList);
            var index = 0;
            aList.each(function(node){
                var aPeriod = new MP_PERIOD(node);
                periods[index] = aPeriod;
                index++;
            });
            OBJ_MP_CALLBACK.onPeriodListLoaded(periods);
            
        } 
        catch (e) {
            alert(e.message);
        }
    },
    
    
    /*---有关page.xml的装载逻辑--*/
    //装载XML并初始化版次列表
    loadPages: function(xmlUrl, sMonth){
    
        var myXmlUrl = xmlUrl;
        
        //首先计算xmlUrl 如果没有传入 就用函数自动查找
        if (!(typeof xmlUrl == "string" && xmlUrl.length > 0)) 
            myXmlUrl = this.findPageXmlUrl(sMonth);
        
        if (typeof myXmlUrl != "string" || myXmlUrl.length == 0) {
            //alert("没有xmlUrl！");
            return;
        }
        
        //alert("hi "+myXmlUrl);
        var myAjax = new Ajax.Request(myXmlUrl, {
            method: 'get',
            parameters: '',
            onSuccess: this._loadPageSuccess,
            onFailure: this._loadPageFailure
        });
    },
    
    
    //寻找新的一月对应的XML地址
    findPageXmlUrl: function(sMonth){
    
        //alert(sMonth);
        var localUrl = location.href;
        var re = /[\s\S]+?(\d{4}-\d{2})[\/\\]/i;
        var monthRe = /\d{4}-\d{2}/i;
        var r = localUrl.match(re);
        if (r) {
            var retUrl = r[0] + "page.xml";
            this.page_xml_month = r[1];
            if (typeof sMonth == "string" && monthRe.test(sMonth)) {
                this.page_xml_month = sMonth;
                retUrl = retUrl.replace(monthRe, sMonth);
            }
            
            return retUrl;
        }
        /*else
         {
         alert("location.href no date param");
         }*/
    },
    
    _loadPageFailure: function(retRequest){
    
    
        OBJ_MP_CALLBACK.onPageListLoaded([]);
    },
    
    _loadPageSuccess: function(retRequest){
        try {
        
            //alert("装载完毕");
            var pages = [];
            retTxt = retRequest.responseText;
            retDoc = retRequest.responseXML;
            var xList;
            if (browserType == 1) 
                xList = retDoc.selectNodes("/pagelist/page");
            else 
                if (browserType == 2) 
                    xList = retDoc.getElementsByTagName("page");
                else 
                    xList = retDoc.getElementsByTagName("page");
            var aList = $A(xList);
            var index = 0;
            aList.each(function(node){
                var aPageNode = new MP_PAGENODE(node);
                pages[index] = aPageNode;
                index++;
            });
            OBJ_MP_CALLBACK.onPageListLoaded(pages);
            
        } 
        catch (e) {
            //alert(e.message);
        }
    }
    
}

var OBJ_MP_LOADACTION = new MP_LOADACTION();




/*-----------------------------------------------------------------------------------*/
//装载数据类
var MP_CALLBACK = Class.create();

MP_CALLBACK.prototype = {

    initialize: function(){
    
    },
    
    
    
    onPeriodListLoaded: function(){
        //alert('hi period.xml over')
    },
    
    onPageListLoaded: function(){
        //alert('hi page.xml over')
    }
}

var OBJ_MP_CALLBACK = new MP_CALLBACK();


/*-----------------------------------------------------------------------------------*/
//配置类
var MP_CONFIG = Class.create();

MP_CONFIG.prototype = {

    initialize: function(){
    
        this.content_htm_jump = "node_1.htm";
        this.node_htm_jump = "node_1.htm";
        this.index_htm_jump = "node_1.htm";
        
    },
    
    needGlobalCld: function(){
    
        var sUrl = location.href;
        var contentRe = /content_\d+\_\d+\.htm/i;
        var r1 = sUrl.match(contentRe);
        if (r1) {
            return true
        }
        
        
        var nodeRe = /node_\d+\.htm/i;
        var r2 = sUrl.match(nodeRe);
        if (r2) {
            if (typeof OBJ_MP_CONFIG.node_htm_jump == "string" && OBJ_MP_CONFIG.node_htm_jump.length > 0) {
                return true;
            }
            else {
                return false;
            }
            
        }
        
        //2009-11-24新添加
        var indexRe = /index_\d+\-\d+\-\d+\.htm/i;
        var r3 = sUrl.match(indexRe);
        if (r3) {
            if (typeof OBJ_MP_CONFIG.index_htm_jump == "string" && OBJ_MP_CONFIG.index_htm_jump.length > 0) {
                return true;
            }
            else {
                return false;
            }
            
        }
        
        return true;
        
    }
    
}


var OBJ_MP_CONFIG = new MP_CONFIG();





/*-------------------------------主程序-----------------------------------*/


//指定月的期次数组
var mp_periods = [];

//指定月的版次数组
var mp_pagenodes = [];

//所有xml执行完后需要运行的代码
var mp_xmlloadedmethod = [];

//当前页对应的时间 yyyy-mm-dd格式
var mp_pageday = "";

//当前页对应的期次
var mp_period = null;

//当前页对应的版次
var mp_pagenode = null;

//当前页对应的版面
var mp_page = null;

//当前页对应的版次节点id
var mp_pagenodeid = 0;

MP_CALLBACK.prototype.onPeriodListLoaded = function(node){

    mp_periods = node;
    mp_periods.sortBy(function(mynode){
        return mynode.getPeriodDate();
    });
    
    if (typeof mp_pageday == "string" && mp_pageday.length > 0) {
    
        var tmpPeriod = OBJ_MP_UTILS.testDateValid(node, mp_pageday);
        if (tmpPeriod) 
            mp_period = tmpPeriod;
    }
    changeCld();
    //OBJ_MP_LOADACTION.loadPages();
    //alert(OBJ_MP_UTILS.testDateValid(node,"17"));
}


MP_CALLBACK.prototype.onPageListLoaded = function(node){
    //alert(node.length);
    mp_pagenodes = node;
    if (mp_pagenodeid > 0) {
        //alert(mp_pagenodeid);
        //initialize();
        var tmpPagenode = node.detect(function(node){
            return node.pagenodeid == mp_pagenodeid;
            //alert(node.pagenodeid);
        });
        //alert("pagenode == "+tmpPagenode);
        //alert("pagenode2 == "+tmpPagenode.pages);
        if (tmpPagenode) 
            mp_pagenode = tmpPagenode;
        
        if (mp_period && tmpPagenode) {
            mp_page = tmpPagenode.pages.detect(function(node){
                node.period_id == mp_period.period_id;
            });
        }
    }
    
    mp_xmlloadedmethod.each(function(node){
        //alert(node);
        if (typeof node == "string" && node.length > 0) 
            eval(node);
        
    });
    //alert("hi");
    changeCld();
    
}




function viewOL_RMP(){
    if (typeof mp_period == "object" && mp_period != null) {
        var exeUrl = mp_period.getRmpExePath();
        if (exeUrl.length > 0) {
            var nowUrl = location.href;
            var re = /(http:\/\/[\s\S]+?)\/html/i;
            var r = nowUrl.match(re);
            if (r) {
                var rmpUrl = r[1];
//                var re2 = /(rmp\/[\s\S]+?\.exe)/i;
                var re2 = /(resfile\/[\s\S]+?\.exe)/i;
                var r2 = exeUrl.match(re2);
                if (r2) {
                    rmpUrl += "/" + r2[1];
                    
                    window.open("../../../framepage/FFNPlayer.htm?rmp=" + rmpUrl, "", "fullscreen=yes");
                }
            }
            //alert("/FFNPlayer.htm?rmp="+location.href+exeUrl);
            //window.open("/FFNPlayer.htm?rmp="+location.href+exeUrl);
            //newwin.location.href = exeUrl;
        }
        else 
            alert("该期报刊RMP数据不存在！");
    }
    else {
        alert("正在下载期次数据，请稍候……");
    }
}





function openRMP(){
    if (typeof mp_period == "object" && mp_period != null) {
        var exeUrl = mp_period.getRmpExePath();
        if (exeUrl.length > 0) {
            open("" + exeUrl, "", "height=0,width=0", "", "fullscreen=yes");
            //newwin.location.href = exeUrl;
        }
        else 
            alert("该期报刊RMP数据不存在！");
    }
    else {
        alert("正在下载期次数据，请稍候……");
    }
}

var preDate = new Array(3);
function getPreDate(year, month){
    var preDate = new Array(3);
    if (month == 1) {
        preDate[0] = parseInt(year - 1) + "-12";
        preDate[1] = parseInt(year - 1);
        preDate[2] = 12;
    }
    else 
        if (month >= 11 && month <= 12) {
            preDate[0] = year + "-" + parseInt(month - 1);
            preDate[1] = parseInt(year);
            preDate[2] = parseInt(month - 1);
        }
        else {
            preDate[0] = year + "-0" + parseInt(month - 1);
            preDate[1] = parseInt(year);
            preDate[2] = "0" + parseInt(month - 1);
        }
    return preDate;
}

function getPrePeriodAjax(maxIntervalMonth){
    var reMonth = /(\d{4})-(\d{2})/;
    var reMonthNum = OBJ_MP_LOADACTION.period_xml_month.match(reMonth);
    var xmlHttp = createAjax();
    var tempYear = 0;
    var tempMonth = 0;
    if (reMonthNum) {
        tempYear = reMonthNum[1];
        tempMonth = reMonthNum[2];
        var i = 0;
        while (i < maxIntervalMonth) {
            preDate = getPreDate(tempYear, tempMonth);
            var pre = new MP_LOADACTION();
            var prePeriodXmlUrl = pre.findPeriodXmlUrl(preDate[0]);
            try {
                xmlHttp.open("get", prePeriodXmlUrl, false);
                xmlHttp.send("");
            } 
            catch (e) {
                xmlHttp = null;
            }
            if (xmlHttp != null && xmlHttp.status != null && xmlHttp.status == 404 && i >= maxIntervalMonth - 1) {
                xmlHttp = null;
                break;
            }
            else 
                if (xmlHttp != null && xmlHttp.status != null && xmlHttp.status != 404) {
                    break;
                }
                else 
                    if (tempMonth == 1) {
                        tempYear = tempYear - 1;
                        tempMonth = 12;
                    }
                    else 
                        tempMonth = tempMonth - 1;
            i++;
        }
    }
    else {
        xmlHttp = null;
        alert("时间格式不是yyyy-mm!");
    }
    return xmlHttp;
}

function GetMsXmlHttp(clsids){
    var xmlHttp = null;
    for (var i = 0; i < clsids.length; i++) {
    
        try {
            xmlHttp = new ActiveXObject(clsids[i]);
        } 
        catch (e) {
            xmlHttp = null;
        }
        if (xmlHttp != null) 
            break;
    }
    return xmlHttp;
}

function createAjax(){
    var xmlHttp = null;
    var clsids = ["MSXML2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP.2.6", "Msxml2.XMLHTTP.1.0", "Microsoft.XMLHTTP.1", "Microsoft.XMLHTTP"];
    
    if (window.XMLHttpRequest) {
        if (xmlHttp == null) {
            xmlHttp = new XMLHttpRequest();
            //xmlHttp.overrideMimeType('text/html');
        }
    }
    else 
        if (window.ActiveXObject) {
            /*xmlHttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
         if(xmlHttp==null)
         {
         xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
         }*/
            xmlHttp = GetMsXmlHttp(clsids);
        }
    return xmlHttp;
}

function goPrePeriod(){
    var maxIntervalMonth = 2;//最大间隔期为2个月
    var monthRe = /\d{4}-\d{2}/i;
    if (typeof OBJ_MP_LOADACTION.period_xml_month == "string" && monthRe.test(OBJ_MP_LOADACTION.period_xml_month)) {
    
        var findIndex = mp_pageday.indexOf(OBJ_MP_LOADACTION.period_xml_month);
        if (findIndex > -1) {
            var prePeriods = mp_periods.findAll(function(mynode){
                return mynode.getPeriodDate().getDate() < mp_period.getPeriodDate().getDate()
            });
            if (typeof prePeriods == "object" && prePeriods != null && prePeriods.length > 0) {
            
                prePeriods.sortBy(function(mynode){
                    return mynode.getPeriodDate();
                });
                
                var lastPeriod = prePeriods[prePeriods.length - 1];
                //alert(lastPeriod.getPeriodUrl());
                var loopNum = 0;
                var href = location.href;
                while (href != lastPeriod.getPeriodUrl() && loopNum < 5) {
                    location.href = lastPeriod.getPeriodUrl();
                    href = location.href;
                    loopNum++;
                }
            }
            else {
                var xmlHttp = getPrePeriodAjax(maxIntervalMonth);
                var resonseXML = null;
                if (xmlHttp == null) {
                    alert("已经是最前一期!");
                }
                else {
                    resonseXML = xmlHttp.responseXML;
                    if (browserType == 1) 
                        xList = resonseXML.selectNodes("/navi/calendar");
                    else 
                        if (browserType == 2) 
                            xList = resonseXML.getElementsByTagName("calendar");
                        else 
                            xList = resonseXML.getElementsByTagName("calendar");
                    var aList = $A(xList);
                    var maxDate = "0000-00-00";
                    var nowYear = preDate[1];
                    var nowMonth = preDate[2];
                    for (var i = 0; i < aList.length; i++) {
                        var tempDate = aList[i].getElementsByTagName("date")[0].firstChild.data;
                        if (tempDate > maxDate) {
                            maxDate = tempDate;
                        }
                    }
                    if (maxDate.lastIndexOf("-") != -1) {
                        tempDay = maxDate.substring(maxDate.lastIndexOf("-") + 1, maxDate.length);
                    }
                    var sUrl = location.href;
                    sUrl = sUrl.replace(/\d{4}-\d{2}\/\d{2}/g, nowYear + "-" + nowMonth + "/" + tempDay);
                    var contentRe = /content_\d+\_\d+\.htm/i;
                    var r1 = sUrl.match(contentRe);
                    if (r1) {
                        sUrl = sUrl.replace(contentRe, OBJ_MP_CONFIG.node_htm_jump);
                        location.href = sUrl;
                    }
                    else {
                        var nodeRe = /node_\d+\.htm/i;
                        var r2 = sUrl.match(nodeRe);
                        if (r2) {
                            sUrl = sUrl.replace(nodeRe, OBJ_MP_CONFIG.node_htm_jump);
                            location.href = sUrl;
                        }
                        else {
                            //2009-11-24新添加
                            var indexRe = /index_\d+\-\d+\-\d+\.htm/i;
                            var r3 = sUrl.match(indexRe);
                            if (r3) {
                                sUrl = sUrl.replace(indexRe, OBJ_MP_CONFIG.index_htm_jump);
                                location.href = sUrl;
                            }
                        }
                    }
                    /*if(document.getElementById("page_node_span")!=null)
                     {
                     sUrl = sUrl.replace(/content_\d+/g,"node_"+document.getElementById("page_node_span").innerHTML);
                     }
                     */
                }
            }
            
        }
        else {
            mp_xmlloadedmethod.push("goPrePeriod()");
            OBJ_MP_LOADACTION.loadPeriods();
        }
    }
    else {
        alert("未装载期次列表");
    }
}

function getNextDate(year, month){
    var nextDate = new Array(3);
    if (month == 12) {
        year = parseInt(year);
        nextDate[0] = parseInt(year + 1) + "-01";
        nextDate[1] = parseInt(year + 1);
        nextDate[2] = "01";
    }
    else 
        if (month >= 9 && month <= 11) {
            if (month == 9 || month == 09) {
                if (month.length == 2) 
                    month = month.substring(1, 2);
            }
            month = parseInt(month);
            month = parseInt(month + 1);
            nextDate[0] = year + "-" + month;
            nextDate[1] = parseInt(year);
            nextDate[2] = month;
        }
        else {
            if (month.length == 2) {
                month = month.substring(1, 2);
            }
            month = parseInt(parseInt(month) + 1);
            nextDate[0] = year + "-0" + parseInt(month);
            nextDate[1] = parseInt(year);
            nextDate[2] = "0" + parseInt(month);
        }
    return nextDate;
}

var nextDate = new Array(3);
function getNextPeriodAjax(maxIntervalMonth){
    var reMonth = /(\d{4})-(\d{2})/;
    var reMonthNum = OBJ_MP_LOADACTION.period_xml_month.match(reMonth);
    var xmlHttp = createAjax();
    var tempYear = 0;
    var tempMonth = 0;
    if (reMonthNum) {
        tempYear = reMonthNum[1];
        tempMonth = reMonthNum[2];
        var i = 0;
        while (i < maxIntervalMonth) {
            nextDate = getNextDate(tempYear, tempMonth);
            var next = new MP_LOADACTION();
            var nextPeriodXmlUrl = next.findPeriodXmlUrl(nextDate[0]);
            try {
                xmlHttp.open("get", nextPeriodXmlUrl, false);
                xmlHttp.send("");
            } 
            catch (e) {
                xmlHttp = null;
            }
            
            if (xmlHttp != null && xmlHttp.status != null && xmlHttp.status == 404 && i >= maxIntervalMonth - 1) {
                xmlHttp = null;
                break;
            }
            else 
                if (xmlHttp != null && xmlHttp.status != null && xmlHttp.status != 404) {
                    break;
                }
                else 
                    if (tempMonth == 12) {
                        tempYear = parseInt(tempYear);
                        tempYear = parseInt(tempYear + 1);
                        tempMonth = 01;
                    }
                    else 
                        if (tempMonth < 12) {
                            if (tempMonth < 10) {
                                if (tempMonth.length == 2) 
                                    tempMonth = tempMonth.substring(1, 2);
                            }
                            tempMonth = parseInt(tempMonth);
                            tempMonth = parseInt(tempMonth + 1);
                        }
            i++;
        }
    }
    else {
        xmlHttp = null;
        //alert("时间格式不是yyyy-mm!");
    }
    return xmlHttp;
}

function goNextPeriod(){
    var maxIntervalMonth = 2;//最大间隔期为2个月
    var monthRe = /\d{4}-\d{2}/i;
    if (typeof OBJ_MP_LOADACTION.period_xml_month == "string" && monthRe.test(OBJ_MP_LOADACTION.period_xml_month)) {
        //alert(OBJ_MP_LOADACTION.period_xml_month);
        var findIndex = mp_pageday.indexOf(OBJ_MP_LOADACTION.period_xml_month);
        //alert(mp_pageday);
        //alert(findIndex);
        if (findIndex > -1) {
            var prePeriods = mp_periods.findAll(function(mynode){
                return mynode.getPeriodDate().getDate() > mp_period.getPeriodDate().getDate()
            });
            if (typeof prePeriods == "object" && prePeriods != null && prePeriods.length > 0) {
                    prePeriods.sortBy(function(mynode){
                    return mynode.getPeriodDate();
                });
                
                var lastPeriod = prePeriods[0];
                //var lastPeriod = prePeriods[prePeriods.length -1];
                //alert(lastPeriod.getPeriodUrl());
                var href = location.href;
                var loopNum = 0;
                while (href != lastPeriod.getPeriodUrl() && loopNum < 5) {
                    location.href = lastPeriod.getPeriodUrl();
                    href = location.href;
                    loopNum++;
                }
            }
            else {
                var xmlHttp = getNextPeriodAjax(maxIntervalMonth);
                var resonseXML = null;
                if (xmlHttp == null) {
                    alert("已经是最后一期!");
                }
                else {
                    resonseXML = xmlHttp.responseXML;
                    if (browserType == 1) 
                        xList = resonseXML.selectNodes("/navi/calendar");
                    else 
                        if (browserType == 2) 
                            xList = resonseXML.getElementsByTagName("calendar");
                        else 
                            xList = resonseXML.getElementsByTagName("calendar");
                    var aList = $A(xList);
                    var minDate = "9999-12-31";
                    var nowYear = nextDate[1];
                    var nowMonth = nextDate[2];
                    for (var i = 0; i < aList.length; i++) {
                        var tempDate = aList[i].getElementsByTagName("date")[0].firstChild.data;
                        if (tempDate < minDate) {
                            minDate = tempDate;
                        }
                    }
                    if (minDate.lastIndexOf("-") != -1) {
                        tempDay = minDate.substring(minDate.lastIndexOf("-") + 1, minDate.length);
                    }
                    var sUrl = location.href;
                    sUrl = sUrl.replace(/\d{4}-\d{2}\/\d{2}/g, nowYear + "-" + nowMonth + "/" + tempDay);
                    var contentRe = /content_\d+\_\d+\.htm/i;
                    var r1 = sUrl.match(contentRe);
                    if (r1) {
                        sUrl = sUrl.replace(contentRe, OBJ_MP_CONFIG.node_htm_jump);
                        location.href = sUrl;
                    }
                    else {
                        var nodeRe = /node_\d+\.htm/i;
                        var r2 = sUrl.match(nodeRe);
                        if (r2) {
                            sUrl = sUrl.replace(nodeRe, OBJ_MP_CONFIG.node_htm_jump);
                            location.href = sUrl;
                        }
                        else {
                            //2009-11-24新添加
                            var indexRe = /index_\d+\-\d+\-\d+\.htm/i;
                            var r3 = sUrl.match(indexRe);
                            if (r3) {
                                sUrl = sUrl.replace(indexRe, OBJ_MP_CONFIG.index_htm_jump);
                                location.href = sUrl;
                            }
                        }
                    }
                    /*if(document.getElementById("page_node_span")!=null)
                     {
                     sUrl = sUrl.replace(/content_\d+/g,"node_"+document.getElementById("page_node_span").innerHTML);
                     }
                     location.href=sUrl;*/
                }
            }
            
        }
        else {
            mp_xmlloadedmethod.push("goNextPeriod()");
            OBJ_MP_LOADACTION.loadPeriods();
        }
    }
    else {
        alert("未装载期次列表");
    }
    
}


function initMPPage(){
    var re = /(\d{4}-\d{2})\/(\d{2})/i;
    var sUrl = location.href;
    var r = sUrl.match(re);
    if (r) {
        //$("mp_cld").value = r[1] + "-" + r[2];
        mp_pageday = r[1] + "-" + r[2];
    }
    //initOldCalendar(mp_pageday);
    var re2 = /node_(\d+)\.htm/i;
    var r2 = sUrl.match(re2);
    if (r2) {
        mp_pagenodeid = parseInt(r2[1]);
    }
    //alert("pagenode == "+mp_pagenodeid);
    //alert(OBJ_MP_LOADACTION);
    OBJ_MP_LOADACTION.loadPeriods();
    
    //			//2009-11-25添加
    //			var re3 = /index_\d+\-\d+\-\d+\.htm/i;
    //			var r3 = sUrl.match(re3);
    //			if(r3)
    //			{
    //				mp_pagenodeid = parseInt(r3[1]);
    //			}
    //			OBJ_MP_LOADACTION.loadPeriods();
    
    //给版面图添加事件
    var mapObj = document.getElementsByName('pagepicmap');
    if (mapObj != null && mapObj.length > 0) {
        mapObj[0].onmouseover = function(){
            //drawLine(event.srcElement);
            
        };
        mapObj[0].onmouseout = function(){
           // MouseOutMap();
        };
    }
}

function initOldCalendar(dateStr){

    var re = /(\d{4})-(\d{2})-(\d{2})/im;
    
    if (dateStr.match(re)) {
        tY = RegExp.$1 - 0;
        tM = RegExp.$2 - 1;
        tD = RegExp.$3;
    }
    
    
    CLD.SY.selectedIndex = tY - 1949;
    CLD.SM.selectedIndex = tM;
    drawCld(tY, tM);
}

function preAddCollection(){
    if (typeof mp_period == "object" && mp_period != null) {
        var url = "/collection/addCollection.jsp?issueId=" + mp_period.period_id;
        //alert("addCollection : "+url); 
        var nWidth = 490;
        var nHeight = 340;
        var nTop = Math.ceil((window.screen.Height - nHeight) / 2) - 70;
        var nLeft = Math.ceil((window.screen.width - nWidth) / 2);
        propertyStr = "width=" + nWidth + ",height=" + nHeight + ",left=" + nLeft + ",top=" + nTop +
        ",status=no,toolbar=no,menubar=no,location=no,scrollbars=yes";
        window.open(url, "", propertyStr);
    }
}

function preAddOrder(){
    if (typeof mp_period == "object" && mp_period != null) {
        var url = "/servlet/Subscribe.do?nodeid=" + mp_period.paper_id;
        //alert("addOrder : "+url); 
        var nWidth = 490;
        var nHeight = 340;
        var nTop = Math.ceil((window.screen.Height - nHeight) / 2) - 70;
        var nLeft = Math.ceil((window.screen.width - nWidth) / 2);
        propertyStr = "width=" + nWidth + ",height=" + nHeight + ",left=" + nLeft + ",top=" + nTop +
        ",status=no,toolbar=no,menubar=no,location=no,scrollbars=yes";
        window.open(url, "", propertyStr);
    }
}


function addCollection(issueId){
    var url = "/collection/addCollection.jsp?issueId=" + issueId;
    //alert("addCollection : "+url); 
    var nWidth = 490;
    var nHeight = 340;
    var nTop = Math.ceil((window.screen.Height - nHeight) / 2) - 70;
    var nLeft = Math.ceil((window.screen.width - nWidth) / 2);
    propertyStr = "width=" + nWidth + ",height=" + nHeight + ",left=" + nLeft + ",top=" + nTop +
    ",status=no,toolbar=no,menubar=no,location=no,scrollbars=yes";
    window.open(url, "", propertyStr);
}

function addOrder(nodeId){
    var url = "/servlet/Subscribe.do?nodeid=" + nodeId;
    //alert("addOrder : "+url); 
    var nWidth = 490;
    var nHeight = 340;
    var nTop = Math.ceil((window.screen.Height - nHeight) / 2) - 70;
    var nLeft = Math.ceil((window.screen.width - nWidth) / 2);
    propertyStr = "width=" + nWidth + ",height=" + nHeight + ",left=" + nLeft + ",top=" + nTop +
    ",status=no,toolbar=no,menubar=no,location=no,scrollbars=yes";
    window.open(url, "", propertyStr);
}


function appendZero(n){
    return (("00" + n).substr(("00" + n).length - 2));
}//日期自动补零程序
function zoomIn(){
    newZoom = parseInt(ozoom.style.zoom) + 10 + '%'
    ozoom.style.zoom = newZoom;
}

function zoomOut(){
    newZoom = parseInt(ozoom.style.zoom) - 10 + '%'
    ozoom.style.zoom = newZoom;
}


////////////////////////////////////////////////////////////////////////////////////////////

var resCount = 0;
var picResCount = 0;
var resTitle = '';
var txt = "";
var wmaUrl = "";

function beginDrag(elem, event){
    var deltaX = event.clientX - parseInt(elem.style.left);
    var deltaY = event.clientY - parseInt(elem.style.top);
    document.attachEvent("onmousemove", moveHandler);
    document.attachEvent("onmouseup", upHandler);
    event.cancelBubble = true;
    event.returnValue = false;
    function moveHandler(e){
        if (!e) 
            e = window.event;
        elem.style.left = (e.clientX - deltaX) + "px";
        elem.style.top = (e.clientY - deltaY) + "px";
        e.cancelBubble = true;
    }
    function upHandler(e){
        if (!e) 
            e = window.event;
        document.detachEvent("onmousemove", moveHandler);
        document.detachEvent("onmouseup", upHandler);
        e.cancelBubble = true;
    }
}

function showDiv(i){
    for (resdivCount = 1; resdivCount <= resCount; resdivCount++) {
        if (resdivCount == i) {
            document.getElementById("div" + resdivCount).style.display = "block";
        }
        else {
            document.getElementById("div" + resdivCount).style.display = "none";
        }
    }
}

function showPic(){
    //var dateX=event.clientX + document.body.scrollLeft;
    //var dateY=event.clientY + document.body.scrollTop;
    
    document.getElementById("picres").style.left = 30 + "px";
    document.getElementById("picres").style.top = 20 + "px";
    
    if (picResCount > 0) {
        document.getElementById("picres").style.display = "block";
    }
    
    document.getElementById("resall").style.display = "none";
}

function closePic(){
    document.getElementById("picres").style.display = "none";
}

function showRes(){
    //var dateX=event.clientX + document.body.scrollLeft;
    //var dateY=event.clientY + document.body.scrollTop;
    
    document.getElementById("resall").style.left = 10 + "px";
    document.getElementById("resall").style.top = 20 + "px";
    
    if (resCount > 0) {
        document.getElementById("resall").style.display = "block";
    }
}

function clickRes(){
    if (resCount == 0) {
        alert("本篇稿件没有多媒体素材！");
    }
}

function closeRes(){
    document.getElementById("resall").style.display = "none";
    
}

//浮动窗口的变色条
function blur_row(row_id){
    document.all("row" + row_id).className = "commoncolor";
}

function blur_row2(row_id){
    document.all("row" + row_id).className = "commoncolor2";
}

function focus_row_black(row_id){
    document.all("row_black" + row_id).className = "commonlight2";
}

function blur_row_black(row_id){
    document.all("row_black" + row_id).className = "commoncolor3";
}
