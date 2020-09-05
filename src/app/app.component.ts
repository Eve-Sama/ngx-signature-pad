import { Component, ViewChild } from '@angular/core';
import { NgxSignaturePadComponent, NgxSignatureOptions } from 'projects/ngx-signature-pad/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('signature1') signature1: NgxSignaturePadComponent;

  signature1Options: NgxSignatureOptions = {
    backgroundColor: '#F4F5F5',
    width: 570,
    height: 300,
    css: {
      'border-radius': '16px'
    }
  };

  clear(): void {
    this.signature1.clear();
  }

  drawImage(): void {
    const img = new Image();
    img.src = 'https://file.qingflow.com/uploads/file/e28cf1bd-f701-4fbb-8aff-942a80013df9.png';
    img.onload = () => {
      this.signature1.drawImage(img, 230, 35, 100, 50, 230, 110, 100, 50);
    };
  }

  get isEmpty(): boolean {
    if (this.signature1) {
      return this.signature1.isEmpty;
    }
    return true;
  }

  save(type?: 'image/jpeg' | 'image/svg+xml'): void {
    let base64: string;
    switch (type) {
      case 'image/jpeg':
        base64 = this.signature1.toDataURL('image/jpeg');
        break;
      case 'image/svg+xml':
        base64 = this.signature1.toDataURL('image/svg+xml');
        break;
      default:
        base64 = this.signature1.toDataURL();
    }
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    a.download = 'demo'; // set file name
    a.href = base64; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  }

  public setDirty(): void {
    this.signature1.setDirty();
  }

  public setEmpty(): void {
    this.signature1.setEmpty();
  }
}
