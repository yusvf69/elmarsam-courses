import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getLessonById(id: string) {
  const getLessonByIdQuery =
    defineQuery(`*[_type == "lesson" && _id == $id][0] {
    ...,
    "videoFileUrl": videoFile.asset->url,
    "videoFileMimeType": videoFile.asset->mimeType,
    "module": module->{
      ...,
      "course": course->{...}
    }
  }`);

  const result = await sanityFetch({
    query: getLessonByIdQuery,
    params: { id },
  });

  return result.data;
}
