import client from './client'
import type { Job } from '../types'

export const getJobs = async (): Promise<Job[]> => {
  const response = await client.get<Job[]>('/jobs/')
  return response.data
}