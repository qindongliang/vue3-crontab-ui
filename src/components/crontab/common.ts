// 常用工具函数和常量

const timeI18n = {
  second: {
    everyTime: '每秒',
    every: '每隔',
    incStepStart: '从第',
    timeCarriedOut: '秒执行一次',
    timeStart: '秒开始，',
    cycleFrom: '周期从',
    specificTime: '特定秒数',
    specificTimeTip: '请选择特定秒数',
    to: '到',
    time: '秒'
  },
  minute: {
    everyTime: '每分钟',
    every: '每隔',
    incStepStart: '从第',
    timeCarriedOut: '分钟执行一次',
    timeStart: '分钟开始，',
    cycleFrom: '周期从',
    specificTime: '特定分钟',
    specificTimeTip: '请选择特定分钟',
    to: '到',
    time: '分钟'
  },
  hour: {
    everyTime: '每小时',
    every: '每隔',
    incStepStart: '从第',
    timeCarriedOut: '小时执行一次',
    timeStart: '小时开始，',
    cycleFrom: '周期从',
    specificTime: '特定小时',
    specificTimeTip: '请选择特定小时',
    to: '到',
    time: '小时'
  },
  month: {
    everyTime: '每月',
    every: '每隔',
    incStepStart: '从第',
    timeCarriedOut: '月执行一次',
    timeStart: '月开始，',
    cycleFrom: '周期从',
    specificTime: '特定月份',
    specificTimeTip: '请选择特定月份',
    to: '到',
    time: '月'
  },
  year: {
    everyTime: '每年',
    every: '每隔',
    incStepStart: '从第',
    timeCarriedOut: '年执行一次',
    timeStart: '年开始，',
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



export interface ICrontabI18n {
  everyTime: string
  every: string
  incStepStart: string
  timeCarriedOut: string
  timeStart: string
  cycleFrom: string
  specificTime: string
  specificTimeTip: string
  to: string
  time: string
}

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

export { isStr, isWeek, timeI18n, week, specificWeek }
