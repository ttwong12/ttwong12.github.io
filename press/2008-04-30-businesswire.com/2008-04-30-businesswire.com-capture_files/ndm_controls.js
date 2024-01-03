function AddOptionsLinks(strPrint, strClose) {
	if (strPrint == undefined) {
		strPrint = "Print";
	}
	if (strPrintTooltip == undefined) {
		strPrintTooltip = "Print this Release";
	}
	
	strPrintTooltip
	if (strClose == undefined) {
		strClose = "Close Window";
	}
	var objOptions = document.getElementById("options");
	if (objOptions) {
		// Build Print link
		var objPrint = document.createElement("li");
		var objPrintIcon = document.createElement("img");
		objPrintIcon.src = "/images/icons/icon_print.gif";
		objPrintIcon.alt = "";
		var objPrintLink1 = document.createElement("a");
		var objPrintLink2 = objPrintLink1.cloneNode(false);
		objPrintLink1.href = "#";
		objPrintLink1.title = strPrintTooltip;
		objPrintLink1.onclick = function(){if (print) {print();return false;}};
		objPrintLink1.appendChild(objPrintIcon);
		objPrintLink2.href = "#";
		objPrintLink2.title = strPrintTooltip;
		objPrintLink2.onclick = function(){if (print) {print();return false;}};
		objPrintLink2.appendChild(document.createTextNode(strPrint));
		objPrint.appendChild(objPrintLink1);
		objPrint.appendChild(objPrintLink2);
		// Add Print link to #options
		if (document.getElementById("optionsEmail")) {
			objOptions.insertBefore(objPrint,document.getElementById("optionsEmail"));
		} else {
			objOptions.appendChild(objPrint);
		}
		// Add Close link if this is a popup window
		if (window.opener) {
			// Build Close link
			var objClose = document.createElement("li");
			var objCloseIcon = document.createElement("img");
			objCloseIcon.src = "/images/icons/icon_close.gif";
			objCloseIcon.alt = "";
			var objCloseLink1 = document.createElement("a");
			var objCloseLink2 = objCloseLink1.cloneNode(false);
			objCloseLink1.href = "javascript:window.close()";
			objCloseLink1.title = strClose;
			objCloseLink1.appendChild(objCloseIcon);
			objCloseLink2.href = "javascript:window.close()";
			objCloseLink2.title = strClose;
			objCloseLink2.appendChild(document.createTextNode(strClose));
			objClose.appendChild(objCloseLink1);
			objClose.appendChild(objCloseLink2);
			// Add Close link to #options
			objOptions.appendChild(objClose);
		}
	}
}