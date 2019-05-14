import * as React from "react";
import TableCell from "@material-ui/core/TableCell";
import ComboCellVariantRow from "./ComboCellVariantRow";

export interface Props {
  variants: Array<string>;
  baseUrl: String;
}

const ComboCell = (props: Props) => {
  const content = props.variants.map(variant => {
    return (
      <ComboCellVariantRow
        variant={variant}
        key={variant}
        baseUrl={props.baseUrl}
      />
    );
  });
  return <TableCell>{content}</TableCell>;
};

export default ComboCell;
