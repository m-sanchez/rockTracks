/**
 * Created by MiguelSanchez on 22/07/2017.
 */

class trackDetailController {
  constructor($scope, $state) {
    this.scope = $scope;
    this.state = $state;
  }
  selectTrack(trackId) {
    this.state.go('track', {trackId});
  }
}

export default trackDetailController;
