// CRONTAB 表达式相关的类型定义

export interface CrontabState {
  second: string
  minute: string
  hour: string
  day: string
  month: string
  week: string
  year: string
}

export interface CrontabEditorProps {
  modelValue?: string
  disabled?: boolean
  placeholder?: string
}