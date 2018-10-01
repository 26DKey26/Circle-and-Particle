'use strict';

var EOL = require('os').EOL;

module.exports = function(entity, naming) {
    return [
        '.' + naming.stringify(entity) + '{',
        '	',
        '}',
        '',
        '@media only screen and (max-width: 1200px){',
        '	.' + naming.stringify(entity) + '{',
        '		',
        '	}',
        '}',
        '',
        '@media only screen and (max-width: 992px){',
        '	.' + naming.stringify(entity) + '{',
        '		',
        '	}',
        '}',
        '',
        '@media only screen and (max-width: 767px){',
        '	.' + naming.stringify(entity) + '{',
        '		',
        '	}',
        '}'
    ].join(EOL);
};
