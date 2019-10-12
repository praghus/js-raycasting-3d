import { ASSETS, CIRCLE } from '../constants'
import Bitmap from './bitmap'
import Camera from './camera'
import Map from './map'

export default class Player {
    public weapon: Bitmap = new Bitmap(ASSETS.WEAPON)
    public paces = 0

    constructor (
        public x: number, 
        public y: number, 
        public direction: number
    ) {}

    update (input: any, map: Map, time: number): void {
        if (input.left) this.rotate(-Math.PI * time)
        if (input.right) this.rotate(Math.PI * time)
        if (input.forward) this.walk(3 * time, map)
        if (input.backward) this.walk(-3 * time, map)
    }

    draw (camera: Camera): void {
        const { ctx, width, height, scale } = camera
        const { weapon, paces } = this
        const bobX = Math.cos(paces * 2) * scale * 6
        const bobY = Math.sin(paces * 4) * scale * 6
        const left = width * 0.66 + bobX
        const top = (height - weapon.height * scale) + bobY + 8
        ctx.drawImage(weapon.image, left, top, weapon.width * scale, weapon.height * scale)
    }

    rotate (angle: number): void {
        this.direction = (this.direction + angle + CIRCLE) % (CIRCLE)
    }

    walk (distance: number, map: Map): void {
        const dx = Math.cos(this.direction) * distance
        const dy = Math.sin(this.direction) * distance
        if (map.get(this.x + dx, this.y) <= 0) this.x += dx
        if (map.get(this.x, this.y + dy) <= 0) this.y += dy
        this.paces += distance
    }
}
