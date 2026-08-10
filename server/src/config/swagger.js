import path from 'node:path'
import { fileURLToPath } from 'node:url'

import swaggerJsdoc from 'swagger-jsdoc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createDataResponseSchema = (dataSchema, messageExample) => {
  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: messageExample
      },
      data: dataSchema
    },
    required: ['success', 'data']
  }
}

const createMessageResponseSchema = (messageExample) => {
  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: messageExample
      }
    },
    required: ['success', 'message']
  }
}

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
      },
      {
        name: 'Auth',
        description: 'Authentication and session endpoints'
      },
      {
        name: 'Profile',
        description: 'Authenticated profile endpoint'
      },
      {
        name: 'Incidents',
        description: 'Incident management endpoints'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
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
        ProductListResponse: createDataResponseSchema(
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product'
            }
          },
          'A list of products'
        ),
        ProductResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Product'
          },
          'Product retrieved successfully'
        ),
        ProductMutationResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Product'
          },
          'Product saved successfully'
        ),
        Technician: {
          type: 'object',
          required: ['techId', 'firstName', 'lastName', 'phone'],
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
            phone: {
              type: 'string',
              example: '0432211112'
            },
            user: {
              type: 'object',
              properties: {
                userId: {
                  type: 'integer',
                  example: 2
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'andrew.wilson@sportspro.com'
                },
                isActive: {
                  type: 'boolean',
                  example: true
                }
              }
            }
          }
        },
        TechnicianListResponse: createDataResponseSchema(
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Technician'
            }
          },
          'A list of technicians'
        ),
        TechnicianResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Technician'
          },
          'Technician retrieved successfully'
        ),
        TechnicianMutationResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Technician'
          },
          'Technician saved successfully'
        ),
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
            'customerId',
            'firstName',
            'lastName',
            'address',
            'city',
            'state',
            'postalCode',
            'countryCode',
            'phone'
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
            country: {
              $ref: '#/components/schemas/Country'
            },
            user: {
              type: 'object',
              properties: {
                userId: {
                  type: 'integer',
                  example: 3
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'daniel.roberts@example.com'
                }
              }
            }
          }
        },
        CustomerListResponse: createDataResponseSchema(
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Customer'
            }
          },
          'A list of customers'
        ),
        CustomerResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Customer'
          },
          'Customer retrieved successfully'
        ),
        CustomerMutationResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Customer'
          },
          'Customer updated successfully'
        ),
        User: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'daniel.roberts@example.com'
            },
            role: {
              type: 'string',
              enum: ['admin', 'technician', 'customer'],
              example: 'customer'
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        AuthRegisterData: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            customer: {
              $ref: '#/components/schemas/Customer'
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIs...'
            }
          }
        },
        AuthLoginData: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIs...'
            }
          }
        },
        AuthRegisterResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/AuthRegisterData'
          },
          'Customer registered successfully'
        ),
        AuthLoginResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/AuthLoginData'
          },
          'Login successful'
        ),
        AuthRefreshResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/AuthLoginData'
          },
          'Token refreshed successfully'
        ),
        Profile: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'daniel.roberts@example.com'
            },
            role: {
              type: 'string',
              example: 'customer'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            profile: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    username: {
                      type: 'string',
                      example: 'admin1'
                    }
                  }
                },
                {
                  type: 'object',
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
                    phone: {
                      type: 'string',
                      example: '0432211112'
                    }
                  }
                },
                {
                  type: 'object',
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
                    country: {
                      $ref: '#/components/schemas/Country'
                    },
                    phone: {
                      type: 'string',
                      example: '0412345678'
                    }
                  }
                }
              ]
            }
          }
        },
        ProfileResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Profile'
          },
          'Profile retrieved successfully'
        ),
        AuthRegisterRequest: {
          type: 'object',
          required: [
            'email',
            'password',
            'firstName',
            'lastName',
            'address',
            'city',
            'state',
            'postalCode',
            'countryCode',
            'phone'
          ],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'daniel.roberts@example.com'
            },
            password: {
              type: 'string',
              example: 'CustomerPass123!'
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
            }
          }
        },
        AuthLoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'daniel.roberts@example.com'
            },
            password: {
              type: 'string',
              example: 'CustomerPass123!'
            }
          }
        },
        AuthSessionResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                customer: {
                  $ref: '#/components/schemas/Customer'
                },
                accessToken: {
                  type: 'string'
                }
              }
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                accessToken: {
                  type: 'string'
                }
              }
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
        },
        RegistrationListResponse: createDataResponseSchema(
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Registration'
            }
          },
          'A list of registrations'
        ),
        RegistrationResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Registration'
          },
          'Product registered successfully'
        ),
        Incident: {
          type: 'object',
          properties: {
            incidentId: {
              type: 'integer',
              example: 1
            },
            customerId: {
              type: 'integer',
              example: 1
            },
            productCode: {
              type: 'string',
              example: 'DRAFT10'
            },
            techId: {
              type: 'integer',
              nullable: true,
              example: 2
            },
            status: {
              type: 'string',
              enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
              example: 'open'
            },
            dateOpened: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-20T10:30:00.000Z'
            },
            dateClosed: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null
            },
            title: {
              type: 'string',
              example: 'Application crashes on startup'
            },
            description: {
              type: 'string',
              example: 'The app crashes when the customer opens it.'
            }
          }
        },
        IncidentListResponse: createDataResponseSchema(
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Incident'
            }
          },
          'A list of incidents'
        ),
        IncidentResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Incident'
          },
          'Incident details retrieved successfully'
        ),
        IncidentMutationResponse: createDataResponseSchema(
          {
            $ref: '#/components/schemas/Incident'
          },
          'Incident saved successfully'
        ),
        MessageResponse: createMessageResponseSchema('Operation completed successfully'),
        IncidentCreateRequest: {
          type: 'object',
          required: ['title', 'description', 'productCode'],
          properties: {
            customerId: {
              type: 'integer',
              example: 1,
              description:
                'Required for administrators; customers can omit this field when creating their own incidents'
            },
            productCode: {
              type: 'string',
              example: 'DRAFT10'
            },
            title: {
              type: 'string',
              example: 'Application crashes on startup'
            },
            description: {
              type: 'string',
              example: 'The app crashes when the customer opens it.'
            }
          }
        },
        IncidentUpdateRequest: {
          type: 'object',
          description: 'At least one of the fields must be provided for update',
          properties: {
            productCode: {
              type: 'string',
              example: 'DRAFT10'
            },
            title: {
              type: 'string',
              example: 'Application crashes on startup'
            },
            description: {
              type: 'string',
              example: 'The app crashes when the customer opens it.'
            }
          }
        },
        IncidentAssignRequest: {
          type: 'object',
          required: ['techId'],
          properties: {
            techId: {
              type: 'integer',
              example: 2
            }
          }
        },
        IncidentStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
              example: 'resolved'
            }
          }
        }
      }
    }
  },

  apis: [path.resolve(__dirname, '../routes/apis/**/*.routes.js').replace(/\\/g, '/')]
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)
