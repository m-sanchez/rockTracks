/**
 * Created by MiguelSanchez on 22/07/2017.
 */

class mainController {
  constructor($scope, itunesService, $state, $window) {
    'ngInject';
    const $ctrl = this;
    $ctrl.scope = $scope;
    $ctrl.itunesService = itunesService;
    $ctrl.loadMore = this.loadMore.bind(this);
    $ctrl.selectTrack = this.selectTrack.bind(this);
    $ctrl.page = 0;
    $ctrl.state = $state;
    $ctrl.pageSize = 150;
    $ctrl.rowHeight = 195;
    if ($window.innerWidth <= 990) {
      $ctrl.rowHeight = 585;
    } else {
      $ctrl.rowHeight = 195;
    }
    angular.element($window).bind('resize', () => {
      if ($window.innerWidth <= 990) {
        $ctrl.rowHeight = 585;
      } else {
        $ctrl.rowHeight = 195;
      }
      $ctrl.newSearch();
    });
    $ctrl.tracks = [];
    $ctrl.page = 0;
    $ctrl.newSearch();
  }
  newSearch() {
    const $ctrl = this;
    $ctrl.itunesService.getImages($ctrl.page, $ctrl.pageSize).then(data => {
      $ctrl.tracks = data.results;
      $ctrl.total = data.results.length;
      if ($ctrl.scope.$root.$$phase !== '$apply' && $ctrl.scope.$root.$$phase !== '$digest') {
        $ctrl.scope.$apply();
      }
    });
  }
  selectTrack(trackId) {
    this.state.go('track', {trackId});
  }
  loadMore() {
    const $ctrl = this;
    $ctrl.page ++;
    return $ctrl.itunesService.getImages($ctrl.page, $ctrl.pageSize)
      .then(data => {
        $ctrl.tracks = $ctrl.tracks.concat(data.results);
        $ctrl.loadingSearch = false;
        if ($ctrl.scope.$root.$$phase !== '$apply' && $ctrl.scope.$root.$$phase !== '$digest') {
          $ctrl.scope.$apply();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}
module.exports = mainController;
