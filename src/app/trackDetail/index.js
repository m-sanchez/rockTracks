/**
 * Created by MiguelSanchez on 22/07/2017.
 */

import template from './trackDetail.component.html';
import controller from './trackDetail.controller';

export const trackDetail = {
  bindings: {
    track: '<',
    randomTracks: '<',
  },
  template,
  controller
};
