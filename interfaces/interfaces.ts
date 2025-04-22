import type { Document } from "mongoose"

export interface SERVICESCATEGORYINTERFACE extends Document {
  name: string
  description?: string
  createdBy: string
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface SERVICESPERIODINTERFACE extends Document {
  servicesPeriodByNumber: number
  servicesPeriodByWord: "week" | "month" | "year" | "day" | "days" | "hour" | "hours" | "minute" | "minutes"
  createdBy: string
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface SERVICESINTERFACE extends Document {
  servicesPeriod: string
  servicesCategory: string
  washFrequency: number
  washingFolding: number
  ironing: string
  maximumKg: number
  total: number
  description?: string
  createdBy: string
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceWithReferences {
  _id: string
  servicesPeriod: {
    _id: string
    servicesPeriodByNumber: number
    servicesPeriodByWord: string
  }
  servicesCategory: {
    _id: string
    name: string
  }
  washFrequency: number
  washingFolding: number
  ironing: string
  maximumKg: number
  total: number
  description?: string
  createdAt: string
  updatedAt: string
}
