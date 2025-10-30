import { getLayoutsConfig } from "@@/utils/cache/local-storage"

/** 项目配置类型 */
export interface LayoutsConfig {
  /** 是否显示标签栏 */
  showTagsView: boolean
  /** 是否显示 Logo */
  showLogo: boolean
  /** 是否固定 Header */
  fixedHeader: boolean
  /** 是否显示页脚 */
  showFooter: boolean
  /** 是否显示消息通知 */
  showNotify: boolean
  /** 是否显示切换主题按钮 */
  showThemeSwitch: boolean
  /** 是否缓存标签栏 */
  cacheTagsView: boolean

}

/** 默认配置 */
const DEFAULT_CONFIG: LayoutsConfig = {
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  cacheTagsView: true
}

/** 项目配置 */
export const layoutsConfig: LayoutsConfig = { ...DEFAULT_CONFIG, ...getLayoutsConfig() }
