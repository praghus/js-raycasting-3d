import { Asset } from 'd4d-ray-casting'

export default class Bitmap { 
    public image: HTMLImageElement = new Image()
    public width: number
    public height: number 

    constructor (asset: Asset) {
        this.image.src = asset.src
        this.width = asset.width
        this.height = asset.height
    }

    drawClip (
        offset: number, 
        x: number, 
        y: number, 
        w: number, 
        h: number
    ) {
        return (ctx: CanvasRenderingContext2D) => ctx.drawImage(this.image, 
            Math.floor(this.width * offset), 0, 
            1, this.height, 
            x, y, 
            w, h)
    }
}