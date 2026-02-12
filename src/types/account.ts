export interface Account {
  id: string
  labels: { text: string }[]
  type: 'local' | 'ldap'
  login: string
  password: string | null
  isEditing: boolean
}

export interface AccountForm {
  labels: string
  type: 'local' | 'ldap'
  login: string
  password: string
}