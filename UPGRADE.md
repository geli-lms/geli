# Upgrade from 0.7 to 0.8

- Anonymous forum [#792](https://github.com/geli-lms/geli/pull/792) requires database migration
- Unit visibility toggle [#660](https://github.com/geli-lms/geli/pull/660) requires database migration

### Production / Staging

`docker-compose run --rm api node migrate.js --up 20180821-course 20180821-unit 20181020-unit`

### Develop

`npm run migrate -- --up 20180821-course 20180821-unit 20181020-unit`
