import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { FunctionalComponent } from 'vue'

export function getIcon(name?: string): FunctionalComponent | undefined {
  if (!name) return undefined
  const icon = ElementPlusIconsVue[name as keyof typeof ElementPlusIconsVue]
  return icon as unknown as FunctionalComponent
}