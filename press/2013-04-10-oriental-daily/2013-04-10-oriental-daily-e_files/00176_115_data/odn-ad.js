function getParams (variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	} 
	return null;
}
(function(){
	var pos = getParams('p');
	var sect = getParams('s');
	if (pos != null & sect != null) {
		document.write('<script type="text/javascript" src="/js/adv/'+pos+'_'+sect+'.js"></script>');
	}
})();

if ( parent ) {
if (typeof parent.Urchin != 'undefined') {
	parent.Urchin.super_banner_view(window.location.pathname);
}
}

setTimeout(function() { window.location = window.location.href; }, 30000);
