declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
        dbexists(options: (string)[]): Rule
    }
}