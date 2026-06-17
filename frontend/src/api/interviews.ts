import client from './client'
import type { Interview } from '../types'

export const getInterviews = async (): Promise<Interview[]> => {
    const response = await client.get<Interview[]>('/interviews/')
    return response.data 
}

export const createInterview = async (data: Omit<Interview, 'id'>): Promise<Interview> => {
    const response = await client.post<Interview>('/interviews/', data)
    return response.data
}

export const deleteInterview = async (id: number): Promise<void> => {
    await client.delete(`/interviews/${id}`)
}

export const updateInterview = async ({ id, data }: { id: number; data: Partial<Omit<Interview, 'id'>> }): Promise<Interview> => {
    const response = await client.put<Interview>(`/interviews/${id}/`, data)
    return response.data
}