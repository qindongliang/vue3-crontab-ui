<template>
  <div class="crontab-demo">
    <Card>
      <template #title>
        <Icon type="ios-clock" />
        CRONTAB 编辑器演示
      </template>

      <div class="demo-content">
        <!-- 基础用法 -->
        <div class="demo-section">
          <h3>基础用法</h3>
          <p>点击输入框打开 CRONTAB 编辑器：</p>
          <div class="demo-item">
            <span style="margin-right: 10px;">表达式：</span>
            <CrontabEditor
              v-model="crontabValue"
              placeholder="请选择 CRONTAB 表达式"
              style="width: 400px;"
              @change="handleCrontabChange"
            />
          </div>
          <div class="result-display">
            <strong>当前值：</strong>{{ crontabValue }}
          </div>
          <div class="result-display" v-if="changeLogs.length > 0">
            <strong>变化历史：</strong>
            <ul>
              <li v-for="(log, index) in changeLogs" :key="index">
                {{ log }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, Icon, Message } from 'view-ui-plus'
import CrontabEditor from '@/components/crontab/CrontabEditor.vue'
import {CRONTAB_EVERY_HOUR} from '../../utils/common.ts'
// 基础用法
const crontabValue = ref(CRONTAB_EVERY_HOUR)
const changeLogs = ref<string[]>([])

// 处理表达式变化
const handleCrontabChange = (value: string) => {
  const timestamp = new Date().toLocaleTimeString()
  changeLogs.value.unshift(`[${timestamp}] 表达式变更为：${value}`)

  // 保持最多10条记录
  if (changeLogs.value.length > 10) {
    changeLogs.value = changeLogs.value.slice(0, 10)
  }
}
</script>

<style scoped>
.crontab-demo {
  padding: 20px;
}

.demo-content {
  padding: 20px 0;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  margin-bottom: 10px;
  color: #2d8cf0;
}

.demo-section p {
  margin-bottom: 15px;
  color: #666;
}

.demo-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.result-display {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: monospace;
}

.result-display ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.result-display li {
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
}
</style>
