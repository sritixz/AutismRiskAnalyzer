const Input = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-calm-800">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          rounded-xl border px-4 py-3 text-base text-calm-800
          placeholder:text-calm-600/60
          focus:outline-none focus:ring-2 focus:ring-brand-500
          ${error ? "border-red-500" : "border-calm-100"}
        `}
        {...rest}
      />

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
