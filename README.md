# SportsPro Technical Support

## 📌 1. Overview

**SportsPro Technical Support** is a full-stack web application developed for **CSC3480 Web Technology**.

The application provides a role-based technical support system for SportsPro administrators, technicians, and customers. It supports product management, technician management, customer management, product registration, incident tracking, and personalised dashboards.

The Assignment 2 implementation extends the original SportsPro application with:

- JWT-based authentication
- User registration, login, logout, and token refresh
- Secure password hashing with bcrypt
- Role-based access control for administrators, technicians, and customers
- Protected REST API endpoints
- Role-based dashboards
- Client-side and server-side input validation
- Asynchronous API communication using async/await
- Centralised error handling
- Interactive OpenAPI documentation with Swagger UI
- Dockerised deployment using PostgreSQL and Nginx

---

## ✨ 2. Features

### 2.1 Authentication

- Customer account registration
- Login using email and password
- JWT-based authentication
- Access and refresh token management
- Logout functionality
- Secure password hashing using bcrypt
- Authentication state restoration
- Protected pages and API endpoints

### 2.2 Role-Based Access Control

The application supports three user roles:

- **Administrator**
- **Technician**
- **Customer**

Application pages and API endpoints are protected according to the authenticated user's role.

### 2.3 Product Management

Administrators can:

- View all products
- Add new products
- Edit product details
- Delete products

### 2.4 Technician Management

Administrators can:

- View all technicians
- Add technicians
- Edit technician details
- Delete technicians

### 2.5 Customer Management

Administrators can:

- View customers
- Search customers by last name
- View customer details
- Edit customer information

### 2.6 Product Registration

Customers can:

- View available products
- Register products to their account
- View their registered products

The application prevents duplicate product registrations.

### 2.7 Incident Management

The application provides role-specific incident functionality.

**Administrators can:**

- View all incidents
- Create incidents for customers
- View incident details
- Update incidents
- Assign or reassign technicians
- Update incident status

**Technicians can:**

- View incidents assigned to them
- View assigned incident details
- Update permitted incident information
- Progress assigned incidents through the permitted workflow

**Customers can:**

- Create incidents for their registered products
- View their own incidents
- View incident details
- Edit permitted information while an incident is open

The incident workflow uses the following statuses:

1. Open
2. Assigned
3. In Progress
4. Resolved
5. Closed

### 2.8 Role-Based Dashboards

Each authenticated user receives a dashboard appropriate to their role.

- **Administrator:** system statistics and management functionality
- **Technician:** assigned incidents and incident status information
- **Customer:** registered products and incident information

Dashboard information is loaded asynchronously from the REST API.

### 2.9 Input Validation

The application implements validation at both client and server levels.

Client-side validation provides immediate feedback before invalid data is submitted.

Server-side validation independently validates incoming API requests before they reach application business logic.

### 2.10 Additional Functionality

- Responsive user interface
- RESTful API
- PostgreSQL database integration
- Sequelize ORM
- Docker containerisation
- Nginx reverse proxy
- Load balancing across multiple application instances
- Server-side rendering with reusable Pug templates
- Interactive Swagger API documentation
- Centralised API error handling

---

## 🧰 3. Technology Stack

### 3.1 Frontend

- HTML5
- Pug
- CSS3
- Vanilla JavaScript
- ES Modules
- Fetch API
- Async/await

### 3.2 Backend

- Node.js
- Express.js
- Sequelize ORM
- JSON Web Token (JWT)
- bcrypt
- Zod

### 3.3 Database

- PostgreSQL

### 3.4 API Documentation

- OpenAPI
- Swagger UI

### 3.5 Infrastructure

- Docker
- Docker Compose
- Nginx

---

## 🏗️ 4. Project Structure

The project is organised into separate frontend, backend, database, and infrastructure components.

