import React from 'react';
import '../styles/input.css';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'large', icon, className = '', ...props }, ref) => {
    const sizeClass = `input-${size}`;
    const iconClass = icon ? 'input-with-icon' : '';

    return (
      <div className="input-wrapper">
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${sizeClass} ${iconClass} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;