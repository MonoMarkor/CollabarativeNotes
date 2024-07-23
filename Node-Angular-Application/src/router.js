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

    /*
    app.route('/')  //replace middleware 'app.use(express.static(__dirname + '/public'));' with route when bug found
        .get((req, res) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.sendFile(__dirname + '/browser/chunk-E4IKENG7.js');
            res.sendFile(__dirname + '/browser/chunk-QFWVC2MQ.js');
            res.sendFile(__dirname + '/browser/favicon.ico');
            res.sendFile(__dirname + '/browser/index.html');
            res.sendFile(__dirname + '/browser/main-VEA4BIHY.js');
            res.sendFile(__dirname + '/browser/polyfills-6EAL64PA.js');
            res.sendFile(__dirname + '/browser/styles-QU3GNN4H.css');
        });
    */
}