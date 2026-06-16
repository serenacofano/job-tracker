import client from './client'
import type { Application } from '../types'

export const getApplications = async (): Promise<Application[]> => {
  const response = await client.get<Application[]>('/applications/')
  return response.data
}