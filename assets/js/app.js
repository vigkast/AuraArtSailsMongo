// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ui.router',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice'

]);

firstapp.run(function ($rootScope, NavigationService) {
    $rootScope.addToFav = function (artid, folderid) {
        NavigationService.addToFav(artid, function (data, status) {
            console.log(data);
            $.jStorage.set("user", data);
        });
    };
});

firstapp.config(function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, $httpProvider, $locationProvider) {
    //Turn the spinner on or off

    $httpProvider.defaults.withCredentials = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.spinnerTemplate = '<div class="loadingcfp"><div class="in-box"><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>Please wait...</div></div>';
    cfpLoadingBarProvider.includeBar = true;

    $stateProvider

        .state('home', {
            url: "/home",
            templateUrl: "views/template.html",
            controller: 'HomeCtrl'
        })

        .state('feature', {
            url: "/feature",
            templateUrl: "views/template.html",
            controller: 'FeatureCtrl'
        })

        .state('infinite', {
            url: "/infinite",
            templateUrl: "views/template.html",
            controller: 'InfiniteCtrl'
        })

        .state('termcondition', {
            url: "/terms-condition",
            templateUrl: "views/template.html",
            controller: 'TermConditionCtrl'
        })

        .state('buyerstermcondition', {
            url: "/buyers-terms-condition",
            templateUrl: "views/template.html",
            controller: 'BuyersTermConditionCtrl'
        })

        .state('privacypolicy', {
            url: "/privacy-policy",
            templateUrl: "views/template.html",
            controller: 'PrivacyPolicyCtrl'
        })

        .state('commission-sculptures', {
            url: "/commission-sculptures",
            templateUrl: "views/template.html",
            controller: 'CommissionSculpturesCtrl'
        })

        .state('commission-projects', {
            url: "/commission-projects/{active:(?:projects|viewprojects)}",
            templateUrl: "views/template.html",
            controller: 'CommissionProjectsCtrl'
        })

        .state('cart', {
            url: "/cart",
            templateUrl: "views/template.html",
            controller: 'CartCtrl'
        })

        .state('checkout', {
            url: "/checkout",
            templateUrl: "views/template.html",
            controller: 'CheckoutCtrl'
        })

        .state('artist', {
            url: "/artist/:type",
            templateUrl: "views/template.html",
            controller: 'ArtistCtrl'
        })

        .state('artistdetail', {
            url: "/artist/detail/:artistid",
            templateUrl: "views/template.html",
            controller: 'ArtistDetailCtrl'
        })

        .state('detail', {
            url: "/artwork/detail/:artid",
            templateUrl: "views/template.html",
            controller: 'ArtistDetailImageCtrl'
        })

        .state('team', {
            url: "/team",
            templateUrl: "views/template.html",
            controller: 'TeamCtrl'
        })

        .state('artInfrastructure2', {
            url: "/infra-services2",
            templateUrl: "views/template.html",
            controller: 'ArtInfrastructure2Ctrl'
        })

        .state('artInfrastructure', {
            url: "/infra-services",
            templateUrl: "views/template.html",
            controller: 'ArtInfrastructureCtrl'
        })

        .state('artInfrastructureID', {
            url: "/infra-services/:id",
            templateUrl: "views/template.html",
            controller: 'ArtInfrastructureCtrl'
        })


        .state('events', {
            url: "/events",
            templateUrl: "views/template.html",
            controller: 'EventsCtrl'
        })

        .state('invite', {
            url: "/invite/:img",
            templateUrl: "views/template.html",
            controller: 'InviteCtrl'
        })

        .state('eventdetail', {
            url: "/eventdetail/:id",
            templateUrl: "views/template.html",
            controller: 'EventdetailCtrl'
        })

        .state('totalartpage', {
            url: "/artwork/:type",
            templateUrl: "views/template.html",
            controller: 'TotalartWorkCtrl'
        })

        .state('totalartpage2', {
            url: "/artwork/Commissioned/:number",
            templateUrl: "views/template.html",
            controller: 'TotalartWorkCtrl2',

        })

        .state('commissioned-artwork', {
            url: "/commissioned-artwork",
            templateUrl: "views/template.html",
            controller: 'ViewCommissionedCtrl'
        })

        .state('press', {
            url: "/press",
            templateUrl: "views/template.html",
            controller: 'PressCtrl'
        })

        .state('account', {
            url: "/account",
            templateUrl: "views/template.html",
            controller: 'AccountCtrl'
        })

       .state('thoughtleadership', {
            url: "/blog",
            templateUrl: "views/template.html",
            controller: 'ThoughtleadershipCtrl'
        })

        .state('thoughtleadershipdetail', {
            url: "/blog/:id",
            templateUrl: "views/template.html",
            controller: 'ThoughtleadershipdetailCtrl'
        })
        .state('sculpture', {
            url: "/sculpture/:artid",
            templateUrl: "views/template.html",
            controller: 'SculptureCtrl'
        })

        .state('favorite', {
            url: "/favorite",
            templateUrl: "views/template.html",
            controller: 'FavoriteCtrl'
        })

        .state('favorites', {
            url: "/favorite/:artist",
            templateUrl: "views/template.html",
            controller: 'FavoriteCtrl'
        })

        .state('artistpage', {
            url: "/artistpage",
            templateUrl: "views/template.html",
            controller: 'ArtistPageCtrl'
        })

        .state('contactus', {
            url: "/contactus",
            templateUrl: "views/template.html",
            controller: 'ContactusCtrl'
        })

        .state('activities', {
            url: "/activities",
            templateUrl: "views/template.html",
            controller: 'ActivitiesCtrl'
        })

        .state('favorite-product', {
            url: "/favorite-product/:artid",
            templateUrl: "views/template.html",
            controller: 'FavoriteProductCtrl'
        })

        .state('reach-out', {
            url: "/reach-out",
            templateUrl: "views/template.html",
            controller: 'ReachOutCtrl'
        })

        .state('register-artist', {
            url: "/register-artist",
            templateUrl: "views/template.html",
            controller: 'RegisterArtistCtrl'
        })

        .state('editartist', {
            url: "/edit-artist/:id",
            templateUrl: "views/template.html",
            controller: 'EditArtistCtrl'
        })

        .state('create-artwork', {
            url: "/create-artwork",
            templateUrl: "views/template.html",
            controller: 'CreateArtworkCtrl'
        })

        .state('edit-artwork', {
            url: "/edit-artwork/:id",
            templateUrl: "views/template.html",
            controller: 'EditArtworkCtrl'
        })

        .state('searchresults', {
            url: "/searchresults",
            templateUrl: "views/template.html",
            controller: 'SearchResultsCtrl'
        })

        .state('thankyou', {
            url: "/thankyou",
            templateUrl: "views/template.html",
            controller: 'ThankYouCtrl'
        })

        .state('sorry', {
            url: "/sorry/:orderId",
            templateUrl: "views/template.html",
            controller: 'SorryCtrl'
        })

        .state('error404', {
            url: "/error404",
            templateUrl: "views/template.html",
            controller: 'Error404Ctrl'
        })

        .state('error500', {
            url: "/error500",
            templateUrl: "views/template.html",
            controller: 'Error500Ctrl'
        })

        .state('room-with-a-view', {
            url: "/room-with-a-view/:id",
            templateUrl: "views/template.html",
            controller: 'RoomViewCtrl'
        })

        .state('room-shot', {
            url: "/room-shot/:id",
            templateUrl: "views/template.html",
            controller: 'RoomShotCtrl'
        })
        .state('hidden', {
            url: "/iamhidden",
            templateUrl: "views/template.html",
            controller: 'HiddenCtrl'
        });

    if (isproduction) {
        $locationProvider.html5Mode(isproduction);
    }

    $urlRouterProvider.otherwise("/home");

});

