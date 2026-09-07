import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FilterPill.css';

// "Organización" y "organizacion" deben coincidir: se quitan tildes y mayúsculas
// antes de comparar.
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function FilterPill({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Cerrar el menú al hacer clic fuera de la pill o al presionar Escape.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Al abrir, el cursor ya queda en el campo de búsqueda: se puede escribir
  // sin tener que hacer un clic extra.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const selected = options.find((option) => option.value === value);
  const isFiltering = value !== null;

  const resetOption = options.find((option) => option.value === null);
  const selectableOptions = options.filter((option) => option.value !== null);
  const matches = query
    ? selectableOptions.filter((option) => normalize(option.label).includes(normalize(query)))
    : selectableOptions;

  function toggle() {
    setQuery('');
    setOpen((previous) => !previous);
  }

  function select(optionValue) {
    onChange(optionValue);
    setQuery('');
    setOpen(false);
  }

  function handleSearchKeyDown(event) {
    // Enter elige la primera coincidencia, sin tener que soltar el teclado.
    if (event.key === 'Enter' && matches.length > 0) {
      event.preventDefault();
      select(matches[0].value);
    }
  }

  return (
    <div className="filter-pill" ref={containerRef}>
      <button
        type="button"
        className={`filter-pill-button ${isFiltering ? 'filter-pill-button--active' : ''}`}
        onClick={toggle}
        aria-expanded={open}
      >
        <span>
          {label}: {selected?.label ?? 'todos'}
        </span>
        <ChevronDown size={12} strokeWidth={2.6} />
      </button>

      {open && (
        <div className="filter-pill-menu">
          <input
            ref={inputRef}
            type="text"
            className="filter-pill-search"
            placeholder="Escribí para filtrar…"
            aria-label={`Buscar ${label.toLowerCase()}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />

          <ul className="filter-pill-options">
            {resetOption && (
              <li>
                <button
                  type="button"
                  className={value === null ? 'is-selected' : ''}
                  onClick={() => select(null)}
                >
                  {resetOption.label}
                </button>
              </li>
            )}

            {matches.map((option) => (
              <li key={String(option.value)}>
                <button
                  type="button"
                  className={option.value === value ? 'is-selected' : ''}
                  onClick={() => select(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}

            {matches.length === 0 && <li className="filter-pill-empty">Sin coincidencias</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FilterPill;
