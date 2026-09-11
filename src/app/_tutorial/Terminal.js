"use client";

import { useState } from "react";
import { doSchowka } from "./schowek";


/**
 * Pojedyncze polecenie z przyciskiem, który kopiuje je do schowka.
 *
 * @param {Object} props
 * @param {string} props.command Polecenie do wklejenia w wierszu polecenia.
 * @param {string} [props.opis] Zdanie wyjaśniające, co to polecenie robi.
 * @returns {React.JSX.Element} Wiersz z poleceniem, opisem i przyciskiem kopiowania.
 */
function CommandRow({ command, opis }) {
  const [stan, setStan] = useState("gotowy");

  async function kopiuj() {
    const udane = await doSchowka(command);
    setStan(udane ? "skopiowano" : "blad");
    setTimeout(() => setStan("gotowy"), 2500);
  }

  const napis =
    stan === "skopiowano" ? "skopiowano" : stan === "blad" ? "zaznacz ręcznie" : "kopiuj";

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
      <span aria-hidden="true" className="select-none pt-0.5 font-mono text-sm text-accent">
        &gt;
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-sm">
        {command}
      </code>
      <button
        type="button"
        onClick={kopiuj}
        aria-label={`Kopiuj polecenie: ${command}`}
        className={`shrink-0 rounded border px-2 py-1 font-mono text-xs transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          stan === "skopiowano"
            ? "border-accent text-accent"
            : "border-rule text-muted hover:border-accent hover:text-accent"
        }`}
      >
        {napis}
      </button>
      <span aria-live="polite" className="sr-only">
        {stan === "skopiowano" ? "Skopiowano do schowka" : ""}
      </span>
      </div>
      {opis ? <p className="mt-2 pl-6 text-sm text-muted">{opis}</p> : null}
    </div>
  );
}

/**
 * Okno wiersza polecenia z listą gotowych poleceń do skopiowania.
 *
 * @param {Object} props
 * @param {string} [props.title] Podpis na belce okna.
 * @param {Array<string | {command: string, opis?: string}>} props.commands Polecenia,
 *   każde w osobnym wierszu. Zamiast samego tekstu można podać obiekt z opisem.
 * @returns {React.JSX.Element} Blok z poleceniami do skopiowania.
 */
export function Terminal({ title = "Wiersz polecenia", commands }) {
  return (
    <div className="my-5 overflow-hidden rounded-md border border-rule bg-shade">
      <div className="border-b border-rule px-4 py-2 font-mono text-xs text-muted">
        {title}
      </div>
      <div className="divide-y divide-rule">
        {commands
          .map((pozycja) => (typeof pozycja === "string" ? { command: pozycja } : pozycja))
          .map((pozycja) => (
            <CommandRow key={pozycja.command} command={pozycja.command} opis={pozycja.opis} />
          ))}
      </div>
    </div>
  );
}
