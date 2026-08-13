# Related-tradition expansion — August 2026

## Research answer

### Finding

The scored catalog is already broad enough that adding synthetic global-axis centroids would create more apparent precision than the current evidence supports. The safer breadth gap is the public related-tradition registry: it previously exposed four socialist candidates and Radical Feminism, but omitted two traditions already covered by a focused module and lacked a broad name for the market-oriented libertarian family.

This pass adds three source-backed, non-scored entries:

- **Right-Libertarianism** is placed in the `liberal` family as a property-and-state lineage. Market-anarchist specialist entries are placed in the `anarchist` family instead; the distinction avoids treating market anarchism as synonymous with right-libertarianism.
- **Black Nationalism** is represented once at the public label level while its focused module preserves community-nationalist and separatist variants. It is not derived from the generic Ethnonationalist centroid.
- **Pan-Africanism** remains distinct from Black separatism and is described as a plural tradition spanning transnational solidarity, African unity, sovereignty-centered projects, and nativist variants.

### Sources checked

- Stanford Encyclopedia of Philosophy, “Libertarianism”: https://plato.stanford.edu/entries/libertarianism/
- Stanford Encyclopedia of Philosophy, “Liberalism”: https://plato.stanford.edu/entries/liberalism/
- Robert A. Brown and Todd C. Shaw, “Separate Nations: Two Attitudinal Dimensions of Black Nationalism,” *The Journal of Politics* 64(1), 2002: https://onlinelibrary.wiley.com/doi/abs/10.1111/1468-2508.00116
- Andrew Valls, “A Liberal Defense of Black Nationalism,” *American Political Science Review* 104(3), 2010: https://www.cambridge.org/core/journals/american-political-science-review/article/abs/liberal-defense-of-black-nationalism/5B5E6442E55A8A10342A0D43BDEFC47B
- Lester K. Spence, Todd C. Shaw, and Robert A. Brown, “True to Our Native Land: Distinguishing Attitudinal Support for Pan-Africanism from Black Separatism,” *Du Bois Review*, 2005: https://www.cambridge.org/core/journals/du-bois-review-social-science-research-on-race/article/true-to-our-native-land-distinguishing-attitudinal-support-for-panafricanism-from-black-separatism/2378116FD1172FA43A339347603DCB11
- Rita Abrahamsen, “Internationalists, sovereigntists, nativists: Contending visions of world order in Pan-Africanism,” *Review of International Studies* 46(1), 2020: https://www.cambridge.org/core/journals/review-of-international-studies/article/abs/internationalists-sovereigntists-nativists-contending-visions-of-world-order-in-panafricanism/85ED07FAA4CCB08F6CDB2A532437B3E2

### Current version and date sensitivity

The source claims concern durable intellectual traditions rather than current party platforms. The Stanford entries were checked in August 2026, and the journal sources are stable works of political theory or empirical ideology research. Later respondent evidence could change the product role or wording, but not the reason these names are historically meaningful.

### Recommendation

Keep these entries searchable and clearly marked as either “not ranked by the general quiz” or “focused follow-up available.” Do not promote them into primary scoring until the relevant constructs separate reliably and the result copy remains intelligible across normative, descriptive, and prescriptive layers.

### Implementation implications

- The related-tradition status now distinguishes catalog-only candidates from candidates with a focused follow-up.
- Black Nationalism and Pan-Africanism point to the existing identity-sovereignty measurement surface.
- Right-Libertarianism adds an umbrella search result without duplicating Minarchism, Georgist Libertarianism, or other scored/specialist profiles; Anarcho-Capitalism and Agorism remain visible as anarchist specialists with explicit boundary notes.
- No label ID in `src/data/labels.ts`, global centroid, axis weight, or primary scoring pool changed.

### Uncertainties

- “Libertarianism” remains historically and internationally polysemous; the qualified display name is therefore intentional.
- Black Nationalism has meaningful internal variants, so one public umbrella description should not be read as doctrinal uniformity.
- Pan-Africanism may ultimately behave as a specialist ideology, cross-cutting modifier, or broader family orientation. Its current status stays provisional.
