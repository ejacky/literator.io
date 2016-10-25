"use strict";angular.module("literatorioApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","pascalprecht.translate","angular-google-analytics","underscore","angular-speakingurl","webfont-loader","mcwebb.sound"]).filter("encodeURIComponent",["$window",function(a){return a.encodeURIComponent}]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/verse/404",{templateUrl:"views/verse404.html",controller:"Verse404Ctrl",controllerAs:"verse404"}).when("/verse/:authorName/:verseName",{templateUrl:"views/verse.html",controller:"VerseCtrl",controllerAs:"verse"}).otherwise({redirectTo:"/"})}]).config(["$translateProvider",function(a){a.useStaticFilesLoader({prefix:"i18n/",suffix:".json"}),a.useSanitizeValueStrategy("escape");var b={"en-US":"en","ru-RU":"ru","*":"en"};a.registerAvailableLanguageKeys(["en","ru"],b).fallbackLanguage("en"),a.useLocalStorage()}]).config(["AnalyticsProvider",function(a){a.setAccount("UA-6315511-11"),a.trackPages(!1),a.useDisplayFeatures(!0),a.useAnalytics(!0)}]).run(["$rootScope","$injector","$window","$location","$translate","Analytics",function(a,b,c,d,e,f){a.global={},a.global.pageTitle="Literator.io",a.$on("$routeChangeSuccess",function(b,c){a.global.currentPage=c.$$route.controllerAs,f.trackPage(d.path())}),c.WebFont.load({custom:{families:["NotoSerif:n4,i4,n7"]}});try{var g=b.get("CountriesDataStore");g.loadSound({name:"bell",src:"resources/sounds/bell.mp3"})}catch(a){}b.get("CountriesDataStore")}]),angular.module("literatorioApp").controller("MainCtrl",["$rootScope","$scope","$location","$timeout","$translate","VerseDataStore","Analytics",function(a,b,c,d,e,f,g){function h(){e("COMMON_APP_NAME").then(function(b){a.global.pageTitle=b}),b.isLeaving=!1,b.onStartButtonClick=i,b.$on("$destroy",k),l.push(d(function(){a.$broadcast("HeaderCtrl.doShow"),a.$broadcast("FooterCtrl.doShow"),a.$broadcast("GitHubRibbonCtrl.doShow")},3e3)),g.trackEvent("web","main-init")}function i(){f.getRandomVerse().then(function(a){j(a.url),g.trackEvent("web","main-start-btn-click")})}function j(e){b.isLeaving=!0,d(function(){c.url(e)},1500),a.$broadcast("HeaderCtrl.doHide"),a.$broadcast("FooterCtrl.doHide"),a.$broadcast("GitHubRibbonCtrl.doHide")}function k(){l.forEach(function(a){d.cancel(a)})}var l=[];h()}]),angular.module("literatorioApp").controller("AboutCtrl",["$rootScope","$translate","Analytics",function(a,b,c){function d(){a.global.pageTitle=b.instant("COMMON_APP_NAME"),e("html, body").animate({scrollTop:0}),a.$broadcast("HeaderCtrl.doShow"),a.$broadcast("FooterCtrl.doShow"),a.$broadcast("GitHubRibbonCtrl.doHide"),c.trackEvent("web","about-init")}var e=angular.element;d()}]),angular.module("literatorioApp").controller("VerseCtrl",["$q","$rootScope","$scope","$location","$routeParams","$timeout","$interval","$translate","VerseDataStore","VerseBlock","SoundManager","CountriesDataStore","Analytics",function(a,b,c,d,e,f,g,h,i,j,k,l,m){function n(){var g=null;i.getVerseByAuthorAndName(e.authorName,e.verseName).then(function(b){if(g=b,!g)throw{type:404};return a.all({content:g.loadContent(),author:g.getAuthor()})}).then(function(a){O=g.authorName+"/"+g.name,R=g.getPieces(),Q=P("#content"),aa=P(".view-verse input"),c.$on("$destroy",H),Q.bind("click",C),c.verse=g,c.author=a.author,c.versePieces=[],c.currentBlock=null,c.inputFieldMaxLength=J+1,c.isIOS=N,c.isFinished=!1,c.isSkipped=!1,c.isLeaving=!1,c.isControlsHintVisible=!1,c.isSkipVerseOptionsVisible=!1,c.onInputFieldKeyup=B,c.onAnotherVerseButtonClick=D,c.onAnotherVerseOfAuthorButtonClick=E,c.onSkipVerseAcceptClick=F,c.onSkipVerseDeclineClick=G,U.push(f(function(){o(),V=new Date},2600)),b.global.pageTitle=g.title+" | "+h.instant("COMMON_APP_NAME"),b.$broadcast("HeaderCtrl.doHide"),b.$broadcast("FooterCtrl.doHide"),b.$broadcast("GitHubRibbonCtrl.doHide"),m.trackEvent("web","verse-init",O)}).catch(function(a){switch(m.trackEvent("web","verse-init-error",O),a.type){case 404:d.url("/verse/404")}})}function o(){S&&g.cancel(S),S=g(s,L)}function p(){S&&(g.cancel(S),S=null)}function q(){T&&g.cancel(T),_="",T=g(t,M)}function r(){T&&(g.cancel(T),T=null,_="")}function s(){var a=R.shift();return angular.isDefined(a)?void(!c.isSkipped&&a instanceof j?(p(),c.currentBlock=a,$++,f(function(){aa.focus()},100),aa.val(""),q(),z(aa),u()):c.versePieces.push(a)):(p(),aa.blur(),c.isFinished=!0,c.resultSeconds=Math.floor((Date.now()-V.getTime())/1e3),c.resultPercents=Math.ceil(($-Y)/($+.01)*100),c.resultPercentsAnimated=0,c.resultMark=l.getMarkForPercents(c.resultPercents),U.push(f(function(){c.isBottomVisible=!0,b.$broadcast("HeaderCtrl.doShow"),b.$broadcast("FooterCtrl.doShow"),U.push(f(function(){z(".view-verse .bottom")},50))},6e3)),U.push(f(function(){c.resultPercentsAnimated=0;var a=g(function(){c.resultPercentsAnimated+=1,c.resultPercentsAnimated>=c.resultPercents&&(g.cancel(a),c.isMarkVisible=!0)},30);U.push(a)},6500)),void(c.isSkipped||(m.trackEvent("web","verse-complete",O),m.trackEvent("web","verse-complete-percents",O,c.resultPercents),m.trackEvent("web","verse-complete-mark-"+c.resultMark,O),m.trackEvent("web","verse-complete-seconds",O,c.resultSeconds))))}function t(){var a=c.currentBlock.toString().substr(_.length,1);!a.length||_.length>=I?(y(),Y++,Z++,Z>0&&Z%K===0&&!c.isControlsHintVisible&&v()):(_+=a,0===String(aa.val()).indexOf(a)&&aa.val(String(aa.val()).substr(1)),c.versePieces.push(a),X++)}function u(){W||(W=!0,c.isControlsHintVisible=!0)}function v(){c.isSkipVerseOptionsVisible=!0}function w(){c.isSkipVerseOptionsVisible=!1}function x(){c.isControlsHintVisible=!1,c.$applyAsync()}function y(){if(c.currentBlock){var a=c.currentBlock.toString().substr(_.length);c.currentBlock=null,c.versePieces.push(a),aa.val(""),k.playSound("bell"),r(),o()}}function z(a,b){var c=P(a);if(c.size()){var d=Math.max(0,c.offset().top-window.innerHeight/(N?4:2));P("html, body").animate({scrollTop:d},b||300)}}function A(a){c.isLeaving=!0,z("body",1200),b.$broadcast("HeaderCtrl.doHide"),b.$broadcast("FooterCtrl.doHide"),U.push(f(function(){d.url(a)},1500))}function B(){c.currentBlock&&((c.currentBlock.match(_+aa.val(),J)||c.currentBlock.match(aa.val(),J))&&(y(),Z=0),x())}function C(a){["A","BUTTON"].indexOf(a.target.tagName)===-1&&(a.stopPropagation(),a.preventDefault()),aa.focus(),x()}function D(){m.trackEvent("web","verse-another-verse-btn-click",O),i.getRandomVerse().then(function(a){return c.verse.isMatch(a)?D():void A(a.url)})}function E(){m.trackEvent("web","verse-another-verse-of-author-btn-click",O),i.getRandomVerseForAuthor(e.authorName).then(function(a){return c.verse.isMatch(a)?D():void A(a.url)})}function F(){m.trackEvent("web","verse-skip-verse-accept",O),c.isSkipped=!0,w(),L=30,y()}function G(){m.trackEvent("web","verse-skip-verse-decline",O),c.isSkipVerseOptionsVisible=!1}function H(){Q.unbind("click",C),r(),p(),U.forEach(function(a){f.cancel(a),g.cancel(a)}),c.isFinished||m.trackEvent("web","verse-leave-uncompleted",O)}var I=2,J=3,K=3,L=100,M=4e3,N=/iPad|iPhone|iPod/.test(navigator.userAgent),O=null,P=angular.element,Q=null,R=null,S=null,T=null,U=[],V=null,W=!1,X=0,Y=0,Z=0,$=0,_=null,aa=null;n()}]),angular.module("literatorioApp").factory("Verse",["$injector","$http","VerseBlock",function(a,b,c){function d(a){angular.extend(this,a),this.path=[this.PATH_BASE,this.authorName,"verses",this.name].join("/"),this.url=[this.URL_BASE,this.authorName,this.name].join("/")}return d.prototype={DIFFICULTY_EASY:"easy",DIFFICULTY_NORMAL:"normal",BLOCK_SEPARATOR_START:"{",BLOCK_SEPARATOR_END:"}",URL_BASE:"/verse",PATH_BASE:"resources/verses",loadContent:function(){var a=this;return b({method:"GET",url:this.path+"/content.txt"}).then(function(b){var c=b.data.trim();return c=c.replace(/[\s](\x2d|\x2212|\x2010\x2012\x2043)/g," —").replace(/\n\r|\r\n|\r/g,"\n").replace(/[\n]{3,}/g,"\n\n").replace(/[\x20]{2,}/g," "),a.content=c,a.plainText=c.replace(new RegExp("\\"+a.BLOCK_SEPARATOR_START+"|\\"+a.BLOCK_SEPARATOR_END,"g"),""),a})},getPieces:function(a){var b=this;a=angular.extend({difficulty:"easy"},a||{});var d=b.normalizeStringToDifficulty(b.content,a.difficulty).split(""),e=[],f=!1,g=null;return d.forEach(function(a){switch(a){case b.BLOCK_SEPARATOR_START:f=!0,g="";break;case b.BLOCK_SEPARATOR_END:f=!1,g.length&&e.push(new c(g));break;default:f?g+=a:e.push(a)}}),e},getAuthor:function(){return a.get("VerseDataStore").getAuthorByName(this.authorName)},isMatch:function(a){return this.name===a.name&&this.authorName===a.authorName},normalizeStringToDifficulty:function(a,b){var c=this,d=b===c.DIFFICULTY_EASY?1:2,e=a.split(""),f=[],g=[];return e.forEach(function(a,b){switch(a){case c.BLOCK_SEPARATOR_START:f.push(b);break;case c.BLOCK_SEPARATOR_END:g.push(b)}if(f.length&&f.length===g.length){var h=Math.min(f.length,d),i=function(a,b){b+1!==h&&delete e[a]};f.reverse().forEach(i),g.forEach(i),f=[],g=[]}}),e.join("")}},d}]),angular.module("literatorioApp").factory("VerseDataStore",["$q","$http","_","Verse","VerseAuthor",function(a,b,c,d,e){function f(){return l.getDataStructure||(l.getDataStructure=b({method:"GET",url:"resources/verses/structure.json",responseType:"json"}).then(function(a){return a.data})),l.getDataStructure}function g(a){return f().then(function(b){return b.authors.filter(function(b){return!a||!b.studiedInCountries||b.studiedInCountries.indexOf(a)!==-1}).map(function(a){return new e(a)})})}function h(a){return f().then(function(b){var d=c.findWhere(b.authors,{name:a});return d?new e(d):null})}function i(a){if(a){var b;return g(a).then(function(a){return b=a.map(function(a){return a.name}),f()}).then(function(a){var e=a.verses.filter(function(a){return b.indexOf(a.authorName)!==-1});return e&&e.length?new d(c.sample(e)):null})}return f().then(function(a){return a.verses&&a.verses.length?new d(c.sample(a.verses)):null})}function j(a){return f().then(function(b){var e=c.sample(c.where(b.verses,{authorName:a}));return e?new d(e):null})}function k(a,b){return f().then(function(e){var f=c.findWhere(e.verses,{authorName:a,name:b});return f?new d(f):null})}var l={};return f(),{getDataStructure:f,getAuthorsList:g,getAuthorByName:h,getRandomVerse:i,getRandomVerseForAuthor:j,getVerseByAuthorAndName:k}}]),angular.module("literatorioApp").service("VerseBlock",["$speakingurl",function(a){function b(a){this._string=a,this._stringNormalized=this.normalizeString(a)}return b.prototype={match:function(a,b){return!(a.length<Math.min(this._string.length,b))&&0===this._stringNormalized.indexOf(this.normalizeString(a.substr(0,b)))},normalizeString:function(b){return b=(b+"").toLowerCase().replace("ё","е"),a.getSlug(b)},toString:function(){return this._string},valueOf:function(){return this.toString()}},b}]),angular.module("literatorioApp").service("VerseAuthor",function(){function a(a){angular.extend(this,a)}return a}),angular.module("literatorioApp").controller("Verse404Ctrl",["Analytics","$rootScope",function(a,b){a.trackEvent("web","verse404-init"),b.$broadcast("HeaderCtrl.doShow"),b.$broadcast("FooterCtrl.doShow")}]),angular.module("literatorioApp").controller("FooterCtrl",["$scope",function(a){function b(){a.isVisible=!1,a.$on("FooterCtrl.doShow",d),a.$on("FooterCtrl.doHide",c)}function c(){a.isVisible=!1}function d(){a.isVisible=!0}b()}]),angular.module("literatorioApp").controller("CountryMenuCtrl",["$scope","CountriesDataStore",function(a,b){function c(){a.countries=b.getAvailableCountries(),a.currentCountry=b.getCurrentCountry(),a.onCountryChange=d}function d(c){b.setCurrentCountry(c),a.currentCountry=b.getCurrentCountry()}c()}]),angular.module("literatorioApp").service("CountriesDataStore",["$rootScope","$translate","$window","_",function(a,b,c,d){function e(){var a=g(c.localStorage.getItem(l))||j(c.navigator.languages||[c.navigator.language||c.navigator.userLanguage])||g(n);i(a)}function f(){return m}function g(a){return d.findWhere(m,{countryCode:a})}function h(){return o}function i(d){o=d,b.use(d.language);try{c.localStorage.setItem(l,d.countryCode)}catch(a){}a.global.currentLang=d.language}function j(a,b){var c=a.map(function(a){return(""+a).toLowerCase()});b||(b=f());var d=null,e=null;return b.forEach(function(a){a.languageCodes.forEach(function(b){b=b.toLowerCase();var f=c.indexOf(b);f!==-1&&(null===e||f/a.languageCodes.length<e)&&(e=f/a.languageCodes.length,d=a)})}),d}function k(a,b){return b||(b=h()),b.percentsToMark?b.percentsToMark(a):null}var l="CountriesDataStore.currentCountryCode",m=[{countryCode:"ru",title:"Россия",languageCodes:["ru","ru-RU"],language:"ru",percentsToMark:function(a){return a<50?"3":a<60?"4-":a<70?"4":a<80?"4+":a<90?"5-":a<99?"5":"5+"}},{countryCode:"us",title:"USA",languageCodes:["us","en-US","en"],language:"en",percentsToMark:function(a){return a<50?"D":a<60?"C":a<70?"B-":a<80?"B":a<90?"A-":a<99?"A":"A+"}},{countryCode:"ie",title:"Ireland",languageCodes:["ie","en-IE","ga-IE","gd-IE","ga","en-GB","en"],language:"en",percentsToMark:function(a){return a<50?"D":a<60?"C":a<70?"B-":a<80?"B":a<90?"A-":a<99?"A":"A+"}}],n="ru",o=null;return e(),{getAvailableCountries:f,getCountryByCode:g,getCurrentCountry:h,setCurrentCountry:i,getMarkForPercents:k,determineCountryByLanguage:j}}]),angular.module("literatorioApp").controller("HeaderCtrl",["$scope","Analytics",function(a,b){function c(){a.isVisible=!1,a.onSocialClick=f,a.$on("HeaderCtrl.doShow",e),a.$on("HeaderCtrl.doHide",d)}function d(){a.isVisible=!1}function e(){a.isVisible=!0}function f(a){b.trackEvent("web","header-social-click",a)}c()}]),angular.module("literatorioApp").service("SoundManager",["$injector",function(a){function b(a){c&&c.getSound(a).start()}var c=null;try{c=a.get("SoundService"),c.loadSound({name:"bell",src:"resources/sounds/bell.mp3"})}catch(a){console.warn("[SoundManager] WebAudio is not supported")}return{playSound:b}}]),angular.module("literatorioApp").controller("ShareCtrl",["$scope","Analytics",function(a,b){function c(a){b.trackEvent("web","share-click",a)}a.shareUrl=window.location.href,a.shareTitle="",a.shareDescription="",a.shareImage=window.location.href.replace(/#.*/,"")+"images/og_image_560x292.jpg",a.onClick=c}]),angular.module("literatorioApp").controller("GitHubRibbonCtrl",["$scope","Analytics",function(a,b){function c(){a.isVisible=!1,a.$on("GitHubRibbonCtrl.doShow",e),a.$on("GitHubRibbonCtrl.doHide",d),a.onClick=f}function d(){a.isVisible=!1}function e(){a.isVisible=!0}function f(){b.trackEvent("web","git-hub-ribbon-click")}c()}]),angular.module("literatorioApp").run(["$templateCache",function(a){a.put("views/about.html",'<div class="view-about"> <h3>{{ \'VIEW_ABOUT_CREATOR_TITLE\' | translate }}</h3> <p><a href="http://bobrosoft.com" target="_blank">{{ \'VIEW_ABOUT_CREATOR_NAME\' | translate }}</a></p> <h3>{{ \'VIEW_ABOUT_SOCIAL_TITLE\' | translate }}</h3> <p> <a href="https://vk.com/literatorio" target="_blank">VKontakte</a> / <a href="https://www.facebook.com/LiteratorioApp/" target="_blank">Facebook</a> </p> <h3>{{ \'VIEW_ABOUT_CONTRIBUTE_TITLE\' | translate }}</h3> <p><a href="https://github.com/bobrosoft/literator.io-verses" target="_blank">{{ \'VIEW_ABOUT_CONTRIBUTE_VERSES_REPO\' | translate }}</a></p> <p><a href="https://github.com/bobrosoft/literator.io" target="_blank">{{ \'VIEW_ABOUT_CONTRIBUTE_APP_REPO\' | translate }}</a></p> <h3>{{ \'VIEW_ABOUT_VERSES_TITLE\' | translate }}</h3> <p>{{ \'VIEW_ABOUT_VERSES_DISCLAIMER\' | translate }}</p> <p>{{ \'VIEW_ABOUT_VERSES_HOW_TO_ADD\' | translate }} <a href="https://github.com/bobrosoft/literator.io-verses" target="_blank">{{ \'VIEW_ABOUT_VERSES_HOW_TO_ADD_LINK\' | translate }}</a></p> <h3>{{ \'VIEW_ABOUT_CONTACTS_TITLE\' | translate }}</h3> <p><a href="mailto:bobr@bobrosoft.com" target="_blank">bobr@bobrosoft.com</a></p> </div>'),a.put("views/countrymenu.html",'<li class="view-country-menu" ng-controller="CountryMenuCtrl"> <ul> <li ng-repeat="country in ::countries track by $index"><a href="" ng-click="onCountryChange(country)">{{ ::country.title }}</a></li> </ul> <a href="" class="main-link"><img src="images/main/country_menu_icon.png"> {{ currentCountry.title }}</a> </li>'),a.put("views/footer.html",'<div id="footer" ng-controller="FooterCtrl" ng-class="{show: isVisible}"> <div class="top-border"></div> <div> <p class="phrase"> <a href="#/about">{{ \'FOOTER_MAIN_PHRASE_LEFT\' | translate }} <span class="heart">&#x2661;</span> {{ \'FOOTER_MAIN_PHRASE_RIGHT\' | translate }}</a> </p> <p class="phrase"> <a href="#/about">{{ \'FOOTER_ABOUT_PROJECT_LINK\' | translate }}</a> </p> </div> </div>'),a.put("views/githubribbon.html",'<a ng-controller="GitHubRibbonCtrl" class="view-github-ribbon" ng-class="{show: isVisible}" href="https://github.com/bobrosoft/literator.io" target="_blank" ng-click="onClick()">Fork me on GitHub</a>'),a.put("views/header.html",'<ul id="header" ng-controller="HeaderCtrl" ng-class="{show: isVisible}"> <li><a class="logo" href="#/" ng-class="{show: global.currentPage != \'main\'}">{{ \'COMMON_APP_NAME\' | translate }}</a></li> <li class="spacer"></li> <ng-include src="\'views/countrymenu.html\'"></ng-include> <li class="social"> <a class="vk" target="_blank" href="https://vk.com/literatorio" ng-click="onSocialClick(\'vk\')" ng-include="\'images/common/share/vk.svg\'" aria-label="Vkontakte"></a> <a class="fb" target="_blank" href="https://www.facebook.com/LiteratorioApp/" ng-click="onSocialClick(\'fb\')" ng-include="\'images/common/share/facebook.svg\'" aria-label="Facebook"></a> </li> </ul>'),a.put("views/main.html",'<div class="view-main" ng-class="{leaving: isLeaving}"> <div class="logo" ng-show="global.currentLang" itemscope itemtype="http://schema.org/Organization"> <a itemprop="url" href="#/"> <img itemprop="logo" ng-src="images/main/logo_{{ global.currentLang == \'ru\' ? \'ru\' : \'en\' }}.png" alt="Literator.io"> </a> </div> <div class="menu"> <a href="" class="button start" ng-click="onStartButtonClick()">{{ \'VIEW_MAIN_START_BTN\' | translate }}</a> </div> </div>'),a.put("views/share.html",'<div class="view-share"> <a target="_blank" href="https://vk.com/share.php?url={{shareUrl | encodeURIComponent}}&title={{shareTitle | encodeURIComponent}}&description={{shareDescription | encodeURIComponent}}&image={{shareImage | encodeURIComponent}}&noparse=true" ng-click="onClick(\'vk\')" ng-include="\'images/common/share/vk.svg\'">Vkontakte</a> <a target="_blank" href="https://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl={{shareUrl | encodeURIComponent}}&st.comments={{shareTitle | encodeURIComponent}}" ng-click="onClick(\'ok\')" ng-include="\'images/common/share/ok.svg\'">Odnoklassniki</a> <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u={{shareUrl | encodeURIComponent}}&title={{shareTitle | encodeURIComponent}}&description={{shareDescription | encodeURIComponent}}" ng-click="onClick(\'facebook\')" ng-include="\'images/common/share/facebook.svg\'">Facebook</a> <a target="_blank" href="https://twitter.com/intent/tweet?url={{shareUrl | encodeURIComponent}}&text={{shareTitle | encodeURIComponent}}" ng-click="onClick(\'twitter\')" ng-include="\'images/common/share/twitter.svg\'">Twitter</a> </div>'),a.put("views/verse.html",'<div class="view-verse" ng-class="{leaving: isLeaving}"> <div> <div class="top" ng-show="verse.title"> <h1 class="title">{{ ::verse.title }}</h1> <p class="description">{{ ::verse.description }}</p> <img class="monogram" src="images/verse/mono-top.png"> </div> <div class="content"> <div> <div class="width-spacer">{{ ::verse.plainText }}</div> <div class="pieces"> <span ng-repeat="piece in versePieces track by $index">{{::piece + \'\'}}</span><input ng-class="{visible: currentBlock, hidden: !currentBlock}" ng-keyup="onInputFieldKeyup()" autocorrect="off" autocomplete="off" autocapitalize="off" maxlength="{{inputFieldMaxLength}}"> </div> <div class="author" ng-show="isFinished"> <p class="name">{{ ::author.shortName }}</p> <p class="year">{{ ::verse.year }} {{ \'VIEW_VERSE_SHORT_YEAR\' | translate }}</p> <img class="monogram" src="images/verse/mono-bottom.png"> </div> </div> </div> <div class="panels" ng-show="!isFinished"> <div class="panel hint" ng-class="{show: isControlsHintVisible}"> <p>{{ (isIOS ? \'VIEW_VERSE_CONTROLS_HINT_IOS\' : \'VIEW_VERSE_CONTROLS_HINT\') | translate }}</p> </div> <div class="panel skip" ng-class="{show: isSkipVerseOptionsVisible}"> <p> <a href="" class="button" ng-click="onSkipVerseAcceptClick()">{{ \'VIEW_VERSE_SKIP_ACCEPT_BTN\' | translate}}</a> <a href="" class="button" ng-click="onSkipVerseDeclineClick()">{{ \'VIEW_VERSE_SKIP_DECLINE_BTN\' | translate}}</a> </p> </div> </div> <div class="bottom"> <div class="ending" ng-if="isBottomVisible"> <div class="result" ng-show="!isSkipped"> <div class="result-text"> <div class="line-1">{{ \'VIEW_VERSE_RESULT_LINE_1\' | translate }}</div> <div class="line-2">{{ resultPercentsAnimated }}%</div> <div class="line-3">{{ \'VIEW_VERSE_RESULT_LINE_3\' | translate }} <span ng-if="resultSeconds > 60">{{ resultSeconds / 60 | number: 0 }} {{ \'VIEW_VERSE_RESULT_MINUTES\' | translate }}</span> {{ resultSeconds % 60 | number: 0 }} {{ \'VIEW_VERSE_RESULT_SECONDS\' | translate }}</div> </div> <div class="result-visual" ng-class="{\'show-mark\': isMarkVisible}"> <div class="empty"></div> <div class="filled" ng-style="{height: resultPercentsAnimated + \'%\'}"> <div class="filler"></div> </div> <div class="mark" ng-class="{\'high\': resultPercents > 70}">{{ ::resultMark }}</div> </div> </div> <h3 class="share-title" ng-show="resultPercents > 60">{{ \'VIEW_VERSE_SHARE_MARK_TITLE\' | translate }}</h3> <ng-include src="\'views/share.html\'" ng-if="verse.title" ng-controller="ShareCtrl" ng-init="shareTitle = (resultPercents > 60 ? ((&quot;VIEW_VERSE_SHARE_MARK_PRE&quot; | translate) + &quot; &quot; + resultMark + &quot;. &quot;) : &quot;&quot;) + (&quot;VIEW_VERSE_SHARE_TITLE_PRE&quot; | translate) + &quot; \\&quot;&quot; + verse.title + &quot;\\&quot; (&quot; + author.shortName + &quot;)&quot;"></ng-include> <div class="buttons"> <div><a href="" class="button another-verse" ng-click="onAnotherVerseButtonClick()">{{ \'VIEW_VERSE_ANOTHER_VERSE_BTN\' | translate }}</a></div> <div><a href="" class="button another-verse-of-author" ng-click="onAnotherVerseOfAuthorButtonClick()">{{ \'VIEW_VERSE_ANOTHER_VERSE_OF_AUTHOR_BTN\' | translate }}</a></div> </div> </div> </div> </div> </div>'),a.put("views/verse404.html",'<div class="view-verse404"> <div> <p class="number"><span>4</span><span>0</span><span>4</span></p> <img class="monogram" src="images/verse/mono-bottom.png"> <p class="message">{{ \'VIEW_VERSE_404_MESSAGE\' | translate }}</p> </div> </div>')}]);