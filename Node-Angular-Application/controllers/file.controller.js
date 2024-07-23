var File = require('../models/file.model');

module.exports = {
    createFileAction: createFileAction,
    getSingleFileAction: getSingleFileAction,
    updateFileAction: updateFileAction,
    //addLineAction: addLineAction,
    //updateLineAction: updateLineAction,
    //deleteLineAction: deleteLineAction
}

async function createFileAction (req, res) {
    let file = new File(
        req.body.localFileId,
        req.body.serverFileId,
        req.body.fileName,
        req.body.version,
        req.body.content,
        req.body.tree
    );
    console.log(req.body.tree);
    await file.addFileToDb();
    res.setHeader('Content-Type', 'application/json');
    res.end(file.getFileAsJson());
}

async function getSingleFileAction (req, res) {
    let file = new File('', req.params.server_file_id, null);
    await file.getFileFromDb();
    res.setHeader('Content-Type', 'application/json');
    res.end(file.getFileAsJson());
}

async function updateFileAction (req, res) {
    let file = new File(
        req.body.localFileId,
        req.body.serverFileId,
        req.body.fileName,
        req.body.version,
        req.body.content,
        req.body.tree
    );
    res.setHeader('Content-Type', 'application/json');
    res.end(await file.updateFileInDB());
}

/*
async function addLineAction (req, res) {
    let file = new File('', req.params.server_file_id, null, null);
    let line = new Line(req.body.line_id, req.body.content);
    res.setHeader('Content-Type', 'application/json');
    res.end(await file.addLine(line, req.body.position));
}

async function updateLineAction (req, res) {
    let file = new File(req.params.server_file_id, null, null);
    let line = new Line(req.body.line_id, req.body.content);
    res.setHeader('Content-Type', 'application/json');
    res.end(await file.updateLine(line));
}

async function deleteLineAction (req, res) {
    let file = new File(req.params.server_file_id, null, null);
    let line = new Line(req.body.line_id);
    res.setHeader('Content-Type', 'application/json');
    res.end(await file.deleteLine(line));
}
*/