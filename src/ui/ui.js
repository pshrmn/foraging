function buildUI(controller){
    controller.dispatch = {};

    var holder = d3.select("body").append("div")
        .classed({
            "forager": true,
            "no-select": true
        })
        .html('<div class="permanent">' +
                '<div id="schemaInfo"></div>' +
                '<div id="foragerAlert"></div>' +
                '<div id="ui-buttons">' +
                    '<div id="min-forager">-</div>' +
                    '<div id="close-forager">&times;</div>' +
                '</div>' +
            '</div>' +
            '<div class="views page-divs"></div>' + 
            '<div class="page-tree page-divs"></div>'
        );
    var divs = d3.selectAll(".page-divs");
    var hidden = false;
    var events = {
        minMax: function() {
            hidden = !hidden;
            this.textContent = hidden ? "+" : "-";
            divs.classed("hidden", hidden);
        },
        close: function(){
            holder.remove();
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

    var minmax = d3.select("#min-forager")
        .on("click", events.minMax);

    var closer = d3.select("#close-forager")
        .on("click", events.close);

    var viewHolder = holder.select(".views");
    var views = {};
    var activeView;

    function showView(name){
        if ( activeView ) {
            activeView.classed("active", false);
        }
        activeView = views[name];
        activeView.classed("active", true);
    }

    var fns = {
        // make sure that all elements in the forager ui are .no-select
        noSelect: function(){
            holder.selectAll("*")
                .classed("no-select", true);
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
            var v = viewHolder.append("div")
                .classed({
                    "view": true,
                    "active": active
                });
 
            views[name] = v;
            if ( active ) {
                activeView = v;
            }

            options.view = v;
            controller.dispatch[name] = viewFn(options);
        },
        addTree: function(treeFn, name, options){
            options = options || {};
            options.view = d3.select(".page-tree");
            options.width = 500;
            options.height = 220;
            options.margin = {
                top: 5,
                right: 15,
                bottom: 5,
                left: 50
            };
            controller.dispatch[name] = treeFn(options);
            fns.noSelect();
        },
        showView: showView,
        setPages: topbarFns.setPages,
        getPage: topbarFns.getPage,
    };

    return fns;
}
