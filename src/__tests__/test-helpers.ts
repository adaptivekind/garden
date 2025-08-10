import path from 'path'

export const getTestGardenPath = () =>
  path.join(process.cwd(), 'test', 'test-gardens', 'garden1')
