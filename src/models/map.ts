import { ASSETS, DUNGEON_CONFIG } from '../constants'
import Bitmap from './bitmap'
import Player from './player'

/* eslint-disable @typescript-eslint/no-var-requires */
const DungeonGenerator = require('dungeon-generator')
const dungeon = new DungeonGenerator(DUNGEON_CONFIG)

export default class Map {
    public width: number
    public height: number
    public light = 0
    public startPos: any
    public walls: any[] = []
    public assets = {
        background: new Bitmap(ASSETS.BG),
        wall: new Bitmap(ASSETS.WALL)
    } 

    constructor () {
        dungeon.generate()
        this.startPos = dungeon['start_pos']
        this.height = dungeon.walls.rows.length
        this.width = dungeon.walls.rows[0].length
        for (const row of dungeon.walls.rows) {
            this.walls = this.walls.concat(row)
        }
        // this.walls = new Uint8Array(this.width * this.height)
        // for (let i = 0; i < this.width * this.height; i++) {
        //     this.walls[i] = Math.random() < 0.3 ? 1 : 0
        // }
    }
    
    update (time: number) {
        if (this.light > 0) this.light = Math.max(this.light - 10 * time, 0)
        else if (Math.random() * 5 < time) this.light = 2
    }

    get (x: number, y: number): number {
        [x, y] = [Math.floor(x), Math.floor(y)]
        if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) return -1
        return this.walls[x + this.width * y]
    }

    cast (origin: Player, angle: number, range: number) {
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        const getIntersection = (step: any, inverted = false): any => {
            const [ x, y, rise, run ] = inverted 
                ? [ step.y, step.x, cos, sin ] 
                : [ step.x, step.y, sin, cos ]
            if (run === 0) return { len2: Infinity }
            const dx = run > 0 
                ? Math.floor(x + 1) - x 
                : Math.ceil(x - 1) - x
            const dy = dx * (rise / run)
            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                len2: dx * dx + dy * dy,
                distance: step.distance + Math.sqrt(dx * dx + dy * dy)
            }
        }
    
        const check = (step: any, inverted = false): any => {
            const dx = cos < 0 && !inverted ? 1 : 0
            const dy = sin < 0 && inverted ? 1 : 0
            const offset = inverted ? step.x : step.y
            step.height = this.get(step.x - dx, step.y - dy)
            step.offset = offset - Math.floor(offset) 
            step.shading = inverted 
                ? sin < 0 ? 2 : 1
                : cos < 0 ? 2 : 0
            return step
        }

        const ray = (step: any): any => {
            const [stepX, stepY] = [getIntersection(step), getIntersection(step, true)]
            const nextStep = stepX.len2 < stepY.len2
                ? check(stepX)
                : check(stepY, true)
            return nextStep.distance > range
                ? [step]
                : [step].concat(ray(nextStep))
        }

        return ray({ x: origin.x, y: origin.y, height: 0, distance: 0 })
    }
}



