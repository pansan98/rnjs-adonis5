import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'chats'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('trx_id', 255).notNullable().after('reply_to')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('trx_id')
    })
  }
}
