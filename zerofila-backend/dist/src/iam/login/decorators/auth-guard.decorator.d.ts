import { AuthType } from '../enums/auth-type.enum';
export declare const AUTH_TYPE_KEY = "authType";
export declare const AuthGuard: (...authTypes: AuthType[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const IS_PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
