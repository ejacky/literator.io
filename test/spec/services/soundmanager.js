'use strict';

describe('Service: SoundManager', function () {

  // load the service's module
  beforeEach(module('literatorioApp'));

  // instantiate service
  var SoundManager;
  beforeEach(inject(function (_SoundManager_) {
    SoundManager = _SoundManager_;
  }));

  it('should be properly initialized', function () {
    expect(!!SoundManager).toBe(true);
  });

});
