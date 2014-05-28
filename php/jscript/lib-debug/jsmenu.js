/*
  Adapted from the script at https://github.com/pashaa00/jsmenu
  By pashaa00
*/

define(['domReady!'],
       function (document) {


    var urlArrow = "url('img/10x10_arr_right.png')";
    var imgArrow = new Image();
    imgArrow.src = "img/10x10_arr_right.png";

    var urlCheckOn = "img/12x12_check_on.png";
    var urlCheckOff = "img/12x12_check_off.png";
    var imgCheckOn = new Image();
    imgCheckOn.src = urlCheckOn;
    var imgCheckOff = new Image();
    imgCheckOff.scr = urlCheckOff;

    var urlRadioOn = "img/12x12_radio_check.png";
    var urlRadioOff = "img/12x12_radio_uncheck.png";
    var imgRadioOn = new Image();
    imgRadioOn.src = urlRadioOn;
    var imgRadioOff = new Image();
    imgRadioOff.scr = urlRadioOff;


    var $zIndex = 1000;

    function getWindowWidth() {
        return (window.innerWidth) ? (window.innerWidth) : (document.body.offsetWidth);
    }

    function detect_IE7() {
        return !document.querySelector;
    }

    function getRefToMenuBar(o) {
        return (o.parent instanceof JSMenuBar) ? (o.parent) : (getRefToMenuBar(o.parent));
    }

    function pageX(elem) {
        return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
    }

    function resetCssContainer(elem) {
        var s = elem.style;
        s.top = "";
        s.left = "";
        s.right = "";
        s.bottom = "";
        s.border = "none";
        s.clear = "none";
        s.outline = "none";
        setFloat(elem, "none");
        s.color = "black";
        s.background = "none";
    }

    ;

    function setFloat(q, v) {
        return (q.style.cssFloat) ? (q.style.cssFloat = v) : (q.style.styleFloat = v);
    }

    function createElem(type) {
        return document.createElement(type);
    }

    function createMenuBarContainer(opts) {
        var d = createElem("div");
        resetCssContainer(d);
        d.style.position = "relative";
        addStylesFromHash(d, opts);
        return d;
    }


    function createMenuNode() {
        var a = createElem("a");
        resetCssContainer(a);
        a.style.position = "relative";
        a.style.display = "block";
        return a;
    }

    function createSubMenu() {
        var d = createElem("div");
        resetCssContainer(d);
        var s = d.style;
        s.position = "absolute";
        s.width = "0px";
        s.display = "none";
        return d;
    }

    function addStylesFromHash(elem, hash) {
        for (var p in hash) {
            elem.style[p] = hash[p];
        }
    }

    function createTestElement(type, text, styles) {
        var a = document.createElement(type);
        addStylesFromHash(a, styles);
        a.innerHTML = text;
        a.style.visibility = "hidden";
        a.style.display = "";
        a.style.position = "absolute";
        return a;
    }

    function fixTarget(e) {
        return e.target || e.srcElement;
    }

    function fixTargetTo(e) {
        return e.relatedTarget || e.toElement;
    }

    function fixTargetFrom(e) {
        return e.relatedTarget || e.fromElement;
    }

    function addIcon(menu, url) {
        var img = new Image();
        img.src = url;
        img.onload = function() {
            try {
                var i = createIconContainer(this.width, this.height);
                addImg(i, "url('" + url + "')");
                var menuBar = getRefToMenuBar(menu);
                var h = menuBar.opts.tt4;
                i.style.left = "2px";
                i.style.top = ((h - this.height) / 2) + "px";
                menu.co.appendChild(i);
            } catch(e) {
            }
            ;
        }


    }

    function addArrowContainer(menu) {

        var q = menu.co;
        var i = createIconContainer(10, 10);
        var mb = getRefToMenuBar(menu);
        var h = mb.opts.tt4;

        i.style.right = "4px";
        i.style.top = ((h / 2) - 4) + "px";

        addImg(i, urlArrow);
        q.appendChild(i);
    }

    function addImg(elem, url) {
        elem.style.backgroundImage = url;
        elem.style.backgroundPosition = "0px 0px";
        elem.style.backgroundRepeat = "no-repeat";
    }

    function createIconContainer(w, h) {
        var q = createElem("span");
        resetCssContainer(q);
        var s = q.style;
        s.display = "block";
        s.position = "absolute";
        s.width = w + "px";
        s.height = h + "px";
        return q;
    }


    function setTopIndentForSubMenu(menu) {
        var mb = getRefToMenuBar(menu);
        menu.subMenu.style.top = mb.opts.tt2 + "px";
    }

    function setTopIndentForRootSubMenu(menu, menuBar) {
        menu.subMenu.style.top = menuBar.opts.tt1 + "px";
    }

    function setLeftIndentForRootSubMenu(menu, menuBar) {
        menu.subMenu.style.left = menuBar.opts.tt3 + "px";
    }

    function setLeftIndentOfMenu(menu, width) {
        var menuBar = getRefToMenuBar(menu);
        var v = 0;
        if (detect_IE7()) {
            v = width + menuBar.opts.tt5 * 2;
        } else {
            v = width + menuBar.opts.tt5 - 4;
        }
        ;
        menu.subMenu.style.left = v + "px";
    }

    function setRightIndentOfMenu(menu, width) {
        if (detect_IE7()) {
            setLeftIndentOfMenu(menu, width);
            return;
        }
        ;
        var menuBar = getRefToMenuBar(menu.parent);
        menu.subMenu.style.right = (width + menuBar.opts.tt5 - 4) + "px";
    }


    function addEvent(element, type, handler) {
        if (!handler.$$guid) {
            handler.$$guid = addEvent.guid++
        }
        ;
        if (!element.events) {
            element.events = {}
        }
        ;
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
            ;
        }
        ;
        handlers[handler.$$guid] = handler;

        element["on" + type] = handleEvent;
    }

    ;

    addEvent.guid = 1;

    function removeEvent(element, type, handler) {
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    }

    ;


    function handleEvent(event) {
        var returnValue = true;
        event = event || fixEvent(window.event);
        var handlers = this.events[event.type];
        for (var i in handlers) {
            this.$$handleEvent = handlers[i];
            if (this.$$handleEvent(event) === false) {
                returnValue = false;
            }
        }
        return returnValue;
    }

    ;

    function fixEvent(event) {
        event.preventDefault = fixEvent.preventDefault;
        event.stopPropagation = fixEvent.stopPropagation;
        return event;
    }

    ;
    fixEvent.preventDefault = function() {
        this.returnValue = false;
    };
    fixEvent.stopPropagation = function() {
        this.cancelBubble = true;
    };


    function ElemWithHandler(elem, type, handler) {
        this.elem = elem;
        this.type = type;
        this.handler = handler;
        addEvent(elem, type, handler);
    }

    ElemWithHandler.prototype.destruct = function() {
        removeEvent(this.elem, this.type, this.handler);
    }


    function isCheckBox(o) {
        return (o.constructor===JSCheckBoxMenuItem);
    }

    function addCheckIcon(item) {
        var ic = createIconContainer(12, 12);
        addImg(ic, (isCheckBox(item)) ? ("url('" + urlCheckOff + "')") : ("url('" + urlRadioOff + "')"));
        var q = item.co;
        var menuBar = getRefToMenuBar(item);
        ic.style.left = "3px";
        ic.style.top = (menuBar.opts.tt4 / 2 - 5) + "px";
        q.appendChild(ic);
        item.icon = ic;
    }


    function hideCheckIcon(item) {

        item.icon.style.backgroundImage = (isCheckBox(item)) ? ("url('" + urlCheckOff + "')") : ("url('" + urlRadioOff + "')");
    }

    function showCheckIcon(item) {
        item.icon.style.backgroundImage = (isCheckBox(item)) ? ("url('" + urlCheckOn + "')") : ("url('" + urlRadioOn + "')");
    }

    function JSCheckBoxMenuItem(title, opts) {  ///opts.handler:Function   opts.checked:Boolean
        this.$ha = new Array();
        this.checked = false;
        this.title = title;
        var a = createMenuNode();
        a.innerHTML = title;
        this.co = a;
        //this.type = 0; ///0 = mean checkbox; 1 = radioButton
        this.icon = null;
        if (opts) {
            this.checked = (opts.checked == null) ? (false) : (opts.checked);
            if (opts.clickHandler) {
                this.addClickHandler(opts.clickHandler)
            }
            else {
                this.addClickHandler(function() {
                })
            }
            ;
            if (opts.type) {
                this.type = opts.type
            }
            ;
        } else {
            this.addClickHandler(function() {
            })
        }
        ;

    }

    JSCheckBoxMenuItem.prototype.buildDefaultCSS = function(menuBar) {
        var bar = menuBar;
        if (!bar) {
            bar = getRefToMenuBar(this)
        }
        ;
        addStylesFromHash(this.co, bar.sop.itemMenuOut);
        addHoversHandlersToItems(this, bar);
        if (!this.icon) {
            addCheckIcon(this);
            (this.checked) ? (showCheckIcon(this)) : (hideCheckIcon(this));
        }
        ;
    }

    JSCheckBoxMenuItem.prototype.appendTo = function(menu) {
        this.parent = menu;
        menu.subMenu.appendChild(this.co);
    }

    JSCheckBoxMenuItem.prototype.addClickHandler = function(f) {
        if (typeof(f) != "function") {
            return;
        }
        var self = this;
        var _h = function(e) {
            if (e) {
                e.stopPropagation();
            }
            self.checked = !self.checked;
            (self.checked) ? (showCheckIcon(self)) : (hideCheckIcon(self));
            f(e);
        }
        this.$ha.push(new ElemWithHandler(this.co, "click", _h));
    }

    JSCheckBoxMenuItem.prototype.getState = function() {
        return this.checked;
    }

    JSCheckBoxMenuItem.prototype.setState = function(b) {
        if (typeof(b) != "boolean") {
            return;
        }
        this.checked = b;
        (this.checked) ? (showCheckIcon(this)) : (hideCheckIcon(this));
    }

    function showSubMenuWithDelay(menu) {
        if (menu.wasHover) {
            menu.wasPressed = true;
            openSubMenu(menu);
        }
    }

    function hasSameParent(o1, o2) {
        return (o1.parentNode == o2.parentNode);
    }

    function _closeSubMenus(menu) {
        var m = menu.$sm;
        for (var i = 0; i < m.length; i++) {
            if (m[i].wasPressed) {
                closeMenu(m[i]);
            }
        }
    }


    function addHoversHandlersToItems(item, menuBar) {
        var q = item.co;
        var styleOver = menuBar.sop.itemMenuOver;
        var styleOut = menuBar.sop.itemMenuOut;

        var mouseOverHandler = function(e) {
            e.stopPropagation();

            addStylesFromHash(q, styleOver);
            _closeSubMenus(item.parent);
        }

        var mouseOutHandler = function(e) {
            e.stopPropagation();

            addStylesFromHash(q, styleOut);
        }

        item.$ha.push(new ElemWithHandler(q, "mouseover", mouseOverHandler));
        item.$ha.push(new ElemWithHandler(q, "mouseout", mouseOutHandler));


    }


    function addHoversHandlersToMenu(menu) {
        var menuBar = getRefToMenuBar(menu);
        var q = menu.co;

        var styleOver = menuBar.sop.itemMenuOver;
        var styleOut = menuBar.sop.itemMenuOut;

        var mouseOverHandler = function(e) {
            e.stopPropagation();

            var targetFrom = fixTargetFrom(e);
            if (targetFrom.nodeName == "SPAN" && targetFrom.parentNode == q) {
                return;
            }


            menu.wasHover = true;
            if (!menu.wasPressed) {
                _closeSubMenus(menu.parent);
            }
            setTimeout(function() {
                showSubMenuWithDelay(menu)
            }, 400);
            addStylesFromHash(q, styleOver);
        }

        var mouseOutHandler = function(e) {
            e.stopPropagation();
            var target = fixTarget(e);
            var targetTo = fixTargetTo(e);
            if (!targetTo || !target) {
                return;//ie bug
            }
            if (targetTo == q) {
                return;
            }
            if (targetTo.nodeName == "SPAN" && targetTo.parentNode == q) {
                return;
            }
            menu.wasHover = false;

            if ((hasSameParent(targetTo, q) || !menu.wasPressed)) {
                addStylesFromHash(q, styleOut);
                closeMenu(menu);
            }
        }

        menu.$ha.push(new ElemWithHandler(q, "mouseover", mouseOverHandler));
        menu.$ha.push(new ElemWithHandler(q, "mouseout", mouseOutHandler));
    }


    function addHoversHandlersToRootMenu(menu, menuBar) {
        var q = menu.co;

        var styleOut = menuBar.sop.rootMenuOut;
        var styleOver = menuBar.sop.rootMenuOver;

        var mouseOverHandler = function(e) {
            addStylesFromHash(q, styleOver);
            var openRoot = menuBar.orm;
            if (openRoot && (openRoot != menu)) {
                closeMenu(openRoot);
                menuBar.orm = menu;
                showSubMenu(menu);
            }
        }

        var mouseOutHandler = function(e) {
            e.stopPropagation();
            if (menu.wasPressed) {
                return;
            }
            addStylesFromHash(q, styleOut);
        }

        menu.$ha.push(new ElemWithHandler(q, "mouseover", mouseOverHandler));
        menu.$ha.push(new ElemWithHandler(q, "mouseout", mouseOutHandler));
    }

    function addClickHandlerToRootMenu(menu) {
        var q = menu.co;
        var clickHandler = function(e) {
            if (!menu.parent.wfm)return;
            e.stopPropagation();
            menu.parent.orm = menu;
            menu.wasPressed = true;
            showSubMenu(menu);
        }
        menu.$ha.push(new ElemWithHandler(q, "click", clickHandler));
    }


    function closeMenu(menu) {
        var m = menu.$sm;
        for (var i = 0; i < m.length; i++) {
            if (m[i].wasPressed) {
                closeMenu(m[i]);
            }
        }

        menu.wasPressed = false;
        menu.buildDefaultCSS();
        hideSubMenu(menu);
    }

    function openSubMenu(menu) {
        var x = pageX(menu.co);
        var w = menu.parent.subMenu.offsetWidth;
        var sub = menu.subMenuWidth;
        var windowWidth = getWindowWidth();
        // alert("left:"+x+" ;width:"+w+" ;subw:"+sub+" ;wind:"+windowWidth);
        if ((x + w + sub) < windowWidth) {
            setLeftIndentOfMenu(menu, w);
        }
        else {
            setRightIndentOfMenu(menu, w);
        }
        showSubMenu(menu);
    }

    function showSubMenu(menu) {
        menu.wasPressed = true;
        menu.subMenu.style.display = "block";
        menu.subMenu.style.zIndex = $zIndex++;
    }

    function hideSubMenu(menu) {
        menu.subMenu.style.display = "none";
    }


    function addMenuToMenuBar(menu, menuBar) {
        addStylesFromHash(menu.co, menuBar.sop.rootMenuOut);
        addStylesFromHash(menu.subMenu, menuBar.sop.subMenu);

        menu.co.style.display = "inline-block";
        addHoversHandlersToRootMenu(menu, menuBar);

        menu.co.appendChild(menu.subMenu);
        menuBar.co.appendChild(menu.co);

        setTopIndentForRootSubMenu(menu, menuBar);
        setLeftIndentForRootSubMenu(menu, menuBar);


        addClickHandlerToRootMenu(menu);

    }

    function addMenuToMenu(menu, parentMenu) {
        parentMenu.subMenu.appendChild(menu.co);
        menu.co.appendChild(menu.subMenu);
    }

    function JSMenu(title, icon) {
        this.$sm = new Array();
        this.$childes = new Array();
        this.$ha = new Array();
        var a = createMenuNode();
        this.title = title;
        this.co = a;
        this.subMenu = createSubMenu();
        a.innerHTML = title;

        this.wasPressed = false;
        this.wasHover = false;
        this.subMenuWidth = 0;
        if (icon) {
            this.addIcon(icon);
        }

    }

    function canAdd(o) {
        var b1 = (o instanceof JSMenu);
        var b2 = (o instanceof JSMenuItem);
        var b3 = (o instanceof JSCheckBoxMenuItem);
        var b4 = (o instanceof JSRadioButton);
        return ((b1 || b2) || (b3 || b4));
    }

    JSMenu.prototype.add = function(item) {
        if (!canAdd(item)){return;}
        this.$childes.push(item);
        if (item instanceof JSMenu) {
            this.$sm.push(item);
        }



        item.appendTo(this);
    }

    JSMenu.prototype.appendTo = function(parent) {
        this.parent = parent;
        if (parent instanceof JSMenuBar) {
            addMenuToMenuBar(this, parent);
        }
        if (parent instanceof JSMenu) {
            addMenuToMenu(this, parent);
        }
    }

    JSMenu.prototype.buildDefaultCSS = function(menuBar) {
        var bar = menuBar;
        if (!bar) {
            bar = getRefToMenuBar(this);
        }


        var styles = (this.parent instanceof JSMenu) ? (bar.sop.itemMenuOut) : (bar.sop.rootMenuOut);
        var a = this.co.style;
        for (var p in styles) {
            a[p] = styles[p];
        }
    }


    JSMenu.prototype.addSeparator = function(c) {
        var sep = createElem("div");
        var s = sep.style;
        resetCssContainer(sep);
        s.position = "relative";
        s.height = "1px";
        s.fontSize = "0px";
        s.border = "none";
        s.background = (c) ? (c) : ("black");
        this.subMenu.appendChild(sep);
    }




    JSMenu.prototype.addIcon = function(url) {
        addIcon(this, url);
    }

    var defaultJSStyle = {
        menuBar:{
            width:"100%",
            background:"#d3d3d3"
        },
        rootMenuOut:{
            padding:"3px 15px",
            background:"#d3d3d3",
            textAlign:"left",
            fontFamily:"georgia"
        },
        rootMenuOver:{
            fontFamily:"georgia",
            background:"#a9a9a9",
            cursor:"pointer"
        },
        subMenu:{
            border:"1px solid black"
        },
        itemMenuOut:{
            fontFamily:"georgia",
            background:"#d3d3d3",
            textAlign:"left",
            padding:"3px 20px"
        },
        itemMenuOver:{
            fontFamily:"georgia",
            background:"#a9a9a9",
            cursor:"pointer"
        }
    }

    var invalidCss = {
        "position":null,
        "top":null,
        "left":null,
        "right":null,
        "bottom":null,
        "clear":null,
        "float":null,
        "overflow":null,
        "overflowX":null,
        "overflowY":null,
        "display":null
    }


    function correctHashCss(hash) {
        for (var p in hash) {
            if (p in invalidCss) {
                delete hash[p];
            }
            else {
                hash[p] += "";
            }
        }
    }

    function expandDefaultStyles(opts) {
        for (var a in defaultJSStyle) {
            if (!opts[a]) {
                opts[a] = defaultJSStyle[a];
            }
              for (var b in defaultJSStyle[a]) {
                if (!opts[a][b])opts[a][b] = defaultJSStyle[a][b];
            }
        }
    }

    function getMenuNodeWidth(menu, menuBar) {
        var s = menuBar.sop.itemMenuOut;
        var testElem = createTestElement("a", menu.title, s);
        var body = document.body;
        body.appendChild(testElem);
        var w = testElem.clientWidth;
        body.removeChild(testElem);
        return w;
    }


    function recurrentBuild(menu, menuBar) {

        var menus = menu.$sm;

        var a = menuBar.sop.subMenu;
        var _s = menu.subMenu.style;
        for (var p in a) {
            _s[p] = a[p];
        }

        var items = menu.$childes;
        for (var i = 0; i < items.length; i++) {
            items[i].buildDefaultCSS(menuBar);
            var w = getMenuNodeWidth(items[i], menuBar);
            var max_w = (w > menu.subMenuWidth) ? (w) : (menu.subMenuWidth);
            menu.subMenuWidth = (max_w); //+2 moz bug
            menu.subMenu.style.width = (max_w + 2) + "px";
        }

        for (var i = 0; i < menus.length; i++) {
            setTopIndentForSubMenu(menus[i]);
            addHoversHandlersToMenu(menus[i]);
            addArrowContainer(menus[i]);
            recurrentBuild(menus[i], menuBar);
        }

    }


    function buildAll(menuBar) {
        var menus = menuBar.$sm;
        for (var i = 0; i < menus.length; i++) {
            recurrentBuild(menus[i], menuBar);
        }
        menuBar.wfm = true;
    }

    function fixOpts(options) {
        for (var p in options) {
            correctHashCss(options[p]);
        }
        // fixSubMenuStyles(options.subMenuBorder);
        expandDefaultStyles(options);
    }

    function createDimensionsParameters(opts) {
        var body = document.body;
        var o = {};

        var testElem = createTestElement("a", "z", opts.itemMenuOut);
        body.appendChild(testElem);
        var h4 = testElem.offsetHeight;
        body.removeChild(testElem);


        testElem = createTestElement("a", "z", opts.rootMenuOut);
        body.appendChild(testElem);
        var h1 = testElem.offsetHeight;
        try {
            var _h = parseInt(testElem.style.borderTopWidth);
            h1 -= (isNaN(_h)) ? (0) : (_h);
        } catch(e) {
        }

        body.removeChild(testElem);

        testElem = createTestElement("a", "z", opts.rootMenuOver);
        body.appendChild(testElem);
        var h3 = 0;
        try {
            var w = parseInt(testElem.style.borderLeftWidth);
            h3 -= (isNaN(w)) ? (0) : (w);
        } catch(e) {
        }
        body.removeChild(testElem);


        var h2 = 0;
        var h5 = 0;
        testElem = createTestElement("div", "", opts.subMenu);
        body.appendChild(testElem);
        try {
            w = parseInt(testElem.style.borderTopWidth);
            h2 -= (isNaN(w)) ? (0) : (w);
            w = parseInt(testElem.style.paddingTop);
            h2 -= (isNaN(w)) ? (0) : (w);
            w = parseInt(testElem.style.borderLeftWidth);
            h5 -= (isNaN(w)) ? (0) : (w);
            w = parseInt(testElem.style.paddingLeft);
            h5 -= (isNaN(w)) ? (0) : (w * 2);
        } catch(e) {
        }
        body.removeChild(testElem);
        testElem = null;
        o.tt1 = h1;
        o.tt2 = h2;
        o.tt3 = h3;
        o.tt4 = h4;
        o.tt5 = h5;
        return o;
    }

    function closeAllMenusOfMenuBar(bar) {
        closeMenu(bar.orm);
        bar.orm = null;
    }


    var $$barId = 0;
    var bars = {};

    var closeHandler = function(e) {
        e.stopPropagation();
        var target = fixTarget(e);

        for (var b in bars) {
            if ((bars[b].orm) && (target != bars[b].co)) {
                closeAllMenusOfMenuBar(bars[b]);
            }
        }
    }


    var menuBarCloseHandler = null;


    function JSMenuBar(options) {
        fixOpts(options);
        this.sop = options;

        this.opts = createDimensionsParameters(options);

        var q = createMenuBarContainer(options.menuBar);

        this.co = q;

        this.$sm = new Array();
        this.orm = null;
        this.wfm = false;

        this.$ha = new Array();

        var self = this;
        var buildHandler = function(e) {
            e.stopPropagation();
            if (self.wfm)return;
            buildAll(self);
        }
        this.$ha.push(new ElemWithHandler(q, "mouseover", buildHandler));
    }

    ;

    JSMenuBar.prototype.add = function(menu) {
        if (!(menu instanceof JSMenu))return;
        this.$sm.push(menu);
        menu.appendTo(this);
    }


    JSMenuBar.prototype.appendTo = function(parent) {
        parent.appendChild(this.co);
        this.$$id = $$barId;
        bars[$$barId++] = this;


        if (!menuBarCloseHandler) {
            menuBarCloseHandler = new ElemWithHandler(document.body, "click", closeHandler);
        }
    }


    JSMenuBar.prototype.build = function() {
        buildAll(this);
    }

    JSMenuBar.prototype.destruct = function() {
        var sm = this.$sm;
        removeHandlers(this);
        for (var i = 0; i < sm.length; i++) {
            recurrentRemoveAll(sm[i]);
            removeHandlers(sm[i]);
            removeElemWithChildes(sm[i].co);
        }

        try {
            this.co.parentNode.removeChild(this.co);
        } catch(e) {
        }
        ;
        delete  bars[this.$$id];
        removeAllProps(this);
    }

    function recurrentRemoveAll(menu) {
        var sm = menu.$sm;
        for (var i = 0; i < sm.length; i++) {
            recurrentRemoveAll(sm[i]);
        }

        var ci = menu.$childes;
        for (var i = 0; i < ci.length; i++) {
            removeHandlers(ci[i]);
            removeElemWithChildes(ci[i].co);
            removeAllProps(ci[i]);
        }
        ci.length = 0;
    }


    function removeHandlers(obj) {
        var hs = obj.$ha;
        for (var j = 0; j < hs.length; j++) {
            hs[j].destruct();
        }
        obj.$ha.length = 0;
    }

    function removeAllProps(obj) {
        for (var p in obj) {
            obj[p] = null;
            delete obj[p];
        }
    }

    function removeElemWithChildes(elem) {
        var q = elem.childNodes;
        for (var i = 0; i < q.length; i++) {
            removeElemWithChildes(q[i]);
        }
        elem.parentNode.removeChild(elem);
    }


    function JSMenuItem(title, opts) {   //opts.icon  opts.clickHandler


        this.title = title;
        var a = createMenuNode();
        a.innerHTML = title;
        this.co = a;

        this.$ha = new Array();
        if (opts) {
            if (opts.clickHandler) {
                this.addClickHandler(opts.clickHandler);
            }
            if (opts.icon) {
                this.addIcon(opts.icon);
            }
        }
    }

    JSMenuItem.prototype.appendTo = function(menu) {
        this.parent = menu;
        menu.subMenu.appendChild(this.co);
    }

    JSMenuItem.prototype.buildDefaultCSS = function(menuBar) {
        var bar = menuBar;
        if (!bar) {
            bar = getRefToMenuBar(this);
        }


        addStylesFromHash(this.co, bar.sop.itemMenuOut);
        if (this.$ha.length <= 1) {
            addHoversHandlersToItems(this, bar);
        }
    }


    JSMenuItem.prototype.addClickHandler = function(f) {
        if (typeof(f) != "function") {
            return;
        }

        var self = this;
        var _h = function(e) {
            if (e){e.stopPropagation();}
            var menuBar = getRefToMenuBar(self.parent);
            closeMenu(menuBar.orm);
            menuBar.orm = null;
            f(e);
        };

        this.$ha.push(new ElemWithHandler(this.co, "click", _h));
    }


    JSMenuItem.prototype.addIcon = function(url) {
        addIcon(this, url);
    }

    function JSRadioButton(title, opts) {  ///opts.handler:Function   opts.state:Boolean

        var o = new JSCheckBoxMenuItem(title,opts) ;

        o.constructor = arguments.callee;

        return o;

    }

    return {
        JSMenuBar: JSMenuBar,
        JSMenu: JSMenu,
        JSMenuItem: JSMenuItem,
        JSRadioButton: JSRadioButton,
        JSCheckBox: JSCheckBoxMenuItem
    };

});
