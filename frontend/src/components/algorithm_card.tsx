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
      <Card.Header className="bg-light border-bottom">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <Card.Title className="mb-1 h5 fw-bold text-dark">
              {algorithm.name}
            </Card.Title>
            
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge 
                bg="purple-400" 
                className="px-2 py-1"
                style={{ fontSize: '0.75rem' }}
              >
                Type: {algorithm.type}
              </Badge>
              
              <Badge 
                bg="secondary" 
                className="px-2 py-1"
                style={{ fontSize: '0.75rem' }}
              >
                Language: C
              </Badge>
            </div>
          </div>
        </div>

        {algorithm.description && (
          <Card.Text className="text-dark mt-2 mb-0 pt-2 border-top">
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