"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const ValidType = ["params", "query", "payload"];
class Validator {
    valid(validate, ctx) {
        for (let i = 0; i < ValidType.length; i++) {
            const type = internals.getCurrentValidType(i);
            const schema = internals.getCurrentValidSchema(validate, type);
            const data = internals.getCurrentValidData(ctx, type);
            if (schema) {
                const { error } = Joi.validate(data, schema);
                if (error) {
                    ctx.throw(400, "ValidationError", error);
                }
            }
        }
    }
}
const internals = {};
/**
 * validate specific route;
 * each route has validate spec;
 * validate spec in route called schema;
 * we use joi validate request with schema;
 */
internals.getCurrentValidType = (i) => {
    return ValidType[i];
};
internals.getCurrentValidSchema = (validate, type) => {
    const schema = validate[type];
    if (schema && schema.schemaType !== "object") {
        return Joi.object().keys(schema);
    }
    return schema;
};
internals.getCurrentValidData = (ctx, type) => {
    if (type === "payload") {
        return ctx.request.body;
    }
    return ctx[type];
};
exports.default = new Validator();
//# sourceMappingURL=validator.js.map