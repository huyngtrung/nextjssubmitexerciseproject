CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`clerk_user_id` varchar(255) NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`image_url` text,
	`deleted_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_clerk_user_id_unique` UNIQUE(`clerk_user_id`)
);
