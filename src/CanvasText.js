module.exports = class CanvasText {
    constructor(canvas, coords, text, opts) {
        this.canvasObj = canvas;
        this.colors = canvas.colors;
        this.ctx = canvas.ctx;

        this.coords = {
            x: coords.x ?? 0,
            y: coords.y ?? 0,
            r: coords.deg ? (coords.deg%360  * Math.PI / 180): (coords.rad || 0)  // rotation
        }
        this.text = text;

        this.opts = {
            maxWidth: opts.maxWidth ?? false,
            maxHeight: opts.maxHeight ?? false,
            splitWords: opts.splitWords ?? false,
            color: opts.color?(opts.color.startsWith('-')?(canvas.colors[opts.color.slice(1)]??canvas.colors.primary):opts.color):canvas.colors.primary,
            font: {
                size: opts.fontSize ?? 40,
                family: opts.fontFamily ?? 'sans-serif'
            },
            textAlign: opts.textAlign ?? 'left',
            textBaseline: opts.textBaseline ?? 'top',
            lineHeight: opts.lineHeight ?? (function(){return this.font.size*0.25}),
            direction: opts.direction ?? 'ltr'
        }
    }

    async render() {
        if(this.coords.r%360 === 0) {
            this.draw();
        } else {
            this.drawWithRotation();
        }
    }

    draw() {
        if(this.opts.maxWidth) {
            this.splitTextIntoLines()
        } else {
            this.ctx.fillTextWithColor(
                this.opts,
                this.text,
                this.coords.x,
                this.coords.y,
            )
        }
    }

    /**
     * Rotate canvas before draw this field, rotate back when it's done.
     */
    drawWithRotation() {
        this.ctx.rotateFromCenter(this.coords.r);
        this.draw();
        this.ctx.rotateFromCenter(-this.coords.r);
    }

    /**
     * Divide the text of a line into several lines so that the width of the text does not exceed the maximum width.
     */
    splitTextIntoLines() {
        this.ctx.setStyle(this.opts);
        var lines, text;

        for(let i=this.opts.font.size; i>0;i--) {
            lines = [[]];
            text = this.text.replace(/\n/gm, ' \n').split(' ');

            while(text.length > 0) {
                // console.log(lines);
                if(this.ctx.measureText(lines[lines.length -1]+' '+text[0]).width <= this.opts.maxWidth) {
                    if(text[0] === '\n') {
                        lines[lines.length-1] = lines[lines.length-1].join(' ');
                        text.splice(0,1)
                        lines.push('');
                        lines.push([]);
                    } else {
                        lines[lines.length-1].push(text.splice(0,1)[0]);
                    }
                } else {
                    lines[lines.length-1] = lines[lines.length-1].join(' ');
                    lines.push([]);
                }
            }
            break;
        }
        
        lines[lines.length-1] = lines[lines.length-1].join(' ');

        
        // console.log(text);
        this.lines = lines;
        this.renderLines();
    }

    /**
     * Render each line of the canvas field.
     */
    renderLines() {
        this.lines.forEach( (line, i)=>{
            this.ctx.fillTextWithColor(
                this.opts,
                line,
                this.coords.x,
                this.coords.y+i*this.opts.font.size+10,
            )
        })
    }
}
