let database = require('../dbCleints/mongodb.connect');
let groups = database.collection('groups');
var ObjectID = require('mongodb').ObjectId; 

class Group {
    constructor(groupId = '', groupName = '', members = [], serverFileIds = []) {
        this.groupId = groupId;
	    this.groupName = groupName;
	    this.members = members;
	    this.serverFileIds = serverFileIds;
    }

    async addGroupToDb() {
        const groupDoc = {
            groupName: this.groupName,
            members: this.members,
            serverFileIds: this.serverFileIds
        }
        const result = await groups.insertOne(groupDoc);
        this.groupId = result.insertedId;
    }

    async getGroupFromDb() {
        const query = {
            _id: ObjectID.createFromHexString(this.groupId)
        };
        const result = await groups.findOne(query);
        if(result) {
            this.groupId = result._id;
            this.groupName = result.groupName;
            this.members = result.members;
            this.serverFileIds = result.serverFileIds;
        } else {
            this.groupId = null;
            this.groupName = null;
            this.members = null;
            this.serverFileIds = null;
        }
    }

    async addMember(userId) {
        const query = {
            _id: ObjectID.createFromHexString(this.groupId)
        };
        const result = await groups.updateOne(
            query,
            { 
                $push: { 
                    members: userId
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }

    async addFile(serverFileId) {
        const query = {
            _id: ObjectID.createFromHexString(this.groupId)
        };
        const result = await groups.updateOne(
            query, 
            { 
                $push: { 
                    serverFileIds: serverFileId
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }

    getGroupAsJson() {
        return JSON.stringify({
            groupId: this.groupId,
            groupName: this.groupName,
            members: this.members,
            serverFileIds: this.serverFileIds
        });
    }
}

module.exports = Group;