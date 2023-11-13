<template>
  <div>
    <p>User name: {{ user.name }}</p>
    <p>User email: {{ user.email }}</p>
    <users-form @onSubmit="onSubmit" />
  </div>
</template>

<script>
import { apiClient } from '@dangvanhoi/demo-zod-api'
import { getRequestSchema, pathified } from '@/util'
const userStore = pathified('user')
export default {
  name: 'IndexPage',
  computed: {
    user: userStore.$get('user'),
  },
  created() {
    userStore.$dispatch('fetchUser')
  },
  validations: {},
  methods: {
    onSubmit(user) {
      const schema = getRequestSchema(apiClient, {
        alias: 'createUser',
        paramName: 'user',
      })
      console.log(user, schema.shape)
    },
  },
}
</script>
