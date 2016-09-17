# [Literator.io](http://literator.io)

Web App: [literator.io](http://literator.io) (mirror: http://bobrosoft.github.io/literator.io/)

Poems/verses repository: https://github.com/bobrosoft/literator.io-verses (see README there)

## Overview

I wanted to create something interesting using modern Web technologies and Angular.js.
Idea came accidentally when I thought: "Wondering how many poems from the school course
do I still remember?".

Second goal was to polish skills, write some *Perfect Code* every good developer seek for in their work, 
and I hope I succeed with it. Also code is fully covered with set of Unit and End-to-end tests.

## Prerequisites

Project has dependencies that require Node 0.12.0.
Also you need to install sass-globbing for proper SASS-files import (on Mac: `gem install sass-globbing` 
then add `require 'sass-globbing'` into /Library/Ruby/Gems/2.0.0/gems/compass-core-1.0.3/lib/compass-core.rb or similar file)

## Installation

Go to project folder and run next:

 - `nvm use` to use correct node version (see .nvmrc file)
 - `npm install`
 - `bower install`
 - `grunt serve` to run dev server

## Testing

 - Install Selenium and Chrome Web Driver with: `./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update`
 - `grunt test` to run unit tests
 - `grunt e2e` to run E2E tests
