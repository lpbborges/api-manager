export const keycloakConfig = {
    realm: process.env.KC_REALM,
    bearerOnly: true,
    serverUrl: process.env.KC_BASE_URL,
    clientId: process.env.KC_CLIENT_ID
}

export const keycloakAdminConfig = {
    ...keycloakConfig,
    clientId: process.env.KC_ADMIN_CLIENT_ID,
}
