var SEEMORE_WORDS=new Array();
var SEEMORE_RESTRICTED_ELEMENTS=new Array('A','SCRIPT','OPTION','IFRAME','OBJECT','TEXTAREA','H1','H2','H3','H4','H5','H6');
var SEEMORE_RESTRICTED_CLASSES=new Array();
var SEEMORE_RESTRICTED_IDS=new Array();
var SEEMORE_ALL_NODES=new Array();
var SEEMORE_SEL_FIRST=false;
var SEEMORE_LINK_UNDERLINE=false;
var SEEMORE_LINK_NEWWINDOW=false;

//var regexpWordBorder    = '[^0-9a-zA-Zà-ÿÀ-ß_]';
//var regexpPattern       = regexpWordBorder + '(' + words.join( '|' ) + ')' + regexpWordBorder;

var SEEMORE_found = new Array();

var SEEMORE_charset;

if (document.characterSet) SEEMORE_charset = document.characterSet;
else if (document.charset) SEEMORE_charset = document.charset;
else if (document.defaultCharset) SEEMORE_charset = document.defaultCharset;
else SEEMORE_charset = "";

var Rnd = Math.round(Math.random() * 1000000000);
document.write( '<sc' + 'ript language="JavaScript" type="text/javascript" src="http://www.seemore.ru/js/test_js.php?refer='+escape(document.location)+'&encoding='+SEEMORE_charset+'&rndnum='+Rnd+'" ></s' + 'cript>' );

var testednodes=0;

function SEEMORE_findNodes(node, test_mode) {
	testednodes++;
	if (testednodes>200) return;
	
	for (var i=0;i<SEEMORE_RESTRICTED_ELEMENTS.length;i++) {
		if (node.tagName==SEEMORE_RESTRICTED_ELEMENTS[i]) return;
	}
	for (var i=0;i<SEEMORE_RESTRICTED_CLASSES.length;i++) {
		if (node.className==SEEMORE_RESTRICTED_CLASSES[i]) return;
	}
	for (var i=0;i<SEEMORE_RESTRICTED_IDS.length;i++) {
		if (node.id==SEEMORE_RESTRICTED_IDS[i]) return;
	}
	
	if (test_mode) {
		if (node.style) node.style.border="1px dotted #555";
	}
	
	if (node.nodeType==3) {
		SEEMORE_found[SEEMORE_found.length]=node;
	}
	
	if (node.hasChildNodes) for (var i=0;i<node.childNodes.length;i++) {
		SEEMORE_findNodes(node.childNodes[i]);
	}
}


function SEEMORE_start(test_mode) {

	if (SEEMORE_WORDS.length==0) return;
	
	var SEEMORE_used=new Array();
	
	for (var i=0;i<SEEMORE_ALL_NODES.length;i++) {
		SEEMORE_findNodes(SEEMORE_ALL_NODES[i], test_mode);
	}
	
	SEEMORE_WORDS.sort(new Function("k1, k2", "return (k2[1].length - k1[1].length);"));
	
//	var out=document.location + ' === ' + SEEMORE_found.length + "\n";
	for (var i=0;i<SEEMORE_found.length;i++) {
		node=SEEMORE_found[i];
		var lastIndex=0;
		var rirghtIndex=0;
		var cur_words=new Array();
        var text=node.nodeValue;
        var textnode;
        var linknode;
		
		for (var j=0;j<SEEMORE_WORDS.length;j++) if (!SEEMORE_SEL_FIRST || !SEEMORE_used[j]) {
			
			var regexp = new RegExp( SEEMORE_WORDS[j][1] + regexpWordBorder, 'g' );
			while ((found = regexp.exec(text)) != null) if (!SEEMORE_SEL_FIRST || !SEEMORE_used[j]) {
				var intersect=false;
				for (k=0;k<cur_words.length;k++) {
					if (found.index >= cur_words[k][0] && found.index <= cur_words[k][0]+SEEMORE_WORDS[cur_words[k][1]][1].length) intersect=true;
					if (found.index + SEEMORE_WORDS[j][1].length >= cur_words[k][0] && found.index + SEEMORE_WORDS[j][1].length <= cur_words[k][0]+SEEMORE_WORDS[cur_words[k][1]][1].length) intersect=true;
				}
				if (!intersect) {
					cur_words[cur_words.length]=new Array(found.index, j);
					SEEMORE_used[j]=true;
				}
			}
		}
		
	    cur_words.sort(new Function("k1, k2", "return (k1[0] - k2[0]);"));
		
        var parentNode = node.parentNode;
        
        if (parentNode != null) {
			for (var i=0;i<cur_words.length;i++) {
//				out+=cur_words[i][0]+' -> '+SEEMORE_WORDS[cur_words[i][1]][1].length+'; ';
				
				textnode=document.createTextNode(text.substring(lastIndex, cur_words[i][0]));
		        parentNode.insertBefore(textnode, node);
		        
				linknode=document.createElement("A");
				linknode.href='http://www.seemore.ru/?keywid='+SEEMORE_WORDS[cur_words[i][1]][0];
				if (SEEMORE_LINK_NEWWINDOW) linknode.target='_blank';
				if (SEEMORE_LINK_UNDERLINE) linknode.style.textDecoration='underline';

				textnode=document.createTextNode(text.substring(cur_words[i][0], cur_words[i][0]+SEEMORE_WORDS[cur_words[i][1]][1].length));
				linknode.appendChild(textnode);
		        parentNode.insertBefore(linknode, node);
				
		        lastIndex=cur_words[i][0]+SEEMORE_WORDS[cur_words[i][1]][1].length;
			}
			
			textnode=document.createTextNode(text.substring(lastIndex, text.length));
	        parentNode.insertBefore(textnode, node);
	        
	        parentNode.removeChild(node);
        }
		//$('testingsuite').innerHTML=$('testingsuite').innerHTML+out;

	}

//out=out.substring(0,255);
//if (test_mode) document.write( '<sc' + 'ript language="JavaScript" type="text/javascript" src="http://www.seemore.ru/js/test2.php?out='+escape(out)+'" ></s' + 'cript>' );
	
}