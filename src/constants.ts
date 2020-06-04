import { StringTMap } from 'd4d-ray-casting'
import { Bitmap } from './lib'

const requireAll = (requireContext: any) => requireContext.keys().map(requireContext)
const allImages = require.context('./assets', true, /.*\.(png|jpg)/)
export const images = requireAll(allImages).reduce(
    (state: any, image: any) => ({ ...state, [image.split('-')[0]]: image }), {}
)

export const CIRCLE = Math.PI * 2

export const ASSETS: StringTMap<Bitmap> = {
    BG: new Bitmap({src: images.bg, width: 2000, height: 750 }),
    WALLS: new Bitmap({src: images.walls, width: 512, height: 512 }),
    WEAPON: new Bitmap({src: images.stick, width: 175, height: 228 })
}


export const KEYS = { 
    37: 'left', 
    38: 'forward', 
    39: 'right', 
    40: 'backward'
}