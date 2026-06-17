export interface User {
  id: number
  email: string
  created_at: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface Company {
  id: number
  name: string
  type: string
  size: string
  location: string
  website?: string
  notes?: string
}

export interface Job {
  id: number
  role: string
  type: string
  qualification: string
  tech_requirements: string
  soft_skills: string
  company_id: number
}

export type ApplicationStatus = 'applied' | 'in_progress' | 'rejected' | 'offer_received' | 'accepted' | 'withdrawn'

export interface Application {
  id: number
  job_id: number
  status: ApplicationStatus
  date_applied: string
  cv_url?: string
  cover_letter_url?: string
}

export type InterviewType = 'behavioural' | 'technical' | 'phone_screen'
export type InterviewerRole = 'hr' | 'technical' | 'manager' | 'ceo'
export type InterviewOutcome = 'passed' | 'failed' | 'pending'

export interface Interview {
  id: number
  application_id: number
  type: InterviewType
  interviewer_role: InterviewerRole
  date: string
  questions?: string
  outcome: InterviewOutcome
  feeling: number
}