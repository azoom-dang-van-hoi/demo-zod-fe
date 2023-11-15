<template>
  <div class="organization-form">
    <p><span>Organization name</span> <input v-model="name" type="text" /></p>
    <p><span>Organization email</span> <input v-model="email" type="text" /></p>
  </div>
</template>
<script>
import { getRequestSchema } from '@/plugins/zod-validation'
export default {
  name: 'OrganizationForm',
  data() {
    return {
      name: '',
      email: '',
    }
  },
  zodValidations: {
    schema: getRequestSchema({
      alias: 'createOrganization',
      paramName: 'organization',
    }).omit({ organization: true }),
  },
}
</script>
<style>
.organization-form {
  display: flex;
}

.organization-form input {
  padding: 4px 12px;
  font-size: 16px;
}

.organization-form input.error {
  border: red;
}
</style>
