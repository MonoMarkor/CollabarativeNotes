class Node {
    constructor(char, logicalCount, siteId = [], position = []) {
        this.char = char;
        this.siteId = siteId;   //lineId
        this.logicalCount = logicalCount;
        this.position = position;
    }
}

module.exports = Node;