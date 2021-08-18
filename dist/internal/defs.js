"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiPipeValidationException = exports.JOIPIPE_OPTIONS = exports.UPDATE = exports.CREATE = exports.DEFAULT = exports.JoiValidationGroups = void 0;
const joi_class_decorators_1 = require("joi-class-decorators");
Object.defineProperty(exports, "DEFAULT", { enumerable: true, get: function () { return joi_class_decorators_1.DEFAULT; } });
exports.JoiValidationGroups = {
    DEFAULT: joi_class_decorators_1.DEFAULT,
    CREATE: Symbol('CREATE'),
    UPDATE: Symbol('UPDATE'),
};
exports.CREATE = exports.JoiValidationGroups.CREATE;
exports.UPDATE = exports.JoiValidationGroups.UPDATE;
exports.JOIPIPE_OPTIONS = Symbol('JOIPIPE_OPTIONS');
class JoiPipeValidationException extends Error {
}
exports.JoiPipeValidationException = JoiPipeValidationException;
