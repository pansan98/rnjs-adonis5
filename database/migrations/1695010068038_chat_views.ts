import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'chat_views'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('viewed').defaultTo(false).notNullable()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('viewed')
    })
  }
}
