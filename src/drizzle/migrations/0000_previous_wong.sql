CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`clerk_user_id` varchar(255) NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`first_name` text,
	`last_name` text,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`image_url` text,
	`deleted_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_clerk_user_id_unique` UNIQUE(`clerk_user_id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`order` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercise_submissions` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`exercise_id` varchar(255) NOT NULL,
	`ai_result_json` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercise_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercise_progress` (
	`user_id` varchar(255) NOT NULL,
	`exercise_id` varchar(255) NOT NULL,
	`role` enum('SUBMITTED_ON_TIME','SUBMITTED_LATE') NOT NULL DEFAULT 'SUBMITTED_ON_TIME',
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`subject` text NOT NULL,
	`due_date` timestamp,
	`max_score` float,
	`s3_key` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submission_files` (
	`id` varchar(255) NOT NULL,
	`ex_submission_id` varchar(255) NOT NULL,
	`s3_key` text NOT NULL,
	`file_type` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `submission_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercise_classes` (
	`exercise_id` varchar(255) NOT NULL,
	`class_id` varchar(255) NOT NULL,
	`order` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_classes` (
	`user_id` varchar(255) NOT NULL,
	`class_id` varchar(255) NOT NULL,
	`order` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `exercise_submissions` ADD CONSTRAINT `exercise_submissions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exercise_submissions` ADD CONSTRAINT `exercise_submissions_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exercise_progress` ADD CONSTRAINT `exercise_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exercise_progress` ADD CONSTRAINT `exercise_progress_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submission_files` ADD CONSTRAINT `submission_files_ex_submission_id_exercise_submissions_id_fk` FOREIGN KEY (`ex_submission_id`) REFERENCES `exercise_submissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exercise_classes` ADD CONSTRAINT `exercise_classes_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exercise_classes` ADD CONSTRAINT `exercise_classes_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_classes` ADD CONSTRAINT `user_classes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_classes` ADD CONSTRAINT `user_classes_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;