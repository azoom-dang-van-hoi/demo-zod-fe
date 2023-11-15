import Vue from 'vue'
import { apiClient } from '@dangvanhoi/demo-zod-api'
import z from 'zod'

const zodMixins = {
  install(Vue) {
    Vue.mixin({
      data() {
        if (this.$options.zodValidations?.bindingError) {
          return {
            errors: {},
          }
        }
        return {}
      },
      beforeCreate() {
        if (this.$options.zodValidations) {
          const { alias, paramName, schema, validations } =
            this.$options.zodValidations

          const requestSchema =
            schema ||
            getRequestSchema({
              alias,
              paramName,
            })

          const validationSchema = generateZodValidations(this, requestSchema)
          this.$options.validations =
            typeof validations === 'function'
              ? validations(validationSchema)
              : validationSchema
        }
      },
    })
  },
}

export function getRequestSchemas({ alias }) {
  const api = apiClient.find((i) => i.alias === alias)
  if (!api) {
    // Capture error by sentry
    console.error(`Can't get request schemas of ${alias}`)
    return null
  }
  return (api.parameters || []).reduce(
    (schema, param) => ({
      ...schema,
      [param.name]:
        param.type === 'Body'
          ? param.schema
          : z.object({ [param.name]: param.schema }),
    }),
    {}
  )
}

export function getRequestSchema({ alias, paramName }) {
  const schemas = getRequestSchemas({ alias })
  // Capture error by sentry
  if (!schemas) {
    return z.object({})
  }
  if (schemas[paramName]) {
    return schemas[paramName]
  }
  // Capture error by sentry
  console.error(`Param not found: ${paramName}`)
  return z.object({})
}

function isZodObject(obj) {
  return obj?._def?.typeName === 'ZodObject'
}

function generateZodValidations(vm, schema, errorKey) {
  if (isZodObject(schema)) {
    const shapes = Object.keys(schema.shape).map((key) =>
      isZodObject(schema.shape[key])
        ? {
            [key]: generateZodValidations(
              vm,
              schema.shape[key],
              `${errorKey ? errorKey + '.' : ''}${key}`
            ),
          }
        : {
            [key]: {
              zodValidate: (val) => {
                const parseVal = schema.shape[key].safeParse(val)
                if (!vm.errors) {
                  return parseVal.success
                }
                if (!parseVal.success) {
                  vm.$set(
                    vm.errors,
                    `${errorKey ? errorKey + '.' : ''}${key}`,
                    parseVal.error.format()._errors
                  )
                } else {
                  vm.$set(
                    vm.errors,
                    `${errorKey ? errorKey + '.' : ''}${key}`,
                    undefined
                  )
                }
                return parseVal.success
              },
            },
          }
    )
    return shapes.reduce((acc, shape) => {
      return {
        ...acc,
        ...shape,
      }
    }, {})
  }
  return {}
}

Vue.use(zodMixins)
