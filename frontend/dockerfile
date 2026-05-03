# Usamos la versión 1.2 (mayor compatibilidad) de la imagen oficial de Bun
FROM oven/bun:1.2-slim

WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json bun.lock* ./

# Instalamos dependencias (esto crea node_modules dentro de la imagen)
RUN bun install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Usamos 'bun x' para asegurar que encuentre vite aunque no esté en el PATH global
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]