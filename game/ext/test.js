define(function () {
    return (function() {
        function testExt() {}

        testExt.prototype.print = function(text) {
            console.log(text);
        };

        return testExt;
    })();
});