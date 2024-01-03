function LabelAjax()
{
var XmlHttp;
	//windows
	try {
		XmlHttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
	} catch (e) {
		try {
			XmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				XmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				XmlHttp = false;
			}
		}
	}
	//other
	if (!XmlHttp)
	{
		try {
			XmlHttp = new XMLHttpRequest();
		} catch (e) {
			XmlHttp = false;
		}
	}
	return XmlHttp;
}
