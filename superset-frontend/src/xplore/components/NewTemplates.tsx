import React, { useState } from 'react';
//@ts-ignore
import { Panel, Row, DropdownButton, Button, MenuItem } from 'react-bootstrap';

export default function NewTemplates(props = { label: 'untitled' }) {
	const [expanded, setExpanded] = useState(true);
  return (
    <Panel
			className="control-panel-section"
			expanded={expanded}
			onToggle={() => setExpanded(!expanded)}
		>
			<Panel.Heading>
			<Panel.Title>
				<div>
					<span>
						<span onClick={() => setExpanded(!expanded)}>{props.label}</span>{' '}
					</span>
					<i
						className={`float-right fa-lg text-primary expander fa fa-angle-${
							expanded ? 'up' : 'down'
						}`}
						onClick={() => setExpanded(!expanded)}
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
