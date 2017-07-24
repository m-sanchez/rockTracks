/**
 * Created by MiguelSanchez on 22/07/2017.
 */

class virtualScrollController {
  constructor($scope, $element, $window) {
    'ngInject';
    const $ctrl = this;
    const querySelector = $element[0].querySelector('.vs-scroll-container');
    $ctrl.window = $window;
    $ctrl.document = this.window.document;
    $ctrl.parentElemWidth = querySelector.offsetWidth;
    $ctrl.elem = angular.element(querySelector);
    $ctrl.scope = $scope;
    $ctrl.loadingElements = false;
    $ctrl.scrollTop = 0;
    $ctrl.visibleProvider = [];
    $ctrl.cellsPerPage = 0;
    $ctrl.numberOfCells = 0;
    $ctrl.canvasHeight = {};
    $ctrl.page = 0;
  }

  calculateHeight() {
    const $ctrl = this;
    const marginTop = $ctrl.movableTop ? $ctrl.getTopPosition() : $ctrl.paddingHeight;
    $ctrl.height = $ctrl.getViewportSize().height - marginTop;
    $ctrl.elem[0].style.maxHeight = `${$ctrl.height}px`;
    $ctrl.elem[0].style.height = `${$ctrl.height}px`;
    $ctrl.cellsPerPage = Math.round($ctrl.height / $ctrl.rowHeight);
    $ctrl.numberOfCells = 3 * $ctrl.cellsPerPage;
  }

  $onInit() {
    const $ctrl = this;
    angular.element($ctrl.window).bind('resize', () => {
      $ctrl.calculateHeight($ctrl.window);
    });
    $ctrl.marginToLoad = $ctrl.cellsPerPage;
    $ctrl.calculateHeight($ctrl.window);
    $ctrl.onScroll = $ctrl.onScroll.bind($ctrl);
    $ctrl.elem.on('scroll', $ctrl.onScroll);
    $ctrl.canvasHeight = {
      height: `${$ctrl.totalNumber * $ctrl.rowHeight}px`
    };
    $ctrl.updateDisplayList();
    $ctrl.ngModel.$render = () => {
      $ctrl.model = $ctrl.ngModel.$viewValue;
    };
    $ctrl.scope.$watch(() => $ctrl.model, value => {
      $ctrl.ngModel.$setViewValue(value);
    });
    $ctrl.initialized = true;
  }

  $onChanges() {
    if (this.initialized) {
      this.updateDisplayList();
    }
  }

  onScroll(evt) {
    const $ctrl = this;
    const element = $ctrl.elem[0];
    $ctrl.scrollTop = evt.currentTarget.scrollTop;
    const scrollTopMax = ($ctrl.provider.length - $ctrl.cellsPerPage) * $ctrl.rowHeight;

    if ($ctrl.provider.length <= $ctrl.cellsPerPage) {
      evt.currentTarget.scrollTop = 0;
      $ctrl.canvasHeight = {
        height: `${$ctrl.totalNumber * $ctrl.rowHeight}px`
      };
    }
    if ($ctrl.provider.length > $ctrl.totalNumber) {
      $ctrl.totalNumber = $ctrl.provider.length;
      $ctrl.canvasHeight = {
        height: `${($ctrl.totalNumber + 2) * $ctrl.rowHeight}px`
      };
    }
    if ($ctrl.provider.length < $ctrl.page * $ctrl.pageSize) {
      $ctrl.canvasHeight = {
        height: `${$ctrl.totalNumber * $ctrl.rowHeight}px`
      };
    }
    const loadPoint = (($ctrl.page + 1) * $ctrl.pageSize * $ctrl.rowHeight) - (($ctrl.cellsPerPage + $ctrl.marginToLoad) * $ctrl.rowHeight);
    if ($ctrl.scrollTop > loadPoint) {
      if ($ctrl.loadFunction) {
        $ctrl.serviceCalled = true;
        $ctrl.loadFunction().then(() => {
          $ctrl.loadingElements = false;
          $ctrl.serviceCalled = false;
          angular.element(element.querySelector('#virtualScrollCanvas'))[0].style.width = '100%';
          element.style.overflowY = 'auto';
          $ctrl.updateDisplayList();
          if ($ctrl.scope.$root.$$phase !== '$apply' && $ctrl.scope.$root.$$phase !== '$digest') {
            $ctrl.scope.$apply();
          }
        });
      }
      $ctrl.page++;
    }

    if ($ctrl.serviceCalled && $ctrl.scrollTop > scrollTopMax + (1.5 * $ctrl.rowHeight)) {
      evt.currentTarget.scrollTop = scrollTopMax + (1.5 * $ctrl.rowHeight);
      const canvas = angular.element(element.querySelector('#virtualScrollCanvas'))[0];
      const scrollbarWidth = canvas.parentNode.offsetWidth - canvas.offsetWidth;
      element.style.overflowY = 'hidden';
      canvas.style.width = `calc(100% - ${scrollbarWidth}px)`;
      $ctrl.loadingStyle = {
        height: `${$ctrl.rowHeight}px`,
        top: `${scrollTopMax + ($ctrl.rowHeight * $ctrl.cellsPerPage)}px`
      };
      $ctrl.loadingElements = true;
    }

    $ctrl.updateDisplayList();
    if ($ctrl.scope.$root.$$phase !== '$apply' && $ctrl.scope.$root.$$phase !== '$digest') {
      $ctrl.scope.$apply();
    }
  }

  updateDisplayList() {
    const $ctrl = this;
    const firstCell = Math.max(Math.floor($ctrl.scrollTop / $ctrl.rowHeight) - $ctrl.cellsPerPage, 0);
    const cellsToCreate = Math.min(firstCell + $ctrl.numberOfCells, $ctrl.numberOfCells);
    this.visibleProvider = $ctrl.provider.slice(firstCell, firstCell + cellsToCreate);
    for (let i = 0; i < $ctrl.visibleProvider.length; i++) {
      this.visibleProvider[i].styles = {
        height: `${$ctrl.rowHeight}px`,
        top: `${(firstCell + i) * $ctrl.rowHeight}px`
      };
    }
  }

  onClickOption(option) {
    if (this.onSelect) {
      this.onSelect(option);
    }
  }

  getViewportSize() {
    const $ctrl = this;
    let myWidth = 0;
    let myHeight = 0;
    if (angular.isNumber($ctrl.window.innerWidth)) {
      myWidth = $ctrl.window.innerWidth;
      myHeight = $ctrl.window.innerHeight;
    } else if ($ctrl.document.documentElement && ($ctrl.document.documentElement.clientWidth || $ctrl.document.documentElement.clientHeight)) {
      myWidth = $ctrl.document.documentElement.clientWidth;
      myHeight = $ctrl.document.documentElement.clientHeight;
    } else if ($ctrl.document.body && ($ctrl.document.body.clientWidth || $ctrl.document.body.clientHeight)) {
      myWidth = $ctrl.document.body.clientWidth;
      myHeight = $ctrl.document.body.clientHeight;
    }
    return {width: myWidth, height: myHeight};
  }

  getTopPosition() {
    const $ctrl = this;
    let el = $ctrl.elem[0];
    let el2 = el;
    let curtop = 0;
    if ($ctrl.document.getElementById || $ctrl.document.all) {
      do {
        curtop += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
        el2 = el2.parentNode;
        while (el2 !== el) {
          curtop -= el2.scrollTop;
          el2 = el2.parentNode;
        }
      } while (el && el.offsetParent);
    } else if ($ctrl.document.layers) {
      curtop += el.y;
    }
    return curtop;
  }
}

export default virtualScrollController;

