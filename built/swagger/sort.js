const Utilities = require('./utilities');
const sort = module.exports = {};
/**
 * sort routes by path then method
 *
 * @param  {String} sortType
 * @param  {Array} routes
 * @return {Array}
 */
sort.paths = function (sortType, routes) {
    if (sortType === 'path-method') {
        //console.log('path-method')
        routes.sort(Utilities.firstBy('path').thenBy('method'));
    }
    return routes;
};
//# sourceMappingURL=sort.js.map