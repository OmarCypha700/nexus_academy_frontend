"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import axiosInstance from "@/app/lib/axios";

const PAGE_SIZE = 20; // must match REST_FRAMEWORK.PAGE_SIZE in settings.py

export default function StudentsList({ courseId }) {
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const debounceRef = useRef(null);

  const fetchStudents = useCallback(
    async (page, search) => {
      if (!courseId) {
        setStudents([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // H6: the backend now paginates (DRF PageNumberPagination), so this fetches ONE
        // page of students at a time instead of the entire roster in a single request.
        const response = await axiosInstance.get(
          `/instructor/courses/${courseId}/students/`,
          { params: { page: page + 1, search: search || undefined } } // DRF pages are 1-indexed
        );
        const data = response.data;
        // Handles both the paginated shape ({count, results}) and, defensively, a
        // non-paginated array in case this endpoint is ever hit before migrations run.
        if (Array.isArray(data)) {
          setStudents(data);
          setTotalCount(data.length);
        } else {
          setStudents(data.results || []);
          setTotalCount(data.count || 0);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(
          "Failed to load students. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    },
    [courseId]
  );

  useEffect(() => {
    fetchStudents(pageIndex, filterValue);
  }, [pageIndex, fetchStudents]);

  // Debounce the search filter so it doesn't fire a request per keystroke; reset to
  // page 0 whenever the filter changes, since the previous page may no longer exist
  // in the filtered result set.
  const handleFilterChange = (value) => {
    setFilterValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageIndex(0);
      fetchStudents(0, value);
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (error) return <p className="text-red-500 text-center py-12">{error}</p>;

  if (!loading && students.length === 0 && !filterValue) {
    return (
      <div className="w-full border rounded-lg overflow-x-auto whitespace-nowrap">
        <div className="text-center py-12 text-muted-foreground text-sm md:text-base">
          No students enrolled
        </div>
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="w-full border rounded-lg overflow-x-auto whitespace-nowrap">
      <DataTable
        columns={columns}
        data={students}
        pageIndex={pageIndex}
        pageCount={pageCount}
        totalCount={totalCount}
        isLoading={loading}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        onPageChange={setPageIndex}
      />
    </div>
  );
}
