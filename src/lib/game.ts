export default class Game {
    public lastFrameTime = 0
    public callback: any

    constructor () {
        this.frame = this.frame.bind(this)
    }
    
    start (callback: any) {
        this.callback = callback
        requestAnimationFrame(this.frame)
    }
    
    frame (time: number) {
        const delta = (time - this.lastFrameTime) / 1000
        if (delta < 0.2) this.callback(delta)
        this.lastFrameTime = time
        requestAnimationFrame(this.frame)
    }
}