import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="search-bar-modern">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Cari berita..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}
