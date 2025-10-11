import type { MenuItem } from '../../types';
import {Cpu} from 'lucide-react';
interface SidebarProps {
  menuItems: MenuItem[];
  selectedItem: string;
  onItemClick: (itemId: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ menuItems, selectedItem, onItemClick, isOpen }: SidebarProps) {
  return (
    <div className={`
      fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-900 to-purple-900 shadow-2xl z-10
      transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
    `}>
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center">
          <Cpu className="text-white mr-3" size={32} />
          <div>
            <h2 className="font-bold text-white text-lg">Título</h2>
            <p className="text-indigo-300 text-xs">Subtítulo</p>
          </div>
        </div>
      </div>
     
      <div className="p-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-all flex items-center ${
                selectedItem === item.id
                  ? 'bg-white text-indigo-900 shadow-lg'
                  : 'text-white hover:bg-indigo-800'
              }`}
            >
              <IconComponent size={20} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}