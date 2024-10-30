declare const _default: (() => {
    secret: string;
    audience: string;
    issuer: string;
    accessTokenTtl: number;
    refreshTokenTtl: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    audience: string;
    issuer: string;
    accessTokenTtl: number;
    refreshTokenTtl: number;
}>;
export default _default;
