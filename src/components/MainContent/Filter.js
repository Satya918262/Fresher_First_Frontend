import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const Filter = ({ filters, handleFilterChange, applyFilters }) => {
  return (
    <div className="filter-container">
      <h5>Filter Students</h5>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            name="name"
            placeholder="Search by Name"
            value={filters.name}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            name="hallTicket"
            placeholder="Hall Ticket Number"
            value={filters.hallTicket}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            name="email"
            placeholder="Email"
            value={filters.email}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="number"
            name="tenthCgpaMin"
            placeholder="Min 10th CGPA"
            value={filters.tenthCgpaMin}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="number"
            name="tenthCgpaMax"
            placeholder="Max 10th CGPA"
            value={filters.tenthCgpaMax}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="number"
            name="interCgpaMin"
            placeholder="Min Inter CGPA"
            value={filters.interCgpaMin}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="number"
            name="interCgpaMax"
            placeholder="Max Inter CGPA"
            value={filters.interCgpaMax}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="number"
            name="degreeCgpaMin"
            placeholder="Min Degree CGPA"
            value={filters.degreeCgpaMin}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="number"
            name="degreeCgpaMax"
            placeholder="Max Degree CGPA"
            value={filters.degreeCgpaMax}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            name="educationGap"
            value={filters.educationGap}
            onChange={handleFilterChange}
          >
            <option value="">Education Gap?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            name="backlogs"
            value={filters.backlogs}
            onChange={handleFilterChange}
          >
            <option value="">Backlogs</option>
            <option value="0">0</option>
            <option value="1-3">1-3</option>
            <option value="4+">4+</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            name="passedOutYear"
            placeholder="Passed Out Year"
            value={filters.passedOutYear}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            name="degreeGroup"
            value={filters.degreeGroup}
            onChange={handleFilterChange}
          >
            <option value="">Select Degree Group</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.Sc">B.Sc</option>
            <option value="B.Com">B.Com</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            name="subgroup"
            value={filters.subgroup}
            onChange={handleFilterChange}
          >
            <option value="">Select Subgroup</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            name="college"
            placeholder="College Name"
            value={filters.college}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>

      <Button variant="primary" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
};

export default Filter;
