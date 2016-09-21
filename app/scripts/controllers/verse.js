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
                                     $translate, VerseDataStore, VerseBlock, SoundManager, Analytics) {

    var maxHintsCount = 2;
    var maxCharsToComplete = 3;
    var typingInterval = 100;
    var hintingInterval = 4000;
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    var analyticsLabel = null;
    var $ = angular.element;
    var siteContentElement = null;
    var versePieces = null;
    var narrativeTimer = null;
    var hintingTimer = null;
    var otherTimers = []; // only timeouts should be here
    var narrativeStartTime = null;
    var wasControlsHintShown = false;
    var hintsDisplayedCount = 0;
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
        versePieces = verse.getPieces({});
        siteContentElement = $('#content');
        inputField = $('.view-verse input');

        // Add event listeners
        $scope.$on('$destroy', onDestroy);
        siteContentElement.bind('click', onSiteContentClick);

        // Populate scope
        $scope.verse = verse;
        $scope.author = result.author;
        $scope.versePieces = [];
        $scope.currentBlock = null;
        $scope.isIOS = isIOS;
        $scope.isFinished = false;
        $scope.isLeaving = false;
        $scope.isControlsHintVisible = false;
        $scope.onInputFieldKeyup = onInputFieldKeyup;
        $scope.onAnotherVerseButtonClick = onAnotherVerseButtonClick;
        $scope.onAnotherVerseOfAuthorButtonClick = onAnotherVerseOfAuthorButtonClick;


        // Start narrative
        otherTimers.push($timeout(function(){
          continueNarrative();
          narrativeStartTime = new Date();
        }, 2600)); // sync with animation

        $rootScope.pageTitle = verse.title + ' | ' + $translate.instant('COMMON_APP_NAME');
        $rootScope.$broadcast('HeaderCtrl.doHide');
        $rootScope.$broadcast('FooterCtrl.doHide');

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
      var nextPiece = versePieces.shift();

      // Exit, if no pieces left
      if (!angular.isDefined(nextPiece)) {
        $scope.isFinished = true;
        $scope.finishedInSeconds = Math.floor((Date.now() - narrativeStartTime.getTime()) / 1000);

        // Show header and footer
        otherTimers.push($timeout(function(){
          $rootScope.$broadcast('HeaderCtrl.doShow');
          $rootScope.$broadcast('FooterCtrl.doShow');
        }, 8000)); // sync with animation

        stopNarrative();
        inputField.blur();

        // Track results
        Analytics.trackEvent('web', 'verse-complete', analyticsLabel);
        Analytics.trackEvent('web', 'verse-complete-seconds', analyticsLabel, $scope.finishedInSeconds);
        Analytics.trackEvent('web', 'verse-complete-hints', analyticsLabel, hintsDisplayedCount);
        return;
      }

      // Need to stop narrative, if that's a block
      if (nextPiece instanceof VerseBlock) {
        stopNarrative();
        $scope.currentBlock = nextPiece;

        // Focus to input field
        $timeout(function() {
          inputField.focus(); // not working in Mobile Safari. Maybe somebody know some WORKING method?
        }, 100);
        inputField.val('');

        startHinting();
        scrollToInputField();
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
     * Scrolls to input field
     */
    function scrollToInputField() {
      var newScrollTop = inputField.offset().top - window.innerHeight / (isIOS ? 4 : 2);
      $('html, body').animate({scrollTop: newScrollTop});
    }

    /**
     * Leaves the page and redirects to URL passed
     * @param {String} url
     */
    function leavePageWithNewUrl(url) {
      $scope.isLeaving = true;
      $('html, body').animate({scrollTop: 0}, 1200);

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
      });

      if (!$scope.isFinished) {
        Analytics.trackEvent('web', 'verse-leave-uncompleted', analyticsLabel);
      }
    }
  });
