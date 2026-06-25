const RiskCard = ({ title, label, colorVar, percent, description }) => {
  return (
    <div className="rounded-2xl border border-calm-100 p-6">
      <h3 className="text-sm font-medium uppercase tracking-wide text-calm-600">
        {title}
      </h3>

      <p
        className="mt-2 text-2xl font-semibold"
        style={{ color: colorVar }}
      >
        {label}
      </p>

      {percent !== null && percent !== undefined && (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-calm-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: colorVar }}
          />
        </div>
      )}

      {description && (
        <p className="mt-3 text-sm text-calm-600">{description}</p>
      )}
    </div>
  );
};

export default RiskCard;
