
import { tmx } from 'tmx-tiledmap'
import { images } from './constants'
import { Player, Input, Camera, Game, Map } from './lib'
import tiledMap from './assets/map/map.tmx'

const canvas: any = document.getElementById('canvas')
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

tmx(tiledMap).then((data: any) => {
    const game = new Game()
    const map = new Map(data)
    const camera = new Camera(canvas)
    const player = new Player(2.5, 1.5, Math.PI * 0.5)
    const input = new Input()
    
    const loadedImages: any[] = []
    let loadedCount = 0
    
    Object.keys(images).map((key) => {
        loadedImages[key] = new Image()
        loadedImages[key].src = images[key]
        loadedImages[key].addEventListener('load', () => {
            if (++loadedCount === Object.keys(images).length) {
                game.start((time: number) => {
                    player.update(input.states, map, time)
                    camera.render(player, map)
                })
            }
            else {
                ctx.font = '30px Arial'
                ctx.fillStyle = '#fff'
                ctx.textAlign = 'center'
                ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2)
            }
        })
    })
})

