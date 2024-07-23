let database = require('../dbCleints/mongodb.connect');
let files = database.collection('files');
var ObjectID = require('mongodb').ObjectId; 
var Tree = require('./tree.model');


class File {
    constructor(localFileId, serverFileId, fileName, version = 0, content = '', tree = new Tree()) {
        this.localFileId = localFileId;
        this.serverFileId = serverFileId;
	    this.fileName = fileName;
        this.version = version;
        this.content = content;
        this.tree = tree;
    }

    async addFileToDb() {
        const fileDoc = {
            localFileId: this.localFileId,
            fileName: this.fileName,
            version: this.version,
            content: this.content,
            tree: this.tree
        };
        const result = await files.insertOne(fileDoc);
        this.serverFileId = result.insertedId;
    }

    async getFileFromDb() {
        const query = {
            _id: ObjectID.createFromHexString(this.serverFileId)
        };
        const result = await files.findOne(query);
        //console.log(result);
        if(result) {
            this.localFileId = result.localFileId;
            this.serverFileId = result._id;
            this.fileName = result.fileName;
            this.version = result.version;
            this.content = result.content;
            this.tree = result.tree;
        } else {
            this.localFileId = null;
            this.serverFileId = null;
            this.fileName = null;
            this.version = null;
            this.content = null;
            this.tree = null;
        }
    }

    async updateFileInDB() {
        const query = {
            _id: ObjectID.createFromHexString(this.serverFileId)
        };
        const result = await files.updateOne(
            query, 
            {
                $set: {
                    localFileId: this.localFileId,
                    fileName: this.fileName,
                    version: this.version,
                    content: this.content,
                    tree: this.tree
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }

    /*
    async addLine(line, position) {
        const query = {
            _id: ObjectID.createFromHexString(this.serverFileId)
        };
        const result = await files.updateOne(
            query,
            {
                $push: {
                    lines: {
                      $each: [ line ],
                      $position: position
                   }
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }

    async updateLine(line, position) {
        const query = {
            _id: ObjectID.createFromHexString(this.serverFileId),
            "lines.line_id": line.line_id
        };
        const result = await files.updateOne(
            query,
            {
                $set: {
                    "lines.$.content" : line.content
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }

    async deleteLine(line) {
        const query = {
            _id: ObjectID.createFromHexString(this.serverFileId)
        };
        const result = await files.updateOne(
            query,
            {
                $pull: {
                    lines : {line_id: line.line_id}
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }
    */

    getFileAsJson() {
        return JSON.stringify({
            localFileId: this.localFileId,
            serverFileId: this.serverFileId,
            fileName: this.fileName,
            version: this.version,
            content: this.content,
            tree: this.tree
        });
    }
}

module.exports = File;