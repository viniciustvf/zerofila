import { EmpresaDto } from '../../../empresa/dto/empresa.dto';
declare const LoginDto_base: import("@nestjs/common").Type<Pick<EmpresaDto, "email" | "password">>;
export declare class LoginDto extends LoginDto_base {
}
export {};
