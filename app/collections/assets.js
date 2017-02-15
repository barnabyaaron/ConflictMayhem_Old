define([
        'underscore',
        'backbone',
        'models/asset',
        'game/assets'
    ],
    function(_, Backbone, Asset, assetsData) {
        var Assets = Backbone.Collection.extend({
            model: Asset,
            findByScene: function(scene) {
                return this.filter(function (model) {
                    return _.contains(model.get("scenes"), scene);
                });
            },
            loadAssets: function(assets, callback, callbackProgress) {
                var callbacks = {
                    onLoad: callback || function () { },
                    onProgress: callbackProgress || function (e) { },
                    onError: function (e) { }
                }

                var loadObject = {};

                _.every(assets,
                    function (asset) {
                        loadObject = _.extend(loadObject, asset.get("data"));
                    });

                if (_.isEmpty(loadObject)) {
                    return callbacks.onLoad();
                }

                Crafty.load(loadObject,
                    function () {
                        _.invoke(assets, 'onLoaded');
                        callbacks.onLoad();
                    },
                    function (e) {
                        callbacks.onProgress();
                    },
                    function (e) {
                        callbacks.onError();
                    }
                );
            },
            loadByScene: function(scene, callback) {
                var assets = this.findByScene(scene);
                this.loadAssets(assets, callback);
            },
            loadAllAssets: function (callback, callbackProgress) {
                var assets = this.filter(true); // Get All Assets
                this.loadAssets(assets, callback, callbackProgress);
            }
        });

        return new Assets(assetsData);
    });