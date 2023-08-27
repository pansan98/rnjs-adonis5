import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.string('username', 80).notNullable()
      table.string('login_id', 191).notNullable().unique()
      table.string('email', 254).nullable()
      table.string('password', 191).notNullable()
      table.text('profession')
      table.integer('gender')
      table.string('identify_code', 100).notNullable().unique()
      table.text('social_uniq')
      table.boolean('two_authorize_flag').defaultTo(false)
      table.integer('active_flag', 1).defaultTo(0)
      table.integer('delete_flag', 1).defaultTo(0)
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
