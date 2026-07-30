function extractColors(imageElement) {
  return new Promise(function (resolve, reject) {
    try {
      if (!imageElement || !imageElement.naturalWidth) {
        reject(new Error("Image has not fully loaded yet."));
        return;
      }

      const canvas = document.createElement("canvas");
      const maxWidth = 200;
      const scale = Math.min(1, maxWidth / imageElement.naturalWidth);
      canvas.width = Math.max(1, Math.round(imageElement.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(imageElement.naturalHeight * scale));

      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      const colorThief = new ColorThief();

      const scaledImage = new Image();
      scaledImage.onload = function () {
        try {
          const palette = colorThief.getPalette(scaledImage, 3);
          const hexColors = palette.map(function (rgbArray) {
            return rgbToHex(rgbArray[0], rgbArray[1], rgbArray[2]);
          });
          resolve(hexColors);
        } catch (err) {
          reject(err);
        }
      };
      scaledImage.onerror = function () {
        reject(new Error("Could not process the downscaled image."));
      };
      scaledImage.src = canvas.toDataURL();
    } catch (err) {
      reject(err);
    }
  });
}

function rgbToHex(r, g, b) {
  const toHex = function (value) {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}
