<template>
  <div class="account-manager">
    <div class="header">
      <h1>Учетные записи</h1>
      <el-button type="primary" @click="addAccount" icon="Plus">
        Добавить учетную запись
      </el-button>
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
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <AccountItem
            v-for="account in accounts"
            :key="account.id"
            :account="account"
            :is-new="account.isEditing && !account.login"
            @save="handleSave"
            @cancel="handleCancel"
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
import { InfoFilled, Document } from '@element-plus/icons-vue'

const accountsStore = useAccountsStore()
const accounts = computed(() => accountsStore.accounts)

const addAccount = () => accountsStore.addAccount()

const handleSave = (id: string, labels: string, type: 'local' | 'ldap', login: string, password: string) => {
  accountsStore.saveAccount(id, labels, type, login, password)
}

const handleCancel = (id: string) => {
  accountsStore.updateAccount(id, { isEditing: false })
}
</script>

<style scoped>
.account-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h1 {
  margin: 0;
  color: #333;
}
.labels-hint {
  background-color: #f0f9ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0066cc;
}
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.accounts-table {
  width: 100%;
  border-collapse: collapse;
}
.accounts-table th {
  background-color: #fafafa;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}
.accounts-table td {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: #999;
}
.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
@media (max-width: 768px) {
  .account-manager { padding: 10px; }
  .header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .accounts-table { display: block; overflow-x: auto; }
}
</style>