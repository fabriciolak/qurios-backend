import slugify from 'slugify'

export function generateSlug(title: string) {
  const slug = slugify(title, {
    replacement: '-',
    remove: /[*+~.()'"!?:@]/g,
    lower: true,
    trim: true,
    locale: 'pt',
  })

  return slug
}