```text
sportspro/
│
├── client/
│   ├── public/
│   │   ├── css/                  # Application styles
│   │   └── js/                   # Frontend JavaScript
│   │       ├── auth/             # Frontend authentication utilities
│   │       ├── constants/        # Frontend constants
│   │       ├── pages/            # Page-specific JavaScript
│   │       ├── utils/            # Shared frontend utilities
│   │       └── validation/       # Client-side validation utilities
│   │
│   └── views/
│       ├── layouts/              # Base Pug layouts
│       ├── mixins/               # Reusable Pug form components
│       ├── pages/                # Application pages
│       └── partials/             # Shared page fragments
│
├── server/
│   ├── src/
│   │   ├── config/               # Database, application, and Swagger configuration
│   │   ├── constants/            # Backend constants
│   │   ├── controllers/          # HTTP request handlers
│   │   ├── middlewares/          # Authentication, authorisation, validation, and error middleware
│   │   ├── models/               # Sequelize models and associations
│   │   ├── routes/               # Page and REST API routes
│   │   ├── services/             # Application business logic
│   │   ├── utils/                # Shared backend utilities
│   │   └── validators/           # Zod validation schemas
│   │
│   └── database/
│       ├── 01-schema.sql         # Database schema
│       ├── 02-seed.sql           # Sample data
│       └── data/                 # CSV files used for seeding
│
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf                # Reverse proxy and load balancing configuration
│
├── screenshots/                  # Testing evidence and application screenshots
│
├── Dockerfile                    # Express application image
├── compose.yaml                  # Multi-container Docker configuration
├── package.json
└── README.md
```

The backend follows a layered architecture.

- **Routes** define application and API endpoints.
- **Controllers** process HTTP requests and responses.
- **Services** contain application business logic.
- **Models** provide database access through Sequelize.
- **Middlewares** provide authentication, authorisation, validation, and error handling.
- **Validators** define server-side request validation rules.

This separation improves maintainability and keeps responsibilities clearly organised.

---

## 🔐 5. Authentication and Security

SportsPro uses JWT-based authentication to protect application functionality and REST API endpoints.

### 5.1 Registration

Customers can create an account through the registration page.

Registration information is validated before the account is created. Passwords must satisfy the application's password requirements and are securely hashed using bcrypt before being stored.

### 5.2 Login

Users authenticate using their email address and password.

After successful authentication, JWT credentials are used to authenticate subsequent requests.

### 5.3 Access and Refresh Tokens

The authentication system uses access and refresh token functionality.

Access tokens authenticate protected requests, while refresh functionality allows authentication to be renewed without requiring the user to manually sign in again.

### 5.4 Password Security

Passwords are never stored as plain text.

bcrypt is used to hash passwords before they are persisted to the database. Authentication compares the supplied password against the stored password hash.

### 5.5 Authentication Middleware

Protected API routes use authentication middleware to validate the authenticated user before allowing access to protected resources.

Requests without valid authentication receive an appropriate authentication error response.

### 5.6 Authorisation Middleware

After authentication, role-based authorisation middleware determines whether the user has permission to access the requested resource.

This provides separate permissions for:

- administrators
- technicians
- customers

Additional resource-level access checks protect incidents so that technicians can only access assigned incidents and customers can only access their own incidents.

### 5.7 Logout

The application provides logout functionality to end the authenticated user session and return the application to an unauthenticated state.

---

## 👥 6. Role-Based Access Control

SportsPro applies role-based permissions to both application functionality and API endpoints.

| Function                          | Admin | Technician | Customer |
| --------------------------------- | :---: | :--------: | :------: |
| View personalised dashboard       |  ✅   |     ✅     |    ✅    |
| Manage products                   |  ✅   |     ❌     |    ❌    |
| Manage technicians                |  ✅   |     ❌     |    ❌    |
| Manage customers                  |  ✅   |     ❌     |    ❌    |
| View all incidents                |  ✅   |     ❌     |    ❌    |
| Create incident for a customer    |  ✅   |     ❌     |    ❌    |
| Assign/reassign technicians       |  ✅   |     ❌     |    ❌    |
| View assigned incidents           |  ❌   |     ✅     |    ❌    |
| Update assigned incident workflow |  ❌   |     ✅     |    ❌    |
| Register products                 |  ❌   |     ❌     |    ✅    |
| View own registered products      |  ❌   |     ❌     |    ✅    |
| Create own incidents              |  ❌   |     ❌     |    ✅    |
| View own incidents                |  ❌   |     ❌     |    ✅    |
| Edit permitted own incident data  |  ❌   |     ❌     |    ✅    |

Role checks are enforced on the server rather than relying only on the user interface.

---

## 📊 7. Role-Based Dashboards

After authentication, users are presented with functionality and information appropriate to their role.

### 7.1 Administrator Dashboard

The administrator dashboard provides system-level information and links to management functionality.

Administrators can manage:

- Products
- Technicians
- Customers
- Product registrations
- Incidents
- Technician assignments

### 7.2 Technician Dashboard

The technician dashboard focuses on technical support work assigned to the authenticated technician.

It provides information about:

- Assigned incidents
- Incident status
- Current technical support workload

### 7.3 Customer Dashboard

