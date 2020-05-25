var express = require('express');
var router = express.Router();
const librariesController = require('../controllers/libraries')

router.get('/', librariesController.getLibraries)

module.exports = router;
