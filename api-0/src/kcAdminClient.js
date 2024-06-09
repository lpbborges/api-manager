import KcAdminClient from '@keycloak/keycloak-admin-client'
import { Issuer } from 'openid-client'

const {
    KC_ADMIN_USERNAME,
    KC_ADMIN_PASSWORD,
    KC_ADMIN_CLIENT_ID,
    KC_REALM,
    KC_BASE_URL,
} = process.env

const connectionConfig = {
    baseUrl: KC_BASE_URL,
    realmName: KC_REALM
}

const kcAdminClient = new KcAdminClient(connectionConfig)

await kcAdminClient.auth({
        username: KC_ADMIN_USERNAME,
        password: KC_ADMIN_PASSWORD,
        grantType: 'password',
        clientId: KC_ADMIN_CLIENT_ID
})

const keycloakIssuer = await Issuer.discover(
    `${KC_BASE_URL}/realms/${KC_REALM}`
)

const client = new keycloakIssuer.Client({
    client_id: KC_ADMIN_CLIENT_ID,
    token_endpoint_auth_method: 'none'
})

let tokenSet = await client.grant({
    grant_type: 'password',
    username: KC_ADMIN_USERNAME,
    password: KC_ADMIN_PASSWORD
})

setInterval(async () => {
    const refreshToken = tokenSet.refresh_token
    tokenSet = await client.refresh(refreshToken)
    console.log("tokenSet", tokenSet)
    kcAdminClient.setAccessToken(tokenSet.access_token)
}, 5 * 1000)

export default kcAdminClient
