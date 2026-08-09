import { z } from 'zod'

const productCodeSchema = z
  .string()
  .trim()
  .min(1, 'Product code is required')
  .max(10, 'Product code must not exceed 10 characters')
  .regex(/^[A-Za-z0-9]+$/, 'Product code may only contain letters and numbers')
  .transform((value) => value.toUpperCase())

const productNameSchema = z
  .string()
  .trim()
  .min(1, 'Product name is required')
  .max(50, 'Product name must not exceed 50 characters')

const productVersionSchema = z.coerce
  .number({
    error: 'Product version must be a number'
  })
  .positive('Product version must be greater than 0')
  .refine((value) => Number.isInteger(value * 10), 'Product version must have at most one decimal place')

const releaseDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Release date must use YYYY-MM-DD format')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`)

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  }, 'Release date must be a valid calendar date')

const createProductBodySchema = z
  .object({
    productCode: productCodeSchema,
    name: productNameSchema,
    version: productVersionSchema,
    releaseDate: releaseDateSchema
  })
  .strict()

const updateProductBodySchema = z
  .object({
    name: productNameSchema.optional(),
    version: productVersionSchema.optional(),
    releaseDate: releaseDateSchema.optional()
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'At least one product field must be provided')

const productCodeParamsSchema = z.object({
  productCode: productCodeSchema
})

export const createProductSchema = z.object({
  body: createProductBodySchema
})

export const updateProductSchema = z.object({
  body: updateProductBodySchema,
  params: productCodeParamsSchema
})

export const productCodeParamsOnlySchema = z.object({
  params: productCodeParamsSchema
})
