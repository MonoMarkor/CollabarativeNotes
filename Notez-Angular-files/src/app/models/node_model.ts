export class Node {
    public char: string;
	public siteId: number[];
    public logicalCount: number;
    public position: number[];

    constructor(char: string, siteId: number[], logicalCount: number, position: number[]) {
        this.char = char;
        this.siteId = siteId;   //lineId
        this.logicalCount = logicalCount;
        this.position = position;
    }

    Char(): string {
        return this.char;
    }

    Position(): number[] {
        return this.position;
    }
    setPosition(position: number[]){
        this.position = position;
    }

    LogicalCount(): number {
        return this.logicalCount;
    }

    SiteId(): number[] {
        return this.siteId;
    }
}