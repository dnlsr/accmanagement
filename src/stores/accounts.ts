import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account } from '@/types/account'
import { useLocalStorage } from '@vueuse/core'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = useLocalStorage<Account[]>('account-manager-accounts', [])

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2)

  const parseLabels = (labelsString: string): { text: string }[] => {
    if (!labelsString.trim()) return []
    return labelsString
      .split(';')
      .map(label => label.trim())
      .filter(label => label.length > 0)
      .map(text => ({ text }))
  }

  const addAccount = () => {
    const newAccount: Account = {
      id: generateId(),
      labels: [],
      type: 'local',
      login: '',
      password: '',
      isEditing: true
    }
    accounts.value.push(newAccount)
  }

  const updateAccount = (id: string, data: Partial<Account>) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...data }
    }
  }

  const deleteAccount = (id: string) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
    }
  }

  const saveAccount = (id: string, labels: string, type: 'local' | 'ldap', login: string, password: string) => {
    const parsedLabels = parseLabels(labels)
    updateAccount(id, {
      labels: parsedLabels,
      type,
      login,
      password: type === 'local' ? password : null,
      isEditing: false
    })
  }

  const editAccount = (id: string) => {
    updateAccount(id, { isEditing: true })
  }

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    saveAccount,
    editAccount,
    parseLabels
  }
})