import * as React from "react";
import TableCell from "@material-ui/core/TableCell";
import ComboAnnotationCellRow from "./ComboAnnotationCellRow";

export interface Props {
  variants: Array<string>;
}

const ComboCell = (props: Props) => {
  const content = props.variants.map(variant => {
    return <ComboAnnotationCellRow variant={variant} key={variant} />;
  });
  return <TableCell>{content}</TableCell>;
};

export default ComboCell;
