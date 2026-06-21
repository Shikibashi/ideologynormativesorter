import type { FactionModule, LabelMatch } from '../types'

/**
 * Suggests depth modules whose triggerLabelIds overlap the respondent's
 * nearest labels, so the base quiz doesn't have to ask every module's
 * questions up front.
 */
export function suggestModules(nearestLabels: LabelMatch[], modules: FactionModule[], excludeModuleIds: Set<string> = new Set()): FactionModule[] {
  const nearestIds = new Set(nearestLabels.map((match) => match.labelId))
  return modules.filter((module) => !excludeModuleIds.has(module.id) && module.triggerLabelIds.some((id) => nearestIds.has(id)))
}
