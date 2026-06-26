import client from './client'
import type { Application, ApplicationStatus } from '../types'

export const getApplications = async (): Promise<Application[]> => {
  const response = await client.get<Application[]>('/applications/')
  return response.data
}

export const getApplication = async (id: number): Promise<Application> => {
  const response = await client.get<Application>(`/applications/${id}/`)
  return response.data
}

export const createApplication = async (data: {
    job_id: number; 
    status: ApplicationStatus; 
    date_applied: string; 
    cv_url?: string; 
    cover_letter_url?: string 
}): Promise<Application> => {
    const response = await client.post<Application>('/applications/', data)
    return response.data
}

export const deleteApplication = async (id: number): Promise<void> => {
    await client.delete(`/applications/${id}/`)
}

export const updateApplication = async ({ id, data }: { id: number; data: Partial<Omit<Application, 'id'>> }): Promise<Application> => {
  const response = await client.put<Application>(`/applications/${id}/`, data)
  return response.data
}
