import React from 'react';
//@ts-ignore
import { Panel, Row, Tabs, Tab, DropdownButton, Button, MenuItem } from 'react-bootstrap';

import AppButtons from '../components/AppButtons';
import NewTemplates from '../components/NewTemplates';

export default function Aside() {
  return (
    <Row className="col-right">
      <AppButtons />
      <br />
      <div className="scrollbar-container">
        <div className="scrollbar-content">
          <Tabs id="controlSections">
            <Tab eventKey="query" title={"Template"}>
              <NewTemplates label="Welcome" />
            </Tab>
            {/* <Tab eventKey="display" title={"History"}>
            </Tab> */}
          </Tabs>
        </div>
      </div>
    </Row>
  );
}
