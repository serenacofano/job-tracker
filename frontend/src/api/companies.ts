import client from './client'
import type { Company } from '../types'

export const getCompanies = async (): Promise<Company[]> => {
    const response = await client.get<Company[]>('/companies/')
    return response.data    
}