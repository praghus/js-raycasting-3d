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
        this.lastFrameTime = time
        if (delta < 0.6) this.callback(delta)
        requestAnimationFrame(this.frame)
    }
}