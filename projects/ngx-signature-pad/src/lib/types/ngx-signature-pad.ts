import { IOptions } from 'signature_pad';

export interface NgxSignatureOptions extends IOptions {
  /** the width of canvas */
  width?: number;
  /** the height of canvas */
  height?: number;
  /** the css of canvas */
  css?: { [key: string]: string };
}
