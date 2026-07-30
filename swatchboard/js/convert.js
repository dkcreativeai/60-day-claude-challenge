function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return { r: 0, g: 0, b: 0 };
  }
  return { r: r, g: g, b: b };
}

function rgbToCmyk(r, g, b) {
  const rPrime = r / 255;
  const gPrime = g / 255;
  const bPrime = b / 255;

  const k = 1 - Math.max(rPrime, gPrime, bPrime);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rPrime - k) / (1 - k);
  const m = (1 - gPrime - k) / (1 - k);
  const y = (1 - bPrime - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}
