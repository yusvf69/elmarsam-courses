import { defineCliConfig } from 'sanity/cli'

const projectId = 'xxxx' // استبدل بالـ projectId الحقيقي بتاعك
const dataset = 'production' // أو dataset اللي انت مستخدمه

export default defineCliConfig({
  api: { projectId, dataset }
})
