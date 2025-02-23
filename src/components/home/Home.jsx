import React, { useEffect, useState } from 'react'
import styles from './home.module.css'
import { connect } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";
const Home = (props) => {
    const [numberOfRows, setNumberOfRows] = useState(props.numberOfRows);
    const [numberOfColumns, setNumberOfColumns] = useState(props.numberOfColumns);
    const [numberOfMines, setNumberOfMines] = useState(props.numberOfMines);
    const [level, setLevel] = useState("custom");

    useEffect(()=>{
        if(level==="stop")
            return ;
        setNumberOfRows(props.numberOfRows);
        setNumberOfColumns(props.numberOfColumns);
        setNumberOfMines(props.numberOfMines);
        
    },[props])

    useEffect(()=>{
        if(level==="easy"){
            setNumberOfRows("10");
            setNumberOfColumns("10");
            setNumberOfMines("10");
        }
        else if (level ==="medium"){
            setNumberOfRows("15");
            setNumberOfColumns("15");
            setNumberOfMines("40");

        }
        else if (level ==="hard"){
            
            setNumberOfRows("20");
            setNumberOfColumns("20");
            setNumberOfMines("100");
        }

    },[level])


    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        if (check(numberOfRows) === 0) {
            alert("Number of rows should be integer bettwen 1 and 50")
            return;
        }
        if (check(numberOfColumns) === 0) {
            alert("Number of columns should be integer bettwen 1 and 50")
            return;
        }
        if(numberOfColumns==="1" && numberOfRows==="1" ){
            alert("You can't make one square game")
            return;
        }
        if (checkMines(numberOfMines, numberOfRows, numberOfColumns) === 0) {
            alert(`Number of Mines should be integer bettwen 1 and ${parseInt(numberOfRows) * parseInt(numberOfColumns) - 1}`)
            return;
        }
        setLevel("stop");
        props.changeTheValues(parseInt(numberOfRows), parseInt(numberOfColumns), parseInt(numberOfMines));
        navigate({
            pathname: "start",
            search: createSearchParams({ numberOfRows: numberOfRows, numberOfColumns: numberOfColumns, numberOfMines: numberOfMines }).toString()
        });
    }

    return (
        <div className={styles.home}>
            <form className={styles.box} onSubmit={handleSubmit}>
                <h1 className={styles.title}>
                    Minesweeper
                </h1>
                <div className={styles.inputs}>
                    <div className={styles.input}>
                        <input
                            required
                            value={numberOfRows}
                            type="number"
                            onChange={(e) => setNumberOfRows(e.target.value)} />
                        <label >Number of Rows</label>
                    </div>
                    <div className={styles.input}>
                        <input
                            required
                            value={numberOfColumns}
                            type="number"
                            onChange={(e) => setNumberOfColumns(e.target.value)} />
                        <label >Number of Columns</label>
                    </div>
                    <div className={styles.input}>
                        <input
                            required
                            value={numberOfMines}
                            type="number"
                            onChange={(e) => setNumberOfMines(e.target.value)} />
                        <label >Number of Mines</label>
                    </div>

                </div>
                <div className={styles.filter}>
                    <div>
                        Chose Level
                    </div>
                    <select value={level} onChange={(e) => { setLevel(e.target.value) }} onClick={(e) => e.preventDefault()}>
                        <option value="custom">Custom</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <button className={styles.button} type="submit">
                    Play
                </button>
            </form>
        </div>
    )
}
function mapStateToProps(state) {
    return {
        numberOfRows: state.numberOfRows,
        numberOfColumns: state.numberOfColumns,
        numberOfMines: state.numberOfMines,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        changeTheValues: () => dispatch({
            type: "changeTheInitValues",
        })

    }
}

function check(num) {
    if (num === null || num === undefined)
        return 0;

    for (let index = 0; index < num.length; index++)
        if (num[index] < '0' || num[index] > '9')
            return 0;

    if (num === "")
        return 0;

    if (num[0] === '0')
        return 0;

    if (parseInt(num) > 50 || parseInt(num) < 1)
        return 0;

    return 1;
}
function checkMines(num, numberOfRows, numberOfColumns) {
    if (num === null || num === undefined)
        return 0;

    for (let index = 0; index < num.length; index++)
        if (num[index] < '0' || num[index] > '9')
            return 0;

    if (num === "")
        return 0;

    if (num[0] === '0')
        return 0;

    if (parseInt(num) >= parseInt(numberOfRows) * parseInt(numberOfColumns) || parseInt(num) < 1)
        return 0;

    return 1;
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
