import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { SkeletonTable } from '../LoadingStates/Skeleton';
import { NoData } from '../EmptyStates/EmptyState';
import ModernButton from '../buttons/ModernButton';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  className = '',
  onRowClick = null,
  actions = null,
  emptyMessage = 'No data available',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = [...data];

    // Apply search filter
    if (searchable && searchTerm) {
      filteredData = filteredData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortable && sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig, searchable, sortable]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = pagination ? processedData.slice(startIndex, endIndex) : processedData;

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (!sortable) return null;

    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon className="w-4 h-4" />
      ) : (
        <ChevronDownIcon className="w-4 h-4" />
      );
    }
    return <ChevronUpIcon className="w-4 h-4 text-gray-300" />;
  };

  // Render cell content
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }

    if (column.type === 'badge') {
      const value = item[column.key];
      const badgeClasses = {
        success: 'badge badge-success',
        warning: 'badge badge-warning',
        error: 'badge badge-error',
        info: 'badge badge-info',
      };
      return (
        <span className={badgeClasses[value] || badgeClasses.info}>
          {value}
        </span>
      );
    }

    if (column.type === 'date') {
      return new Date(item[column.key]).toLocaleDateString();
    }

    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(item[column.key]);
    }

    return item[column.key];
  };

  if (loading) {
    return <SkeletonTable rows={5} columns={columns.length} />;
  }

  if (!data.length) {
    return (
      <div className="card">
        <div className="card-body">
          <NoData 
            title="No Data Available"
            description={emptyMessage}
            action={actions}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Search and Actions Bar */}
      {(searchable || actions) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`table-header-cell ${
                      sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                    }`}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {sortable && column.sortable !== false && renderSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {currentData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`table-row ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="table-cell">
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="card-footer">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {startIndex + 1} to {Math.min(endIndex, processedData.length)} of {processedData.length} results
              </div>
              
              <div className="flex items-center space-x-2">
                <ModernButton
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  Previous
                </ModernButton>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                        page === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <ModernButton
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4" />
                </ModernButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    render: PropTypes.func,
  })),
  loading: PropTypes.bool,
  searchable: PropTypes.bool,
  sortable: PropTypes.bool,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  className: PropTypes.string,
  onRowClick: PropTypes.func,
  actions: PropTypes.node,
  emptyMessage: PropTypes.string,
};

export default DataTable;
