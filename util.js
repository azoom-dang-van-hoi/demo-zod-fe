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
