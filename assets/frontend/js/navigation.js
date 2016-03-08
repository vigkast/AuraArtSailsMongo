// var adminurl = "http://146.148.34.49/";
var adminurl = "http://smartsnap.in/";
// var adminurl = "http://smartsnap.in:81/";
// var adminurl = "http://192.168.0.126:81/";
var imgUploadUrl = adminurl + "user/uploadfile";

var navigationservice = angular.module('navigationservice', ['ngDialog'])

.factory('NavigationService', function($http, ngDialog) {
    var navigation = [{
        name: "Home",
        active: "",
        link: "#/home",
        classis: "active",
        subnav: []
    }, {
        name: "About",
        active: "",
        link: "#",
        classis: "active",
        subnav: [{
            name: "Team",
            classis: "active",
            link: "#/team",
            clickopen: ""
        }, {
            name: "Activities",
            classis: "active",
            link: "#/activities",
            clickopen: ""
        }]
    }, {
        name: "Artists",
        active: "",
        link: "#/artist/All",
        classis: "active",
        subnav: [{
            name: "Paintings",
            classis: "active",
            link: "#/artist/Paintings",
            clickopen: ""
        }, {
            name: "Sculptures",
            classis: "active",
            link: "#/artist/Sculptures",
            clickopen: ""
        }, {
            name: "Photographs",
            classis: "active",
            link: "#/artist/Photographs",
            clickopen: ""
        }, {
            name: "Prints",
            classis: "active",
            link: "#/artist/Prints",
            clickopen: ""
        }, {
            name: "Others",
            classis: "active",
            link: "#/artist/Others",
            clickopen: ""
        }]
    }, {
        name: "Paintings & more",
        active: "",
        link: "#/artwork/All",
        classis: "active",
        subnav: [{
            name: "Paintings",
            classis: "active",
            link: "#/artwork/Paintings",
            clickopen: ""
        }, {
            name: "Sculptures",
            classis: "active",
            link: "#/artwork/Sculptures",
            clickopen: ""
        }, {
            name: "Commissioned Sculptures",
            classis: "active",
            link: "#/artwork/Sculptures",
            clickopen: ""
        }, {
            name: "Photographs",
            classis: "active",
            link: "#/artwork/Photographs",
            clickopen: ""
        }, {
            name: "Prints",
            classis: "active",
            link: "#/artwork/Prints",
            clickopen: ""
        }, {
            name: "Others",
            classis: "active",
            link: "#/artwork/Others",
            clickopen: ""
        }]
    }, {
        name: "Infra Services",
        active: "",
        link: "#/infra-services",
        classis: "active",
        subnav: []
            // subnav: [{
            //     name: "Data Management",
            //     classis: "active",
            //     link: "#/infra-services"
            // }, {
            //     name: "Valuation & Insurance",
            //     classis: "active",
            //     link: "#/infra-services"
            // }, {
            //     name: "Strategy for Art Initiatives, including CSR",
            //     classis: "active",
            //     link: "#/infra-services"
            // }, {
            //     name: "Packing & Logistics",
            //     classis: "active",
            //     link: "#/infra-services"
            // }, {
            //     name: "Archival Facility Set-up",
            //     classis: "active",
            //     link: "#/infra-services"
            // }, {
            //     name: "Trusteeship & Warehousing",
            //     classis: "active",
            //     link: "#/infra-services"
            // }, {
            //     name: "Training & Workshops",
            //     classis: "active",
            //     link: "#/infra-services"
            // }]
    }, {
        name: "Events",
        active: "",
        link: "#/events",
        classis: "active",
        subnav: [{
            name: "Current Events",
            classis: "active",
            link: "#/events",
            clickopen: ""
        }, {
            name: "Upcoming Events",
            classis: "active",
            link: "#/events",
            clickopen: ""
        }, {
            name: "Past Events",
            classis: "active",
            link: "#/events",
            clickopen: ""
        }]
    }, {
        name: "Press",
        active: "",
        link: "#/press",
        classis: "active",
        subnav: []
    }, {
        name: "Contact Us",
        active: "",
        link: "",
        classis: "active",
        subnav: [{
            name: "Join our mailing list",
            classis: "active",
            function: function() {
                ngDialog.open({
                    template: 'views/content/join-mail.html'
                });
            }
        }, {
            name: "Reach out for artworks",
            classis: "active",
            link: "#/reach-out"
        }, {
            name: "Upload Artworks for Sale",
            classis: "active",
            function: function() {
                globalFunction.becomeSeller();
            }
        }, {
            name: "Contact Details",
            classis: "active",
            link: "#/contactus"
        }]
    }];

    return {
        getnav: function() {
            return navigation;
        },
        makeactive: function(menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        registeruser: function(register, callback) {
            delete register.confirmpassword
            $http({
                url: adminurl + "user/save",
                method: "POST",
                data: register
            }).success(callback);
        },
        registerArtist: function(register, callback) {
            delete register.confirmpassword
            $http({
                url: adminurl + "user/saveArtist",
                method: "POST",
                data: register
            }).success(callback);
        },
        changePassword: function(register, callback) {
            $http({
                url: adminurl + "user/changepassword",
                method: "POST",
                data: register
            }).success(callback);
        },
        userlogin: function(login, callback) {
            $http({
                url: adminurl + "user/login",
                method: "POST",
                data: login
            }).success(callback);
        },
        forgotpassword: function(forgot, callback) {
            $http({
                url: adminurl + "user/forgotpassword",
                method: "POST",
                data: forgot
            }).success(callback);
        },
        artworktype: function(filterdata, callback) {
            //            delete pagedata.minbreadth;
            //            delete pagedata.maxbreadth;
            $http({
                url: adminurl + "artwork/artworktype",
                method: "POST",
                data: filterdata
            }).success(callback);
        },
        getartworkdetail: function(artid, callback) {
            $http({
                url: adminurl + "artwork/findbyid",
                method: "POST",
                data: {
                    "_id": artid
                }
            }).success(callback);
        },
        getallartist: function(pagedata, callback) {
            delete pagedata.pagenumber;
            delete pagedata.pagesize;
            $http({
                url: adminurl + "user/findbyletter",
                method: "POST",
                data: pagedata
            }).success(callback);
        },
        getListView: function(callback) {
            $http({
                url: adminurl + "user/findbyletter",
                method: "POST",
                data: {
                    "pagenumber": 1,
                    "pagesize": 10000000000000
                }
            }).success(callback);
        },
        getoneartist: function(artistid, callback) {
            $http({
                url: adminurl + "user/findone",
                method: "POST"
            }).success(callback);
        },
        getLastArtwork: function(callback) {
            $http({
                url: adminurl + "artwork/lastsr",
                method: "POST"
            }).success(callback);
        },
        getArtistDetail: function(artistid, callback) {
            $http({
                url: adminurl + "user/findoneArtist",
                method: "POST",
                data: {
                    "_id": artistid
                }
            }).success(callback);
        },
        reachOutArtist: function(reachout, callback) {
            $http({
                url: adminurl + "reachout/save",
                method: "POST",
                data: reachout
            }).success(callback);
        },
        getpresentevents: function(callback) {
            $http({
                url: adminurl + "event/findevents",
                method: "POST",
                data: {
                    "year": "present"
                }
            }).success(callback);
        },
        getpastevents: function(callback) {
            $http({
                url: adminurl + "event/findevents",
                method: "POST",
                data: {
                    "year": "past"
                }
            }).success(callback);
        },
        addToFav: function(obj, callback) {
            $http({
                url: adminurl + "wishlist/save",
                method: "POST",
                data: obj
            }).success(callback);
        },
        deleteFromFav: function(userid, artid, callback) {
            $http({
                url: adminurl + "wishlist/delete",
                method: "POST",
                data: {
                    "artwork": artid
                }
            }).success(callback);
        },
        getMyFavourites: function(userid, callback) {
            $http({
                url: adminurl + "wishlist/find",
                method: "POST"
            }).success(callback);
        },
        addToCart: function(artid, callback) {
            $http({
                url: adminurl + "cart/save",
                method: "POST",
                data: {
                    "artwork": artid
                }
            }).success(callback);
        },
        removeFromCart: function(artid, callback) {
            $http({
                url: adminurl + "cart/delete",
                method: "POST",
                data: {
                    "artwork": artid
                }
            }).success(callback);
        },
        checkout: function(order, callback) {
            console.log(order);
            $http({
                url: adminurl + "order/save",
                method: "POST",
                data: order
            }).success(callback);
        },
        getCartItems: function(callback) {
            $http({
                url: adminurl + "cart/find",
                method: "POST"
            }).success(callback);
        },
        getuserprofile: function(callback) {
            $http({
                url: adminurl + "user/profile",
                method: "POST",

            }).success(callback);
        },
        logout: function(callback) {
            $http({
                url: adminurl + "user/logout",
                method: "POST",

            }).success(callback);
        },
        getAllEvents: function(callback) {
            $http({
                url: adminurl + "event/find",
                method: "POST",

            }).success(callback);
        },
        getOneEvents: function(id, callback) {
            $http({
                url: adminurl + "event/findone",
                method: "POST",
                data: {
                    "_id": id
                }
            }).success(callback);
        },

        getupcomingevents: function(callback) {
            $http({
                url: adminurl + "event/findevents",
                method: "POST"
            }).success(callback);
        },
        pressFind: function(callback) {
            $http({
                url: adminurl + "press/find",
                method: "POST",
            }).success(callback);
        },
        getAllFavouritesData: function(artarray, callback) {
            $http({
                url: adminurl + "artwork/favoriteartwork",
                method: "POST",
                data: {
                    "artwork": artarray
                }
            }).success(callback);
        },
        getAllArtistDrop: function(searchtext, callback) {
            $http({
                url: adminurl + "user/findUser",
                method: "POST",
                data: searchtext
            }).success(callback);
        },
        getAllArtistDropArtist: function(searchtext, callback) {
            $http({
                url: adminurl + "user/findforart",
                method: "POST",
                data: searchtext
            }).success(callback);
        },
        getallmedium: function(data, callback) {
            $http({
                url: adminurl + "artmedium/getmedium",
                method: "POST",
                data: data
            }).success(callback);
        },
        userbytype: function(searchtext, n, callback) {
            $http({
                url: adminurl + "user/userbytype",
                method: "POST",
                data: {
                    "type": searchtext
                }
            }).success(function(data, status) {
                callback(data, status, n);
            });
        },
        getAllArtistByAccess: function(n, callback) {
            $http({
                url: adminurl + "user/findbyaccess",
                method: "POST",
                data: {
                    "accesslevel": "artist"
                }
            }).success(function(data, status) {
                callback(data, status, n);
            });
        },
        getArtworkbySearch: function(pagedata, callback) {
            $http({
                url: adminurl + "artwork/searchartwork",
                method: "POST",
                data: {
                    "search": pagedata.search,
                    "type": pagedata.type,
                    "pagenumber": pagedata.pagenumber,
                    "pagesize": pagedata.pagesize
                }
            }).success(callback);
        },
        getSlider: function(callback) {
            $http({
                url: adminurl + "slider/find",
                method: "POST"
            }).success(callback)
        },
        getSearchDrop: function(search, n, callback) {
            $http({
                url: adminurl + "artwork/searchdrop",
                method: "POST",
                data: {
                    "search": search
                }
            }).success(function(data) {
                callback(data, n);
            })
        },
        nextPrev: function(srno, type, callback) {
            $http({
                url: adminurl + "artwork/nextartwork",
                method: "POST",
                data: {
                    "srno": srno,
                    "type": type,
                    "pageno": $.jStorage.get("pageno").pageno,
                    "lastpage": $.jStorage.get("pageno").lastpage
                }
            }).success(callback);
        },
        tagSearchType: function(type, search, callback) {
            $http({
                url: adminurl + "tag/gettag",
                method: "POST",
                data: {
                    "type": type,
                    "search": search
                }
            }).success(callback);
        },
        placeOrder: function(order, callback) {
            $http({
                url: adminurl + "order/save",
                method: "POST",
                data: order
            }).success(callback);
        },
        getMyOrders: function(callback) {
            $http({
                url: adminurl + "order/findOrders",
                method: "POST"
            }).success(callback);
        },
        getCountryJson: function(callback) {
            $http.get('js/countries.json').success(callback);
        },
        getAllThoughts: function(callback) {
            $http({
                url: adminurl + "thought/find",
                method: "POST"
            }).success(callback);
        },
        getOneThought: function(id, callback) {
            $http({
                url: adminurl + 'thought/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        getDollarPrice: function(callback) {
            $http({
                url: adminurl + 'dollar/find',
                method: 'POST'
            }).success(callback);
        },
        lastSr: function(callback) {
            $http({
                url: adminurl + "artwork/lastsr",
                method: "POST"
            }).success(callback);
        },
        getAllResellerDrop: function(searchtext, callback) {
            $http({
                url: adminurl + "user/findCust",
                method: "POST",
                data: {
                    "search": searchtext
                }
            }).success(callback);
        },
        findArtMedium: function(data, artmedium, category, callback) {
            $http({
                url: adminurl + "artmedium/find",
                method: "POST",
                data: {
                    search: data,
                    category: category,
                    artmedium: artmedium
                }
            }).success(callback);
        },
        findTag: function(data, tag, category, callback) {
            $http({
                url: adminurl + "tag/find",
                method: "POST",
                data: {
                    search: data,
                    category: category,
                    tag: tag
                }
            }).success(callback);
        },
        saveArtwork: function(data, callback) {
            $http({
                url: adminurl + "artwork/saveFront",
                method: "POST",
                data: data
            }).success(callback);
        },
        getOneemail: function(myemail, callback) {
            $http({
                url: adminurl + "user/searchmail",
                method: "POST",
                data: {
                    "email": myemail
                }
            }).success(callback);
        },
        findTheme: function(data, theme, callback) {
            $http({
                url: adminurl + "theme/find",
                method: "POST",
                data: {
                    search: data,
                    theme: theme
                }
            }).success(callback);
        },
        findMedium: function(data, medium, callback) {
            $http({
                url: adminurl + "medium/find",
                method: "POST",
                data: {
                    search: data,
                    medium: medium
                }
            }).success(callback);
        },
        findMyArtwork: function(callback) {
            $http({
                url: adminurl + "artwork/findMyArtwork",
                method: "POST"
            }).success(callback);
        },
        saveartMedium: function(data, callback) {
            $http({
                url: adminurl + "artmedium/save",
                method: "POST",
                data: {
                    "name": data.name,
                    "category": data.category,
                }
            }).success(callback);
        },
        saveTag: function(data, callback) {
            $http({
                url: adminurl + "tag/save",
                method: "POST",
                data: {
                    "name": data.name,
                    "category": data.category,
                }
            }).success(callback);
        },
        saveMedium: function(data, callback) {
            $http({
                url: adminurl + "medium/save",
                method: "POST",
                data: {
                    "name": data.name
                }
            }).success(callback);
        },
        saveTheme: function(data, callback) {
            $http({
                url: adminurl + "theme/save",
                method: "POST",
                data: {
                    "name": data.name
                }
            }).success(callback);
        },
        createwishlistfolder: function(name, callback) {
            $http({
                url: adminurl + "wishlistfolder/save",
                method: "POST",
                data: {
                    "name": name
                }
            }).success(callback);
        },
        getMyFolders: function(callback) {
            $http({
                url: adminurl + "wishlistfolder/find",
                method: "POST",
            }).success(callback);
        },
    }
});
