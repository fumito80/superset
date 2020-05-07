import React from 'react';
//@ts-ignore
import { Panel, Row, DropdownButton, Button, MenuItem } from 'react-bootstrap';

function toggleExpand() {
	// this.setState({ expanded: !this.state.expanded });
}

export default function NewTemplates(props = { label: 'untitled', expanded: true }) {
  return (
    <Panel
			className="control-panel-section"
			expanded={props.expanded}
			onToggle={toggleExpand}
		>
			<Panel.Heading>
			<Panel.Title>
				<div>
					<span>
						<span onClick={toggleExpand}>{props.label}</span>{' '}
					</span>
					<i
						className={`float-right fa-lg text-primary expander fa fa-angle-${
							props.expanded ? 'up' : 'down'
						}`}
						onClick={toggleExpand}
					/>
				</div>
			</Panel.Title>
			</Panel.Heading>
			<Panel.Collapse>
			<Panel.Body>{"a"}</Panel.Body>
			</Panel.Collapse>
    </Panel>
	);
}
