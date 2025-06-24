# Istruzioni

## Pre-requisiti

- Git installato ([Download Git](https://git-scm.com/downloads)) – necessario per scaricare il progetto via `git clone`  
- Docker installato ([Download Docker](https://www.docker.com/)) – necessario per costruire ed eseguire i container  
- Terminale (su macOS) o PowerShell (su Windows)  
- Browser web moderno[^browser]  

## Installazione
###### Command line interface (CLI): 
1) Aprire il terminale (Terminale su macOS, PowerShell o CMD su Windows)
2) Scaricare il progetto da github con il comando `git clone https://github.com/DanielePellati/Progetto_IDS/`
3) Posizionarsi nella cartella del progetto con il comando `cd Progetto_IDS`
4) Posizionarsi nella cartella `Docker` del progetto. Ad esempio:
   - Su macOS/Linux: `cd Progetto_IDS/Docker`
   - Su Windows: `cd Progetto_IDS\Docker`
5) Costruire ed avviare i container: `docker-compose up -d`
6) Dalla cartella `Docker`, spostarsi nella cartella `db` con il comando `cd db`
7) Eseguire il comando `docker exec -i mysql_db mysql -u root -proot progetto_IGS < progetto_IGS.sql`, questo serve a caricare il database.

**Note**: Assicurarsi che Docker Desktop sia in esecuzione prima di avviare i container.

## Test 

Aprire il browser e visitare:
- `http://tassonomie:8080` per l’applicazione
- `http://tassonomie:8081` per phpMyAdmin

## Rimozione

Per rimuovere completamente il progetto, eseguire i seguenti passaggi:

1) Rimuovere i container con il comando `docker-compose down -v`.
2) Posizionarsi nella cartella del progetto:
   - Su macOS/Linux: `cd .../Progetto_IDS`
   - Su Windows: `cd ...\Progetto_IDS`
3) Uscire dalla cartella con `cd ..`.
4) Eliminare definitivamente la cartella `Progetto_IDS` e tutto il suo contenuto con il comando appropriato per il proprio sistema operativo:
   - Su Linux/macOS: `rm -rf Progetto_IDS`
   - Su Windows (Prompt dei comandi - cmd.exe): `rmdir /s /q Progetto_IDS`
   - Su Windows (PowerShell): `Remove-Item -Path Progetto_IDS -Recurse -Force`
> **Attenzione:** questi comandi eliminano la cartella in modo definitivo, senza passare dal Cestino.



# Struttura 

Il progetto è organizzato nelle seguenti cartelle principali:

- `docker/`: contiene i file per la configurazione e l'avvio dei container Docker
	- `db/`: contiene il file da importare per avere il database
- `WWW/`: contiene il codice dell’applicazione web, suddiviso in:
	-  `frontend/`: file HTML, CSS e JavaScript per l’interfaccia utente
	-  `backend/`: script PHP e logica server-side
- `docs/`: documentazione del progetto

[^browser]: Qualsiasi browser aggiornato (es. Chrome, Firefox, Safari, Edge).
