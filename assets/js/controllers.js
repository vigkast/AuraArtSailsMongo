var dataNextPre = {};
var userProfile = {};
var uploadres = [];
var dollarPrice = '';
var globalFunction = {};

var top = 200;
var duration = 2000;

var offset = 70;
globalFunction.tab = "info";

angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ui.bootstrap', 'cfp.loadingBar', 'infinite-scroll', 'duScroll', 'toaster', 'ngAnimate', 'ngAutocomplete', 'ngDialog', 'valdr', 'ngSanitize', 'ui.select', 'angular-flexslider', 'ui-rangeSlider', 'angularFileUpload'])

//.controller('AppCtrl')
.controller('HomeCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $location, $state, $stateParams, ngDialog) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("home");
    $scope.menutitle = NavigationService.makeactive("Home");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.filterby = {};
    $scope.filterby.search = "";
    $scope.filterby.type = "";
    $scope.filterby.pagenumber = 1;
    $scope.filterby.pagesize = 20;
    $scope.filterby.filter = "srno";
    $scope.filterby.sort = 1;
    $scope.filterby.minprice = 0;
    $scope.filterby.maxprice = 10000000;
    $scope.filterby.minwidth = '';
    $scope.filterby.maxwidth = '';
    $scope.filterby.minheight = '';
    $scope.filterby.maxheight = '';
    $scope.filterby.minbreadth = '';
    $scope.filterby.maxbreadth = '';
    $scope.showInvalidLogin = false;
    //  $scope.filterby.color = '';
    //  $scope.filterby.style = '';
    //  $scope.filterby.element = '';
    NavigationService.getSlider(function(data) {
        $scope.slides = data;
    });

    $scope.openPop = function() {
        dataNextPre.messageBoxSignUp();
    }

    $scope.toPayU = function() {
        console.log("in payu");
        window.location.href = "http://www.auraart.in/PayUMoney_PHP_Module/PayUMoney_form.php";
    }

    $scope.becomeSeller = function() {
        globalFunction.becomeSeller();
        // if ($scope.isLoggedIn == true) {
        //   if (userProfile && userProfile.accesslevel == "reseller") {
        //     $state.go("create-artwork");
        //   } else {
        //     $state.go("termcondition");
        //   }
        // } else {
        //   ngDialog.open({
        //     template: 'views/content/sellerRegister.html'
        //   });
        // }
    }

    $scope.registeruser = function() {
        if ($scope.register.password === $scope.register.confirmpassword) {
            $scope.passwordNotMatch = false;
            $scope.register.accesslevel = "customer";
            NavigationService.registeruser($scope.register, function(data, status) {
                console.log(data);
                if (data.value != false) {
                    $scope.showAlreadyRegistered = false;
                    $scope.showWishlist = true;
                    //$.jStorage.set("user", data);
                    ngDialog.closeAll();
                    $state.go("termcondition");
                } else if (data.value == false && data.comment == "User already exists") {
                    $scope.showAlreadyRegistered = true;
                }
            })
        } else {
            $scope.passwordNotMatch = true;
        }
    };

    $scope.lauchedSoon = function() {
        ngDialog.open({
            template: 'views/content/modal-launch.html'
        });
        $timeout(function() {
            ngDialog.closeAll();
        }, 3000);
    };

    $scope.userlogin = function() {
        NavigationService.userlogin($scope.login, function(data, status) {
            if (data.value != false) {
                $scope.showInvalidLogin = false;
                NavigationService.getuserprofile(function(data) {
                    ngDialog.closeAll();
                    if (data.id && data.accesslevel == "reseller") {
                        $state.go("create-artwork");
                    } else {
                        $state.go("termcondition");
                    }
                })
            } else {
                $scope.showInvalidLogin = true;
            }


            // if (data.value != false) {
            //     $scope.showInvalidLogin = false;
            //     $scope.showWishlist = true;
            //     //$.jStorage.set("user", data);
            //     $scope.user.name = data.name;
            //     ngDialog.closeAll();
            //     window.location.reload();
            // } else {
            //     $scope.showInvalidLogin = true;
            // }
        })
    };

    $scope.showLogin = true;
    $scope.changeTab = function(tab) {
        console.log(tab);
        if (tab == 1) {
            $scope.showLogin = false;
        } else {
            $scope.showLogin = true;
        }
    }

    function getPress(data) {

        if (data.value != false) {
            $scope.press = data
            console.log(data);
        } else {
            $scope.press = [];
        }
    }
    NavigationService.pressFind(getPress);

    NavigationService.getupcomingevents(function(data) {
        if (data.value != false)
            $scope.upcomingEvent = data;
        console.log(data);
    });

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            $scope.isLoggedIn = true;
            userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                userProfile.wishlist = favorite;
            })
        } else {
            $scope.isLoggedIn = false;
        }
    })

    $scope.onfock = "";
    $scope.oon = function() {
        if ($scope.onfock == "") {
            $scope.onfock = "sdfs";
        } else {
            $scope.onfock = "";
        }
    }
    dataNextPre.setData = function(data) {
        //      console.log(data);
    }
    $scope.changeUI = 0;
    // set available range
    $scope.minPrice = 0;
    $scope.maxPrice = 10000000;

    // default the user's values to the available range
    $scope.userMinPrice = $scope.minPrice;
    $scope.userMaxPrice = $scope.maxPrice;

    //    NavigationService.getsliderimages(function (data, status) {
    //        _.each(data, function (n) {
    //            $scope.slides.push(n._id);
    //        })
    //    });

    $scope.applyfilter = function() {
        //      console.log($scope.filterby);
        console.log($scope.filterby);
        $.jStorage.set("filterby", $scope.filterby)
            //      $location.url("/artwork/-1");
        $state.go('totalartpage', {
            type: -1
        });
    }

    $scope.goToArtworks = function(type) {
        //      $location.url("/artwork/" + type);
        $state.go('totalartpage', {
            type: type
        });
    }

    $scope.goToEvents = function() {
        $state.go('events');
    }

    $scope.onclick = function(value) {
        $scope.filterby.checked
    }
    var lastChecked = null
    $scope.onclick = function(event) {
        if (event.target.value === lastChecked) {
            $scope.filterby.type = "";
            $scope.getallartist();
            lastChecked = null
        } else {
            lastChecked = event.target.value
        }
    }
    $scope.changetype = function(chang) {
        if (chang == 1) {
            $scope.filterby.type = "Paintings";
            $scope.getallartist();
            $scope.getmedium();
            $scope.getClr();
            $scope.getElm();
            $scope.getStl();
        } else if (chang == 2) {
            $scope.filterby.type = "Sculptures";
            $scope.getallartist();
            $scope.getmedium();
            $scope.getClr();
            $scope.getElm();
            $scope.getStl();
        } else if (chang == 3) {
            $scope.filterby.type = "Photographs";
            $scope.getallartist();
            $scope.getmedium();
            $scope.getClr();
            $scope.getElm();
            $scope.getStl();
        } else if (chang == 4) {
            $scope.filterby.type = "Prints";
            $scope.getallartist();
            $scope.getmedium();
            $scope.getClr();
            $scope.getElm();
            $scope.getStl();
        }
    }
    $scope.setSearch = function(select) {
        $scope.filterby.search = select.selected.name;
    }
    $scope.setMediumSearch = function(select) {
        $scope.filterby.medium = select.selected.name;
    }
    $scope.setColorSearch = function(select) {
        $scope.filterby.color = select.selected.name;
    }
    $scope.setStyleSearch = function(select) {
        $scope.filterby.style = select.selected.name;
    }
    $scope.setElementSearch = function(select) {
        $scope.filterby.element = select.selected.name;
    }
    $scope.allartist = [];
    $scope.allmedium = [];
    $scope.getmedium = function() {
        if ($scope.filterby.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.getallmedium($scope.change, function(data, status) {
                if (data && data.value != false) {
                    $scope.allmedium = _.uniq(data, '_id');
                } else {
                    $scope.allmedium = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.filterby.type;
            NavigationService.getallmedium($scope.change, function(data, status) {
                if (data && data.value != false) {
                    $scope.allmedium = _.uniq(data, '_id');
                } else {
                    $scope.allmedium = [];
                }
            });
        }
    }

    $scope.getClr = function() {
        if ($scope.filterby.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allColor = _.uniq(data, '_id');
                    $scope.allColor.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allColor = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.filterby.type;
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allColor = _.uniq(data, '_id');
                    $scope.allColor.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allColor = [];
                }
            });
        }
    }
    $scope.getStl = function() {
        if ($scope.filterby.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allStyle = _.uniq(data, '_id');
                    $scope.allStyle.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allStyle = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.filterby.type;
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allStyle = _.uniq(data, '_id');
                    $scope.allStyle.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allStyle = [];
                }
            });
        }
    }
    $scope.getElm = function() {
        if ($scope.filterby.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allElement = _.uniq(data, '_id');
                    $scope.allElement.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allElement = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.filterby.type;
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allElement = _.uniq(data, '_id');
                    $scope.allElement.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allElement = [];
                }
            });
        }
    }
    $scope.getClr();
    $scope.getElm();
    $scope.getStl();
    var countcall = 0;
    $scope.getallartist = function() {
        if ($scope.filterby.type == "") {
            NavigationService.getAllArtistByAccess(++countcall, function(data, status, n) {
                if (n == countcall) {
                    if (data && data.value != false) {
                        $scope.allartist = _.uniq(data, '_id');
                        $scope.allartist.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allartist = [];
                    }
                } else {
                    $scope.allartist = [];
                }
            });
        } else {
            NavigationService.userbytype($scope.filterby.type, ++countcall, function(data, status, n) {
                if (n == countcall) {
                    if (data && data.value != false) {
                        $scope.allartist = data;
                        $scope.allartist.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allartist = [];
                    }
                } else {
                    $scope.allartist = [];
                }

            });
        }
    }
    $scope.getDropdown = function(search) {
        if (search.length >= 1) {
            $scope.change = {};
            $scope.change.type = $scope.filterby.type;
            $scope.change.search = search;
            $timeout(function() {
                NavigationService.getAllArtistDrop($scope.change, function(data) {
                    console.log(data);
                    if (data && data.value != false) {
                        $scope.allartist = data;
                        $scope.allartist.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allartist = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getallartist();
        }
    }
    $scope.getDropdownMedium = function(search) {
        if (search.length >= 1) {
            $scope.change = {};
            $scope.change.type = $scope.filterby.type;
            $scope.change.search = search;
            $timeout(function() {
                NavigationService.getallmedium($scope.change, function(data) {
                    if (data && data.value != false) {
                        $scope.allmedium = data;
                        $scope.allmedium.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allmedium = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getmedium();
        }
    }

    //search by keyword

    $scope.getColorDropdown = function(search) {
        if (search.length >= 1) {
            $timeout(function() {
                NavigationService.tagSearchType($scope.filterby.type, search, function(data) {
                    if (data && data.value != false) {
                        $scope.allColor = data;
                    } else {
                        $scope.allColor = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getClr();
        }
    }
    $scope.getStyleDropdown = function(search) {
        if (search.length >= 1) {
            $timeout(function() {
                NavigationService.tagSearchType($scope.filterby.type, search, function(data) {
                    if (data && data.value != false) {
                        $scope.allStyle = data;
                    } else {
                        $scope.allStyle = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getStl();
        }
    }
    $scope.getElementDropdown = function(search) {
        if (search.length >= 1) {
            $timeout(function() {
                NavigationService.tagSearchType($scope.filterby.type, search, function(data) {
                    if (data && data.value != false) {
                        $scope.allElement = data;
                    } else {
                        $scope.allElement = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getElm();
        }
    }

})

.controller('FavoriteCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $state, $stateParams, ngDialog) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("favorite");
    $scope.menutitle = NavigationService.makeactive("Favorite");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.artistdetail = [];
    $scope.allfavourites = [];
    $scope.noFavs = false;
    cfpLoadingBar.start();
    $scope.totalfav = 0;
    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            userProfile = data;
            $scope.userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                console.log(favorite);
                if (favorite.value != false) {
                    $scope.noFavs = false;
                    userProfile.wishlist = favorite;
                    _.each(favorite, function(n) {
                        if (n.wishlistfolder) {
                            $scope.allfavourites.push({
                                "_id": n.artwork,
                                "wishlistfolder": n.wishlistfolder
                            });
                        } else {
                            $scope.totalfav++;
                            $scope.allfavourites.push({
                                "_id": n.artwork
                            });
                        }
                    });
                    getFavorite($scope.allfavourites)
                } else {
                    cfpLoadingBar.complete();
                    $scope.noFavs = true;
                }
            })
        }
    })

    $scope.activeTab = "myfav";

    function getFavorite(allfavourites) {
        $scope.myArtists = [];
        NavigationService.getAllFavouritesData(allfavourites, function(datas, status) {
            console.log("favorite data");
            console.log(datas)
            var favs = _.groupBy(datas, function(n) {
                return n.name;
            });
            _.each(favs, function(key, value) {
                _.each(key, function(n) {
                    if (!n.wishlistfolder) {
                        $scope.myArtists.push(value);
                    }
                })
            })
            $scope.myArtists = _.uniq($scope.myArtists);
            if (!$stateParams.artist) {
                $scope.artistName = '';
                $scope.artistdetail = datas;
            } else {
                $scope.activeTab = "myartist";
                $scope.artistName = $stateParams.artist;
                $scope.artistdetail = [];
                _.each(datas, function(n) {
                    if (n.name === $stateParams.artist)
                        $scope.artistdetail.push(n);
                });
                if ($scope.artistdetail.length == 0) {
                    $scope.activeTab = "myfolder";
                    $scope.artistName = $scope.myFolders[_.findIndex($scope.myFolders, {
                        "_id": $stateParams.artist
                    })].name;
                    _.each(datas, function(n) {
                        if (n.wishlistfolder == $stateParams.artist) {
                            delete n.wishlistfolder;
                            $scope.artistdetail.push(n);
                        }
                    });
                }
            }
            if ($scope.artistdetail.length == 0) {
                $scope.noFavsFolder = true;
            } else {
                $scope.noFavsFolder = false;
            }
            cfpLoadingBar.complete();
        })
    }

    $scope.addToCart = function(art) {
        dataNextPre.addToCart(art);
    }

    $scope.goToDetail = function(artwork) {
        console.log(artwork);
        if (artwork.type == "Sculptures") {
            //          $location.url("/sculpture/" + artwork._id);
            $state.go('sculpture', {
                artid: artwork._id
            });
        } else {
            //          $location.url("/artwork/detail/" + artwork._id);
            $state.go('detail', {
                artid: artwork._id
            });
        }
    }

    $scope.openFolderPop = function() {
        ngDialog.open({
            scope: $scope,
            template: 'views/content/modal-create.html'
        });
    }

    $scope.createFolder = function(name) {
        if (name && name != '') {
            ngDialog.closeAll();
            if ($scope.userProfile.id) {
                NavigationService.createwishlistfolder(name, function(data) {
                    console.log(data);
                    if (data.value == true) {
                        getMyFolders();
                    }
                })
            }
        }
    }

    function getMyFolders() {
        NavigationService.getMyFolders(function(data) {
            console.log(data);
            if (data.value != false) {
                $scope.myFolders = data;
            } else {
                $scope.myFolders = [];
            }
        })
    }
    getMyFolders();
})

.controller('CartCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $state) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("cart");
    $scope.menutitle = NavigationService.makeactive("Cart");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.totalCartPrice = 0;
    $scope.noCartItems = false;
    cfpLoadingBar.start();
    $scope.checkCheckout = true;

    $scope.getCartItems = function() {
        NavigationService.getCartItems(function(data) {
            console.log(data);
            if (data.length == 0) {
                $scope.noCartItems = true;
            } else {
                $scope.noCartItems = false;
                $scope.cartItems = data;
                $scope.totalCartPrice = 0;
                _.each($scope.cartItems, function(n) {
                    if (n.artwork.status == "sold") {
                        $scope.checkCheckout = false;
                    }
                    if (n.artwork.gprice != 'N/A')
                        $scope.totalCartPrice += n.artwork.gprice;
                });
                $scope.vat = ($scope.totalCartPrice / 100) * 12.5;
            }
            cfpLoadingBar.complete();
        });
    }

    $scope.getCartItems();

    $scope.toCheckout = function() {
        $scope.checkCheckout = true;
        _.each($scope.cartItems, function(n) {
            if (n.artwork.status == "sold") {
                $scope.checkCheckout = false;
            }
        });
        if ($scope.checkCheckout == false) {
            dataNextPre.messageBox("Item in cart already sold, Recheck cart");
        } else {
            $state.go("checkout");
        }
    }

    $scope.removeFromCart = function(artid) {
        NavigationService.removeFromCart(artid, function(data) {
            console.log(data);
            if (data.value == true) {
                dataNextPre.messageBox("Removed from cart");
                dataNextPre.getCartItems();
                $scope.getCartItems();
            }
        })
    }

})

.controller('TeamCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("team");
    $scope.menutitle = NavigationService.makeactive("Team");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
})

.controller('ArtistPageCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("artistpage");
    $scope.menutitle = NavigationService.makeactive("Artist");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
})

.controller('ContactusCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("contactus");
    $scope.menutitle = NavigationService.makeactive("Contact Us");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.becomeSeller = function() {
        globalFunction.becomeSeller();
    }
})

.controller('TotalartWorkCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, ngDialog, $stateParams, $location, $state) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("totalartwork");
    $scope.menutitle = NavigationService.makeactive("Total Artwork");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.pagedata = {};
    $scope.pagedata.search = "";
    $scope.pagedata.type = "";
    $scope.pagedata.medium = "";
    $scope.pagedata.pagenumber = 1;
    $scope.pagedata.pagesize = 20;
    $scope.pagedata.filter = "";
    $scope.pagedata.sort = 1;
    $scope.pagedata.minprice = '';
    $scope.pagedata.maxprice = '';
    $scope.pagedata.minwidth = '';
    $scope.pagedata.maxwidth = '';
    $scope.pagedata.minheight = '';
    $scope.pagedata.maxheight = '';
    $scope.pagedata.minbreadth = '';
    $scope.pagedata.maxbreadth = '';
    $scope.totalartcont = [];
    $scope.maxpages = 2;
    $scope.callinfinite = true;
    $scope.isRed = false;
    $scope.heartClass = "fa fa-heart";
    var lastpage = 2;

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                userProfile.wishlist = favorite;
            })
        }
    })

    $scope.openReachout = function() {
        globalFunction.reachOut();
    }

    //get user details
    $scope.setColorSearch = function(select) {
        $scope.pagedata.color = select.selected.name;
    }
    $scope.setStyleSearch = function(select) {
        $scope.pagedata.style = select.selected.name;
    }
    $scope.setElementSearch = function(select) {
        $scope.pagedata.element = select.selected.name;
    }

    $scope.getClr = function() {
        if ($scope.pagedata.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allColor = _.uniq(data, '_id');
                    $scope.allColor.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allColor = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.pagedata.type;
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allColor = _.uniq(data, '_id');
                    $scope.allColor.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allColor = [];
                }
            });
        }
    }
    $scope.getStl = function() {
        if ($scope.pagedata.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allStyle = _.uniq(data, '_id');
                    $scope.allStyle.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allStyle = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.pagedata.type;
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allStyle = _.uniq(data, '_id');
                    $scope.allStyle.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allStyle = [];
                }
            });
        }
    }
    $scope.getElm = function() {
        if ($scope.pagedata.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allElement = _.uniq(data, '_id');
                    $scope.allElement.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allElement = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.pagedata.type;
            NavigationService.tagSearchType($scope.change, "", function(data, status) {
                if (data && data.value != false) {
                    $scope.allElement = _.uniq(data, '_id');
                    $scope.allElement.unshift({
                        "_id": "0",
                        name: ""
                    });
                } else {
                    $scope.allElement = [];
                }
            });
        }
    }
    $scope.getClr();
    $scope.getElm();
    $scope.getStl();

    $scope.getColorDropdown = function(search) {
        if (search.length >= 1) {
            $timeout(function() {
                NavigationService.tagSearchType($scope.pagedata.type, search, function(data) {
                    if (data && data.value != false) {
                        $scope.allColor = data;
                    } else {
                        $scope.allColor = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getClr();
        }
    }
    $scope.getStyleDropdown = function(search) {
        if (search.length >= 1) {
            $timeout(function() {
                NavigationService.tagSearchType($scope.pagedata.type, search, function(data) {
                    if (data && data.value != false) {
                        $scope.allStyle = data;
                    } else {
                        $scope.allStyle = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getStl();
        }
    }
    $scope.getElementDropdown = function(search) {
        if (search.length >= 1) {
            $timeout(function() {
                NavigationService.tagSearchType($scope.pagedata.type, search, function(data) {
                    if (data && data.value != false) {
                        $scope.allElement = data;
                    } else {
                        $scope.allElement = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getElm();
        }
    }
    var countcall = 0;
    $scope.getallartist = function() {
        if ($scope.pagedata.type == "") {
            NavigationService.getAllArtistByAccess(++countcall, function(data, status, n) {
                if (n == countcall) {
                    if (data && data.value != false) {
                        $scope.allartist = _.uniq(data, '_id');
                        $scope.allartist.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allartist = [];
                    }
                } else {
                    $scope.allartist = [];
                }
            });
        } else {
            NavigationService.userbytype($scope.pagedata.type, ++countcall, function(data, status, n) {
                if (n == countcall) {
                    if (data && data.value != false) {
                        $scope.allartist = data;
                        $scope.allartist.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allartist = [];
                    }
                } else {
                    $scope.allartist = [];
                }
            });
        }
    }

    $scope.getmedium = function() {
        if ($scope.pagedata.type == "") {
            //          console.log("in if");
            $scope.change = "";
            NavigationService.getallmedium($scope.change, function(data, status) {
                if (data && data.value != false) {
                    $scope.allmedium = _.uniq(data, '_id');
                } else {
                    $scope.allmedium = [];
                }
            });
        } else {
            //          console.log("in else");
            $scope.change = {};
            $scope.change.type = $scope.pagedata.type;
            NavigationService.getallmedium($scope.change, function(data, status) {
                if (data && data.value != false) {
                    $scope.allmedium = _.uniq(data, '_id');
                } else {
                    $scope.allmedium = [];
                }
            });
        }
    }
    $scope.getallartist();
    $scope.getDropdown = function(search) {
        if (search.length >= 1) {
            $scope.change = {};
            $scope.change.type = $scope.pagedata.type;
            $scope.change.search = search;
            $timeout(function() {
                NavigationService.getAllArtistDrop($scope.change, function(data) {
                    if (data && data.value != false) {
                        $scope.allartist = data;
                        $scope.allartist.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allartist = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getallartist();
        }
    }

    $scope.getDropdownMedium = function(search) {
        if (search.length >= 1) {
            $scope.change = {};
            $scope.change.type = $scope.pagedata.type;
            $scope.change.search = search;
            $timeout(function() {
                NavigationService.getallmedium($scope.change, function(data) {
                    if (data && data.value != false) {
                        $scope.allmedium = data;
                        $scope.allmedium.unshift({
                            "_id": "0",
                            name: ""
                        });
                    } else {
                        $scope.allmedium = [];
                    }
                });
            }, 1000);
        } else {
            $scope.getmedium();
        }
    }

    $scope.setSearch = function(select) {
        $scope.pagedata.search = select.selected.name;
    }
    $scope.setMediumSearch = function(select) {
        $scope.pagedata.medium = select.selected.name;
    }

    $scope.typejson = [{
        name: "All",
        class: "actives"
    }, {
        name: "Paintings",
        class: ""
    }, {
        name: "Sculptures",
        class: ""
    }, {
        name: "Photographs",
        class: ""
    }, {
        name: "Prints",
        class: ""
    }, {
        name: "Others",
        class: ""
    }]

    $scope.changeHeartColor = function(totalartcont) {
        if ($scope.isRed == true)
            totalartcont.heartClass = "fa fa-heart";
        else
            totalartcont.heartClass = "fa fa-heart font-color3";
        $scope.isRed = !$scope.isRed;
    }

    $scope.makeFav = function(art) {
        dataNextPre.favorite(art);
    }

    $scope.addToCart = function(art) {
        dataNextPre.addToCart(art);
    }

    $scope.checkForEmpty = function() {

    }

    $scope.reload = function() {
        cfpLoadingBar.start();
        //      console.log($scope.pagedata);
        var filterdata = $scope.pagedata;
        if (filterdata.minprice == 0) {
            filterdata.minprice = '';
            $scope.pagedata.minprice = '';
        }
        if (filterdata.maxprice == 10000000) {
            filterdata.maxprice = '';
            $scope.pagedata.maxprice = '';
        }

        if (filterdata.sort == 1) {
            $scope.lotactive = '';
            $scope.htlactive = '';
            $scope.lthactive = '';
        }
        NavigationService.artworktype(filterdata, function(data, status) {
            // console.log(data.data);
            lastpage = parseInt(data.totalpages);
            // $scope.totalartcont = _.union($scope.totalartcont, data.data);
            _.each(data.data, function(n) {
                n.artwork.pageno = data.page;
                $scope.totalartcont.push(n);
            });
            $scope.totalartcont = _.uniq($scope.totalartcont, 'artwork._id');
            $scope.callinfinite = false;
            cfpLoadingBar.complete();
        });
    }

    //    $scope.reload();

    $scope.makeactive = function(type) {
        //      console.log(type);
        _.each($scope.typejson, function(n) {
            var index = n.name.indexOf(type);
            if (index != -1) {
                n.class = "actives";
            } else {
                n.class = "";
            }
        })
        if (type == "All")
            type = "";
        $scope.pagedata.type = type;
        $scope.totalartcont = [];
        $scope.pagedata.pagenumber = 1;
        // $scope.pagedata.search = '';
        $scope.pagedata.filter = "srno";
        $scope.pagedata.sort = 1;
        // $scope.pagedata.medium = '';
        $scope.checkForEmpty();
        $scope.reload();
    }

    //    $scope.loadMore = function () {
    //        $scope.pagedata.pagenumber++;
    //        if ($scope.pagedata.pagenumber <= $scope.totalpagecount) {
    //            $scope.reload();
    //        }
    //    };

    $scope.filterresults = function(search) {
        //      console.log(search);
        $scope.pagedata.search = _.capitalize(search);
        $scope.totalartcont = [];
        $scope.pagedata.pagenumber = 1;
        $scope.pagedata.filter = "srno";
        $scope.pagedata.sort = 1;
        $scope.checkForEmpty();
        $scope.reload();
    }

    // $(window).scroll(function() {
    //     if ($(window).scrollTop() + $(window).height() == $(document).height()) {
    //         console.log("at bottom");
    //         $scope.pagedata.pagenumber++;
    //         $scope.reload();
    //     }
    // });

    $scope.addMoreItems = function() {
        if (lastpage > $scope.pagedata.pagenumber) {
            $scope.pagedata.pagenumber++;
            $scope.reload();
        }
    }


    // set available range
    $scope.minPrice = 0;
    $scope.maxPrice = 10000000;

    // default the user's values to the available range
    $scope.userMinPrice = $scope.minPrice;
    $scope.userMaxPrice = $scope.maxPrice;

    $scope.imageSrc = 'img/artist/artist1.jpg';

    $scope.artistDetailImg = {};
    $scope.showDetails = function(oneuser) {
        //      console.log(oneuser)
        $scope.artistDetailImg = oneuser;
        ngDialog.open({
            scope: $scope,
            template: 'views/content/quickview-imagedetail.html'
        });
    };

    $scope.lauchedSoon = function() {
        ngDialog.open({
            template: 'views/content/modal-launch.html'
        });
        $timeout(function() {
            ngDialog.closeAll();
        }, 3000);
    };

    $scope.sortBy = function(num, by) {
        if (num == -1 && by == 'yoc') {
            $scope.lotactive = 'active';
            $scope.htlactive = '';
            $scope.lthactive = '';
        } else if (num == -1 && by == 'gprice') {
            $scope.lotactive = '';
            $scope.htlactive = 'active';
            $scope.lthactive = '';
        } else if (num == 1 && by == 'gprice') {
            $scope.lotactive = '';
            $scope.htlactive = '';
            $scope.lthactive = 'active';
        }
        $scope.pagedata.sort = num;
        $scope.pagedata.filter = by;
        $scope.pagedata.pagenumber = 1;
        $scope.totalartcont = [];
        $scope.reload();
    }

    if ($stateParams.type != -1) {
        $scope.makeactive($stateParams.type);
    } else {
        $scope.pagedata = $.jStorage.get("filterby");
        $scope.checkForEmpty();
        $stateParams.type = "All";
        if ($.jStorage.get("filterby") && $.jStorage.get("filterby").type == '')
            $scope.makeactive("All");
        else
            $scope.makeactive($.jStorage.get("filterby").type);
    }

    $scope.clearfilters = function() {
        $scope.pagedata.search = "";
        $scope.pagedata.type = "";
        $scope.pagedata.pagenumber = 1;
        $scope.pagedata.pagesize = 20;
        $scope.pagedata.filter = "";
        $scope.pagedata.medium = '';
        $scope.pagedata.sort = 1;
        $scope.pagedata.minheight = "";
        $scope.pagedata.maxheight = "";
        $scope.pagedata.minwidth = "";
        $scope.pagedata.maxwidth = "";
        $scope.pagedata.minbreadth = "";
        $scope.pagedata.maxbreadth = "";
        $scope.pagedata.minprice = "";
        $scope.pagedata.maxprice = "";
        $scope.pagedata.color = "";
        $scope.pagedata.style = "";
        $scope.pagedata.element = "";

        $scope.makeactive('All');
    }

    $scope.goToDetailPage = function(artwork) {
        //      console.log(artwork);
        var obj = {};
        obj.pageno = artwork.pageno;
        obj.lastpage = lastpage;
        $.jStorage.set("pageno", obj);
        if (artwork.type == "Sculptures") {
            //          $location.url("/sculpture/" + artwork._id);
            $state.go('sculpture', {
                artid: artwork._id
            });
        } else {
            //          $location.url("/artwork/detail/" + artwork._id);
            $state.go('detail', {
                artid: artwork._id
            });
        }
    }
})

.controller('CheckoutCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, valdr, $state, ngDialog, $filter) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("checkout");
    $scope.menutitle = NavigationService.makeactive("Checkout");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    //Valdr
    $scope.checkout = [];
    $scope.checkout.isshipping = true;
    $scope.payment = {};
    $scope.payment.billing = {};
    $scope.payment.shipping = {};
    $scope.showMobErr = false;
    $scope.showPinErr = false;
    $scope.checkoutRadio = 'guest';
    $scope.showInvalidLogin = false;
    $scope.passwordNotMatch = false;
    $scope.showAlreadyRegistered = false;
    $scope.login = {};
    $scope.register = {};
    $scope.user = {};
    $scope.user.shipping = {};
    $scope.user.shipping.name = "";
    $scope.user.shipping.country = "";
    $scope.user.billing = {};
    $scope.user.billing.country = "";
    $scope.checked = false;
    $scope.showShipping = false;
    $scope.showShippingContinue = false;
    $scope.showCartEnable = false;
    $scope.showLoginDiv = true;

    NavigationService.getCountryJson(function(data) {
        $scope.countries = data;
        // $scope.countries.unshift({
        //     "name": "Select Country",
        //     "code": ""
        // });
    });

    $scope.showCart = function() {
        $scope.showCartEnable = true;
    }

    NavigationService.getuserprofile(function(data) {
        console.log(data);

        if (data.id) {
            $scope.user = data;
            if (!$scope.user.billing) {
                $scope.user.billing = {};
                $scope.user.billing.country = "";
            }
            if (!$scope.user.shipping) {
                $scope.user.shipping = {};
                $scope.user.shipping.country = "";
            }
            if (data.billing) {
                $scope.user.billing.name = data.name;
                $scope.user.billing.email = data.email;
                $scope.user.billing.regadd = data.billing.locality;
                $scope.user.billing.mobileno = data.mob;
                $scope.user.billing.countrycode = data.cc;
            }
            if (data.shipping) {
                $scope.user.shipping.name = data.name;
                $scope.user.shipping.email = data.email;
                $scope.user.shipping.regadd = data.shipping.locality;
                $scope.user.shipping.mobileno = data.mob;
                $scope.user.shipping.countrycode = data.cc;
            }
            $scope.showShipping = true;
            $scope.showShippingContinue = true;
            $scope.showLoginDiv = false;
            $scope.payment.billing = data;
        }
    })

    $scope.continueGuest = function() {
        console.log($scope.checkoutRadio);
        console.log($scope.showShipping);
        if ($scope.checkoutRadio == 'guest') {
            $scope.showShipping = true;
            $scope.showShippingContinue = true;
        } else {
            $scope.showShipping = false;
            $scope.showShippingContinue = false;
        }
    }
    $scope.loginRegClick = function() {
        $scope.showShipping = false;
        $scope.showShippingContinue = false;
    }

    $scope.registeruser = function() {
        if ($scope.register.password === $scope.register.confirmpassword) {
            $scope.passwordNotMatch = false;
            $scope.register.accesslevel = "customer";
            NavigationService.registeruser($scope.register, function(data, status) {
                console.log(data);
                if (data.value != false) {
                    ngDialog.closeAll();
                    window.location.reload();
                } else if (data.value == false && data.comment == "User already exists") {
                    $scope.showAlreadyRegistered = true;
                }
            })
        } else {
            $scope.passwordNotMatch = true;
        }
    };

    $scope.userlogin = function() {
        NavigationService.userlogin($scope.login, function(data, status) {
            if (data.value != false) {
                $scope.showInvalidLogin = false;
                NavigationService.getuserprofile(function(data) {
                    console.log("login successfully");
                    ngDialog.closeAll();
                    window.location.reload();
                })
            } else {
                $scope.showInvalidLogin = true;
            }


            // if (data.value != false) {
            //     $scope.showInvalidLogin = false;
            //     $scope.showWishlist = true;
            //     //$.jStorage.set("user", data);
            //     $scope.user.name = data.name;
            //     ngDialog.closeAll();
            //     window.location.reload();
            // } else {
            //     $scope.showInvalidLogin = true;
            // }
        })
    };


    valdr.addConstraints({
        'Person': {
            'firstName': {
                'size': {
                    'min': 3,
                    'max': 20,
                    'message': 'First name is required to be between 3 and 20 characters.'
                },
                'required': {
                    'message': 'First name is required.'
                }
            }
        }
    });

    $scope.totalCartPrice = 0;
    $scope.sameAsBilling = false;

    $scope.changeAddress = function(check) {
        if (check == true) {
            $scope.sameAsBilling = true;
        } else {
            $scope.sameAsBilling = false;
        }

    }

    cfpLoadingBar.start();

    $scope.getCartItems = function() {
        NavigationService.getCartItems(function(data) {
            console.log(data);
            $scope.cartItems = data;
            $scope.totalCartPrice = 0;
            _.each($scope.cartItems, function(n) {
                console.log(n.artwork.formname);
                n.artwork.formname = n.artwork.srno;
                if (n.artwork.gprice != 'N/A')
                    $scope.totalCartPrice += n.artwork.gprice;
            });
            $scope.vat = ($scope.totalCartPrice / 100) * 12.5;
            cfpLoadingBar.complete();
        });
    }

    $scope.getCartItems();

    $scope.removeFromCart = function(artid) {
        NavigationService.removeFromCart(artid, function(data) {
            console.log(data);
            if (data.value == true) {
                dataNextPre.messageBox("Removed from cart");
                dataNextPre.getCartItems();
                $scope.getCartItems();
            }
        })
    }
    $scope.shippingCost = 0;
    $scope.calculateShipping = function(artwork) {
        var city = $scope.user.shipping.city;
        console.log(city.trim());
        if (artwork.form == "framed" && $filter('lowercase')($scope.user.shipping.city) != "mumbai") {
            var height = (artwork.height + 6) * 2.54;
            var width = (artwork.width + 6) * 2.54;
            if (artwork.breadth != "N/A") {
                var breadth = (artwork.breadth + 6) * 2.54;
            } else {
                var breadth = (0 + 6) * 2.54;
            }
            var formula = (height * width * breadth) / 2700;
            formula = formula * 40;
            artwork.shippingCost = formula;
        }
        console.log($scope.cartItems);
        $scope.shippingCost = 0;
        _.each($scope.cartItems, function(n) {
            if (n.artwork.shippingCost) {
                $scope.shippingCost = $scope.shippingCost + n.artwork.shippingCost;
            }
        });

    }

    $scope.paymentFunc = function() {
        var num = 0;
        _.each($scope.cartItems, function(n) {
            if (n.artwork.form) {
                num++;
            }
        });
        if (num == $scope.cartItems.length) {
            $scope.user.cart = [];
            $scope.user.cart = $scope.cartItems;
            $scope.user.subTotal = $scope.totalCartPrice;
            $scope.user.vat = $scope.vat;
            $scope.user.grantTotal = $scope.totalCartPrice + $scope.vat;
            $scope.user.discount = 0;
            delete $scope.user.id;
            NavigationService.checkout($scope.user, function(data) {
                // console.log("incheck");
                if (data.value != false) {
                    $scope.user.orderid1 = data.id;
                    $scope.user.orderid2 = data.orderid;
                    $timeout(function() {
                        $("form[name='payuForm']").submit();
                    }, 2000);
                    // $state.go('thankyou');
                    // dataNextPre.messageBox("Your order is placed. Thank You !!");
                    // $timeout(function() {
                    //     $state.go('thankyou');
                    // }, 3000);

                } else {
                    $state.go('sorry');
                }
            });
        } else {
            // alert("Fill all manditory * Fields");
            dataNextPre.messageBox("Please select in what Form (Rolled or Framed) you want to receive the artwork");
        }
    }

    $scope.toPayment = function(checked) {
        if (checked == true) {
            $scope.user.shipping = _.cloneDeep($scope.user.billing);
            $scope.paymentFunc();
        } else {
            $scope.paymentFunc();
        }

    }

    //after implementing paymentgateway topayment and viewcart will replace
    $scope.onFieldChange = function(checked) {
        $scope.showShippingContinue = true;
        $scope.showCartEnable = false;
        _.each($scope.cartItems, function(n) {
            n.artwork.form = "";
        });
        $scope.shippingCost = 0;
    }
    $scope.viewCart = function(checked) {

        if (checked == true) {
            $scope.user.shipping = _.cloneDeep($scope.user.billing);
        }
        try {
            $scope.allvalidation = [{
                field: $scope.user.billing.name,
                validation: ""
            }, {
                field: $scope.user.billing.email,
                validation: ""
            }, {
                field: $scope.user.billing.countrycode,
                validation: ""
            }, {
                field: $scope.user.billing.mobileno,
                validation: ""
            }, {
                field: $scope.user.billing.flatno,
                validation: ""
            }, {
                field: $scope.user.billing.bldgname,
                validation: ""
            }, {
                field: $scope.user.billing.regadd,
                validation: ""
            }, {
                field: $scope.user.billing.city,
                validation: ""
            }, {
                field: $scope.user.billing.pincode,
                validation: ""
            }, {
                field: $scope.user.billing.state,
                validation: ""
            }, {
                field: $scope.user.billing.country,
                validation: ""
            }, {
                field: $scope.user.shipping.name,
                validation: ""
            }, {
                field: $scope.user.shipping.email,
                validation: ""
            }, {
                field: $scope.user.shipping.countrycode,
                validation: ""
            }, {
                field: $scope.user.shipping.mobileno,
                validation: ""
            }, {
                field: $scope.user.shipping.flatno,
                validation: ""
            }, {
                field: $scope.user.shipping.bldgname,
                validation: ""
            }, {
                field: $scope.user.shipping.regadd,
                validation: ""
            }, {
                field: $scope.user.shipping.city,
                validation: ""
            }, {
                field: $scope.user.shipping.pincode,
                validation: ""
            }, {
                field: $scope.user.shipping.state,
                validation: ""
            }, {
                field: $scope.user.shipping.country,
                validation: ""
            }];
            var check = formvalidation($scope.allvalidation);
            if (check) {
                $scope.showCart();
                $scope.showShippingContinue = false;
                $(window).scrollTop($(window).height());
            } else {
                dataNextPre.messageBox("Fill all manditory * Fields");
            }
        } catch (e) {
            dataNextPre.messageBox("Fill all manditory * Fields");
        }
    }

    $scope.checkout = function() {
        $scope.user.cart = $scope.cartItems;
        NavigationService.checkout($scope.user, function(data) {
            console.log(data);
        });
    }

})

.controller('InviteCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $stateParams) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("invite");
    $scope.menutitle = NavigationService.makeactive("Invite");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.invitation = $stateParams.img;

})

.controller('EventsCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("events");
    $scope.menutitle = NavigationService.makeactive("Events");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    cfpLoadingBar.start();

    NavigationService.getAllEvents(function(data, status) {
        console.log(data);
        var events = _.groupBy(data, function(n) {
            return n.year;
        });
        $scope.currentYear = parseInt(moment().get("year"));

        $scope.events = _.groupBy(events, function(key, value) {
            if (parseInt(value) > $scope.currentYear) {
                return "upcoming";
            } else if (parseInt(value) == $scope.currentYear) {
                return "present"
            } else if (parseInt(value) < $scope.currentYear) {
                return "past"
            }
        });

        if ($scope.events.present) {
            var toberem = [];
            if (!$scope.events.upcoming) {
                $scope.events.upcoming = [];
                $scope.events.upcoming[0] = [];
                var count = 0;
                _.each($scope.events.present[0], function(n) {
                    if (n.startdate) {
                        var eventDate = new Date(n.startdate);
                        var currDate = new Date();
                        if (eventDate > currDate) {
                            $scope.events.upcoming[0].push(n);
                            toberem.push(count);
                        }
                    }
                    count++;
                })
            } else {
                var count = 0;
                _.each($scope.events.present[0], function(n) {
                    if (n.startdate) {
                        var eventDate = new Date(n.startdate);
                        var currDate = new Date();
                        if (eventDate > currDate) {
                            $scope.events.upcoming[0].push(n);
                            toberem.push(count);
                        }
                    }
                    count++;
                })
            }
            if ($scope.events.upcoming[0] && $scope.events.upcoming[0].length > 0) {
                for (var i = toberem.length - 1; i >= 0; i--) {
                    $scope.events.present[0].splice(i, 1);
                }
            } else {
                $scope.events.upcoming = [];
            }
        }

        $scope.events.past = _.sortBy($scope.events.past, function(n) {
            return -1 * n[0].year;
        });

        $scope.events.upcoming = _.sortBy($scope.events.upcoming, function(n) {
            return -1 * n[0].year;
        });
        console.log($scope.events);
        cfpLoadingBar.complete();

    });



    $scope.availableAritist = ['Krishen Khanna', 'Manjit Bawa', 'Paramjit Singh', 'S Yousuf Ali', 'Umesh Varma', 'Arunanshu Chowdhury', '   Yashwant Shirwadkar'];

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };


    $scope.availableAritist = ['Krishen Khanna', 'Manjit Bawa', 'Paramjit Singh', 'S Yousuf Ali', 'Umesh Varma', 'Arunanshu Chowdhury', '   Yashwant Shirwadkar'];

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.event2016 = [{
            name: 'AURA ART CONNECTS THE TWO WORLDS OF ART AND FASHION',
            detail: ' ITC Grand-Maratha, Sahar Road, Mumbai',
            img: 'img/event/event1.jpg'
        }
        // , {
        //     name: 'Art and Culture exchange between India & China',
        //     detail: 'Mar 31, 2015 - Mar 31, 2015 ITC Grand-Maratha, Sahar Road, Mumbai',
        //     img: 'img/event/event2.jpg'
        // }
    ];

    $scope.event2015 = [{
            name: 'The Art Enclave at UBM Index Fairs 2014',
            detail: ' Oct 09, 2014 - Oct 12, 2014 MMRDA Exhibition Centre, BKC, Mumbai',
            img: 'img/event/event3.jpg'
        }
        // , {
        //     name: 'Art Partner for The Edutainment Show 2014',
        //     detail: 'Apr 26, 2014 - Apr 27, 2014 JW Marriott Hotel Mumbai',
        //     img: ''
        // }
        // , {
        //     name: 'Art Partner for Yes Bank International Polo Cup',
        //     detail: 'Mar 22, 2014 - Mar 22, 2014 Mahalaxmi Race Course, Mumbai',
        //     img: ''
        // }
    ];

    $scope.event2014 = [{
        name: 'Art Infrastructure – nobody’s business',
        detail: 'Dec 14, 2013 - Dec 14, 2013 Taj Lands End',
        img: 'img/event/event4.jpg'
    }, {
        name: 'Aura Art Show 2013 - Oct 15-21, 2013, Jehangir Art Gallery, Mumbai',
        detail: 'Oct 15, 2013 - Oct 21, 2013 Jehangir Art Gallery, Auditorium Hall',
        img: 'img/event/event5.jpg'
    }, {
        name: 'The Indian Luxury Expo - April 26-28, 2013, Grand Hyatt, Mumbai',
        detail: 'Apr 26, 2013 - Apr 28, 2013 Grand Hyatt',
        img: 'img/event/event6.jpg'
    }, {
        name: 'Wassup! Andheri, 2013 - A grand Art & Entertainment Festival',
        detail: 'Feb 28, 2013 - Mar 03, 2013 Chitrakoot Ground, Andheri',
        img: ''
    }, {
        name: 'Aura Art organised live painting demo at AGP Multi Million Race Day',
        detail: 'Feb 17, 2013 - Feb 17, 2013 Mahalaxmi Race Course',
        img: ''
    }, {
        name: 'Aura Art is delighted to be Exclusive Art Partner for AICOG 2013',
        detail: 'Jan 16, 2013 - Jan 20, 2013 BKC, Mumbai',
        img: ''
    }, {
        name: 'Group Show at The Capital  -  Fundraiser for Cuddles Foundation',
        detail: 'Jan 15, 2013 - Jan 21, 2013 The Capital, BKC, Mumbai',
        img: 'img/event/event7.jpg'
    }];


})

.controller('EventdetailCtrl', function($scope, TemplateService, NavigationService, $timeout, ngDialog, $stateParams, cfpLoadingBar) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("eventdetail");
    $scope.menutitle = NavigationService.makeactive("Event");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    cfpLoadingBar.start();

    NavigationService.getOneEvents($stateParams.id, function(data) {
        console.log(data);
        $scope.eventDetail = data;
        cfpLoadingBar.complete();
    })


    //    ****** popup lightbox ******

    $scope.zoomposition = 0;

    $scope.openModal = function(gal) {

        $scope.zoomposition = $scope.eventDetail.photos.indexOf(gal);

        ngDialog.open({
            disableAnimation: true,
            template: 'views/directive/zoomimage.html',
            scope: $scope
        });
    };

    $scope.nextImage = function(oldposition) {
        if (oldposition == ($scope.eventDetail.photos.length - 1)) {
            $scope.zoomposition = 0;
        } else {
            $scope.zoomposition++;
        }
    };

    $scope.previousImage = function(oldposition) {
        if (oldposition == 0) {
            $scope.zoomposition = ($scope.eventDetail.photos.length - 1);
        } else {
            $scope.zoomposition--;
        }
    };
    $scope.openBox = function(id) {
        $(id).attr('openbox', 'show');
    }


})

.controller('FeatureCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, toaster, ngDialog, valdr) {
    $scope.template = TemplateService.changecontent("feature");
    $scope.menutitle = NavigationService.makeactive("Features");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    //Angular Loader Example
    //Start loader
    $scope.showLoader = function() {
            cfpLoadingBar.start();
        }
        //Complete loader
    $scope.hideLoader = function() {
        cfpLoadingBar.complete();
    }

    //Angular toaster
    $scope.showToaster = function() {
        toaster.pop({
            type: 'success',
            title: 'Success!',
            body: 'Huraaay!',
            showCloseButton: true
        });
    };

    //Tags input
    $scope.tags = [{
        text: 'Chintan'
    }, {
        text: 'Saloni'
    }, {
        text: 'Sohan'
    }, {
        text: 'Mahesh'
    }, {
        text: 'Jagruti'
    }];

    //ngDialog
    $scope.showPopup = function() {
        ngDialog.open({
            template: 'demopop'
        });
    };

    //Valdr
    valdr.addConstraints({
        'Person': {
            'firstName': {
                'size': {
                    'min': 3,
                    'max': 20,
                    'message': 'First name is required to be between 3 and 20 characters.'
                },
                'required': {
                    'message': 'First name is required.'
                }
            }
        }
    });

    //Colours for ui-select
    $scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    //MomentJS
    $scope.today = new Date();
    $scope.dateformat = "medium";

})


.controller('PressCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar) {
    $scope.template = TemplateService.changecontent("press");
    $scope.menutitle = NavigationService.makeactive("Press");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.press = [];

    cfpLoadingBar.start();

    function getPress(data) {
        cfpLoadingBar.complete();
        if (data.value != false) {
            data2 = _.groupBy(data, function(n) {
                var year = moment(n.date).get("year");
                return year;
            }, true);
            $scope.pressYear = _.keys(data2);
            // $scope.pressYear = _.orderBy($scope.pressYear,'asc');
            console.log($scope.pressYear);

            $scope.press = data2;
            console.log(data2);
        }
    }
    NavigationService.pressFind(getPress);

    $scope.oneAtATime = true;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.media2015 = [{
        name: 'Interiors & Decor',
        date: ' Sep 30, 2014 ',
        img: 'img/mediacove/m1.jpg'
    }, {
        name: 'Design Matrix',
        date: 'Oct 30, 2014 ',
        img: 'img/mediacove/m2.jpg'
    }, {
        name: 'IFJ',
        date: 'Aug 31, 2014',
        img: 'img/mediacove/m3.jpg'
    }, {
        name: 'The Design Source',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m4.jpg'
    }, {
        name: 'Sourcing Hardware',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m5.jpg'
    }, {
        name: 'Society Interiors',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m6.jpg'
    }, {
        name: 'Architecture + Design',
        date: 'Aug 31, 2014',
        img: 'img/mediacove/m7.jpg'
    }, {
        name: 'Times of India - Full page - Page 13',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m7.jpg'
    }];

    $scope.media2014 = [{
        name: 'Interiors & Decor',
        date: ' Sep 30, 2014 ',
        img: 'img/mediacove/m1.jpg'
    }, {
        name: 'Design Matrix',
        date: 'Oct 30, 2014 ',
        img: 'img/mediacove/m2.jpg'
    }, {
        name: 'IFJ',
        date: 'Aug 31, 2014',
        img: 'img/mediacove/m3.jpg'
    }, {
        name: 'The Design Source',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m4.jpg'
    }, {
        name: 'Sourcing Hardware',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m5.jpg'
    }, {
        name: 'Society Interiors',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m6.jpg'
    }, {
        name: 'Architecture + Design',
        date: 'Aug 31, 2014',
        img: 'img/mediacove/m7.jpg'
    }, {
        name: 'Times of India - Full page - Page 13',
        date: 'Sep 30, 2014',
        img: 'img/mediacove/m7.jpg'
    }];


})

.controller('ArtistDetailImageCtrl', function($scope, TemplateService, NavigationService, ngDialog, $stateParams, $rootScope, $location, cfpLoadingBar, $timeout, $state, $filter) {
    $scope.template = TemplateService.changecontent("detailimage");
    $scope.menutitle = NavigationService.makeactive("Artists");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.aristImages = [];
    $scope.allartworks = [];
    cfpLoadingBar.start();
    $scope.nextButton = true;
    $scope.prevButton = true;

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                userProfile.wishlist = favorite;
                $scope.loadArtWork($stateParams.artid);
            })
        } else {
            $scope.loadArtWork($stateParams.artid);
        }
    })

    $scope.openReachout = function() {
        globalFunction.reachOut();
    }

    $scope.lauchedSoon = function() {
        ngDialog.open({
            template: 'views/content/modal-launch.html'
        });
        $timeout(function() {
            ngDialog.closeAll();
        }, 3000);
    };

    $scope.loadArtWork = function(id) {
        NavigationService.getartworkdetail(id, function(data, status) {
            console.log(data);
            $scope.aristImages = [];
            $scope.artid = data[0]._id;
            NavigationService.getArtistDetail(data[0]._id, function(artistdata, status) {
                console.log(artistdata);
                $.jStorage.set("reachout", artistdata);
                dataNextPre.reachout = artistdata;
                $scope.artistdetail = artistdata;
                $scope.allartworks = artistdata;
                _.each(artistdata.artwork, function(n) {
                    if (n._id != data[0].artwork._id) {
                        $scope.aristImages.push(n);
                    }
                })
                $scope.aristImages = _.chunk($scope.aristImages, 6);
                $scope.aristImages = $scope.aristImages[0];
                //              console.log($scope.aristImages);
                cfpLoadingBar.complete();
            })
            $scope.artistDetailImg = data[0];
            $scope.artistDetailImg.heartClass = $filter('showheart')($scope.artistDetailImg.artwork._id);
            console.log($scope.artistDetailImg);
            if ($scope.artistDetailImg.artwork.srno == 1) {
                $scope.prevButton = false;
            }
            NavigationService.lastSr(function(data) {
                if (data.srno == $scope.artistDetailImg.artwork.srno) {
                    $scope.nextButton = false;
                }
            });
        })
    }

    $scope.images = [{
        small: 'img/zoomsmall.jpg',
        large: 'img/zoomlarge.jpg'
    }, {
        small: 'img/zoomsmall.jpg',
        large: 'img/zoomlarge.jpg'
    }, {
        small: 'img/zoomsmall.jpg',
        large: 'img/zoomlarge.jpg'
    }];

    $scope.artPrev = function() {
        NavigationService.nextPrev($scope.artistDetailImg.artwork.srno, 'prev', function(data) {
            // $scope.artistDetailImg = data;
            if (data.value != false) {
                var obj = $.jStorage.get("pageno");
                obj.pageno = data.pageno;
                $.jStorage.set("pageno", obj);
                $state.go("detail", {
                    "artid": data.artwork._id
                });
            } else {
                $scope.prevButton = false;
            }
        })
    }

    $scope.artNext = function() {
        NavigationService.nextPrev($scope.artistDetailImg.artwork.srno, 'next', function(data) {
            if (data.value != false) {
                var obj = $.jStorage.get("pageno");
                obj.pageno = data.pageno;
                $.jStorage.set("pageno", obj);
                $state.go("detail", {
                    "artid": data.artwork._id
                });
            } else {
                $scope.nextButton = false;
            }

        })
    }

    $scope.showitabove = function(artwork) {
        $state.go('detail', {
            artid: artwork._id
        })
    }

    $scope.addToCart = function(art) {
        dataNextPre.addToCart(art);
    }

    $scope.addToFav = function(art) {
        dataNextPre.favorite(art);
    }

})

.controller('SculptureCtrl', function($scope, TemplateService, NavigationService, ngDialog, $stateParams, $rootScope, $location, $state, cfpLoadingBar, $filter, $timeout) {
    $scope.template = TemplateService.changecontent("sculpture");
    $scope.menutitle = NavigationService.makeactive("Sculpture");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.aristImages = [];
    $scope.allartworks = [];
    cfpLoadingBar.start();

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            console.log(data);
            userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                userProfile.wishlist = favorite;
                $scope.loadArtWork($stateParams.artid);
            })
        } else {
            $scope.loadArtWork($stateParams.artid);
        }
    })

    $scope.openReachout = function() {
        globalFunction.reachOut();
    }

    $scope.lauchedSoon = function() {
        ngDialog.open({
            template: 'views/content/modal-launch.html'
        });
        $timeout(function() {
            ngDialog.closeAll();
        }, 3000);
    };

    $scope.loadArtWork = function(id) {
        NavigationService.getartworkdetail(id, function(data, status) {
            console.log(data);
            $scope.aristImages = [];
            $scope.artid = data[0]._id;
            NavigationService.getArtistDetail(data[0]._id, function(artistdata, status) {
                console.log(artistdata);
                $.jStorage.set("reachout", artistdata);
                dataNextPre.reachout = artistdata;
                $scope.artistdetail = artistdata;
                $scope.allartworks = artistdata;
                _.each(artistdata.artwork, function(n) {
                    if (n._id != data[0].artwork._id) {
                        $scope.aristImages.push(n);
                    }
                })
                $scope.aristImages = _.chunk($scope.aristImages, 6);
                $scope.aristImages = $scope.aristImages[0];
                //              console.log($scope.aristImages);
                cfpLoadingBar.complete();
            })
            $scope.artistDetailImg = data[0];
            $scope.artistDetailImg.heartClass = $filter('showheart')($scope.artistDetailImg.artwork._id);
            console.log($scope.artistDetailImg);
        })
    }

    $scope.images = [{
        small: 'img/smallsculpture.jpg',
        large: 'img/largesculpture.jpg'
    }, {
        small: 'img/smallsculpture.jpg',
        large: 'img/largesculpture.jpg'
    }, {
        small: 'img/smallsculpture.jpg',
        large: 'img/largesculpture.jpg'
    }];

    $scope.showitabove = function(artwork) {
        $state.go('sculpture', {
            artid: artwork._id
        });
    }

    $scope.activeImage = function(imagetopush) {
        if ($scope.artistDetailImg.artwork.image.length > 1) {
            $scope.artistDetailImg.artwork.image.splice(_.indexOf($scope.artistDetailImg.artwork.image, imagetopush), 1);
            $scope.artistDetailImg.artwork.image.unshift(imagetopush);
            $rootScope.$broadcast('changeImage');
        }
    }

    $scope.artPrev = function() {
        NavigationService.nextPrev($scope.artistDetailImg.artwork.srno, 'prev', function(data) {
            // $scope.artistDetailImg = data;
            var obj = $.jStorage.get("pageno");
            obj.pageno = data.pageno;
            $.jStorage.set("pageno", obj);
            $state.go("detail", {
                "artid": data.artwork._id
            });
        })
    }

    $scope.artNext = function() {
        NavigationService.nextPrev($scope.artistDetailImg.artwork.srno, 'next', function(data) {
            // $scope.artistDetailImg = data;
            var obj = $.jStorage.get("pageno");
            obj.pageno = data.pageno;
            $.jStorage.set("pageno", obj);
            $state.go("detail", {
                "artid": data.artwork._id
            });
        })
    }

    $scope.addToCart = function(art) {
        dataNextPre.addToCart(art);
    }

    $scope.addToFav = function(art) {
        dataNextPre.favorite(art);
    }

})

.controller('ThoughtleadershipCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar) {
    $scope.template = TemplateService.changecontent("thoughtleadership");
    $scope.menutitle = NavigationService.makeactive("Thoughtleadership");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    cfpLoadingBar.start();

    NavigationService.getAllThoughts(function(data) {
        console.log(data);
        $scope.thoughts = data;
        cfpLoadingBar.complete();
    })

    $scope.table = [{
        sr: '1',
        date: '06/07/2013',
        title: 'Aura Art announces ICICI Lombard as Insurance Partner'

    }, {
        sr: '2',
        date: '08/06/2012',
        title: 'China overtakes the United States to become the worlds largest art and antiques market'

    }, {
        sr: '3',
        date: '24/06/2010',
        title: 'Hedging Millionaires Buy Jets, Art, Bling...'

    }, {
        sr: '4',
        date: '24/02/2010',
        title: 'Aura Art: has moved to an office-cum-gallery in Kalina (off BKC)'

    }, {
        sr: '5',
        date: '01/09/2009',
        title: 'Aura Art goes International'

    }, {
        sr: '6',
        date: '25/05/2009',
        title: 'Show se show tak... Change (in Asset Allocation) is the only constant...'

    }, {
        sr: '7',
        date: '01/04/2009',
        title: 'Malvinder Singh is on to other things — art, photography and Ranbaxy, of course...'

    }, {
        sr: '8',
        date: '25/10/2008',
        title: 'Mumbai-born artist goes for Rs 17 crore'

    }, {
        sr: '9',
        date: '06/07/2015',
        title: 'Aura Art Show 2008... thanks...'

    }, {
        sr: '10',
        date: '06/05/2013',
        title: 'Aura Art in the news - Bombay Times and Human Rights Times'

    }];

})

.controller('ThoughtleadershipdetailCtrl', function($scope, TemplateService, NavigationService, $stateParams, cfpLoadingBar) {
    $scope.template = TemplateService.changecontent("thoughtleadershipdetail");
    $scope.menutitle = NavigationService.makeactive("Thoughtleadershipdetail");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    cfpLoadingBar.start();

    NavigationService.getOneThought($stateParams.id, function(data) {
        console.log(data);
        $scope.thoughtdetail = data;
        cfpLoadingBar.complete();
    })

    $scope.table = [{
        sr: '1',
        date: '06/07/2013',
        title: 'Aura Art announces ICICI Lombard as Insurance Partner'

    }, {
        sr: '2',
        date: '08/06/2012',
        title: 'China overtakes the United States to become the worlds largest art and antiques market'

    }, {
        sr: '3',
        date: '24/06/2010',
        title: 'Hedging Millionaires Buy Jets, Art, Bling...'

    }, {
        sr: '4',
        date: '24/02/2010',
        title: 'Aura Art: has moved to an office-cum-gallery in Kalina (off BKC)'

    }, {
        sr: '5',
        date: '01/09/2009',
        title: 'Aura Art goes International'

    }, {
        sr: '6',
        date: '25/05/2009',
        title: 'Show se show tak... Change (in Asset Allocation) is the only constant...'

    }, {
        sr: '7',
        date: '01/04/2009',
        title: 'Malvinder Singh is on to other things — art, photography and Ranbaxy, of course...'

    }, {
        sr: '8',
        date: '25/10/2008',
        title: 'Mumbai-born artist goes for Rs 17 crore'

    }, {
        sr: '9',
        date: '06/07/2015',
        title: 'Aura Art Show 2008... thanks...'

    }, {
        sr: '10',
        date: '06/05/2013',
        title: 'Aura Art in the news - Bombay Times and Human Rights Times'

    }];

})

.controller('ArtInfrastructureCtrl', function($scope, TemplateService, NavigationService, $location, $stateParams, $document) {
    $scope.template = TemplateService.changecontent("artinfrastructure");
    $scope.menutitle = NavigationService.makeactive("Art Infrastructure");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();


    $scope.$on('$viewContentLoaded', function(event) {
        setTimeout(function() {
            makeAnimation($stateParams.id);
        }, 100);
    });

    function makeAnimation(stateValue) {
        var goTo = angular.element(document.getElementById(stateValue));
        $document.scrollToElement(goTo, offset, duration);
    }



    $scope.artistDetailImg = [{
        image: 'img/imagedetail/imagedetail.jpg',
        id: ' 1527',
        artistname: 'Veguri Ravindra Babu',
        title: ' Floating Dreams',
        typename: 'Untitled',
        madein: 'Oil on board',
        size: '19.5 x 23',
        year: '1978',
        price: 'Rs.1,00,000/ $6,400'
    }];
    $scope.changeURL = function(id) {
        $state.transitionTo('artInfrastructure', {
            id: id
        }, {
            notify: false
        });
        makeAnimation(id);
        $location.replace();
    };
    // $scope.changeURL = function(id) {
    //   console.log(id);
    //   $location.path("" + id);
    // };
})


.controller('ArtistDetailCtrl', function($scope, TemplateService, NavigationService, $stateParams, $location, $state, cfpLoadingBar, $timeout) {
    $scope.template = TemplateService.changecontent("artistdetail")
    $scope.menutitle = NavigationService.makeactive("Artist");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.artistid = $stateParams.artistid;

    cfpLoadingBar.start();
    NavigationService.getArtistDetail($stateParams.artistid, function(data, status) {
        $.jStorage.set("reachout", data);
        $scope.artistdetail = data
        dataNextPre.reachout = data;
        cfpLoadingBar.complete();
    })

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                userProfile.wishlist = favorite;
            })
        }
    })

    $scope.goToDetail = function(artwork) {
        console.log(artwork);
        if (artwork.type == "Sculptures") {
            //          $location.url("/sculpture/" + artwork._id);
            $state.go('sculpture', {
                artid: artwork._id
            });
        } else {
            //          $location.url("/artwork/detail/" + artwork._id);
            $state.go('detail', {
                artid: artwork._id
            });
        }
    }

    $scope.addToCart = function(art) {
        var test = {}
        test.artwork = art;
        dataNextPre.addToCart(test);
    }

    $scope.addToFav = function(art) {
        console.log(art);
        var test = {}
        test.artwork = art;
        test.heartClass = art.heartClass;
        console.log(test);
        dataNextPre.favorite(test)
    }
})


