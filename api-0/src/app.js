import express from 'express'
import { KcAdminService } from './KcAdminService.js'
import Keycloak from 'keycloak-connect'

const keycloak = new Keycloak({}, {
    realm: process.env.KC_REALM,
    "bearer-only": true,
    "auth-server-url": process.env.KC_BASE_URL,
    clientId: process.env.KC_CLIENT_ID
})

const app = express()
app.use(keycloak.middleware())
app.use(express.json())

app.get('/public', (_req, res) => {
    res.send({ message: 'Public' })
})

app.get('/users', keycloak.protect("realm:admin"), async (_req, res) => {
    const kcAdminClient = new KcAdminService()
    const result = await kcAdminClient.findUsers()

    res.send({ users: result })
})


app.get('/users/:username', async (req, res) => {
    const { username } = req.params
    const kcAdminClient = new KcAdminService()
    const result = await kcAdminClient.findUserByUsername(username)

    res.send({ user: result })
})

app.post('/users', async (req, res) => {
    const user = req.body
    const kcAdminService = new KcAdminService()

    await kcAdminService.createUser(user)

    res.setHeader("Location", `/user/${user.username}`)

    res.status(201).send()
})


app.put('/users/:username', async (req, res) => {
    const user = req.body
    const { username } = req.params
    console.log("user", user)
    const kcAdminService = new KcAdminService()

    await kcAdminService.updateUser(username, user)

    res.send()
})

app.delete('/users/:username', async (req, res) => {
    const { username } = req.params
    const kcAdminService = new KcAdminService()

    await kcAdminService.deleteUser(username)

    res.status(204).send()
})

export default app
