import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('thumbnail_id').unsigned().defaultTo(null).references('id').inTable('medias').onDelete('SET NULL').after('social_uniq')
      table.integer('active_sharing_id').unsigned().defaultTo(null).references('id').inTable('sharing_logins').onDelete('SET NULL').after('thumbnail_id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      //table.timestamp('created_at', { useTz: true })
      //table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('thumbnail_id')
      table.dropForeign('active_sharing_id')
      table.dropColumn('thumbnail_id')
      table.dropColumn('active_sharing_id')
    })
  }
}
