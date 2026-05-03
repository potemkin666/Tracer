export const WEIGHTS = {
  titleExact: 3.2,
  snippetExact: 2.1,
  urlUsername: 2.0,
  multiSource: 1.4,
  archiveSource: 0.9,
  fossilTag: 1.5,
  timesliceTag: 0.8,
  documentTag: 1.1,
  socialTag: 1.0,
  profileTag: 0.9,
  lowRank: 0.6,
  allTokensPresent: 1.6,
  titlePartial: 0.5,
  snippetPartial: 0.4,
  bias: -2.0,
};

export function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

export function computeConfidence(features, weights = WEIGHTS) {
  let z = 0;
  for (const [feature, value] of Object.entries(features)) {
    z += (weights[feature] || 0) * value;
  }
  return sigmoid(z);
}

export function scoreResults(results, buildFeatures, weights = WEIGHTS) {
  return results
    .map((result) => {
      const features = buildFeatures(result);
      const confidence = computeConfidence(features, weights);
      return { ...result, score: Math.round(confidence * 100), confidence };
    })
    .sort((a, b) => b.confidence - a.confidence);
}
