var Game,
  indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Game = this.Game;

Game.Synchronizer = (function () {
    function Synchronizer() {
        this.entities = [];
        this.synchronizations = {};
        this.onceTriggers = [];
    }

    Synchronizer.prototype.registerEntity = function (entity) {
        if (indexOf.call(this.entities, entity) < 0) {
            this.entities.push(entity);
        }
        return entity;
    };

    Synchronizer.prototype.unregisterEntity = function (entity) {
        var index;
        index = _.indexOf(this.entities, entity);
        if (index >= 0) {
            this.entities.splice(index, 1);
        }
        this._verifyActiveSynchronisations();
        return entity;
    };

    Synchronizer.prototype.synchronizeOn = function (name, entity) {
        var synchronization;
        synchronization = this.synchronizations[name];
        if (!synchronization) {
            synchronization = {
                defer: WhenJS.defer(),
                registered: []
            };
            this.synchronizations[name] = synchronization;
        }
        if (indexOf.call(synchronization.registered, entity) < 0) {
            synchronization.registered.push(entity);
        }
        if (_.difference(this.entities, synchronization.registered).length === 0) {
            synchronization.defer.resolve();
        }
        return synchronization.defer.promise;
    };

    Synchronizer.prototype.allowOnce = function (name) {
        if (this.onceTriggers.indexOf(name) === -1) {
            this.onceTriggers.push(name);
            return true;
        } else {
            return false;
        }
    };

    Synchronizer.prototype._verifyActiveSynchronisations = function () {
        var name, ref, results, sync;
        ref = this.synchronizations;
        results = [];
        for (name in ref) {
            sync = ref[name];
            if (_.difference(this.entities, sync.registered).length === 0) {
                results.push(sync.defer.resolve());
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    return Synchronizer;

})();