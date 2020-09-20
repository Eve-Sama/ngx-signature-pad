import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { NgxSignaturePadComponent } from './ngx-signature-pad.component';

@NgModule({
  imports: [OverlayModule],
  declarations: [NgxSignaturePadComponent],
  exports: [NgxSignaturePadComponent]
})
export class NgxSignaturePadModule {}