.controller('ArtistCtrl', function($scope, TemplateService, NavigationService, ngDialog, $stateParams, cfpLoadingBar) {
    $scope.template = TemplateService.changecontent("artist");
    $scope.menutitle = NavigationService.makeactive("Artists");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.tab = 'grid';
    $scope.pagedata = {};
    $scope.pagedata.pagenumber = 1;
    $scope.pagedata.pagesize = 18;
    $scope.pagedata.search = '';
    $scope.pagedata.searchname = '';
    $scope.artistimage = [];
    $scope.listview = [];
    var lastpage = 2;

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                userProfile.wishlist = favorite;
            })
        }
    })

    var countcall = 0;
    var pno = 1;
    var totalpages = 2;

    function getAllArtistByAccess() {
        // var toList = _.cloneDeep($scope.pagedata);
        // toList.pagenumber = 1;
        // toList.pagesize = 100000000000;
        // NavigationService.getallartist(toList, function(data, status) {
        //     if (data.data) {
        //         $scope.listview = data.data;
        //     }
        // })
    }
    getAllArtistByAccess();

    $scope.reload = function() {
        console.log("reload");
        cfpLoadingBar.start();
        if ($scope.pagedata.type == "All") {
            $scope.pagedata.type = "";
        }
        NavigationService.getallartist($scope.pagedata, function(data, status) {
            $scope.artistimage = data.data
            $scope.listview = data.data;
            cfpLoadingBar.complete();
        });
    }

    //    $scope.reload();
    $scope.getartistbyletter = function(letter) {
        _.each($scope.alphabetjson, function(n) {
            if (n.name == letter) {
                n.class = "actived";
            } else {
                n.class = "";
            }
        });
        if (letter == "All") {
            letter = "";
        }
        $scope.pagedata.search = letter;
        $scope.pagedata.pagenumber = 1;
        $scope.artistimage = [];
        $scope.listview = [];
        $scope.reload();
        getAllArtistByAccess();
    }

    $scope.getartistbyletter('All');
    $scope.getartistbysearch = function() {
        $scope.pagedata.pagenumber = 1;
        $scope.artistimage = [];
        $scope.listview = [];
        $scope.reload();
        getAllArtistByAccess();
    }

    $scope.makeactive = function(type) {
        _.each($scope.typejson, function(n) {
                var index = n.name.indexOf(type);
                if (index != -1) {
                    n.class = "actives";
                } else {
                    n.class = "";
                }
            })
            //      if (type == "All")
            //          type = "";
        $scope.getartistbyletter('All');
        //      else {
        //          $scope.getartistbyletter(type);
        //      }
        $scope.pagedata.type = type;
        $scope.pagedata.pagenumber = 1;
        //        $scope.pagedata.search = '';
        $scope.pagedata.searchname = '';
        $scope.artistimage = [];
        $scope.listview = [];
        $scope.reload();
    }

    // $(window).scroll(function() {
    //     if ($(window).scrollTop() + $(window).height() == $(document).height()) {
    //           console.log("at bottom");
    //         $scope.pagedata.pagenumber++;
    //         $scope.reload();
    //     }
    // });

    $scope.addMoreItems = function() {
        // if (lastpage >= $scope.pagedata.pagenumber) {
        //     $scope.pagedata.pagenumber++;
        //     $scope.reload();
        // }
    }


    $scope.artistdetail = {};
    $scope.showDetail = function(artist) {
        $scope.artistdetail = artist;
        var makeit4 = _.chunk($scope.artistdetail.artwork, 4);
        $scope.artistdetail.artwork = makeit4[0];

        ngDialog.open({
            scope: $scope,
            template: 'views/content/quickview-artist.html'
        });
    };

    $scope.alphabetjson = [{
        name: "All",
        class: "actived"
    }]

    for (var i = 0; i < 26; i++) {
        $scope.alphabetjson.push({
            name: String.fromCharCode(65 + i),
            class: ''
        })
    }

    $scope.typejson = [{
        name: "All",
        class: "actives"
    }, {
        name: "Paintings",
        class: ""
    }, {
        name: "Sculptures",
        class: ""
    }, {
        name: "Photographs",
        class: ""
    }, {
        name: "Prints",
        class: ""
    }, {
        name: "Others",
        class: ""
    }]

    $scope.makeactive($stateParams.type);

    $scope.addToCart = function(art) {
        var test = {}
        test.artwork = art;
        dataNextPre.addToCart(test);
    }

    $scope.addToFav = function(art) {
        var test = {}
        test.artwork = art;
        test.heartClass = art.heartClass;
        dataNextPre.favorite(test)
    }

})


