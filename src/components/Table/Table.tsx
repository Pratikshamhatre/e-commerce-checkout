import React from "react";
import styles from "./Table.module.scss";

export type Alignment = "left" | "center" | "right";

export interface TableColumn<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
  align?: Alignment;
  className?: string;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T;
  className?: string;
}

function Table<T>({ columns, data, rowKey, className = "" }: TableProps<T>) {
  return (
    <div className={className}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`${col.align ? styles[col.align] : styles.left}`}
                style={{ width: col.width || "auto" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={String(item[rowKey])}>
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`${col.align ? styles[col.align] : styles.left} ${
                    col.className || ""
                  }`}
                >
                  {col.render
                    ? col.render(item)
                    : (item[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function memoizeGeneric<T>(component: T): T {
  return React.memo(component as any) as unknown as T;
}

export default memoizeGeneric(Table);
