import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './company/login/login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home/home.component';
import { ClientQueueComponent } from './client/client-queue/client-queue.component';
import { CompanyQueueFormComponent } from './company/company-queue-form/company-queue-form.component';
import { CompanyQueueComponent } from './company/company-queue/company-queue.component';
import { CompanyQueueListComponent } from './company/company-queue-list/company-queue-list.component';
import { ClientQueueFormComponent } from './client/client-queue-form/client-queue-form.component';

export const routes: Routes = [
    { path: 'company-queue', component: CompanyQueueComponent },
    { path: 'company-queue-list', component: CompanyQueueListComponent },
    { path: 'company-queue-form', component: CompanyQueueFormComponent },
    
    { path: 'client-queue-form', component: ClientQueueFormComponent },
    { path: 'client-queue', component: ClientQueueComponent },
    
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}
