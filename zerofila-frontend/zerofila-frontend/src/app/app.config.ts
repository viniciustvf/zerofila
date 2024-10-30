import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AppRoutingModule, routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { BrMaskerModule } from 'br-mask';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


// const maskConfigFunction: () => Partial<IConfig> = () => {
//   return {
//     validation: false,
//   };
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    importProvidersFrom(ToastModule),
    importProvidersFrom(AppRoutingModule),
    provideEnvironmentNgxMask(),
    { provide: MessageService, useClass: MessageService },
    TableModule,
    ButtonModule,
    ConfirmDialogModule
  ],
};
