import { DynamicModule } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidationGroup } from 'joi-class-decorators';
export interface JoiPipeOptions {
    pipeOpts?: {
        group?: JoiValidationGroup;
    };
    validationOpts?: Joi.ValidationOptions;
    message?: string;
    transformErrors?: (errors: Joi.ValidationError['details']) => any;
    translations?: {
        [languageCode: string]: Joi.LanguageMessages;
    };
}
export declare class JoiPipeModule {
    static forRoot(options?: JoiPipeOptions): DynamicModule;
}
