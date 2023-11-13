import Vue from 'vue'
import { apiClient } from '@dangvanhoi/demo-zod-api'
import z from 'zod'

const zodMixins = {
  install(Vue) {
    Vue.mixin({
      beforeCreate() {
        if (this.$options.zodValidations) {
          const { alias, paramName, schema, validations } =
            this.$options.zodValidations

          const requestSchema =
            schema ||
            getRequestSchema(apiClient, {
              alias,
              paramName,
            })

          const validationSchema = generateZodValidations(this, requestSchema, 'user')
          this.$options.validations =
            typeof validations === 'function'
              ? validations(validationSchema)
              : validationSchema
        }
      },
    })
  },
}

function getRequestSchemas(apis = [], { alias }) {
  const api = apis.find((i) => i.alias === alias)
  if (!api) {
    throw new Error(`Can't get request schemas of ${alias}`)
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

function getRequestSchema(apis = [], { alias, paramName }) {
  const schemas = getRequestSchemas(apis, { alias })
  if (schemas[paramName]) {
    return schemas[paramName]
  }
  throw new Error('Param not found')
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
              `${errorKey}.${key}`
            ),
          }
        : {
            [key]: {
              zodValidate: (val) => {
                const parseVal = schema.shape[key].safeParse(val)
                if (!parseVal.success) {
                  vm.$set(
                    vm.errors,
                    `${errorKey}.${key}`,
                    parseVal.error.format()._errors
                  )
                } else {
                  vm.$set(vm.errors, `${errorKey}.${key}`, undefined)
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