The customer dashboard provides information relevant to the authenticated customer.

It provides access to:

- Registered products
- Customer incidents
- Product registration
- Incident creation

Dashboard data is retrieved asynchronously from the REST API.

---

## ✅ 8. Input Validation

SportsPro implements validation at both client and server levels.

### 8.1 Client-Side Validation

Reusable JavaScript validation utilities provide immediate feedback before forms are submitted.

Validation includes:

- Required fields
- Email addresses
- Minimum and maximum lengths
- Password complexity
- Numeric values
- Decimal values
- Dates
- Product codes
- Phone numbers
- Country codes
- Product selection
- Incident form fields

Validation messages are displayed next to the relevant form field.

When validation fails:

- The invalid field is identified
- An appropriate error message is displayed
- Accessibility attributes are applied
- Focus moves to the first invalid field

Validation errors are cleared when the user begins correcting the affected field.

### 8.2 Server-Side Validation

Server-side validation is implemented using Zod schemas.

The server validates:

- Authentication requests
- Products
- Technicians
- Customers
- Product registrations
- Incidents
- Route parameters
- Query parameters

Server-side validation acts as the authoritative validation layer and prevents invalid or malformed requests from reaching application services and database operations.

---

## ⚡ 9. Asynchronous Communication

Frontend API communication uses modern JavaScript `async/await`.

Asynchronous operations include:

- Registration
- Login and authentication restoration
- Dashboard data loading
- Product management
- Technician management
- Customer management
- Product registration
- Incident creation
- Incident updates
- Incident assignment
- Incident status updates

Shared API utilities are used to provide consistent request and error handling.

The user interface also provides loading or submission states where appropriate, such as:

- Signing in
- Creating accounts
- Creating products
- Creating incidents
- Assigning technicians
- Saving updates
- Updating incident status

This prevents duplicate actions and provides feedback while asynchronous operations are running.

---

## 🌐 10. Request Flow

### 10.1 Page Requests

1. The browser requests an application page.
2. Express matches the request to the appropriate page route.
3. The page controller prepares the required information.
4. Pug renders the HTML response.
5. The browser receives the rendered page.
6. Page-specific JavaScript asynchronously loads additional data where required.

### 10.2 Authenticated API Requests

```text
Browser
   │
   │ HTTP Request
   ▼
Express API Route
   │
   ▼
Authentication Middleware
   │
   ▼
Role Authorisation
   │
   ▼
Request Validation
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Sequelize
   │
   ▼
PostgreSQL
```

The server returns a JSON response to the frontend after the request has been processed.

### 10.3 Incident Access

Incident endpoints include additional resource-level authorisation.

- Administrators may access any incident.
- Technicians may access incidents assigned to them.
- Customers may access incidents belonging to their own customer account.

This prevents users from accessing incidents simply by changing an incident ID in the URL or API request.

---

## 🐳 11. Docker Architecture

```text
                     Browser
                         │
                http://localhost:8080
                         │
                         ▼
                 +----------------+
                 |     Nginx      |
                 | Reverse Proxy  |
                 +----------------+
                    │          │
                    ▼          ▼
              +---------+  +---------+
              |  App 1  |  |  App 2  |
              +---------+  +---------+
                    \          /
                     \        /
                      ▼      ▼
                 +---------------+
                 | PostgreSQL DB |
                 +---------------+
```

Nginx acts as both a reverse proxy and load balancer, distributing incoming requests across two Express application instances using the default round-robin strategy.

| Service  | Purpose                         |
| -------- | ------------------------------- |
| database | PostgreSQL database             |
| app1     | Express application instance    |
| app2     | Express application instance    |
| nginx    | Reverse proxy and load balancer |

---

## 📋 12. Prerequisites

The following software is required:

- Docker Desktop
- Git, if cloning the repository

No manual PostgreSQL installation is required when the application is run through Docker Compose.

---

## 🚀 13. Running the Application

### 13.1 Clone the Repository

Clone the repository and navigate to the project directory.

### 13.2 Start the Application

From the project root directory, run:

```bash
docker compose up
```

To run the containers in detached mode:

```bash
docker compose up -d
```

During the first startup, Docker will:

- Build the application image
- Create the PostgreSQL container
- Initialise the database
- Create the database schema
- Import the supplied sample data
- Start the Express application instances
- Start the Nginx reverse proxy

### 13.3 Open the Application

After the containers are running, open:

```text
http://localhost:8080
```

### 13.4 Swagger API Documentation

Interactive API documentation is available at:

```text
http://localhost:8080/api-docs
```

