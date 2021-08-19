import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import * as Joi from 'joi';
import { JoiValidationGroup } from 'joi-class-decorators';

import { JOIPIPE_OPTIONS } from './defs';
import { JoiPipe } from './joi.pipe';

export interface JoiPipeOptions {
  pipeOpts?: {
    group?: JoiValidationGroup;
  };
  /**
   * Override the default validation options from 'nestjs-joi'
   */
  validationOpts?: Joi.ValidationOptions;
  /**
   * Pass a custom validation message in the exception response
   */
  message?: string;
  /**
   * Pass a function where you can customize the ValidationError object from Joi in the exception response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformErrors?: (errors: Joi.ValidationError['details']) => any;
  /**
   * A callback function where Joi language messages can be passed based on the client's language from the Accept-Language request header
   */
  translations?: { [languageCode: string]: Joi.LanguageMessages };
}

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: JoiPipe,
    },
  ],
  exports: [],
})
export class JoiPipeModule {
  static forRoot(options: JoiPipeOptions = {}): DynamicModule {
    const providers: Provider[] = [
      {
        provide: APP_PIPE,
        useClass: JoiPipe,
      },
    ];

    providers.push({
      provide: JOIPIPE_OPTIONS,
      useValue: options,
    });

    return {
      module: JoiPipeModule,
      global: true,
      providers,
    };
  }
}
