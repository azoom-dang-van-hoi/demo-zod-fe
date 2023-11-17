<template>
  <div>
    <p>User form</p>
    <p :class="{ error: $v.user?.name?.$error }">
      User name: <input v-model="user.name" @change="$v?.user?.name?.$touch" />
    </p>
    <span v-if="$v.user?.name?.$error" class="error-message">{{
      errors.name[0]
    }}</span>
    <p :class="{ error: $v.user?.age?.$error }">
      User age: <input v-model="user.age" @change="$v?.user?.age?.$touch" />
    </p>
    <span v-if="$v.user?.age?.$error" class="error-message">{{
      errors.age[0]
    }}</span>
    <p :class="{ error: $v.user?.email?.$error }">
      User email:
      <input v-model="user.email" @change="$v?.user?.email?.$touch" />
    </p>
    <span v-if="$v.user?.email?.$error" class="error-message">{{
      errors.email[0]
    }}</span>
    <p :class="{ error: $v.user?.organizationId?.$error }">
      Organization id:
      <input
        v-model="user.organizationId"
        @change="$v?.user?.organizationId?.$touch"
      />
    </p>
    <span v-if="$v.user?.organizationId?.$error" class="error-message">{{
      errors.organizationId[0]
    }}</span>
    <p :class="{ error: $v.user?.address?.city?.$error }">
      Address (city):
      <input
        v-model="user.address.city"
        @change="$v?.user?.address?.city?.$touch"
      />
    </p>
    <span v-if="$v.user?.address?.city?.$error" class="error-message">{{
      errors.address.city[0]
    }}</span>
    <p :class="{ error: $v.user?.address?.street?.$error }">
      Address (street):
      <input
        v-model="user.address.street"
        @change="$v?.user?.address?.street?.$touch"
      />
    </p>
    <span v-if="$v.user?.address?.street?.$error" class="error-message">{{
      errors.address.street[0]
    }}</span>
    <table class="car-table">
      <thead>
        <tr class="car-row">
          <th class="car-header">Name</th>
          <th class="car-header">Color</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(car, index) in user.cars" :key="index" class="car-row">
          <td class="car-cell">
            <input
              v-model="car.name"
              class="car-input"
              :class="{
                error: $v?.user?.cars?.$each?.$iter[index]?.name?.$error,
              }"
              @change="$v?.user?.cars?.$each?.$iter[index]?.name?.$touch"
            />
          </td>
          <td class="car-cell">
            <input
              v-model="car.color"
              class="car-input"
              :class="{
                error: $v?.user?.cars?.$each?.$iter[index]?.color?.$error,
              }"
              @change="$v?.user?.cars?.$each?.$iter[index]?.color?.$touch"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addCar">Add car</button>
    <br />
    <p></p>
    <button @click="submit">Submit</button>
  </div>
</template>
<script>
export default {
  name: 'CreateUserForm',
  data() {
    return {
      user: {
        name: '',
        email: '',
        age: null,
        organizationId: null,
        address: {
          city: '',
          street: '',
        },
        cars: [],
      },
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
    addCar() {
      this.user.cars.push({
        name: '',
        color: '',
      })
    },
  },

  zodValidations: {
    alias: 'createUser',
    paramName: 'user',
    bindingError: true,
    validations(schema) {
      return {
        user: {
          ...schema,
          organization: {},
        },
      }
    },
  },
}
</script>

<style>
.error {
  color: red;
}

.error-message {
  color: red;
  font-size: 12px;
}

.car-table {
  margin-top: 20px;
  border-collapse: collapse;
}
.car-header {
  background-color: #4caf50;
  color: white;
  text-align: left;
}
.car-cell {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.car-input.error {
  border: 1px solid red;
}
.car-row:hover {
  background-color: #f5f5f5;
}
</style>
