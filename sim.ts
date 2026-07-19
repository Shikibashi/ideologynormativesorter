import { allCalibrationFixtures } from './src/scoring/calibration.fixtures'
import { computeScoreBreakdown, computeLabelMatches } from './src/scoring'
import { questions } from './src/data/questions'
import { labels } from './src/data/labels'
import { axes } from './src/data/axes'

let exact = 0;
let total = 0;
for (const fixture of allCalibrationFixtures) {
    total++;
    const score = computeScoreBreakdown(questions, fixture.answers, axes);
    const matches = computeLabelMatches(score, labels);
    if (!matches || matches.length === 0) continue;
    
    const targetLabelId = fixture.expectedLabelIds[0];
    
    if (matches[0].labelId === targetLabelId) {
        exact++;
    } else {
        const topFit = matches[0].fit;
        const expectedFit = matches.find(m => m.labelId === targetLabelId)?.fit ?? 0;
        console.log(`Expected ${targetLabelId} but got ${matches[0].labelId} (diff: ${(topFit - expectedFit).toFixed(4)})`);
    }
}
console.log(`Exact Matches: ${exact}/${total}`);
console.log(`Misses: ${total - exact}`);
