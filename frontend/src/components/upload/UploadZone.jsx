import { useRef, useState } from "react";
import { UPLOAD_CONSTRAINTS } from "../../utils/constants";

const UploadZone = ({ onFileSelected, error }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelected(droppedFile);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelected(selected);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors
          ${
            isDragging
              ? "border-brand-500 bg-brand-50"
              : "border-calm-100 hover:border-brand-300"
          }
          ${error ? "border-red-400" : ""}
        `}
      >
        <svg
          className="h-10 w-10 text-brand-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5"
          />
        </svg>

        <p className="font-medium text-calm-800">
          Drag and drop your video here, or click to browse
        </p>
        <p className="text-sm text-calm-600">
          MP4 or MOV, up to{" "}
          {Math.round(UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_BYTES / (1024 * 1024))}
          MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default UploadZone;
