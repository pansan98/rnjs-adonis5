import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('receive_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL').defaultTo(null).after('created_user_id')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('receive_user_id')
      table.dropColumn('receive_user_id')
    })
  }
}
