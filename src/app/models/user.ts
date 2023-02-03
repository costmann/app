export class Roles {
  public static admin = '101'
  public static manager = '102'
  public static analyst = '103'
  public static reader = '104'
  public static authority = '105'
}

export class MenuItem {
  icon = ''
  description = ''
  path = ''
}

export class User {
  public name = ''
  public expirationTime!: Date
  public issuedAt!: Date
  public notBefore!: Date
  public roles: string[] = []
  public firstName = ''
  public lastName = ''
  public email = ''
  public passwordExpirationDays: number | null = null
  public menu: MenuItem[] = []
  public startMenuItem: MenuItem | undefined = undefined
}
