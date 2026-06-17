import client from './client'
import type { Company } from '../types'

export const getCompanies = async (): Promise<Company[]> => {
    const response = await client.get<Company[]>('/companies/')
    return response.data    
}

export const createCompany = async (data: Omit<Company, 'id'>): Promise<Company> => {
  const response = await client.post<Company>('/companies/', data)
  return response.data
}

export const deleteCompany = async (id: number): Promise<void> => {
    await client.delete(`/companies/${id}/`)
}