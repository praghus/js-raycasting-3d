import { StringTMap } from 'd4d-ray-casting'
import { Bitmap } from './3d'

const requireAll = (requireContext: any) => requireContext.keys().map(requireContext)
const allImages = require.context('./assets', true, /.*\.(png|jpg)/)
const images = requireAll(allImages).reduce(
    (state: any, image: any) => ({ ...state, [image.split('-')[0]]: image }), {}
)

export const CIRCLE = Math.PI * 2

export const ASSETS: StringTMap<Bitmap> = {
    BG: new Bitmap({src: images.bg3, width: 2000, height: 750 }),
    WALL: new Bitmap({src: images.wall4, width: 512, height: 512 }),
    WEAPON: new Bitmap({src: images.stick, width: 175, height: 228 })
}

export const KEYS = { 
    37: 'left', 
    38: 'forward', 
    39: 'right', 
    40: 'backward'
}

export const DUNGEON_CONFIG = {
    'size': [100, 100],
    'seed': Math.random(),
    'rooms': {
        'initial': {
            'min_size': [3, 3],
            'max_size': [4, 4],
            'max_exits': 1
        },
        'any': {
            'min_size': [2, 2],
            'max_size': [5, 5],
            'max_exits': 6
        }
    },
    'max_corridor_length': 6,
    'min_corridor_length': 2,
    'corridor_density': 0.5,
    'symmetric_rooms': false,
    'interconnects': 1,
    'max_interconnect_length': 10,
    'room_count': 32
}