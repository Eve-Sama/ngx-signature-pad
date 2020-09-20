import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSignaturePadComponent } from './ngx-signature-pad.component';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [NgxSignaturePadComponent],
  exports: [NgxSignaturePadComponent]
})
export class NgxSignaturePadModule {}
