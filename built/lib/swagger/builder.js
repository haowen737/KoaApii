// Code mainlly from https://github.com/glennjones/hapi-swagger
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Hoek = require('hoek');
const Joi = require('joi');
const JSONDeRef = require('json-schema-ref-parser');
const Filter = require('./filter');
const Group = require('./group');
const Sort = require('./sort');
const Info = require('./info');
const Paths = require('./paths');
const Tags = require('./tags');
const Validate = require('./validate');
const Utilities = require('./utilities');
const builder = (module.exports = {});
const internals = {};
/**
 * default data for swagger root object
 */
builder.default = {
    swagger: '2.0',
    host: 'localhost',
    basePath: '/'
};
/**
 * schema for swagger root object
 */
builder.schema = Joi.object({
    swagger: Joi.string().valid('2.0').required(),
    info: Joi.any(),
    host: Joi.string(),
    basePath: Joi.string().regex(/^\//),
    schemes: Joi.array()
        .items(Joi.string().valid(['http', 'https', 'ws', 'wss']))
        .optional(),
    consumes: Joi.array().items(Joi.string()),
    produces: Joi.array().items(Joi.string()),
    paths: Joi.any(),
    definitions: Joi.any(),
    parameters: Joi.any(),
    responses: Joi.any(),
    securityDefinitions: Joi.any(),
    security: Joi.any(),
    grouping: Joi.string().valid(['path', 'tags']),
    tagsGroupingFilter: Joi.func(),
    tags: Joi.any(),
    cors: Joi.boolean(),
    externalDocs: Joi.object({
        description: Joi.string(),
        url: Joi.string().uri()
    }),
    cache: Joi.object({
        expiresIn: Joi.number(),
        expiresAt: Joi.string(),
        generateTimeout: Joi.number()
    })
});
/**
 * gets the Swagger JSON
 *
 * @param  {Object} settings
 * @param  {Object} request
 * @param  {Function} callback
 */
builder.getSwaggerJSON = (settings, apis, ctx) => __awaiter(this, void 0, void 0, function* () {
    // remove items that cannot be changed by user
    delete settings.swagger;
    // collect root information
    builder.default.host = internals.getHost(ctx);
    // builder.default.schemes = [internals.getSchema(request)];
    settings = Hoek.applyToDefaults(builder.default, settings);
    if (settings.basePath !== '/') {
        settings.basePath = Utilities.removeTrailingSlash(settings.basePath);
    }
    let out = internals.removeNoneSchemaOptions(settings);
    Joi.assert(out, builder.schema);
    out.info = Info.build(settings);
    out.tags = Tags.build(settings);
    let routes = apis;
    // routes = Filter.byTags(['api'], routes);
    Sort.paths(settings.sortPaths, routes);
    // TODO: 因为自定义没有request，此处稍后处理
    // filter routes displayed based on tags passed in query string
    // if (request.query.tags) {
    //     let filterTags = request.query.tags.split(',');
    //     routes = Filter.byTags(filterTags, routes);
    // }
    // append group property - by path
    Group.appendGroupByPath(settings.pathPrefixSize, settings.basePath, routes, settings.pathReplacements);
    let paths = new Paths(settings);
    let pathData = paths.build(routes);
    out.paths = pathData.paths;
    out.definitions = pathData.definitions;
    if (Utilities.hasProperties(pathData['x-alt-definitions'])) {
        out['x-alt-definitions'] = pathData['x-alt-definitions'];
    }
    out = internals.removeNoneSchemaOptions(out);
    if (settings.debug) {
        yield Validate.log(out, settings.log);
    }
    if (settings.deReference === true) {
        return builder.dereference(out);
    }
    else {
        return out;
    }
});
/**
 * dereference a schema
 *
 * @param  {Object} schema
 * @param  {Function} callback
 */
builder.dereference = (schema) => __awaiter(this, void 0, void 0, function* () {
    try {
        const json = yield JSONDeRef.dereference(schema);
        delete json.definitions;
        delete json['x-alt-definitions'];
        return json;
    }
    catch (err) {
        throw new Error('failed to dereference schema');
    }
});
/**
 * finds the current host
 *
 * @param  {Object} request
 * @return {String}
 */
internals.getHost = function (ctx) {
    return ctx.request.host;
};
/**
 * finds the current schema
 *
 * @param  {Object} request
 * @param  {Object} connection
 * @return {String}
 */
internals.getSchema = function (request) {
    const forwardedProtocol = request.headers['x-forwarded-proto'];
    if (forwardedProtocol) {
        return forwardedProtocol;
    }
    // Azure Web Sites adds this header when requests was received via HTTPS.
    if (request.headers['x-arr-ssl']) {
        return 'https';
    }
    const protocol = request.server.info.protocol;
    // When iisnode is used, connection protocol is `socket`. While IIS
    // receives request over HTTP and passes it to node via a named pipe.
    if (protocol === 'socket') {
        return 'http';
    }
    return protocol;
};
/**
 * removes none schema properties from options
 *
 * @param  {Object} options
 * @return {Object}
 */
internals.removeNoneSchemaOptions = function (options) {
    let out = Hoek.clone(options);
    [
        'debug',
        'documentationPath',
        'documentationRouteTags',
        'documentationPage',
        'jsonPath',
        'auth',
        'swaggerUIPath',
        'swaggerUI',
        'pathPrefixSize',
        'payloadType',
        'expanded',
        'lang',
        'sortTags',
        'sortEndpoints',
        'sortPaths',
        'grouping',
        'tagsGroupingFilter',
        'xProperties',
        'reuseDefinitions',
        'uiCompleteScript',
        'deReference',
        'definitionPrefix',
        'validatorUrl',
        'jsonEditor',
        'acceptToProduce',
        'cache',
        'pathReplacements',
        'log',
        'cors'
    ].forEach(element => {
        delete out[element];
    });
    return out;
};
//# sourceMappingURL=builder.js.map