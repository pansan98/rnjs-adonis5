import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sns_oauth_tokens'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('sns', 100).notNullable()
      table.string('token', 255).notNullable()
      table.string('refresh_token', 255).notNullable()
      table.timestamp('created_token_at', {
        useTz: true
      })
      table.timestamp('expire', {
        useTz: true
      })

      table.timestamps()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      //table.timestamp('created_at', { useTz: true })
      //table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
