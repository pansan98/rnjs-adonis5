import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sharing_logins'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.text('os')
      table.string('ip', 20).notNullable()
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
