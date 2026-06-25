import GradCamViewer from "./GradCamViewer";
import AnomalyList from "./AnomalyList";
import { formatAiRiskScore } from "../../utils/formatters";
import { PROCESSING_STATUS } from "../../utils/constants";

const VideoAnalysisPanel = ({ videoMetadata, results }) => {
  const status = videoMetadata?.processingStatus;

  if (status === PROCESSING_STATUS.PENDING || status === PROCESSING_STATUS.PROCESSING) {
    return (
      <div className="rounded-2xl border border-calm-100 p-6 text-center">
        <p className="font-medium text-calm-800">
          Your video is still being analyzed
        </p>
        <p className="mt-1 text-sm text-calm-600">
          This usually takes a few minutes. Feel free to check back shortly.
        </p>
      </div>
    );
  }

  if (status === PROCESSING_STATUS.FAILED) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">
          We weren't able to analyze this video
        </p>
        <p className="mt-1 text-sm text-red-600">
          Please try uploading it again, or reach out if the problem
          continues.
        </p>
      </div>
    );
  }

  const { label } = formatAiRiskScore(results?.aiRiskScore);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-calm-100 p-6">
      <h3 className="text-lg font-semibold text-calm-800">
        Behavioral Video Breakdown
      </h3>

      <GradCamViewer
        videoUrl={videoMetadata?.storageUrl}
        overlayUrl={results?.gradCamOverlayUrl}
      />

      <div>
        <h4 className="text-sm font-medium uppercase tracking-wide text-calm-600">
          What we observed
        </h4>
        <p className="mt-2 text-calm-800">
          {results?.summaryMessage ||
            `Overall assessment: ${label}. A detailed summary will appear here once analysis is complete.`}
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium uppercase tracking-wide text-calm-600">
          Specific patterns noted
        </h4>
        <div className="mt-2">
          <AnomalyList anomalies={results?.detectedAnomalies} />
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisPanel;
