export type ClaimStatus = "Pending" | "Approved" | "Rejected"

export interface Claim {
  _id: string
  name: string
  email: string
  claimAmount: number
  description: string
  documentUrl: string
  status: ClaimStatus
  submissionDate: string
  approvedAmount?: number
  comments?: string
}

