import { get, dispatch, sync, commit } from 'vuex-pathify'
import z from 'zod'
export const pathified = (moduleName) => {
  const fullPath = (path) => {
    if (path.startsWith('/')) {
      return path.substring(1)
    } else {
      return `${moduleName}/${path}`
    }
  }
  return {
    $get: (path) => get(fullPath(path)),
    $sync: (path) => sync(fullPath(path)),
    $commit: (path, payload) => commit(fullPath(path), payload),
    $dispatch: async (path, payload) => {
      try {
        return await dispatch(fullPath(path), payload)
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    },
  }
}

export const getRequestSchemas = (apis = [], { alias }) => {
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

export const getRequestSchema = (apis = [], { alias, paramName }) => {
  const schemas = getRequestSchemas(apis, { alias })
  if (schemas[paramName]) {
    return schemas[paramName]
  }
  throw new Error('Param not found')
}

export const isZodObject = (obj) => {
  return obj?._def?.typeName === 'ZodObject'
}

export const generateZodValidations = (schema, vm, errors) => {
  if (isZodObject(schema)) {
    const shapes = Object.keys(schema.shape).map((key) =>
      isZodObject(schema.shape[key])
        ? {
            [key]: generateZodValidations(schema.shape[key], vm, (errors || vm.errors)[key]),
          }
        : {
            [key]: {
              zodValidate: (val) => {
                const parseVal = schema.shape[key].safeParse(val)
                if (!parseVal.success) {
                  vm.$set(errors || vm.errors, key, parseVal.error.format()._errors)
                  // this.errors.name = val.error.format()._errors
                } else {
                  vm.$set(errors || vm.errors, key, undefined)
                }
                return parseVal.success
              },
            },
          }
    )
    return shapes.reduce((acc, shape) => {
      console.log(shape)
      return {
        ...acc,
        ...shape,
      }
    }, {})
  }
  return {}
}
