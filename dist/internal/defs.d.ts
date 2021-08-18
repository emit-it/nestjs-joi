import { DEFAULT } from 'joi-class-decorators';
export declare const JoiValidationGroups: {
    DEFAULT: import("joi-class-decorators").JoiValidationGroup;
    CREATE: symbol;
    UPDATE: symbol;
};
export { DEFAULT };
export declare const CREATE: symbol;
export declare const UPDATE: symbol;
export interface Constructor<T = any> extends Function {
    new (...args: unknown[]): T;
}
export declare const JOIPIPE_OPTIONS: unique symbol;
export declare class JoiPipeValidationException extends Error {
}
