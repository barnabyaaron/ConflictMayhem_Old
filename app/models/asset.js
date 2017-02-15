define([
        'underscore',
        'backbone'
    ],
    function(_, Backbone) {
        var Asset = Backbone.Model.extend({
            defaults: {
                loaded: false,
                data: {}
            },
            initialize: function() { },
            onLoaded:function() {
                return this.set({ loaded: true });
            }
        });

        return Asset;
    });