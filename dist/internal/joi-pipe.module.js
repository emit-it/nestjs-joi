"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JoiPipeModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiPipeModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const defs_1 = require("./defs");
const joi_pipe_1 = require("./joi.pipe");
let JoiPipeModule = JoiPipeModule_1 = class JoiPipeModule {
    static forRoot(options = {}) {
        const providers = [
            {
                provide: core_1.APP_PIPE,
                useClass: joi_pipe_1.JoiPipe,
            },
        ];
        if (options.pipeOpts) {
            providers.push({
                provide: defs_1.JOIPIPE_OPTIONS,
                useValue: options.pipeOpts,
            });
        }
        return {
            module: JoiPipeModule_1,
            global: true,
            providers,
        };
    }
};
JoiPipeModule = JoiPipeModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useClass: joi_pipe_1.JoiPipe,
            },
        ],
        exports: [],
    })
], JoiPipeModule);
exports.JoiPipeModule = JoiPipeModule;
