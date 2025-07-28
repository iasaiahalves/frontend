import { Button as BootstrapButton, Spinner } from "react-bootstrap";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <BootstrapButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      type={type}
      className={className}
      {...props}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {children}
    </BootstrapButton>
  );
};

export default Button;
