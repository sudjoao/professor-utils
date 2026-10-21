export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  // Revoking on the next tick gives Safari time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
