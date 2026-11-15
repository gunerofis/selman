(function () {
  "use strict";

  const STORAGE_KEY = "panoMaliyet.materialPrices.v1";
  const priceIds = ["mdfUsd", "xbiUsd", "fabricUsd", "aluminumUsd", "otherUsd"];
  const byId = function (id) { return document.getElementById(id); };
  const form = byId("costForm");
  const formMessage = byId("formMessage");
  const calculateButton = byId("calculateButton");
  const emptyState = byId("emptyState");
  const resultState = byId("resultState");
  const ratePill = byId("ratePill");
  const rateValue = byId("rateValue");
  const saveState = byId("saveState");
  let saveTimer = null;

  const moneyFormatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const numberFormatter = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  });
  const rateFormatter = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });

  function money(value) { return moneyFormatter.format(value); }
  function number(value) { return numberFormatter.format(value); }

  function showMessage(message) {
    formMessage.textContent = message;
    formMessage.hidden = false;
  }

  function clearMessage() {
    formMessage.hidden = true;
    formMessage.textContent = "";
  }

  function setLoading(isLoading) {
    calculateButton.disabled = isLoading;
    calculateButton.classList.toggle("is-loading", isLoading);
    byId("heightCm").disabled = isLoading;
    byId("widthCm").disabled = isLoading;
    priceIds.forEach(function (id) { byId(id).disabled = isLoading; });
    calculateButton.querySelector(".button-text").textContent = isLoading ? "Canlı kur alınıyor" : "Maliyeti hesapla";
  }

  function setRateStatus(status, text) {
    ratePill.classList.remove("is-loading", "is-error");
    if (status === "loading") ratePill.classList.add("is-loading");
    if (status === "error") ratePill.classList.add("is-error");
    rateValue.textContent = text;
  }

  function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, timeoutMs);
    return fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { "Accept": "application/json" },
      signal: controller.signal
    }).finally(function () { clearTimeout(timer); });
  }

  const rateSources = [
    {
      name: "Frankfurter",
      url: "https://api.frankfurter.dev/v2/rate/USD/TRY",
      parse: function (data) {
        return data && data.quote === "TRY" ? { rate: Number(data.rate), date: data.date } : null;
      }
    },
    {
      name: "ExchangeRate-API",
      url: "https://open.er-api.com/v6/latest/USD",
      parse: function (data) {
        if (!data || data.result !== "success" || !data.rates) return null;
        return {
          rate: Number(data.rates.TRY),
          date: data.time_last_update_unix ? new Date(data.time_last_update_unix * 1000).toISOString().slice(0, 10) : null
        };
      }
    }
  ];

  async function fetchLiveRate() {
    let lastError = null;
    for (let i = 0; i < rateSources.length; i += 1) {
      const source = rateSources[i];
      try {
        const response = await fetchWithTimeout(source.url, 8000);
        if (!response.ok) throw new Error("Kur servisi HTTP " + response.status);
        const parsed = source.parse(await response.json());
        if (!parsed || !Number.isFinite(parsed.rate) || parsed.rate <= 0 || parsed.rate > 1000) {
          throw new Error("Geçersiz kur verisi");
        }
        return {
          rate: parsed.rate,
          rateDate: parsed.date,
          fetchedAt: new Date(),
          source: source.name
        };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("Canlı USD/TL kuru alınamadı.");
  }

  function rateDescription(rateInfo) {
    const dateText = rateInfo.rateDate
      ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(rateInfo.rateDate + "T12:00:00"))
      : "güncel veri";
    const timeText = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(rateInfo.fetchedAt);
    return "1 USD = " + rateFormatter.format(rateInfo.rate) + " TL · " + dateText + " · " + rateInfo.source + " · " + timeText;
  }

  async function refreshRateBadge() {
    setRateStatus("loading", "Kur alınıyor…");
    try {
      const info = await fetchLiveRate();
      setRateStatus("success", rateFormatter.format(info.rate) + " TL");
    } catch (error) {
      setRateStatus("error", "Kur alınamadı");
    }
  }

  function loadPrices() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
    priceIds.forEach(function (id) {
      if (saved[id] !== undefined && saved[id] !== null && saved[id] !== "") {
        byId(id).value = saved[id];
      }
    });
  }

  function savePrices() {
    const data = {};
    priceIds.forEach(function (id) { data[id] = byId(id).value; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    saveState.textContent = "Kaydedildi";
    saveState.classList.add("saved");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveState.textContent = "Bu bilgisayarda saklanır";
      saveState.classList.remove("saved");
    }, 1700);
  }

  function readInput() {
    return {
      heightCm: byId("heightCm").value,
      widthCm: byId("widthCm").value,
      mdfUsd: byId("mdfUsd").value,
      xbiUsd: byId("xbiUsd").value,
      fabricUsd: byId("fabricUsd").value,
      aluminumUsd: byId("aluminumUsd").value,
      otherUsd: byId("otherUsd").value
    };
  }

  function validateRequiredFields() {
    const ids = ["heightCm", "widthCm"].concat(priceIds);
    for (let i = 0; i < ids.length; i += 1) {
      const input = byId(ids[i]);
      if (!input.value || !input.checkValidity()) {
        input.focus();
        throw new Error("Tüm ölçü, fiyat ve gider alanlarını geçerli değerlerle doldurun.");
      }
    }
  }

  function renderResult(result, rateInfo) {
    byId("resultDimensions").textContent = number(result.dimensions.heightCm) + " × " + number(result.dimensions.widthCm) + " cm pano";
    byId("resultRate").textContent = rateDescription(rateInfo);
    byId("totalTl").textContent = money(result.totalTl);
    byId("baseTl").textContent = money(result.baseTl);

    byId("mdfCost").textContent = money(result.mdf.costTl);
    byId("xbiCost").textContent = money(result.xbi.costTl);
    byId("fabricCost").textContent = money(result.fabric.costTl);
    byId("aluminumCost").textContent = money(result.aluminum.costTl);
    byId("otherCost").textContent = money(result.other.costTl);
    byId("laborCost").textContent = money(result.labor.costTl);
    byId("profitCost").textContent = money(result.profit.costTl);

    byId("mdfSizes").textContent = "210 × 280 / " + number(result.dimensions.heightCm) + " × " + number(result.dimensions.widthCm) + " cm";
    byId("mdfPieces").textContent = result.mdf.piecesPerSheet + " adet · " + result.mdf.columns + " × " + result.mdf.rows
      + (result.mdf.rotated ? " (çevrik)" : "");
    byId("mdfSheetTl").textContent = money(result.mdf.sheetTl);
    byId("mdfDetailCost").textContent = money(result.mdf.costTl);

    byId("xbiHeights").textContent = number(result.xbi.actualHeightCm) + " / " + number(result.xbi.billedHeightCm) + " cm";
    byId("xbiArea").textContent = number(result.xbi.areaM2) + " m²";
    byId("xbiUnitTl").textContent = money(result.xbi.unitTl) + " / m²";
    byId("xbiDetailCost").textContent = money(result.xbi.costTl);

    byId("fabricHeights").textContent = number(result.fabric.actualHeightCm) + " / " + number(result.fabric.baseHeightCm) + " cm";
    byId("fabricRule").textContent = result.fabric.rule;
    byId("fabricUsage").textContent = number(result.fabric.linearMeter) + " mt · " + money(result.fabric.unitTl) + " / mt";
    byId("fabricDetailCost").textContent = money(result.fabric.costTl);

    byId("aluminumPerimeter").textContent = number(result.aluminum.perimeterCm) + " cm";
    byId("aluminumRatio").textContent = number(result.aluminum.ratio) + " × profil";
    byId("aluminumProfileTl").textContent = money(result.aluminum.profileTl);
    byId("aluminumDetailCost").textContent = money(result.aluminum.costTl);

    emptyState.hidden = true;
    resultState.hidden = false;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearMessage();
    try {
      validateRequiredFields();
      setLoading(true);
      setRateStatus("loading", "Kur yenileniyor…");
      const rateInfo = await fetchLiveRate();
      setRateStatus("success", rateFormatter.format(rateInfo.rate) + " TL");
      const input = readInput();
      input.usdTry = rateInfo.rate;
      const result = window.PanoEngine.calculate(input);
      renderResult(result, rateInfo);
    } catch (error) {
      resultState.hidden = true;
      emptyState.hidden = false;
      if (/kur|fetch|network|HTTP|abort/i.test(error.message || "")) {
        setRateStatus("error", "Kur alınamadı");
        showMessage("Canlı USD/TL kuru alınamadı. İnternet bağlantısını kontrol edip yeniden deneyin; kur olmadan hesaplama yapılmadı.");
      } else {
        showMessage(error.message || "Hesaplama tamamlanamadı.");
      }
    } finally {
      setLoading(false);
    }
  });

  priceIds.forEach(function (id) {
    byId(id).addEventListener("input", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(savePrices, 300);
    });
  });

  loadPrices();
  refreshRateBadge();
})();
