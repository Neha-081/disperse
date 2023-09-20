import React, { useState } from "react";
import { useEffect } from "react";
import { mergeAndCount } from "../../utils";
import TextAreaWithLineNumber from 'text-area-with-line-number';

const Disperse = () => {
  const [address, setAddress] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [arr, setArr] = useState([]);

  Array.prototype.getDuplicates = function () {
    var duplicates = {};
    for (var i = 0; i < this.length; i++) {
      if (duplicates.hasOwnProperty(this[i])) {
        duplicates[this[i]].push(i + 1);
      } else if (this.lastIndexOf(this[i]) !== i) {
        duplicates[this[i]] = [i + 1];
      }
    }
    return duplicates;
  };

  const newAddressArr = arr?.map((elem) => elem.address);
  const duplicateAddress = newAddressArr?.getDuplicates();

  //function to get input in textarea
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  //making of address string in array
  useEffect(() => {
    if (address) {
      const strArr = address
        .trim()
        .split(/[\r\n]+/)
        .map((str) => str.split(/[=, ]/))
        ?.map((item, ind) => {
          let address = item[0];
          let amount;
          if (isNaN(item[1])) {
            amount = item[1] || 0
          } else {
            amount = +item[1]
          }
          let index = ind;
          return { address, amount, index };
        });
      setArr(strArr);
    }
  }, [address]);
  
  //function to validate and display errors
  const handleValidate = () => {
    const numAmount = arr?.filter((el) => {
      if (el.amount && isNaN(el.amount)) {
        return el;
      }
    });

    if (numAmount.length) {
      setErrorMessage([]);
      setShowOptions(false);
      arr?.map((obj, index) => {
        if (obj.amount && isNaN(obj.amount)) {
          setErrorMessage((prev) => [
            ...prev,
            `Line ${index + 1} wrong amount`,
          ]);
        }
      });
    } else if (duplicateAddress) {
      setShowOptions(true);
      setErrorMessage([]);
      Object.entries(duplicateAddress).map(([key, value], i) => {
        setErrorMessage((prev) => [
          ...prev,
          `Address ${key} encountered duplicate in line: ${[...value]}`,
        ]);
      });
    } else {
      setErrorMessage([]);
    }
  };

  useEffect(() => {
    setErrorMessage([]);
  }, [arr]);

  //function for keeping the first address
  const handleKeepFirst = () => {
    let dupArr = [];
    let remainArr = [];
    arr.filter((el) => {
      Object.entries(duplicateAddress)?.map(([key, value], i) => {
        if (el.address === key && value[0] === el.index + 1) {
          dupArr.push(el);
        }
      });
    });
    Object.keys(duplicateAddress).filter((id) => {
      remainArr.push(id);
    });

    const finalArr = arr
      ?.filter((el) => !remainArr.includes(el.address))
      ?.concat(dupArr);
    let str = "";
    finalArr?.map((item) => {
      str += item.address + " " + item.amount + "\n";
      setAddress(str);
    });
  };

  //function to combine the amount of duplicate addresses
  const handleCombine = () => {
    const sumRes = mergeAndCount(arr);
    let str = "";
    sumRes?.map((item) => {
          str += item.address + " " + item.amount + "\n";
          setAddress(str);
    });
  };

  return (
    <>
      <h2>Validate your Address</h2>
      <div className="main-cont">
         <TextAreaWithLineNumber value={address} onChange={handleAddressChange}/>
      </div>
      <button onClick={handleValidate} className="button">
        Next
      </button>
      {errorMessage.length > 0 && (
        <>
          {showOptions && (
            <div className="err-box">
              <p>Duplicated</p>
              <div>
                <button onClick={handleKeepFirst}>Keep the first one </button>
                <p>|</p>
                <button onClick={handleCombine}> Combine balance</button>
              </div>
            </div>
          )}
          <div className="error-message">
            {errorMessage?.map((err, index) => (
              <p key={index} className="error-text">
                {err}
              </p>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Disperse;
