import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { HttpClientModule } from '@angular/common/http';

// Configuración de servidor
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(), 
    // Incluye HttpClientModule
    HttpClientModule
  ]
};

// Combina la configuración de la aplicación con la configuración del servidor
export const config = mergeApplicationConfig(appConfig, serverConfig);
