export class V {
    constructor (
        public x: number, 
        public y: number
    ) {}
}

export class L {
    constructor (
        public a: V,
        public b: V
    ) {}
}

export class POI {
    constructor (
        public x: number,
        public y: number,
        public p: number
    ) {}
}

const w = window.innerWidth 
const h =  window.innerHeight 

export const BOUNDARIES = [
    new L(new V(0, 0), new V(w, 0)),
    new L(new V(w, 0), new V(w, h)),
    new L(new V(w, h), new V(0, h)),
    new L(new V(0, h), new V(0, 0)),

    new L(new V(290, 230), new V(290, 200)), 
    new L(new V(290, 200), new V(330, 200)), 
    new L(new V(330, 200), new V(330, 100)), 
    new L(new V(330, 100), new V(100, 100)), 
    new L(new V(100, 100), new V(100, 200)), 
    new L(new V(100, 200), new V(200, 200)), 
    new L(new V(200, 200), new V(200, 230)),
    new L(new V(200, 230), new V(290, 230))
]

// Find intersection of RAY & BOUNDARY
export function getIntersection (ray: L, boundary: L): POI {
    // Ray in parametric: Point + Delta*T1

    const raX = ray.a.x
    const raY = ray.a.y
    const rbX = ray.b.x - ray.a.x
    const rbY = ray.b.y - ray.a.y

    // Boundary in parametric: Point + Delta*T2
    const saX = boundary.a.x
    const saY = boundary.a.y
    const sdX = boundary.b.x - boundary.a.x
    const sdY = boundary.b.y - boundary.a.y

    // Are they parallel? If so, no intersect
    const rMag = Math.sqrt(rbX * rbX + rbY * rbY)
    const sMag = Math.sqrt(sdX * sdX + sdY * sdY)
    if (rbX / rMag == sdX / sMag && rbY / rMag == sdY / sMag) {
        // Unit vectors are the same.
        return null
    }

    // SOLVE FOR T1 & T2
    const T2 = (rbX * (saY - raY) + rbY * (raX - saX)) / (sdX * rbY - sdY * rbX)
    const T1 = (saX + sdX * T2 - raX) / rbX

    // Must be within parametic whatevers for Ray/Boundary
    if (T1 < 0) return null
    if (T2 < 0 || T2 > 1) return null

    // Return the POINT OF INTERSECTION
    return new POI(raX + rbX * T1, raY + rbY * T1, T1)
}
