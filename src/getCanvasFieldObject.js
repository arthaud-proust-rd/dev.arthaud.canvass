const CanvasText = require('./CanvasText');
const CanvasImage = require('./CanvasImage');

module.exports = function getCanvasFieldObject(canvas, field) {
    const {type, coords, content, opts} = field;
    console.log(opts);
    const fields = {
        text: CanvasText,
        image: CanvasImage
    };
    return new fields[type](canvas, coords, content, opts || {});
}