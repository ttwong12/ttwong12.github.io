function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);
function changePage(obj) {
    i = obj.redirect.selectedIndex;
    window.open(obj.redirect.options[i].value,'_self');
}
function addfavorite(){
	window.external.AddFavorite(location.href, document.title);
}
function popUp(URL, wwidth, wheight) {
day = new Date();
id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width="+wwidth+",height="+wheight+",left = 412,top = 284');");
}
