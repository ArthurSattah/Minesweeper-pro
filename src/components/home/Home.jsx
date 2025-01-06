import React from 'react'
import styles from './home.module.css'
import { connect } from "react-redux";
import { createSearchParams, useNavigate} from "react-router-dom";
const Home = (props) => {

    const navigate = useNavigate();
    return (
        <div className={styles.home}>
            <div className={styles.box}>
                <h1 className={styles.title}>
                    Minesweeper
                </h1>
                <div className={styles.inputs}>
                    <div className={styles.input}>
                        <input defaultValue={10} id='NumberOfRows' />
                        <label >Number of Rows</label>
                    </div>
                    <div className={styles.input}>
                        <input defaultValue={10} id='NumberOfColumns' />
                        <label >Number of Columns</label>
                    </div>
                    <div className={styles.input}>
                        <input defaultValue={10} id='NumberOfMines' />
                        <label >Number of Mines</label>
                    </div>

                </div>
                <button className={styles.button} onClick={() => {

                    let numberOfRows = document.getElementById("NumberOfRows").value;
                    let numberOfColumns = document.getElementById("NumberOfColumns").value;
                    let numberOfMines = document.getElementById("NumberOfMines").value;

                    for (let index = 0; index < numberOfRows.length; index++) {
                        if (numberOfRows[index] < '0' || numberOfRows[index] > '9') {
                            alert("The number of rows should be an integer positave number");
                            return;
                        }
                    }
                    if (numberOfRows === "") {
                        alert("The number of rows should not be empty");
                        return;
                    }
                    if (parseInt(numberOfRows) > 50 || parseInt(numberOfRows) < 1) {
                        alert("The number of rows field should be from 1 to 50");
                        return;
                    }

                    for (let index = 0; index < numberOfColumns.length; index++) {
                        if (numberOfColumns[index] < '0' || numberOfColumns[index] > '9') {
                            alert("The number of columns should be an integer positave number");
                            return;
                        }
                    }
                    if (numberOfColumns === "") {
                        alert("The number of columns should not be empty");
                        return;
                    }
                    if (parseInt(numberOfColumns) > 50 || parseInt(numberOfColumns) < 1) {
                        alert("The number of columns field should be from 1 to 50");
                        return;
                    }

                    for (let index = 0; index < numberOfMines.length; index++) {
                        if (numberOfMines[index] < '0' || numberOfMines[index] > '9') {
                            alert("The number of mines should be an integer positave number");
                            return;
                        }
                    }
                    if (numberOfMines === "") {
                        alert("The number of mines field should not be empty");
                        return;
                    }
                    let GameArea = parseInt(numberOfRows) * parseInt(numberOfColumns);
                    if (parseInt(numberOfMines) >= GameArea || parseInt(numberOfMines) < 1) {
                        alert(`The number of mines should be bigger the 0 and smaller the ${GameArea}`);
                        return;
                    }
                    props.changeTheValues(parseInt(numberOfRows),parseInt(numberOfColumns),parseInt(numberOfMines));
                    navigate({
                        pathname: "https://arthursattah.github.io/Minesweeper-pro/start",
                        search: createSearchParams({ numberOfRows: numberOfRows , numberOfColumns: numberOfColumns , numberOfMines: numberOfMines}).toString()
                    });
                }}>
                    Play
                </button>
            </div>
        </div>
    )
}
function mapStateToProps(state) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
        changeTheValues: () => dispatch({
            type: "changeTheInitValues",
        })

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
