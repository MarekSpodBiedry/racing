const SLOWA_KLUCZOWE =
  "const|let|function|return|export|import|from|default|if|else|for|of|new|class|await|async|true|false|null|undefined";

const WZORZEC = new RegExp(
  [
    "(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)",
    "(`[^`]*`|\"[^\"]*\"|'[^']*')",
    `\\b(${SLOWA_KLUCZOWE})\\b`,
    "\\b(\\d+(?:\\.\\d+)?)\\b",
  ].join("|"),
  "g",
);

/** @type {Record<string, string>} */
const KOLORY = {
  komentarz: "text-muted",
  napis: "text-code-string",
  slowo: "text-accent",
  liczba: "text-code-string",
};

/**
 * Dzieli kod na kawałki i przypisuje każdemu rodzaj, żeby dało się go pokolorować.
 *
 * @param {string} kod Kod źródłowy jako zwykły tekst.
 * @returns {Array<{tekst: string, rodzaj: string | null}>} Kawałki kodu po kolei.
 */
function podzielKod(kod) {
  const kawalki = [];
  let ostatni = 0;

  for (const trafienie of kod.matchAll(WZORZEC)) {
    const start = trafienie.index ?? 0;
    if (start > ostatni) {
      kawalki.push({ tekst: kod.slice(ostatni, start), rodzaj: null });
    }

    const [pelne, komentarz, napis, slowo, liczba] = trafienie;
    let rodzaj = null;
    if (komentarz) rodzaj = "komentarz";
    else if (napis) rodzaj = "napis";
    else if (slowo) rodzaj = "slowo";
    else if (liczba) rodzaj = "liczba";

    kawalki.push({ tekst: pelne, rodzaj });
    ostatni = start + pelne.length;
  }

  if (ostatni < kod.length) {
    kawalki.push({ tekst: kod.slice(ostatni), rodzaj: null });
  }

  return kawalki;
}

/**
 * Blok kodu z podpisem, na przykład nazwą pliku. Kod w JavaScripcie jest kolorowany.
 *
 * @param {Object} props
 * @param {string} props.label Podpis nad kodem.
 * @param {string} [props.lang] Ustaw na "text", żeby wyłączyć kolorowanie.
 * @param {string} props.children Kod jako zwykły tekst.
 * @returns {React.JSX.Element} Blok kodu przewijany w poziomie na wąskich ekranach.
 */
export function CodeBlock({ label, lang = "js", children }) {
  const kawalki = lang === "js" ? podzielKod(children) : null;

  return (
    <figure className="my-5 overflow-hidden rounded-md border border-rule">
      <figcaption className="border-b border-rule bg-shade px-4 py-2 font-mono text-xs text-muted">
        {label}
      </figcaption>
      <pre className="overflow-x-auto bg-shade px-4 py-4 text-sm leading-relaxed">
        <code>
          {kawalki
            ? kawalki.map((kawalek, index) => (
                <span key={index} className={kawalek.rodzaj ? KOLORY[kawalek.rodzaj] : undefined}>
                  {kawalek.tekst}
                </span>
              ))
            : children}
        </code>
      </pre>
    </figure>
  );
}
