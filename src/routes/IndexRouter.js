const routerIndex = require('express').Router();
const { getIndex } = require('../controller/indexController/indexController');

routerIndex.get('/', getIndex);

module.exports = routerIndex;

