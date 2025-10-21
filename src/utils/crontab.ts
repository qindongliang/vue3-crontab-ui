import type { CrontabState } from '@/types/crontab'

/**
 * 解析 CRONTAB 表达式为状态对象
 */
export function parseCrontab(crontab: string): CrontabState {
  const parts = crontab.trim().split(/\s+/)

  // 补全7位表达式
  while (parts.length < 7) {
    parts.push('*')
  }

  return {
    second: parts[0] || '*',
    minute: parts[1] || '*',
    hour: parts[2] || '*',
    day: parts[3] || '*',
    month: parts[4] || '*',
    week: parts[5] || '*',
    year: parts[6] || '*'
  }
}

/**
 * 将状态对象转换为 CRONTAB 表达式
 */
export function buildCrontab(state: CrontabState): string {
  return `${state.second} ${state.minute} ${state.hour} ${state.day} ${state.month} ${state.week} ${state.year}`
}

/**
 * 验证 CRONTAB 表达式
 */
export function validateCrontab(crontab: string): boolean {
  const parts = crontab.trim().split(/\s+/)
  if (parts.length !== 7) return false

  // 简单验证每个部分的格式
  const patterns = [
    /^(\*|([0-5]?\d)(-([0-5]?\d))?(\/([0-5]?\d))?(,([0-5]?\d))*)$/, // 秒
    /^(\*|([0-5]?\d)(-([0-5]?\d))?(\/([0-5]?\d))?(,([0-5]?\d))*)$/, // 分
    /^(\*|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/([01]?\d|2[0-3]))?(,([01]?\d|2[0-3]))*)$/, // 时
    /^(\*|([1-2]?\d|3[01])(-([1-2]?\d|3[01]))?(\/([1-2]?\d|3[01]))?(,([1-2]?\d|3[01]))*)$/, // 日
    /^(\*|([1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/([1-9]|1[0-2]))?(,([1-9]|1[0-2]))*)$/, // 月
    /^(\*|([1-7])(-([1-7]))?(\/([1-7]))?(,([1-7]))*)$/, // 周
    /^(\*|([2-9]\d{3})(-([2-9]\d{3}))?(\/([2-9]\d{3}))?(,([2-9]\d{3}))*)$/ // 年
  ]

  return patterns.every((pattern, index) => pattern.test(parts[index]))
}

/**
 * 获取常用快捷表达式
 */
export const commonCronExpressions = {
  everySecond: '* * * * * ? *',
  everyMinute: '0 * * * * ? *',
  everyHour: '0 0 * * * ? *',
  everyDay: '0 0 0 * * ? *',
  everyWeek: '0 0 0 ? * 1 *',
  everyMonth: '0 0 0 1 * ? *',
  everyYear: '0 0 0 1 1 ? *'
}

/**
 * 时间单位配置
 */
export const timeUnitConfigs = {
  second: { min: 0, max: 59, special: 60, label: '秒' },
  minute: { min: 0, max: 59, special: 60, label: '分钟' },
  hour: { min: 0, max: 23, special: 24, label: '小时' },
  day: { min: 1, max: 31, special: 31, label: '日' },
  month: { min: 1, max: 12, special: 12, label: '月' },
  week: { min: 1, max: 7, special: 7, label: '周' },
  year: { min: 2019, max: 2030, special: 'year', label: '年' }
}