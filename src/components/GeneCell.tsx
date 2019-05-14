import * as React from "react";
import TableCell from "@material-ui/core/TableCell";
import GeneBadge from "./GeneBadge";

export interface Props {
  genes: Array<string>;
  baseUrl: String;
}

const GeneCell = (props: Props) => {
  const content = props.genes.map(gene => {
    return <GeneBadge gene={gene} key={gene} baseUrl={props.baseUrl} />;
  });
  return <TableCell>{content}</TableCell>;
};

export default GeneCell;
