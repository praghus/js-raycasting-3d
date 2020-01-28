
import tiledMap from './assets/map/map.tmx'
import { tmx } from 'tmx-tiledmap'
import { Player, Input, Camera, Game, Map } from './lib'
const game = new Game()
const map = new Map()
const camera = new Camera(document.getElementById('canvas'))
const player = new Player(map.startPos[0], map.startPos[1], Math.PI * Math.random())
const input = new Input()

// loader here
tmx(tiledMap).then((data) => {
    console.info(data)
})


game.start((time: number) => {
    player.update(input.states, map, time)
    camera.render(player, map)
})