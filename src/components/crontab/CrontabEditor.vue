<template>
  <div class="crontab-editor">
    <Input
      v-model="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      readonly
      @click="showModal = true"
    >
      <template #suffix>
        <Icon type="ios-clock" />
      </template>
    </Input>

    <Modal
      v-model="showModal"
      title="CRONTAB 表达式编辑器"
      width="800"
      :mask-closable="false"
      @on-ok="handleConfirm"
      @on-cancel="handleCancel"
    >
      <!-- 表达式预览 -->
      <div class="expression-preview">
        <h4>表达式预览：</h4>
        <div class="expression-display">
          <Input v-model="internalValue" readonly style="font-family: monospace; font-weight: bold;" />
        </div>
      </div>
      <div class="crontab-content">

        <!-- Tab 页面 -->
        <Tabs v-model="activeTab" type="card" :animated="false" :lazy="false">
          <TabPane name="second" label="秒" :key="'second'">
            <TimeUnitTab
              :timeMin="0"
              :timeMax="59"
              :intervalPerform="5"
              :intervalStart="3"
              :cycleStart="1"
              :cycleEnd="1"
              :timeSpecial="60"
              :timeValue="crontabState.second"
              @update:timeValue="crontabState.second = $event"
              :timeI18n="timeI18n.second"
            />
          </TabPane>

          <TabPane name="minute" label="分钟" :key="'minute'">
            <TimeUnitTab
              :timeMin="0"
              :timeMax="59"
              :intervalPerform="5"
              :intervalStart="3"
              :cycleStart="1"
              :cycleEnd="1"
              :timeSpecial="60"
              :timeValue="crontabState.minute"
              @update:timeValue="crontabState.minute = $event"
              :timeI18n="timeI18n.minute"
            />
          </TabPane>

          <TabPane name="hour" label="小时" :key="'hour'">
            <TimeUnitTab
              :timeMin="0"
              :timeMax="23"
              :intervalPerform="5"
              :intervalStart="3"
              :cycleStart="1"
              :cycleEnd="1"
              :timeSpecial="24"
              :timeValue="crontabState.hour"
              @update:timeValue="crontabState.hour = $event"
              :timeI18n="timeI18n.hour"
            />
          </TabPane>

          <TabPane name="day" label="日" :key="'day'">
            <DayWeekTab
              :dayValue="crontabState.day"
              @update:dayValue="crontabState.day = $event"
              :weekValue="crontabState.week"
              @update:weekValue="crontabState.week = $event"
            />
          </TabPane>

          <TabPane name="month" label="月" :key="'month'">
            <TimeUnitTab
              :timeMin="1"
              :timeMax="12"
              :intervalPerform="5"
              :intervalStart="3"
              :cycleStart="1"
              :cycleEnd="1"
              :timeSpecial="12"
              :timeValue="crontabState.month"
              @update:timeValue="crontabState.month = $event"
              :timeI18n="timeI18n.month"
            />
          </TabPane>

          <TabPane name="year" label="年" :key="'year'">
            <TimeUnitTab
              :timeMin="2018"
              :timeMax="2030"
              :intervalPerform="5"
              :intervalStart="2018"
              :cycleStart="2018"
              :cycleEnd="2018"
              :timeSpecial="'year'"
              :timeValue="crontabState.year"
              @update:timeValue="crontabState.year = $event"
              :timeI18n="timeI18n.year"
            />
          </TabPane>
        </Tabs>


        <!-- 常用表达式 -->
        <div class="common-expressions">
          <h4>常用表达式：</h4>
          <div class="expression-buttons">
            <Button
              v-for="(expr, key) in commonExpressions"
              :key="key"
              size="small"
              type="primary"
              ghost
              @click="applyCommonExpression(expr.value)"
            >
              {{ expr.label }}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Input, Modal, Tabs, TabPane, Button, Icon, Divider, Message } from 'view-ui-plus'
