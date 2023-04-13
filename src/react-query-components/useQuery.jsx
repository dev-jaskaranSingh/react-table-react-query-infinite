import { useTable, useRowSelect } from "react-table";
import { useMemo, useState } from "react";
import CheckRow from "../checkrow";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
const column = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Body",
    accessor: "body",
  },
];

const InfiniteScrollTable = () => {
  const [posts, setPosts] = useState([]);
  const getPosts = async ({ page = 1 }) => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=9&_page=${page}`
    );
    return data;
  };
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    onSuccess: (data) => {
      setPosts(data);
    },
  });

  const dataRow = posts;
  const columns = useMemo(() => column, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: dataRow }, useRowSelect, (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <CheckRow {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <CheckRow {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    });
  const fetchMoreData = () => {
    alert("fetching");
  };
  return (
    <div className="container" style={{ overflow: "auto" }}>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore="true"
        height={400}
      >
        <table
          className="table table-info table-hover table-bordered table-striped"
          {...getTableProps}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td key={cell.id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollTable;
