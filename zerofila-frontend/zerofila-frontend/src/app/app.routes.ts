import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home/home.component';
import { ClientQueueComponent } from './queue/client-queue/client-queue.component';
import { CompanyFormComponent } from './company/company-form/company-form.component';
import { QueueFormComponent } from './queue/queue-form/queue-form.component';

export const routes: Routes = [
    { path: 'client-queue', component: ClientQueueComponent },
    { path: 'company-form', component: CompanyFormComponent },
    { path: 'queue-form', component: QueueFormComponent },
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}
