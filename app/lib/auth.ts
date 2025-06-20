
const LOCATION = "admin.reflectionsprojections.org"
const REDIRECT = "reflectionsprojections.org"

export function googleAuth(clientId: string, selectAccount?: boolean) {
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${REDIRECT}/auth/callback`,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        state: encodeURIComponent(LOCATION)
    });

    if (selectAccount) {
        params.set("prompt", "select_account");
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}