define(function () {

    return {
        prepare: function() {
            if (!window.ccr_singleton) {
                window.ccr_singleton = {
                    settDlg: undefined,
                    tbDlg: undefined,
                    itEdDlg: undefined,
                    canvas: undefined
                };
            }
        },

        settingsDialog: function() {
            return window.ccr_singleton.settDlg;
        },
        toolbarDialog: function() {
            return window.ccr_singleton.tbDlg;
        },
        itemEditorDialog: function() {
            return window.ccr_singleton.itEdDlg;
        },
        canvas: function() {
            return window.ccr_singleton.canvas;
        },

        setSettingsDialog: function(new_val) {
            window.ccr_singleton.settDlg = new_val;
        },
        setToolbarDialog: function(new_val) {
            window.ccr_singleton.tbDlg = new_val;
        },
        setItemEditorDialog: function(new_val) {
            window.ccr_singleton.itEdDlg = new_val;
        },
        setCanvas: function(new_val) {
            window.ccr_singleton.canvas = new_val;
        },

        setAll: function(new_sett, new_tb, new_ited) {
            window.ccr_singleton.settDlg = new_sett;
            window.ccr_singleton.tbDlg = new_tb;
            window.ccr_singleton.itEdDlg = new_ited;
        }
    }

})
