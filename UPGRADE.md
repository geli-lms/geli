# Upgrade from 0.8.0 to 0.8.1

- Invalid course chatroom [#942](https://github.com/geli-lms/geli/pull/942) requires database migration

### Production / Staging

`docker-compose run --rm api node migrate.js --up 20181030-course`

### Develop

`npm run migrate -- --up 20181030-course`


# Upgrade from 0.7.x to 0.8.0

- Anonymous forum [#792](https://github.com/geli-lms/geli/pull/792) requires database migration
- Unit visibility toggle [#660](https://github.com/geli-lms/geli/pull/660) requires database migration
- `fileUnitType` for some `FileUnit` is missing [#907](https://github.com/geli-lms/geli/pull/907)

### Production / Staging

`docker-compose run --rm api node migrate.js --up 20180821-course 20180821-unit 20181019-fileUnit 20181020-unit`

### Develop

`npm run migrate -- --up 20180821-course 20180821-unit 20181019-fileUnit 20181020-unit`
