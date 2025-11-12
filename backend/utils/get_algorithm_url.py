import requests
import re

RAW_URL = "https://raw.githubusercontent.com/Daval03/EmbeddedPiBench/embedded_dev/embedded/pi/pi_calculations.c"

def extract_algorithm(funct_name):
    try:
        response = requests.get(RAW_URL, timeout=5)
        response.raise_for_status()
        contenido = response.text.splitlines()

        # Buscar la línea que contiene la definición de la función
        start_index = None
        for i, line in enumerate(contenido):
            if re.search(rf'\b{re.escape(funct_name)}\s*\([^)]*\)\s*{{', line):
                start_index = i
                break

        if start_index is None:
            return None

        # Contar llaves para encontrar el final
        brace_count = 0
        function_lines = []
        for line in contenido[start_index:]:
            function_lines.append(line)
            brace_count += line.count('{')
            brace_count -= line.count('}')
            if brace_count == 0 and '{' in ''.join(function_lines):
                break

        return "\n".join(function_lines).strip()

    except Exception as e:
        print(f"Error al extraer la función: {e}")
        return None


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
