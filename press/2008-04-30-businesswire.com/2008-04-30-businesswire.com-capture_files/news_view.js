/* Note: Do not use these functions in the href attribute on an anchor.
    Only use them in the onClick attribute and make sure to put the popup URL in the href also.
    This is to aid the "Email This Release" functionality.
    Javascript will not work in an email therefore if you put the correct URL in the href
    the email reader will automatically popup a new window to handle the link and the onclick will get ignored.
*/
function openNewsViewPopup(file) {
    var w = 800, h = 600; // default sizes
    if (window.screen) {
        var screenWidth = window.screen.availWidth;
        var screenHeighth = window.screen.availHeight;
        //alert('screenWidth=' + screenWidth + ' screenHeighth=' + screenHeighth);

        // if window is larger than 800 x 600
        // use w=800 and h=600 by default as the popup
        // otherwise use 70% of width and 80% of heighth of the screen
        if (screenWidth <= 800) {
            w = parseInt(screenWidth * 0.70);
            h = parseInt(screenHeighth * 0.80);
            //alert('parsing to 70% width and 80% height');
        }
    }

    //alert('width=' + w + ' height=' + h);
    window.open(file, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width='+w+',height='+h);
}

function openEmailReleasePopup() {
    window.open('<%=view.getEmailReleaseURL(newsDisplayBO.getReleaseId(),newsDisplayBO.getReleaseLanguage())%>', '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=400,height=300');
    return false;
}

// if there is a target open url in that target
// else open url in the current window
function loadWindow(url, target) {
    if ((target != '') && (target)) {
        // loads target window
        target.window.location.href = url;
        target.window.focus();
    } else {
        // loads this window
        window.location.href = url;
        window.focus();
    }
    return false;
}

// open new window for logo link
function popLogoLink(url) {
    var attributes = 'toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=800,height=650';
    return popNewWindow(url, '_blank', attributes);
}

// opens a window to target tickerchart at 800x675
function popTickerChart(url) {
    var attributes = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=675';
    return popNewWindow(url, '_blank', attributes);
}

// opens a window to target tickerchart at 800x675
function popAcessReport(url) {
    //var attributes = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=675';
    return openNewsViewPopup(url);
}

// opens a window to posting report at 800x675
function popPostingReport(url) {
    var attributes = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=675';
    return openNewsViewPopup(url, '_blank', attributes);
}

// opens a window to target bwmultimedia at 600x500
// MFA add releaseid as name of target
function popMultiMediaGalleryWindow(url) {
    var attributes = 'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600';
    return popNewWindow(url, '_blank', attributes);
}

// opens a window to target annual report 640x600
function popAnnualReport(url) {
	var attributes = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=640,height=600';
	return popNewWindow(url, '_blank', attributes);
}

// opens the target with url and attributes
// then brings focus to it
function popNewWindow(url, target, attributes) {
    var newWin = window.open(url, target, attributes);
    newWin.focus();
    return false;
}

// adds a function to the chain of functions that need to be executed during window onload
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

// opens a translation link in the same window
function refreshWithTranslation(url) {
    var w = 800, h = 600; // default sizes
    if (window.screen) {
        var screenWidth = window.screen.availWidth;
        var screenHeighth = window.screen.availHeight;
        //alert('screenWidth=' + screenWidth + ' screenHeighth=' + screenHeighth);

        // if window is larger than 800 x 600
        // use w=800 and h=600 by default as the popup
        // otherwise use 70% of width and 80% of heighth of the screen
        if (screenWidth <= 800) {
            w = parseInt(screenWidth * 0.70);
            h = parseInt(screenHeighth * 0.80);
            //alert('parsing to 70% width and 80% height');
        }
    }

    //alert('width=' + w + ' height=' + h);
    window.open(url, '_self', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width='+w+',height='+h);
}
