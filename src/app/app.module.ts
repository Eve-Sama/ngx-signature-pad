import { BrowserModule } from '@angular/platform-browser';
import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
/**
 * You should import as below
 * import { NgxSignaturePadModule } from '@eve-sama/ngx-signature-pad';
 */
import { NgxSignaturePadModule } from 'projects/ngx-signature-pad/src/public-api';
import { DocumentComponent } from './document/document.component';
import { MobileComponent } from './mobile/mobile.component';

@NgModule({
  declarations: [AppComponent, DocumentComponent, MobileComponent],
  imports: [BrowserModule, PlatformModule, AppRoutingModule, NgxSignaturePadModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
