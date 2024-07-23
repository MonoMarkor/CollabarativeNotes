import { Node } from "./node_model";

enum Compare {
    Equal = 0,
    After = 1,
    Before = -1
}

export class Tree {
    public nodes: Node[];
    public logicalCount: number;
    public maxMembers: number = 100;

    constructor(logicalCount: number = 0, nodes: Node[] = [], maxMembers: number = 100) {
        this.logicalCount = logicalCount;
        this.nodes = nodes;
        this.maxMembers = maxMembers;
    }

    getText(): string {
        let text = '';
        for (let i = 0; i < this.nodes.length; i++) {
            text += this.nodes[i].Char();
        }
        return text;
    }

    localInsert(char: string, index: number, userIndex: number): Node {
        console.log('local inserted');
        let positionAfter: number[];
        let positionBefore: number[];

        let newNode: Node;

        if (index == this.nodes.length) {
            positionAfter = [this.maxMembers - 1];
        } else {
            positionAfter = this.nodes[index].Position();
        }
        if (index - 1 < 0) {
            positionBefore = [0];
        } else {
            positionBefore = this.nodes[index - 1].Position();
        }

        let position: number[] = this.generateTreePosition(positionBefore, positionAfter);
        console.log(position);

        console.log('position before: ', positionBefore);
        console.log(position);
        console.log('position after: ', positionAfter);

        let siteId: number[];
        if (this.comparePosition(positionBefore, positionAfter) == Compare.Equal) {
            siteId = [...this.nodes[index - 1].SiteId(), userIndex];
        } else {
            siteId = [userIndex];
        }

        newNode = new Node(char, siteId, this.logicalCount, position);

        this.logicalCount++;

        this.nodes.splice(index, 0, newNode);

        return newNode;
    }

    localDelete(index: number): Node[] {
        let deletedNode: Node[] = this.nodes.splice(index, 1);
        console.log(this.nodes);
        return deletedNode;
    }

    remoteInsert(node: Node): boolean {
        if (this.nodes.length == 0) {
            this.nodes.push(node);
            return true;
        }
        console.log(this.nodes.length);
        for (let i = 0; i < this.nodes.length; i++) {
            if(this.compareNodes(node, this.nodes[i]) == Compare.Equal) {
                return false;
            }
            if (i == 0) {
                if (this.compareNodes(node, this.nodes[i]) == Compare.Before) {
                    this.nodes.splice(i, 0, node);
                    return true;
                }
                continue;
            }
            if (i == this.nodes.length - 1) {
                if (this.compareNodes(node, this.nodes[i]) == Compare.After) {
                    this.nodes.push(node);
                    return true;
                }
                continue;
            }
            if (this.compareNodes(node, this.nodes[i - 1]) == Compare.After
            && this.compareNodes(node, this.nodes[i]) == Compare.Before) {
                this.nodes.splice(i, 0, node);
                return true;
            }
        }
        this.nodes.push(node);
        return true;
    }

    remoteDelete(node: Node): boolean {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.compareNodes(node, this.nodes[i]) == Compare.Equal) {
                this.nodes.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    generateTreePosition(positionBefore: number[], positionAfter: number[]): number[] {
        let position: number[] = [];
        if(positionBefore.length < positionAfter.length) {
            for (let i = 0; i < positionBefore.length; i++) {
                if(positionBefore[i] == positionAfter[i]){
                    position.push(positionBefore[i]);
                } else if(positionBefore[i] < positionAfter[i]){
                    if(positionBefore[i] + 1 == positionAfter[i]) {
                        position.push(positionBefore[i], 1);
                        return position;
                    } else {
                        position.push(positionBefore[i] + 1);
                        return position;
                    }
                } else {
                    console.log('PositionBefore comes after PositionAfter');
                }
            }
            for (let i = positionBefore.length; i < positionAfter.length; i++) {
                if(positionAfter[i] == 0){
                    position.push(0); 
                } else if(positionAfter[i] == 1){
                    position.push(0, 1);
                    break;
                } else {
                    position.push(positionAfter[i] - 1);
                    break;
                }   
            }
            return position;
        } else if(positionBefore.length > positionAfter.length) {
            if(positionBefore[positionBefore.length - 1] == this.maxMembers - 2){
                position.push(...positionBefore, 1);
            } else {
                position.push(...positionBefore);
                position[position.length - 1]++;
            }
            return position;
        } else {
            for (let i = 0; i < positionBefore.length; i++) {
                if(positionBefore[i] == positionAfter[i]){
                    position.push(positionBefore[i]);
                } else if(positionBefore[i] < positionAfter[i]){
                    if(positionBefore[i] + 1 == positionAfter[i]) {
                        position.push(positionBefore[i], 1);
                        return position;
                    } else {
                        position.push(positionBefore[i] + 1);
                        return position;
                    }
                } else {
                    console.log('PositionBefore comes after PositionAfter');
                }
            }
            return position;
        }
    }

    comparePosition(positionBefore: number[] ,positionAfter: number[]): number {
        if (positionBefore.length < positionAfter.length) {
            for (let i = 0; i < positionBefore.length; i++) {
                if(positionBefore[i] > positionAfter[i]){
                    return Compare.After;
                } else if(positionBefore[i] < positionAfter[i]){
                    return Compare.Before;
                }
            }
            return Compare.Before;
        } else if (positionBefore.length > positionAfter.length) {
            for (let i = 0; i < positionAfter.length; i++) {
                if(positionBefore[i] > positionAfter[i]){
                    return Compare.After;
                } else if(positionBefore[i] < positionAfter[i]){
                    return Compare.Before;
                }
            }
            return Compare.After;
        } else {
            for (let i = 0; i < positionBefore.length; i++) {
                if(positionBefore[i] > positionAfter[i]){
                    return Compare.After;
                } else if(positionBefore[i] < positionAfter[i]){
                    return Compare.Before;
                }
            }
            return Compare.Equal;
        }
    }

    compareNodes(nodeBefore: Node, nodeAfter: Node) {
        let result: number = this.comparePosition(nodeBefore.Position(), nodeAfter.Position());
        if (result != Compare.Equal) {
            return result;
        } else {
            result = this.comparePosition(nodeBefore.SiteId(), nodeAfter.SiteId());
            return result;
        }
    }

    LogicalCount(): number {
        return this.logicalCount;
    }
    incLogicalCount() {
        this.logicalCount++;
    }
}