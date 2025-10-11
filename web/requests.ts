const { origin, pathname } = window.location;
const BASE_URL = `${origin}${pathname}`;

export async function getWelcomeMessage(roomId: string) {
    const welcomeResponse = await fetch(`${BASE_URL}/api/welcome?roomId=${roomId}`);
    const welcomeResult = await welcomeResponse.text();

    return welcomeResult;
}

export async function postWelcome(roomId: string, welcomeMessage: string) {
    return await fetch(`${BASE_URL}/api/welcome?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify({
            welcomeMessage
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
}