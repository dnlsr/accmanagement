<template>
  <div class="account-manager">
    <div class="header">
      <div class="title-wrapper">
        <h1>Учетные записи</h1>
        <el-button @click="addAccount" class="add-button">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="labels-hint">
      <el-icon><InfoFilled /></el-icon>
      <span>Для указания нескольких меток используйте разделитель ";"</span>
    </div>

    <div class="table-container">
      <table class="accounts-table">
        <thead>
          <tr>
            <th>Метки</th>
            <th>Тип записи</th>
            <th>Логин</th>
            <th>Пароль</th>
            <th style="width: 50px"></th>
          </tr>
        </thead>
        <tbody>
          <AccountItem
            v-for="account in accounts"
            :key="account.id"
            :account="account"
          />
        </tbody>
      </table>

      <div v-if="accounts.length === 0" class="empty-state">
        <el-icon><Document /></el-icon>
        <p>Нет учетных записей. Добавьте первую запись.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'
import { Plus, InfoFilled, Document } from '@element-plus/icons-vue'

const accountsStore = useAccountsStore()
const accounts = computed(() => accountsStore.accounts)

const addAccount = () => accountsStore.addAccount()
</script>

<style scoped>
.account-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  margin-bottom: 20px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

/* Кнопка + квадратная и прозрачная */
.add-button {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #dcdfe6;
  background: transparent;
  border-radius: 4px;
  color: #606266;
}

.add-button:hover {
  background: #f5f7fa;
  border-color: #c0c4cc;
  color: #409eff;
}

.add-button :deep(.el-icon) {
  font-size: 16px;
}

.labels-hint {
  background-color: #f0f9ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0066cc;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
}

.accounts-table th {
  background-color: #f5f7fa;
  padding: 14px 16px;
  text-align: center;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-bottom: 1px solid #e4e7ed;
}

.accounts-table td {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  vertical-align: top;
}

.accounts-table tr:last-child td {
  border-bottom: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .account-manager {
    padding: 16px;
  }
  
  .title-wrapper {
    gap: 8px;
  }
  
  .accounts-table {
    display: block;
    overflow-x: auto;
  }
  
  .accounts-table th:last-child,
  .accounts-table td:last-child {
    position: sticky;
    right: 0;
    background: white;
    box-shadow: -2px 0 5px rgba(0,0,0,0.05);
  }
  
  .accounts-table th:last-child {
    background: #f5f7fa;
  }
}
</style>