function buildUI(controller){
    var holder = document.createElement("div");
    holder.classList.add("collectjs");
    holder.classList.add("noSelect");
    document.body.appendChild(holder);
    holder.innerHTML = '<div class="tabHolder">' +
            '<div class="tabs">' +
            '</div>' +
        '</div>' +
        '<div class="permanent">' +
            '<div id="schemaInfo"></div>' +
            '<div id="collectAlert"></div>' +
        '</div>' +
        '<div class="views">' +
            '<div class="view" id="emptyView"></div>' +
        '</div>';

    var tabHolder = holder.querySelector(".tabs");
    var viewHolder = holder.querySelector(".views");

    var topbarFns = topbar({
        holder: "#schemaInfo"
    });

    var tabs = {};
    var views = {};

    controller.dispatch = {};

    var activeTab;
    var activeView;

    function showView(name){
        if ( activeTab ) {
            activeTab.classList.remove("active");
        }
        if ( activeView ) {
            activeView.classList.remove("active");
        }
        activeTab = tabs[name];
        activeView = views[name];
        activeTab.classList.add("active");
        activeView.classList.add("active");
    }

    return {
        // make sure that all elements in the collectjs have the noSelect class
        noSelect: function(){
            var all = holder.querySelectorAll("*");
            for ( var i=0; i<all.length; i++ ) {
                all[i].classList.add("noSelect");
            }
        },
        addViews: function(views){
            var fn = this.addView;
            var _this = this;
            views.forEach(function(view){
                fn.apply(_this, view);
            });
            this.noSelect();
        },
        addView: function(viewFn, name, options, active){
            options = options || {};

            // create a new tab
            var t = document.createElement("div");
            t.classList.add("tab");
            t.textContent = name;
            tabs[name] = t;
            tabHolder.appendChild(t);

            // create a new view
            var v = document.createElement("div");
            v.classList.add("view");
            views[name] = v;
            viewHolder.appendChild(v);

            if ( active ) {
                t.classList.add("active");
                v.classList.add("active");
                activeTab = t;
                activeView = v;
            }

            options.holder = v;
            controller.dispatch[name] = viewFn(options);
        },
        showView: showView,
        setUrl: topbarFns.setUrl,
        toggleUrl: topbarFns.toggleUrl,
        setPages: topbarFns.setPages,
        getPage: topbarFns.getPage,
    };
}
