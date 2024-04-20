import React from 'react';

export default function IconBtn({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`btn ${outline ? 'btn-outline-warning' : 'btn-warning'} ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline && 'text-warning'}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}
