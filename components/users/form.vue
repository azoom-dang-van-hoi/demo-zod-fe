<template>
  <div>
    <p>User form</p>
    <p :class="{ error: $v.user?.name?.$error }">
      User name: <input v-model="user.name" @change="$v.user?.name?.$touch" />
    </p>
    <p :class="{ error: $v?.user?.age?.$error }">
      User age: <input v-model="user.age" @change="$v.user?.age?.$touch" />
    </p>
    <p :class="{ error: $v?.user?.email?.$error }">
      User email:
      <input v-model="user.email" @change="$v.user?.email?.$touch" />
    </p>
    <button @click="submit">Submit</button>
  </div>
</template>
<script>
// import { required } from 'vuelidate/lib/validators'
import { apiClient } from '@dangvanhoi/demo-zod-api'
import { getRequestSchema, generateZodValidations } from '@/util'
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
      errors: {},
    }
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      this.$emit('onSubmit', this.user)
    },
  },

  validations() {
    return {
      user: {
        ...generateZodValidations(schema, this),
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
