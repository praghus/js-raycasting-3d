import { KEYS } from '../constants'

export default class Input { 
    public states = { 
        'left': false, 
        'right': false, 
        'forward': false, 
        'backward': false 
    }
    
    constructor () {
        document.addEventListener('keydown', this.onKey.bind(this, true), false)
        document.addEventListener('keyup', this.onKey.bind(this, false), false)
    }
    
    onKey = function (val: number, e: KeyboardEvent) {
        const state = KEYS[e.keyCode]
        if (typeof state === 'undefined') return
        this.states[state] = val
        e.preventDefault && e.preventDefault()
        e.stopPropagation && e.stopPropagation()
    }
}
