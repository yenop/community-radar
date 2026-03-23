CREATE DATABASE IF NOT EXISTS community_radar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE community_radar;

CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  telegram_chat_id VARCHAR(100),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sources (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  type   ENUM('reddit','facebook','discord','forum') NOT NULL,
  name   VARCHAR(255) NOT NULL,
  url    VARCHAR(500) NOT NULL,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS criteria (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  user_id               INT NOT NULL,
  label                 VARCHAR(255) NOT NULL,
  description_naturelle TEXT NOT NULL,
  active                TINYINT(1) DEFAULT 1,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts_detected (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  source_id        INT NOT NULL,
  criteria_id      INT NOT NULL,
  title            VARCHAR(500),
  content          TEXT,
  url              VARCHAR(1000),
  score_pertinence FLOAT DEFAULT 0,
  notified         TINYINT(1) DEFAULT 0,
  detected_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id)   REFERENCES sources(id)  ON DELETE CASCADE,
  FOREIGN KEY (criteria_id) REFERENCES criteria(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  channel ENUM('telegram','email') NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts_detected(id) ON DELETE CASCADE
);

INSERT INTO sources (type, name, url) VALUES
  ('reddit','r/entrepreneur','https://www.reddit.com/r/entrepreneur'),
  ('reddit','r/SaaS','https://www.reddit.com/r/SaaS'),
  ('reddit','r/smallbusiness','https://www.reddit.com/r/smallbusiness'),
  ('reddit','r/startups','https://www.reddit.com/r/startups'),
  ('reddit','r/artificial','https://www.reddit.com/r/artificial');
