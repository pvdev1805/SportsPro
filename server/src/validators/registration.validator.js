import { z } from 'zod'

const customerIdSchema = z.coerce
  .number({
    error: 'Customer ID must be a number'
  })
  .int('Customer ID must be an integer')
  .positive('Customer ID must be greater than 0')

const productCodeSchema = z
  .string()
  .trim()
  .min(1, 'Product code is required')
  .max(10, 'Product code must not exceed 10 characters')
  .regex(/^[A-Za-z0-9]+$/, 'Product code may only contain letters and numbers')
  .transform((value) => value.toUpperCase())

const createRegistrationBodySchema = z
  .object({
    customerId: customerIdSchema.optional(),
    productCode: productCodeSchema
  })
  .strict()

const customerIdParamsSchema = z.object({
  customerId: customerIdSchema
})

export const createRegistrationSchema = z.object({
  body: createRegistrationBodySchema
})

export const customerRegistrationsSchema = z.object({
  params: customerIdParamsSchema
})
