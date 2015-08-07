function buildUI(controller){
    controller.dispatch = {};

    var holder = d3.select("body").append("div")
        .classed({
            "forager": true,
            "no-select": true
        })
        .html(`<div class="permanent">
                <div id="pageInfo"></div>
                <div id="ui-buttons"></div>
            </div>
            <div class="frame pages">
                <div class="views"></div>
                <div class="page-tree"></div>
            </div>`
        );

    var topbarFns = topbar({
        page: "#pageInfo",
        control: "#ui-buttons"
    });

    

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
        addOptions: function(optionFn, name, options){
            options = options || {};
            // set parent if options made as frame instead of modal
            //options.parent = ???
            controller.dispatch[name] = optionFn(options);
            fns.noSelect();
        },
        addPreview: function(previewFn, name, options){
            options = options || {};
            controller.dispatch[name] = previewFn(options);
        },
        showView: showView,
        setPages: topbarFns.setPages,
        getPage: topbarFns.getPage,
    };

    return fns;
}
