'use client'

import { useEffect, useRef } from 'react'
import { useGameStore, SAMPLE_EVENTS } from '@/store/gameStore'

export default function GameUI() {
  const {
    gameStarted,
    gameOver,
    hp,
    maxHp,
    progress,
    maxProgress,
    timeLeft,
    score,
    currentEvent,
    lastResult,
    startGame,
    updateHp,
    updateTime,
    setCurrentEvent,
    makeChoice,
    reset
  } = useGameStore()

  const hpTimerRef = useRef<NodeJS.Timeout>()
  const eventTimerRef = useRef<NodeJS.Timeout>()
  const gameTimerRef = useRef<NodeJS.Timeout>()

  const startGameLoop = () => {
    hpTimerRef.current = setInterval(() => {
      updateHp(-1)
    }, 1000)

    eventTimerRef.current = setInterval(() => {
      if (!currentEvent) {
        const randomEvent = SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)]
        setCurrentEvent(randomEvent)
      }
    }, 1500)

    gameTimerRef.current = setInterval(() => {
      const currentTime = useGameStore.getState().timeLeft
      updateTime(currentTime - 1)
    }, 1000)
  }

  const stopGameLoop = () => {
    if (hpTimerRef.current) clearInterval(hpTimerRef.current)
    if (eventTimerRef.current) clearInterval(eventTimerRef.current)
    if (gameTimerRef.current) clearInterval(gameTimerRef.current)
  }

  useEffect(() => {
    if (gameStarted && !gameOver) {
      startGameLoop()
    } else {
      stopGameLoop()
    }

    return () => stopGameLoop()
  }, [gameStarted, gameOver])

  const handleStartGame = () => {
    startGame()
  }

  const handleReset = () => {
    stopGameLoop()
    reset()
  }

  if (!gameStarted) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#eee'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🏔️ Summit Survivor</h1>
        <p style={{ fontSize: '18px', marginBottom: '40px', textAlign: 'center' }}>
          2분 타임어택 생존 클리커<br/>
          3,000m 정상을 향해 올라가세요!
        </p>
        <button
          onClick={handleStartGame}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            backgroundColor: '#16213e',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          게임 시작
        </button>
      </div>
    )
  }

  if (gameOver) {
    const isVictory = progress >= maxProgress || timeLeft <= 0
    const victoryType = progress >= maxProgress ? 'summit' : 'survival'
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: isVictory ? '#0f3460' : '#2e1a1a',
        color: '#eee'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>
          {isVictory
            ? (victoryType === 'summit' ? '🏔️ 정상 정복!' : '⏰ 생존 성공!')
            : '💀 게임 오버'
          }
        </h1>
        <div style={{ fontSize: '18px', textAlign: 'center', marginBottom: '30px' }}>
          {isVictory && victoryType === 'summit' && <p>🎉 3,000m 정상에 도달했습니다!</p>}
          {isVictory && victoryType === 'survival' && <p>🎉 2분간 생존에 성공했습니다!</p>}
          <p>최종 점수: {score}점</p>
          <p>진행도: {progress}/{maxProgress}m ({Math.round(progress/maxProgress*100)}%)</p>
          <p>생존 시간: {120-timeLeft}초</p>
        </div>
        <button
          onClick={handleReset}
          style={{
            padding: '15px 30px',
            fontSize: '20px',
            backgroundColor: '#16213e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          다시 시작
        </button>
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#eee',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        fontSize: '18px'
      }}>
        <div>HP: {hp}/{maxHp}</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
          <div style={{
            width: '60px',
            height: '6px',
            backgroundColor: '#0f3460',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(timeLeft / 120) * 100}%`,
              height: '100%',
              backgroundColor: timeLeft > 30 ? '#4CAF50' : timeLeft > 10 ? '#FF9800' : '#f44336',
              transition: 'width 1s linear, background-color 0.3s'
            }} />
          </div>
        </div>
        <div>점수: {score}</div>
      </div>

      <div style={{
        backgroundColor: '#16213e',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '10px', fontSize: '16px' }}>🏔️ 정상까지: {maxProgress - progress}m 남음</div>

        <div style={{
          position: 'relative',
          width: '100%',
          height: '80px',
          background: 'linear-gradient(to top, #2d5016 0%, #4a7c59 50%, #87ceeb 80%, #ffffff 100%)',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <div style={{
            position: 'absolute',
            bottom: `${(progress/maxProgress)*100}%`,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            transition: 'bottom 0.5s ease-out'
          }}>
            🧗‍♀️
          </div>

          <div style={{
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '16px'
          }}>
            🎯
          </div>

          <div style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            fontSize: '12px',
            color: '#fff'
          }}>
            {Math.round((progress/maxProgress)*100)}%
          </div>
        </div>

        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#0f3460',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(progress/maxProgress*100, 100)}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s'
          }} />
        </div>

        <div style={{ marginTop: '5px', fontSize: '14px', color: '#ccc' }}>
          {progress}/{maxProgress}m
        </div>
      </div>

      <div style={{
        backgroundColor: '#16213e',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '5px'
      }}>
        <div style={{ marginBottom: '5px' }}>체력</div>
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#0f3460',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${hp/maxHp*100}%`,
            height: '100%',
            backgroundColor: hp > 30 ? '#4CAF50' : '#f44336',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {lastResult && (
        <div style={{
          backgroundColor: '#d4af37',
          color: '#000',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px',
          fontWeight: 'bold',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          {lastResult}
        </div>
      )}

      {currentEvent && (
        <div style={{
          backgroundColor: '#16213e',
          padding: '20px',
          borderRadius: '12px',
          marginTop: 'auto',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{currentEvent.title}</h3>
          <p style={{ margin: '0 0 20px 0' }}>{currentEvent.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentEvent.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => makeChoice(index)}
                style={{
                  padding: '15px',
                  fontSize: '16px',
                  backgroundColor: '#0f3460',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}