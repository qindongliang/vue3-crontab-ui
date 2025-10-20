<template>
  <div id="app">
    <Layout style="height: 100vh">
      <Header>
        <Menu mode="horizontal" theme="dark" :active-name="activeName">
          <div class="layout-logo">Vue3 Crontab UI</div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-clock" />
              定时任务管理
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-stats" />
              执行日志
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-settings" />
              系统设置
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{ padding: '50px', minHeight: '280px' }">
        <Card>
          <template #title>
            <Icon type="ios-clock" />
            定时任务管理
          </template>
          <div class="crontab-content">
            <p>欢迎使用 Vue3 Crontab UI 系统</p>
            <p>技术栈：Vue 3.4.21 + Vite 5.2.8 + View UI Plus 1.3.15</p>
            <Divider />
            <Space>
              <Button type="primary" @click="handleCreateTask">
                <Icon type="ios-add" />
                创建任务
              </Button>
              <Button @click="handleRefresh">
                <Icon type="ios-refresh" />
                刷新列表
              </Button>
            </Space>
          </div>
        </Card>
      </Content>
      <Footer class="layout-footer-center">
        2024 &copy; Vue3 Crontab UI - 基于 Vue3 + View UI Plus 构建
      </Footer>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from 'view-ui-plus'

const activeName = ref('1')

const handleCreateTask = () => {
  Message.info('创建任务功能开发中...')
}

const handleRefresh = () => {
  Message.success('刷新成功')
}
</script>

<style scoped>
.layout-logo {
  width: 200px;
  height: 30px;
  background: #5b8ff9;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
  line-height: 30px;
}

.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}

.layout-footer-center {
  text-align: center;
}

.crontab-content {
  padding: 20px 0;
}
</style>