import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multi?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  multi = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (value: string) => {
    if (multi) {
      const next = selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value];
      onChange(next);
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-border-primary bg-bg-secondary hover:bg-bg-tertiary text-text-primary transition-colors cursor-pointer"
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-accent-blue/20 text-accent-blue text-xs px-1.5 py-0.5 rounded-full font-medium">
            {selected.length}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 rounded-lg border border-border-primary bg-bg-secondary shadow-xl animate-fade-in">
          <div className="py-1 max-h-56 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg-tertiary transition-colors text-left cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    selected.includes(opt.value)
                      ? 'bg-accent-blue border-accent-blue'
                      : 'border-border-secondary'
                  }`}
                >
                  {selected.includes(opt.value) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
