let userController = require('../controllers/user.controller');
let groupController = require('../controllers/group.controller');
let fileController = require('../controllers/file.controller');

module.exports = function(app) {
    app.route('/users')
        .post(userController.userLoginAction)
        .put(userController.createUserAction);

    app.route('/users/serverFiles')
        .put(userController.addToPersonalFilesAction);

    app.route('/users/:userId')
        .get(userController.gerUserAction)
        .put(userController.addToGroupToUserAction);

    app.get('/users/available/:username', userController.isUsernameTakenAction);
    app.get('/users/search/:username', userController.findMatchingUsernamesAction);

    app.route('/groups')
        .put(groupController.createGroupAction);

    app.route('/groups/:groupId')
        .get(groupController.getGroupAction)
        .put(groupController.addEntityAction);

    app.route('/files')
        .put(fileController.createFileAction)
        .post(fileController.updateFileAction);

    app.route('/files/:server_file_id')
        .get(fileController.getSingleFileAction);

    app.get('*', (req, res) => {
        console.log(req.path);
        res.sendFile(__dirname + '/public/index.html')
    });
}