import { z } from 'zod'

const technicianIdSchema = z.coerce
  .number({
    error: 'Technician ID must be a number'
  })
  .int('Technician ID must be an integer')
  .positive('Technician ID must be greater than 0')

const firstNameSchema = z
  .string()
  .trim()
  .min(1, 'First name is required')
  .max(50, 'First name must not exceed 50 characters')

const lastNameSchema = z
  .string()
  .trim()
  .min(1, 'Last name is required')
  .max(50, 'Last name must not exceed 50 characters')

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('A valid email address is required')
  .max(100, 'Email must not exceed 100 characters')

const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .max(20, 'Phone number must not exceed 20 characters')
  .regex(/^[0-9+()\-\s]+$/, 'Phone number contains invalid characters')

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters')
  .max(72, 'Password must not exceed 72 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

const createTechnicianBodySchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema
  })
  .strict()

const updateTechnicianBodySchema = z
  .object({
    firstName: firstNameSchema.optional(),
    lastName: lastNameSchema.optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional()
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'At least one technician field must be provided')

const technicianIdParamsSchema = z.object({
  techId: technicianIdSchema
})

export const createTechnicianSchema = z.object({
  body: createTechnicianBodySchema
})

export const updateTechnicianSchema = z.object({
  body: updateTechnicianBodySchema,
  params: technicianIdParamsSchema
})

export const technicianIdParamsOnlySchema = z.object({
  params: technicianIdParamsSchema
})
