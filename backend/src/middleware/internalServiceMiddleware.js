/**
 * Verifies requests to internal service-to-service routes (e.g. the
 * FastAPI -> Node webhook) using a shared secret header, since these
 * callers don't hold a parent's JWT.
 *
 * Set INTERNAL_SERVICE_KEY in .env and configure the FastAPI service to
 * send the same value in the "x-internal-service-key" header.
 */
const verifyInternalService = (req, res, next) => {
  const providedKey = req.headers["x-internal-service-key"];
  const expectedKey = process.env.INTERNAL_SERVICE_KEY;

  if (!expectedKey) {
    console.error(
      "INTERNAL_SERVICE_KEY is not set in the environment — refusing internal request."
    );
    return res.status(500).json({
      success: false,
      message: "Internal service authentication is not configured.",
    });
  }

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this internal route.",
    });
  }

  return next();
};

export { verifyInternalService };