firstapp.directive("scroll", function ($window) {
    return function (scope, element, attrs) {
        angular.element($window).bind("scroll", function () {
            if (this.pageYOffset >= 100) {
                element.addClass('min');
            } else {
                element.removeClass('min');
            }
        });
    };
});

firstapp.filter('rawHtml', ['$sce',
    function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }
]);
/*
firstapp.directive('readmores', function ($window) {
    return function (scope, element, attrs) {
        var $element = $(element);
        $element.children(".read-morecont").height(0);
        $element.children(".readmore").click(function () {
            var lastheight = $element.children(".read-morecont").height();
            if (lastheight == 0) {
                var newheight = $element.children(".read-morecont").children(".read-inner").height();
                $element.children(".read-morecont").height(newheight + 40);
            } else {
                $element.children(".read-morecont").height(0);
            }
        });
    };
});*/

firstapp.directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.focusMe, function (value) {
                if (value === true) {
                    console.log('value=', value);
                    //$timeout(function() {
                    element[0].focus();
                    scope[attrs.focusMe] = false;
                    //});
                }
            });
        }
    };
});

firstapp.directive("uiselectAutofocus", function ($timeout) {
    return {
        restrict: 'EA',
        require: 'uiSelect',
        link: function (scope, elem, attr) {
            //         scope.$watch(attr.)
            scope.$watch(attr.demo, function () {
                console.log(attr.demo);
                $timeout(function () {
                    var input = elem.find('input');
                    //                if (attr.uiselectAutofocus == 'open')
                    //                    input.click();
                    input.focus();
                }, 0);
            });
        }
    };
});

