import RiskCard from "./RiskCard";
import {
  formatQuestionnaireRiskBand,
  formatAiRiskScore,
} from "../../utils/formatters";

const ResultsSummary = ({ totalScore, aiRiskScore }) => {
  const questionnaireBand = formatQuestionnaireRiskBand(totalScore);
  const aiBand = formatAiRiskScore(aiRiskScore);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RiskCard
        title="Daily Observations (Form Responses)"
        label={questionnaireBand.label}
        colorVar={questionnaireBand.colorVar}
        percent={
          totalScore !== null && totalScore !== undefined
            ? Math.round((totalScore / 20) * 100)
            : null
        }
        description={
          totalScore !== null
            ? `Score: ${totalScore} out of 20`
            : "Awaiting questionnaire submission"
        }
      />

      <RiskCard
        title="Behavioral Video Breakdown"
        label={aiBand.label}
        colorVar={
          aiBand.percent === null
            ? "var(--color-calm-600)"
            : aiRiskScore > 0.66
            ? "var(--color-concern-elevated)"
            : aiRiskScore > 0.33
            ? "var(--color-concern-moderate)"
            : "var(--color-concern-low)"
        }
        percent={aiBand.percent}
        description={
          aiBand.percent !== null
            ? "Based on multi-modal video analysis"
            : "Awaiting video analysis"
        }
      />
    </div>
  );
};

export default ResultsSummary;
