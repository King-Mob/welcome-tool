const { origin, pathname } = window.location;
const BASE_URL = `${origin}${pathname}`;

export async function getLeaderboard(roomId: string) {
    const leaderboardResponse = await fetch(`${BASE_URL}/api/leaderboard?roomId=${roomId}`);
    const leaderboardResult = await leaderboardResponse.text();
    console.log(leaderboardResult)

    return leaderboardResult;
}
