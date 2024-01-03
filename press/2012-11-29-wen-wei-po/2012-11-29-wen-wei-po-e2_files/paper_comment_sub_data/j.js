function get_Code(idstr){
	var codestr="<img style=\"cursor:pointer;\" src=\"../include/vcode.php?action=verifycode&n="+Math.random()+"\" onClick=\"get_Code('"+idstr+"')\" align=\"absmiddle\">";
	var idobj=document.getElementById(idstr);idobj.innerHTML=codestr;
}

function re_italk_tp(){
 	var post_area_wapperobj=document.getElementById("post_area_wapper");
	post_area_wapperobj.style.display = "";
 	var reply_top_obj=document.getElementById("reply_top");
 	if(reply_top_obj.className == "italk-tp"){
		reply_top_obj.className="italk-tp-show";
 		post_area_wapperobj.style.display = "";
	}else{
 		reply_top_obj.className="italk-tp";
		post_area_wapperobj.style.display = "none";
	} 
}




	function retopclose(){
 		var post_area_wapperobj=document.getElementById("post_area_wapper");
 		var reply_top_obj=document.getElementById("reply_top");
 			reply_top_obj.className="italk-tp";
			post_area_wapperobj.style.display = "none";
 	}
	
function test(id) {
	var suita   = document.getElementById('bar_reply_'+id+'');
	var suitc   = document.getElementById('orgin_reply_'+id+'');
	var suitb   = document.getElementById('re_id_'+id+'');
 	suita.className='bar';
 	suitb.className='';
	suitb.innerHTML ='';
	suitc.className='noclick';
}

function display_all(id){
	var rpdata="action=getcomment&id="+id;	
 	var rpurl="include/get_comment.php";	
	var rpajax=new LabelAjax;	
	var dobjfont=document.getElementById("orgin_content_left_"+id);	
	rpajax.open("post",rpurl,true);	
	rpajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
	rpajax.onreadystatechange=function(){
		if(rpajax.readyState==4){
			dobjfont.innerHTML=rpajax.responseText;			
		}
	}
	rpajax.send(rpdata);
}

function display_all_child(id,tid){
	var rpdata="action=getcomment&id="+tid;	
 	var rpurl="include/get_comment.php";	
	var rpajax=new LabelAjax;	
	var dobjfont=document.getElementById("orgin_citation_content_left_"+id);	
	rpajax.open("post",rpurl,true);	
	rpajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
	rpajax.onreadystatechange=function(){
		if(rpajax.readyState==4){
			dobjfont.innerHTML=rpajax.responseText;			
		}
	}
	rpajax.send(rpdata);
}
