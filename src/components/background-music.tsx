import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderCircle, Music2, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '@/lib/audio-effects';

const MUSIC_PREFERENCE_KEY = 'ck_background_music_enabled';
const TARGET_VOLUME = 0.12;
const FADE_IN_MS = 2500;
const FADE_OUT_MS = 1500;

type PlaybackState = 'loading' | 'playing' | 'blocked' | 'paused';

function getStoredMusicPreference(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(MUSIC_PREFERENCE_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

function setStoredMusicPreference(val: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MUSIC_PREFERENCE_KEY, val ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const enabledRef = useRef<boolean>(getStoredMusicPreference());
  const loopTransitionRef = useRef(false);
  const pausedForHiddenTabRef = useRef(false);

  const [enabled, setEnabled] = useState(enabledRef.current);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    enabledRef.current ? 'loading' : 'paused'
  );

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (target: number, duration: number, onComplete?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      cancelFade();
      const startedAt = performance.now();
      const initialVolume = audio.volume;

      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = progress * (2 - progress);
        audio.volume = Math.max(
          0,
          Math.min(1, initialVolume + (target - initialVolume) * eased)
        );

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(step);
        } else {
          fadeFrameRef.current = null;
          onComplete?.();
        }
      };

      fadeFrameRef.current = window.requestAnimationFrame(step);
    },
    [cancelFade]
  );

  const startWithFade = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !enabledRef.current || document.visibilityState === 'hidden') {
      return false;
    }

    cancelFade();
    audio.volume = 0;

    try {
      await audio.play();
      setPlaybackState('playing');
      fadeTo(TARGET_VOLUME, FADE_IN_MS);
      return true;
    } catch {
      setPlaybackState('blocked');
      return false;
    }
  }, [cancelFade, fadeTo]);

  const stopWithFade = useCallback(
    (duration = FADE_OUT_MS) => {
      const audio = audioRef.current;
      if (!audio) return;

      loopTransitionRef.current = false;
      if (audio.paused) {
        audio.volume = 0;
        setPlaybackState('paused');
        return;
      }

      fadeTo(0, duration, () => {
        audio.pause();
        setPlaybackState('paused');
      });
    },
    [fadeTo]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.loop = true;

    if (!enabledRef.current) {
      setPlaybackState('paused');
      return;
    }

    let isMounted = true;
    const attemptAutoplay = async () => {
      const started = await startWithFade();
      if (!isMounted) return;
      if (!started && enabledRef.current) {
        setPlaybackState('blocked');
      }
    };

    void attemptAutoplay();

    const handleFirstInteraction = () => {
      if (enabledRef.current && audioRef.current?.paused) {
        void startWithFade();
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      isMounted = false;
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [startWithFade]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio || !enabledRef.current) return;

      if (document.visibilityState === 'hidden' && !audio.paused) {
        pausedForHiddenTabRef.current = true;
        fadeTo(0, 350, () => audio.pause());
      } else if (document.visibilityState === 'visible' && pausedForHiddenTabRef.current) {
        pausedForHiddenTabRef.current = false;
        void startWithFade();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fadeTo, startWithFade]);

  useEffect(() => cancelFade, [cancelFade]);

  const togglePlayback = () => {
    soundFx.playTap();
    if (enabledRef.current && playbackState === 'blocked') {
      setPlaybackState('loading');
      void startWithFade();
      return;
    }

    if (enabledRef.current) {
      enabledRef.current = false;
      loopTransitionRef.current = false;
      setEnabled(false);
      setStoredMusicPreference(false);
      stopWithFade();
      return;
    }

    enabledRef.current = true;
    loopTransitionRef.current = false;
    setEnabled(true);
    setStoredMusicPreference(true);
    setPlaybackState('loading');
    void startWithFade();
  };

  const isPlaying = enabled && playbackState === 'playing';
  const statusText = isPlaying
    ? 'Đang phát · 12%'
    : playbackState === 'blocked'
    ? 'Chạm để phát'
    : enabled
    ? 'Đang chuẩn bị'
    : 'Đã tắt';

  const buttonLabel = isPlaying
    ? 'Tắt nhạc nền Life in Motion'
    : 'Bật nhạc nền Life in Motion';

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/life-in-motion.mp3"
        preload="auto"
        aria-hidden="true"
      />
      <button
        type="button"
        className={`background-music-control ${isPlaying ? 'is-playing' : ''}`}
        onClick={togglePlayback}
        aria-label={buttonLabel}
        aria-pressed={isPlaying}
        title={buttonLabel}
      >
        <span className="music-control-icon" aria-hidden="true">
          {playbackState === 'loading' && enabled ? (
            <LoaderCircle className="music-loading-icon" />
          ) : isPlaying ? (
            <Volume2 />
          ) : enabled ? (
            <Music2 />
          ) : (
            <VolumeX />
          )}
        </span>
        <span className="music-control-copy">
          <strong>Life in Motion</strong>
          <small>{statusText}</small>
        </span>
        <span className="music-equalizer" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
    </>
  );
}
export default BackgroundMusic;
