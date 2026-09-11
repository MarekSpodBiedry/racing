"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const SZEROKOSC = 760;
const WYSOKOSC = 420;
const POZIOM_PODLOGI = 380;
const MAKS_KULEK = 10;

/**
 * Buduje wieżę z klocków stojącą na styk, bez żadnego dostrojenia.
 *
 * @returns {Array<import("matter-js").Body>} Klocki gotowe do dodania do świata.
 */
function zbudujWieze() {
  const { Bodies } = Matter;
  const srodek = SZEROKOSC / 2;
  const gora = POZIOM_PODLOGI;

  return [
    Bodies.rectangle(srodek - 40, gora - 30, 20, 60),
    Bodies.rectangle(srodek + 40, gora - 30, 20, 60),
    Bodies.rectangle(srodek, gora - 68, 130, 16),
    Bodies.rectangle(srodek - 25, gora - 106, 20, 60),
    Bodies.rectangle(srodek + 25, gora - 106, 20, 60),
    Bodies.rectangle(srodek, gora - 144, 90, 16),
    Bodies.rectangle(srodek, gora - 164, 28, 24),
  ];
}

/**
 * Rysuje jedno ciało Matter.js po jego wierzchołkach.
 *
 * @param {CanvasRenderingContext2D} ctx Kontekst rysowania.
 * @param {import("matter-js").Body} cialo Ciało do narysowania.
 * @param {string} wypelnienie Kolor wnętrza.
 * @param {string} obrys Kolor obrysu.
 */
function rysujCialo(ctx, cialo, wypelnienie, obrys) {
  const punkty = cialo.vertices;
  ctx.beginPath();
  ctx.moveTo(punkty[0].x, punkty[0].y);
  for (let i = 1; i < punkty.length; i += 1) {
    ctx.lineTo(punkty[i].x, punkty[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = wypelnienie;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = obrys;
  ctx.stroke();
}

/**
 * @typedef {Object} Swiat
 * @property {import("matter-js").Engine} engine Silnik z aktualnym światem.
 * @property {import("matter-js").Body[]} kulki Kulki upuszczone przez oglądającego.
 */

/**
 * Pokaz fizyki na pierwszą lekcję: wieża z klocków i kulka, którą można ją rozwalić.
 * Nic tu nie jest dostrojone i taki jest zamysł, bo dostrajanie to zadanie dla klasy.
 *
 * @returns {React.JSX.Element} Płótno z pokazem i przycisk ustawiający wieżę od nowa.
 */
export function MatterDemo() {
  const canvasRef = useRef(/** @type {HTMLCanvasElement | null} */ (null));
  const swiatRef = useRef(/** @type {Swiat | null} */ (null));
  const [licznik, setLicznik] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const { Engine, Bodies, Composite } = Matter;
    const style = getComputedStyle(document.documentElement);
    /** @type {(nazwa: string, zapas: string) => string} */
    const kolor = (nazwa, zapas) => style.getPropertyValue(nazwa).trim() || zapas;
    const papier = kolor("--color-paper", "#ffffff");
    const tusz = kolor("--color-ink", "#111111");
    const cien = kolor("--color-shade", "#f4f4f5");
    const akcent = kolor("--color-accent", "#d0021b");

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const gestosc = window.devicePixelRatio || 1;
    canvas.width = SZEROKOSC * gestosc;
    canvas.height = WYSOKOSC * gestosc;
    ctx.scale(gestosc, gestosc);

    const engine = Engine.create();
    const podloga = Bodies.rectangle(
      SZEROKOSC / 2,
      POZIOM_PODLOGI + 20,
      SZEROKOSC + 200,
      40,
      { isStatic: true },
    );
    const sciany = [
      Bodies.rectangle(-20, WYSOKOSC / 2, 40, WYSOKOSC * 2, { isStatic: true }),
      Bodies.rectangle(SZEROKOSC + 20, WYSOKOSC / 2, 40, WYSOKOSC * 2, { isStatic: true }),
    ];
    const klocki = zbudujWieze();
    /** @type {import("matter-js").Body[]} */
    const kulki = [];

    Composite.add(engine.world, [podloga, ...sciany, ...klocki]);

    swiatRef.current = { engine, kulki };

    let klatka = 0;

    const krok = () => {
      Engine.update(engine, 1000 / 60);

      ctx.fillStyle = papier;
      ctx.fillRect(0, 0, SZEROKOSC, WYSOKOSC);

      rysujCialo(ctx, podloga, cien, tusz);
      klocki.forEach((k) => rysujCialo(ctx, k, papier, tusz));
      kulki.forEach((k) => rysujCialo(ctx, k, akcent, akcent));

      klatka = window.requestAnimationFrame(krok);
    };

    klatka = window.requestAnimationFrame(krok);

    return () => {
      window.cancelAnimationFrame(klatka);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      swiatRef.current = null;
    };
  }, [licznik]);

  /**
   * Upuszcza kulkę w miejscu kliknięcia.
   *
   * @param {React.MouseEvent<HTMLCanvasElement>} event Kliknięcie w płótno.
   */
  function upusc(event) {
    const swiat = swiatRef.current;
    const canvas = canvasRef.current;
    if (!swiat || !canvas) return;

    const { Bodies, Composite } = Matter;
    const obszar = canvas.getBoundingClientRect();
    const x = ((event.clientX - obszar.left) / obszar.width) * SZEROKOSC;

    const kulka = Bodies.circle(x, 30, 18, { restitution: 0.4, density: 0.004 });
    Composite.add(swiat.engine.world, kulka);
    swiat.kulki.push(kulka);

    while (swiat.kulki.length > MAKS_KULEK) {
      const stara = swiat.kulki.shift();
      if (stara) Composite.remove(swiat.engine.world, stara);
    }
  }

  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-md border border-rule bg-shade">
        <canvas
          ref={canvasRef}
          onClick={upusc}
          role="img"
          aria-label="Wieża z klocków. Kliknięcie upuszcza na nią kulkę."
          className="block w-full cursor-crosshair"
          style={{ aspectRatio: `${SZEROKOSC} / ${WYSOKOSC}` }}
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-end gap-3 text-sm text-muted">
        <button
          type="button"
          onClick={() => setLicznik((n) => n + 1)}
          className="rounded border border-rule px-3 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ustaw od nowa
        </button>
      </figcaption>
    </figure>
  );
}
