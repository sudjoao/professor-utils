import type { HeaderImage } from '@/features/reports/types';

/** Same height as the coat of arms in the official template (~2.4 cm), in pixels. */
const HEADER_IMAGE_HEIGHT = 91;
const MAX_HEADER_IMAGE_WIDTH = 150;

const IMAGE_TYPES: Record<string, HeaderImage['type']> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

export const ACCEPTED_HEADER_IMAGE_TYPES = Object.keys(IMAGE_TYPES);

/** Scales the image to the header height, keeping its proportions and a reasonable width. */
export const fitHeaderImage = (width: number, height: number) => {
  const scaledWidth = Math.round((HEADER_IMAGE_HEIGHT * width) / height);

  return scaledWidth <= MAX_HEADER_IMAGE_WIDTH
    ? { width: scaledWidth, height: HEADER_IMAGE_HEIGHT }
    : {
        width: MAX_HEADER_IMAGE_WIDTH,
        height: Math.round((MAX_HEADER_IMAGE_WIDTH * height) / width),
      };
};

/** Loads the header image (a URL or a data URL) in the browser, ready to embed in the document. */
export const loadHeaderImage = async (source: string): Promise<HeaderImage> => {
  const blob = await (await fetch(source)).blob();
  const type = IMAGE_TYPES[blob.type];

  if (!type) {
    throw new Error(`Unsupported header image type: ${blob.type}`);
  }

  const bitmap = await createImageBitmap(blob);
  const size = fitHeaderImage(bitmap.width, bitmap.height);
  bitmap.close();

  return { data: await blob.arrayBuffer(), type, ...size };
};
