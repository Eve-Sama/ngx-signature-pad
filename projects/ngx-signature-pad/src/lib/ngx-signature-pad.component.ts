import { Component, ElementRef, OnDestroy, Renderer2, Input, Output, EventEmitter, OnInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { NgxSignatureOptions } from './types/ngx-signature-pad';

export interface Point {
  x: number;
  y: number;
  time: number;
}

export type PointGroup = Array<Point>;

@Component({
  selector: 'ngx-signature-pad',
  template: '<canvas></canvas>'
})
export class NgxSignaturePadComponent implements OnInit {
  /** The object of dependency 'siganture_pad' */
  private signaturePad: SignaturePad;
  /** The object of canvas */
  private canvas: HTMLCanvasElement;
  /** The state of 'siganture_pad' */
  public _isEmpty = true;

  @Input() options: NgxSignatureOptions = {};

  @Output() public beginSign = new EventEmitter<void>();
  @Output() public endSign = new EventEmitter<void>();

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {}

  public ngOnInit(): void {
    this.canvas = this.elementRef.nativeElement.querySelector('canvas');

    const { width, height, css } = this.options;
    this.canvas.width = width ? width : 300;
    this.canvas.height = height ? height : 150;

    for (const key in css) {
      if (Object.prototype.hasOwnProperty.call(css, key)) {
        const value = css[key];
        console.log(key, `key`);
        console.log(value, `value`);
        this.renderer2.setStyle(this.canvas, key, value);
      }
    }

    this.signaturePad = new SignaturePad(this.canvas, this.options);
    this.signaturePad.onBegin = this.onBegin.bind(this);
    this.signaturePad.onEnd = this.onEnd.bind(this);
  }

  public onBegin(): void {
    this.setDirty();
    this.beginSign.emit();
  }

  public onEnd(): void {
    this.endSign.emit();
  }

  public toDataURL(type?: 'image/jpeg' | 'image/svg+xml'): string {
    switch (type) {
      case 'image/jpeg':
        return this.signaturePad.toDataURL('image/jpeg');
      case 'image/svg+xml':
        return this.signaturePad.toDataURL('image/svg+xml');
      default:
        return this.signaturePad.toDataURL();
    }
  }

  // Clears the canvas
  public clear(): void {
    this.setEmpty();
    this.signaturePad.clear();
  }

  /** Return true if canvas is empty, otherwise return false */
  get isEmpty(): boolean {
    return this._isEmpty;
  }

  /** Set canvas's state as dirty */
  public setDirty(): void {
    this._isEmpty = false;
  }

  /** Set canvas's state as empty */
  public setEmpty(): void {
    this._isEmpty = true;
  }

  /** Get instance of canvas */
  public getCanvasInstance(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * @param image 规定要使用的图像、画布或视频。
   * @param sx 可选。开始剪切的 x 坐标位置。
   * @param sy 可选。开始剪切的 y 坐标位置。
   * @param sw 可选。被剪切图像的宽度。
   * @param sh 可选。被剪切图像的高度。
   * @param dx 在画布上放置图像的 x 坐标位置。
   * @param dy 在画布上放置图像的 y 坐标位置。
   * @param dw 可选。要使用的图像的宽度。（伸展或缩小图像）
   * @param dh 可选。要使用的图像的高度。（伸展或缩小图像）
   */
  public drawImage(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void {
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    this.setDirty();
  }
}
