var Group = require('../models/group.model');

module.exports = {
    createGroupAction: createGroupAction,
    getGroupAction: getGroupAction,
    addEntityAction: addEntityAction,
}

async function createGroupAction (req, res) {
    let group = new Group(
        req.body.groupId,
        req.body.groupName,
        req.body.members,
        req.body.serverFileIds
    );
    await group.addGroupToDb();
    res.setHeader('Content-Type', 'application/json');
    res.end(group.getGroupAsJson());
}

async function getGroupAction (req, res) {
    let group = new Group(req.params.groupId);
    await group.getGroupFromDb();
    res.setHeader('Content-Type', 'application/json');
    res.end(group.getGroupAsJson());
}

async function addEntityAction (req, res) {
    console.log('addEntityAction called');
    let group = new Group(req.params.groupId);
    res.setHeader('Content-Type', 'application/json');
    if(req.body.userId) {
        res.end(await group.addMember(req.body.userId));
    } else if(req.body.fileId) {
        res.end(await group.addFile(req.body.fileId));
    }
}