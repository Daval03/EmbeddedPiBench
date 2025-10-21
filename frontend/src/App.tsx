import { useEffect, useState } from "react";

type Status = "checking" | "ok" | "warning" | "error";

interface ServerDetails {
  service?: string;
  timestamp?: number;
  algorithms_available?: number;
}

export default function App() {
  const [flaskStatus, setFlaskStatus] = useState<Status>("checking");
  const [serverCStatus, setServerCStatus] = useState<Status>("checking");
  const [message, setMessage] = useState<string>("Verificando estado de los servidores...");
  const [serverCDetails, setServerCDetails] = useState<ServerDetails | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkServers = async () => {
      try {
        // Paso 1️⃣ — Verificar Flask
        const flaskRes = await fetch("http://127.0.0.1:5000/api/health");
        
        if (!flaskRes.ok) {
          setFlaskStatus("error");
          setServerCStatus("error");
          setMessage("🔴 Servidor Flask no responde");
          return;
        }

        const flaskData = await flaskRes.json();
        
        if (flaskData.status === "ok") {
          setFlaskStatus("ok");
          setMessage("✅ Flask activo, verificando servidor C...");
        } else {
          setFlaskStatus("warning");
          setMessage("⚠️ Flask respondió con estado inesperado");
          return;
        }

        // Paso 2️⃣ — Verificar Servidor C a través de Flask
        const cRes = await fetch("http://127.0.0.1:5000/api/check-server-c");
        const cData = await cRes.json();

        if (cData.server_c_status === "ok") {
          setServerCStatus("ok");
          setServerCDetails(cData.details);
          setMessage("🟢 Ambos servidores están activos y funcionando correctamente");
        } else if (cData.server_c_status === "timeout") {
          setServerCStatus("warning");
          setMessage("🟠 Flask activo, pero servidor C no responde (timeout)");
        } else if (cData.server_c_status === "unreachable") {
          setServerCStatus("error");
          setMessage("🔴 Flask activo, pero no puede conectar con servidor C");
        } else {
          setServerCStatus("warning");
          setMessage(`🟠 Flask activo, servidor C: ${cData.error || 'estado desconocido'}`);
        }

        setLastCheck(new Date());

      } catch (error) {
        console.error("Error al verificar servidores:", error);
        setFlaskStatus("error");
        setServerCStatus("error");
        setMessage("🔴 Error al conectar con el servidor Flask");
      }
    };

    // Verificar inmediatamente al cargar
    checkServers();

    // Luego repetir cada 30 segundos
    const interval = setInterval(checkServers, 1000);

    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (flaskStatus === "error") return "bg-red-500";
    if (flaskStatus === "ok" && serverCStatus === "ok") return "bg-green-500";
    if (flaskStatus === "ok" && serverCStatus !== "ok") return "bg-yellow-500";
    return "bg-gray-400 animate-pulse";
  };

  const getStatusEmoji = (status: Status) => {
    switch(status) {
      case "ok": return "🟢";
      case "error": return "🔴";
      case "warning": return "🟠";
      case "checking": return "⏳";
      default: return "⚪";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-semibold mb-6">Estado del Sistema</h1>
      
      <div className={`rounded-2xl shadow-lg px-8 py-6 ${getColor()} text-white transition-all max-w-2xl`}>
        <p className="text-lg font-medium">{message}</p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Detalles de Servidores</h2>
        
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium text-gray-700">Flask Proxy:</span>
            <span className="text-lg">{getStatusEmoji(flaskStatus)} {flaskStatus.toUpperCase()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium text-gray-700">Servidor C:</span>
            <span className="text-lg">{getStatusEmoji(serverCStatus)} {serverCStatus.toUpperCase()}</span>
          </div>

          {serverCDetails && serverCStatus === "ok" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800 mb-2">Información del Servidor C</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Servicio:</strong> {serverCDetails.service}</p>
                <p><strong>Algoritmos disponibles:</strong> {serverCDetails.algorithms_available}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {lastCheck && (
        <p className="mt-6 text-gray-500 text-sm">
          Última verificación: {lastCheck.toLocaleTimeString()}
        </p>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Próxima verificación automática en 30 segundos
      </div>
    </div>
  );
}