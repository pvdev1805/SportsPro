CREATE SCHEMA IF NOT EXISTS sportspro;

SET search_path TO sportspro;

CREATE TABLE countries (
  country_code CHAR(2) PRIMARY KEY,
  country_name VARCHAR(50) NOT NULL
);

CREATE TABLE products (
  product_code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  version NUMERIC(18, 1) NOT NULL,
  release_date DATE NOT NULL
);

CREATE TABLE users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'technician', 'customer')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE technicians (
  tech_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,

  CONSTRAINT fk_technicians_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE customers (
  customer_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  address VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country_code CHAR(2) NOT NULL,
  phone VARCHAR(20) NOT NULL,

  CONSTRAINT fk_customers_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_customers_country FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

CREATE TABLE incidents (
  incident_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_code VARCHAR(10) NOT NULL,
  tech_id INTEGER,
  status VARCHAR(20) DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  date_opened TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_closed TIMESTAMP,
  title VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,

  CONSTRAINT fk_incidents_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_incidents_product FOREIGN KEY (product_code) REFERENCES products(product_code),
  CONSTRAINT fk_incidents_technician FOREIGN KEY (tech_id) REFERENCES technicians(tech_id),
  CONSTRAINT chk_incidents_dates CHECK (date_closed IS NULL OR date_closed >= date_opened)
);

CREATE TABLE registrations (
  customer_id INTEGER NOT NULL,
  product_code VARCHAR(10) NOT NULL,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (customer_id, product_code),
  CONSTRAINT fk_registrations_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_registrations_product FOREIGN KEY (product_code) REFERENCES products(product_code)
);

CREATE TABLE administrators (
  username VARCHAR(40) PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,

  CONSTRAINT fk_administrators_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE refresh_tokens (
  refresh_token_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
