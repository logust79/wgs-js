import * as React from "react";
import TextField, { HelperText, Input } from "@material/react-text-field";
import Radio, { NativeRadioControl } from "@material/react-radio";

interface Cutoff {
  id: string;
  type: "radio" | "text";
  choices: Array<string>;
  helperText: string;
  value: string | number | boolean;
}
interface Cutoffs extends Array<Cutoff> {}
export interface Props {
  onChange: (e: any) => void;
  onSubmit: (e: any) => void;
  cutoffs: Cutoffs;
}

const Form = (props: Props) => {
  const { onChange, onSubmit, cutoffs } = props;
  const content = cutoffs.map(d => {
    switch (d.type) {
      case "text":
        return (
          <div key={d.id}>
            <TextField
              label={d.id}
              helperText={<HelperText>{d.helperText}</HelperText>}
            >
              <Input
                name={d.id}
                value={d.value.toString()}
                onChange={onChange}
              />
            </TextField>
          </div>
        );
      case "radio":
        const radios = d.choices.map(c => {
          <Radio label={c} key={c}>
            <NativeRadioControl
              name={d.id}
              value={c}
              id={c}
              onChange={e => {
                onChange;
              }}
            />
          </Radio>;
        });
        return <div>{radios}</div>;
    }
  });
  return <form onSubmit={onSubmit}>{content}</form>;
};
export default Form;
