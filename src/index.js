import angular from 'angular';

import {main} from './app/main';
import {virtualScroll} from './app/virtualScroll';
import {trackDetail} from './app/trackDetail';
import {constants} from './app/constants';
import 'angular-ui-router';
import 'angular-ui-bootstrap';
import routesConfig from './routes';
import './index.less';

const services = require.context('./', true, /\.service.js$/);
const directives = require.context('./', true, /\.directive.js$/);
const filters = require.context('./', true, /\.filter.js$/);
export const app = 'app';

const MODULE_NAME = 'app';
const DEPENDENCIES = ['ui.router', 'ui.bootstrap'];
angular.module(MODULE_NAME, DEPENDENCIES);
angular.module(MODULE_NAME)
  .config(routesConfig)
  .constant('constants', constants)
  .component('app', main)
  .component('virtualScroll', virtualScroll)
  .component('trackDetail', trackDetail);

// service definitions
services.keys().forEach(key => {
  angular.module(MODULE_NAME).factory(services(key).name, services(key));
});

filters.keys().forEach(key => {
  angular.module(MODULE_NAME).filter(filters(key).name, filters(key));
});

directives.keys().forEach(key => {
  let directiveName = key.split('.directive.js')[0].split('/');
  directiveName = directiveName[directiveName.length - 1];
  angular.module(MODULE_NAME).directive(directiveName, directives(key).default);
});
