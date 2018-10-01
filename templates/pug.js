'use strict';

var EOL = require('os').EOL;

module.exports = function(entity, naming) {
    return [
        '+b.SECTION.' + naming.stringify(entity),
        '  .container'
    ].join(EOL);
};
