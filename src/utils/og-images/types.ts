export type ImageFormat = 'jpeg' | 'webp' | 'avif';

export interface JpegOptions {
  quality?: number; // 1-100, default 80
  chromaSubsampling?: '4:4:4' | '4:2:2' | '4:2:0';
  progressive?: boolean;
  mozjpeg?: boolean;
  optimiseCoding?: boolean;
}

export interface WebpOptions {
  quality?: number; // 1-100, default 80
  lossless?: boolean;
  nearLossless?: boolean;
  smartSubsample?: boolean;
  effort?: number; // 0-6, default 4
}

export interface AvifOptions {
  quality?: number; // 1-100, default 50
  lossless?: boolean;
  chromaSubsampling?: '4:4:4' | '4:2:0';
  effort?: number; // 0-9, default 4
  bitdepth?: 8 | 10 | 12; // default 8
}

export interface ImageConfig {
  format: ImageFormat;
  jpegOptions?: JpegOptions;
  webpOptions?: WebpOptions;
  avifOptions?: AvifOptions;
}

export type SvgConfig = {
  width: number;
  height: number;
  embedFont: boolean;
};
