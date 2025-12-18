import React from 'react';
import '../styles/button.css';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'solid' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'large', children, className = '', ...props }, ref) => {
    const variantClass = `button-${variant}`;
    const sizeClass = `button-${size}`;

    return (
      <button
        ref={ref}
        className={`button ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;