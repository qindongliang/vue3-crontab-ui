# Vue3 Crontab UI

<div align="center">

![Vue 3](https://img.shields.io/badge/Vue-3.4.21-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-5.2.8-blue.svg)
![View UI Plus](https://img.shields.io/badge/View%20UI%20Plus-1.3.15-1890ff.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

基于 Vue 3 + View UI Plus 的功能强大 CRONTAB 表达式可视化编辑器

</div>

## ✨ 功能特性

### 🎯 核心功能
- ✅ **完整的 7 位 CRONTAB 表达式支持**（秒 分 时 日 月 周 年）
- ✅ **可视化编辑界面**：直观的 Tab 页面操作
- ✅ **多种操作模式**：每单位、周期、间隔、指定值、不指定
- ✅ **实时表达式预览**：即时显示当前表达式
- ✅ **常用表达式快速选择**：20+ 预设常用模板

### 🛠️ 高级功能
- ✅ **起止时间选择器**：支持任务执行时间范围设置
- ✅ **日期星期特殊处理**：L、W、# 等特殊字符支持
- ✅ **智能默认值**：不同时间单位的合理默认设置
- ✅ **完全的 TypeScript 支持**：类型安全和智能提示
- ✅ **Vue 3 组合式 API**：现代化的开发体验

### 🎨 用户体验
- ✅ **响应式设计**：适配各种屏幕尺寸
- ✅ **中文本地化**：完整的中文界面
- ✅ **键盘友好**：支持键盘导航操作
- ✅ **错误处理**：表达式验证和错误提示

## 🚀 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Vue** | 3.4.21 | 渐进式 JavaScript 框架 |
| **Vite** | 5.2.8 | 现代化的前端构建工具 |
| **View UI Plus** | 1.3.15 | 企业级 Vue 3 UI 组件库 |
| **TypeScript** | 5.4.0 | JavaScript 的超集，提供类型安全 |
| **Day.js** | 1.11.18 | 轻量级日期时间处理库 |

## 📦 安装和使用

### 基础用法

```vue
<template>
  <div class="demo">
    <CrontabEditor
      v-model="crontabValue"
      placeholder="请选择 CRONTAB 表达式"
      @change="handleCrontabChange"
    />

    <div class="result">
      <p>当前表达式：{{ crontabValue }}</p>
      <p v-if="dateRange">执行时间：{{ dateRange[0] }} 到 {{ dateRange[1] }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { CrontabEditor } from '@/components/crontab'

const crontabValue = ref('0 0 * * * ? *') // 默认每小时执行
const dateRange = ref<string[]>()

const handleCrontabChange = (data: { cron: string; dateRange?: (Date | null)[] | undefined }) => {
  crontabValue.value = data.cron

  // 处理时间范围
  if (data.dateRange && data.dateRange[0] && data.dateRange[1]) {
    dateRange.value = [
      dayjs(data.dateRange[0]).format("YYYY-MM-DD HH:mm:ss"),
      dayjs(data.dateRange[1]).format("YYYY-MM-DD HH:mm:ss")
    ]
  }

  console.log('CRONTAB 表达式:', data.cron)
  console.log('时间范围:', dateRange.value)
}
</script>

<style scoped>
.demo {
  padding: 20px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-family: monospace;
}
</style>
```

### 高级用法

```vue
<template>
  <CrontabEditor
    v-model="advancedCrontab"
    :disabled="isDisabled"
    placeholder="高级 CRONTAB 表达式"
    @change="onAdvancedChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CrontabEditor } from '@/components/crontab'

const advancedCrontab = ref('0 0 0 ? * MON *') // 每周一执行
const isDisabled = ref(false)

const onAdvancedChange = (data) => {
  // 处理复杂的业务逻辑
  console.log('表达式变更:', data)

  // 可以在这里添加表达式验证
  if (!validateExpression(data.cron)) {
    console.error('无效的 CRONTAB 表达式')
    return
  }

  // 保存到后端或其他处理
  saveCrontabExpression(data)
}

const validateExpression = (expr: string): boolean => {
  // 自定义验证逻辑
  return true
}

const saveCrontabExpression = async (data: any) => {
  // 异步保存逻辑
  try {
    await api.saveCrontab(data)
    console.log('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
  }
}
</script>
```

## 📖 API 文档

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `modelValue` | `string` | `'0 0 * * * ? *'` | CRONTAB 表达式值（双向绑定） |
| `disabled` | `boolean` | `false` | 是否禁用组件 |
| `placeholder` | `string` | `'请选择 CRONTAB 表达式'` | 输入框占位符 |

### Events

| 事件名 | 参数类型 | 说明 |
|--------|----------|------|
| `update:modelValue` | `(value: string)` | 表达式值更新时触发（v-model） |
| `change` | `{ cron: string; dateRange?: (Date \| null)[] \| undefined }` | 用户确认表达式变更时触发 |

#### Change 事件详细说明

```typescript
interface CrontabChangeData {
  cron: string           // CRONTAB 表达式
  dateRange?: (Date | null)[] | undefined  // 起止时间数组 [startDate, endDate]
}
```

## 🏗️ 组件架构

```
src/
├── components/
│   └── crontab/
│       ├── index.ts              # 组件导出入口
│       ├── types.ts              # 类型定义
│       ├── CrontabEditor.vue     # 🎯 主编辑器组件
│       ├── TimeUnitTab.vue       # 📊 通用时间单位 Tab（秒/分/时/月/年）
│       └── DayWeekTab.vue       # 📅 日期和星期特殊处理 Tab
├── utils/
│   └── common.ts                # 🔧 工具函数和常量
├── types/
│   └── crontab.ts              # 📝 CRONTAB 相关类型定义
└── styles/
    └── main.css                # 🎨 全局样式
```

## 📋 表达式格式说明

### 标准 7 位格式

```
┌── 秒 (0-59)
│  ┌── 分 (0-59)
│  │  ┌── 时 (0-23)
│  │  │  ┌── 日 (1-31)
│  │  │  │  ┌── 月 (1-12)
│  │  │  │  │  ┌── 周 (1-7, 1=周一, 7=周日)
│  │  │  │  │  │  ┌── 年 (2025-2130)
*  *  *  *  *  *  *
```

### 特殊字符说明

| 字符 | 说明 | 示例 |
|------|------|------|
| `*` | 任意值 | `*` 每分钟 |
| `?` | 不指定（仅用于日和周） | `?` 不指定具体日期 |
| `-` | 范围 | `1-5` 1号到5号 |
| `,` | 列表 | `1,3,5` 1号、3号、5号 |
| `/` | 步长 | `0/15` 每15分钟 |
| `L` | 最后 | `L` 当月最后一天 |
| `W` | 工作日 | `15W` 离15号最近的工作日 |
| `#` | 第几个星期几 | `1#2` 第二个周一 |

### 🎯 常用表达式库

| 表达式 | 说明 | 备注 |
|--------|------|------|
| `0 * * * * ? *` | 每分钟 | 在第0秒执行 |
| `0 5 * * * ? *` | 每5分钟 | 在第5分钟执行 |
| `0 0 * * * ? *` | 每小时 | 在0分0秒执行 |
| `0 0 0 * * ? *` | 每天 | 在0点执行 |
| `0 0 0 ? * 2 *` | 每周一 | 周一0点执行 |
| `0 0 0 1 * ? *` | 每月1号 | 每月1号0点执行 |
| `0 0 0 1 1 ? *` | 每年1月1号 | 元旦0点执行 |
| `0 0 0 ? * 1,5 *` | 每周一和周五 | 周一和周五0点执行 |
| `0 0 0 L * ? *` | 每月最后一天 | 当月最后一天0点执行 |
| `0 0 0 ? * 6L *` | 每月最后一个周六 | 当月最后一个周六0点执行 |

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 快速开始

```bash
# 克隆项目
git clone https://github.com/qindongliang/vue3-crontab-ui.git
cd vue3-crontab-ui

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码格式化
npm run format

# 代码检查
npm run lint
```

### 开发环境配置

项目使用以下开发工具：

- **ESLint**: 代码质量和风格检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查
- **Vite**: 构建和开发服务器

## 🔧 自定义和扩展

### 修改时间单位范围

编辑 `src/components/crontab/TimeUnitTab.vue` 中的配置：

```vue
<script setup lang="ts">
// 修改年份范围
const specificOptions = computed(() => {
  if (props.timeSpecial === 'year') {
    return Array.from({ length: 50 }, (_, i) => ({ // 改为50年
      label: (2025 + i).toString(),
      value: 2025 + i
    }))
  }
  // ... 其他配置
})
</script>
```

### 添加新的常用表达式

编辑 `src/components/crontab/CrontabEditor.vue`：

```vue
<script setup lang="ts">
const COMMON_EXPRESSIONS = [
  // 现有表达式...

  // 添加新的表达式
  { label: '每工作日', value: '0 0 0 ? * MON-FRI *' },
  { label: '每季度初', value: '0 0 0 1 1,4,7,10 ? *' },
  { label: '每15分钟', value: '0 0,15,30,45 * * * ? *' }
] as const
</script>
```

### 国际化支持

编辑 `src/utils/common.ts` 中的 `timeI18n` 对象：

```typescript
const timeI18n = {
  second: {
    everyTime: 'Every Second',    // 英文
    every: 'Every',
    timeCarriedOut: 'seconds, starting from',
    // ... 其他翻译
  },
  // ... 其他时间单位
}
```

## 📱 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome | >= 88 |
| Firefox | >= 78 |
| Safari | >= 14 |
| Edge | >= 88 |

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范

```bash
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### 开发流程

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'feat: add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 更新日志

### v1.0.0

#### ✨ 新增功能
- 🎉 基于 Vue 3 + View UI Plus 的 CRONTAB 编辑器
- 📊 完整的 7 位 CRONTAB 表达式支持
- 🎯 可视化 Tab 编辑界面
- ⚡ 常用表达式快速选择
- 📅 起止时间选择器
- 🔧 实时表达式预览
- 📱 响应式设计
- 🎨 完整的 TypeScript 支持

#### 🛠️ 技术特性
- Vue 3.4.21 + Composition API
- Vite 5.2.8 构建
- View UI Plus 1.3.15 组件库
- TypeScript 5.4.0 类型安全
- 代码优化和精简

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [View UI Plus](https://www.iviewui.com/) - 企业级 UI 组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Day.js](https://day.js.org/) - 轻量级日期库

---

<div align="center">

Made with ❤️ by [qindongliang](https://github.com/qindongliang)

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！

</div>
