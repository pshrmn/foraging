/**
functions to add classes to elements in the page to indicate they
can be selected or match a selector
**/

function highlightElements(){
    var className = "highlighted";

    function highlight(elements){
        elements.forEach(function(e){
            e.classList.add(className);
        });
    }

    highlight.remove = function(){
        var elements = [].slice.call(document.getElementsByClassName(className));
        elements.forEach(function(e){
            e.classList.remove(className);
        });
    };

    highlight.cssClass = function(name){
        className = name;
        return highlight;
    };

    return highlight;
}

function interactiveElements(){
    var className = "highlighted";
    var hovered = "hovered";
    var clicked = function(){};
    var mouseover = function addOption(event){
        event.stopPropagation();
        this.classList.add(hovered);
    };
    var mouseout = function removeOption(event){
        this.classList.remove(hovered);
    };

    function highlight(elements){
        elements.forEach(function(e){
            e.classList.add(className);
            e.addEventListener("mouseover", mouseover, false);
            e.addEventListener("mouseout", mouseout, false);
            e.addEventListener("click", clicked, false);
        });
    }

    highlight.remove = function(){
        var elements = [].slice.call(document.getElementsByClassName(className));
        elements.forEach(function(e){
            e.classList.remove(className);
            e.classList.remove(hovered);
            e.removeEventListener("mouseover", mouseover, false);
            e.removeEventListener("mouseout", mouseout, false);
            e.removeEventListener("click", clicked, false);
        });
    };

    highlight.cssClass = function(name){
        className = name;
        return highlight;
    };

    highlight.hoverClass = function(name){
        hovered = name;
        return highlight;
    };

    highlight.clicked = function(fn){
        clicked = fn;
        return highlight;
    };

    highlight.mouseover = function(fn){
        mouseover = fn;
        return highlight;
    };

    highlight.mouseout = function(fn){
        mouseout = fn;
        return highlight;
    };

    return highlight;
}
