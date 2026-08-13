# Sensitive compound output boundary — 2026-08

Status: implemented taxonomy and research-contract safeguard; not respondent validation.

## Decision

The ordinary result can report only broad primary families and cross-cutting
modifiers for which the core instrument contains an appropriately direct
construct. It must not infer a historically specific or compound ideology from
nearby authority, nationalism, religious, welfare, or ecological answers.

Accordingly, Fascism, Welfare Chauvinism, Eco-Authoritarianism, Religious
Nationalism, and Theocratic Politics are no longer ordinary primary or modifier
outputs. They remain browseable, sourced catalog entries. Religious Nationalism
and Theocratic Politics may appear only as explicitly experimental results in
the opt-in religious-national module: the former requires direct
`religious-national-fusion`, while the latter requires two direct responses on
final religious legal authority. The other three await a dedicated
construct-matched module.

## Constitutive boundaries

| Catalog label               | Why a nearby core profile is not enough                                                                                                                                                | Required construct before a result can be shown                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Fascism                     | Authoritarianism, nationalism, militarism, and traditionalism do not by themselves establish the palingenetic, revolutionary ultranationalism used in influential fascism scholarship. | National-rebirth myth plus fascist mass-mobilization or revolutionary project.                                               |
| Welfare Chauvinism          | National attachment plus support for welfare spending does not show who should receive welfare or public services.                                                                     | A named in-group/out-group boundary for welfare or service access, with conditional-access variants assessed separately.     |
| Eco-Authoritarianism        | Ecological concern, state capacity, or expert confidence does not itself show willingness to override rights or democratic constraints for ecological enforcement.                     | Ecological enforcement specifically preferred over ordinary democratic or rights constraints.                                |
| Religious Nationalism       | Religiosity plus nationalism does not establish that religious and national identities/goals are fused.                                                                                | Direct religious-national fusion, now measured by `fm-rn-3` in the opt-in module.                                            |
| Theocratic Politics         | Religiosity, moral traditionalism, a state religion, religious parties, or statutory accommodation do not establish who has final authority over civil-law legitimacy.                 | Direct support for final religious legal authority, assessed independently by `fm-rn-2` and `fm-rn-11` in the opt-in module. |
| Christian Reconstructionism | Generic religious authority does not establish Reconstructionist theonomy or biblical civil-law claims.                                                                                | Theonomic biblical civil-law authority, separately tested from general religious influence.                                  |
| Fundamentalist theocracy    | Generic religious authority does not establish literalist or fundamentalist scriptural authority in coercive law.                                                                      | Literalist or fundamentalist scriptural authority in coercive law.                                                           |

The fascism boundary follows scholarship that treats a palingenetic
revolutionary impulse as an ineliminable fascist core, rather than a synonym for
generic authoritarian nationalism. [Cambridge, “Studying Fascism
transculturally”](https://www.cambridge.org/core/journals/modern-italy/article/studying-fascism-transculturally-italian-scholarship-in-the-international-arena/837019BDCCD3C0A019C8461E9C84718A)

The welfare boundary follows research defining welfare chauvinism around
restricting welfare access to an in-group, normally nationality or ethnicity,
and distinguishes related welfare-nationalist and welfare-ethnocentric logics.
[Oxford Review of Economic Policy, “Immigration and the welfare
state”](https://academic.oup.com/oxrep/article/41/1/64/8157933), [Policy and
Society, “Welfare chauvinism in divided
societies”](https://academic.oup.com/policyandsociety/article/45/3/343/8304391)

The religious-national boundary follows the definition of religious nationalism
as a fusion of religious and national identities and goals, not a simple sum of
religiosity and national attachment. [Oxford Research Encyclopedia, “Religious
Nationalism and Religious
Influence”](https://academic.oup.com/edited-volume/62239/chapter-abstract/550810397)

The theocratic boundary treats final civil-law authority as distinct from the
many possible state-religion arrangements. Oxford's account of secularism maps
religion's relation to state ends, institutions, law, legitimacy, power, and
jurisdiction rather than treating public religion as one undifferentiated
condition; this supports the narrow direct-authority construct used here.
[Oxford Research Encyclopedia, “Secularism in Political
Philosophy”](https://academic.oup.com/edited-volume/62239/chapter-abstract/550724223)
Cambridge's case-specific study further cautions against assuming that every
theocratic claim has one clerical institutional template. [Cambridge,
_Maimonides and Jewish
Theocracy_](https://www.cambridge.org/core/elements/maimonides-and-jewish-theocracy/1A7AC0AD5F5048F1CA3690BC9FB97D99)

The ecological boundary follows scholarship that frames eco-authoritarianism
around claims that democracy or rights constraints should yield in response to
ecological crisis. [Cambridge, _Transition
Imaginaries_](https://www.cambridge.org/core/elements/transition-imaginaries/61167AF793A1F7E7C73BCA8C5CDB7C73), [Mittiga, “Political Legitimacy,
Authoritarianism, and Climate
Change”](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/E7391723A7E02FA6D536AC168377D2DE/S0003055421001301a.pdf/political_legitimacy_authoritarianism_and_climate_change.pdf)

For Christian Reconstructionism, Oxford’s account identifies theonomy and
submission to biblical law as central to the movement, which is much narrower
than generic support for religious influence in public life. [Oxford Handbook,
“The Christian Reconstruction Movement in U.S.
Politics”](https://academic.oup.com/edited-volume/41330/chapter/352334811)

## Product and research behavior

- `computeLabelMatches` and modifier scoring cannot return the five ordinary
  outputs listed above.
- The specialist registry documents their required constructs and keeps
  Fascism, Welfare Chauvinism, and Eco-Authoritarianism provisional and
  unmapped.
- The religious-national module may compare Religious Nationalism only when the
  direct fusion gate is met; its card remains experimental and evidence-aware.
- The same module may compare Theocratic Politics only when both
  final-religious-legal-authority items are answered and its direct gate is
  met; the card remains an experimental family-level affinity, not a claim
  about a religion, clerical office, constitutional form, or minority rights.
- Christian Reconstructionism and Fundamentalist Theocracy have been withdrawn
  from the current module’s candidate list rather than inferred from a broad
  religious-authority question.

## Cohort migration

This change starts `community-2026-v3` with research schema `2026-08-v13`,
taxonomy `2026-08-taxonomy-v11`, scoring `2026-08-13-taxonomy-v6`, question
context `2026-08-question-context-v33`, and experimental specialist version
`2026-08-specialist-v10`. The older `community-2026` and
`community-2026-v2` records remain historical; analyses must not pool cohorts
without a preregistered linking decision.

## Next gate

Before any presently withheld label can be shown, add separately reviewed
items for each row’s required construct, conduct cognitive interviews and a
false-positive review, freeze a new opt-in module version, and evaluate
coverage, internal structure, test-retest behavior, and criterion separation
with consented respondent data.
