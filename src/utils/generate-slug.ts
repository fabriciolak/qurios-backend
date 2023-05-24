import slugify from 'slugify'

export function generateSlug(title: string): string {
  slugify.extend({ ㅤ: '-' })
  const slug = slugify(title, {
    replacement: '-',
    remove: /[*+~.()'"!?:@ㅤ]/g,
    lower: true,
    trim: true,
    locale: 'pt',
  })

  return slug
}
