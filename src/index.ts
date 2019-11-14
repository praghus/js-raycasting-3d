/* 2D examples */
// import { drawLoop } from './2d'
// window.onload = drawLoop

/* 3D examples */
import { Player, Input, Camera, Game, Map } from './3d'

const game = new Game()
const map = new Map()
const camera = new Camera(document.getElementById('canvas'))
const player = new Player(map.startPos[0], map.startPos[1], Math.PI * Math.random())
const input = new Input()

game.start((time: number) => {
    player.update(input.states, map, time)
    camera.render(player, map)
})