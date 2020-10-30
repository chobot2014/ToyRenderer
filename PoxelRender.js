var Rotation = /** @class */ (function () {
    function Rotation(_a) {
        var x = _a.x, y = _a.y, z = _a.z;
        this._x = x;
        this._y = y;
        this._z = z;
    }
    Object.defineProperty(Rotation.prototype, "x", {
        get: function () {
            return this._x * (Math.PI / 180);
        },
        set: function (valueInDegrees) {
            this._x = valueInDegrees;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rotation.prototype, "y", {
        get: function () {
            return this._y * (Math.PI / 180);
        },
        set: function (valueInDegrees) {
            this._y = valueInDegrees;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rotation.prototype, "z", {
        get: function () {
            return this._z * (Math.PI / 180);
        },
        set: function (valueInDegrees) {
            this._z = valueInDegrees;
        },
        enumerable: false,
        configurable: true
    });
    return Rotation;
}());
;
function displayRotatingObject(points, height, width, renderPoint, clearScreen) {
    function drawObject(points) {
        var DISTANCE_FROM_CAMERA = 1000;
        var FOV = 150;
        var ASPECT_RATIO = (width / height);
        function transformPoint(_a) {
            // do the initial transformation
            // field of view in half, it's a right triangle
            // tan a = opposite / adj 
            // we can set adj to 1 so that it falls out of the equation (we only care about the ratio so it should be the same answer for 1 as any other number)
            // tan (FOV/2) = opposite / 1 or just opposite = tan (FOV/2) or tan(FOV/2) = ScalingCoefficientIfYouWantItToBeTheFartherAwayThingsAreTheBiggerTheyAre
            // obviously that's wrong, but we do that to encode the relationship between field of view and distance (good for both x and y)
            // we want the exact opposite, the farther away you are from it the smaller it seems to you
            // if you take (1 / something) it's the opposite of something
            // so we say: firstTransformedX= (1/tan(FOV/2)) * x; firstTransformedY = (1/tan(FOV/2)) * y;
            var x = _a.x, y = _a.y, z = _a.z;
            var ret = {
                x: (x * (1 / Math.tan(FOV / 2))),
                y: (y * (1 / Math.tan(FOV / 2)))
            };
            // transform x by the aspect ratio
            ret.x *= ASPECT_RATIO;
            // in case we need the z value 
            // ret.z = z * (ZFAR/(ZFAR-ZNEAR)) - ((ZFAR*ZNEAR)/(ZFAR-ZNEAR));      
            if (z !== 0) {
                ret.y /= (z - DISTANCE_FROM_CAMERA);
                ret.x /= (z - DISTANCE_FROM_CAMERA);
            }
            // transform the origin point to be in the center of the screen
            // instead of the default top left
            ret.x += width / 2;
            ret.y += height / 2;
            return ret;
        }
        var transformedPoints = points.map(function (cPoint) { return transformPoint(cPoint); });
        transformedPoints.forEach(function (tPoint) { return renderPoint(tPoint.x, tPoint.y); });
    }
    var rotateObject = function (objectIn, rotation) {
        for (var _i = 0, objectIn_1 = objectIn; _i < objectIn_1.length; _i++) {
            var point = objectIn_1[_i];
            // x axis transformation
            point.y = point.y * Math.cos(rotation.x) - point.z * Math.sin(rotation.x);
            point.z = point.y * Math.sin(rotation.x) + point.z * Math.cos(rotation.x);
            // y axis transformation
            point.x = point.x * Math.cos(rotation.y) + point.z * Math.sin(rotation.y);
            point.z = point.z * Math.cos(rotation.y) - point.x * Math.sin(rotation.y);
            // z axis transformation
            point.x = point.x * Math.cos(rotation.z) - point.y * Math.sin(rotation.z);
            point.y = point.x * Math.sin(rotation.z) + point.y * Math.cos(rotation.z);
        }
    };
    clearScreen();
    drawObject(points);
    setInterval(function () {
        rotateObject(points, new Rotation({ x: 0, y: 3, z: 0 }));
        clearScreen();
        drawObject(points);
    }, 100);
}