.controller('InfiniteCtrl', function($scope, TemplateService, NavigationService) {
    $scope.template = TemplateService.changecontent("infinite");
    $scope.menutitle = NavigationService.makeactive("Infinite Scroll");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    //Infinite scroll
    $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];
    $scope.loadMore = function() {
        var last = $scope.images[$scope.images.length - 1];
        for (var i = 1; i <= 8; i++) {
            $scope.images.push(last + i);
        }
    };
})

.controller('headerctrl', function($scope, TemplateService, $window, ngDialog, NavigationService, $location, cfpLoadingBar, $state, $stateParams, $timeout, $sce) {
    $scope.template = TemplateService;

    $scope.adminurl = adminurl;

    var scrolled = 0;
    $scope.logintab = '1';
    $scope.login = {};
    $scope.register = {};
    $scope.register.accesslevel = "customer";
    $scope.forgot = {};
    $scope.showInvalidLogin = false;
    $scope.showAlreadyRegistered = false;
    $scope.passwordNotMatch = false;
    $scope.showWishlist = false;
    $scope.user = {};
    $scope.user.name = '';
    $scope.art = {};
    $scope.art.search = '';
    $scope.art.pagenumber = 1;
    $scope.art.pagesize = 5;
    $scope.showDropDown = true;
    $scope.filterby = {};
    $scope.artworkInterested = [];
    $scope.reachOutForm = {};
    $scope.reachOutForm.srno = "";
    $scope.reachOutForm.to = "harmeet@auraart.in; rishiraj@auraart.in";
    $scope.reachOutForm.action = "1";
    $scope.searchData = [];
    $scope.userProfile = {};
    $scope.cartItems = [];
    $scope.totalCartPrice = 0;
    $scope.isLoggedIn == false;
    $scope.joinus = {};

    $scope.reachOutArtistId = 0;
    // if ($.jStorage.get("searchObj")) {
    //     $scope.art.search = $.jStorage.get("searchObj").search;
    // } else {
    //     $scope.art.search = "";
    // }

    $scope.joinUs = function() {

    }

    $scope.becomeSeller = function() {
        globalFunction.becomeSeller();
        // if ($scope.isLoggedIn == true) {
        //   if (userProfile && userProfile.accesslevel == "reseller") {
        //     $state.go("create-artwork");
        //   } else {
        //     $state.go("termcondition");
        //   }
        // } else {
        //   ngDialog.open({
        //     template: 'views/content/sellerRegister.html'
        //   });
        // }
    }
    globalFunction.becomeSeller = function() {
        if ($scope.isLoggedIn == true) {
            if (userProfile && userProfile.accesslevel == "reseller") {
                $state.go("account");
            } else {
                $state.go("termcondition");
            }
        } else {
            ngDialog.open({
                template: 'views/content/sellerRegister.html'
            });
        }
    }

    $scope.subMenuClick = function(link) {
        $scope.redirectu = link.split('/')[1];
        console.log($scope.redirectu);
        if ($scope.redirectu == 'termcondition') {
            if ($scope.isLoggedIn == true) {
                if (userProfile && userProfile.accesslevel == "reseller") {
                    $state.go("create-artwork");
                } else {
                    $state.go("termcondition");
                }
            } else {
                ngDialog.open({
                    template: 'views/content/sellerRegister.html'
                });
            }
        } else {
            $state.go($scope.redirectu);
        }

    }

    $scope.registeruser = function() {
        if ($scope.register.password === $scope.register.confirmpassword) {
            $scope.passwordNotMatch = false;
            $scope.register.accesslevel = "customer";
            NavigationService.registeruser($scope.register, function(data, status) {
                console.log(data);
                if (data.value != false) {
                    $scope.showAlreadyRegistered = false;
                    $scope.showWishlist = true;
                    //$.jStorage.set("user", data);
                    ngDialog.closeAll();
                    dataNextPre.messageBoxSignUp();
                    // $state.go("termcondition");
                } else if (data.value == false && data.comment == "User already exists") {
                    $scope.showAlreadyRegistered = true;
                }
            })
        } else {
            $scope.passwordNotMatch = true;
        }
    };

    $scope.userlogin = function() {
        NavigationService.userlogin($scope.login, function(data, status) {
            if (data.value != false) {
                $scope.showInvalidLogin = false;
                NavigationService.getuserprofile(function(data) {
                    ngDialog.closeAll();
                    if (data.id && data.accesslevel == "reseller") {
                        $state.go("create-artwork");
                    } else {
                        $state.go("termcondition");
                    }
                })
            } else {
                $scope.showInvalidLogin = true;
            }

        })
    };



    NavigationService.getDollarPrice(function(data) {
        if (data.value != false) {
            dollarPrice = data[0].price;
            console.log("Dollar = " + data[0].price);
        }
    })

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            $scope.isLoggedIn = true;
            userProfile = data;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                userProfile.wishlist = favorite;
            })
        } else {
            $scope.isLoggedIn = false;
        }
    })
    var countcall = 0;
    NavigationService.getAllArtistByAccess(++countcall, function(data, status, n) {
        if (n == countcall) {
            if (data && data.value != false) {
                $scope.allartist = _.uniq(data, '_id');
            } else {
                $scope.allartist = [];
            }
        } else {
            $scope.allartist = [];
        }
        //      console.log($scope.allartist);
        //      $scope.reachOutForm.artist = $scope.allartist[0].name;
    });


    NavigationService.getuserprofile(function(data) {
        userProfile = data;
        console.log(data);
        if (data.name) {
            $scope.userProfile = data;
            $scope.user.name = data.name;
            $scope.showWishlist = true;
        }

    });

    $scope.setSearch = function(select) {
        $scope.reachOutForm.artist = select.selected.name;
        cfpLoadingBar.start();
        $scope.reachOutInner(select.selected._id);
    }

    $scope.setSearchSrno = function(select) {
        $scope.reachOutForm.srno = select.selected.srno;
    }
    $scope.selectSearch = function(name) {
        console.log("on search");
        console.log(name);
        $scope.art.search = name.name;
        $scope.art.type = name.type;
        $('#topsearch').focus();
        $scope.getSearchedArt();
    }

    $scope.reachOutInner = function(id) {
        NavigationService.getArtistDetail(id, function(data) {
            $scope.artworkInterested = data.artwork;
            if (data.artwork != "") {
                //              $scope.reachOutForm.srno = data.artwork[0].srno;
            } else {
                $scope.reachOutForm.srno = "";
            }
            cfpLoadingBar.complete();
        });
    }

    $scope.changeArtist = function(data) {

    }

    $scope.reachOut = function() {
        var reachOutArtist = window.location.hash.split('l/');
        if (reachOutArtist[0] == "#/artist/detai" || reachOutArtist[0] == "#/artwork/detai" || reachOutArtist[0].indexOf("sculpture") != -1) {
            $scope.reachOutArtistId = reachOutArtist[1];
            $scope.artworkInterested = dataNextPre.reachout.artwork;
            if (reachOutArtist[0] != "#/artist/detai")
                $scope.reachOutForm.srno = $scope.artworkInterested[0].srno;
            if (dataNextPre.reachout) {
                $scope.reachOutForm.artist = dataNextPre.reachout.name;
                if (reachOutArtist[0] != "#/artist/detai")
                    $scope.reachOutInner(dataNextPre.reachout._id)
            }
            ngDialog.open({
                scope: $scope,
                template: 'views/content/reach-out.html'
            });
        } else {
            ngDialog.open({
                scope: $scope,
                template: 'views/content/reach-out.html'
            });
        }
    }

    globalFunction.reachOut = function() {
        var reachOutArtist = window.location.hash.split('l/');
        if (reachOutArtist[0] == "#/artist/detai" || reachOutArtist[0] == "#/artwork/detai" || reachOutArtist[0].indexOf("sculpture") != -1) {
            $scope.reachOutArtistId = reachOutArtist[1];
            $scope.artworkInterested = dataNextPre.reachout.artwork;
            if (reachOutArtist[0] != "#/artist/detai")
                $scope.reachOutForm.srno = $scope.artworkInterested[0].srno;
            if (dataNextPre.reachout) {
                $scope.reachOutForm.artist = dataNextPre.reachout.name;
                if (reachOutArtist[0] != "#/artist/detai")
                    $scope.reachOutInner(dataNextPre.reachout._id)
            }
            ngDialog.open({
                scope: $scope,
                template: 'views/content/reach-out.html'
            });
        } else {
            ngDialog.open({
                scope: $scope,
                template: 'views/content/reach-out.html'
            });
        }
    }


    //  $scope.art.search = $.jStorage.get("searchObj").search;
    $scope.getSearchedArt = function() {
        console.log($scope.art);

        if ($scope.art.search != '') {
            cfpLoadingBar.start();
            NavigationService.getArtworkbySearch($scope.art, function(data) {
                console.log(data);
                $.jStorage.set("searchObj", $scope.art);
                $.jStorage.set("searchResults", data);
                console.log($state.current.name);
                if ($state.current.name == 'searchresults') {
                    window.location.reload();
                } else {
                    $state.go('searchresults');
                }

                cfpLoadingBar.complete();
            })
        }
    }
    var countcall = 0;
    $scope.onSearchChange = function(search) {
        if (search != undefined && search != '') {
            $timeout(function() {
                NavigationService.getSearchDrop(search, ++countcall, function(data, n) {
                    if (n == countcall) {
                        if (data.value == false) {
                            $scope.showDropDown = true;
                        } else {
                            $scope.showDropDown = false;
                            $scope.searchData = data;
                        }
                    } else {
                        $scope.showDropDown = true;
                    }
                })
            }, 1000);
        } else {
            $scope.searchData = '';
        }
    }

    // reach out submit
    $scope.allvalidation = [{
        field: $scope.reachOutForm.to,
        validation: ""
    }, {
        field: $scope.reachOutForm.from,
        validation: ""
    }, {
        field: $scope.reachOutForm.action,
        validation: ""
    }];
    $scope.submitReachOut = function() {
        $scope.allvalidation = [{
            field: $scope.reachOutForm.to,
            validation: ""
        }, {
            field: $scope.reachOutForm.from,
            validation: ""
        }, {
            field: $scope.reachOutForm.action,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);
        if (check) {
            NavigationService.reachOutArtist($scope.reachOutForm, function(data) {
                console.log(data);
                if (data.value == true) {
                    alert("Thank you! Your query has been successfully submited.");
                }
            });
        } else {
            alert("Enter all data");
        }
    }
    $scope.resetReachOut = function() {
        _.each($scope.reachOutForm, function(n, key) {
            if (key != 'srno' && key != 'to' && key != 'action') {
                $scope.reachOutForm[key] = "";
            }
        });
    }


    $scope.showLogin = function() {
        console.log("in login");
        ngDialog.open({
            template: 'views/content/login.html',
            scope: $scope
        });
    };

    globalFunction.showLogin = function() {
        console.log("in login");
        ngDialog.open({
            template: 'views/content/login.html',
            scope: $scope
        });
    };

    $scope.changeTab = function(tab) {
        $scope.logintab = tab;
    }

    $scope.toaccount = function() {
        //      $location.url("/account");
        $state.go('account');
    }

    if ($.jStorage.get("user")) {
        $scope.showWishlist = true;
        $scope.user.name = $.jStorage.get("user").name;
    }

    $scope.logout = function() {
        console.log("Logout");
        NavigationService.logout(function(data) {
            $scope.showWishlist = false;
            $scope.cartItems = [];
            userProfile = data;
            $state.go('home');
        });
    }

    $scope.userlogin = function() {
        NavigationService.userlogin($scope.login, function(data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.showInvalidLogin = false;
                $scope.showWishlist = true;
                //$.jStorage.set("user", data);
                $scope.user.name = data.name;
                ngDialog.closeAll();
                window.location.reload();
            } else {
                $scope.showInvalidLogin = true;
            }
        })
    };

    $scope.registeruser = function() {
        if ($scope.register.password === $scope.register.confirmpassword) {
            $scope.passwordNotMatch = false;
            NavigationService.registeruser($scope.register, function(data, status) {
                console.log(data);
                if (data.value != false) {
                    $scope.showAlreadyRegistered = false;
                    $scope.showWishlist = true;
                    //$.jStorage.set("user", data);
                    $scope.user.name = data.name;
                    ngDialog.closeAll();
                    dataNextPre.messageBoxSignUp();
                    // window.location.reload();
                } else if (data.value == false && data.comment == "User already exists") {
                    $scope.showAlreadyRegistered = true;
                }
            })
        } else {
            $scope.passwordNotMatch = true;
        }
    };

    $scope.forgotpassword = function() {
        console.log($scope.forgot);
        NavigationService.forgotpassword($scope.forgot, function(data, status) {
            console.log(data);
            if (data.value == true) {
                ngDialog.open({
                    template: '<div class="pop-up"><h5 class="popup-wishlist">New password e mailed to you.</h5><span class="closepop" ng-click="closeThisDialog(value);">X</span></div>',
                    plain: true
                });
                $timeout(function() {
                    ngDialog.closeAll();
                }, 3000);
                // dataNextPre.messageBox("New password e mailed to you.");
            }
        })
    }

    //    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
    //        // Send login to server or save into cookie
    //          console.log(authResult);
    //    });
    //    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
    //        // Auth failure or signout detected
    //          console.log(authResult);
    //    });


    //common function
    dataNextPre.messageBox = function(msg) {
        var xyz = ngDialog.open({
            template: '<div class="pop-up"><h5 class="popup-wishlist">' + msg + '</h5><span class="closepop" ng-click="closeThisDialog(value);">X</span></div>',
            plain: true
        });
        $timeout(function() {
            xyz.close();
        }, 3000);
    }

    dataNextPre.messageBoxNoTime = function(msg) {
        var xyz = ngDialog.open({
            template: '<div class="pop-up"><h5 class="popup-wishlist">' + msg + '</h5><span class="closepop" ng-click="closeThisDialog(value);">X</span></div>',
            plain: true
        });
    }

    dataNextPre.messageBoxSignUp = function() {
        var xyz = ngDialog.open({
            template: '<div class="pop-up"><h5 class="popup-wishlist"><div class="text-center"><h3>Welcome to Aura Art </h3><p>You may update your Profile by clicking <a href="http://www.auraart.in/#/account" ng-click="closeThisDialog(value)">here</a> or continue surfing by closing this box</p></div></h5><span class="closepop" ng-click="closeThisDialog(value);">X</span></div>',
            plain: true
        });
    }

    dataNextPre.messageBoxWithBtn = function(msg, btnText, funcName) {
        var xyz = ngDialog.open({
            scope: $scope,
            template: '<div class="pop-up"><h5 class="popup-wishlist">Please login to add to favourites</h5><p>Click <a ng-click="showLogin();">here</a> to Login</p><span class="closepop" ng-click="closeThisDialog(value);">X</span></div>',
            plain: true
        });
    }

    $scope.nowAddToFav = function(obj) {
        console.log(obj);
        ngDialog.closeAll();
        cfpLoadingBar.start();
        NavigationService.addToFav(obj, function(data) {
            cfpLoadingBar.complete();
            if (!data.value) {
                dataNextPre.messageBox("Added to favourites");
                getMyProfile();
            } else if (data.value == true && data.comment == "Data already updated") {
                dataNextPre.messageBox("Already added to favourites");
                getMyProfile();
            }
        })
    }

    function getMyProfile() {
        NavigationService.getuserprofile(function(data) {
            if (data.id) {
                userProfile = data;
                NavigationService.getMyFavourites(data.id, function(favorite) {
                    userProfile.wishlist = favorite;
                })
            }
        })
    }

    dataNextPre.favorite = function(art) {
        // art.heartClass = "fa fa-heart font-color3";
        if ($scope.userProfile.id) {
            // cfpLoadingBar.start();
            console.log(art.heartClass);
            switch (art.heartClass) {
                case "fa fa-heart":
                    {
                        NavigationService.getMyFolders(function(data) {
                            if (data.value != false) {
                                $scope.myFolders = data;
                            } else {
                                $scope.myFolders = [];
                            }
                        })
                        $scope.favObj = {};
                        $scope.favObj.artwork = art.artwork._id;
                        ngDialog.open({
                            scope: $scope,
                            template: 'views/content/modal-choose.html'
                        });
                        art.heartClass = "fa fa-heart font-color3";
                        // NavigationService.addToFav($scope.userProfile.id, art.artwork._id, function(data) {
                        //     cfpLoadingBar.complete();
                        //     if (!data.value) {
                        //         // $.jStorage.set("user", data);
                        //         art.heartClass = "fa fa-heart font-color3";
                        //         dataNextPre.messageBox("Added to favourites");
                        //     } else if (data.value == true && data.comment == "Data already updated") {
                        //         dataNextPre.messageBox("Already added to favourites");
                        //     }
                        // })
                    }
                    break;
                case "fa fa-heart font-color3":
                    {
                        console.log('in second if');
                        cfpLoadingBar.complete();
                        NavigationService.deleteFromFav($scope.userProfile.id, art.artwork._id, function(data) {
                            if (!data.value) {
                                // $.jStorage.set("user", data);
                                art.heartClass = "fa fa-heart";
                                dataNextPre.messageBox("Removed from favourites");
                            }
                        })
                    }
                    break;
                default:
            }
            NavigationService.getuserprofile(function(data) {
                if (data.id) {
                    userProfile = data;
                    NavigationService.getMyFavourites(data.id, function(favorite) {
                        userProfile.wishlist = favorite;
                    })
                }
            })
        } else {
            ngDialog.open({
                scope: $scope,
                template: 'views/content/favLogin.html'
            });
        }
    }

    dataNextPre.getCartItems = function() {
        NavigationService.getCartItems(function(data) {
            // console.log(data);
            $scope.cartItems = data;
            $scope.totalCartPrice = 0;
            _.each($scope.cartItems, function(n) {
                if (n.artwork.gprice != 'N/A')
                    $scope.totalCartPrice += n.artwork.gprice;
            });
        });
    }

    dataNextPre.getCartItems();

    dataNextPre.addToCart = function(art) {
        cfpLoadingBar.start();
        console.log(art);
        NavigationService.addToCart(art.artwork._id, function(data) {
            console.log(data);
            cfpLoadingBar.complete();
            if (data.value == true) {
                dataNextPre.messageBox("Added to cart");
                dataNextPre.getCartItems();
            } else if (data.value == false) {
                dataNextPre.messageBox("Already in cart");
            }
        })
    }

    dataNextPre.removeFromCart = function(artid) {
        console.log(artid);
        NavigationService.removeFromCart(artid, function(data) {
            console.log(data);
            if (data.value == true) {
                dataNextPre.messageBox("Removed from cart");
                dataNextPre.getCartItems();
            }
        })
    }

})

