import { LoggerService as LoggerBase } from '@nestjs/common';
export declare class LoggerService implements LoggerBase {
    private logger;
    constructor();
    private configureLogger;
    private formatMessage;
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
}
