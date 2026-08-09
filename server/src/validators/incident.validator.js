import { z } from 'zod'

import { INCIDENT_STATUS_VALUES } from '../constants/incident-status.js'

const incidentIdSchema = z.coerce
  .number({
    error: 'Incident ID must be a number'
  })
  .int('Incident ID must be an integer')
  .positive('Incident ID must be greater than 0')

const customerIdSchema = z.coerce
  .number({
    error: 'Customer ID must be a number'
  })
  .int('Customer ID must be an integer')
  .positive('Customer ID must be greater than 0')

const technicianIdSchema = z.coerce
  .number({
    error: 'Technician ID must be a number'
  })
  .int('Technician ID must be an integer')
  .positive('Technician ID must be greater than 0')

const productCodeSchema = z
  .string()
  .trim()
  .min(1, 'Product code is required')
  .max(10, 'Product code must not exceed 10 characters')
  .regex(/^[A-Za-z0-9]+$/, 'Product code may only contain letters and numbers')
  .transform((value) => value.toUpperCase())

const titleSchema = z
  .string()
  .trim()
  .min(1, 'Incident title is required')
  .max(50, 'Incident title must not exceed 50 characters')

const descriptionSchema = z.string().trim().min(1, 'Incident description is required')

const incidentIdParamsSchema = z.object({
  incidentId: incidentIdSchema
})

const createIncidentBodySchema = z
  .object({
    customerId: customerIdSchema.optional(),
    productCode: productCodeSchema,
    title: titleSchema,
    description: descriptionSchema
  })
  .strict()

const updateIncidentBodySchema = z
  .object({
    productCode: productCodeSchema.optional(),
    title: titleSchema.optional(),
    description: descriptionSchema.optional()
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'At least one incident field must be provided')

const assignTechnicianBodySchema = z
  .object({
    techId: technicianIdSchema
  })
  .strict()

const updateIncidentStatusBodySchema = z
  .object({
    status: z.enum(INCIDENT_STATUS_VALUES, {
      error: 'Invalid incident status'
    })
  })
  .strict()

export const incidentIdParamsOnlySchema = z.object({
  params: incidentIdParamsSchema
})

export const createIncidentSchema = z.object({
  body: createIncidentBodySchema
})

export const updateIncidentSchema = z.object({
  params: incidentIdParamsSchema,
  body: updateIncidentBodySchema
})

export const assignTechnicianSchema = z.object({
  params: incidentIdParamsSchema,
  body: assignTechnicianBodySchema
})

export const updateIncidentStatusSchema = z.object({
  params: incidentIdParamsSchema,
  body: updateIncidentStatusBodySchema
})
