-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Creato il: Giu 11, 2025 alle 15:48
-- Versione del server: 9.2.0
-- Versione PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `progetto_IGS`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `categorie`
--

CREATE TABLE `categorie` (
  `id` int NOT NULL,
  `nome` varchar(128) NOT NULL,
  `id_tassonomia` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `elemento`
--

CREATE TABLE `elemento` (
  `id` int NOT NULL,
  `id_tassonomia` int NOT NULL,
  `id_padre` int DEFAULT NULL,
  `nome` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `elemento`
--

INSERT INTO `elemento` (`id`, `id_tassonomia`, `id_padre`, `nome`) VALUES
(141, 23, NULL, 'Piante'),
(142, 23, NULL, 'vegetale'),
(143, 23, 141, 'Erbacea'),
(144, 23, 141, 'non legnosa'),
(145, 23, 141, 'Arbusto'),
(146, 23, 143, 'Margherita'),
(147, 23, 143, 'daisy'),
(148, 23, 145, 'Rosa'),
(149, 24, NULL, 'Film'),
(150, 24, NULL, 'Pellicola'),
(151, 24, 149, 'Fiction'),
(152, 24, 151, 'Dramma'),
(153, 24, 151, 'Drammatico'),
(154, 24, 151, 'Drama'),
(155, 24, 151, 'Commedia'),
(156, 24, 151, 'Commedy'),
(157, 24, 149, 'Non-Fiction'),
(158, 24, 149, 'Factual'),
(159, 24, 157, 'Documentario'),
(160, 24, 157, 'Biografico'),
(161, 24, 157, 'Biopic');

-- --------------------------------------------------------

--
-- Struttura della tabella `elemento_valore`
--

CREATE TABLE `elemento_valore` (
  `id_valore` int NOT NULL,
  `id_elemento` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `elemento_valore`
--

INSERT INTO `elemento_valore` (`id_valore`, `id_elemento`) VALUES
(82, 141),
(83, 141),
(84, 146),
(85, 148),
(86, 148),
(87, 148),
(88, 151),
(89, 152),
(90, 152),
(91, 155),
(92, 155),
(93, 160),
(94, 160),
(95, 160);

-- --------------------------------------------------------

--
-- Struttura della tabella `nomi_precedenti`
--

CREATE TABLE `nomi_precedenti` (
  `id` int NOT NULL,
  `id_elemento_scaduto` int DEFAULT NULL,
  `nome_precedente` varchar(32) NOT NULL,
  `id_tassonomia` int NOT NULL,
  `data_modifica` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `sinonimi`
--

CREATE TABLE `sinonimi` (
  `principale` int NOT NULL,
  `sinonimo` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `sinonimi`
--

INSERT INTO `sinonimi` (`principale`, `sinonimo`) VALUES
(141, 142),
(143, 144),
(146, 147),
(149, 150),
(152, 153),
(152, 154),
(155, 156),
(157, 158),
(160, 161);

-- --------------------------------------------------------

--
-- Struttura della tabella `tassonomia`
--

CREATE TABLE `tassonomia` (
  `id` int NOT NULL,
  `nome` varchar(32) NOT NULL,
  `descrizione` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `tassonomia`
--

INSERT INTO `tassonomia` (`id`, `nome`, `descrizione`) VALUES
(23, 'Piante da giardino', 'Classificazione delle piante da giardino'),
(24, 'Generici cinematrografici', '');

-- --------------------------------------------------------

--
-- Struttura della tabella `valore`
--

CREATE TABLE `valore` (
  `id` int NOT NULL,
  `valore` varchar(256) NOT NULL,
  `tipo` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `valore`
--

INSERT INTO `valore` (`id`, `valore`, `tipo`) VALUES
(82, 'Da giardino', 0),
(83, '6', 1),
(84, 'Bianco e giallo', 0),
(85, 'Rossa', 0),
(86, 'Rosa', 0),
(87, 'corallo', 0),
(88, 'Narrativa', 0),
(89, 'Dogville - Lars von Trier', 0),
(90, 'Una giornata particolare - Ettore Scola', 0),
(91, 'L\'Appartamento - Billy Wilder', 0),
(92, 'The Holdovers - Alexander Payne', 0),
(93, 'Malcolm X - Spike Lee', 0),
(94, 'A Complete Unknown - James Mangold', 0),
(95, 'Oppenheimer - Christopher Nolan', 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `valori_precedenti`
--

CREATE TABLE `valori_precedenti` (
  `id` int NOT NULL,
  `valore_precedente` varchar(256) NOT NULL,
  `tipo_precedente` int NOT NULL,
  `id_valore_modificato` int NOT NULL,
  `data_modifica` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `voci`
--

CREATE TABLE `voci` (
  `id` int NOT NULL,
  `id_categoria` int NOT NULL,
  `voce` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tassonomia` (`id_tassonomia`);

--
-- Indici per le tabelle `elemento`
--
ALTER TABLE `elemento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_elemento` (`id_tassonomia`),
  ADD KEY `fk_padre` (`id_padre`);

--
-- Indici per le tabelle `elemento_valore`
--
ALTER TABLE `elemento_valore`
  ADD PRIMARY KEY (`id_elemento`,`id_valore`),
  ADD KEY `elemento_valore` (`id_valore`);

--
-- Indici per le tabelle `nomi_precedenti`
--
ALTER TABLE `nomi_precedenti`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scaduti` (`id_elemento_scaduto`),
  ADD KEY `fk_tassonomia_nPrecedenti` (`id_tassonomia`);

--
-- Indici per le tabelle `sinonimi`
--
ALTER TABLE `sinonimi`
  ADD PRIMARY KEY (`principale`,`sinonimo`),
  ADD KEY `fk_sinonimi_sinonimo` (`sinonimo`);

--
-- Indici per le tabelle `tassonomia`
--
ALTER TABLE `tassonomia`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `valore`
--
ALTER TABLE `valore`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `valori_precedenti`
--
ALTER TABLE `valori_precedenti`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `voci`
--
ALTER TABLE `voci`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_voci` (`id_categoria`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT per la tabella `elemento`
--
ALTER TABLE `elemento`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

--
-- AUTO_INCREMENT per la tabella `nomi_precedenti`
--
ALTER TABLE `nomi_precedenti`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT per la tabella `tassonomia`
--
ALTER TABLE `tassonomia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT per la tabella `valore`
--
ALTER TABLE `valore`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT per la tabella `valori_precedenti`
--
ALTER TABLE `valori_precedenti`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `voci`
--
ALTER TABLE `voci`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `categorie`
--
ALTER TABLE `categorie`
  ADD CONSTRAINT `fk_tassonomia` FOREIGN KEY (`id_tassonomia`) REFERENCES `tassonomia` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `elemento`
--
ALTER TABLE `elemento`
  ADD CONSTRAINT `fk_elemento` FOREIGN KEY (`id_tassonomia`) REFERENCES `tassonomia` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_padre` FOREIGN KEY (`id_padre`) REFERENCES `elemento` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `elemento_valore`
--
ALTER TABLE `elemento_valore`
  ADD CONSTRAINT `fk_elemento_valore` FOREIGN KEY (`id_valore`) REFERENCES `valore` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_valore` FOREIGN KEY (`id_valore`) REFERENCES `valore` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_valore_elemento` FOREIGN KEY (`id_elemento`) REFERENCES `elemento` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `nomi_precedenti`
--
ALTER TABLE `nomi_precedenti`
  ADD CONSTRAINT `fk_nomi_precedenti` FOREIGN KEY (`id_elemento_scaduto`) REFERENCES `elemento` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_tassonomia_nPrecedenti` FOREIGN KEY (`id_tassonomia`) REFERENCES `tassonomia` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `sinonimi`
--
ALTER TABLE `sinonimi`
  ADD CONSTRAINT `fk_sinonimi_principale` FOREIGN KEY (`principale`) REFERENCES `elemento` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sinonimi_sinonimo` FOREIGN KEY (`sinonimo`) REFERENCES `elemento` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `voci`
--
ALTER TABLE `voci`
  ADD CONSTRAINT `fk_voci` FOREIGN KEY (`id_categoria`) REFERENCES `categorie` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
