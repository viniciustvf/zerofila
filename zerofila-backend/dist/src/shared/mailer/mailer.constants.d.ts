import { ChangePasswordDto } from '@/iam/change-password/dto/change-password.dto';
import { RegisterEmpresaDto } from '@/iam/register/dto/register-empresa.dto';
export declare const registrationEmail: (user: RegisterEmpresaDto) => string;
export declare const forgotPasswordEmail: (password: string) => string;
export declare const changePasswordEmail: (user: ChangePasswordDto) => string;
