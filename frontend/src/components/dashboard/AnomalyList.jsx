// Maps backend anomaly codes to parent-friendly readable text.
// Extend this as the ML service defines more anomaly categories.
const ANOMALY_LABELS = {
  repetitive_motor: "Repetitive movements",
  reduced_eye_contact: "Reduced eye contact",
  delayed_response_to_name: "Delayed response when name is called",
  limited_social_smiling: "Limited social smiling",
  atypical_play_patterns: "Atypical play patterns",
};

const AnomalyList = ({ anomalies }) => {
  if (!anomalies || anomalies.length === 0) {
    return (
      <p className="text-sm text-calm-600">
        No specific behavioral patterns were flagged in this video.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {anomalies.map((code) => (
        <li
          key={code}
          className="flex items-center gap-2 rounded-lg bg-calm-50 px-3 py-2 text-sm text-calm-800"
        >
          <span
            className="h-2 w-2 rounded-full bg-concern-moderate"
            aria-hidden="true"
          />
          {ANOMALY_LABELS[code] || code.replaceAll("_", " ")}
        </li>
      ))}
    </ul>
  );
};

export default AnomalyList;
