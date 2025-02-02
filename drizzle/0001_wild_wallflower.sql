CREATE TABLE `data` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255),
	CONSTRAINT `data_id` PRIMARY KEY(`id`),
	CONSTRAINT `data_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
DROP TABLE `users`;