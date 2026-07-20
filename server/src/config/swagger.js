import swaggerJsdoc from 'swagger-jsdoc'

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SportsPro Technical Support API',
      version: '1.0.0',
      description: 'API documentation for the SportsPro Technical Support application'
    },
    servers: [
      {
        url: '/',
        description: 'Current server'
      }
    ],
    tags: [
      {
        name: 'Products',
        description: 'Product management endpoints'
      },
      {
        name: 'Technicians',
        description: 'Technician management endpoints'
      },
      {
        name: 'Customers',
        description: 'Customer management endpoints'
      },
      {
        name: 'Registrations',
        description: 'Product registration endpoints'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['productCode', 'name', 'version', 'releaseDate'],
          properties: {
            productCode: {
              type: 'string',
              example: 'DRAFT10'
            },
            name: {
              type: 'string',
              example: 'Draft Manager 1.0'
            },
            version: {
              type: 'number',
              format: 'float',
              example: 1
            },
            releaseDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-15'
            }
          }
        },
        Technician: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'phone', 'password'],
          properties: {
            techId: {
              type: 'integer',
              example: 1
            },
            firstName: {
              type: 'string',
              example: 'Andrew'
            },
            lastName: {
              type: 'string',
              example: 'Wilson'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'andrew.wilson@sportspro.com'
            },
            phone: {
              type: 'string',
              example: '0432211112'
            },
            password: {
              type: 'string',
              example: 'TechPass123!'
            }
          }
        },
        Country: {
          type: 'object',
          properties: {
            countryCode: {
              type: 'string',
              example: 'US'
            },
            countryName: {
              type: 'string',
              example: 'United States'
            }
          }
        },
        Customer: {
          type: 'object',
          required: [
            'firstName',
            'lastName',
            'address',
            'city',
            'state',
            'postalCode',
            'countryCode',
            'phone',
            'email',
            'password'
          ],
          properties: {
            customerId: {
              type: 'integer',
              example: 1
            },
            firstName: {
              type: 'string',
              example: 'Daniel'
            },
            lastName: {
              type: 'string',
              example: 'Roberts'
            },
            address: {
              type: 'string',
              example: '64 King William Street'
            },
            city: {
              type: 'string',
              example: 'Adelaide'
            },
            state: {
              type: 'string',
              example: 'SA'
            },
            postalCode: {
              type: 'string',
              example: '5000'
            },
            countryCode: {
              type: 'string',
              example: 'AU'
            },
            phone: {
              type: 'string',
              example: '0412345678'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'daniel.roberts@example.com'
            },
            password: {
              type: 'string',
              example: 'CustomerPass123!'
            },
            country: {
              $ref: '#/components/schemas/Country'
            }
          }
        },
        Registration: {
          type: 'object',
          required: ['customerId', 'productCode'],
          properties: {
            customerId: {
              type: 'integer',
              example: 1
            },
            productCode: {
              type: 'string',
              example: 'DRAFT10'
            },
            registrationDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-20T10:30:00.000Z'
            },
            product: {
              $ref: '#/components/schemas/Product'
            }
          }
        }
      }
    }
  },

  apis: ['./server/src/routes/apis/*.routes.js']
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)
