const { createCanvas, loadImage } = require('canvas')
const getCanvasFieldObject = require('./getCanvasFieldObject');

module.exports = class CanvasManager {
    constructor(opts, fields) {
        String.prototype.capitalize = function() {return this.charAt(0).toUpperCase() + this.slice(1)}

        this.default = {
            height: 500,
            width: 500,
            colors: {
                background: "#ffffff",
                primary: "#0d0d0e",
                secondary: "#e5f0a2"
            }
        }

        this.height = opts.height ?? this.default.size.height;
        this.width = opts.width ?? this.default.size.width;
        this.colors = {
            ...this.default.colors,
            ...opts.colors
        }
        this.parallelRender = opts.parallelRender ?? false;
        
        this.init();

        this.fields = fields;
    }

    async renderFields() {
        if(this.parallelRender) {
            // parallel
            await Promise.all(
                this.fields.map(async field => {
                    await (getCanvasFieldObject(
                        this, 
                        field
                    )).render();
                })
            );
        } else {
            for (const field of this.fields) {
                await (getCanvasFieldObject(
                    this, 
                    field
                )).render();
            }
        }
    }

    init() {
        this.canvas = createCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d')
        console.log(this.ctx);
        
        this.defineCtxFn();

        this.ctx.fillRectWithColor(this.colors.background, 0, 0, this.width, this.height)
    }


    /** 
     * Define shorthand functions for context Object
    */ 
    defineCtxFn() {
        function rotateFromCenter(angle) {
            this.translate(
                this.canvas.width/2,
                this.canvas.height/2
            );
            this.rotate(angle);
            this.translate(
                -this.canvas.width/2,
                -this.canvas.height/2
            );
        }
        this.ctx.rotateFromCenter = rotateFromCenter;

        function setStyle(opts) {
            this.fillStyle = opts.color;
            this.font = `${opts.font.size}px ${opts.font.family}`;
            this.textAlign = opts.textAlign;
            this.textBaseline = opts.textBaseline;
            this.direction = opts.direction;
        }
        this.ctx.setStyle = setStyle;

        function fillRectWithColor(color, ...coords) {
            this.fillStyle = color;
            this.fillRect(...coords)
        }
        this.ctx.fillRectWithColor = fillRectWithColor;

        function fillTextWithColor(opts, text, x, y, ...args) {
            this.setStyle(opts);
            this.fillText(text, x, y, ...args)
        }
        this.ctx.fillTextWithColor = fillTextWithColor;
    }

    /**
     * Get canvas image
     * @returns {String} Data url jpeg image
     */
    async image() {
        await this.renderFields();
        return this.canvas.toDataURL('image/jpeg');
    }

    /**
     * Get canvas image
     * @returns {Buffer} Jpeg image buffer.
     */
    async buffer() {
        await this.renderFields();
        return this.canvas.toBuffer('image/jpeg');
    }
}