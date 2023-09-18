import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'chat_views'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('room_id').unsigned().after('receive_user_id').references('id').inTable('rooms').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('room_id')
      table.dropColumn('room_id')
    })
  }
}
