import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';  // Apenas importa as rotas diretamente, não a constante AppRoutingModule
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { BrMaskerModule } from 'br-mask';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),  // Passando apenas as rotas aqui
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(),
    importProvidersFrom(ToastModule),
    importProvidersFrom(BrMaskerModule),
    importProvidersFrom(ConfirmDialogModule),  // Adicionando o BrMaskerModule aqui se for necessário para máscaras
    provideEnvironmentNgxMask(),
    { provide: MessageService, useClass: MessageService },
    TableModule,
    ButtonModule,
    ],
};
