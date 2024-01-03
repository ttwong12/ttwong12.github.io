function AddQuoteLinks(strQuote, strFilings, strFin, strTicker) {
	// Private function for building each link
	function BuildCicLink(strText, strImg, strFuncUrl) {
		var objItem = document.createElement("li");
		var objItemIcon = document.createElement("img");
		objItemIcon.src = strImg;
		objItemIcon.alt = strText;
		var objItemLink1 = document.createElement("a");
		var objItemLink2 = objItemLink1.cloneNode(false);
		objItemLink1.href = "#"
		objItemLink1.onclick = function() {popTickerChart(strFuncUrl);return false;};
		objItemLink1.appendChild(objItemIcon);
		objItemLink2.href = "#"
		objItemLink2.onclick = function() {popTickerChart(strFuncUrl);return false;};
		objItemLink2.appendChild(document.createTextNode(strText));
		objItem.appendChild(objItemLink1);
		objItem.appendChild(objItemLink2);
		return objItem;
	}
	// URLs for onclicks
	var strUrlQuote = "http://app.quotemedia.com/quotetools/clientForward?symbol=" + strTicker + "&targetURL=http%3A%2F%2Fwww.businesswire.com%2Fportal%2Fsite%2Fhome%2Findex.jsp%3Fepi-content%3DMY_COMPANIES_CHART";
	var strUrlFilings = "http://app.quotemedia.com/quotetools/clientForward?action=showFilingResults&symbol=" + strTicker + "&targetURL=http%3A%2F%2Fwww.businesswire.com%2Fportal%2Fsite%2Fhome%2Findex.jsp%3Fepi-content%3DFINANCIAL_POPUP%26sec%3D1";
	var strUrlFin = "http://app.quotemedia.com/quotetools/clientForward?action=showFinancials&symbol=" + strTicker + "&targetURL=http%3A%2F%2Fwww.businesswire.com%2Fportal%2Fsite%2Fhome%2Findex.jsp%3Fepi-content%3DFINANCIAL_POPUP";
	// Default definitions for text strings
	if (strQuote == undefined) {
		strQuote = "Quote/Chart";
	}
	if (strFilings == undefined) {
		strFilings = "SEC Filings";
	}
	if (strFin == undefined) {
		strFin = "Financials";
	}
	// Define the HTML container (must be a UL)
	var objCic = document.getElementById("cic");
	if (objCic) {
		// Build Quote link
		objQuote = BuildCicLink(strQuote, "/images/icons/icon_stocks.gif", strUrlQuote);
		// Add Quote link to #cic
		if (document.getElementById("cicAnnual")) {
			objCic.insertBefore(objQuote,document.getElementById("cicAnnual"));
		} else if (document.getElementById("cicExpert")) {
			objCic.insertBefore(objQuote,document.getElementById("cicExpert"));
		} else if (document.getElementById("cicAdd")) {
			objCic.insertBefore(objQuote,document.getElementById("cicAdd"));
		} else {
			objCic.appendChild(objQuote);
		}
		// Build Filings link
		objFilings = BuildCicLink(strFilings, "/images/icons/icon_filings.gif", strUrlFilings);
		// Add Filings link to #cic
		if (document.getElementById("cicExpert")) {
			objCic.insertBefore(objFilings,document.getElementById("cicExpert"));
		} else if (document.getElementById("cicAdd")) {
			objCic.insertBefore(objFilings,document.getElementById("cicAdd"));
		} else {
			objCic.appendChild(objFilings);
		}
		// Build Financials link
		objFin = BuildCicLink(strFin, "/images/icons/icon_financials.gif", strUrlFin);
		// Add Financials link to #cic
		if (document.getElementById("cicAdd")) {
			objCic.insertBefore(objFin,document.getElementById("cicAdd"));
		} else {
			objCic.appendChild(objFin);
		}
	}
	// Add onclick if Ticker is in At a Glance (it should be in a span with id="ataglanceTicker")
	if (document.getElementById("ataglanceTicker") && document.getElementById("ataglanceTicker").tagName == "SPAN") {
		// Create a link with the same ID as the span, to pop up the quote chart
		var objTicker = document.getElementById("ataglanceTicker");
		var objTickerLink = document.createElement("a");
		objTickerLink.id = "ataglanceTicker";
		objTickerLink.href = "#"
		objTickerLink.onclick = function() {popTickerChart(strUrlQuote);return false;};
		//Put the text of the current span in the new link
		objTickerLink.appendChild(document.createTextNode(objTicker.innerHTML));
		//Replace the span with the link
		objTicker.parentNode.replaceChild(objTickerLink, objTicker);
	}
}