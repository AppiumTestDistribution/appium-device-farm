import { useState, useEffect, useRef } from 'react';
import { Filter, Clock, ChevronDown, X } from 'lucide-react';

interface FilterCondition {
  column: string;
  operator: string;
  value: string;
}

interface FilterData {
  testName: string;
  platform: string;
  device: string;
  status: string;
}

interface TableFilterProps {
  columns: { key: string; label: string }[];
  data: FilterData[];
  onFilterChange: (filters: FilterCondition[]) => void;
}

const OPERATORS = ['=', '!=', 'contains', 'starts with', 'ends with'];

export default function TableFilter({ columns, data, onFilterChange }: TableFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('24 hours');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [uniqueValues, setUniqueValues] = useState<Record<string, Set<string>>>({});
  const [showValueDropdown, setShowValueDropdown] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const values: Record<string, Set<string>> = {};
    columns.forEach(({ key }) => {
      values[key] = new Set(
        data
          .map((item) => {
            const value = item[key as keyof FilterData];
            return value || '';
          })
          .filter((value) => value !== '')
          .sort(),
      );
    });
    setUniqueValues(values);
  }, [data, columns]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowValueDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddFilter = () => {
    const newFilter = { column: columns[0].key, operator: '=', value: '' };
    setFilters((prevFilters) => [...prevFilters, newFilter]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters((prevFilters) => {
      const newFilters = prevFilters.filter((_, i) => i !== index);
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleFilterChange = (index: number, field: keyof FilterCondition, value: string) => {
    setFilters((prevFilters) => {
      const newFilters = prevFilters.map((filter, i) => {
        if (i === index) {
          // If changing column, reset the value
          if (field === 'column') {
            return { ...filter, [field]: value, value: '' };
          }
          return { ...filter, [field]: value };
        }
        return filter;
      });
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="relative min-w-[120px]" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-[38px] w-full flex items-center gap-1.5 px-3 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700"
      >
        <Filter className="w-3.5 h-3.5" />
        Filter {filters.length > 0 && `(${filters.length})`}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 w-[600px] p-3 mt-1 bg-gray-800 border border-gray-700 shadow-lg">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-1.5 mb-1.5">
              <select
                value={filter.column}
                onChange={(e) => handleFilterChange(index, 'column', e.target.value)}
                className="px-2 py-1.5 bg-gray-900 border border-gray-700 text-sm text-gray-300 min-w-[140px]"
              >
                {columns.map((column) => (
                  <option key={column.key} value={column.key}>
                    {column.label}
                  </option>
                ))}
              </select>
              <select
                value={filter.operator}
                onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                className="px-2 py-1.5 bg-gray-900 border border-gray-700 text-sm text-gray-300 min-w-[140px]"
              >
                {OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                  onFocus={() => setShowValueDropdown(index)}
                  className="w-full px-2 py-1.5 bg-gray-900 border border-gray-700 text-sm text-gray-300"
                  placeholder="Value"
                />
                {showValueDropdown === index &&
                  uniqueValues[filter.column] &&
                  uniqueValues[filter.column].size > 0 && (
                    <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-gray-900 border border-gray-700 shadow-lg z-50">
                      {Array.from(uniqueValues[filter.column]).map((value) => (
                        <button
                          key={value}
                          className="w-full px-2 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-800"
                          onClick={() => {
                            handleFilterChange(index, 'value', value);
                            setShowValueDropdown(null);
                          }}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              <button
                onClick={() => handleRemoveFilter(index)}
                className="p-1.5 text-gray-400 hover:text-gray-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddFilter}
            className="mt-2 px-3 py-1.5 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600"
          >
            Add filter
          </button>
        </div>
      )}
    </div>
  );
}
