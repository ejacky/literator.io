'use strict';

/**
 * @ngdoc function
 * @name literatorioApp.controller:VerseCtrl
 * @description
 * # VerseCtrl
 * Controller of the literatorioApp
 */
angular.module('literatorioApp')
  .controller('VerseCtrl', function ($q, $scope, $location, $routeParams, $timeout, $interval, VerseDataStore, VerseBlock) {

    var maxHintsCount = 2;
    var maxCharsToComplete = 3;
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    var $ = angular.element;
    var siteContentElement = null;
    var versePieces = null;
    var narrativeTimer = null;
    var hintingTimer = null;
    var narrativeStartTime = null;
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
        $scope.isFinished = false;
        $scope.onInputFieldKeyup = onInputFieldKeyup;
        $scope.onAnotherVerseButtonClick = onAnotherVerseButtonClick;
        $scope.onAnotherVerseOfAuthorButtonClick = onAnotherVerseOfAuthorButtonClick;


        // Start narrative
        $timeout(function(){
          continueNarrative();
          narrativeStartTime = new Date();
        }, 2600); // sync with animation
      }).catch(function(e) {
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

      narrativeTimer = $interval(displayNextVersePiece, 100);
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
      hintingTimer = $interval(displayNextHint, 5000);
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

        stopNarrative();
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
        $scope.versePieces.push(nextHintChar);
      }
    }

    /**
     * Finishes current block and continues narrative
     */
    function resolveCurrentBlock() {
      var nextPiece = $scope.currentBlock.toString().substr(currentHint.length);
      $scope.currentBlock = null;
      $scope.versePieces.push(nextPiece);

      stopHinting();
      continueNarrative();
      inputField.val('');
    }

    /**
     * Scrolls to input field
     */
    function scrollToInputField() {
      var newScrollTop = inputField.offset().top - window.innerHeight / (isIOS ? 4 : 2);
      $('html, body').animate({scrollTop: newScrollTop});
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
    }

    /**
     * Callback firing when user clicks on site content area
     * @param {Event} event
     */
    function onSiteContentClick(event) {
      // Prevent default unnecessary behavior
      event.stopPropagation();
      event.preventDefault();

      // Focus on input field
      inputField.focus(); // mostly for Mobile Safari
    }

    /**
     * Callback firing on "Another verse" click
     */
    function onAnotherVerseButtonClick() {
      VerseDataStore.getRandomVerse().then(function(newVerse) {
        // Check, if new verse is the same one as current and re-pick
        if ($scope.verse.isMatch(newVerse)) {
          return onAnotherVerseButtonClick();
        }

        // Redirect to new verse
        $location.url(newVerse.url);
      });
    }

    /**
     * Callback firing on "Another author's verse" click
     */
    function onAnotherVerseOfAuthorButtonClick() {
      VerseDataStore.getRandomVerseForAuthor($routeParams.authorName).then(function(newVerse) {
        // Check, if new verse is the same one as current and re-pick
        if ($scope.verse.isMatch(newVerse)) {
          return onAnotherVerseButtonClick();
        }

        // Redirect to new verse
        $location.url(newVerse.url);
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
    }
  });
