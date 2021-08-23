import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';
import { Constructor } from './defs';
import { JoiPipeOptions } from './joi-pipe.module';
export declare class JoiPipe implements PipeTransform {
    private readonly arg?;
    private readonly schema?;
    private readonly type?;
    private readonly method?;
    private readonly options;
    constructor();
    constructor(options?: JoiPipeOptions);
    constructor(type: Constructor, options?: JoiPipeOptions);
    constructor(schema: Joi.Schema, options?: JoiPipeOptions);
    transform(payload: unknown, metadata: ArgumentMetadata): Promise<unknown>;
    private validate;
    private parseOptions;
    private getSchema;
    private static readonly typeSchemaMap;
    private static getTypeSchema;
}
