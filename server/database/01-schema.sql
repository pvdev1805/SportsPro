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

CREATE TABLE technicians (
  tech_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE customers (
  customer_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  address VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country_code CHAR(2) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,

  CONSTRAINT fk_customers_country FOREIGN KEY (country_code) REFERENCES countries(country_code)
);

CREATE TABLE incidents (
  incident_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_code VARCHAR(10) NOT NULL,
  tech_id INTEGER,
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
  password VARCHAR(100) NOT NULL
);
