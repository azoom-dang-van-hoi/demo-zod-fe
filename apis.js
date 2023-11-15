import ky from 'ky-universal'
import { KyPlugin, KyZodios } from 'zodios-plugin-ky'
import { apiClient } from '@dangvanhoi/demo-zod-api'

export const apis = {
  ferry: ky,
}

export default function ({ $config }) {
  const ferryApiClient = new KyZodios($config.API_BASE_URL, apiClient, {
    validate: 'none',
  })
  ferryApiClient.use(
    KyPlugin({
      kyInstance: createAPI({
        apiBaseUrl: $config.API_BASE_URL,
      }),
    })
  )
  window.apiClient = apiClient
  apis.ferry = ferryApiClient
  window.apis = apis
}

function createAPI(config) {
  return ky.create({
    prefixUrl: config.apiBaseUrl,
    timeout: 30000,
    credentials: 'include',
  })
}
