// 常用工具函数和常量

const timeI18n = {
  second: {
    everyTime: '每秒',
    every: '每隔',
    timeCarriedOut: '秒执行一次，从',
    timeStart: '秒开始',
    cycleFrom: '周期从',
    specificTime: '特定秒数',
    specificTimeTip: '请选择特定秒数',
    to: '到',
    time: '秒'
  },
  minute: {
    everyTime: '每分钟',
    every: '每隔',
    timeCarriedOut: '分钟执行一次，从',
    timeStart: '分钟开始',
    cycleFrom: '周期，从',
    specificTime: '特定分钟',
    specificTimeTip: '请选择特定分钟',
    to: '到',
    time: '分钟'
  },
  hour: {
    everyTime: '每小时',
    every: '每隔',
    timeCarriedOut: '小时执行一次，从',
    timeStart: '小时开始',
    cycleFrom: '周期，从',
    specificTime: '特定小时',
    specificTimeTip: '请选择特定小时',
    to: '到',
    time: '小时'
  },
  month: {
    everyTime: '每月',
    every: '每隔',
    timeCarriedOut: '月执行一次，从',
    timeStart: '月开始',
    cycleFrom: '周期从',
    specificTime: '特定月份',
    specificTimeTip: '请选择特定月份',
    to: '到',
    time: '月'
  },
  year: {
    everyTime: '每年',
    every: '每隔',
    timeCarriedOut: '年执行一次，从',
    timeStart: '年开始',
    cycleFrom: '周期从',
    specificTime: '特定年份',
    specificTimeTip: '请选择特定年份',
    to: '到',
    time: '年'
  }
}

const week = [
  { label: '周日', value: 1 },
  { label: '周一', value: 2 },
  { label: '周二', value: 3 },
  { label: '周三', value: 4 },
  { label: '周四', value: 5 },
  { label: '周五', value: 6 },
  { label: '周六', value: 7 }
]

const specificWeek = [
  { label: 'SUN', value: 'SUN' },
  { label: 'MON', value: 'MON' },
  { label: 'TUE', value: 'TUE' },
  { label: 'WED', value: 'WED' },
  { label: 'THU', value: 'THU' },
  { label: 'FRI', value: 'FRI' },
  { label: 'SAT', value: 'SAT' }
]

const lastWeeks = [
  { label: '周日', value: '?' },
  { label: '周一', value: '2L' },
  { label: '周二', value: '3L' },
  { label: '周三', value: '4L' },
  { label: '周四', value: '5L' },
  { label: '周五', value: '6L' },
  { label: '周六', value: '7L' }
]


// 常用 CRONTAB 表达式常量定义
const CRONTAB_EVERY_SECOND = '* * * * * ? *'
const CRONTAB_EVERY_MINUTE = '0 * * * * ? *'
const CRONTAB_EVERY_HOUR = '0 0 * * * ? *'
const CRONTAB_EVERY_DAY = '0 0 0 * * ? *'
const CRONTAB_EVERY_WEEK_MONDAY = '0 0 0 ? * MON *'
const CRONTAB_EVERY_MONTH_FIRST = '0 0 0 1 * ? *'
const CRONTAB_EVERY_YEAR_FIRST = '0 0 0 1 1 ? *'


// 工具函数
const isStr = (str: string, v: string) => {
  let flag
  if (str.indexOf(v) !== -1) {
    flag = str.split(v)
  }
  return flag
}

const isWeek = (str: string) => {
  let flag = false
  const data = str.split(',')
  const isSpecificWeek = (key: string) => {
    return specificWeek.findIndex(v => v.value === key) !== -1
  }
  data.forEach(v => {
    if (isSpecificWeek(v)) {
      flag = true
    }
  })
  return flag
}

const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: Math.floor((stop - start) / step) + 1 }, (_, i) => start + i * step)

const specificList = {
  60: range(0, 59).map(v => ({ value: v + '', label: v + '' })),
  24: range(0, 23).map(v => ({ value: v + '', label: v + '' })),
  12: range(1, 12).map(v => ({ value: v + '', label: v + '' })),
  year: range(2018, 2030).map(v => ({ value: v + '', label: v + '' })),
  day: range(1, 31).map(v => ({ value: v + '', label: v + '' }))
}

export { isStr, isWeek, timeI18n, week, specificWeek, lastWeeks, specificList
,CRONTAB_EVERY_SECOND,CRONTAB_EVERY_MINUTE,CRONTAB_EVERY_HOUR,CRONTAB_EVERY_DAY
    ,CRONTAB_EVERY_WEEK_MONDAY,CRONTAB_EVERY_MONTH_FIRST,CRONTAB_EVERY_YEAR_FIRST
}
