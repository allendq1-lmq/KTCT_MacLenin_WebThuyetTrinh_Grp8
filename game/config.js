// game/config.js - Cấu hình kết nối Firebase Realtime Database cho Web Game Thể Chế Độc Lập
(function attachStandaloneGameConfig(globalScope) {
  const config = {
    firebaseDbUrl:
      "https://ktct-459fa-default-rtdb.asia-southeast1.firebasedatabase.app",
    maxScoredPlays: 5,
    requestTimeoutMs: 7000,
    storageKeys: {
      player: "ktct_standalone_game_player_v1",
      localLeaderboard: "ktct_standalone_game_leaderboard_v1",
    },
  };

  if (globalScope && typeof globalScope === "object") {
    globalScope.GAME_CONFIG = config;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = config;
  }
})(typeof window !== "undefined" ? window : globalThis);
