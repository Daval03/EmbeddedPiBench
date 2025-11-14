import React from 'react';
import { Card, Badge } from 'react-bootstrap';

interface AlgorithmInfo {
  name: string;
  description?: string;
  code: string;
  type: string;
  
}

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo;
  className?: string;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ 
  algorithm, 
  className = '' 
}) => {
  return (
    <Card className={`shadow-sm ${className}`}>
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0 h5">
            {"Algorithm: "}{algorithm.name}{" - Type: "}{algorithm.type}
          </Card.Title>  
          <Badge bg="secondary" className="text-uppercase">{"c"}</Badge>
        </div>
        {algorithm.description && (
          <Card.Text className="text-muted mt-2 mb-0">
            {algorithm.description}
          </Card.Text>
        )}
      </Card.Header>
      
      <Card.Body className="p-0">
        <pre className="m-0 p-3 bg-dark text-light rounded-bottom" 
             style={{ fontSize: '0.9rem', overflowX: 'auto' }}>
          <code>{algorithm.code}</code>
        </pre>
      </Card.Body>
    </Card>
  );
};

export {AlgorithmCard, AlgorithmInfo};