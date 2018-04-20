jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

// defineTest(__dirname, 'pure-component-to-class', null, 'regular-functions');
defineTest(__dirname, 'pure-component-to-class', null, 'arrow-functions');
