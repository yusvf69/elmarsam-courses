import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getCourses() {
  const getCoursesQuery = defineQuery(`*[_type == "course"] {
    _id,
    title,
    price,
    youtubeUrl,
    "slug": slug.current,
    description,
    image,
    category->{
      _id,
      name,
      description
    },
    modules[]->{
      _id,
      title
    },
    instructor->{
      _id,
      name,
      photo
    }
  }`);

  const courses = await sanityFetch({ query: getCoursesQuery });
  return courses.data;
}
