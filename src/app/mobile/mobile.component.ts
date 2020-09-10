import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxSignaturePadComponent, NgxSignatureOptions } from 'projects/ngx-signature-pad/src/public-api';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  @ViewChild('signature') signature: NgxSignaturePadComponent;

  public options: NgxSignatureOptions = {
    backgroundColor: '#F4F5F5',
    width: 0,
    height: 0,
    css: {
      'border-radius': '4px'
    }
  };

  test(): void {
    console.log(this.signature.isEmpty());
  }

  public revert(): void {
    this.signature.revert();
  }

  public clear(): void {
    this.signature.clear();
  }

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.calcMiniscreenSize();
    // 移动端需要提供 撤销、水印、全屏、清除等功能
  }

  /** 计算小屏签名的大小 */
  private calcMiniscreenSize(): void {
    const width = document.querySelector('body').clientWidth;
    const height = (width * 2) / 3;
    this.options.width = width;
    this.options.height = height;
    console.log(width, `width`);
    console.log(height, `height`);
    // this.miniscreentSignature.setCanvasStyle(this.options);
  }
}
