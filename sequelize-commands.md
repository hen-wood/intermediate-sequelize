# Sequelize Commands

Generating Migrations, Models, and Seeders from the command line provides a template <br>
and it's way easier than trying to remember how to write them from scratch.

## Migrations

- Generate `npx sequelize-cli migration:generate --name <name of table>`
- Run Migrations `npx dotenv sequelize db:migrate`
- Undo Last Migration `npx dotenv sequelize db:migrate:undo`
- Undo All Migrations `npx dotenv sequelize db:migrate:undo:all`
- Redo a Migration `npx dotenv sequelize db:migrate` _(_ _Same_ _command_ _as_ _Run_ _)_

## Models

- Generate `npx sequelize model:generate --name ExampleName --attributes name:string`

## Seeders

- Generate `npx sequelize seed:generate --name <name of seed>`
- Execute All Seeders `npx dotenv sequelize db:seed:all`
- Execute Specific Seeder `npx dotenv sequelize db:seed --seed <name of seeder>`
- Undo All Seed Executions `npx dotenv sequelize db:seed:undo:all`
- Undo Specific Seed Execution `npx dotenv sequelize db:seed:undo --seed <name of seeder>`
