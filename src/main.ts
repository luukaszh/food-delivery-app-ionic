import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

defineComponents(IgcRatingComponent);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
