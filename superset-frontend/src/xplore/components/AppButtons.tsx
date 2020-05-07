import React from 'react';
//@ts-ignore
import { Row, DropdownButton, Button, MenuItem } from 'react-bootstrap';

export default function AppButtons() {
  return (
    <div className="app-buttons">
      <Button bsSize="sm" bsStyle="primary">Button1</Button>
      <Button bsSize="sm" bsStyle="default">Button2</Button>
      <DropdownButton
        bsStyle="default"
        bsSize="sm"
        title="Action"
        // key={i}
        id={`dropdown-right-pane-1`}
      >
        <MenuItem eventKey="1">Action</MenuItem>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3">Active Item</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Separated link</MenuItem>
      </DropdownButton>
    </div>
  );
}
