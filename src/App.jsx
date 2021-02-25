import React, {useState, useEffect, useRef} from 'react';
import './App.scss';

function App() {
    const [displayTime, setDisplayTime] = useState(25 * 60);
    const [breakTime, setBreakTime] = useState(5 * 60);
    const [sessionTime, setSessionTime] = useState(25 * 60);
    const [timeOn, setTimeOn] = useState(false);
    const [onBreak, setOnBreak] = useState(false);
    const audioRef = useRef();

    const playBreakSound = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    };

    useEffect(() => {
        if (timeOn) {
            if (displayTime === 0 && !onBreak) {
                playBreakSound();
                setOnBreak(true);
                setDisplayTime(breakTime);
            }
            if (displayTime === 0 && onBreak) {
                playBreakSound();
                setOnBreak(false);
                setDisplayTime(sessionTime);
            }
        }
    }, [displayTime]);

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        if (!timeOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        return prev - 1;
                    });
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval);
        }
        if (timeOn) {
            clearInterval(localStorage.getItem('interval-id'));
        }
        setTimeOn(!timeOn);
    };

    const resetTime = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setDisplayTime(25 * 60);
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
        setOnBreak(false);
        if (timeOn) {
            clearInterval(localStorage.getItem('interval-id'));
            setTimeOn(false);
        }
    }

    const formatTime = (time, onlyMinutes = false) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (!onlyMinutes) {
            return (minutes < 10 ? "0" + minutes : minutes) +
                ":" +
                (seconds < 10 ? "0" + seconds : seconds);
        } else {
            return minutes;
        }

    };

    const changeTime = (amount, type) => {
        if (!timeOn) {
            if (type === "break") {
                if ((breakTime <= 60 && amount < 0) || (breakTime === 60 * 60 && amount > 0)) {
                    return;
                }
                setBreakTime((prev) => prev + amount);
            } else {
                if ((sessionTime <= 60 && amount < 0) || (sessionTime === 60 * 60 && amount > 0)) {
                    return;
                }
                setSessionTime((prev) => prev + amount);
                if (!timeOn) {
                    setDisplayTime(sessionTime + amount);
                }
            }
        }
    }
    return (
        <div className="center-align">
            <audio ref={audioRef} id="beep" preload="auto"
                   src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
            <h1>Pomodoro click</h1>
            <div className="dual-container">
                <Length title={"break length"}
                        changeTime={changeTime}
                        type={"break"}
                        time={breakTime}
                        formatTime={formatTime}
                />
                <Length title={"session length"}
                        changeTime={changeTime}
                        type={"session"}
                        time={sessionTime}
                        formatTime={formatTime}
                />
            </div>
            <div className="clock-container">
                <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
                <h1 id="time-left">{formatTime(displayTime)}</h1>
                <button id="start_stop" className="btn-large transparent margin-r" onClick={controlTime}>
                    {timeOn ? (
                        <i className="material-icons">pause_circle_filled</i>
                    ) : (
                        <i className="material-icons">play_circle_filled</i>
                    )}
                </button>
                <button id="reset" className="btn-large transparent" onClick={resetTime}>
                    <i className="large material-icons">autorenew</i>
                </button>
            </div>
        </div>
    );
}

function Length({title, changeTime, type, time, formatTime}) {
    return (
        <div>
            <h3 id={type + "-label"}>{title}</h3>
            <div className="time-sets">
                <button id={type + "-decrement"} className="btn-small transparent"
                        onClick={() => changeTime(-60, type)}
                >
                    <i className="large material-icons">arrow_downward</i>
                </button>
                <h3 id={type + "-length"}>{formatTime(time, true)}</h3>
                <button id={type + "-increment"} className="btn-small transparent"
                        onClick={() => changeTime(60, type)}
                >
                    <i className="large material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    )
}

export default App;
