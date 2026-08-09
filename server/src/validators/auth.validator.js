import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('A valid email address is required')
  .max(100, 'Email must not exceed 100 characters')

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters')
  .max(72, 'Password must not exceed 72 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

const requiredText = (fieldName, maxLength) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .max(maxLength, `${fieldName} must not exceed ${maxLength} characters`)

const registerBodySchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    firstName: requiredText('First name', 50),
    lastName: requiredText('Last name', 50),
    address: requiredText('Address', 50),
    city: requiredText('City', 50),
    state: requiredText('State', 50),
    postalCode: requiredText('Postal code', 20),
    countryCode: z.string().trim().toUpperCase().length(2, 'Country code must contain exactly 2 characters'),
    phone: requiredText('Phone', 20)
  })
  .strict()

const loginBodySchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required')
  })
  .strict()

export const registerSchema = z.object({
  body: registerBodySchema
})

export const loginSchema = z.object({
  body: loginBodySchema
})
