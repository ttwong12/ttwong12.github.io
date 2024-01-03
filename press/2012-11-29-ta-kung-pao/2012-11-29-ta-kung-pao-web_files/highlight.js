var edid = new Array();
var edifm = new Array();
var ediall = new Array();
var ediyt = new Array();
var edifb = new Array();
var floatX, floatY, boxX, boxY, pageX, pageY;
var cX = document.documentElement.clientWidth;
var cY = document.documentElement.clientHeight;
var zoomStatu = 0;

JQ(document).ready(function(){
	//makeCanvas();  //放在页面body标签的onload事件里面
    //var arlen = JQ("#main-ed-articlenav-list div").length;
    for (i = 0; i < JQ("#main-ed-articlenav-list div").length; i++) {
        edid[i] = replaceSubstring(JQ("#main-ed-articlenav-list div").eq(i).attr("id"), ",", "");
        edifm[i] = JQ("#main-ed-articlenav-list div a").eq(i).html();
        ediall = JQ("#main-ed-articlenav-list tr span").eq(i).html().split("~~~");
        if (ediall[0].Trim() != "") {
            ediyt[i] = "<span style='font-size: 12px; color: #666666; font-weight:100;'>" + ediall[0] + "</span><br />";
        }
        else {
            ediyt[i] = "";
        }
        
        if (ediall[1].Trim() != "") {
            edifb[i] = "<br /><span style='font-size: 12px; color: #666666; font-weight:100;'>" + ediall[1] + "</span>";
        }
        else {
            edifb[i] = "";
        }
    }
    
    JQ('#main-ed-map img').maphilight();
    
    JQ("#ozoom *").each(function(){
        if ((this.style.fontSize == '') || (this.style.fontSize == null)) {
            this.style.fontSize = '14px';
            this.style.lineHeight = '25px';
        }
    });
    JQ('#zoomout').click(function(){
        textZoom(-1);
    });
    JQ('#zoomin').click(function(){
        textZoom(1);
    });
    JQ('#zoomreset').click(function(){
        textZoom(-1 * zoomStatu);
    });
});

