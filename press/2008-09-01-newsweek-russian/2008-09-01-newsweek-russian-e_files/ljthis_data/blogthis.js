function copy_clipboard(textField) {
	textField.createTextRange().execCommand("Copy");
}

function show_lj_preview(entryForm) {
	var f=entryForm;
	var action=f.action;
	f.action='http://www.livejournal.com/preview/entry.bml';
//	f.action='http://www.ljdev.livejournal.ru/preview/entry.bml';

	// check if event element already exists
	var theEventField = document.getElementById('idEvent');
	if (!theEventField) {
		if (document.all && !window.opera) {
			theEventField = document.createElement("<input type='hidden' id='idEvent' name='event'>");
		} else {
			theEventField = document.createElement('input');
			theEventField.id   = 'idEvent';
			theEventField.type = 'hidden';
			theEventField.name = 'event';
		}
		f.appendChild(theEventField);
	}
	f.event.value = f.art_announce.value + "<br/>" + f.comment.value + "\0";

	f.target='preview';
	preview_window = window.open('','preview','width=760,height=600,resizable=yes,status=yes,toolbar=no,location=no,menubar=no,scrollbars=yes');

	if (!(document.all && !window.opera)) {
		var x = (screen.availWidth - 760) / 2;
		var y = (screen.availHeight - 600) / 2;
		preview_window.moveTo(Math.floor(x), Math.floor(y));
	}
	f.submit();
	f.action=action;
	f.target='_self';
	return false;
}

function show_preview(entryForm) {
	var f=entryForm;
	var action=f.action;
	f.action='/blogthis-preview/';
	f.target='preview';
	preview_window = window.open('','preview','width=500,height=400,resizable=yes,status=yes,toolbar=no,location=no,menubar=no,scrollbars=yes');

	if (!(document.all && !window.opera)) {
		var x = (screen.availWidth - 500) / 2;
		var y = (screen.availHeight - 400) / 2;
		preview_window.moveTo(Math.floor(x), Math.floor(y));
	}
	f.submit();
	f.action=action;
	f.target='_self';
	return false;
}

/*
// This function is switched off because of Internet Explorer -- it doesn't permit creating a new window and filling it in with content via "document.write" methods if "document.domain" property is set.

function show_preview(message) {
	preview_window = window.open('','preview','width=500,height=300,resizable=yes,status=yes,toolbar=no,location=no,menubar=no,scrollbars=yes');
	var x = (screen.availWidth - 500) / 2;
	var y = (screen.availHeight - 300) / 2;
	preview_window.moveTo(Math.floor(x), Math.floor(y));
	preview_window.document.writeln('<!DOCTYPE HTML PUBLIC "-\/\/W3C\/\/DTD HTML 4.01\/\/EN" "http:\/\/www.w3.org\/TR\/html4\/strict.dtd">');
	preview_window.document.writeln('<html>\n<head>');
	preview_window.document.writeln('<meta http-equiv="content-type" content="text\/html; charset=utf-8">');
	preview_window.document.writeln('<link type="text\/css" rel="stylesheet" href="\/css\/general.css">');
	preview_window.document.writeln('<title>Предпросмотр записи<\/title>');
	preview_window.document.writeln('<\/head>\n<body>\n<center><table style="margin: 20px;"><tr><td style="text-align: left;">');
	preview_window.document.writeln(message);
	preview_window.document.writeln('<\/td><\/tr><\/table><br\/><a href="javascript:void()" onClick="window.close()">закрыть окно<\/a>\n<\/center>\n<\/body>');
	preview_window.document.close();
	return false;
}
*/