firstapp.directive('focus',
    function ($timeout) {
        return {
            scope: {
                trigger: '@focus'
            },
            link: function (scope, element) {
                scope.$watch('trigger', function (value) {
                    if (value === "true") {
                        $timeout(function () {
                            element[0].focus();
                        }, 1000);
                    }
                });
            }
        };
    }
);

firstapp.directive('googlePlusSignin', ['$window',
    function ($window) {
        var ending = /\.apps\.googleusercontent\.com$/;

        return {
            restrict: 'E',
            transclude: true,
            template: '<span></span>',
            replace: true,
            link: function (scope, element, attrs, ctrl, linker) {
                attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');

                attrs.$set('data-clientid', attrs.clientid);
                attrs.$set('theme', attrs.theme);

                // Some default values, based on prior versions of this directive
                var defaults = {
                    callback: 'signinCallback',
                    cookiepolicy: 'single_host_origin',
                    requestvisibleactions: 'http://schemas.google.com/AddActivity',
                    scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                    height: 'standard',
                    width: 'wide',
                    state: ''
                };

                defaults.clientid = attrs.clientid;
                defaults.theme = attrs.theme;

                // Overwrite default values if explicitly set
                angular.forEach(Object.getOwnPropertyNames(defaults), function (propName) {
                    if (attrs.hasOwnProperty(propName)) {
                        defaults[propName] = attrs[propName];
                    }
                });

                // Default language
                // Supported languages: https://developers.google.com/+/web/api/supported-languages
                attrs.$observe('language', function (value) {
                    $window.___gcfg = {
                        lang: value ? value : 'en'
                    };
                });

                // Asynchronously load the G+ SDK.
                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = 'https://apis.google.com/js/client:plusone.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);

                linker(function (el, tScope) {
                    po.onload = function () {
                        if (el.length) {
                            element.append(el);
                        }
                        gapi.signin.render(element[0], defaults);
                    };
                });
            }
        };
    }
]).run(['$window', '$rootScope',
    function ($window, $rootScope) {
        $window.signinCallback = function (authResult) {
            if (authResult && authResult.access_token) {
                $rootScope.$broadcast('event:google-plus-signin-success', authResult);
            } else {
                $rootScope.$broadcast('event:google-plus-signin-failure', authResult);
            }
        };
    }
]);

var dem = 0;

firstapp.directive('fancyboxBox', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            var target;
            if (attr.rel) {
                target = $("[rel='" + attr.rel + "']");
            } else {
                target = element;
            }

            target.fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                padding: '0',
                closeBtn: true,
                helpers: {
                    media: {}
                }
            });
        }
    };
});


firstapp.directive('elevateZoom', function ($document, $filter) {
    return {
        restrict: 'EA',
        link: function ($scope, element, attr) {
            $scope.$watch(attr.image, function () {
                $scope.changeImage = function () {
                    var $element = $(element);
                    var image = '';
                    image = $scope[attr.image].artwork.image[0];
                    var ez = $element.data("elevateZoom");
                    if (!ez) {
                        $element.attr('data-zoom-image', $filter('uploadpath')(image));
                        $element.attr('src', $filter('uploadpath')(image));
                        $element.elevateZoom();
                    } else {
                        var newImage = $filter('uploadpath')(image);
                        ez.swaptheimage(newImage, newImage);
                    }
                };
                $scope.$on('changeImage', function (event, data) {
                    $scope.changeImage();
                });
                $scope.changeImage();
            });
        }
    };
});

