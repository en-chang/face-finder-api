-- Seed data with a fake user for testing
BEGIN TRANSACTION;

insert into users (name, email, entries, joined) values ('a', 'a@a.com', 5, '2018-01-01');
insert into login (hash, email) values ('$2a$10$lZIbeawOcLoFNTZgEY6LG.gBVwenvr0Tysyk8nCHfQYEr0H0FzMlW', 'a@a.com');

COMMIT;