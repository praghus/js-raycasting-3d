class V {
    constructor (
        public x: number, 
        public y: number
    ) {}
}

class L {
    constructor (
        public a: V,
        public b: V
    ) {}
}

class POI {
    constructor (
        public x: number,
        public y: number,
        public len: number,
        public angle?: number
    ) {}
}

const canvas: any = document.getElementById('canvas')
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')	
const Mouse: V = { x: canvas.width / 2, y: canvas.height / 2 }
const Plot: V[] = []

const w = canvas.width = window.innerWidth 
const h = canvas.height = window.innerHeight 

const Boundaries = [
    new L(new V(0, 0), new V(w, 0)),
    new L(new V(w, 0), new V(w, h)),
    new L(new V(w, h), new V(0, h)),
    new L(new V(0, h), new V(0, 0))
]

canvas.onmousemove = (event: MouseEvent) => {
    Mouse.x = event.clientX
    Mouse.y = event.clientY
}

canvas.onmousedown = (event: MouseEvent) => {    
    Plot.push(new V(event.clientX, event.clientY))
    if (Plot.length === 2) {
        Boundaries.push(new L(Plot[0], Plot[1]))
        Plot.splice(0, Plot.length)
    }
}

function getIntersection (ray: L, boundary: L): POI {
    const raX = ray.a.x
    const raY = ray.a.y
    const rbX = ray.b.x - ray.a.x
    const rbY = ray.b.y - ray.a.y

    const baX = boundary.a.x
    const baY = boundary.a.y
    const bbX = boundary.b.x - boundary.a.x
    const bbY = boundary.b.y - boundary.a.y

    const rMag = Math.sqrt(rbX * rbX + rbY * rbY)
    const sMag = Math.sqrt(bbX * bbX + bbY * bbY)
    if (rbX / rMag === bbX / sMag && rbY / rMag === bbY / sMag) {
        return null
    }
    const T2 = (rbX * (baY - raY) + rbY * (raX - baX)) / (bbX * rbY - bbY * rbX)
    const T1 = (baX + bbX * T2 - raX) / rbX

    if (T1 < 0 || T2 < 0 || T2 > 1) return null

    return new POI(raX + rbX * T1, raY + rbY * T1, T1)
}

export function calculate () {
    const points = [].concat(...Boundaries.map(({a, b}) => ([a, b])).map((p) => p))
    const uniqueAngles = [].concat(...points.map((p) => {
        p.angle = Math.atan2(p.y - Mouse.y, p.x - Mouse.x)
        return [p.angle - 0.00001, p.angle, p.angle + 0.00001]
    }))
    
    const intersects = []

    //for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 90) {
    for (const angle of uniqueAngles) {
        const ray: L = {
            a: { x: Mouse.x, y: Mouse.y },
            b: { x: Mouse.x + Math.cos(angle), y: Mouse.y + Math.sin(angle) }
        }
        // Find closest intersection
        let closestIntersect: POI = null
        Boundaries.map((bound) => {
            const intersect = getIntersection(ray, bound)
            if (intersect && (!closestIntersect || intersect.len < closestIntersect.len)) {
                closestIntersect = intersect
            }
        })
        if (!closestIntersect) continue
        closestIntersect.angle = angle

        intersects.push(closestIntersect)
    }
    // Sort by angle
    return intersects.sort((a, b) => a.angle - b.angle)
}

function draw (intersects: POI[]) {
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // gradient
    const grd = ctx.createRadialGradient(Mouse.x, Mouse.y, 0, Mouse.x, Mouse.y, h)
    grd.addColorStop(0, 'rgba(255,255,255,0.7)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')

    // polygons
    ctx.fillStyle = grd
    ctx.beginPath()
    intersects.map(({ x, y }, i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
    ctx.fill()
    
    // rays
    // ctx.strokeStyle = '#fff'
    // ctx.lineWidth = 2
    // intersects.map(({ x, y }) => {
    //     ctx.beginPath()
    //     ctx.moveTo(Mouse.x, Mouse.y)
    //     ctx.lineTo(x, y)
    //     ctx.stroke()
    // })

    // boundaries
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 8
    Boundaries.map(({a, b}) => {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
    })
}

export function drawLoop () {
    requestAnimationFrame(drawLoop)
    draw(calculate())
}
