import * as React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import "../styles/CarrierModal.css";

export interface Props {
  open: boolean;
  carriers: Array<string>;
  handleClose: () => void;
}
const CarrierModal = (props: Props) => {
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.handleClose}
    >
      <div className="modal">
        <Typography variant="h6" id="modal-title">
          Carriers
        </Typography>
        <Typography variant="subtitle1" id="simple-modal-description">
          <ul>
            {props.carriers.map(d => {
              return <li key={d}>{d}</li>;
            })}
          </ul>
        </Typography>
      </div>
    </Modal>
  );
};

export default CarrierModal;
