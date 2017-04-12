<!DOCTYPE html>
<html lang="en" ng-app="firstapp">
<head ng-controller="headerctrl">
  <!-- <base href="http://auraart.in/"> -->
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="After a couple of decades of researching and collecting art, Aura Art was formed in April 2006 by the Core Team (comprising of Daljit Singh Sethi and his sons Harmeet and Rishiraj), to fill the gaps in the Indian Art Industry - identifying and discovering value amongst the best of Indian art, utilising every available platform to promote art, assisting art lovers in building and maintaining their collections, working closely with the design space to meet their aesthetic requirements - with an aspiration to migrate to a fully Integrated Art House.  Aura Art now boasts of some of the most prominent personalities from all walks of life in its Team.">
  <meta name="author" content="Aura Art Development Pvt Ltd | Aura Art eConnect Pvt Ltd">
  <meta property="og:site_name" content="Aura Art">
  <meta property="og:title" content="Aura Art" />
  <meta property="og:description" content="After a couple of decades of researching and collecting art, Aura Art was formed in April 2006 by the Core Team (comprising of Daljit Singh Sethi and his sons Harmeet and Rishiraj), to fill the gaps in the Indian Art Industry - identifying and discovering value amongst the best of Indian art, utilising every available platform to promote art, assisting art lovers in building and maintaining their collections, working closely with the design space to meet their aesthetic requirements - with an aspiration to migrate to a fully Integrated Art House.  Aura Art now boasts of some of the most prominent personalities from all walks of life in its Team." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="http://auraart.in/img/fb-banner.jpg">

  <!-- <link rel="canonical" href="http://auraart.in/"> -->

  <title ng-bind="'Aura Art - '+template.title">Aura Art</title>

  <link rel="shortcut icon" href="img/favicon.ico" />
  <link rel="stylesheet" type="text/css" href="w/w.css" />

  <script src="bower_components/jquery/dist/jquery.min.js"></script>
  <!--<script src="bower_components/select2/select2.min.js"></script>-->
   <script src="bower_components/select2/dist/js/select2.min.js"></script>
  <script src="lib/flexislider/jquery.flexslider.js"></script>
  <script src="bower_components/fancyBox/source/jquery.fancybox.pack.js"></script>
  <script src="bower_components/moment/min/moment.min.js"></script>
  <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <script src="bower_components/elevatezoom/jquery.elevatezoom.js"></script>

  <script src="bower_components/angular/angular.min.js"></script>
  <script src="lib/flexislider/angular-flexslider.js"></script>
  <script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
  <script src="bower_components/angular-animate/angular-animate.min.js"></script>
  <script src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
  <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
  <script src="bower_components/ui-router/release/angular-ui-router.min.js"></script>
  <script src="bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
  <script src="bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js"></script>
  <script src="bower_components/angularjs-toaster/toaster.min.js"></script>
  <script src="bower_components/valdr/valdr.min.js"></script>
  <script src="bower_components/valdr/valdr-message.min.js"></script>
  <script src="bower_components/ngDialog/js/ngDialog.min.js"></script>
  <script src="bower_components/ngAutocomplete/src/ngAutocomplete.js"></script>
    <script src="bower_components/ui-select/dist/select.min.js"></script>
  <!--<script src="bower_components/angular-ui-select/dist/select.min.js"></script>-->
  <script src="bower_components/lodash/lodash.js"></script>
  <script src="bower_components/angular-rangeslider/angular.rangeSlider.js"></script>
  <script src="bower_components/angular-scroll/angular-scroll.min.js"></script>
  <script src="bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js"></script>
  <script src="lib/js/angular-file-upload.js"></script>
  <script src="lib/js/FileAPI.min.js"></script>
  <script src="lib/js/upload.js"></script>
  <script src="bower_components/angulartics/dist/angulartics.min.js"></script>
  <script src="bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js"></script>

  <script src="js/app.js"></script>
  <script src="js/controllers.js"></script>
  <script src="js/templateservice.js"></script>
  <script src="js/navigation.js"></script>
  <script src="lib/js/jstorage.js"></script>

  <script>
    var isproduction = false;
    
  </script>

  <!--[if IE]>
        <script src="https://cdn.jsdelivr.net/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://cdn.jsdelivr.net/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
</head>

<body zoom-container>
  <div class="repeated-item" ui-view></div>

  <!--Start of Zopim Live Chat Script-->
  <script type="text/javascript">
    window.$zopim || (function(d, s) {
      var z = $zopim = function(c) {
          z._.push(c)
        },
        $ = z.s =
        d.createElement(s),
        e = d.getElementsByTagName(s)[0];
      z.set = function(o) {
        z.set.
        _.push(o)
      };
      z._ = [];
      z.set._ = [];
      $.async = !0;
      $.setAttribute('charset', 'utf-8');
      $.src = '//v2.zopim.com/?3cFV0GUt4f8WF5Ngbrb2OZaIhyP3rZ5S';
      z.t = +new Date;
      $.
      type = 'text/javascript';
      e.parentNode.insertBefore($, e)
    })(document, 'script');
  </script>
  <!--End of Zopim Live Chat Script-->
  <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-73593562-1', 'auto');
  ga('send', 'pageview');

</script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-78150046-1', 'auto');
</script>
<!-- Google Code for AuraArt Conversion Conversion Page -->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 946145875;
var google_conversion_language = "en";
var google_conversion_format = "3";
var google_conversion_color = "ffffff";
var google_conversion_label = "3uMSCOK282cQ05SUwwM";
var google_remarketing_only = false;
/* ]]> */
</script>
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/946145875/?label=3uMSCOK282cQ05SUwwM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>
<!-- Google Code for Remarketing Tag -->
<!--------------------------------------------------
Remarketing tags may not be associated with personally identifiable information or placed on pages related to sensitive categories. See more information and instructions on how to setup the tag on: http://google.com/ads/remarketingsetup
--------------------------------------------------->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 946145875;
var google_custom_params = window.google_tag_params;
var google_remarketing_only = true;
/* ]]> */
</script>
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/946145875/?value=0&amp;guid=ON&amp;script=0"/>
</div>
</noscript>
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '1451471994870382');
fbq('track', "PageView");
fbq('track', 'Purchase', {value: '1.00', currency: 'INR'});

</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1451471994870382&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->

</body>
</html>
