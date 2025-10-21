import React from "react";
import { render, screen } from "@testing-library/react";
import { CartItem } from "@/app/interfaces/cart";
import Table, { TableColumn } from "./Table";

interface TestData {
  id: number;
  name: string;
  age: number;
}

const columns: TableColumn<TestData>[] = [
  { header: "ID", key: "id", align: "left" },
  { header: "Name", key: "name", align: "center" },
  { 
    header: "Age", 
    key: "age", 
    align: "right",
    render: (item:any) => <span>{item.age} yrs</span>
  },
];

const data: TestData[] = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
];

describe("Table Component", () => {
  it("renders table headers correctly", () => {
    render(<Table columns={columns} data={data} rowKey="id" />);
    
    // Check if headers are rendered
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders table rows correctly", () => {
    render(<Table columns={columns} data={data} rowKey="id" />);
    
    // Check first row values
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("25 yrs")).toBeInTheDocument();

    // Check second row values
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("30 yrs")).toBeInTheDocument();
  });

  it("applies correct alignment classes", () => {
    render(<Table columns={columns} data={data} rowKey="id" />);
    
    const idCell = screen.getByText("1").closest("td");
    const nameCell = screen.getByText("Alice").closest("td");
    const ageCell = screen.getByText("25 yrs").closest("td");

    expect(idCell).toHaveClass("left");
    expect(nameCell).toHaveClass("center");
    expect(ageCell).toHaveClass("right");
  });

  it("applies custom className to cells", () => {
    const customColumns: TableColumn<TestData>[] = [
      { header: "ID", key: "id", className: "custom-id" },
    ];
    render(<Table columns={customColumns} data={data} rowKey="id" />);

    const idCell = screen.getByText("1").closest("td");
    expect(idCell).toHaveClass("custom-id");
  });

  it("renders empty table if data is empty", () => {
    render(<Table columns={columns} data={[]} rowKey="id" />);
    
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});
