import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users_in_rooms'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('room_id').unsigned().references('id').inTable('rooms').after('user_id').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      //table.timestamp('created_at', { useTz: true })
      //table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('room_id')
      table.dropColumn('room_id')
    })
  }
}
