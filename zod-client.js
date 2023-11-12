import { makeErrors, makeApi } from '@zodios/core'
import z from 'zod'

const errors = makeErrors([
  {
    status: 'default',
    schema: z.object({
      error: z.object({
        code: z.number(),
        message: z.string(),
      }),
    }),
  },
])

const user = z.object({
  id: z.number(),
  name: z.string(),
  age: z.coerce.number().positive(),
  email: z.string().email(),
})

export const apiClient = makeApi([
  {
    method: 'get',
    path: '/users',
    alias: 'getUsers',
    response: z.array(user),
  },
  {
    method: 'get',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        description: 'User id',
      },
    ],
    path: '/users/:id',
    alias: 'getUser',
    response: user,
    errors,
  },
  {
    method: 'post',
    path: '/users',
    alias: 'createUser',
    parameters: [
      {
        name: 'user',
        type: 'Body',
        schema: user.omit({ id: true }),
      },
    ],
    response: user,
    errors,
  },
])
