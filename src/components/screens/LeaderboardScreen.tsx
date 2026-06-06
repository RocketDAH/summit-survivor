"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LeaderboardEntry } from "@/types/api";
import { formatScore, formatAltitude, formatTime } from "@/lib/score";

export function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard?limit=20");
        const data = await response.json();
        
        if (data.success) {
          setEntries(data.data.entries);
        } else {
          setError(data.error || "Failed to load leaderboard");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="pixel-min-h-screen pixel-p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div className="pixel-flex pixel-items-center pixel-justify-between pixel-mb-6">
        <h1 className="pixel-text-display pixel-text-xl pixel-text-accent">
          🏆 리더보드
        </h1>
        <Link href="/" className="pixel-btn pixel-btn--ghost pixel-btn--sm">
          ← 돌아가기
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="pixel-flex-center pixel-py-8">
          <p className="pixel-text-body pixel-text-secondary pixel-animate-bounce">
            로딩 중...
          </p>
        </div>
      ) : error ? (
        <div className="pixel-card pixel-card--panel pixel-text-center">
          <p className="pixel-text-body pixel-text-negative">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="pixel-btn pixel-btn--secondary pixel-mt-4"
          >
            다시 시도
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="pixel-card pixel-card--panel pixel-text-center">
          <p className="pixel-text-korean pixel-text-lg pixel-text-secondary">
            아직 기록이 없습니다
          </p>
          <p className="pixel-text-body pixel-text-sm pixel-text-disabled pixel-mt-2">
            첫 번째 등반가가 되어보세요!
          </p>
          <Link href="/" className="pixel-btn pixel-btn--accent pixel-mt-4">
            게임 시작
          </Link>
        </div>
      ) : (
        <div className="pixel-card pixel-card--panel pixel-p-0">
          <table className="pixel-w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                <th className="pixel-text-display pixel-text-xs pixel-text-secondary pixel-p-3 pixel-text-center" style={{ width: "50px" }}>
                  #
                </th>
                <th className="pixel-text-display pixel-text-xs pixel-text-secondary pixel-p-3 pixel-text-left">
                  이름
                </th>
                <th className="pixel-text-display pixel-text-xs pixel-text-secondary pixel-p-3 pixel-text-right">
                  점수
                </th>
                <th className="pixel-text-display pixel-text-xs pixel-text-secondary pixel-p-3 pixel-text-right" style={{ width: "80px" }}>
                  고도
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr 
                  key={entry.id}
                  style={{ 
                    borderBottom: "1px solid var(--color-border)",
                    backgroundColor: index < 3 ? "rgba(255, 215, 0, 0.05)" : "transparent"
                  }}
                >
                  <td className="pixel-text-number pixel-text-sm pixel-p-3 pixel-text-center">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : entry.rank}
                  </td>
                  <td className="pixel-text-korean pixel-text-base pixel-p-3">
                    <span className="pixel-text-primary">{entry.playerName}</span>
                    {entry.victory && <span className="pixel-ml-2">⛰️</span>}
                  </td>
                  <td className="pixel-text-number pixel-text-base pixel-p-3 pixel-text-right pixel-text-accent">
                    {formatScore(entry.score)}
                  </td>
                  <td className="pixel-text-number pixel-text-sm pixel-p-3 pixel-text-right pixel-text-secondary">
                    {formatAltitude(entry.altitude)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="pixel-flex pixel-gap-4 pixel-justify-center pixel-mt-4 pixel-text-sm pixel-text-secondary">
        <span>⛰️ = 정상 정복</span>
      </div>
    </div>
  );
}
