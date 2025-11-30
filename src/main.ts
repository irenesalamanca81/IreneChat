import { bootstrapApplication } from '@angular/platform-browser';
import { ChatComponent } from './app/components/chat/chat';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(ChatComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
