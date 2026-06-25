const UploadProgress = ({ progress, isComplete }) => {
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs font-medium text-calm-600">
        <span>{isComplete ? "Upload complete" : "Uploading..."}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-calm-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete ? "bg-concern-low" : "bg-brand-500"
          }`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default UploadProgress;
