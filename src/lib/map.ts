import Player from './player'

export default class Map {
    public width: number
    public height: number
    public walls: any[] = []

    constructor (data: any) {
        this.height = data.height
        this.width = data.width
        this.walls = data.layers[1].data
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
            const tile = this.get(step.x - dx, step.y - dy)
            return Object.assign(step, {
                tile, 
                height: tile > 0 ? 1 : 0, 
                offset: offset - Math.floor(offset),
                shading: inverted 
                    ? sin < 0 ? 2 : 1
                    : cos < 0 ? 2 : 0
            })
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



