FROM node:20-alpine
WORKDIR /app
COPY package.json server.js index.html app.html auth.html admin.html magic.html manifest.json sw.js README.md .env.example ./
COPY *.js *.png ./
COPY INTELLIGENCE-REA.md PRODUCTION_READINESS.md db ./
RUN mkdir -p /app/data
ENV PORT=4173
ENV DATA_FILE=/app/data/data.json
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||4173)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node","server.js"]
