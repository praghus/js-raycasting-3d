import { CIRCLE } from '../constants'
import Map from './map'

export default class Player {
    public paces = 0

    constructor (
        public x: number, 
        public y: number, 
        public direction: number
    ) {}

    update (input: any, map: Map, time: number): void {
        if (input.left) this.rotate(-Math.PI * time)
        if (input.right) this.rotate(Math.PI * time)
        if (input.forward) this.walk(2 * time, map)
        if (input.backward) this.walk(-2 * time, map)
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
