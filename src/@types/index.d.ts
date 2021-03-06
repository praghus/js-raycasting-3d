declare namespace D4D {
    export interface StringTMap<T> {
        [key: string]: T;
    }

    export interface Asset {
        src: string;
        width: number;
        height: number;
    }
}

declare module '*.tmx' {
    const value: any
    export default value
}

declare module 'd4d-ray-casting' {
	export = D4D;
}
