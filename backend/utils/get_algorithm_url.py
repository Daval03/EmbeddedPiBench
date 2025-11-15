import requests
import re
import wikipediaapi

RAW_URL = "https://raw.githubusercontent.com/Daval03/EmbeddedPiBench/refs/heads/develop/embedded/pi/pi_calculations.c"
           
def extract_all_algorithm():
    try:
        response = requests.get(RAW_URL, timeout=5)
        response.raise_for_status()
        contenido = response.text.splitlines()

        funciones = {}
        i = 0
        while i < len(contenido):
            line = contenido[i]
            match = re.match(r'^\s*([a-zA-Z_][\w\s\*]+)\s+(\w+)\s*\([^)]*\)\s*\{', line)
            if match:
                nombre_funcion = match.group(2)
                brace_count = 0
                function_lines = []
                for j in range(i, len(contenido)):
                    function_lines.append(contenido[j])
                    brace_count += contenido[j].count('{')
                    brace_count -= contenido[j].count('}')
                    if brace_count == 0 and '{' in ''.join(function_lines):
                        funciones[nombre_funcion] = "\n".join(function_lines).strip()
                        i = j
                        break
            i += 1
        return funciones

    except Exception as e:
        print(f"Error al extraer funciones: {e}")
        return {}
