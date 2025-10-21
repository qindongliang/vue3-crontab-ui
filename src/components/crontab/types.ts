// CRONTAB 相关类型定义

export interface ISpecialSelect {
  [key: number]: Array<{ value: string; label: string }>
  year: Array<{ value: string; label: string }>
  day: Array<{ value: string; label: string }>
}

export interface ICrontabI18n {
  everyTime: string
  every: string
  timeCarriedOut: string
  timeStart: string
  cycleFrom: string
  specificTime: string
  specificTimeTip: string
  to: string
  time: string
}