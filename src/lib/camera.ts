
import { CIRCLE, ASSETS } from '../constants'
import Map from './map'
import Player from './player'

const shadow = (a: number, c = 0) => `rgba(${c},${c},${c},${a})` 

export default class Camera {
    public ctx: CanvasRenderingContext2D
    public width: number
    public height: number
    public focal: number
    public spacing: number
    public distance = 32
    public brightness = 8
    public resolution = 320
    
    constructor (public canvas: any) {
        this.ctx = canvas.getContext('2d')
        this.resize()
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize () {
        this.width = this.canvas.width = window.innerWidth / 2 
        this.height = this.canvas.height = window.innerHeight / 2
        this.spacing = this.width / this.resolution
        this.focal = this.height / this.width
    }

    render (player: Player, map: Map) {
        this.drawBackground(player)
        this.drawWalls(player, map)
        this.drawMinimap(player, map)
        this.drawWeapon(player)
    }

    drawBackground (player: Player) {
        const background = ASSETS.BG
        const width = background.width * (this.height / background.height) * 2
        const left = (player.direction / CIRCLE) * -width
    
        this.ctx.drawImage(background.image, left, 0, width, this.height)
        if (left < width - this.width) {
            this.ctx.drawImage(background.image, left + width, 0, width, this.height)
        }
    }

    drawWalls (player: Player, map: Map) {
        for (let x = 0; x < this.resolution; x++) {
            const angle = Math.atan2(x / this.resolution - 0.5, this.focal)
            const left = Math.floor(x * this.spacing)
            const width = Math.ceil(this.spacing)
            const ray = map.cast(player, player.direction + angle, this.distance)

            let hit = -1
        
            while (++hit < ray.length && ray[hit].height <= 0);
            for (let s = ray.length - 1; s >= 0; s--) {
                if (s === hit) {
                    const step = ray[s]
                    const z = step.distance * Math.cos(angle)
                    const height = Math.ceil(this.height * step.height / z)
                    const bottom = this.height / 2 * (1 + 1 / z)
                    const top = Math.floor(bottom - height)
                    // this.ctx.fillStyle = '#fff'
                    // this.ctx.fillRect(left, top, width, height)
                    ASSETS.WALLS.drawClip(step, left, top, width, height)(this.ctx)
                    this.ctx.fillStyle = shadow(Math.max((step.distance + step.shading) / this.brightness, 0))
                    this.ctx.fillRect(left, top, width, height)
                }
            }
        }
    }

    drawMinimap (player: Player, map: Map) {
        const { width, height } = map
        const scale = 3
        const posX = width * scale
        const posY = this.ctx.canvas.height - 5
        
        this.ctx.fillStyle = shadow(0.2, 255)
        for (let y = 0; y < height; y++) {      
            for (let x = 0; x < width; x++) {
                map.get(x, y) && this.ctx.fillRect(posX - x * scale, posY - y * scale, scale, scale)
            }
        }
        this.ctx.fillStyle = '#f00'
        this.ctx.fillRect(
            scale + posX - Math.ceil(player.x) * scale, 
            scale + posY - Math.ceil(player.y) * scale, 
            scale, scale
        )
    }

    drawWeapon (player: Player): void {
        const weapon = ASSETS.WEAPON
        const scale =  (this.width + this.height) / 900
        const bobX = Math.cos(player.paces * 2) * scale * 10
        const bobY = Math.sin(player.paces * 4) * scale * 10
        const left = this.width * 0.65 + bobX
        const top = (this.height - weapon.height * scale) + bobY + 12
        this.ctx.drawImage(weapon.image, left, top, weapon.width * scale, weapon.height * scale)
    }
}