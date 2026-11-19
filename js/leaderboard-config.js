// js/leaderboard-config.js - Cấu hình kết nối Firebase Realtime Database cho BXH Game Thể Chế
(function attachLeaderboardConfig(globalScope) {
  const config = {
    firebaseDbUrl:
      "https://ktct-459fa-default-rtdb.asia-southeast1.firebasedatabase.app",
    maxScoredPlays: 5,
    topLimit: 10,
    requestTimeoutMs: 7000,
    storageKeys: {
      player: "ktct_game_player_v1",
      localLeaderboard: "ktct_game_leaderboard_local_v1",
    },
  };

  if (globalScope && typeof globalScope === "object") {
    globalScope.GAME_LEADERBOARD_CONFIG = config;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
  }
})(typeof window !== "undefined" ? window : globalThis);
