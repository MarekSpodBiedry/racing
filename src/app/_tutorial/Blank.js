/**
 * Puste miejsce na tekst, który autor projektu dopisuje przed lekcją.
 *
 * Dopóki w środku nic nie ma, na stronie widać przerywaną ramkę z podpisem.
 * Ramka znika sama, gdy tylko pojawi się jakakolwiek treść.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] Tekst sekcji.
 * @returns {React.JSX.Element} Blok treści albo widoczne puste miejsce.
 */
export function Blank({ children }) {
  return <div className="tresc space-y-4 leading-relaxed">{children}</div>;
}