.controller('AccountCtrl', function($scope, TemplateService, NavigationService, $upload, $timeout, $http, cfpLoadingBar, $state, ngDialog) {

    $scope.template = TemplateService.changecontent("account");
    $scope.menutitle = NavigationService.makeactive("Account");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.info = "bolds";
    $scope.resi = "active";
    $scope.showSuccess = "";
    $scope.showFail = "";
    $scope.showPass = "";
    $scope.formstatus = false;
    $scope.ismatch = "";
    $scope.formstatussec = false;
    $scope.user = {};
    $scope.shipping = {};
    $scope.artistdetail = [];
    $scope.allfavourites = [];
    $scope.noFavs = false;
    $scope.user.bank = {};
    $scope.user.bank.cancelCheck = '';
    $scope.tab = '';
    $scope.tab.url = "views/content/my-artworks.html";
    $scope.isLoggedIn = false;
    cfpLoadingBar.start();


    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            userProfile = data;
            $scope.user = data;
            cfpLoadingBar.complete();
            $scope.reload();
            $scope.isLoggedIn = true;
            NavigationService.getMyFavourites(data.id, function(favorite) {
                if (favorite.value != false) {
                    $scope.noFavs = false;
                    userProfile.wishlist = favorite;
                    _.each(favorite, function(n) {
                        $scope.allfavourites.push({
                            "_id": n.artwork
                        });
                    });
                    getFavorite($scope.allfavourites)
                } else {
                    $scope.noFavs = true;
                }
            });
        }
    });

    NavigationService.findMyArtwork(function(data) {
        console.log(data);
        if (data.value != false) {
            $scope.myArtworks = _.chunk(data, 3);
        }
    });

    function getFavorite(allfavourites) {
        NavigationService.getAllFavouritesData(allfavourites, function(datas, status) {
            $scope.artistdetail = datas;
            $scope.totalfav = datas.length;
            cfpLoadingBar.complete();
        });
    }

    NavigationService.getCountryJson(function(data) {
        $scope.allcountries = data;
    });

    NavigationService.getMyOrders(function(data) {
        console.log(data);
        $scope.myorderedproducts = data;
    });

    $scope.callPay = function(order) {
        $scope.getOrder = order;
        $scope.getOrder.pinfo = "Purchase of artwork";
        $timeout(function() {
            $("form[name='payuForm']").submit();
        }, 2000);
    }
    $scope.reload = function() {
        $scope.user = "";
        NavigationService.getoneartist(userProfile.id, function(data) {
            console.log(data);
            $scope.user = data;
            $scope.shipping = data.shipping;
            if (!$scope.user.bank) {
                $scope.user.bank = {};
                $scope.user.bank.cancelCheck = '';
            }
            if (!$scope.user.shipping) {
                $scope.user.shipping = {};
                $scope.user.shipping.country = "";
            } else if (!$scope.user.shipping.country) {
                $scope.user.shipping.country = "";
            }
            if (!$scope.user.billing) {
                $scope.user.billing = {};
                $scope.user.billing.country = "";
            } else if (!$scope.user.billing.country) {
                $scope.user.billing.country = "";
            }
        });
    }
    $scope.edituser = function() {
        $scope.user._id = userProfile.id;
        NavigationService.registeruser($scope.user, function(data) {
            console.log(data);
            $scope.closeTab(2);
            if (data.value != false) {
                // $scope.reload();
                $scope.showSuccess = true;
                $timeout(function() {
                    $scope.showSuccess = false;
                }, 5000);
            } else {
                // $scope.reload();
                $scope.showFail = true;
                $timeout(function() {
                    $scope.showFail = false;
                }, 5000);
            }
        });
    }

    $scope.changepassword = function() {
        $scope.user._id = userProfile.id;
        if ($scope.user.editpassword === $scope.user.cnfrmpassword) {
            $scope.ismatch = false;
            delete $scope.user.cnfrmpassword;
            console.log($scope.user);
            NavigationService.changePassword($scope.user, function(data) {
                if (data.value == true) {
                    $scope.showSuccess = true;
                    $scope.user.password = "";
                    $scope.user.editpassword = "";
                    $timeout(function() {
                        $scope.showSuccess = false;
                    }, 5000);
                } else if (data.value == false && data.comment == "Same password") {
                    $scope.showPass = true;
                    $scope.user.password = "";
                    $scope.user.editpassword = "";
                    $timeout(function() {
                        $scope.showPass = false;
                    }, 5000);
                } else {
                    $scope.showFail = true;
                    $scope.user.password = "";
                    $scope.user.editpassword = "";
                    $timeout(function() {
                        $scope.showFail = false;
                    }, 3000);
                }
            });
        } else {
            $scope.ismatch = true;
        }
    }

    $scope.saveAddress = function() {
        $scope.user._id = userProfile.id;
        NavigationService.registeruser($scope.user, function(data) {
            console.log(data);
            if (data.value == true) {
                // $scope.reload();
                $scope.closeTab(1);
                $scope.showSuccess = true;
                $timeout(function() {
                    $scope.showSuccess = false;
                }, 5000);
            } else {
                // $scope.reload();
                $scope.showFail = true;
                $timeout(function() {
                    $scope.showFail = false;
                }, 5000);
            }
        });
    }

    $scope.editArtwork = function(status, id) {
        if (status === 'revert' || status === 'pending') {
            $state.go("edit-artwork", {
                "id": id
            });
        } else {
            dataNextPre.messageBoxNoTime("For any changes, please write to us at artistsubmit@auraart.in/resellersubmit@auraart.in");
        }
    }

    $scope.changeTab = function(tab) {
        if (tab == 1) {
            $scope.formstatus = true;
            //                $scope.formstatussec = false;
        } else {
            //                $scope.formstatus = false;
            $scope.formstatussec = true;
        }

    }
    $scope.closeTab = function(tab) {
        if (tab == 1) {
            $scope.formstatus = false;
            $scope.reload();
            //                $scope.formstatussec = false;
        } else {
            //                $scope.formstatus = false;
            $scope.formstatussec = false;
        }

    }
    $scope.changeTabs = function() {
        $scope.formstatussec = true;
    }

    $scope.changeresi = function() {
        $scope.resi = "active";
        $scope.offce = "";
    }
    $scope.changeoffice = function() {
        $scope.resi = "";
        $scope.offce = "active";
    }

    $scope.activeTab = globalFunction.tab;
    $scope.changeTab = function(data) {
        $scope.activeTab = data;
    }

    //imageupload
    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files, whichone) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, whichone);
            }
        }
    };

    $scope.start = function(index, whichone) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: imgUploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (whichone == 1) {
                        if (imagejstupld != "") {
                            $scope.user.bank.cancelCheck = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: imgUploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };


    $scope.becomeSeller = function() {
        globalFunction.becomeSeller();
        // if ($scope.isLoggedIn == true) {
        //   if (userProfile && userProfile.accesslevel == "reseller") {
        //     $state.go("create-artwork");
        //   } else {
        //     $state.go("termcondition");
        //   }
        // } else {
        //   ngDialog.open({
        //     template: 'views/content/sellerRegister.html'
        //   });
        // }
    }

    $scope.registeruser = function() {
        if ($scope.register.password === $scope.register.confirmpassword) {
            $scope.passwordNotMatch = false;
            $scope.register.accesslevel = "customer";
            NavigationService.registeruser($scope.register, function(data, status) {
                console.log(data);
                if (data.value != false) {
                    $scope.showAlreadyRegistered = false;
                    $scope.showWishlist = true;
                    //$.jStorage.set("user", data);
                    ngDialog.closeAll();
                    $state.go("termcondition");
                } else if (data.value == false && data.comment == "User already exists") {
                    $scope.showAlreadyRegistered = true;
                }
            })
        } else {
            $scope.passwordNotMatch = true;
        }
    };

    $scope.userlogin = function() {
        NavigationService.userlogin($scope.login, function(data, status) {
            if (data.value != false) {
                $scope.showInvalidLogin = false;
                NavigationService.getuserprofile(function(data) {
                    ngDialog.closeAll();
                    if (data.id && data.accesslevel == "reseller") {
                        $state.go("create-artwork");
                    } else {
                        $state.go("termcondition");
                    }
                })
            } else {
                $scope.showInvalidLogin = true;
            }


            // if (data.value != false) {
            //     $scope.showInvalidLogin = false;
            //     $scope.showWishlist = true;
            //     //$.jStorage.set("user", data);
            //     $scope.user.name = data.name;
            //     ngDialog.closeAll();
            //     window.location.reload();
            // } else {
            //     $scope.showInvalidLogin = true;
            // }
        })
    };

})

