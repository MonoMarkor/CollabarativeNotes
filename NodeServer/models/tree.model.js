class Tree {
    constructor(logicalCount = 0, nodes = [], maxMembers = 100) {
        this.logicalCount = logicalCount;
        this.nodes = nodes;
        this.maxMembers = maxMembers;
    }
}

module.exports = Tree;