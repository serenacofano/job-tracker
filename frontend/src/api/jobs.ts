import client from './client'
import type { Job } from '../types'

export const getJobs = async (): Promise<Job[]> => {
  const response = await client.get<Job[]>('/jobs/')
  return response.data
}

export const createJob = async (data: Omit<Job, 'id'>): Promise<Job> => {
  const response = await client.post<Job>('/jobs/', data)
  return response.data
}

export const deleteJob = async (id: number): Promise<void> => {
  await client.delete(`/jobs/${id}/`)
}