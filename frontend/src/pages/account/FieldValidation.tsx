export type Field = { value: string; valid: boolean; touched: boolean };


export function ValidatedInput( {placeholder, type = "text", field, onChange, title}: {
  placeholder: string; type?: string; field: Field; onChange: (v: string) => void; title:string; }) {
  return (
    <div className="relative mb-2">
      <input
        type={type}
        placeholder={placeholder}
        title={title}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-100 hover:bg-stone-200 focus:bg-stone-200 rounded-md px-3 py-2.5 pr-8 text-sm text-stone-800 placeholder-stone-400 outline-none transition-colors font-mono border-0"
      />
      {field.touched && field.valid && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 flex items-center">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>
  );
}