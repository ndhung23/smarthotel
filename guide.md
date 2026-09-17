Root (SmartHotel)
npm init -y
npm install -D concurrently

Front-End (Client)
npx create-react-app client
npm i react-router-dom axios clsx tailwind-merge react-icons
npm i -D tailwindcss@3
npx tailwindcss init

Back-End (Server)
mkdir server
npm init -y
npm i express mongoose dotenv cors jsonwebtoken bcryptjs express-rate-limit morgan cloudinary @google/genai


