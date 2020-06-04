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
        step: any,
        x: number, 
        y: number, 
        w: number, 
        h: number
    ) {
        const { tile, offset } = step
        const posX = ((tile - 1) % 4) * this.width
        const posY = (Math.ceil(((tile - 1) + 1) / 4) - 1) * this.height
        return (ctx: CanvasRenderingContext2D) => ctx.drawImage(this.image, 
            posX + Math.floor(this.width * offset), posY, 
            1, this.height, 
            x, y, 
            w, h)
    }
}