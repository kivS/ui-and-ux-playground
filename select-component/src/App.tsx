import { useState } from "react";
import {Select} from "./Select";

import type {SelectOption} from "./Select";

const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" },
  { label: "Option 5", value: "option5" },
]

function App() {  
  const [value1, setValue1] = useState<SelectOption[]>([]);
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);
  return (
    <>
      <Select multiple options={options} value={value1} onChange={o => setValue1(o)} />
      <br />
      <Select  options={options} value={value2} onChange={o => setValue2(o)} />
    </>
  )
}

export default App
