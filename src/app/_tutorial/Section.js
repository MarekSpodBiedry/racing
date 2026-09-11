/**
 * Jedna sekcja tutoriala: numer, tytuł i treść.
 *
 * @param {Object} props
 * @param {string} props.id Kotwica używana w spisie treści.
 * @param {number} props.number Numer sekcji widoczny obok tytułu.
 * @param {string} props.title Tytuł sekcji po polsku.
 * @param {React.ReactNode} [props.children] Treść sekcji.
 * @returns {React.JSX.Element} Sekcja gotowa do wstawienia na stronę.
 */
export function Section({ id, number, title, children }) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-rule py-14">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-mono text-2xl text-accent">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
