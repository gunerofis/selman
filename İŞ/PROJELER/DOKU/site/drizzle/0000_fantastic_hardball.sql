CREATE TABLE `keyword_history` (
	`operation_id` text PRIMARY KEY NOT NULL,
	`image_code` text NOT NULL,
	`revision` integer NOT NULL,
	`before_json` text NOT NULL,
	`after_json` text NOT NULL,
	`actor_id` text NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `keyword_history_image_revision` ON `keyword_history` (`image_code`,`revision`);--> statement-breakpoint
CREATE TABLE `keyword_images` (
	`image_code` text PRIMARY KEY NOT NULL,
	`tags_json` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	`operation_id` text NOT NULL
);
