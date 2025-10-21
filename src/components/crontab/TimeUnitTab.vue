<template>
  <div class="crontab-time">
    <RadioGroup v-model="radioRef" @on-change="updateRadioTime">
      <!-- 每一单位 -->
      <div class="crontab-list">
        <Radio label="everyTime">{{ timeI18nConfig.everyTime }}</Radio>
        <div class="crontab-list-item">
        </div>
      </div>

      <!-- 间隔 -->
      <div class="crontab-list">
        <Radio label="intervalTime">{{ timeI18nConfig.every }}</Radio>
        <div class="crontab-list-item">
            <InputNumber
              :min="timeMin"
              :max="timeMax"
              v-model="intervalPerformRef"
              @on-change="onIntervalPerform"
            />
          <div class="item-text">{{ timeI18nConfig.timeCarriedOut }}</div>
          <div class="number-input">
            <InputNumber
              :min="timeMin"
              :max="timeMax"
              v-model="intervalStartRef"
              @on-change="onIntervalStart"
            />
          </div>
          <div class="item-text">{{ timeI18nConfig.timeStart }}</div>
        </div>
      </div>

      <!-- 周期 -->
      <div class="crontab-list">
        <Radio label="cycleTime">{{ timeI18nConfig.cycleFrom }}</Radio>
        <div class="crontab-list-item">
          <div class="number-input">
            <InputNumber
              :min="timeMin"
              :max="timeMax"
              v-model="cycleStartRef"
              @on-change="onCycleStart"
            />
          </div>
          <div class="item-text">{{ timeI18nConfig.to }}</div>
          <div class="number-input">
            <InputNumber
              :min="timeMin"
              :max="timeMax"
              v-model="cycleEndRef"
              @on-change="onCycleEnd"
            />
          </div>
          <div class="item-text">{{ timeI18nConfig.time }}</div>
        </div>
      </div>

      <!-- 指定 -->
      <div class="crontab-list">
        <Radio label="specificTime">{{ timeI18nConfig.specificTime }}</Radio>
        <div class="crontab-list-item">
          <div class="select-input">
            <Select
              multiple
              :placeholder="timeI18nConfig.specificTimeTip"
              v-model="specificTimesRef"
              @on-change="onSpecificTimes"
              :max-tag-count="3"
              transfer
            >
              <Option v-for="opt in specificOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </Option>
            </Select>
          </div>
        </div>
      </div>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RadioGroup, Radio, InputNumber, Select, Option } from 'view-ui-plus'
import { isStr } from '../../utils/common.ts'
import type { ICrontabI18n } from './types'

interface Props {
  timeMin: number
  timeMax: number
  intervalPerform: number
  intervalStart: number
  cycleStart: number
  cycleEnd: number
  timeSpecial: number | string
  timeValue: string
  timeI18n: ICrontabI18n
}

const props = withDefaults(defineProps<Props>(), {
  timeMin: 0,
  timeMax: 60,
  intervalPerform: 5,
  intervalStart: 3,
  cycleStart: 1,
  cycleEnd: 1,
  timeSpecial: 60,
  timeValue: '*'
})

const emit = defineEmits<{
  'update:timeValue': [value: string]
}>()

// 响应式数据
const timeRef = ref('*')
const radioRef = ref('everyTime')
const intervalStartRef = ref(props.intervalStart)
const intervalPerformRef = ref(props.intervalPerform)
const specificTimesRef = ref<number[]>([])
const cycleStartRef = ref(props.cycleStart)
const cycleEndRef = ref(props.cycleEnd)

// 计算属性
const timeI18nConfig = computed(() => props.timeI18n)

const specificOptions = computed(() => {
  if (props.timeSpecial === 'year') {
    return Array.from({ length: 13 }, (_, i) => ({
      label: (2018 + i).toString(),
      value: 2018 + i
    }))
  }
  if (props.timeSpecial === 12) {
    return Array.from({ length: 12 }, (_, i) => ({
      label: (i + 1).toString(),
      value: i + 1
    }))
  }
  if (props.timeSpecial === 24) {
    return Array.from({ length: 24 }, (_, i) => ({
      label: i.toString(),
      value: i
    }))
  }
  return Array.from({ length: props.timeSpecial as number }, (_, i) => ({
    label: i.toString(),
    value: i
  }))
})

/**
 * 解析表达式值
 */
