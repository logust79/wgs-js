import * as React from "react";
import TextField, { HelperText, Input } from "@material/react-text-field";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Filter, SortKey } from "../FormParameters";
import "../styles/Form.css";

export interface Props {
  filters: Filter[];
  onChange?: (e: any) => void;
  onSubmit?: (e: any) => void;
  skip: number;
  limit: number;
  sortKey: SortKey;
}

const Form = (props: Props) => {
  const { onChange, onSubmit, filters, sortKey } = props;
  const content = filters.map(d => {
    d.value = d.value || d.default;
    switch (d.type) {
      case "text":
        return (
          <React.Fragment key={d.name}>
            <div className="Form">
              <TextField
                label={d.name}
                helperText={<HelperText>{d.helperText}</HelperText>}
              >
                <Input
                  name={d.key}
                  value={d.value ? d.value.toString() : ""}
                  onChange={onChange}
                />
              </TextField>
            </div>
            <Divider light />
          </React.Fragment>
        );
      case "checkbox":
        const checkboxes = d.choices.map(c => {
          return (
            <FormControlLabel
              key={c.label}
              name={d.key}
              control={
                <Checkbox
                  checked={c.checked}
                  onChange={onChange}
                  value={c.value}
                  color="primary"
                />
              }
              label={c.label}
            />
          );
        });
        return (
          <React.Fragment key={d.name}>
            <div className="Form">
              <FormControl>
                <FormLabel>{d.name}</FormLabel>
                {checkboxes}
              </FormControl>
            </div>
            <Divider light />
          </React.Fragment>
        );
      default:
        return;
    }
  });
  const sortKeyGroup = (
    <div className="Form bottom" key="sortKey">
      <FormControl>
        <FormLabel>Sort on</FormLabel>
        <RadioGroup
          aria-label="Sort Key"
          name="sortKey"
          value={sortKey.value}
          onChange={onChange}
        >
          {sortKey.choices.map(d => {
            return (
              <FormControlLabel
                key={d.label}
                value={d.value}
                control={<Radio />}
                label={d.label}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
  return (
    <form onSubmit={onSubmit}>
      <Button color="primary" type="submit" variant="contained">
        Submit
      </Button>
      {content} {sortKeyGroup}
    </form>
  );
};
export default Form;
