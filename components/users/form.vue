<template>
  <div>
    <p>User form</p>
    <p :class="{ error: $v.user.name.$error }">
      User name: <input v-model="user.name" @change="$v.user.name.$touch" />
    </p>
    <p :class="{ error: $v.user.age.$error }">
      User age: <input v-model="user.age" @change="$v.user.age.$touch" />
    </p>
    <p :class="{ error: $v.user.email.$error }">
      User email: <input v-model="user.email" @change="$v.user.email.$touch" />
    </p>
    <button @click="submit">Submit</button>
  </div>
</template>
<script>
// import { required } from 'vuelidate/lib/validators'
import { getRequestSchema } from '@/util'
import { apiClient } from '@/zod-client'
const schema = getRequestSchema(apiClient, {
  alias: 'createUser',
  paramName: 'user',
})
export default {
  name: 'CreateUserForm',
  data() {
    return {
      user: {
        name: '',
        email: '',
        age: null,
      },
    }
  },
  methods: {
    submit() {
      this.$emit('onSubmit', this.user)
    },
  },

  validations() {
    return {
      user: {
        name: {
          required: (vm) => {
            return schema.shape.name.safeParse(vm).success
          },
        },
        email: {
          required: (vm) => {
            return schema.shape.email.safeParse(vm).success
          },
        },
        age: {
          required: (vm) => {
            return schema.shape.age.safeParse(vm).success
          },
        },
      },
    }
  },
}
</script>

<style>
.error {
  color: red;
}
</style>
