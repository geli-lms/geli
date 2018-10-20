# Upgrade from 0.7 to 0.8

- Anonymous forum [#792](https://github.com/geli-lms/geli/pull/792) requires database migration

### Production / Staging

`docker-compose run --rm api node migrate.js --up course_v2 unit_v2 `

### Develop

`npm run migrate -- --up course_v2 unit_v2`
