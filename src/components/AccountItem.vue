<template>
  <tr class="account-row">
    <td class="labels-cell">
      <div class="labels-edit">
        <el-input
          v-model="localLabels"
          placeholder="Введите метки через ;"
          :maxlength="50"
          size="default"
          @blur="handleBlur"
        />
      </div>
    </td>

    <td>
      <el-select
        v-model="localType"
        placeholder="Локальная"
        size="default"
        @change="handleTypeChange"
      >
        <el-option label="Локальная" value="local" />
        <el-option label="LDAP" value="ldap" />
      </el-select>
    </td>

    <td>
      <el-input
        v-model="localLogin"
        placeholder="Введите логин"
        :maxlength="100"
        size="default"
        @blur="handleBlur"
        :class="{ 'error-field': loginError }"
      />
    </td>

    <td>
      <el-input
        v-if="localType === 'local'"
        v-model="localPassword"
        :type="showEditPassword ? 'text' : 'password'"
        placeholder="Введите пароль"
        :maxlength="100"
        size="default"
        show-password
        @blur="handleBlur"
        :class="{ 'error-field': passwordError }"
      />
      <div v-else class="password-placeholder"></div>
    </td>

    <td class="delete-cell">
      <el-icon class="delete-icon" @click="remove">
        <Delete />
      </el-icon>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Account } from '@/types/account'
import { useAccountsStore } from '@/stores/accounts'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  account: Account
}>()

const accountsStore = useAccountsStore()

const localLabels = ref(props.account.labels.map(l => l.text).join('; '))
const localType = ref<'local' | 'ldap'>(props.account.type)
const localLogin = ref(props.account.login)
const localPassword = ref(props.account.password || '')

const loginError = ref(false)
const passwordError = ref(false)

const showEditPassword = ref(false)

const validate = () => {
  loginError.value = !localLogin.value.trim()
  
  if (localType.value === 'local') {
    passwordError.value = !localPassword.value.trim()
  } else {
    passwordError.value = false
  }
}

const save = () => {
  const parsedLabels = accountsStore.parseLabels(localLabels.value)
  
  accountsStore.updateAccount(props.account.id, {
    labels: parsedLabels,
    type: localType.value,
    login: localLogin.value,
    password: localType.value === 'local' ? localPassword.value : null
  })
}

const handleBlur = () => {
  validate()
  if (!loginError.value && !(localType.value === 'local' && passwordError.value)) {
    save()
  }
}

const handleTypeChange = () => {
  if (localType.value === 'ldap') {
    localPassword.value = ''
    passwordError.value = false
  }
  validate()
  if (!loginError.value && !(localType.value === 'local' && passwordError.value)) {
    save()
  }
}

const remove = () => {
  accountsStore.deleteAccount(props.account.id)
}
</script>

<style scoped>
.account-row:hover {
  background-color: #f5f7fa;
}

.labels-cell {
  vertical-align: top;
}

.labels-edit {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.password-placeholder {
  min-height: 32px;
  line-height: 32px;
  padding: 0 4px;
  font-size: 14px;
  color: #333;
}

.delete-cell {
  width: 50px;
  text-align: center;
  vertical-align: middle;
}

.delete-icon {
  font-size: 18px;
  color: #dc3545;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.delete-icon:hover {
  opacity: 1;
  transform: scale(1.1);
  color: #dc3545;
}

.error-field :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  padding-right: 8px;
}

:deep(.el-input__suffix-inner) {
  display: flex;
  align-items: center;
}

:deep(.el-input__icon) {
  font-size: 16px;
  color: #909399;
  transition: color 0.2s ease;
}

:deep(.el-input__icon:hover) {
  color: #409eff;
}

@media (max-width: 768px) {
  .account-row td {
    padding: 12px;
  }
  
  .delete-cell {
    background: white;
    box-shadow: -2px 0 5px rgba(0,0,0,0.05);
  }
}
</style>