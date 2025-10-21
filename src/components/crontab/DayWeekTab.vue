<template>
  <div class="crontab-day">
    <RadioGroup v-model="radioRef" @on-change="updateRadioTime">
      <!-- 每一天 -->
      <div class="crontab-list">
        <Radio label="everyDay">每一天</Radio>
      </div>

      <!-- 每隔天数执行，从星期开始 -->
      <div class="crontab-list">
        <Radio label="intervalWeekDay">每隔</Radio>
        <div class="crontab-list-item">
          <div class="number-input">
            <InputNumber
              :min="1"
              :max="31"
              v-model="intervalWeekDayRef"
              @on-change="onIntervalWeekDay"
            />
          </div>
          <div class="item-text">天执行一次，从</div>
          <div class="select-input-small">
            <Select
              v-model="intervalWeekStartRef"
              @on-change="onIntervalWeekStart"
              transfer
            >
              <Option v-for="week in weekOptions" :key="week.value" :value="week.value">
                {{ week.label }}
              </Option>
            </Select>
          </div>
          <div class="item-text">开始</div>
        </div>
      </div>

      <!-- 每隔天数执行，从某天开始 -->
      <div class="crontab-list">
        <Radio label="intervalDay">每隔</Radio>
        <div class="crontab-list-item">
          <div class="number-input">
            <InputNumber
              :min="1"
              :max="31"
              v-model="intervalDayPerformRef"
              @on-change="onIntervalDayPerform"
            />
          </div>
          <div class="item-text">天执行一次，从</div>
          <div class="number-input">
            <InputNumber
              :min="1"
              :max="31"
              v-model="intervalDayStartRef"
              @on-change="onIntervalDayStart"
            />
          </div>
          <div class="item-text">天开始</div>
        </div>
      </div>

      <!-- 具体星期几(可多选) -->
      <div class="crontab-list">
        <Radio label="specificWeek">具体星期几(可多选)</Radio>
        <div class="crontab-list-item">
          <div class="select-input">
            <Select
              multiple
              placeholder="请选择具体星期"
              v-model="WkspecificWeekRef"
              @on-change="onSpecificWeek"
              :max-tag-count="3"
              transfer
            >
              <Option v-for="item in specificWeekOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
      </div>

      <!-- 具体天数(可多选) -->
      <div class="crontab-list">
        <Radio label="specificDay">具体天数(可多选)</Radio>
        <div class="crontab-list-item">
          <div class="select-input">
            <Select
              multiple
              placeholder="请选择具体天数"
              v-model="WkspecificDayRef"
              @on-change="onSpecificDay"
              :max-tag-count="3"
              transfer
            >
              <Option v-for="item in dayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
      </div>

      <!-- 在这个月的最后一天 -->
      <div class="crontab-list">
        <Radio label="lastDayOfMonth">在这个月的最后一天</Radio>
      </div>

      <!-- 在这个月的最后一个工作日 -->
      <div class="crontab-list">
        <Radio label="lastWorkdayOfMonth">在这个月的最后一个工作日</Radio>
      </div>

      <!-- 在这个月的最后一个星期几 -->
      <div class="crontab-list">
        <Radio label="lastWeekdayOfMonth">在这个月的最后一个</Radio>
        <div class="crontab-list-item">
          <div class="select-input-small">
            <Select
              v-model="lastWeekdayRef"
              @on-change="onLastWeekday"
              transfer
            >
              <Option v-for="week in weekOptions" :key="week.value" :value="week.value">
                {{ week.label }}
              </Option>
            </Select>
          </div>
        </div>
      </div>

      <!-- X 在本月底前 -->
      <div class="crontab-list">
        <Radio label="beforeMonthEnd">在本月底前</Radio>
        <div class="crontab-list-item">
          <div class="number-input">
            <InputNumber
              :min="1"
              :max="31"
              v-model="beforeMonthEndRef"
              @on-change="onBeforeMonthEnd"
            />

          </div>
          日
        </div>

      </div>

      <!-- 最近的工作日至本月X日 -->
      <div class="crontab-list">
        <Radio label="nearestWorkday">最近的工作日（周一至周五）至本月</Radio>
        <div class="crontab-list-item">
          <div class="number-input">
            <InputNumber
              :min="1"
              :max="31"
              v-model="nearestWorkdayRef"
              @on-change="onNearestWorkday"
            />
          </div>
          <div class="item-text">日</div>
        </div>
      </div>

      <!-- 在这个月的第X个星期几 -->
      <div class="crontab-list">
        <Radio label="nthWeekdayOfMonth">在这个月的第</Radio>
        <div class="crontab-list-item">
          <div class="number-input">
            <InputNumber
              :min="1"
              :max="5"
              v-model="nthWeekRef"
              @on-change="onNthWeek"
            />
          </div>
          <div class="select-input-small">
            <Select
              v-model="nthWeekdayRef"
              @on-change="onNthWeekday"
              transfer
            >
              <Option v-for="week in weekOptions" :key="week.value" :value="week.value">
                {{ week.label }}
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
import dayjs from 'dayjs'
import { isStr, isWeek, week, specificWeek } from '../../utils/common.ts'

