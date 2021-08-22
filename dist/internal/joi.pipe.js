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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var JoiPipe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiPipe = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const acceptLanguageParser = require("accept-language-parser");
const Joi = require("joi");
const joi_class_decorators_1 = require("joi-class-decorators");
const defs_1 = require("./defs");
const DEFAULT_JOI_PIPE_OPTS = {
    pipeOpts: {
        group: undefined,
    },
    validationOpts: {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: false,
        errors: {
            label: undefined,
        },
    },
    message: 'Validation failed',
    transformErrors: errorItems => {
        var _a, _b, _c, _d, _e, _f, _g;
        const errorObjects = {};
        for (const errorItem of errorItems) {
            if (!((_a = errorItem.context) === null || _a === void 0 ? void 0 : _a.key) || !((_b = errorItem.context) === null || _b === void 0 ? void 0 : _b.label)) {
            }
            const key = ((_c = errorItem.context) === null || _c === void 0 ? void 0 : _c.label) || ((_d = errorItem.context) === null || _d === void 0 ? void 0 : _d.key) || '_no-key';
            if (errorObjects[key] && errorObjects[key].messages) {
                errorObjects[key].messages.push({
                    message: errorItem.message,
                    type: errorItem.type,
                });
                continue;
            }
            errorObjects[key] = {};
            errorObjects[key].messages = [
                {
                    message: errorItem.message,
                    type: errorItem.type,
                },
            ];
            errorObjects[key].key = (_e = errorItem.context) === null || _e === void 0 ? void 0 : _e.key;
            errorObjects[key].label = (_f = errorItem.context) === null || _f === void 0 ? void 0 : _f.label;
            errorObjects[key].value = (_g = errorItem.context) === null || _g === void 0 ? void 0 : _g.value;
        }
        return errorObjects;
    },
};
const JOI_PIPE_OPTS_KEYS = Object.keys(Object.assign(Object.assign({}, DEFAULT_JOI_PIPE_OPTS), { translations: {} }));
const DEFAULT_JOI_VALIDATION_OPTS = DEFAULT_JOI_PIPE_OPTS.validationOpts;
function isHttpRequest(req) {
    return req && 'method' in req;
}
function isGraphQlRequest(req) {
    return req && 'req' in req && typeof req.req === 'object' && 'method' in req.req;
}
let JoiPipe = JoiPipe_1 = class JoiPipe {
    constructor(arg, options) {
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
                    options = arg;
                }
            }
        }
        else {
        }
        this.options = this.parseOptions(options);
    }
    transform(payload, metadata) {
        const req = this.arg;
        const language = acceptLanguageParser.parse(req.headers['accept-language'] || 'en')[0].code;
        const schema = this.getSchema(metadata);
        if (!schema) {
            return payload;
        }
        return this.validate(payload, schema, language);
    }
    validate(payload, schema, language) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = yield schema.validateAsync(payload, Object.assign(Object.assign(Object.assign(Object.assign({}, DEFAULT_JOI_VALIDATION_OPTS), this.options.validationOpts), {
                errors: Object.assign(Object.assign(Object.assign({}, DEFAULT_JOI_VALIDATION_OPTS.errors), { language }), (_a = this.options.validationOpts) === null || _a === void 0 ? void 0 : _a.errors),
            }), { messages: (_b = this.options.translations) === null || _b === void 0 ? void 0 : _b[language] }));
            if (error) {
                if (Joi.isError(error)) {
                    const errObject = {
                        statusCode: 422,
                        message: this.options.message,
                        errors: ((_d = (_c = this.options).transformErrors) === null || _d === void 0 ? void 0 : _d.call(_c, error.details)) ||
                            ((_e = DEFAULT_JOI_PIPE_OPTS.transformErrors) === null || _e === void 0 ? void 0 : _e.call(DEFAULT_JOI_PIPE_OPTS, error.details)),
                    };
                    throw new common_1.UnprocessableEntityException(errObject);
                }
                else {
                    throw error;
                }
            }
            return value;
        });
    }
    parseOptions(options) {
        var _a, _b, _c;
        options = Object.assign(Object.assign({}, DEFAULT_JOI_PIPE_OPTS), options || {});
        const errors = [];
        const unknownKeys = Object.keys(options).filter(k => !JOI_PIPE_OPTS_KEYS.includes(k));
        if (unknownKeys.length) {
            errors.push(`Unknown configuration keys: ${unknownKeys.join(', ')}`);
        }
        if (((_a = options.pipeOpts) === null || _a === void 0 ? void 0 : _a.group) &&
            !(typeof ((_b = options.pipeOpts) === null || _b === void 0 ? void 0 : _b.group) === 'string' || typeof ((_c = options.pipeOpts) === null || _c === void 0 ? void 0 : _c.group) === 'symbol')) {
            errors.push(`'group' must be a string or symbol`);
        }
        if (errors.length) {
            throw new Error(`Invalid JoiPipeOptions:\n${errors.map(x => `- ${x}`).join('\n')}`);
        }
        return options;
    }
    getSchema(metadata) {
        var _a, _b;
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
            return JoiPipe_1.getTypeSchema(this.type, {
                forced: true,
                group: (_a = this.options.pipeOpts) === null || _a === void 0 ? void 0 : _a.group,
            });
        }
        if (metadata.metatype) {
            return JoiPipe_1.getTypeSchema(metadata.metatype, { group: (_b = this.options.pipeOpts) === null || _b === void 0 ? void 0 : _b.group });
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
    __param(1, common_1.Optional()),
    __param(1, common_1.Inject(defs_1.JOIPIPE_OPTIONS)),
    __metadata("design:paramtypes", [Object, Object])
], JoiPipe);
exports.JoiPipe = JoiPipe;
