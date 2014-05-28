define(['jsmenu',
        './common_enhance',
       'domReady!'
       ], function (jsmenu, comnEnh, document) {

    function createMenuView(){
          var menuView = new jsmenu.JSMenu("View");
          var ck_toolbar = new jsmenu.JSCheckBox("Toolbar",{
             checked: true,
             clickHandler:function(e){
                 if (ck_toolbar.checked) {
                     comnEnh.remClass('toolb','hidden');
                 } else {
                     comnEnh.addClass('toolb','hidden');
                 }
             }
          });
          menuView.add(ck_toolbar);
          var ck_settings = new jsmenu.JSCheckBox("Settings",{
             checked: false,
             clickHandler:function(e){
                 if (ck_settings.checked) {
                     comnEnh.remClass('ccrsettings','hidden');
                 } else {
                     comnEnh.addClass('ccrsettings','hidden');
                 }
             }
          });
          menuView.add(ck_settings);
          return menuView;
    }

    return {
        /**
         * initial configuration
         */
        prepare: function (){

            // adjust menu bar
           var menuContainer1 = document.getElementById("custom_menu_spot");

           var jsMenuBar1 = new jsmenu.JSMenuBar({
                menuBar:{
                    width:"auto",
                    background:"transparent",
                    height:"auto",
                    border:"0px solid #6A8DD9",
                    mozBorderRadius:"0px",
                    webkitBorderRadius:"0px",
                    borderRadius:"0px",
                    padding:"0px 0px",
                    margin:"0 auto"

                },
                rootMenuOut:{
                  height:"1.2em",
                  background:"transparent",
                  lineHeight:"1.2em",
                  padding:"0px",
                  width:"6em",
                  color:"white",
                  textAlign:"center",
                  border:"none",
                  fontSize:"0.9em",
                  fontWeight: "bold"
                },
                rootMenuOver:{
                   background:"transparent",
                   color:"white",
                    width:"6em",
                    borderLeft:"0px solid #aac5f7",
                    borderRight:"0px solid #aac5f7"
                },

                itemMenuOut:{
                    color:"white",
                    fontSize:"0.9em",
                    background:"#f6a828",
                    lineHeight:"normal"
                },
                itemMenuOver:{
                   background:"#f6a828",
                   color:"#383838"
                }

            });

            jsMenuBar1.appendTo(menuContainer1);
            jsMenuBar1.add(createMenuView());
        }
    };

});
