import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, CloseCircleIcon } from 'tdesign-icons-react';
import styles from './styles.less';

interface Props {
  /** 值 */
  value?: string;
  /** onChange事件 */
  onChange?: (value: string) => void;
  /** 按下回车触发onSearch事件 */
  onSearch?: (value: string) => void;
  /** 清除事件 */
  onClear?: () => void;
  /** placeholder */
  placeholder?: string;
}

const SearchBar = (props: Props) => {
  const { value, onChange, onSearch, onClear } = props;
  const [selfValue, setSelfValue] = useState('');
  const inputRef = useRef(null);
  const inputValue = value === undefined ? selfValue : value;

  // onChange
  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange(e.target.value);
    } else {
      setSelfValue(e.target.value);
    }
  };

  // onSearch
  const handleSearch = () => {
    if (typeof onSearch === 'function') {
      onSearch(inputValue);
    }
  };

  // onClear
  const handleClear = () => {
    if (typeof onClear === 'function') {
      onClear();
    } else {
      setSelfValue('');
    }
    if (inputRef.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
  };

  return (
    <div className={styles.mbSearchBar}>
      <div className={styles.mbSearchBarInner}>
        <div className={styles.mbSearchIcon}>
          <SearchIcon
            size="2rem"
            style={{
              color: '#828282',
            }}
          />
        </div>
        <div className={styles.mbSearchBarFormContainer}>
          <form action="javascript: ;" className={styles.mbSearchBarForm}>
            <input
              ref={inputRef}
              type="search"
              placeholder="搜索关键字"
              className={styles.mbSearchBarFormInput}
              value={inputValue}
              onChange={handleChange}
              onKeyPress={(e) => {
                const code = e.charCode || e.which;
                // 回车
                if (code === 13) {
                  handleSearch();
                }
              }}
            />
          </form>
        </div>
        {inputValue.length > 0 && (
          <div className={styles.mbClearIcon} onClick={handleClear}>
            <CloseCircleIcon
              size="2rem"
              style={{
                color: '#828282',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
