/**
 * Created by MiguelSanchez on 11/07/2017.
 */

function itunesService($state, $http, $log, constants, $q) {
  'ngInject';
  let flatTracks = [];
  const handleSuccess = response => {
    flatTracks = flatTracks.concat(response.data.results);
    return {results: transformArray(response.data.results, 3)};
  };
  const handleError = error => {
    $log.log(error);
  };
  const transformArray = (originalArray, numElements) => {
    const result = [];
    let rows = originalArray.length / numElements;
    while (rows > 0) {
      result.push(originalArray.splice(0, numElements));
      rows--;
    }
    return result;
  };
  return {
    getRandomTracks(number) {
      const randomRes = [];
      const max = flatTracks.length;
      while (number > 0) {
        const index = Math.floor(Math.random() * (max));
        randomRes.push(flatTracks[index]);
        number--;
      }
      return randomRes;
    },
    getInfo(trackId) {
      if (flatTracks.length === 0) {
        $state.go('app');
      }
      return flatTracks.find(track => {
        return String(track.trackId) === trackId;
      });
    },
    getImages(page, per_page) {
      if (this.canceler) {
        this.canceler.resolve('cancelled');
      }
      this.canceler = $q.defer();
      return $http
        .get(constants.ITUNES_API, {
          timeout: this.canceler.promise,
          params: {
            term: 'rock',
            media: 'music',
            offset: page * per_page,
            limit: per_page
          }
        })
        .then(handleSuccess)
        .catch(handleError);
    }
  };
}
module.exports = itunesService;
