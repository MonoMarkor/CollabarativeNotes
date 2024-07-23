module.exports = {
    homeAction: homeAction
}

function homeAction (req, res) {
    res.send('Home Page');
}