.controller('ActivitiesCtrl', function($scope, TemplateService, NavigationService) {
        $scope.template = TemplateService.changecontent("activities");
        $scope.menutitle = NavigationService.makeactive("Activities");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('ReachOutCtrl', function($scope, TemplateService, NavigationService) {
        $scope.template = TemplateService.changecontent("reach-out");
        $scope.menutitle = NavigationService.makeactive("Reach Out");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })

.controller('CreateArtworkCtrl', function($scope, TemplateService, NavigationService, $upload, $timeout, $http, $state) {
    $scope.template = TemplateService.changecontent("create-artwork");
    $scope.menutitle = NavigationService.makeactive("Upload Artwork");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    window.uploadUrl = 'http://smartsnap.in/user/uploadfile';

    // window.uploadUrl = 'http://192.168.0.122:1337/user/uploadfile';
    // $scope.usr = $routeParams.id;
    $scope.artwork = {};
    $scope.artwork.type = "Paintings";
    $scope.multiplesel = false;
    $scope.artwork.subtype = [];
    $scope.artwork.tag = [];
    $scope.showBreadth = false;
    $scope.onTextClick = function($event) {
        $event.target.select();
    }
    $scope.select2options = {
        maximumSelectionSize: 5,
        placeholder: "Select A Medium"
    };
    $scope.select2optionstag = {
        maximumSelectionSize: 5,
        placeholder: "Select A Tag Word"
    };
    $scope.variable = "";
    $scope.artwork.comm = 33;
    $scope.artwork.price = 0;
    $scope.artwork.gprice = 0;
    $scope.showPaintings = true;
    $scope.showSculpture = false;
    $scope.showPrints = false;
    $scope.showPhotography = false;
    $scope.artmedium = [];
    $scope.tag = [];
    $scope.access = "artist";
    $scope.commentsub = '';
    $scope.artwork.address = 'new';

    NavigationService.getCountryJson(function(data) {
        $scope.allcountries = data;
    })

    $scope.calcsq = function() {
        if ($scope.artwork.height && $scope.artwork.width) {
            if ($scope.artwork.type != "Sculptures") {
                $scope.artwork.area = ((parseInt($scope.artwork.height) * parseInt($scope.artwork.width)) / 144).toFixed(2);
            } else if ($scope.artwork.type == "Sculptures" && $scope.artwork.breadth) {
                $scope.artwork.area = ((parseInt($scope.artwork.height) * parseInt($scope.artwork.width) * parseInt($scope.artwork.breadth)) / 1728).toFixed(2);
            }
            if ($scope.artwork.area && $scope.artwork.gprice && $scope.artwork.gprice > 0) {
                $scope.artwork.pricesq = (parseFloat($scope.artwork.gprice) / $scope.artwork.area).toFixed(2);
            }
        }
    }

    $scope.otherDetails = "eg. Diptych, Triptych";

    NavigationService.getuserprofile(function(data) {
        $scope.userData = data;
    })

    $scope.submitComment = function() {
        if (!$scope.artwork.chat) {
            $scope.artwork.chat = [{
                "name": $scope.userData.name,
                "comment": $scope.artwork.comment,
                "accesslevel": "artist"
            }];
        }
        // $scope.comment = '';
    }

    $scope.allartist = [];
    $scope.getDropdown = function(search) {
        if (search.length >= 1) {
            $scope.change = {};
            $scope.change.type = $scope.artwork.type;
            $scope.change.search = search;
            NavigationService.getAllArtistDropArtist($scope.change, function(data) {
                if (data && data.value != false) {
                    $scope.allartist = data;
                } else {
                    $scope.allartist = [];
                }
            });
        } else {
            $scope.allartist = [];
        }
    }

    $scope.resellers = [];
    $scope.getDropdownReseller = function(search) {
        if (search.length >= 1) {
            NavigationService.getAllResellerDrop(search, function(data) {
                if (data && data.value != false) {
                    $scope.resellers = data;
                } else {
                    $scope.resellers = [];
                }
            });
        } else {
            $scope.resellers = [];
        }
    }

    $scope.setSearch = function(select) {
        console.log(select.selected);
        $scope.variable = select.selected.name;
        $scope.artwork.user = select.selected;
        $scope.artwork.artistname = select.selected.name;

        if (select.selected.email) {
            $scope.artwork.email = select.selected.email;
        } else {
            $scope.artwork.email = "";
        }

    }

    $scope.setSearchReseller = function(select) {
        $scope.variableReseller = select.selected.name;
    }

    NavigationService.lastSr(function(data, status) {
        console.log(data);
        $scope.artwork.srno = parseInt(data.srno) + 1;
    });

    $scope.calculateprice = function(flag) {
        $scope.artwork.price = parseFloat($scope.artwork.price);
        $scope.artwork.gprice = parseFloat($scope.artwork.gprice);
        $scope.artwork.comm = parseFloat($scope.artwork.comm);
        if ($scope.artwork.comm > 100 && flag == 1) {
            $scope.artwork.comm = 100;
        } else if ($scope.artwork.comm < 1 && flag == 1) {
            $scope.artwork.comm = 1;
        }
        // if (_.isNumber($scope.artwork.comm) && _.isNumber($scope.artwork.price) && flag == 1) {
        //     console.log("first if");
        //     console.log($scope.artwork.price * $scope.artwork.comm);
        //     $scope.artwork.gprice = Math.round($scope.artwork.price + ($scope.artwork.price * $scope.artwork.comm / 100));
        // }
        if (_.isNumber($scope.artwork.gprice) && _.isNumber($scope.artwork.comm) && flag == 2) {
            $scope.artwork.price = Math.round($scope.artwork.gprice * (1 - ($scope.artwork.comm / 100)));
        }
    }

    $scope.removeimage = function(i) {
        $scope.artwork.image.splice(i, 1);
    };

    $scope.show = 0;
    $scope.showmed = 0;

    $scope.ismatch = function(data, select) {
        console.log(select.selected);
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveartMedium(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.artwork.subtype = select.selected;
            }
        });
        console.log($scope.artwork.subtype);
    }
    $scope.artwork.color = [];
    $scope.artwork.style = [];
    $scope.artwork.elements = [];
    $scope.ismatchmed = function(data, select, index) {
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n)
                };
                NavigationService.saveTag(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                if (index == 1) {
                    $scope.artwork.color = select.selected;
                } else if (index == 2) {
                    $scope.artwork.style = select.selected;
                } else if (index == 3) {
                    $scope.artwork.elements = select.selected;
                }
            }
        });
    }

    //imageupload
    var imagejstupld = "";
    $scope.artwork.image = [];
    $scope.artwork.certi = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files, whichone) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, whichone);
            }
        }
    };

    $scope.start = function(index, whichone) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: imgUploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (whichone == 1) {
                        if (imagejstupld != "") {
                            $scope.artwork.image.push(imagejstupld.files[0].fd);
                            imagejstupld = "";
                        }
                    } else if (whichone == 2) {
                        if (imagejstupld != "") {
                            $scope.artwork.certi = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: imgUploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };
    ////
    $scope.framedStatus = false;
    $scope.changingStatus = function(data) {
        var fStatus = data;
        console.log(data);
        if (fStatus == 'framed') {
            $scope.framedStatus = true;
        } else if (fStatus == 'framed with glass') {
            $scope.framedStatus = true;
        } else if (fStatus == 'framed with acrylic sheet') {
            $scope.framedStatus = true;
        } else {
            $scope.framedStatus = false;
        }
    }

    $scope.isSculpture = function(type) {
        $scope.artwork.subtype = [];
        $scope.show = 0;
        $scope.showmed = 0;
        if (type == "Sculptures") {
            $scope.showBreadth = true;
            $scope.otherDetails = "eg. with pedestal";
        } else if (type == "Paintings") {
            $scope.showBreadth = false;
            $scope.otherDetails = "eg. Diptych, Triptych";
            $scope.artwork.breadth = '';
        } else {
            $scope.showBreadth = false;
            $scope.otherDetails = "eg. Edition, Diptych, Triptych";
            $scope.artwork.breadth = '';
        }
        $scope.calcsq();
        switch (type) {
            case "Paintings":
                $scope.showPaintings = true;
                $scope.showSculpture = false;
                $scope.showPrints = false;
                $scope.showPhotography = false;
                $scope.multiplesel = false;
                break;
            case "Sculptures":
                $scope.showPaintings = false;
                $scope.showSculpture = true;
                $scope.showPrints = false;
                $scope.showPhotography = false;
                $scope.multiplesel = true;
                break;
            case "Photographs":
                $scope.showPaintings = false;
                $scope.showSculpture = false;
                $scope.showPrints = false;
                $scope.showPhotography = true;
                $scope.multiplesel = false;
                break;
            case "Prints":
                $scope.showPaintings = false;
                $scope.showSculpture = false;
                $scope.showPrints = true;
                $scope.showPhotography = false;
                $scope.multiplesel = false;
                break;
        }
    }

    $scope.showerror = false;
    $scope.disableSubmit = false;
    $scope.showProceedTitle = false;
    $scope.createartwork = function() {

        NavigationService.getuserprofile(function(data) {
            if (data.id && $scope.artwork.user) {
                $scope.submitComment();
                // if (!$scope.artwork.chat) {
                //     $scope.artwork.chat = [];
                // }
                $scope.artwork.reseller = [{
                    "_id": data.id,
                    "name": data.name
                }];
                $scope.artwork.status = "pending";
                if (!$scope.artwork.subtype)
                    $scope.artwork.subtype = [];
                if (!$scope.artwork.tag)
                    $scope.artwork.tag = [];
                console.log($scope.artwork);
                if ($scope.artwork.type != "Sculptures") {
                    $scope.artwork.breadth = "";
                    $scope.artwork.weight = "";
                }
                if ($scope.artwork.user) {
                    if (!$scope.artwork.name) {
                        $scope.artwork.name = 'Untitled';
                        $scope.showProceedTitle = true;
                        $('html, body').animate({
                            scrollTop: 100
                        }, 1000);
                    } else {
                        $scope.showerror = false;
                        $scope.artwork.user = $scope.artwork.user._id;
                        if ($scope.artwork.tag.length == 0) {
                            $scope.artwork.tag[0] = {
                                _id: "",
                                name: "",
                                category: ""
                            };
                        }
                        // $scope.userData._id = $scope.userData.id;
                        // NavigationService.registeruser($scope.userData, function(data) {
                        //     console.log(data);
                        // });
                        $scope.artwork.status = 'pending';
                        $scope.artwork.selleremail = $scope.userData.email;
                        $scope.artwork.sellername = $scope.userData.name;
                        $scope.artwork.location = $scope.userData.other;
                        if (!$scope.artwork.focused) {
                            $scope.artwork.focused = "nonfocused";
                        }
                        $scope.artwork.tag = [];
                        _.each($scope.artwork.color, function(n) {
                            $scope.artwork.tag.push(n);
                        });
                        _.each($scope.artwork.style, function(n) {
                            $scope.artwork.tag.push(n);
                        });
                        _.each($scope.artwork.elements, function(n) {
                            $scope.artwork.tag.push(n);
                        });
                        $scope.artwork.tag = _.uniq($scope.artwork.tag, '_id');
                        NavigationService.saveArtwork($scope.artwork, function(data, status) {
                            console.log(data);
                            if (data.value == true) {
                                $scope.disableSubmit = true;
                                dataNextPre.messageBox("Your artwork has been submitted for review");
                                globalFunction.tab = "myartworks";
                                $timeout(function() {
                                    $state.go('account');
                                }, 3000);
                            }
                            // $location.url("/artworkout");
                        });
                    }
                } else {
                    $scope.showerror = true;
                }
            } else {
                if (!data.id) {
                    dataNextPre.messageBox("Please login to upload artwork");
                } else if (!$scope.artwork.user) {
                    dataNextPre.messageBox("Please select an artist");
                }
            }
        })
    }

    $scope.refreshArtMedum = function(search, category) {
        $scope.artmedium = [];
        if (search) {
            if (!$scope.artwork.subtype)
                $scope.artwork.subtype = [];
            NavigationService.findArtMedium(search, $scope.artwork.subtype, category, function(data, status) {
                $scope.artmedium = data;
            });
        }
    };
    $scope.refreshTag = function(search, category) {
        $scope.tag = [];
        if (search) {
            if (!$scope.artwork.tag)
                $scope.artwork.tag = [];
            NavigationService.findTag(search, $scope.artwork.tag, category, function(data, status) {
                $scope.tag = _.uniq(data, '_id');
            });
        }
    };
})

