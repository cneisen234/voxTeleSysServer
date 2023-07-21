-- Database schema for postgreSQL. The structure is equivalent to the mySQL/mariaDB schema that was sent over

CREATE TABLE category
(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
)

INSERT INTO category
    (name)
VALUES
    ('produce'),
    ('beer'),
    ('bakery');

CREATE TABLE items
(
    "id" SERIAL PRIMARY KEY,
    "category_id" INT REFERENCES "category",
    name VARCHAR(255) NOT NULL,
)

INSERT INTO items
    (category_id,name)
VALUES
    (1, 'Carrot'),
    (1, 'Apple'),
    (1, 'Orange'),
    (2, 'Michelob ULTRA'),
    (2, 'Coors Light'),
    (2, 'Spotted Cow'),
    (3, 'Donut'),
    (3, 'Bread'),
    (3, 'Cinnamon Roll');