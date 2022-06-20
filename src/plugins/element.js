import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElContainer,
  ElHeader,
  ElMain,
  ElAside,
  ElSubmenu,
  ElMenu,
  ElMenuItem,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElTooltip,
  ElPagination,
  ElDialog,
  ElMessageBox,
  ElTag,
  ElTree,
  ElPopconfirm,
  ElSelect,
  ElOption,
  ElCascader,
  ElAlert,
  ElTabs,
  ElTabPane,
  ElSteps,
  ElStep,
  ElCheckboxGroup,
  ElCheckbox,
  ElUpload,
  ElTimeline,
  ElTimelineItem,
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

export default (app) => {
  locale.use(lang)
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElMain)
  app.use(ElAside)
  app.use(ElSubmenu)
  app.use(ElMenu)
  app.use(ElMenuItem)
  app.use(ElBreadcrumb)
  app.use(ElBreadcrumbItem)
  app.use(ElCard)
  app.use(ElRow)
  app.use(ElCol)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElSwitch)
  app.use(ElTooltip)
  app.use(ElPagination)
  app.use(ElDialog)
  app.use(ElTag)
  app.use(ElTree)
  app.use(ElPopconfirm)
  app.use(ElSelect)
  app.use(ElOption)
  app.use(ElCascader)
  app.use(ElAlert)
  app.use(ElTabs)
  app.use(ElTabPane)
  app.use(ElSteps)
  app.use(ElStep)
  app.use(ElCheckboxGroup)
  app.use(ElCheckbox)
  app.use(ElUpload)
  app.use(ElTimeline)
  app.use(ElTimelineItem)
  // 将ElMessage挂载到全局
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$confirm = ElMessageBox
}