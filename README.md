# Biblioteca de prestación de libros (Nextjs, TypeScript, Azle)

Este es un proyecto realizado para el bootcamp de Azle con ICP 

## Run Locally

Clona el proyecto 

```bash
  git clone https://github.com/Yamikzex/libreria-azle-icp.git
```

Ve a la dirección del proyecto

```bash
  cd libreria-azle-icp
```

Instalar dependencias:

```bash
npm install
```

Crear un .env archivo:

```bash
# Create .env file
cp frontend/.env-example frontend/.env
```

Iniciar una replica ICP local:    

`dfx start --background --clean`

Obtener tus ids de los canisters:

```bash
# Create canisters
dfx canister create --all

# Get backend canister id
dfx canister id backend

# Get internet-identity canister id
dfx canister id internet-identity
```

En tu archivo .env veras algo similar a esto:

```bash
# Replace BACKEND_CANISTER_ID with your backend canister id
NEXT_PUBLIC_API_REST_URL=http://BACKEND_CANISTER_ID.localshot:4943
# Replace INTERNET_IDENTITY_CANISTER_ID with your internet-identity canister id
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://INTERNET_IDENTITY_CANISTER_ID.localshot:4943
```

Despliega tus canisters:

`dfx deploy`

Cuando obtengas tus resultados se vera como los siguientes (Los ids podrian ser diferentes a los tuyos):

```bash
URLs:
  Frontend canister via browser
    frontend: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai
  Backend canister via Candid interface:
    backend: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
```

Ingresa la URL del Frontend en tu navegador web para ver la aplicación en acción agregandole "libreria" antes del "?" o tambien puedes poner http://ID_CANISTER_FRONTEND.localhost:4943/libreria.

## Prueba el Frontend sin Implementar en la Réplica de ICP

Comenta la siguiente línea en el archivo`frontend/next.config.mjs`:

```javascript
// output: "export",
```

Luego, navega hasta el directorio`frontend`:

`cd frontend`

Ejecuta el siguiente script:

`npm run dev`

Esto permitirá probar el frontend sin la necesidad de implementar en la Réplica de IC