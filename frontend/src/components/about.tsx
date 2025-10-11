import { Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Sobre el Proyecto</h1>
        <p className="text-gray-600">Información adicional y detalles técnicos</p>
      </div>

      {/* Tarjeta Principal */}
      <AboutHeader />
      
      {/* Sección de Objetivos */}
      <ObjectivesSection />
      
      {/* Sección Adicional */}
      <AdditionalInfoSection />
    </div>
  );
}

// Componente para el Header de About
function AboutHeader() {
  const specifications = [
    { label: 'Especificación 1', value: 'Valor 1' },
    { label: 'Especificación 2', value: 'Valor 2' },
    { label: 'Especificación 3', value: 'Valor 3' },
    { label: 'Especificación 4', value: 'Valor 4' },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
      <div className="flex items-center mb-6">
        <Cpu size={48} className="mr-4" />
        <div>
          <h2 className="text-3xl font-bold">Título Principal</h2>
          <p className="opacity-90">Subtítulo descriptivo</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specifications.map((spec, index) => (
          <SpecificationCard key={index} label={spec.label} value={spec.value} />
        ))}
      </div>
    </div>
  );
}

// Componente para tarjeta de especificación
interface SpecificationCardProps {
  label: string;
  value: string;
}

function SpecificationCard({ label, value }: SpecificationCardProps) {
  return (
    <div className="bg-white bg-opacity-20 rounded p-4 backdrop-blur-sm">
      <p className="text-sm opacity-75 mb-1">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

// Componente para la sección de objetivos
function ObjectivesSection() {
  const objectives = [
    'Objetivo o característica 1',
    'Objetivo o característica 2', 
    'Objetivo o característica 3',
    'Objetivo o característica 4',
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Objetivos / Características</h3>
      <ul className="space-y-3 text-gray-700">
        {objectives.map((objective, index) => (
          <li key={index} className="flex items-start">
            <span className="text-indigo-600 font-bold mr-3">{index + 1}.</span>
            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Componente para información adicional
function AdditionalInfoSection() {
  const aspects = [
    {
      title: 'Aspecto 1',
      description: 'Descripción del aspecto 1',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900'
    },
    {
      title: 'Aspecto 2',
      description: 'Descripción del aspecto 2',
      bgColor: 'bg-green-50', 
      textColor: 'text-green-900'
    },
    {
      title: 'Aspecto 3',
      description: 'Descripción del aspecto 3',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900'
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Información Adicional</h3>
      <p className="text-gray-700 mb-4">
        Descripción o contexto adicional del proyecto...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aspects.map((aspect, index) => (
          <AspectCard key={index} {...aspect} />
        ))}
      </div>
    </div>
  );
}

// Componente para tarjeta de aspecto
interface AspectCardProps {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

function AspectCard({ title, description, bgColor, textColor }: AspectCardProps) {
  return (
    <div className={`${bgColor} rounded p-4`}>
      <h4 className={`font-bold ${textColor} mb-2`}>{title}</h4>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}