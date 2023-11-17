<template>
  <div>
    <users-form @onSubmit="onSubmit" />
  </div>
</template>

<script>
import { pathified } from '@/util'
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
      userStore.$dispatch('createUser', user)
    },
  },
}
</script>
