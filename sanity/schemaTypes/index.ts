import { type SchemaTypeDefinition } from 'sanity'
import { courseType } from './courseType'
import { moduleType } from './moduleType'
import { lessonType } from './lessonType'
import { instructorType } from './instructorType'
import { studentType } from './studentType'
import { enrollmentType } from './enrollmentType'
import { categoryType } from './categoryType'
import { lessonCompletionType } from './lessonCompletionType'

// Export all types for use in other files
export {
  courseType,
  moduleType,
  lessonType,
  instructorType,
  studentType,
  enrollmentType,
  categoryType,
  lessonCompletionType,
}

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    studentType,
    enrollmentType,
    categoryType,
    lessonCompletionType,
  ],
}
