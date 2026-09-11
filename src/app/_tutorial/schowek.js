"use client";

/**
 * Kopiuje tekst do schowka. Najpierw próbuje nowego API przeglądarki, z sekundowym
 * limitem czasu, bo bez focusu na stronie potrafi ono nigdy nie odpowiedzieć.
 * Gdy się nie uda albo gdy strona korzysta ze zwykłego HTTP, kopiuje przez pole tekstowe.
 *
 * @param {string} tekst Tekst do skopiowania.
 * @returns {Promise<boolean>} Prawda, jeśli kopiowanie się udało.
 */
export async function doSchowka(tekst) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const limit = new Promise((_, odrzuc) =>
        setTimeout(() => odrzuc(new Error("timeout")), 1000),
      );
      await Promise.race([navigator.clipboard.writeText(tekst), limit]);
      return true;
    }
  } catch {}

  try {
    const pole = document.createElement("textarea");
    pole.value = tekst;
    pole.setAttribute("readonly", "");
    pole.style.position = "fixed";
    pole.style.top = "-1000px";
    document.body.appendChild(pole);
    pole.select();
    const udane = document.execCommand("copy");
    document.body.removeChild(pole);
    return udane;
  } catch {
    return false;
  }
}
