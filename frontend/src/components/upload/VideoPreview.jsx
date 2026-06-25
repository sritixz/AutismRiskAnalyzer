import { formatFileSize } from "../../utils/formatters";

const VideoPreview = ({ file, onRemove, disabled }) => {
  if (!file) return null;

  const videoUrl = URL.createObjectURL(file);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-calm-100 p-4">
      <video
        src={videoUrl}
        className="h-16 w-24 rounded-lg bg-calm-100 object-cover"
        muted
      />

      <div className="flex-1">
        <p className="truncate text-sm font-medium text-calm-800">
          {file.name}
        </p>
        <p className="text-xs text-calm-600">{formatFileSize(file.size)}</p>
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default VideoPreview;