.controller('EditArtworkCtrl', function($scope, TemplateService, NavigationService, $upload, $timeout, $http, $stateParams, $state) {
    $scope.template = TemplateService.changecontent("edit-artwork");
    $scope.menutitle = NavigationService.makeactive("Upload Artwork");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    window.uploadUrl = 'http://smartsnap.in/user/uploadfile';

    // window.uploadUrl = 'http://192.168.0.122:1337/user/uploadfile';
    // $scope.usr = $routeParams.id;
    $scope.artwork = {};
    $scope.artwork.type = "Paintings";
    $scope.multiplesel = false;
    $scope.artwork.subtype = [];
    $scope.artwork.tag = [];
    $scope.showBreadth = false;
    $scope.onTextClick = function($event) {
        $event.target.select();
    }
    $scope.select2options = {
        maximumSelectionSize: 5,
        placeholder: "Select A Medium"
    };
    $scope.select2optionstag = {
        maximumSelectionSize: 5,
        placeholder: "Select A Tag Word"
    };
    $scope.variable = "";
    $scope.artwork.comm = 33;
    $scope.artwork.price = 0;
    $scope.artwork.gprice = 0;
    $scope.showPaintings = true;
    $scope.showSculpture = false;
    $scope.showPrints = false;
    $scope.showPhotography = false;
    $scope.artmedium = [];
    $scope.tag = [];
    $scope.access = "artist";
    $scope.chat = {};

    $scope.disableSubmit = false;

    $scope.otherDetails = "eg. Diptych, Triptych";

    $scope.calcsq = function() {
        if ($scope.artwork.height && $scope.artwork.width) {
            if ($scope.artwork.type != "Sculptures") {
                $scope.artwork.area = ((parseInt($scope.artwork.height) * parseInt($scope.artwork.width)) / 144).toFixed(2);
            } else if ($scope.artwork.type == "Sculptures" && $scope.artwork.breadth) {
                $scope.artwork.area = ((parseInt($scope.artwork.height) * parseInt($scope.artwork.width) * parseInt($scope.artwork.breadth)) / 1728).toFixed(2);
            }
            if ($scope.artwork.area && $scope.artwork.gprice && $scope.artwork.gprice > 0) {
                $scope.artwork.pricesq = (parseFloat($scope.artwork.gprice) / $scope.artwork.area).toFixed(2);
            }
        }
    }

    NavigationService.getuserprofile(function(data) {
        $scope.userData = data;
    })

    NavigationService.getartworkdetail($stateParams.id, function(data) {
        console.log(data);
        if (data.value != false) {
            $scope.artwork = data[0].artwork;
            $scope.changingStatus($scope.artwork.fstatus);
            $scope.isSculpture($scope.artwork.type);
            $scope.artwork.user = {
                "_id": data[0]._id,
                "name": data[0].name
            };
            $scope.variable = data[0].name;
            if ($scope.artwork.status == "pending") {
                // $scope.disableSubmit = true;
            }
            if (!$scope.artwork.color) {
                $scope.artwork.color = [];
            }
            if (!$scope.artwork.style) {
                $scope.artwork.style = [];
            }
            if (!$scope.artwork.elements) {
                $scope.artwork.elements = [];
            }
            // console.log($scope.artwork)
        }
        $scope.calcsq();
    })


    $scope.submitComment = function() {
        if (!$scope.artwork.chat) {
            $scope.artwork.chat = [{
                "name": $scope.userData.name,
                "comment": $scope.chat.comment,
                "accesslevel": "artist"
            }];
        } else {
            $scope.artwork.chat.push({
                "name": $scope.userData.name,
                "comment": $scope.chat.comment,
                "accesslevel": "artist"
            });
        }
        $scope.chat.comment = '';
    }

    $scope.allartist = [];
    $scope.getDropdown = function(search) {
        if (search.length >= 1) {
            $scope.change = {};
            $scope.change.type = $scope.artwork.type;
            $scope.change.search = search;
            NavigationService.getAllArtistDropArtist($scope.change, function(data) {
                if (data && data.value != false) {
                    $scope.allartist = data;
                } else {
                    $scope.allartist = [];
                }
            });
        } else {
            $scope.allartist = [];
        }
    }

    $scope.resellers = [];
    $scope.getDropdownReseller = function(search) {
        if (search.length >= 1) {
            NavigationService.getAllResellerDrop(search, function(data) {
                if (data && data.value != false) {
                    $scope.resellers = data;
                } else {
                    $scope.resellers = [];
                }
            });
        } else {
            $scope.resellers = [];
        }
    }

    $scope.setSearch = function(select) {
        console.log(select.selected);
        $scope.variable = select.selected.name;
        $scope.artwork.user = select.selected;
    }

    $scope.setSearchReseller = function(select) {
        $scope.variableReseller = select.selected.name;
    }

    // NavigationService.lastSr(function(data, status) {
    //     console.log(data);
    //     $scope.artwork.srno = parseInt(data.srno) + 1;
    // });

    $scope.calculateprice = function(flag) {
        $scope.artwork.price = parseFloat($scope.artwork.price);
        $scope.artwork.gprice = parseFloat($scope.artwork.gprice);
        $scope.artwork.comm = parseFloat($scope.artwork.comm);
        if ($scope.artwork.comm > 100 && flag == 1) {
            $scope.artwork.comm = 100;
        } else if ($scope.artwork.comm < 1 && flag == 1) {
            $scope.artwork.comm = 1;
        }
        // if (_.isNumber($scope.artwork.comm) && _.isNumber($scope.artwork.price) && flag == 1) {
        //     console.log("first if");
        //     console.log($scope.artwork.price * $scope.artwork.comm);
        //     $scope.artwork.gprice = Math.round($scope.artwork.price + ($scope.artwork.price * $scope.artwork.comm / 100));
        // }
        if (_.isNumber($scope.artwork.gprice) && _.isNumber($scope.artwork.comm) && flag == 2) {
            $scope.artwork.price = Math.round($scope.artwork.gprice * (1 - ($scope.artwork.comm / 100)));
        }
    }

    $scope.removeimage = function(i) {
        $scope.artwork.image.splice(i, 1);
    };

    $scope.show = 0;
    $scope.showmed = 0;

    $scope.ismatch = function(data, select) {
        console.log(select.selected);
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveartMedium(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.artwork.subtype = select.selected;
            }
        });
        console.log($scope.artwork.subtype);
    }

    $scope.ismatchmed = function(data, select, index) {
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n)
                };
                NavigationService.saveTag(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                if (index == 1) {
                    $scope.artwork.color = select.selected;
                } else if (index == 2) {
                    $scope.artwork.style = select.selected;
                } else if (index == 3) {
                    $scope.artwork.elements = select.selected;
                }
            }
        });
    }


    //imageupload
    var imagejstupld = "";
    $scope.artwork.image = [];
    $scope.artwork.certi = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files, whichone) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, whichone);
            }
        }
    };

    $scope.start = function(index, whichone) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: imgUploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (whichone == 1) {
                        if (imagejstupld != "") {
                            $scope.artwork.image.push(imagejstupld.files[0].fd);
                            imagejstupld = "";
                        }
                    } else if (whichone == 2) {
                        if (imagejstupld != "") {
                            $scope.artwork.certi = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: imgUploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };
    ////
    $scope.framedStatus = false;
    $scope.changingStatus = function(data) {
        var fStatus = data;
        console.log(data);
        if (fStatus == 'framed') {
            $scope.framedStatus = true;
        } else if (fStatus == 'framed with glass') {
            $scope.framedStatus = true;
        } else if (fStatus == 'framed with acrylic sheet') {
            $scope.framedStatus = true;
        } else {
            $scope.framedStatus = false;
        }
    }

    $scope.isSculpture = function(type) {
        console.log($scope.artwork.subtype);
        console.log($scope.artwork.type);
        $scope.artwork.subtype = [];
        console.log($scope.artwork.subtype);
        $scope.show = 0;
        $scope.showmed = 0;
        if (type == "Sculptures") {
            $scope.showBreadth = true;
            $scope.otherDetails = "eg. with pedestal";
        } else if (type == "Paintings") {
            $scope.showBreadth = false;
            $scope.otherDetails = "eg. Diptych, Triptych";
            $scope.artwork.breadth = '';
        } else {
            $scope.showBreadth = false;
            $scope.otherDetails = "eg. Edition, Diptych, Triptych";
            $scope.artwork.breadth = '';
        }
        $scope.calcsq();
        switch (type) {
            case "Paintings":
                $scope.showPaintings = true;
                $scope.showSculpture = false;
                $scope.showPrints = false;
                $scope.showPhotography = false;
                $scope.multiplesel = false;
                break;
            case "Sculptures":
                $scope.showPaintings = false;
                $scope.showSculpture = true;
                $scope.showPrints = false;
                $scope.showPhotography = false;
                $scope.multiplesel = true;
                break;
            case "Photographs":
                $scope.showPaintings = false;
                $scope.showSculpture = false;
                $scope.showPrints = false;
                $scope.showPhotography = true;
                $scope.multiplesel = false;
                break;
            case "Prints":
                $scope.showPaintings = false;
                $scope.showSculpture = false;
                $scope.showPrints = true;
                $scope.showPhotography = false;
                $scope.multiplesel = false;
                break;
        }
    }

    $scope.showerror = false;
    $scope.createartwork = function() {
        NavigationService.getuserprofile(function(data) {
            if (data.id && $scope.artwork.user) {
                // console.log($scope.artwork);
                if (!$scope.artwork.chat) {
                    $scope.artwork.chat = [];
                }
                $scope.artwork.reseller = [{
                    "_id": data.id,
                    "name": data.name
                }];
                $scope.artwork.status = "pending";
                if (!$scope.artwork.subtype)
                    $scope.artwork.subtype = [];
                if (!$scope.artwork.tag)
                    $scope.artwork.tag = [];
                console.log($scope.artwork);
                if ($scope.artwork.type != "Sculptures") {
                    $scope.artwork.breadth = "";
                    $scope.artwork.weight = "";
                }
                if ($scope.artwork.user) {
                    $scope.showerror = false;
                    console.log($scope.artwork)
                    $scope.artwork.user = $scope.artwork.user._id;
                    if ($scope.artwork.tag.length == 0) {
                        $scope.artwork.tag[0] = {
                            _id: "",
                            name: "",
                            category: ""
                        };
                    }
                    $scope.userData._id = $scope.userData.id;
                    NavigationService.registeruser($scope.userData, function(data) {
                        console.log(data);
                    });
                    if (!$scope.artwork.focused) {
                        $scope.artwork.focused = "nonfocused";
                    }
                    _.each($scope.artwork.color, function(n) {
                        $scope.artwork.tag.push(n);
                    });
                    _.each($scope.artwork.style, function(n) {
                        $scope.artwork.tag.push(n);
                    });
                    _.each($scope.artwork.elements, function(n) {
                        $scope.artwork.tag.push(n);
                    });
                    $scope.artwork.tag = _.uniq($scope.artwork.tag, '_id');
                    NavigationService.saveArtwork($scope.artwork, function(data, status) {
                        console.log(data);
                        if (data.value == true) {
                            $scope.disableSubmit = true;
                            dataNextPre.messageBox("Your artwork has been submitted for review");
                            globalFunction.tab = "myartworks";
                            $timeout(function() {
                                $state.go('account');
                            }, 3000);
                        }
                        // $location.url("/artworkout");
                    });
                } else {
                    $scope.showerror = true;
                }
            } else {
                if (!data.id) {
                    dataNextPre.messageBox("Please login to upload artwork");
                } else if (!$scope.artwork.user) {
                    dataNextPre.messageBox("Please select an artist");
                }
            }
        })
    }

    $scope.refreshArtMedum = function(search, category) {
        $scope.artmedium = [];
        if (search) {
            if (!$scope.artwork.subtype)
                $scope.artwork.subtype = [];
            NavigationService.findArtMedium(search, $scope.artwork.subtype, category, function(data, status) {
                $scope.artmedium = data;
            });
        }
    };
    $scope.refreshTag = function(search, category) {
        $scope.tag = [];
        if (search) {
            if (!$scope.artwork.tag)
                $scope.artwork.tag = [];
            NavigationService.findTag(search, $scope.artwork.tag, category, function(data, status) {
                $scope.tag = _.uniq(data, '_id');
            });
        }
    };
})

