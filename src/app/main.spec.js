import angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
import {main} from './main';

describe('main component', () => {
  class mockItunesService {
    getImages() {
      return Promise.resolve({results: [{trackId: 1234556}]});
    }
    getInfo() {}
    getRandomTracks() {}
  }
  class mockState {
  }
  const mockimage200 = () => {
    return input => {
      return input;
    };
  };

  beforeEach(() => {
    angular
      .module('app', ['app/main.html'])
      .component('app', main)
      .service('itunesService', mockItunesService)
      .service('$state', mockState)
      .filter('image200', mockimage200);
    angular.mock.module('app');
  });

  it('should have the virtual scroll', angular.mock.inject(($compile, $rootScope) => {
    const element = $compile('<app>Loading...</app>')($rootScope);
    $rootScope.$digest();
    console.log(element);
    expect(element.find('virtual-scroll').length).toEqual(1);
  }));
});
