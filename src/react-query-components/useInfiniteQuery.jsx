import { useTable, useRowSelect } from "react-table";
import { useMemo, useState } from "react";
import CheckRow from "../checkrow";
import { useInfiniteQuery } from "@tanstack/react-query";
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

const InfiniteQueryTable = () => {
  const [posts, setPosts] = useState([]);
  const getPosts = async ({ pageParam = 0 }) => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=9&_page=${pageParam}`
    );
    return data;
  };
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: getPosts,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length : undefined;
      },
      refetchOnWindowFocus: "false",
      onSuccess: (data) => {
        setPosts(data.pages.flat());
      },
    });
  console.log(data?.pages);

  const columns = useMemo(() => column, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: posts }, useRowSelect, (hooks) => {
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

  return (
    <div className="container" style={{ height: "400px", overflow: "auto" }}>
      <InfiniteScroll
        dataLength={posts.length}
        next={() => fetchNextPage()}
        hasMore={hasNextPage}
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
        {isFetchingNextPage
          ? "Loading more"
          : hasNextPage
          ? "Load more"
          : "Nothing to load more"}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteQueryTable;
