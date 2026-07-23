import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import * as tagService from './tags.service'
import { TagSchema, ListTagsResponseSchema } from './tags.schema'

const tags = new OpenAPIHono()

const listRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Tags'],
  responses: {
    200: {
      content: { 'application/json': { schema: ListTagsResponseSchema } },
      description: 'List of tags',
    },
  },
})

tags.openapi(listRoute, async (c) => {
  const result = await tagService.listTags()
  return c.json(result)
})

export default tags