interface Props {
  dayValue: string
  weekValue: string
}

const props = withDefaults(defineProps<Props>(), {
  dayValue: '*',
  weekValue: '?'
})

const emit = defineEmits<{
  'update:dayValue': [value: string]
  'update:weekValue': [value: string]
}>()

// 响应式数据
const radioRef = ref('everyDay')
const dayRef = ref('*')
const weekRef = ref('?')

// 每隔天数执行，从星期开始
const intervalWeekDayRef = ref(2)
const intervalWeekStartRef = ref(2)

// 每隔天数执行，从某天开始
const intervalDayStartRef = ref(1)
const intervalDayPerformRef = ref(1)

// 具体选择
const WkspecificDayRef = ref<number[]>([])
const WkspecificWeekRef = ref<string[]>([])

// 最后一个星期几
const lastWeekdayRef = ref(1)

// 本月底前
const beforeMonthEndRef = ref(1)

// 最近工作日
const nearestWorkdayRef = ref(1)

// 第N个星期几
const nthWeekRef = ref(1)
const nthWeekdayRef = ref(1)

// 计算属性
const weekOptions = computed(() => week.map(v => ({ label: v.label, value: v.value })))
const specificWeekOptions = computed(() => specificWeek.map(v => ({ label: v.label, value: v.value })))
const dayOptions = computed(() =>
  Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }))
)

// 事件处理函数
const onIntervalWeekDay = () => updateRadioTime('intervalWeekDay')
const onIntervalWeekStart = () => updateRadioTime('intervalWeekDay')
const onIntervalDayStart = () => updateRadioTime('intervalDay')
const onIntervalDayPerform = () => updateRadioTime('intervalDay')
const onSpecificDay = () => updateRadioTime('specificDay')
const onSpecificWeek = () => updateRadioTime('specificWeek')
const onLastWeekday = () => updateRadioTime('lastWeekdayOfMonth')
const onBeforeMonthEnd = () => updateRadioTime('beforeMonthEnd')
const onNearestWorkday = () => updateRadioTime('nearestWorkday')
const onNthWeek = () => updateRadioTime('nthWeekdayOfMonth')
const onNthWeekday = () => updateRadioTime('nthWeekdayOfMonth')

/**
 * 解析表达式值
 */
