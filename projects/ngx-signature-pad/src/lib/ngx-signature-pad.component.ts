import { AfterContentInit, Component, ElementRef, OnDestroy, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import sp from 'signature_pad';

export interface Point {
  x: number;
  y: number;
  time: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  borderRadius?: number;
}

export type PointGroup = Array<Point>;

@Component({
  selector: 'ngx-signature-pad',
  template: '<canvas></canvas>'
})
export class NgxSignaturePadComponent implements AfterContentInit, OnDestroy {
  private signaturePad: any;
  private canvas: HTMLCanvasElement;

  @Input() public options: CanvasConfig;
  @Output() public beginSign = new EventEmitter<void>();
  @Output() public endSign = new EventEmitter<void>();

  // notify subscribers on signature begin
  public onBegin(): void {
    this.beginSign.emit();
  }

  // notify subscribers on signature end
  public onEnd(): void {
    this.endSign.emit();
  }

  /** 将canvas的内容转化为jpg */
  public toDataJPG(): string {
    return this.signaturePad.toDataURL('image/jpeg'); // save image as data URL
  }

  // Clears the canvas
  public clear(): void {
    this.signaturePad.clear();
  }

  // Returns true if canvas is empty, otherwise returns false
  public isEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }

  /** 将canvas设置为被修改的状态 */
  public setDirty(): void {
    this.signaturePad._isEmpty = false;
  }

  /** 将canvas设置为未修改的状态 */
  public setEmpty(): void {
    this.signaturePad._isEmpty = true;
  }

  public queryPad(): any {
    return this.signaturePad;
  }

  /** 获得canvas实例 */
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * 将其他canvas的内容粘贴到本canvas
   * @param originCanvas 需要粘贴的canvas
   * @param positive 是否是正向旋转(90deg)
   */
  public pasteCanvas(originCanvas: HTMLCanvasElement, positive: boolean): void {
    const ctx = this.canvas.getContext('2d');
    ctx.save();
    if (positive) {
      ctx.translate(this.canvas.width, 0);
      ctx.rotate((90 * Math.PI) / 180);
    } else {
      ctx.translate(0, this.canvas.height);
      ctx.rotate((-90 * Math.PI) / 180);
    }
    ctx.drawImage(originCanvas, 0, 0, this.canvas.height, this.canvas.width);
    ctx.restore();
  }

  /**
   * 设置canvas的样式
   * @param config canvas的配置, 具体可以参考接口CanvasConfig
   */
  public setCanvasStyle(config: CanvasConfig): void {
    // 很奇怪, 宽高通过renderer无法设置, 但是背景色又只能通过renderer设置...
    this.signaturePad._canvas.width = config.width;
    this.signaturePad._canvas.height = config.height;
    this.renderer2.setStyle(this.signaturePad._canvas, 'background', config.backgroundColor);
    this.renderer2.setStyle(this.signaturePad._canvas, 'display', 'block');
    this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    if (config.borderRadius) {
      this.renderer2.setStyle(this.canvas, 'border-radius', `${config.borderRadius}px`);
    }
  }

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
    this.options = this.options;
  }

  public ngAfterContentInit(): void {
    this.canvas = this.elementRef.nativeElement.querySelector('canvas');
    if (this.options.height) {
      this.canvas.height = this.options.height;
    }
    if (this.options.width) {
      this.canvas.width = this.options.width;
    }
    if (this.options.borderRadius) {
      this.renderer2.setStyle(this.canvas, 'border-radius', `${this.options.borderRadius}px`);
    }
    this.signaturePad = new sp(this.canvas, this.options);
    this.signaturePad.onBegin = this.onBegin.bind(this);
    this.signaturePad.onEnd = this.onEnd.bind(this);
  }

  public ngOnDestroy(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}
