import { Card as BootstrapCard } from "react-bootstrap";

const Card = ({
  title,
  children,
  className = "",
  header,
  footer,
  ...props
}) => {
  return (
    <BootstrapCard className={className} {...props}>
      {header && <BootstrapCard.Header>{header}</BootstrapCard.Header>}
      <BootstrapCard.Body>
        {title && <BootstrapCard.Title>{title}</BootstrapCard.Title>}
        {children}
      </BootstrapCard.Body>
      {footer && <BootstrapCard.Footer>{footer}</BootstrapCard.Footer>}
    </BootstrapCard>
  );
};

export default Card;
