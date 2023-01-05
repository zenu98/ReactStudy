import React, { useState, useEffect, useCallback, useReducer } from "react";
import classes from "./Td.module.css";
import { CgCheckR } from "react-icons/cg";
import LoadingIndicator from "./UI/LoadingIndicator";

const clickedDataReducer = (state, action) => {
  switch (action.type) {
    case "ON":
      return [...state, action.data];
    case "OFF":
      return state.filter((item) => item.id !== action.id);
    case "CLEAR":
      return [];
    default:
      throw new Error("error");
  }
};

const disabledButtonReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.id];
    default:
      throw new Error("error");
  }
};

// const httpReducer = (state, action) => {
//   switch(action.type){
//     case ""
//   }
// }

const Td = (props) => {
  const { onClick } = props;
  const [clickedData, dispatch] = useReducer(clickedDataReducer, []);
  const [disabledBtn, dispatchDisabled] = useReducer(disabledButtonReducer, []);
  const [dataList, setDataList] = useState([]);
  const [chrList, setChrList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(disabledBtn);
  console.log(dataList);
  console.log(clickedData);

  const dataListHandler = useCallback((data) => {
    setDataList(data);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const dataArr = [];
    fetch("https://word-puzzle-efb93-default-rtdb.firebaseio.com/animals.json")
      .then((response) => response.json())
      .then((responseData) => {
        for (let i = responseData.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [responseData[i], responseData[j]] = [
            responseData[j],
            responseData[i],
          ];
        }
        const loadedAnimals = [];
        for (const key in responseData) {
          if (loadedAnimals.length < 8) {
            loadedAnimals.push({
              id: key,
              name: responseData[key].name,
              description: responseData[key].description,
            });
          } else break;
        }
        dataListHandler(loadedAnimals);

        for (let k = 0; k < loadedAnimals.length; k++) {
          for (let i = 0; i <= loadedAnimals[k].name.length - 1; i++) {
            const chr = loadedAnimals[k].name.substring(i, i + 1);

            dataArr.push({
              id: Math.random().toString(),
              word: chr,
            });
          }
        }
        dataArr.sort(() => Math.random() - 0.5);
        setChrList(dataArr);
        setIsLoading(false);
      });
  }, [dataListHandler]);

  useEffect(() => {
    console.log("useEffect");
    let chr = "";
    clickedData.map(({ word }) => (chr += word));
    onClick(chr);
    console.log(clickedData);
  }, [onClick, clickedData]);

  const clickHandler = (e) => {
    console.log("click");
    console.log(e.target.name);

    if (clickedData.some((item) => item.id === e.target.name)) {
      dispatch({
        type: "OFF",
        id: e.target.name,
      });
    } else {
      clickedData.length < 2 &&
        dispatch({
          type: "ON",
          data: { id: e.target.name, word: e.target.value },
        });
    }
  };

  const submitHanlder = (e) => {
    e.preventDefault();
    if (dataList.some((item) => item.name === props.word)) {
      setDataList((prev) => prev.filter((item) => item.name !== props.word));
      clickedData.map(({ id }) => {
        return dispatchDisabled({
          type: "ADD",
          id: id,
        });
      });
      dispatch({ type: "CLEAR" });

      props.onSubmit();
    } else {
      alert(`${props.word}...?`);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className={classes.loading}>
          <LoadingIndicator />
        </div>
      ) : (
        <div>
          <div className={classes["data-table"]}>
            {chrList.map((item) => (
              <button
                disabled={disabledBtn.includes(item.id)}
                type="button"
                name={item.id}
                key={item.id}
                value={item.word}
                className={`${
                  clickedData.some((a) => a.id === item.id)
                    ? classes["clicked-btn"]
                    : classes.btn
                }`}
                onClick={clickHandler}
              >
                <span>{item.word}</span>
              </button>
            ))}
          </div>

          <div className={classes["result-box"]}>
            <div>
              <span>{props.word[0]}</span>
            </div>
            <div>
              <span>{props.word[1]}</span>
            </div>
          </div>

          <CgCheckR onClick={submitHanlder} className={classes["check-btn"]} />
        </div>
      )}
    </>
  );
};

export default Td;