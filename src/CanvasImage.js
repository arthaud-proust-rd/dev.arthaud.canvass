const { Image } = require('canvas')
module.exports = class CanvasField {
    constructor(canvas, coords, imgSrc, opts) {
        this.canvasObj = canvas;
        this.colors = canvas.colors;
        this.ctx = canvas.ctx;

        this.coords = {
            x: coords.x ?? 0,
            y: coords.y ?? 0,
            r: coords.deg ? (coords.deg%360  * Math.PI / 180): (coords.rad ?? 0)  // rotation
        }
        this.imgSrc = imgSrc;

        this.opts = {
            w: opts.w,
            h: opts.h,
            // maxWidth: opts.maxWidth ?? false,
            // maxHeight: opts.maxHeight ?? false,
            preserveRatio: opts.preserveRatio ?? true,
            originAtCenter: opts.originAtCenter ?? false,
            fromCenter: opts.fromCenter ?? false,

        }
    }

    render() {
        return new Promise((resolve, reject)=>{
            this.loadImage()
            .then(()=>{
                if(this.coords.r%360 === 0) {
                    this.draw();
                } else {
                    this.drawWithRotation();
                }
                resolve();
            })
        });
    }

    loadImage() {
        return new Promise((resolve, reject)=>{
            try {
                this.image = new Image();
                this.image.onload = resolve;
                this.image.onerror = reject;
                this.image.src = this.imgSrc;
            } catch(e) {
                reject(e);
            }
        })
    }

    /**
     * Return the maximum size possible
     * @param {Number} maxSize 
     * @param {Number} otherSize 
     * @returns {Number} The maximum size possible
     */
    maxSize(maxSize, otherSize) {
        return (maxSize && maxSize < otherSize) ? maxSize : otherSize;
    }

    draw() {
        console.log(this.coords);

        // ratio of the loaded image
        const ratio = this.image.width / this.image.height;
        // ratio > 1  <=>  width > height  <=>  ▐ 
        // ratio = 1  <=>  width = height  <=>  ▬
        // ratio < 1  <=>  width < height  <=>  ■


        // handle the ratio
        if(this.opts.preserveRatio) {
            
            if(this.opts.h && !this.opts.w) // if we only have height
                this.opts.w = this.opts.h * ratio;
            
            if (this.opts.w && !this.opts.h) // if we only have only width
                this.opts.h = this.opts.w / ratio;

            if (this.opts.w && this.opts.h) { // if we have both of them
                if(ratio < 1) { // look like ▐ 
                    this.opts.w = this.opts.h * ratio;
                } 
                
                if(ratio > 1) { // look like ▬
                    this.opts.h = this.opts.w / ratio;
                }
            }

            if (!this.opts.w && !this.opts.h) { // if we have both of them
                this.opts.h = this.image.height;
                this.opts.w = this.image.width;
            }

        } else {

            // if dimensions are not specified the image conserve his size.
            if(this.opts.h === undefined)
                this.opts.h = this.image.height;

            if(this.opts.w === undefined)
                this.opts.w = this.image.width;

        }

        
        
        // place image from the center of the canvas
        if(this.opts.fromCenter) {
            this.coords.x += this.canvasObj.width/2;
            this.coords.y += this.canvasObj.height/2;
        }

        console.log(this.coords);


        this.ctx.drawImage(
            this.image,
            this.opts.originAtCenter ? this.coords.x-this.opts.w/2 : this.coords.x,
            this.opts.originAtCenter ? this.coords.y-this.opts.h/2 : this.coords.x,
            this.opts.w,
            this.opts.h
        )
        console.log('img drawed');
    }

    /**
     * Rotate canvas before draw this image, rotate back when it's done.
     */
    drawWithRotation() {
        this.ctx.rotateFromCenter(this.coords.r);
        this.draw();
        this.ctx.rotateFromCenter(-this.coords.r);
    }
}