.controller('EditArtistCtrl', function($scope, TemplateService, NavigationService, $upload, $timeout, $http, $stateParams) {
    $scope.template = TemplateService.changecontent("edit-artist");
    $scope.menutitle = NavigationService.makeactive("Edit Artist");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.user = {};
    $scope.user.personal = {};
    $scope.user.work = {};
    $scope.user.residence = {};
    $scope.user.other = {};
    $scope.user.medium = [];
    $scope.user.theme = [];

    $scope.isValidEmail = 1;
    $scope.checked = 0;
    $scope.medium = [];
    $scope.theme = [];

    //DEVELOPMENT

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            $scope.userData = data;

            $scope.isLoggedIn = true;
        } else {
            $scope.isLoggedIn = false;
        }
    })

    NavigationService.getArtistDetail($stateParams.id, function(data) {
        console.log(data);
        $scope.user = data;
        if ($scope.userData)
            $scope.user.selleremail = $scope.userData.email;
    });

    $scope.select2options = {
        maximumSelectionSize: 5,
        placeholder: "Select A Theme"
    };
    $scope.select2optionsmed = {
        maximumSelectionSize: 5,
        placeholder: "Select A Medium"
    };
    $scope.show = 0;
    $scope.showmed = 0;
    $scope.ismatch = function(data, select) {
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n)
                };
                NavigationService.saveTheme(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.user.theme = select.selected;
            }
        });
        console.log($scope.user.theme);
    }
    $scope.ismatchmed = function(data, select) {
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n)
                };
                NavigationService.saveMedium(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.user.medium = select.selected;
            }
        });
        console.log($scope.user.medium);
    }

    $scope.email = function(myemail) {
        if (myemail) {
            NavigationService.getOneemail(myemail, function(data, status) {
                if (data.value == true) {
                    console.log("if");
                    $scope.isValidEmail = 0;
                } else {
                    console.log("else");
                    $scope.isValidEmail = 1;
                }
            });
        }
    }
    $scope.checking = function() {
        if ($scope.user.checkboxModel) {
            $scope.checked = 0;
        } else {
            $scope.checked = 1;
        }
    }

    $scope.addsolo = function(crdv) {
        if (!crdv.soloshow) {
            crdv.soloshow = [{
                "year": "",
                "title": "",
                "gallery": "",
                "venue": ""
            }];
        } else {
            if (crdv.soloshow.length < 3) {
                crdv.soloshow.push({
                    "year": "",
                    "title": "",
                    "gallery": "",
                    "venue": ""
                });
            }
        }
    };
    $scope.removesolo = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.addedu = function(crdv) {
        if (!crdv.edu) {
            crdv.edu = [{
                "year": "",
                "quali": "",
                "institu": "",
                "city": ""
            }];
        } else {
            if (crdv.edu.length < 3) {
                crdv.edu.push({
                    "year": "",
                    "quali": "",
                    "institu": "",
                    "city": ""
                });
            }
        }
    };
    $scope.removeedu = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.addgroup = function(crdv) {
        if (!crdv.groupshow) {
            crdv.groupshow = [{
                "year": "",
                "title": "",
                "gallery": "",
                "venue": ""
            }];
        } else {
            if (crdv.groupshow.length < 3) {
                crdv.groupshow.push({
                    "year": "",
                    "title": "",
                    "gallery": "",
                    "venue": ""
                });
            }
        }
    };
    $scope.removegroup = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.addauction = function(crdv) {
        if (!crdv.auction) {
            crdv.auction = [{
                "year": "",
                "auctionhouse": "",
                "location": "",
                "details": ""
            }];
        } else {
            if (crdv.auction.length < 3) {
                crdv.auction.push({
                    "year": "",
                    "auctionhouse": "",
                    "location": "",
                    "details": ""
                });
            }
        }
    };
    $scope.removeauction = function(i, dev) {
        dev.splice(i, 1);
    };
    $scope.addaward = function(crdv) {
        if (!crdv.award) {
            crdv.award = [{
                "year": "",
                "title": "",
                "institution": ""
            }];
        } else {
            if (crdv.award.length < 3) {
                crdv.award.push({
                    "year": "",
                    "title": "",
                    "institution": ""
                });
            }
        }
    };
    $scope.removeaward = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.removeimage = function(i) {
        $scope.user.image = "";;
    };
    $scope.removeresume = function(i) {
        $scope.user.resume = "";
    };
    $scope.removeadcer = function(i) {
        $scope.user.adcer = "";
    };
    //imageupload
    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files, whichone) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, whichone);
            }
        }
    };

    $scope.start = function(index, whichone) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: imgUploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (whichone == 1) {
                        if (imagejstupld != "") {
                            $scope.user.image = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    } else if (whichone == 2) {
                        if (imagejstupld != "") {
                            $scope.user.resume = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    } else if (whichone == 3) {
                        if (imagejstupld != "") {
                            $scope.user.adcer = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: imgUploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };
    ////



    //save user
    $scope.disableSubmit = false;
    $scope.submitForm = function() {
        console.log($scope.user);
        if ($scope.isLoggedIn == true) {
            $scope.user.accesslevel = "artist";
            $scope.user.reseller = [{
                "_id": $scope.userData.id,
                "name": $scope.userData.name,
                "email": $scope.userData.email
            }]
            delete $scope.user.checkboxModel;
            if (!$scope.user.focused) {
                $scope.user.focused = "nonfocused";
            }
            $scope.user.status = "pending";
            NavigationService.registerArtist($scope.user, function(data, status) {
                console.log(data);
                if (data.value != false) {
                    dataNextPre.messageBox("Your request for additions / modifications has been sent to Aura Art");
                    $scope.disableSubmit = true;
                }
            });
        } else {
            dataNextPre.messageBox("Please login to update an artist");
        }
    };

    $scope.refreshMedium = function(search) {
        $scope.medium = [];
        if (search) {
            if (!$scope.user.medium)
                $scope.user.medium = [];
            NavigationService.findMedium(search, $scope.user.medium, function(data, status) {
                $scope.medium = data;
            });
        }
    };
    $scope.refreshTheme = function(search) {
        $scope.theme = [];
        if (search) {
            if (!$scope.user.theme)
                $scope.user.theme = [];
            NavigationService.findTheme(search, $scope.user.theme, function(data, status) {
                $scope.theme = data;
            });
        }
    };

})


.controller('RegisterArtistCtrl', function($scope, TemplateService, NavigationService, $upload, $timeout, $http, $state) {
    $scope.template = TemplateService.changecontent("register-artist");
    $scope.menutitle = NavigationService.makeactive("Register Artist");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.user = {};
    $scope.user.personal = {};
    $scope.user.work = {};
    $scope.user.residence = {};
    $scope.user.other = {};
    $scope.user.medium = [];
    $scope.user.theme = [];
    $scope.user.focused = "nonfocused";
    $scope.checked = 0;
    $scope.medium = [];
    $scope.theme = [];

    $scope.select2options = {
        maximumSelectionSize: 5,
        placeholder: "Select A Theme"
    };
    $scope.select2optionsmed = {
        maximumSelectionSize: 5,
        placeholder: "Select A Medium"
    };

    NavigationService.getCountryJson(function(data) {
        $scope.countries = data;
    });

    $scope.show = 0;
    $scope.showmed = 0;
    $scope.ismatch = function(data, select) {
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n)
                };
                NavigationService.saveTheme(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.user.theme = select.selected;
            }
        });
        console.log($scope.user.theme);
    }
    $scope.ismatchmed = function(data, select) {
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n)
                };
                NavigationService.saveMedium(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.user.medium = select.selected;
            }
        });
        console.log($scope.user.medium);
    }

    $scope.checking = function() {
        if ($scope.user.checkboxModel) {
            $scope.checked = 0;
        } else {
            $scope.checked = 1;
        }
    }

    $scope.addsolo = function(crdv) {
        if (!crdv.soloshow) {
            crdv.soloshow = [{
                "year": "",
                "title": "",
                "gallery": "",
                "venue": ""
            }];
        } else {
            if (crdv.soloshow.length < 3) {
                crdv.soloshow.push({
                    "year": "",
                    "title": "",
                    "gallery": "",
                    "venue": ""
                });
            }
        }
    };
    $scope.removesolo = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.addedu = function(crdv) {
        if (!crdv.edu) {
            crdv.edu = [{
                "year": "",
                "quali": "",
                "institu": "",
                "city": ""
            }];
        } else {
            if (crdv.edu.length < 3) {
                crdv.edu.push({
                    "year": "",
                    "quali": "",
                    "institu": "",
                    "city": ""
                });
            }
        }
    };
    $scope.removeedu = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.addgroup = function(crdv) {
        if (!crdv.groupshow) {
            crdv.groupshow = [{
                "year": "",
                "title": "",
                "gallery": "",
                "venue": ""
            }];
        } else {
            if (crdv.groupshow.length < 3) {
                crdv.groupshow.push({
                    "year": "",
                    "title": "",
                    "gallery": "",
                    "venue": ""
                });
            }
        }
    };
    $scope.removegroup = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.addauction = function(crdv) {
        if (!crdv.auction) {
            crdv.auction = [{
                "year": "",
                "auctionhouse": "",
                "location": "",
                "details": ""
            }];
        } else {
            if (crdv.auction.length < 3) {
                crdv.auction.push({
                    "year": "",
                    "auctionhouse": "",
                    "location": "",
                    "details": "",
                    "details": ""
                });
            }
        }
    };
    $scope.removeauction = function(i, dev) {
        dev.splice(i, 1);
    };
    $scope.addaward = function(crdv) {
        if (!crdv.award) {
            crdv.award = [{
                "year": "",
                "title": "",
                "institution": ""
            }];
        } else {
            if (crdv.award.length < 3) {
                crdv.award.push({
                    "year": "",
                    "title": "",
                    "institution": ""
                });
            }
        }
    };
    $scope.removeaward = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.removeimage = function(i) {
        $scope.user.image = "";;
    };
    $scope.removeresume = function(i) {
        $scope.user.resume = "";
    };
    $scope.removeadcer = function(i) {
        $scope.user.adcer = "";
    };
    //imageupload
    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files, whichone) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, whichone);
            }
        }
    };

    $scope.start = function(index, whichone) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: imgUploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (whichone == 1) {
                        if (imagejstupld != "") {
                            $scope.user.image = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    } else if (whichone == 2) {
                        if (imagejstupld != "") {
                            $scope.user.resume = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    } else if (whichone == 3) {
                        if (imagejstupld != "") {
                            $scope.user.adcer = imagejstupld.files[0].fd;
                            imagejstupld = "";
                        }
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: imgUploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };
    ////


    //DEVELOPMENT

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            $scope.userData = data;
            $scope.user.selleremail = $scope.userData.email;
            $scope.isLoggedIn = true;
            if (!$scope.user.residence) {
                $scope.user.residence = {};
                $scope.user.residence.country = "";
            } else if (!$scope.user.residence.country) {
                $scope.user.residence.country = "";
            }
            if (!$scope.user.work) {
                $scope.user.work = {};
                $scope.user.work.country = "";
            } else if (!$scope.user.work.country) {
                $scope.user.work.country = "";
            }
            if (!$scope.user.other) {
                $scope.user.other = {};
                $scope.user.other.country = "";
            } else if (!$scope.user.other.country) {
                $scope.user.other.country = "";
            }
        } else {
            $scope.isLoggedIn = false;
        }
    })

    //save user
    $scope.disableSubmit = false;
    $scope.submitForm = function() {
        console.log($scope.user);
        if ($scope.isLoggedIn == true) {
            $scope.user.accesslevel = "artist";
            $scope.user.status = "pending";
            $scope.user.reseller = [{
                    "_id": $scope.userData.id,
                    "name": $scope.userData.name,
                    "email": $scope.userData.email
                }]
                // if ($scope.user.checkboxModel) {
            delete $scope.user.checkboxModel
            NavigationService.registerArtist($scope.user, function(data, status) {
                console.log(data);
                if (data.value != false) {
                    dataNextPre.messageBox("Artist has been registerd and is in review");
                    $scope.disableSubmit = true;
                    $timeout(function() {
                        $state.go("create-artwork");
                    }, 3000)
                }
                // $location.url("/user");
            });
            // } else {
            //     if (!$scope.user.checkboxModel) {
            //         $scope.checked = 1;
            //     }
            //     console.log("not");
            // }
        } else {
            dataNextPre.messageBox("Please login to register an artist");
        }
    };

    $scope.refreshMedium = function(search) {
        $scope.medium = [];
        if (search) {
            if (!$scope.user.medium)
                $scope.user.medium = [];
            NavigationService.findMedium(search, $scope.user.medium, function(data, status) {
                $scope.medium = data;
            });
        }
    };
    $scope.refreshTheme = function(search) {
        $scope.theme = [];
        if (search) {
            if (!$scope.user.theme)
                $scope.user.theme = [];
            NavigationService.findTheme(search, $scope.user.theme, function(data, status) {
                $scope.theme = data;
            });
        }
    };
})

