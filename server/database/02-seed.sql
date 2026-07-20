SET search_path TO sportspro;

COPY countries(country_code, country_name)
FROM '/docker-entrypoint-initdb.d/data/countries.csv'
WITH (FORMAT CSV, HEADER TRUE);

COPY products(product_code, name, version, release_date)
FROM '/docker-entrypoint-initdb.d/data/products.csv'
WITH (FORMAT CSV, HEADER TRUE);

COPY administrators(username, password)
FROM '/docker-entrypoint-initdb.d/data/administrators.csv'
WITH (FORMAT CSV, HEADER TRUE);

COPY technicians(tech_id, first_name, last_name, email, phone, password)
FROM '/docker-entrypoint-initdb.d/data/technicians.csv'
WITH (FORMAT CSV, HEADER TRUE);

COPY customers(customer_id, first_name, last_name, address, city, state, postal_code, country_code, phone, email, password)
FROM '/docker-entrypoint-initdb.d/data/customers.csv'
WITH (FORMAT CSV, HEADER TRUE);

COPY registrations(customer_id, product_code, registration_date)
FROM '/docker-entrypoint-initdb.d/data/registrations.csv'
WITH (FORMAT CSV, HEADER TRUE);

COPY incidents(incident_id, customer_id, product_code, tech_id, date_opened, date_closed, title, description)
FROM '/docker-entrypoint-initdb.d/data/incidents.csv'
WITH (FORMAT CSV, HEADER TRUE);

SELECT setval(
  pg_get_serial_sequence('sportspro.technicians', 'tech_id'),
  COALESCE((SELECT MAX(tech_id) FROM technicians), 1),
  TRUE
);

SELECT setval(
  pg_get_serial_sequence('sportspro.customers', 'customer_id'),
  COALESCE((SELECT MAX(customer_id) FROM customers), 1),
  TRUE
);

SELECT setval(
    pg_get_serial_sequence('sportspro.incidents', 'incident_id'),
    COALESCE((SELECT MAX(incident_id) FROM incidents), 1),
    TRUE
);
