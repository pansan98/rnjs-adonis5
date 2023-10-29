import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sns_oauth_tokens'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('event_id', 255).after('user_id')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('event_id')
    })
  }
}
