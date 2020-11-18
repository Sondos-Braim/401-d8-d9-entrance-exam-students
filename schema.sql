DROP TABLE IF EXISTS characters;
CREATE TABLE characters(
    id SERIAL PRIMARY KEY,
    image TEXT,
    name VARCHAR(255),
    patronus VARCHAR(255),
    alive VARCHAR(255)
)