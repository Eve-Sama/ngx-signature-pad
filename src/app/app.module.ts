import { BrowserModule } from '@angular/platform-browser';
import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
/**
 * You should import as below
 * import { NgxSignaturePadModule } from '@eve-sama/ngx-signature-pad';
 */
import { NgxSignaturePadModule } from 'projects/ngx-signature-pad/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PlatformModule, NgxSignaturePadModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
