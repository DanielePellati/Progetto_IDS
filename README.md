# Istruzioni

## Pre-requisiti

- Git installato ([Download Git](https://git-scm.com/downloads)) – necessario per scaricare il progetto via `git clone`  
- Docker installato ([Download Docker](https://www.docker.com/)) – necessario per costruire ed eseguire i container  
- Terminale (su macOS) o PowerShell (su Windows)  
- Browser web moderno[^browser]  

## Procedimento
###### Command line interface (CLI): 
1) Aprire il terminale (Terminale su macOS, PowerShell o CMD su Windows)
2) Scaricare il progetto da github con il comando `git clone https://github.com/DanielePellati/Progetto_IDS/`
3) Posizionarsi nella cartella del progetto con il comando `cd Progetto_IDS`
4) Posizionarsi nella cartella `Docker` del progetto. Ad esempio:
   - Su macOS/Linux: `cd Progetto_IDS/Docker`
   - Su Windows: `cd Progetto_IDS\Docker`
5) Costruire ed avviare i container: `docker-compose up --build`

## Test 

Aprire il browser e visitare:
- `http://tassonomie:8080` per l’applicazione PHP
- `http://tassonomie:8081` per phpMyAdmin


**Note**: Assicurarsi che Docker Desktop sia in esecuzione prima di avviare i container.

# Struttura 

Il progetto è organizzato nelle seguenti cartelle principali:

- `docker/`: contiene i file per la configurazione e l'avvio dei container Docker
- `WWW/`: contiene il codice dell’applicazione web, suddiviso in:
  - `frontend/`: file HTML, CSS e JavaScript per l’interfaccia utente
  - `backend/`: script PHP e logica server-side
- `docs/`: documentazione del progetto

[^browser]: Qualsiasi browser aggiornato (es. Chrome, Firefox, Safari, Edge).

