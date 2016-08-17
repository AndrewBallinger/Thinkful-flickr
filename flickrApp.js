angular.module('FlickrApp', ['ngAnimate'])
  .controller('FlickrCtrl', function($scope, $http){
    var flickr = this;

    var decorateTag = (value) => { return {
      url: "https://api.flickr.com/services/rest",
      method: "GET",
      params: {
        method: 'flickr.photos.search',
        api_key: 'b6c7ec5368dd942c8242a9f31f98bc29',
        tags: value,
        format: 'json',
        nojsoncallback: 1
      }
    }};

    var decoratePhotos = (pile) => {
      return pile.map( (mess) => "https://farm" + mess.farm +
                        ".staticflickr.com/" + mess.server +
                        "/" + mess.id +
                        "_" + mess.secret +
                        ".jpg");
    };

    flickr.decorateStyle = (url) => {
      return {
        "background-image": "url(" + url + ")"
      }
    }
    
    flickr.searchInput = "";
    flickr.prompt = "";
    flickr.photos = [];

    flickr.searchSubmitted = () => {
      flickr.search = flickr.searchInput;
      flickr.prompt = "Searching instagram for photos tagged with " + flickr.search;
      flickr.searchInput = "";
      flickr.photos = [];

      $http( decorateTag(flickr.search) ).then(
        (resp) => flickr.successfulSearch(resp.data.photos),
        (err)  => flickr.failedSearch(err)
      );
      return;
    }

    flickr.successfulSearch = (result) => {
      var total = result.total;
      var photos = result.photo;

      flickr.prompt = "We found " + total + " photos for \"" + flickr.search + "\"";
      if (total > 100) flickr.prompt += ", displaying " + photos.length;

      flickr.photos = decoratePhotos(photos);
    }

    flickr.failedSearch = (err) =>
      flickr.prompt = "Something has gone horrible wrong! " + err;

});