const analyticalValue = () => {
  const $dayVal = props.dayValue
  const $weekVal = props.weekValue

  if ($dayVal === '*' && $weekVal === '?') {
    radioRef.value = 'everyDay'
  } else if ($dayVal === 'L') {
    radioRef.value = 'lastDayOfMonth'
  } else if ($dayVal === 'LW') {
    radioRef.value = 'lastWorkdayOfMonth'
  } else if ($dayVal.includes('L') && isWeek($dayVal.replace('L', ''))) {
    radioRef.value = 'lastWeekdayOfMonth'
    lastWeekdayRef.value = parseInt($dayVal.replace('L', ''))
  } else if ($dayVal.includes('W')) {
    radioRef.value = 'nearestWorkday'
    nearestWorkdayRef.value = parseInt($dayVal.replace('W', ''))
  } else if ($weekVal.includes('#')) {
    radioRef.value = 'nthWeekdayOfMonth'
    const [weekday, nth] = $weekVal.split('#')
    nthWeekdayRef.value = parseInt(weekday)
    nthWeekRef.value = parseInt(nth)
  } else if ($dayVal.includes('/') && $weekVal === '?') {
    // 处理从某天开始的间隔，格式如：1/2（从1号开始每隔2天）
    radioRef.value = 'intervalDay'
    const parts = $dayVal.split('/')
    intervalDayStartRef.value = parseInt(parts[0])
    intervalDayPerformRef.value = parseInt(parts[1])
  } else if ($weekVal.includes('/') && $dayVal === '?') {
    // 处理从星期开始的间隔，格式如：2/2（从周一开始每隔2天）
    radioRef.value = 'intervalWeekDay'
    const parts = $weekVal.split('/')
    intervalWeekStartRef.value = parseInt(parts[0])
    intervalWeekDayRef.value = parseInt(parts[1])
  } else if ($dayVal.includes(',') && $weekVal === '?') {
    radioRef.value = 'specificDay'
    WkspecificDayRef.value = $dayVal.split(',').map(Number)
  } else if ($weekVal.includes(',') && $dayVal === '?') {
    radioRef.value = 'specificWeek'
    WkspecificWeekRef.value = $weekVal.split(',')
  } else if ($dayVal.includes('L-')) {
    radioRef.value = 'beforeMonthEnd'
    beforeMonthEndRef.value = parseInt($dayVal.replace('L-', ''))
  }
}

/**
 * 更新单选按钮时间
 */
const updateRadioTime = (value: string) => {
  switch (value) {
    case 'everyDay':
      dayRef.value = '*'
      weekRef.value = '?'
      break
    case 'intervalWeekDay':
      dayRef.value = '?'
      weekRef.value = `${intervalWeekStartRef.value}/${intervalWeekDayRef.value}`
      break
    case 'intervalDay':
      dayRef.value = `${intervalDayStartRef.value}/${intervalDayPerformRef.value}`
      weekRef.value = '?'  // 天间隔表达式中，星期字段必须为 ?
      break
    case 'specificDay':
      dayRef.value = WkspecificDayRef.value.length ? WkspecificDayRef.value.join(',') : '*'
      weekRef.value = '?'
      break
    case 'specificWeek':
      dayRef.value = '?'
      weekRef.value = WkspecificWeekRef.value.length ? WkspecificWeekRef.value.join(',') : '?'
      break
    case 'lastDayOfMonth':
      dayRef.value = 'L'
      weekRef.value = '?'
      break
    case 'lastWorkdayOfMonth':
      dayRef.value = 'LW'
      weekRef.value = '?'
      break
    case 'lastWeekdayOfMonth':
      dayRef.value = '?'
      weekRef.value = `${lastWeekdayRef.value}L`
      break
    case 'beforeMonthEnd':
      dayRef.value = `L-${beforeMonthEndRef.value}`
      weekRef.value = '?'
      break
    case 'nearestWorkday':
      dayRef.value = `${nearestWorkdayRef.value}W`
      weekRef.value = '?'
      break
    case 'nthWeekdayOfMonth':
      dayRef.value = '?'
      weekRef.value = `${nthWeekdayRef.value}#${nthWeekRef.value}`
      break
  }
}

// 监听值变化
watch(
  () => dayRef.value,
  () => emit('update:dayValue', dayRef.value)
)

watch(
  () => weekRef.value,
  () => emit('update:weekValue', weekRef.value)
)

// 监听外部值变化
watch(
  () => [props.dayValue, props.weekValue],
  () => {
    analyticalValue()
  }
)

onMounted(() => {
  analyticalValue()
})
</script>

<style scoped>
.crontab-day {
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
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.item-text {
  display: inline-block;
  line-height: 32px;
  white-space: nowrap;
}

.number-input {
  display: inline-block;
  width: 80px;
}

.select-input {
  width: 100%;
  max-width: 300px;
  min-width: 200px;
}

.select-input-small {
  width: 120px;
  min-width: 100px;
}
</style>
