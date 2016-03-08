var templateservicemod = angular.module('templateservicemod', []);
templateservicemod.service('TemplateService', function() {
  this.title = "Home";
  this.meta = "Google";
  this.metadesc = "Home";

  var d = new Date();
  this.year = d.getFullYear();

  this.init = function() {
    this.headermenu = "views/headermenu.html";
    this.header = "views/header.html";
    this.menu = "views/menu.html";
    this.slider = "views/slider.html";
    this.content = "views/content/content.html";
    this.footermenu = "views/footermenu.html";
    this.footer = "views/footer.html";
    this.headerBar = "views/headerbar.html";
  };

  this.changecontent = function(page) {
    this.init();
    var data = this;
    data.content = "views/content/" + page + ".html";
    return data;
  };

  this.init();

});

templateservicemod.controller('filterctrl', ['$scope', 'TemplateService',
  function($scope, TemplateService, MainJson, $rootScope) {
    $scope.filterval = ['views/content/filter.html', 'views/content/sort.html'];
    $scope.filters = [];
    $scope.showfilter = function(data) {
      console.log(data);
      $scope.filters[data] = true;
    };
    $scope.hidefilter = function(data) {
      console.log(data);
      $scope.filters[data] = false;
    };
  }
]);

templateservicemod.controller('cartdropctrl', ['$scope', 'TemplateService',
  function($scope, TemplateService, MainJson, $rootScope) {
    $scope.cartval = ['views/content/cartdropdown.html'];
    $scope.carts = [];
    $scope.showcart = function(data) {
      console.log(data);
      $scope.carts[data] = true;
    };
    $scope.hidecart = function(data) {
      console.log(data);
      $scope.carts[data] = false;
    };
  }
]);
