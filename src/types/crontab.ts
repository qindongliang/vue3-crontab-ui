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

export interface TimeUnitConfig {
  min: number
  max: number
  special: number | string
  label: string
}

export interface TimeUnitProps {
  modelValue: string
  config: TimeUnitConfig
}

export interface CrontabEditorProps {
  modelValue?: string
  disabled?: boolean
  placeholder?: string
}

export type CrontabEmits = {
  'update:modelValue': [value: string]
  change: [value: string]
}