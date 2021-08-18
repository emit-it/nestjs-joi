"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JoiPipe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiPipe = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const Joi = require("joi");
const joi_class_decorators_1 = require("joi-class-decorators");
const defs_1 = require("./defs");
const DEFAULT_JOI_PIPE_OPTS = {
    group: undefined,
    usePipeValidationException: false,
};
const JOI_PIPE_OPTS_KEYS = Object.keys(DEFAULT_JOI_PIPE_OPTS);
const DEFAULT_JOI_OPTS = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
};
function isHttpRequest(req) {
    return req && 'method' in req;
}
function isGraphQlRequest(req) {
    return req && 'req' in req && typeof req.req === 'object' && 'method' in req.req;
}
let JoiPipe = JoiPipe_1 = class JoiPipe {
    constructor(arg, pipeOpts) {
        this.arg = arg;
        if (arg) {
            if (isHttpRequest(arg)) {
                this.method = arg.method.toUpperCase();
            }
            else if (isGraphQlRequest(arg)) {
            }
            else {
                if (Joi.isSchema(arg)) {
                    this.schema = arg;
                }
                else if (typeof arg === 'function') {
                    this.type = arg;
                }
                else {
                    pipeOpts = arg;
                }
            }
        }
        else {
        }
        this.pipeOpts = this.parseOptions(pipeOpts);
    }
    transform(payload, metadata) {
        const schema = this.getSchema(metadata);
        if (!schema) {
            return payload;
        }
        return JoiPipe_1.validate(payload, schema);
    }
    static validate(payload, schema) {
        const { error, value } = schema.validate(payload, DEFAULT_JOI_OPTS);
        if (error) {
            if (Joi.isError(error)) {
                throw new common_1.UnprocessableEntityException({
                    statusCode: 422,
                    message: 'Validation failed',
                    error: error.details.map(errorItem => {
                        var _a, _b, _c;
                        return {
                            message: errorItem.message,
                            type: errorItem.type,
                            key: (_a = errorItem.context) === null || _a === void 0 ? void 0 : _a.key,
                            label: (_b = errorItem.context) === null || _b === void 0 ? void 0 : _b.label,
                            value: (_c = errorItem.context) === null || _c === void 0 ? void 0 : _c.value,
                        };
                    }),
                });
            }
            else {
                throw error;
            }
        }
        return value;
    }
    parseOptions(pipeOpts) {
        pipeOpts = Object.assign(Object.assign({}, DEFAULT_JOI_PIPE_OPTS), pipeOpts || {});
        const errors = [];
        const unknownKeys = Object.keys(pipeOpts).filter(k => !JOI_PIPE_OPTS_KEYS.includes(k));
        if (unknownKeys.length) {
            errors.push(`Unknown configuration keys: ${unknownKeys.join(', ')}`);
        }
        if (pipeOpts.group &&
            !(typeof pipeOpts.group === 'string' || typeof pipeOpts.group === 'symbol')) {
            errors.push(`'group' must be a string or symbol`);
        }
        if (Object.prototype.hasOwnProperty.call(pipeOpts, 'usePipeValidationException') &&
            !(typeof pipeOpts.usePipeValidationException === 'boolean')) {
            errors.push(`'usePipeValidationException' must be a boolean`);
        }
        if (errors.length) {
            throw new Error(`Invalid JoiPipeOptions:\n${errors.map(x => `- ${x}`).join('\n')}`);
        }
        return pipeOpts;
    }
    getSchema(metadata) {
        if (this.method && metadata.metatype) {
            let group;
            if (this.method === 'PUT' || this.method === 'PATCH') {
                group = defs_1.JoiValidationGroups.UPDATE;
            }
            else if (this.method === 'POST') {
                group = defs_1.JoiValidationGroups.CREATE;
            }
            return JoiPipe_1.getTypeSchema(metadata.metatype, { group });
        }
        if (this.schema) {
            return this.schema;
        }
        if (this.type) {
            return JoiPipe_1.getTypeSchema(this.type, { forced: true, group: this.pipeOpts.group });
        }
        if (metadata.metatype) {
            return JoiPipe_1.getTypeSchema(metadata.metatype, { group: this.pipeOpts.group });
        }
        return undefined;
    }
    static getTypeSchema(type, { forced, group } = {}) {
        if (type === String || type === Object || type === Number || type === Array) {
            return;
        }
        const cacheKey = 'forced' + (forced ? '1' : '0') + (group ? 'group' + String(group) : '');
        if (this.typeSchemaMap.has(type)) {
            if (this.typeSchemaMap.get(type).has(cacheKey)) {
                return this.typeSchemaMap.get(type).get(cacheKey);
            }
        }
        else {
            this.typeSchemaMap.set(type, new Map());
        }
        const typeSchema = joi_class_decorators_1.getTypeSchema(type, { group });
        if ((!typeSchema || !Object.keys(typeSchema.describe().keys).length) && !forced) {
            this.typeSchemaMap.get(type).set(cacheKey, undefined);
            return undefined;
        }
        const finalSchema = typeSchema.required();
        this.typeSchemaMap.get(type).set(cacheKey, finalSchema);
        return finalSchema;
    }
};
JoiPipe.typeSchemaMap = new Map();
JoiPipe = JoiPipe_1 = __decorate([
    common_1.Injectable({ scope: common_1.Scope.REQUEST }),
    __param(0, common_1.Inject(core_1.REQUEST)),
    __param(1, common_1.Optional()), __param(1, common_1.Inject(defs_1.JOIPIPE_OPTIONS)),
    __metadata("design:paramtypes", [Object, Object])
], JoiPipe);
exports.JoiPipe = JoiPipe;
