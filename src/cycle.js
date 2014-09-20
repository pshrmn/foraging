var Cycle = (function(){
    function Cycle(holder, interactive){
        this.index = 0;
        this.elements = [];
        this.interactive = interactive || false;
        this.holder = holder;
        this.generateHTML();
    }

    Cycle.prototype.setElements = function(elements){
        this.elements = elements;
        this.preview();
    };

    Cycle.prototype.reset = function(){
        this.elements = [];
        this.index = 0;
        this.htmlElements.preview.textContent = "";
        this.htmlElements.index.textContent = "";
    };

    Cycle.prototype.generateHTML = function(){
        var previousButton = noSelectElement("button"),
            index = noSelectElement("span"),
            nextButton = noSelectElement("button"),
            preview = noSelectElement("span");

        previousButton.textContent = "<<";
        nextButton.textContent = ">>";

        previousButton.addEventListener("click", this.previous.bind(this), false);
        nextButton.addEventListener("click", this.next.bind(this), false);

        this.htmlElements = {
            previous: previousButton,
            index: index,
            next: nextButton,
            preview: preview
        };

        appendChildren(this.holder, [previousButton, index, nextButton, preview]);
    };

    Cycle.prototype.previous = function(event){
        event.preventDefault();
        this.index = ( this.index === 0 ) ? this.elements.length-1 : this.index - 1;
        this.preview();
        markCapture();
    };

    Cycle.prototype.next = function(event){
        event.preventDefault();
        this.index = ( this.index === this.elements.length - 1) ? 0 : this.index + 1;
        this.preview();
        markCapture();
    };

    Cycle.prototype.preview = function(){
        var element = this.elements[this.index],
            negative = this.index - this.elements.length;
        this.htmlElements.index.textContent = (this.idex === 0) ? "" : this.index + " / " + negative;
        this.htmlElements.preview.innerHTML = "";

        var clone = cleanElement(element.cloneNode(true)),
            html = clone.outerHTML,
            attrs = clone.attributes,
            curr, text, splitHTML, firstHalf, secondHalf, captureEle;
        if ( this.interactive ) {
            for ( var i=0, len =attrs.length; i<len; i++ ) {
                curr = attrs[i];
                text = attributeText(curr);

                splitHTML = html.split(text);
                firstHalf = splitHTML[0];
                secondHalf = splitHTML[1];

                this.htmlElements.preview.appendChild(document.createTextNode(firstHalf));
                captureEle = captureAttribute(text, 'attr-'+curr.name);
                if ( captureEle) {
                    this.htmlElements.preview.appendChild(captureEle);
                }
                html = secondHalf;
            }

            if ( clone.textContent !== "" ) {
                text = clone.textContent;
                splitHTML = html.split(text);
                firstHalf = splitHTML[0];
                secondHalf = splitHTML[1];

                this.htmlElements.preview.appendChild(document.createTextNode(firstHalf));
                captureEle = captureAttribute(text, 'text');
                if ( captureEle) {
                    this.htmlElements.preview.appendChild(captureEle);
                }

                html = secondHalf;
            }
        } else {
            // get rid of empty class string
            if (html.indexOf(" class=\"\"") !== -1 ) {
                html = html.replace(" class=\"\"", "");
            }
        }

        // append remaining text
        this.htmlElements.preview.appendChild(document.createTextNode(html));
    };

    /*
    takes an element and remove collectjs related classes and shorten text, then returns outerHTML
    */
    function cleanElement(ele){
        ele.classList.remove('queryCheck');
        ele.classList.remove('collectHighlight');
        if ( ele.hasAttribute('src') ) {
            var value = ele.getAttribute('src'),
                query = value.indexOf('?');
            if ( query !== -1 ) {
                value = value.slice(0, query);
            }
            ele.setAttribute('src', value);
        }
        if ( ele.textContent !== "" ) {
            var innerText = ele.textContent.replace(/(\s{2,}|[\n\t]+)/g, ' ');
            if ( innerText.length > 100 ){
                innerText = innerText.slice(0, 25) + "..." + innerText.slice(-25);
            }
            ele.innerHTML = innerText;
        }
        return ele;
    }

    function attributeText(attr) {
        // encode ampersand
        attr.value = attr.value.replace("&", "&amp;");
        return attr.name + "=\"" + attr.value + "\"";
    }

    //wrap an attribute or the text of an html string 
    //(used in #selector_text div)
    function captureAttribute(text, type){
        // don't include empty properties
        if ( text.indexOf('=""') !== -1 ) {
            return;
        }
        var span = noSelectElement("span");
        span.classList.add("capture");
        span.setAttribute("title", "click to capture " + type + " property");
        span.dataset.capture = type;
        span.textContent = text;
        span.addEventListener("click", capturePreview, false);
        return span;
    }

    /*
    if #ruleAttr is set, add .selected class to the matching #ruleHTML .capture span
    */
    function markCapture(){
        var capture = HTML.rule.rule.capture.textContent,
            selector;
        if ( capture !== "") {
            selector = ".capture[data-capture='" + capture + "']";
            document.querySelector(selector).classList.add("selected");
        }
    }

    return Cycle;
})();
