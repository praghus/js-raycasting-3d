
import { CIRCLE } from '../constants'
import Map from './map'
import Player from './player'

export default class Camera {
    public ctx: CanvasRenderingContext2D
    public width: number
    public height: number
    public focal: number
    public scale: number
    public spacing: number
    public distance = 20
    public lightDistance = 8
    public resolution = 320
    
    constructor (public canvas: any) {
        this.ctx = canvas.getContext('2d')
        this.resize()
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize () {
        this.width = this.canvas.width = window.innerWidth * 0.5
        this.height = this.canvas.height = window.innerHeight * 0.5
        this.spacing = this.width / this.resolution
        this.scale = (this.width + this.height) / 1200
        this.focal = this.height / this.width
    }

    render (player: Player, map: Map) {
        this.drawBackground(player, map)
        this.drawColumns(player, map)
        this.drawMinimap(player, map)
        player.draw(this)
    }

    drawBackground (player: Player, map: Map) {
        const { light, assets: { background } } = map
        const width = background.width * (this.height / background.height) * 2
        const left = (player.direction / CIRCLE) * -width
    
        this.ctx.save()
        this.ctx.drawImage(background.image, left, 0, width, this.height)
        if (left < width - this.width) {
            this.ctx.drawImage(background.image, left + width, 0, width, this.height)
        }
        if (light > 0) {
            this.ctx.fillStyle = '#ffffff'
            this.ctx.globalAlpha = light * 0.1
            this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5)
        }
        this.ctx.restore()
    }

    drawColumns (player: Player, map: Map) {
        this.ctx.save()
        for (let column = 0; column < this.resolution; column++) {
            const x = column / this.resolution - 0.5
            const angle = Math.atan2(x, this.focal)
            const ray = map.cast(player, player.direction + angle, this.distance)
            this.drawColumn(column, ray, angle, map)
        }
        this.ctx.restore()
    }

    drawColumn = function (column: any, ray: any, angle: any, map: any) {
        const ctx = this.ctx
        const texture = map.assets.wall
        const left = Math.floor(column * this.spacing)
        const width = Math.ceil(this.spacing)
        let hit = -1
    
        while (++hit < ray.length && ray[hit].height <= 0);
    
        for (let s = ray.length - 1; s >= 0; s--) {
            const step = ray[s]
            if (s === hit) {
                const textureX = Math.floor(texture.width * step.offset)
                const wall = this.project(step.height, angle, step.distance)
    
                ctx.globalAlpha = 1
                ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height)
    
                ctx.fillStyle = '#000'
                ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightDistance - map.light, 0)
                ctx.fillRect(left, wall.top, width, wall.height)
            }
            /* rain * /
            let rainDrops = Math.pow(Math.random(), 10) * s
            const rain = (rainDrops > 0) && this.project(0.1, angle, step.distance)
            ctx.fillStyle = '#fff'
            ctx.globalAlpha = 0.15
            while (--rainDrops > 0) ctx.fillRect(left, Math.random() * rain.top, 1, rain.height)
            /**/
        }
    }

    drawMinimap (player: Player, map: Map) {
        const { width, height } = map
        const ctx = this.ctx
        const scale = 3
        const posX = width * scale
        const posY = this.ctx.canvas.height - 5
        
        ctx.save()
        ctx.globalAlpha = 0.15
        ctx.fillStyle = '#fff'
        for (let y = 0; y < height; y++) {      
            for (let x = 0; x < width; x++) {
                !map.get(x, y) && ctx.fillRect(posX - x * scale, posY - y * scale, scale, scale)
            }
        }
        ctx.globalAlpha = 1
        ctx.fillStyle = '#f00'
        ctx.fillRect(
            scale + posX - Math.ceil(player.x) * scale, 
            scale + posY - Math.ceil(player.y) * scale, 
            scale, scale
        )
        ctx.restore()
    }

    project (height: number, angle: number, distance: number) {
        const z = distance * Math.cos(angle)
        const wallHeight = this.height * height / z
        const bottom = this.height / 2 * (1 + 1 / z)
        return {
            top: bottom - wallHeight,
            height: wallHeight
        }
    }
}