export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      url: '/',
      component: 'app'
    })
    .state('track', {
      url: '/:trackId',
      component: 'trackDetail',
      resolve: {
        track: ($transition$, itunesService) => {
          return itunesService.getInfo($transition$.params().trackId);
        },
        randomTracks: itunesService => {
          return itunesService.getRandomTracks(3);
        }
      }
    });
}
