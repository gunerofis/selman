(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PanoEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SHEET_WIDTH_MM = 2100;
  const SHEET_HEIGHT_MM = 2800;
  const PROFIT_RATE = 0.25;
  const LABOR_RATE = 0.30;

  function floorSafe(value) {
    return Math.floor(value + 1e-9);
  }

  function toMillimeters(cm) {
    return Math.round(Number(cm) * 10);
  }

  function assertPositiveNumber(value, label) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
      throw new Error(label + " sıfırdan büyük olmalıdır.");
    }
    return number;
  }

  function assertNonNegativeNumber(value, label) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) {
      throw new Error(label + " sıfır veya daha büyük olmalıdır.");
    }
    return number;
  }

  // Tüm parçalar plakaya aynı yönde dizilir. Plaka üzerinde yön karıştırılmaz;
  // yalnızca "düz" ve "90° çevrik" dizilimlerden çok veren seçilir.
  function gridLayout(sheetW, sheetH, itemW, itemH) {
    const columns = floorSafe(sheetW / itemW);
    const rows = floorSafe(sheetH / itemH);
    return { columns: columns, rows: rows, count: columns * rows };
  }

  function maxPiecesFromSheet(heightCm, widthCm) {
    const height = assertPositiveNumber(heightCm, "Pano yüksekliği");
    const width = assertPositiveNumber(widthCm, "Pano genişliği");
    const itemH = toMillimeters(height);
    const itemW = toMillimeters(width);

    const normal = gridLayout(SHEET_WIDTH_MM, SHEET_HEIGHT_MM, itemW, itemH);
    const rotated = gridLayout(SHEET_WIDTH_MM, SHEET_HEIGHT_MM, itemH, itemW);

    if (normal.count < 1 && rotated.count < 1) {
      return { count: 0, fits: false, columns: 0, rows: 0, rotated: false };
    }

    const useRotated = rotated.count > normal.count;
    const chosen = useRotated ? rotated : normal;

    return {
      count: chosen.count,
      fits: true,
      columns: chosen.columns,
      rows: chosen.rows,
      rotated: useRotated
    };
  }

  function calculate(input) {
    const heightCm = assertPositiveNumber(input.heightCm, "Pano yüksekliği");
    const widthCm = assertPositiveNumber(input.widthCm, "Pano genişliği");
    const usdTry = assertPositiveNumber(input.usdTry, "USD/TL kuru");
    const mdfUsd = assertPositiveNumber(input.mdfUsd, "MDF plaka fiyatı");
    const xbiUsd = assertPositiveNumber(input.xbiUsd, "XBi fiyatı");
    const fabricUsd = assertPositiveNumber(input.fabricUsd, "Kumaş fiyatı");
    const aluminumUsd = assertPositiveNumber(input.aluminumUsd, "Alüminyum profil fiyatı");
    const otherUsd = assertNonNegativeNumber(input.otherUsd, "Diğer giderler");

    const packing = maxPiecesFromSheet(heightCm, widthCm);
    if (!packing.fits || packing.count < 1) {
      throw new Error("Bu pano 210 × 280 cm MDF plakaya 90° döndürülse de sığmıyor.");
    }

    const mdfSheetTl = mdfUsd * usdTry;
    const mdfCost = mdfSheetTl / packing.count;

    const xbiBilledHeightCm = Math.max(heightCm, 100);
    const xbiAreaM2 = (xbiBilledHeightCm / 100) * (widthCm / 100);
    const xbiUnitTl = xbiUsd * usdTry;
    const xbiCost = xbiAreaM2 * xbiUnitTl;

    let fabricBaseHeightCm;
    let fabricRowFactor;
    let fabricRule;
    if (heightCm <= 70) {
      fabricBaseHeightCm = 140;
      fabricRowFactor = 0.5;
      fabricRule = "İki sıra (×0,5)";
    } else if (heightCm < 140) {
      fabricBaseHeightCm = 140;
      fabricRowFactor = 1;
      fabricRule = "140 cm baz en";
    } else {
      fabricBaseHeightCm = heightCm;
      fabricRowFactor = 1;
      fabricRule = "Gerçek yükseklik";
    }
    const fabricLinearMeter = (widthCm / 100) * fabricRowFactor;
    const fabricUnitTl = fabricUsd * usdTry;
    const fabricCost = fabricLinearMeter * fabricUnitTl;

    const aluminumPerimeterCm = 2 * (heightCm + widthCm);
    const aluminumRatio = aluminumPerimeterCm / 600;
    const aluminumProfileTl = aluminumUsd * usdTry;
    const aluminumCost = aluminumRatio * aluminumProfileTl;

    // Diğer giderler de döviz endekslidir; canlı kurla TL'ye çevrilir.
    const otherCostTl = otherUsd * usdTry;

    // Hammadde kalemleri + diğer gider = kâr ve işçiliğin uygulandığı taban.
    const materialTl = mdfCost + xbiCost + fabricCost + aluminumCost;
    const baseTl = materialTl + otherCostTl;
    const profitTl = baseTl * PROFIT_RATE;
    const laborTl = baseTl * LABOR_RATE;
    const totalTl = baseTl + profitTl + laborTl;

    return {
      dimensions: { heightCm: heightCm, widthCm: widthCm },
      rate: usdTry,
      mdf: {
        sheetWidthCm: 210,
        sheetHeightCm: 280,
        piecesPerSheet: packing.count,
        columns: packing.columns,
        rows: packing.rows,
        rotated: packing.rotated,
        sheetTl: mdfSheetTl,
        costTl: mdfCost
      },
      xbi: {
        actualHeightCm: heightCm,
        billedHeightCm: xbiBilledHeightCm,
        areaM2: xbiAreaM2,
        unitTl: xbiUnitTl,
        costTl: xbiCost
      },
      fabric: {
        actualHeightCm: heightCm,
        baseHeightCm: fabricBaseHeightCm,
        rowFactor: fabricRowFactor,
        rule: fabricRule,
        linearMeter: fabricLinearMeter,
        unitTl: fabricUnitTl,
        costTl: fabricCost
      },
      aluminum: {
        perimeterCm: aluminumPerimeterCm,
        ratio: aluminumRatio,
        profileTl: aluminumProfileTl,
        costTl: aluminumCost
      },
      other: { usd: otherUsd, costTl: otherCostTl },
      materialTl: materialTl,
      baseTl: baseTl,
      profit: { rate: PROFIT_RATE, costTl: profitTl },
      labor: { rate: LABOR_RATE, costTl: laborTl },
      totalTl: totalTl
    };
  }

  return {
    constants: {
      SHEET_WIDTH_CM: 210,
      SHEET_HEIGHT_CM: 280,
      PROFIT_RATE: PROFIT_RATE,
      LABOR_RATE: LABOR_RATE
    },
    calculate: calculate,
    maxPiecesFromSheet: maxPiecesFromSheet
  };
});
