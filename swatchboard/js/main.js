const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const errorMessage = document.getElementById("error-message");
const previewArea = document.getElementById("preview-area");
const previewImage = document.getElementById("preview-image");
const processingText = document.getElementById("processing-text");
const swatchesContainer = document.getElementById("swatches-container");

let appState = "idle";

function showError(message) {
  appState = "error";
  errorMessage.textContent = "Warning: " + message;
  errorMessage.classList.remove("hidden");
  previewArea.classList.add("hidden");
  processingText.classList.add("hidden");
  swatchesContainer.classList.add("hidden");
  swatchesContainer.innerHTML = "";
}

function clearError() {
  errorMessage.classList.add("hidden");
  errorMessage.textContent = "";
}

function copyHexToClipboard(hex, labelEl) {
  navigator.clipboard.writeText(hex).then(function () {
    const originalText = labelEl.textContent;
    labelEl.textContent = "Copied!";
    labelEl.classList.add("copied");
    setTimeout(function () {
      labelEl.textContent = originalText;
      labelEl.classList.remove("copied");
    }, 1500);
  }).catch(function () {
    labelEl.textContent = "Copy failed - select manually";
    setTimeout(function () {
      labelEl.textContent = hex.toUpperCase();
    }, 1500);
  });
}

function renderSwatches(hexColors) {
  swatchesContainer.innerHTML = "";

  if (!hexColors || hexColors.length === 0) {
    showError("Couldn't extract any colors from this image.");
    return;
  }

  hexColors.forEach(function (hex) {
    const rgb = hexToRgb(hex);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    const card = document.createElement("div");
    card.className = "swatch-card";

    const swatchColor = document.createElement("div");
    swatchColor.className = "swatch-color";
    swatchColor.style.backgroundColor = hex;

    const hexLabel = document.createElement("p");
    hexLabel.className = "swatch-hex";
    hexLabel.textContent = hex.toUpperCase();
    hexLabel.title = "Click to copy";
    hexLabel.addEventListener("click", function () {
      copyHexToClipboard(hex.toUpperCase(), hexLabel);
    });

    const rgbLabel = document.createElement("p");
    rgbLabel.className = "swatch-detail";
    rgbLabel.textContent = "RGB: " + rgb.r + ", " + rgb.g + ", " + rgb.b;

    const cmykLabel = document.createElement("p");
    cmykLabel.className = "swatch-detail";
    cmykLabel.textContent = "CMYK: " + cmyk.c + "%, " + cmyk.m + "%, " + cmyk.y + "%, " + cmyk.k + "%";

    card.appendChild(swatchColor);
    card.appendChild(hexLabel);
    card.appendChild(rgbLabel);
    card.appendChild(cmykLabel);
    swatchesContainer.appendChild(card);
  });

  swatchesContainer.classList.remove("hidden");
}

function runExtraction() {
  extractColors(previewImage)
    .then(function (hexColors) {
      processingText.classList.add("hidden");
      appState = "results";
      renderSwatches(hexColors);
    })
    .catch(function (err) {
      console.error("Color extraction failed:", err);
      showError("Couldn't extract colors from this image. Please try another one.");
    });
}

function handleFile(file) {
  clearError();

  if (!file) {
    showError("No file was selected. Please try again.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    showError("Please upload a valid image file (JPG, PNG, GIF, WEBP, etc.).");
    return;
  }

  appState = "processing";
  previewArea.classList.remove("hidden");
  processingText.classList.remove("hidden");
  swatchesContainer.classList.add("hidden");
  swatchesContainer.innerHTML = "";

  const objectURL = URL.createObjectURL(file);

  previewImage.onload = function () {
    runExtraction();
  };

  previewImage.onerror = function () {
    showError("Couldn't read this image. Please try another file.");
  };

  previewImage.src = objectURL;

  if (previewImage.complete && previewImage.naturalWidth > 0) {
    runExtraction();
  }
}

dropZone.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  handleFile(file);
});

dropZone.addEventListener("dragover", function (event) {
  event.preventDefault();
  dropZone.classList.add("drag-active");
});

dropZone.addEventListener("dragleave", function (event) {
  event.preventDefault();
  dropZone.classList.remove("drag-active");
});

dropZone.addEventListener("drop", function (event) {
  event.preventDefault();
  dropZone.classList.remove("drag-active");
  const file = event.dataTransfer.files[0];
  handleFile(file);
});
