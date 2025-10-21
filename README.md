# Vue3 Crontab UI

基于 Vue 3 + View UI Plus 的 CRONTAB 表达式编辑器组件

## 功能特性

- ✅ 支持完整的 7 位 CRONTAB 表达式（秒 分 时 日 月 周 年）
- ✅ 可视化 Tab 编辑界面
- ✅ 支持多种操作模式：每单位、不指定、周期、间隔、指定值
- ✅ 实时表达式预览和验证
- ✅ 常用表达式快速选择
- ✅ 完全的 TypeScript 支持
- ✅ 基于 Vue 3 组合式 API

## 技术栈

- Vue 3.4.21
- Vite 5.2.8
- View UI Plus 1.3.15
- TypeScript

## 安装和使用

### 基础用法

```vue
<template>
  <CrontabEditor
    v-model="crontabValue"
    placeholder="请选择 CRONTAB 表达式"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CrontabEditor } from '@/components/crontab'

const crontabValue = ref('* * * * * ? *')

const handleChange = (value: string) => {
  console.log('CRONTAB 表达式已变更为:', value)
}
</script>
```

### 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | string | '* * * * * ? *' | CRONTAB 表达式值 |
| disabled | boolean | false | 是否禁用 |
| placeholder | string | '请选择 CRONTAB 表达式' | 输入框占位符 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | (value: string) | 表达式值更新时触发 |
| change | (value: string) | 表达式确认变更时触发 |

## 组件结构

```
src/components/crontab/
├── index.ts              # 导出文件
├── CrontabEditor.vue     # 主编辑器组件
├── TimeUnitTab.vue       # 通用时间单位 Tab
└── DayWeekTab.vue        # 日期和星期特殊处理 Tab
```

## 表达式格式

支持 7 位 CRONTAB 表达式格式：

```
秒 分 时 日 月 周 年
*  *  *  *  *  *  *
```

### 各字段范围

- **秒**：0-59
- **分**：0-59
- **时**：0-23
- **日**：1-31
- **月**：1-12
- **周**：1-7（1=周一，7=周日）
- **年**：2019-2030

### 常用表达式示例

| 表达式 | 说明 |
|--------|------|
| `* * * * * ? *` | 每秒执行 |
| `0 * * * * ? *` | 每分钟执行 |
| `0 0 * * * ? *` | 每小时执行 |
| `0 0 0 * * ? *` | 每天执行 |
| `0 0 0 ? * 1 *` | 每周一执行 |
| `0 0 0 1 * ? *` | 每月1号执行 |
| `0 0 0 1 1 ? *` | 每年1月1号执行 |

## 开发和构建

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 许可证

MIT License