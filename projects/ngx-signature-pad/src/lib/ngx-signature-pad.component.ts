import {
  Component,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ElementRef
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
export class NgxSignaturePadComponent implements AfterViewInit, OnChanges {
  // #region The object of dependency 'siganture_pad'
  private smallPad: SignaturePad;
  private bigPad: SignaturePad;
  // #endregion
  // #region The object of canvas
  private smallCanvas: HTMLCanvasElement;
  private bigCanvas: HTMLCanvasElement;
  // #endregion
  // #region CDK
  private overlayRef: OverlayRef;
  private portal: TemplatePortal;
  // #endregion
  private signDataHistory: IPointGroup[] = [];
  private fullScreenWidth: number;
  private fullScreenHeight: number;
  private _isEmpty = true;
  private isFullScreen = false;

  sectionHeight: number;

  private get activePad(): SignaturePad {
    return this.isFullScreen ? this.bigPad : this.smallPad;
  }

  @Input() options: NgxSignatureOptions = {};

  @Output() beginSign = new EventEmitter<void>();
  @Output() endSign = new EventEmitter<void>();

  @ViewChild('fullScreenTpl') fullScreenTpl: TemplateRef<void>;

  @ViewChild('nspSmall', { static: false }) nspSmall: ElementRef;
  @ViewChild('nspBig', { static: false }) nspBig: ElementRef;

  fullScreen(): void {
    this.portal = new TemplatePortal(this.fullScreenTpl, this.viewContainerRef);
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      height: '100%',
      width: '100%'
    });
    this.overlayRef.attach(this.portal);

    setTimeout(() => {
      this.initBigPad();
      // #region Copy miniScreen's content to fullScreen
      const { width: miniScreenWidth, height: miniScreenHeight } = this.options;
      const ctx = this.bigCanvas.getContext('2d');
      ctx.save();
      ctx.translate(this.fullScreenWidth, 0);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(this.smallCanvas, 0, 0, miniScreenWidth, miniScreenHeight, 0, 0, this.fullScreenHeight, this.fullScreenWidth);
      ctx.restore();
      // #endregion
    }, 0);
    this.isFullScreen = true;
  }

  miniScreen(): void {
    this.smallPad.clear();
    // #region Copy fullScreen's content to miniScreen
    const { width: miniScreenWidth, height: miniScreenHeight } = this.options;
    const widthScale = miniScreenWidth / this.fullScreenHeight;
    const heightScale = miniScreenHeight / this.fullScreenWidth;
    const ctx = this.smallCanvas.getContext('2d');
    ctx.save();
    ctx.translate(0, miniScreenHeight);
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.drawImage(
      this.bigCanvas,
      0,
      0,
      this.fullScreenWidth,
      this.fullScreenHeight,
      0,
      0,
      this.fullScreenWidth * widthScale,
      this.fullScreenHeight * heightScale
    );
    ctx.restore();
    // #endregion
    this.overlayRef.dispose();
    this.bigCanvas = null;
    this.bigPad = null;
    this.isFullScreen = false;
  }

  /** Returns signature image as an array of point groups */
  toData(): IPointGroup[] {
    return this.activePad.toData();
  }

  /** Draws signature image from an array of point groups */
  fromData(pointGroups: IPointGroup[]): void {
    this.activePad.fromData(pointGroups);
  }

  toDataURL(type?: 'image/jpeg' | 'image/svg+xml'): string {
    switch (type) {
      case 'image/jpeg':
        return this.activePad.toDataURL('image/jpeg');
      case 'image/svg+xml':
        return this.activePad.toDataURL('image/svg+xml');
      default:
        return this.activePad.toDataURL();
    }
  }

  fromDataURL(
    dataUrl: string,
    options?: {
      ratio?: number;
      width?: number;
      height?: number;
    },
    callback?: (error?: ErrorEvent) => void
  ): void {
    this.activePad.fromDataURL(dataUrl, options, callback);
  }

  revert(): void {
    this.signDataHistory.pop();
    this.fromData(this.signDataHistory);
    if (this.signDataHistory.length === 0) {
      this.setEmpty();
    }
  }

  // Clears the canvas
  clear(): void {
    this.setEmpty();
    this.signDataHistory = [];
    this.activePad.clear();
  }

  /** Return true if canvas is empty, otherwise return false */
  isEmpty(): boolean {
    return this._isEmpty;
  }

  /** Set canvas's state as dirty */
  setDirty(): void {
    this._isEmpty = false;
  }

  /** Set canvas's state as empty */
  setEmpty(): void {
    this._isEmpty = true;
  }

  getContext(): CanvasRenderingContext2D {
    return this.isFullScreen ? this.bigCanvas.getContext('2d') : this.smallCanvas.getContext('2d');
  }

  private initBigPad(): void {
    this.bigCanvas = this.nspBig.nativeElement; //document.querySelector('#nsp-big');
    const fullScreenOptions = JSON.parse(JSON.stringify(this.options));
    // Calculate the fullScreen pad's size
    this.fullScreenWidth = document.documentElement.clientWidth;
    const { width: miniScreenWidth, height: miniScreenHeight } = this.options;
    this.fullScreenHeight = (this.fullScreenWidth * miniScreenWidth) / miniScreenHeight;
    // Calculate section size
    const viewHeight = document.documentElement.clientHeight;
    const space = viewHeight - this.fullScreenHeight;
    this.sectionHeight = space / 2;
    // Init pad
    fullScreenOptions.width = this.fullScreenWidth;
    fullScreenOptions.height = this.fullScreenHeight;
    const { css } = fullScreenOptions;
    this.bigCanvas.width = this.fullScreenWidth;
    this.bigCanvas.height = this.fullScreenHeight;
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
    this.smallCanvas = this.nspSmall.nativeElement; //document.querySelector('#nsp-small');
    const { width, height, css } = this.options;
    this.options.width = width ? width : 300;
    this.options.height = height ? height : 150;
    this.smallCanvas.width = this.options.width;
    this.smallCanvas.height = this.options.height;
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
    this.beginSign.emit();
  }

  private _onEnd(): void {
    this.signDataHistory = this.toData();
    this.endSign.emit();
  }

  private setPadAttribute(key: string, value: any): void {
    if (this.bigPad) {
      this.bigPad[key] = value;
    }
    this.smallPad[key] = value;
  }

  constructor(private renderer2: Renderer2, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  ngAfterViewInit(): void {
    this.initSmallPad();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options.firstChange) {
      return;
    }
    const { dotSize, minWidth, maxWidth, throttle, minDistance, backgroundColor, penColor, velocityFilterWeight, width, height, css } =
      changes.options.currentValue;
    if (dotSize) {
      this.setPadAttribute('dotSize', dotSize);
    }
    if (minWidth) {
      this.setPadAttribute('minWidth', minWidth);
    }
    if (maxWidth) {
      this.setPadAttribute('maxWidth', maxWidth);
    }
    if (throttle) {
      this.setPadAttribute('throttle', throttle);
    }
    if (minDistance) {
      this.setPadAttribute('minDistance', minDistance);
    }
    if (backgroundColor) {
      this.setPadAttribute('backgroundColor', backgroundColor);
    }
    if (penColor) {
      this.setPadAttribute('penColor', penColor);
    }
    if (velocityFilterWeight) {
      this.setPadAttribute('velocityFilterWeight', velocityFilterWeight);
    }
    if (width || height) {
      const { width: previousWidth, height: previousHeight } = changes.options.previousValue;
      const data = this.smallPad.toDataURL();
      const image = new Image();
      image.src = data;
      image.onload = () => {
        this.initSmallPad();
        const ctx = this.smallCanvas.getContext('2d');
        ctx.drawImage(image, 0, 0, previousWidth, previousHeight, 0, 0, width, height);
      };
    }
    if (css) {
      if (this.bigCanvas) {
        for (const key in css) {
          if (Object.prototype.hasOwnProperty.call(css, key)) {
            const value = css[key];
            this.renderer2.setStyle(this.bigCanvas, key, value);
          }
        }
      }
      if (this.smallCanvas) {
        for (const key in css) {
          if (Object.prototype.hasOwnProperty.call(css, key)) {
            const value = css[key];
            this.renderer2.setStyle(this.smallCanvas, key, value);
          }
        }
      }
    }
  }
}
