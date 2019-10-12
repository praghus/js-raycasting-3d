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
}