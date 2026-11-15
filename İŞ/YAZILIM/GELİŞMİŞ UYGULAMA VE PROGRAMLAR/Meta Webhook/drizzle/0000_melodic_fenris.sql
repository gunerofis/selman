CREATE TABLE `meta_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`digest` text NOT NULL,
	`object` text NOT NULL,
	`account_id` text NOT NULL,
	`fields` text NOT NULL,
	`event_time` integer NOT NULL,
	`received_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meta_notifications_digest_unique` ON `meta_notifications` (`digest`);