### 13.5 Database Initialisation

The PostgreSQL container automatically initialises the database during the first startup.

The database scripts are executed in order.

#### `01-schema.sql`

- Creates the database schema
- Creates the required tables
- Defines constraints and relationships

#### `02-seed.sql`

- Imports the supplied sample data
- Populates the database using the provided CSV files

No manual database configuration is required when using the supplied Docker configuration.

### 13.6 Stop the Application

```bash
docker compose down
```

### 13.7 Reset the Database

To remove the containers, networks, and database volume:

```bash
docker compose down -v
```

The database will be recreated and seeded the next time the application is started.

---

## 📖 14. API Documentation

The REST API is documented using OpenAPI and Swagger UI.

After starting the application, open:

```text
http://localhost:8080/api-docs
```

Swagger provides interactive documentation for API endpoints, including request parameters, request bodies, response structures, and authentication requirements.

### 14.1 API Groups

| API Group      | Base Endpoint        | Purpose                                           |
| -------------- | -------------------- | ------------------------------------------------- |
| Authentication | `/api/auth`          | Registration, login, token management, and logout |
| Profile        | `/api/profile`       | Authenticated user profile                        |
| Products       | `/api/products`      | Product management                                |
| Technicians    | `/api/technicians`   | Technician management                             |
| Customers      | `/api/customers`     | Customer management                               |
| Registrations  | `/api/registrations` | Product registration                              |
| Incidents      | `/api/incidents`     | Incident management and workflow                  |

Protected endpoints require valid authentication and appropriate role permissions.

The complete and authoritative endpoint specification is available through Swagger UI.

---

## 🔄 15. Incident Workflow

Incidents move through a controlled support workflow.

```text
Open
  │
  │ Technician assigned
  ▼
Assigned
  │
  │ Work begins
  ▼
In Progress
  │
  │ Issue resolved
  ▼
Resolved
  │
  │ Incident completed
  ▼
Closed
```

Administrators can manage incident assignments and permitted workflow transitions.

Technicians can progress incidents assigned to them through the technician-permitted workflow.

Customers can view the current status of their incidents but cannot perform administrative or technician-only workflow operations.

---

## 👤 16. Usage Examples

### 16.1 Administrator Workflow

1. Sign in using an administrator account.
2. View the administrator dashboard.
3. Manage products, technicians, and customers.
4. View customer incidents.
5. Select an incident requiring technical support.
6. Assign or reassign a technician.
7. Monitor the incident status.
8. Perform permitted administrative incident operations.

### 16.2 Technician Workflow

1. Sign in using a technician account.
2. View the technician dashboard.
3. View incidents assigned to the authenticated technician.
4. Open an assigned incident.
5. Review the incident information.
6. Update permitted incident information.
7. Progress the incident through the permitted status workflow.

### 16.3 Customer Workflow

1. Create a customer account or sign in to an existing account.
2. View the customer dashboard.
3. Register a purchased product.
4. Create an incident for a registered product.
5. View existing incidents.
6. Edit an open incident where permitted.
7. Monitor the incident status as technical support processes it.
8. Log out when finished.

---

## 🕒 17. Error Handling

The application implements centralised error handling using Express middleware.

Errors from asynchronous controllers and services are passed through the application's error-handling pipeline and returned using appropriate HTTP status codes.

Common responses include:

| Status                      | Meaning                                     |
| --------------------------- | ------------------------------------------- |
| `200 OK`                    | Request completed successfully              |
| `201 Created`               | Resource created successfully               |
| `400 Bad Request`           | Invalid request or validation failure       |
| `401 Unauthorized`          | Authentication is required or invalid       |
| `403 Forbidden`             | Authenticated user does not have permission |
| `404 Not Found`             | Requested resource does not exist           |
| `409 Conflict`              | Request conflicts with existing data        |
| `500 Internal Server Error` | Unexpected server error                     |

Frontend API requests catch asynchronous errors and display appropriate feedback to the user.

---

## 🧪 18. Testing and Evidence

The application was tested manually through the browser and through the interactive Swagger API documentation.

Testing focuses on the Assignment 2 requirements:

- Authentication flows
- Role-based access control
- Client-side validation
- Server-side validation
- Role-based dashboards
- Protected API endpoints
- Product registration
- Incident management
- Asynchronous operations
- Docker deployment

Testing evidence is stored in the `screenshots/` directory.

### 18.1 Authentication

Screenshots demonstrate:

- Successful login
- Customer registration
- Login validation
- Registration validation
- Logout behaviour

