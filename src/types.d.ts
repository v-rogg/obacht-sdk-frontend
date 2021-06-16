export interface wasmInterface {
    greetings(s: string): void;
    add(n1: number, n2: number): number;
    loc(angle: number, distance: number): number[];
    greet(): string;
}
