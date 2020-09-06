import { Component, ViewChild } from '@angular/core';
import { NgxSignaturePadComponent, NgxSignatureOptions } from 'projects/ngx-signature-pad/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('signature') signature: NgxSignaturePadComponent;

  public options: NgxSignatureOptions = {
    backgroundColor: '#F4F5F5',
    width: 570,
    height: 300,
    css: {
      'border-radius': '16px'
    }
  };

  clear(): void {
    this.signature.clear();
  }

  drawImage(): void {
    const img = new Image();
    img.src = 'https://file.qingflow.com/uploads/file/e28cf1bd-f701-4fbb-8aff-942a80013df9.png';
    img.onload = () => {
      this.signature.drawImage(img, 230, 35, 100, 50, 230, 110, 100, 50);
    };
  }

  get isEmpty(): boolean {
    if (this.signature) {
      return this.signature.isEmpty();
    }
    return true;
  }

  save(type?: 'image/jpeg' | 'image/svg+xml'): void {
    let base64: string;
    switch (type) {
      case 'image/jpeg':
        base64 = this.signature.toDataURL('image/jpeg');
        break;
      case 'image/svg+xml':
        base64 = this.signature.toDataURL('image/svg+xml');
        break;
      default:
        base64 = this.signature.toDataURL();
    }
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    a.download = 'demo'; // set file name
    a.href = base64; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  }

  public setDirty(): void {
    this.signature.setDirty();
  }

  public setEmpty(): void {
    this.signature.setEmpty();
  }
}
