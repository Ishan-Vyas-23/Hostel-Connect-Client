import React from "react";

const FilterBar = ({
  category,
  setCategory,
  status,
  setStatus,
  applyFilters,
}) => {
  return (
    <div className="filter-bar">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Electrical">Electrical</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Internet">Internet</option>
        <option value="Mess">Mess</option>
        <option value="Other">Other</option>
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="Submitted">Submitted</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>

      <button className="btn-primary" onClick={applyFilters}>
        Apply
      </button>
    </div>
  );
};

export default FilterBar;
