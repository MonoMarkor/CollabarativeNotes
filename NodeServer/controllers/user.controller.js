var User = require('../models/user.model');

module.exports = {
    userLoginAction: userLoginAction,
    gerUserAction: gerUserAction,
    getAllUsersAction: getAllUsersAction,
    createUserAction: createUserAction,
    deleteUserAction: deleteUserAction,
    isUsernameTakenAction: isUsernameTakenAction,
    findMatchingUsernamesAction: findMatchingUsernamesAction,
    addToPersonalFilesAction: addToPersonalFilesAction,
    addToGroupToUserAction: addToGroupToUserAction
}

async function userLoginAction (req, res) {
    let user = new User('', req.body.username, req.body.password);
    await user.verifyUser();
    res.setHeader('Content-Type', 'application/json');
    //console.log(user.getUserAsJson());
    res.end(user.getUserAsJson());
}

function gerUserAction(req, res) {
    let user = new User(req.params.userId);
}

function getAllUsersAction (req, res) {
    res.send('All Users');
}

async function createUserAction (req, res) {
    let user = new User('', req.body.username, req.body.password);
    await user.addUserToDb();
    res.setHeader('Content-Type', 'application/json');
    res.end(user.getUserAsJson());
}

function deleteUserAction (req, res) {
    res.send(`Deleted User: ${req.params.username}`);
}

async function isUsernameTakenAction (req, res) {
    let user = new User('', req.params.username);
    res.setHeader('Content-Type', 'application/json');
    res.end(await user.checkUsernameAvailibility());
}

async function findMatchingUsernamesAction (req, res) {
    let user = new User('', req.params.username);
    res.setHeader('Content-Type', 'application/json');
    res.end(await user.getMatchingUsernames());
}

async function addToPersonalFilesAction(req, res) {
    console.log('addToPersonalFilesAction called');
    let user = new User(req.body.user_id, '', '');
    res.setHeader('Content-Type', 'application/json');
    res.end(await user.addToPersonalFiles(req.body.server_file_id));
}

async function addToGroupToUserAction(req, res) {
    console.log('addToGroupToUserAction called');
    let user = new User(req.params.userId, '');
    res.setHeader('Content-Type', 'application/json');
    res.end(await user.pushToGroups(req.body.groupId));
}