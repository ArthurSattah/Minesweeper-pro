import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import styles from "./game.module.css";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import clock from "../../images/timer.png";
import loseSound from "../../sounds/lose.mp3";
import winSound from "../../sounds/win.mp3";
import clickSound from "../../sounds/click.mp3";
import hintSound from "../../sounds/hint.mp3";
import zeroClickSound from "../../sounds/zeroclick.mp3";

const losingSound = new Audio(loseSound);
losingSound.volume = 1;

const winningSound = new Audio(winSound);
winningSound.volume = 1;

const clickingSound = new Audio(clickSound);
clickingSound.volume = 1;

const hintingSound = new Audio(hintSound);
hintingSound.volume = 1;

const zeroClickingSound = new Audio(zeroClickSound);
zeroClickingSound.volume = 1;


const Game = (props) => {

  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [pinding, setPinding] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  
  let numberOfRows = searchParams.get("numberOfRows");
  let numberOfColumns = searchParams.get("numberOfColumns");
  let numberOfMines = searchParams.get("numberOfMines");

  const [g, setG] = useState(0);
  useEffect(() => {
    function arthur(e) {
      losingSound.currentTime = 0;
      losingSound.pause();
      winningSound.currentTime = 0;
      winningSound.pause();
      zeroClickingSound.currentTime = 0;
      zeroClickingSound.pause();
      setPinding(1);
      props.handleReset();
    }
    window.addEventListener('popstate', arthur(), { capture: true });
    return () => {
      window.removeEventListener('popstate', arthur(), { capture: true })
    }
  }, [])

  useEffect(() => {

    if (goodParams(numberOfRows, numberOfColumns, numberOfMines)) {
      props.changeTheValues(parseInt(numberOfRows), parseInt(numberOfColumns), parseInt(numberOfMines));
      props.makeTheGame();
      setPinding(0);
    }
    else {
      alert("invalid data");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (pinding === 1)
      return;
    if (props.gameState === 0)
      return;

    if (props.gameState === 2) {
      losingSound.play();
      return;
    }

    if (props.gameState === 3) {
      winningSound.play();
      return;
    }
    const x = setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearTimeout(x);
  }, [time, props.gameState]);


  useEffect(() => {
    if (props.gameState !== 1)
      return;
    if (g === props.openedZero)
      clickingSound.play();
    else
      setG(props.openedZero);
  }, [props.arrState]);

  useEffect(() => {
    if (props.gameState === 0)
      return;
    if (props.usingHint === 0)
      return;

    hintingSound.play();
  }, [props.usingHint]);

  useEffect(() => {
    if (props.gameState !== 1)
      return;
    zeroClickingSound.play();
  }, [props.openedZero]);

  return (
    <div className={styles.game}>
      {pinding === 1 && <div className={styles.goingBack}> loading ..</div>}

      {pinding === 0 &&
        <>
          <div className={styles.topSection}>
            <div className={styles.back} onClick={() => {
              losingSound.currentTime = 0;
              losingSound.pause();
              winningSound.currentTime = 0;
              winningSound.pause();
              zeroClickingSound.currentTime = 0;
              zeroClickingSound.pause();
              setPinding(1);
              props.handleReset();
              navigate("/")
            }}>
              Back
            </div>
            <div className={styles.timer}>
              <img src={clock} alt="clock-icon" className={styles.clock} /> {time}
            </div>
            <div >
              {props.numberOfMines - props.usedMines} X
            </div>
          </div>

          <div className={styles.middleSection} onContextMenu={(e) => { e.preventDefault(); }}>
            {
              props.arrValue.map((row, i) => {
                return (
                  <div key={i} className={styles.rows}>
                    {
                      row.map((digit, j) => {
                        return (
                          <div key={i * 100 + j}
                            className={` 
                                          ${styles[`digit`]} 
                                          ${props.arrState[i][j] === 1 ? styles.openSquare : ""} 
                                          ${props.arrState[i][j] === 1 ? styles[`value${props.arrValue[i][j]}`] : ""} 
                                          ${props.arrState[i][j] === 2 ? styles[`value-1`] : ""}
                                          ${(props.arrState[i][j] === 1 && props.arrValue[i][j] === -1) ? styles.losingSquare : ""}
                                          ${(props.arrState[i][j] === 2 && props.arrValue[i][j] !== -1 && props.gameState === 2) ? styles.losingSquare : ""}
                                          ${(props.gameState === 2 && props.arrState[i][j] === 0 && props.arrValue[i][j] === -1) ? styles.hidingMine : ""}

                                      `}
                            onClick={(e) => {
                              e.preventDefault();
                              props.handleLeftClick(i, j);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              props.handleRightClick(i, j);
                            }}>
                            {
                              props.gameState === 2 && digit === -1 ? "X" :
                               props.gameState === 2 && props.arrState[i][j] === 2 && digit !==-1 ? digit :
                                props.arrState[i][j] === 0 ? "" :
                                  props.arrState[i][j] === 2 ? "X" :
                                    digit === 0 ? "" :
                                      digit
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </div>

          <div className={styles.downSection}>
            <div onClick={() => {
              losingSound.currentTime = 0;
              losingSound.pause();
              winningSound.currentTime = 0;
              winningSound.pause();
              zeroClickingSound.currentTime = 0;
              zeroClickingSound.pause();
              props.makeTheGame();
              setTime(0);
              setG(0);
            }} className={styles.restart}>
              Restart
            </div>
            {props.gameState === 2 && <div className={styles.lose}>Game Over</div>}
            {props.gameState === 3 && <div className={styles.win}>Congrats</div>}

            <div onClick={() => { props.handleUseHint(); }} className={`${styles.hint} ${props.usingHint === 1 ? styles.usingHint : styles.normal}`}>
              Hint : {props.usedHint}
            </div>
          </div>
        </>
      }

    </div>

  )
}
function mapStateToProps(state) {
  return {
    numberOfRows: state.numberOfRows,
    numberOfColumns: state.numberOfColumns,
    numberOfMines: state.numberOfMines,
    usedMines: state.usedMines,
    arrValue: state.arrValue,
    arrState: state.arrState,
    gameState: state.gameState,
    usingHint: state.usingHint,
    usedHint: state.usedHint,
    openedZero: state.openedZero,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changeTheValues: (numberOfRows, numberOfColumns, numberOfMines) => dispatch({
      type: "changeTheInitValues",
      numberOfRows: numberOfRows,
      numberOfColumns: numberOfColumns,
      numberOfMines: numberOfMines,
    }),
    makeTheGame: () => dispatch({
      type: "makeTheGame",
    }),
    handleLeftClick: (i, j) => dispatch({
      type: "handleLeftClick",
      i: i,
      j: j,
    }),
    handleRightClick: (i, j) => dispatch({
      type: "handleRightClick",
      i: i,
      j: j,
    }),
    handleUseHint: () => dispatch({
      type: "handleUseHint",
    }),
    handleReset: () => dispatch({
      type: "handleReset",
    })

  }
}
function goodParams(numberOfRows, numberOfColumns, numberOfMines) {

  if (numberOfRows === null || numberOfRows === undefined)
    return 0;

  for (let index = 0; index < numberOfRows.length; index++)
    if (numberOfRows[index] < '0' || numberOfRows[index] > '9')
      return 0;

  if (numberOfRows === "")
    return 0;
  if (numberOfRows[0] === '0')
    return 0;

  if (parseInt(numberOfRows) > 50 || parseInt(numberOfRows) < 1)
    return 0;


  if (numberOfColumns === null || numberOfColumns === undefined)
    return 0;

  for (let index = 0; index < numberOfColumns.length; index++)
    if (numberOfColumns[index] < '0' || numberOfColumns[index] > '9')
      return 0;

  if (numberOfColumns === "")
    return 0;
  if (numberOfColumns[0] === '0')
    return 0;

  if (parseInt(numberOfColumns) > 50 || parseInt(numberOfColumns) < 1)
    return 0;

  if (numberOfMines === null || numberOfMines === undefined)
    return 0;

  for (let index = 0; index < numberOfMines.length; index++)
    if (numberOfMines[index] < '0' || numberOfMines[index] > '9')
      return 0;

  if (numberOfMines === "")
    return 0;
  if (numberOfMines[0] === '0')
    return 0;

  let GameArea = parseInt(numberOfRows) * parseInt(numberOfColumns);
  if (parseInt(numberOfMines) >= GameArea || parseInt(numberOfMines) < 1)
    return 0;

  return 1;
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
