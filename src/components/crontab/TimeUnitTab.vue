<template>
  <div class="crontab-time">
    <RadioGroup v-model="radioRef"  @on-change="updateRadioTime">
      <Space direction="vertical">
      <!-- 每一单位 -->
        <Radio label="everyTime">{{ timeI18nConfig.everyTime }}</Radio>

      <!-- 间隔 -->
        <Radio label="intervalTime">
            <Space wrap>
              {{ timeI18nConfig.incStepStart }}
              <InputNumber
                  :min="timeMin"
                  :max="timeMax"
                  v-model="intervalStartRef"
                  @on-change="onIntervalStart"
              />
              {{ timeI18nConfig.timeStart }}

            {{ timeI18nConfig.every }}
            <InputNumber
                :min="timeMin"
                :max="timeMax"
                v-model="intervalPerformRef"
                @on-change="onIntervalPerform"
            />
              {{ timeI18nConfig.timeCarriedOut }}

            </Space>
        </Radio>

      <!-- 周期 -->
        <Radio label="cycleTime">
          {{ timeI18nConfig.cycleFrom }}
          <InputNumber
              :min="timeMin"
              :max="timeMax"
              v-model="cycleStartRef"
              @on-change="onCycleStart"
          />
          {{ timeI18nConfig.to }}
          <InputNumber
              :min="timeMin"
              :max="timeMax"
              v-model="cycleEndRef"
              @on-change="onCycleEnd"
          />
          {{ timeI18nConfig.time }}

        </Radio>
      <!-- 指定 -->
        <Radio label="specificTime">
          {{ timeI18nConfig.specificTime }}
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
        </Radio>

      </Space>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import {RadioGroup, Radio, InputNumber, Select, Option, Space} from 'view-ui-plus'
import { isStr } from './common.ts'
import type { ICrontabI18n } from './common'

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
      label: (2025 + i).toString(),
      value: 2025 + i
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
  if (specificTimesRef.value.length) {
    timeRef.value = specificTimesRef.value.join(',')
  } else {
    if (props.timeI18n.time === '秒') {
      timeRef.value = '0'
    } else {
      timeRef.value = '*'
    }
  }
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

</style>
