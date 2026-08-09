import { z } from 'zod'

const customerIdSchema = z.coerce
  .number({
    error: 'Customer ID must be a number'
  })
  .int('Customer ID must be an integer')
  .positive('Customer ID must be greater than 0')

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

const addressSchema = z.string().trim().min(1, 'Address is required').max(50, 'Address must not exceed 50 characters')

const citySchema = z.string().trim().min(1, 'City is required').max(50, 'City must not exceed 50 characters')

const stateSchema = z.string().trim().min(1, 'State is required').max(50, 'State must not exceed 50 characters')

const postalCodeSchema = z
  .string()
  .trim()
  .min(1, 'Postal code is required')
  .max(20, 'Postal code must not exceed 20 characters')

const countryCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(2, 'Country code must contain exactly 2 characters')
  .regex(/^[A-Z]{2}$/, 'Country code must contain letters only')

const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .max(20, 'Phone number must not exceed 20 characters')
  .regex(/^[0-9+()\-\s]+$/, 'Phone number contains invalid characters')

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('A valid email address is required')
  .max(100, 'Email must not exceed 100 characters')

const updateCustomerBodySchema = z
  .object({
    firstName: firstNameSchema.optional(),
    lastName: lastNameSchema.optional(),
    address: addressSchema.optional(),
    city: citySchema.optional(),
    state: stateSchema.optional(),
    postalCode: postalCodeSchema.optional(),
    countryCode: countryCodeSchema.optional(),
    phone: phoneSchema.optional(),
    email: emailSchema.optional()
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'At least one customer field must be provided')

const customerIdParamsSchema = z.object({
  customerId: customerIdSchema
})

const searchCustomersQuerySchema = z
  .object({
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name search term is required')
      .max(50, 'Last name search term must not exceed 50 characters')
  })
  .strict()

export const customerIdParamsOnlySchema = z.object({
  params: customerIdParamsSchema
})

export const searchCustomersSchema = z.object({
  query: searchCustomersQuerySchema
})

export const updateCustomerSchema = z.object({
  params: customerIdParamsSchema,
  body: updateCustomerBodySchema
})
