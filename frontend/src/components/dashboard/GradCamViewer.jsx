import { useState } from "react";

const GradCamViewer = ({ videoUrl, overlayUrl }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  if (!videoUrl) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-calm-100 text-sm text-calm-600">
        Video not available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <video src={videoUrl} controls className="w-full" />

        {showOverlay && overlayUrl && (
          <img
            src={overlayUrl}
            alt="Grad-CAM heatmap overlay highlighting regions the model focused on"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen"
          />
        )}
      </div>

      {overlayUrl && (
        <label className="flex items-center gap-2 text-sm text-calm-600">
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
            className="h-4 w-4 rounded border-calm-100 text-brand-600 focus:ring-brand-500"
          />
          Show heatmap overlay (highlights what the model focused on)
        </label>
      )}
    </div>
  );
};

export default GradCamViewer;
