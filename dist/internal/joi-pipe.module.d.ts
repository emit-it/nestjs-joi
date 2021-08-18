import { DynamicModule } from '@nestjs/common';
import { JoiPipeOptions } from './joi.pipe';
export interface JoiPipeModuleOptions {
    pipeOpts?: JoiPipeOptions;
}
export declare class JoiPipeModule {
    static forRoot(options?: JoiPipeModuleOptions): DynamicModule;
}