(function(JQ){
    var has_VML, create_canvas_for, add_shape_to, clear_canvas, shape_from_area, canvas_style, fader, hex_to_decimal, css3color, is_image_loaded;
    has_VML = document.namespaces;
    has_canvas = document.createElement('canvas');
    has_canvas = has_canvas && has_canvas.getContext;
    if (!(has_canvas || has_VML)) {
        JQ.fn.maphilight = function(){
            return this;
        };
        return;
    }
    
    if (has_canvas) {
        fader = function(element, opacity, interval){
            if (opacity <= 1) {
                element.style.opacity = opacity;
                window.setTimeout(fader, 10, element, opacity + 0.1, 10);
            }
        };
        hex_to_decimal = function(hex){
            return Math.max(0, Math.min(parseInt(hex, 16), 255));
        };
        css3color = function(color, opacity){
            return 'rgba(' + hex_to_decimal(color.substr(0, 2)) + ',' + hex_to_decimal(color.substr(2, 2)) + ',' + hex_to_decimal(color.substr(4, 2)) + ',' + opacity + ')';
        };
        
        create_canvas_for = function(img){
            var c = JQ('<canvas style="width:' + img.width + 'px;height:' + img.height + 'px;"></canvas>').get(0);
            c.getContext("2d").clearRect(0, 0, c.width, c.height);
            return c;
        };
        add_shape_to = function(canvas, shape, coords, options){
            var i, context = canvas.getContext('2d');
            context.beginPath();
            if (shape == 'rect') {
                context.rect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
            }
            else 
                if (shape == 'poly') {
                    context.moveTo(coords[0], coords[1]);
                    for (i = 2; i < coords.length; i += 2) {
                        context.lineTo(coords[i], coords[i + 1]);
                    }
                }
                else 
                    if (shape == 'circ') {
                        context.arc(coords[0], coords[1], coords[2], 0, Math.PI * 2, false);
                    }
            context.closePath();
            if (options.fill) {
                context.fillStyle = css3color(options.fillColor, options.fillOpacity);
                context.fill();
            }
            if (options.stroke) {
                context.strokeStyle = css3color(options.strokeColor, options.strokeOpacity);
                context.lineWidth = options.strokeWidth;
                context.stroke();
            }
            if (options.fade) {
                fader(canvas, 0);
            }
        };
        clear_canvas = function(canvas, area){
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        };
    }
    else {
        if (!document.documentMode || document.documentMode < 8) {
            document.createStyleSheet().addRule("v\\:*", "behavior: url(#default#VML); antialias: true;");
        }
        if (document.documentMode && document.documentMode >= 8) {
            document.writeln('<?import namespace="v" implementation="#default#VML" ?>');
        }
        document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
        create_canvas_for = function(img){
            return JQ('<var style="zoom:1;overflow:hidden;display:block;width:' + img.width + 'px;height:' + img.height + 'px;"></var>').get(0);
        };
        add_shape_to = function(canvas, shape, coords, options){
            var fill, stroke, opacity, e;
            fill = '<v:fill color="#' + options.fillColor + '" opacity="' + (options.fill ? options.fillOpacity : 0) + '" />';
            stroke = (options.stroke ? 'strokeweight="' + options.strokeWidth + '" stroked="t" strokecolor="#' + options.strokeColor + '"' : 'stroked="f"');
            opacity = '<v:stroke opacity="' + options.strokeOpacity + '"/>';
            if (shape == 'rect') {
                e = JQ('<v:rect filled="t" ' + stroke + ' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + coords[0] + 'px;top:' + coords[1] + 'px;width:' + (coords[2] - coords[0]) + 'px;height:' + (coords[3] - coords[1]) + 'px;"></v:rect>');
            }
            else 
                if (shape == 'poly') {
                    e = JQ('<v:shape filled="t" ' + stroke + ' coordorigin="0,0" coordsize="' + canvas.width + ',' + canvas.height + '" path="m ' + coords[0] + ',' + coords[1] + ' l ' + coords.join(',') + ' x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:' + canvas.width + 'px;height:' + canvas.height + 'px;"></v:shape>');
                }
                else 
                    if (shape == 'circ') {
                        e = JQ('<v:oval filled="t" ' + stroke + ' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + (coords[0] - coords[2]) + 'px;top:' + (coords[1] - coords[2]) + 'px;width:' + (coords[2] * 2) + 'px;height:' + (coords[2] * 2) + 'px;"></v:oval>');
                    }
            e.get(0).innerHTML = fill + opacity;
            JQ(canvas).append(e);
        };
        clear_canvas = function(canvas){
            JQ(canvas).empty();
        };
    }
    shape_from_area = function(area){
        var i, coords = area.getAttribute('coords').split(',');
        var href = area.getAttribute('href');
        var re = /content_\d+\_\d+\.htm/i;
        href = href.match(re);
        for (i = 0; i < coords.length; i++) {
            coords[i] = parseFloat(coords[i]);
        }
        return [area.getAttribute('shape').toLowerCase().substr(0, 4), coords, href];
    };
    
    is_image_loaded = function(img){
        if (!img.complete) {
            return false;
        } // IE
        if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
            return false;
        } // Others
        return true;
    }
    
    canvas_style = {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 0,
        border: 0
    };
    
    clear_ArticleHightLight = function(){
        JQ("#main-ed-articlenav-list").find("div").css({
            color: "#000000",
            background: "#E7E8D8"
        });
        JQ("canvas").remove();
    };

    fx = function(i){
        JQ("#main-ed-articlenav-list div").eq(i).html();
        JQ("#main-ed-articlenav-list div").eq(i).css({
            color: "#000000",
            background: "#c1c3d4"
        });
    };
    
    JQ.fn.maphilight = function(opts){
        opts = JQ.extend({}, JQ.fn.maphilight.defaults, opts);
        return this.each(function(){
            var img, wrap, options, map, canvas, mouseover;
            img = JQ(this);
            if (!is_image_loaded(this)) {
                return window.setTimeout(function(){
                    img.maphilight();
                }, 200);
            }
            options = JQ.metadata ? JQ.extend({}, opts, img.metadata()) : opts;
            map = JQ('map[name="' + img.attr('usemap').substr(1) + '"]');
            if (!(img.is('img') && img.attr('usemap') && map.size() > 0 && !img.hasClass('maphilighted'))) {
                return;
            }
            wrap = JQ('<div>').css({
                display: 'block',
                background: 'url(' + this.src + ')',
                position: 'relative',
                padding: 0,
                width: this.width,
                height: this.height
            });
            img.before(wrap).css('opacity', 0).css(canvas_style).remove();
            if (JQ.browser.msie) {
                if (!document.documentMode || document.documentMode < 8) {
                    img.css('filter', 'Alpha(opacity=0)');
                }
                if (document.documentMode && document.documentMode >= 8) {
                    img.css('-ms-filter', 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)');
                }
            }
            
            wrap.append(img);
            canvas = create_canvas_for(this);
            JQ(canvas).css(canvas_style);
            canvas.height = this.height;
            canvas.width = this.width;
            mouseover = function(e){
                var shape = shape_from_area(this);
                var ifedifm = false;
                var thisedifm = "";
                var thisediyt = "";
                var thisedifb = "";
                var currentid = null;
                for (i = 0; i < edid.length; i++) {
                    if (shape[2] == edid[i] + ".htm") {
                        ifedifm = true;
                        thisedifm = edifm[i];
                        thisediyt = ediyt[i];
                        thisedifb = edifb[i];
                        currentid = i;
                        break;
                    }
                }
//                if (currentid != null) {
//                    JQ("#main-ed-articlenav-list div").eq(currentid).css({
//                        color: "#000000",
//                        background: "#c1c3d4"
//                    });
//                }
                
                if (ifedifm) {
                    //JQ("#float").html(thisediyt + thisedifm + thisedifb);  //引题、副题都显示
                    JQ("#float").html(thisedifm);
                    pageX = e.clientX + JQ(window).scrollLeft();
                    pageY = e.clientY + JQ(window).scrollTop();
                    boxX = JQ("#float").outerWidth(true);
                    boxY = JQ("#float").outerHeight(true);
//                    alert(pageX+"-"+pageY+"-"+boxX+"-"+boxY);
                    if ((cX - e.clientX) > (boxX + 35)) {
                        floatX = pageX - boxX - 15;
                    }
                    else {
                        floatX = pageX + 15;
                    }
                    if ((cY - e.clientY) > (boxY + 10)) {
                        floatY = pageY - boxY - 10;
                    }
                    else {
                        floatY = pageY + 10;
                    }
                    JQ("#float").css({
                        top: floatY,
                        left: floatX
                    });
                    JQ("#float").show();
                }
                var oldcoords = shape[1];
                var newcoords = new Array;
                if (shape[0] != "poly") {
                    newcoords = oldcoords;
                }
                else {
                    var minX, minY, maxX, maxY;
                    minX = maxX = oldcoords[0];
                    minY = maxY = oldcoords[1];
                    for (i = 2; i < oldcoords.length; i += 2) {
                        if (minX > oldcoords[i]) {
                            minX = oldcoords[i];
                        };
                        if (maxX < oldcoords[i]) {
                            maxX = oldcoords[i];
                        };
                        if (minY > oldcoords[i + 1]) {
                            minY = oldcoords[i + 1];
                        };
                        if (maxY < oldcoords[i + 1]) {
                            maxY = oldcoords[i + 1];
                        };
                                            }
                    newcoords = [minX, minY, maxX, minY, maxX, maxY, minX, maxY];
                }               
                add_shape_to(canvas, shape[0], oldcoords, JQ.metadata ? JQ.extend({}, options, JQ(this).metadata()) : options);
            };
            
            
            if (options.alwaysOn) {
                JQ(map).find('area[coords]').each(mouseover);
            }
            else {
                JQ(map).find('area[coords]').mouseover(mouseover).mouseout(function(e){
                    clear_canvas(canvas);
                    JQ("#float").hide();
                    //clear_ArticleHightLight();
                });
            }
            img.before(canvas);
            img.addClass('maphilighted');
        });
    };
    JQ.fn.maphilight.defaults = {
        fill: true,
        fillColor: 'ffff00',
        fillOpacity: 0.3,
        stroke: true,
        strokeColor: 'ff0000',
        strokeOpacity: 0,
        strokeWidth: 0,
        fade: true,
        alwaysOn: false
    };
})(jQuery);

function replaceSubstring(inputString, fromString, toString){
    var tttemp = inputString;
    if (fromString == "") {
        return inputString;
    }
    
    if (toString.indexOf(fromString) == -1) {
        while (tttemp.indexOf(fromString) != -1) {
            var toTheLeft = tttemp.substring(0, tttemp.indexOf(fromString));
            var toTheRight = tttemp.substring(tttemp.indexOf(fromString) + fromString.length, tttemp.length);
            tttemp = toTheLeft + toString + toTheRight;
        }
    }
    else {
        var midStrings = new Array("~", "`", "_", "^", "#");
        var midStringLen = 1;
        var midString = "";
        while (midString == "") {
            for (var i = 0; i < midStrings.length; i++) {
                var tempMidString = "";
                for (var j = 0; j < midStringLen; j++) {
                    tempMidString += midStrings;
                }
                if (fromString.indexOf(tempMidString) == -1) {
                    midString = tempMidString;
                    i = midStrings.length + 1;
                }
            }
        }
        while (tttemp.indexOf(fromString) != -1) {
            var toTheLeft = tttemp.substring(0, tttemp.indexOf(fromString));
            var toTheRight = tttemp.substring(tttemp.indexOf(fromString) + fromString.length, tttemp.length);
            tttemp = toTheLeft + midString + toTheRight;
        }
        while (tttemp.indexOf(midString) != -1) {
            var toTheLeft = tttemp.substring(0, tttemp.indexOf(midString));
            var toTheRight = tttemp.substring(tttemp.indexOf(midString) + midString.length, tttemp.length);
            tttemp = toTheLeft + toString + toTheRight;
        }
    }
    return tttemp;
}

function textZoom(i){
    JQ("#ozoom *").each(function(){
        if ((this.style.fontSize != null) || (this.style.fontSize == null)) {
            var s_len = this.style.fontSize.length;
            var unit = this.style.fontSize.substring(s_len - 2, s_len);
            var nowSize = this.style.fontSize.substring(0, s_len - 2);
            var nowLSize = this.style.lineHeight.substring(0, s_len - 2);
            var newSize = parseInt(nowSize, 10) + parseInt(i, 10);
            var newLSize = parseInt(nowLSize, 10) + parseInt(2 * i, 10);
            this.style.fontSize = newSize + unit;
            this.style.lineHeight = newLSize + unit;
        }
    });
    zoomStatu += i;
}

String.prototype.Trim = function(){
    return this.replace(/^\s+/g, "").replace(/\s+JQ/g, "");
}

function makeCanvas(){
	
	// 2010-10-13 修改: -- by yangzl
	// 如果是火狐浏览器，就退出
	if(JQ.browser.safari){return;} // 兼容苹果
	if(JQ.browser.mozilla){return;} // 兼容火狐
	if(JQ.browser.opera){return;} // 兼容opera
	// 2010-10-13 修改: -- by yangzl
	
    JQ("canvas").remove();
    var args = arguments.length;
    if (document.getElementById("myCanvas") == null) {
        if (JQ.browser.msie) {
            if (document.body.clientWidth >= 980) {
                var elem = document.createElement("<canvas id='myCanvas' style='width:" + arguments[arguments.length - 2] + "px;height:" + 520 + "px;filter:Alpha(opacity=30);position:absolute;left:" + ((document.body.clientWidth - 980) / 2 + 39) + "px;top:10px;'></canvas>");
            }
            else {
                var elem = document.createElement("<canvas id='myCanvas' style='width:" + arguments[arguments.length - 2] + "px;height:" + 520 + "px;filter:Alpha(opacity=30);position:absolute;left:" + 39 + "px;top:10px;'></canvas>");
            }
            document.body.appendChild(elem);
            elem = G_vmlCanvasManager.initElement(elem);
            var context = elem.getContext('2d');
        }
        else {
            if (document.body.clientWidth >= 980) {
                document.write("<canvas id='myCanvas' style='width:" + arguments[arguments.length - 2] + ";height:" + 520 + ";opacity:0.3;position:absolute;left:" + ((document.body.clientWidth - 980) / 2 + 39) + "px;top:10px;'></canvas>");
            }
            else {
                document.write("<canvas id='myCanvas' style='width:" + arguments[arguments.length - 2] + ";height:" + 520 + ";opacity:0.3;position:absolute;left:" + 39 + "px;top:10px;'></canvas>");
            }
            var elem = document.getElementById('myCanvas');
            var context = elem.getContext('2d');
        }
        
        if (elem && elem.getContext) {
            if (context) {
                context.fillStyle = '#FFFF00';
                //context.strokeStyle = '#FFFF00';
                //context.lineWidth   = 1;
                context.beginPath();
                context.moveTo(arguments[0], arguments[1] + 20); // give the (x,y) coordinates
                for (var i = 2; i < arguments.length - 2; i = i + 2) {
                    context.lineTo(arguments[i], arguments[i + 1] + 20);
                }
                context.lineTo(arguments[0], arguments[1] + 20);
                
                context.fill();
                //context.stroke();
                context.closePath();
            }
        }
    }
}
