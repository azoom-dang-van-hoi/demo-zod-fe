<template>
  <div>
    <p>User name: {{ user.name }}</p>
    <p>User email: {{ user.email }}</p>
    <users-form @onSubmit="onSubmit" />
  </div>
</template>

<script>
import { getRequestSchema, pathified } from '@/util'
import { apiClient } from '@/zod-client'
const userStore = pathified('user')
export default {
  name: 'IndexPage',
  computed: {
    user: userStore.$get('user'),
  },
  created() {
    userStore.$dispatch('fetchUser')
  },
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
