import { Component, OnInit, ViewChild } from '@angular/core';
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

  public revert(): void {
    this.signature.revert();
  }

  public clear(): void {
    this.signature.clear();
  }

  public fullScreen(): void {
    this.signature.fullscreen();
  }

  public miniScreen(): void {
    this.signature.miniscreen();
  }

  ngOnInit(): void {
    this.calcMiniscreenSize();
  }

  /** 计算小屏签名的大小 */
  private calcMiniscreenSize(): void {
    const width = document.querySelector('body').clientWidth;
    const height = (width * 2) / 3;
    this.options.width = width;
    this.options.height = height;
  }
}
