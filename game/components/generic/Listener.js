define([
        'underscore',
        'crafty'
    ],
    function (_, Crafty) {
        Crafty.c('Listener', {
            init: function () {
                return this.listeners = [];
            },
            remove: function () {
                var callback, event, i, len, object, ref, ref1, results;
                ref = this.listeners;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    ref1 = ref[i], object = ref1.object, event = ref1.event, callback = ref1.callback;
                    results.push(object.unbind(event, callback));
                }
                return results;
            },
            listenTo: function (object, event, callback, context) {
                var realCallback;
                if (context == null) {
                    context = this;
                }
                realCallback = function () {
                    return callback.apply(context, arguments);
                };
                this.listeners.push({
                    object: object,
                    event: event,
                    callback: realCallback
                });
                return object.bind(event, realCallback);
            }
        });
    });