const analyticalValue = () => {
  const $timeVal = props.timeValue

  // 间隔时间
  const $interval = isStr($timeVal, '/')
  // 特定时间
  const $specific = isStr($timeVal, ',')
  // 周期时间
  const $cycle = isStr($timeVal, '-')

  // 每一单位
  if ($timeVal === '*') {
    radioRef.value = 'everyTime'
    timeRef.value = '*'
    return
  }

  // 正整数（时间）
  if (
    ($timeVal.length === 1 ||
      $timeVal.length === 2 ||
      $timeVal.length === 4) &&
    Number.isInteger(parseInt($timeVal))
  ) {
    radioRef.value = 'specificTime'
    specificTimesRef.value = [parseInt($timeVal)]
    return
  }

  // 间隔时间
  if ($interval) {
    radioRef.value = 'intervalTime'
    intervalStartRef.value = parseInt($interval[0])
    intervalPerformRef.value = parseInt($interval[1])
    timeRef.value = `${intervalStartRef.value}/${intervalPerformRef.value}`
    return
  }

  // 特定时间
  if ($specific) {
    radioRef.value = 'specificTime'
    specificTimesRef.value = $specific.map(item => parseInt(item))
    return
  }

  // 周期时间
  if ($cycle) {
    radioRef.value = 'cycleTime'
    cycleStartRef.value = parseInt($cycle[0])
    cycleEndRef.value = parseInt($cycle[1])
    timeRef.value = `${cycleStartRef.value}-${cycleEndRef.value}`
    return
  }
}

// 间隔开始时间
const onIntervalStart = (value: number | null) => {
  intervalStartRef.value = value || 0
  if (radioRef.value === 'intervalTime') {
    timeRef.value = `${intervalStartRef.value}/${intervalPerformRef.value}`
  }
}

// 间隔执行时间
const onIntervalPerform = (value: number | null) => {
  intervalPerformRef.value = value || 0
  if (radioRef.value === 'intervalTime') {
    timeRef.value = `${intervalStartRef.value}/${intervalPerformRef.value}`
  }
}

// 特定时间
const onSpecificTimes = (value: number[]) => {
  specificTimesRef.value = value
  if (radioRef.value === 'specificTime') {
    specificReset()
  }
}

// 周期开始值
const onCycleStart = (value: number | null) => {
  cycleStartRef.value = value || 1
  if (radioRef.value === 'cycleTime') {
    timeRef.value = `${cycleStartRef.value}-${cycleEndRef.value}`
  }
}

// 周期结束值
const onCycleEnd = (value: number | null) => {
  cycleEndRef.value = value || 2
  if (radioRef.value === 'cycleTime') {
    timeRef.value = `${cycleStartRef.value}-${cycleEndRef.value}`
  }
}

// 重置每一单位
const everyReset = () => {
  timeRef.value = '*'
}

// 重置间隔时间
const intervalReset = () => {
  timeRef.value = `${intervalStartRef.value}/${intervalPerformRef.value}`
}

// 重置特定时间
const specificReset = () => {
  let timeValue = '*'
  if (specificTimesRef.value.length) {
    timeValue = specificTimesRef.value.join(',')
  }
  timeRef.value = timeValue
}

// 重置周期时间
const cycleReset = () => {
  timeRef.value = `${cycleStartRef.value}-${cycleEndRef.value}`
}

const updateRadioTime = (value: string) => {
  switch (value) {
    case 'everyTime':
      everyReset()
      break
    case 'intervalTime':
      intervalReset()
      break
    case 'specificTime':
      specificReset()
      break
    case 'cycleTime':
      cycleReset()
      break
  }
}

// 监听时间值变化
watch(
  () => timeRef.value,
  () => emit('update:timeValue', timeRef.value.toString())
)

// 监听外部值变化
watch(
  () => props.timeValue,
  () => {
    analyticalValue()
  }
)

onMounted(() => {
  analyticalValue()
})
</script>

<style scoped>
.crontab-time {
  padding: 10px 0;
}

.crontab-list {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.crontab-list-item {
  margin-left: 8px;
  flex: 1;
}

.item-text {
  display: inline-block;
  margin: 0 8px;
  line-height: 32px;
}

.number-input {
  display: inline-block;
  width: 80px;
}

.select-input {
  margin-top: 8px;
  width: 100%;
  max-width: 400px;
}
</style>
