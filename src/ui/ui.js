function buildUI(controller){
    controller.dispatch = {};

    // ugly, might want to convert to d3 since everything else uses it, but it works
    var holder = document.createElement("div");
    holder.classList.add("collectorjs");
    holder.classList.add("no-select");
    holder.innerHTML = '<div class="permanent">' +
            '<div id="schemaInfo"></div>' +
            '<div id="collectAlert"></div>' +
            '<div id="closeCollectjs">&times;</div>' +
        '</div>' +
        '<div class="views"></div>' + 
        '<div class="page-tree"></div>';
    document.body.appendChild(holder);

    var events = {
        close: function(){
            holder.parentElement.removeChild(holder);
            document.body.style.marginBottom = initialMargin;
            controller.close();
        }
    };

    var existingStyle = getComputedStyle(document.body);
    var initialMargin = existingStyle.marginBottom;
    document.body.style.marginBottom = "500px";

    var topbarFns = topbar({
        holder: "#schemaInfo"
    });

    var closer = d3.select("#closeCollectjs")
        .on("click", events.close);

    var viewHolder = holder.querySelector(".views");
    var views = {};
    var activeView;

    function showView(name){
        if ( activeView ) {
            activeView.classList.remove("active");
        }
        activeView = views[name];
        activeView.classList.add("active");
    }

    var fns = {
        // make sure that all elements in the collectjs have the no-select class
        noSelect: function(){
            var all = holder.querySelectorAll("*");
            for ( var i=0; i<all.length; i++ ) {
                all[i].classList.add("no-select");
            }
        },
        addViews: function(views){
            var fn = this.addView;
            var _this = this;
            views.forEach(function(view){
                fn.apply(_this, view);
            });
            fns.noSelect();
        },
        addView: function(viewFn, name, options, active){
            options = options || {};

            // create a new view
            var v = document.createElement("div");
            v.classList.add("view");
            views[name] = v;
            viewHolder.appendChild(v);

            if ( active ) {
                v.classList.add("active");
                activeView = v;
            }

            options.holder = v;
            controller.dispatch[name] = viewFn(options);
        },
        addTree: function(treeFn, name, options){
            options = options || {};
            controller.dispatch[name] = treeFn(options);

        },
        showView: showView,
        setPages: topbarFns.setPages,
        getPage: topbarFns.getPage,
    };

    return fns;
}
