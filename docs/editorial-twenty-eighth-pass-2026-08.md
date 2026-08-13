# Twenty-eighth editorial pass — 2026-08

Date: 2026-08-13
Editorial version: `2026-08-editorial-v28`
Question-context version: `2026-08-question-context-v31`

This pass resolves the two remaining active prompts whose context records
identified multiple institutional constructs in one response. It changes
wording and explanatory context only; IDs, layers, response types, tiers, and
axis mappings remain unchanged.

## `q0081` — freedom of association and collective bargaining

The previous prompt grouped organizing, refusing work, bargaining, exit,
starting a rival firm, and legal favoritism. The new prompt is:

> Workers should be free to form organizations of their choice and bargain collectively without legal favoritism.

This is a narrower labor-rights claim. Refusal of particular work, exit from
employment, competitive entry, union recognition, strike rules, and employer
property remain distinct questions. The [ILO freedom-of-association
overview](https://www.ilo.org/topics-and-sectors/freedom-association) and
[collective-bargaining guidance](https://www.ilo.org/topics-and-sectors/collective-bargaining-and-labour-relations)
provide institutional context; they do not determine the respondent’s
normative answer.

## `q0411` — worker-council production governance

The previous prompt combined workplace councils, neighborhood councils,
territorial federation, party organization, and transition strategy. The new
prompt is:

> Production in a post-capitalist economy should be governed through federated workers’ councils rather than a party-state bureaucracy.

This isolates a proposed arrangement for governing production. Neighborhood
assemblies, confederal territorial administration, transition sequencing, and
the empirical performance of councils remain separate questions. [Employee
Governance and the Ownership of the Firm](https://www.cambridge.org/core/journals/business-ethics-quarterly/article/abs/employee-governance-and-the-ownership-of-the-firm/F95BA42AF5F782A9BC16FC96FF6375F1)
supports distinguishing workplace participation from ownership, while
[Democratic Confederalism](https://www.uplopen.com/books/m/10.1515/9783839472736)
frames territorial and confederal governance as a separate institutional
dimension.

## Review status

Regression tests assert that both items remain in their original layer and
that score fields are preserved. The source overlay is versioned separately as
`2026-08-question-context-v31`.
