// 发布时使用的插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  // 发布时清除所有console.log函数
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-plus",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins
  ],

}