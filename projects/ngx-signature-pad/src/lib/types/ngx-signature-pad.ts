import { IOptions } from 'signature_pad';

export interface NgxSignatureOptions extends IOptions {
  /** The width of canvas */
  width?: number;
  /** The height of canvas */
  height?: number;
  /** The css of canvas */
  css?: { [key: string]: string };
}
