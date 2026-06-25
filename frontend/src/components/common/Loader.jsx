const Loader = ({ label = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-8"
    >
      <span
        className={`animate-spin rounded-full border-brand-200 border-t-brand-600 ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className="text-sm text-calm-600">{label}</span>
    </div>
  );
};

export default Loader;
