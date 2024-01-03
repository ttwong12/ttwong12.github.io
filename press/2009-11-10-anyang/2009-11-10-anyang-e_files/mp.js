


/*----------------------------------------------------------------------------------*/
//期次类 封装期次数据并提供一些方法
var MP_PERIOD = Class.create();

MP_PERIOD.prototype = {

	initialize: function(xmlEle) {
		
		//alert("init period");
		this.period_id = OBJ_MP_UTILS.getAttributeText(xmlEle,"id");
		this.period_name = OBJ_MP_UTILS.getNodeText(xmlEle,"period_name");
		this.paper_id = OBJ_MP_UTILS.getNodeText(xmlEle,"paper_id");
		this.period_date = OBJ_MP_UTILS.getNodeText(xmlEle,"period_date");
		this.rmp_exe_path = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_exe_path");
		this.rmp_pic_path = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_pic_path");
		this.rmp_xml_path = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_xml_path");
		this.rmp_build_time = OBJ_MP_UTILS.getNodeText(xmlEle,"rmp_build_time");
	
	},
	
	downloadRMP: function(){
	},

	getRmpExePath: function() {
		
		if(typeof this.rmp_exe_path == "string" && this.rmp_exe_path.length > 0)
		{
			return "../../../rmp/" + this.rmp_exe_path;
		}
		else
		{
			return "";
		}

	},

	getRmpPicPath: function() {
		if(typeof this.rmp_pic_path == "string" && this.rmp_pic_path.length > 0)
		{
			return "../../../../rmp/" + this.rmp_pic_path;
		}
		else
		{
			return "";
		}
	},

	getDateStr: function(){
		if(typeof this.period_date == "string")
		{
			var r = this.period_date.match(/\d{4}-\d{2}-(\d{2})/i);
			if(r)
			{
				return r[1];
			}
			else
				return '';
		}
		else
			return '';
	},

	getPeriodDate: function(){
		
		if(typeof this.period_date == "string")
		{
			var r = this.period_date.match(/(\d{4})-(\d{2})-(\d{2})/i);
			if(r)
			{
				var ret = new Date();
				ret.setFullYear(parseInt(r[1]),parseInt(r[2]),parseInt(r[3]));
				return ret;
				
			}
			else
				return null;
		}
		else
			return null;

	},

	getPeriodDateArray: function(){
		if(typeof this.period_date == "string")
		{
			var r = this.period_date.match(/(\d{4})-(\d{2})-(\d{2})/i);
			if(r)
			{
				return r;
				
			}
			else
				return null;
		}
		else
			return null;	
	},

	
	getPeriodUrl: function() {
			
		var sUrl = location.href;
		var r = this.getPeriodDateArray();
		if(r)
		{
			sUrl = sUrl.replace(/\d{4}-\d{2}\/\d{2}/g,r[1] + "-" + r[2] + "/" + r[3]);
			var contentRe = /content_\d+\.htm/i;
			var r1 = sUrl.match(contentRe);
			if(r1)
			{
				if(typeof OBJ_MP_CONFIG.content_htm_jump == "string" && OBJ_MP_CONFIG.content_htm_jump.length > 0)
				{
					sUrl = sUrl.replace(contentRe,OBJ_MP_CONFIG.content_htm_jump);
					return sUrl;
				}
				else
				{
					alert("没有为内容页指定跳转目标");
					return "#";
				}
			}

			var nodeRe = /node_\d+\.htm/i;
			var r2 = sUrl.match(nodeRe);
			if(r2)
			{
				if(typeof OBJ_MP_CONFIG.node_htm_jump == "string" && OBJ_MP_CONFIG.node_htm_jump.length > 0)
				{
					sUrl = sUrl.replace(nodeRe,OBJ_MP_CONFIG.node_htm_jump);
					return sUrl;
				}
				else
				{
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

	initialize: function(xmlEle) {
		
		this.pagenodename = OBJ_MP_UTILS.getAttributeText(xmlEle,"name");
		this.pagenodeid = OBJ_MP_UTILS.getAttributeText(xmlEle,"id");
		var pages = [];
		var ePages = xmlEle.selectNodes("period");
		var arrPages = $A(ePages);
		var index = 0;
		arrPages.each(
			function(node){
				
				var tmpPeriodid = parseInt(OBJ_MP_UTILS.getAttributeText(node,"id"));
				//alert("periodid == "+tmpPeriodid);
				if(typeof tmpPeriodid == "number" && tmpPeriodid > 0)
				{
					//alert("a page == "+tmpPeriodid);
					pages[index] =new MP_PAGE(node);
					index++;
				}

			}
		);

		this.pages = pages;

	}
}


var MP_PAGE = Class.create();
MP_PAGE.prototype = {
	
	initialize: function(xmlEle){
		

		this.period_id = OBJ_MP_UTILS.getAttributeText(xmlEle,"id");
		var classnodes = [];
		var eClassnodes = xmlEle.selectNodes("nodeid");
		var arrClassnodes = $A(eClassnodes);
		var index = 0;
		arrClassnodes.each(
			function(node){
				var classnode = parseInt(OBJ_MP_UTILS.getAttributeText(node,"id"));
				if(typeof classnode == "number" && classnode > 0)
				{
					classnodes[index] = classnode;
					index++;
				}

			}
		);
		this.classnodes = classnodes;
		
	}

}



/*-----------------------------------------------------------------------------------*/
//工具类
var MP_UTILS = Class.create();

MP_UTILS.prototype = {

	initialize: function() {
	},

	getNodeText: function(xmlEle,nodeName) {
		
		//alert(nodeName);
		return Try.these(

			function() {return xmlEle.selectSingleNode(nodeName).text;},
			function() {return ''}
		
		)
	},

	getAttributeText: function(xmlEle,attrName) {
		
		//alert(nodeName);
		return Try.these(

			function() {return xmlEle.getAttribute(attrName);},
			function() {return ''}
		
		)
	},

	testDateValid: function(periods,testdate)
	{
		if(typeof periods == "object")
		{
			return periods.detect(
				function(node){
					return testdate == node.getDateStr() || testdate == node.period_date;
				}
			);
		}
		else
		{
			return null;
		}
	}

}

var OBJ_MP_UTILS = new MP_UTILS();

/*-----------------------------------------------------------------------------------*/
//xml装载类
var MP_LOADACTION = Class.create();

MP_LOADACTION.prototype = {

	initialize: function() {
		this.period_xml_month = "";
		this.page_xml_month = "";
	},


/*---有关period.xml的装载逻辑--*/
	//装载XML并初始化期次列表
	loadPeriods: function(xmlUrl,sMonth) {

		var myXmlUrl = xmlUrl;
		
		//首先计算xmlUrl 如果没有传入 就用函数自动查找
		if(!(typeof xmlUrl == "string" && xmlUrl.length > 0))
			myXmlUrl = this.findPeriodXmlUrl(sMonth);

		if(typeof myXmlUrl != "string" || myXmlUrl.length == 0)
		{
			alert("没有xmlUrl！");
			return;
		}
		
		//alert("hi "+myXmlUrl);
		var myAjax = new Ajax.Request(
							myXmlUrl,
							{
							method: 'get',
							parameters: '',
							onSuccess: this._loadPeriodSuccess,
							onFailure: this._loadPeriodFailure
							});

	},	




	//寻找新的一月对应的XML地址
	findPeriodXmlUrl: function(sMonth) {
		
		//alert(sMonth);
		var localUrl = location.href;
		var re = /[\s\S]+?(\d{4}-\d{2})[\/\\]/i;
		var monthRe = /\d{4}-\d{2}/i;
		var r = localUrl.match(re);
		if(r)
		{
			//alert(r);
			var retUrl = r[0] + "period.xml";
			this.period_xml_month = r[1];
			//alert("period xml == "+r[1]);
			if(typeof sMonth == "string" && monthRe.test(sMonth))
			{
				this.period_xml_month = sMonth;
				retUrl = retUrl.replace(monthRe,sMonth);
			}

			//alert(retUrl);
			
			return retUrl;
		}
		else
		{
			alert("location.href no date param");
		}
		
	},

	


	_loadPeriodFailure: function(retRequest) {
	

		OBJ_MP_CALLBACK.onPeriodListLoaded([]);
	},

	_loadPeriodSuccess: function(retRequest) {
		try
		{
			
			//alert("装载完毕");
			var periods = [];
			retTxt = retRequest.responseText;
			retDoc = retRequest.responseXML;
			var xList = retDoc.selectNodes("/periodlist/period");
			var aList = $A(xList);
			var index = 0;
			aList.each(
					function(node){						
						var aPeriod = new MP_PERIOD(node);
						periods[index] = aPeriod;
						index++;						
					}
			);
			OBJ_MP_CALLBACK.onPeriodListLoaded(periods);

		}
		catch (e)
		{
			alert(e.message);
		}
	},


/*---有关page.xml的装载逻辑--*/
	//装载XML并初始化版次列表
	loadPages: function(xmlUrl,sMonth) {

		var myXmlUrl = xmlUrl;
		
		//首先计算xmlUrl 如果没有传入 就用函数自动查找
		if(!(typeof xmlUrl == "string" && xmlUrl.length > 0))
			myXmlUrl = this.findPageXmlUrl(sMonth);

		if(typeof myXmlUrl != "string" || myXmlUrl.length == 0)
		{
			alert("没有xmlUrl！");
			return;
		}
		
		//alert("hi "+myXmlUrl);
		var myAjax = new Ajax.Request(
							myXmlUrl,
							{
							method: 'get',
							parameters: '',
							onSuccess: this._loadPageSuccess,
							onFailure: this._loadPageFailure
							});

	},


	//寻找新的一月对应的XML地址
	findPageXmlUrl: function(sMonth) {
		
		//alert(sMonth);
		var localUrl = location.href;
		var re = /[\s\S]+?(\d{4}-\d{2})[\/\\]/i;
		var monthRe = /\d{4}-\d{2}/i;
		var r = localUrl.match(re);
		if(r)
		{
			//alert(r);
			var retUrl = r[0] + "page.xml";
			this.page_xml_month = r[1];
			if(typeof sMonth == "string" && monthRe.test(sMonth))
			{
				this.page_xml_month = sMonth;
				retUrl = retUrl.replace(monthRe,sMonth);
			}

			//alert(retUrl);
			
			return retUrl;
		}
		else
		{
			alert("location.href no date param");
		}
		
	},

	_loadPageFailure: function(retRequest) {
	

		OBJ_MP_CALLBACK.onPageListLoaded([]);
	},

	_loadPageSuccess: function(retRequest) {
		try
		{
			
			//alert("装载完毕");
			var pages = [];
			retTxt = retRequest.responseText;
			retDoc = retRequest.responseXML;
			var xList = retDoc.selectNodes("/pagelist/page");
			var aList = $A(xList);
			var index = 0;
			aList.each(
					function(node){						
						var aPageNode = new MP_PAGENODE(node);
						pages[index] = aPageNode;
						index++;						
					}
			);
			OBJ_MP_CALLBACK.onPageListLoaded(pages);

		}
		catch (e)
		{
			alert(e.message);
		}
	}

}

var OBJ_MP_LOADACTION = new MP_LOADACTION();




/*-----------------------------------------------------------------------------------*/
//装载数据类
var MP_CALLBACK = Class.create();

MP_CALLBACK.prototype = {
	
	initialize: function() {

	},
	
	

	onPeriodListLoaded: function(){alert('hi period.xml over')},

	onPageListLoaded: function(){alert('hi page.xml over')}
}

var OBJ_MP_CALLBACK = new MP_CALLBACK();


/*-----------------------------------------------------------------------------------*/
//配置类
var MP_CONFIG = Class.create();

MP_CONFIG.prototype = {

	initialize: function() {

		this.content_htm_jump = "";
		this.node_htm_jump = "";

	},

	needGlobalCld: function() {
		
		var sUrl = location.href;
		var contentRe = /content_\d+\.htm/i;
		var r1 = sUrl.match(contentRe);
		if(r1)
		{
			return true
		}
		

		//alert("1");
		var nodeRe = /node_\d+\.htm/i;
		var r2 = sUrl.match(nodeRe);
		if(r2)
		{
			//alert("2");
			if(typeof OBJ_MP_CONFIG.node_htm_jump == "string" && OBJ_MP_CONFIG.node_htm_jump.length > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
			
		}
		//alert("3");

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

		MP_CALLBACK.prototype.onPeriodListLoaded = 
				function(node){

					mp_periods = node;
					mp_periods.sortBy(
							function(mynode)
							{
								return mynode.getPeriodDate();
							}
					);

					if(typeof mp_pageday == "string" && mp_pageday.length > 0)
					{

						var tmpPeriod =	OBJ_MP_UTILS.testDateValid(node,mp_pageday);
						if(tmpPeriod)
							mp_period = tmpPeriod;
					}

					OBJ_MP_LOADACTION.loadPages();
					//alert(OBJ_MP_UTILS.testDateValid(node,"17"));
				}
		

		MP_CALLBACK.prototype.onPageListLoaded = 
				function(node){
					//alert(node.length);
					mp_pagenodes = node;
					if(mp_pagenodeid > 0)
					{
						//alert(mp_pagenodeid);
						//initialize();
						var tmpPagenode = node.detect(
							function(node){
								return node.pagenodeid == mp_pagenodeid;
								//alert(node.pagenodeid);
							}					
						);
						//alert("pagenode == "+tmpPagenode);
						//alert("pagenode2 == "+tmpPagenode.pages);
						if(tmpPagenode)
							mp_pagenode = tmpPagenode;

						if(mp_period && tmpPagenode)
						{
							mp_page = tmpPagenode.pages.detect(
														function(node){
															node.period_id == mp_period.period_id;
														}
									  );
						}
					}
					
					mp_xmlloadedmethod.each(
							function(node){
								//alert(node);
								if(typeof node == "string" && node.length > 0)
									eval(node);

							}
					);
					//alert("hi");
					changeCld();					

				}
		

		
		
		function viewOL_RMP()
		{
			if(typeof mp_period == "object" && mp_period != null)
			{
				var exeUrl = mp_period.getRmpExePath();
				//alert(exeUrl);
				if(exeUrl.length > 0)
				{
					var nowUrl = location.href;
					var re = /(http:\/\/[\s\S]+?)\/html/i;
					var r = nowUrl.match(re);
					if(r)
					{
						var rmpUrl = r[1];
						var re2 = /(rmp\/[\s\S]+?\.exe)/i;
						var r2 = exeUrl.match(re2);
						if(r2)
						{
							rmpUrl += "/" +r2[1];
							//alert(rmpUrl);
							window.open("/FFNPlayer.htm?rmp="+rmpUrl,"","fullscreen=yes");
						}
					}
					//alert("/FFNPlayer.htm?rmp="+location.href+exeUrl);
					//window.open("/FFNPlayer.htm?rmp="+location.href+exeUrl);
					//newwin.location.href = exeUrl;
				}
				else
					alert("该期报刊RMP数据不存在！");
			}
			else
			{
				alert("正在下载期次数据，请稍候……");
			}
		}



		

		function openRMP()
		{
			if(typeof mp_period == "object" && mp_period != null)
			{
				var exeUrl = mp_period.getRmpExePath();
				//alert(exeUrl);
				if(exeUrl.length > 0)
				{
					open(""+exeUrl,"","height=0,width=0","","fullscreen=yes");
					//newwin.location.href = exeUrl;
				}
				else
					alert("该期报刊RMP数据不存在！");
			}
			else
			{
				alert("正在下载期次数据，请稍候……");
			}
		}

		function goPrePeriod()
		{
			var monthRe = /\d{4}-\d{2}/i;
			if(typeof OBJ_MP_LOADACTION.period_xml_month == "string" && monthRe.test(OBJ_MP_LOADACTION.period_xml_month))
			{
				//alert(OBJ_MP_LOADACTION.period_xml_month);
				var findIndex = mp_pageday.indexOf(OBJ_MP_LOADACTION.period_xml_month);
				//alert(mp_pageday);
				//alert(findIndex);
				if(findIndex > -1)
				{
					var prePeriods = mp_periods.findAll(
										function(mynode){
											return mynode.getPeriodDate().getDate() < mp_period.getPeriodDate().getDate()
										}
					);
					if(typeof prePeriods == "object" && prePeriods != null && prePeriods.length > 0)
					{
						
						prePeriods.sortBy(
								function(mynode){
									return mynode.getPeriodDate();
								}
						);

						var lastPeriod = prePeriods[prePeriods.length -1];
						
						location.href = lastPeriod.getPeriodUrl();
					}
					else
					{
						alert("已经是最前一期了");
					}

				}
				else
				{
					mp_xmlloadedmethod.push("goPrePeriod()");
					OBJ_MP_LOADACTION.loadPeriods();					
				}
			}
			else
			{
				alert("未装载期次列表");
			}
		}

		function goNextPeriod()
		{
			var monthRe = /\d{4}-\d{2}/i;
			if(typeof OBJ_MP_LOADACTION.period_xml_month == "string" && monthRe.test(OBJ_MP_LOADACTION.period_xml_month))
			{
				//alert(OBJ_MP_LOADACTION.period_xml_month);
				var findIndex = mp_pageday.indexOf(OBJ_MP_LOADACTION.period_xml_month);
				//alert(mp_pageday);
				//alert(findIndex);
				if(findIndex > -1)
				{
					var prePeriods = mp_periods.findAll(
										function(mynode){
											return mynode.getPeriodDate().getDate() > mp_period.getPeriodDate().getDate()
										}
					);
					if(typeof prePeriods == "object" && prePeriods != null && prePeriods.length > 0)
					{
						
						prePeriods.sortBy(
								function(mynode){
									return mynode.getPeriodDate();
								}
						);

						var lastPeriod = prePeriods[0];
						location.href = lastPeriod.getPeriodUrl();
					}
					else
					{
						alert("已经是最后一期了");
					}

				}
				else
				{
					mp_xmlloadedmethod.push("goNextPeriod()");
					OBJ_MP_LOADACTION.loadPeriods();					
				}
			}
			else
			{
				alert("未装载期次列表");
			}
			
		}
		

		//MP_CALLBACK.onPeriodListLoaded("hi extend");
		function initMPPage(){

			var re = /(\d{4}-\d{2})\/(\d{2})/i;

			var sUrl = location.href;
			var r = sUrl.match(re);
			if(r)
			{				
				//$("mp_cld").value = r[1] + "-" + r[2];
				mp_pageday = r[1] + "-" + r[2];
			}

			var re2 = /node_(\d+)\.htm/i;
			var r2 = sUrl.match(re2);
			if(r2)
			{
				mp_pagenodeid = parseInt(r2[1]);
			}
			//alert("pagenode == "+mp_pagenodeid);

			OBJ_MP_LOADACTION.loadPeriods();

			//alert("mmmmm");
		}

		function appendZero(n){return(("00"+ n).substr(("00"+ n).length-2));}//日期自动补零程序