import TimeUnitTab from './TimeUnitTab.vue'
import DayWeekTab from './DayWeekTab.vue'
import { timeI18n } from './common'
import type { CrontabEditorProps } from '@/types/crontab'

const props = withDefaults(defineProps<CrontabEditorProps>(), {
  modelValue: '* * * * * ? *',
  disabled: false,
  placeholder: '请选择 CRONTAB 表达式'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const showModal = ref(false)
const activeTab = ref('second')

// CRONTAB 状态
const crontabState = ref({
  second: '*',
  minute: '*',
  hour: '*',
  day: '*',
  month: '*',
  week: '?',
  year: '*'
})

// 计算内部值
const internalValue = computed(() => {
  return `${crontabState.value.second} ${crontabState.value.minute} ${crontabState.value.hour} ${crontabState.value.day} ${crontabState.value.month} ${crontabState.value.week} ${crontabState.value.year}`
})

// 显示值
const displayValue = computed(() => props.modelValue)

// 常用表达式
const commonExpressions = [
  { label: '每秒', value: '* * * * * ? *' },
  { label: '每分钟', value: '0 * * * * ? *' },
  { label: '每小时', value: '0 0 * * * ? *' },
  { label: '每天', value: '0 0 0 * * ? *' },
  { label: '每周一', value: '0 0 0 ? * 2 *' },
  { label: '每月1号', value: '0 0 0 1 * ? *' },
  { label: '每年1月1号', value: '0 0 0 1 1 ? *' }
]

// 解析 CRONTAB 表达式
const parseCrontab = (crontab: string) => {
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
    week: parts[5] || '?',
    year: parts[6] || '*'
  }
}

// 应用常用表达式
const applyCommonExpression = (expression: string) => {
  try {
    crontabState.value = parseCrontab(expression)
    Message.success('已应用常用表达式')
  } catch (error) {
    Message.error('表达式格式错误')
  }
}

// 处理确认
const handleConfirm = () => {
  const expression = internalValue.value
  try {
    // 简单验证表达式格式
    const parts = expression.split(' ')
    if (parts.length !== 7) {
      throw new Error('表达式格式错误')
    }

    emit('update:modelValue', expression)
    emit('change', expression)
    showModal.value = false
    Message.success('表达式已更新')
  } catch (error) {
    Message.error('表达式格式错误，请检查')
    return false // 阻止 Modal 关闭
  }
}

// 处理取消
const handleCancel = () => {
  // 恢复原始状态
  if (props.modelValue) {
    try {
      crontabState.value = parseCrontab(props.modelValue)
    } catch (error) {
      // 解析失败，使用默认值
      crontabState.value = parseCrontab('* * * * * ? *')
    }
  }
  showModal.value = false
}

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      try {
        crontabState.value = parseCrontab(newValue)
      } catch (error) {
        // 解析失败，使用默认值
        crontabState.value = parseCrontab('* * * * * ? *')
      }
    }
  },
  { immediate: true }
)

// 监听模态框显示，确保状态同步
watch(
  () => showModal.value,
  (visible) => {
    if (visible) {
      try {
        crontabState.value = parseCrontab(props.modelValue)
      } catch (error) {
        crontabState.value = parseCrontab('* * * * * ? *')
      }
    }
  }
)

// 监听 crontabState 变化，实时更新内部值
watch(
  () => crontabState.value,
  () => {
    // 这里不需要额外处理，internalValue 计算属性会自动更新
  },
  { deep: true }
)
</script>

<style scoped>
.crontab-editor {
  display: inline-block;
  width: 100%;
}

.crontab-content {
  padding: 10px 0;
}

.expression-preview {
  margin-top: 20px;
}

.expression-preview h4 {
  margin: 10px 0;
  color: #333;
}

.expression-display {
  margin: 10px 0;
}

.common-expressions {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.common-expressions h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.expression-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.expression-buttons .ivu-btn {
  margin: 0;
}

:deep(.ivu-tabs-content) {
  min-height: 300px;
  overflow: visible;
}

:deep(.ivu-modal-body) {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
