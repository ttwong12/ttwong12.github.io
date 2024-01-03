function reply_subject(subject) {
    if (subject.match('^Re: ')) {
        return subject;
    } else {
        return 'Re: ' + subject;
    }
}

function timeToLocal() {
    var all = document.all ? document.all : document.getElementsByTagName('*');
    var elements = new Array();
    for (var e = 0; e < all.length; e++) {
        if ((all[e].className == "comment-time") ||
            (all[e].className == "comment-collapsed-time"))
        {
            var tdiv = all[e];
            var post_date = new Date();

            var time_attr = tdiv.getAttribute('time');
            var date_attr = tdiv.getAttribute('date');
            if (!time_attr || !date_attr) {
                continue;
            }

            var utime = time_attr.split(':');
            post_date.setUTCHours( utime[0], utime[1] );
            var udate = date_attr.split('.').reverse();
            post_date.setUTCFullYear(udate[0], udate[1] - 1, udate[2]);

            var pyear    = ( ( post_date.getYear()    > 1900 ) ? 0  : 1900 ) + post_date.getYear();
            var pdate    = ( ( post_date.getDate()    > 9    ) ? '' : '0'  ) + post_date.getDate();
	    var pmonth   = ( ( post_date.getMonth()   > 8    ) ? '' : '0'  ) + ( post_date.getMonth() + 1 );
            var phours   = ( ( post_date.getHours()   > 9    ) ? '' : '0'  ) + post_date.getHours();
            var pminutes = ( ( post_date.getMinutes() > 9    ) ? '' : '0'  ) + post_date.getMinutes();

            tdiv.innerHTML = pdate + '.' + pmonth + '.' + pyear + ' <strong>' + phours + ':' + pminutes + '</strong>';
    	}
    }
}

function autofitIframe(id) {
    var height = 0;
    if (window.opera) { // opera
        height = this.document.documentElement.clientHeight;
    } else if (xIE4Up) { // IE
        height = this.document.body.scrollHeight;
    } else { // FF && others
        height = xClientHeight();
    }

    if (height) {
        if (parent.document.getElementById(id)) {
            parent.document.getElementById(id).style.height = height + "px";
        }
    } else {
        // Height is not calculated yet. Let's try it again.
        window.setTimeout("autofitIframe('" + id + "')", 500);
    }

    return false;
}

// Thanks to Dean Edwards/Matthias Miller/John Resig
function init() {
    // kill the timer
    if (_timer) clearInterval(_timer);

    if (parent.document.getElementById('hsLoading')) {
        parent.document.getElementById('hsLoading').style.display = "none";
    }

    if (parent.iframe_hidden) {
        parent.iframe_hidden = false;
    }

    timeToLocal();
    autofitIframe('hsIFrame');
}
