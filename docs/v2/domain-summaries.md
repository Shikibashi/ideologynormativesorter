# v2 domain summaries

Domain summaries are downstream presentation data. They include the constructs
assigned explicitly to each canonical domain, scored and abstained counts,
weighted evidence accounting, and related divergence IDs.

Coverage is recomputed as:

`sum(answeredEligibleWeight) / sum(totalEligibleWeight)`

This avoids averaging construct percentages with unequal denominators. The
optional `diagnosticMean` is the arithmetic mean of scored construct values and
is explicitly marked `diagnosticMeanIsNotAScore: true`. It never becomes a
profile input, modifier input, specialist input, or latent-variable estimate.
