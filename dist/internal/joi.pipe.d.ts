import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidationGroup } from 'joi-class-decorators';
import { Constructor } from './defs';
export interface JoiPipeOptions {
    group?: JoiValidationGroup;
    usePipeValidationException?: boolean;
}
export declare class JoiPipe implements PipeTransform {
    private readonly arg?;
    private readonly schema?;
    private readonly type?;
    private readonly method?;
    private readonly pipeOpts;
    constructor();
    constructor(pipeOpts?: JoiPipeOptions);
    constructor(type: Constructor, pipeOpts?: JoiPipeOptions);
    constructor(schema: Joi.Schema, pipeOpts?: JoiPipeOptions);
    transform(payload: unknown, metadata: ArgumentMetadata): unknown;
    private static validate;
    private parseOptions;
    private getSchema;
    private static readonly typeSchemaMap;
    private static getTypeSchema;
}
