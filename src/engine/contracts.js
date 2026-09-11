// Tier 1. Wspólne kontrakty danych. Każdy inny plik w projekcie opiera się na tych kształtach.
// Plik nie ma eksportów, więc typedefy widać wszędzie: piszemy /** @type {Level} */ bez importu.

/**
 * Punkt w świecie gry. Współrzędne podajemy w pikselach fizyki Matter.js.
 *
 * @typedef {Object} Vec2
 * @property {number} x Odległość w poziomie od początku układu.
 * @property {number} y Wysokość, im większa wartość, tym niżej na ekranie.
 */

/**
 * Jeden poziom gry, zapisany jako zwykły obiekt w katalogu levels.
 *
 * Tablica terrain to szkielet trasy. Punkty muszą być posortowane rosnąco po x
 * i nie mogą się powtarzać, bo generator terenu łączy je po kolei w jedną linię.
 * Wszystkie pozycje podajemy w tym samym układzie współrzędnych co spawn.
 *
 * @typedef {Object} Level
 * @property {string} id Identyfikator do zapisu wyników, na przykład "level-01". Nie zmieniamy go po opublikowaniu poziomu.
 * @property {string} name Nazwa pokazywana w menu, po polsku.
 * @property {Vec2[]} terrain Punkty trasy, minimum dwa, posortowane rosnąco po x.
 * @property {Vec2} spawn Miejsce, w którym pojawia się nadwozie pojazdu na starcie.
 * @property {Vec2[]} coins Pozycje monet do zebrania. Pusta tablica oznacza poziom bez monet.
 * @property {Vec2[]} fuelCans Pozycje kanistrów z paliwem.
 * @property {number} startFuel Paliwo na starcie, od 0 do 1.
 * @property {number} targetDistance Dystans w metrach, po którym poziom uznajemy za ukończony.
 */

/**
 * Etap, w którym znajduje się rozgrywka.
 *
 * @typedef {"menu" | "running" | "paused" | "finished"} RunPhase
 */

/**
 * Powód zakończenia przejazdu. Ekran podsumowania dobiera po nim tekst dla gracza.
 *
 * @typedef {"out_of_fuel" | "crashed" | "target_reached"} RunEndReason
 */

/**
 * Stan rozgrywki. Istnieje dokładnie jeden taki obiekt na przejazd.
 *
 * Może go modyfikować wyłącznie systems/gameState.js. Wszystkie pozostałe pliki,
 * w tym HUD i ekran podsumowania, tylko go czytają. Złamanie tej zasady kończy się błędami,
 * które ciężko debugować, bo tę samą wartość zmienia wtedy kilka miejsc naraz.
 *
 * @typedef {Object} GameState
 * @property {RunPhase} phase Etap rozgrywki.
 * @property {string} levelId Identyfikator aktualnie wczytanego poziomu.
 * @property {number} distance Najdalszy osiągnięty dystans w metrach. Cofnięcie się go nie zmniejsza.
 * @property {number} coins Liczba monet zebranych w tym przejeździe.
 * @property {number} fuel Stan paliwa, od 0 do 1.
 * @property {number} elapsed Czas przejazdu w sekundach.
 * @property {RunEndReason | null} endReason Powód zakończenia albo null, dopóki przejazd trwa.
 */

/**
 * Zestaw obiektów, które system dostaje raz, przy uruchomieniu.
 *
 * @typedef {Object} SystemContext
 * @property {import("matter-js").Engine} engine Silnik fizyki.
 * @property {import("matter-js").World} world Świat, do którego dodajemy ciała.
 * @property {Vehicle} vehicle Pojazd gracza.
 * @property {GameState} state Stan rozgrywki. Czytamy go, nie modyfikujemy.
 * @property {Level} level Wczytany poziom.
 */

/**
 * Pojazd gracza złożony z ciał Matter.js.
 *
 * @typedef {Object} Vehicle
 * @property {import("matter-js").Body} chassis Nadwozie. Po nim liczymy dystans i pozycję kamery.
 * @property {import("matter-js").Body} rearWheel Koło tylne, napędzane.
 * @property {import("matter-js").Body} frontWheel Koło przednie.
 * @property {import("matter-js").Constraint[]} suspension Więzy łączące koła z nadwoziem.
 */

/**
 * Sterowanie od gracza, z klawiatury albo z dotyku, przekazywane pojazdowi w każdej klatce.
 *
 * @typedef {Object} Controls
 * @property {number} throttle Gaz, od 0 do 1.
 * @property {number} brake Hamulec, od 0 do 1.
 */

/**
 * Wspólny kształt każdego systemu w katalogu systems.
 *
 * Kolejność wywołań w pętli gry jest zawsze taka sama: init raz na starcie przejazdu,
 * update w każdej klatce, reset przy restarcie poziomu. Metoda update nie może
 * zakładać, ile czasu minęło, dlatego dostaje dt w sekundach.
 *
 * @typedef {Object} System
 * @property {(ctx: SystemContext) => void} init Zapamiętuje kontekst i przygotowuje swoje dane.
 * @property {(dt: number) => void} update Jeden krok systemu, dt w sekundach.
 * @property {() => void} reset Przywraca system do stanu sprzed przejazdu.
 */

// Do napisania na lekcji: stałe RUN_PHASES i RUN_END_REASONS z dozwolonymi wartościami RunPhase i RunEndReason.
