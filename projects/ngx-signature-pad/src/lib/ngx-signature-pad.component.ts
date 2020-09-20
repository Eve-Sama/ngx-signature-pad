import {
  Component,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef
} from '@angular/core';
import SignaturePad, { IPointGroup } from 'signature_pad';
import { NgxSignatureOptions } from './types/ngx-signature-pad';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'ngx-signature-pad',
  templateUrl: './ngx-signature-pad.component.html',
  styleUrls: ['./ngx-signature-pad.component.scss']
})
export class NgxSignaturePadComponent implements OnInit, OnChanges {
  /** The object of dependency 'siganture_pad' */
  private smallPad: SignaturePad;
  private bigPad: SignaturePad;
  /** The object of canvas */
  private smallCanvas: HTMLCanvasElement;
  private bigCanvas: HTMLCanvasElement;
  private signDataHistory: IPointGroup[] = [];
  // CDK
  private overlayRef: OverlayRef;
  private portal: TemplatePortal;

  /** The state of 'siganture_pad' */
  public _isEmpty = true;
  public isFullScreen = false;

  get activePad(): SignaturePad {
    return this.isFullScreen ? this.bigPad : this.smallPad;
  }

  @Input() options: NgxSignatureOptions = {};

  @Output() public onBegin = new EventEmitter<void>();
  @Output() public onEnd = new EventEmitter<void>();

  @ViewChild('fullscreenTpl') fullscreenTpl: TemplateRef<void>;

  constructor(
    private renderer2: Renderer2,
    private overlay: Overlay,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  private initBigPad(): void {
    this.cdr.detectChanges();
    console.log('initBigPad');
    this.bigCanvas = document.querySelector('#nsp-big');
    const fullScreenOptions = Object.assign(this.options);
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    fullScreenOptions.width = width;
    fullScreenOptions.height = height;
    const { css } = fullScreenOptions;
    this.bigCanvas.width = width;
    this.bigCanvas.height = height;
    for (const key in css) {
      if (Object.prototype.hasOwnProperty.call(css, key)) {
        const value = css[key];
        this.renderer2.setStyle(this.bigCanvas, key, value);
      }
    }
    this.bigPad = new SignaturePad(this.bigCanvas, fullScreenOptions);
    this.bigPad.onBegin = this._onBegin.bind(this);
    this.bigPad.onEnd = this._onEnd.bind(this);
  }

  private initSmallPad(): void {
    this.smallCanvas = document.querySelector('#nsp-small');
    const { width, height, css } = this.options;
    this.smallCanvas.width = width ? width : 300;
    this.smallCanvas.height = height ? height : 150;
    for (const key in css) {
      if (Object.prototype.hasOwnProperty.call(css, key)) {
        const value = css[key];
        this.renderer2.setStyle(this.smallCanvas, key, value);
      }
    }
    this.smallPad = new SignaturePad(this.smallCanvas, this.options);
    this.smallPad.onBegin = this._onBegin.bind(this);
    this.smallPad.onEnd = this._onEnd.bind(this);
  }

  private _onBegin(): void {
    this.setDirty(); // When user draws, set state as dirty
    this.onBegin.emit();
  }

  private _onEnd(): void {
    this.signDataHistory = this.toData();
    this.onEnd.emit();
  }

  ngOnInit(): void {
    // #region delete
    // this.options.modeOption = this.options.modeOption || 'miniScreen';
    // this.isFullScreen = this.options.mode === 'fullScreen';
    // console.log(this.options.modeOption, `this.options.modeOption`);
    // switch (this.options.modeOption) {
    //   case 'miniScreen':
    //     break;
    //   case 'fullScreen':
    //     this.initBigPad();
    //     break;
    //   case 'both':
    //     this.initSmallPad();
    //     this.initBigPad();
    //     break;
    // }
    // #endregion
    this.initSmallPad();
  }

  // For the future
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.options, `changes.options`);
  }

  public fullscreen(): void {
    this.isFullScreen = true;
    this.portal = new TemplatePortal(this.fullscreenTpl, this.viewContainerRef);
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      height: '100%',
      width: '100%'
    });
    this.overlayRef.attach(this.portal);
    this.initBigPad();
    // #region Copy miniscreen's content to fullscreen
    const fullScreenWidth = document.documentElement.clientWidth;
    const fullScreenHeight = document.documentElement.clientHeight;
    const { width: miniScreenWidth, height: miniScreenHeight } = this.options;
    const ctx = this.bigCanvas.getContext('2d');
    ctx.save();
    ctx.translate(miniScreenWidth, 0);
    ctx.rotate((90 * Math.PI) / 180);
    const scale = fullScreenHeight / miniScreenWidth;
    ctx.drawImage(this.smallCanvas, 0, 0, miniScreenWidth, miniScreenHeight, 0, 0, miniScreenWidth * scale, miniScreenHeight * scale);
    ctx.restore();
    // #endregion
  }

  public miniscreen(): void {
    this.overlayRef.dispose();
    this.isFullScreen = false;
  }

  /** Returns signature image as an array of point groups */
  public toData(): IPointGroup[] {
    return this.activePad.toData();
  }

  /** Draws signature image from an array of point groups */
  public fromData(pointGroups: IPointGroup[]): void {
    this.activePad.fromData(pointGroups);
  }

  public toDataURL(type?: 'image/jpeg' | 'image/svg+xml'): string {
    switch (type) {
      case 'image/jpeg':
        return this.activePad.toDataURL('image/jpeg');
      case 'image/svg+xml':
        return this.activePad.toDataURL('image/svg+xml');
      default:
        return this.activePad.toDataURL();
    }
  }

  public revert(): void {
    this.signDataHistory.pop();
    this.fromData(this.signDataHistory);
    if (this.signDataHistory.length === 0) {
      this.setEmpty();
    }
  }

  // Clears the canvas
  public clear(): void {
    this.setEmpty();
    this.signDataHistory = [];
    this.activePad.clear();
  }

  /** Return true if canvas is empty, otherwise return false */
  public isEmpty(): boolean {
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
    const ctx = this.smallCanvas.getContext('2d');
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    this.setDirty();
  }
}
