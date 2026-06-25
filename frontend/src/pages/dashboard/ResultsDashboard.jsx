import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import * as screeningApi from "../../api/screeningApi";
import ResultsSummary from "../../components/dashboard/ResultsSummary";
import VideoAnalysisPanel from "../../components/dashboard/VideoAnalysisPanel";
import Loader from "../../components/common/Loader";
import { PROCESSING_STATUS, ROUTES } from "../../utils/constants";

const POLL_INTERVAL_MS = 10000;

const ResultsDashboard = () => {
  const { screeningId } = useParams();
  const [screening, setScreening] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  const fetchScreening = useCallback(async () => {
    try {
      const response = await screeningApi.getScreeningById(screeningId);
      setScreening(response.data.screening);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't load this screening. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [screeningId]);

  useEffect(() => {
    fetchScreening();
  }, [fetchScreening]);

  // Poll while the video is still being processed, since results arrive
  // asynchronously via the FastAPI -> Express webhook, not as part of
  // any request the frontend makes directly.
  useEffect(() => {
    const status = screening?.videoMetadata?.processingStatus;
    const isPending =
      status === PROCESSING_STATUS.PENDING ||
      status === PROCESSING_STATUS.PROCESSING;

    if (isPending) {
      pollRef.current = setInterval(fetchScreening, POLL_INTERVAL_MS);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [screening?.videoMetadata?.processingStatus, fetchScreening]);

  if (isLoading) {
    return <Loader label="Loading your results..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-calm-800">{error}</p>
        <Link
          to={ROUTES.HOME}
          className="mt-4 inline-block text-brand-600 hover:text-brand-700"
        >
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-calm-800">
        Screening Results
      </h1>
      <p className="mt-1 text-calm-600">
        Here's what we found, broken down by source — remember, this is a
        screening, not a diagnosis.
      </p>

      <div className="mt-8">
        <ResultsSummary
          totalScore={screening?.questionnaireAnswers?.totalScore}
          aiRiskScore={screening?.results?.aiRiskScore}
        />
      </div>

      <div className="mt-8">
        <VideoAnalysisPanel
          videoMetadata={screening?.videoMetadata}
          results={screening?.results}
        />
      </div>
    </div>
  );
};

export default ResultsDashboard;
