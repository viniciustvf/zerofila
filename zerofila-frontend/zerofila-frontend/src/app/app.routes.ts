import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './company/login/login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home/home.component';
import { ClientQueueComponent } from './client/client-queue/client-queue.component';
import { CompanyQueueFormComponent } from './company/company-queue-form/company-queue-form.component';
import { CompanyQueueComponent } from './company/company-queue/company-queue.component';
import { CompanyQueueListComponent } from './company/company-queue-list/company-queue-list.component';
import { ClientQueueFormComponent } from './client/client-queue-form/client-queue-form.component';
import { CompanyQueueAddClientComponent } from './company/company-queue-add-client/company-queue-add-client.component';
import { CompanyQueueQrcodeComponent } from './company/company-queue-qrcode/company-queue-qrcode.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './company/login/guards/auth.guard';
import { CompanyPerfilFormComponent } from './company/company-perfil-form/company-perfil-form.component';

export const routes: Routes = [
    { path: 'company-queue', component: CompanyQueueComponent, canActivate: [AuthGuard] },
    { path: 'company-queue-add-client', component: CompanyQueueAddClientComponent, canActivate: [AuthGuard] },
    { path: 'company-queue-list', component: CompanyQueueListComponent, canActivate: [AuthGuard] },
    { path: 'company-queue-form', component: CompanyQueueFormComponent, canActivate: [AuthGuard] },
    { path: 'company-queue-qrcode', component: CompanyQueueQrcodeComponent, canActivate: [AuthGuard] },
    { path: 'company-perfil-form', component: CompanyPerfilFormComponent, canActivate: [AuthGuard] },

    { path: 'error', component: ErrorComponent },

    { path: 'client-queue-form', component: ClientQueueFormComponent },
    { path: 'client-queue', component: ClientQueueComponent },

    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}