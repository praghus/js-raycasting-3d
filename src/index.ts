// import { BOUNDARIES, V, L, POI, getIntersection } from './helpers'

import { Player, Input, Camera, Game, Map } from './models'

const game = new Game()
const map = new Map()
const camera = new Camera(document.getElementById('canvas'))
const player = new Player(map.startPos[0], map.startPos[1], Math.PI * Math.random())
const input = new Input()


game.start((time: number) => {
    // map.update(time)
    player.update(input.states, map, time)
    camera.render(player, map)
})

// const canvas: any = document.getElementById('canvas')
// const ctx: CanvasRenderingContext2D = canvas.getContext('2d')	
// const Plot: V[] = []
// const Mouse: V = {
//     x: canvas.width / 2,
//     y: canvas.height / 2
// }
// canvas.width = window.innerWidth 
// canvas.height = window.innerHeight 
// canvas.onmousemove = (event: MouseEvent) => {
//     Mouse.x = event.clientX
//     Mouse.y = event.clientY
// }

// canvas.onmousedown = (event: MouseEvent) => {
//     if (event.which === 1) {
//         Plot.push(new V(event.clientX, event.clientY))
//         if (Plot.length === 2) {
//             BOUNDARIES.push(new L(Plot[0], Plot[1]))
//             Plot.splice(0, 1)
//         }
//     } 
//     else {
//         Plot.splice(0, Plot.length)
//     }
// }

// function draw () {
//     const intersects = []
//     for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 90) {
//         const ray: L = {
//             a: { x: Mouse.x, y: Mouse.y },
//             b: { x: Mouse.x + Math.cos(angle), y: Mouse.y + Math.sin(angle) }
//         }
//         // Find CLOSEST intersection
//         let closestIntersect: POI = null
//         BOUNDARIES.map((bound) => {
//             const intersect = getIntersection(ray, bound)
//             if (intersect && (!closestIntersect || intersect.p < closestIntersect.p)) {
//                 closestIntersect = intersect
//             }
//         })
//         intersects.push(closestIntersect)
//     }

//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     ctx.strokeStyle = '#000'
//     // draw segments
//     BOUNDARIES.map(({a, b}) => {
//         ctx.beginPath()
//         ctx.moveTo(a.x, a.y)
//         ctx.lineTo(b.x, b.y)
//         ctx.stroke()
//     })
//     // draw rays
//     ctx.strokeStyle = '#f00'
//     ctx.fillStyle = '#f00'
//     intersects.map(({ x, y }) => {
//         // Draw red laser
//         ctx.beginPath()
//         ctx.moveTo(Mouse.x, Mouse.y)
//         ctx.lineTo(x, y)
//         ctx.stroke()
//         // Draw red dot
//         ctx.beginPath()
//         ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
//         ctx.fill()
//     })
// }



// // LOOP
// function drawLoop () {
//     requestAnimationFrame(drawLoop)
//     draw()
// }

// window.onload = drawLoop