.controller('FavoriteProductCtrl', function($scope, TemplateService, NavigationService, $stateParams) {
    $scope.template = TemplateService.changecontent("favorite-product");
    $scope.menutitle = NavigationService.makeactive("Favorites");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    NavigationService.getartworkdetail($stateParams.artid, function(data, status) {
        $scope.artistDetailImg = data[0];
        console.log($scope.artistDetailImg);
    });

    $scope.addToCart = function(art) {
        dataNextPre.addToCart(art);
    }

})

.controller('BuyersTermConditionCtrl', function($scope, TemplateService, NavigationService, $state, cfpLoadingBar) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("buyerstermcondition");
    $scope.menutitle = NavigationService.makeactive("Buyers Terms ConditionCtrl");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
})

.controller('TermConditionCtrl', function($scope, TemplateService, NavigationService, $state, cfpLoadingBar) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("termcondition");
    $scope.menutitle = NavigationService.makeactive("Term Condition");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    NavigationService.getuserprofile(function(data) {
        if (data.id) {
            NavigationService.getoneartist(data.id, function(artistdata, status) {
                $scope.userData = artistdata;
            })
        }
    })

    $scope.makeReseller = function() {
        cfpLoadingBar.start();
        $scope.userData.accesslevel = "reseller";
        NavigationService.registeruser($scope.userData, function(data, status) {
            cfpLoadingBar.complete();
            console.log(data);
            if (data.value != false) {
                dataNextPre.messageBox("You are now a seller");
                $state.go("account");
            } else {
                dataNextPre.messageBox("There's  some problem");
            }
        })
    }

})

.controller('SearchResultsCtrl', function($scope, TemplateService, NavigationService, $stateParams, $location, ngDialog, $timeout, $state, cfpLoadingBar) {
    $scope.template = TemplateService.changecontent("searchresults");
    $scope.menutitle = NavigationService.makeactive("Search Results");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
    $scope.totalartcont = [];
    var lastpage = 0;
    if ($.jStorage.get("searchObj")) {
        $scope.art = $.jStorage.get("searchObj");
    }

    if ($.jStorage.get("searchResults")) {
        $scope.artworks = $.jStorage.get("searchResults");
        lastpage = $scope.artworks.totalpages;
        _.each($scope.artworks.data, function(n) {
            if (n.artwork) {
                _.each(n.artwork, function(m) {
                    var item = {};
                    item._id = n._id;
                    item.name = n.name;
                    item.artwork = m;
                    $scope.totalartcont.push(item);
                })
            }
        })
        $scope.totalartcont = _.uniq($scope.totalartcont, 'artwork._id');
        console.log($scope.totalartcont);
    }

    $scope.getSearchedArt = function() {
        console.log(lastpage);
        if ($scope.art.search != '' && lastpage >= $scope.art.pagenumber) {
            cfpLoadingBar.start();
            NavigationService.getArtworkbySearch($scope.art, function(data) {
                console.log(data);
                if (data.value != false) {
                    lastpage = data.totalpages;
                    $scope.artworks = data;
                    _.each($scope.artworks.data, function(n) {
                        if (n.artwork) {
                            _.each(n.artwork, function(m) {
                                var item = {};
                                item._id = n._id;
                                item.name = n.name;
                                item.artwork = m;
                                $scope.totalartcont.push(item);
                            })
                        }
                    })
                    $scope.totalartcont = _.uniq($scope.totalartcont, 'artwork._id');
                }
                cfpLoadingBar.complete();
            })
        }
    }

    $scope.addMoreItems = function() {
        $scope.art.pagenumber++;
        $scope.getSearchedArt();
    }

    $scope.showDetails = function(oneuser) {
        console.log(oneuser)
        $scope.artistDetailImg = oneuser;
        ngDialog.open({
            scope: $scope,
            template: 'views/content/quickview-imagedetail.html'
        });
    };

    $scope.lauchedSoon = function() {
        ngDialog.open({
            template: 'views/content/modal-launch.html'
        });
        $timeout(function() {
            ngDialog.closeAll();
        }, 3000);
    };

    $scope.goToDetailPage = function(artwork) {
        console.log(artwork);
        if (artwork.type == "Sculptures") {
            //          $location.url("/sculpture/" + artwork._id);
            $state.go('sculpture', {
                artid: artwork._id
            });
        } else {
            //          $location.url("/artwork/detail/" + artwork._id);
            $state.go('detail', {
                artid: artwork._id
            });
        }
    }

    $scope.makeFav = function(art) {
        dataNextPre.favorite(art);
    }

    $scope.addToCart = function(art) {
        dataNextPre.addToCart(art);
    }

})

.controller('ThankYouCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $location, $state, $stateParams, ngDialog) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("thankyou");
    $scope.menutitle = NavigationService.makeactive("Thank You");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();
})

.controller('SorryCtrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $location, $state, $stateParams, ngDialog) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("sorry");
    $scope.menutitle = NavigationService.makeactive("Sorry");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.order = {};
    $scope.order.orderid = $stateParams.orderId;
})

.controller('Error404Ctrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $location, $state, $stateParams, ngDialog) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("error404");
        $scope.menutitle = NavigationService.makeactive("Home");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('PrivacyPolicyCtrl', function($scope, TemplateService, NavigationService, $state, cfpLoadingBar) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("privacy-policy");
        $scope.menutitle = NavigationService.makeactive("Privacy Policy");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('Error500Ctrl', function($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $location, $state, $stateParams, ngDialog) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("error500");
        $scope.menutitle = NavigationService.makeactive("Home");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    });
