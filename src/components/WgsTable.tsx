import * as React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import GeneCell from "./GeneCell";
import ComboCell from "./ComboCell";
import ComboAnnotationCell from "./ComboAnnotationCell";

export interface Record {
  variants: Array<string>;
  genes: Array<string>;
}
interface Props {
  data: Record[];
  onPageChange: (n: number) => void;
  page: number;
}

const WgsTable = (props: Props) => {
  return (
    <React.Fragment>
      <IconButton
        key="back"
        title="Back a page"
        disabled={props.page <= 0 ? true : false}
        onClick={() => props.onPageChange(-1)}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        key="forward"
        title="forward a page"
        onClick={() => props.onPageChange(1)}
      >
        <ArrowForwardIos />
      </IconButton>
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
    </React.Fragment>
  );
};
export default WgsTable;
