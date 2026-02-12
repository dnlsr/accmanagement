<template>
  <tr class="account-row">
    <!-- Метки -->
    <td style="vertical-align: top;">
      <div v-if="!isEditing" class="labels-display">
        <span v-for="(label, index) in account.labels" :key="index" class="label-tag">
          {{ label.text }}
        </span>
        <span v-if="account.labels.length === 0" class="empty-label">—</span>
      </div>
      <div v-else class="labels-edit">
        <el-input
          v-model="localLabels"
          placeholder="Введите метки через ;"
          :maxlength="50"
          @blur="validate"
        />
        <div class="hint">Максимум 50 символов, разделитель ";"</div>
      </div>
    </td>

    <!-- Тип записи -->
    <td>
      <div v-if="!isEditing" class="type-display">
        {{ account.type === 'local' ? 'Локальная' : 'LDAP' }}
      </div>
      <el-select
        v-else
        v-model="localType"
        placeholder="Выберите тип"
        @change="onTypeChange"
      >
        <el-option label="Локальная" value="local" />
        <el-option label="LDAP" value="ldap" />
      </el-select>
    </td>

    <!-- Логин -->
    <td>
      <div v-if="!isEditing" class="login-display">
        {{ account.login }}
      </div>
      <el-input
        v-else
        v-model="localLogin"
        placeholder="Введите логин"
        :maxlength="100"
        @blur="validate"
        :class="{ 'error-field': loginError }"
      />
    </td>

    <!-- Пароль -->
    <td>
      <div v-if="!isEditing" class="password-display">
        {{ account.type === 'local' ? '••••••' : '' }}
      </div>
      <el-input
        v-else-if="localType === 'local'"
        v-model="localPassword"
        type="password"
        placeholder="Введите пароль"
        :maxlength="100"
        show-password
        @blur="validate"
        :class="{ 'error-field': passwordError }"
      />
      <div v-else class="password-display"></div>
    </td>

    <!-- Кнопки действий -->
    <td class="actions-cell">
      <div v-if="isEditing" class="edit-actions">
        <el-button 
          type="primary" 
          size="small" 
          @click="save" 
          :disabled="hasError"
        >
          Сохранить
        </el-button>
        <el-button 
          v-if="!isNew" 
          size="small" 
          @click="cancel"
        >
          Отмена
        </el-button>
      </div>
      <div v-else class="view-actions">
        <el-button 
          type="warning" 
          size="small" 
          @click="edit"
        >
          Изменить
        </el-button>
        <el-button 
          type="danger" 
          size="small" 
          @click="remove"
        >
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

// Локальные состояния для редактирования
const localLabels = ref(props.account.labels.map(l => l.text).join('; '))
const localType = ref<'local' | 'ldap'>(props.account.type)
const localLogin = ref(props.account.login)
const localPassword = ref(props.account.password || '')

// Флаги ошибок
const loginError = ref(false)
const passwordError = ref(false)

const isEditing = computed(() => props.account.isEditing)
const hasError = computed(() => loginError.value || (localType.value === 'local' && passwordError.value))

// Валидация полей
const validate = () => {
  loginError.value = !localLogin.value.trim()
  
  if (localType.value === 'local') {
    passwordError.value = !localPassword.value.trim()
  } else {
    passwordError.value = false
  }
}

// Изменение типа записи
const onTypeChange = () => {
  if (localType.value === 'ldap') {
    localPassword.value = ''
    passwordError.value = false
  }
  validate()
}

// Сохранение
const save = () => {
  validate()
  if (!hasError.value) {
    emit('save', props.account.id, localLabels.value, localType.value, localLogin.value, localPassword.value)
  }
}

// Редактирование
const edit = () => {
  accountsStore.editAccount(props.account.id)
}

// Удаление
const remove = () => {
  accountsStore.deleteAccount(props.account.id)
}

// Отмена
const cancel = () => {
  if (props.isNew) {
    accountsStore.deleteAccount(props.account.id)
  } else {
    // Восстанавливаем исходные значения
    localLabels.value = props.account.labels.map(l => l.text).join('; ')
    localType.value = props.account.type
    localLogin.value = props.account.login
    localPassword.value = props.account.password || ''
    loginError.value = false
    passwordError.value = false
    emit('cancel', props.account.id)
  }
}

// Автовалидация при изменении
watch([localLogin, localPassword], () => {
  if (isEditing.value) {
    validate()
  }
})
</script>

<style scoped>
.account-row {
  transition: background-color 0.2s ease;
}

.account-row:hover {
  background-color: #fafafa;
}

/* Метки */
.labels-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.label-tag {
  background-color: #e8f4ff;
  color: #1890ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
}

.empty-label {
  color: #999;
  font-style: italic;
  line-height: 32px;
}

.labels-edit {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* Тип записи, Логин, Пароль */
.type-display,
.login-display,
.password-display {
  min-height: 32px;
  line-height: 32px;
  padding: 0 4px;
}

/* Кнопки */
.actions-cell {
  width: 210px;
}

.edit-actions,
.view-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Ошибки */
.error-field :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  td {
    padding: 12px 8px;
  }
  
  .label-tag {
    font-size: 12px;
    padding: 3px 8px;
  }
  
  .edit-actions,
  .view-actions {
    flex-direction: column;
    gap: 6px;
  }
  
  .actions-cell {
    width: auto;
  }
}
</style>