
import template from './virtualScroll.component.html';
import controller from './virtualScroll.controller';
import './virtualScroll.less';

export const virtualScroll = {
  restrict: 'E',
  require: {ngModel: 'ngModel'},
  transclude: true,
  bindings: {
    provider: '<',
    onSelect: '<',
    loadFunction: '<',
    totalNumber: '<',
    pageSize: '<',
    rowHeight: '<',
    paddingHeight: '<',
    movableTop: '<',
  },
  template,
  controller
};
