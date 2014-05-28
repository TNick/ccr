define(['./common_enhance',
        'domReady!'], function (comnEnh, document) {


    function getID(id)
    {
        return document.getElementById(id);
    }

    // Global object to hold drag information.
    var dragObj = new Object();

    function dragStart(event, id) {
        var x, y;
        dragObj.elNode = getID(id);
        // Get cursor position with respect to the page.
        try {
            x = window.event.clientX + document.documentElement.scrollLeft
                    + document.body.scrollLeft;
            y = window.event.clientY + document.documentElement.scrollTop
                    + document.body.scrollTop;
        }
        catch (e) {
            x = event.clientX + window.scrollX;
            y = event.clientY + window.scrollY;
        }
        // Save starting positions of cursor and element.
        dragObj.cursorStartX = x;
        dragObj.cursorStartY = y;
        dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
        dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);
        if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
        if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;
        // Capture mousemove and mouseup events on the page.
        comnEnh.registerEvent(mousemove, dragGo);
        comnEnh.registerEvent(mouseup, dragStop);
    }

    function dragGo(event) {
        var x, y;
        // Get cursor position with respect to the page.
        try  {
            x = window.event.clientX + document.documentElement.scrollLeft
                    + document.body.scrollLeft;
            y = window.event.clientY + document.documentElement.scrollTop
                    + document.body.scrollTop;
        }
        catch (e) {
            x = event.clientX + window.scrollX;
            y = event.clientY + window.scrollY;
        }
        // Move drag element by the same amount the cursor has moved.
        var drLeft = (dragObj.elStartLeft + x - dragObj.cursorStartX);
        var drTop = (dragObj.elStartTop  + y - dragObj.cursorStartY);
        if (drLeft > 0)        {
            dragObj.elNode.style.left = drLeft  + "px";
        }        else        {
            dragObj.elNode.style.left = "1px";
        }
        if (drTop > 0)        {
            dragObj.elNode.style.top  = drTop + "px";
        }        else        {
            dragObj.elNode.style.top  = "1px";
        }
        try {
            window.event.cancelBubble = true;
            window.event.returnValue = false;
        }
        catch(e){
            event.preventDefault();
        }
    }

    function dragStop(event) {
        // Stop capturing mousemove and mouseup events.
        comnEnh.unregisterEvent(document, 'mousemove', dragGo);
        comnEnh.unregisterEvent(document, 'mouseup', dragStop);
        comnEnh.remClass(dragObj.elNode.id,'mousegrabbing');
    }

    return {
        dragObj: function() {return new Object();},
        dragStart: function (event, id) {
            if (event.button !== 0) { // left button
                return;
            }
            var x, y;
            dragObj.elNode = getID(id);
            // Get cursor position with respect to the page.
            try {
                x = window.event.clientX + document.documentElement.scrollLeft
                        + document.body.scrollLeft;
                y = window.event.clientY + document.documentElement.scrollTop
                        + document.body.scrollTop;
            }
            catch (e) {
                x = event.clientX + window.scrollX;
                y = event.clientY + window.scrollY;
            }
            // Save starting positions of cursor and element.
            dragObj.cursorStartX = x;
            dragObj.cursorStartY = y;
            dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
            dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);
            if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = dragObj.elNode.offsetLeft;
            if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = dragObj.elNode.offsetTop;
            // Capture mousemove and mouseup events on the page.

            comnEnh.registerEvent(document, 'mousemove', dragGo);
            comnEnh.registerEvent(document, 'mouseup', dragStop);

            comnEnh.addClass(id,'mousegrabbing');
        }

    };

});
