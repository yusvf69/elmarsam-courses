import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems(),
      S.listItem()
        .title('Quizzes')
        .child(S.component().title('Quizzes').component(require('next/dynamic').default(async () => (await import('../app/(admin)/studio/quizzes')).default, { ssr: false }))),
    ])
