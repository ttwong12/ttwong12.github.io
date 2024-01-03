/*
================================================================================
Filename        : end of change background
Version         : 1.0.0
Type            : Javascript collection
Description     : For the handling of client side js related to date
================================================================================
*/

function changeBgcolor(name, myc){
	document.getElementById(name).style.background = myc
}

function changeBgimage(name, myi){
  document.getElementById(name).style.backgroundImage = myi
}
/*
end of change background

================================================================================
Filename        : date
Version         : 1.0.0
Type            : Javascript collection
Description     : For the handling of client side js related to date
================================================================================
2003-03-29 / Ken Lee:
- add program header and comments
================================================================================
*/

function setRange(form_obj, option_obj, start_year){
        var s = form_obj;
        var d = option_obj;
				var range_opt;

        mydate = new Date();
        year = mydate.getFullYear();
        month = mydate.getMonth()+1;
        day = mydate.getDate();

        s.ey.selectedIndex = year-start_year;
        s.em.selectedIndex = month-1;
        s.ed.selectedIndex = day-1;

        if(d.options[d.selectedIndex].value == "today"){
							range_opt = 0;
        }else if(d.options[d.selectedIndex].value == "1day") {
                // one day
							mydate.setDate(mydate.getDate()-1);
							range_opt = 1;
        }else if(d.options[d.selectedIndex].value == "3day"){
                // Last 3 days
							mydate.setDate(mydate.getDate()-3);
							range_opt = 1;
        }else if (d.options[d.selectedIndex].value == "1week"){
               // Last 7 days
                mydate.setDate(mydate.getDate()-7);
								range_opt = 2;
        }else if (d.options[d.selectedIndex].value == "2week"){
                // Last 7 days
								range_opt = 3;
                mydate.setDate(mydate.getDate()-14);
        }else if (d.options[d.selectedIndex].value == "1month"){
                // Last 1 month
                mydate.setMonth(mydate.getMonth()-1);
								range_opt = 4;
        }else if (d.options[d.selectedIndex].value == "6month"){
                // Last 6 month
                mydate.setMonth(mydate.getMonth()-6);
								range_opt = 5;
        }else if (d.options[d.selectedIndex].value == "1year"){
                // Last one year
                mydate.setYear(mydate.getYear()-1);
								range_opt = 6;
        }

        year = mydate.getFullYear();
        month = mydate.getMonth()+1;
        day = mydate.getDate();

        s.sy.selectedIndex = year-start_year;
        s.sm.selectedIndex = month-1;
        s.sd.selectedIndex = day-1;

				changedate(form_obj, range_opt);
}

function checkInputDate(sy, sm, sd, ey, em, ed){

        // Get the current time
        var now = new Date();

        var cy = new String(now.getFullYear());
        var cm = new String(now.getMonth()+1);
        var cd = new String(now.getDate());


        // Modify the input date
        if(sm < 10 && sm.length == 1){ sm = '0' + sm; }
        if(sd < 10 && sm.length == 1){ sd = '0' + sd; }

        if(em < 10 && em.length == 1){ em = '0' + em; }
        if(ed < 10 && ed.length == 1){ ed = '0' + ed; }

        if(cm < 10 && cm.length == 1){ cm = '0' + cm; }
        if(cd < 10 && cd.length == 1){ cd = '0' + cd; }

        var sdate = sy + sm + sd;
        var edate = ey + em + ed;
        var cdate = cy + cm + cd;

        if(edate - sdate < 0){
                return -1;
        }

        if(cdate - sdate < 0){
                return -2;
        }

        return 1;
}

function changedate(searchform, range_opt){
        var sy = searchform.sy.value;
        var sm = searchform.sm.value;
        var sd = searchform.sd.value;
        var ey = searchform.ey.value;
        var em = searchform.em.value;
        var ed = searchform.ed.value;

        if(status == -1 || status == -2){
                alert("¿é¤J¤£¥¿½T");
                return false;
        }
        if(sm.length == 1){
                sm = "0"+sm;
        }
        if(sd.length == 1){
                sd = "0"+sd;
        }
        if(em.length == 1){
                em = "0"+em;
        }
        if(ed.length == 1){
                ed = "0"+ed;
        }

        searchform.startdate.value = sy+sm+sd;
        searchform.enddate.value = ey+em+ed;

	if(range_opt >= 0 && range_opt <= 6){
   		searchform.drange.selectedIndex = range_opt;
	}else{
   		searchform.drange.selectedIndex = 7; // 7 is CUSTOM
	}
}
/* end of date code */