firstapp.directive('uploadImage', function ($http, $filter) {
    return {
        templateUrl: 'views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "=ngCallback"
        },
        link: function ($scope, element, attrs) {

            $scope.showImage = function () {
                console.log($scope.image);
            };


            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }

            $scope.$watch("image", function (newVal, oldVal) {
                if (newVal && newVal.file) {
                    $scope.uploadNow(newVal);
                }
            });

            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                $scope.uploadStatus = "uploading";

                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {
                    if ($scope.callback) {
                        $scope.callback(data);
                    } else {
                        $scope.uploadStatus = "uploaded";
                        if ($scope.isMultiple) {
                            if ($scope.inObject) {
                                $scope.model.push({
                                    "image": data.data[0]
                                });
                            } else {
                                $scope.model.push(data.data[0]);
                            }
                        } else {
                            $scope.model = data.data[0];
                        }
                    }
                });
            };
        }
    };
});

firstapp.directive('zoomContainer', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$on('$stateChangeSuccess', function () {
                var target = element.children('div.zoomContainer').remove();
            });
        }
    };

});

firstapp.filter('uploadthumbnail', function () {
    return function (input) {
        if (input && input !== "") {
            return adminurl + "user/resize?height=190&file=" + input;
            // return adminurl + "user/resize?file=" + input;
        } else {
            return "img/noimg.jpg";
        }
    };
});

firstapp.filter('wallpath', function () {
    return function (input) {
        if (input && input !== "") {
            if (input.indexOf('img/') == -1) {
                return adminurl + "user/wallResize?width=1500&file=" + input;
            } else {
                return input;
            }
        } else {
            return "img/noimg.jpg";
        }
    };
});

firstapp.filter('uploadpath', function () {
    return function (input) {
        if (input && input !== "") {
            if (input.indexOf('.jpg') != -1)
                return adminurl + "user/resize?width=1200&file=" + input;
            else {
                return adminurl + "user/resize?file=" + input;
            }
        } else {
            return "img/noimg.jpg";
        }
    };
});

firstapp.filter('uploadsmallimage', function () {
    return function (input) {
        if (input && input !== "") {
            // return adminurl + "user/resize?file=" + input;
            return adminurl + "user/resize?width=750&file=" + input;
        } else {
            return "img/noimg.jpg";
        }
    };
});

firstapp.filter('roompath', function () {
    return function (input) {
        if (input && input !== "") {
            if (input.indexOf('.jpg') != -1)
                return adminurl + "slider/resizeRoom?file=" + input;
            else {
                return adminurl + "slider/resizeRoom?file=" + input;
            }
        } else {
            return "img/noimg.jpg";
        }
    };
});
firstapp.filter('imgPdf',function(){
return function (pdfmade){

   var isPdf=pdfmade.indexOf(".pdf");
   console.log(pdfmade,isPdf);
   if(isPdf==-1){
       console.log("false");
       return false;
   }else{
       return true;
       console.log("true");
   }
}
});
firstapp.directive('img', function ($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            if (!attrs.noloading) {
                $element.after("<img src='img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function () {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
});
firstapp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^a-z\s]/gi, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

firstapp.filter('touppercase', function () {
    return function (input) {
        var firstletter = input.substr(0, 1);
        var remaining = input.substr(1);
        return firstletter.toUpperCase() + remaining;
    };
});

firstapp.filter('makesizestr', function () {
    return function (artobj) {
        var size = "";
        if (artobj && artobj !== undefined) {
            if (artobj.height && artobj.height !== "") {
                size += artobj.height;
            }
            if (artobj.width && artobj.width !== "") {
                size += " " + artobj.width;
            }
            if (artobj.breadth && artobj.breadth !== "" && artobj.breadth != "N/A") {
                size += " " + artobj.breadth;
            }
            size = size.trim();
            size = size.split(" ").join(" x ");
            size += " inches";
            if (artobj.dim) {
                size += " (" + artobj.dim + ")";
            }
            return size;
        } else {
            return "";
        }
    };
});


firstapp.filter('showheart', function (NavigationService) {
    return function (input) {
        if (input) {
            if (userProfile.wishlist) {
                var ispresent = _.findIndex(userProfile.wishlist, {
                    'artwork': input
                });
                if (ispresent != -1) {
                    return "fa fa-heart font-color3";
                } else {
                    return "fa fa-heart";
                }
            } else {
                return "fa fa-heart";
            }
        }
    };
});

firstapp.filter('indollars', function (NavigationService, $filter) {
    return function (input) {
        if (input && dollarPrice) {
            if (input != "0") {
                var price = parseFloat(input) / parseFloat(dollarPrice);
                return $filter('number')(Math.round(price));
            } else
                return 0.00;
        } else {
            return 0.00;
        }
    };
});

firstapp.filter('inlakhs', function (NavigationService, $filter) {
    return function (input) {
        if (input) {
            if (input != "0") {
                var x = input;
                x = x.toString();
                var afterPoint = '';
                if (x.indexOf('.') > 0)
                    afterPoint = x.substring(x.indexOf('.'), x.length);
                x = Math.floor(x);
                x = x.toString();
                var lastThree = x.substring(x.length - 3);
                var otherNumbers = x.substring(0, x.length - 3);
                if (otherNumbers !== '')
                    lastThree = ',' + lastThree;
                var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
                return res;
            } else
                return 0;
        } else {
            return 0;
        }
    };
});

firstapp.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                var digits;
                if (val) {
                    if (attr.type == "tel") {
                        digits = val.replace(/[^0-9\+\\]/g, '');
                    } else {
                        digits = val.replace(/[^0-9\-\\]/g, '');
                    }


                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});

