let database = require('../dbCleints/mongodb.connect');
let users = database.collection('users');
var ObjectID = require('mongodb').ObjectId; 

class User {
    constructor(userId, username, password = '', localFileIds = [], serverFileIds = [], groupIds = []) {
        this.userId = userId;
	    this.username = username;
	    this.password = password;
	    this.localFileIds = localFileIds;
        this.serverFileIds = serverFileIds,
	    this.groupIds = groupIds;
    }
    
    async addUserToDb() {
        const userDoc = {
            username: this.username,
            password: this.password,
            localFileIds: this.localFileIds,
            serverFileIds: this.serverFileIds,
            groupIds: this.groupIds
        }
        const result = await users.insertOne(userDoc);
        this.userId = result.insertedId;
    }

    async verifyUser() {
        const query = {
            username: this.username,
            password: this.password
        };
        const result = await users.findOne(query);
        if(result) {
            this.userId = result._id;
            this.localFileIds = result.localFileIds;
            this.serverFileIds = result.serverFileIds;
            this.groupIds = result.groupIds;
        } else {
            this.userId = null;
            this.localFileIds = null;
            this.serverFileIds = null;
            this.groupIds = null;
        }
    }

    async checkUsernameAvailibility() {
        const query = {
            username: this.username
        };
        const result = await users.findOne(query);
        if (result == null) {
            return JSON.stringify({
                username_available: true
            });
        } else {
            return JSON.stringify({
                username_available: false
            });
        }
    }

    async getUser() {
        const query = {
            _id: ObjectID.createFromHexString(this.userId)
        };
        const result = await users.findOne(query);
        if(result) {
            this.userId = result._id;
            this.localFileIds = result.localFileIds;
            this.serverFileIds = result.serverFileIds;
            this.groupIds = result.groupIds;
        } else {
            this.userId = null;
            this.localFileIds = null;
            this.serverFileIds = null;
            this.groupIds = null;
        } 
    }

    async getMatchingUsernames() {
        let res = [];
        const query = {
            username: {$regex: this.username}
        };
        const options = {
            limit: 5,
            projection: { _id:1, username: 1 }
        };
        const cursor = users.find(query, options);
        for await (const doc of cursor) {
            res.push({
                userId: doc._id,
                username: doc.username
            });
        }
        return JSON.stringify(res);
    }

    getUserAsJson() {
        return JSON.stringify({
            userId: this.userId,
            username: this.username,
            password: this.password,
            localFileIds: this.localFileIds,
            serverFileIds: this.serverFileIds,
            groupIds: this.groupIds
        });
    }

    async addToPersonalFiles(server_file_id) {
        const query = {
            _id: ObjectID.createFromHexString(this.userId)
        };
        const result = await users.updateOne(
            query,
            { 
                $push: { 
                    serverFileIds: server_file_id
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }

    async pushToGroups(groupId) {
        const query = {
            _id: ObjectID.createFromHexString(this.userId)
        };
        const result = await users.updateOne(
            query,
            { 
                $push: { 
                    groupIds: groupId
                }
            }
        );
        if(result.modifiedCount == 0){
            return JSON.stringify({ success: false});
        } else if (result.modifiedCount > 0) {
            return JSON.stringify({ success: true});
        }
    }
}

module.exports = User;