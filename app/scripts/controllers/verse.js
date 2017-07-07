'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:VerseCtrl
 * @description
 * # VerseCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('VerseCtrl', function ($q, $rootScope, $scope, $location, $routeParams, $timeout, $interval, 
                                     $translate, VerseDataStore, VerseBlock, SoundManager, CountriesDataStore, Analytics) {

    var maxHintsCount = 2;
    var maxCharsToComplete = 3;
    var maxUnsolvedBlocksBeforeSkipHint = 3;
    var typingInterval = 100;
    var hintingInterval = 4000;
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    var analyticsLabel = null;
    var $ = angular.element;
    var siteContentElement = null;
    var remainingVersePieces = null;
    var narrativeTimer = null;
    var hintingTimer = null;
    var otherTimers = []; // only timeouts should be here
    var narrativeStartTime = null;
    var wasControlsHintShown = false;
    var hintsDisplayedCount = 0;
    var unsolvedBlocks = 0;
    var continuousUnsolvedBlocks = 0;
    var totalBlocksCount = 0;
    var currentHint = null;
    var inputField = null;

    init();


    /**
     * Initializes controller
     */
    function init() {
      var verse = null;

      // Load random verse
      VerseDataStore.getVerseByAuthorAndName($routeParams.authorName, $routeParams.verseName).then(function(_verse) {
        verse = _verse;

        // Check, if verse found
        if (!verse) {
          throw {type: 404};
        }

        // Load necessary pieces of the verse
        return $q.all({
          content: verse.loadContent(),
          author: verse.getAuthor()
        });
      }).then(function(result) {
        analyticsLabel = verse.authorName + '/' + verse.name;
        remainingVersePieces = verse.getPieces();
        siteContentElement = $('#content');
        inputField = $('.view-verse input');
        result.author.getVerses(); // load list of verses for author

        // Add event listeners
        $scope.$on('$destroy', onDestroy);
        siteContentElement.bind('click', onSiteContentClick);

        // Populate scope
        $scope.verse = verse;
        $scope.author = result.author;
        $scope.versePieces = [];
        $scope.currentBlock = null;
        $scope.inputFieldMaxLength = maxCharsToComplete + 1;
        $scope.isIOS = isIOS;
        $scope.isFinished = false;
        $scope.isSkipped = false;
        $scope.isLeaving = false;
        $scope.isControlsHintVisible = false;
        $scope.isSkipVerseOptionsVisible = false;
        $scope.onInputFieldKeyup = onInputFieldKeyup;
        $scope.onAnotherVerseButtonClick = onAnotherVerseButtonClick;
        $scope.onAnotherVerseOfAuthorButtonClick = onAnotherVerseOfAuthorButtonClick;
        $scope.onSkipVerseAcceptClick = onSkipVerseAcceptClick;
        $scope.onSkipVerseDeclineClick = onSkipVerseDeclineClick;


        // Start narrative
        otherTimers.push($timeout(function(){
          continueNarrative();
          narrativeStartTime = new Date();
        }, 2600)); // sync with animation

        $rootScope.global.pageTitle = verse.title + ' | ' + $translate.instant('COMMON_APP_NAME');
        $rootScope.$broadcast('HeaderCtrl.doHide');
        $rootScope.$broadcast('FooterCtrl.doHide');
        $rootScope.$broadcast('GitHubRibbonCtrl.doHide');

        Analytics.trackEvent('web', 'verse-init', analyticsLabel);
      }).catch(function(e) {
        Analytics.trackEvent('web', 'verse-init-error', analyticsLabel);
        
        switch (e.type) {
          case 404:
            $location.url('/verse/404');
            break;

          default:
            //console.log(e);
        }
      });
    }

    /**
     * Continues verse output
     */
    function continueNarrative() {
      if (narrativeTimer) {
        $interval.cancel(narrativeTimer);
      }

      narrativeTimer = $interval(displayNextVersePiece, typingInterval);
    }

    /**
     * Stops verse output
     */
    function stopNarrative() {
      if (narrativeTimer) {
        $interval.cancel(narrativeTimer);
        narrativeTimer = null;
      }
    }

    /**
     * Starts giving delayed hints to user
     */
    function startHinting() {
      if (hintingTimer) {
        $interval.cancel(hintingTimer);
      }

      currentHint = '';
      hintingTimer = $interval(displayNextHint, hintingInterval);
    }

    /**
     * Stops giving hints
     */
    function stopHinting() {
      if (hintingTimer) {
        $interval.cancel(hintingTimer);
        hintingTimer = null;
        currentHint = '';
      }
    }

    /**
     * Getting next piece of verse and displaying it based on its type
     */
    function displayNextVersePiece() {
      var nextPiece = remainingVersePieces.shift();

      // Finish verse if no pieces left
      if (!angular.isDefined(nextPiece)) {
        stopNarrative();
        inputField.blur();

        $scope.isFinished = true;
        $scope.resultSeconds = Math.floor((Date.now() - narrativeStartTime.getTime()) / 1000);
        $scope.resultPercents = Math.ceil((totalBlocksCount - unsolvedBlocks) / (totalBlocksCount + 0.01) * 100);
        $scope.resultPercentsAnimated = 0;
        $scope.resultMark = CountriesDataStore.getMarkForPercents($scope.resultPercents);

        otherTimers.push($timeout(function(){
          $scope.isBottomVisible = true;

          $rootScope.$broadcast('HeaderCtrl.doShow');
          $rootScope.$broadcast('FooterCtrl.doShow');

          otherTimers.push($timeout(function(){
            scrollTo('.view-verse .bottom');
          }, 50));
        }, 6000)); // sync with animation

        otherTimers.push($timeout(function(){
          $scope.resultPercentsAnimated = 0;

          // Animate percents counter
          var timer = $interval(function() {
            $scope.resultPercentsAnimated += 1;
            if ($scope.resultPercentsAnimated >= $scope.resultPercents) {
              $interval.cancel(timer);
              $scope.isMarkVisible = true;
            }
          }, 30);
          otherTimers.push(timer);
        }, 6500)); // sync with animation

        // Track results
        if (!$scope.isSkipped) {
          Analytics.trackEvent('web', 'verse-complete', analyticsLabel);
          Analytics.trackEvent('web', 'verse-complete-percents', analyticsLabel, $scope.resultPercents);
          Analytics.trackEvent('web', 'verse-complete-mark-' + $scope.resultMark, analyticsLabel);
          Analytics.trackEvent('web', 'verse-complete-seconds', analyticsLabel, $scope.resultSeconds);
        }
        return;
      }

      // Need to stop narrative, if that's a block
      if (!$scope.isSkipped && nextPiece instanceof VerseBlock) {
        stopNarrative();
        $scope.currentBlock = nextPiece;
        totalBlocksCount++;

        // Focus to input field
        $timeout(function() {
          inputField.focus(); // not working in Mobile Safari. Maybe somebody know some WORKING solution?
        }, 100);
        inputField.val('');

        startHinting();
        scrollTo(inputField);
        displayControlsHintOnce();
      } else {
        // Display that piece
        $scope.versePieces.push(nextPiece);
      }
    }

    /**
     * Displays next hint for current block
     */
    function displayNextHint() {
      var nextHintChar = $scope.currentBlock.toString().substr(currentHint.length, 1);

      // Check, if enough hints for that block
      if (!nextHintChar.length || currentHint.length >= maxHintsCount) {
        resolveCurrentBlock();
        unsolvedBlocks++;
        continuousUnsolvedBlocks++;

        // Check if need to show skip verse options
        if (continuousUnsolvedBlocks > 0 && continuousUnsolvedBlocks % maxUnsolvedBlocksBeforeSkipHint === 0
          && !$scope.isControlsHintVisible) {
          displaySkipVerseOptions();
        }
      } else {
        currentHint += nextHintChar;

        // Remove hint char from input, if it's there
        if (String(inputField.val()).indexOf(nextHintChar) === 0) {
          inputField.val(String(inputField.val()).substr(1));
        }

        // Display hint char
        $scope.versePieces.push(nextHintChar);
        hintsDisplayedCount++;
      }
    }

    /**
     * Displays hint about controls only once
     */
    function displayControlsHintOnce() {
      if (wasControlsHintShown) {
        return;
      }

      wasControlsHintShown = true;
      $scope.isControlsHintVisible = true;
    }

    /**
     * Displays skip verse options
     */
    function displaySkipVerseOptions() {
      $scope.isSkipVerseOptionsVisible = true;
    }

    /**
     * Hides skip verse options
     */
    function hideSkipVerseOptions() {
      $scope.isSkipVerseOptionsVisible = false;
    }

    /**
     * Hides hint about controls
     */
    function hideControlsHint() {
      $scope.isControlsHintVisible = false;
      $scope.$applyAsync(); // needed if executed outside $scope
    }

    /**
     * Finishes current block and continues narrative
     */
    function resolveCurrentBlock() {
      if (!$scope.currentBlock) {
        return;
      }
      
      // Display rest of the current block
      var nextPiece = $scope.currentBlock.toString().substr(currentHint.length);
      $scope.currentBlock = null;
      $scope.versePieces.push(nextPiece);

      inputField.val('');

      SoundManager.playSound('bell');
      stopHinting();
      continueNarrative();
    }

    /**
     * Scrolls to selector
     * @param selector
     * @param duration
     */
    function scrollTo(selector, duration) {
      var el = $(selector);
      if (!el.size()) {
        return;
      }
      
      var newScrollTop = Math.max(0, el.offset().top - window.innerHeight / (isIOS ? 4 : 2));
      $('html, body').animate({scrollTop: newScrollTop}, duration || 300);
    }

    /**
     * Leaves the page and redirects to URL passed
     * @param {String} url
     */
    function leavePageWithNewUrl(url) {
      $scope.isLeaving = true;
      scrollTo('body', 1200);

      $rootScope.$broadcast('HeaderCtrl.doHide');
      $rootScope.$broadcast('FooterCtrl.doHide');

      otherTimers.push($timeout(function(){
        $location.url(url);
      }, 1500)); // sync with animation
    }

    /**
     * Callback firing on input field keyup
     */
    function onInputFieldKeyup() {
      // Exit, if no block to solve
      if (!$scope.currentBlock) {
        return;
      }

      // Check if entered value matches block value
      if ($scope.currentBlock.match(currentHint + inputField.val(), maxCharsToComplete)
        || $scope.currentBlock.match(inputField.val(), maxCharsToComplete) // for those, who will enter it fully
      ) {
        resolveCurrentBlock();
        continuousUnsolvedBlocks = 0;
      }

      hideControlsHint();
    }

    /**
     * Callback firing when user clicks on site content area
     * @param {Event} event
     */
    function onSiteContentClick(event) {
      if (['A', 'BUTTON'].indexOf(event.target.tagName) === -1) {
        // Prevent default unnecessary behavior
        event.stopPropagation();
        event.preventDefault();
      }

      // Focus on input field
      inputField.focus(); // mostly for Mobile Safari

      hideControlsHint();
    }

    /**
     * Callback firing on "Another verse" click
     */
    function onAnotherVerseButtonClick() {
      Analytics.trackEvent('web', 'verse-another-verse-btn-click', analyticsLabel);
      
      VerseDataStore.getRandomVerse().then(function(newVerse) {
        // Check, if new verse is the same one as current and re-pick
        if ($scope.verse.isMatch(newVerse)) {
          return onAnotherVerseButtonClick();
        }

        // Redirect to new verse
        leavePageWithNewUrl(newVerse.url);
      });
    }

    /**
     * Callback firing on "Another author's verse" click
     */
    function onAnotherVerseOfAuthorButtonClick() {
      Analytics.trackEvent('web', 'verse-another-verse-of-author-btn-click', analyticsLabel);
      
      VerseDataStore.getRandomVerseForAuthor($routeParams.authorName).then(function(newVerse) {
        // Check, if new verse is the same one as current and re-pick
        if ($scope.verse.isMatch(newVerse)) {
          return onAnotherVerseButtonClick();
        }

        // Redirect to new verse
        leavePageWithNewUrl(newVerse.url);
      });
    }

    /**
     * Callback firing when user accepted to skip this verse
     */
    function onSkipVerseAcceptClick() {
      Analytics.trackEvent('web', 'verse-skip-verse-accept', analyticsLabel);
      
      $scope.isSkipped = true;
      hideSkipVerseOptions();
      
      // Speedup narrative
      typingInterval = 30;
      resolveCurrentBlock();
      stopNarrative();
      continueNarrative();
    }

    /**
     * Callback firing when user denied to skip this verse
     */
    function onSkipVerseDeclineClick() {
      Analytics.trackEvent('web', 'verse-skip-verse-decline', analyticsLabel);

      $scope.isSkipVerseOptionsVisible = false;
    }

    /**
     * Callback firing on scope/controller destruction
     */
    function onDestroy() {
      // Unbind global events to prevent memory leaks
      siteContentElement.unbind('click', onSiteContentClick);

      // Stop timers
      stopHinting();
      stopNarrative();
      otherTimers.forEach(function(timer) {
        $timeout.cancel(timer);
        $interval.cancel(timer); // they're in same array
      });

      if (!$scope.isFinished) {
        Analytics.trackEvent('web', 'verse-leave-uncompleted', analyticsLabel);
      }
    }
  });
