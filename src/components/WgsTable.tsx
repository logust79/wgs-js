import * as React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import GeneCell from "./GeneCell";
import ComboCell from "./ComboCell";
import ComboAnnotationCell from "./ComboAnnotationCell";

interface Record {
  variants: Array<string>;
  genes: Array<string>;
}
export interface Props {
  data: Record[];
}

const WgsTable = (props: Props) => {
  return (
    <Table className="wgsTable">
      <TableHead>
        <TableRow>
          <TableCell key="variant">Variant(s)</TableCell>
          <TableCell key="annotation">Annotation</TableCell>
          <TableCell key="gene" align="right">
            Gene
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data.map(row => (
          <TableRow key={row.variants.join(",")}>
            <ComboCell variants={row.variants} />
            <ComboAnnotationCell variants={row.variants} />
            <GeneCell genes={row.genes} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default WgsTable;