### 18.2 Role-Based Access

Screenshots demonstrate:

- Administrator dashboard
- Technician dashboard
- Customer dashboard
- Role-specific functionality

### 18.3 Input Validation

Screenshots demonstrate client-side validation messages for invalid form data.

Server-side API validation and protected endpoint behaviour can also be demonstrated through Swagger UI.

### 18.4 Incident Management

Screenshots demonstrate:

- Incident creation
- Technician assignment
- Technician assigned incidents
- Incident status workflow

### 18.5 API Documentation

Swagger UI demonstrates the documented REST API and protected endpoints.

### 18.6 Docker Deployment

Docker evidence demonstrates that the PostgreSQL database, application instances, and Nginx reverse proxy are running successfully.

---

## 🖼️ 19. Screenshots

Testing screenshots should be placed inside the `screenshots/` directory.

### 19.1 Home Page

![Home Page](screenshots/1-1-home-page.png)

### 19.2 Login Page

Login page UI
![Login Page](screenshots/1-2-login-page.png)

Login failed due to invalid email or password.
![Login Failed](screenshots/1-3-login-failed.png)

Login successful as an administrator.
![Admin Login Success](screenshots/1-4-admin-login-success.png)

Login successful as a technician.
![Technician Login Success](screenshots/1-5-technician-login-success.png)

Login successful as a customer.
![Customer Login Success](screenshots/1-6-customer-login-success.png)

### 19.3 Registration Page

Registration page UI

![Registration Page](screenshots/1-7-register-page.png)

Registration Validation
![Registration Validation](screenshots/1-8-registration-validation.png)

### 19.4 Product Page

Product Validation
![Product Validation](screenshots/2-1-product-validation.png)

### 19.5 Incident Creation Page

Incident Create Page UI
![Incident Page](screenshots/2-2-incident-create-form.png)

Incident Create Success
![Incident Create Success](screenshots/2-3-incident-create-success.png)

Incident Creation Validation
![Incident Creation Validation](screenshots/2-4-incident-creation-validation.png)

### 19.6 Incident Assignment Page

Incident Assignment Page UI
![Incident Assignment Page](screenshots/2-5-incident-assignment.png)

Incident Assignment Selection
![Incident Assignment Selection](screenshots/2-6-incident-assign-select.png)

### 19.7 Role Access Protection

A user could not access the URL that they were not authorised to access.
In this example, a customer try to access technician list, which is only accessible by administrator.
![Role Access Protection - 1](screenshots/2-7-role-access-protection-1.png)
Then that customer will be redirected to the dashboard page, which is the default page for that role.
![Role Access Protection - 2](screenshots/2-8-role-access-protection-2.png)

### 19.8 Responsive Design

Responsive Design - Desktop
![Responsive Design - Desktop](screenshots/3-1-responsive-design-1.png)

Responsive Design - Tablet
![Responsive Design - Tablet](screenshots/3-2-responsive-design-2.png)

Responsive Design - Mobile 1
![Responsive Design - Mobile 1](screenshots/3-3-responsive-design-3.png)

Responsive Design - Mobile 2
![Responsive Design - Mobile 2](screenshots/3-4-responsive-design-4.png)

### 19.9 Swagger API Documentation

Swagger API Documentation - Home Page
![Swagger API Documentation - Home Page](screenshots/4-1-swagger-api-documentation.png)

### 19.10 Docker Deployment

Docker Deployment - Running Containers
![Docker Deployment - Running Containers](screenshots/5-1-docker-containers.png)

---

## ⚠️ 20. Assumptions

- Docker Desktop is installed and running.
- Port `8080` is available.
- Docker automatically creates and initialises the PostgreSQL database using the supplied scripts.
- The supplied seed data is intended for application demonstration and testing.
- Internet access may be required during the initial Docker build to download required images and dependencies.
- The application is intended for assignment and demonstration purposes rather than production deployment.

---

## 📝 21. Known Limitations

- The application is designed for assignment and demonstration use rather than production deployment.
- Production deployment would require additional operational security configuration and monitoring.
- Automated test coverage is limited; Assignment 2 testing evidence primarily uses browser-based and API-based manual testing.
- The application uses the supplied SportsPro database structure and sample data.
- The current Docker architecture is intended to demonstrate containerisation, reverse proxying, and load balancing in a development/assignment environment.

---

## 👨‍💻 22. Project Information

**Course:** CSC3480 Web Technology

**Project:** SportsPro Technical Support

**Institution:** University of Southern Queensland
