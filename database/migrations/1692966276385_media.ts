import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'medias'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.string('mime', 100)
      table.string('type', 100)
      table.string('ext', 100)
      table.bigInteger('size')
      table.text('path', 'long')
      table.string('name', 251)
      table.string('identify_code', 191).unique()
      table.integer('media_group_id').unsigned().references('id').inTable('media_groups').onDelete('SET NULL')
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
