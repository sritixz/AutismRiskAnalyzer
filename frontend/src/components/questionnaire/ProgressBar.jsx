const ProgressBar = ({ current, total }) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs font-medium text-calm-600">
        <span>
          Question {current} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-calm-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
