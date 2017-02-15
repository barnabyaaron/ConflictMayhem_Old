define([
        'underscore',
        'game/config',
        'store'
    ],
    function (_, config, store) {

        // Setup default settings
        if (_.isUndefined(store.get('DEBUG_MODE'))) {
            store.set("DEBUG_MODE", config.debug);
        }

        return {
            get: function(key) {
                return store.get(key);
            },
            set: function(key, value) {
                store.set(key, value);
            }
        };
    });