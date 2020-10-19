/**
 * @file mock数据
 */
const Mock = require('mockjs');
const pageList = require('./json/pageList.json');

// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/wxaAct/pageList', 'post', pageList);
