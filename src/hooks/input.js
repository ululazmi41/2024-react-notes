import { useState } from "react";

function useInput(defaultValue = '') {
  const [value, setvalue] = useState(defaultValue);

  function onChangeHandler(value) {
    setvalue(value);
  }

  return [value, onChangeHandler];
}

export default useInput;
