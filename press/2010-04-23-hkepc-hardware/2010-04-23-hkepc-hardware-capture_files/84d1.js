Article=new new Class({submitting:false,apply:function(E){var A=this.applicationForm.getElement("input[name=chineseName]");var F=this.applicationForm.getElement("input[name=englishName]");var B=this.applicationForm.getElement("input[name=hkid]");var D=this.applicationForm.getElement("input[name=contact]");var H=this.applicationForm.getElement("input[name=email]");var C=this.applicationForm.getElement("select[name=quantity]");var J=this.applicationForm.getElements("input.birthday");var I=this.applicationForm.getElements("input.address");this.applicationForm.getElements("input").removeClass("alert");this.applicationForm.getElements("table span.alert").destroy();if(A.get("value").match(/[^\u4E00-\u9FA5]|^$/g)){new Element("span",{className:"alert",text:"(中文姓名)"}).inject(A.addClass("alert"),"after");}if(F.get("value").match(/[^a-zA-Z\s]|^$/g)){new Element("span",{className:"alert",text:"(英文姓名)"}).inject(F.addClass("alert"),"after");}if(B.get("value").match(/[a-zA-Z0-9]{8}/g)){new Element("span",{className:"alert",text:"(請輸入身分証頭三位)"}).inject(F.addClass("alert"),"after");}if(J){$each(J,function(K){if(K.get("value").match(/[^0-9]|^$/g)){K.addClass("alert");}});if(J.hasClass("alert").contains(true)){new Element("span",{className:"alert",text:"(非正確出生日期)"}).inject(J[2],"after");}}if(I){$each(I,function(K,M){var L=K.get("value").match(/[^\u4E00-\u9FA5\w\s-.,\/]/g);if((L&&L.length)||(K.get("value")==""&&!M)){K.addClass("alert");}});if(I.hasClass("alert").contains(true)){new Element("span",{className:"alert",text:"(無效地址)"}).inject(I[2],"after");}}if(!H.get("value").match(/[^@'"]+@[^@'"]+\.[^@\'"]+/g)){new Element("span",{className:"alert",text:"(非正確地址)"}).inject(H.addClass("alert"),"after");}if(!D.get("value").match(/[0-9]{8}/g)){new Element("span",{className:"alert",text:"(需為8位號碼)"}).inject(D.addClass("alert"),"after");}if(!C.get("value").match(/[1-9]{1}/g)){new Element("span",{className:"alert",text:"(非有效數量)"}).inject(C.addClass("alert"),"after");}var G=this.applicationForm.getElement("table input.alert");if(G){G.select();}else{this.applicationReference.getElement(".content").set("load",{method:"post",data:this.applicationForm.toQueryString()}).load("/action");}return false;},comment:function(){if(!this.submitting){var A=this.post.getElement("textarea").get("value");this.submitting=true;if(A.length<5){alert("評論不可小於5字");this.submitting=false;return false;}new Request.JSON({onSuccess:(function(B){if(B){if(B.code==200){$("comments").getElement(".header .info").set("text","本篇文章被 "+B.view+" 人閱讀，共有 "+B.comment+" 條評論");new Element("div",{className:"comment",id:"pid"+B.id}).adopt([new Element("div",{className:"content",html:A.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r\n|\r|\n/g,"<br />")}),new Element("div",{className:"footer"}).adopt([new Element("span",{className:"author",text:B.username}),this.isModerator?new Element("a",{className:"remove alert",text:"[屏蔽]",events:{click:this.remove.bindWithEvent(this)}}):null,new Element("span",{className:"date",text:B.date})])]).inject($("comments").getElements(".header")[1],"before");this.post.getElement("textarea").set("value","").focus();}if(B.message){alert(B.message);}}this.submitting=false;}).bind(this)}).send({url:"/action",data:this.commentReference.toQueryString()});}return false;},commentEventListener:function(B){var A=true;if(this.ctrl==true&&B.code==13){A=false;this.comment.delay(10,this);}if(B.code==17){this.ctrl=true;}else{this.ctrl=false;}return A;},logon:function(D){var C=D;var A=C==$("applicationLogon");if(!A){var E=C.getElement("input[type=text]");var B=C.getElement("input[type=password]");if(!E.get("value")||!B.get("value")){(E.get("value")?B:E).select();return false;}}new Request.JSON({onSuccess:(function(G){if(G&&G.code==200){$$(".hidden").removeClass("hidden");this.isStaff=G.isStaff;this.isModerator=G.isModerator;if(this.isStaff||this.isModerator){var F=this.commentsReference.getElements(".comment");$each(F,(function(H){new Element("a",{className:"remove alert",text:"[屏蔽]",events:{click:this.remove.bindWithEvent(this)}}).inject(H.getElement(".author"),"after");if(this.isStaff){new Element("a",{className:"forbidden alert",text:"[禁言]",events:{click:this.remove.bindWithEvent(this,true)}}).inject(H.getElement(".author"),"after");}}).bind(this));}if(this.applicationReference){this.applicationReference.getElement(".content").set("html",G.application);this.applicationForm=$("apply");if(this.applicationForm){this.applicationForm.getElement("input[name=static]").set("disabled",true);this.applicationForm.addEvent("submit",this.apply.bindWithEvent(this));}}if(A&&this.applicationForm){this.applicationForm.getElement("input[type=text]").select();}else{if(!A){C.set("html",G.html?G.html:"");if(G.synclogin){for(i=0;i<G.synclogin.length;i++){document.getElementsByTagName("head")[0].appendChild(document.createElement("script")).src=G.synclogin[i];}}}}}else{alert("並未找到相關用戶密碼組合");C.getElement("input[type=password]").select();}}).bind(this)}).send({url:"/action",data:C.toQueryString()});return false;},remove:function(E,B){var C=E.target||E.srcElement;var D=C.getParent().getParent();var A=D.get("id").replace(/pid/,"").toInt();if(confirm("確定刪除"+(B?"及禁言":"")+"?\n\n「"+D.getElement(".content").get("text")+"」")){new Request.JSON({onSuccess:(function(F){if(F&&F.code==200){D.destroy();$("comments").getElement(".header .info").set("text","本篇文章被 "+F.view+" 人閱讀，共有 "+F.comment+" 條評論");}}).bind(this)}).send({url:"/action",data:{section:"article",action:"remove",pid:A,forbidden:B}});}},start:function(){this.logonReference=$$(".logon");this.applicationReference=$("application");this.applicationForm=$("apply");this.post=$("posts");this.commentReference=$("comment");this.commentsReference=$("comments");new ReMooz($$("#view p > img"),{caption:false,closer:!Browser.Engine.trident4});if(this.post){}this.isStaff=this.commentsReference.getElements(".comment a.forbidden").removeClass("hidden").addEvent("click",this.remove.bindWithEvent(this,true)).length>0;this.isModerator=this.commentsReference.getElements(".comment a.remove").removeClass("hidden").addEvent("click",this.remove.bindWithEvent(this)).length>0;if(this.commentReference){this.commentReference.addEvent("submit",this.comment.bindWithEvent(this));}if(this.logonReference){this.logonReference.addEvent("submit",this.logon.bindWithEvent(this));}if(this.applicationForm){this.applicationForm.addEvent("submit",this.apply.bindWithEvent(this));}$$("input[name=static]").set("disabled",true);}});window.addEvent("domready",Article.start.bind(Article));