import { useState } from "react";

function useInput(defaultValue = '') {
  const [value, setvalue] = useState(defaultValue);

  function onChangeHandler(event) {
    setvalue(event.target.value);
  }

  return [value, onChangeHandler];
}

export default useInput;
