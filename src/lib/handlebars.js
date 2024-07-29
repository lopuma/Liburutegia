// Reemplaza esta importación de ECMAScript
// import { minify } from 'html-minifier';

// con esta declaración de require
const { minify } = require('html-minifier');

// Reemplaza esta exportación de ECMAScript
// export function compress(content) {
//     return minify(content.fn(this), {
//         removeComments: true,
//         collapseWhitespace: true,
//         minifyJS: true
//     });
// }

// con esta declaración de require
module.exports.compress = function (content) {
    return minify(content.fn(this), {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true
    });
};