## Pre-requisiti

- Docker installato
- Terminale (su macOS) o PowerShell (su Windows)
- Browser web moderno[^browser]

## Procedimento
###### Command line interface (CLI): 
1) Aprire il terminale (Terminale su macOS, PowerShell o CMD su Windows)  
2) Posizionarsi nella cartella `Docker` del progetto. Ad esempio:
   - Su macOS/Linux: `cd .../Progetto_IDS/Docker`
   - Su Windows: `cd ...\Progetto_IDS\Docker`
3) Costruire ed avviare i container: `docker-compose up --build`

## Test 

Aprire il browser e visitare:
- `http://tassonomie:8080` per l’applicazione PHP
- `http://tassonomie:8081` per phpMyAdmin


**Note**: Assicurarsi che Docker Desktop sia in esecuzione prima di avviare i container.

[^browser]: Qualsiasi browser aggiornato (es. Chrome, Firefox, Safari, Edge).
