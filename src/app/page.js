import { Blank } from "./_tutorial/Blank";
import { CodeBlock } from "./_tutorial/CodeBlock";
import { MatterDemo } from "./_tutorial/MatterDemo";
import { Section } from "./_tutorial/Section";
import { Terminal } from "./_tutorial/Terminal";

const SPIS_TRESCI = [
  { id: "projekt", title: "Projekt i gra, którą budujemy" },
  { id: "javascript", title: "Podstawy JavaScriptu" },
  { id: "jsdoc", title: "JSDoc zamiast TypeScriptu" },
  { id: "nextjs", title: "Jak działa Next.js" },
  { id: "matter", title: "Matter.js i fizyka" },
  { id: "git", title: "Git i GitHub" },
  { id: "start", title: "Setup" },
  { id: "zespoly", title: "Zespoły" },
];

/**
 * Strona tutoriala pokazywana na pierwszej lekcji. Jest też dowodem na to,
 * że repozytorium uruchamia się u ucznia na komputerze.
 *
 * @returns {React.JSX.Element} Cała strona tutoriala.
 */
export default function TutorialPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-32">
      <header className="pt-20 pb-12">
        <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
          MatGeo Racing
        </h1>
      </header>

      <nav
        aria-label="Spis treści"
        className="rounded-md border border-rule bg-shade p-6"
      >
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Spis treści
        </h2>
        <ol className="mt-4 space-y-2">
          {SPIS_TRESCI.map((pozycja, index) => (
            <li key={pozycja.id} className="flex gap-3">
              <span className="font-mono text-sm text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${pozycja.id}`}
                className="underline decoration-rule underline-offset-4 hover:decoration-accent"
              >
                {pozycja.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="projekt" number={1} title="Projekt i gra, którą budujemy">
        <Blank />
        <CodeBlock label="struktura repozytorium" lang="text">{`racing/
├── src/
│   ├── app/          trasy Next.js, strona główna to ten tutorial
│   ├── engine/       świat Matter.js, pojazd, teren, kamera, pętla gry
│   ├── systems/      monety, paliwo, punkty, wczytywanie poziomów, zapis wyników
│   ├── components/   HUD, menu, ekrany
│   └── levels/       dane poziomów
└── public/           instalator, który pobierasz w sekcji 07`}</CodeBlock>
      </Section>

      <Section id="javascript" number={2} title="Podstawy JavaScriptu">
        <CodeBlock label="zmienne i funkcje">{`const grawitacja = 1;
let dystans = 0;

dystans = dystans + 5;

function policzWynik(dystans, monety) {
  return dystans + monety * 10;
}

const policzWynikKrocej = (dystans, monety) => dystans + monety * 10;`}</CodeBlock>
        <CodeBlock label="obiekty i tablice">{`const punkt = { x: 120, y: 40 };

punkt.y = 55;

const monety = [
  { x: 100, y: 30 },
  { x: 260, y: 45 },
  { x: 410, y: 20 },
];

const wysokosci = monety.map((moneta) => moneta.y);
const wysokie = monety.filter((moneta) => moneta.y < 40);`}</CodeBlock>
        <CodeBlock label="destrukturyzacja i moduły">{`const { x, y } = punkt;

export function stworzTeren(punkty) {
  return punkty;
}

import { stworzTeren } from "@/engine/terrain.js";`}</CodeBlock>
      </Section>

      <Section id="jsdoc" number={3} title="JSDoc zamiast TypeScriptu">
        <CodeBlock label="src/engine/contracts.js">{`/**
 * @typedef {Object} Vec2
 * @property {number} x
 * @property {number} y
 */`}</CodeBlock>
        <CodeBlock label="src/levels/level-01.js">{`/** @type {Level} */
const poziom = {
  id: "level-01",
  name: "Rozgrzewka",
  terain: [],           // edytor podkreśli: nie ma takiego pola, jest "terrain"
  spawn: { x: 0, y: 0 },
  startFuel: "pełny",   // edytor podkreśli: ma być liczba, nie tekst
};`}</CodeBlock>
        <CodeBlock label="opis funkcji">{`/**
 * Liczy wynik przejazdu.
 *
 * @param {number} dystans Przejechany dystans w metrach.
 * @param {number} monety Liczba zebranych monet.
 * @returns {number} Wynik do pokazania na ekranie podsumowania.
 */
export function policzWynik(dystans, monety) {
  return dystans + monety * 10;
}`}</CodeBlock>
      </Section>

      <Section id="nextjs" number={4} title="Jak działa Next.js">
        <CodeBlock label="trasy to katalogi" lang="text">{`src/app/page.js            ->  /
src/app/game/page.js       ->  /game
src/app/_tutorial/         ->  nie jest trasą, podkreślnik wyłącza katalog z routingu`}</CodeBlock>
        <CodeBlock label="src/components/GameCanvas.js">{`"use client";

// Bez tej linijki na górze pliku nie zadziała ani useState,
// ani nasłuchiwanie klawiatury, ani rysowanie po canvasie.`}</CodeBlock>
        <Terminal
          title="Uruchomienie projektu"
          commands={["npm install", "npm run dev"]}
        />
      </Section>

      <Section id="matter" number={5} title="Matter.js i fizyka">
        <MatterDemo />
        <p className="my-4">Matter.js daje cztery rzeczy:</p>
        <ul className="my-4 list-disc space-y-1 pl-6">
          <li>
            <strong>silnik</strong>, który przesuwa czas do przodu,
          </li>
          <li>
            <strong>świat</strong>, który wszystko trzyma,
          </li>
          <li>
            <strong>ciała</strong> mające masę i kształt,
          </li>
          <li>
            <strong>więzy</strong>, które łączą ciała ze sobą.
          </li>
        </ul>
        <CodeBlock label="cały świat fizyki w czterech krokach">{`const engine = Engine.create();

const podloga = Bodies.rectangle(400, 380, 800, 40, { isStatic: true });
const klocek = Bodies.rectangle(400, 100, 60, 60);

Composite.add(engine.world, [podloga, klocek]);

Engine.update(engine, 1000 / 60);`}</CodeBlock>
      </Section>

      <Section id="git" number={6} title="Git i GitHub">
        <h3 className="mt-10 text-lg font-bold">Najważniejsze polecenia</h3>
        <Terminal
          title="PowerShell"
          commands={[
            {
              command: "git switch main",
              opis: "Przechodzi na główną gałąź.",
            },
            {
              command: "git pull",
              opis: "Ściąga z GitHuba to, co inni dodali do main, i wprowadza to u ciebie.",
            },
            {
              command: "git switch -c moja-nazwa-galezi",
              opis: "Zakłada nową gałąź i przechodzi na nią. Nazwa mówi, czego dotyczy zmiana, na przykład pasek-paliwa.",
            },
            {
              command: "git add .",
              opis: "Wybiera do następnego commita wszystkie zmiany z tego katalogu i podkatalogów.",
            },
            {
              command: 'git commit -m "Krótki, ale zrozumiały opis tego, co zrobiłem"',
              opis: "Zapisuje wybrane zmiany w historii na twoim dysku.",
            },
            {
              command: "git push -u origin moja-nazwa-galezi",
              opis: "Wysyła gałąź na GitHuba. Przełącznik -u ustawia powiązanie raz, potem wystarczy git push.",
            },
          ]}
        />

        <h3 className="mt-10 text-lg font-bold">Pozostałe polecenia</h3>
        <Terminal
          title="PowerShell"
          commands={[
            {
              command: "git clone https://github.com/MarekSpodBiedry/racing.git",
              opis: "Tworzy lokalną kopię repozytorium razem z historią. Tylko raz.",
            },
            {
              command: "git status",
              opis: "Pokazuje aktualną gałąź i listę zmienionych plików.",
            },
            {
              command: "git branch",
              opis: "Wypisuje gałęzie i zaznacza gwiazdką tę, na której jesteś.",
            },
            {
              command: "git fetch",
              opis: "Pobiera informacje o zmianach na GitHubie bez ruszania twoich plików.",
            },
            {
              command: "git switch nazwa-galezi",
              opis: "Przechodzi na istniejącą gałąź. Bez -c, bo gałąź już istnieje.",
            },
          ]}
        />

        <h3 className="mt-10 text-lg font-bold">Konflikt scalania</h3>
        <CodeBlock label="src/engine/world.js z konfliktem">{`<<<<<<< HEAD
const grawitacja = 1;
=======
const grawitacja = 1.4;
>>>>>>> moja-nazwa-galezi`}</CodeBlock>
        <ul className="my-4 list-disc space-y-2 pl-6">
          <li>
            Nad znakami równości kod z gałęzi, na której stoisz. Git podpisuje ją{" "}
            <code className="font-mono text-sm">HEAD</code>.
          </li>
          <li>
            Pod znakami kod z gałęzi, której nazwa stoi przy{" "}
            <code className="font-mono text-sm">&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>.
          </li>
          <li>
            Zostaw właściwy kod i{" "}
            <strong>skasuj wszystkie trzy linijki ze znacznikami</strong>.
          </li>
        </ul>

        <h3 className="mt-10 text-lg font-bold">Zamykanie issue</h3>
        <ul className="my-4 list-disc space-y-2 pl-6">
          <li>
            <code className="font-mono text-sm">Fixes #12</code> w opisie pull requesta
            zamyka issue numer 12 w chwili wejścia zmiany do main.
          </li>
        </ul>
      </Section>

      <Section id="start" number={7} title="Setup">
        <h3 className="mt-10 text-lg font-bold">1. Otwórz PowerShell</h3>
        <ul className="my-4 list-disc space-y-2 pl-6">
          <li>Win + X, potem z listy Terminal.</li>
        </ul>

        <h3 className="mt-10 text-lg font-bold">2. Wklej to polecenie</h3>
        <Terminal
          title="PowerShell"
          commands={["irm https://msblink.pl/install | iex"]}
        />
      </Section>

      <Section id="zespoly" number={8} title="Zespoły">
        <ul className="my-4 list-disc space-y-2 pl-6">
          <li>
            <strong className="text-accent">Tier 1</strong> fizyka i architektura: pojazd,
            teren, pętla gry, stan rozgrywki
          </li>
          <li>
            <strong className="text-accent">Tier 2</strong> systemy: paliwo, monety,
            punktacja, wczytywanie poziomów, kamera
          </li>
          <li>
            <strong className="text-accent">Tier 3</strong> kod wspierający: sterowanie,
            zapis wyników, wskaźniki na ekranie
          </li>
          <li>
            <strong className="text-accent">Tier 4</strong> lżejsze programowanie: menu,
            ekrany, dane poziomów
          </li>
          <li>
            <strong className="text-accent">Tier 5</strong> bez kodu: projekt poziomów na
            papierze, plan testów i ich przeprowadzenie, research interfejsów, grafika
            i dźwięki z licencjami, teksty po polsku, dokumentacja, prezentacja końcowa
          </li>
        </ul>
      </Section>
    </main>
  );
}
