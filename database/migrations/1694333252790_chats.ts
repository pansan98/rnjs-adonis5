import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'chats'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id', {
        primaryKey: true
      })
      table.integer('send_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL').defaultTo(null)
      table.text('message', 'long').notNullable()
      table.boolean('is_edit').notNullable().defaultTo(false)
      table.boolean('is_cancel').notNullable().defaultTo(false)
      table.bigInteger('reply_to').unsigned().references('id').inTable('chats').onDelete('SET NULL').defaultTo(null)
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
