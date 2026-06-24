import client from './client'
import type { Skill, SkillCategory } from '../types'

export const getSkills = async (): Promise<Skill[]> => {
  const response = await client.get<Skill[]>('/skills/')
  return response.data
}

export const createSkill = async (data: { name: string; category: SkillCategory }): Promise<Skill> => {
  const response = await client.post<Skill>('/skills/', data)
  return response.data
}

export const deleteSkill = async (id: number): Promise<void> => {
  await client.delete(`/skills/${id}/`)
}