firstapp.directive('clickme', function () {
    return function (scope, element, attrs) {
        var clickingCallback = function () {
            console.log(userProfile);
            alert(userProfile);
        };
        element.bind('click', clickingCallback);
    };
});

firstapp.directive('wallRatio', function () {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            var width = $(element).width(); // width is 13.33ft.
            var height = (width) / 1.33; // height is 10ft.
            $('.height-holder').css('height', height);
        }
    };
});

firstapp.directive('youtube', function ($sce) {
    return {
        restrict: 'A',
        scope: {
            code: '='
        },
        replace: true,
        template: '<iframe id="popup-youtube-player" style="overflow:hidden;width:100%" width="100%" height="130px" src="{{url}}" frameborder="0" allowscriptaccess="always" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>',
        link: function (scope) {
            scope.$watch('code', function (newVal) {
                if (newVal) {
                    scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
                }
            });
        }
    };
});

var formvalidation = function (allvalidation) {
    console.log(allvalidation);
    var isvalid2 = true;
    var error = '';
    for (var i = 0; i < allvalidation.length; i++) {
        console.log(allvalidation[i].field);
        if (allvalidation[i].field === "" || !allvalidation[i].field) {
            allvalidation[i].validation = "ng-dirty";
            if (error === '') {
                error += allvalidation[i].name;
            } else {
                error += " , " + allvalidation[i].name;
            }
            isvalid2 = false;
        }
    }
    return isvalid2;
};

firstapp.filter('addhighlight', function () {
    return function (str, searchkey) {
        if (!str) {
            return str;
        }
        if (!searchkey) {
            return str;
        }
        var newstr = str.toLowerCase();
        var smallSearchkey = searchkey.toLowerCase();
        var num = 0;
        var check = false;
        var string2 = "";
        if (smallSearchkey && smallSearchkey !== "") {
            var split = newstr.split(" ");
            _.each(split, function (n) {
                var subst = n.substr(0, searchkey.length);
                var subst2 = n.substr(searchkey.length);
                var abc = "";
                if (smallSearchkey == subst) {
                    check = true;
                    abc = "<span class='ui-select-highlight'>" + searchkey + "</span>" + subst2;
                } else {
                    abc = n + " ";
                }
                string2 += abc + " ";
            });
        }
        if (check) {
            return string2;
        } else {
            return str;
        }
    };
});


var clearFields = function (allvalidation) {
    var isvalid2 = true;
    var error = '';
    for (var i = 0; i < allvalidation.length; i++) {
        allvalidation[i].field = "";
    }
    return isvalid2;
};

firstapp.directive('wallBuilder', function ($http) {
    return {
        templateUrl: 'views/directive/wallbuilder.html',
        scope: {
            model: '=ngModel'
        },
        link: function ($scope, element, attrs) {
            $scope.getTimes = function (n) {
                if (n) {
                    n = Math.ceil(n);
                    return new Array(n);
                } else {
                    return new Array(0);
                }
            };
            $scope.updateWall = function () {};
            $scope.updateWall();
            $scope.$on('updateWall', function (event, data) {
                $scope.updateWall();
            });
        }
    };
});
