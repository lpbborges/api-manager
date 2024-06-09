import kcAdminClient from './kcAdminClient.js'

export class KcAdminService {
    constructor() {
        this.adminClient = kcAdminClient
    }

    async createUser(user) {
        const { password } = user

        delete user.password

        return this.adminClient.users.create({
            ...user,
            credentials: [
                {
                    temporary: true,
                    value: password
                }
            ],
            requiredActions: [
                "UPDATE_PASSWORD"
            ]
        })
    }

    async updateUser(username, data) {
        const user = await this.findUserByUsername(username)
        return this.adminClient.users.update({ id: user.id }, data)
    }

    async deleteUser(username) {
        const user = await this.findUserByUsername(username)
        return this.adminClient.users.del({ id: user.id })
    }

    async findUsers() {
        return this.adminClient.users.find()
    }

    async findUserByUsername(username) {
        const users = await this.adminClient.users.find({ username })

        if (!users || users.length < 1) {
            return null
        }

        return users[0]
    }
}
