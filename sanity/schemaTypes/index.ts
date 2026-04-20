import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { news } from './news'
import { playlist } from './playlist'
import { categoryType } from './categoryType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, news, playlist, categoryType],
}
