import { Router } from 'express'
import * as productController from '../../controllers/apis/product.controller.js'
import asyncHandler from '../../utils/async-handler.js'
import { USER_ROLES } from '../../constants/user-roles.js'
import authenticate from '../../middlewares/authenticate.middleware.js'
import authorize from '../../middlewares/authorize.middleware.js'
import validate from '../../middlewares/validate.middleware.js'
import {
  createProductSchema,
  productCodeParamsOnlySchema,
  updateProductSchema
} from '../../validators/product.validator.js'

const router = Router()

/**
 * @swagger
 * /api/products:
 *  get:
 *   tags:
 *    - Products
 *   summary: Retrieve all products
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: A list of products
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductListResponse'
 *    500:
 *     description: Internal server error
 */
router.get(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.CUSTOMER),
  asyncHandler(productController.getAllProducts)
)

/**
 * @swagger
 * /api/products/{productCode}:
 *  get:
 *   tags:
 *    - Products
 *   summary: Retrieve a product by its code
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: productCode
 *      schema:
 *        type: string
 *      required: true
 *      description: The product code
 *   responses:
 *    200:
 *     description: The requested product
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductResponse'
 *    404:
 *     description: Product not found
 *    500:
 *     description: Internal server error
 */
router.get(
  '/:productCode',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.CUSTOMER),
  validate(productCodeParamsOnlySchema),
  asyncHandler(productController.getProductByCode)
)

/**
 * @swagger
 * /api/products:
 *  post:
 *   tags:
 *    - Products
 *   summary: Create a new product
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Product'
 *   responses:
 *    201:
 *     description: The created product
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductMutationResponse'
 *    400:
 *     description: Bad request
 *    500:
 *     description: Internal server error
 */
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(createProductSchema),
  asyncHandler(productController.createProduct)
)

/**
 * @swagger
 * /api/products/{productCode}:
 *  patch:
 *   tags:
 *    - Products
 *   summary: Partially update a product by its code
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: productCode
 *      schema:
 *        type: string
 *      required: true
 *      description: The product code
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Product'
 *   responses:
 *    200:
 *     description: The updated product
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ProductMutationResponse'
 *    404:
 *     description: Product not found
 *    500:
 *     description: Internal server error
 */
router.patch(
  '/:productCode',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(updateProductSchema),
  asyncHandler(productController.updateProduct)
)

/**
 * @swagger
 * /api/products/{productCode}:
 *  delete:
 *   tags:
 *    - Products
 *   summary: Delete a product by its code
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: productCode
 *      schema:
 *        type: string
 *      required: true
 *      description: The product code
 *   responses:
 *    200:
 *     description: The deleted product
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/MessageResponse'
 *    404:
 *     description: Product not found
 *    500:
 *     description: Internal server error
 */
router.delete(
  '/:productCode',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(productCodeParamsOnlySchema),
  asyncHandler(productController.deleteProduct)
)

export default router
