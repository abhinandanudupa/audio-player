import { React, useState, useRef, useEffect } from 'react';
import styles from '../styles/AudioPlayer.module.css';
import { BsArrowCounterclockwise, BsArrowClockwise } from 'react-icons/bs'
import { GrPlay, GrPause } from 'react-icons/gr'

const AudioPlayer = () => {
    const [isPaused, setPause] = useState(true) // to store the play state of the audio player
    const [songDuration, setSongDuration] = useState(0.0) // to store the length of the song
    const [currentTime, setCurrentTime] = useState(0.0) // to store the second the player is playing

    const audioPlayer = useRef() // reference to audio tag - for play/pause
    const progressBar = useRef() // reference to range input tag - to change the time to play
    const animationRef = useRef() // reference to the progress update hook

    const togglePlaying = () => {
        const currentState = isPaused
        setPause(!isPaused)
        if (currentState) {
            audioPlayer.current.play()
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer.current.pause()
            cancelAnimationFrame(animationRef.current)
        }
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value
        setCurrentTime(progressBar.current.value)

    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime
        setCurrentTime(audioPlayer.current.currentTime)
        requestAnimationFrame(whilePlaying)

    }

    const secondsToHumanReadeable = (secs) => {
        const seconds = Math.floor(secs % 60)
        const hours = Math.floor(secs / 3600)
        // returns seconds formatted into [hours : ]mm : ss - [*] implies '*' optional
        return `${hours == 0 ? '' : hours + ' : '}${Math.floor(secs / 60)}` +
            ` : ${(seconds > 9) ? seconds : '0' + seconds}`
    }

    useEffect(() => {
        progressBar.current.style.setProperty('--seek-before-width',
            `${currentTime / songDuration * 100}%`)
    }, [currentTime, songDuration])

    useEffect(
        () => {
            // store the length of the song in seconds
            const seconds = Math.ceil(audioPlayer.current.duration);
            // set 'songDuration' to the total seconds of the song
            setSongDuration(seconds)
            // set the max value of the progress bar
            progressBar.current.max = songDuration

        }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState, songDuration]
    )


    return (
        <div className={styles.AudioPlayer}>
            <audio src="https://pl.meln.top/mr/3461179fbc00220ca3aca658cb8ec293.mp3?session_key=ebae19d6e277a55713244bc362136060"
                type="audio/mpeg" preload="metadata" ref={audioPlayer} />

            <span className={styles.timeLabels}>
                <span className={styles.currentProgress}>
                    {secondsToHumanReadeable(currentTime)}
                </span>
                <div>
                    <input type="range" className={styles.progressBar} min="0"
                        defaultValue={0} ref={progressBar} onChange={changeRange}
                        step={0.001} />
                </div>
            </span>

            <button className={styles.playButtons}>
                <BsArrowCounterclockwise />
            </button>
            <button onClick={togglePlaying} className={styles.playButtons}>
                {(isPaused) ? <GrPlay /> : <GrPause />}
            </button>
            <button className={styles.playButtons}>
                <BsArrowClockwise />
            </button>
        </div>
    )
}

export default AudioPlayer
