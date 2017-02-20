var Game, level, script, scriptName;

level = null;

script = null;

scriptName = null;

Game = this.Game;

Crafty.defineScene('Game', function (data) {
    var checkpointsPassed, executeScript, label, options, ref, ref1, startScript, wait;
    if (data == null) {
        data = {};
    }
    Game.backgroundColor = null;
    level = Game.levelGenerator.createLevel();
    Crafty.createLayer('UILayerDOM', 'DOM', {
        scaleResponse: 0,
        yResponse: 0,
        xResponse: 0,
        z: 40
    });
    Crafty.createLayer('UILayerWebGL', 'WebGL', {
        scaleResponse: 0,
        yResponse: 0,
        xResponse: 0,
        z: 35
    });
    Crafty.createLayer('StaticBackground', 'WebGL', {
        scaleResponse: 0,
        yResponse: 0,
        xResponse: 0,
        z: 0
    });
    wait = Game.levelGenerator.loadAssets(['explosion']).then((function (_this) {
        return function () {
            var d, e;
            d = WhenJS.defer();
            e = Crafty.e('WebGL, explosion');
            setTimeout(function () {
                e.destroy();
                return d.resolve();
            }, 100);
            return d.promise;
        };
    })(this));
    level.start();
    Crafty('Player').each(function () {
        return this.level = level;
    });
    options = {
        startAtCheckpoint: (ref = data.checkpoint) != null ? ref : 0
    };
    startScript = (ref1 = data != null ? data.script : void 0) != null ? ref1 : 'Stage1';
    if (data.checkpoint) {
        label = "Checkpoint " + data.checkpoint;
        if (typeof window.ga === "function") {
            window.ga('send', 'event', 'Game', 'CheckpointStart', label);
        }
    } else {
        label = 'Begin';
        if (typeof window.ga === "function") {
            window.ga('send', 'event', 'Game', 'Start', label);
        }
    }
    executeScript = function (name, options) {
        var scriptClass;
        scriptName = name;
        scriptClass = Game.Scripts[name];
        if (scriptClass == null) {
            console.error("Script " + name + " is not defined");
            return;
        }
        script = new scriptClass(level);
        return script.run(options).then(function () {
            return Crafty.trigger('ScriptFinished', script);
        })["catch"](function (e) {
            if (e.message !== 'sequence mismatch') {
                throw e;
            }
        });
    };
    checkpointsPassed = 0;
    Crafty.bind('ScriptFinished', function (script) {
        var checkpoint;
        checkpoint = Math.max(0, script.startAtCheckpoint - script.currentCheckpoint);
        checkpointsPassed += script.currentCheckpoint;
        if (script.nextScript) {
            return executeScript(script.nextScript, {
                startAtCheckpoint: checkpoint
            });
        } else {
            if (script.gotoGameOver) {
                Crafty.enterScene('GameOver', {
                    gameCompleted: true
                });
            }
            return console.log('End of content!');
        }
    });
    wait.then(function () {
        return executeScript(startScript, options);
    });
    Crafty.bind('GameOver', function () {
        window.ga('send', 'event', 'Game', 'End', "Checkpoint " + script.currentCheckpoint);
        return Crafty.enterScene('GameOver', {
            checkpoint: checkpointsPassed + script.currentCheckpoint,
            script: startScript
        });
    });
    return new Game.PauseMenu;
}, function () {
    script.end();
    level.stop();
    Crafty('Player').each(function () {
        return this.removeComponent('ShipSpawnable');
    });
    Crafty.unbind('GameOver');
    Crafty.unbind('ScriptFinished');
    return Crafty.unbind('GamePause');
});