import type { Context } from 'hono'
import { createUserSchema, updateUserSchema } from './user.schema'
import { userService, UserNotFoundError } from './user.service'

export const userController = {
  async getAll(c: Context) {
    const users = await userService.getAll()
    return c.json({ data: users })
  },

  async getById(c: Context) {
    const id = c.req.param('id')

    try {
      const user = await userService.getById(id)
      return c.json({ data: user })
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        return c.json({ error: err.message }, 404)
      }
      throw err
    }
  },

  async create(c: Context) {
    const body = await c.req.json().catch(() => null)

    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return c.json(
        {
          error: 'Body tidak valid',
          details: parsed.error.flatten(),
        },
        400,
      )
    }

    const user = await userService.create(parsed.data)
    return c.json({ data: user }, 201)
  },

  async update(c: Context) {
    const id = c.req.param('id')
    const body = await c.req.json().catch(() => null)

    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return c.json(
        {
          error: 'Body tidak valid',
          details: parsed.error.flatten(),
        },
        400,
      )
    }

    try {
      const user = await userService.update(id, parsed.data)
      return c.json({ data: user })
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        return c.json({ error: err.message }, 404)
      }
      throw err
    }
  },

  async delete(c: Context) {
    const id = c.req.param('id')

    try {
      await userService.delete(id)
      return c.json({ message: 'User berhasil dihapus' })
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        return c.json({ error: err.message }, 404)
      }
      throw err
    }
  },
}
