import React from 'react';
import { Github, Mail, Heart } from 'lucide-react';
import { FooterProps} from '../types/types';

const Footer: React.FC<FooterProps> = ({ companyName, year }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                π
              </div>
              <span className="font-bold text-white">Pi Calculator</span>
            </div>
            <p className="text-sm text-slate-500">
              Comparación de algoritmos para el cálculo de π ejecutándose en Raspberry Pi 4.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-purple-400 transition no-underline text-slate-500">
                  Home
                </a>
              </li>
              <li>
                <a href="/algorithms" className="hover:text-purple-400 transition no-underline text-slate-500">
                  Algoritmos
                </a>
              </li>
              <li>
                <a href="/compare" className="hover:text-purple-400 transition no-underline text-slate-500">
                  Comparativa
                </a>
              </li>
              <li>
                <a href="/math" className="hover:text-purple-400 transition no-underline text-slate-500">
                  Matemáticas
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Stack Tecnológico</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>• Raspberry Pi 4</li>
              <li>• C (long double)</li>
              <li>• React + TypeScript</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            © {year} {companyName}. Hecho con{' '}
            <Heart className="inline w-4 h-4 text-red-500" fill="currentColor" />{' '}
            para la ciencia de la computación.
          </div>
          
          <div className="flex gap-4">
            <a 
              href="https://github.com/Daval03" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="mailto:cambroneroaldo03@gmail.com"
              className="hover:text-purple-400 transition"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;