<template>
  <tr class="account-row">
    <td>
      <div v-if="!isEditing" class="labels-display">
        <span v-for="(label, index) in account.labels" :key="index" class="label-tag">
          {{ label.text }}
        </span>
        <span v-if="account.labels.length === 0" class="empty-label">—</span>
      </div>
      <el-input
        v-else
        v-model="localLabels"
        placeholder="Метки через ;"
        :maxlength="50"
        @blur="validate"
      />
      <div v-if="isEditing" class="hint">Макс. 50 символов, разделитель ";"</div>
    </td>

    <td>
      <div v-if="!isEditing" class="type-display">
        {{ account.type === 'local' ? 'Локальная' : 'LDAP' }}
      </div>
      <el-select
        v-else
        v-model="localType"
        placeholder="Тип записи"
        @change="onTypeChange"
      >
        <el-option label="Локальная" value="local" />
        <el-option label="LDAP" value="ldap" />
      </el-select>
    </td>

    <td>
      <div v-if="!isEditing" class="login-display">
        {{ account.login }}
      </div>
      <el-input
        v-else
        v-model="localLogin"
        placeholder="Логин"
        :maxlength="100"
        @blur="validate"
        :class="{ 'error-field': loginError }"
      />
    </td>

    <td>
      <div v-if="!isEditing" class="password-display">
        {{ account.type === 'local' ? '••••••' : '—' }}
      </div>
      <el-input
        v-else-if="localType === 'local'"
        v-model="localPassword"
        type="password"
        placeholder="Пароль"
        :maxlength="100"
        show-password
        @blur="validate"
        :class="{ 'error-field': passwordError }"
      />
      <div v-else class="password-display">—</div>
    </td>

    <td class="actions-cell">
      <div v-if="isEditing" class="edit-actions">
        <el-button type="primary" size="small" @click="save" :disabled="hasError">
          Сохранить
        </el-button>
        <el-button v-if="!isNew" size="small" @click="cancel">
          Отмена
        </el-button>
      </div>
      <div v-else class="view-actions">
        <el-button type="warning" size="small" @click="edit">
          Изменить
        </el-button>
        <el-button type="danger" size="small" @click="remove">
          Удалить
        </el-button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Account } from '@/types/account'
import { useAccountsStore } from '@/stores/accounts'

const props = defineProps<{
  account: Account
  isNew?: boolean
}>()

const emit = defineEmits<{
  save: [id: string, labels: string, type: 'local' | 'ldap', login: string, password: string]
  cancel: [id: string]
}>()

const accountsStore = useAccountsStore()

const localLabels = ref(props.account.labels.map(l => l.text).join('; '))
const localType = ref<'local' | 'ldap'>(props.account.type)
const localLogin = ref(props.account.login)
const localPassword = ref(props.account.password || '')

const loginError = ref(false)
const passwordError = ref(false)

const isEditing = computed(() => props.account.isEditing)
const hasError = computed(() => loginError.value || (localType.value === 'local' && passwordError.value))

const validate = () => {
  loginError.value = !localLogin.value.trim()
  if (localType.value === 'local') {
    passwordError.value = !localPassword.value.trim()
  } else {
    passwordError.value = false
  }
}

const onTypeChange = () => {
  if (localType.value === 'ldap') {
    localPassword.value = ''
    passwordError.value = false
  }
  validate()
}

const save = () => {
  validate()
  if (!hasError.value) {
    emit('save', props.account.id, localLabels.value, localType.value, localLogin.value, localPassword.value)
  }
}

const edit = () => {
  accountsStore.editAccount(props.account.id)
}

const remove = () => {
  accountsStore.deleteAccount(props.account.id)
}

const cancel = () => {
  if (props.isNew) {
    accountsStore.deleteAccount(props.account.id)
  } else {
    localLabels.value = props.account.labels.map(l => l.text).join('; ')
    localType.value = props.account.type
    localLogin.value = props.account.login
    localPassword.value = props.account.password || ''
    loginError.value = false
    passwordError.value = false
    emit('cancel', props.account.id)
  }
}

watch([localLogin, localPassword], () => {
  if (isEditing.value) validate()
})
</script>

<style scoped>
.account-row:hover {
  background-color: #fafafa;
}
.labels-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.label-tag {
  background-color: #e8f4ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.empty-label {
  color: #999;
  font-style: italic;
}
.hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
.actions-cell {
  width: 200px;
}
.edit-actions, .view-actions {
  display: flex;
  gap: 8px;
}
.error-field :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}
</style>